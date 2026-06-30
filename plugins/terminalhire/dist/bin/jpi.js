#!/usr/bin/env node

// bin/jpi.js
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
var TERMINALHIRE_DIR = join(homedir(), ".terminalhire");
var INDEX_CACHE_FILE = join(TERMINALHIRE_DIR, "index-cache.json");
var NUDGE_FILE = join(TERMINALHIRE_DIR, "nudged.json");
var NUDGE_COUNTER_FILE = join(TERMINALHIRE_DIR, "nudge-counter.json");
var LEARNED_FILE = join(TERMINALHIRE_DIR, "learned-sessions.json");
var INDEX_CACHE_TTL_MS = 15 * 60 * 1e3;
var __dirname = fileURLToPath(new URL(".", import.meta.url));
function readStdinSync() {
  try {
    const raw = readFileSync("/dev/stdin", "utf8").trim();
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}
function readNudged() {
  try {
    return JSON.parse(readFileSync(NUDGE_FILE, "utf8"));
  } catch {
    return {};
  }
}
function readLearned() {
  try {
    return JSON.parse(readFileSync(LEARNED_FILE, "utf8"));
  } catch {
    return {};
  }
}
function markLearned(sessionId) {
  try {
    mkdirSync(TERMINALHIRE_DIR, { recursive: true });
    const learned = readLearned();
    learned[sessionId] = Date.now();
    const cutoff = Date.now() - 864e5;
    for (const [k, v] of Object.entries(learned)) {
      if (typeof v === "number" && v < cutoff) delete learned[k];
    }
    writeFileSync(LEARNED_FILE, JSON.stringify(learned), "utf8");
  } catch {
  }
}
function spawnLearnDetached(cwd) {
  try {
    const learnScript = join(__dirname, "jpi-learn.js");
    const child = spawn(process.execPath, [learnScript, "--cwd", cwd], {
      detached: true,
      stdio: "ignore"
    });
    child.unref();
  } catch {
  }
}
function markNudged(sessionId) {
  try {
    mkdirSync(TERMINALHIRE_DIR, { recursive: true });
    const nudged = readNudged();
    nudged[sessionId] = Date.now();
    const cutoff = Date.now() - 864e5;
    for (const [k, v] of Object.entries(nudged)) {
      if (typeof v === "number" && v < cutoff) delete nudged[k];
    }
    writeFileSync(NUDGE_FILE, JSON.stringify(nudged), "utf8");
  } catch {
  }
}
function getCachedMatchCount() {
  try {
    const raw = readFileSync(INDEX_CACHE_FILE, "utf8");
    const entry = JSON.parse(raw);
    if (Date.now() - entry.ts > INDEX_CACHE_TTL_MS) return null;
    return typeof entry.matchCount === "number" ? entry.matchCount : null;
  } catch {
    return null;
  }
}
function getCachedIncomingCount() {
  try {
    const raw = readFileSync(INDEX_CACHE_FILE, "utf8");
    const entry = JSON.parse(raw);
    if (Date.now() - entry.ts > INDEX_CACHE_TTL_MS) return 0;
    const n = entry.incomingPending && entry.incomingPending.count;
    return typeof n === "number" && n > 0 ? n : 0;
  } catch {
    return 0;
  }
}
function getNudgeMode() {
  const envVal = process.env["TERMINALHIRE_NUDGE"];
  if (envVal) {
    const parsed = parseNudgeMode(envVal);
    if (parsed) return parsed;
  }
  try {
    const configFile = join(TERMINALHIRE_DIR, "config.json");
    if (existsSync(configFile)) {
      const cfg = JSON.parse(readFileSync(configFile, "utf8"));
      if (cfg.nudge) {
        const parsed = parseNudgeMode(cfg.nudge);
        if (parsed) return parsed;
      }
    }
  } catch {
  }
  return "session";
}
function parseNudgeMode(raw) {
  if (raw === "session" || raw === "always") return raw;
  const m = /^every:(\d+)$/.exec(raw);
  if (m) {
    const n = parseInt(m[1], 10);
    if (n >= 1) return `every:${n}`;
  }
  return null;
}
function bumpRenderCounter() {
  try {
    mkdirSync(TERMINALHIRE_DIR, { recursive: true });
    let counter = 0;
    if (existsSync(NUDGE_COUNTER_FILE)) {
      const raw = JSON.parse(readFileSync(NUDGE_COUNTER_FILE, "utf8"));
      counter = typeof raw.count === "number" ? raw.count : 0;
    }
    counter++;
    writeFileSync(NUDGE_COUNTER_FILE, JSON.stringify({ count: counter }), "utf8");
    return counter;
  } catch {
    return 1;
  }
}
function shouldNudge(nudgeMode, sessionId) {
  if (nudgeMode === "always") {
    return true;
  }
  if (nudgeMode === "session") {
    const nudged2 = readNudged();
    return !nudged2[sessionId];
  }
  const m = /^every:(\d+)$/.exec(nudgeMode);
  if (m) {
    const n = parseInt(m[1], 10);
    const count = bumpRenderCounter();
    return count % n === 0;
  }
  const nudged = readNudged();
  return !nudged[sessionId];
}
try {
  const input = readStdinSync();
  const sessionId = input?.session_id;
  if (!sessionId) process.exit(0);
  const learned = readLearned();
  if (!learned[sessionId]) {
    const workDir = input?.workspace?.current_dir ?? process.cwd();
    spawnLearnDetached(workDir);
    markLearned(sessionId);
  }
  const matchCount = getCachedMatchCount();
  const incomingCount = getCachedIncomingCount();
  const haveRoles = matchCount !== null && matchCount > 0;
  if (!haveRoles && incomingCount === 0) process.exit(0);
  const nudgeMode = getNudgeMode();
  if (!shouldNudge(nudgeMode, sessionId)) process.exit(0);
  let line;
  if (haveRoles) {
    const plural = matchCount === 1 ? "role" : "roles";
    line = `\u2726 ${matchCount} ${plural} match your current work \u2014 run: terminalhire jobs`;
    if (incomingCount > 0) line += `  \xB7  \u2709 ${incomingCount} waiting to connect`;
  } else {
    line = `\u2709 ${incomingCount} waiting to connect \u2014 run: terminalhire intro --list`;
  }
  process.stdout.write(line + "\n");
  if (nudgeMode === "session") {
    markNudged(sessionId);
  }
  process.exit(0);
} catch {
  process.exit(0);
}
