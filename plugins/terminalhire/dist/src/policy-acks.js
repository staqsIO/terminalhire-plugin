// src/policy-acks.ts
import { lstatSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { homedir } from "os";

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

// src/policy-acks.ts
var TERMINALHIRE_DIR = process.env.TERMINALHIRE_DIR || join(homedir(), ".terminalhire");
var ACKS_FILE = join(TERMINALHIRE_DIR, "policy-acks.json");
var REMEMBERABLE_VERDICTS = /* @__PURE__ */ new Set(["ai-mentioned", "disclosure-required"]);
var HEX64 = /^[0-9a-f]{64}$/;
function isSymlink(path) {
  try {
    return lstatSync(path).isSymbolicLink();
  } catch {
    return false;
  }
}
function storeIsRedirected() {
  return isSymlink(ACKS_FILE) || isSymlink(TERMINALHIRE_DIR);
}
function isValidAck(value, repoKey) {
  if (!value || typeof value !== "object") return false;
  const a = value;
  return a.repo === repoKey && // the row must belong to the key it is filed under
  typeof a.contentHash === "string" && HEX64.test(a.contentHash) && typeof a.rulesetVersion === "number" && typeof a.verdict === "string" && REMEMBERABLE_VERDICTS.has(a.verdict) && // never honor a forged prohibited/clean
  typeof a.ackedAt === "string";
}
function readAcks() {
  if (storeIsRedirected()) return {};
  try {
    const parsed = JSON.parse(readFileSync(ACKS_FILE, "utf8"));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return parsed;
  } catch {
    return {};
  }
}
function findPolicyAck(repo, contentHash, rulesetVersion) {
  if (!contentHash) return null;
  const ack = readAcks()[repo];
  if (!isValidAck(ack, repo)) return null;
  if (ack.contentHash !== contentHash) return null;
  if (ack.rulesetVersion !== rulesetVersion) return null;
  return ack;
}
function rememberPolicyAck(ack) {
  if (!ack.contentHash) return;
  if (!REMEMBERABLE_VERDICTS.has(ack.verdict)) return;
  if (storeIsRedirected()) return;
  try {
    ensureStateDir(TERMINALHIRE_DIR);
    const all = readAcks();
    all[ack.repo] = ack;
    writeFileSync(ACKS_FILE, `${JSON.stringify(all, null, 2)}
`, { mode: 384 });
  } catch {
  }
}
var POLICY_ACKS_FILE = ACKS_FILE;
export {
  POLICY_ACKS_FILE,
  findPolicyAck,
  rememberPolicyAck
};
