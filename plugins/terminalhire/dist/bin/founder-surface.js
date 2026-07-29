// bin/founder-surface.js
function projectFounderSurface(body) {
  if (!body || body.ok !== true || !Array.isArray(body.postings)) return null;
  const statusline = body.statusline;
  if (!statusline || typeof statusline.needsYouCount !== "number" || typeof statusline.openPostingCount !== "number" || typeof statusline.refreshedAt !== "string") {
    return null;
  }
  const postings = [];
  for (const raw of body.postings) {
    if (!raw || typeof raw.id !== "string" || typeof raw.title !== "string" || typeof raw.status !== "string" || typeof raw.needsYou !== "boolean" || typeof raw.claimantCount !== "number" || typeof raw.postedAt !== "string") {
      continue;
    }
    postings.push({
      id: raw.id,
      title: raw.title,
      status: raw.status,
      needsYou: raw.needsYou,
      claimantCount: raw.claimantCount,
      postedAt: raw.postedAt
    });
  }
  return {
    postings,
    needsYouCount: Math.max(0, statusline.needsYouCount),
    openPostingCount: Math.max(0, statusline.openPostingCount),
    refreshedAt: statusline.refreshedAt
  };
}
function resolveSurfaceLead(override, founderSurface) {
  if (override === "dev" || override === "founder") return override;
  if (founderSurface && (founderSurface.openPostingCount > 0 || founderSurface.needsYouCount > 0)) {
    return "founder";
  }
  return "dev";
}
function founderRows(surface, kind) {
  if (!surface || !Array.isArray(surface.postings)) return [];
  if (kind === "jobs") {
    return surface.postings.filter((posting) => posting.status === "open" || posting.needsYou);
  }
  return surface.postings;
}
export {
  founderRows,
  projectFounderSurface,
  resolveSurfaceLead
};
