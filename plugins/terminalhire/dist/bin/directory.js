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

// src/api-base.ts
var PROD_API_BASE = "https://terminalhire.com";
var DEV_API_BASE = "https://dev.terminalhire.com";
var ApiBaseError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "ApiBaseError";
  }
};
var ALLOWED_HOSTS = {
  "terminalhire.com": "https:",
  "www.terminalhire.com": "https:",
  "dev.terminalhire.com": "https:",
  localhost: "http:",
  "127.0.0.1": "http:"
};
var ALLOW_LOCAL_API_KEY = "TERMINALHIRE_ALLOW_LOCAL_API";
var ALLOWED_DESCRIPTION = [
  PROD_API_BASE,
  DEV_API_BASE,
  `http://localhost:<port> (requires ${ALLOW_LOCAL_API_KEY}=1)`,
  `http://127.0.0.1:<port> (requires ${ALLOW_LOCAL_API_KEY}=1)`
].join(", ");
var CANONICAL_REWRITES = {
  "www.terminalhire.com": PROD_API_BASE
};
var ENV_KEYS = ["TERMINALHIRE_API_URL", "JPI_API_URL"];
function sanitizeOverrideForError(raw) {
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return `(disallowed scheme: ${url.protocol.slice(0, -1)})`;
    }
    if (url.username !== "" || url.password !== "") {
      return `${url.protocol}//***@${url.host}`;
    }
    return url.origin;
  } catch {
    return "(unparseable override)";
  }
}
function isLoopbackOrigin(origin) {
  try {
    const host = new URL(origin).hostname;
    return host === "localhost" || host === "127.0.0.1";
  } catch {
    return false;
  }
}
function localApiAllowed(env) {
  return env[ALLOW_LOCAL_API_KEY] === "1";
}
function resolveApiBase(env = process.env) {
  for (const key of ENV_KEYS) {
    const raw = env[key];
    if (typeof raw !== "string") continue;
    const trimmed = raw.trim();
    if (trimmed === "") continue;
    const normalized = normalizeOverride(trimmed);
    if (normalized === null) {
      throw new ApiBaseError(
        `terminalhire: ${key}=${sanitizeOverrideForError(trimmed)} is not an allowed API host (allowed: ${ALLOWED_DESCRIPTION}). Refusing to continue so we do not silently hit production.`
      );
    }
    if (isLoopbackOrigin(normalized) && !localApiAllowed(env)) {
      throw new ApiBaseError(
        `terminalhire: ${key}=${normalized} is a loopback origin. Set ${ALLOW_LOCAL_API_KEY}=1 to talk to a local web app on purpose. Refusing so stored credentials cannot be exfiltrated to localhost by a poisoned override.`
      );
    }
    return normalized;
  }
  return PROD_API_BASE;
}
function normalizeOverride(raw) {
  let url;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.username !== "" || url.password !== "") return null;
  const expectedProtocol = ALLOWED_HOSTS[url.hostname];
  if (expectedProtocol === void 0) return null;
  if (url.protocol !== expectedProtocol) return null;
  if (url.hostname !== "localhost" && url.hostname !== "127.0.0.1" && url.port !== "") {
    return null;
  }
  const rewrite = CANONICAL_REWRITES[url.hostname];
  if (rewrite !== void 0) return rewrite;
  return url.origin;
}

// bin/directory.js
var TERMINALHIRE_DIR = process.env.TERMINALHIRE_DIR || join(homedir(), ".terminalhire");
var DIRECTORY_CACHE_FILE = join(TERMINALHIRE_DIR, "directory-cache.json");
var PROJECT_FILE = join(TERMINALHIRE_DIR, "project.json");
var INDEX_TTL_MS = 15 * 60 * 1e3;
var API_URL = resolveApiBase();
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
