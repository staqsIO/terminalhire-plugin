#!/usr/bin/env node
/**
 * session-nudge.js — SessionStart hook for terminalhire plugin
 *
 * TWO fail-silent jobs:
 *   1. STATUSLINE POINTER (feature 002 / ADR-002): write the ABSOLUTE path of the
 *      CURRENT plugin engine's connection-only render entry to a stable pointer file
 *      (~/.terminalhire/engine-path). The stable `node ~/.terminalhire/statusline-launch.js`
 *      command in settings.json reads this pointer and execs the current engine, so the
 *      statusLine self-updates across plugin auto-updates with NO manual re-install.
 *      This hook is the ONLY place ${CLAUDE_PLUGIN_ROOT} is reliably resolved by CC — and
 *      we derive PLUGIN_ROOT from THIS SCRIPT'S OWN location (fileURLToPath(import.meta.url)),
 *      i.e. CC's own resolved install dir, NOT installed_plugins.json (the #52218
 *      stale-installPath trap the spec's V-2 tests).
 *   2. First-run setup nudge: if the plugin is installed but `terminalhire init` has
 *      never run (no config.json), print ONE stderr line pointing at the one-command setup.
 *      Consent happens inside `terminalhire init`.
 *
 * After setup (config.json exists) this hook prints NOTHING — ongoing matches are
 * surfaced by the ambient spinner, not by a SessionStart nudge. The pointer write is
 * silent (never prints) and always runs.
 *
 * CONTRACT:
 *   - Never prints to stdout (hooks show stderr to user).
 *   - Fail-closed: any error → exit 0, print nothing. The pointer write must NEVER
 *     break the nudge, and must not race the refresh monitor (atomic write-then-rename).
 *   - Never prints file paths, stack traces, or profile data.
 */

import { readFileSync, existsSync, writeFileSync, renameSync } from 'node:fs';
import { join, dirname, sep } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';
// The state dir holds key material, so it must be created at 0700 — a bare
// mkdirSync here would create it at the 0755 umask default, and whichever
// module creates it FIRST wins its mode for the directory's lifetime (TERM-39).
import { ensureStateDir } from './state-dir.cjs';

const TERMINALHIRE_DIR = process.env.TERMINALHIRE_DIR || join(homedir(), '.terminalhire');
const NUDGE_FILE = join(TERMINALHIRE_DIR, 'nudged.json');
const CONFIG_FILE = join(TERMINALHIRE_DIR, 'config.json');
const ENGINE_POINTER_FILE = join(TERMINALHIRE_DIR, 'engine-path');

/**
 * Write the connection-only render engine's absolute path to the stable pointer file.
 * PLUGIN_ROOT is derived from THIS script's own location — same self-path trick as
 * refresh-loop.sh's BASH_SOURCE — so it tracks whatever dir CC actually loaded the
 * plugin from this session (self-healing on auto-update), NOT a stale record on disk.
 * Fully fail-silent; a bad write leaves any prior pointer untouched.
 */
function writeEnginePointer() {
  try {
    // scripts/session-nudge.js → PLUGIN_ROOT is the dir ABOVE scripts/.
    const pluginRoot = dirname(dirname(fileURLToPath(import.meta.url)));
    const engine = join(pluginRoot, 'dist', 'bin', 'jpi-statusline.js');
    if (!existsSync(engine)) return; // nothing to point at yet — leave prior pointer
    ensureStateDir(TERMINALHIRE_DIR);
    // Atomic-ish: write a temp file then rename, so a concurrent reader never sees a
    // half-written pointer (heeds the zombie-monitor lesson — no torn shared artifact).
    const tmp = `${ENGINE_POINTER_FILE}.tmp-${process.pid}`;
    writeFileSync(tmp, engine, 'utf8');
    renameSync(tmp, ENGINE_POINTER_FILE);
  } catch {
    // non-fatal — the launcher fails silent on a missing/stale pointer
  }
}

/**
 * Hour-slot dedup so a given nudge type shows at most once per session-ish window.
 * (Hooks don't get a session_id; we approximate per-hour dedup.) Returns true if
 * this slot was ALREADY nudged for `prefix`; otherwise marks it and returns false.
 */
