var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../../node_modules/keytar/build/Release/keytar.node
var keytar_default;
var init_keytar = __esm({
  "../../node_modules/keytar/build/Release/keytar.node"() {
    keytar_default = "../keytar-KOAAH267.node";
  }
});

// node-file:/Users/ericgang/job-placement-inline/.claude/worktrees/claim-frictionless/node_modules/keytar/build/Release/keytar.node
var require_keytar = __commonJS({
  "node-file:/Users/ericgang/job-placement-inline/.claude/worktrees/claim-frictionless/node_modules/keytar/build/Release/keytar.node"(exports, module) {
    "use strict";
    init_keytar();
    try {
      module.exports = __require(keytar_default);
    } catch {
    }
  }
});

// ../../node_modules/keytar/lib/keytar.js
var require_keytar2 = __commonJS({
  "../../node_modules/keytar/lib/keytar.js"(exports, module) {
    "use strict";
    var keytar = require_keytar();
    function checkRequired(val, name) {
      if (!val || val.length <= 0) {
        throw new Error(name + " is required.");
      }
    }
    module.exports = {
      getPassword: function(service, account) {
        checkRequired(service, "Service");
        checkRequired(account, "Account");
        return keytar.getPassword(service, account);
      },
      setPassword: function(service, account, password) {
        checkRequired(service, "Service");
        checkRequired(account, "Account");
        checkRequired(password, "Password");
        return keytar.setPassword(service, account, password);
      },
      deletePassword: function(service, account) {
        checkRequired(service, "Service");
        checkRequired(account, "Account");
        return keytar.deletePassword(service, account);
      },
      findPassword: function(service) {
        checkRequired(service, "Service");
        return keytar.findPassword(service);
      },
      findCredentials: function(service) {
        checkRequired(service, "Service");
        return keytar.findCredentials(service);
      }
    };
  }
});

// src/claims.ts
var claims_exports = {};
__export(claims_exports, {
  PUSHED_CLAIM_FIELDS: () => PUSHED_CLAIM_FIELDS,
  acceptedPRRate: () => acceptedPRRate,
  findClaim: () => findClaim,
  listClaims: () => listClaims,
  readClaims: () => readClaims,
  recordClaim: () => recordClaim,
  removeClaim: () => removeClaim,
  toPushedClaim: () => toPushedClaim,
  updateClaim: () => updateClaim
});
import { readFileSync as readFileSync2, writeFileSync as writeFileSync2, mkdirSync as mkdirSync2, renameSync, existsSync as existsSync2 } from "fs";
import { join as join2 } from "path";
import { homedir as homedir2 } from "os";
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
function nowISO() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function normalizeClaim(c) {
  return { ...c, kind: c.kind ?? "bounty", policy: c.policy ?? null };
}
function readClaims() {
  try {
    if (!existsSync2(CLAIMS_FILE)) return [];
    const data = JSON.parse(readFileSync2(CLAIMS_FILE, "utf8"));
    const claims = Array.isArray(data?.claims) ? data.claims : [];
    return claims.map(normalizeClaim);
  } catch {
    return [];
  }
}
function writeClaims(claims) {
  mkdirSync2(TERMINALHIRE_DIR2, { recursive: true });
  const tmp = `${CLAIMS_FILE}.tmp`;
  const payload = { claims };
  writeFileSync2(tmp, JSON.stringify(payload, null, 2), "utf8");
  renameSync(tmp, CLAIMS_FILE);
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
}
function updateClaim(id, patch) {
  const claims = readClaims();
  const idx = claims.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  claims[idx] = { ...claims[idx], ...patch, updatedAt: nowISO() };
  writeClaims(claims);
  return claims[idx];
}
function removeClaim(id) {
  const claims = readClaims();
  const next = claims.filter((c) => c.id !== id);
  if (next.length === claims.length) return false;
  writeClaims(next);
  return true;
}
function acceptedPRRate(claims = readClaims()) {
  const total = claims.length;
  const merged = claims.filter((c) => c.state === "merged").length;
  return { merged, total, rate: total === 0 ? 0 : merged / total };
}
var TERMINALHIRE_DIR2, CLAIMS_FILE, PUSHED_CLAIM_FIELDS, TERMINAL_STATES;
var init_claims = __esm({
  "src/claims.ts"() {
    "use strict";
    TERMINALHIRE_DIR2 = process.env.TERMINALHIRE_DIR || join2(homedir2(), ".terminalhire");
    CLAIMS_FILE = join2(TERMINALHIRE_DIR2, "claims.json");
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
  }
});

