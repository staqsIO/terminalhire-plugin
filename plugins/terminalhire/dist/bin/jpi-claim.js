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
var TERMINALHIRE_DIR2 = join2(homedir2(), ".terminalhire");
var INDEX_CACHE_FILE = join2(TERMINALHIRE_DIR2, "index-cache.json");
var GH_API = "https://api.github.com";
var GH_HEADERS = { "User-Agent": "terminalhire-claim", Accept: "application/vnd.github+json" };
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
async function fetchIssueState(repoFullName, issueNumber) {
  try {
    const res = await fetch(`${GH_API}/repos/${repoFullName}/issues/${issueNumber}`, {
      headers: GH_HEADERS,
      signal: AbortSignal.timeout(1e4)
    });
    if (!res.ok) return null;
    const issue = await res.json();
    return issue.state === "open" ? "open" : issue.state === "closed" ? "closed" : null;
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
async function cmdRecord(arg) {
  const claims = await Promise.resolve().then(() => (init_claims(), claims_exports));
  if (!arg) {
    console.error("Usage: terminalhire claim record <bountyId|issueUrl>");
    console.error("  Run `terminalhire bounties` first to populate the local index cache,");
    console.error("  then pass the id shown in its output \u2014 or pass a GitHub issue URL directly.");
    process.exit(1);
  }
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
    if (!parsed) {
      console.error(`terminalhire claim: '${arg}' is not in the index cache and is not a GitHub issue URL.`);
      console.error("  Run `terminalhire bounties` to populate the cache, or pass a full issue URL.");
      process.exit(1);
    }
    bountyId = `gh:${parsed.repoFullName}#${parsed.number}`;
    title = `${parsed.repoFullName}#${parsed.number}`;
    repoFullName = parsed.repoFullName;
    issueUrl = arg;
    amountUSD = null;
  }
  const ghIssue = parseGitHubUrl(issueUrl);
  const [issueState, openPRs] = ghIssue ? await Promise.all([
    fetchIssueState(repoFullName, ghIssue.number),
    countOpenPRsReferencingIssue(repoFullName, ghIssue.number)
    // Guardrail #5
  ]) : [null, null];
  if (issueState === "closed") {
    console.error(
      `terminalhire claim: ${repoFullName}#${ghIssue.number} is CLOSED \u2014 not claimable.
  The bounty index drops closed issues; this one is likely a stale cache entry.
  Run \`terminalhire bounties\` for the current open pool.`
    );
    process.exit(1);
  }
  let claim;
  try {
    claim = claims.recordClaim({ id: bountyId, bountyId, title, repoFullName, issueUrl, amountUSD, openPRsAtClaim: openPRs });
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
  if (openPRs == null) {
    console.log("  open PRs: unknown (GitHub read unavailable \u2014 check the issue manually before working)");
  } else if (openPRs > 0) {
    console.log(`  \u26A0 open PRs referencing this issue: ${openPRs} \u2014 someone may already be on it. Check before working.`);
  } else {
    console.log("  open PRs referencing this issue: 0");
  }
  console.log("\n  Executor constraints (enforce when spawning the background agent):");
  console.log("   \u2022 work in an ISOLATED git worktree; scrub the subprocess env (no token/profile inheritance)");
  console.log("   \u2022 MUST NOT `git push` or `gh pr` \u2014 pushing happens only via `terminalhire submit`");
  console.log("   \u2022 clone + static analysis + patch only; NO test/build execution without explicit approval");
  console.log("   \u2022 no access to ~/.terminalhire (the executor never needs your profile)");
  console.log("\n  Next: do the work, then `terminalhire claim update " + claim.id + " <state>` as you progress.");
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
async function run() {
  const verb = process.argv[2];
  const rest = process.argv.slice(3).filter((a) => !a.startsWith("--"));
  const active = process.argv.includes("--active");
  try {
    switch (verb) {
      case "record":
        await cmdRecord(rest[0]);
        break;
      case "list":
        await cmdList(active);
        break;
      case "status":
        await cmdStatus(rest[0]);
        break;
      case "update":
        await cmdUpdate(rest[0], rest[1], rest[2]);
        break;
      case "release":
        await cmdRelease(rest[0]);
        break;
      default:
        console.error(`terminalhire claim: unknown verb '${verb ?? ""}'. Expected: record | list | status | update | release`);
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
