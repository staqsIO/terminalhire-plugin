#!/usr/bin/env node
/**
 * statusline-install.js — consent-gated installer for the CONNECTION-ONLY statusLine
 * (feature 002 / ADR-002). Companion to install.js (which is spinner-only and, by its
 * binding rule, NEVER writes settings.statusLine). This file is the ONLY writer of
 * settings.statusLine, and it writes ONLY the self-updating launcher command — the
 * statusLine it enables carries personal connection notifications, never job ads
 * (the entire justification for re-opening the demoted statusLine surface).
 *
 * Guardrails (CONSTITUTION Rule 12 / ~/.claude/rules/safety.md):
 *   - Explicit typed "yes" BEFORE touching any system file (no-consent → settings.json
 *     byte-for-byte unchanged, no backup churn — V-4).
 *   - Timestamped backup of ~/.claude/settings.json before any write.
 *   - settings.statusLine.command is ZERO-VOLATILE: `node ~/.terminalhire/statusline-launch.js`
 *     — a stable, version-agnostic path (V-1). All version logic lives behind the
 *     hook-written engine-path pointer, so this artifact is written once and never
 *     re-stamped → it cannot recreate the stale-wrapper bug.
 *   - Chain-never-clobber: a pre-existing FOREIGN statusLine is saved verbatim to a
 *     sidecar and run FIRST by the launcher; uninstall restores it byte-for-byte (V-5),
 *     and it still renders when our part is empty (V-8).
 *   - Legacy re-point (Q4): an old terminalhire wrapper (npm-pinned .sh) is detected and,
 *     with a targeted yes, replaced by the self-updating launcher — never silently.
 *
 * Usage:
 *   node statusline-install.js
 *   node statusline-install.js --uninstall
 */

import {
  readFileSync,
  writeFileSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  rmSync,
  openSync,
  fstatSync,
  fchmodSync,
  closeSync,
  constants,
} from 'node:fs';
import { homedir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createInterface } from 'node:readline';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const SETTINGS_PATH = join(homedir(), '.claude', 'settings.json');
const SETTINGS_DIR = dirname(SETTINGS_PATH);
const TERMINALHIRE_DIR = join(homedir(), '.terminalhire');
const STABLE_LAUNCHER = join(TERMINALHIRE_DIR, 'statusline-launch.js');
const FOREIGN_SIDECAR = join(TERMINALHIRE_DIR, 'statusline-foreign.json');
const LEGACY_WRAPPER = join(TERMINALHIRE_DIR, 'statusline-wrapper.sh');

// The exact command written to settings.statusLine — stable, version-agnostic (V-1).
const LAUNCHER_COMMAND = `node ${STABLE_LAUNCHER}`;

const UNINSTALL = process.argv.includes('--uninstall');

