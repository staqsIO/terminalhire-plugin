#!/usr/bin/env node

// bin/jpi.js
import { readFileSync, writeFileSync, existsSync, readSync } from "fs";
import { isatty } from "tty";
import net from "net";
import { join as join3 } from "path";
import { homedir as homedir3 } from "os";
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

// bin/session-case.js
function hostLabel(base) {
  return String(base ?? "").replace(/^https?:\/\//, "");
}
function sessionCase(entry, { stale }) {
  const m = entry && entry.sessionHostMismatch;
  if (m && typeof m.linkedHost === "string" && typeof m.currentHost === "string") {
    return { kind: "mismatch", linkedHost: m.linkedHost, currentHost: m.currentHost };
  }
  if (!stale) return null;
  const host = entry && entry.staleHost;
  if (typeof host === "string" && host.length > 0) return { kind: "refused", host };
  return { kind: "expired" };
}

// src/state-dir-pin.ts
import { homedir as homedir2 } from "os";
import { join as join2 } from "path";

// src/api-base.ts
import { homedir } from "os";
import { basename, join, normalize } from "path";
var PROD_API_BASE = "https://terminalhire.com";
var DEV_API_BASE = "https://dev.terminalhire.com";
var DEV_STATE_DIR_NAME = ".terminalhire-dev";
var ApiBaseError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "ApiBaseError";
  }
};
var ALLOWED_HOSTS = {
  "terminalhire.com": "https:",
  "www.terminalhire.com": "https:",
  "dev.terminalhire.com": "https:",
  localhost: "http:",
  "127.0.0.1": "http:"
};
var ALLOW_LOCAL_API_KEY = "TERMINALHIRE_ALLOW_LOCAL_API";
var ALLOWED_DESCRIPTION = [
  PROD_API_BASE,
  DEV_API_BASE,
  `http://localhost:<port> (requires ${ALLOW_LOCAL_API_KEY}=1)`,
  `http://127.0.0.1:<port> (requires ${ALLOW_LOCAL_API_KEY}=1)`
].join(", ");
var CANONICAL_REWRITES = {
  "www.terminalhire.com": PROD_API_BASE
};
var ENV_KEYS = ["TERMINALHIRE_API_URL", "JPI_API_URL"];
function sanitizeOverrideForError(raw) {
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return `(disallowed scheme: ${url.protocol.slice(0, -1)})`;
    }
    if (url.username !== "" || url.password !== "") {
      return `${url.protocol}//***@${url.host}`;
    }
    return url.origin;
  } catch {
    return "(unparseable override)";
  }
}
function isLoopbackOrigin(origin) {
  try {
    const host = new URL(origin).hostname;
    return host === "localhost" || host === "127.0.0.1";
  } catch {
    return false;
  }
}
function localApiAllowed(env) {
  return env[ALLOW_LOCAL_API_KEY] === "1";
}
function resolveApiBase(env = process.env) {
  for (const key of ENV_KEYS) {
    const raw = env[key];
    if (typeof raw !== "string") continue;
    const trimmed = raw.trim();
    if (trimmed === "") continue;
    const normalized = normalizeOverride(trimmed);
    if (normalized === null) {
      throw new ApiBaseError(
        `terminalhire: ${key}=${sanitizeOverrideForError(trimmed)} is not an allowed API host (allowed: ${ALLOWED_DESCRIPTION}). Refusing to continue so we do not silently hit production.`
      );
    }
    if (isLoopbackOrigin(normalized) && !localApiAllowed(env)) {
      throw new ApiBaseError(
        `terminalhire: ${key}=${normalized} is a loopback origin. Set ${ALLOW_LOCAL_API_KEY}=1 to talk to a local web app on purpose. Refusing so stored credentials cannot be exfiltrated to localhost by a poisoned override.`
      );
    }
    return normalized;
  }
  return PROD_API_BASE;
}
function normalizeOverride(raw) {
  let url;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.username !== "" || url.password !== "") return null;
  const expectedProtocol = ALLOWED_HOSTS[url.hostname];
  if (expectedProtocol === void 0) return null;
  if (url.protocol !== expectedProtocol) return null;
  if (url.hostname !== "localhost" && url.hostname !== "127.0.0.1" && url.port !== "") {
    return null;
  }
  const rewrite = CANONICAL_REWRITES[url.hostname];
  if (rewrite !== void 0) return rewrite;
  return url.origin;
}

// src/state-dir-pin.ts
function pinStateDirToApiBase(env = process.env) {
  if (env["TERMINALHIRE_DIR"]) return null;
  let base;
  try {
    base = resolveApiBase(env);
  } catch {
    return null;
  }
  if (base !== DEV_API_BASE) return null;
  env["TERMINALHIRE_DIR"] = env["TERMINALHIRE_DIR"] || join2(homedir2(), DEV_STATE_DIR_NAME);
  return env["TERMINALHIRE_DIR"];
}

