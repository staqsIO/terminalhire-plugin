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

import { readFileSync, existsSync, mkdirSync, writeFileSync, renameSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';

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
    mkdirSync(TERMINALHIRE_DIR, { recursive: true });
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
  } catch { /* ignore */ }

  if (nudged[sessionKey]) return true;

  nudged[sessionKey] = Date.now();
  // Prune old entries (> 24h)
  const cutoff = Date.now() - 86_400_000;
  for (const [k, v] of Object.entries(nudged)) {
    if (typeof v === 'number' && v < cutoff) delete nudged[k];
  }
  try {
    mkdirSync(TERMINALHIRE_DIR, { recursive: true });
    writeFileSync(NUDGE_FILE, JSON.stringify(nudged), 'utf8');
  } catch { /* non-fatal */ }
  return false;
}

try {
  // Job 1: refresh the self-updating statusLine pointer every session (silent, always).
  writeEnginePointer();

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
