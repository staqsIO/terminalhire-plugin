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

// src/claims.ts
var claims_exports = {};
__export(claims_exports, {
  PUSHED_CLAIM_FIELDS: () => PUSHED_CLAIM_FIELDS,
  acceptedPRRate: () => acceptedPRRate,
  findClaim: () => findClaim,
  listClaims: () => listClaims,
  nextPolledState: () => nextPolledState,
  readClaims: () => readClaims,
  recordClaim: () => recordClaim,
  removeClaim: () => removeClaim,
  removeClaimIfStakeMatches: () => removeClaimIfStakeMatches,
  reserveStake: () => reserveStake,
  toPushedClaim: () => toPushedClaim,
  updateClaim: () => updateClaim
});
import {
  readFileSync as readFileSync2,
  writeFileSync as writeFileSync2,
  mkdirSync as mkdirSync2,
  renameSync as renameSync2,
  existsSync as existsSync3,
  rmSync as rmSync2,
  statSync
} from "fs";
import { randomBytes as randomBytes2 } from "crypto";
import { join as join3 } from "path";
import { homedir as homedir2 } from "os";
function sleepSync(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}
function withClaimsLock(fn) {
  ensureStateDir(TERMINALHIRE_DIR2);
  const deadline = Date.now() + LOCK_TIMEOUT_MS;
  for (; ; ) {
    try {
      mkdirSync2(LOCK_DIR, { mode: 448 });
      break;
    } catch {
      try {
        if (Date.now() - statSync(LOCK_DIR).mtimeMs > LOCK_STALE_MS) {
          rmSync2(LOCK_DIR, { recursive: true, force: true });
          continue;
        }
      } catch {
      }
      if (Date.now() > deadline) {
        throw new Error(
          `claims store is locked (another terminalhire process?) \u2014 remove ${LOCK_DIR} if no other process is running`
        );
      }
      sleepSync(LOCK_RETRY_MS);
    }
  }
  try {
    return fn();
  } finally {
    rmSync2(LOCK_DIR, { recursive: true, force: true });
  }
}
function toPushedClaim(claim) {
  return {
    kind: claim.kind,
    repoFullName: claim.repoFullName,
    state: claim.state,
    prUrl: claim.prUrl,
    merged: claim.state === "merged",
    claimedAt: claim.claimedAt,
    updatedAt: claim.updatedAt
  };
}
function nextPolledState(from, observed) {
  return POLL_TRANSITIONS[observed].has(from) ? observed : from;
}
function nowISO() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function normalizeClaim(c) {
  return { ...c, kind: c.kind ?? "bounty", policy: c.policy ?? null };
}
function readClaims() {
  try {
    if (!existsSync3(CLAIMS_FILE)) return [];
    const data = JSON.parse(readFileSync2(CLAIMS_FILE, "utf8"));
    const claims = Array.isArray(data?.claims) ? data.claims : [];
    return claims.map(normalizeClaim);
  } catch {
    return [];
  }
}
function writeClaims(claims) {
  ensureStateDir(TERMINALHIRE_DIR2);
  const tmp = `${CLAIMS_FILE}.${process.pid}.${randomBytes2(6).toString("hex")}.tmp`;
  const payload = { claims };
  try {
    writeFileSync2(tmp, JSON.stringify(payload, null, 2), {
      encoding: "utf8",
      mode: 384,
      flag: "wx"
    });
    renameSync2(tmp, CLAIMS_FILE);
  } catch (err) {
    try {
      rmSync2(tmp, { force: true });
    } catch {
    }
    throw err;
  }
}
function findClaim(id) {
  return readClaims().find((c) => c.id === id) ?? null;
}
function listClaims(opts = {}) {
  const claims = readClaims();
  if (!opts.active) return claims;
  return claims.filter((c) => !TERMINAL_STATES.has(c.state));
}
function recordClaim(rec) {
  return withClaimsLock(() => {
    const claims = readClaims();
    if (claims.some((c) => c.id === rec.id)) {
      throw new Error(
        `claim already exists for '${rec.id}' \u2014 run 'terminalhire claim status ${rec.id}' or 'terminalhire claim release ${rec.id}'`
      );
    }
    const ts = nowISO();
    const claim = {
      ...rec,
      // Defensive default (mirrors normalizeClaim's `kind ?? 'bounty'` pattern):
      // a caller written before `policy` existed, or a plain-JS caller that skips
      // it, still produces a valid record instead of `policy: undefined`.
      policy: rec.policy ?? null,
      state: "claimed",
      worktreePath: null,
      branch: null,
      prUrl: null,
      review: null,
      claimedAt: ts,
      updatedAt: ts
    };
    claims.push(claim);
    writeClaims(claims);
    return claim;
  });
}
function updateClaim(id, patch) {
  return withClaimsLock(() => {
    const claims = readClaims();
    const idx = claims.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    claims[idx] = { ...claims[idx], ...patch, updatedAt: nowISO() };
    writeClaims(claims);
    return claims[idx];
  });
}
function reserveStake(id, stake) {
  return withClaimsLock(() => {
    const claims = readClaims();
    const idx = claims.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    if (claims[idx].stake) return null;
    claims[idx] = { ...claims[idx], stake, updatedAt: nowISO() };
    writeClaims(claims);
    return claims[idx];
  });
}
function removeClaim(id) {
  return withClaimsLock(() => {
    const claims = readClaims();
    const next = claims.filter((c) => c.id !== id);
    if (next.length === claims.length) return false;
    writeClaims(next);
    return true;
  });
}
function removeClaimIfStakeMatches(id, expectedStakePostedAt) {
  return withClaimsLock(() => {
    const claims = readClaims();
    const target = claims.find((c) => c.id === id);
    if (!target) return false;
    const actual = target.stake ? target.stake.postedAt : null;
    if (actual !== expectedStakePostedAt) return false;
    writeClaims(claims.filter((c) => c.id !== id));
    return true;
  });
}
function acceptedPRRate(claims = readClaims()) {
  const total = claims.length;
  const merged = claims.filter((c) => c.state === "merged").length;
  return { merged, total, rate: total === 0 ? 0 : merged / total };
}
var TERMINALHIRE_DIR2, CLAIMS_FILE, LOCK_DIR, LOCK_STALE_MS, LOCK_RETRY_MS, LOCK_TIMEOUT_MS, PUSHED_CLAIM_FIELDS, TERMINAL_STATES, POLL_TRANSITIONS;
var init_claims = __esm({
  "src/claims.ts"() {
    "use strict";
    init_state_dir();
    TERMINALHIRE_DIR2 = process.env.TERMINALHIRE_DIR || join3(homedir2(), ".terminalhire");
    CLAIMS_FILE = join3(TERMINALHIRE_DIR2, "claims.json");
    LOCK_DIR = `${CLAIMS_FILE}.lock`;
    LOCK_STALE_MS = Number(process.env.TERMINALHIRE_LOCK_STALE_MS) || 1e4;
    LOCK_RETRY_MS = Number(process.env.TERMINALHIRE_LOCK_RETRY_MS) || 25;
    LOCK_TIMEOUT_MS = Number(process.env.TERMINALHIRE_LOCK_TIMEOUT_MS) || 5e3;
    PUSHED_CLAIM_FIELDS = [
      "kind",
      "repoFullName",
      "state",
      "prUrl",
      "merged",
      "claimedAt",
      "updatedAt"
    ];
    TERMINAL_STATES = /* @__PURE__ */ new Set(["merged", "abandoned"]);
    POLL_TRANSITIONS = {
      merged: /* @__PURE__ */ new Set([
        "claimed",
        "working",
        "in-review",
        "ready",
        "submitted",
        "abandoned"
      ]),
      abandoned: /* @__PURE__ */ new Set([
        "claimed",
        "working",
        "in-review",
        "ready",
        "submitted",
        "merged"
      ]),
      submitted: /* @__PURE__ */ new Set(["claimed", "working", "in-review", "ready"])
    };
  }
});

