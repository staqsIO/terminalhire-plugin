# terminalhire — Claude Code plugin

Public distribution of the **terminalhire** Claude Code plugin: local-first job
matching for developers, surfaced in the Claude Code spinner while you work.
Matching runs 100% on your machine; your profile never leaves it.

> This repository is a **distribution mirror** — it contains only the published
> plugin bundle and marketplace manifest. It is generated from source on each
> release. Issues and feedback welcome here.

## Install

```bash
bash -c "$(curl -fsSL https://terminalhire.com/install.sh)"
```

Or inside Claude Code:

```
/plugin marketplace add staqsIO/terminalhire-plugin
/plugin install terminalhire@staqs
```

Then run `terminalhire init` (one consent + GitHub sign-in step).

Learn more: https://terminalhire.com · Privacy: https://terminalhire.com/privacy

_Current version: v0.14.0_
