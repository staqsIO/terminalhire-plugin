#!/usr/bin/env node
/**
 * session-nudge.js — SessionStart hook for terminalhire plugin
 *
 * ONE job, prints at most ONE line to stderr:
 *   First-run setup: if the plugin is installed but `terminalhire init` has
 *   never run (no config.json), point the user at the one-command setup.
 *   Consent (spinner job surface) happens inside `terminalhire init`.
 *
 * After setup (config.json exists) this hook prints NOTHING — ongoing matches
 * are surfaced by the ambient spinner, not by a SessionStart nudge.
 *
 * CONTRACT:
 *   - Never prints to stdout (hooks show stderr to user).
 *   - Fail-closed: any error → exit 0, print nothing.
 *   - Never prints file paths, stack traces, or profile data.
 */

import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

const TERMINALHIRE_DIR = join(homedir(), '.terminalhire');
const NUDGE_FILE = join(TERMINALHIRE_DIR, 'nudged.json');
const CONFIG_FILE = join(TERMINALHIRE_DIR, 'config.json');

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
  // First-run setup nudge: the hook running means the plugin is installed,
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
