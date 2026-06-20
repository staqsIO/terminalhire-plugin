---
name: claim
description: Claim a bounty and track it through to a merged PR (runs terminalhire claim). Use when the user wants to claim, pick up, start, or track a bounty/paid task, check claim status, or see their accepted-PR rate. Pair with the bounties skill (which lists claimable IDs).
---

# terminalhire:claim

The claim→execute→submit loop. Bounties are listed by the `bounties` skill; **claim** records one locally and tracks it through to a merged PR. All state is local (`~/.terminalhire/claims.json`) — claim activity never leaves the machine; the only network is public GitHub reads (open-PR race signal, PR merge state).

Invoke the bundled engine in a Bash tool call. Pick the subcommand that matches the request:

**Where does the ID come from?** The `id:` line in `terminalhire bounties` output (e.g. `bounty:opire:01HTN…` or `bounty:commaai/opendbc#3426`). If the user hasn't picked one yet, run the `bounties` skill first so they can choose. You can also pass a raw GitHub issue URL instead of an ID.

### Claim a bounty (preview → confirm → record)

**Always preview and confirm before recording.** Claiming is a commitment — show the dev *what* they're about to take and let them approve it first. Never run `claim record` without the confirm step below.

1. **Preview (read-only — does NOT claim):**
   ```bash
   node "${CLAUDE_PLUGIN_ROOT}/dist/bin/jpi-dispatch.js" claim preview <bountyId|issueUrl> --json
   ```
   Parse the single JSON line: `{ bountyId, title, amountUSD, repoFullName, issueUrl, issueState, openPRs }`.

2. **Confirm via a styled `AskUserQuestion`.** One question — *"Claim this bounty?"* — with options **"Claim it"** (recommended, listed first) and **"Cancel"**. Put a terminal-styled card in the `preview` field of the **Claim it** option so it renders inline. Build the card from the JSON:
   ```
   $ terminalhire claim
   // BOUNTY · <repoFullName>#<n>

     <title>

     amount   <"$"+amountUSD, or "unlisted" when null>
     repo     <repoFullName>
     issue    <issueUrl>
     <race line — see below>

     → records the claim locally; you still review the
       diff before any push (nothing is sent anywhere)
   ```
   Race / guard line, from the JSON:
   - `openPRs > 0` → `⚠ <openPRs> open PRs already reference this — the race is real`
   - `openPRs === 0` → `no open PRs reference this yet`
   - `openPRs === null` → `open PRs: unknown — verify on the issue before working`

   **If `issueState === "closed"`: do NOT show the confirm card and do NOT call `claim record`.** Tell the dev the issue is closed and can't be claimed (the pool drops closed issues — likely a stale cache entry; suggest `terminalhire bounties` for the current pool), then stop.

3. **Record only if the dev picks "Claim it":**
   ```bash
   node "${CLAUDE_PLUGIN_ROOT}/dist/bin/jpi-dispatch.js" claim record <bountyId|issueUrl>
   ```
   On **Cancel** (or a closed issue), do not record — tell the dev nothing was claimed. `claim record` prints the executor brief and re-checks the live open-PR race at commit time.

### Track claims and the metric
```bash
node "${CLAUDE_PLUGIN_ROOT}/dist/bin/jpi-dispatch.js" claim list            # all claims + accepted-PR rate
node "${CLAUDE_PLUGIN_ROOT}/dist/bin/jpi-dispatch.js" claim list --active   # exclude merged/abandoned
node "${CLAUDE_PLUGIN_ROOT}/dist/bin/jpi-dispatch.js" claim status [<id>]   # poll source PR merge state → updates the metric
```

### Advance a claim (hand-cranking, until `submit` exists)
```bash
node "${CLAUDE_PLUGIN_ROOT}/dist/bin/jpi-dispatch.js" claim update <id> <state> [prUrl]
node "${CLAUDE_PLUGIN_ROOT}/dist/bin/jpi-dispatch.js" claim release <id>
```
States: `claimed` → `working` → `in-review` → `ready` → `submitted` → `merged` (or `abandoned`). When the user opens their PR, attach it: `claim update <id> submitted <prUrl>` — then `claim status` polls its merge state and rolls it into the **accepted-PR rate** (merged ÷ claimed), the one metric that matters.

## Doing the work (executor guardrails)

If the user asks you to actually DO a claimed bounty, work it in an **isolated git worktree**, and enforce these guardrails (a slop PR under the user's GitHub identity is permanent and damages their reputation):
- **Never `git push` or `gh pr`** — the user reviews the diff first and pushes deliberately.
- Clone + read the issue + write a patch. **Do not run the repo's tests/build** without the user's explicit go-ahead (it is arbitrary third-party code).
- Never read or pass `~/.terminalhire/*` or the user's tokens into the work — the bounty work never needs the profile.

> Invoke the plugin-bundled engine via `${CLAUDE_PLUGIN_ROOT}` so a plugin update is the only update needed. If `$CLAUDE_PLUGIN_ROOT` is unset (running outside Claude Code), fall back to `terminalhire claim …`.
