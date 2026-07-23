#!/usr/bin/env node
/**
 * install.js — installer for terminalhire (ambient spinner job surface)
 *
 * ToS / safety guardrails (binding — see CONSTITUTION.md Rule 7 and Rule 12):
 *   - ONLY uses the official Claude Code spinner settings (spinnerVerbs +
 *     spinnerTipsOverride) via the spinner module. NEVER writes settings.statusLine.
 *   - NEVER silently modifies ~/.claude/settings.json.
 *   - Always backs up settings.json (timestamped) before any write.
 *   - Prints a clear disclosure of exactly what it changes.
 *   - Requires an explicit typed "yes" before touching any system file.
 *   - Provides one-command uninstall that clears our spinner verbs + tips.
 *   - postinstall (not this file) is print-only and never calls this file.
 *
 * What it does:
 *   1. Prints full disclosure (ambient spinner job surface only)
 *   2. Requires explicit "yes" before touching any system file
 *   3. Backs up ~/.claude/settings.json (timestamped)
 *   4. Enables the ambient spinner job surface (spinnerVerbs + spinnerTipsOverride)
 *   5. Supports --uninstall (clears our spinner verbs + tips, disables spinner)
 *   6. Idempotent: safe to run multiple times
 *
 * Usage:
 *   node install.js
 *   node install.js --uninstall
 */

import {
  readFileSync,
  writeFileSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  openSync,
  fstatSync,
  fchmodSync,
  closeSync,
  constants,
} from 'node:fs';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createInterface } from 'node:readline';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const SETTINGS_PATH = join(homedir(), '.claude', 'settings.json');
const TERMINALHIRE_DIR = join(homedir(), '.terminalhire');
const CONFIG_FILE = join(TERMINALHIRE_DIR, 'config.json');

const UNINSTALL = process.argv.includes('--uninstall');

// TERM-39 blocker 1: create + heal the state dir so it carries no group or other
// permission bits, rather than the umask default (typically 0755). "Never looser
// than 0700" — the heal MASKS, so a 0555 dir ends at 0500, not 0700. This installer SHIPS STANDALONE (package.json
// `files`) and runs before any build guarantee — a fresh dev clone may not have
// `dist/` yet, and the plugin-dist copy sits at a different relative depth than
// the npm-published layout — so it cannot reliably dynamically import the
// compiled ensureStateDir() the rest of the CLI shares (apps/cli/src/state-dir.ts).
// Inlined instead, so it never depends on a build having happened. Keep this
// byte-identical in behavior to state-dir.ts's ensureStateDir() — if you change
// one, change both.
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

// Resolve the spinner module (dist preferred; bin fallback for the dev workspace).
async function loadSpinnerModule() {
  const candidates = [
    resolve(join(__dirname, 'dist', 'bin', 'spinner.js')),
    resolve(join(__dirname, 'bin', 'spinner.js')),
  ];
  for (const c of candidates) {
    if (existsSync(c)) {
      try {
        return await import(pathToFileURL(c).href);
      } catch {
        /* try next */
      }
    }
  }
  return null;
}

