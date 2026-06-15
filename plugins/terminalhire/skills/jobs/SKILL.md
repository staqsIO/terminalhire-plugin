---
name: jobs
description: Show the developer's locally-matched job roles (runs terminalhire jobs). Use when the user asks about job matches, openings, or to see terminalhire results.
---

# terminalhire:jobs

Run `terminalhire jobs` in a Bash tool call to display your top matched job roles.

The output is ranked locally — no profile data is sent. Each listing shows title, company, match score, and an apply link.

```bash
terminalhire jobs
```

Use `--limit N` to show more results, `--remote-only` to filter to remote roles, or `--all` to show every match.
