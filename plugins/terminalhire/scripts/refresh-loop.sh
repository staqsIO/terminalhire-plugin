#!/usr/bin/env bash
# refresh-loop.sh — terminalhire monitor: keeps job match cache fresh
#
# Runs `terminalhire refresh` once immediately, then sleeps 600s and repeats.
# This is the monitor process launched by Claude Code on SessionStart.
# Fail-closed: errors in refresh are silently ignored.

set -euo pipefail

SLEEP_INTERVAL=${TERMINALHIRE_REFRESH_INTERVAL:-600}

while true; do
  # Run refresh — fail-closed (|| true so the loop continues on error)
  terminalhire refresh 2>/dev/null || true

  sleep "$SLEEP_INTERVAL"
done
