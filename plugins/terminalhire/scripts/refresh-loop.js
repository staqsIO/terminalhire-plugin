#!/usr/bin/env node
/**
 * refresh-loop.js — terminalhire monitor: keeps the job match cache fresh.
 *
 * Cross-platform port of refresh-loop.sh. The .sh launched via `bash …`, which
 * stock Windows PowerShell has no `bash` for, so the SessionStart monitor spawn
 * silently failed on Windows → the spinner cache was never backfilled → an empty
 * spinner forever. This is plain Node (invoked as `node refresh-loop.js <root>`),
 * so it runs identically on macOS, Linux, and Windows.
 *
 * Behavior (preserved EXACTLY from the .sh):
 *   • Runs the plugin-bundled engine's `refresh` once immediately, then sleeps
 *     600s (TERMINALHIRE_REFRESH_INTERVAL override, in seconds) and repeats.
 *   • Fail-closed: any error in a refresh tick is silently ignored; the loop
 *     continues.
 *   • Invokes the engine by ABSOLUTE path (never the bare `terminalhire` on
 *     PATH) so the monitor always runs the engine shipped with THIS plugin
 *     version — immune to a stale npm-global install shadowing it. Plugin root
 *     comes from argv[2] (passed by the monitor command) and falls back to this
 *     script's own location so it works even if CLAUDE_PLUGIN_ROOT is unset.
 *
 * Singleton guard (the pgrep reaper, ported without pgrep — not on Windows):
 *   Claude Code spawns a monitor per session but they never exited on session
 *   end, so old-version monitors piled up (one per plugin version ever installed)
 *   and RACED on the single shared ~/.terminalhire/index-cache.json — an ancient
 *   bundled engine clobbering fields (e.g. unreadChat) the current one wrote, so
 *   the statusline badge went stale at random (13 zombie monitors were once live).
 *   Cross-platform fix: a PID lockfile under the terminalhire dir. On startup we
 *   read it and check the recorded PID's liveness with `process.kill(pid, 0)`:
 *     • a LIVE owner → another monitor is already running → we exit(0) (skip), so
 *       only ONE monitor is ever looping;
 *     • a STALE owner (dead PID) or no lockfile → we take over (reap the zombie's
 *       claim) by writing our own PID and running the loop.
 *   On clean exit (SIGTERM/SIGINT) we release the lock (unlink if it's ours), so
 *   the next session's monitor can acquire it — newest wins across restarts.
 */

'use strict';

const { spawnSync, spawn } = require('node:child_process');
const http = require('node:http');
const { readFileSync, writeFileSync, mkdirSync, unlinkSync } = require('node:fs');
const { join, dirname } = require('node:path');
const { homedir } = require('node:os');

const PLUGIN_ROOT = process.argv[2] || join(dirname(__filename), '..');
const DISPATCH = join(PLUGIN_ROOT, 'dist', 'bin', 'jpi-dispatch.js');

// Seconds — matches the .sh SLEEP_INTERVAL default of 600.
const SLEEP_SECONDS = Number(process.env.TERMINALHIRE_REFRESH_INTERVAL) || 600;

// TERMINALHIRE_DIR override mirrors the CLI (spinner.js / jpi-refresh.js) so the
// lock lives alongside the shared cache — and so tests can isolate it.
const TH_DIR = process.env.TERMINALHIRE_DIR || join(homedir(), '.terminalhire');
const LOCK_FILE = join(TH_DIR, 'refresh-loop.pid');

// One-shot hook for tests / manual single ticks. Unset in production ⇒ the loop
// runs forever exactly like the .sh; when set we run ONE tick and exit(0).
const RUN_ONCE = !!process.env.TERMINALHIRE_REFRESH_ONCE;

