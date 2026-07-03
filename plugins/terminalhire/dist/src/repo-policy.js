// src/repo-policy.ts
var GH_API = "https://api.github.com";
var GH_HEADERS = { "User-Agent": "terminalhire-claim", Accept: "application/vnd.github+json" };
var MAX_REQUESTS = 4;
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
var CANDIDATE_GROUPS = [
  ["CONTRIBUTING.md", ".github/CONTRIBUTING.md", "docs/CONTRIBUTING.md"],
  [".github/PULL_REQUEST_TEMPLATE.md", "PULL_REQUEST_TEMPLATE.md"],
  ["AGENTS.md"]
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
    const decoded = Buffer.from(body.content.replace(/\n/g, ""), "base64").toString("utf8");
    return { ok: true, missing: false, content: decoded };
  } catch {
    return { ok: false, missing: false, content: null };
  }
}
function findHits(file, content) {
  const lines = content.split("\n");
  const hits = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!AI_SIGNAL_PATTERNS.some((p) => p.re.test(line))) continue;
    const start = Math.max(0, i - 2);
    const end = Math.min(lines.length, i + 3);
    hits.push({ file, excerpt: lines.slice(start, end).join("\n") });
  }
  return hits;
}
async function checkRepoPolicy(repoFullName, opts = {}) {
  const fetchImpl = opts.fetchImpl ?? globalThis.fetch;
  let requestsUsed = 0;
  let hadError = false;
  const hits = [];
  outer: for (const group of CANDIDATE_GROUPS) {
    for (const path of group) {
      if (requestsUsed >= MAX_REQUESTS) break outer;
      requestsUsed++;
      const outcome = await fetchContentsFile(fetchImpl, repoFullName, path);
      if (!outcome.ok) {
        hadError = true;
        continue;
      }
      if (outcome.missing) continue;
      if (outcome.content) hits.push(...findHits(path, outcome.content));
      break;
    }
  }
  if (hits.length > 0) return { status: "flagged", hits };
  if (hadError) return { status: "unavailable", hits: [] };
  return { status: "clean", hits: [] };
}
export {
  checkRepoPolicy
};
