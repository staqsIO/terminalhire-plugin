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

// src/open-url.js
var open_url_exports = {};
__export(open_url_exports, {
  openInBrowser: () => openInBrowser,
  shouldOpenBrowser: () => shouldOpenBrowser
});
import { spawn as nodeSpawn } from "child_process";
function shouldOpenBrowser(env = process.env) {
  if (env.NODE_TEST_CONTEXT) return false;
  const off = String(env.TERMINALHIRE_NO_BROWSER ?? "").trim().toLowerCase();
  return !(off === "1" || off === "true");
}
function openInBrowser(url, { env = process.env, spawn = nodeSpawn } = {}) {
  if (!shouldOpenBrowser(env)) return;
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

// bin/jpi-setup.js
import { spawnSync } from "child_process";
import { createInterface } from "readline";

// src/api-base.ts
import { homedir } from "os";
import { basename, join, normalize } from "path";
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
var OAUTH_ALLOWED_ORIGINS = [PROD_API_BASE, DEV_API_BASE];
var ALLOW_LOCAL_OAUTH_KEY = "TERMINALHIRE_ALLOW_LOCAL_OAUTH";
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

// src/founder-oauth.ts
import { createServer } from "http";
import { createHash, randomBytes } from "crypto";
var OAUTH_TIMEOUT_MS = 3e5;
var OAUTH_CLIENT_NAME = "terminalhire setup";
function pkceChallenge(verifier) {
  return createHash("sha256").update(verifier).digest("base64url");
}
function createPkcePair() {
  const verifier = randomBytes(32).toString("base64url");
  return { verifier, challenge: pkceChallenge(verifier) };
}
function resolveOAuthCallback(rawUrl, expectedState) {
  let u;
  try {
    u = new URL(rawUrl, "http://127.0.0.1");
  } catch {
    return { ok: false, reason: "bad_url" };
  }
  if (u.pathname !== "/callback") return null;
  const state = u.searchParams.get("state");
  if (!state || state !== expectedState) return { ok: false, reason: "state_mismatch" };
  if (u.searchParams.get("error")) return { ok: false, reason: "denied" };
  const code = u.searchParams.get("code");
  if (!code) return { ok: false, reason: "missing_code" };
  return { ok: true, code };
}
var DONE_HTML = `<!doctype html><html><head><meta charset="utf-8"><title>terminalhire</title></head>
<body style="font-family:system-ui;padding:2rem;background:#0b0d10;color:#e6e6e6">
<script>history.replaceState({},'','/');</script>
<p>Approved. Go back to your terminal; you can close this tab.</p>
</body></html>`;
var FAILED_HTML = `<!doctype html><html><head><meta charset="utf-8"><title>terminalhire</title></head>
<body style="font-family:system-ui;padding:2rem;background:#0b0d10;color:#e6e6e6">
<script>history.replaceState({},'','/');</script>
<p>That did not work. Go back to your terminal and run <code>terminalhire setup</code> again.</p>
</body></html>`;
function startOAuthLoopback(expectedState, timeoutMs, host = "127.0.0.1") {
  return new Promise((resolveHandle, rejectHandle) => {
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
      const outcome = resolveOAuthCallback(req.url ?? "", expectedState);
      if (outcome === null) {
        res.writeHead(404);
        res.end();
        return;
      }
      if (!outcome.ok && (outcome.reason === "state_mismatch" || outcome.reason === "bad_url")) {
        res.writeHead(400);
        res.end();
        return;
      }
      res.writeHead(outcome.ok ? 200 : 400, { "Content-Type": "text/html; charset=utf-8" });
      res.end(outcome.ok ? DONE_HTML : FAILED_HTML);
      finish(outcome);
    });
    const timer = setTimeout(() => finish({ ok: false, reason: "timeout" }), timeoutMs);
    if (typeof timer.unref === "function") timer.unref();
    let listening = false;
    server.on("error", (err) => {
      if (!listening) rejectHandle(err);
      else finish({ ok: false, reason: "listen_error" });
    });
    server.listen(0, host, () => {
      listening = true;
      const addr = server.address();
      const port = typeof addr === "object" && addr ? addr.port : 0;
      resolveHandle({
        port,
        result,
        close: () => {
          clearTimeout(timer);
          try {
            server.close();
          } catch {
          }
        }
      });
    });
  });
}
var FounderOAuthError = class extends Error {
};
async function registerClient(base, redirectUri, fetchImpl = globalThis.fetch) {
  const res = await fetchImpl(`${base}/api/founder/mcp/oauth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_name: OAUTH_CLIENT_NAME, redirect_uris: [redirectUri] }),
    signal: AbortSignal.timeout(15e3)
  });
  const body = await res.json().catch(() => ({}));
  const clientId = body["client_id"];
  if (!res.ok || typeof clientId !== "string") {
    const why = typeof body["error_description"] === "string" ? body["error_description"] : res.status;
    throw new FounderOAuthError(`could not register this terminal with ${base} (${why})`);
  }
  return clientId;
}
function authorizeUrl(base, p) {
  const u = new URL("/api/founder/mcp/oauth/authorize", base);
  u.searchParams.set("response_type", "code");
  u.searchParams.set("client_id", p.clientId);
  u.searchParams.set("redirect_uri", p.redirectUri);
  u.searchParams.set("code_challenge", p.challenge);
  u.searchParams.set("code_challenge_method", "S256");
  u.searchParams.set("state", p.state);
  return u.toString();
}
async function exchangeCode(base, p, fetchImpl = globalThis.fetch) {
  const res = await fetchImpl(`${base}/api/founder/mcp/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: p.code,
      client_id: p.clientId,
      redirect_uri: p.redirectUri,
      code_verifier: p.verifier
    }).toString(),
    signal: AbortSignal.timeout(15e3)
  });
  const body = await res.json().catch(() => ({}));
  const token = body["access_token"];
  if (!res.ok || typeof token !== "string") {
    throw new FounderOAuthError("the approval could not be exchanged for a connector token");
  }
  const scope = typeof body["scope"] === "string" ? body["scope"] : "";
  return { token, canWrite: scope.split(/\s+/).includes("mcp:write") };
}
var REASON_TEXT = {
  state_mismatch: "the browser came back with an answer this terminal did not ask for",
  missing_code: "the browser came back without an approval code",
  denied: "the approval was declined",
  bad_url: "the browser came back with an unreadable address",
  timeout: "no approval arrived in time",
  listen_error: "the local listener stopped"
};
async function runFounderOAuth(overrides) {
  const deps = {
    startLoopback: (state2, timeoutMs) => startOAuthLoopback(state2, timeoutMs),
    openBrowser: (url) => {
      void Promise.resolve().then(() => (init_open_url(), open_url_exports)).then((m) => m.openInBrowser(url)).catch(() => {
      });
    },
    fetchImpl: globalThis.fetch,
    onAuthorizeUrl: () => {
    },
    timeoutMs: OAUTH_TIMEOUT_MS,
    randomState: () => randomBytes(16).toString("hex"),
    pkce: createPkcePair,
    ...overrides
  };
  const state = deps.randomState();
  const { verifier, challenge } = deps.pkce();
  const handle = await deps.startLoopback(state, deps.timeoutMs);
  try {
    const redirectUri = `http://127.0.0.1:${handle.port}/callback`;
    const clientId = await registerClient(deps.base, redirectUri, deps.fetchImpl);
    const url = authorizeUrl(deps.base, { clientId, redirectUri, challenge, state });
    deps.onAuthorizeUrl(url);
    deps.openBrowser(url);
    const outcome = await handle.result;
    if (!outcome.ok || !outcome.code) {
      throw new FounderOAuthError(REASON_TEXT[outcome.reason ?? "missing_code"]);
    }
    return await exchangeCode(
      deps.base,
      { code: outcome.code, clientId, redirectUri, verifier },
      deps.fetchImpl
    );
  } finally {
    handle.close();
  }
}

