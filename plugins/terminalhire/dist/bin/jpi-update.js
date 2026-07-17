#!/usr/bin/env node

// bin/jpi-update.js
import { spawnSync } from "child_process";
import { fileURLToPath as fileURLToPath2 } from "url";
import path from "path";

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
var NAG_INTERVAL_MS = 24 * 60 * 60 * 1e3;

// bin/jpi-update.js
var PACKAGE_SPEC = "terminalhire@latest";
var INSTALL_ARGS = ["install", "-g", PACKAGE_SPEC];
function decideUpdate({ local, latest, force = false, check = false } = {}) {
  if (check) return { action: "check", reason: "explicit --check" };
  if (force) return { action: "install", reason: "--force" };
  if (latest == null) return { action: "install", reason: "latest version unknown \u2014 attempt update" };
  const cmp = compareVersions(local, latest);
  if (cmp === null) return { action: "install", reason: "version unparseable \u2014 attempt update" };
  if (cmp !== -1) return { action: "up-to-date", reason: "local is already >= latest" };
  return { action: "install", reason: "local is behind latest" };
}
function pathIsInsidePluginRoot(here, root) {
  if (!here || !root) return false;
  try {
    const rHere = path.resolve(here);
    const rRoot = path.resolve(root);
    return rHere === rRoot || rHere.startsWith(rRoot + path.sep);
  } catch {
    return false;
  }
}
function isPluginBundledCopy() {
  const root = process.env.CLAUDE_PLUGIN_ROOT;
  if (!root) return false;
  try {
    const here = fileURLToPath2(new URL(".", import.meta.url));
    return pathIsInsidePluginRoot(here, root);
  } catch {
    return false;
  }
}
function printCheck(local, latest) {
  const latestLabel = latest ?? "unknown (run: terminalhire refresh)";
  console.log(`installed ${local ?? "unknown"}, latest ${latestLabel}`);
  if (latest != null && local != null) {
    const cmp = compareVersions(local, latest);
    console.log(cmp === null ? "unable to compare versions" : cmp === -1 ? "update available" : "already on the latest");
  }
}
function printManualFallback(reason) {
  console.error(`update: ${reason} \u2014 run this manually:`);
  console.error(`  npm install -g ${PACKAGE_SPEC}`);
  console.error("  (may need `sudo` on some setups if this was a permission error)");
}
function runNpmInstall() {
  console.log(`running: npm install -g ${PACKAGE_SPEC}`);
  const result = spawnSync("npm", INSTALL_ARGS, {
    stdio: "inherit",
    shell: process.platform === "win32"
  });
  if (result.error) {
    printManualFallback(`auto-update didn't complete (${result.error.message ?? result.error})`);
    return 1;
  }
  if (result.status !== 0) {
    printManualFallback(`auto-update didn't complete (npm exited ${result.status})`);
    return 1;
  }
  console.log("\u2713 update complete \u2014 the new version is active on your next terminalhire run.");
  return 0;
}
async function run(argv) {
  try {
    const args = argv ?? [];
    const check = args.includes("--check");
    const force = args.includes("--force");
    if (isPluginBundledCopy()) {
      console.log(
        "terminalhire is bundled with the Claude Code plugin here and updates with the plugin.\nTo update a standalone install, run: npm install -g terminalhire@latest"
      );
      return 0;
    }
    const local = readLocalVersion();
    const latest = readLatestVersionFromCache();
    const decision = decideUpdate({ local, latest, force, check });
    if (decision.action === "check") {
      printCheck(local, latest);
      return 0;
    }
    if (decision.action === "up-to-date") {
      console.log(`\u2713 already on the latest (${local})`);
      return 0;
    }
    return runNpmInstall();
  } catch (err) {
    printManualFallback(`unexpected error (${err instanceof Error ? err.message : String(err)})`);
    return 1;
  }
}
export {
  decideUpdate,
  pathIsInsidePluginRoot,
  run
};