// The lock is an OWNER-IDENTITY marker, not a bare PID. A bare PID alone can't
// tell a still-running monitor from an unrelated process that recycled the dead
// monitor's PID → the "zero monitors" hole (every new monitor sees the reused PID
// as live and skips forever). The tag makes a lock we DIDN'T write (legacy bare-int,
// corrupt, or foreign) unrecognizable ⇒ reclaimable, so only OUR own live marker
// blocks a new monitor.
const OWNER_TAG = 'terminalhire-refresh';

/** True if `pid` is a live process. EPERM ⇒ it exists but is owned by another user. */
function isAlive(pid) {
  if (!pid || pid === process.pid) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (err) {
    return err && err.code === 'EPERM';
  }
}

/** Parse the lock file into a valid owner marker, or null (missing/corrupt/legacy/foreign). */
function readOwner() {
  try {
    const marker = JSON.parse(readFileSync(LOCK_FILE, 'utf8'));
    if (marker && marker.tag === OWNER_TAG && Number.isInteger(marker.pid)) return marker;
  } catch {
    /* missing, corrupt JSON, or a legacy bare-int lock → not a recognizable owner */
  }
  return null;
}

/**
 * HEARTBEAT (closes the 2026-07-01 accepted PID-reuse residual): the owner
 * rewrites its marker with a fresh `lastBeat` every tick, so a marker whose
 * beat is older than 3 loop intervals is stale EVEN IF its PID reads alive —
 * that's exactly the kill -9 + PID-wraparound case (an unrelated live process
 * recycled the dead monitor's pid) that used to hold "zero monitors" forever.
 * 3× the interval tolerates one slow tick (beat cadence = interval + tick
 * duration under the non-overlapping recursive setTimeout) without expiring a
 * legitimately long-lived monitor the way a plain startedAt TTL would.
 *
 * COMPAT: markers written by pre-heartbeat versions carry no `lastBeat` and
 * are never rewritten — for those, keep pure PID-liveness semantics rather
 * than declaring every old-version live monitor stale (which would double-run
 * it). Old markers age out as monitors restart on plugin update.
 */
const STALE_BEAT_MS = 3 * SLEEP_SECONDS * 1000;

function markerIsStale(marker) {
  return typeof marker.lastBeat === 'number' && Date.now() - marker.lastBeat > STALE_BEAT_MS;
}

/**
 * True ONLY if the lock holds a valid terminalhire-refresh marker whose PID is
 * live AND whose heartbeat (when present) is fresh. A dead PID, a stale beat,
 * or any lock that isn't our marker (legacy bare-int, corrupt, foreign file
 * whose tag ≠ OWNER_TAG) → not a live owner ⇒ reclaimable. This closes the
 * recurrence vectors: concurrent double-acquire, version-accumulated zombies,
 * bare-int locks, and (via the heartbeat) PID reuse after an unclean death.
 */
function ownerIsLive() {
  const marker = readOwner();
  return !!(marker && isAlive(marker.pid) && !markerIsStale(marker));
}

/**
 * This monitor's plugin version — from the bundled dist package.json (the
 * lockstep-synced site that ships inside the plugin). Fail-soft '0.0.0': a
 * version we can't read must never block the loop, and as the lowest version
 * it can never steal a lock from a readable one.
 */
function readOwnVersion() {
  try {
    return JSON.parse(readFileSync(join(PLUGIN_ROOT, 'dist', 'package.json'), 'utf8')).version || '0.0.0';
  } catch {
    return '0.0.0';
  }
}
const OWN_VERSION = readOwnVersion();

/** Numeric dot-segment version compare → -1|0|1. Missing/garbage reads as 0.0.0. */
function versionCmp(a, b) {
  const pa = String(a || '0').split('.').map((n) => parseInt(n, 10) || 0);
  const pb = String(b || '0').split('.').map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] || 0) - (pb[i] || 0);
    if (d !== 0) return d < 0 ? -1 : 1;
  }
  return 0;
}