// Shallow-merge a patch into ~/.terminalhire/config.json.
function patchConfig(patch) {
  let cfg = {};
  try {
    if (existsSync(CONFIG_FILE)) cfg = JSON.parse(readFileSync(CONFIG_FILE, 'utf8'));
  } catch {
    cfg = {};
  }
  ensureStateDir(TERMINALHIRE_DIR);
  writeFileSync(CONFIG_FILE, JSON.stringify({ ...cfg, ...patch }, null, 2) + '\n', 'utf8');
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function backupSettings() {
  if (!existsSync(SETTINGS_PATH)) return null;
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = `${SETTINGS_PATH}.terminalhire-backup-${ts}`;
  copyFileSync(SETTINGS_PATH, backupPath);
  console.log(`  Backed up settings to: ${backupPath}`);
  return backupPath;
}

// Prompt helper. When jpi-init runs this installer IN-PROCESS it injects a single
// shared readline `ask` (one readline lifecycle for the whole onboarding flow) — this
// is what eliminates the Windows chained-prompt bug: each spawned child used to open a
// fresh readline that instantly consumed the Enter still buffered in the console from
// the previous child's answer. Standalone (`node install.js`) it owns a short-lived
// readline. Resolves the lowercased answer, or null on EOF / non-interactive (no data)
// stdin.
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

// ── Install ───────────────────────────────────────────────────────────────────

async function install({ ask: injectedAsk } = {}) {
  const asker = makeAsker(injectedAsk);
  const { ask } = asker;
  console.log('');
  console.log('┌─────────────────────────────────────────────────────────────────┐');
  console.log('│        terminalhire — enable the ambient spinner job surface     │');
  console.log('│          Pull your matches. Your profile stays on-device.        │');
  console.log('└─────────────────────────────────────────────────────────────────┘');
  console.log('');
  console.log('DISCLOSURE — read before installing');
  console.log('');
  console.log('HOW IT WORKS (pull model):');
  console.log('  1. `terminalhire jobs` downloads an anonymous job index from the server');
  console.log('     (GET /api/index — no dev data in the request).');
  console.log('  2. Matching runs against an encrypted profile that never leaves your device.');
  console.log('  3. The ambient spinner surfaces your top matches while Claude works.');
  console.log('     It reads only local files and makes zero network calls.');
  console.log('');
  console.log('  AMBIENT SPINNER JOB SURFACE (enabled by this install):');
  console.log('     While Claude is working, the spinner line shows your top LOCAL job');
  console.log('     matches, e.g.  Senior Backend Engineer @ Stripe · 82% …');
  console.log('     The "tip" line below it shows a ⌘-clickable link to open the listing');
  console.log('     (a terminalhire.com/j/… redirect — clicks are logged anonymously, no');
  console.log('     profile data). Uses official `spinnerVerbs`/`spinnerTipsOverride` settings');
  console.log(
    '     (no patching, Rule 7). Zero egress — profile never leaves the machine; only public job text.',
  );
  console.log('     This install does NOT write any statusLine — the spinner is the only surface.');
  console.log('     Turn it off any time:  terminalhire spinner --off');
  console.log('');
  console.log('YOUR LOCAL PROFILE (~/.terminalhire/profile.enc):');
  console.log('  • Encrypted at rest with AES-256-GCM (Node built-in crypto).');
  console.log(
    '  • Key stored at ~/.terminalhire/key (0600) or OS keychain if keytar is installed.',
  );
  console.log('  • Accumulates closed-vocab skill tags from your personal project sessions.');
  console.log('  • Employer-repo sessions contribute LANGUAGE TAGS ONLY (e.g. "typescript").');
  console.log('    Fine-grained framework/infra tags are excluded in employer context.');
  console.log('  • NEVER leaves your machine except in a consented lead payload (see below).');
  console.log('');
  console.log('WHAT LEAVES YOUR MACHINE:');
  console.log('  • GET /api/index — anonymous. No dev data. No cookies.');
  console.log('  • POST /api/lead — ONLY when you explicitly type "yes" to a named-entity');
  console.log('    consent prompt for a SPECIFIC role. The prompt names the buyer as');
  console.log('    "Coastal Recruiting LLC" and shows you the EXACT fields being sent.');
  console.log('    Install does NOT equal consent. Each lead is a separate decision.');
  console.log('');
  console.log('GITHUB (optional — public data only):');
  console.log('  • Scope: read:user + public repos. NEVER private-repo scopes.');
  console.log('  • Token encrypted at ~/.terminalhire/github-token.enc (same AES-256-GCM).');
  console.log('  • GitHub data enriches your LOCAL profile — no data leaves the machine');
  console.log('    unless you consent to include GitHub fields in a specific terminalhire lead.');
  console.log('');
  console.log('WHAT THIS INSTALL CHANGES:');
  console.log('  • ~/.claude/settings.json — enables the spinner job surface only');
  console.log('    (spinnerVerbs + spinnerTipsOverride). It does NOT write statusLine.');
  console.log('  • A timestamped backup is created before any change.');
  console.log('');
  console.log('HOW TO DISABLE / DELETE:');
  console.log('  • Disable spinner surface:  node install.js --uninstall');
  console.log('  • (or)                      terminalhire spinner --off');
  console.log('  • Delete local profile:     terminalhire profile --delete');
  console.log('  • Clear GitHub token:       terminalhire logout');
  console.log('  • Wipe everything:          rm -rf ~/.terminalhire');
  console.log('');

  const installAnswer = await ask(
    'Enable the terminalhire ambient spinner job surface? Type "yes" to continue: ',
  );
  if (installAnswer === null && !process.stdin.isTTY) {
    // Non-interactive stdin with no input — do NOT silently proceed to a prompt that
    // resolves empty and fail-closes. Say so plainly and skip (explicit, not a fake abort).
    console.log(
      '\n  stdin is not interactive — run `terminalhire spinner --on` in a real terminal to enable.',
    );
    asker.close();
    return 0;
  }
  if (installAnswer !== 'yes') {
    console.log('\nAborted — nothing was changed.');
    asker.close();
    return 0;
  }

  console.log('');
  const backupPath = backupSettings();

  // Enable the spinner job surface as part of this single consented install
  // (Rule 12: disclosure + timestamped backup + typed "yes" above). The spinner
  // module is the ONLY writer of ~/.claude/settings.json here — verbs + tips only.
  let enabled = false;
  try {
    patchConfig({ spinner: { enabled: true, mode: 'replace', max: 6 } });
    const spinnerMod = await loadSpinnerModule();
    if (spinnerMod) {
      let topMatches = [];
      try {
        const cache = JSON.parse(readFileSync(join(TERMINALHIRE_DIR, 'index-cache.json'), 'utf8'));
        if (Array.isArray(cache.topMatches)) topMatches = cache.topMatches;
      } catch {
        /* no cache yet — monitor will populate it */
      }

      const verbs = spinnerMod.buildSpinnerPool(topMatches, 6);
      if (verbs.length > 0) spinnerMod.applySpinnerVerbs(verbs, 'replace');

      // Tips line: ⌘-clickable listing links for the same top matches.
      let tipsCount = 0;
      try {
        const tips = spinnerMod.buildTips(topMatches, 'https://terminalhire.com', 8);
        if (Array.isArray(tips) && tips.length > 0) {
          spinnerMod.applySpinnerTips(tips);
          tipsCount = tips.length;
        }
      } catch {
        /* tips are best-effort */
      }

      enabled = true;
      console.log(
        '  Spinner job surface: ENABLED' +
          (verbs.length
            ? ` (${verbs.length} match${verbs.length === 1 ? '' : 'es'} live now)`
            : ' (matches appear after the first background refresh)'),
      );
      if (tipsCount > 0) {
        console.log(`    Tip links: ${tipsCount} ⌘-clickable listing${tipsCount === 1 ? '' : 's'}`);
      }
      console.log('    Turn off any time: terminalhire spinner --off');
    }
  } catch {
    /* spinner is best-effort; never block the install */
  }

  if (backupPath) {
    console.log(`  Backup: ${backupPath}`);
  }

  if (!enabled) {
    console.log('  Could not load the spinner module — nothing was enabled.');
    console.log('  Run `terminalhire spinner --on` after building, or reinstall the package.');
  }

  console.log('');
  console.log('Done. Restart Claude Code to activate the ambient spinner job surface.');
  console.log('');
  console.log('  While Claude works, the spinner shows your top LOCAL matches, e.g.');
  console.log('    Senior Backend Engineer @ Stripe · 82% …');
  console.log('  with a ⌘-clickable tip link to open the listing.');
  console.log('');
  console.log('  Other commands:');
  console.log(
    '    terminalhire login            — sign in with GitHub (enriches profile instantly)',
  );
  console.log('    terminalhire logout           — clear GitHub token');
  console.log(
    '    terminalhire jobs             — fetch index, browse roles matched to your profile',
  );
  console.log('    terminalhire spinner --off    — disable the ambient spinner surface');
  console.log('    terminalhire profile --show   — inspect your encrypted profile');
  console.log('    terminalhire profile --edit   — set displayName, contactEmail, prefs');
  console.log('    terminalhire profile --delete — wipe profile and key');
  console.log('');
  asker.close();
  return 0;
}

// ── Uninstall ─────────────────────────────────────────────────────────────────

async function uninstall({ ask: injectedAsk } = {}) {
  const asker = makeAsker(injectedAsk);
  const { ask } = asker;
  console.log('');
  console.log('terminalhire uninstall');
  console.log('');
  console.log('  This disables the ambient spinner job surface and clears the spinner');
  console.log('  verbs + tips terminalhire added (any verbs/tips you set yourself are kept).');
  console.log('  It does NOT touch settings.statusLine.');
  console.log('');

  const answer = await ask(
    'Disable the terminalhire spinner job surface? Type "yes" to continue: ',
  );
  if (answer !== 'yes') {
    console.log('\nAborted — nothing was changed.');
    asker.close();
    return 0;
  }

  console.log('');
  const backupPath = backupSettings();
  if (backupPath) {
    console.log(`  Backup: ${backupPath}`);
  }

  // Remove the spinner job verbs + tips we injected (preserving any the user set
  // themselves) and disable the surface in our config.
  try {
    patchConfig({ spinner: { enabled: false } });
    const spinnerMod = await loadSpinnerModule();
    if (spinnerMod) {
      const vres = spinnerMod.clearSpinnerVerbs();
      console.log(
        '  Removed spinner job verbs' +
          (vres && vres.keptUserVerbs ? ` (kept ${vres.keptUserVerbs} of your own)` : '') +
          '.',
      );
      try {
        const tres = spinnerMod.clearSpinnerTips();
        console.log(
          '  Removed spinner tip links' +
            (tres && tres.keptUserTips ? ` (kept ${tres.keptUserTips} of your own)` : '') +
            '.',
        );
      } catch {
        /* tips clear is best-effort */
      }
    }
  } catch {
    /* best-effort */
  }

  console.log('');
  console.log('  Your profile is untouched. To also delete it:');
  console.log('    terminalhire profile --delete');
  console.log('    rm -rf ~/.terminalhire');
  console.log('');
  console.log('Done. Restart Claude Code to apply.');
  console.log('');
  asker.close();
  return 0;
}

// ── Entry ─────────────────────────────────────────────────────────────────────
// Guarded so importing this module (jpi-init runs it in-process) does NOT auto-run
// install() — the same isMain guard statusline-install.js uses.

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

export { install as installSpinner, uninstall as uninstallSpinner };
