// src/signal.ts
import { readFileSync as readFileSync2, readdirSync } from "fs";
import { execFileSync } from "child_process";
import { join as join2 } from "path";

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
function normalize(tokens) {
  const result = /* @__PURE__ */ new Set();
  for (const raw of tokens) {
    const lower = raw.toLowerCase().trim();
    if (GRAPH.ids.has(lower)) {
      result.add(lower);
      continue;
    }
    const mapped = GRAPH.synonyms.get(lower);
    if (mapped) result.add(mapped);
  }
  return Array.from(result);
}

// ../../packages/core/src/github.ts
var RESUME_DECAY_HALF_LIFE_MS = 30 * 24 * 60 * 60 * 1e3;

// ../../packages/core/src/feeds/bounty-gate.ts
var BOUNTY_REPO_DENYLIST = ["SecureBananaLabs/bug-bounty"];
var DENYLIST_LC = new Set(BOUNTY_REPO_DENYLIST.map((r) => r.toLowerCase()));

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

// src/signal.ts
var LANGUAGE_TAGS = /* @__PURE__ */ new Set([
  "typescript",
  "javascript",
  "python",
  "go",
  "rust",
  "java",
  "ruby",
  "elixir",
  "scala",
  "kotlin",
  "swift",
  "cpp",
  "csharp",
  "php",
  "haskell",
  "clojure",
  "r"
]);
var EXT_MAP = {
  ".ts": "typescript",
  ".tsx": "typescript",
  ".js": "javascript",
  ".mjs": "javascript",
  ".cjs": "javascript",
  ".jsx": "javascript",
  ".py": "python",
  ".go": "go",
  ".rs": "rust",
  ".java": "java",
  ".rb": "ruby",
  ".ex": "elixir",
  ".exs": "elixir",
  ".scala": "scala",
  ".kt": "kotlin",
  ".swift": "swift",
  ".cpp": "cpp",
  ".cc": "cpp",
  ".cxx": "cpp",
  ".hpp": "cpp",
  ".cs": "csharp",
  ".php": "php",
  ".hs": "haskell",
  ".clj": "clojure",
  ".cljs": "clojure",
  ".r": "r",
  ".vue": "vue",
  ".svelte": "svelte"
};
var PERSONAL_GIT_HOSTS = /* @__PURE__ */ new Set([
  "github.com",
  "gitlab.com",
  "bitbucket.org",
  "codeberg.org",
  "sr.ht"
]);
var PERSONAL_EMAIL_DOMAINS = /* @__PURE__ */ new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "proton.me",
  "protonmail.com",
  "fastmail.com",
  "hey.com",
  "duck.com"
]);
function safeGit(args, cwd) {
  try {
    return execFileSync("git", ["-C", cwd, ...args], {
      timeout: 2e3,
      stdio: ["ignore", "pipe", "ignore"]
    }).toString().trim();
  } catch {
    return "";
  }
}
function isEmployerContext(cwd) {
  const inRepo = safeGit(["rev-parse", "--is-inside-work-tree"], cwd);
  if (inRepo !== "true") return false;
  const remote = safeGit(["remote", "get-url", "origin"], cwd);
  if (remote) {
    const sshMatch = remote.match(/^git@([^:]+):/);
    const httpsMatch = remote.match(/^https?:\/\/([^/]+)/);
    const host = (sshMatch?.[1] ?? httpsMatch?.[1] ?? "").toLowerCase();
    if (host) return !PERSONAL_GIT_HOSTS.has(host);
  }
  const email = safeGit(["config", "user.email"], cwd);
  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  if (domain) return !PERSONAL_EMAIL_DOMAINS.has(domain);
  return false;
}
function readJsonSafe(path) {
  try {
    return JSON.parse(readFileSync2(path, "utf8"));
  } catch {
    return null;
  }
}
function readFileSafe(path) {
  try {
    return readFileSync2(path, "utf8");
  } catch {
    return "";
  }
}
function tokensFromPackageJson(cwd) {
  const pkg = readJsonSafe(join2(cwd, "package.json"));
  if (!pkg || typeof pkg !== "object") return [];
  const p = pkg;
  const deps = {
    ...typeof p["dependencies"] === "object" ? p["dependencies"] : {},
    ...typeof p["devDependencies"] === "object" ? p["devDependencies"] : {},
    ...typeof p["peerDependencies"] === "object" ? p["peerDependencies"] : {}
  };
  return Object.keys(deps);
}
function workspaceMemberDirs(cwd) {
  const dirs = [cwd];
  for (const group of ["apps", "packages"]) {
    try {
      const groupDir = join2(cwd, group);
      for (const e of readdirSync(groupDir, { withFileTypes: true })) {
        if (e.isDirectory() && !e.isSymbolicLink()) dirs.push(join2(groupDir, e.name));
      }
    } catch {
    }
  }
  return dirs;
}
function tokensFromRequirementsTxt(cwd) {
  const content = readFileSafe(join2(cwd, "requirements.txt"));
  if (!content) return [];
  return content.split("\n").map((l) => l.trim().split(/[>=<!\[;]/)[0].trim().toLowerCase()).filter(Boolean);
}
function tokensFromGoMod(cwd) {
  const content = readFileSafe(join2(cwd, "go.mod"));
  if (!content) return [];
  const requires = Array.from(content.matchAll(/^\s+([^\s]+)\s+v/gm)).map((m) => m[1].split("/").pop() ?? "").filter(Boolean);
  return ["go", ...requires];
}
function tokensFromCargoToml(cwd) {
  const content = readFileSafe(join2(cwd, "Cargo.toml"));
  if (!content) return [];
  const deps = [];
  let inDeps = false;
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    const section = trimmed.match(/^\[([^\]]+)\]/);
    if (section) {
      inDeps = /(^|\.)(dependencies|dev-dependencies|build-dependencies)$/.test(section[1].trim());
      continue;
    }
    if (!inDeps) continue;
    const key = trimmed.match(/^([a-zA-Z0-9_-]+)\s*=/);
    if (key) deps.push(key[1].toLowerCase());
  }
  return ["rust", ...deps];
}
function tokensFromFileExtensions(cwd) {
  const tokens = [];
  const scanDirs = [cwd];
  try {
    const srcDir = join2(cwd, "src");
    readdirSync(srcDir);
    scanDirs.push(srcDir);
  } catch {
  }
  for (const dir of scanDirs) {
    try {
      const entries = readdirSync(dir, { withFileTypes: true });
      for (const e of entries) {
        if (!e.isFile()) continue;
        const dotIdx = e.name.lastIndexOf(".");
        if (dotIdx === -1) continue;
        const ext = e.name.slice(dotIdx).toLowerCase();
        const tag = EXT_MAP[ext];
        if (tag) tokens.push(tag);
      }
    } catch {
    }
  }
  return tokens;
}
function inferSeniority(rawTokens) {
  const seniorSignals = /* @__PURE__ */ new Set([
    "kubernetes",
    "terraform",
    "pulumi",
    "kafka",
    "spark",
    "airflow",
    "dbt",
    "opentelemetry",
    "prometheus",
    "grafana",
    "microservices"
  ]);
  const midSignals = /* @__PURE__ */ new Set([
    "docker",
    "ci-cd",
    "github-actions",
    "testing",
    "postgresql",
    "redis",
    "graphql",
    "trpc",
    "api-design",
    "security",
    "oauth",
    "payments"
  ]);
  const normalized = new Set(normalize(rawTokens));
  const seniorHits = [...normalized].filter((t) => seniorSignals.has(t)).length;
  const midHits = [...normalized].filter((t) => midSignals.has(t)).length;
  if (seniorHits >= 2) return "senior";
  if (seniorHits >= 1 || midHits >= 2) return "mid";
  return void 0;
}
function extractFingerprint(cwd) {
  const employer = isEmployerContext(cwd);
  const rawTokens = [];
  for (const dir of workspaceMemberDirs(cwd)) {
    rawTokens.push(
      ...tokensFromPackageJson(dir),
      ...tokensFromRequirementsTxt(dir),
      ...tokensFromGoMod(dir),
      ...tokensFromCargoToml(dir),
      ...tokensFromFileExtensions(dir)
    );
  }
  let skillTags = normalize(rawTokens);
  if (employer) {
    skillTags = skillTags.filter((t) => LANGUAGE_TAGS.has(t));
  }
  const seniorityBand = employer ? void 0 : inferSeniority(rawTokens);
  return {
    skillTags,
    seniorityBand,
    employerContext: employer
  };
}
export {
  extractFingerprint
};
