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
  readFileSync, writeFileSync, copyFileSync, existsSync, mkdirSync, rmSync,
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
  const ask = (question) => new Promise(res => {
    let answered = false;
    rl.question(question, answer => { answered = true; res((answer || '').trim().toLowerCase()); });
    rl.once('close', () => { if (!answered) res(null); });
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
  } catch { /* fall through to empty */ }
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

// Classify an existing statusLine command:
//   'ours'    — already the self-updating launcher (idempotent)
//   'legacy'  — an OLD terminalhire wrapper (npm-pinned .sh / dispatch) → offer re-point
//   'foreign' — someone else's statusLine → chain-wrap + preserve
//   'none'    — no command
function classifyExisting(statusLine) {
  const cmd = statusLine && typeof statusLine.command === 'string' ? statusLine.command : '';
  if (!cmd) return 'none';
  if (cmd.includes('statusline-launch.js')) return 'ours';
  if (
    cmd.includes('statusline-wrapper.sh') ||
    existsSync(LEGACY_WRAPPER) && cmd.includes('.terminalhire') ||
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

  const answer = await ask('Enable the connection-notification statusLine? Type "yes" to continue: ');
  if (answer === null && !process.stdin.isTTY) {
    // Non-interactive stdin with no input — do NOT silently proceed to a prompt that
    // resolves empty and fail-closes. Say so plainly and skip (explicit, not a fake abort).
    console.log('\n  stdin is not interactive — run `terminalhire statusline --on` in a real terminal to enable.');
    asker.close();
    return 0;
  }
  if (answer !== 'yes') {
    console.log('\nAborted — nothing was changed.');
    asker.close();
    return 0;
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
  mkdirSync(TERMINALHIRE_DIR, { recursive: true });

  // Copy the launcher to its stable, version-agnostic home.
  copyFileSync(src, STABLE_LAUNCHER);

  // Chain-wrap a genuinely FOREIGN statusLine: save it verbatim so the launcher runs it
  // first and uninstall can restore it byte-for-byte (V-5/V-8).
  if (kind === 'foreign') {
    writeFileSync(FOREIGN_SIDECAR, JSON.stringify({ statusLine: existing }, null, 2) + '\n', 'utf8');
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
  const isOurs = settings.statusLine
    && typeof settings.statusLine.command === 'string'
    && settings.statusLine.command.includes('statusline-launch.js');

  // Only mutate settings if the current statusLine is ours (never clobber a foreign one
  // the user re-added after install).
  if (isOurs) {
    const backupPath = backupSettings();
    if (existsSync(FOREIGN_SIDECAR)) {
      try {
        const saved = JSON.parse(readFileSync(FOREIGN_SIDECAR, 'utf8'));
        if (saved && saved.statusLine) settings.statusLine = saved.statusLine; // byte-for-byte (V-5)
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
  try { if (existsSync(FOREIGN_SIDECAR)) rmSync(FOREIGN_SIDECAR); } catch { /* best-effort */ }
  try { if (existsSync(STABLE_LAUNCHER)) rmSync(STABLE_LAUNCHER); } catch { /* best-effort */ }

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
    .then(code => process.exit(typeof code === 'number' ? code : 0))
    .catch(err => {
      console.error(`${UNINSTALL ? 'Uninstall' : 'Install'} error:`, err.message);
      process.exit(1);
    });
}

export { install as installStatusline, uninstall as uninstallStatusline, LAUNCHER_COMMAND };
