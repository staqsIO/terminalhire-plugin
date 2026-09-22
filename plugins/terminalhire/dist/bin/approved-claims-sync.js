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

// bin/approved-claims-sync.js
var CLAIM_SYNC_BASE = resolveApiBase();
function approvalsSyncGate({ autoMarkerExists, tokenFileExists }) {
  if (!autoMarkerExists || !tokenFileExists) return { sync: false, reason: "not-opted-in" };
  return { sync: true, reason: "ok" };
}
function approvalsNudgeGate({ autoMarkerExists, tokenFileExists, awaitingApproval }) {
  if (approvalsSyncGate({ autoMarkerExists, tokenFileExists }).sync) return false;
  return Number.isInteger(awaitingApproval) && awaitingApproval > 0;
}
function buildApprovalsNudge(awaitingApproval) {
  if (!Number.isInteger(awaitingApproval) || awaitingApproval <= 0) return null;
  const n = awaitingApproval;
  return `  \u26A0 ${n} claim${n === 1 ? "" : "s"} awaiting poster approval \u2014 terminalhire cannot check in the background until you enrol:
    terminalhire claim --push --keep-updated    (or check one now: terminalhire claim slice <id>)`;
}
async function syncApprovedClaims({
  readAutoMarker,
  readPushTokenEnc,
  readPrevious,
  fetchImpl = fetch,
  computeApprovedClaims,
  timeoutMs = 15e3
} = {}) {
  try {
    const marker = readAutoMarker();
    const token = await readPushTokenEnc();
    if (!approvalsSyncGate({ autoMarkerExists: !!marker, tokenFileExists: !!token }).sync) {
      return null;
    }
    const res = await fetchImpl(`${CLAIM_SYNC_BASE}/api/claim/approvals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pushToken: token }),
      signal: AbortSignal.timeout(timeoutMs)
    });
    if (!res || !res.ok) return null;
    const body = await res.json();
    const claimIds = body && Array.isArray(body.claimIds) ? body.claimIds : null;
    if (!claimIds) return null;
    return computeApprovedClaims(claimIds, readPrevious());
  } catch {
    return null;
  }
}
export {
  approvalsNudgeGate,
  approvalsSyncGate,
  buildApprovalsNudge,
  syncApprovedClaims
};
