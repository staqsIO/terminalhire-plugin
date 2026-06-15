---
name: bounties
description: Show day-sized paid bounties the developer could knock out today (runs terminalhire bounties). Use when the user asks about bounties, paid tasks, gigs, side projects, or wants to make money from open issues while working.
---

# terminalhire:bounties

Run `terminalhire bounties` in a Bash tool call to display day-sized paid bounties — open, funded tasks the developer could knock out alongside their own work.

The list is ranked locally — no profile data is sent. Each bounty shows the `$` amount, effort, source repo (with stars), a local match score when it fits the developer's profile, and a claim link that goes straight to the source platform (terminalhire never touches payment).

```bash
terminalhire bounties
```

Use `--priced` to show only bounties with a known dollar amount, `--limit N` to change how many are shown, or `--all` to list every bounty.
