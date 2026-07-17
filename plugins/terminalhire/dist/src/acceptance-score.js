// src/acceptance-score.ts
var clamp01 = (n) => Math.max(0, Math.min(1, n));
function scoreDiffAcceptance(input) {
  const reasons = [];
  let score = 0.5;
  const factor = (code, text, delta) => {
    reasons.push({ code, text, delta });
    score += delta;
  };
  const prs = Math.max(0, Math.floor(input.competingOpenPRs));
  if (prs === 0) {
    factor("no-competing-prs", "no competing open PRs (+0.20)", 0.2);
  } else if (prs === 1) {
    factor("one-competing-pr", "1 competing open PR (-0.05)", -0.05);
  } else if (prs === 2) {
    factor("two-competing-prs", "2 competing open PRs (-0.20)", -0.2);
  } else {
    factor("competing-prs-contested", `${prs} competing open PRs \u2014 heavily contested (-0.35)`, -0.35);
  }
  if (input.filesChanged <= 3 && input.linesChanged <= 150) {
    factor("small-diff", "small, focused diff (+0.15)", 0.15);
  } else if (input.filesChanged > 15 || input.linesChanged > 800) {
    factor("large-diff", "large diff \u2014 harder to review/merge (-0.20)", -0.2);
  } else {
    factor("moderate-diff", "moderate diff size (0)", 0);
  }
  if (input.touchesTests) {
    factor("has-tests", "includes test changes (+0.10)", 0.1);
  } else {
    factor("no-tests", "no test changes (-0.05)", -0.05);
  }
  if (input.matchesIssueArea === true) {
    factor("matches-issue-area", "touches the issue's referenced files (+0.10)", 0.1);
  } else if (input.matchesIssueArea === false) {
    factor("off-issue-area", "does not touch the issue's referenced files (-0.10)", -0.1);
  } else {
    factor("issue-area-unknown", "issue-area match unknown (0)", 0);
  }
  return { score: Math.round(clamp01(score) * 100) / 100, reasons };
}
export {
  scoreDiffAcceptance
};