// src/founder-connector.ts
import { homedir as homedir3 } from "os";
import { join as join5 } from "path";
import { existsSync as existsSync4, rmSync as rmSync2 } from "fs";

// src/crypto-store.ts
import { createCipheriv, createDecipheriv, randomBytes as randomBytes3 } from "crypto";
import { readFileSync as readFileSync2, writeFileSync as writeFileSync2, existsSync as existsSync3, renameSync, rmSync, readdirSync } from "fs";
import { join as join4, dirname, basename as basename2 } from "path";
import { createRequire } from "module";

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
var warnedUnverifiedSecretWriteThisProcess = false;
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

// src/shared-key.ts
import { randomBytes as randomBytes2 } from "crypto";
import { readFileSync, writeFileSync, existsSync as existsSync2, linkSync, unlinkSync } from "fs";
import { join as join3 } from "path";
import { homedir as homedir2 } from "os";

// src/test-race-barrier.ts
import { closeSync as closeSync2, constants as constants2, existsSync, lstatSync, openSync as openSync2 } from "fs";
import { join as join2 } from "path";
var ENV_VAR = "TERMINALHIRE_TEST_RACE_BARRIER_DIR";
function syncSleepMs(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}
function waitForTestRaceBarrier(phase) {
  const root = process.env[ENV_VAR];
  if (!root) return;
  const phaseDir = join2(root, phase);
  if (!existsSync(phaseDir)) return;
  const readyFile = join2(phaseDir, `ready-${process.pid}`);
  const goFile = join2(phaseDir, "go");
  const noFollow = constants2.O_NOFOLLOW ?? 0;
  if (lstatSync(readyFile, { throwIfNoEntry: false })) {
    throw new Error(
      `terminalhire: test race barrier "${phase}" found something already at its ready marker path ${readyFile} (regular file or symlink) \u2014 refusing rather than following or overwriting whatever is already there (this only fires under ${ENV_VAR}, never in production).`
    );
  }
  let readyFd;
  try {
    readyFd = openSync2(
      readyFile,
      constants2.O_CREAT | constants2.O_EXCL | constants2.O_WRONLY | noFollow
    );
  } catch (err) {
    throw new Error(
      `terminalhire: test race barrier "${phase}" could not create its ready marker at ${readyFile} (${err instanceof Error ? err.message : String(err)}) \u2014 refusing rather than blocking on or writing through whatever is already there (this only fires under ${ENV_VAR}, never in production).`
    );
  }
  closeSync2(readyFd);
  const deadline = Date.now() + 3e4;
  while (!existsSync(goFile)) {
    if (Date.now() > deadline) {
      throw new Error(
        `terminalhire: test race barrier "${phase}" timed out waiting for ${goFile} (the test process never released it \u2014 this only fires under ${ENV_VAR}, never in production).`
      );
    }
    syncSleepMs(2);
  }
}

// src/shared-key.ts
var TERMINALHIRE_DIR = process.env.TERMINALHIRE_DIR || join3(homedir2(), ".terminalhire");
var KEY_FILE = join3(TERMINALHIRE_DIR, "key");
var KEY_BYTES = 32;
var KEY_HEX_RE = new RegExp(`^[0-9a-f]{${KEY_BYTES * 2}}$`);
function isValidKeyHex(value) {
  return KEY_HEX_RE.test(value);
}
function readKeyFileOrThrow() {
  const raw = readFileSync(KEY_FILE, "utf8").trim();
  if (!isValidKeyHex(raw)) {
    throw new Error(
      `terminalhire: the shared encryption key at ${KEY_FILE} is not in the expected format (expected exactly ${KEY_BYTES * 2} lowercase-hex characters \u2014 a ${KEY_BYTES}-byte key).
This key decrypts the GitHub token, local profile, and chat identity stores under ~/.terminalhire \u2014 it should never be hand-edited.
Recovery: if you intend to reset it, delete the file yourself (this INVALIDATES every encrypted store under ~/.terminalhire, which will need to be re-created/re-authenticated):
  rm ${KEY_FILE}`
    );
  }
  return Buffer.from(raw, "hex");
}
function publishKeyBlob(key) {
  const tmpFile = `${KEY_FILE}.${process.pid}.${randomBytes2(6).toString("hex")}.tmp`;
  try {
    writeFileSync(tmpFile, key.toString("hex"), { encoding: "utf8", mode: 384, flag: "wx" });
    try {
      linkSync(tmpFile, KEY_FILE);
      return true;
    } catch (err) {
      if (err?.code === "EEXIST") {
        return false;
      }
      throw err;
    }
  } finally {
    try {
      unlinkSync(tmpFile);
    } catch {
    }
  }
}
function loadOrCreateSharedKey() {
  ensureStateDirForSecret(TERMINALHIRE_DIR);
  if (existsSync2(KEY_FILE)) {
    return readKeyFileOrThrow();
  }
  waitForTestRaceBarrier("key");
  const key = randomBytes2(KEY_BYTES);
  if (publishKeyBlob(key)) {
    return key;
  }
  return readKeyFileOrThrow();
}

