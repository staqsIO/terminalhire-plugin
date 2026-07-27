// bin/approved-claims-badge.js
function normalizeIds(claimIds) {
  if (!Array.isArray(claimIds)) return [];
  return [...new Set(claimIds.filter((id) => typeof id === "string" && id !== ""))].sort();
}
function computeApprovedClaims(claimIds, previous) {
  const approved = normalizeIds(claimIds);
  const prior = previous && Array.isArray(previous.acknowledged) ? new Set(previous.acknowledged) : /* @__PURE__ */ new Set();
  const acknowledged = approved.filter((id) => prior.has(id));
  return { count: approved.length - acknowledged.length, acknowledged };
}
function acknowledgeApprovedClaim(claimId, previous) {
  const prior = previous && Array.isArray(previous.acknowledged) ? previous.acknowledged : [];
  if (typeof claimId !== "string" || claimId === "") {
    const acknowledged2 = [...new Set(prior)].sort();
    const count2 = previous && typeof previous.count === "number" ? previous.count : 0;
    return { count: count2, acknowledged: acknowledged2 };
  }
  const acknowledged = [.../* @__PURE__ */ new Set([...prior, claimId])].sort();
  const prevCount = previous && typeof previous.count === "number" ? previous.count : 0;
  const alreadyKnown = prior.includes(claimId);
  const count = alreadyKnown ? prevCount : Math.max(0, prevCount - 1);
  return { count, acknowledged };
}
export {
  acknowledgeApprovedClaim,
  computeApprovedClaims
};
