// bin/founder-pin.js
function isPinnedFounderBounty(j) {
  return j?.bounty?.bountySource === "founder" && j?.bounty?.claimable === true;
}
export {
  isPinnedFounderBounty
};