/** Synchronous sleep without a busy spin. */
function sleepMs(ms) {
  try {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
  } catch {
    const end = Date.now() + ms;
    while (Date.now() < end) { /* fallback spin */ }
  }
}

/**
 * VERSION HANDOVER (closes the "plugin update never activates" bug, found live
 * 2026-07-02: a 0.13.0 monitor survived Claude Code restarts, held this lock,
 * and the freshly-installed 0.14.0 monitor dutifully exited — the new engine
 * never ran until a manual kill). A newer-version monitor SIGTERMs a live
 * OLDER-version owner: every monitor since v0.12.1 has a SIGTERM handler that
 * releases the lock and exits cleanly. Markers WITHOUT a version field predate
 * the field entirely (≤0.14.0) and therefore read as older by construction.
 * We wait for the old owner to die (bounded) before reclaiming.
 *
 * ACCEPTED RESIDUAL (same class as beat()/releaseLock, documented not silent):
 * SIGTERM to a PID that was recycled onto an unrelated process. Bounded by the
 * marker tag (the pid provably belonged to a terminalhire monitor when the
 * marker was written) and, for ≥0.15 markers, by heartbeat staleness having
 * already reclaimed dead owners without any signal.
 */
function supersedeOwner(pid) {
  try {
    process.kill(pid); // SIGTERM — the old monitor shuts down + releases
  } catch {
    return; // ESRCH etc. — already gone
  }
  const deadline = Date.now() + 3000;
  while (Date.now() < deadline && isAlive(pid)) sleepMs(50);
}

/** This process's owner marker payload. */
function ownerPayload() {
  return JSON.stringify({
    pid: process.pid,
    startedAt: Date.now(),
    lastBeat: Date.now(),
    version: OWN_VERSION,
    tag: OWNER_TAG,
  });
}

/**
 * Refresh our marker's heartbeat. Best-effort and ownership-checked: if a racer
 * reclaimed the lock (we lost ownership), do NOT clobber their marker — the
 * same stance as releaseLock. A failed beat never breaks the loop; the worst
 * case is our marker going stale and a new monitor taking over (fail-open).
 *
 * ACCEPTED RESIDUAL (Linus 2026-07-01, same convention as the PID-reuse
 * residual this heartbeat replaced): the ownership check-then-write below is
 * not atomic. If another monitor's acquireLock() reclaim (unlink + wx-create)
 * lands in the microseconds between our readOwner() and our writeFileSync,
 * this beat stomps the new owner's marker with our identity — a transient
 * split-brain that self-heals (worst case a temporary double-run, i.e. the
 * pre-heartbeat status quo; never corruption, and the next stale-beat cycle
 * reconverges to one owner). releaseLock() carries the identical pre-existing
 * window. A true fix needs a real file lock, which is disproportionate here.
 */
function beat() {
  try {
    const marker = readOwner();
    if (marker && marker.pid === process.pid) {
      writeFileSync(LOCK_FILE, JSON.stringify({ ...marker, lastBeat: Date.now() }));
    }
  } catch {
    /* best-effort */
  }
}

/**
 * Atomically acquire the singleton lock. Returns true iff WE now hold it, false if
 * a live monitor already does (caller should exit). The atomic gate is an EXCLUSIVE
 * create (`flag: 'wx'`) — only one racer can win it, so two instances can never both
 * believe they hold the lock (the old existsSync→read→write TOCTOU is gone). On
 * EEXIST we reclaim a stale/foreign lock and retry, bounded so racers can't livelock.
 */
