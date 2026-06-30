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
  peerConnectPrompted: false
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

// bin/peer-connect-prompt.js
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
async function maybePromptPeerConnect({
  input = process.stdin,
  output = process.stdout,
  isInteractive = Boolean(process.stdin.isTTY && process.stdout.isTTY)
} = {}) {
  const cfg = readConfig();
  if (cfg.peerConnectPrompted) {
    return { prompted: false, peerConnect: cfg.peerConnect === true };
  }
  if (!isInteractive) {
    return { prompted: false, peerConnect: cfg.peerConnect === true };
  }
  const rl = createInterface({ input, output });
  const answer = await new Promise((resolve) => {
    rl.question(PROMPT, (a) => {
      rl.close();
      resolve(String(a).trim().toLowerCase());
    });
  });
  const optedIn = answer === "y" || answer === "yes";
  writeConfig({ peerConnect: optedIn, peerConnectPrompted: true });
  output.write(
    optedIn ? "\n  Peer-connect ON \u2014 peers & founders may surface in your spinner.\n  Turn it off anytime: terminalhire config --connect off\n\n" : "\n  Peer-connect stays OFF. Enable anytime: terminalhire config --connect on\n\n"
  );
  return { prompted: true, peerConnect: optedIn };
}
export {
  maybePromptPeerConnect
};