// src/crypto-store.ts
var KEYTAR_SERVICE = "terminalhire";
var KEYTAR_ACCOUNT = "profile-key";
var ALGO = "aes-256-gcm";
var IV_BYTES = 12;
function encrypt(plaintext, key) {
  const iv = randomBytes3(IV_BYTES);
  const cipher = createCipheriv(ALGO, key, iv);
  const ct = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    iv: iv.toString("hex"),
    tag: tag.toString("hex"),
    ciphertext: ct.toString("hex")
  };
}
function decrypt(blob, key) {
  const decipher = createDecipheriv(ALGO, key, Buffer.from(blob.iv, "hex"));
  decipher.setAuthTag(Buffer.from(blob.tag, "hex"));
  const plain = Buffer.concat([
    decipher.update(Buffer.from(blob.ciphertext, "hex")),
    decipher.final()
  ]);
  return plain.toString("utf8");
}
var forceKeytarUnavailableForTests = false;
function skipKeychain() {
  return process.env.TERMINALHIRE_NO_KEYCHAIN !== void 0 || process.env.CI !== void 0 || process.env.VITEST !== void 0 || process.env.NODE_ENV === "test";
}
async function tryLoadFromKeytar() {
  if (forceKeytarUnavailableForTests || skipKeychain()) return null;
  try {
    const kt = createRequire(import.meta.url)("keytar");
    const stored = await kt.getPassword(KEYTAR_SERVICE, KEYTAR_ACCOUNT);
    if (stored) {
      return Buffer.from(stored, "hex");
    }
    const key = randomBytes3(KEY_BYTES);
    await kt.setPassword(KEYTAR_SERVICE, KEYTAR_ACCOUNT, key.toString("hex"));
    return key;
  } catch {
    return null;
  }
}
function warnStderr(message) {
  process.stderr.write(`${message}
`);
}
function makeWarnOnce() {
  const seen = /* @__PURE__ */ new Set();
  return (message) => {
    if (seen.has(message)) return;
    seen.add(message);
    warnStderr(message);
  };
}
function atomicWriteFileSync(filePath, content) {
  const dir = dirname(filePath);
  ensureStateDirForSecret(dir);
  const tmp = join4(
    dir,
    `.${basename2(filePath)}.tmp-${process.pid}-${randomBytes3(6).toString("hex")}`
  );
  writeFileSync2(tmp, content, { encoding: "utf8", mode: 384, flag: "wx" });
  renameSync(tmp, filePath);
}
async function resolveKey(filePath, opts, warnOnce) {
  if (opts.keyPolicy === "keychain-required") {
    const key = await tryLoadFromKeytar();
    if (!key) {
      warnOnce(
        `crypto-store: OS keychain unavailable \u2014 store at ${filePath} is disabled (no plaintext key file will be written)`
      );
      return null;
    }
    return key;
  }
  return loadOrCreateSharedKey();
}
function createEncryptedStore(filePath, opts) {
  const warnOnce = makeWarnOnce();
  async function read() {
    const key = await resolveKey(filePath, opts, warnOnce);
    if (!key) return opts.blank();
    if (!existsSync3(filePath)) return opts.blank();
    try {
      const raw = readFileSync2(filePath, "utf8");
      const blob = JSON.parse(raw);
      const plaintext = decrypt(blob, key);
      return JSON.parse(plaintext);
    } catch {
      warnOnce(`crypto-store: failed to decrypt ${filePath} \u2014 returning blank`);
      return opts.blank();
    }
  }
  async function write(value) {
    const key = await resolveKey(filePath, opts, warnOnce);
    if (!key) return;
    const blob = encrypt(JSON.stringify(value), key);
    atomicWriteFileSync(filePath, JSON.stringify(blob, null, 2));
  }
  return { read, write };
}

// src/founder-connector.ts
function terminalhireDir() {
  return process.env.TERMINALHIRE_DIR || join5(homedir3(), ".terminalhire");
}
function founderConnectorFilePath() {
  return join5(terminalhireDir(), "founder-connector.enc");
}
function store() {
  return createEncryptedStore(founderConnectorFilePath(), {
    blank: () => ({ records: {} }),
    keyPolicy: "keytar-first-file-fallback"
  });
}
async function readAll() {
  const data = await store().read();
  const records = data?.records;
  return records && typeof records === "object" ? { ...records } : {};
}
async function writeFounderConnector(record) {
  const records = await readAll();
  records[record.host] = record;
  await store().write({ records });
}
async function readFounderConnector(host) {
  const record = (await readAll())[host];
  if (!record || typeof record.token !== "string" || record.host !== host) return null;
  return record;
}
async function clearFounderConnector(host) {
  const records = await readAll();
  delete records[host];
  if (Object.keys(records).length > 0) {
    await store().write({ records });
    return;
  }
  const p = founderConnectorFilePath();
  if (existsSync4(p)) rmSync2(p, { force: true });
}
var FounderMcpError = class extends Error {
};
async function callFounderTool(base, token, name, args, fetchImpl = globalThis.fetch) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  let res;
  try {
    res = await fetchImpl(`${base}/api/founder/mcp`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "tools/call",
        params: { name, arguments: args }
      }),
      signal: AbortSignal.timeout(3e4)
    });
  } catch (error2) {
    throw new FounderMcpError(
      `could not reach ${base}: ${error2 instanceof Error ? error2.message : String(error2)}`
    );
  }
  if (res.status === 401) {
    return { unauthorized: true, isError: true, text: "", structured: {} };
  }
  if (!res.ok) throw new FounderMcpError(`${base} answered ${res.status}`);
  const body = await res.json().catch(() => null);
  const error = body?.["error"];
  if (error) {
    throw new FounderMcpError(typeof error.message === "string" ? error.message : "protocol error");
  }
  const raw = body?.["result"];
  if (typeof raw !== "object" || raw === null) {
    throw new FounderMcpError(`${base} sent a response this CLI cannot read`);
  }
  const result = raw;
  const content = Array.isArray(result["content"]) ? result["content"] : [];
  const first = content[0];
  return {
    unauthorized: false,
    isError: result["isError"] === true,
    text: typeof first?.text === "string" ? first.text : "",
    structured: typeof result["structuredContent"] === "object" && result["structuredContent"] !== null ? result["structuredContent"] : {}
  };
}

