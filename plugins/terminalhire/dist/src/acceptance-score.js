// src/acceptance-score.ts
var clamp01 = (n) => Math.max(0, Math.min(1, n));
function scoreDiffAcceptance(input) {
  const reasons = [];
  let score = 0.5;
  const prs = Math.max(0, Math.floor(input.competingOpenPRs));
  if (prs === 0) {
    score += 0.2;
    reasons.push("no competing open PRs (+0.20)");
  } else if (prs === 1) {
    score -= 0.05;
    reasons.push("1 competing open PR (-0.05)");
  } else if (prs === 2) {
    score -= 0.2;
    reasons.push("2 competing open PRs (-0.20)");
  } else {
    score -= 0.35;
    reasons.push(`${prs} competing open PRs \u2014 heavily contested (-0.35)`);
  }
  if (input.filesChanged <= 3 && input.linesChanged <= 150) {
    score += 0.15;
    reasons.push("small, focused diff (+0.15)");
  } else if (input.filesChanged > 15 || input.linesChanged > 800) {
    score -= 0.2;
    reasons.push("large diff \u2014 harder to review/merge (-0.20)");
  } else {
    reasons.push("moderate diff size (0)");
  }
  if (input.touchesTests) {
    score += 0.1;
    reasons.push("includes test changes (+0.10)");
  } else {
    score -= 0.05;
    reasons.push("no test changes (-0.05)");
  }
  if (input.matchesIssueArea === true) {
    score += 0.1;
    reasons.push("touches the issue's referenced files (+0.10)");
  } else if (input.matchesIssueArea === false) {
    score -= 0.1;
    reasons.push("does not touch the issue's referenced files (-0.10)");
  } else {
    reasons.push("issue-area match unknown (0)");
  }
  return { score: Math.round(clamp01(score) * 100) / 100, reasons };
}
export {
  scoreDiffAcceptance
};
