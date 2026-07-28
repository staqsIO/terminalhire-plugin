#!/usr/bin/env node

// bin/mcp-config.js
import { homedir } from "os";
import { join } from "path";
import { existsSync, readFileSync, copyFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname } from "path";
var SERVER_KEY = "terminalhire";
var SERVER_COMMAND = "terminalhire";
var SERVER_ARGS = ["mcp"];
function serverEntry() {
  return { command: SERVER_COMMAND, args: [...SERVER_ARGS] };
}
var HOSTS = [
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
export {
  HOSTS,
  SERVER_ARGS,
  SERVER_COMMAND,
  SERVER_KEY,
  claudeCliSnippet,
  hostConfigPath,
  initMcpStep,
  jsonSnippet,
  mergeServerIntoJson,
  printConfigText,
  serverEntry,
  tomlSnippet,
  writeServerToFile
};
