#!/usr/bin/env node
/**
 * postinstall.js — print-only notice after `npm install terminalhire`
 *
 * ToS / safety guarantee:
 *   - PRINT ONLY. No config edits. No network calls. No file writes.
 *   - Always exits 0 (never fails the install).
 *   - No-op if non-interactive / CI (TERM=dumb, CI=true, etc.).
 */

// Skip in CI / non-interactive environments
const isCI =
  process.env['CI'] === 'true' ||
  process.env['CI'] === '1' ||
  process.env['CONTINUOUS_INTEGRATION'] === 'true' ||
  process.env['TERM'] === 'dumb' ||
  !process.stdout.isTTY;

if (!isCI) {
  process.stdout.write('\n');
  process.stdout.write('  ┌───────────────────────────────────────────────────────────────┐\n');
  process.stdout.write('  │  terminalhire installed — activate the Claude Code nudge:     │\n');
  process.stdout.write('  │                                                               │\n');
  process.stdout.write('  │    terminalhire init                                          │\n');
  process.stdout.write('  │                                                               │\n');
  process.stdout.write('  │  This runs one-command onboarding: optional GitHub sign-in,  │\n');
  process.stdout.write('  │  seeds your local job cache, then installs the statusLine     │\n');
  process.stdout.write('  │  hook — with your explicit consent at every step.             │\n');
  process.stdout.write('  │                                                               │\n');
  process.stdout.write('  │  No config is changed until you run that command.             │\n');
  process.stdout.write('  └───────────────────────────────────────────────────────────────┘\n');
  process.stdout.write('\n');
}

process.exit(0);