function acquireLock() {
  try {
    mkdirSync(TH_DIR, { recursive: true });
  } catch {
    // Lock dir unusable → fail OPEN (run) rather than block the monitor entirely —
    // a rare double-run is less harmful than no refresh at all.
    return true;
  }

  const MAX_TRIES = 5;
  for (let attempt = 0; attempt < MAX_TRIES; attempt++) {
    try {
      writeFileSync(LOCK_FILE, ownerPayload(), { flag: 'wx' }); // atomic exclusive create
      return true;
    } catch (err) {
      if (!err || err.code !== 'EEXIST') {
        // Unexpected FS error → fail OPEN rather than block the monitor entirely.
        return true;
      }
      // Someone holds the path. A live owner of OUR version or newer wins → we
      // skip. A live OLDER-version owner is superseded (SIGTERM + bounded wait
      // — see supersedeOwner: this is how a plugin update actually activates).
      // A stale/foreign lock is reclaimed (unlink) and we retry the create.
      const owner = readOwner();
      if (owner && isAlive(owner.pid) && !markerIsStale(owner)) {
        if (versionCmp(owner.version, OWN_VERSION) >= 0) return false;
        supersedeOwner(owner.pid);
      }
      try {
        unlinkSync(LOCK_FILE);
      } catch {
        /* the old owner's clean shutdown (or a racer) may have unlinked first */
      }
    }
  }
  // Heavy contention exhausted the bounded retries → skip; another instance is active.
  return false;
}

/** Release the lock iff the marker is still ours. Best-effort. */
function releaseLock() {
  try {
    const marker = readOwner();
    if (marker && marker.pid === process.pid) unlinkSync(LOCK_FILE);
  } catch {
    /* best-effort */
  }
}

// ── Loopback click-catcher ──────────────────────────────────────────────────
// A 127.0.0.1-only HTTP listener the monitor owns (it is the sole long-lived
// process). Statusline job-tip links normally point at terminalhire.com/j/<token>
// (an anonymous server redirect), so a click never reaches the LOCAL job-status
// funnel and clicked jobs re-surface. When the catcher is up, tip links point at
// this loopback instead: a click records `clicked` locally (via the hidden
// `__record-click` dispatch subcommand — status 'clicked' only, never a self-mark,
// V-8) and then 302s onward to the public URL so anon analytics still fire. This
// is a LISTENER only — zero new egress.
let catcherServer = null;
let catcherPort = null;

/**
 * Fire-and-forget: record a click locally via the bundled engine. Never awaited.
 * `exec` defaults to this Node binary and is only overridden by tests to force the
 * async spawn-error path deterministically.
 */
function spawnRecordClick(id, exec = process.execPath) {
  // Spawn FAILURES (ENOENT, EMFILE/ENFILE fd/process exhaustion, EAGAIN) surface as
  // an ASYNC 'error' event, NOT a synchronous throw — the caller's try/catch can't
  // catch them, and with no listener Node re-throws as an uncaughtException that would
  // kill this long-lived monitor. Swallow it (a lost click must never crash the loop),
  // and unref() so this fire-and-forget child never keeps the event loop alive / blocks
  // a clean shutdown.
  const child = spawn(exec, [DISPATCH, '__record-click', id], { stdio: 'ignore', detached: false });
  child.on('error', () => {});
  child.unref();
}

/**
 * Build the request handler (factory so it is unit-testable with an injected
 * spawner). Only `GET /j/<base64url token>` records a click; every other
 * path/method is a safe passthrough. It NEVER 500s and never throws — a broken
 * request just 302s to the public site.
 */
function createCatcherHandler(spawnClick) {
  return function catcherHandler(req, res) {
    try {
      const path = String(req.url || '').split('?')[0];
      const m = req.method === 'GET' && /^\/j\/([^/]+)\/?$/.exec(path);
      if (!m) {
        // Non-/j/ path or non-GET method → safe passthrough to the public site.
        res.writeHead(302, { Location: 'https://terminalhire.com' });
        res.end();
        return;
      }
      const token = m[1];
      let id = '';
      try {
        id = Buffer.from(token, 'base64url').toString('utf8');
      } catch {
        id = '';
      }
      if (/^[a-z0-9._-]+:.+$/.test(id)) {
        try {
          spawnClick(id);
        } catch {
          /* fire-and-forget — a failed spawn must never break the redirect */
        }
      }
      // Re-encode the ORIGINAL token verbatim (never re-derive) so the onward
      // redirect is byte-identical to the public link's target.
      res.writeHead(302, { Location: `https://terminalhire.com/j/${token}` });
      res.end();
    } catch {
      // Never 500: worst case is a passthrough redirect to the public site.
      try {
        res.writeHead(302, { Location: 'https://terminalhire.com' });
        res.end();
      } catch {
        /* response already torn down */
      }
    }
  };
}

