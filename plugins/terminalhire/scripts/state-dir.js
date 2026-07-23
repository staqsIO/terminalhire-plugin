/**
 * state-dir.js — shared, mode-consistent ~/.terminalhire state-directory creation
 * for the PLUGIN scripts (TERM-39).
 *
 * This is the plugin-side copy of `apps/cli/src/state-dir.ts`. It is INLINED
 * rather than imported for the same reason `apps/cli/install.js` and
 * `apps/cli/statusline-install.js` carry their own copies: these scripts ship
 * inside the plugin and run straight from source via
 * `node "${CLAUDE_PLUGIN_ROOT}/scripts/…"`, with NO build step and no dependency
 * on `dist/` having been produced. They cannot import from `apps/cli/src`.
 *
 * KEEP ALL FOUR COPIES BEHAVIOURALLY IDENTICAL:
 *   apps/cli/src/state-dir.ts        (the reference implementation)
 *   apps/cli/install.js
 *   apps/cli/statusline-install.js
 *   plugins/terminalhire/scripts/state-dir.js   (this file)
 * `apps/cli/test/state-dir-copy-drift.test.js` compares them mechanically and
 * fails on divergence — a drifted copy silently reintroduces the original bug.
 *
 * COMMONJS ON PURPOSE. `plugins/terminalhire/` has no package.json, so the
 * nearest one is the repo root, which declares no `"type"`. That makes
 * `refresh-loop.js` (which uses require/module.exports) CommonJS, while
 * `session-nudge.js` is detected as ESM from its syntax. A CJS helper is
 * loadable from BOTH — `require()` from the former, a named `import` from the
 * latter (via cjs-module-lexer). An ESM helper would break `refresh-loop.js` on
 * Node 20.0–20.18, where `require(esm)` does not yet exist.
 *
 * PROBLEM this fixes: the state dir (encryption key, github-token.enc,
 * chat-identity.enc, …) was created with `mode: 0o700` in some modules and with
 * DEFAULT permissions (no `mode` — typically 0o755) in others. Whichever module
 * ran FIRST won the mode for the lifetime of the directory. The refresh monitor
 * is a plausible FIRST creator on a fresh machine, before any CLI command runs.
 *
 * CRITICAL: `mkdirSync`'s `mode` option only applies at CREATION. It does nothing
 * to an already-existing, looser directory — every user who ran an older build
 * before this fix already has a 0o755 (or otherwise looser) `~/.terminalhire`.
 * So this also HEALS: after ensuring existence, if the on-disk mode is looser
 * than 0o700 (any bit set outside owner rwx), it is chmod'd back down.
 *
 * The heal is best-effort and NEVER throws — `fchmodSync`/`fstatSync`/`lstatSync`
 * are no-ops or error on filesystems without POSIX permission bits (notably
 * Windows, which this plugin ships to), and a permissions heal must never crash
 * an otherwise-successful directory creation. The initial `mkdirSync` is NOT
 * covered by that guarantee (see below) — only the heal is best-effort.
 */

const { closeSync, constants, fchmodSync, fstatSync, mkdirSync, openSync } = require('node:fs');

/**
 * The permission MASK the state directory is held to: the on-disk mode is ANDed
 * with this, so it is an upper bound, never an assignment. A 0555 directory
 * therefore ends at 0500, not 0700.
 */
const STATE_DIR_MODE = 0o700;

/**
 * Ensure `dir` exists (recursively) and carries no group or other permission
 * bits, healing a pre-existing looser directory left behind by an older build or
 * a module that created it before this fix shipped. NOT "is mode 0700": the heal
 * MASKS rather than assigns, so a 0555 directory ends at 0500 and a 0755 one at
 * 0700 — the guarantee is "never looser than 0700". Safe to call from every
 * module that touches the terminalhire state directory — idempotent.
 *
 * Throws if `dir` cannot be CREATED (EACCES/ENOTDIR/EROFS/...) — deliberately,
 * unlike the heal below. A directory that could not be created will fail every
 * caller's next write anyway (ENOENT), just later and less clearly; failing here,
 * at the one shared call site, gives the real cause immediately instead of a
 * confusing downstream error. Only the PERMISSIONS HEAL is best-effort: it acts
 * on a directory that (by construction) already exists, so its failure modes are
 * narrower (a platform/filesystem where chmod is a no-op or errors, e.g.
 * Windows) and swallowing them never hides a "couldn't create the state dir" bug.
 *
 * NOTE for callers that must not throw (refresh-loop.js's acquireLock fails OPEN
 * on an unusable lock dir): keep your existing try/catch around the CALL. This
 * function's throw-on-create contract is identical to the bare `mkdirSync` it
 * replaces, so wrapping behaviour does not need to change.
 */
