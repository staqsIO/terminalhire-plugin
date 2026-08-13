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

// src/state-dir.ts
import { closeSync, constants, fchmodSync, fstatSync, mkdirSync, openSync } from "fs";
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
function applyStateDirSecretPolicy(dir, status) {
  if (status === STATE_DIR_SYMLINK) {
    throw new Error(
      `terminalhire: refusing to write key material into ${dir} \u2014 it is a symlink, not a directory.
A write through it would FOLLOW THE LINK and place key/token material wherever the symlink points, outside our control and outside the "owner-only" (0700) guarantee this directory is supposed to carry.
Fix: remove the symlink so terminalhire can recreate it as a real directory \u2014
  rm ${dir}
then re-run the command. If the symlink is intentional, point TERMINALHIRE_DIR at a real directory instead of routing it through this one.`
    );
  }
  if (status === STATE_DIR_UNVERIFIED && !warnedUnverifiedSecretWriteThisProcess) {
    warnedUnverifiedSecretWriteThisProcess = true;
    try {
      process.stderr.write(
        `terminalhire: could not verify ${dir}'s permissions (expected on Windows \u2014 POSIX mode bits do not apply there) \u2014 proceeding, but the "owner-only" guarantee on key/token storage is NOT enforced on this platform.
`
      );
    } catch {
    }
  }
}
function ensureStateDirForSecret(dir) {
  applyStateDirSecretPolicy(dir, ensureStateDir(dir));
}
var STATE_DIR_MODE, STATE_DIR_OK, STATE_DIR_SYMLINK, STATE_DIR_UNVERIFIED, warnedDirs, warnedUnverifiedSecretWriteThisProcess;
var init_state_dir = __esm({
  "src/state-dir.ts"() {
    "use strict";
    STATE_DIR_MODE = 448;
    STATE_DIR_OK = "ok";
    STATE_DIR_SYMLINK = "symlink";
    STATE_DIR_UNVERIFIED = "unverified";
    warnedDirs = /* @__PURE__ */ new Set();
    warnedUnverifiedSecretWriteThisProcess = false;
  }
});

