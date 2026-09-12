// src/web-session.ts
import { chmodSync, existsSync, readFileSync, rmSync, writeFileSync } from "fs";
import { homedir as homedir2 } from "os";
import { join as join2 } from "path";

// src/api-base.ts
import { homedir } from "os";
import { join } from "path";
var PROD_API_BASE = "https://terminalhire.com";
var DEV_API_BASE = "https://dev.terminalhire.com";
var ALLOW_LOCAL_API_KEY = "TERMINALHIRE_ALLOW_LOCAL_API";
var ALLOWED_DESCRIPTION = [
  PROD_API_BASE,
  DEV_API_BASE,
  `http://localhost:<port> (requires ${ALLOW_LOCAL_API_KEY}=1)`,
  `http://127.0.0.1:<port> (requires ${ALLOW_LOCAL_API_KEY}=1)`
].join(", ");
function isLoopbackOrigin(origin) {
  try {
    const host = new URL(origin).hostname;
    return host === "localhost" || host === "127.0.0.1";
  } catch {
    return false;
  }
}

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

// src/web-session.ts
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
export {
  clearWebSessionFile,
  hostLabel,
  missingSessionLines,
  readWebSessionCookie,
  readWebSessionFile,
  readWebSessionRecord,
  refusedSessionLines,
  webSessionCookieForHost,
  webSessionFilePath,
  webSessionForHost,
  withSessionDeps,
  writeWebSessionFile
};