// bin/tui-core.js
var HIDE_CURSOR = "\x1B[?25l";
var SHOW_CURSOR = "\x1B[?25h";
var ENTER_ALT = "\x1B[?1049h";
var EXIT_ALT = "\x1B[?1049l";
var MOUSE_ON = "\x1B[?1000h\x1B[?1006h";
var MOUSE_OFF = "\x1B[?1006l\x1B[?1000l";
var RESET = "\x1B[0m";
var KEY_CTRL_C = "";
var KEY_ENTER_A = "\r";
var KEY_ENTER_B = "\n";
var ANSI_CSI = /\x1b\[[0-?]*[ -/]*[@-~]/g;
var ANSI_OSC = /\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)/g;
var ANSI_OTHER = /\x1b[@-_]/g;
var C0_C1_DEL = /[\x00-\x1f\x7f-\x9f]/g;
function sanitizeLine(text) {
  return String(text).replace(ANSI_CSI, "").replace(ANSI_OSC, "").replace(ANSI_OTHER, "").replace(C0_C1_DEL, "");
}
function createRuntime({
  input = typeof process !== "undefined" ? process.stdin : void 0,
  output = typeof process !== "undefined" ? process.stdout : void 0,
  signals = typeof process !== "undefined" ? process : void 0,
  exit = (code) => process.exit(code),
  mouse = false
} = {}) {
  let entered = false;
  let cleaned = false;
  function cleanup() {
    if (cleaned) return;
    cleaned = true;
    entered = false;
    try {
      if (input && typeof input.setRawMode === "function") input.setRawMode(false);
    } catch {
    }
    try {
      if (input && typeof input.pause === "function") input.pause();
    } catch {
    }
    try {
      if (signals && typeof signals.removeListener === "function") {
        signals.removeListener("SIGINT", onSignal);
        signals.removeListener("SIGTERM", onSignal);
        signals.removeListener("SIGHUP", onSignal);
        signals.removeListener("uncaughtException", onUncaught);
        signals.removeListener("unhandledRejection", onUncaught);
        signals.removeListener("exit", onExitEvt);
      }
    } catch {
    }
    try {
      if (output && typeof output.write === "function")
        output.write((mouse ? MOUSE_OFF : "") + SHOW_CURSOR + EXIT_ALT);
    } catch {
    }
  }
  function onSignal() {
    cleanup();
    exit(130);
  }
  function onUncaught(err) {
    cleanup();
    throw err;
  }
  function onExitEvt() {
    cleanup();
  }
  function enter() {
    if (entered) return;
    entered = true;
    cleaned = false;
    try {
      if (input && typeof input.setRawMode === "function") input.setRawMode(true);
    } catch {
    }
    try {
      if (input && typeof input.resume === "function") input.resume();
    } catch {
    }
    if (signals && typeof signals.on === "function") {
      signals.on("SIGINT", onSignal);
      signals.on("SIGTERM", onSignal);
      signals.on("SIGHUP", onSignal);
      signals.on("uncaughtException", onUncaught);
      signals.on("unhandledRejection", onUncaught);
      signals.on("exit", onExitEvt);
    }
    if (output && typeof output.write === "function")
      output.write(ENTER_ALT + HIDE_CURSOR + (mouse ? MOUSE_ON : ""));
  }
  return {
    enter,
    cleanup,
    get entered() {
      return entered;
    },
    get cleaned() {
      return cleaned;
    }
  };
}
function createBuffer(rows, cols) {
  const n = Math.max(0, rows) * Math.max(0, cols);
  const buf = new Array(n);
  for (let i = 0; i < n; i++) buf[i] = { ch: " ", fg: null, bg: null, attr: null };
  return buf;
}
function drawText(buf, cols, row, col, str, style = {}) {
  if (row < 0 || col < 0 || col >= cols) return;
  const maxLen = cols - col;
  if (maxLen <= 0) return;
  const points = Array.from(sanitizeLine(str));
  const text = points.length <= maxLen ? points : points.slice(0, Math.max(0, maxLen - 1)).concat("\u2026");
  const fg = style.fg ?? null;
  const bg = style.bg ?? null;
  const attr = style.attr ?? null;
  for (let i = 0; i < text.length && col + i < cols; i++) {
    const idx = row * cols + (col + i);
    if (idx < 0 || idx >= buf.length) break;
    buf[idx] = { ch: text[i], fg, bg, attr };
  }
}
function cellNe(a, b) {
  if (!a || !b) return true;
  return a.ch !== b.ch || a.fg !== b.fg || a.bg !== b.bg || a.attr !== b.attr;
}
function diff(prev, next, cols) {
  if (!Number.isInteger(cols) || cols <= 0) return [];
  const ops = [];
  const len = next.length;
  let run2 = null;
  for (let i = 0; i < len; i++) {
    const col = i % cols;
    const row = (i - col) / cols;
    if (col === 0 && run2) {
      ops.push(run2);
      run2 = null;
    }
    if (cellNe(prev[i], next[i])) {
      if (run2 && run2.row === row && run2.col + run2.run.length === col) {
        run2.run.push(next[i]);
      } else {
        if (run2) ops.push(run2);
        run2 = { row, col, run: [next[i]] };
      }
    } else if (run2) {
      ops.push(run2);
      run2 = null;
    }
  }
  if (run2) ops.push(run2);
  return ops;
}
function styleOf(cell) {
  const pre = (cell.attr || "") + (cell.fg || "") + (cell.bg || "");
  return pre;
}
function encode(ops) {
  if (!ops || ops.length === 0) return "";
  let out = "";
  let curRow = -1;
  let curCol = -1;
  for (const op of ops) {
    if (!Number.isInteger(op.row) || !Number.isInteger(op.col)) continue;
    if (op.row !== curRow || op.col !== curCol) {
      out += `\x1B[${op.row + 1};${op.col + 1}H`;
    }
    for (const cell of op.run) {
      const pre = styleOf(cell);
      out += pre ? pre + cell.ch + RESET : cell.ch;
    }
    curRow = op.row;
    curCol = op.col + op.run.length;
  }
  return out;
}
function createRenderer({
  write,
  output = typeof process !== "undefined" ? process.stdout : void 0,
  rows,
  cols
} = {}) {
  const doWrite = write || (output && output.write ? output.write.bind(output) : () => {
  });
  const fallback = readTermSize(output);
  let _rows = Number.isInteger(rows) && rows > 0 ? rows : fallback.rows;
  let _cols = Number.isInteger(cols) && cols > 0 ? cols : fallback.cols;
  let prev = createBuffer(_rows, _cols);
  return {
    render(nextBuf) {
      const s = encode(diff(prev, nextBuf, _cols));
      if (s) doWrite(s);
      prev = nextBuf;
    },
    /** Drop the previous frame so the next render repaints every cell. */
    invalidate() {
      prev = [];
    },
    /** Adopt new dimensions and force a full redraw on the next render. */
    resize(newRows, newCols) {
      _rows = newRows;
      _cols = newCols;
      prev = [];
    },
    get rows() {
      return _rows;
    },
    get cols() {
      return _cols;
    }
  };
}
function readTermSize(out) {
  const o = out || (typeof process !== "undefined" ? process.stdout : void 0);
  const cols = o && Number.isInteger(o.columns) && o.columns > 0 ? o.columns : 80;
  const rows = o && Number.isInteger(o.rows) && o.rows > 0 ? o.rows : 24;
  return { rows, cols };
}
function detectColorLevel(env = {}, isTTY = false) {
  const force = String(env.FORCE_COLOR ?? "");
  const colorterm = String(env.COLORTERM ?? "").toLowerCase();
  const term = String(env.TERM ?? "").toLowerCase();
  if (force === "3") return "truecolor";
  if (force === "2") return "256";
  if (colorterm === "truecolor" || colorterm === "24bit") return "truecolor";
  if (term.includes("256")) return "256";
  if (env.NO_COLOR != null && env.NO_COLOR !== "" || term === "dumb" || term === "") return "16";
  if (!isTTY && force === "") return "16";
  return "16";
}
var PALETTE = {
  truecolor: {
    bg: "\x1B[48;2;13;17;23m",
    panel: "\x1B[48;2;22;27;34m",
    rule: "\x1B[38;2;48;54;61m",
    text: "\x1B[38;2;201;209;217m",
    muted: "\x1B[38;2;125;133;144m",
    accent: "\x1B[38;2;88;166;255m",
    "accent-bright": "\x1B[38;2;121;192;255m",
    green: "\x1B[38;2;63;185;80m",
    amber: "\x1B[38;2;210;153;34m"
  },
  256: {
    bg: "\x1B[48;5;233m",
    panel: "\x1B[48;5;235m",
    rule: "\x1B[38;5;240m",
    text: "\x1B[38;5;252m",
    muted: "\x1B[38;5;245m",
    accent: "\x1B[38;5;75m",
    "accent-bright": "\x1B[38;5;117m",
    green: "\x1B[38;5;71m",
    amber: "\x1B[38;5;178m"
  },
  16: {
    bg: "\x1B[40m",
    panel: "\x1B[100m",
    rule: "\x1B[90m",
    text: "\x1B[37m",
    muted: "\x1B[90m",
    accent: "\x1B[94m",
    "accent-bright": "\x1B[96m",
    green: "\x1B[92m",
    amber: "\x1B[93m"
  }
};
var COLOR_ROLES = Object.keys(PALETTE.truecolor);
function degrade(role, level = "truecolor") {
  const table = PALETTE[level] || PALETTE["16"];
  return table[role] || "";
}
function hexToRgb(hex) {
  const h = String(hex).replace(/^#/, "");
  const n = parseInt(h, 16);
  return { r: n >> 16 & 255, g: n >> 8 & 255, b: n & 255 };
}
var CUBE_STEPS = [0, 95, 135, 175, 215, 255];
function nearestCubeStep(v) {
  let best = 0;
  let bestDist = Infinity;
  for (let i = 0; i < CUBE_STEPS.length; i++) {
    const d = Math.abs(CUBE_STEPS[i] - v);
    if (d < bestDist) {
      bestDist = d;
      best = i;
    }
  }
  return best;
}
function rgbTo256(r, g, b) {
  return 16 + 36 * nearestCubeStep(r) + 6 * nearestCubeStep(g) + nearestCubeStep(b);
}
function gradientFg(stops, t, level = "truecolor") {
  if (level === "16") return degrade("accent-bright", level);
  if (!Array.isArray(stops) || stops.length === 0) return "";
  if (stops.length === 1) {
    const { r: r2, g: g2, b: b2 } = hexToRgb(stops[0]);
    return level === "256" ? `\x1B[38;5;${rgbTo256(r2, g2, b2)}m` : `\x1B[38;2;${r2};${g2};${b2}m`;
  }
  const clamped = Math.max(0, Math.min(1, Number.isFinite(t) ? t : 0));
  const seg = clamped * (stops.length - 1);
  const i0 = Math.min(stops.length - 2, Math.floor(seg));
  const localT = seg - i0;
  const c0 = hexToRgb(stops[i0]);
  const c1 = hexToRgb(stops[i0 + 1]);
  const r = Math.round(c0.r + (c1.r - c0.r) * localT);
  const g = Math.round(c0.g + (c1.g - c0.g) * localT);
  const b = Math.round(c0.b + (c1.b - c0.b) * localT);
  return level === "256" ? `\x1B[38;5;${rgbTo256(r, g, b)}m` : `\x1B[38;2;${r};${g};${b}m`;
}

// bin/jpi-setup.js
var POLL_MS = 3e3;
var WAIT_LIMIT_MS = 15 * 6e4;
var INDIGO = "#5e6ad2";
var GREEN = "#4fb477";
var STEPS = [
  { key: "app", code: "app-required", label: "GitHub App on your repository" },
  { key: "card", code: "card-required", label: "A saved card" },
  { key: "email", code: "contact-required", label: "A confirmed contact email" }
];
function checklistRows(requirements, waitingOn = null) {
  if (requirements?.status !== "ok") {
    return STEPS.map((s) => ({ key: s.key, label: s.label, state: "unavailable" }));
  }
  const outstanding = new Set(requirements.outstanding);
  const undetermined = new Set(requirements.undetermined);
  return STEPS.map((s) => {
    let state = "done";
    if (outstanding.has(s.code)) state = "todo";
    else if (undetermined.has(s.code)) state = "unknown";
    if (state !== "done" && s.key === waitingOn) state = "waiting";
    return { key: s.key, label: s.label, state };
  });
}
var KNOWN_CODES = new Set(STEPS.map((s) => s.code));
var GLYPH = { done: "\u2713", waiting: "\u25D0", todo: "\u25CB", unknown: "?", unavailable: "!" };
function requirementsFromResult(r, repo) {
  if (r.unauthorized) return { status: "unauthorized" };
  const { outstanding, undetermined } = r.structured;
  const known = (list) => Array.isArray(list) && list.every((c) => KNOWN_CODES.has(c));
  if (r.isError || !known(outstanding) || !known(undetermined)) {
    return {
      status: "unavailable",
      message: r.text || "the server sent a checklist this CLI cannot read"
    };
  }
  return {
    status: "ok",
    outstanding,
    undetermined,
    repo: typeof r.structured.repo === "string" ? r.structured.repo : repo
  };
}
var isReady = (reqs) => reqs?.status === "ok" && reqs.outstanding.length === 0 && reqs.undetermined.length === 0;
var MAX_POLL_FAILURES = 3;
function trackPoll(failures, reqs, isDone) {
  if (reqs.status === "unauthorized") return { failures, outcome: "revoked" };
  if (reqs.status !== "ok") {
    const n = failures + 1;
    return { failures: n, outcome: n >= MAX_POLL_FAILURES ? "unavailable" : null };
  }
  return { failures: 0, outcome: isDone(reqs) ? "done" : null };
}
function connectorServerName(base) {
  if (base === PROD_API_BASE || base === "https://www.terminalhire.com") {
    return "terminalhire-founder";
  }
  if (base === DEV_API_BASE) return "terminalhire-founder-dev";
  return "terminalhire-founder-local";
}
function connectorHelperCommand(base) {
  return `terminalhire connector-header --host ${base}`;
}
function mcpAddJsonArgs(base) {
  const config = {
    type: "http",
    url: `${base}/api/founder/mcp`,
    headersHelper: connectorHelperCommand(base)
  };
  return ["mcp", "add-json", "--scope", "user", connectorServerName(base), JSON.stringify(config)];
}
function mcpAddJsonLine(base) {
  const [, , , , name, json] = mcpAddJsonArgs(base);
  return `claude mcp add-json --scope user ${name} '${json}'`;
}
function parseSetupArgs(argv) {
  const flags = { status: false, reconnect: false, repo: null, help: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--status") flags.status = true;
    else if (a === "--reconnect") flags.reconnect = true;
    else if (a === "--help" || a === "-h") flags.help = true;
    else if (a === "--repo") {
      const v = argv[i + 1];
      if (!v || v.startsWith("--")) throw new Error("--repo requires owner/repo");
      flags.repo = v;
      i++;
    } else throw new Error(`unknown option: ${a}`);
  }
  return flags;
}
function repoFromGit() {
  const r = spawnSync("git", ["remote", "get-url", "origin"], {
    encoding: "utf8",
    timeout: 5e3,
    stdio: ["ignore", "pipe", "ignore"]
  });
  if (r.status !== 0) return null;
  const m = String(r.stdout || "").trim().match(/github\.com[:/]([^/]+)\/([^/]+?)(?:\.git)?$/i);
  return m ? `${m[1]}/${m[2]}` : null;
}
function onPath(cmd) {
  const r = spawnSync(cmd, ["--version"], { stdio: "ignore", timeout: 1e4 });
  return !r.error && r.status === 0;
}
async function ask(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    return await new Promise((resolve) => rl.question(question, (a) => resolve(a.trim())));
  } finally {
    rl.close();
  }
}
function openInBrowser2(url) {
  void Promise.resolve().then(() => (init_open_url(), open_url_exports)).then((m) => m.openInBrowser(url)).catch(() => {
  });
}
var sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function plainChecklist(rows, log = console.log) {
  for (const r of rows) {
    const note = r.state === "unknown" ? " (name the repository with --repo)" : r.state === "unavailable" ? " (could not check)" : "";
    log(`  ${GLYPH[r.state]} ${r.label}${note}`);
  }
}
var SPIN = ["\u25D0", "\u25D3", "\u25D1", "\u25D2"];
async function waitOnScreen({ title, hint, link, isDone, poll, rowsFor }) {
  const level = detectColorLevel(process.env, true);
  const indigo = gradientFg([INDIGO], 0, level);
  const green = level === "16" ? degrade("green", level) : gradientFg([GREEN], 0, level);
  const muted = degrade("muted", level);
  const runtime = createRuntime();
  const size = readTermSize(process.stdout);
  const renderer = createRenderer({ rows: size.rows, cols: size.cols });
  let tick = 0;
  let outcome = null;
  const onKey = (buf) => {
    const k = buf.toString("utf8");
    if (k === KEY_ENTER_A || k === KEY_ENTER_B) openInBrowser2(link);
    else if (k === "s") outcome = "skip";
    else if (k === "q" || k === KEY_CTRL_C) outcome = "quit";
  };
  const draw = (rows, note) => {
    const { rows: h, cols: w } = readTermSize(process.stdout);
    const buf = createBuffer(h, w);
    drawText(buf, w, 1, 2, "terminalhire setup", { fg: indigo, attr: "\x1B[1m" });
    drawText(buf, w, 3, 2, title, {});
    let y = 5;
    for (const r of rows) {
      const glyph = r.state === "waiting" ? SPIN[tick % SPIN.length] : GLYPH[r.state];
      const fg = r.state === "done" ? green : r.state === "waiting" ? indigo : muted;
      drawText(buf, w, y, 4, `${glyph} ${r.label}`, { fg });
      y++;
    }
    y++;
    for (const line of hint) drawText(buf, w, y++, 2, line, { fg: muted });
    if (note) drawText(buf, w, y++, 2, note, { fg: muted });
    drawText(buf, w, y + 1, 2, "\u21B5 reopen link   s skip   q quit", { fg: muted });
    renderer.render(buf);
  };
  runtime.enter();
  process.stdin.on("data", onKey);
  const started = Date.now();
  let failures = 0;
  let last = null;
  const step = async () => {
    const reqs = await poll();
    if (reqs.status === "ok") last = reqs;
    const t = trackPoll(failures, reqs, isDone);
    failures = t.failures;
    if (t.outcome) outcome = t.outcome;
  };
  try {
    await step();
    while (outcome === null) {
      draw(
        rowsFor(last),
        failures > 0 ? `Could not reach the server (${failures} of ${MAX_POLL_FAILURES}); retrying.` : null
      );
      await sleep(250);
      tick++;
      if (tick % Math.round(POLL_MS / 250) === 0) await step();
      if (outcome === null && Date.now() - started > WAIT_LIMIT_MS) outcome = "timeout";
    }
    return outcome;
  } finally {
    process.stdin.removeListener("data", onKey);
    runtime.cleanup();
    process.stdout.write(RESET);
  }
}
async function waitPlain({ title, link, isDone, poll }, {
  sleepFn = sleep,
  now = Date.now,
  log = console.log,
  pollMs = POLL_MS,
  limitMs = WAIT_LIMIT_MS
} = {}) {
  log(`
  ${title}`);
  if (link) log(`  \u2192 ${link}`);
  log("  Waiting\u2026");
  const started = now();
  let failures = 0;
  for (; ; ) {
    const reqs = await poll();
    const t = trackPoll(failures, reqs, isDone);
    if (t.outcome) return t.outcome;
    if (t.failures > failures)
      log(`  Could not reach the server (${t.failures} of ${MAX_POLL_FAILURES}); retrying.`);
    failures = t.failures;
    if (now() - started > limitMs) return "timeout";
    await sleepFn(pollMs);
  }
}
function usage() {
  console.log(`
Usage:
  terminalhire setup [--repo owner/repo]   Sign in as a poster and finish what publishing needs
  terminalhire setup --status              Print the checklist and exit
  terminalhire setup --reconnect           Approve a new connector (for example, one that may act)

--repo is needed when the GitHub App covers more than one of your repositories.
The email step needs an interactive terminal.

Signing in, the GitHub App, the card form and the email link happen in your browser.
Accepting work and paying stay in the browser too.`);
}
async function runSetup() {
  let flags;
  try {
    const raw = process.argv.slice(2);
    if (raw[0] === "setup") raw.shift();
    flags = parseSetupArgs(raw);
  } catch (e) {
    console.error(`terminalhire setup: ${e.message}`);
    process.exitCode = 1;
    return;
  }
  if (flags.help) return usage();
  let base;
  try {
    base = resolveOAuthBase();
  } catch (e) {
    console.error(e instanceof Error ? e.message : String(e));
    process.exitCode = 1;
    return;
  }
  const tty = Boolean(process.stdin.isTTY && process.stdout.isTTY);
  const repo = flags.repo ?? repoFromGit();
  let connector = flags.reconnect ? null : await readFounderConnector(base);
  const requirementsNow = async () => {
    try {
      const r = await callFounderTool(
        base,
        connector.token,
        "publish_requirements",
        repo ? { repo } : {}
      );
      return requirementsFromResult(r, repo);
    } catch (e) {
      return { status: "unavailable", message: e instanceof Error ? e.message : String(e) };
    }
  };
  const revoked = async () => {
    await clearFounderConnector(base);
    console.error(
      "\n  This terminal\u2019s connector is no longer accepted, so it was removed. Run `terminalhire setup` again.\n"
    );
    process.exitCode = 1;
  };
  const unavailable = (reqs2) => {
    plainChecklist(checklistRows(reqs2));
    console.error(
      `
  Could not read your checklist: ${reqs2.message}. Run \`terminalhire setup\` again.
`
    );
    process.exitCode = 1;
  };
  if (flags.status) {
    if (!connector) {
      console.log("\n  \u25CB Signed in as a poster \u2014 run `terminalhire setup`\n");
      return;
    }
    const reqs2 = await requirementsNow();
    if (reqs2.status === "unauthorized") {
      console.log(
        "\n  \u25CB Signed in as a poster \u2014 this connector was revoked; run `terminalhire setup`\n"
      );
      return;
    }
    console.log("\n  \u2713 Signed in as a poster");
    if (reqs2.status !== "ok") return unavailable(reqs2);
    plainChecklist(checklistRows(reqs2));
    console.log("");
    return;
  }
  if (flags.reconnect && await readFounderConnector(base)) {
    console.log("\n  Your current connector stays valid until you remove it in the browser,");
    console.log("  under Settings \u2192 Agent connections on your dashboard.");
  }
  if (!connector) {
    console.log("\n  terminalhire setup \u2014 sign in as a poster");
    console.log("  Your browser opens to sign in with GitHub and approve this terminal.");
    console.log("  Tick \u201Cact on my behalf\u201D there if you want to publish from the terminal.");
    try {
      const grant = await runFounderOAuth({
        base,
        onAuthorizeUrl: (url) => console.log(`  If it does not open, paste this address:
  \u2192 ${url}`)
      });
      connector = { ...grant, host: base, createdAt: (/* @__PURE__ */ new Date()).toISOString() };
      await writeFounderConnector(connector);
    } catch (e) {
      console.error(`
  Sign-in did not finish: ${e instanceof Error ? e.message : String(e)}
`);
      process.exitCode = 1;
      return;
    }
    console.log("  \u2713 Signed in");
  }
  let reqs = await requirementsNow();
  if (reqs.status === "unauthorized") return revoked();
  if (reqs.status !== "ok") return unavailable(reqs);
  if (!connector.canWrite) {
    console.log("\n  This connector can read but not act, so the card and email steps and");
    console.log("  publishing are not available from here. Run `terminalhire setup --reconnect`");
    console.log("  and tick \u201Cact on my behalf\u201D to use them.\n");
    plainChecklist(checklistRows(reqs));
    console.log("");
    return;
  }
  const poll = async () => {
    const r = await requirementsNow();
    if (r.status === "ok") reqs = r;
    return r;
  };
  const stepDone = (key) => (r) => checklistRows(r).find((row) => row.key === key)?.state === "done";
  const wait = async (key, title, hint, link) => {
    const opts = {
      title,
      hint,
      link,
      isDone: stepDone(key),
      poll,
      rowsFor: (r) => checklistRows(r ?? reqs, key)
    };
    const outcome = tty ? await waitOnScreen(opts) : await waitPlain(opts);
    if (outcome === "quit") {
      console.log("\n  Stopped. Run `terminalhire setup` to pick up where you left off.\n");
      return false;
    }
    if (outcome === "revoked") {
      await revoked();
      return false;
    }
    if (outcome === "unavailable") {
      console.error(
        `
  Lost contact with ${base} ${MAX_POLL_FAILURES} times in a row. Nothing is lost; run \`terminalhire setup\` again to pick up here.
`
      );
      process.exitCode = 1;
      return false;
    }
    if (outcome === "timeout")
      console.log("  Still waiting; run `terminalhire setup` again when it is done.");
    return true;
  };
  if (["todo", "unknown"].includes(checklistRows(reqs).find((r) => r.key === "app")?.state)) {
    const link = `${base}/api/founder/github/install?return=setup`;
    openInBrowser2(link);
    const hint = [
      `Install the Terminalhire GitHub App on ${reqs.repo ?? "your repository"}.`,
      "If you choose \u201COnly select repositories\u201D, include this one.",
      ...reqs.repo ? [] : ["Installed on more than one? Run setup again with --repo owner/repo."]
    ];
    if (!await wait("app", "Install the GitHub App", hint, link)) return;
  }
  if (checklistRows(reqs).find((r) => r.key === "card")?.state === "todo") {
    const started = await callFounderTool(base, connector.token, "start_card_setup", {});
    if (started.unauthorized) return revoked();
    const url = typeof started.structured.url === "string" ? started.structured.url : null;
    if (!url) {
      console.log(`
  ${started.text || "Card setup is not available right now."}`);
    } else {
      openInBrowser2(url);
      const hint = ["Enter the card on Stripe\u2019s page. Saving it charges nothing."];
      if (!await wait("card", "Save a card", hint, url)) return;
    }
  }
  if (checklistRows(reqs).find((r) => r.key === "email")?.state === "todo") {
    if (!tty) {
      console.log(
        "\n  \u25CB A confirmed contact email \u2014 run `terminalhire setup` in a terminal to enter one."
      );
    } else {
      const email = await ask("\n  Email for notices about your postings: ");
      const sent = email ? await callFounderTool(base, connector.token, "send_contact_confirmation", { email }) : null;
      if (sent?.unauthorized) return revoked();
      if (sent && !sent.isError) {
        const hint = [`Click the link we sent to ${sent.structured.pendingEmail ?? email}.`];
        if (!await wait("email", "Confirm your email", hint, null)) return;
      } else if (sent) {
        console.log(`  ${sent.text}`);
      }
    }
  }
  const helperReady = onPath("terminalhire");
  if (tty && onPath("claude") && helperReady) {
    console.log("\n  Connect Claude Code so your AI can draft and publish for you:");
    console.log(`  ${mcpAddJsonLine(base)}`);
    console.log("  Claude Code will ask terminalhire for the key when it connects; the key");
    console.log("  stays in terminalhire\u2019s encrypted store.");
    const yes = (await ask("  Run it? [y/N] ")).toLowerCase();
    if (yes === "y" || yes === "yes") {
      const r = spawnSync("claude", mcpAddJsonArgs(base), { stdio: "inherit" });
      console.log(
        r.status === 0 ? "  \u2713 Connected" : "  Claude Code did not add it (it may already be there)."
      );
    }
  } else if (!helperReady) {
    console.log(
      "\n  To connect Claude Code, install the CLI (`npm install -g terminalhire`), then run"
    );
    console.log("  `terminalhire setup` again, or run this yourself:");
    console.log(`  ${mcpAddJsonLine(base)}`);
  } else {
    console.log(
      "\n  To connect Claude Code, install it and run `terminalhire setup` again, or run:"
    );
    console.log(`  ${mcpAddJsonLine(base)}`);
    console.log(
      "  For another AI tool, create a connector in your dashboard under Settings \u2192 Agent connections."
    );
  }
  reqs = await requirementsNow();
  if (reqs.status === "unauthorized") return revoked();
  console.log("\n  terminalhire setup");
  console.log("  \u2713 Signed in as a poster");
  if (reqs.status !== "ok") return unavailable(reqs);
  plainChecklist(checklistRows(reqs));
  console.log(
    isReady(reqs) ? "\n  Ready to publish. Draft with `terminalhire post draft`, then `post submit` and `post publish`.\n" : "\n  Run `terminalhire setup` again to finish the rest.\n"
  );
}
async function run() {
  try {
    await runSetup();
  } catch (e) {
    console.error(`
terminalhire setup: ${e instanceof Error ? e.message : String(e)}
`);
    process.exitCode = 1;
  }
}
export {
  GLYPH,
  MAX_POLL_FAILURES,
  STEPS,
  checklistRows,
  connectorHelperCommand,
  connectorServerName,
  isReady,
  mcpAddJsonArgs,
  mcpAddJsonLine,
  parseSetupArgs,
  requirementsFromResult,
  run,
  trackPoll,
  waitPlain
};
