// src/config.ts
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";

// src/state-dir.ts
import { closeSync, constants, fchmodSync, fstatSync, mkdirSync, openSync } from "fs";
var STATE_DIR_MODE = 448;
var STATE_DIR_OK = "ok";
var STATE_DIR_SYMLINK = "symlink";
var STATE_DIR_UNVERIFIED = "unverified";
var warnedDirs = /* @__PURE__ */ new Set();
function warnStateDirOnce(dir, message) {
  if (warnedDirs.has(dir)) return;
  warnedDirs.add(dir);
  try {
    process.stderr.write(message);
  } catch {
  }
}
function ensureStateDir(dir) {
  mkdirSync(dir, { recursive: true, mode: STATE_DIR_MODE });
  const noFollow = constants.O_NOFOLLOW ?? 0;
  let fd;
  try {
    fd = openSync(dir, constants.O_RDONLY | noFollow);
  } catch (err) {
    if (err?.code === "ELOOP") {
      warnStateDirOnce(
        dir,
        `terminalhire: ${dir} is a symlink \u2014 leaving its permissions alone; the 0700 guarantee on the state directory is NOT enforced.
`
      );
      return STATE_DIR_SYMLINK;
    }
    return STATE_DIR_UNVERIFIED;
  }
  try {
    const currentMode = fstatSync(fd).mode & 511;
    if ((currentMode & ~STATE_DIR_MODE) !== 0) {
      fchmodSync(fd, currentMode & STATE_DIR_MODE);
    }
    return STATE_DIR_OK;
  } catch {
    return STATE_DIR_UNVERIFIED;
  } finally {
    try {
      closeSync(fd);
    } catch {
    }
  }
}

// src/config.ts
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
  ensureStateDir(TERMINALHIRE_DIR);
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