// TERM-39 blocker 1: create + heal the state dir so it carries no group or other
// permission bits, rather than the umask default (typically 0755). "Never looser
// than 0700" — the heal MASKS, so a 0555 dir ends at 0500, not 0700. This installer SHIPS STANDALONE (package.json
// `files`) and runs before any build guarantee — a fresh dev clone may not have
// `dist/` yet, and the plugin-dist copy sits at a different relative depth than
// the npm-published layout — so it cannot reliably dynamically import the
// compiled ensureStateDir() the rest of the CLI shares (apps/cli/src/state-dir.ts).
// Inlined instead, so it never depends on a build having happened. Keep this
// byte-identical in behavior to state-dir.ts's ensureStateDir() (and to
// install.js's copy of the same) — if you change one, change all three.
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
  mkdirSync(dir, { recursive: true, mode: 0o700 });

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
    if ((currentMode & ~0o700) !== 0) {
      // Mask, never assign. `currentMode & 0o700` can only REMOVE bits
      // the directory already had — e.g. 0555 (no owner-write) heals to 0500, not
      // 0700, and 0755 heals to 0700 (its owner bits were already full rwx).
      // Assigning 0o700 unconditionally would ADD an owner-write bit
      // that was never there for a mode like 0555/0505 — not a "tighten."
      fchmodSync(fd, currentMode & 0o700);
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

// ── Helpers ───────────────────────────────────────────────────────────────────

// Prompt helper. When jpi-init runs this installer IN-PROCESS it injects a single
// shared readline `ask` (one readline lifecycle for the whole onboarding flow) — this
// is what eliminates the Windows chained-prompt bug: each spawned child used to open a
// fresh readline that instantly consumed the Enter still buffered in the console from
// the previous child's answer, silently fail-closing this statusLine consent to "".
// Standalone (`node statusline-install.js`) it owns a short-lived readline. Resolves
// the lowercased answer, or null on EOF / non-interactive (no data) stdin.
function makeAsker(injected) {
  if (injected) return { ask: injected, close() {} };
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const ask = (question) =>
    new Promise((res) => {
      let answered = false;
      rl.question(question, (answer) => {
        answered = true;
        res((answer || '').trim().toLowerCase());
      });
      rl.once('close', () => {
        if (!answered) res(null);
      });
    });
  return { ask, close: () => rl.close() };
}

function backupSettings() {
  if (!existsSync(SETTINGS_PATH)) return null;
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = `${SETTINGS_PATH}.terminalhire-backup-${ts}`;
  copyFileSync(SETTINGS_PATH, backupPath);
  console.log(`  Backed up settings to: ${backupPath}`);
  return backupPath;
}

function readSettings() {
  try {
    if (existsSync(SETTINGS_PATH)) return JSON.parse(readFileSync(SETTINGS_PATH, 'utf8'));
  } catch {
    /* fall through to empty */
  }
  return {};
}

function writeSettings(settings) {
  mkdirSync(SETTINGS_DIR, { recursive: true });
  writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2) + '\n', 'utf8');
}

// Resolve the launcher SOURCE (bundled dist preferred; bin fallback for the dev workspace).
function resolveLauncherSource() {
  const candidates = [
    resolve(join(__dirname, 'dist', 'bin', 'jpi-statusline-launch.js')),
    resolve(join(__dirname, 'bin', 'jpi-statusline-launch.js')),
  ];
  for (const c of candidates) if (existsSync(c)) return c;
  return null;
}

/**
 * The generation of statusLine artifact this installer puts in place (TERM-368).
 *
 * Kept in lockstep with the marker in `bin/jpi-statusline-launch.js` — the installer
 * copies that file verbatim, so the marker travels with it and an installed launcher can
 * always answer which generation it is. Bump BOTH only when an installed artifact stops
 * being able to render the current badge row.
 */
const STATUSLINE_GENERATION = 2;

const GENERATION_MARKER = /terminalhire-statusline-generation:\s*(\d+)/;

/**
 * The generation recorded inside an installed statusLine artifact, or 0.
 *
 * 0 means "older than the marker" and NEVER "current" — the whole failure this closes is
 * an unrecognizable artifact being treated as fine. Absent, unreadable, a directory, or
 * no marker all collapse to 0 deliberately: every one of them is a thing we cannot prove
 * renders the badge row, and the safe reading of "cannot prove" is "behind".
 *
 * Takes an explicit path rather than reading a module-level constant, so a test can point
 * it at a scratch dir. The constants above bind to homedir() at import and cannot be
 * redirected by the environment.
 */
function wrapperGeneration(path) {
  let src = '';
  try {
    src = readFileSync(path, 'utf8');
  } catch {
    return 0; // missing, unreadable, or a directory — all "cannot prove", all behind
  }
  const m = GENERATION_MARKER.exec(src);
  if (!m) return 0;
  const n = Number(m[1]);
  return Number.isInteger(n) && n > 0 ? n : 0;
}

/** True when an installed artifact predates the current badge row and cannot render it. */
function isStaleGeneration(path) {
  return wrapperGeneration(path) < STATUSLINE_GENERATION;
}