// src/web-session.ts
import { chmodSync, existsSync, readFileSync, rmSync, writeFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";
function terminalhireDir() {
  return process.env.TERMINALHIRE_DIR || join(homedir(), ".terminalhire");
}
function webSessionFilePath() {
  return join(terminalhireDir(), "web-session");
}
function readWebSessionFile() {
  try {
    const path = webSessionFilePath();
    if (!existsSync(path)) return null;
    const v = readFileSync(path, "utf8").trim();
    return v.length > 0 ? v : null;
  } catch {
    return null;
  }
}
function writeWebSessionFile(token) {
  ensureStateDirForSecret(terminalhireDir());
  const path = webSessionFilePath();
  writeFileSync(path, token, { mode: 384, encoding: "utf8" });
  try {
    chmodSync(path, 384);
  } catch {
  }
}
function clearWebSessionFile() {
  try {
    rmSync(webSessionFilePath());
  } catch {
  }
}
var init_web_session = __esm({
  "src/web-session.ts"() {
    "use strict";
    init_state_dir();
  }
});

// src/config.ts
import { readFileSync as readFileSync2, writeFileSync as writeFileSync2, existsSync as existsSync2 } from "fs";
import { join as join2 } from "path";
import { homedir as homedir2 } from "os";
function readConfig() {
  try {
    if (!existsSync2(CONFIG_FILE)) return { ...DEFAULT_CONFIG };
    const raw = readFileSync2(CONFIG_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_CONFIG, ...parsed };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}
function writeConfig(config) {
  ensureStateDir(TERMINALHIRE_DIR);
  const current = readConfig();
  const merged = { ...current, ...config };
  if ("contributePrompted" in merged) {
    if (merged.contributeEnabled === false && !("contributeEnabled" in config)) {
      delete merged.contributeEnabled;
    }
    delete merged.contributePrompted;
  }
  writeFileSync2(CONFIG_FILE, JSON.stringify(merged, null, 2) + "\n", "utf8");
}
var TERMINALHIRE_DIR, CONFIG_FILE, DEFAULT_CONFIG;
var init_config = __esm({
  "src/config.ts"() {
    "use strict";
    init_state_dir();
    TERMINALHIRE_DIR = process.env.TERMINALHIRE_DIR || join2(homedir2(), ".terminalhire");
    CONFIG_FILE = join2(TERMINALHIRE_DIR, "config.json");
    DEFAULT_CONFIG = {
      nudge: "session",
      peerConnect: false,
      peerConnectPrompted: false,
      resumePublishPrompted: false,
      chatDisclosureAck: false,
      chatShareActivity: false,
      inboundNudgeMuted: false,
      inboundNudgeDisclosed: false,
      contributeEnabled: true,
      betaOptIn: false,
      lastFullFeedbackAt: null,
      lastPulseAskAt: null,
      pulseDisclosed: false,
      mix: "balanced",
      founderBountyNotify: false
    };
  }
});

// src/api-base.ts
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
function resolveOAuthBase(env = process.env) {
  const base = resolveApiBase(env);
  if (OAUTH_ALLOWED_ORIGINS.includes(base)) return base;
  if (env[ALLOW_LOCAL_OAUTH_KEY] === "1") return base;
  throw new ApiBaseError(
    `terminalhire: the API base is ${base}, which is not a trusted origin for a browser sign-in. Point the CLI at ${DEV_API_BASE} for an end-to-end login, or set ${ALLOW_LOCAL_OAUTH_KEY}=1 (with ${ALLOW_LOCAL_API_KEY}=1) if you are running the web app locally on purpose. Refusing to open production sign-in while the API is local.`
  );
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
var PROD_API_BASE, DEV_API_BASE, ApiBaseError, ALLOWED_HOSTS, OAUTH_ALLOWED_ORIGINS, ALLOW_LOCAL_OAUTH_KEY, ALLOW_LOCAL_API_KEY, ALLOWED_DESCRIPTION, CANONICAL_REWRITES, ENV_KEYS;
var init_api_base = __esm({
  "src/api-base.ts"() {
    "use strict";
    PROD_API_BASE = "https://terminalhire.com";
    DEV_API_BASE = "https://dev.terminalhire.com";
    ApiBaseError = class extends Error {
      constructor(message) {
        super(message);
        this.name = "ApiBaseError";
      }
    };
    ALLOWED_HOSTS = {
      "terminalhire.com": "https:",
      "www.terminalhire.com": "https:",
      "dev.terminalhire.com": "https:",
      localhost: "http:",
      "127.0.0.1": "http:"
    };
    OAUTH_ALLOWED_ORIGINS = [PROD_API_BASE, DEV_API_BASE];
    ALLOW_LOCAL_OAUTH_KEY = "TERMINALHIRE_ALLOW_LOCAL_OAUTH";
    ALLOW_LOCAL_API_KEY = "TERMINALHIRE_ALLOW_LOCAL_API";
    ALLOWED_DESCRIPTION = [
      PROD_API_BASE,
      DEV_API_BASE,
      `http://localhost:<port> (requires ${ALLOW_LOCAL_API_KEY}=1)`,
      `http://127.0.0.1:<port> (requires ${ALLOW_LOCAL_API_KEY}=1)`
    ].join(", ");
    CANONICAL_REWRITES = {
      "www.terminalhire.com": PROD_API_BASE
    };
    ENV_KEYS = ["TERMINALHIRE_API_URL", "JPI_API_URL"];
  }
});

// src/open-url.js
var open_url_exports = {};
__export(open_url_exports, {
  openInBrowser: () => openInBrowser
});
import { spawn } from "child_process";
function openInBrowser(url) {
  let cmd;
  let args;
  if (process.platform === "darwin") {
    cmd = "open";
    args = [url];
  } else if (process.platform === "win32") {
    cmd = "cmd";
    args = ["/c", "start", "", url];
  } else {
    cmd = "xdg-open";
    args = [url];
  }
  try {
    const child = spawn(cmd, args, { stdio: "ignore", detached: true });
    child.on("error", () => {
    });
    child.unref();
  } catch {
  }
}
var init_open_url = __esm({
  "src/open-url.js"() {
    "use strict";
  }
});

// src/link.ts
var link_exports = {};
__export(link_exports, {
  resolveLoopbackRequest: () => resolveLoopbackRequest,
  runLink: () => runLink,
  runLinkLogout: () => runLinkLogout
});
import { createServer } from "http";
import { randomBytes } from "crypto";
function resolveLoopbackRequest(rawUrl, expectedNonce) {
  let u;
  try {
    u = new URL(rawUrl, "http://127.0.0.1");
  } catch {
    return { ok: false, reason: "bad_url" };
  }
  const nonce = u.searchParams.get("nonce");
  if (!nonce || nonce !== expectedNonce) return { ok: false, reason: "nonce_mismatch" };
  const token = u.searchParams.get("token");
  if (!token) return { ok: false, reason: "missing_token" };
  return { ok: true, token };
}
function defaultStartLoopback(expectedNonce, timeoutMs) {
  return new Promise((resolveHandle) => {
    let settle;
    const result = new Promise((res) => {
      settle = res;
    });
    let done = false;
    const finish = (r) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      settle(r);
      setImmediate(() => {
        try {
          server.close();
        } catch {
        }
      });
    };
    const server = createServer((req, res) => {
      const outcome = resolveLoopbackRequest(req.url ?? "", expectedNonce);
      res.writeHead(outcome.ok ? 200 : 400, { "Content-Type": "text/html; charset=utf-8" });
      res.end(outcome.ok ? LINKED_HTML : FAILED_HTML);
      finish(outcome);
    });
    const timer = setTimeout(() => finish({ ok: false, reason: "timeout" }), timeoutMs);
    if (typeof timer.unref === "function") timer.unref();
    server.on("error", () => finish({ ok: false, reason: "listen_error" }));
    server.listen(0, "127.0.0.1", () => {
      const addr = server.address();
      const port = typeof addr === "object" && addr ? addr.port : 0;
      resolveHandle({
        port,
        result,
        close: () => {
          try {
            server.close();
          } catch {
          }
        }
      });
    });
  });
}
function defaultLinkDeps() {
  return {
    startLoopback: defaultStartLoopback,
    openBrowser: (url) => {
      void Promise.resolve().then(() => (init_open_url(), open_url_exports)).then((m) => m.openInBrowser(url)).catch(() => {
      });
    },
    generateNonce: () => randomBytes(16).toString("hex"),
    persistToken: (token) => writeWebSessionFile(token),
    markNudgeDisclosed: () => writeConfig({ inboundNudgeDisclosed: true }),
    // No-op by default: the index-cache is a bin-layer concern (statusline/spinner
    // render), so the real writer (cache-store.updateIndexCache) is injected by
    // jpi-link.js. src on its own does not reach the cache — worst case the flag
    // clears on the next background poll, i.e. today's behavior, never worse.
    clearSessionStale: () => {
    },
    log: (msg) => console.log(msg),
    errorLog: (msg) => console.error(msg),
    exit: (code) => process.exit(code)
  };
}
async function runLink(overrides) {
  const deps = { ...defaultLinkDeps(), ...overrides };
  const nonce = deps.generateNonce();
  const oauthBase = resolveOAuthBase();
  const handle = await deps.startLoopback(nonce, LINK_TIMEOUT_MS);
  const url = `${oauthBase}/api/auth/link?port=${handle.port}&nonce=${encodeURIComponent(nonce)}`;
  deps.log("");
  deps.log("  terminalhire \u2014 link this terminal to your account");
  deps.log("  \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500");
  deps.log("  Opening your browser to approve. If it does not open, paste this URL:");
  deps.log(`  \u2192 ${url}`);
  deps.log("  Waiting for approval (this tab closes itself once you approve)\u2026");
  deps.openBrowser(url);
  let outcome;
  try {
    outcome = await handle.result;
  } finally {
    handle.close();
  }
  if (!outcome.ok || !outcome.token) {
    if (outcome.reason === "timeout") {
      deps.errorLog("\n  Link timed out \u2014 run `terminalhire link` again.\n");
    } else if (outcome.reason === "nonce_mismatch") {
      deps.errorLog("\n  Link rejected (nonce did not match) \u2014 run `terminalhire link` again.\n");
    } else {
      deps.errorLog("\n  Link failed \u2014 run `terminalhire link` again.\n");
    }
    deps.exit(1);
    return;
  }
  deps.persistToken(outcome.token);
  try {
    deps.clearSessionStale();
  } catch {
  }
  deps.log("\n  This terminal is now linked to your terminalhire account.");
  deps.log(
    "  Try `terminalhire intro <login>`, `terminalhire chat`, or `terminalhire trajectory --push`."
  );
  deps.log("  Your spinner will quietly surface incoming connection requests.");
  deps.log("  Turn that off any time with `terminalhire connect --mute`.");
  deps.log("  Unlink any time with `terminalhire link --logout`.\n");
  try {
    deps.markNudgeDisclosed();
  } catch {
  }
  deps.exit(0);
}
function defaultLinkLogoutDeps() {
  return {
    fetchImpl: (...args) => globalThis.fetch(...args),
    readSessionFile: () => readWebSessionFile(),
    clearSessionFile: () => clearWebSessionFile(),
    log: (msg) => console.log(msg),
    errorLog: (msg) => console.error(msg),
    exit: (code) => process.exit(code)
  };
}
async function runLinkLogout(overrides) {
  const deps = { ...defaultLinkLogoutDeps(), ...overrides };
  const token = deps.readSessionFile();
  if (!token) {
    deps.log("\n  No linked web session on this machine \u2014 nothing to unlink.\n");
    deps.exit(0);
    return;
  }
  let revoked = false;
  try {
    const res = await deps.fetchImpl(`${LINK_BASE}/api/auth/session`, {
      method: "DELETE",
      headers: { Cookie: `${GH_SESSION_COOKIE}=${token}` },
      signal: AbortSignal.timeout(1e4)
    });
    revoked = res.ok;
  } catch {
  }
  deps.clearSessionFile();
  if (revoked) {
    deps.log("\n  Unlinked \u2014 the session was revoked server-side and removed from this machine.\n");
  } else {
    deps.log("\n  Removed the local session from this machine.");
    deps.log("  (Could not reach the server to revoke it \u2014 it expires on its own.)\n");
  }
  deps.exit(0);
}
var LINK_BASE, GH_SESSION_COOKIE, LINK_TIMEOUT_MS, LINKED_HTML, FAILED_HTML;
var init_link = __esm({
  "src/link.ts"() {
    "use strict";
    init_web_session();
    init_config();
    init_api_base();
    LINK_BASE = resolveApiBase();
    GH_SESSION_COOKIE = "__jpi_gh_session";
    LINK_TIMEOUT_MS = 12e4;
    LINKED_HTML = `<!doctype html><html><head><meta charset="utf-8"><title>terminalhire</title></head>
<body style="font-family:system-ui;padding:2rem;background:#0b0d10;color:#e6e6e6">
<script>history.replaceState({},'','/');</script>
<p>CLI linked \u2014 you can close this tab.</p>
<script>setTimeout(function(){window.close();},400);</script>
</body></html>`;
    FAILED_HTML = `<!doctype html><html><head><meta charset="utf-8"><title>terminalhire</title></head>
<body style="font-family:system-ui;padding:2rem;background:#0b0d10;color:#e6e6e6">
<script>history.replaceState({},'','/');</script>
<p>Link failed \u2014 return to your terminal and run <code>terminalhire link</code> again.</p>
</body></html>`;
  }
});

// bin/cache-store.js
var cache_store_exports = {};
__export(cache_store_exports, {
  readCacheEntry: () => readCacheEntry,
  updateIndexCache: () => updateIndexCache,
  writeIndexCache: () => writeIndexCache
});
import { readFileSync as readFileSync3, writeFileSync as writeFileSync3, renameSync } from "fs";
import { join as join3 } from "path";
import { homedir as homedir3 } from "os";
function readCacheEntry() {
  try {
    return JSON.parse(readFileSync3(INDEX_CACHE_FILE, "utf8"));
  } catch {
    return null;
  }
}
function updateIndexCache(patch) {
  ensureStateDir(TERMINALHIRE_DIR2);
  const existing = readCacheEntry() ?? {};
  const entry = {
    ...existing,
    ...patch,
    schemaVersion: SCHEMA_VERSION,
    ts: Date.now()
  };
  const tmp = `${INDEX_CACHE_FILE}.${process.pid}.${tmpCounter++}.tmp`;
  writeFileSync3(tmp, JSON.stringify(entry), "utf8");
  renameSync(tmp, INDEX_CACHE_FILE);
  return entry;
}
function writeIndexCache(index) {
  return updateIndexCache({ index, indexETag: "" });
}
var TERMINALHIRE_DIR2, INDEX_CACHE_FILE, SCHEMA_VERSION, tmpCounter;
var init_cache_store = __esm({
  "bin/cache-store.js"() {
    "use strict";
    init_state_dir();
    TERMINALHIRE_DIR2 = process.env.TERMINALHIRE_DIR || join3(homedir3(), ".terminalhire");
    INDEX_CACHE_FILE = join3(TERMINALHIRE_DIR2, "index-cache.json");
    SCHEMA_VERSION = 1;
    tmpCounter = 0;
  }
});

// bin/jpi-link.js
async function run() {
  try {
    const args = process.argv.slice(2);
    if (args.includes("--logout")) {
      const { runLinkLogout: runLinkLogout2 } = await Promise.resolve().then(() => (init_link(), link_exports));
      await runLinkLogout2();
      return;
    }
    const { runLink: runLink2 } = await Promise.resolve().then(() => (init_link(), link_exports));
    const { updateIndexCache: updateIndexCache2 } = await Promise.resolve().then(() => (init_cache_store(), cache_store_exports));
    await runLink2({
      clearSessionStale: () => updateIndexCache2({ sessionStale: false })
    });
  } catch (err) {
    console.error("terminalhire link error:", err?.message ?? err);
    process.exit(1);
  }
}
export {
  run
};
