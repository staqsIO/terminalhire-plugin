// src/web-session.ts
import { chmodSync, existsSync, readFileSync, rmSync, writeFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";

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
function readWebSessionCookie() {
  const fromFile = readWebSessionFile();
  if (fromFile) return fromFile;
  const env = process.env["TERMINALHIRE_WEB_SESSION"];
  return typeof env === "string" && env.length > 0 ? env : null;
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
export {
  clearWebSessionFile,
  readWebSessionCookie,
  readWebSessionFile,
  webSessionFilePath,
  writeWebSessionFile
};
