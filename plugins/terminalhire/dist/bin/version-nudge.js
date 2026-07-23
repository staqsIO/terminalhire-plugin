// bin/version-nudge.js
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";
import { fileURLToPath } from "url";

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

// bin/version-nudge.js
var __dirname = fileURLToPath(new URL(".", import.meta.url));
function stateDir() {
  return process.env.TERMINALHIRE_DIR || join(homedir(), ".terminalhire");
}
function indexCacheFile() {
  return join(stateDir(), "index-cache.json");
}
function nudgeStateFile() {
  return join(stateDir(), "version-nudge.json");
}
function parseVersion(v) {
  if (typeof v !== "string") return null;
  const m = v.trim().replace(/^v/, "").match(/^(\d+)\.(\d+)\.(\d+)/);
  if (!m) return null;
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}
function compareVersions(a, b) {
  const pa = parseVersion(a);
  const pb = parseVersion(b);
  if (!pa || !pb) return null;
  for (let i = 0; i < 3; i++) {
    if (pa[i] < pb[i]) return -1;
    if (pa[i] > pb[i]) return 1;
  }
  return 0;
}
function buildStaleNudge(local, latest) {
  if (compareVersions(local, latest) !== -1) return null;
  return `your terminalhire CLI is behind (${local} \u2192 ${latest}) \u2014 npm i -g terminalhire@latest`;
}
function readLocalVersion() {
  try {
    const candidates = [
      join(__dirname, "..", "..", "package.json"),
      join(__dirname, "..", "package.json")
    ];
    for (const p of candidates) {
      if (existsSync(p)) {
        const pkg = JSON.parse(readFileSync(p, "utf8"));
        if (pkg.version) return pkg.version;
      }
    }
  } catch {
  }
  return null;
}
function readLatestVersionFromCache() {
  try {
    const cache = JSON.parse(readFileSync(indexCacheFile(), "utf8"));
    const v = cache?.index?.cliVersion;
    return typeof v === "string" ? v : null;
  } catch {
    return null;
  }
}
function cachedStaleNudge(localVersion) {
  const local = localVersion ?? readLocalVersion();
  if (!local) return null;
  return buildStaleNudge(local, readLatestVersionFromCache());
}
var NAG_INTERVAL_MS = 24 * 60 * 60 * 1e3;
function shouldNag(now = Date.now()) {
  try {
    const state = JSON.parse(readFileSync(nudgeStateFile(), "utf8"));
    const last = state?.lastNaggedAt;
    if (typeof last !== "number" || !Number.isFinite(last)) return true;
    return now - last >= NAG_INTERVAL_MS;
  } catch {
    return true;
  }
}
function recordNag(now = Date.now()) {
  try {
    ensureStateDir(stateDir());
    writeFileSync(nudgeStateFile(), JSON.stringify({ lastNaggedAt: now }) + "\n", "utf8");
  } catch {
  }
}
function emitInteractiveNudge({
  now = Date.now(),
  stream = process.stderr,
  localVersion
} = {}) {
  try {
    const nudge = cachedStaleNudge(localVersion);
    if (!nudge) return false;
    if (!shouldNag(now)) return false;
    stream.write(`${nudge}
`);
    recordNag(now);
    return true;
  } catch {
    return false;
  }
}
export {
  buildStaleNudge,
  cachedStaleNudge,
  compareVersions,
  emitInteractiveNudge,
  parseVersion,
  readLatestVersionFromCache,
  readLocalVersion,
  recordNag,
  shouldNag
};
