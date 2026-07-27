// bin/approved-claims-sync.js
var CLAIM_SYNC_BASE = "https://terminalhire.com";
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
  return `  \u26A0 ${n} claim${n === 1 ? "" : "s"} awaiting founder approval \u2014 terminalhire cannot check in the background until you enrol:
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
