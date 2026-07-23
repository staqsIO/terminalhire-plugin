// src/claims.ts
import {
  readFileSync,
  writeFileSync,
  mkdirSync as mkdirSync2,
  renameSync,
  existsSync,
  rmSync,
  statSync
} from "fs";
import { randomBytes } from "crypto";
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

// src/claims.ts
var TERMINALHIRE_DIR = process.env.TERMINALHIRE_DIR || join(homedir(), ".terminalhire");
var CLAIMS_FILE = join(TERMINALHIRE_DIR, "claims.json");
var LOCK_DIR = `${CLAIMS_FILE}.lock`;
var LOCK_STALE_MS = Number(process.env.TERMINALHIRE_LOCK_STALE_MS) || 1e4;
var LOCK_RETRY_MS = Number(process.env.TERMINALHIRE_LOCK_RETRY_MS) || 25;
var LOCK_TIMEOUT_MS = Number(process.env.TERMINALHIRE_LOCK_TIMEOUT_MS) || 5e3;
function sleepSync(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}
function withClaimsLock(fn) {
  ensureStateDir(TERMINALHIRE_DIR);
  const deadline = Date.now() + LOCK_TIMEOUT_MS;
  for (; ; ) {
    try {
      mkdirSync2(LOCK_DIR, { mode: 448 });
      break;
    } catch {
      try {
        if (Date.now() - statSync(LOCK_DIR).mtimeMs > LOCK_STALE_MS) {
          rmSync(LOCK_DIR, { recursive: true, force: true });
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
    rmSync(LOCK_DIR, { recursive: true, force: true });
  }
}
var PUSHED_CLAIM_FIELDS = [
  "kind",
  "repoFullName",
  "state",
  "prUrl",
  "merged",
  "claimedAt",
  "updatedAt"
];
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
var TERMINAL_STATES = /* @__PURE__ */ new Set(["merged", "abandoned"]);
var POLL_TRANSITIONS = {
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
    if (!existsSync(CLAIMS_FILE)) return [];
    const data = JSON.parse(readFileSync(CLAIMS_FILE, "utf8"));
    const claims = Array.isArray(data?.claims) ? data.claims : [];
    return claims.map(normalizeClaim);
  } catch {
    return [];
  }
}
function writeClaims(claims) {
  ensureStateDir(TERMINALHIRE_DIR);
  const tmp = `${CLAIMS_FILE}.${process.pid}.${randomBytes(6).toString("hex")}.tmp`;
  const payload = { claims };
  try {
    writeFileSync(tmp, JSON.stringify(payload, null, 2), {
      encoding: "utf8",
      mode: 384,
      flag: "wx"
    });
    renameSync(tmp, CLAIMS_FILE);
  } catch (err) {
    try {
      rmSync(tmp, { force: true });
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
function removeClaim(id) {
  return withClaimsLock(() => {
    const claims = readClaims();
    const next = claims.filter((c) => c.id !== id);
    if (next.length === claims.length) return false;
    writeClaims(next);
    return true;
  });
}
function acceptedPRRate(claims = readClaims()) {
  const total = claims.length;
  const merged = claims.filter((c) => c.state === "merged").length;
  return { merged, total, rate: total === 0 ? 0 : merged / total };
}
export {
  PUSHED_CLAIM_FIELDS,
  acceptedPRRate,
  findClaim,
  listClaims,
  nextPolledState,
  readClaims,
  recordClaim,
  removeClaim,
  toPushedClaim,
  updateClaim
};