function alreadyNudgedThisSlot(prefix) {
  const sessionKey = `${prefix}-${Math.floor(Date.now() / 3_600_000)}`;
  let nudged = {};
  try {
    if (existsSync(NUDGE_FILE)) nudged = JSON.parse(readFileSync(NUDGE_FILE, 'utf8'));
  } catch {
    /* ignore */
  }

  if (nudged[sessionKey]) return true;

  nudged[sessionKey] = Date.now();
  // Prune old entries (> 24h)
  const cutoff = Date.now() - 86_400_000;
  for (const [k, v] of Object.entries(nudged)) {
    if (typeof v === 'number' && v < cutoff) delete nudged[k];
  }
  try {
    ensureStateDir(TERMINALHIRE_DIR);
    // Same tmp-then-rename as writeEnginePointer() above. The read-check-write around it
    // is still not atomic ACROSS processes — two hooks racing can both decide "not yet
    // nudged" and print twice — but the write itself must never leave a torn nudged.json,
    // which would lose every slot record and turn one duplicate line into a permanent one.
    // Matching the sibling also stops the next person copying the weaker of two adjacent
    // writers. Worst remaining case is a duplicate advisory line on a slow or loaded disk.
    const tmp = `${NUDGE_FILE}.tmp-${process.pid}`;
    writeFileSync(tmp, JSON.stringify(nudged), 'utf8');
    renameSync(tmp, NUDGE_FILE);
  } catch {
    /* non-fatal */
  }
  return false;
}

/**
 * The generation this release installs. DUPLICATED from apps/cli/statusline-install.js
 * and from the marker in bin/jpi-statusline-launch.js, on purpose and against the usual
 * instinct: this hook ships inside the plugin and must stay standalone node-builtins-only,
 * so reaching into the CLI's dist for one integer would trade a real boundary for a
 * cosmetic dedup — the same call jpi-statusline.js already made about compareVersions.
 * A test asserts all three agree, so the duplication is checked rather than trusted.
 * If you change one, change all three.
 */
const STATUSLINE_GENERATION = 2;
const GENERATION_MARKER = /terminalhire-statusline-generation:\s*(\d+)/;

/** The generation recorded inside an installed artifact, or 0 when it cannot be proven. */
function generationOf(path) {
  try {
    const m = GENERATION_MARKER.exec(readFileSync(path, 'utf8'));
    if (!m) return 0;
    const n = Number(m[1]);
    return Number.isInteger(n) && n > 0 ? n : 0;
  } catch {
    return 0;
  }
}

/**
 * The terminalhire artifact this user's statusLine actually invokes, or ''.
 *
 * Deliberately narrow: it must reference OUR state dir. Someone else's statusLine is not
 * ours to grade, and a user who never enabled ours must never be nudged about it — a
 * notification aimed at people who did not opt in is how a whole channel gets muted,
 * which would cost the badge row too.
 *
 * NO PATH IS PARSED OUT OF THE COMMAND STRING, and that is the fix rather than an
 * implementation detail. The first version matched `(\S*statusline-(?:launch\.js|
 * wrapper\.sh))` and compared the capture against the state dir. `\S*` stops at the first
 * space, so `node /Users/John Smith/.terminalhire/statusline-launch.js` captured only
 * `Smith/.terminalhire/statusline-launch.js`, failed the prefix test, and this returned ''
 * — the nudge then went permanently and silently dead for that user. The installer writes
 * exactly that command, unquoted, from `node ${STABLE_LAUNCHER}`; and on Windows the
 * default profile folder is the account's display name, so "First Last" homes are
 * mainstream. That is a whole slice of the population TERM-368 exists to reach, and it
 * would have shipped unreachable.
 *
 * A command string is not a parseable path — quoting, spaces, and separators all vary by
 * host. We do not need to parse one: we already know the state dir, and we know the only
 * two artifacts we ever install. So ask whether the command references our dir, then name
 * the file ourselves. Nothing here can be defeated by how the path was spelled.
 */