// bin/jpi.js
pinStateDirToApiBase();
var TERMINALHIRE_DIR = process.env.TERMINALHIRE_DIR || join3(homedir3(), ".terminalhire");
var INDEX_CACHE_FILE = join3(TERMINALHIRE_DIR, "index-cache.json");
var NUDGE_FILE = join3(TERMINALHIRE_DIR, "nudged.json");
var NUDGE_COUNTER_FILE = join3(TERMINALHIRE_DIR, "nudge-counter.json");
var LEARNED_FILE = join3(TERMINALHIRE_DIR, "learned-sessions.json");
var INDEX_CACHE_TTL_MS = 15 * 60 * 1e3;
var __dirname = fileURLToPath(new URL(".", import.meta.url));
function envMs(name, fallback) {
  if (process.env.TERMINALHIRE_STDIN_TEST !== "1") return fallback;
  const raw = process.env[name];
  if (raw === void 0 || raw === "") return fallback;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}
var STDIN_TRACE_PREFIX = "[terminalhire stdin trace] ";
function traceStdin(event, details = {}) {
  if (process.env.TERMINALHIRE_STDIN_TEST !== "1" || process.env.TERMINALHIRE_STDIN_TRACE !== "1") {
    return;
  }
  try {
    process.stderr.write(
      `${STDIN_TRACE_PREFIX}${JSON.stringify({ event, atMs: Date.now(), ...details })}
`
    );
  } catch {
  }
}
function readStdinSync() {
  if (isatty(0)) return {};
  try {
    const sock = new net.Socket({ fd: 0, readable: true, writable: false });
    sock.pause();
    sock.unref();
  } catch {
  }
  const IDLE_MS = envMs("TERMINALHIRE_STDIN_IDLE_MS", 200);
  const STREAM_IDLE_MS = envMs("TERMINALHIRE_STDIN_STREAM_IDLE_MS", 500);
  const MAX_TOTAL_MS = envMs("TERMINALHIRE_STDIN_MAX_TOTAL_MS", 1500);
  const start = Date.now();
  let lastProgress = start;
  let finishReason = "eof";
  let totalBytes = 0;
  const idle = new Int32Array(new SharedArrayBuffer(4));
  const chunks = [];
  const buf = Buffer.alloc(1 << 16);
  traceStdin("start", { platform: "posix" });
  try {
    for (; ; ) {
      let n;
      try {
        n = readSync(0, buf, 0, buf.length, null);
      } catch (e) {
        if (e && e.code === "EAGAIN") {
          const idleBudget = chunks.length > 0 ? STREAM_IDLE_MS : IDLE_MS;
          if (Date.now() - lastProgress > idleBudget) {
            finishReason = "idle-timeout";
            break;
          }
          if (Date.now() - start > MAX_TOTAL_MS) {
            finishReason = "max-total";
            break;
          }
          Atomics.wait(idle, 0, 0, 5);
          continue;
        }
        finishReason = `read-error:${e?.code ?? "unknown"}`;
        break;
      }
      if (n === 0) break;
      chunks.push(Buffer.from(buf.subarray(0, n)));
      totalBytes += n;
      lastProgress = Date.now();
      traceStdin("data", { platform: "posix", bytes: n, totalBytes });
      if (Date.now() - start > MAX_TOTAL_MS) {
        finishReason = "max-total";
        break;
      }
    }
  } catch {
    traceStdin("finish", {
      platform: "posix",
      reason: "reader-exception",
      elapsedMs: Date.now() - start,
      chunkCount: chunks.length,
      totalBytes,
      parseOk: false
    });
    return {};
  }
  const raw = Buffer.concat(chunks).toString("utf8").trim();
  if (!raw) {
    traceStdin("finish", {
      platform: "posix",
      reason: finishReason,
      elapsedMs: Date.now() - start,
      chunkCount: chunks.length,
      totalBytes,
      parseOk: false
    });
    return {};
  }
  try {
    const parsed = JSON.parse(raw);
    traceStdin("finish", {
      platform: "posix",
      reason: finishReason,
      elapsedMs: Date.now() - start,
      chunkCount: chunks.length,
      totalBytes,
      parseOk: true
    });
    return parsed;
  } catch {
    traceStdin("finish", {
      platform: "posix",
      reason: `${finishReason}:parse-error`,
      elapsedMs: Date.now() - start,
      chunkCount: chunks.length,
      totalBytes,
      parseOk: false
    });
    return {};
  }
}
function readStdinWin32() {
  if (isatty(0)) return Promise.resolve({});
  return new Promise((resolve) => {
    const chunks = [];
    let totalBytes = 0;
    let settled = false;
    let timer;
    let hardStop;
    const started = Date.now();
    const finish = (reason) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      clearTimeout(hardStop);
      try {
        process.stdin.pause();
      } catch {
      }
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        traceStdin("finish", {
          platform: "win32",
          reason,
          elapsedMs: Date.now() - started,
          chunkCount: chunks.length,
          totalBytes,
          parseOk: false
        });
        return resolve({});
      }
      try {
        const parsed = JSON.parse(raw);
        traceStdin("finish", {
          platform: "win32",
          reason,
          elapsedMs: Date.now() - started,
          chunkCount: chunks.length,
          totalBytes,
          parseOk: true
        });
        resolve(parsed);
      } catch {
        traceStdin("finish", {
          platform: "win32",
          reason: `${reason}:parse-error`,
          elapsedMs: Date.now() - started,
          chunkCount: chunks.length,
          totalBytes,
          parseOk: false
        });
        resolve({});
      }
    };
    const IDLE_MS = envMs("TERMINALHIRE_STDIN_IDLE_MS", 200);
    const STREAM_IDLE_MS = envMs("TERMINALHIRE_STDIN_STREAM_IDLE_MS", 500);
    const MAX_TOTAL_MS = envMs("TERMINALHIRE_STDIN_MAX_TOTAL_MS", 1500);
    traceStdin("start", { platform: "win32" });
    const arm = (ms) => {
      clearTimeout(timer);
      timer = setTimeout(() => finish("idle-timeout"), ms);
      if (typeof timer.unref === "function") timer.unref();
    };
    arm(IDLE_MS);
    hardStop = setTimeout(() => finish("max-total"), MAX_TOTAL_MS);
    if (typeof hardStop.unref === "function") hardStop.unref();
    process.stdin.on("data", (c) => {
      chunks.push(c);
      totalBytes += c.length;
      traceStdin("data", { platform: "win32", bytes: c.length, totalBytes });
      arm(Math.min(STREAM_IDLE_MS, Math.max(0, MAX_TOTAL_MS - (Date.now() - started))));
    });
    process.stdin.on("end", () => finish("end"));
    process.stdin.on("error", () => finish("stream-error"));
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
    const learnScript = join3(__dirname, "jpi-learn.js");
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
function getCachedEntry() {
  try {
    const raw = readFileSync(INDEX_CACHE_FILE, "utf8");
    const entry = JSON.parse(raw);
    if (Date.now() - entry.ts > INDEX_CACHE_TTL_MS) return null;
    return entry;
  } catch {
    return null;
  }
}
function sessionComplaint(c) {
  if (!c) return "\u26A0 terminalhire session expired \u2014 run: th link to restore your connection signals";
  if (c.kind === "mismatch")
    return `\u26A0 terminalhire linked to ${hostLabel(c.linkedHost)}, polling ${hostLabel(c.currentHost)} \u2014 run: th link`;
  if (c.kind === "refused")
    return `\u26A0 terminalhire session was refused by ${hostLabel(c.host)} \u2014 run: th link`;
  return "\u26A0 terminalhire session expired \u2014 run: th link to restore your connection signals";
}
function getNudgeMode() {
  const envVal = process.env["TERMINALHIRE_NUDGE"];
  if (envVal) {
    const parsed = parseNudgeMode(envVal);
    if (parsed) return parsed;
  }
  try {
    const configFile = join3(TERMINALHIRE_DIR, "config.json");
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
  const sessionMsg = sessionCase(getCachedEntry(), { stale: sessionStale });
  const haveRoles = matchCount !== null && matchCount > 0;
  if (!haveRoles && incomingCount === 0 && unreadChatCount === 0 && !sessionMsg) process.exit(0);
  const hasConnectionSignal = incomingCount > 0 || unreadChatCount > 0 || Boolean(sessionMsg);
  const nudgeMode = getNudgeMode();
  if (!hasConnectionSignal && !shouldNudge(nudgeMode, sessionId)) process.exit(0);
  const mismatchSuffix = sessionMsg && sessionMsg.kind === "mismatch" ? `  \xB7  \u26A0 linked to ${hostLabel(sessionMsg.linkedHost)}, polling ${hostLabel(sessionMsg.currentHost)} \u2014 run: th link` : "";
  let line;
  if (haveRoles) {
    const plural = matchCount === 1 ? "role" : "roles";
    line = `\u2726 ${matchCount} ${plural} match your current work \u2014 run: th jobs`;
    if (incomingCount > 0)
      line += `  \xB7  \u2709 ${incomingCount} intro request${incomingCount === 1 ? "" : "s"}`;
    if (unreadChatCount > 0) line += `  \xB7  \u{1F4AC} ${unreadChatCount} unread`;
    if (mismatchSuffix) line += mismatchSuffix;
    else if (sessionMsg && sessionMsg.kind === "refused")
      line += `  \xB7  \u26A0 session refused by ${hostLabel(sessionMsg.host)} \u2014 run: th link`;
    else if (sessionMsg) line += `  \xB7  \u26A0 session expired \u2014 run: th link`;
  } else if (incomingCount > 0) {
    line = `\u2709 ${incomingCount} intro request${incomingCount === 1 ? "" : "s"} \u2014 run: th inbox`;
    if (unreadChatCount > 0) line += `  \xB7  \u{1F4AC} ${unreadChatCount} unread`;
    line += mismatchSuffix;
  } else if (unreadChatCount > 0) {
    line = `\u{1F4AC} ${unreadChatCount} unread \u2014 run: th inbox`;
    line += mismatchSuffix;
  } else {
    line = sessionComplaint(sessionMsg);
  }
  process.stdout.write(line + "\n");
  if (haveRoles && nudgeMode === "session") {
    markNudged(sessionId);
  }
  process.exit(0);
} catch {
  process.exit(0);
}
