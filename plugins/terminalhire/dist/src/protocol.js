// src/protocol.ts
import { spawn, spawnSync } from "child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync, renameSync } from "fs";
import { homedir } from "os";
import { join } from "path";
import { fileURLToPath } from "url";
var CLAIM_URL_RE = /^(th|terminalhire):\/\/claim\/([A-Za-z0-9_-]{8})\/?$/i;
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
  const here = fileURLToPath(new URL(".", import.meta.url));
  return join(here, "..", "bin", "jpi-dispatch.js");
}
function defaultProtocolDeps() {
  return {
    platform: process.platform,
    spawnSync: (command, args, options) => spawnSync(command, args, options),
    spawn: (command, args, options) => spawn(command, args, options),
    existsSync: (path) => existsSync(path),
    mkdirSync: (path) => {
      mkdirSync(path, { recursive: true });
    },
    writeFileSync: (path, contents) => {
      writeFileSync(path, contents, "utf8");
    },
    readFileSync: (path) => readFileSync(path, "utf8"),
    rmSync: (path) => {
      try {
        rmSync(path, { recursive: true, force: true });
      } catch {
      }
    },
    renameSync: (from, to) => {
      renameSync(from, to);
    },
    homedir,
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
function stateDir(deps) {
  return deps.env.TERMINALHIRE_DIR || join(deps.homedir(), ".terminalhire");
}
var PLISTBUDDY = "/usr/libexec/PlistBuddy";
var LSREGISTER = "/System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister";
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
  const appDir = join(deps.homedir(), "Applications");
  const appPath = join(appDir, "Terminalhire Handler.app");
  const plistPath = join(appPath, "Contents", "Info.plist");
  return { appDir, appPath, plistPath };
}
function darwinRegister(deps) {
  const dir = stateDir(deps);
  deps.mkdirSync(dir);
  const { appDir, appPath, plistPath } = darwinAppPaths(deps);
  deps.mkdirSync(appDir);
  const scriptPath = join(dir, "handler.applescript");
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
var WIN32_SCHEMES = ["th", "terminalhire"];
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
  return join(deps.homedir(), ".local", "share", "applications");
}
function linuxDesktopFile(deps) {
  return join(linuxDesktopDir(deps), "terminalhire-handler.desktop");
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
var LINUX_TERMINAL_CANDIDATES = [
  ["x-terminal-emulator", ["-e"]],
  ["gnome-terminal", ["--"]],
  ["konsole", ["-e"]],
  ["xterm", ["-e"]]
];
var HANDLER_TEMPLATE_VERSION = 2;
function handlerTemplateVersionPath(deps) {
  return join(stateDir(deps), "handler-template-version");
}
function readHandlerTemplateVersion(deps) {
  try {
    return deps.readFileSync(handlerTemplateVersionPath(deps)).trim();
  } catch {
    return null;
  }
}
function writeHandlerTemplateVersion(deps) {
  deps.mkdirSync(stateDir(deps));
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
var PENDING_CLAIMS_CAP = 20;
var PENDING_TOKEN_RE = /^[A-Za-z0-9_-]{8}$/;
function pendingClaimsPath(deps) {
  return join(stateDir(deps), "pending-claims.json");
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
    deps.mkdirSync(stateDir(deps));
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
export {
  HANDLER_TEMPLATE_VERSION,
  defaultProtocolDeps,
  drainPendingClaims,
  handleUrl,
  healStaleHandler,
  parseClaimUrl,
  printClaimCommand,
  registerScheme,
  schemeStatus,
  unregisterScheme
};
