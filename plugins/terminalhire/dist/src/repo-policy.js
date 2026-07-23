// src/repo-policy.ts
import { createHash } from "crypto";
var GH_API = "https://api.github.com";
var GH_HEADERS = { "User-Agent": "terminalhire-claim", Accept: "application/vnd.github+json" };
var MAX_REQUESTS = 7;
var POLICY_RULESET_VERSION = 2;
var AI_SIGNAL_PATTERNS = [
  { label: "AI", re: /\bAI\b/i },
  { label: "artificial intelligence", re: /artificial intelligence/i },
  { label: "LLM", re: /\bLLMs?\b/i },
  { label: "language model", re: /language model/i },
  { label: "Copilot", re: /\bcopilot\b/i },
  { label: "ChatGPT", re: /\bchatgpt\b/i },
  { label: "Claude", re: /\bclaude\b/i },
  { label: "generative", re: /\bgenerative\b/i },
  { label: "machine-generated", re: /machine[\s-]generated/i }
];
var AI_TERM = "(?:ai|llms?|generative(?:\\s+ai)?|artificial intelligence|language models?|copilot|chatgpt|claude|machine[\\s-]generated)";
var PROHIBITED_PATTERNS = [
  new RegExp(`prohibit\\w*[^.\\n]{0,60}\\b${AI_TERM}`, "i"),
  /did not write the code yourself/i,
  new RegExp(`(?:not|never|don'?t|won'?t)\\s+accept\\w*[^.\\n]{0,60}\\b${AI_TERM}`, "i"),
  new RegExp(
    `\\bno\\s+${AI_TERM}[^.\\n]{0,40}\\b(?:prs?|pull requests?|contributions?|code|patch(?:es)?|commits?|submissions?)\\b`,
    "i"
  ),
  new RegExp(
    `\\b${AI_TERM}[^.\\n]{0,60}\\b(?:is|are|will be)\\s+(?:\\w+\\s+)?(?:not accepted|not allowed|banned|rejected|removed|closed|reverted|prohibited|forbidden)`,
    "i"
  )
];
var DISCLOSURE_PATTERNS = [
  new RegExp(`disclos\\w+[^.\\n]{0,60}\\b${AI_TERM}`, "i"),
  new RegExp(`\\b${AI_TERM}[^.\\n]{0,60}disclos`, "i"),
  new RegExp(`\\b${AI_TERM}[\\s-]assist\\w*[^.\\n]{0,60}\\b(?:must|should|required?)\\b`, "i"),
  // PR-template checkbox, e.g. "- [ ] I used AI tools and have reviewed the output"
  new RegExp(`\\[ \\][^\\n]{0,80}\\b${AI_TERM}`, "i")
];
var REQUIREMENT_PATTERNS = [
  // `/take` bot first: its docs usually also say "assign", and the bot is the
  // more specific expectation (post exactly `/take`, not a prose request).
  { kind: "take-bot", re: /(?:^|[\s`"'(])\/take\b/m },
  { kind: "assignment-required", re: /(?:request|ask|wait)[^.\n]{0,40}\bassign/i },
  { kind: "assignment-required", re: /\bassigned before\b/i },
  { kind: "assignment-required", re: /\bself[\s-]assign/i },
  {
    kind: "assignment-required",
    re: /do not (?:open|submit)[^.\n]{0,40}\b(?:prs?|pull requests?)\b/i
  },
  { kind: "cla-required", re: /\bCLA\b/ },
  { kind: "cla-required", re: /contributor licen[cs]e agreement/i },
  { kind: "discussion-first", re: /open an issue (?:first|before)/i },
  { kind: "discussion-first", re: /discuss\w*[^.\n]{0,40}\bbefore\b/i }
];
var CANDIDATE_GROUPS = [
  ["CONTRIBUTING.md", ".github/CONTRIBUTING.md", "docs/CONTRIBUTING.md"],
  ["AGENTS.md", "AGENTS.MD"],
  [".github/PULL_REQUEST_TEMPLATE.md", "PULL_REQUEST_TEMPLATE.md"]
];
async function fetchContentsFile(fetchImpl, repoFullName, path) {
  try {
    const res = await fetchImpl(`${GH_API}/repos/${repoFullName}/contents/${path}`, {
      headers: GH_HEADERS,
      signal: AbortSignal.timeout(1e4)
    });
    if (res.status === 404) return { ok: true, missing: true, content: null };
    if (res.status === 403 && res.headers.get("x-ratelimit-remaining") === "0") {
      return { ok: false, missing: false, content: null };
    }
    if (!res.ok) return { ok: false, missing: false, content: null };
    const body = await res.json();
    if (typeof body.content !== "string") return { ok: false, missing: false, content: null };
    if (body.encoding !== "base64") return { ok: false, missing: false, content: null };
    const raw = Buffer.from(body.content.replace(/\n/g, ""), "base64");
    if (typeof body.size === "number" && raw.length !== body.size) {
      return { ok: false, missing: false, content: null };
    }
    return { ok: true, missing: false, content: raw.toString("utf8") };
  } catch {
    return { ok: false, missing: false, content: null };
  }
}
function classifyLine(line) {
  if (PROHIBITED_PATTERNS.some((re) => re.test(line))) return "prohibited";
  if (DISCLOSURE_PATTERNS.some((re) => re.test(line))) return "disclosure-required";
  if (AI_SIGNAL_PATTERNS.some((p) => p.re.test(line))) return "ai-mentioned";
  return null;
}
var VERDICT_SEVERITY = {
  "ai-mentioned": 1,
  "disclosure-required": 2,
  prohibited: 3
};
function sanitizeExcerpt(text) {
  return text.replace(/[\x00-\x08\x0B-\x1F\x7F-\x9F]/g, "");
}
function excerptAround(lines, i) {
  const start = Math.max(0, i - 2);
  const end = Math.min(lines.length, i + 3);
  return sanitizeExcerpt(lines.slice(start, end).join("\n"));
}
function hashFiles(files) {
  if (files.length === 0) return null;
  const h = createHash("sha256");
  for (const { file, content } of files) h.update(`${file}
${content}
`);
  return h.digest("hex");
}
function auditContent(files) {
  const hits = [];
  const requirements = [];
  const seenKinds = /* @__PURE__ */ new Set();
  for (const { file, content } of files) {
    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const rule = classifyLine(lines[i]);
      if (rule) hits.push({ file, excerpt: excerptAround(lines, i), rule });
      for (const { kind, re } of REQUIREMENT_PATTERNS) {
        if (seenKinds.has(kind) || !re.test(lines[i])) continue;
        seenKinds.add(kind);
        requirements.push({ kind, file, excerpt: excerptAround(lines, i) });
      }
    }
  }
  let verdict = "clean";
  for (const h of hits) {
    if (verdict === "clean" || VERDICT_SEVERITY[h.rule] > VERDICT_SEVERITY[verdict]) {
      verdict = h.rule;
    }
  }
  const assignment = seenKinds.has("take-bot") ? "take-bot" : seenKinds.has("assignment-required") ? "required" : "none";
  return { hits, requirements, verdict, assignment };
}
async function checkRepoPolicy(repoFullName, opts = {}) {
  const fetchImpl = opts.fetchImpl ?? globalThis.fetch;
  let requestsUsed = 0;
  let hadError = false;
  let truncated = false;
  const files = [];
  outer: for (const group of CANDIDATE_GROUPS) {
    for (const path of group) {
      if (requestsUsed >= MAX_REQUESTS) {
        truncated = true;
        break outer;
      }
      requestsUsed++;
      const outcome = await fetchContentsFile(fetchImpl, repoFullName, path);
      if (!outcome.ok) {
        hadError = true;
        continue;
      }
      if (outcome.missing) continue;
      if (outcome.content) files.push({ file: path, content: outcome.content });
    }
  }
  const { hits, requirements, verdict, assignment } = auditContent(files);
  const scanComplete = !hadError && !truncated;
  if (hits.length > 0) {
    return {
      status: "flagged",
      verdict,
      hits,
      requirements,
      assignment,
      rulesetVersion: POLICY_RULESET_VERSION,
      contentHash: hashFiles(files),
      scanComplete
    };
  }
  if (hadError) {
    return {
      status: "unavailable",
      verdict: "unavailable",
      hits: [],
      requirements,
      assignment,
      rulesetVersion: POLICY_RULESET_VERSION,
      contentHash: hashFiles(files),
      scanComplete
    };
  }
  return {
    status: "clean",
    verdict: "clean",
    hits: [],
    requirements,
    assignment,
    rulesetVersion: POLICY_RULESET_VERSION,
    contentHash: hashFiles(files),
    scanComplete
  };
}
export {
  POLICY_RULESET_VERSION,
  auditContent,
  checkRepoPolicy
};
