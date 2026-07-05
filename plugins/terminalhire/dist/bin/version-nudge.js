// bin/version-nudge.js
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";
import { fileURLToPath } from "url";
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
    mkdirSync(stateDir(), { recursive: true });
    writeFileSync(nudgeStateFile(), JSON.stringify({ lastNaggedAt: now }) + "\n", "utf8");
  } catch {
  }
}
function emitInteractiveNudge({ now = Date.now(), stream = process.stderr, localVersion } = {}) {
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