/**
 * One warning per exact `dir` STRING, per loaded copy of this helper — anomalous,
 * but not worth a spew. Two things this deliberately does NOT promise:
 *
 *   - NOT once per directory. The key is the argument as passed, not a resolved
 *     path, so `~/.th/link` and `~/.th/./link` are two keys for one directory and
 *     warn twice. Callers derive the path at CALL time (`TERMINALHIRE_DIR` or
 *     `homedir()`), which is deterministic within a process but is neither a
 *     constant nor enforced; resolving would cost a syscall on every call to
 *     dedupe a message that is already anomalous.
 *   - NOT once per process. Each of the four copies owns its own `warnedDirs`,
 *     and `bin/jpi-init.js` imports two of them in the same process.
 */
const warnedDirs = new Set();
function warnStateDirOnce(dir, message) {
  if (warnedDirs.has(dir)) return;
  warnedDirs.add(dir);
  try {
    process.stderr.write(message);
  } catch {
    /* a closed stderr must never break a directory create */
  }
}

function ensureStateDir(dir) {
  mkdirSync(dir, { recursive: true, mode: STATE_DIR_MODE });

  // ONE atomic open decides both "is this a symlink?" and "what do we chmod?".
  // The previous shape — lstatSync(dir).isSymbolicLink() and then openSync(dir)
  // — was two separate path resolutions with a race between them: swap the path
  // for a symlink in that window and the plain open FOLLOWS it, so the fd (and
  // the fchmod below) lands on the attacker's target. O_NOFOLLOW fails with
  // ELOOP when the final component is a symlink, which removes the window
  // instead of narrowing it. O_NOFOLLOW is absent on Windows, where it degrades
  // to a plain open — moot there, since opening a directory fails anyway and
  // the whole path returns 'unverified'.
  const noFollow = constants.O_NOFOLLOW ?? 0;
  let fd;
  try {
    fd = openSync(dir, constants.O_RDONLY | noFollow);
  } catch (err) {
    if (err?.code === 'ELOOP') {
      // We refuse to chmod a directory we do not own. Note what this does and
      // does NOT buy: anyone who can plant this symlink can already read what
      // we write through it, so refusing protects the unrelated target, not the
      // token. Report it rather than continuing silently — but note that no
      // production caller acts on this status today; it is a report, not a gate.
      warnStateDirOnce(
        dir,
        `terminalhire: ${dir} is a symlink — leaving its permissions alone; ` +
          `the 0700 guarantee on the state directory is NOT enforced.\n`,
      );
      return 'symlink';
    }
    // Could not inspect (Windows: opening a directory fails). Not an error, but
    // explicitly NOT a guarantee either.
    return 'unverified';
  }

  try {
    const currentMode = fstatSync(fd).mode & 0o777;
    // "Looser than 0700" = any permission bit set outside owner rwx (group/other
    // read/write/execute, e.g. the default 0755). A stricter-or-equal mode is left
    // alone — this only ever tightens.
    if ((currentMode & ~STATE_DIR_MODE) !== 0) {
      // Mask, never assign. `currentMode & STATE_DIR_MODE` can only REMOVE bits
      // the directory already had — e.g. 0555 (no owner-write) heals to 0500, not
      // 0700, and 0755 heals to 0700 (its owner bits were already full rwx).
      // Assigning STATE_DIR_MODE unconditionally would ADD an owner-write bit
      // that was never there for a mode like 0555/0505 — not a "tighten."
      fchmodSync(fd, currentMode & STATE_DIR_MODE);
    }
    return 'ok';
  } catch {
    // The heal stays best-effort: a platform where fstat/fchmod are a no-op or
    // throw must never crash an otherwise-successful create. But it is now
    // REPORTED rather than swallowed.
    return 'unverified';
  } finally {
    try {
      closeSync(fd);
    } catch {
      /* best-effort */
    }
  }
}

module.exports = {
  ensureStateDir,
  STATE_DIR_MODE,
  STATE_DIR_OK: 'ok',
  STATE_DIR_SYMLINK: 'symlink',
  STATE_DIR_UNVERIFIED: 'unverified',
};