// Classify an existing statusLine command:
//   'ours'    — already the self-updating launcher (idempotent)
//   'legacy'  — an OLD terminalhire wrapper (npm-pinned .sh / dispatch) → offer re-point
//   'foreign' — someone else's statusLine → chain-wrap + preserve
//   'none'    — no command
//
// The marker decides FIRST, the filename heuristics only as fallback, and the order is the
// point. Matching `statusline-launch.js` in the command string proves what the file is
// NAMED, not what it can render — so a launcher-named artifact from before the badge row
// classified as 'ours' and was left alone forever. Reading the generation out of the file
// asks the question that actually matters. The heuristics stay because they are the only
// thing that catches an artifact written before any marker existed.
// `launcherPath` is a parameter with the real path as its default, so a test can point the
// generation read at a scratch dir. The default keeps every existing caller unchanged.
function classifyExisting(statusLine, launcherPath = STABLE_LAUNCHER) {
  const cmd = statusLine && typeof statusLine.command === 'string' ? statusLine.command : '';
  if (!cmd) return 'none';
  if (cmd.includes('statusline-launch.js')) {
    return isStaleGeneration(launcherPath) ? 'legacy' : 'ours';
  }
  if (
    cmd.includes('statusline-wrapper.sh') ||
    (existsSync(LEGACY_WRAPPER) && cmd.includes('.terminalhire')) ||
    cmd.includes('jpi-dispatch') ||
    /terminalhire|\bjpi\b|jpi-/.test(cmd)
  ) {
    return 'legacy';
  }
  return 'foreign';
}

// ── Install ───────────────────────────────────────────────────────────────────

