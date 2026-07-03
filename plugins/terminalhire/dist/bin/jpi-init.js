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

// bin/mcp-config.js
var mcp_config_exports = {};
__export(mcp_config_exports, {
  HOSTS: () => HOSTS,
  SERVER_ARGS: () => SERVER_ARGS,
  SERVER_COMMAND: () => SERVER_COMMAND,
  SERVER_KEY: () => SERVER_KEY,
  claudeCliSnippet: () => claudeCliSnippet,
  hostConfigPath: () => hostConfigPath,
  initMcpStep: () => initMcpStep,
  jsonSnippet: () => jsonSnippet,
  mergeServerIntoJson: () => mergeServerIntoJson,
  printConfigText: () => printConfigText,
  serverEntry: () => serverEntry,
  tomlSnippet: () => tomlSnippet,
  writeServerToFile: () => writeServerToFile
});
import { homedir } from "os";
import { join } from "path";
import { existsSync, readFileSync, copyFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname } from "path";
function serverEntry() {
  return { command: SERVER_COMMAND, args: [...SERVER_ARGS] };
}
function hostConfigPath(host, home = homedir()) {
  if (!host || !Array.isArray(host.relPath)) return null;
  return join(home, ...host.relPath);
}
function jsonSnippet(host) {
  const entry = serverEntry();
  if (host.stdioType) {
    return JSON.stringify(
      { [host.serversKey]: { [SERVER_KEY]: { type: "stdio", ...entry } } },
      null,
      2
    );
  }
  return JSON.stringify({ [host.serversKey]: { [SERVER_KEY]: entry } }, null, 2);
}
function tomlSnippet() {
  const args = SERVER_ARGS.map((a) => JSON.stringify(a)).join(", ");
  return [
    `[mcp_servers.${SERVER_KEY}]`,
    `command = ${JSON.stringify(SERVER_COMMAND)}`,
    `args = [${args}]`
  ].join("\n");
}
function claudeCliSnippet() {
  return `claude mcp add ${SERVER_KEY} -- ${SERVER_COMMAND} ${SERVER_ARGS.join(" ")}`;
}
function printConfigText() {
  const L = [];
  L.push("");
  L.push("terminalhire mcp \u2014 host configuration snippets");
  L.push("");
  L.push("  Paste the snippet for your editor / CLI. Every snippet launches the");
  L.push("  globally-installed `terminalhire mcp` stdio server (read-only, zero");
  L.push("  network egress). Plugin-only users: install the CLI so `terminalhire`");
  L.push("  is on your PATH \u2014 foreign hosts launch that binary, not the plugin.");
  L.push("");
  L.push("  This command writes NOTHING. To let `terminalhire init` merge the entry");
  L.push("  into a detected host config for you (with a backup first), run `terminalhire init`.");
  L.push("");
  for (const host of HOSTS) {
    L.push("\u2500".repeat(68));
    L.push(`${host.label}  \u2014  ${host.pathHint}`);
    L.push("");
    if (host.kind === "json") {
      L.push(jsonSnippet(host));
    } else if (host.kind === "toml") {
      L.push(tomlSnippet());
    } else if (host.kind === "cli") {
      L.push(`  ${claudeCliSnippet()}`);
      L.push("");
      L.push("  \u2026or add to a project .mcp.json:");
      L.push(jsonSnippet(host));
    }
    L.push("");
  }
  L.push("\u2500".repeat(68));
  L.push("Tools exposed: jobs, bounties, contribute, inbox (see docs/mcp-tools.md).");
  L.push("");
  return `${L.join("\n")}
`;
}
function mergeServerIntoJson(existingText, serversKey, entry = serverEntry()) {
  let root;
  const trimmed = (existingText ?? "").trim();
  if (trimmed === "") {
    root = {};
  } else {
    try {
      root = JSON.parse(trimmed);
    } catch {
      return { ok: false, reason: "unparseable" };
    }
    if (root === null || typeof root !== "object" || Array.isArray(root)) {
      return { ok: false, reason: "unparseable" };
    }
  }
  if (root[serversKey] === void 0) root[serversKey] = {};
  if (root[serversKey] === null || typeof root[serversKey] !== "object" || Array.isArray(root[serversKey])) {
    return { ok: false, reason: "unparseable" };
  }
  const already = Object.prototype.hasOwnProperty.call(root[serversKey], SERVER_KEY);
  root[serversKey][SERVER_KEY] = entry;
  return { ok: true, text: `${JSON.stringify(root, null, 2)}
`, added: !already };
}
function writeServerToFile(configPath, serversKey, entry = serverEntry()) {
  const fileExists = existsSync(configPath);
  const existingText = fileExists ? readFileSync(configPath, "utf8") : "";
  const merged = mergeServerIntoJson(existingText, serversKey, entry);
  if (!merged.ok) {
    return { status: "skipped", reason: merged.reason };
  }
  let backupPath = null;
  if (fileExists) {
    const ts = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
    backupPath = `${configPath}.terminalhire-backup-${ts}`;
    copyFileSync(configPath, backupPath);
  } else {
    mkdirSync(dirname(configPath), { recursive: true });
  }
  writeFileSync(configPath, merged.text, "utf8");
  return { status: "written", backupPath, added: merged.added };
}
async function initMcpStep({
  ask,
  isTTY = process.stdin.isTTY,
  home = homedir(),
  out = console.log
} = {}) {
  out("  Expose your LOCAL matches to your editor / CLI as an MCP server.");
  out("  Read-only, zero network egress \u2014 the same on-device data the spinner shows.");
  out("  Tools: jobs, bounties, contribute, inbox (counts only). See docs/mcp-tools.md.");
  out("");
  if (!isTTY) {
    out("  stdin is not interactive \u2014 skipping MCP setup.");
    out("  Run `terminalhire mcp --print-config` to see per-host snippets, or");
    out("  `terminalhire init` again in a real terminal to merge them for you.");
    return;
  }
  const top = await ask(
    "  Set up terminalhire as an MCP server for a detected editor/CLI now? [y/N]: "
  );
  const proceed = top === "y" || top === "yes";
  if (!proceed) {
    out("");
    out("  Skipping. See snippets any time with: terminalhire mcp --print-config");
    return;
  }
  const writableHosts = HOSTS.filter((h) => h.writable);
  const detected = writableHosts.filter((h) => existsSync(hostConfigPath(h, home)));
  if (detected.length === 0) {
    out("");
    out("  No editor/CLI config detected (looked for ~/.cursor/mcp.json, ~/.gemini/settings.json).");
    out("  Paste a snippet manually \u2014 printing them now:");
  } else {
    for (const host of detected) {
      const configPath = hostConfigPath(host, home);
      const answer = await ask(`  Add terminalhire to ${host.label} (${configPath})? [y/N]: `);
      if (answer !== "y" && answer !== "yes") {
        out(`  Skipped ${host.label} \u2014 unchanged.`);
        continue;
      }
      const result = writeServerToFile(configPath, host.serversKey);
      if (result.status === "skipped") {
        out(`  Could not parse ${host.label}'s config \u2014 leaving it untouched.`);
        out(`    Add this manually to ${configPath}:`);
        out(jsonSnippet(host));
      } else {
        if (result.backupPath) out(`  Backed up ${host.label} config to: ${result.backupPath}`);
        out(`  ${result.added ? "Added" : "Updated"} terminalhire in ${host.label}.`);
      }
    }
  }
  out("");
  out("  Finish these hosts by hand (init does not write TOML or managed configs):");
  out("");
  out(`  OpenAI Codex CLI \u2014 ~/.codex/config.toml`);
  out(tomlSnippet());
  out("");
  out(`  Claude Code \u2014`);
  out(`  ${claudeCliSnippet()}`);
  out("");
  out(`  VS Code \u2014 .vscode/mcp.json (workspace) or the user mcp.json`);
  out(jsonSnippet(HOSTS.find((h) => h.id === "vscode")));
}
var SERVER_KEY, SERVER_COMMAND, SERVER_ARGS, HOSTS;
var init_mcp_config = __esm({
  "bin/mcp-config.js"() {
    "use strict";
    SERVER_KEY = "terminalhire";
    SERVER_COMMAND = "terminalhire";
    SERVER_ARGS = ["mcp"];
    HOSTS = [
      {
        id: "vscode",
        label: "VS Code",
        kind: "json",
        writable: false,
        serversKey: "servers",
        stdioType: true,
        // VS Code entries carry an explicit "type": "stdio"
        pathHint: ".vscode/mcp.json (workspace) or the user mcp.json"
      },
      {
        id: "cursor",
        label: "Cursor",
        kind: "json",
        writable: true,
        serversKey: "mcpServers",
        relPath: [".cursor", "mcp.json"],
        pathHint: "~/.cursor/mcp.json"
      },
      {
        id: "codex",
        label: "OpenAI Codex CLI",
        kind: "toml",
        writable: false,
        pathHint: "~/.codex/config.toml"
      },
      {
        id: "gemini",
        label: "Gemini CLI",
        kind: "json",
        writable: true,
        serversKey: "mcpServers",
        relPath: [".gemini", "settings.json"],
        pathHint: "~/.gemini/settings.json"
      },
      {
        id: "claude-code",
        label: "Claude Code",
        kind: "cli",
        // one-liner; also a project .mcp.json snippet
        writable: false,
        serversKey: "mcpServers",
        pathHint: "claude mcp add \u2026 (or a project .mcp.json)"
      }
    ];
  }
});

