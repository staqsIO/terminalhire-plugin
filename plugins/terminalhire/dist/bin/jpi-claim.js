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
import { readFileSync as readFileSync2, writeFileSync, mkdirSync, renameSync, existsSync } from "fs";
import { join as join2 } from "path";
import { homedir } from "os";
function nowISO() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function normalizeClaim(c) {
  return { ...c, kind: c.kind ?? "bounty", policy: c.policy ?? null };
}
function readClaims() {
  try {
    if (!existsSync(CLAIMS_FILE)) return [];
    const data = JSON.parse(readFileSync2(CLAIMS_FILE, "utf8"));
    const claims = Array.isArray(data?.claims) ? data.claims : [];
    return claims.map(normalizeClaim);
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
    // Defensive default (mirrors normalizeClaim's `kind ?? 'bounty'` pattern):
    // a caller written before `policy` existed, or a plain-JS caller that skips
    // it, still produces a valid record instead of `policy: undefined`.
    policy: rec.policy ?? null,
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
    TERMINALHIRE_DIR = join2(homedir(), ".terminalhire");
    CLAIMS_FILE = join2(TERMINALHIRE_DIR, "claims.json");
    TERMINAL_STATES = /* @__PURE__ */ new Set(["merged", "abandoned"]);
  }
});

