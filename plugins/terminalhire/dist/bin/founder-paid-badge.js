// bin/founder-pin.js
function isPinnedFounderBounty(j) {
  return j?.bounty?.bountySource === "founder" && j?.bounty?.claimable === true;
}

// bin/founder-paid-badge.js
function openPaidIds(index) {
  const jobs = index && index.jobs || [];
  const ids = [];
  for (const j of jobs) {
    if (!j || typeof j.id !== "string") continue;
    if (isPinnedFounderBounty(j)) ids.push(j.id);
  }
  return [...new Set(ids)].sort();
}
function gate(openIds, seenIds) {
  const seen = new Set(seenIds);
  const acknowledged = openIds.filter((id) => seen.has(id));
  return { count: openIds.length - acknowledged.length, acknowledged };
}
function computeFounderPaid(index, previous) {
  const open = openPaidIds(index);
  const prior = previous && previous.acknowledged;
  if (!Array.isArray(prior)) return { count: 0, acknowledged: open };
  return gate(open, prior);
}
function acknowledgeFounderPaid({ shown = [], open = [], previous } = {}) {
  const prior = previous && Array.isArray(previous.acknowledged) ? previous.acknowledged : [];
  return gate(openPaidIds({ jobs: open }), [...prior, ...openPaidIds({ jobs: shown })]);
}
export {
  acknowledgeFounderPaid,
  computeFounderPaid,
  openPaidIds
};
