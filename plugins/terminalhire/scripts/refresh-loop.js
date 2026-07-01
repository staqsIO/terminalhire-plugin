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

const { spawnSync } = require('node:child_process');
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
 * True ONLY if the lock holds a valid terminalhire-refresh marker whose PID is live.
 * A dead PID, or any lock that isn't our marker (legacy bare-int, corrupt, foreign
 * file whose tag ≠ OWNER_TAG) → not a live owner ⇒ reclaimable. This closes the
 * common recurrence vectors (concurrent double-acquire, version-accumulated zombies,
 * bare-int locks).
 *
 * ACCEPTED RESIDUAL (see Linus 2026-07-01): one narrow window remains. If OUR OWN
 * monitor dies UNCLEANLY (kill -9 / crash — no releaseLock) leaving a valid marker
 * on disk, and the OS later recycles that EXACT pid onto an unrelated LIVE process,
 * isAlive() reads true and this lock is treated as live until that unrelated process
 * exits → "zero monitors" until then. Requires PID-space wraparound onto the precise
 * stale value, so it is low-probability but non-zero over long uptimes. `startedAt`
 * is written for the proper future fix: a HEARTBEAT (rewrite the marker each tick;
 * treat as stale if now - lastBeat > ~3× the loop interval) — NOT a plain startedAt
 * TTL, which would expire a legitimately long-lived monitor and spawn a second one.
 * Deferred to keep this fix focused; documented rather than silently accepted.
 */
function ownerIsLive() {
  const marker = readOwner();
  return !!(marker && isAlive(marker.pid));
}

/** This process's owner marker payload. */
function ownerPayload() {
  return JSON.stringify({ pid: process.pid, startedAt: Date.now(), tag: OWNER_TAG });
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
      // Someone holds the path. A live owner wins → we skip. A stale/foreign lock is
      // reclaimed (unlink) and we retry the exclusive create.
      if (ownerIsLive()) return false;
      try {
        unlinkSync(LOCK_FILE);
      } catch {
        /* another racer may have reclaimed it first — just retry the create */
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

/** One refresh tick — fail-closed (never throws, never blocks the loop). */
function runTick() {
  try {
    spawnSync(process.execPath, [DISPATCH, 'refresh'], { stdio: 'ignore' });
  } catch {
    /* fail-closed — ignore and keep looping */
  }
}

let timer = null;
function shutdown() {
  if (timer) clearTimeout(timer);
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

  runTick(); // run once immediately, like the .sh

  if (RUN_ONCE) {
    releaseLock();
    process.exit(0);
  }

  function loop() {
    // A ref'd timer keeps the monitor process alive between ticks (the loop is the
    // whole point). Recursive setTimeout (not setInterval) so a slow tick never
    // overlaps the next one.
    timer = setTimeout(() => {
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

module.exports = { acquireLock, releaseLock, ownerIsLive, readOwner, isAlive, OWNER_TAG };