/**
 * Bind the loopback catcher on an ephemeral 127.0.0.1 port. Fail-open: a binding
 * failure (EADDRINUSE etc.) leaves catcherPort=null so ticks fall back to public
 * URLs — the monitor keeps running WITHOUT a catcher rather than crashing.
 */
function startCatcher() {
  try {
    catcherServer = http.createServer(createCatcherHandler(spawnRecordClick));
    catcherServer.on('error', () => {
      try { catcherServer.close(); } catch { /* ignore */ }
      catcherServer = null;
      catcherPort = null;
    });
    catcherServer.listen(0, '127.0.0.1', () => {
      try {
        const addr = catcherServer.address();
        catcherPort = addr && typeof addr === 'object' ? addr.port : null;
      } catch {
        catcherPort = null;
      }
    });
  } catch {
    catcherServer = null;
    catcherPort = null;
  }
}

/** One refresh tick — fail-closed (never throws, never blocks the loop). */
function runTick() {
  try {
    spawnSync(process.execPath, [DISPATCH, 'refresh'], {
      stdio: 'ignore',
      // Thread the catcher base to the tick child so its rendered tip links point
      // at the loopback (which records the click locally). Unset when unbound ⇒
      // the renderer falls back to public /j/ URLs, exactly as before.
      env: { ...process.env, ...(catcherPort ? { TH_CLICK_CATCHER: 'http://127.0.0.1:' + catcherPort } : {}) },
    });
  } catch {
    /* fail-closed — ignore and keep looping */
  }
}

let timer = null;
function shutdown() {
  if (timer) clearTimeout(timer);
  try { if (catcherServer) catcherServer.close(); } catch { /* best-effort */ }
  releaseLock();
  process.exit(0);
}

/** The monitor loop — extracted so tests can require the lock API without running it. */
function main() {
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

  if (!acquireLock()) {
    // Another live monitor already owns the loop — skip so only one ever runs.
    process.exit(0);
  }

  // Loopback click-catcher: only the singleton lock holder binds it, so exactly
  // one catcher is ever live. Binds asynchronously; the first (immediate) tick
  // below may miss it and render public URLs — subsequent ticks pick up the port.
  startCatcher();

  runTick(); // run once immediately, like the .sh

  if (RUN_ONCE) {
    releaseLock();
    process.exit(0);
  }

  function loop() {
    // A ref'd timer keeps the monitor process alive between ticks (the loop is the
    // whole point). Recursive setTimeout (not setInterval) so a slow tick never
    // overlaps the next one. beat() BEFORE the tick: the heartbeat proves the
    // loop is alive even when a tick runs long, and a wedged tick eventually
    // reads as a stale beat (takeover) instead of a live-forever lock.
    timer = setTimeout(() => {
      beat();
      runTick();
      loop();
    }, SLEEP_SECONDS * 1000);
  }
  loop();
}

// Run the loop ONLY when executed directly (`node refresh-loop.js …`). When another
// module `require()`s this file (the tests), the lock API is importable without the
// loop firing — so a concurrent-acquire test can drive acquireLock() in isolation.
if (require.main === module) {
  main();
}

module.exports = {
  acquireLock, releaseLock, ownerIsLive, readOwner, isAlive, beat,
  createCatcherHandler, spawnRecordClick,
  OWNER_TAG, STALE_BEAT_MS,
};
