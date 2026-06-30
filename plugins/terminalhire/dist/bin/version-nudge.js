// bin/version-nudge.js
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";
import { fileURLToPath } from "url";
var __dirname = fileURLToPath(new URL(".", import.meta.url));
var INDEX_CACHE_FILE = join(homedir(), ".terminalhire", "index-cache.json");
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
    const cache = JSON.parse(readFileSync(INDEX_CACHE_FILE, "utf8"));
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
export {
  buildStaleNudge,
  cachedStaleNudge,
  compareVersions,
  parseVersion,
  readLatestVersionFromCache,
  readLocalVersion
};
