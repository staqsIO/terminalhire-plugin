---
name: chat
description: Read and reply to your terminalhire connection chats inline, without leaving the session (runs terminalhire chat --inbox / --read / --send). Use when the user wants to check messages, see who has messaged them, read a conversation with a connection, or reply to a developer they connected with.
---

# terminalhire:chat

Read and reply to your end-to-end-encrypted connection chats **inline** in this session — no terminal takeover, no window switch. Messages are E2E encrypted with keys that stay on the device; only ciphertext crosses the wire, and the connection check uses the existing web-session cookie (the GitHub token never leaves the machine).

These are the **on-demand** reader modes — each prints into the conversation and exits. (The live both-typing pane, `terminalhire chat <login>` with no flag, is a separate raw-mode TUI and is **not** used here.)

## Inbox — who has messaged me

One line per accepted connection: a presence dot (●/○), an unread marker (✉ N), the last timestamp, and a short preview.

```bash
node "${CLAUDE_PLUGIN_ROOT}/dist/bin/jpi-dispatch.js" chat --inbox
```

## Read a thread

Print a conversation, one line per message (`HH:MMa  @sender  text`). Defaults to the last ~8 messages; use `-n N` or `--all` for more depth (then scroll the terminal's own scrollback).

```bash
node "${CLAUDE_PLUGIN_ROOT}/dist/bin/jpi-dispatch.js" chat <github-login> --read
node "${CLAUDE_PLUGIN_ROOT}/dist/bin/jpi-dispatch.js" chat <github-login> --read -n 30
node "${CLAUDE_PLUGIN_ROOT}/dist/bin/jpi-dispatch.js" chat <github-login> --read --all
```

Reading a thread advances the local last-read cursor, so the inbox's unread count reflects what you've already seen.

## Reply

Send one line to a connection (encrypted before it leaves the machine):

```bash
node "${CLAUDE_PLUGIN_ROOT}/dist/bin/jpi-dispatch.js" chat <github-login> --send "sure, after this build"
```

Tell the user they can reply with `/chat <login> "…"` or directly via `terminalhire chat <login> --send "…"`, and re-read with `terminalhire chat <login> --read`.

## Notes

- Chat is only available for an **accepted** intro. To connect first, use the `connect` skill (`terminalhire intro <login>`).
- The first chat action shows a one-time privacy notice that must be acknowledged **interactively** — if the inbox/read/send reports it needs acknowledgement, have the user run `terminalhire chat <login>` once in their own terminal to accept it, then retry.
- Invoke the plugin-bundled engine via `${CLAUDE_PLUGIN_ROOT}` so a plugin update is the only update needed. If `$CLAUDE_PLUGIN_ROOT` is unset (e.g. running outside Claude Code), fall back to the standalone commands `terminalhire chat --inbox` / `terminalhire chat <login> --read` / `terminalhire chat <login> --send "…"`.
