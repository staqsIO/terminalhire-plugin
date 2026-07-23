#!/usr/bin/env node

// bin/jpi.js
import { readFileSync, writeFileSync, existsSync, readSync } from "fs";
import { isatty } from "tty";
import net from "net";
import { join } from "path";
import { homedir } from "os";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

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

// bin/jpi.js
var TERMINALHIRE_DIR = process.env.TERMINALHIRE_DIR || join(homedir(), ".terminalhire");
var INDEX_CACHE_FILE = join(TERMINALHIRE_DIR, "index-cache.json");
var NUDGE_FILE = join(TERMINALHIRE_DIR, "nudged.json");
var NUDGE_COUNTER_FILE = join(TERMINALHIRE_DIR, "nudge-counter.json");
var LEARNED_FILE = join(TERMINALHIRE_DIR, "learned-sessions.json");
var INDEX_CACHE_TTL_MS = 15 * 60 * 1e3;
var __dirname = fileURLToPath(new URL(".", import.meta.url));
function readStdinSync() {
  if (isatty(0)) return {};
  try {
    const sock = new net.Socket({ fd: 0, readable: true, writable: false });
    sock.pause();
    sock.unref();
  } catch {
  }
  const IDLE_MS = 200;
  const STREAM_IDLE_MS = 500;
  const MAX_TOTAL_MS = 1500;
  const start = Date.now();
  let lastProgress = start;
  const idle = new Int32Array(new SharedArrayBuffer(4));
  const chunks = [];
  const buf = Buffer.alloc(1 << 16);
  try {
    for (; ; ) {
      let n;
      try {
        n = readSync(0, buf, 0, buf.length, null);
      } catch (e) {
        if (e && e.code === "EAGAIN") {
          const idleBudget = chunks.length > 0 ? STREAM_IDLE_MS : IDLE_MS;
          if (Date.now() - lastProgress > idleBudget) break;
          if (Date.now() - start > MAX_TOTAL_MS) break;
          Atomics.wait(idle, 0, 0, 5);
          continue;
        }
        break;
      }
      if (n === 0) break;
      chunks.push(Buffer.from(buf.subarray(0, n)));
      lastProgress = Date.now();
      if (Date.now() - start > MAX_TOTAL_MS) break;
    }
  } catch {
    return {};
  }
  const raw = Buffer.concat(chunks).toString("utf8").trim();
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}
function readStdinWin32() {
  if (isatty(0)) return Promise.resolve({});
  return new Promise((resolve) => {
    const chunks = [];
    let settled = false;
    let timer;
    let hardStop;
    const finish = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      clearTimeout(hardStop);
      try {
        process.stdin.pause();
      } catch {
      }
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        resolve({});
      }
    };
    const IDLE_MS = 200;
    const STREAM_IDLE_MS = 500;
    const MAX_TOTAL_MS = 1500;
    const started = Date.now();
    const arm = (ms) => {
      clearTimeout(timer);
      timer = setTimeout(finish, ms);
      if (typeof timer.unref === "function") timer.unref();
    };
    arm(IDLE_MS);
    hardStop = setTimeout(finish, MAX_TOTAL_MS);
    if (typeof hardStop.unref === "function") hardStop.unref();
    process.stdin.on("data", (c) => {
      chunks.push(c);
      arm(Math.min(STREAM_IDLE_MS, Math.max(0, MAX_TOTAL_MS - (Date.now() - started))));
    });
    process.stdin.on("end", finish);
    process.stdin.on("error", finish);
  });
}
function readStdin() {
  if (process.platform === "win32") return readStdinWin32();
  return Promise.resolve(readStdinSync());
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
    ensureStateDir(TERMINALHIRE_DIR);
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
    ensureStateDir(TERMINALHIRE_DIR);
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
function getCachedUnreadChatCount() {
  try {
    const raw = readFileSync(INDEX_CACHE_FILE, "utf8");
    const entry = JSON.parse(raw);
    if (Date.now() - entry.ts > INDEX_CACHE_TTL_MS) return 0;
    const n = entry.unreadChat && entry.unreadChat.count;
    return typeof n === "number" && n > 0 ? n : 0;
  } catch {
    return 0;
  }
}
function getCachedSessionStale() {
  try {
    const raw = readFileSync(INDEX_CACHE_FILE, "utf8");
    const entry = JSON.parse(raw);
    if (Date.now() - entry.ts > INDEX_CACHE_TTL_MS) return false;
    return entry.sessionStale === true;
  } catch {
    return false;
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
    ensureStateDir(TERMINALHIRE_DIR);
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
  const input = await readStdin();
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
  const unreadChatCount = getCachedUnreadChatCount();
  const sessionStale = getCachedSessionStale() && incomingCount === 0 && unreadChatCount === 0;
  const haveRoles = matchCount !== null && matchCount > 0;
  if (!haveRoles && incomingCount === 0 && unreadChatCount === 0 && !sessionStale) process.exit(0);
  const hasConnectionSignal = incomingCount > 0 || unreadChatCount > 0 || sessionStale;
  const nudgeMode = getNudgeMode();
  if (!hasConnectionSignal && !shouldNudge(nudgeMode, sessionId)) process.exit(0);
  let line;
  if (haveRoles) {
    const plural = matchCount === 1 ? "role" : "roles";
    line = `\u2726 ${matchCount} ${plural} match your current work \u2014 run: th jobs`;
    if (incomingCount > 0)
      line += `  \xB7  \u2709 ${incomingCount} intro request${incomingCount === 1 ? "" : "s"}`;
    if (unreadChatCount > 0) line += `  \xB7  \u{1F4AC} ${unreadChatCount} unread`;
    if (sessionStale) line += `  \xB7  \u26A0 session expired \u2014 run: th link`;
  } else if (incomingCount > 0) {
    line = `\u2709 ${incomingCount} intro request${incomingCount === 1 ? "" : "s"} \u2014 run: th inbox`;
    if (unreadChatCount > 0) line += `  \xB7  \u{1F4AC} ${unreadChatCount} unread`;
  } else if (unreadChatCount > 0) {
    line = `\u{1F4AC} ${unreadChatCount} unread \u2014 run: th inbox`;
  } else {
    line = `\u26A0 terminalhire session expired \u2014 run: th link to restore your connection signals`;
  }
  process.stdout.write(line + "\n");
  if (haveRoles && nudgeMode === "session") {
    markNudged(sessionId);
  }
  process.exit(0);
} catch {
  process.exit(0);
}