// bin/claim-push-bg.js
import { createHash } from "crypto";
import { readFileSync as readFileSync3, writeFileSync as writeFileSync3, mkdirSync as mkdirSync3, existsSync as existsSync3, rmSync as rmSync2 } from "fs";
import { join as join3 } from "path";
import { homedir as homedir3 } from "os";

// src/github-auth.ts
import {
  createCipheriv,
  createDecipheriv,
  randomBytes
} from "crypto";
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  rmSync
} from "fs";
import { join } from "path";
import { homedir } from "os";
var TERMINALHIRE_DIR = join(homedir(), ".terminalhire");
var TOKEN_FILE = join(TERMINALHIRE_DIR, "github-token.enc");
var KEY_FILE = join(TERMINALHIRE_DIR, "key");
var ALGO = "aes-256-gcm";
var KEY_BYTES = 32;
var IV_BYTES = 12;
async function loadKey() {
  try {
    const kt = await Promise.resolve().then(() => __toESM(require_keytar2(), 1));
    const stored = await kt.getPassword("terminalhire", "profile-key");
    if (stored) return Buffer.from(stored, "hex");
    const key2 = randomBytes(KEY_BYTES);
    await kt.setPassword("terminalhire", "profile-key", key2.toString("hex"));
    return key2;
  } catch {
  }
  mkdirSync(TERMINALHIRE_DIR, { recursive: true });
  if (existsSync(KEY_FILE)) {
    return Buffer.from(readFileSync(KEY_FILE, "utf8").trim(), "hex");
  }
  const key = randomBytes(KEY_BYTES);
  writeFileSync(KEY_FILE, key.toString("hex"), { mode: 384, encoding: "utf8" });
  return key;
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
var TERMINALHIRE_DIR3 = process.env.TERMINALHIRE_DIR || join3(homedir3(), ".terminalhire");
var CLAIM_PUSH_AUTO_MARKER = join3(TERMINALHIRE_DIR3, "claim-push-auto.json");
var CLAIM_PUSH_TOKEN_FILE = join3(TERMINALHIRE_DIR3, "claim-push-token.enc");
var CLAIM_SYNC_BASE = "https://terminalhire.com";
var AUTO_CONSENT_VERSION = 2;
var AUTO_PUSH_THROTTLE_MS = 24 * 60 * 60 * 1e3;
async function writePushTokenEnc(rawToken) {
  mkdirSync3(TERMINALHIRE_DIR3, { recursive: true });
  const key = await loadKey();
  const blob = encrypt(rawToken, key);
  writeFileSync3(CLAIM_PUSH_TOKEN_FILE, JSON.stringify(blob, null, 2), { encoding: "utf8" });
}
async function readPushTokenEnc() {
  if (!existsSync3(CLAIM_PUSH_TOKEN_FILE)) return void 0;
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
    rmSync2(CLAIM_PUSH_TOKEN_FILE);
  } catch {
  }
}
function readAutoMarker() {
  try {
    return existsSync3(CLAIM_PUSH_AUTO_MARKER) ? JSON.parse(readFileSync3(CLAIM_PUSH_AUTO_MARKER, "utf8")) : null;
  } catch {
    return null;
  }
}
function writeAutoMarker(marker) {
  mkdirSync3(TERMINALHIRE_DIR3, { recursive: true });
  writeFileSync3(CLAIM_PUSH_AUTO_MARKER, JSON.stringify(marker, null, 2) + "\n", "utf8");
}
function clearAutoMarker() {
  try {
    rmSync2(CLAIM_PUSH_AUTO_MARKER);
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
async function runBackgroundClaimPush({ now = Date.now() } = {}) {
  try {
    if (!existsSync3(CLAIM_PUSH_AUTO_MARKER) || !existsSync3(CLAIM_PUSH_TOKEN_FILE)) return;
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
  CLAIM_PUSH_TOKEN_FILE,
  backgroundPushGate,
  clearAutoMarker,
  clearPushTokenEnc,
  computeSnapshotHash,
  readAutoMarker,
  readPushTokenEnc,
  runBackgroundClaimPush,
  writeAutoMarker,
  writePushTokenEnc
};
