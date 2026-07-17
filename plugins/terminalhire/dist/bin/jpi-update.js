#!/usr/bin/env node
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/protocol.ts
var protocol_exports = {};
__export(protocol_exports, {
  HANDLER_TEMPLATE_VERSION: () => HANDLER_TEMPLATE_VERSION,
  defaultProtocolDeps: () => defaultProtocolDeps,
  drainPendingClaims: () => drainPendingClaims,
  handleUrl: () => handleUrl,
  healStaleHandler: () => healStaleHandler,
  parseClaimUrl: () => parseClaimUrl,
  printClaimCommand: () => printClaimCommand,
  registerScheme: () => registerScheme,
  schemeStatus: () => schemeStatus,
  unregisterScheme: () => unregisterScheme
});
import { spawn, spawnSync } from "child_process";
import { existsSync as existsSync2, mkdirSync as mkdirSync2, readFileSync as readFileSync2, rmSync, writeFileSync as writeFileSync2, renameSync } from "fs";
import { homedir as homedir2 } from "os";
import { join as join2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
function parseClaimUrl(raw) {
  if (typeof raw !== "string") return null;
  if (raw.length === 0 || raw.length > 64) return null;
  if (raw.includes("%") || /\s/.test(raw)) return null;
  const m = CLAIM_URL_RE.exec(raw);
  if (!m) return null;
  const scheme = m[1].toLowerCase();
  return { scheme, token: m[2] };
}
function defaultDispatchPath() {
  const here = fileURLToPath2(new URL(".", import.meta.url));
  return join2(here, "..", "bin", "jpi-dispatch.js");
}
function defaultProtocolDeps() {
  return {
    platform: process.platform,
    spawnSync: (command, args, options) => spawnSync(command, args, options),
    spawn: (command, args, options) => spawn(command, args, options),
    existsSync: (path2) => existsSync2(path2),
    mkdirSync: (path2) => {
      mkdirSync2(path2, { recursive: true });
    },
    writeFileSync: (path2, contents) => {
      writeFileSync2(path2, contents, "utf8");
    },
    readFileSync: (path2) => readFileSync2(path2, "utf8"),
    rmSync: (path2) => {
      try {
        rmSync(path2, { recursive: true, force: true });
      } catch {
      }
    },
    renameSync: (from, to) => {
      renameSync(from, to);
    },
    homedir: homedir2,
    env: process.env,
    execPath: process.execPath,
    dispatchPath: defaultDispatchPath(),
    isTTY: () => Boolean(process.stdin.isTTY),
    log: (msg) => {
      console.log(msg);
    },
    errorLog: (msg) => {
      console.error(msg);
    },
    exit: (code) => {
      process.exit(code);
    }
  };
}
function stateDir2(deps) {
  return deps.env.TERMINALHIRE_DIR || join2(deps.homedir(), ".terminalhire");
}
function escapeAppleScriptString(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
function appleScriptStringLiteral(s) {
  return `"${escapeAppleScriptString(s)}"`;
}
function shellQuoteSingle(s) {
  return `'${s.replace(/'/g, `'\\''`)}'`;
}
function buildAppleScriptHandler(execPath, dispatchPath) {
  const execLit = appleScriptStringLiteral(execPath);
  const dispatchLit = appleScriptStringLiteral(dispatchPath);
  return [
    "on open location theURL",
    '	set claimCmd to ""',
    "	try",
    `		set claimCmd to do shell script quoted form of ${execLit} & " " & quoted form of ${dispatchLit} & " print-claim-command " & quoted form of theURL`,
    "	end try",
    '	if claimCmd is "" then',
    `		display notification "That isn't a valid Terminalhire claim link." with title "Terminalhire"`,
    "		return",
    "	end if",
    "	try",
    '		tell application "Terminal"',
    "			activate",
    "			do script claimCmd",
    "		end tell",
    "	on error",
    `		display notification "Couldn't open Terminal automatically. Run: " & claimCmd with title "Terminalhire"`,
    "		try",
    `			do shell script quoted form of ${execLit} & " " & quoted form of ${dispatchLit} & " handle-url " & quoted form of theURL & " > /dev/null 2>&1 &"`,
    "		end try",
    "	end try",
    "end open location",
    ""
  ].join("\n");
}
function buildPreviewShellCommand(token, deps) {
  return [
    shellQuoteSingle(deps.execPath),
    shellQuoteSingle(deps.dispatchPath),
    "claim",
    "preview",
    token
  ].join(" ");
}
function printClaimCommand(raw, deps = defaultProtocolDeps()) {
  const parsed = parseClaimUrl(raw);
  if (!parsed) {
    deps.exit(1);
    return;
  }
  deps.log(buildPreviewShellCommand(parsed.token, deps));
  deps.exit(0);
}
function darwinAppPaths(deps) {
  const appDir = join2(deps.homedir(), "Applications");
  const appPath = join2(appDir, "Terminalhire Handler.app");
  const plistPath = join2(appPath, "Contents", "Info.plist");
  return { appDir, appPath, plistPath };
}
function darwinRegister(deps) {
  const dir = stateDir2(deps);
  deps.mkdirSync(dir);
  const { appDir, appPath, plistPath } = darwinAppPaths(deps);
  deps.mkdirSync(appDir);
  const scriptPath = join2(dir, "handler.applescript");
  deps.writeFileSync(scriptPath, buildAppleScriptHandler(deps.execPath, deps.dispatchPath));
  deps.rmSync(appPath);
  const compile = deps.spawnSync("osacompile", ["-o", appPath, scriptPath]);
  if (compile.status !== 0) {
    return { ok: false, reason: "osacompile_failed" };
  }
  const setId = deps.spawnSync(PLISTBUDDY, ["-c", "Set :CFBundleIdentifier com.terminalhire.handler", plistPath]);
  if (setId.status !== 0) {
    deps.spawnSync(PLISTBUDDY, ["-c", "Add :CFBundleIdentifier string com.terminalhire.handler", plistPath]);
  }
  const urlTypeAdds = [
    deps.spawnSync(PLISTBUDDY, ["-c", "Add :CFBundleURLTypes array", plistPath]),
    deps.spawnSync(PLISTBUDDY, ["-c", "Add :CFBundleURLTypes:0 dict", plistPath]),
    deps.spawnSync(PLISTBUDDY, ["-c", "Add :CFBundleURLTypes:0:CFBundleURLName string Terminalhire Claim", plistPath]),
    deps.spawnSync(PLISTBUDDY, ["-c", "Add :CFBundleURLTypes:0:CFBundleURLSchemes array", plistPath]),
    deps.spawnSync(PLISTBUDDY, ["-c", "Add :CFBundleURLTypes:0:CFBundleURLSchemes:0 string th", plistPath]),
    deps.spawnSync(PLISTBUDDY, ["-c", "Add :CFBundleURLTypes:0:CFBundleURLSchemes:1 string terminalhire", plistPath])
  ];
  if (urlTypeAdds.some((r) => r.status !== 0)) {
    return { ok: false, reason: "plist_url_types_failed" };
  }
  const lsreg = deps.spawnSync(LSREGISTER, ["-f", appPath]);
  if (lsreg.status !== 0) {
    return { ok: false, reason: "lsregister_failed" };
  }
  return { ok: true };
}
function darwinUnregister(deps) {
  const { appPath } = darwinAppPaths(deps);
  deps.spawnSync(LSREGISTER, ["-u", appPath]);
  deps.rmSync(appPath);
}
function darwinStatus(deps) {
  const { appPath } = darwinAppPaths(deps);
  const exists = deps.existsSync(appPath);
  let registered = false;
  if (exists) {
    const dump = deps.spawnSync(LSREGISTER, ["-dump"]);
    const out = dump.stdout ? dump.stdout.toString() : "";
    registered = /(^|\s)th:|(^|\s)terminalhire:/i.test(out);
  }
  return { registered: exists && registered, appExists: exists };
}
function darwinOpenPreviewTerminal(token, deps) {
  const doScript = `do script ${appleScriptStringLiteral(buildPreviewShellCommand(token, deps))}`;
  const res = deps.spawnSync("osascript", ["-e", 'tell application "Terminal" to activate', "-e", doScript]);
  return res.status === 0;
}
function win32Register(deps) {
  for (const scheme of WIN32_SCHEMES) {
    const key = `HKCU\\Software\\Classes\\${scheme}`;
    const r1 = deps.spawnSync("reg", ["add", key, "/ve", "/d", "URL:Terminalhire Claim", "/f"]);
    if (r1.status !== 0) return { ok: false, reason: "reg_add_failed" };
    const r2 = deps.spawnSync("reg", ["add", key, "/v", "URL Protocol", "/d", "", "/f"]);
    if (r2.status !== 0) return { ok: false, reason: "reg_add_failed" };
    const cmdValue = `"${deps.execPath}" "${deps.dispatchPath}" handle-url "%1"`;
    const r3 = deps.spawnSync("reg", ["add", `${key}\\shell\\open\\command`, "/ve", "/d", cmdValue, "/f"]);
    if (r3.status !== 0) return { ok: false, reason: "reg_add_failed" };
  }
  return { ok: true };
}
function win32Unregister(deps) {
  for (const scheme of WIN32_SCHEMES) {
    deps.spawnSync("reg", ["delete", `HKCU\\Software\\Classes\\${scheme}`, "/f"]);
  }
}
function win32Status(deps) {
  let registered = true;
  for (const scheme of WIN32_SCHEMES) {
    const r = deps.spawnSync("reg", ["query", `HKCU\\Software\\Classes\\${scheme}`]);
    if (r.status !== 0) registered = false;
  }
  return { registered, appExists: registered };
}
function linuxDesktopDir(deps) {
  return join2(deps.homedir(), ".local", "share", "applications");
}
function linuxDesktopFile(deps) {
  return join2(linuxDesktopDir(deps), "terminalhire-handler.desktop");
}
function buildDesktopEntry(execPath, dispatchPath) {
  return [
    "[Desktop Entry]",
    "Type=Application",
    "Name=Terminalhire Claim Handler",
    `Exec="${execPath}" "${dispatchPath}" handle-url %u`,
    "Terminal=true",
    "NoDisplay=true",
    "MimeType=x-scheme-handler/th;x-scheme-handler/terminalhire;",
    ""
  ].join("\n");
}
function linuxRegister(deps) {
  const dir = linuxDesktopDir(deps);
  deps.mkdirSync(dir);
  deps.writeFileSync(linuxDesktopFile(deps), buildDesktopEntry(deps.execPath, deps.dispatchPath));
  const r1 = deps.spawnSync("xdg-mime", ["default", "terminalhire-handler.desktop", "x-scheme-handler/th"]);
  const r2 = deps.spawnSync("xdg-mime", ["default", "terminalhire-handler.desktop", "x-scheme-handler/terminalhire"]);
  deps.spawnSync("update-desktop-database", [dir]);
  if (r1.status !== 0 || r2.status !== 0) return { ok: false, reason: "xdg_mime_failed" };
  return { ok: true };
}
function linuxUnregister(deps) {
  deps.rmSync(linuxDesktopFile(deps));
  deps.spawnSync("update-desktop-database", [linuxDesktopDir(deps)]);
}
function linuxStatus(deps) {
  const exists = deps.existsSync(linuxDesktopFile(deps));
  let registered = false;
  if (exists) {
    const q = deps.spawnSync("xdg-mime", ["query", "default", "x-scheme-handler/th"]);
    const out = q.stdout ? q.stdout.toString() : "";
    registered = out.includes("terminalhire-handler.desktop");
  }
  return { registered, appExists: exists };
}
function handlerTemplateVersionPath(deps) {
  return join2(stateDir2(deps), "handler-template-version");
}
function readHandlerTemplateVersion(deps) {
  try {
    return deps.readFileSync(handlerTemplateVersionPath(deps)).trim();
  } catch {
    return null;
  }
}
function writeHandlerTemplateVersion(deps) {
  deps.mkdirSync(stateDir2(deps));
  deps.writeFileSync(handlerTemplateVersionPath(deps), String(HANDLER_TEMPLATE_VERSION));
}
function registerScheme(deps = defaultProtocolDeps()) {
  let result;
  switch (deps.platform) {
    case "darwin":
      result = darwinRegister(deps);
      break;
    case "win32":
      result = win32Register(deps);
      break;
    default:
      result = linuxRegister(deps);
  }
  if (result.ok) {
    writeHandlerTemplateVersion(deps);
  }
  return result;
}
function unregisterScheme(deps = defaultProtocolDeps()) {
  switch (deps.platform) {
    case "darwin":
      darwinUnregister(deps);
      return;
    case "win32":
      win32Unregister(deps);
      return;
    default:
      linuxUnregister(deps);
  }
}
function schemeStatus(deps = defaultProtocolDeps()) {
  switch (deps.platform) {
    case "darwin":
      return { ...darwinStatus(deps), platform: deps.platform };
    case "win32":
      return { ...win32Status(deps), platform: deps.platform };
    default:
      return { ...linuxStatus(deps), platform: deps.platform };
  }
}
function healStaleHandler(deps = defaultProtocolDeps()) {
  try {
    if (readHandlerTemplateVersion(deps) === String(HANDLER_TEMPLATE_VERSION)) {
      return;
    }
    if (schemeStatus(deps).registered) {
      const r = registerScheme(deps);
      if (r.ok) {
        deps.log("\u2713 refreshed the th:// claim-link handler.");
      }
    } else {
      writeHandlerTemplateVersion(deps);
    }
  } catch {
  }
}
function pendingClaimsPath(deps) {
  return join2(stateDir2(deps), "pending-claims.json");
}
function readPendingClaims(deps) {
  try {
    const raw = deps.readFileSync(pendingClaimsPath(deps));
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (c) => c && typeof c.token === "string" && PENDING_TOKEN_RE.test(c.token)
    );
  } catch {
    return [];
  }
}
function appendPendingClaim(deps, entry) {
  try {
    deps.mkdirSync(stateDir2(deps));
    const existing = readPendingClaims(deps).filter((c) => c.token !== entry.token);
    const next = [...existing, entry].slice(-PENDING_CLAIMS_CAP);
    const finalPath = pendingClaimsPath(deps);
    const tmpPath = `${finalPath}.tmp-${process.pid}-${Date.now()}`;
    deps.writeFileSync(tmpPath, `${JSON.stringify(next, null, 2)}
`);
    deps.renameSync(tmpPath, finalPath);
  } catch {
  }
}
function drainPendingClaims(deps = defaultProtocolDeps()) {
  const claims = readPendingClaims(deps);
  if (deps.existsSync(pendingClaimsPath(deps))) {
    deps.rmSync(pendingClaimsPath(deps));
  }
  return claims;
}
function trySpawnDetached(deps, command, args) {
  return new Promise((resolveSpawn) => {
    let settled = false;
    try {
      const child = deps.spawn(command, args, { detached: true, stdio: "ignore" });
      child.once("error", () => {
        if (!settled) {
          settled = true;
          resolveSpawn(false);
        }
      });
      child.once("spawn", () => {
        if (!settled) {
          settled = true;
          child.unref();
          resolveSpawn(true);
        }
      });
    } catch {
      if (!settled) {
        settled = true;
        resolveSpawn(false);
      }
    }
  });
}
async function tryHeadlessOpen(token, deps) {
  if (deps.platform === "darwin") {
    return darwinOpenPreviewTerminal(token, deps);
  }
  if (deps.platform === "win32") {
    return trySpawnDetached(deps, "cmd", [
      "/c",
      "start",
      "",
      "cmd",
      "/k",
      deps.execPath,
      deps.dispatchPath,
      "claim",
      "preview",
      token
    ]);
  }
  for (const [bin, prefixArgs] of LINUX_TERMINAL_CANDIDATES) {
    const ok = await trySpawnDetached(deps, bin, [...prefixArgs, deps.execPath, deps.dispatchPath, "claim", "preview", token]);
    if (ok) return true;
  }
  return false;
}
async function handleUrl(raw, deps = defaultProtocolDeps()) {
  const parsed = parseClaimUrl(raw);
  if (!parsed) {
    deps.errorLog("terminalhire: not a valid terminalhire claim link");
    deps.exit(1);
    return;
  }
  const { token } = parsed;
  if (deps.isTTY()) {
    const res = deps.spawnSync(deps.execPath, [deps.dispatchPath, "claim", "preview", token], { stdio: "inherit" });
    deps.exit(res.status ?? 1);
    return;
  }
  let opened = false;
  try {
    opened = await tryHeadlessOpen(token, deps);
  } catch {
    opened = false;
  }
  if (opened) {
    deps.exit(0);
    return;
  }
  appendPendingClaim(deps, { token, ts: Date.now() });
  deps.exit(0);
}
var CLAIM_URL_RE, PLISTBUDDY, LSREGISTER, WIN32_SCHEMES, LINUX_TERMINAL_CANDIDATES, HANDLER_TEMPLATE_VERSION, PENDING_CLAIMS_CAP, PENDING_TOKEN_RE;
var init_protocol = __esm({
  "src/protocol.ts"() {
    "use strict";
    CLAIM_URL_RE = /^(th|terminalhire):\/\/claim\/([A-Za-z0-9_-]{8})\/?$/i;
    PLISTBUDDY = "/usr/libexec/PlistBuddy";
    LSREGISTER = "/System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister";
    WIN32_SCHEMES = ["th", "terminalhire"];
    LINUX_TERMINAL_CANDIDATES = [
      ["x-terminal-emulator", ["-e"]],
      ["gnome-terminal", ["--"]],
      ["konsole", ["-e"]],
      ["xterm", ["-e"]]
    ];
    HANDLER_TEMPLATE_VERSION = 2;
    PENDING_CLAIMS_CAP = 20;
    PENDING_TOKEN_RE = /^[A-Za-z0-9_-]{8}$/;
  }
});

// bin/jpi-update.js
import { spawnSync as spawnSync2 } from "child_process";
import { fileURLToPath as fileURLToPath3 } from "url";
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
    const here = fileURLToPath3(new URL(".", import.meta.url));
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
async function rehealProtocol() {
  try {
    const { schemeStatus: schemeStatus2, registerScheme: registerScheme2, defaultProtocolDeps: defaultProtocolDeps2 } = await Promise.resolve().then(() => (init_protocol(), protocol_exports));
    const deps = defaultProtocolDeps2();
    if (schemeStatus2(deps).registered) {
      const r = registerScheme2(deps);
      if (r.ok) {
        console.log("\u2713 refreshed the th:// claim-link handler for this update.");
      }
    }
  } catch {
  }
}
function runNpmInstall() {
  console.log(`running: npm install -g ${PACKAGE_SPEC}`);
  const result = spawnSync2("npm", INSTALL_ARGS, {
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
    const installCode = runNpmInstall();
    if (installCode === 0) {
      await rehealProtocol();
    }
    return installCode;
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