// src/repo-policy.ts
var repo_policy_exports = {};
__export(repo_policy_exports, {
  checkRepoPolicy: () => checkRepoPolicy
});
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
var GH_API, GH_HEADERS, MAX_REQUESTS, AI_SIGNAL_PATTERNS, CANDIDATE_GROUPS;
var init_repo_policy = __esm({
  "src/repo-policy.ts"() {
    "use strict";
    GH_API = "https://api.github.com";
    GH_HEADERS = { "User-Agent": "terminalhire-claim", Accept: "application/vnd.github+json" };
    MAX_REQUESTS = 4;
    AI_SIGNAL_PATTERNS = [
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
    CANDIDATE_GROUPS = [
      ["CONTRIBUTING.md", ".github/CONTRIBUTING.md", "docs/CONTRIBUTING.md"],
      [".github/PULL_REQUEST_TEMPLATE.md", "PULL_REQUEST_TEMPLATE.md"],
      ["AGENTS.md"]
    ];
  }
});

// bin/jpi-claim.js
import { readFileSync as readFileSync3, existsSync as existsSync2 } from "fs";
import { join as join3 } from "path";
import { homedir as homedir2 } from "os";
import { execFile } from "child_process";
import { promisify } from "util";
import { createInterface } from "readline";

// ../../packages/core/src/vocab/graph.data.ts
var VOCAB_NODES = [
  // ── Languages ─────────────────────────────────────────────────────────────
  { id: "javascript", synonyms: ["js"], related: [{ to: "typescript", w: 0.6 }] },
  { id: "typescript", parents: ["javascript"], synonyms: ["ts"] },
  { id: "python", synonyms: ["py"] },
  { id: "go", synonyms: ["golang"] },
  { id: "rust" },
  { id: "java", related: [{ to: "kotlin", w: 0.45 }, { to: "scala", w: 0.4 }] },
  { id: "ruby" },
  { id: "elixir" },
  { id: "scala", related: [{ to: "java", w: 0.4 }] },
  { id: "kotlin", related: [{ to: "java", w: 0.45 }] },
  { id: "swift" },
  { id: "cpp", synonyms: ["c++"] },
  { id: "csharp", synonyms: ["c#"] },
  { id: "php" },
  { id: "haskell" },
  { id: "clojure" },
  { id: "r" },
  { id: "dart" },
  // ── Frontend ──────────────────────────────────────────────────────────────
  {
    id: "react",
    parents: ["javascript"],
    synonyms: ["reactjs"],
    related: [{ to: "nextjs", w: 0.55 }, { to: "vue", w: 0.4 }, { to: "svelte", w: 0.4 }, { to: "solidjs", w: 0.5 }, { to: "angular", w: 0.35 }]
  },
  { id: "nextjs", parents: ["react"], synonyms: ["next", "next.js"], related: [{ to: "remix", w: 0.5 }] },
  { id: "vue", parents: ["javascript"], synonyms: ["vue.js"], related: [{ to: "nuxt", w: 0.6 }] },
  { id: "nuxt", parents: ["vue"], synonyms: ["nuxt.js"] },
  { id: "svelte", parents: ["javascript"], related: [{ to: "sveltekit", w: 0.65 }] },
  { id: "sveltekit", parents: ["svelte"] },
  { id: "angular", parents: ["typescript"], synonyms: ["angular.js", "angularjs"] },
  { id: "solidjs", parents: ["javascript"] },
  { id: "remix", parents: ["react"], synonyms: ["remix.run"] },
  { id: "astro", parents: ["javascript"], related: [{ to: "nextjs", w: 0.4 }] },
  { id: "qwik", parents: ["javascript"] },
  { id: "tailwind", parents: ["css"], synonyms: ["tailwindcss", "tw"] },
  { id: "css" },
  { id: "html" },
  { id: "redux", parents: ["react"] },
  { id: "vite", parents: ["frontend"] },
  { id: "webpack", parents: ["frontend"] },
  { id: "storybook", parents: ["frontend"] },
  // ── Backend frameworks / runtimes ───────────────────────────────────────────
  {
    id: "nodejs",
    parents: ["javascript"],
    synonyms: ["node", "node.js"],
    related: [{ to: "express", w: 0.5 }, { to: "fastify", w: 0.45 }, { to: "nestjs", w: 0.45 }]
  },
  { id: "express", parents: ["nodejs"], synonyms: ["express.js", "expressjs"], related: [{ to: "fastify", w: 0.5 }] },
  { id: "fastify", parents: ["nodejs"] },
  { id: "nestjs", parents: ["nodejs"], synonyms: ["nest", "nest.js"] },
  { id: "hono", parents: ["nodejs"] },
  { id: "deno", parents: ["javascript"], related: [{ to: "nodejs", w: 0.5 }, { to: "bun", w: 0.5 }] },
  { id: "bun", parents: ["javascript"], related: [{ to: "nodejs", w: 0.5 }] },
  { id: "django", parents: ["python"], related: [{ to: "flask", w: 0.5 }, { to: "fastapi", w: 0.45 }] },
  { id: "fastapi", parents: ["python"], related: [{ to: "flask", w: 0.55 }, { to: "django", w: 0.45 }] },
  { id: "flask", parents: ["python"] },
  { id: "rails", parents: ["ruby"], synonyms: ["ruby-on-rails", "ror"] },
  { id: "spring", parents: ["java"], synonyms: ["spring-boot", "springboot"] },
  { id: "actix", parents: ["rust"] },
  { id: "gin", parents: ["go"] },
  { id: "phoenix", parents: ["elixir"] },
  { id: "laravel", parents: ["php"] },
  { id: "dotnet", parents: ["csharp"], synonyms: [".net", "asp.net", "dotnet-core"] },
  // ── Infrastructure & DevOps ─────────────────────────────────────────────────
  { id: "kubernetes", synonyms: ["k8s", "kube"], related: [{ to: "docker", w: 0.5 }, { to: "helm", w: 0.55 }, { to: "terraform", w: 0.4 }, { to: "argocd", w: 0.45 }] },
  { id: "docker", parents: ["devops"], related: [{ to: "kubernetes", w: 0.5 }] },
  { id: "terraform", synonyms: ["tf"], related: [{ to: "pulumi", w: 0.55 }, { to: "ansible", w: 0.4 }, { to: "aws", w: 0.4 }] },
  { id: "pulumi", related: [{ to: "terraform", w: 0.55 }] },
  { id: "ansible" },
  { id: "aws", synonyms: ["amazon-web-services"], related: [{ to: "gcp", w: 0.4 }, { to: "azure", w: 0.4 }] },
  { id: "gcp", synonyms: ["google-cloud", "google-cloud-platform"], related: [{ to: "aws", w: 0.4 }, { to: "azure", w: 0.4 }] },
  { id: "azure", synonyms: ["microsoft-azure"], related: [{ to: "aws", w: 0.4 }] },
  { id: "ci-cd", synonyms: ["cicd", "jenkins", "circleci", "circle-ci", "travis"], related: [{ to: "github-actions", w: 0.6 }, { to: "gitlab-ci", w: 0.6 }] },
  { id: "github-actions", parents: ["ci-cd"], synonyms: ["github-action"] },
  { id: "gitlab-ci", parents: ["ci-cd"], synonyms: ["gitlab"] },
  { id: "linux" },
  { id: "nginx" },
  { id: "prometheus", parents: ["observability"], related: [{ to: "grafana", w: 0.6 }] },
  { id: "grafana", parents: ["observability"] },
  { id: "datadog", parents: ["observability"] },
  { id: "opentelemetry", parents: ["observability"], synonyms: ["otel"] },
  { id: "vercel", related: [{ to: "netlify", w: 0.5 }, { to: "nextjs", w: 0.4 }] },
  { id: "netlify" },
  { id: "fly", synonyms: ["fly.io"], related: [{ to: "railway", w: 0.5 }, { to: "render", w: 0.5 }] },
  { id: "railway", related: [{ to: "render", w: 0.5 }] },
  { id: "render" },
  { id: "cloudflare", synonyms: ["cloudflare-workers"] },
  { id: "helm", parents: ["kubernetes"] },
  { id: "argocd", parents: ["kubernetes"] },
  { id: "serverless", parents: ["devops"] },
  // ── Databases & storage ─────────────────────────────────────────────────────
  { id: "postgresql", synonyms: ["postgres", "pg"], related: [{ to: "mysql", w: 0.45 }, { to: "sqlite", w: 0.4 }] },
  { id: "mysql", related: [{ to: "postgresql", w: 0.45 }] },
  { id: "sqlite" },
  { id: "mongodb", synonyms: ["mongo"] },
  { id: "redis", related: [{ to: "caching", w: 0.5 }] },
  { id: "elasticsearch", synonyms: ["elastic"], related: [{ to: "search", w: 0.55 }] },
  { id: "kafka", synonyms: ["apache-kafka"], related: [{ to: "rabbitmq", w: 0.5 }, { to: "message-queue", w: 0.55 }] },
  { id: "rabbitmq", related: [{ to: "message-queue", w: 0.55 }] },
  { id: "cassandra" },
  { id: "dynamodb", parents: ["aws"] },
  { id: "snowflake", parents: ["data-engineering"], related: [{ to: "clickhouse", w: 0.4 }] },
  { id: "clickhouse", parents: ["data-engineering"], related: [{ to: "duckdb", w: 0.35 }] },
  { id: "duckdb", parents: ["data-engineering"] },
  { id: "supabase", related: [{ to: "postgresql", w: 0.5 }, { to: "neon", w: 0.4 }] },
  { id: "planetscale", related: [{ to: "mysql", w: 0.5 }] },
  { id: "neon", related: [{ to: "postgresql", w: 0.5 }] },
  { id: "turso", related: [{ to: "sqlite", w: 0.5 }] },
  { id: "cockroachdb", related: [{ to: "postgresql", w: 0.45 }] },
  { id: "prisma", parents: ["backend"], synonyms: ["@prisma/client"], related: [{ to: "drizzle", w: 0.5 }, { to: "typeorm", w: 0.45 }, { to: "sequelize", w: 0.4 }] },
  { id: "drizzle", synonyms: ["drizzle-orm"], related: [{ to: "prisma", w: 0.5 }] },
  { id: "sequelize", related: [{ to: "typeorm", w: 0.4 }] },
  { id: "typeorm", related: [{ to: "prisma", w: 0.45 }] },
  { id: "sqlalchemy", parents: ["python"] },
  // ── Data engineering & ML ───────────────────────────────────────────────────
  { id: "data-engineering", synonyms: ["data-eng"], related: [{ to: "spark", w: 0.5 }, { to: "airflow", w: 0.5 }, { to: "dbt", w: 0.45 }] },
  { id: "spark", parents: ["data-engineering"], synonyms: ["apache-spark"] },
  { id: "airflow", parents: ["data-engineering"], synonyms: ["apache-airflow"] },
  { id: "dbt", parents: ["data-engineering"] },
  { id: "ml", synonyms: ["machine-learning"], related: [{ to: "pytorch", w: 0.5 }, { to: "tensorflow", w: 0.5 }, { to: "scikit-learn", w: 0.5 }, { to: "data-engineering", w: 0.4 }] },
  { id: "llm", parents: ["ml"], synonyms: ["llms", "genai", "generative-ai", "gpt"], related: [{ to: "langchain", w: 0.5 }, { to: "rag", w: 0.55 }, { to: "openai", w: 0.45 }, { to: "anthropic", w: 0.45 }] },
  { id: "pytorch", parents: ["ml"], synonyms: ["torch"], related: [{ to: "tensorflow", w: 0.5 }] },
  { id: "tensorflow", parents: ["ml"], synonyms: ["keras", "tf-keras"] },
  { id: "pandas", parents: ["python"], related: [{ to: "numpy", w: 0.6 }, { to: "data-engineering", w: 0.45 }, { to: "spark", w: 0.4 }] },
  { id: "numpy", parents: ["python"] },
  { id: "scikit-learn", parents: ["ml"], synonyms: ["sklearn"] },
  { id: "jupyter", parents: ["python"] },
  { id: "langchain", parents: ["llm"], synonyms: ["llamaindex"] },
  { id: "huggingface", parents: ["ml"], synonyms: ["hugging-face"] },
  { id: "openai", parents: ["llm"] },
  { id: "anthropic", parents: ["llm"], synonyms: ["claude"] },
  { id: "rag", parents: ["llm"], synonyms: ["retrieval-augmented-generation"] },
  { id: "mlops", parents: ["ml"], related: [{ to: "devops", w: 0.4 }] },
  { id: "agents", parents: ["llm"], synonyms: ["agentic", "ai-agents", "multi-agent"], related: [{ to: "rag", w: 0.4 }] },
  { id: "mcp", parents: ["agents"], synonyms: ["model-context-protocol"], related: [{ to: "llm", w: 0.45 }] },
  { id: "inference", parents: ["ml"], synonyms: ["model-inference", "llm-inference", "model-serving"], related: [{ to: "mlops", w: 0.5 }, { to: "llm", w: 0.4 }] },
  { id: "embeddings", parents: ["ml"], synonyms: ["embedding", "vector-embeddings"], related: [{ to: "rag", w: 0.55 }, { to: "llm", w: 0.45 }] },
  { id: "prompt-engineering", parents: ["llm"], synonyms: ["prompting", "prompt"] },
  { id: "fine-tuning", parents: ["ml"], synonyms: ["finetuning", "fine-tune", "rlhf"], related: [{ to: "llm", w: 0.5 }] },
  { id: "computer-vision", parents: ["ml"], synonyms: ["image-recognition", "object-detection"] },
  { id: "recsys", parents: ["ml"], synonyms: ["recommender-systems", "recommendation-systems", "recommendation"] },
  // ── Mobile ──────────────────────────────────────────────────────────────────
  { id: "mobile", related: [{ to: "ios", w: 0.5 }, { to: "android", w: 0.5 }] },
  { id: "ios", parents: ["mobile", "swift"], related: [{ to: "android", w: 0.4 }] },
  { id: "android", parents: ["mobile"], related: [{ to: "kotlin", w: 0.4 }] },
  { id: "swiftui", parents: ["ios", "swift"] },
  { id: "react-native", parents: ["mobile", "react"], synonyms: ["reactnative"], related: [{ to: "flutter", w: 0.4 }, { to: "expo", w: 0.6 }] },
  { id: "flutter", parents: ["mobile", "dart"] },
  { id: "expo", parents: ["react-native"] },
  { id: "kotlin-multiplatform", parents: ["mobile", "kotlin"], synonyms: ["kmp"] },
  // ── Domains / capabilities ──────────────────────────────────────────────────
  { id: "frontend", related: [{ to: "react", w: 0.4 }, { to: "css", w: 0.3 }] },
  { id: "backend", related: [{ to: "api-design", w: 0.4 }, { to: "microservices", w: 0.4 }] },
  { id: "devops", related: [{ to: "kubernetes", w: 0.4 }, { to: "ci-cd", w: 0.4 }, { to: "docker", w: 0.4 }] },
  { id: "authentication", synonyms: ["auth", "jwt", "saml", "passport", "auth0", "clerk", "nextauth"], related: [{ to: "oauth", w: 0.6 }, { to: "security", w: 0.5 }] },
  { id: "oauth", parents: ["authentication"], synonyms: ["oauth2", "oidc"], related: [{ to: "security", w: 0.4 }] },
  { id: "security", related: [{ to: "authentication", w: 0.5 }] },
  { id: "payments", synonyms: ["stripe", "braintree", "paddle", "lemonsqueezy", "@stripe/stripe-js"], related: [{ to: "billing", w: 0.6 }] },
  { id: "billing", synonyms: ["recurly", "chargebee"] },
  { id: "api-design", synonyms: ["rest", "restful", "rest-api"], related: [{ to: "graphql", w: 0.4 }, { to: "grpc", w: 0.4 }, { to: "backend", w: 0.4 }] },
  { id: "graphql", synonyms: ["gql"], related: [{ to: "trpc", w: 0.4 }] },
  { id: "trpc", related: [{ to: "graphql", w: 0.4 }] },
  { id: "grpc", synonyms: ["grpc-web"], related: [{ to: "microservices", w: 0.3 }] },
  { id: "microservices" },
  { id: "websockets", synonyms: ["ws", "socket.io"], related: [{ to: "realtime", w: 0.6 }] },
  { id: "realtime", synonyms: ["real-time"] },
  { id: "message-queue", synonyms: ["mq"] },
  { id: "caching", synonyms: ["cache"] },
  { id: "search", synonyms: ["full-text-search"] },
  { id: "observability", synonyms: ["o11y"], related: [{ to: "monitoring", w: 0.6 }] },
  { id: "monitoring", related: [{ to: "prometheus", w: 0.4 }] },
  { id: "testing", related: [{ to: "unit-testing", w: 0.5 }, { to: "e2e-testing", w: 0.5 }] },
  { id: "unit-testing", parents: ["testing"] },
  { id: "e2e-testing", parents: ["testing"], synonyms: ["e2e", "end-to-end-testing"] },
  { id: "jest", parents: ["testing"], related: [{ to: "vitest", w: 0.6 }, { to: "mocha", w: 0.5 }] },
  { id: "vitest", parents: ["testing"], related: [{ to: "jest", w: 0.6 }] },
  { id: "playwright", parents: ["e2e-testing"], related: [{ to: "cypress", w: 0.6 }] },
  { id: "cypress", parents: ["e2e-testing"] },
  { id: "mocha", parents: ["testing"] },
  { id: "pytest", parents: ["testing", "python"] },
  { id: "accessibility", synonyms: ["a11y"] },
  { id: "seo" },
  { id: "performance", synonyms: ["perf", "web-performance"] }
];

// ../../packages/core/src/vocab/closure.ts
var PARENT_UP = 0.6;
var PARENT_DOWN = 0.35;
var DECAY_FLOOR = 0.25;
function round3(n) {
  return Math.round(n * 1e3) / 1e3;
}
function validateGraph(nodes) {
  const ids = /* @__PURE__ */ new Set();
  for (const n of nodes) {
    if (ids.has(n.id)) throw new Error(`vocab: duplicate id "${n.id}"`);
    ids.add(n.id);
  }
  const seenAlias = /* @__PURE__ */ new Map();
  for (const n of nodes) {
    for (const p of n.parents ?? []) {
      if (p === n.id) throw new Error(`vocab: "${n.id}" lists itself as a parent`);
      if (!ids.has(p)) throw new Error(`vocab: "${n.id}" parent "${p}" is not a defined id`);
    }
    for (const e of n.related ?? []) {
      if (e.to === n.id) throw new Error(`vocab: "${n.id}" relates to itself`);
      if (!ids.has(e.to)) throw new Error(`vocab: "${n.id}" related "${e.to}" is not a defined id`);
      if (!(e.w > 0 && e.w <= 1)) throw new Error(`vocab: "${n.id}"\u2192"${e.to}" weight ${e.w} out of (0,1]`);
    }
    for (const s of n.synonyms ?? []) {
      const alias = s.toLowerCase();
      if (ids.has(alias)) throw new Error(`vocab: synonym "${alias}" collides with a canonical id`);
      const prev = seenAlias.get(alias);
      if (prev && prev !== n.id) throw new Error(`vocab: synonym "${alias}" maps to both "${prev}" and "${n.id}"`);
      seenAlias.set(alias, n.id);
    }
  }
  const visiting = /* @__PURE__ */ new Set();
  const done = /* @__PURE__ */ new Set();
  const parentMap = new Map(nodes.map((n) => [n.id, n.parents ?? []]));
  const walk = (id, path) => {
    if (done.has(id)) return;
    if (visiting.has(id)) throw new Error(`vocab: parent cycle ${[...path, id].join(" \u2192 ")}`);
    visiting.add(id);
    for (const p of parentMap.get(id) ?? []) walk(p, [...path, id]);
    visiting.delete(id);
    done.add(id);
  };
  for (const n of nodes) walk(n.id, []);
}
function buildAdjacency(nodes) {
  const adj = /* @__PURE__ */ new Map();
  const add = (from, to, w) => {
    let m = adj.get(from);
    if (!m) adj.set(from, m = /* @__PURE__ */ new Map());
    if (w > (m.get(to) ?? 0)) m.set(to, w);
  };
  for (const n of nodes) {
    for (const p of n.parents ?? []) {
      add(n.id, p, PARENT_UP);
      add(p, n.id, PARENT_DOWN);
    }
    for (const e of n.related ?? []) {
      add(n.id, e.to, e.w);
      add(e.to, n.id, e.w);
    }
  }
  return adj;
}
function closureFrom(source, adj) {
  const best = /* @__PURE__ */ new Map();
  for (const [t, w] of adj.get(source) ?? []) {
    if (w >= DECAY_FLOOR) best.set(t, { w: round3(w), via: t });
  }
  const settled = /* @__PURE__ */ new Set([source]);
  while (true) {
    let u;
    let uw = 0;
    for (const [t, e] of best) {
      if (!settled.has(t) && e.w > uw) {
        u = t;
        uw = e.w;
      }
    }
    if (!u) break;
    settled.add(u);
    const via = best.get(u).via;
    for (const [t, we] of adj.get(u) ?? []) {
      if (settled.has(t)) continue;
      const cand = round3(uw * we);
      if (cand >= DECAY_FLOOR && cand > (best.get(t)?.w ?? 0)) {
        best.set(t, { w: cand, via });
      }
    }
  }
  best.delete(source);
  return best;
}
function buildGraph(nodes) {
  validateGraph(nodes);
  const ids = new Set(nodes.map((n) => n.id));
  const synonyms = /* @__PURE__ */ new Map();
  for (const n of nodes) {
    for (const s of n.synonyms ?? []) synonyms.set(s.toLowerCase(), n.id);
  }
  const adj = buildAdjacency(nodes);
  const closure = /* @__PURE__ */ new Map();
  for (const n of nodes) closure.set(n.id, closureFrom(n.id, adj));
  return { ids, synonyms, closure };
}

// ../../packages/core/src/vocab/extract.ts
var SOFT_DOMAIN = /* @__PURE__ */ new Set([
  "frontend",
  "backend",
  "devops",
  "security",
  "payments",
  "billing",
  "microservices",
  "caching",
  "search",
  "observability",
  "monitoring",
  "testing",
  "accessibility",
  "seo",
  "performance",
  "realtime",
  "authentication",
  "api-design"
]);
var SYNONYM_ONLY = /* @__PURE__ */ new Set(["performance", "security", "seo"]);
for (const id of SYNONYM_ONLY) {
  if (!SOFT_DOMAIN.has(id)) throw new Error(`extract: SYNONYM_ONLY "${id}" not in SOFT_DOMAIN`);
}

// ../../packages/core/src/vocab/index.ts
var GRAPH = buildGraph(VOCAB_NODES);
var VOCABULARY = [...GRAPH.ids];
var SYNONYMS = Object.fromEntries(GRAPH.synonyms);

// ../../packages/core/src/feeds/bounty-gate.ts
var BOUNTY_REPO_DENYLIST = [
  "SecureBananaLabs/bug-bounty",
  // Meta-farm: a bounty PLATFORM whose own issues are an assignment-gated
  // contributor queue ("please assign me, my chief") — an unsolicited PR won't
  // merge, so it's not a real claimable bounty. Not structurally derivable from
  // any fetched field, so it's a manual entry (also dropped from the allowlist).
  "boundlessfi/boundless"
];
var DENYLIST_LC = new Set(BOUNTY_REPO_DENYLIST.map((r) => r.toLowerCase()));
var AI_BAN_DENYLIST = [
  // Gentoo Council voted 6-0 (2024-04-14) to ban AI/ML-generated contributions
  // project-wide. https://wiki.gentoo.org/wiki/Project:Council/AI_policy
  "gentoo",
  // NetBSD Commit Guidelines: code generated by an LLM/similar technology is
  // "presumed to be tainted code, and must not be committed without prior
  // written approval by core". https://www.netbsd.org/developers/commit-guidelines.html
  "NetBSD"
  // NOT listed (checked, deliberately excluded): QEMU's blanket AI-contribution
  // ban is IN FLUX as of 2026-05 — a patch replacing it with a disclosure-based
  // policy ("AI-used-for:" tag) was posted to qemu-devel and appears to have
  // developer buy-in, so it is no longer a clean/current ban to key a hard
  // supply-side drop on. https://www.theregister.com/ai-and-ml/2026/05/29/qemu-mulls-relaxing-ai-contribution-ban/
];
var AI_BAN_LC = new Set(AI_BAN_DENYLIST.map((g) => g.toLowerCase()));

// ../../packages/core/src/github.ts
var RESUME_DECAY_HALF_LIFE_MS = 30 * 24 * 60 * 60 * 1e3;

// ../../packages/core/src/feeds/index.ts
var GREENHOUSE_SLUGS_BY_TIER = {
  bigco: [
    "stripe",
    "anthropic",
    "figma",
    "discord",
    "brex",
    "mercury",
    "plaid",
    "gusto",
    "scale",
    "databricks",
    "coinbase",
    "robinhood",
    "doordash",
    "airbnb",
    "dropbox",
    "datadog",
    "cloudflare",
    "reddit",
    "lyft",
    "instacart"
  ],
  scaleup: [
    "samsara",
    "verkada",
    "affirm",
    "gitlab",
    "asana",
    "flexport",
    "faire",
    "twitch",
    "airtable",
    "retool"
  ],
  startup: [
    "watershed"
  ]
};
var ASHBY_SLUGS_BY_TIER = {
  bigco: [
    "openai"
  ],
  scaleup: [
    "harvey",
    "elevenlabs",
    "notion",
    "sierra",
    "cohere",
    "ramp",
    "vanta",
    "decagon",
    "cursor",
    "replit",
    "perplexity",
    "baseten",
    "drata",
    "writer",
    "temporal",
    "supabase"
  ],
  startup: [
    "suno",
    "attio",
    "modal",
    "workos",
    "linear",
    "render",
    "warp",
    "plain",
    "posthog",
    "pylon",
    "resend",
    "langfuse",
    "railway",
    "mintlify",
    "neon",
    "browserbase",
    "knock",
    "speakeasy",
    "stytch",
    "runway",
    "doppler",
    "inngest",
    "hightouch",
    "zed"
  ]
};
var LEVER_SLUGS_BY_TIER = {
  bigco: [
    "palantir",
    "spotify"
  ],
  scaleup: [
    "mistral",
    "ro",
    "secureframe"
  ],
  startup: [
    "anyscale"
  ]
};
function flattenTiers(t) {
  return [.../* @__PURE__ */ new Set([...t.bigco, ...t.scaleup, ...t.startup])];
}
var DEFAULT_GREENHOUSE_SLUGS = flattenTiers(GREENHOUSE_SLUGS_BY_TIER);
var DEFAULT_ASHBY_SLUGS = flattenTiers(ASHBY_SLUGS_BY_TIER);
var DEFAULT_LEVER_SLUGS = flattenTiers(LEVER_SLUGS_BY_TIER);

// ../../packages/core/src/partners.ts
import { readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
var EXAMPLE_BUYER = {
  id: "northstar",
  legalName: "Northstar Talent Partners",
  matchCriteria: { roleTypes: ["full_time"] }
};
var BUYER_REGISTRY = {
  [EXAMPLE_BUYER.id]: EXAMPLE_BUYER
};

// ../../packages/core/src/intro.ts
var INTRO_ALLOWED_FIELDS = [
  "requesterLogin",
  "requesterDisplayName",
  "requesterContact",
  "note",
  "targetLogin"
];
var INTRO_ALLOWED_SET = new Set(INTRO_ALLOWED_FIELDS);
var INTRO_PENDING_TTL_MS = 30 * 24 * 60 * 60 * 1e3;
var INTRO_ACCEPTED_TTL_MS = 365 * 24 * 60 * 60 * 1e3;

// ../../packages/core/src/chatCrypto.ts
import { hkdfSync, createHash, randomBytes } from "crypto";
var KDF_INFO = Buffer.from("terminalhire-chat-v1");

// ../../packages/core/src/short-token.ts
import { createHash as createHash2 } from "crypto";
function opportunityShortToken(id) {
  return createHash2("sha256").update(id, "utf8").digest("base64url").slice(0, 8);
}

// bin/jpi-claim.js
var TERMINALHIRE_DIR2 = process.env.TERMINALHIRE_DIR || join3(homedir2(), ".terminalhire");
var INDEX_CACHE_FILE = join3(TERMINALHIRE_DIR2, "index-cache.json");
var GH_API2 = "https://api.github.com";
var GH_HEADERS2 = { "User-Agent": "terminalhire-claim", Accept: "application/vnd.github+json" };
var AI_DISCLOSURE_NOTE = "---\nThis contribution was developed with AI assistance via [terminalhire](https://terminalhire.com). The author has reviewed the change and takes responsibility for its content.";
function buildSubmitBody(issueNumber) {
  const closesLine = issueNumber ? `Closes #${issueNumber}

` : "";
  return `${closesLine}${AI_DISCLOSURE_NOTE}`;
}
function printPolicySection(policy) {
  if (policy.status === "flagged") {
    console.log("\n  POLICY: \u26A0 possible AI-assistance policy language found \u2014 READ BEFORE WORKING:");
    for (const hit of policy.hits) {
      console.log(`    [${hit.file}]`);
      for (const line of hit.excerpt.split("\n")) console.log(`      ${line}`);
    }
  } else if (policy.status === "unavailable") {
    console.log("\n  POLICY: could not read this repo's CONTRIBUTING/PR-template/AGENTS docs (rate-limited or unreachable) \u2014 read them yourself before working.");
  } else {
    console.log("  policy: no AI-assistance policy language detected in CONTRIBUTING/PR-template/AGENTS docs");
  }
}
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
function readClaimablePool() {
  if (!existsSync2(INDEX_CACHE_FILE)) return [];
  const entry = JSON.parse(readFileSync3(INDEX_CACHE_FILE, "utf8"));
  const bounties = (entry?.index?.jobs ?? []).filter((j) => j.source === "bounty");
  const contributions = (entry?.index?.contribute ?? []).filter((j) => j.source === "contribute");
  return [...bounties, ...contributions];
}
function findClaimableInCache(id) {
  try {
    return readClaimablePool().find((j) => j.id === id) ?? null;
  } catch {
    return null;
  }
}
function looksLikeShortRef(arg) {
  return typeof arg === "string" && /^[A-Za-z0-9_-]{8}$/.test(arg);
}
function findClaimableByShortRef(ref) {
  try {
    return readClaimablePool().find((j) => opportunityShortToken(j.id) === ref) ?? null;
  } catch {
    return null;
  }
}
function extractClaimableFields(job) {
  if (job.source === "contribute") {
    const c = job.contribution ?? {};
    return {
      bountyId: job.id,
      title: job.title,
      repoFullName: c.repoFullName ?? job.company ?? "",
      issueUrl: c.issueUrl ?? job.url ?? "",
      amountUSD: null,
      source: "contribute"
    };
  }
  const b = job.bounty ?? {};
  return {
    bountyId: job.id,
    title: job.title,
    repoFullName: b.repoFullName ?? job.company ?? "",
    issueUrl: b.claimUrl ?? job.url ?? "",
    amountUSD: b.amountUSD ?? null,
    source: "bounty"
  };
}
function parseGitHubUrl(url) {
  const m = String(url ?? "").match(/github\.com\/([^/]+)\/([^/]+)\/(?:issues|pull)\/(\d+)/);
  if (!m) return null;
  return { owner: m[1], repo: m[2], number: parseInt(m[3], 10), repoFullName: `${m[1]}/${m[2]}` };
}
async function countOpenPRsReferencingIssue(repoFullName, issueNumber) {
  try {
    const res = await fetch(`${GH_API2}/repos/${repoFullName}/pulls?state=open&per_page=100`, {
      headers: GH_HEADERS2,
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
    const res = await fetch(`${GH_API2}/repos/${repoFullName}/issues/${issueNumber}`, {
      headers: GH_HEADERS2,
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
    const res = await fetch(`${GH_API2}/repos/${p.repoFullName}/pulls/${p.number}`, {
      headers: GH_HEADERS2,
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
function fmtClaimAmount(c) {
  return c.kind === "contribution" ? "contribution" : fmtAmount(c.amountUSD);
}
function printMetric(rate) {
  const pct = Math.round(rate.rate * 100);
  console.log(`
\u{1F4CA} Accepted-PR rate: ${rate.merged}/${rate.total} claims merged (${pct}%)`);
}
async function resolveBounty(arg) {
  let bountyId, title, repoFullName, issueUrl, amountUSD, source;
  const job = findClaimableInCache(arg) ?? (looksLikeShortRef(arg) ? findClaimableByShortRef(arg) : null);
  if (job) {
    ({ bountyId, title, repoFullName, issueUrl, amountUSD, source } = extractClaimableFields(job));
  } else {
    const parsed = parseGitHubUrl(arg);
    if (!parsed) return null;
    bountyId = `gh:${parsed.repoFullName}#${parsed.number}`;
    title = `${parsed.repoFullName}#${parsed.number}`;
    repoFullName = parsed.repoFullName;
    issueUrl = arg;
    amountUSD = null;
    source = "bounty";
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
    source,
    issueState,
    openPRs,
    issueNumber: ghIssue ? ghIssue.number : null
  };
}
async function cmdRecord(arg, flags = {}) {
  const claims = await Promise.resolve().then(() => (init_claims(), claims_exports));
  if (!arg) {
    console.error("Usage: terminalhire claim record <bountyId|issueUrl> [--ack-policy]");
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
  const { checkRepoPolicy: checkRepoPolicy2 } = await Promise.resolve().then(() => (init_repo_policy(), repo_policy_exports));
  const policy = await checkRepoPolicy2(b.repoFullName);
  printPolicySection(policy);
  let ackedAt = null;
  if (policy.status === "flagged" || policy.status === "unavailable") {
    const reason = policy.status === "flagged" ? "This repo may prohibit AI-generated contributions" : "This repo's contribution policy could not be checked";
    let acked = Boolean(flags["ack-policy"]);
    if (!acked && process.stdin.isTTY) {
      acked = await confirm(`
  ${reason} \u2014 read it before working. Acknowledge and proceed? (y/N) `);
    }
    if (!acked) {
      console.error(
        `
terminalhire claim: refusing to record \u2014 read ${b.repoFullName}'s contribution policy first.
  Re-run with --ack-policy once you have (or confirm interactively).`
      );
      process.exit(1);
    }
    ackedAt = (/* @__PURE__ */ new Date()).toISOString();
  } else {
    console.log("  (default AI-assistance disclosure still applies at submit)");
  }
  const kind = b.source === "contribute" ? "contribution" : "bounty";
  let claim;
  try {
    claim = claims.recordClaim({
      id: b.bountyId,
      bountyId: b.bountyId,
      title: b.title,
      repoFullName: b.repoFullName,
      issueUrl: b.issueUrl,
      amountUSD: b.amountUSD,
      openPRsAtClaim: b.openPRs,
      kind,
      policy: { status: policy.status, ackedAt }
    });
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
  const { checkRepoPolicy: checkRepoPolicy2 } = await Promise.resolve().then(() => (init_repo_policy(), repo_policy_exports));
  const policy = await checkRepoPolicy2(b.repoFullName);
  if (json) {
    process.stdout.write(
      JSON.stringify({
        bountyId: b.bountyId,
        title: b.title,
        amountUSD: b.amountUSD,
        repoFullName: b.repoFullName,
        issueUrl: b.issueUrl,
        issueState: b.issueState,
        openPRs: b.openPRs,
        policy: { status: policy.status, hits: policy.hits }
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
  printPolicySection(policy);
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
    console.log(`  [${c.state}] ${fmtClaimAmount(c)} \xB7 ${c.title}`);
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
    const body = buildSubmitBody(issueNum);
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
        await cmdRecord(positional[0], flags);
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
  AI_DISCLOSURE_NOTE,
  buildSubmitBody,
  cmdRecord,
  findClaimableByShortRef,
  findClaimableInCache,
  resolveBounty,
  run
};