// bin/jpi-init.js
import { existsSync as existsSync2 } from "fs";
import { join as join2, resolve } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { createInterface } from "readline";
import { spawnSync } from "child_process";
var __dirname = fileURLToPath(new URL(".", import.meta.url));
function resolveScript(name) {
  const distPath = resolve(join2(__dirname, "..", "..", "dist", "bin", `${name}.js`));
  const legacyPath = resolve(join2(__dirname, `${name}.js`));
  return existsSync2(distPath) ? distPath : legacyPath;
}
function resolveSrc(name) {
  const distPath = resolve(join2(__dirname, "..", "..", "dist", "src", `${name}.js`));
  const legacyPath = resolve(join2(__dirname, "..", "src", `${name}.js`));
  return existsSync2(distPath) ? distPath : legacyPath;
}
function resolveInstallJs() {
  const fromDist = resolve(join2(__dirname, "..", "..", "install.js"));
  const fromBin = resolve(join2(__dirname, "..", "install.js"));
  if (existsSync2(fromDist)) return fromDist;
  if (existsSync2(fromBin)) return fromBin;
  return fromBin;
}
function resolveStatuslineInstallJs() {
  const fromDist = resolve(join2(__dirname, "..", "..", "statusline-install.js"));
  const fromBin = resolve(join2(__dirname, "..", "statusline-install.js"));
  if (existsSync2(fromDist)) return fromDist;
  if (existsSync2(fromBin)) return fromBin;
  return fromBin;
}
async function run() {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const ask = (question) => new Promise((resolve2) => {
    let answered = false;
    rl.question(question, (answer) => {
      answered = true;
      resolve2((answer || "").trim().toLowerCase());
    });
    rl.once("close", () => {
      if (!answered) resolve2(null);
    });
  });
  console.log("");
  console.log("\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510");
  console.log("\u2502           terminalhire init \u2014 one-command onboarding            \u2502");
  console.log("\u2502       Local-first job matching for developers in Claude Code     \u2502");
  console.log("\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518");
  console.log("");
  console.log("This will:");
  console.log("  1. Optionally sign you in with GitHub (public profile only, read:user)");
  console.log("  2. Seed your local job cache (anonymous index download)");
  console.log("  3. Enable the ambient spinner job surface in ~/.claude/settings.json");
  console.log("     (with backup + your explicit consent before any file is touched)");
  console.log("  4. Optionally show connection notifications in your statusLine");
  console.log("     (\u{1F4AC} unread + intro requests only \u2014 never job ads; separate consent)");
  console.log("  5. Optionally register terminalhire as a read-only MCP server for your");
  console.log("     editor / CLI (VS Code, Cursor, Codex, Gemini, Claude Code; per-host consent)");
  console.log("");
  console.log('You can stop at any step. Nothing is changed until you say "yes".');
  console.log("");
  console.log("Step 1/5 \u2014 GitHub sign-in (optional but recommended)");
  console.log("");
  console.log("  Scope: read:user \u2014 public profile + public repos only.");
  console.log("  Your token is encrypted at ~/.terminalhire/github-token.enc.");
  console.log("  GitHub data enriches your local profile. Nothing leaves your machine");
  console.log("  until you explicitly consent to a specific lead.");
  console.log("");
  const githubAnswer = await ask("Sign in with GitHub now? [Y/n] (Enter = yes, n = stay local): ");
  const doGitHub = githubAnswer === "" || githubAnswer === "y" || githubAnswer === "yes";
  if (doGitHub) {
    console.log("");
    console.log("  Starting GitHub device flow...");
    const loginScript = resolveScript("jpi-login");
    rl.pause();
    const child = spawnSync(process.execPath, [loginScript, "login"], {
      stdio: ["ignore", "inherit", "inherit"],
      env: { ...process.env, JPI_SKIP_PEER_PROMPT: "1" }
    });
    try {
      while (process.stdin.read() !== null) {
      }
    } catch {
    }
    rl.resume();
    if (child.status !== 0) {
      console.log("");
      console.log("  GitHub sign-in did not complete. Continuing without GitHub.");
      console.log("  You can sign in any time with: terminalhire login");
    } else {
      try {
        const { maybePromptPeerConnect } = await import(pathToFileURL(resolveScript("peer-connect-prompt")).href);
        let login;
        try {
          const { readProfile } = await import(pathToFileURL(resolveSrc("profile")).href);
          const prof = await readProfile();
          login = prof?.github?.login;
        } catch {
        }
        await maybePromptPeerConnect({ ask, login });
      } catch {
      }
    }
  } else {
    console.log("");
    console.log("  Staying local-only. Tags accumulate from your personal project sessions.");
    console.log("  Sign in any time with: terminalhire login");
  }
  console.log("");
  console.log("Step 2/5 \u2014 Seeding local job cache");
  console.log("");
  console.log("  Fetching anonymous job index (no dev data sent)...");
  const jobsScript = resolveScript("jpi-jobs");
  const seedChild = spawnSync(
    process.execPath,
    [jobsScript, "--limit", "0"],
    {
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, TERMINALHIRE_SEED_ONLY: "1" },
      timeout: 15e3
    }
  );
  if (seedChild.status === 0) {
    console.log("  Job cache seeded successfully.");
  } else {
    console.log("  Could not seed job cache right now (no profile tags yet, or offline).");
    console.log("  Run `terminalhire jobs` after a few Claude Code sessions to populate it.");
  }
  console.log("");
  console.log("Step 3/5 \u2014 Enable the ambient spinner job surface in ~/.claude/settings.json");
  console.log("");
  console.log("  This is the only step that modifies a system file.");
  console.log("  A timestamped backup is created before any change.");
  console.log("  Disable at any time: node install.js --uninstall  (or terminalhire spinner --off)");
  console.log("");
  try {
    const installMod = await import(pathToFileURL(resolveInstallJs()).href);
    if (typeof installMod.installSpinner === "function") {
      await installMod.installSpinner({ ask });
    } else {
      console.log("");
      console.log("  Hook installation unavailable in this build. Run manually: node install.js");
    }
  } catch {
    console.log("");
    console.log("  Hook installation did not complete. Run manually: node install.js");
  }
  console.log("");
  console.log("Step 4/5 \u2014 Connection notifications in your statusLine (optional)");
  console.log("");
  console.log("  A statusLine that shows ONLY personal connection signals \u2014 \u{1F4AC} unread");
  console.log("  messages and inbound intro requests. Never job ads (those stay in the");
  console.log("  spinner). Local cache read, zero network. Separate consent + backup;");
  console.log("  it stays current across plugin updates and preserves any existing");
  console.log("  statusLine you have. Remove any time: node statusline-install.js --uninstall");
  console.log("");
  try {
    const statuslineMod = await import(pathToFileURL(resolveStatuslineInstallJs()).href);
    if (typeof statuslineMod.installStatusline === "function") {
      await statuslineMod.installStatusline({ ask });
    } else {
      console.log("");
      console.log("  statusLine setup unavailable in this build. Run manually: node statusline-install.js");
    }
  } catch {
    console.log("");
    console.log("  statusLine setup did not complete. Run manually: node statusline-install.js");
  }
  console.log("");
  console.log("Step 5/5 \u2014 Register terminalhire as a read-only MCP server (optional)");
  console.log("");
  console.log("  Exposes your LOCAL matches (jobs, bounties, contribute, inbox counts) to");
  console.log("  a host LLM \u2014 VS Code, Cursor, Codex, Gemini, Claude Code. Read-only, zero");
  console.log("  network egress. Detected host configs are backed up before any merge, and");
  console.log("  an existing unrelated MCP server is never touched. Preview snippets any");
  console.log("  time with: terminalhire mcp --print-config");
  console.log("");
  try {
    const { initMcpStep: initMcpStep2 } = await Promise.resolve().then(() => (init_mcp_config(), mcp_config_exports));
    await initMcpStep2({ ask });
  } catch {
    console.log("");
    console.log("  MCP setup did not complete. Run manually: terminalhire mcp --print-config");
  }
  rl.close();
  console.log("");
  console.log("\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510");
  console.log("\u2502  terminalhire init complete!                                    \u2502");
  console.log("\u2502                                                                  \u2502");
  console.log("\u2502  Restart Claude Code to see the ambient spinner job surface.    \u2502");
  console.log("\u2502                                                                  \u2502");
  console.log("\u2502  Quick reference:                                               \u2502");
  console.log("\u2502    terminalhire jobs          \u2014 browse matching roles           \u2502");
  console.log("\u2502    terminalhire spinner --off \u2014 disable the spinner surface     \u2502");
  console.log("\u2502    terminalhire login         \u2014 sign in with GitHub             \u2502");
  console.log("\u2502    terminalhire profile --show \u2014 inspect your local profile     \u2502");
  console.log("\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518");
  console.log("");
}
export {
  run
};