async function install({ ask: injectedAsk } = {}) {
  const asker = makeAsker(injectedAsk);
  const { ask } = asker;
  console.log('');
  console.log('┌─────────────────────────────────────────────────────────────────┐');
  console.log('│   terminalhire — connection notifications in your statusLine     │');
  console.log('│      Personal connection signals only. Never job ads.            │');
  console.log('└─────────────────────────────────────────────────────────────────┘');
  console.log('');
  console.log('DISCLOSURE — read before enabling');
  console.log('');
  console.log('WHAT THIS ENABLES:');
  console.log('  A Claude Code statusLine that shows ONLY personal connection signals:');
  console.log('    • 💬 N unread   — messages from developers you accepted an intro with');
  console.log('    • ✉ N intro requests — inbound intro requests awaiting your reply');
  console.log('    • ⚠ session expired — a re-link hint when your linked session lapses');
  console.log('  It NEVER shows job matches, role %-scores, or any advert — those stay in');
  console.log('  the ambient spinner. The line is a LOCAL cache read: zero network calls.');
  console.log('');
  console.log('HOW IT STAYS CURRENT (no manual re-install ever):');
  console.log('  settings.json gets a stable command:  ' + LAUNCHER_COMMAND);
  console.log('  On every session the plugin refreshes a pointer to its current engine, so');
  console.log('  the statusLine follows plugin auto-updates automatically.');
  console.log('');
  console.log('WHAT THIS CHANGES:');
  console.log('  • ~/.claude/settings.json — sets statusLine to the launcher above.');
  console.log('  • A timestamped backup is created before any change.');
  console.log('  • Any statusLine you already have is PRESERVED (run first) — never replaced.');
  console.log('');
  console.log('HOW TO REMOVE:');
  console.log('  • node statusline-install.js --uninstall   (restores your prior statusLine)');
  console.log('');

  // `[Y/n]`, Enter = yes — the same shape as init's GitHub sign-in and th:// steps.
  //
  // This used to demand the literal word "yes", which made it the STRICTEST prompt in
  // onboarding: Enter declined, `y` declined, and the reflex way to dismiss a prompt
  // turned it off. It sat one step below a prompt that sends a credential and accepts
  // Enter. That asymmetry was not a decision anyone made; it read as caution but its
  // practical effect was that the surface carrying every connection notification was
  // off for people who thought they had said yes — chased twice as a code defect
  // before anyone looked at the prompt.
  //
  // The consent itself is unchanged and still real: the disclosure above is printed in
  // full, an explicit `n` declines, a non-interactive stdin installs NOTHING, an
  // existing statusLine is preserved rather than replaced, and a timestamped backup is
  // written before any change. What moved is the default answer, not whether one is
  // asked for.
  const interactive = Boolean(process.stdin.isTTY);
  const answer = await ask(
    interactive
      ? 'Enable the connection-notification statusLine? [Y/n] (Enter = yes): '
      : 'Enable the connection-notification statusLine? Type "yes" to continue: ',
  );

  if (!interactive) {
    // Enter-means-yes is a default for a HUMAN who just read the disclosure. It is not
    // consent a pipe, a CI runner, or an unattended script can express by sending a
    // newline — and one of those sending "\n" is indistinguishable from a person
    // pressing Enter once you stop looking at isTTY. So the non-interactive path keeps
    // the OLD bar, the literal word, and nothing else installs.
    const typedYes = String(answer ?? '').trim() === 'yes';
    if (!typedYes) {
      console.log(
        '\n  stdin is not interactive — run `terminalhire statusline --on` in a real terminal to enable.',
      );
      asker.close();
      return 0;
    }
  } else {
    // ALLOWLIST, not a denylist. The first version of this asked "is it n or no?"
    // and installed on everything else — which meant `null` installed, and `ask`
    // resolves null on EOF, on Ctrl-D, and whenever the shared readline closes
    // because the human bailed out of `init` mid-flow. `String(null ?? '')` is the
    // empty string, indistinguishable from pressing Enter. So did "nope", "cancel",
    // and an `n` still wrapped in bracketed-paste bytes. Under the old literal-"yes"
    // bar every one of those aborted; a denylist silently turned each into consent
    // to write another program's config file.
    //
    // The `th://` prompt eight steps below in the same flow (jpi-init.js) already
    // allowlists `'' | y | yes`. Two consecutive consent prompts disagreeing about
    // which way an unrecognised answer falls is how a regression gets waved through.
    // Narrow by TYPE, not by listing the non-strings that must not consent. Excluding
    // `null` by value left `undefined` consenting — `String(undefined ?? '')` is also
    // the empty string — so the guard only closed the hole it had already been shown.
    // Both real askers resolve `string | null` today, which is exactly why this must
    // not depend on that: a third `ask` is one refactor away, and it would arrive as
    // the same EOF bug wearing a different value.
    const a = typeof answer === 'string' ? answer.trim().toLowerCase() : null;
    const consented = a === '' || a === 'y' || a === 'yes';
    if (!consented) {
      console.log('\nAborted — nothing was changed.');
      asker.close();
      return 0;
    }
  }

  const src = resolveLauncherSource();
  if (!src) {
    console.log('\n  Could not locate the statusLine launcher — nothing was changed.');
    console.log('  Rebuild the package (npm run build) and try again.');
    asker.close();
    return 1;
  }

  const settings = readSettings();
  const existing = settings.statusLine;
  const kind = classifyExisting(existing);

  // Legacy re-point (Q4) — consent-gated, never silent.
  if (kind === 'legacy') {
    console.log('');
    console.log('  Found an older terminalhire statusLine (npm-pinned — can go stale).');
    const rp = await ask('  Replace it with the self-updating launcher? Type "yes": ');
    if (rp !== 'yes') {
      console.log('\n  Left your existing statusLine as-is — nothing was changed.');
      asker.close();
      return 0;
    }
    // It is our own legacy artifact → do NOT preserve it as "foreign".
  }

  // Only NOW (post-consent) do we touch the filesystem — V-4.
  console.log('');
  ensureStateDir(TERMINALHIRE_DIR);

  // Copy the launcher to its stable, version-agnostic home.
  copyFileSync(src, STABLE_LAUNCHER);

  // Chain-wrap a genuinely FOREIGN statusLine: save it verbatim so the launcher runs it
  // first and uninstall can restore it byte-for-byte (V-5/V-8).
  if (kind === 'foreign') {
    writeFileSync(
      FOREIGN_SIDECAR,
      JSON.stringify({ statusLine: existing }, null, 2) + '\n',
      'utf8',
    );
    console.log('  Preserved your existing statusLine — it will render alongside ours.');
  } else if (kind === 'ours' && existsSync(FOREIGN_SIDECAR)) {
    // Idempotent re-run: keep any previously-saved foreign statusLine sidecar.
  }

  const backupPath = backupSettings();

  settings.statusLine = { type: 'command', command: LAUNCHER_COMMAND };
  writeSettings(settings);

  console.log('  statusLine: ENABLED');
  console.log(`    Command: ${LAUNCHER_COMMAND}`);
  if (backupPath) console.log(`    Backup:  ${backupPath}`);
  console.log('');
  console.log('Done. Restart Claude Code to see connection notifications in your statusLine.');
  console.log('  Remove any time: node statusline-install.js --uninstall');
  console.log('');
  asker.close();
  return 0;
}

