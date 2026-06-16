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

while true; do
  # Run refresh — fail-closed (|| true so the loop continues on error)
  node "$DISPATCH" refresh 2>/dev/null || true

  sleep "$SLEEP_INTERVAL"
done
