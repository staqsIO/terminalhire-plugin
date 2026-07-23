#!/usr/bin/env node

// bin/directory.js
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

// bin/directory.js
var TERMINALHIRE_DIR = process.env.TERMINALHIRE_DIR || join(homedir(), ".terminalhire");
var DIRECTORY_CACHE_FILE = join(TERMINALHIRE_DIR, "directory-cache.json");
var PROJECT_FILE = join(TERMINALHIRE_DIR, "project.json");
var INDEX_TTL_MS = 15 * 60 * 1e3;
var API_URL = process.env["TERMINALHIRE_API_URL"] ?? process.env["JPI_API_URL"] ?? "https://terminalhire.com";
function readDirectoryCache() {
  try {
    const entry = JSON.parse(readFileSync(DIRECTORY_CACHE_FILE, "utf8"));
    if (typeof entry.ts === "number" && Number.isFinite(entry.ts) && Date.now() - entry.ts < INDEX_TTL_MS) {
      return { index: entry.index, ts: entry.ts };
    }
    return null;
  } catch {
    return null;
  }
}
function writeDirectoryCache(index) {
  ensureStateDir(TERMINALHIRE_DIR);
  writeFileSync(DIRECTORY_CACHE_FILE, JSON.stringify({ ts: Date.now(), index }), "utf8");
}
function readProject() {
  try {
    return JSON.parse(readFileSync(PROJECT_FILE, "utf8"));
  } catch {
    return null;
  }
}
function writeProject(patch) {
  const existing = readProject() ?? {};
  const merged = { ...existing, ...patch };
  if (!merged.createdAt) merged.createdAt = (/* @__PURE__ */ new Date()).toISOString();
  ensureStateDir(TERMINALHIRE_DIR);
  const tmpFile = `${PROJECT_FILE}.tmp`;
  writeFileSync(tmpFile, JSON.stringify(merged, null, 2), "utf8");
  renameSync(tmpFile, PROJECT_FILE);
  return merged;
}
function relativeTime(ts) {
  const secs = Math.max(0, Math.round((Date.now() - ts) / 1e3));
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.round(secs / 60);
  return mins < 60 ? `${mins}m ago` : `${Math.round(mins / 60)}h ago`;
}
async function fetchDirectory({ quiet = false } = {}) {
  const cached = readDirectoryCache();
  if (cached) {
    if (!quiet) console.log(`\u2713 Using cached directory (updated ${relativeTime(cached.ts)})`);
    return cached.index;
  }
  if (!quiet) console.log(`\u21BB Refreshing builder directory from ${API_URL}/api/directory...`);
  const res = await fetch(`${API_URL}/api/directory`, { signal: AbortSignal.timeout(1e4) });
  if (!res.ok) throw new Error(`/api/directory returned ${res.status}`);
  const index = await res.json();
  writeDirectoryCache(index);
  return index;
}
function reportMatched(results, fetchImpl = fetch) {
  try {
    const logins = [
      ...new Set(
        results.map((r) => r?.job?.company).filter((login) => typeof login === "string" && login.length > 0)
      )
    ];
    if (logins.length === 0) return;
    return Promise.resolve(
      fetchImpl(`${API_URL}/api/directory/matched`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matched: logins }),
        signal: AbortSignal.timeout(3e3)
      })
    ).catch(() => {
    });
  } catch {
  }
}
function excludeOwnCard(results, ownLogin) {
  if (!Array.isArray(results)) return results;
  if (typeof ownLogin !== "string" || ownLogin.length === 0) return results;
  const own = ownLogin.toLowerCase();
  return results.filter((r) => {
    const handle = r?.job?.company;
    return typeof handle !== "string" || handle.toLowerCase() !== own;
  });
}
export {
  excludeOwnCard,
  fetchDirectory,
  readDirectoryCache,
  readProject,
  relativeTime,
  reportMatched,
  writeDirectoryCache,
  writeProject
};