// ── Uninstall ─────────────────────────────────────────────────────────────────

async function uninstall({ ask: injectedAsk } = {}) {
  const asker = makeAsker(injectedAsk);
  const { ask } = asker;
  console.log('');
  console.log('terminalhire — remove the connection-notification statusLine');
  console.log('');
  console.log('  This restores whatever statusLine you had before (byte-for-byte), or');
  console.log('  removes the statusLine entirely if terminalhire added it fresh.');
  console.log('');

  const answer = await ask('Remove the terminalhire statusLine? Type "yes" to continue: ');
  if (answer !== 'yes') {
    console.log('\nAborted — nothing was changed.');
    asker.close();
    return 0;
  }

  console.log('');
  const settings = readSettings();
  const isOurs =
    settings.statusLine &&
    typeof settings.statusLine.command === 'string' &&
    settings.statusLine.command.includes('statusline-launch.js');

  // Only mutate settings if the current statusLine is ours (never clobber a foreign one
  // the user re-added after install).
  if (isOurs) {
    const backupPath = backupSettings();
    if (existsSync(FOREIGN_SIDECAR)) {
      try {
        const saved = JSON.parse(readFileSync(FOREIGN_SIDECAR, 'utf8'));
        if (saved && saved.statusLine)
          settings.statusLine = saved.statusLine; // byte-for-byte (V-5)
        else delete settings.statusLine;
      } catch {
        delete settings.statusLine;
      }
      console.log('  Restored your previous statusLine.');
    } else {
      delete settings.statusLine;
      console.log('  Removed the terminalhire statusLine.');
    }
    writeSettings(settings);
    if (backupPath) console.log(`    Backup: ${backupPath}`);
  } else {
    console.log('  No terminalhire statusLine is currently active — settings.json left unchanged.');
  }

  // Clean up our stable artifacts (the pointer is re-written harmlessly by the hook).
  try {
    if (existsSync(FOREIGN_SIDECAR)) rmSync(FOREIGN_SIDECAR);
  } catch {
    /* best-effort */
  }
  try {
    if (existsSync(STABLE_LAUNCHER)) rmSync(STABLE_LAUNCHER);
  } catch {
    /* best-effort */
  }

  console.log('');
  console.log('Done. Restart Claude Code to apply.');
  console.log('');
  asker.close();
  return 0;
}

// ── Entry ─────────────────────────────────────────────────────────────────────

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  const run = UNINSTALL ? uninstall : install;
  run()
    .then((code) => process.exit(typeof code === 'number' ? code : 0))
    .catch((err) => {
      console.error(`${UNINSTALL ? 'Uninstall' : 'Install'} error:`, err.message);
      process.exit(1);
    });
}

export {
  install as installStatusline,
  uninstall as uninstallStatusline,
  LAUNCHER_COMMAND,
  STATUSLINE_GENERATION,
  wrapperGeneration,
  isStaleGeneration,
  classifyExisting,
};
