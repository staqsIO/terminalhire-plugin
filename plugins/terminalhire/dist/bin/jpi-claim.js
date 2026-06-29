#!/usr/bin/env node
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/claims.ts
var claims_exports = {};
__export(claims_exports, {
  acceptedPRRate: () => acceptedPRRate,
  findClaim: () => findClaim,
  listClaims: () => listClaims,
  readClaims: () => readClaims,
  recordClaim: () => recordClaim,
  removeClaim: () => removeClaim,
  updateClaim: () => updateClaim
});
import { readFileSync, writeFileSync, mkdirSync, renameSync, existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";
function nowISO() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function readClaims() {
  try {
    if (!existsSync(CLAIMS_FILE)) return [];
    const data = JSON.parse(readFileSync(CLAIMS_FILE, "utf8"));
    return Array.isArray(data?.claims) ? data.claims : [];
  } catch {
    return [];
  }
}
function writeClaims(claims) {
  mkdirSync(TERMINALHIRE_DIR, { recursive: true });
  const tmp = `${CLAIMS_FILE}.tmp`;
  const payload = { claims };
  writeFileSync(tmp, JSON.stringify(payload, null, 2), "utf8");
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
var TERMINALHIRE_DIR, CLAIMS_FILE, TERMINAL_STATES;
var init_claims = __esm({
  "src/claims.ts"() {
    "use strict";
    TERMINALHIRE_DIR = join(homedir(), ".terminalhire");
    CLAIMS_FILE = join(TERMINALHIRE_DIR, "claims.json");
    TERMINAL_STATES = /* @__PURE__ */ new Set(["merged", "abandoned"]);
  }
});

// bin/jpi-claim.js
import { readFileSync as readFileSync2, existsSync as existsSync2 } from "fs";
import { join as join2 } from "path";
import { homedir as homedir2 } from "os";
import { execFile } from "child_process";
import { promisify } from "util";
import { createInterface } from "readline";
var TERMINALHIRE_DIR2 = join2(homedir2(), ".terminalhire");
var INDEX_CACHE_FILE = join2(TERMINALHIRE_DIR2, "index-cache.json");
var GH_API = "https://api.github.com";
var GH_HEADERS = { "User-Agent": "terminalhire-claim", Accept: "application/vnd.github+json" };
var pExecFile = promisify(execFile);
async function sh(cmd, args, opts = {}) {
  const { stdout } = await pExecFile(cmd, args, { ...opts, shell: false, maxBuffer: 16 * 1024 * 1024 });
  return String(stdout).trim();
}
async function confirm(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    const ans = await new Promise((resolve) => rl.question(question, resolve));
    return /^y(es)?$/i.test(String(ans).trim());
  } finally {
    rl.close();
  }
}
var VALUE_FLAGS = /* @__PURE__ */ new Set(["worktree", "branch"]);
function parseArgs(argv) {
  const flags = {};
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      if (VALUE_FLAGS.has(key)) {
        const val = argv[i + 1];
        if (val === void 0 || val.startsWith("--")) {
          console.error(`terminalhire claim: --${key} requires a value.`);
          process.exit(1);
        }
        flags[key] = val;
        i++;
      } else {
        flags[key] = true;
      }
    } else {
      positional.push(a);
    }
  }
  return { flags, positional };
}
function parseRepoFromRemote(url) {
  const m = String(url ?? "").trim().match(/github\.com[:/]+([^/]+)\/([^/]+?)(?:\.git)?\/?$/);
  return m ? `${m[1]}/${m[2]}` : null;
}
function findBountyInCache(bountyId) {
  try {
    if (!existsSync2(INDEX_CACHE_FILE)) return null;
    const entry = JSON.parse(readFileSync2(INDEX_CACHE_FILE, "utf8"));
    const jobs = entry?.index?.jobs ?? [];
    const job = jobs.find((j) => j.id === bountyId && j.source === "bounty");
    return job ?? null;
  } catch {
    return null;
  }
}
function parseGitHubUrl(url) {
  const m = String(url ?? "").match(/github\.com\/([^/]+)\/([^/]+)\/(?:issues|pull)\/(\d+)/);
  if (!m) return null;
  return { owner: m[1], repo: m[2], number: parseInt(m[3], 10), repoFullName: `${m[1]}/${m[2]}` };
}
async function countOpenPRsReferencingIssue(repoFullName, issueNumber) {
  try {
    const res = await fetch(`${GH_API}/repos/${repoFullName}/pulls?state=open&per_page=100`, {
      headers: GH_HEADERS,
      signal: AbortSignal.timeout(1e4)
    });
    if (!res.ok) return null;
    const prs = await res.json();
    if (!Array.isArray(prs)) return null;
    if (prs.length === 100) return null;
    const needle = new RegExp(`#${issueNumber}\\b`);
    return prs.filter((p) => needle.test(`${p.title ?? ""}
${p.body ?? ""}`)).length;
  } catch {
    return null;
  }
}
async function fetchIssue(repoFullName, issueNumber) {
  try {
    const res = await fetch(`${GH_API}/repos/${repoFullName}/issues/${issueNumber}`, {
      headers: GH_HEADERS,
      signal: AbortSignal.timeout(1e4)
    });
    if (!res.ok) return null;
    const issue = await res.json();
    const state = issue.state === "open" ? "open" : issue.state === "closed" ? "closed" : null;
    return { state, title: typeof issue.title === "string" ? issue.title : null };
  } catch {
    return null;
  }
}
async function pollPR(prUrl) {
  const p = parseGitHubUrl(prUrl);
  if (!p) return null;
  try {
    const res = await fetch(`${GH_API}/repos/${p.repoFullName}/pulls/${p.number}`, {
      headers: GH_HEADERS,
      signal: AbortSignal.timeout(1e4)
    });
    if (!res.ok) return null;
    const pr = await res.json();
    return { merged: pr.merged === true, state: pr.state };
  } catch {
    return null;
  }
}
function fmtAmount(a) {
  return a != null ? "$" + a.toLocaleString() : "$\u2014";
}
function printMetric(rate) {
  const pct = Math.round(rate.rate * 100);
  console.log(`
\u{1F4CA} Accepted-PR rate: ${rate.merged}/${rate.total} claims merged (${pct}%)`);
}
async function resolveBounty(arg) {
  let bountyId, title, repoFullName, issueUrl, amountUSD;
  const job = findBountyInCache(arg);
  if (job) {
    const b = job.bounty ?? {};
    bountyId = job.id;
    title = job.title;
    repoFullName = b.repoFullName ?? job.company ?? "";
    issueUrl = b.claimUrl ?? job.url ?? "";
    amountUSD = b.amountUSD ?? null;
  } else {
    const parsed = parseGitHubUrl(arg);
    if (!parsed) return null;
    bountyId = `gh:${parsed.repoFullName}#${parsed.number}`;
    title = `${parsed.repoFullName}#${parsed.number}`;
    repoFullName = parsed.repoFullName;
    issueUrl = arg;
    amountUSD = null;
  }
  const ghIssue = parseGitHubUrl(issueUrl);
  const [issue, openPRs] = ghIssue ? await Promise.all([
    fetchIssue(repoFullName, ghIssue.number),
    countOpenPRsReferencingIssue(repoFullName, ghIssue.number)
  ]) : [null, null];
  const issueState = issue ? issue.state : null;
  if (!job && issue && issue.title) title = issue.title;
  return {
    bountyId,
    title,
    repoFullName,
    issueUrl,
    amountUSD,
    issueState,
    openPRs,
    issueNumber: ghIssue ? ghIssue.number : null
  };
}
async function cmdRecord(arg) {
  const claims = await Promise.resolve().then(() => (init_claims(), claims_exports));
  if (!arg) {
    console.error("Usage: terminalhire claim record <bountyId|issueUrl>");
    console.error("  Run `terminalhire bounties` first to populate the local index cache,");
    console.error("  then pass the id shown in its output \u2014 or pass a GitHub issue URL directly.");
    process.exit(1);
  }
  const b = await resolveBounty(arg);
  if (!b) {
    console.error(`terminalhire claim: '${arg}' is not in the index cache and is not a GitHub issue URL.`);
    console.error("  Run `terminalhire bounties` to populate the cache, or pass a full issue URL.");
    process.exit(1);
  }
  if (b.issueState === "closed") {
    console.error(
      `terminalhire claim: ${b.repoFullName}#${b.issueNumber} is CLOSED \u2014 not claimable.
  The bounty index drops closed issues; this one is likely a stale cache entry.
  Run \`terminalhire bounties\` for the current open pool.`
    );
    process.exit(1);
  }
  let claim;
  try {
    claim = claims.recordClaim({ id: b.bountyId, bountyId: b.bountyId, title: b.title, repoFullName: b.repoFullName, issueUrl: b.issueUrl, amountUSD: b.amountUSD, openPRsAtClaim: b.openPRs });
  } catch (err) {
    console.error(`terminalhire claim: ${err.message ?? err}`);
    process.exit(1);
  }
  console.log(`
\u2713 Claimed: ${claim.title}`);
  console.log(`  id:     ${claim.id}`);
  console.log(`  repo:   ${claim.repoFullName}`);
  console.log(`  amount: ${fmtAmount(claim.amountUSD)}`);
  console.log(`  issue:  ${claim.issueUrl}`);
  if (b.openPRs == null) {
    console.log("  open PRs: unknown (GitHub read unavailable \u2014 check the issue manually before working)");
  } else if (b.openPRs > 0) {
    console.log(`  \u26A0 open PRs referencing this issue: ${b.openPRs} \u2014 someone may already be on it. Check before working.`);
  } else {
    console.log("  open PRs referencing this issue: 0");
  }
  console.log("\n  Executor constraints (enforce when spawning the background agent):");
  console.log("   \u2022 work in an ISOLATED git worktree; scrub the subprocess env (no token/profile inheritance)");
  console.log("   \u2022 MUST NOT `git push` or `gh pr` \u2014 pushing happens only via `terminalhire submit`");
  console.log("   \u2022 clone + static analysis + patch only; NO test/build execution without explicit approval");
  console.log("   \u2022 no access to ~/.terminalhire (the executor never needs your profile)");
  console.log("\n  Next:");
  console.log("   1. record the worktree:  terminalhire claim attach " + claim.id + " --worktree <path> --branch <branch>");
  console.log("   2. do the work + review, then mark it cleared:  terminalhire claim update " + claim.id + " ready");
  console.log("   3. publish (pushes to your fork + opens the PR):  terminalhire claim submit " + claim.id);
}
async function cmdPreview(arg, { json } = {}) {
  if (!arg) {
    console.error("Usage: terminalhire claim preview <bountyId|issueUrl> [--json]");
    process.exit(1);
  }
  const b = await resolveBounty(arg);
  if (!b) {
    console.error(`terminalhire claim: '${arg}' is not in the index cache and is not a GitHub issue URL.`);
    console.error("  Run `terminalhire bounties` to populate the cache, or pass a full issue URL.");
    process.exit(1);
  }
  if (json) {
    process.stdout.write(
      JSON.stringify({
        bountyId: b.bountyId,
        title: b.title,
        amountUSD: b.amountUSD,
        repoFullName: b.repoFullName,
        issueUrl: b.issueUrl,
        issueState: b.issueState,
        openPRs: b.openPRs
      }) + "\n"
    );
    return;
  }
  console.log(`
  BOUNTY \xB7 ${b.title}`);
  console.log(`  id:     ${b.bountyId}`);
  console.log(`  repo:   ${b.repoFullName}`);
  console.log(`  amount: ${fmtAmount(b.amountUSD)}`);
  console.log(`  issue:  ${b.issueUrl}`);
  if (b.issueState === "closed") {
    console.log("  \u2717 CLOSED \u2014 not claimable (the pool drops closed issues; likely a stale cache entry)");
  }
  if (b.openPRs == null) {
    console.log("  open PRs: unknown (GitHub read unavailable \u2014 check the issue manually before working)");
  } else if (b.openPRs > 0) {
    console.log(`  \u26A0 open PRs referencing this issue: ${b.openPRs} \u2014 someone may already be on it. Check before working.`);
  } else {
    console.log("  open PRs referencing this issue: 0");
  }
  console.log("\n  Preview only \u2014 NOT claimed. Run `terminalhire claim record " + arg + "` to claim it.");
}
async function cmdList(active) {
  const claims = await Promise.resolve().then(() => (init_claims(), claims_exports));
  const list = claims.listClaims({ active });
  if (list.length === 0) {
    console.log(active ? "No active claims." : "No claims yet. Use `terminalhire claim record <bountyId>`.");
    return;
  }
  console.log(`
${list.length} ${active ? "active " : ""}claim${list.length === 1 ? "" : "s"}:
`);
  for (const c of list) {
    const pr = c.prUrl ? ` \xB7 ${c.prUrl}` : "";
    console.log(`  [${c.state}] ${fmtAmount(c.amountUSD)} \xB7 ${c.title}`);
    console.log(`    id: ${c.id}${pr}`);
  }
  printMetric(claims.acceptedPRRate());
}
async function cmdStatus(id) {
  const claims = await Promise.resolve().then(() => (init_claims(), claims_exports));
  const targets = id ? [claims.findClaim(id)].filter(Boolean) : claims.listClaims();
  if (targets.length === 0) {
    console.log(id ? `No claim with id '${id}'.` : "No claims to poll.");
    return;
  }
  let polled = 0;
  for (const c of targets) {
    if (!c.prUrl) continue;
    const res = await pollPR(c.prUrl);
    if (!res) {
      console.log(`  ? ${c.title} \u2014 could not read PR state (${c.prUrl})`);
      continue;
    }
    polled++;
    let next = c.state;
    if (res.merged) next = "merged";
    else if (res.state === "closed") next = "abandoned";
    else next = "submitted";
    const ORDER = ["claimed", "working", "in-review", "ready", "submitted", "merged", "abandoned"];
    if (next !== c.state && ORDER.indexOf(next) > ORDER.indexOf(c.state)) {
      claims.updateClaim(c.id, { state: next });
    }
    const mark = res.merged ? "\u2713 merged" : res.state === "closed" ? "\u2717 closed (unmerged)" : "\u2026 open";
    console.log(`  ${mark} \u2014 ${c.title}  (${c.prUrl})`);
  }
  if (polled === 0) console.log("  No submitted claims with a PR URL yet. Set one via `claim update <id> submitted` after `submit`.");
  printMetric(claims.acceptedPRRate());
}
async function cmdUpdate(id, state, prUrl) {
  const claims = await Promise.resolve().then(() => (init_claims(), claims_exports));
  const VALID = ["claimed", "working", "in-review", "ready", "submitted", "merged", "abandoned"];
  if (!id || !state || !VALID.includes(state)) {
    console.error("Usage: terminalhire claim update <id> <state> [prUrl]");
    console.error("  state: " + VALID.join(" | "));
    console.error("  prUrl: attach the source PR URL (so `claim status` can poll its merge state)");
    process.exit(1);
  }
  const patch = { state };
  if (prUrl) {
    if (!parseGitHubUrl(prUrl)) {
      console.error(`terminalhire claim: '${prUrl}' is not a GitHub PR URL.`);
      process.exit(1);
    }
    patch.prUrl = prUrl;
  }
  const updated = claims.updateClaim(id, patch);
  if (!updated) {
    console.error(`terminalhire claim: no claim with id '${id}'.`);
    process.exit(1);
  }
  console.log(`Updated ${id} \u2192 ${state}${prUrl ? ` (PR: ${prUrl})` : ""}`);
}
async function cmdRelease(id) {
  const claims = await Promise.resolve().then(() => (init_claims(), claims_exports));
  if (!id) {
    console.error("Usage: terminalhire claim release <id>");
    process.exit(1);
  }
  const removed = claims.removeClaim(id);
  console.log(removed ? `Released claim: ${id}` : `terminalhire claim: no claim with id '${id}'.`);
  if (!removed) process.exit(1);
}
async function cmdAttach(id, worktree, branch) {
  const claims = await Promise.resolve().then(() => (init_claims(), claims_exports));
  if (!id || !worktree || !branch) {
    console.error("Usage: terminalhire claim attach <id> --worktree <path> --branch <branchName>");
    console.error("  Records the worktree + branch so `terminalhire claim submit` can verify identity before pushing.");
    process.exit(1);
  }
  if (!claims.findClaim(id)) {
    console.error(`terminalhire claim: no claim with id '${id}'.`);
    process.exit(1);
  }
  let toplevel;
  try {
    toplevel = await sh("git", ["-C", worktree, "rev-parse", "--show-toplevel"]);
  } catch {
    console.error(`terminalhire claim: '${worktree}' is not a git work tree.`);
    process.exit(1);
  }
  claims.updateClaim(id, { worktreePath: toplevel, branch });
  console.log(`Attached ${id}: worktree=${toplevel} branch=${branch}`);
}
async function cmdSubmit(id, worktreeOverride) {
  const claims = await Promise.resolve().then(() => (init_claims(), claims_exports));
  if (!id) {
    console.error("Usage: terminalhire claim submit <id> [--worktree <path>]");
    process.exit(1);
  }
  const claim = claims.findClaim(id);
  if (!claim) {
    console.error(`terminalhire claim: no claim with id '${id}'.`);
    process.exit(1);
  }
  if (claim.state !== "ready") {
    console.error(
      `terminalhire claim: ${id} is '${claim.state}', not 'ready'. Submit only runs after the review gate clears it:
  terminalhire claim update ${id} ready`
    );
    process.exit(1);
  }
  if (claim.review && claim.review.verdict === "revise") {
    console.error(`terminalhire claim: ${id} review verdict is 'revise' \u2014 the gate said do not submit. Resolve blockers and re-review first.`);
    process.exit(1);
  }
  if (!claim.worktreePath || !claim.branch) {
    console.error(
      `terminalhire claim: ${id} has no recorded worktree/branch \u2014 cannot verify what to push. Run:
  terminalhire claim attach ${id} --worktree <path> --branch <branch>`
    );
    process.exit(1);
  }
  const inspectDir = worktreeOverride || process.cwd();
  let toplevel;
  try {
    toplevel = await sh("git", ["-C", inspectDir, "rev-parse", "--show-toplevel"]);
  } catch {
    console.error(
      `terminalhire claim: '${inspectDir}' is not a git work tree.
  Run submit from inside the claim's worktree (or pass --worktree <path>).`
    );
    process.exit(1);
  }
  if (toplevel !== claim.worktreePath) {
    console.error(
      `terminalhire claim: worktree mismatch \u2014 refusing to push.
  expected: ${claim.worktreePath}
  found:    ${toplevel}
  Run submit from inside the claim's worktree (or pass --worktree <path>).`
    );
    process.exit(1);
  }
  const wt = toplevel;
  const curBranch = await sh("git", ["-C", wt, "rev-parse", "--abbrev-ref", "HEAD"]);
  if (curBranch !== claim.branch) {
    console.error(
      `terminalhire claim: branch mismatch \u2014 refusing to push.
  expected: ${claim.branch}
  found:    ${curBranch}
  Check out the claim's branch first.`
    );
    process.exit(1);
  }
  let defaultBranch = null;
  try {
    defaultBranch = (await sh("git", ["-C", wt, "symbolic-ref", "--short", "refs/remotes/origin/HEAD"])).replace(/^origin\//, "");
  } catch {
  }
  if (defaultBranch && claim.branch === defaultBranch) {
    console.error(`terminalhire claim: '${claim.branch}' is the default branch \u2014 open the PR from a feature branch.`);
    process.exit(1);
  }
  if (defaultBranch) {
    let ahead = "0";
    try {
      ahead = await sh("git", ["-C", wt, "rev-list", "--count", `origin/${defaultBranch}..HEAD`]);
    } catch {
      ahead = "1";
    }
    if (ahead === "0") {
      console.error(`terminalhire claim: branch has no commits ahead of origin/${defaultBranch} \u2014 nothing to submit.`);
      process.exit(1);
    }
  }
  const dirty = await sh("git", ["-C", wt, "status", "--porcelain"]);
  if (dirty) {
    console.error("terminalhire claim: working tree is not clean \u2014 commit or stash before submitting (submit pushes what was reviewed).");
    process.exit(1);
  }
  let originUrl;
  try {
    originUrl = await sh("git", ["-C", wt, "remote", "get-url", "origin"]);
  } catch {
    console.error("terminalhire claim: no 'origin' remote in the worktree.");
    process.exit(1);
  }
  const originRepo = parseRepoFromRemote(originUrl);
  if (!originRepo) {
    console.error(`terminalhire claim: could not parse owner/repo from origin (${originUrl}).`);
    process.exit(1);
  }
  if (originRepo.toLowerCase() === claim.repoFullName.toLowerCase()) {
    console.error(
      `terminalhire claim: origin points at the UPSTREAM bounty repo (${claim.repoFullName}), not a fork.
  Pushing would create a branch directly on the target repo. Fork first:
    gh repo fork ${claim.repoFullName} --clone=false
  set your fork as 'origin' (or push it there), then retry.`
    );
    process.exit(1);
  }
  let ghUser;
  try {
    ghUser = await sh("gh", ["api", "user", "-q", ".login"]);
  } catch {
    console.error("terminalhire claim: 'gh' CLI not available or not authenticated. Run 'gh auth login'.");
    process.exit(1);
  }
  const upstream = claim.repoFullName;
  const head = `${ghUser}:${claim.branch}`;
  console.log(`
  SUBMIT \xB7 ${claim.title}`);
  console.log(`  upstream: ${upstream}`);
  console.log(`  fork:     ${originRepo}`);
  console.log(`  branch:   ${claim.branch}`);
  console.log(`  head:     ${head}`);
  console.log(`  issue:    ${claim.issueUrl}`);
  const ok = await confirm(`
  Push '${claim.branch}' to ${originRepo} and open a PR against ${upstream}? (y/N) `);
  if (!ok) {
    console.log("Aborted \u2014 nothing pushed.");
    return;
  }
  try {
    await sh("git", ["-C", wt, "push", "origin", claim.branch]);
  } catch (err) {
    console.error(`terminalhire claim: git push failed (NOT force-pushed). ${err.stderr || err.message || err}`);
    console.error(`  Resolve and retry, or open the PR manually then: terminalhire claim update ${id} submitted <prUrl>`);
    process.exit(1);
  }
  let prUrl = null;
  try {
    const existing = await sh("gh", ["pr", "list", "--repo", upstream, "--head", head, "--state", "open", "--json", "url", "-q", ".[0].url // empty"]);
    if (existing) prUrl = existing;
  } catch {
  }
  if (!prUrl) {
    const issueNum = (parseGitHubUrl(claim.issueUrl) || {}).number;
    const body = issueNum ? `Closes #${issueNum}` : "";
    try {
      const out = await sh("gh", ["pr", "create", "--repo", upstream, "--head", head, "--title", claim.title, "--body", body]);
      prUrl = out.split("\n").map((l) => l.trim()).filter((l) => l.startsWith("https://github.com/")).pop() || null;
    } catch (err) {
      console.error(`terminalhire claim: branch pushed, but 'gh pr create' failed. ${err.stderr || err.message || err}`);
      console.error(`  Open the PR manually (gh pr create / web UI), then: terminalhire claim update ${id} submitted <prUrl>`);
      process.exit(1);
    }
  }
  if (!prUrl || !parseGitHubUrl(prUrl)) {
    console.error(`terminalhire claim: could not determine the PR URL. Set it manually: terminalhire claim update ${id} submitted <prUrl>`);
    process.exit(1);
  }
  claims.updateClaim(id, { state: "submitted", prUrl });
  console.log(`
\u2713 Submitted ${id} \u2192 ${prUrl}`);
  console.log(`  Run 'terminalhire claim status ${id}' after the maintainer acts to fold the merge into your accepted-PR rate.`);
}
async function run() {
  const verb = process.argv[2];
  const { flags, positional } = parseArgs(process.argv.slice(3));
  const active = Boolean(flags.active);
  const json = Boolean(flags.json);
  try {
    switch (verb) {
      case "preview":
        await cmdPreview(positional[0], { json });
        break;
      case "record":
        await cmdRecord(positional[0]);
        break;
      case "list":
        await cmdList(active);
        break;
      case "status":
        await cmdStatus(positional[0]);
        break;
      case "update":
        await cmdUpdate(positional[0], positional[1], positional[2]);
        break;
      case "attach":
        await cmdAttach(positional[0], flags.worktree, flags.branch);
        break;
      case "submit":
        await cmdSubmit(positional[0], flags.worktree);
        break;
      case "release":
        await cmdRelease(positional[0]);
        break;
      default:
        console.error(`terminalhire claim: unknown verb '${verb ?? ""}'. Expected: preview | record | attach | list | status | update | submit | release`);
        process.exit(1);
    }
  } catch (err) {
    console.error("terminalhire claim error:", err.message ?? err);
    process.exit(1);
  }
}
export {
  run
};
