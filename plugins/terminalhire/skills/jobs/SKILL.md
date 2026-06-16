---
name: jobs
description: Show the developer's locally-matched job roles (runs terminalhire jobs). Use when the user asks about job matches, openings, or to see terminalhire results.
---

# terminalhire:jobs

Run the bundled terminalhire engine in a Bash tool call to display your top matched job roles:

```bash
node "${CLAUDE_PLUGIN_ROOT}/dist/bin/jpi-dispatch.js" jobs
```

The output is ranked locally — no profile data is sent. Each listing shows title, company, match score, and an apply link.

Append `--limit N` to show more results, `--remote-only` to filter to remote roles, or `--all` to show every match.

> Note: invoke the plugin-bundled engine via `${CLAUDE_PLUGIN_ROOT}` so a plugin update is the only update needed (no separate `npm` step). If `$CLAUDE_PLUGIN_ROOT` is unset — e.g. running outside Claude Code — fall back to the standalone command `terminalhire jobs`.
