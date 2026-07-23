// src/reputation/audit.ts
var MAINTAINER_ASSOC = /* @__PURE__ */ new Set(["OWNER", "MEMBER", "COLLABORATOR"]);
var AUDIT_LIMITATIONS = [
  "Post-merge bug/revert rate \u2014 longitudinal; it only shows up after the merge this audit stops at.",
  "Downstream adoption / real-world impact \u2014 a repo-level, slow signal not visible in one PR timeline.",
  "Reviewer satisfaction and collaboration quality \u2014 not observable from public timeline events."
];
function roleOf(e) {
  if (e.is_bot) return "bot";
  if (e.is_author) return "you";
  const a = String(e.actor_assoc || "").toUpperCase();
  if (MAINTAINER_ASSOC.has(a)) return "maintainer";
  if (a === "CONTRIBUTOR") return "contributor";
  if (a === "NONE") return "outside";
  return "unknown";
}
function isMaintainerResponse(e) {
  return !e.is_author && !e.is_bot && MAINTAINER_ASSOC.has(String(e.actor_assoc || "").toUpperCase());
}
function byTime(a, b) {
  if (a.occurred_at < b.occurred_at) return -1;
  if (a.occurred_at > b.occurred_at) return 1;
  if (a.source_id < b.source_id) return -1;
  if (a.source_id > b.source_id) return 1;
  return 0;
}
function hoursBetween(a, b) {
  if (!a || !b) return null;
  const ta = Date.parse(a);
  const tb = Date.parse(b);
  if (Number.isNaN(ta) || Number.isNaN(tb)) return null;
  return Math.round((tb - ta) / 36e5 * 10) / 10;
}
function buildAuditView(lifecycle, facts) {
  const events = [...lifecycle.events].sort(byTime);
  const counterpartyIds = /* @__PURE__ */ new Set();
  for (const e of events) {
    if (!e.is_author && !e.is_bot && e.actor_id !== 0) counterpartyIds.add(e.actor_id);
  }
  const firstResponse = events.find(isMaintainerResponse) ?? null;
  const firstResponseAt = firstResponse?.occurred_at ?? null;
  const maintainerReviews = events.filter(
    (e) => e.event_type === "review_submitted" && isMaintainerResponse(e)
  ).length;
  const iterationsAfterFirstResponse = firstResponseAt ? events.filter(
    (e) => e.event_type === "commit_pushed" && e.is_author && e.occurred_at > firstResponseAt
  ).length : 0;
  const outcome = lifecycle.merged ? "merged" : lifecycle.closedUnmergedAt ? "closed_unmerged" : "open";
  const signals = {
    distinctCounterparties: counterpartyIds.size,
    maintainerReviews,
    iterationsAfterFirstResponse,
    hoursToFirstResponse: hoursBetween(lifecycle.openedAt, firstResponseAt),
    hoursToMerge: hoursBetween(lifecycle.openedAt, lifecycle.mergedAt)
  };
  const timeline = events.map((e) => ({
    at: e.occurred_at,
    event: e.event_type,
    role: roleOf(e)
  }));
  const notes = [];
  if (!lifecycle.complete.reviews) notes.push("Review data incomplete \u2014 review counts may undercount.");
  if (!lifecycle.complete.comments) notes.push("Comment data incomplete \u2014 response detection may be partial.");
  if (!lifecycle.complete.commits) notes.push("Commit data incomplete \u2014 iteration count may undercount.");
  if (lifecycle.authorId == null) notes.push("PR author identity unavailable \u2014 author/counterparty split may be imprecise.");
  return {
    repo: facts?.repo ?? "",
    prNumber: lifecycle.prNumber,
    prUrl: lifecycle.prUrl,
    openedAt: lifecycle.openedAt,
    outcome,
    mergedAt: lifecycle.mergedAt,
    closedUnmergedAt: lifecycle.closedUnmergedAt,
    signals,
    timeline,
    completeness: { ...lifecycle.complete },
    notes,
    limitations: [...AUDIT_LIMITATIONS]
  };
}
export {
  buildAuditView
};
