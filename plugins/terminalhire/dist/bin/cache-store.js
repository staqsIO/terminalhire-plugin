// bin/cache-store.js
import { readFileSync, writeFileSync, renameSync } from "fs";
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

// bin/cache-store.js
var TERMINALHIRE_DIR = process.env.TERMINALHIRE_DIR || join(homedir(), ".terminalhire");
var INDEX_CACHE_FILE = join(TERMINALHIRE_DIR, "index-cache.json");
var SCHEMA_VERSION = 1;
var tmpCounter = 0;
function readCacheEntry() {
  try {
    return JSON.parse(readFileSync(INDEX_CACHE_FILE, "utf8"));
  } catch {
    return null;
  }
}
function updateIndexCache(patch) {
  ensureStateDir(TERMINALHIRE_DIR);
  const existing = readCacheEntry() ?? {};
  const entry = {
    ...existing,
    ...patch,
    schemaVersion: SCHEMA_VERSION,
    ts: Date.now()
  };
  const tmp = `${INDEX_CACHE_FILE}.${process.pid}.${tmpCounter++}.tmp`;
  writeFileSync(tmp, JSON.stringify(entry), "utf8");
  renameSync(tmp, INDEX_CACHE_FILE);
  return entry;
}
function writeIndexCache(index) {
  return updateIndexCache({ index, indexETag: "" });
}
export {
  readCacheEntry,
  updateIndexCache,
  writeIndexCache
};
