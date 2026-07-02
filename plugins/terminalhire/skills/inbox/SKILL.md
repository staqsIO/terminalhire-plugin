---
name: inbox
description: Show and triage the developer's terminalhire inbox — unread chats, connections, and pending invitations — as one selectable list (runs terminalhire chat --inbox via the bundled engine). Use when the user says /inbox, asks "what's in my inbox", wants to see unread messages and invitations together, or reacts to the statusline's 💬 unread / ✉ intro-request badge.
---

# terminalhire:inbox

One triage surface for everything waiting on the developer: pending invitations, unread chats, and their connections — the in-session counterpart of the `th inbox` interactive TUI (which they run themselves in a plain terminal; NEVER launch that raw-mode TUI from a skill).

This skill is a thin front door over the same flow as `terminalhire:chat` — follow that skill's picker pattern:

1. Get current state via the bundled engine (never a global PATH binary):

```bash
node "${CLAUDE_PLUGIN_ROOT}/dist/bin/jpi-dispatch.js" chat --inbox
```

2. If anything is actionable, present ONE `AskUserQuestion` list — most-actionable first: `Accept @<login>` for each pending invitation (→ `… intro --accept @<login>`), `Open @<login> · 💬 N unread` (→ `… chat <login> --read`), then read connections, plus a plain escape option ("Just show the inbox").
3. After a pick, run the matching command inline and report; offer a reply (`… chat <login> --send "…"`) or chain to the next item.
4. If the user prefers to drive it themselves, point them at **`th inbox`** — the full-screen interactive inbox (arrow keys, Enter to open a thread, Esc back, accept/decline invitations inline) for their own terminal.

Privacy is unchanged from the chat skill: E2E messages, ciphertext-only wire, web-session cookie auth — the GitHub token never leaves the machine.
