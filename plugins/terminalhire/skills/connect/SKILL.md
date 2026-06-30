---
name: connect
description: Discover opted-in developers & founders matched locally, and request a double-opt-in intro (runs terminalhire devs / project / intro). Use when the user wants to find peers or builders, see who they match with, declare a project to staff, or connect with another developer.
---

# terminalhire:connect

Privacy-preserving dev↔dev / founder↔builder connection: discover opted-in people matched **locally** to your work, then exchange contact only through a **double-opt-in** intro. No profile data is ever sent for matching — only an intro you explicitly approve crosses the wire.

## Discover people & projects

Rank opted-in developers (and founders' projects) locally against your profile:

```bash
node "${CLAUDE_PLUGIN_ROOT}/dist/bin/jpi-dispatch.js" devs
```

Each result shows the person/project, a match score, the "why matched" tags, and a verifiable `/r/<login>` credential link. The directory is downloaded anonymously; matching runs on-device.

## Founder side — staff a project

Declare a project locally (it never leaves your machine), then rank builders for it:

```bash
node "${CLAUDE_PLUGIN_ROOT}/dist/bin/jpi-dispatch.js" project "Shopify analytics app: react, typescript, postgres"
node "${CLAUDE_PLUGIN_ROOT}/dist/bin/jpi-dispatch.js" devs --as-project
```

## Request a connection (double-opt-in)

Request a consented intro to someone you matched with:

```bash
node "${CLAUDE_PLUGIN_ROOT}/dist/bin/jpi-dispatch.js" intro <github-login>
```

A typed-`yes` gate shows **exactly** what crosses the wire (your login + chosen display name + chosen contact + optional note). The target is emailed with only your public login — no contact is shared until they accept.

Accept or review incoming requests:

```bash
node "${CLAUDE_PLUGIN_ROOT}/dist/bin/jpi-dispatch.js" intro --list           # pending intros
node "${CLAUDE_PLUGIN_ROOT}/dist/bin/jpi-dispatch.js" intro --accept <id>     # accept → contacts exchanged
```

Contacts are exchanged **only on mutual accept**; declining exchanges nothing, and either party can delete an intro at any time.

> To appear in the directory yourself, publish your résumé (`resume_public`) from the dashboard — only opted-in developers are discoverable.

> Note: invoke the plugin-bundled engine via `${CLAUDE_PLUGIN_ROOT}` so a plugin update is the only update needed (no separate `npm` step). If `$CLAUDE_PLUGIN_ROOT` is unset — e.g. running outside Claude Code — fall back to the standalone commands `terminalhire devs` / `terminalhire project` / `terminalhire intro`.
