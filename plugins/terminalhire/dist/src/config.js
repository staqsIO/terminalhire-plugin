// src/config.ts
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";
var TERMINALHIRE_DIR = process.env.TERMINALHIRE_DIR || join(homedir(), ".terminalhire");
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
  contributeEnabled: true,
  betaOptIn: false,
  lastFullFeedbackAt: null,
  lastPulseAskAt: null,
  pulseDisclosed: false,
  mix: "balanced"
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
  if ("contributePrompted" in merged) {
    if (merged.contributeEnabled === false && !("contributeEnabled" in config)) {
      delete merged.contributeEnabled;
    }
    delete merged.contributePrompted;
  }
  writeFileSync(CONFIG_FILE, JSON.stringify(merged, null, 2) + "\n", "utf8");
}
function parseNudgeMode(raw) {
  if (raw === "session" || raw === "always") return raw;
  const m = /^every:(\d+)$/.exec(raw);
  if (m) {
    const n = parseInt(m[1], 10);
    if (n >= 1) return `every:${n}`;
  }
  return null;
}
function parseSurfaceMix(raw) {
  if (raw === "jobs" || raw === "balanced" || raw === "credential") return raw;
  return null;
}
function getSurfaceMix() {
  const envVal = process.env["TH_MIX"];
  if (envVal) {
    const parsed = parseSurfaceMix(envVal);
    if (parsed) return parsed;
  }
  const config = readConfig();
  return parseSurfaceMix(config.mix) ?? "balanced";
}
function getNudgeMode() {
  const envVal = process.env["TERMINALHIRE_NUDGE"];
  if (envVal) {
    const parsed = parseNudgeMode(envVal);
    if (parsed) return parsed;
  }
  const config = readConfig();
  return config.nudge ?? "session";
}
function isPeerConnectEnabled() {
  return readConfig().peerConnect === true;
}
function isInboundNudgeMuted() {
  return readConfig().inboundNudgeMuted === true;
}
function isContributeEnabled() {
  const cfg = readConfig();
  return !(cfg.contributeEnabled === false && !("contributePrompted" in cfg));
}
function isBetaOptIn() {
  return readConfig().betaOptIn === true;
}
export {
  getNudgeMode,
  getSurfaceMix,
  isBetaOptIn,
  isContributeEnabled,
  isInboundNudgeMuted,
  isPeerConnectEnabled,
  parseNudgeMode,
  parseSurfaceMix,
  readConfig,
  writeConfig
};