// bin/claim-push-bg.js
import { createHash } from "crypto";
import { readFileSync as readFileSync3, writeFileSync as writeFileSync3, existsSync as existsSync4, rmSync as rmSync3 } from "fs";
import { join as join4 } from "path";
import { homedir as homedir3 } from "os";

// src/github-auth.ts
init_state_dir();
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";
import {
  readFileSync,
  writeFileSync,
  existsSync as existsSync2,
  rmSync,
  renameSync,
  linkSync,
  unlinkSync
} from "fs";
import { join as join2 } from "path";
import { homedir } from "os";

// src/test-race-barrier.ts
import { closeSync as closeSync2, constants as constants2, existsSync, lstatSync, openSync as openSync2 } from "fs";
import { join } from "path";
var ENV_VAR = "TERMINALHIRE_TEST_RACE_BARRIER_DIR";
function syncSleepMs(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}
function waitForTestRaceBarrier(phase) {
  const root = process.env[ENV_VAR];
  if (!root) return;
  const phaseDir = join(root, phase);
  if (!existsSync(phaseDir)) return;
  const readyFile = join(phaseDir, `ready-${process.pid}`);
  const goFile = join(phaseDir, "go");
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

// src/github-auth.ts
var TERMINALHIRE_DIR = process.env.TERMINALHIRE_DIR || join2(homedir(), ".terminalhire");
var TOKEN_FILE = join2(TERMINALHIRE_DIR, "github-token.enc");
var KEY_FILE = join2(TERMINALHIRE_DIR, "key");
var ALGO = "aes-256-gcm";
var KEY_BYTES = 32;
var IV_BYTES = 12;
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
  const tmpFile = `${KEY_FILE}.${process.pid}.${randomBytes(6).toString("hex")}.tmp`;
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
async function loadKey() {
  ensureStateDirForSecret(TERMINALHIRE_DIR);
  if (existsSync2(KEY_FILE)) {
    return readKeyFileOrThrow();
  }
  waitForTestRaceBarrier("key");
  const key = randomBytes(KEY_BYTES);
  if (publishKeyBlob(key)) {
    return key;
  }
  return readKeyFileOrThrow();
}
function encrypt(plaintext, key) {
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv(ALGO, key, iv);
  const ct = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return { iv: iv.toString("hex"), tag: tag.toString("hex"), ciphertext: ct.toString("hex") };
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

// bin/claim-push-bg.js
init_state_dir();
var TERMINALHIRE_DIR3 = process.env.TERMINALHIRE_DIR || join4(homedir3(), ".terminalhire");
var CLAIM_PUSH_AUTO_MARKER = join4(TERMINALHIRE_DIR3, "claim-push-auto.json");
var CLAIM_PUSH_TOKEN_FILE = join4(TERMINALHIRE_DIR3, "claim-push-token.enc");
var CLAIM_PUSH_MANUAL_MARKER = join4(TERMINALHIRE_DIR3, "claim-push.json");
var CLAIM_SYNC_BASE = "https://terminalhire.com";
var AUTO_CONSENT_VERSION = 2;
var AUTO_PUSH_THROTTLE_MS = 24 * 60 * 60 * 1e3;
async function writePushTokenEnc(rawToken) {
  ensureStateDirForSecret(TERMINALHIRE_DIR3);
  const key = await loadKey();
  const blob = encrypt(rawToken, key);
  writeFileSync3(CLAIM_PUSH_TOKEN_FILE, JSON.stringify(blob, null, 2), { encoding: "utf8" });
}
async function readPushTokenEnc() {
  if (!existsSync4(CLAIM_PUSH_TOKEN_FILE)) return void 0;
  try {
    const key = await loadKey();
    const blob = JSON.parse(readFileSync3(CLAIM_PUSH_TOKEN_FILE, "utf8"));
    return decrypt(blob, key);
  } catch {
    return void 0;
  }
}
function clearPushTokenEnc() {
  try {
    rmSync3(CLAIM_PUSH_TOKEN_FILE);
  } catch {
  }
}
function readAutoMarker() {
  try {
    return existsSync4(CLAIM_PUSH_AUTO_MARKER) ? JSON.parse(readFileSync3(CLAIM_PUSH_AUTO_MARKER, "utf8")) : null;
  } catch {
    return null;
  }
}
function writeAutoMarker(marker) {
  ensureStateDir(TERMINALHIRE_DIR3);
  writeFileSync3(CLAIM_PUSH_AUTO_MARKER, JSON.stringify(marker, null, 2) + "\n", "utf8");
}
function clearAutoMarker() {
  try {
    rmSync3(CLAIM_PUSH_AUTO_MARKER);
  } catch {
  }
}
function computeSnapshotHash(pushed) {
  return createHash("sha256").update(JSON.stringify(pushed)).digest("hex");
}
function backgroundPushGate(params) {
  const {
    autoMarkerExists,
    tokenFileExists,
    lastPushedAt,
    now,
    throttleMs,
    currentHash,
    lastSnapshotHash
  } = params;
  if (!autoMarkerExists || !tokenFileExists) {
    return { push: false, reason: "not-opted-in" };
  }
  const last = lastPushedAt ? Date.parse(lastPushedAt) : NaN;
  if (!Number.isNaN(last) && now - last < throttleMs) {
    return { push: false, reason: "throttled" };
  }
  if (lastSnapshotHash && lastSnapshotHash === currentHash) {
    return { push: false, reason: "unchanged" };
  }
  return { push: true, reason: "ok" };
}
function unpushedNudgeGate(params) {
  const {
    autoMarkerExists,
    tokenFileExists,
    manualMarkerExists,
    lastSnapshotHash,
    currentHash,
    claimCount
  } = params;
  if (autoMarkerExists && tokenFileExists) return false;
  if (!manualMarkerExists) return false;
  if (!(claimCount > 0)) return false;
  return lastSnapshotHash !== currentHash;
}
async function shouldNudgeUnpushed() {
  try {
    const { listClaims: listClaims2, toPushedClaim: toPushedClaim2 } = await Promise.resolve().then(() => (init_claims(), claims_exports));
    const pushed = listClaims2().map((c) => toPushedClaim2(c));
    const currentHash = computeSnapshotHash(pushed);
    let manual = null;
    try {
      manual = existsSync4(CLAIM_PUSH_MANUAL_MARKER) ? JSON.parse(readFileSync3(CLAIM_PUSH_MANUAL_MARKER, "utf8")) : null;
    } catch {
      manual = null;
    }
    return unpushedNudgeGate({
      autoMarkerExists: existsSync4(CLAIM_PUSH_AUTO_MARKER),
      tokenFileExists: existsSync4(CLAIM_PUSH_TOKEN_FILE),
      manualMarkerExists: !!manual,
      lastSnapshotHash: manual?.lastSnapshotHash ?? null,
      currentHash,
      claimCount: pushed.length
    });
  } catch {
    return false;
  }
}
async function runBackgroundClaimPush({ now = Date.now() } = {}) {
  try {
    if (!existsSync4(CLAIM_PUSH_AUTO_MARKER) || !existsSync4(CLAIM_PUSH_TOKEN_FILE)) return;
    const marker = readAutoMarker();
    if (!marker || !marker.autoConsentedAt) return;
    const { listClaims: listClaims2, toPushedClaim: toPushedClaim2, PUSHED_CLAIM_FIELDS: PUSHED_CLAIM_FIELDS2 } = await Promise.resolve().then(() => (init_claims(), claims_exports));
    const pushed = listClaims2().map((c) => toPushedClaim2(c));
    const currentHash = computeSnapshotHash(pushed);
    const gate = backgroundPushGate({
      autoMarkerExists: true,
      tokenFileExists: true,
      lastPushedAt: marker.lastPushedAt ?? null,
      now,
      throttleMs: AUTO_PUSH_THROTTLE_MS,
      currentHash,
      lastSnapshotHash: marker.lastSnapshotHash ?? null
    });
    if (!gate.push) return;
    const token = await readPushTokenEnc();
    if (!token) return;
    const consentReceipt = {
      consentedAt: marker.autoConsentedAt,
      version: AUTO_CONSENT_VERSION,
      fields: PUSHED_CLAIM_FIELDS2
    };
    const res = await fetch(`${CLAIM_SYNC_BASE}/api/claim-sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ consentToken: consentReceipt, claims: pushed, pushToken: token }),
      signal: AbortSignal.timeout(1e4)
    });
    if (!res.ok) return;
    writeAutoMarker({
      ...marker,
      lastPushedAt: new Date(now).toISOString(),
      lastSnapshotHash: currentHash
    });
  } catch {
  }
}
export {
  AUTO_CONSENT_VERSION,
  AUTO_PUSH_THROTTLE_MS,
  CLAIM_PUSH_AUTO_MARKER,
  CLAIM_PUSH_MANUAL_MARKER,
  CLAIM_PUSH_TOKEN_FILE,
  backgroundPushGate,
  clearAutoMarker,
  clearPushTokenEnc,
  computeSnapshotHash,
  readAutoMarker,
  readPushTokenEnc,
  runBackgroundClaimPush,
  shouldNudgeUnpushed,
  unpushedNudgeGate,
  writeAutoMarker,
  writePushTokenEnc
};
