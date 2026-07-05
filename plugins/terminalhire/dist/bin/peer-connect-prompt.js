#!/usr/bin/env node

// bin/peer-connect-prompt.js
import { createInterface } from "readline";

// src/config.ts
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";
var TERMINALHIRE_DIR = join(homedir(), ".terminalhire");
var CONFIG_FILE = join(TERMINALHIRE_DIR, "config.json");
var DEFAULT_CONFIG = {
  nudge: "session",
  peerConnect: false,
  peerConnectPrompted: false,
  resumePublishPrompted: false,
  chatDisclosureAck: false,
  chatShareActivity: false,
  inboundNudgeMuted: false,
  inboundNudgeDisclosed: false,
  contributeEnabled: false,
  contributePrompted: false,
  betaOptIn: false,
  lastFullFeedbackAt: null,
  lastPulseAskAt: null,
  pulseDisclosed: false
};
function readConfig() {
  try {
    if (!existsSync(CONFIG_FILE)) return { ...DEFAULT_CONFIG };
    const raw = readFileSync(CONFIG_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_CONFIG, ...parsed };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}
function writeConfig(config) {
  mkdirSync(TERMINALHIRE_DIR, { recursive: true });
  const current = readConfig();
  const merged = { ...current, ...config };
  writeFileSync(CONFIG_FILE, JSON.stringify(merged, null, 2) + "\n", "utf8");
}

// src/open-url.js
import { spawn } from "child_process";
function openInBrowser(url) {
  let cmd;
  let args;
  if (process.platform === "darwin") {
    cmd = "open";
    args = [url];
  } else if (process.platform === "win32") {
    cmd = "cmd";
    args = ["/c", "start", "", url];
  } else {
    cmd = "xdg-open";
    args = [url];
  }
  try {
    const child = spawn(cmd, args, { stdio: "ignore", detached: true });
    child.on("error", () => {
    });
    child.unref();
  } catch {
  }
}

// bin/peer-connect-prompt.js
var OAUTH_BASE = "https://terminalhire.com";
var PROMPT = [
  "",
  "  Connect with other builders?",
  "",
  "  See peers and founders building what you're building \u2014 matched on your machine,",
  "  so nothing about you leaves it. The only thing ever sent is anonymous: the",
  "  matched person's public username, never yours, never your profile or fingerprint.",
  "",
  "  Change it anytime: terminalhire config --connect on|off",
  "",
  "  Opt in? [y/N]: "
].join("\n");
function buildSupplyPrompt(login) {
  const resumeUrl = login ? `terminalhire.com/r/${login}` : "terminalhire.com/r/<your-login>";
  return [
    "",
    "  Let other builders find you too?",
    "",
    `  Publish your verifiable r\xE9sum\xE9 (${resumeUrl}) \u2014 it lists you in the`,
    "  builder directory so matches are mutual. You'll confirm in your browser; nothing",
    "  is published until you click publish there. Open it now? [y/N]: "
  ].join("\n");
}
async function maybePromptPeerConnect({
  input = process.stdin,
  output = process.stdout,
  isInteractive = Boolean(process.stdin.isTTY && process.stdout.isTTY),
  login,
  openUrl = openInBrowser,
  ask
} = {}) {
  const promptOnce = ask ? async (q) => String(await ask(q) ?? "").trim().toLowerCase() : async (q) => {
    const rl = createInterface({ input, output });
    const a = await new Promise((resolve) => {
      rl.question(q, (x) => {
        rl.close();
        resolve(x);
      });
    });
    return String(a).trim().toLowerCase();
  };
  const cfg = readConfig();
  if (cfg.peerConnectPrompted) {
    return {
      prompted: false,
      peerConnect: cfg.peerConnect === true,
      resumePublishPrompted: cfg.resumePublishPrompted === true,
      resumePublishOpened: false
    };
  }
  if (!isInteractive) {
    return {
      prompted: false,
      peerConnect: cfg.peerConnect === true,
      resumePublishPrompted: cfg.resumePublishPrompted === true,
      resumePublishOpened: false
    };
  }
  const answer = await promptOnce(PROMPT);
  const optedIn = answer === "y" || answer === "yes";
  writeConfig({ peerConnect: optedIn, peerConnectPrompted: true });
  output.write(
    optedIn ? "\n  Peer-connect ON \u2014 peers & founders may surface in your spinner.\n  Turn it off anytime: terminalhire config --connect off\n\n" : "\n  Peer-connect stays OFF. Enable anytime: terminalhire config --connect on\n\n"
  );
  let resumePublishOpened = false;
  if (optedIn && cfg.resumePublishPrompted !== true) {
    const supplyAnswer = await promptOnce(buildSupplyPrompt(login));
    const wantsPublish = supplyAnswer === "y" || supplyAnswer === "yes";
    writeConfig({ resumePublishPrompted: true });
    if (wantsPublish) {
      const next = "/dashboard?publish=1";
      const url = `${OAUTH_BASE}/api/auth/github?next=${encodeURIComponent(next)}`;
      output.write(
        `
  Opening your browser to confirm \u2014 nothing is published until you click
  publish there: ${url}
  (You can also publish anytime from terminalhire.com/dashboard.)

`
      );
      openUrl(url);
      resumePublishOpened = true;
    } else {
      output.write(
        "\n  No worries \u2014 you stay viewer-only (not listed in the directory).\n  Publish anytime from terminalhire.com/dashboard.\n\n"
      );
    }
  }
  return {
    prompted: true,
    peerConnect: optedIn,
    resumePublishPrompted: readConfig().resumePublishPrompted === true,
    resumePublishOpened
  };
}
export {
  maybePromptPeerConnect
};
