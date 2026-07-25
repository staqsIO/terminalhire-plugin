// bin/spinner-io.js
import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync as mkdirSync2,
  renameSync,
  openSync as openSync2,
  closeSync as closeSync2,
  fsyncSync,
  fchmodSync as fchmodSync2,
  statSync,
  lstatSync,
  realpathSync,
  readlinkSync,
  unlinkSync
} from "fs";
import { join, dirname, basename, resolve, isAbsolute } from "path";
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

// bin/spinner-io.js
function thDir() {
  const raw = process.env["TERMINALHIRE_DIR"] || join(homedir(), ".terminalhire");
  return resolve(raw);
}
function claudeSettingsPath() {
  return process.env["TERMINALHIRE_CLAUDE_SETTINGS"] || join(homedir(), ".claude", "settings.json");
}
function spinnerStateFilePath() {
  return join(thDir(), "spinner-state.json");
}
function readJson(path, fallback) {
  try {
    return existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : fallback;
  } catch {
    return fallback;
  }
}
function readSettings(path) {
  let raw;
  try {
    raw = readFileSync(path, "utf8");
  } catch (err) {
    const code = err && err.code;
    if (code === "ENOENT") return { status: "absent", data: {}, raw: null };
    return { status: "unreadable", data: null, raw: null, reason: code || "read-failed" };
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { status: "unreadable", data: null, raw, reason: "malformed-json" };
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return { status: "unreadable", data: null, raw, reason: "not-an-object" };
  }
  return { status: "ok", data: parsed, raw };
}
function resolveTarget(path) {
  try {
    return realpathSync(path);
  } catch {
  }
  let cur = path;
  let settled = false;
  for (let hop = 0; hop < MAX_LINK_HOPS; hop++) {
    let next;
    try {
      if (!lstatSync(cur).isSymbolicLink()) {
        settled = true;
        break;
      }
      const dest = readlinkSync(cur);
      next = isAbsolute(dest) ? dest : join(dirname(cur), dest);
    } catch {
      settled = true;
      break;
    }
    cur = next;
  }
  if (!settled) return null;
  if (cur !== path) return cur;
  try {
    return join(realpathSync(dirname(path)), basename(path));
  } catch {
    return path;
  }
}
var MAX_LINK_HOPS = 32;
var tmpCounter = 0;
function writeFileAtomic(target, text) {
  let mode = null;
  try {
    mode = statSync(target).mode & 511;
  } catch {
  }
  const tmp = `${target}.tmp-${process.pid}-${tmpCounter++}`;
  let fd;
  try {
    fd = openSync2(tmp, "wx");
  } catch (err) {
    if (!err || err.code !== "EEXIST") throw err;
    unlinkSync(tmp);
    fd = openSync2(tmp, "wx");
  }
  try {
    writeFileSync(fd, text, "utf8");
    if (mode !== null) fchmodSync2(fd, mode);
    fsyncSync(fd);
  } finally {
    closeSync2(fd);
  }
  try {
    renameSync(tmp, target);
  } catch (err) {
    try {
      unlinkSync(tmp);
    } catch {
    }
    throw err;
  }
}
function atomicWriteJson(path, obj) {
  if (dirname(path) === thDir()) {
    ensureStateDir(thDir());
  } else {
    mkdirSync2(dirname(path), { recursive: true });
  }
  writeFileAtomic(path, JSON.stringify(obj, null, 2) + "\n");
}
function writeSettingsJson(path, obj, expectedRaw) {
  const target = resolveTarget(path);
  if (target === null) return false;
  let currentRaw = null;
  try {
    currentRaw = readFileSync(target, "utf8");
  } catch (err) {
    if (!err || err.code !== "ENOENT") return false;
  }
  if (currentRaw !== expectedRaw) return false;
  mkdirSync2(dirname(target), { recursive: true });
  writeFileAtomic(target, JSON.stringify(obj, null, 2) + "\n");
  return true;
}
function __writeSettingsJsonForTests(path, obj, expectedRaw) {
  return writeSettingsJson(path, obj, expectedRaw);
}
function readState() {
  return readJson(spinnerStateFilePath(), { verbs: [], mode: "replace" });
}
function writeState(patch) {
  const st = readState();
  atomicWriteJson(spinnerStateFilePath(), { ...st, ...patch, ts: Date.now() });
}
function claimUnion(key, prev, next, extra) {
  writeState({ [key]: [.../* @__PURE__ */ new Set([...prev, ...next])], ...extra });
}
function applySpinnerVerbs(ourVerbs, mode = "replace") {
  const CLAUDE_SETTINGS = claudeSettingsPath();
  const verbs = (Array.isArray(ourVerbs) ? ourVerbs : []).filter(Boolean);
  if (verbs.length === 0) return clearSpinnerVerbs();
  const read = readSettings(CLAUDE_SETTINGS);
  if (read.status === "unreadable") {
    return { applied: 0, total: 0, skipped: true, reason: read.reason };
  }
  const settings = read.data;
  const present = Object.prototype.hasOwnProperty.call(settings, "spinnerVerbs");
  const existing = settings.spinnerVerbs && typeof settings.spinnerVerbs === "object" && !Array.isArray(settings.spinnerVerbs) ? settings.spinnerVerbs : null;
  if (present && (!existing || !Array.isArray(existing.verbs))) {
    return { applied: 0, total: 0, skipped: true, reason: "unrecognised-spinnerVerbs" };
  }
  const prevOurs = new Set(readState().verbs || []);
  const userVerbs = existing ? existing.verbs.filter((v) => !prevOurs.has(v)) : [];
  const newVerbs = [...verbs, ...userVerbs];
  settings.spinnerVerbs = { mode: mode === "append" ? "append" : "replace", verbs: newVerbs };
  claimUnion("verbs", prevOurs, verbs);
  if (!writeSettingsJson(CLAUDE_SETTINGS, settings, read.raw)) {
    return { applied: 0, total: 0, skipped: true, reason: "settings-changed" };
  }
  writeState({ verbs, mode });
  return { applied: verbs.length, total: newVerbs.length };
}
function clearSpinnerVerbs() {
  const CLAUDE_SETTINGS = claudeSettingsPath();
  const read = readSettings(CLAUDE_SETTINGS);
  if (read.status === "unreadable") {
    return { cleared: false, keptUserVerbs: 0, skipped: true, reason: read.reason };
  }
  const settings = read.data;
  const prevOurs = new Set(readState().verbs || []);
  let keptUserVerbs = 0;
  if (settings.spinnerVerbs && Array.isArray(settings.spinnerVerbs.verbs)) {
    const userVerbs = settings.spinnerVerbs.verbs.filter((v) => !prevOurs.has(v));
    keptUserVerbs = userVerbs.length;
    if (userVerbs.length > 0) {
      settings.spinnerVerbs = {
        mode: settings.spinnerVerbs.mode === "append" ? "append" : "replace",
        verbs: userVerbs
      };
    } else {
      delete settings.spinnerVerbs;
    }
    if (!writeSettingsJson(CLAUDE_SETTINGS, settings, read.raw)) {
      return { cleared: false, keptUserVerbs: 0, skipped: true, reason: "settings-changed" };
    }
  }
  try {
    writeState({ verbs: [], mode: readState().mode || "replace" });
  } catch {
  }
  return { cleared: true, keptUserVerbs };
}
function applySpinnerTips(ourTips) {
  const CLAUDE_SETTINGS = claudeSettingsPath();
  const tips = (Array.isArray(ourTips) ? ourTips : []).filter(Boolean);
  if (tips.length === 0) return clearSpinnerTips();
  const read = readSettings(CLAUDE_SETTINGS);
  if (read.status === "unreadable") {
    return { applied: 0, skipped: true, reason: read.reason };
  }
  const settings = read.data;
  const present = Object.prototype.hasOwnProperty.call(settings, "spinnerTipsOverride");
  const override = settings.spinnerTipsOverride && typeof settings.spinnerTipsOverride === "object" && Array.isArray(settings.spinnerTipsOverride.tips) ? settings.spinnerTipsOverride : null;
  if (present && !override) {
    return { applied: 0, skipped: true, reason: "unrecognised-spinnerTipsOverride" };
  }
  const st = readState();
  const prevOurs = new Set(st.tips || []);
  const userTips = override ? override.tips.filter((t) => !prevOurs.has(t)) : [];
  const hasOwn = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
  const tipsPrev = prevOurs.size === 0 || !st.tipsPrev ? {
    enabled: hasOwn(settings, "spinnerTipsEnabled") ? settings.spinnerTipsEnabled : void 0,
    excludeDefault: override && hasOwn(override, "excludeDefault") ? override.excludeDefault : void 0
  } : st.tipsPrev;
  settings.spinnerTipsEnabled = true;
  settings.spinnerTipsOverride = { excludeDefault: true, tips: [...tips, ...userTips] };
  claimUnion("tips", prevOurs, tips, { tipsPrev });
  if (!writeSettingsJson(CLAUDE_SETTINGS, settings, read.raw)) {
    return { applied: 0, skipped: true, reason: "settings-changed" };
  }
  writeState({ tips, tipsPrev });
  return { applied: tips.length };
}
function clearSpinnerTips() {
  const CLAUDE_SETTINGS = claudeSettingsPath();
  const read = readSettings(CLAUDE_SETTINGS);
  if (read.status === "unreadable") {
    return { cleared: false, skipped: true, reason: read.reason };
  }
  const settings = read.data;
  const st = readState();
  const prevOurs = new Set(st.tips || []);
  const tipsPrev = st.tipsPrev || {};
  if (settings.spinnerTipsOverride && Array.isArray(settings.spinnerTipsOverride.tips)) {
    const userTips = settings.spinnerTipsOverride.tips.filter((t) => !prevOurs.has(t));
    if (userTips.length > 0) {
      settings.spinnerTipsOverride = {
        excludeDefault: tipsPrev.excludeDefault !== void 0 ? tipsPrev.excludeDefault : settings.spinnerTipsOverride.excludeDefault === true,
        tips: userTips
      };
    } else {
      delete settings.spinnerTipsOverride;
      if (tipsPrev.enabled !== void 0) settings.spinnerTipsEnabled = tipsPrev.enabled;
      else delete settings.spinnerTipsEnabled;
    }
    if (!writeSettingsJson(CLAUDE_SETTINGS, settings, read.raw)) {
      return { cleared: false, skipped: true, reason: "settings-changed" };
    }
  }
  try {
    writeState({ tips: [], tipsPrev: void 0 });
  } catch {
  }
  return { cleared: true };
}
export {
  __writeSettingsJsonForTests,
  applySpinnerTips,
  applySpinnerVerbs,
  clearSpinnerTips,
  clearSpinnerVerbs,
  readJson,
  thDir
};