const OUR_ARTIFACTS = ['statusline-launch.js', 'statusline-wrapper.sh'];

function installedStatuslineArtifact() {
  try {
    const settings = JSON.parse(readFileSync(join(homedir(), '.claude', 'settings.json'), 'utf8'));
    const cmd = settings && settings.statusLine && settings.statusLine.command;
    if (typeof cmd !== 'string' || !cmd) return '';

    // Accept the tilde spelling too. Someone who hand-edits settings.json writes `~`, and
    // an unexpanded tilde is still unambiguously our directory.
    const dirs = [TERMINALHIRE_DIR];
    const home = homedir();
    if (TERMINALHIRE_DIR.startsWith(home)) dirs.push(`~${TERMINALHIRE_DIR.slice(home.length)}`);
    // On Windows the same directory has two spellings and we build the wrong one. `join`
    // yields `~\.terminalhire`, but settings.json is JSON, where a backslash has to be
    // written `\\` — so anyone hand-editing it types `~/.terminalhire`, and the two never
    // matched. Compare with separators folded, and ONLY where the OS treats them as
    // interchangeable: on POSIX a backslash is a legal filename character, so folding it
    // there would invent a match the user never wrote.
    const fold = sep === '\\' ? (s) => s.replace(/\\/g, '/') : (s) => s;
    const folded = fold(cmd);
    if (!dirs.some((d) => folded.includes(fold(d)))) return '';

    const name = OUR_ARTIFACTS.find((n) => cmd.includes(n));
    if (!name) return '';

    // Only grade a file that is actually THERE. Constructing the path rather than parsing
    // it is what makes spelling irrelevant, but it also means we could name a file the
    // user is not running — a foreign script that happens to be called
    // `statusline-launch.js` while mentioning our dir for an unrelated reason would
    // otherwise be graded, and a missing file reads as generation 0, i.e. "stale", i.e. a
    // nudge to someone who never installed ours. Absence proves nothing here, and the
    // honest response to proving nothing is to say nothing: this nudge is aimed only at
    // people who DO have our statusLine.
    const p = join(TERMINALHIRE_DIR, name);
    return existsSync(p) ? p : '';
  } catch {
    return '';
  }
}

try {
  // Job 1: refresh the self-updating statusLine pointer every session (silent, always).
  writeEnginePointer();

  // Job 3 — STALE STATUSLINE (TERM-368). A statusLine enabled before the badge row
  // shipped keeps invoking an artifact that renders no badge at all: not 💎 paid, not
  // ✅ approved, not 💬 unread. It fails silently, so nothing has ever told these users.
  // Measured on a real 0.40.12 install whose cache was fresh and carried
  // founderPaid: {count: 1} — the badge worked and the user could not see it.
  //
  // This TELLS, it does not fix. Repointing writes settings.json, which is the one thing
  // the installer takes explicit consent for; doing it from a hook would route around a
  // disclosure the user is owed. So: name the command, once per hour-slot, and let them
  // choose. Same dedup as the setup nudge, distinct prefix.
  const artifact = installedStatuslineArtifact();
  if (artifact && generationOf(artifact) < STATUSLINE_GENERATION) {
    if (!alreadyNudgedThisSlot('statusline-generation')) {
      process.stderr.write(
        '⚠ your terminalhire statusLine predates the badge row and shows nothing — run: terminalhire statusline --on\n',
      );
    }
  }

  // Job 2 — First-run setup nudge: the hook running means the plugin is installed,
  // but no config.json means `terminalhire init` has never run. Point the
  // user at the one-command setup (where consent + backup happen).
  //
  // Once config.json exists, setup is done — print nothing. Ongoing matches
  // are surfaced by the ambient spinner, not here.
  if (!existsSync(CONFIG_FILE)) {
    if (!alreadyNudgedThisSlot('setup')) {
      process.stderr.write(
        '✦ terminalhire is installed — run: terminalhire init  (1-command setup: job matches in your spinner)\n',
      );
    }
  }

  process.exit(0);
} catch {
  // Fail-closed: never error
  process.exit(0);
}
