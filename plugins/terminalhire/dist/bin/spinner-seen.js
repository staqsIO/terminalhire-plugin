// bin/spinner-seen.js
import { readFileSync, writeFileSync, renameSync } from "fs";
import { join, dirname } from "path";
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

// bin/spinner-seen.js
var SEEN_WINDOW_SURFACES = 10;
var SEEN_TTL_MS = 7 * 24 * 60 * 60 * 1e3;
var SEEN_MAX_ENTRIES = 1500;
function isAtCapacity(history) {
  return Object.keys(history?.entries ?? {}).length >= SEEN_MAX_ENTRIES;
}
var SEEN_MAX_WIDTHS = 200;
function seenFilePath() {
  const dir = process.env["TERMINALHIRE_DIR"] || join(homedir(), ".terminalhire");
  return join(dir, "seen-history.json");
}
function atomicWriteJson(path, obj) {
  ensureStateDir(dirname(path));
  const tmp = `${path}.tmp-${process.pid}`;
  writeFileSync(tmp, JSON.stringify(obj) + "\n", { encoding: "utf8", mode: 384 });
  renameSync(tmp, path);
}
function emptyHistory() {
  return { surface: 0, entries: {}, widths: {} };
}
function capWidths(widths) {
  const keys = Object.keys(widths);
  if (keys.length <= SEEN_MAX_WIDTHS) return widths;
  keys.sort((a, b) => Number(b) - Number(a));
  const out = {};
  for (const k of keys.slice(0, SEEN_MAX_WIDTHS)) out[k] = widths[k];
  return out;
}
function isFiniteNonNegative(n) {
  return typeof n === "number" && Number.isFinite(n) && n >= 0;
}
function pruneEntries(entries, now) {
  const out = {};
  for (const [id, e] of Object.entries(entries)) {
    if (!e || !isFiniteNonNegative(e.lastSurface) || !isFiniteNonNegative(e.lastSeenAt)) continue;
    if (now - e.lastSeenAt > SEEN_TTL_MS) continue;
    out[id] = { lastSurface: e.lastSurface, lastSeenAt: e.lastSeenAt };
  }
  return out;
}
function capEntries(entries) {
  const ids = Object.keys(entries);
  if (ids.length <= SEEN_MAX_ENTRIES) return entries;
  ids.sort(
    (a, b) => entries[b].lastSurface - entries[a].lastSurface || entries[b].lastSeenAt - entries[a].lastSeenAt
  );
  const out = {};
  for (const id of ids.slice(0, SEEN_MAX_ENTRIES)) out[id] = entries[id];
  return out;
}
function loadSeenHistory(now = Date.now()) {
  let raw;
  try {
    raw = JSON.parse(readFileSync(seenFilePath(), "utf8"));
  } catch {
    return emptyHistory();
  }
  if (!raw || typeof raw !== "object") return emptyHistory();
  const surface = isFiniteNonNegative(raw.surface) ? Math.floor(raw.surface) : 0;
  const entries = raw.entries && typeof raw.entries === "object" && !Array.isArray(raw.entries) ? pruneEntries(raw.entries, now) : {};
  const widths = raw.widths && typeof raw.widths === "object" && !Array.isArray(raw.widths) ? capWidths(
    Object.fromEntries(
      Object.entries(raw.widths).filter(
        ([s, n]) => isFiniteNonNegative(Number(s)) && isFiniteNonNegative(n)
      )
    )
  ) : {};
  return { surface, entries, widths };
}
function isSuppressed(id, history) {
  const e = history.entries[id];
  if (!e) return false;
  return history.surface - e.lastSurface < SEEN_WINDOW_SURFACES;
}
function recordSurface(ids, now = Date.now()) {
  const history = loadSeenHistory(now);
  const surface = history.surface + 1;
  const entries = { ...history.entries };
  for (const id of ids) {
    if (typeof id !== "string" || id.length === 0) continue;
    entries[id] = { lastSurface: surface, lastSeenAt: now };
  }
  const stamped = new Set(
    (Array.isArray(ids) ? ids : []).filter((id) => typeof id === "string" && id.length > 0)
  );
  const widths = capWidths({ ...history.widths, [surface]: stamped.size });
  const next = { surface, entries: capEntries(pruneEntries(entries, now)), widths };
  try {
    atomicWriteJson(seenFilePath(), next);
  } catch {
  }
  return next;
}
export {
  SEEN_MAX_ENTRIES,
  SEEN_MAX_WIDTHS,
  SEEN_TTL_MS,
  SEEN_WINDOW_SURFACES,
  isAtCapacity,
  isSuppressed,
  loadSeenHistory,
  recordSurface,
  seenFilePath
};
