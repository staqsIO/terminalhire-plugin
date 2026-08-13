// bin/recall-check.js
import {
  closeSync,
  existsSync,
  mkdirSync,
  openSync,
  readFileSync,
  readdirSync,
  renameSync,
  statSync,
  unlinkSync,
  writeFileSync
} from "fs";
import { homedir } from "os";
import { basename, dirname, join } from "path";

// src/api-base.ts
var PROD_API_BASE = "https://terminalhire.com";
var DEV_API_BASE = "https://dev.terminalhire.com";
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

// bin/recall-check.js
var RECALL_URL = `${resolveApiBase()}/api/cli/recall`;
function defaultUrl() {
  return process.env["TERMINALHIRE_RECALL_URL"] || RECALL_URL;
}
var TIMEOUT_MS = 2e3;
function stateDir() {
  return process.env["TERMINALHIRE_DIR"] || join(homedir(), ".terminalhire");
}
function recallCachePath() {
  return join(stateDir(), "recall.json");
}
async function fetchRecalls(url = defaultUrl()) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (!res.ok) return null;
    const body = await res.json();
    const recalled = body?.recalled;
    if (!recalled || typeof recalled !== "object" || Array.isArray(recalled)) return null;
    return recalled;
  } catch {
    return null;
  }
}
function readSticky(version, path = recallCachePath()) {
  try {
    if (!existsSync(path)) return null;
    const parsed = JSON.parse(readFileSync(path, "utf8"));
    const reason = parsed?.[version];
    return typeof reason === "string" && reason.length > 0 ? reason : null;
  } catch {
    return null;
  }
}
var tmpCounter = 0;
var STALE_LOCK_MS = 5e3;
var LOCK_WAIT_MS = STALE_LOCK_MS + 2e3;
function mutateCache(path, mutate) {
  const lock = `${path}.lock`;
  let held = false;
  try {
    mkdirSync(dirname(path), { recursive: true, mode: 448 });
    const deadline = Date.now() + LOCK_WAIT_MS;
    while (!held && Date.now() < deadline) {
      try {
        closeSync(openSync(lock, "wx", 384));
        held = true;
      } catch (err) {
        if (err?.code !== "EEXIST") return false;
        try {
          if (Date.now() - statSync(lock).mtimeMs > STALE_LOCK_MS) unlinkSync(lock);
        } catch {
        }
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 2);
      }
    }
    let existing = {};
    try {
      const parsed = JSON.parse(readFileSync(path, "utf8"));
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) existing = parsed;
    } catch {
    }
    if (mutate(existing) === false) return false;
    const tmp = `${path}.${process.pid}.${tmpCounter += 1}.tmp`;
    try {
      writeFileSync(tmp, `${JSON.stringify(existing, null, 2)}
`, { mode: 384 });
      renameSync(tmp, path);
    } catch {
      try {
        unlinkSync(tmp);
      } catch {
      }
      return false;
    }
    return true;
  } catch {
    return false;
  } finally {
    if (held) {
      try {
        unlinkSync(lock);
      } catch {
      }
    }
  }
}
function sweepTempFiles(path) {
  try {
    const dir = dirname(path);
    const prefix = `${basename(path)}.`;
    for (const name of readdirSync(dir)) {
      if (!name.startsWith(prefix) || !name.endsWith(".tmp")) continue;
      const full = join(dir, name);
      try {
        if (Date.now() - statSync(full).mtimeMs > 6e4) unlinkSync(full);
      } catch {
      }
    }
  } catch {
  }
}
function writeSticky(version, reason, path = recallCachePath()) {
  for (let attempt = 0; attempt < 5; attempt++) {
    if (!mutateCache(path, (map) => {
      map[version] = reason;
    })) {
      return;
    }
    if (readSticky(version, path) === reason) {
      sweepTempFiles(path);
      return;
    }
  }
}
function clearSticky(version, path = recallCachePath()) {
  const committed = mutateCache(path, (map) => {
    if (!(version in map)) return false;
    delete map[version];
    return true;
  });
  if (committed) sweepTempFiles(path);
}
function recallVerdict(version, recalls, sticky) {
  if (recalls !== null) {
    const reason = recalls[version];
    if (typeof reason === "string" && reason.length > 0) {
      return { blocked: true, reason, remember: true };
    }
    return { blocked: false, reason: null, remember: false };
  }
  if (sticky) return { blocked: true, reason: sticky, remember: false };
  return { blocked: false, reason: null, remember: false };
}
function formatRecallMessage(version, reason) {
  return [
    "",
    `  \u2717 terminalhire ${version} has been withdrawn.`,
    "",
    ...reason.split("\n").map((line) => `    ${line}`),
    "",
    "    Upgrade:  npm i -g terminalhire@latest",
    "",
    "  Nothing was cloned, and nothing was executed.",
    ""
  ].join("\n");
}
async function checkRecall(version, { url = defaultUrl(), path = recallCachePath() } = {}) {
  const sticky = readSticky(version, path);
  const recalls = await fetchRecalls(url);
  const verdict = recallVerdict(version, recalls, sticky);
  if (process.env["TERMINALHIRE_RECALL_URL"] && sticky && !verdict.blocked) {
    return { blocked: true, reason: sticky, remember: false };
  }
  if (verdict.remember && verdict.reason) writeSticky(version, verdict.reason, path);
  if (recalls !== null && sticky && !verdict.blocked) {
    clearSticky(version, path);
  }
  return verdict;
}
export {
  checkRecall,
  clearSticky,
  fetchRecalls,
  formatRecallMessage,
  readSticky,
  recallCachePath,
  recallVerdict,
  writeSticky
};
