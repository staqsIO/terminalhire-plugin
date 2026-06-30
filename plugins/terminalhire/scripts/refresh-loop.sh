#!/usr/bin/env bash
# refresh-loop.sh — terminalhire monitor: keeps job match cache fresh
#
# Runs the plugin-bundled engine's `refresh` once immediately, then sleeps 600s
# and repeats. This is the monitor process launched by Claude Code on SessionStart.
# Fail-closed: errors in refresh are silently ignored.
#
# Invokes the bundled engine by absolute path (not the bare `terminalhire` on
# PATH) so the monitor always runs the engine shipped with THIS plugin version —
# immune to a stale npm-global install shadowing it on PATH. Plugin root is taken
# from $1 (passed by the monitor command) and falls back to this script's own
# location via BASH_SOURCE, so it works even if CLAUDE_PLUGIN_ROOT is not exported.

set -euo pipefail

PLUGIN_ROOT="${1:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
DISPATCH="$PLUGIN_ROOT/dist/bin/jpi-dispatch.js"

SLEEP_INTERVAL=${TERMINALHIRE_REFRESH_INTERVAL:-600}

# Singleton guard — reap every OTHER monitor on startup so the NEWEST engine wins.
# Claude Code spawns a monitor per session but they never exited on session end, so
# old-version monitors piled up (one per plugin version ever installed) and RACED on
# the single shared ~/.terminalhire/index-cache.json — an ancient bundled engine
# clobbering fields (e.g. unreadChat) the current one wrote, so the statusline badge
# went stale at random. Kill all other refresh-loop.sh processes (any version/root),
# never ourselves or our launching parent. The pattern requires "bash" so an editor
# with this file open (e.g. `vim refresh-loop.sh`) is NOT matched. Best-effort: if
# pgrep is absent, skip. Known benign race: two monitors starting in the same instant
# can SIGTERM each other → zero monitors; the next session start self-heals it.
if command -v pgrep >/dev/null 2>&1; then
  for _pid in $(pgrep -f "bash.*refresh-loop\.sh" 2>/dev/null || true); do
    case "$_pid" in
      "$$"|"$PPID") continue ;;
      *) kill "$_pid" 2>/dev/null || true ;;
    esac
  done
fi

while true; do
  # Run refresh — fail-closed (|| true so the loop continues on error)
  node "$DISPATCH" refresh 2>/dev/null || true

  sleep "$SLEEP_INTERVAL"
done
