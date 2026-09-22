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
var state_dir_exports = {};
__export(state_dir_exports, {
  STATE_DIR_MODE: () => STATE_DIR_MODE,
  STATE_DIR_OK: () => STATE_DIR_OK,
  STATE_DIR_SYMLINK: () => STATE_DIR_SYMLINK,
  STATE_DIR_UNVERIFIED: () => STATE_DIR_UNVERIFIED,
  __resetUnverifiedSecretWarningForTests: () => __resetUnverifiedSecretWarningForTests,
  applyStateDirSecretPolicy: () => applyStateDirSecretPolicy,
  ensureStateDir: () => ensureStateDir,
  ensureStateDirForSecret: () => ensureStateDirForSecret
});
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
function __resetUnverifiedSecretWarningForTests() {
  warnedUnverifiedSecretWriteThisProcess = false;
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

// src/api-base.ts
var api_base_exports = {};
__export(api_base_exports, {
  ApiBaseError: () => ApiBaseError,
  DEV_API_BASE: () => DEV_API_BASE,
  DEV_STATE_DIR_NAME: () => DEV_STATE_DIR_NAME,
  PROD_API_BASE: () => PROD_API_BASE,
  __resetDevMarkerLatchForTests: () => __resetDevMarkerLatchForTests,
  formatDevMarker: () => formatDevMarker,
  isDevStateDir: () => isDevStateDir,
  isLoopbackOrigin: () => isLoopbackOrigin,
  isNonProdApiBase: () => isNonProdApiBase,
  pinToDevApiBase: () => pinToDevApiBase,
  printDevMarkerIfNeeded: () => printDevMarkerIfNeeded,
  resolveApiBase: () => resolveApiBase,
  resolveOAuthBase: () => resolveOAuthBase,
  warnSharedCredentialsIfNonProd: () => warnSharedCredentialsIfNonProd
});
import { homedir } from "os";
import { basename, join, normalize } from "path";
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
function pinToDevApiBase(env = process.env) {
  env["TERMINALHIRE_API_URL"] = DEV_API_BASE;
  env["TERMINALHIRE_DIR"] = env["TERMINALHIRE_DIR"] || join(homedir(), DEV_STATE_DIR_NAME);
  return DEV_API_BASE;
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
function resolveApiBaseOrProd(env = process.env) {
  try {
    return resolveApiBase(env);
  } catch {
    return PROD_API_BASE;
  }
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
function isNonProdApiBase(base = resolveApiBaseOrProd()) {
  return base !== PROD_API_BASE;
}
function formatDevMarker(base = resolveApiBaseOrProd()) {
  if (!isNonProdApiBase(base)) return null;
  let host = base;
  try {
    host = new URL(base).host;
  } catch {
  }
  return `[dev \u2192 ${host}]`;
}
function printDevMarkerIfNeeded(stream = process.stderr) {
  if (markerPrinted) return;
  const marker = formatDevMarker();
  if (marker === null) return;
  markerPrinted = true;
  try {
    stream.write(`${marker}
`);
  } catch {
  }
}
function __resetDevMarkerLatchForTests() {
  markerPrinted = false;
}
function warnSharedCredentialsIfNonProd(base, stream = process.stderr) {
  if (!isNonProdApiBase(base)) return;
  if (usingSeparateStateDir()) return;
  try {
    stream.write(
      "terminalhire: non-prod API base \u2014 using the same local session/push credentials as prod; do not mix environments casually.\n"
    );
  } catch {
  }
}
function isDevStateDir(dir) {
  if (dir === void 0 || dir === "") return false;
  return basename(normalize(dir)) === DEV_STATE_DIR_NAME;
}
function usingSeparateStateDir(env = process.env) {
  return isDevStateDir(env["TERMINALHIRE_DIR"]);
}
var PROD_API_BASE, DEV_API_BASE, DEV_STATE_DIR_NAME, ApiBaseError, ALLOWED_HOSTS, OAUTH_ALLOWED_ORIGINS, ALLOW_LOCAL_OAUTH_KEY, ALLOW_LOCAL_API_KEY, ALLOWED_DESCRIPTION, CANONICAL_REWRITES, ENV_KEYS, markerPrinted;
var init_api_base = __esm({
  "src/api-base.ts"() {
    "use strict";
    PROD_API_BASE = "https://terminalhire.com";
    DEV_API_BASE = "https://dev.terminalhire.com";
    DEV_STATE_DIR_NAME = ".terminalhire-dev";
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
    markerPrinted = false;
  }
});

// src/web-session.ts
var web_session_exports = {};
__export(web_session_exports, {
  clearWebSessionFile: () => clearWebSessionFile,
  hostLabel: () => hostLabel,
  missingSessionLines: () => missingSessionLines,
  readWebSessionCookie: () => readWebSessionCookie,
  readWebSessionFile: () => readWebSessionFile,
  readWebSessionRecord: () => readWebSessionRecord,
  refusedSessionLines: () => refusedSessionLines,
  webSessionCookieForHost: () => webSessionCookieForHost,
  webSessionFilePath: () => webSessionFilePath,
  webSessionForHost: () => webSessionForHost,
  withSessionDeps: () => withSessionDeps,
  writeWebSessionFile: () => writeWebSessionFile
});
import { chmodSync, existsSync, readFileSync, rmSync, writeFileSync } from "fs";
import { homedir as homedir2 } from "os";
import { join as join2 } from "path";
function terminalhireDir() {
  return process.env.TERMINALHIRE_DIR || join2(homedir2(), ".terminalhire");
}
function webSessionFilePath() {
  return join2(terminalhireDir(), "web-session");
}
function parseWebSessionFile(raw) {
  const trimmed = raw.trim();
  if (trimmed.length === 0) return null;
  if (!trimmed.startsWith("{")) return { token: trimmed, host: null };
  try {
    const parsed = JSON.parse(trimmed);
    if (typeof parsed !== "object" || parsed === null) return null;
    const rec = parsed;
    if (typeof rec.token !== "string" || rec.token.length === 0) return null;
    const host = typeof rec.host === "string" ? rec.host.trim() : "";
    return { token: rec.token, host: host === "" ? null : host };
  } catch {
    return null;
  }
}
function readWebSessionRecord() {
  try {
    const path = webSessionFilePath();
    if (!existsSync(path)) return null;
    return parseWebSessionFile(readFileSync(path, "utf8"));
  } catch {
    return null;
  }
}
function readWebSessionFile() {
  return readWebSessionRecord()?.token ?? null;
}
function webSessionForHost(apiBase) {
  assertBase(apiBase, "webSessionForHost");
  const record = readWebSessionRecord();
  if (!record) return { cookie: null, mismatch: null };
  if (record.host !== null && record.host !== apiBase) {
    return { cookie: null, mismatch: { linkedHost: record.host, currentHost: apiBase } };
  }
  return { cookie: record.token, mismatch: null };
}
function webSessionCookieForHost(apiBase) {
  const fromFile = webSessionForHost(apiBase);
  if (fromFile.cookie || fromFile.mismatch) return fromFile;
  const env = process.env["TERMINALHIRE_WEB_SESSION"];
  return { cookie: typeof env === "string" && env.length > 0 ? env : null, mismatch: null };
}
function assertBase(apiBase, fn) {
  if (typeof apiBase !== "string" || apiBase.length === 0) {
    throw new TypeError(
      `${fn}(apiBase) requires the destination base as a non-empty string; received ${apiBase === "" ? "''" : String(apiBase)}. This is a wiring bug in the calling command, not a developer misconfiguration: pass the same resolveApiBase() value the request is sent to, so the session's host affinity can be checked (TERM-991).`
    );
  }
}
function hostLabel(base) {
  return String(base ?? "").replace(/^https?:\/\//, "");
}
function missingSessionLines(mismatch) {
  if (!mismatch) {
    return [
      "No linked web session found on this machine.",
      "Run `terminalhire link` to connect this terminal to your account, then re-run."
    ];
  }
  const linked = hostLabel(mismatch.linkedHost);
  const current = hostLabel(mismatch.currentHost);
  const reach = mismatch.linkedHost === PROD_API_BASE ? `unset TERMINALHIRE_API_URL to reach ${linked}` : isLoopbackOrigin(mismatch.linkedHost) ? `set TERMINALHIRE_ALLOW_LOCAL_API=1 TERMINALHIRE_API_URL=${mismatch.linkedHost} to reach ${linked}` : `set TERMINALHIRE_API_URL=${mismatch.linkedHost} to reach ${linked}`;
  const link = isLoopbackOrigin(mismatch.currentHost) ? "`TERMINALHIRE_ALLOW_LOCAL_OAUTH=1 terminalhire link`" : "`terminalhire link`";
  return [
    `This terminal is on ${current}, but your linked session belongs to ${linked}. Nothing was sent.`,
    `Either ${reach}, or run ${link} to link this terminal to ${current} instead.`
  ];
}
function withSessionDeps(defaults, overrides) {
  const merged = { ...defaults, ...overrides };
  if (overrides?.sessionCookie && !overrides.sessionMismatch) merged.sessionMismatch = () => null;
  return merged;
}
function refusedSessionLines(apiBase) {
  return [
    `${hostLabel(apiBase)} refused your linked session.`,
    "Run `terminalhire link` to link this terminal again, then re-run."
  ];
}
function readWebSessionCookie(apiBase) {
  if (typeof apiBase !== "string" || apiBase.length === 0) {
    throw new TypeError(
      `readWebSessionCookie(apiBase) requires the destination base as a non-empty string; received ${apiBase === "" ? "''" : String(apiBase)}. This is a wiring bug in the calling command, not a developer misconfiguration: pass the same resolveApiBase() value the request is sent to, so the session's host affinity can be checked (TERM-991).`
    );
  }
  return webSessionCookieForHost(apiBase).cookie;
}
function writeWebSessionFile(token, host) {
  ensureStateDirForSecret(terminalhireDir());
  const path = webSessionFilePath();
  const body = typeof host === "string" && host.length > 0 ? JSON.stringify({ v: 1, host, token }) : token;
  writeFileSync(path, body, { mode: 384, encoding: "utf8" });
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
    init_api_base();
    init_state_dir();
  }
});

// bin/jpi-decline.js
import { createInterface } from "readline";
import { existsSync as existsSync2, readFileSync as readFileSync2, writeFileSync as writeFileSync2, rmSync as rmSync2 } from "fs";
import { homedir as homedir3 } from "os";
import { join as join3 } from "path";
var GH_SESSION_COOKIE = "__jpi_gh_session";
function terminalhireDir2() {
  return process.env.TERMINALHIRE_DIR || join3(homedir3(), ".terminalhire");
}
function consentFilePath() {
  return join3(terminalhireDir2(), "decline-consent");
}
var DECLINE_CHOICES = [
  { key: "1", reason: "price_low", label: "the price is too low for the work" },
  { key: "2", reason: "scope_unclear", label: "I can't tell what \u201Cdone\u201D means" },
  { key: "3", reason: "repo_risky", label: "no tests or CI \u2014 I could not check my own work" },
  { key: "4", reason: "not_my_stack", label: "not my stack" },
  { key: "5", reason: "other", label: "something else" }
];
function postingIdFromJobId(jobId) {
  const id = String(jobId ?? "");
  if (!id.startsWith("bounty:founder:")) return null;
  const raw = id.slice("bounty:founder:".length).trim();
  return raw.length > 0 ? raw : null;
}
function reasonForKey(key) {
  const hit = DECLINE_CHOICES.find((c) => c.key === String(key ?? "").trim());
  return hit ? hit.reason : null;
}
function declineBody(bountyId, reason) {
  return { bountyId, reason };
}
function consentNotice(bountyId, reason) {
  return [
    "",
    "This is the first thing you have sent a poster from this machine, so:",
    "",
    "  Sending this posts EXACTLY this, and nothing else:",
    `    ${JSON.stringify(declineBody(bountyId, reason))}`,
    "",
    "  The poster sees a COUNT, never your name \u2014 answers are pooled across",
    "  developers, and the breakdown stays hidden until enough people have",
    "  answered that no single answer points at one person.",
    "",
    "  Your profile, your matches and your local job statuses stay on this",
    "  machine, exactly as before.",
    "",
    "  `terminalhire decline --forget` makes this ask again next time. It does",
    "  not unsend an answer \u2014 the stored row has no name on it to find.",
    ""
  ].join("\n");
}
function prompt(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(String(answer ?? "").trim());
    });
  });
}
function hasDeclineConsent() {
  try {
    return existsSync2(consentFilePath()) && readFileSync2(consentFilePath(), "utf8").trim() === "yes";
  } catch {
    return false;
  }
}
function forgetDeclineConsent() {
  try {
    rmSync2(consentFilePath());
  } catch {
  }
}
async function grantDeclineConsent() {
  const { ensureStateDir: ensureStateDir2 } = await Promise.resolve().then(() => (init_state_dir(), state_dir_exports));
  ensureStateDir2(terminalhireDir2());
  writeFileSync2(consentFilePath(), "yes\n", "utf8");
}
async function ensureDeclineConsent(bountyId, reason) {
  if (hasDeclineConsent()) return true;
  if (!process.stdin.isTTY) {
    console.error("Passing on a posting needs an interactive terminal the first time.");
    return false;
  }
  console.log(consentNotice(bountyId, reason));
  const answer = (await prompt('Send it? Type "yes" to confirm: ')).toLowerCase();
  if (answer !== "yes") {
    console.log("Not sent. Nothing left this machine.");
    return false;
  }
  await grantDeclineConsent();
  return true;
}
async function sendDecline(bountyId, reason) {
  if (!DECLINE_CHOICES.some((c) => c.reason === reason)) {
    console.error("Not one of the answers \u2014 nothing sent.");
    return false;
  }
  let apiUrl;
  try {
    const { resolveApiBase: resolveApiBase2 } = await Promise.resolve().then(() => (init_api_base(), api_base_exports));
    apiUrl = resolveApiBase2();
  } catch (err) {
    console.log(`
${err instanceof Error ? err.message : String(err)}`);
    return false;
  }
  const { missingSessionLines: missingSessionLines2, webSessionCookieForHost: webSessionCookieForHost2 } = await Promise.resolve().then(() => (init_web_session(), web_session_exports));
  const { cookie, mismatch } = webSessionCookieForHost2(apiUrl);
  if (!cookie) {
    if (mismatch) console.log(`
${missingSessionLines2(mismatch).join("\n")}`);
    else
      console.log("\nRun `terminalhire link` first \u2014 a poster needs to know the answer is real.");
    return false;
  }
  if (!await ensureDeclineConsent(bountyId, reason)) return false;
  try {
    const res = await fetch(`${apiUrl}/api/posting/decline`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie: `${GH_SESSION_COOKIE}=${cookie}`
      },
      body: JSON.stringify(declineBody(bountyId, reason)),
      signal: AbortSignal.timeout(1e4)
    });
    if (!res.ok) {
      console.log(`
Could not send that (${res.status}). Nothing else was sent.`);
      return false;
    }
    console.log("\nSent \u2014 thanks. The poster sees a count, never your name.");
    return true;
  } catch {
    console.log("\nCould not reach terminalhire. Nothing else was sent.");
    return false;
  }
}
async function runDeclinePrompt(bountyId, { ask = prompt } = {}) {
  console.log("\nWhy are you passing? The poster sees a count, never your name.");
  for (const c of DECLINE_CHOICES) console.log(`  ${c.key}. ${c.label}`);
  const pick = await ask("\nEnter a number, or press Enter to skip: ");
  const reason = reasonForKey(pick);
  if (!reason) return false;
  return sendDecline(bountyId, reason);
}
export {
  DECLINE_CHOICES,
  consentNotice,
  declineBody,
  ensureDeclineConsent,
  forgetDeclineConsent,
  hasDeclineConsent,
  postingIdFromJobId,
  reasonForKey,
  runDeclinePrompt,
  sendDecline
};
