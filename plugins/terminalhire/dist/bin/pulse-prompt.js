#!/usr/bin/env node

// bin/pulse-prompt.js
import { createInterface } from "readline";
import { readFileSync as readFileSync3, existsSync as existsSync3 } from "fs";
import { join as join3 } from "path";
import { fileURLToPath } from "url";

// src/web-session.ts
import {
  chmodSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync
} from "fs";
import { homedir } from "os";
import { join } from "path";
function terminalhireDir() {
  return process.env.TERMINALHIRE_DIR || join(homedir(), ".terminalhire");
}
function webSessionFilePath() {
  return join(terminalhireDir(), "web-session");
}
function readWebSessionFile() {
  try {
    const path = webSessionFilePath();
    if (!existsSync(path)) return null;
    const v = readFileSync(path, "utf8").trim();
    return v.length > 0 ? v : null;
  } catch {
    return null;
  }
}
function readWebSessionCookie() {
  const fromFile = readWebSessionFile();
  if (fromFile) return fromFile;
  const env = process.env["TERMINALHIRE_WEB_SESSION"];
  return typeof env === "string" && env.length > 0 ? env : null;
}

// src/config.ts
import { readFileSync as readFileSync2, writeFileSync as writeFileSync2, mkdirSync as mkdirSync2, existsSync as existsSync2 } from "fs";
import { join as join2 } from "path";
import { homedir as homedir2 } from "os";
var TERMINALHIRE_DIR = process.env.TERMINALHIRE_DIR || join2(homedir2(), ".terminalhire");
var CONFIG_FILE = join2(TERMINALHIRE_DIR, "config.json");
var DEFAULT_CONFIG = {
  nudge: "session",
  peerConnect: false,
  peerConnectPrompted: false,
  resumePublishPrompted: false,
  chatDisclosureAck: false,
  chatShareActivity: false,
  inboundNudgeMuted: false,
  inboundNudgeDisclosed: false,
  contributeEnabled: true,
  betaOptIn: false,
  lastFullFeedbackAt: null,
  lastPulseAskAt: null,
  pulseDisclosed: false,
  mix: "balanced"
};
function readConfig() {
  try {
    if (!existsSync2(CONFIG_FILE)) return { ...DEFAULT_CONFIG };
    const raw = readFileSync2(CONFIG_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_CONFIG, ...parsed };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}
function writeConfig(config) {
  mkdirSync2(TERMINALHIRE_DIR, { recursive: true });
  const current = readConfig();
  const merged = { ...current, ...config };
  if ("contributePrompted" in merged) {
    if (merged.contributeEnabled === false && !("contributeEnabled" in config)) {
      delete merged.contributeEnabled;
    }
    delete merged.contributePrompted;
  }
  writeFileSync2(CONFIG_FILE, JSON.stringify(merged, null, 2) + "\n", "utf8");
}

// bin/pulse-prompt.js
var __dirname = fileURLToPath(new URL(".", import.meta.url));
var API_BASE = process.env["TERMINALHIRE_API_URL"] || "https://terminalhire.com";
var GH_SESSION_COOKIE = "__jpi_gh_session";
var PULSE_ASK_INTERVAL_MS = 24 * 60 * 60 * 1e3;
function readLocalVersion() {
  try {
    for (const p of [join3(__dirname, "..", "..", "package.json"), join3(__dirname, "..", "package.json")]) {
      if (existsSync3(p)) {
        const pkg = JSON.parse(readFileSync3(p, "utf8"));
        if (pkg.version) return pkg.version;
      }
    }
  } catch {
  }
  return null;
}
async function maybeAskPulse() {
  if (!(process.stdout.isTTY && process.stdin.isTTY)) return;
  const config = readConfig();
  if (config.betaOptIn !== true) return;
  const cookie = readWebSessionCookie();
  if (!cookie) return;
  const last = config.lastPulseAskAt;
  if (last && Date.now() - Date.parse(last) < PULSE_ASK_INTERVAL_MS) return;
  if (config.pulseDisclosed !== true) {
    console.log("");
    console.log("  \u2726 Heads up: terminalhire will occasionally (max once a day) ask you to");
    console.log("    rate it 0\u20133. Replying sends ONLY that number + your CLI version/OS;");
    console.log("    Enter always skips and sends nothing.");
    writeConfig({ pulseDisclosed: true, lastPulseAskAt: (/* @__PURE__ */ new Date()).toISOString() });
    return;
  }
  writeConfig({ lastPulseAskAt: (/* @__PURE__ */ new Date()).toISOString() });
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const ask = (question) => new Promise((resolve) => {
    const onClose = () => resolve(null);
    rl.once("close", onClose);
    rl.question(question, (answer2) => {
      rl.removeListener("close", onClose);
      resolve((answer2 || "").trim());
    });
  });
  const answer = await ask(
    "  \u2726 Quick pulse \u2014 how's terminalhire? 0\u20133 (Enter skips; a reply sends ONLY the score + CLI version/OS): "
  );
  rl.close();
  if (!/^[0-3]$/.test(answer || "")) {
    console.log("  (skipped \u2014 nothing sent)");
    return;
  }
  const pulse = Number.parseInt(answer, 10);
  const cliVersion = readLocalVersion() || "unknown";
  const os = process.platform;
  let res;
  try {
    res = await fetch(`${API_BASE}/api/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: `${GH_SESSION_COOKIE}=${cookie}` },
      body: JSON.stringify({ category: "pulse", pulse, cliVersion, os }),
      signal: AbortSignal.timeout(1e4)
    });
  } catch {
    console.log("  (could not send your pulse just now \u2014 no worries)");
    return;
  }
  if (!res.ok) {
    console.log("  (could not log your pulse right now \u2014 thanks anyway)");
    return;
  }
  console.log("  \u2713 Thanks \u2014 logged.");
}
export {
  maybeAskPulse
};
