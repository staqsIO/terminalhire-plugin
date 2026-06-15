#!/usr/bin/env node

// bin/jpi-config.js
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";
var TERMINALHIRE_DIR = join(homedir(), ".terminalhire");
var CONFIG_FILE = join(TERMINALHIRE_DIR, "config.json");
var DEFAULT_CONFIG = { nudge: "session" };
function readConfig() {
  try {
    if (!existsSync(CONFIG_FILE)) return { ...DEFAULT_CONFIG };
    return { ...DEFAULT_CONFIG, ...JSON.parse(readFileSync(CONFIG_FILE, "utf8")) };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}
function writeConfig(patch) {
  mkdirSync(TERMINALHIRE_DIR, { recursive: true });
  const merged = { ...readConfig(), ...patch };
  writeFileSync(CONFIG_FILE, JSON.stringify(merged, null, 2) + "\n", "utf8");
}
function parseNudgeMode(raw) {
  if (raw === "session" || raw === "always") return raw;
  const m = /^every:(\d+)$/.exec(raw);
  if (m && parseInt(m[1], 10) >= 1) return raw;
  return null;
}
async function run() {
  const args = process.argv.slice(2);
  const filtered = args[0] === "config" ? args.slice(1) : args;
  if (filtered.includes("--show") || filtered.length === 0) {
    const cfg = readConfig();
    const envOverride = process.env["TERMINALHIRE_NUDGE"];
    console.log("");
    console.log("terminalhire config");
    console.log("");
    console.log(`  nudge: ${cfg.nudge}`);
    if (envOverride) {
      console.log(`  (overridden by TERMINALHIRE_NUDGE=${envOverride} at runtime)`);
    }
    console.log(`  config file: ${CONFIG_FILE}`);
    console.log("");
    console.log("  Valid nudge values:");
    console.log("    session   \u2014 print at most once per Claude Code session (default)");
    console.log("    always    \u2014 print every statusLine render when matches exist");
    console.log("    every:N   \u2014 print every Nth render (e.g. every:3)");
    console.log("");
    return;
  }
  const nudgeIdx = filtered.indexOf("--nudge");
  if (nudgeIdx !== -1) {
    const value = filtered[nudgeIdx + 1];
    if (!value) {
      console.error("Error: --nudge requires a value: session | always | every:N");
      process.exit(1);
    }
    const parsed = parseNudgeMode(value);
    if (!parsed) {
      console.error(`Error: invalid nudge value "${value}". Valid: session | always | every:N`);
      process.exit(1);
    }
    writeConfig({ nudge: parsed });
    console.log(`  nudge set to: ${parsed}`);
    console.log(`  (saved to ${CONFIG_FILE})`);
    return;
  }
  console.error("Usage: terminalhire config --nudge <session|always|every:N>");
  console.error("       terminalhire config --show");
  process.exit(1);
}
export {
  run
};
