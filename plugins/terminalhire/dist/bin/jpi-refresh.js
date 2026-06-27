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

// ../../packages/core/src/types.ts
function isBounty(job) {
  return job.source === "bounty" && job.bounty != null;
}
var init_types = __esm({
  "../../packages/core/src/types.ts"() {
    "use strict";
  }
});

// ../../packages/core/src/vocab/graph.data.ts
var VOCAB_NODES;
var init_graph_data = __esm({
  "../../packages/core/src/vocab/graph.data.ts"() {
    "use strict";
    VOCAB_NODES = [
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
  }
});

// ../../packages/core/src/vocab/closure.ts
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
var PARENT_UP, PARENT_DOWN, DECAY_FLOOR;
var init_closure = __esm({
  "../../packages/core/src/vocab/closure.ts"() {
    "use strict";
    PARENT_UP = 0.6;
    PARENT_DOWN = 0.35;
    DECAY_FLOOR = 0.25;
  }
});

// ../../packages/core/src/vocab/types.ts
var init_types2 = __esm({
  "../../packages/core/src/vocab/types.ts"() {
    "use strict";
  }
});

// ../../packages/core/src/vocab/extract.ts
function tokenize(text) {
  return text.toLowerCase().replace(/[^a-z0-9.\-+#]/g, " ").split(/\s+/).filter(Boolean);
}
function looksLikeEngRole(title) {
  return !NON_ENG_TITLE.test(title) && ENG_INTENT.test(title);
}
function resolveToken(token) {
  const tryOne = (t) => {
    if (GRAPH.ids.has(t)) return { id: t, viaSynonym: false };
    const mapped = GRAPH.synonyms.get(t);
    return mapped ? { id: mapped, viaSynonym: true } : null;
  };
  return tryOne(token) ?? tryOne(token.replace(/^[.\-+#]+|[.\-+#]+$/g, ""));
}
function extractSkillTags(title, body = "") {
  if (!looksLikeEngRole(title)) return [];
  const text = `${title}
${body}`;
  const tokens = tokenize(text);
  const ids = /* @__PURE__ */ new Set();
  const ambiguousPending = /* @__PURE__ */ new Set();
  for (const tok of tokens) {
    const r = resolveToken(tok);
    if (!r) continue;
    if (NON_EXTRACTABLE.has(r.id)) continue;
    if (SYNONYM_ONLY.has(r.id) && !r.viaSynonym) continue;
    const cue = AMBIGUOUS[r.id];
    if (cue) {
      if (cue.test(text)) ids.add(r.id);
      else ambiguousPending.add(r.id);
      continue;
    }
    ids.add(r.id);
  }
  const hardCount = [...ids].filter((id) => !SOFT_DOMAIN.has(id)).length;
  if (hardCount >= 2) for (const id of ambiguousPending) ids.add(id);
  return [...ids];
}
function coreTagsFromTitle(title) {
  return extractSkillTags(title, "").filter((t) => !SOFT_DOMAIN.has(t));
}
var SOFT_DOMAIN, SYNONYM_ONLY, NON_EXTRACTABLE, AMBIGUOUS, ENG_INTENT, NON_ENG_TITLE;
var init_extract = __esm({
  "../../packages/core/src/vocab/extract.ts"() {
    "use strict";
    init_vocab();
    SOFT_DOMAIN = /* @__PURE__ */ new Set([
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
    SYNONYM_ONLY = /* @__PURE__ */ new Set(["performance", "security", "seo"]);
    NON_EXTRACTABLE = /* @__PURE__ */ new Set(["payments", "billing"]);
    for (const id of SYNONYM_ONLY) {
      if (!SOFT_DOMAIN.has(id)) throw new Error(`extract: SYNONYM_ONLY "${id}" not in SOFT_DOMAIN`);
    }
    AMBIGUOUS = {
      // Accept "go" with an ecosystem cue OR an explicit-skill phrasing ("Go developer",
      // "in Go", "experience with Go"). Rejects prose: "ready to go", "go above", "go live".
      go: /\b(golang|goroutines?|go\.mod|gin framework|gorm)\b|\bgo\b\s+(developer|engineer|programmer|microservices?|backend|services?|lang)|\b(in|with|using|written in|built in|experience (?:in|with)|proficient in|fluent in)\s+go\b/i,
      r: /\b(rstudio|tidyverse|ggplot|shiny|dplyr|cran|r-lang|rlang)\b/i,
      ml: /\b(machine[\s-]?learning|pytorch|tensorflow|scikit|sklearn|keras|neural|model training|deep[\s-]?learning|numpy|pandas|ml\s+(?:engineer|platform|researcher|infrastructure)|(?:ml|ai)\s+research)\b/i
    };
    ENG_INTENT = /\b(engineer|engineering|developer|dev\b|swe|sde|programmer|architect|full[\s-]?stack|front[\s-]?end|back[\s-]?end|devops|sre|software|coding|codebase|technical staff|tech(?:nical)? lead)\b/i;
    NON_ENG_TITLE = /\b(account executive|account manager|sales (?:rep|representative|development|manager|lead)|sdr|bdr|recruiter|recruiting|talent|marketing|administrative|business partner|billing coordinator|operations (?:administrator|coordinator)|customer success|project finance|controller|bookkeeper|graphic|brand)\b/i;
  }
});

// ../../packages/core/src/vocab/idf-background.ts
var IDF_BACKGROUND;
var init_idf_background = __esm({
  "../../packages/core/src/vocab/idf-background.ts"() {
    "use strict";
    IDF_BACKGROUND = {
      N: 244,
      df: {
        "backend": 71,
        "python": 57,
        "monitoring": 44,
        "nextjs": 40,
        "testing": 40,
        "observability": 38,
        "llm": 38,
        "go": 36,
        "aws": 36,
        "react": 33,
        "frontend": 30,
        "ml": 28,
        "mobile": 24,
        "realtime": 24,
        "typescript": 23,
        "devops": 22,
        "kubernetes": 22,
        "javascript": 21,
        "java": 20,
        "rag": 20,
        "api-design": 20,
        "linux": 19,
        "postgresql": 19,
        "search": 17,
        "azure": 16,
        "snowflake": 15,
        "spark": 15,
        "kotlin": 14,
        "gcp": 14,
        "accessibility": 14,
        "nodejs": 14,
        "graphql": 14,
        "airflow": 14,
        "docker": 14,
        "ci-cd": 13,
        "android": 12,
        "cpp": 12,
        "gitlab-ci": 11,
        "anthropic": 11,
        "terraform": 11,
        "mysql": 11,
        "r": 10,
        "dbt": 9,
        "langchain": 9,
        "pytorch": 9,
        "ruby": 9,
        "rails": 9,
        "cloudflare": 7,
        "datadog": 7,
        "css": 7,
        "ansible": 7,
        "openai": 6,
        "kafka": 6,
        "rust": 5,
        "grpc": 5,
        "microservices": 5,
        "serverless": 5,
        "scala": 5,
        "prometheus": 5,
        "grafana": 5,
        "php": 5,
        "redis": 5,
        "huggingface": 4,
        "pandas": 4,
        "scikit-learn": 4,
        "html": 4,
        "ios": 4,
        "authentication": 4,
        "vue": 4,
        "mlops": 3,
        "spring": 3,
        "mongodb": 3,
        "csharp": 3,
        "swift": 2,
        "caching": 2,
        "haskell": 2,
        "pulumi": 2,
        "argocd": 2,
        "tensorflow": 2,
        "express": 2,
        "elasticsearch": 2,
        "clickhouse": 2,
        "nestjs": 2,
        "vite": 2,
        "svelte": 2,
        "phoenix": 2,
        "angular": 2,
        "django": 2,
        "dotnet": 2,
        "elixir": 2,
        "bun": 1,
        "oauth": 1,
        "dynamodb": 1,
        "helm": 1,
        "playwright": 1,
        "cypress": 1,
        "jest": 1,
        "mocha": 1,
        "typeorm": 1,
        "tailwind": 1,
        "prisma": 1,
        "expo": 1,
        "rabbitmq": 1,
        "redux": 1
      }
    };
  }
});

// ../../packages/core/src/vocab/index.ts
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
function expandWeighted(tags, graph = GRAPH) {
  const out = /* @__PURE__ */ new Map();
  const put = (tag, weight, via) => {
    const ex = out.get(tag);
    if (!ex || weight > ex.weight) out.set(tag, { tag, weight, via });
  };
  for (const t of tags) {
    put(t, 1, t);
    const near = graph.closure.get(t);
    if (near) for (const [n, edge] of near) put(n, edge.w, t);
  }
  return out;
}
var GRAPH, VOCABULARY, SYNONYMS;
var init_vocab = __esm({
  "../../packages/core/src/vocab/index.ts"() {
    "use strict";
    init_graph_data();
    init_closure();
    init_types2();
    init_closure();
    init_graph_data();
    init_extract();
    init_idf_background();
    GRAPH = buildGraph(VOCAB_NODES);
    VOCABULARY = [...GRAPH.ids];
    SYNONYMS = Object.fromEntries(GRAPH.synonyms);
  }
});

// ../../packages/core/src/vocabulary.ts
var init_vocabulary = __esm({
  "../../packages/core/src/vocabulary.ts"() {
    "use strict";
    init_vocab();
  }
});

// ../../packages/core/src/github.ts
function ghHeaders(token) {
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    // GitHub's REST API REQUIRES a User-Agent; serverless runtimes don't always
    // send a default (omitting it yields a 403 "administrative rules" error).
    "User-Agent": "terminalhire"
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}
async function ghFetch(path, token) {
  const url = `https://api.github.com${path}`;
  const res = await fetch(url, { headers: ghHeaders(token) });
  if (!res.ok) {
    throw new Error(`GitHub API ${path}: HTTP ${res.status} ${res.statusText}`);
  }
  return res.json();
}
async function fetchGitHubProfile(login, token) {
  const user = await ghFetch(`/users/${login}`, token);
  let repos = [];
  try {
    repos = await ghFetch(
      `/users/${login}/repos?sort=pushed&per_page=100`,
      token
    );
  } catch (err) {
    console.warn(`[github] ${login}: repos fetch failed, continuing \u2014`, err);
  }
  const langCount = {};
  for (const repo of repos) {
    if (repo.fork) continue;
    if (repo.language) {
      langCount[repo.language.toLowerCase()] = (langCount[repo.language.toLowerCase()] ?? 0) + 1;
    }
  }
  const topLanguages = Object.entries(langCount).sort(([, a], [, b]) => b - a).slice(0, 10).map(([lang]) => lang);
  const topicSet = /* @__PURE__ */ new Set();
  for (const repo of repos) {
    if (repo.fork) continue;
    for (const t of repo.topics ?? []) topicSet.add(t.toLowerCase());
  }
  const topics = Array.from(topicSet).slice(0, 30);
  let recentPRorgs;
  try {
    const q = encodeURIComponent(
      `type:pr is:merged author:${login} sort:updated`
    );
    const result = await ghFetch(
      `/search/issues?q=${q}&per_page=30`,
      token
    );
    const orgs = /* @__PURE__ */ new Set();
    for (const item of result.items ?? []) {
      const orgLogin = item.repository?.owner?.login;
      if (orgLogin && orgLogin !== login) orgs.add(orgLogin);
    }
    if (orgs.size > 0) recentPRorgs = Array.from(orgs);
  } catch {
  }
  return {
    login: user.login,
    name: user.name ?? void 0,
    publicEmail: user.email ?? void 0,
    avatarUrl: user.avatar_url,
    accountCreatedAt: user.created_at,
    publicRepos: user.public_repos,
    followers: user.followers,
    topLanguages,
    topics,
    recentPRorgs
  };
}
function inferSeniority(p) {
  const ageMs = Date.now() - new Date(p.accountCreatedAt).getTime();
  const ageYears = ageMs / (1e3 * 60 * 60 * 24 * 365.25);
  if (ageYears >= 9 && (p.publicRepos >= 40 || p.followers >= 500)) return "staff";
  if (ageYears >= 5 && (p.publicRepos >= 20 || p.followers >= 100)) return "senior";
  if (ageYears >= 2 && p.publicRepos >= 5) return "mid";
  return "junior";
}
function githubToFingerprint(p) {
  const rawTokens = [
    ...p.topLanguages,
    ...p.topics
    // recentPRorgs intentionally excluded — org names are not skill tags
  ];
  const skillTags = normalize(rawTokens);
  const seniorityBand = inferSeniority(p);
  return { skillTags, seniorityBand };
}
async function ghFetchRaw(path, token) {
  return fetch(`https://api.github.com${path}`, { headers: ghHeaders(token) });
}
function parseRepoUrl(repoUrl) {
  const m = repoUrl.match(/\/repos\/([^/]+)\/([^/]+)\/?$/);
  return m ? { owner: m[1], name: m[2] } : null;
}
function isTrivialPRTitle(title) {
  return TRIVIAL_PR_TITLE.test(title);
}
async function fetchOwnedOrgs(token) {
  try {
    const memberships = await ghFetch(`/user/memberships/orgs?per_page=100`, token);
    return new Set(
      memberships.filter((m) => m.role === "admin").map((m) => m.organization.login.toLowerCase())
    );
  } catch {
    return /* @__PURE__ */ new Set();
  }
}
async function repoContributorCount(owner, name, token) {
  try {
    const res = await ghFetchRaw(
      `/repos/${owner}/${name}/contributors?per_page=1&anon=false`,
      token
    );
    if (!res.ok) return void 0;
    const link = res.headers.get("link");
    const m = link?.match(/[?&]page=(\d+)>;\s*rel="last"/);
    if (m) return Number(m[1]);
    const body = await res.json();
    return Array.isArray(body) ? body.length : 0;
  } catch {
    return void 0;
  }
}
async function fetchRepoMeta(owner, name, token, cache) {
  const key = `${owner}/${name}`.toLowerCase();
  const cached = cache.get(key);
  if (cached !== void 0) return cached;
  let meta = null;
  try {
    const r = await ghFetch(`/repos/${owner}/${name}`, token);
    const contributors = await repoContributorCount(owner, name, token);
    meta = {
      stars: r.stargazers_count ?? 0,
      archived: !!r.archived,
      fork: !!r.fork,
      language: r.language ?? null,
      topics: r.topics ?? [],
      contributors
    };
  } catch {
    meta = null;
  }
  cache.set(key, meta);
  return meta;
}
function emptyCredential(status) {
  return { status, byDomain: {}, qualifyingTotal: 0, computedAt: (/* @__PURE__ */ new Date()).toISOString() };
}
async function fetchPublicOrgs(login, token) {
  try {
    const orgs = await ghFetch(
      `/users/${login}/orgs?per_page=100`,
      token
    );
    return new Set(orgs.map((o) => o.login.toLowerCase()));
  } catch {
    return /* @__PURE__ */ new Set();
  }
}
async function computeAcceptanceFromSearch(login, token, ownedOrgs, cache, gates = {
  minStars: MIN_STARS,
  minContributors: MIN_CONTRIBUTORS
}) {
  const computedAt = (/* @__PURE__ */ new Date()).toISOString();
  const loginLc = login.toLowerCase();
  let items;
  try {
    const q = encodeURIComponent(`type:pr is:merged author:${login} -user:${login} sort:updated`);
    const res = await ghFetch(
      `/search/issues?q=${q}&per_page=${CANDIDATE_PR_PAGE}`,
      token
    );
    items = res.items ?? [];
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn("[acceptance] search failed:", msg);
    return emptyCredential(/HTTP 403|HTTP 429|rate limit/i.test(msg) ? "rate-limited" : "failed");
  }
  const byDomain = {};
  let qualifyingTotal = 0;
  for (const item of items) {
    const repo = parseRepoUrl(item.repository_url);
    if (!repo) continue;
    const ownerLc = repo.owner.toLowerCase();
    if (ownerLc === loginLc) continue;
    if (ownedOrgs.has(ownerLc)) continue;
    if (isTrivialPRTitle(item.title)) continue;
    const meta = await fetchRepoMeta(repo.owner, repo.name, token, cache);
    if (!meta) continue;
    if (meta.archived || meta.fork) continue;
    if (meta.stars < gates.minStars) continue;
    if (meta.contributors !== void 0 && meta.contributors < gates.minContributors) continue;
    qualifyingTotal += 1;
    const mergedAt = item.pull_request?.merged_at ?? item.closed_at ?? item.created_at;
    const rawDomains = [meta.language ?? "", ...meta.topics].filter(Boolean);
    for (const d of new Set(normalize(rawDomains))) {
      const b = byDomain[d] ?? (byDomain[d] = { mergedPRs: 0, distinctOrgs: 0, lastMergedAt: mergedAt, orgs: /* @__PURE__ */ new Set() });
      b.mergedPRs += 1;
      b.orgs.add(ownerLc);
      if (mergedAt > b.lastMergedAt) b.lastMergedAt = mergedAt;
    }
  }
  const finalDomains = {};
  for (const [d, b] of Object.entries(byDomain)) {
    finalDomains[d] = {
      mergedPRs: b.mergedPRs,
      distinctOrgs: b.orgs.size,
      lastMergedAt: b.lastMergedAt
    };
  }
  return { status: "ok", byDomain: finalDomains, qualifyingTotal, computedAt };
}
async function computeAcceptanceCredential(login, token, cache = /* @__PURE__ */ new Map()) {
  if (!token) return emptyCredential("no-token");
  const ownedOrgs = await fetchOwnedOrgs(token);
  return computeAcceptanceFromSearch(login, token, ownedOrgs, cache);
}
async function computeAcceptanceCredentialPublic(login, token, cache = /* @__PURE__ */ new Map(), opts) {
  if (!token) return emptyCredential("no-token");
  const ownedOrgs = await fetchPublicOrgs(login, token);
  for (const org of opts?.includeOrgs ?? []) ownedOrgs.delete(org.toLowerCase());
  const gates = opts?.relaxGates ? { minStars: 0, minContributors: 0 } : void 0;
  return computeAcceptanceFromSearch(login, token, ownedOrgs, cache, gates);
}
function acceptanceCountForDomains(cred, domains) {
  if (cred.status !== "ok") return 0;
  let max = 0;
  for (const d of domains) {
    const c = cred.byDomain[d]?.mergedPRs ?? 0;
    if (c > max) max = c;
  }
  return max;
}
function bestAcceptanceDomain(cred, domains) {
  if (cred.status !== "ok") return null;
  let best = null;
  for (const d of domains) {
    const count = cred.byDomain[d]?.mergedPRs ?? 0;
    if (count > 0 && (best === null || count > best.count)) best = { domain: d, count };
  }
  return best;
}
function resumeRecencyDecay(lastSeenIso, now) {
  const ageMs = now - new Date(lastSeenIso).getTime();
  if (!Number.isFinite(ageMs)) return 0;
  return Math.pow(0.5, ageMs / RESUME_DECAY_HALF_LIFE_MS);
}
async function fetchRepoRecency(login, token) {
  try {
    const repos = await ghFetch(`/users/${login}/repos?sort=pushed&per_page=100`, token);
    return repos.filter((r) => !r.fork && !!r.pushed_at).map((r) => ({ pushedAt: r.pushed_at, language: r.language ?? null, topics: r.topics ?? [] }));
  } catch {
    return [];
  }
}
function deriveResumeTrend(cred, repoRecency, now = Date.now()) {
  const agg = /* @__PURE__ */ new Map();
  const bump = (domain, when, count, mergedPRs) => {
    const e = agg.get(domain);
    if (!e) {
      agg.set(domain, { count, last: when, earliest: when, mergedPRs });
    } else {
      e.count += count;
      e.mergedPRs += mergedPRs;
      if (when > e.last) e.last = when;
      if (when < e.earliest) e.earliest = when;
    }
  };
  if (cred.status === "ok") {
    for (const [domain, d] of Object.entries(cred.byDomain)) {
      bump(domain, d.lastMergedAt, d.mergedPRs, d.mergedPRs);
    }
  }
  for (const r of repoRecency) {
    for (const domain of new Set(normalize([r.language ?? "", ...r.topics].filter(Boolean)))) {
      bump(domain, r.pushedAt, 1, 0);
    }
  }
  const oneHalfLifeAgoIso = new Date(now - RESUME_DECAY_HALF_LIFE_MS).toISOString();
  const scored = [];
  for (const [domain, e] of agg.entries()) {
    const recencyScore2 = resumeRecencyDecay(e.last, now);
    const weight = e.count * recencyScore2;
    if (weight < RESUME_MIN_SCORE) continue;
    let direction;
    if (e.earliest > oneHalfLifeAgoIso) direction = "new";
    else if (recencyScore2 >= 0.5) direction = "up";
    else direction = "down";
    scored.push({
      t: { domain, direction, recencyScore: Math.round(recencyScore2 * 1e3) / 1e3, mergedPRs: e.mergedPRs },
      weight
    });
  }
  return scored.sort((a, b) => b.weight - a.weight).slice(0, 12).map((s) => s.t);
}
var MIN_STARS, MIN_CONTRIBUTORS, CANDIDATE_PR_PAGE, TRIVIAL_PR_TITLE, RESUME_DECAY_HALF_LIFE_MS, RESUME_MIN_SCORE;
var init_github = __esm({
  "../../packages/core/src/github.ts"() {
    "use strict";
    init_vocabulary();
    MIN_STARS = 50;
    MIN_CONTRIBUTORS = 10;
    CANDIDATE_PR_PAGE = 50;
    TRIVIAL_PR_TITLE = /^\s*(fix\s+typo|typo\b|update\s+readme|readme\b|docs?:|docs?\(|chore:|chore\(|style:|ci:|build:|bump\b|update\s+dependenc)/i;
    RESUME_DECAY_HALF_LIFE_MS = 30 * 24 * 60 * 60 * 1e3;
    RESUME_MIN_SCORE = 0.05;
  }
});

// ../../packages/core/src/matcher.ts
function acceptanceDomainsOf(job) {
  return job.coreTags && job.coreTags.length > 0 ? job.coreTags : job.tags;
}
function backgroundIdf(tag) {
  const df = IDF_BACKGROUND.df[tag] ?? 0;
  return Math.log((IDF_BACKGROUND.N + 1) / (df + 1)) + 1;
}
function inferSeniority2(title) {
  if (!ENG_TITLE.test(title)) return void 0;
  for (const [re, level] of SENIORITY_PATTERNS) {
    if (re.test(title)) return level;
  }
  return void 0;
}
function seniorityScore(fp, job) {
  if (!fp.seniorityBand) return 1;
  const jobLevel = inferSeniority2(job.title);
  if (!jobLevel) return 0.85;
  const wanted = SENIORITY_RANK[fp.seniorityBand] ?? 1;
  const got = SENIORITY_RANK[jobLevel] ?? 1;
  const delta = Math.abs(wanted - got);
  if (delta === 0) return 1;
  if (delta === 1) return 0.7;
  return 0.4;
}
function recencyScore(postedAt, now) {
  if (!postedAt) return UNKNOWN_RECENCY;
  const ms = new Date(postedAt).getTime();
  if (Number.isNaN(ms)) return UNKNOWN_RECENCY;
  const ageDays2 = (now - ms) / 864e5;
  if (ageDays2 < 7) return 1;
  if (ageDays2 < 30) return 0.9;
  if (ageDays2 < 90) return 0.75;
  return 0.6;
}
function passesFilters(fp, job) {
  const prefs = fp.prefs;
  if (!prefs) return true;
  if (prefs.remoteOnly && !job.remote) return false;
  if (prefs.roleTypes && prefs.roleTypes.length > 0 && !prefs.roleTypes.includes(job.roleType)) {
    return false;
  }
  if (prefs.compFloorUsd !== void 0) {
    if (job.compMax !== void 0 && job.compMax < prefs.compFloorUsd) return false;
  }
  return true;
}
function buildReason(details) {
  if (details.length === 0) return "No direct skill overlap found.";
  const render = (d) => !d.via || d.via === d.tag ? d.tag : `${d.via}\u2192${d.tag} (${d.weight})`;
  const top = details.slice(0, 3).map(render);
  const rest = details.length - top.length;
  const listed = top.join(", ");
  if (rest === 0) return `Matched on ${listed}.`;
  return `Matched on ${listed} + ${rest} more skill${rest > 1 ? "s" : ""}.`;
}
function harmonicMean(a, b) {
  if (a <= 0 || b <= 0) return 0;
  return 2 * a * b / (a + b);
}
function match(fp, jobs, limit = 5, now = Date.now(), opts = {}) {
  const idfOf = backgroundIdf;
  const expanded = expandWeighted(fp.skillTags);
  const maxDevScore = fp.skillTags.reduce((acc, t) => acc + idfOf(t), 0);
  const candidates = jobs.filter((j) => passesFilters(fp, j));
  const scored = candidates.map((job) => {
    const details = [];
    let jobMatchScore = 0;
    let jobMaxScore = 0;
    const devCovByTag = /* @__PURE__ */ new Map();
    for (const tag of job.tags) {
      const w = idfOf(tag);
      jobMaxScore += w;
      const hit = expanded.get(tag);
      if (hit) {
        const credit = Math.pow(hit.weight, SHARPEN);
        jobMatchScore += w * credit;
        details.push({ tag, weight: hit.weight, via: hit.via });
        if (credit > (devCovByTag.get(hit.via) ?? 0)) devCovByTag.set(hit.via, credit);
      }
    }
    let devScore = 0;
    for (const t of fp.skillTags) devScore += idfOf(t) * (devCovByTag.get(t) ?? 0);
    const devCov = maxDevScore > 0 ? Math.min(1, devScore / maxDevScore) : 0;
    const jobCov = jobMaxScore > 0 ? Math.min(1, jobMatchScore / jobMaxScore) : 0;
    const tagComponent = harmonicMean(devCov, jobCov);
    if (tagComponent === 0) return null;
    const coreTags = job.coreTags ?? coreTagsFromTitle(job.title);
    let coreComponent = tagComponent;
    if (coreTags.length > 0) {
      const coreCov = Math.max(0, ...coreTags.map((ct) => expanded.get(ct)?.weight ?? 0));
      if (coreCov === 0) coreComponent = tagComponent * CORE_MISS_PENALTY;
    }
    details.sort((a, b) => idfOf(b.tag) * b.weight - idfOf(a.tag) * a.weight);
    const sScore = seniorityScore(fp, job);
    const rScore = recencyScore(job.postedAt, now);
    const score = coreComponent * 0.6 + sScore * 0.25 + rScore * 0.15;
    const matchedTags = [...new Set(details.map((d) => d.via ?? d.tag))];
    const badge = opts.acceptance ? bestAcceptanceDomain(opts.acceptance, acceptanceDomainsOf(job)) : null;
    return {
      job,
      score: Math.round(score * 1e3) / 1e3,
      matchedTags,
      matchDetails: details,
      ...badge ? { acceptance: { status: "ok", domain: badge.domain, count: badge.count } } : {},
      reason: buildReason(details)
    };
  });
  return scored.filter((r) => r !== null && r.score >= MIN_SCORE).sort((a, b) => {
    const byScore = b.score - a.score;
    if (Math.abs(byScore) > TIEBREAK_EPS) return byScore;
    const byAcceptance = (b.acceptance?.count ?? 0) - (a.acceptance?.count ?? 0);
    if (byAcceptance !== 0) return byAcceptance;
    return byScore;
  }).slice(0, limit);
}
var MIN_SCORE, TIEBREAK_EPS, SHARPEN, CORE_MISS_PENALTY, SENIORITY_RANK, SENIORITY_PATTERNS, ENG_TITLE, UNKNOWN_RECENCY;
var init_matcher = __esm({
  "../../packages/core/src/matcher.ts"() {
    "use strict";
    init_vocabulary();
    init_github();
    MIN_SCORE = 0.15;
    TIEBREAK_EPS = 5e-3;
    SHARPEN = 1.6;
    CORE_MISS_PENALTY = 0.4;
    SENIORITY_RANK = {
      junior: 0,
      mid: 1,
      senior: 2,
      staff: 3
    };
    SENIORITY_PATTERNS = [
      [/\bstaff\b|\bprincipal\b|\bdistinguished\b/i, "staff"],
      [/\bsenior\b|\bsr\.?\b/i, "senior"],
      [/\bjunior\b|\bjr\.?\b|\bentry[\s-]?level\b/i, "junior"],
      [/\bmid[\s-]?level\b|\bmid\b/i, "mid"]
    ];
    ENG_TITLE = /\b(engineer|engineering|developer|dev|swe|sde|programmer|architect)\b/i;
    UNKNOWN_RECENCY = 0.75;
  }
});

// ../../packages/core/src/feeds/http.ts
function fetchWithTimeout(input, init, timeoutMs = FEED_FETCH_TIMEOUT_MS) {
  return fetch(input, { ...init, signal: AbortSignal.timeout(timeoutMs) });
}
var FEED_FETCH_TIMEOUT_MS;
var init_http = __esm({
  "../../packages/core/src/feeds/http.ts"() {
    "use strict";
    FEED_FETCH_TIMEOUT_MS = 1e4;
  }
});

// ../../packages/core/src/feeds/greenhouse.ts
function extractTags(job) {
  const body = [
    ...(job.departments ?? []).map((d) => d.name),
    job.location?.name ?? "",
    ...(job.offices ?? []).map((o) => o.name),
    ...job.content ? [job.content.replace(/<[^>]*>/g, " ")] : []
  ].filter(Boolean).join(" ");
  return extractSkillTags(job.title, body);
}
function inferRemote(location) {
  const l = location.toLowerCase();
  return l.includes("remote") || l.includes("anywhere") || l.includes("worldwide");
}
async function fetchSlug(slug) {
  const url = `https://boards-api.greenhouse.io/v1/boards/${slug}/jobs?content=true`;
  let res;
  try {
    res = await fetchWithTimeout(url, { headers: { Accept: "application/json" } });
  } catch (err) {
    console.warn(`[greenhouse] ${slug}: network error \u2014`, err);
    return [];
  }
  if (!res.ok) {
    console.warn(`[greenhouse] ${slug}: HTTP ${res.status} ${res.statusText}`);
    return [];
  }
  let data;
  try {
    data = await res.json();
  } catch (err) {
    console.warn(`[greenhouse] ${slug}: JSON parse error \u2014`, err);
    return [];
  }
  const jobs = data.jobs ?? [];
  if (jobs.length === 0) {
    console.warn(`[greenhouse] ${slug}: 0 jobs returned (board may be private or slug invalid)`);
  } else {
    console.info(`[greenhouse] ${slug}: ${jobs.length} jobs`);
  }
  return jobs.map((j) => ({
    id: `greenhouse:${j.id}`,
    source: "greenhouse",
    title: j.title,
    company: slug,
    url: j.absolute_url,
    remote: inferRemote(j.location?.name ?? ""),
    location: j.location?.name,
    tags: extractTags(j),
    roleType: "full_time",
    postedAt: j.updated_at,
    applyMode: "direct",
    raw: j
  }));
}
var FALLBACK_SLUGS, greenhouse;
var init_greenhouse = __esm({
  "../../packages/core/src/feeds/greenhouse.ts"() {
    "use strict";
    init_vocabulary();
    init_http();
    FALLBACK_SLUGS = [
      "stripe",
      "linear",
      "vercel",
      "ramp",
      "notion",
      "airbnb",
      "anthropic",
      "figma",
      "discord",
      "brex",
      "mercury",
      "retool",
      "vanta",
      "plaid",
      "gusto",
      "scale",
      "databricks",
      "coinbase",
      "robinhood",
      "doordash"
    ];
    greenhouse = {
      source: "greenhouse",
      async fetch(opts) {
        const slugs = opts?.slugs && opts.slugs.length > 0 ? opts.slugs : FALLBACK_SLUGS;
        console.info(`[greenhouse] fetching ${slugs.length} slugs: ${slugs.join(", ")}`);
        const results = await Promise.allSettled(slugs.map(fetchSlug));
        const jobs = [];
        let failures = 0;
        for (const r of results) {
          if (r.status === "fulfilled") {
            jobs.push(...r.value);
          } else {
            failures++;
            console.warn(`[greenhouse] slug fetch rejected:`, r.reason);
          }
        }
        console.info(`[greenhouse] total: ${jobs.length} jobs, ${failures} slug failures`);
        return jobs;
      }
    };
  }
});

// ../../packages/core/src/feeds/ashby.ts
function extractTags2(job) {
  const body = [
    job.team ?? "",
    job.department ?? "",
    job.location ?? "",
    ...(job.secondaryLocations ?? []).map((l) => l.location ?? ""),
    job.descriptionPlain ?? ""
  ].join(" ");
  return extractSkillTags(job.title, body);
}
function mapEmploymentType(raw) {
  if (!raw) return "full_time";
  const lower = raw.toLowerCase();
  if (lower.includes("contract") || lower.includes("contractor")) return "contract";
  if (lower.includes("freelance")) return "freelance";
  return "full_time";
}
function inferRemote2(job) {
  if (job.isRemote === true) return true;
  const loc = (job.location ?? "").toLowerCase();
  return loc.includes("remote") || loc.includes("anywhere");
}
async function fetchSlug2(slug) {
  const url = `https://api.ashbyhq.com/posting-api/job-board/${slug}`;
  const res = await fetchWithTimeout(url, {
    headers: { Accept: "application/json" }
  });
  if (!res.ok) {
    throw new Error(`Ashby ${slug}: HTTP ${res.status}`);
  }
  const data = await res.json();
  return (data.jobs ?? []).map((j) => {
    const comp = j.compensation;
    return {
      id: `ashby:${j.id}`,
      source: "ashby",
      title: j.title,
      company: slug,
      url: j.jobUrl ?? j.applyUrl ?? `https://jobs.ashbyhq.com/${slug}/${j.id}`,
      remote: inferRemote2(j),
      location: j.location,
      compMin: comp?.minValue,
      compMax: comp?.maxValue,
      tags: extractTags2(j),
      roleType: mapEmploymentType(j.employmentType),
      postedAt: j.publishedAt,
      applyMode: "direct",
      raw: j
    };
  });
}
var ashby;
var init_ashby = __esm({
  "../../packages/core/src/feeds/ashby.ts"() {
    "use strict";
    init_vocabulary();
    init_http();
    ashby = {
      source: "ashby",
      async fetch(opts) {
        const slugs = opts?.slugs ?? [];
        const results = await Promise.allSettled(slugs.map(fetchSlug2));
        const jobs = [];
        for (const r of results) {
          if (r.status === "fulfilled") jobs.push(...r.value);
        }
        return jobs;
      }
    };
  }
});

// ../../packages/core/src/feeds/lever.ts
function extractTags3(p) {
  const cat = p.categories ?? {};
  const body = [
    cat.team ?? "",
    cat.department ?? "",
    cat.location ?? "",
    ...cat.allLocations ?? [],
    p.descriptionPlain ?? ""
  ].join(" ");
  return extractSkillTags(p.text, body);
}
function mapCommitment(raw) {
  if (!raw) return "full_time";
  const lower = raw.toLowerCase();
  if (lower.includes("contract") || lower.includes("contractor")) return "contract";
  if (lower.includes("freelance")) return "freelance";
  return "full_time";
}
function inferRemote3(p) {
  if ((p.workplaceType ?? "").toLowerCase() === "remote") return true;
  const cat = p.categories ?? {};
  const haystack = [cat.location ?? "", ...cat.allLocations ?? []].join(" ").toLowerCase();
  return haystack.includes("remote") || haystack.includes("anywhere");
}
function toIso(ms) {
  if (typeof ms !== "number" || !Number.isFinite(ms)) return void 0;
  try {
    return new Date(ms).toISOString();
  } catch {
    return void 0;
  }
}
async function fetchSlug3(slug) {
  const url = `https://api.lever.co/v0/postings/${slug}?mode=json`;
  const res = await fetchWithTimeout(url, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    throw new Error(`Lever ${slug}: HTTP ${res.status}`);
  }
  const data = await res.json();
  const postings = Array.isArray(data) ? data : [];
  if (postings.length === 0) {
    console.warn(`[lever] ${slug}: 0 jobs returned (board may be private or slug invalid)`);
  } else {
    console.info(`[lever] ${slug}: ${postings.length} jobs`);
  }
  return postings.filter((p) => p && p.id && p.text).map((p) => ({
    id: `lever:${p.id}`,
    source: "lever",
    title: p.text,
    company: slug,
    url: p.hostedUrl ?? p.applyUrl ?? `https://jobs.lever.co/${slug}/${p.id}`,
    remote: inferRemote3(p),
    location: p.categories?.location,
    tags: extractTags3(p),
    roleType: mapCommitment(p.categories?.commitment),
    postedAt: toIso(p.createdAt),
    applyMode: "direct",
    raw: p
  }));
}
var lever;
var init_lever = __esm({
  "../../packages/core/src/feeds/lever.ts"() {
    "use strict";
    init_vocabulary();
    init_http();
    lever = {
      source: "lever",
      async fetch(opts) {
        const slugs = opts?.slugs ?? [];
        const results = await Promise.allSettled(slugs.map(fetchSlug3));
        const jobs = [];
        for (const r of results) {
          if (r.status === "fulfilled") jobs.push(...r.value);
          else console.warn("[lever] slug fetch rejected:", r.reason);
        }
        return jobs;
      }
    };
  }
});

// ../../packages/core/src/feeds/himalayas.ts
function extractTags4(job) {
  return extractSkillTags(job.title, (job.tags ?? []).join(" "));
}
function mapJobType(raw) {
  if (!raw) return "full_time";
  const lower = raw.toLowerCase();
  if (lower.includes("contract")) return "contract";
  if (lower.includes("freelance")) return "freelance";
  return "full_time";
}
function buildUrl(job) {
  if (job.applicationUrl) return job.applicationUrl;
  if (job.url) return job.url;
  const slug = job.slug ?? job.id ?? "unknown";
  return `https://himalayas.app/jobs/${slug}`;
}
function buildId(job) {
  return `himalayas:${job.id ?? job.slug ?? job.title}`;
}
var himalayas;
var init_himalayas = __esm({
  "../../packages/core/src/feeds/himalayas.ts"() {
    "use strict";
    init_vocabulary();
    init_http();
    himalayas = {
      source: "himalayas",
      async fetch(opts) {
        const limit = opts?.limit ?? 100;
        const url = `https://himalayas.app/jobs/api?limit=${limit}`;
        const res = await fetchWithTimeout(url, {
          headers: { Accept: "application/json" }
        });
        if (!res.ok) {
          throw new Error(`Himalayas: HTTP ${res.status}`);
        }
        const data = await res.json();
        return (data.jobs ?? []).map((j) => ({
          id: buildId(j),
          source: "himalayas",
          title: j.title,
          company: j.companyName ?? j.companySlug ?? "unknown",
          url: buildUrl(j),
          // Himalayas is a remote-only board
          remote: true,
          location: (j.locationRestrictions ?? []).join(", ") || "Remote",
          compMin: j.salaryMin,
          compMax: j.salaryMax,
          tags: extractTags4(j),
          roleType: mapJobType(j.jobType),
          postedAt: j.pubDate ?? j.createdAt,
          applyMode: "direct",
          raw: j
        }));
      }
    };
  }
});

// ../../packages/core/src/feeds/entities.ts
function fromCodePoint(cp) {
  if (!Number.isFinite(cp) || cp < 0 || cp > 1114111) return "";
  try {
    return String.fromCodePoint(cp);
  } catch {
    return "";
  }
}
function decodeEntities(input) {
  if (!input || !input.includes("&")) return input;
  return input.replace(/&#(\d+);/g, (_, n) => fromCodePoint(parseInt(n, 10))).replace(/&#[xX]([0-9a-fA-F]+);/g, (_, h) => fromCodePoint(parseInt(h, 16))).replace(/&(lt|gt|quot|apos|nbsp);/g, (_, name) => NAMED[name] ?? `&${name};`).replace(/&amp;/g, "&");
}
var NAMED;
var init_entities = __esm({
  "../../packages/core/src/feeds/entities.ts"() {
    "use strict";
    NAMED = {
      lt: "<",
      gt: ">",
      quot: '"',
      apos: "'",
      nbsp: " "
    };
  }
});

// ../../packages/core/src/feeds/wwr.ts
function stripHtml(html) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}
function inferRoleType(category) {
  const lower = category.toLowerCase();
  if (lower.includes("contract")) return "contract";
  if (lower.includes("freelance")) return "freelance";
  return "full_time";
}
function extractId(link) {
  const match2 = link.match(/\/opening\/([^/\s]+)/);
  return `wwr:${match2?.[1] ?? encodeURIComponent(link)}`;
}
function parseRss(xml) {
  const items = [];
  const itemBlocks = xml.match(/<item>([\s\S]*?)<\/item>/g) ?? [];
  for (const block of itemBlocks) {
    const get = (tag) => {
      const cdataMatch = block.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, "i"));
      if (cdataMatch) return decodeEntities(cdataMatch[1].trim());
      const plainMatch = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
      return decodeEntities(plainMatch?.[1].trim() ?? "");
    };
    const rawTitle = get("title");
    const m = rawTitle.match(/^(.*?):\s+(.*)$/);
    let company = m ? m[1].trim() : "Unknown";
    const titleAfterColon = m ? m[2].trim() : rawTitle;
    const title = titleAfterColon.replace(/\s*\([^)]*\)\s*$/, "").trim();
    if (/^https?:\/\//i.test(company)) {
      company = company.replace(/^https?:\/\//i, "").replace(/\/.*$/, "").trim() || "Unknown";
    }
    items.push({
      title,
      link: get("link") || get("guid"),
      pubDate: get("pubDate"),
      category: get("category"),
      description: get("description"),
      company
    });
  }
  return items;
}
function extractTags5(item) {
  const body = [item.category, stripHtml(item.description)].join(" ");
  return extractSkillTags(item.title, body);
}
var WWR_RSS_URL, wwr;
var init_wwr = __esm({
  "../../packages/core/src/feeds/wwr.ts"() {
    "use strict";
    init_vocabulary();
    init_entities();
    init_http();
    WWR_RSS_URL = "https://weworkremotely.com/remote-jobs.rss";
    wwr = {
      source: "wwr",
      async fetch(opts) {
        const limit = opts?.limit ?? 200;
        const res = await fetchWithTimeout(WWR_RSS_URL, {
          headers: { Accept: "application/rss+xml, application/xml, text/xml" }
        });
        if (!res.ok) {
          throw new Error(`WWR RSS: HTTP ${res.status}`);
        }
        const xml = await res.text();
        const items = parseRss(xml).slice(0, limit);
        function safeIso(s) {
          if (!s) return void 0;
          const d = new Date(s);
          return Number.isNaN(d.getTime()) ? void 0 : d.toISOString();
        }
        return items.map((item) => ({
          id: extractId(item.link),
          source: "wwr",
          title: item.title,
          company: item.company,
          url: item.link,
          // WWR is a remote-only board
          remote: true,
          location: "Remote",
          tags: extractTags5(item),
          roleType: inferRoleType(item.category),
          postedAt: safeIso(item.pubDate),
          applyMode: "direct",
          raw: item
        }));
      }
    };
  }
});

// ../../packages/core/src/feeds/hn.ts
function stripHtml2(html) {
  return decodeEntities(html.replace(/<p>/gi, " ").replace(/<[^>]*>/g, "")).replace(/\s+/g, " ").trim();
}
function extractUrl(text) {
  const match2 = text.match(/https?:\/\/[^\s<>"']+/);
  return match2?.[0] ?? "";
}
function inferRemote4(text) {
  const lower = text.toLowerCase();
  return lower.includes("remote") || lower.includes("anywhere") || lower.includes("distributed");
}
function inferRoleType2(text) {
  const lower = text.toLowerCase();
  if (lower.includes("contract") || lower.includes("contractor")) return "contract";
  if (lower.includes("freelance")) return "freelance";
  return "full_time";
}
function parseComment(item) {
  if (!item.text || item.text.trim().length < 20) return null;
  const raw = stripHtml2(item.text);
  if (!raw) return null;
  const firstLine = raw.split(/\n/)[0];
  const parts = firstLine.split("|").map((s) => s.trim());
  const company = parts[0] ?? "Unknown";
  const title = parts[1] ?? firstLine.slice(0, 80).trim();
  const location = parts[2] ?? "";
  if (company.toLowerCase().startsWith("note:") || company.toLowerCase().startsWith("ps:") || title.length < 3) {
    return null;
  }
  const url = extractUrl(raw) || `https://news.ycombinator.com/item?id=${item.id}`;
  const tags = extractTags6(title, raw);
  if (tags.length === 0) return null;
  return {
    id: `hn:${item.id}`,
    source: "hn",
    title: title.slice(0, 120),
    company: company.slice(0, 80),
    url,
    remote: inferRemote4(raw),
    location: location || void 0,
    tags,
    roleType: inferRoleType2(raw),
    postedAt: item.created_at,
    applyMode: "direct",
    raw: item
  };
}
function extractTags6(title, text) {
  return extractSkillTags(title, text);
}
var ALGOLIA_SEARCH, ALGOLIA_ITEMS, hn;
var init_hn = __esm({
  "../../packages/core/src/feeds/hn.ts"() {
    "use strict";
    init_vocabulary();
    init_entities();
    init_http();
    ALGOLIA_SEARCH = "https://hn.algolia.com/api/v1/search?query=Ask+HN%3A+Who+is+Hiring%3F&tags=story,ask_hn&hitsPerPage=1";
    ALGOLIA_ITEMS = "https://hn.algolia.com/api/v1/items/";
    hn = {
      source: "hn",
      async fetch(opts) {
        const limit = opts?.limit ?? 150;
        const searchRes = await fetchWithTimeout(ALGOLIA_SEARCH, {
          headers: { Accept: "application/json" }
        });
        if (!searchRes.ok) {
          throw new Error(`HN Algolia search: HTTP ${searchRes.status}`);
        }
        const searchData = await searchRes.json();
        const story = searchData.hits[0];
        if (!story) {
          throw new Error('HN: No "Who is Hiring" story found');
        }
        const itemRes = await fetchWithTimeout(`${ALGOLIA_ITEMS}${story.objectID}`, {
          headers: { Accept: "application/json" }
        });
        if (!itemRes.ok) {
          throw new Error(`HN Algolia item ${story.objectID}: HTTP ${itemRes.status}`);
        }
        const storyItem = await itemRes.json();
        const comments = storyItem.children ?? [];
        const jobs = [];
        for (const comment of comments.slice(0, limit)) {
          const job = parseComment(comment);
          if (job) jobs.push(job);
        }
        return jobs;
      }
    };
  }
});

// ../../packages/core/src/feeds/bounty-gate.ts
function isDenylistedRepo(fullName) {
  return DENYLIST_LC.has(fullName.toLowerCase());
}
function passesAntiFarm(amountUSD, stargazers) {
  return !(amountUSD > HIGH_VALUE_USD && stargazers < HIGH_VALUE_MIN_STARS);
}
function ageDays(createdAtIso) {
  const created = Date.parse(createdAtIso);
  if (!Number.isFinite(created)) return 0;
  return (Date.now() - created) / (1e3 * 60 * 60 * 24);
}
function passesMaturityGate(repo) {
  if (isDenylistedRepo(repo.fullName)) return false;
  if (repo.archived || repo.disabled) return false;
  if (repo.stargazers < MIN_REPO_STARS) return false;
  if (ageDays(repo.createdAt) < MIN_REPO_AGE_DAYS) return false;
  return true;
}
var DEFAULT_BOUNTY_REPOS, BOUNTY_REPO_DENYLIST, DENYLIST_LC, MAX_BOUNTIES_PER_REPO, MAX_BOUNTIES_PER_DISCOVERED_REPO, MIN_REPO_STARS, HIGH_VALUE_USD, HIGH_VALUE_MIN_STARS, MIN_REPO_AGE_DAYS;
var init_bounty_gate = __esm({
  "../../packages/core/src/feeds/bounty-gate.ts"() {
    "use strict";
    DEFAULT_BOUNTY_REPOS = [
      "tenstorrent/tt-metal",
      "sequelize/sequelize",
      "commaai/opendbc",
      "aragon/hack",
      "spacemeshos/app",
      "archestra-ai/archestra",
      "boundlessfi/boundless",
      "ucfopen/Obojobo",
      "widgetti/ipyvolume",
      "moorcheh-ai/memanto",
      "PrismarineJS/mineflayer"
    ];
    BOUNTY_REPO_DENYLIST = ["SecureBananaLabs/bug-bounty"];
    DENYLIST_LC = new Set(BOUNTY_REPO_DENYLIST.map((r) => r.toLowerCase()));
    MAX_BOUNTIES_PER_REPO = 10;
    MAX_BOUNTIES_PER_DISCOVERED_REPO = 3;
    MIN_REPO_STARS = 5;
    HIGH_VALUE_USD = 500;
    HIGH_VALUE_MIN_STARS = 50;
    MIN_REPO_AGE_DAYS = 30;
  }
});

// ../../packages/core/src/concurrency.ts
async function mapWithConcurrency(items, limit, fn) {
  const results = new Array(items.length);
  if (items.length === 0) return results;
  const workers = Math.max(1, Math.min(Math.floor(limit) || 1, items.length));
  let next = 0;
  async function run2() {
    for (; ; ) {
      const i = next++;
      if (i >= items.length) return;
      results[i] = await fn(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: workers }, run2));
  return results;
}
var init_concurrency = __esm({
  "../../packages/core/src/concurrency.ts"() {
    "use strict";
  }
});

// ../../packages/core/src/feeds/github-bounties.ts
function authHeaders() {
  const token = process.env["GITHUB_TOKEN"] ?? process.env["GH_TOKEN"];
  const h = {
    Accept: "application/vnd.github+json",
    "User-Agent": "terminalhire",
    "X-GitHub-Api-Version": "2022-11-28"
  };
  if (token) h["Authorization"] = `Bearer ${token}`;
  return h;
}
function tokenize2(text) {
  return text.toLowerCase().replace(/[^a-z0-9.\-+#]/g, " ").split(/\s+/).filter(Boolean);
}
function parseAmountUSD(text) {
  const m = text.match(/\$\s?([0-9][0-9,]*(?:\.[0-9]+)?)\s?([kK])?/);
  if (!m) return void 0;
  let n = parseFloat(m[1].replace(/,/g, ""));
  if (m[2]) n *= 1e3;
  if (!Number.isFinite(n) || n <= 0 || n > 1e6) return void 0;
  return Math.round(n);
}
function effortFromAmount(amount) {
  if (amount == null) return void 0;
  if (amount <= 500) return "small";
  if (amount <= 2e3) return "medium";
  return "large";
}
function labelNames(issue) {
  return (issue.labels ?? []).map((l) => typeof l === "string" ? l : l.name ?? "").filter(Boolean);
}
function isBountyIssue(issue) {
  if (issue.pull_request) return false;
  const labels = labelNames(issue);
  if (labels.some((n) => BOUNTY_LABEL_RE.test(n))) return true;
  return /bounty/i.test(issue.title) && parseAmountUSD(issue.title) != null;
}
async function ghJson(path) {
  let res;
  try {
    res = await fetchWithTimeout(`${GITHUB_API}${path}`, { headers: authHeaders() });
  } catch (err) {
    console.warn(`[github-bounties] network error ${path} \u2014`, err);
    return null;
  }
  if (res.status === 403 && res.headers.get("x-ratelimit-remaining") === "0") {
    console.warn("[github-bounties] rate-limited (set GITHUB_TOKEN for 5000/hr)");
    return null;
  }
  if (!res.ok) {
    console.warn(`[github-bounties] HTTP ${res.status} ${path}`);
    return null;
  }
  try {
    return await res.json();
  } catch {
    return null;
  }
}
async function fetchCommentAmount(repoFullName, issueNumber) {
  const comments = await ghJson(
    `/repos/${repoFullName}/issues/${issueNumber}/comments?per_page=30`
  );
  if (!comments) return void 0;
  for (const c of comments) {
    const body = c.body ?? "";
    if (BOUNTY_LABEL_RE.test(body)) {
      const amt = parseAmountUSD(body);
      if (amt != null) return amt;
    }
  }
  return void 0;
}
async function fetchRepoBounties(repoFullName) {
  const repo = await ghJson(`/repos/${repoFullName}`);
  if (!repo) return [];
  const meta = {
    fullName: repo.full_name,
    stargazers: repo.stargazers_count,
    createdAt: repo.created_at,
    archived: repo.archived,
    disabled: repo.disabled
  };
  if (!passesMaturityGate(meta)) {
    console.info(`[github-bounties] ${repoFullName}: failed maturity gate, skipping`);
    return [];
  }
  const issues = await ghJson(`/repos/${repoFullName}/issues?state=open&per_page=100`);
  if (!issues) return [];
  const bounties = issues.filter(isBountyIssue).slice(0, MAX_BOUNTIES_PER_REPO);
  const owner = repo.owner.login;
  return mapWithConcurrency(bounties, BOUNTY_FETCH_CONCURRENCY, async (issue) => {
    const title = decodeEntities(issue.title).trim();
    const body = issue.body ? decodeEntities(issue.body) : "";
    const amountUSD = parseAmountUSD(title) ?? parseAmountUSD(body) ?? await fetchCommentAmount(repoFullName, issue.number);
    const labels = labelNames(issue);
    const tags = normalize(tokenize2([title, labels.join(" "), body.slice(0, 2e3)].join(" ")));
    return {
      id: `bounty:${repoFullName}#${issue.number}`,
      source: "bounty",
      title,
      company: owner,
      url: issue.html_url,
      remote: true,
      location: "Remote",
      tags,
      roleType: "freelance",
      postedAt: issue.created_at,
      applyMode: "direct",
      bounty: {
        amountUSD,
        estimatedEffort: effortFromAmount(amountUSD),
        bountySource: "github",
        claimUrl: issue.html_url,
        repoFullName,
        repoStars: repo.stargazers_count,
        issueBody: body.slice(0, 1e3) || void 0
      },
      raw: issue
    };
  });
}
function repoFullNameFromApiUrl(url) {
  const m = url.match(/\/repos\/([^/]+)\/([^/]+)\/?$/);
  return m ? `${m[1]}/${m[2]}` : null;
}
async function searchBountyIssues() {
  const byUrl = /* @__PURE__ */ new Map();
  for (const q of SEARCH_QUERIES) {
    const res = await ghJson(
      `/search/issues?q=${encodeURIComponent(q)}&sort=created&order=desc&per_page=${SEARCH_PER_PAGE}`
    );
    for (const it of res?.items ?? []) {
      if (it.pull_request) continue;
      if (!byUrl.has(it.html_url)) byUrl.set(it.html_url, it);
    }
  }
  return [...byUrl.values()].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}
async function repoMetaCached(fullName) {
  const hit = repoMetaCache.get(fullName);
  if (hit !== void 0) return hit;
  const r = await ghJson(`/repos/${fullName}`) ?? null;
  repoMetaCache.set(fullName, r);
  return r;
}
async function fetchRepoMeta2(fullName) {
  const repo = await repoMetaCached(fullName);
  if (!repo) return null;
  return {
    fullName: repo.full_name,
    stargazers: repo.stargazers_count,
    createdAt: repo.created_at,
    archived: repo.archived,
    disabled: repo.disabled
  };
}
async function fetchRepoOpenPRRefs(fullName) {
  const hit = repoOpenPRRefsCache.get(fullName);
  if (hit !== void 0) return hit;
  const refs = /* @__PURE__ */ new Map();
  let scannedAny = false;
  for (let page = 1; page <= MAX_PR_PAGES; page++) {
    const prs = await ghJson(
      `/repos/${fullName}/pulls?state=open&per_page=100&page=${page}`
    );
    if (!Array.isArray(prs)) break;
    scannedAny = true;
    for (const pr of prs) {
      const counted = /* @__PURE__ */ new Set();
      for (const m of `${pr.title ?? ""}
${pr.body ?? ""}`.matchAll(/#(\d+)\b/g)) {
        const n = Number(m[1]);
        if (!counted.has(n)) {
          counted.add(n);
          refs.set(n, (refs.get(n) ?? 0) + 1);
        }
      }
    }
    if (prs.length < 100) break;
  }
  const result = scannedAny ? refs : null;
  repoOpenPRRefsCache.set(fullName, result);
  return result;
}
async function fetchIssueState(fullName, issueNumber) {
  const key = `${fullName}#${issueNumber}`;
  const hit = issueStateCache.get(key);
  if (hit !== void 0) return hit;
  const issue = await ghJson(`/repos/${fullName}/issues/${issueNumber}`);
  const state = issue?.state === "open" ? "open" : issue?.state === "closed" ? "closed" : null;
  issueStateCache.set(key, state);
  return state;
}
async function fetchSearchBounties() {
  const issues = (await searchBountyIssues()).slice(0, MAX_SEARCH_ISSUES_SCANNED);
  const distinctRepos = [
    ...new Set(
      issues.map((i) => repoFullNameFromApiUrl(i.repository_url)).filter((x) => !!x)
    )
  ];
  for (let i = 0; i < distinctRepos.length; i += REPO_META_CONCURRENCY) {
    await Promise.all(distinctRepos.slice(i, i + REPO_META_CONCURRENCY).map(repoMetaCached));
  }
  const jobs = [];
  const perRepo = /* @__PURE__ */ new Map();
  for (const issue of issues) {
    if (jobs.length >= MAX_SEARCH_BOUNTIES) break;
    const fullName = repoFullNameFromApiUrl(issue.repository_url);
    if (!fullName) continue;
    if ((perRepo.get(fullName) ?? 0) >= MAX_BOUNTIES_PER_REPO) continue;
    const repo = await repoMetaCached(fullName);
    if (!repo) continue;
    const passes = passesMaturityGate({
      fullName: repo.full_name,
      stargazers: repo.stargazers_count,
      createdAt: repo.created_at,
      archived: repo.archived,
      disabled: repo.disabled
    });
    if (!passes) continue;
    const title = decodeEntities(issue.title).trim();
    const body = issue.body ? decodeEntities(issue.body) : "";
    const labels = labelNames(issue);
    let amountUSD = parseAmountUSD(title) ?? parseAmountUSD(labels.join(" ")) ?? parseAmountUSD(body);
    if (amountUSD == null && labels.some((n) => /💎|💰/.test(n))) {
      amountUSD = await fetchCommentAmount(fullName, issue.number);
    }
    if (amountUSD == null) continue;
    if (!passesAntiFarm(amountUSD, repo.stargazers_count)) continue;
    const tags = normalize(
      tokenize2([title, labels.join(" "), body.slice(0, 2e3)].join(" "))
    );
    perRepo.set(fullName, (perRepo.get(fullName) ?? 0) + 1);
    jobs.push({
      id: `bounty:${fullName}#${issue.number}`,
      source: "bounty",
      title,
      company: repo.owner.login,
      url: issue.html_url,
      remote: true,
      location: "Remote",
      tags,
      roleType: "freelance",
      postedAt: issue.created_at,
      applyMode: "direct",
      bounty: {
        amountUSD,
        estimatedEffort: effortFromAmount(amountUSD),
        bountySource: "github",
        claimUrl: issue.html_url,
        repoFullName: fullName,
        repoStars: repo.stargazers_count,
        issueBody: body.slice(0, 1e3) || void 0
      },
      raw: issue
    });
  }
  return jobs;
}
var GITHUB_API, BOUNTY_LABEL_RE, SEARCH_QUERIES, SEARCH_PER_PAGE, MAX_SEARCH_BOUNTIES, MAX_SEARCH_ISSUES_SCANNED, REPO_META_CONCURRENCY, BOUNTY_FETCH_CONCURRENCY, repoMetaCache, MAX_PR_PAGES, repoOpenPRRefsCache, issueStateCache, githubBounties;
var init_github_bounties = __esm({
  "../../packages/core/src/feeds/github-bounties.ts"() {
    "use strict";
    init_vocabulary();
    init_entities();
    init_bounty_gate();
    init_http();
    init_concurrency();
    GITHUB_API = "https://api.github.com";
    BOUNTY_LABEL_RE = /bounty|reward|funded|💎|💰/i;
    SEARCH_QUERIES = [
      'label:"\u{1F48E} Bounty" type:issue state:open',
      // Algora-applied — highest signal
      "label:bounty type:issue state:open",
      'label:"\u{1F4B0} Bounty" type:issue state:open'
    ];
    SEARCH_PER_PAGE = 100;
    MAX_SEARCH_BOUNTIES = 150;
    MAX_SEARCH_ISSUES_SCANNED = 300;
    REPO_META_CONCURRENCY = 15;
    BOUNTY_FETCH_CONCURRENCY = 6;
    repoMetaCache = /* @__PURE__ */ new Map();
    MAX_PR_PAGES = 3;
    repoOpenPRRefsCache = /* @__PURE__ */ new Map();
    issueStateCache = /* @__PURE__ */ new Map();
    githubBounties = {
      source: "bounty",
      async fetch(opts) {
        const allowlist = opts?.slugs && opts.slugs.length > 0 ? opts.slugs : DEFAULT_BOUNTY_REPOS;
        const [searched, listed] = await Promise.all([
          fetchSearchBounties().catch((e) => {
            console.warn("[github-bounties] search discovery failed:", e);
            return [];
          }),
          Promise.allSettled(allowlist.map(fetchRepoBounties)).then(
            (settled) => settled.flatMap((r) => r.status === "fulfilled" ? r.value : [])
          )
        ]);
        const seen = /* @__PURE__ */ new Set();
        const out = [];
        for (const j of [...searched, ...listed]) {
          if (!seen.has(j.id)) {
            seen.add(j.id);
            out.push(j);
          }
        }
        console.info(
          `[github-bounties] total: ${out.length} bounties (${searched.length} search + ${listed.length} allowlist, deduped)`
        );
        return out;
      }
    };
  }
});

// ../../packages/core/src/feeds/opire.ts
function tokenize3(text) {
  return text.toLowerCase().replace(/[^a-z0-9.\-+#]/g, " ").split(/\s+/).filter((w) => w.length > 1);
}
function effortFromAmount2(usd) {
  if (usd == null) return void 0;
  if (usd < 150) return "small";
  if (usd < 750) return "medium";
  return "large";
}
function priceToUSD(p) {
  if (!p || typeof p.value !== "number") return void 0;
  if (p.unit === "USD_CENT") return Math.round(p.value) / 100;
  if (p.unit === "USD") return p.value;
  return void 0;
}
function repoFullNameFromUrl(url) {
  const m = url?.match(/github\.com\/([^/]+)\/([^/]+)/i);
  return m ? `${m[1]}/${m[2].replace(/\.git$/, "")}` : void 0;
}
function issueNumberFromUrl(url) {
  const m = url?.match(/\/issues\/(\d+)/);
  return m ? parseInt(m[1], 10) : void 0;
}
var OPIRE_REWARDS_URL, MIN_USD, MAX_USD, MAX_OPIRE_BOUNTIES, REPO_META_CONCURRENCY2, opire;
var init_opire = __esm({
  "../../packages/core/src/feeds/opire.ts"() {
    "use strict";
    init_vocabulary();
    init_bounty_gate();
    init_github_bounties();
    init_http();
    OPIRE_REWARDS_URL = "https://api.opire.dev/rewards";
    MIN_USD = 25;
    MAX_USD = 25e3;
    MAX_OPIRE_BOUNTIES = 100;
    REPO_META_CONCURRENCY2 = 15;
    opire = {
      source: "bounty",
      async fetch() {
        let rewards;
        try {
          const res = await fetchWithTimeout(OPIRE_REWARDS_URL, {
            headers: { Accept: "application/json", "User-Agent": "terminalhire" }
          });
          if (!res.ok) {
            console.warn(`[opire] HTTP ${res.status}`);
            return [];
          }
          const json = await res.json();
          rewards = Array.isArray(json) ? json : json?.data ?? json?.items ?? [];
        } catch (err) {
          console.warn("[opire] fetch failed \u2014", err);
          return [];
        }
        const candidates = [];
        for (const r of rewards) {
          if (r.platform !== "GitHub") continue;
          if (r.project && r.project.isPublic === false) continue;
          const repoFullName = repoFullNameFromUrl(r.project?.url ?? r.url);
          if (!repoFullName) continue;
          const amountUSD = priceToUSD(r.pendingPrice);
          if (amountUSD == null || amountUSD < MIN_USD || amountUSD > MAX_USD) continue;
          const title = (r.title ?? "").trim();
          if (title.length < 4) continue;
          const tags = normalize([...r.programmingLanguages ?? [], ...tokenize3(title)]);
          const bounty = {
            amountUSD,
            estimatedEffort: effortFromAmount2(amountUSD),
            bountySource: "opire",
            claimUrl: r.url,
            repoFullName
          };
          candidates.push({
            repoFullName,
            amountUSD,
            issueNumber: issueNumberFromUrl(r.url),
            bounty,
            job: {
              id: `bounty:opire:${r.id}`,
              source: "bounty",
              title,
              company: r.organization?.name ?? repoFullName.split("/")[0],
              url: r.url,
              remote: true,
              location: "Remote",
              tags,
              roleType: "freelance",
              postedAt: Number.isFinite(r.createdAt) ? new Date(r.createdAt).toISOString() : void 0,
              applyMode: "direct",
              bounty,
              raw: r
            }
          });
        }
        const distinctRepos = [...new Set(candidates.map((c) => c.repoFullName))];
        const meta = /* @__PURE__ */ new Map();
        for (let i = 0; i < distinctRepos.length; i += REPO_META_CONCURRENCY2) {
          const batch = distinctRepos.slice(i, i + REPO_META_CONCURRENCY2);
          const metas = await Promise.all(batch.map((name) => fetchRepoMeta2(name)));
          batch.forEach((name, k) => meta.set(name, metas[k]));
        }
        const gated = [];
        let dropped = 0;
        let ungated = 0;
        for (const c of candidates) {
          const m = meta.get(c.repoFullName);
          if (m) {
            if (!passesMaturityGate(m) || !passesAntiFarm(c.amountUSD, m.stargazers)) {
              dropped++;
              continue;
            }
            c.bounty.repoStars = m.stargazers;
          } else {
            ungated++;
          }
          gated.push(c);
        }
        const issueState = /* @__PURE__ */ new Map();
        for (let i = 0; i < gated.length; i += REPO_META_CONCURRENCY2) {
          const batch = gated.slice(i, i + REPO_META_CONCURRENCY2);
          const states = await Promise.all(
            batch.map(
              (c) => c.issueNumber != null ? fetchIssueState(c.repoFullName, c.issueNumber) : Promise.resolve(null)
            )
          );
          batch.forEach((c, k) => issueState.set(c.job.id, states[k]));
        }
        const jobs = [];
        let closed = 0;
        for (const c of gated) {
          if (jobs.length >= MAX_OPIRE_BOUNTIES) break;
          if (issueState.get(c.job.id) === "closed") {
            closed++;
            continue;
          }
          jobs.push(c.job);
        }
        console.info(
          `[opire] ${jobs.length} bounties (from ${rewards.length} rewards; ${dropped} repo-gated, ${closed} closed-issue, ${ungated} kept ungated)`
        );
        return jobs;
      }
    };
  }
});

// ../../packages/core/src/feeds/workable.ts
function locationStr(loc) {
  if (!loc) return "";
  return [loc.city, loc.country].filter(Boolean).join(", ");
}
function isRemote(j) {
  return j.remote === true || (j.workplace ?? "").toLowerCase() === "remote";
}
function extractTags7(j) {
  const body = [...j.department ?? [], locationStr(j.location)].filter(Boolean).join(" ");
  return extractSkillTags(j.title, body);
}
async function fetchAccount(account) {
  const url = `https://apply.workable.com/api/v3/accounts/${account}/jobs`;
  const out = [];
  let token;
  for (let page = 0; page < MAX_PAGES; page++) {
    let res;
    try {
      res = await fetchWithTimeout(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(token ? { token } : {})
      });
    } catch (err) {
      console.warn(`[workable] ${account}: network error \u2014`, err);
      break;
    }
    if (!res.ok) {
      console.warn(`[workable] ${account}: HTTP ${res.status}`);
      break;
    }
    let data;
    try {
      data = await res.json();
    } catch (err) {
      console.warn(`[workable] ${account}: JSON parse error \u2014`, err);
      break;
    }
    const results = data.results ?? [];
    for (const j of results) {
      if (j.state && j.state !== "published") continue;
      out.push({
        id: `workable:${j.id}`,
        source: "workable",
        title: j.title,
        company: account,
        url: `https://apply.workable.com/${account}/j/${j.shortcode}/`,
        remote: isRemote(j),
        location: locationStr(j.location) || void 0,
        tags: extractTags7(j),
        roleType: "full_time",
        postedAt: j.published,
        applyMode: "direct",
        raw: j
      });
    }
    token = data.token;
    if (!token || results.length === 0) break;
  }
  if (out.length > 0) console.info(`[workable] ${account}: ${out.length} jobs`);
  return out;
}
var FALLBACK_ACCOUNTS, MAX_PAGES, workable;
var init_workable = __esm({
  "../../packages/core/src/feeds/workable.ts"() {
    "use strict";
    init_vocabulary();
    init_http();
    FALLBACK_ACCOUNTS = ["zego", "workmotion"];
    MAX_PAGES = 5;
    workable = {
      source: "workable",
      async fetch(opts) {
        const accounts = opts?.slugs && opts.slugs.length > 0 ? opts.slugs : FALLBACK_ACCOUNTS;
        console.info(`[workable] fetching ${accounts.length} accounts: ${accounts.join(", ")}`);
        const results = await Promise.allSettled(accounts.map(fetchAccount));
        const jobs = [];
        let failures = 0;
        for (const r of results) {
          if (r.status === "fulfilled") {
            jobs.push(...r.value);
          } else {
            failures++;
            console.warn("[workable] account fetch rejected:", r.reason);
          }
        }
        console.info(`[workable] total: ${jobs.length} jobs, ${failures} account failures`);
        return jobs;
      }
    };
  }
});

// ../../packages/core/src/feeds/index.ts
async function aggregateBounties(opts) {
  const [gh, op] = await Promise.all([
    githubBounties.fetch({ slugs: opts?.repos }),
    opire.fetch()
  ]);
  const allowlist = new Set(
    (opts?.repos && opts.repos.length > 0 ? opts.repos : DEFAULT_BOUNTY_REPOS).map(
      (r) => r.toLowerCase()
    )
  );
  const seen = /* @__PURE__ */ new Set();
  const perRepo = /* @__PURE__ */ new Map();
  const seenRepoTitles = /* @__PURE__ */ new Set();
  const out = [];
  for (const j of [...gh, ...op]) {
    const key = j.bounty?.claimUrl ?? j.url;
    if (seen.has(key)) continue;
    const repo = j.bounty?.repoFullName?.toLowerCase();
    if (repo) {
      if (isDenylistedRepo(repo)) continue;
      const titleKey = `${repo} ${normalizeBountyTitle(j.title)}`;
      if (seenRepoTitles.has(titleKey)) continue;
      const cap = allowlist.has(repo) ? MAX_BOUNTIES_PER_REPO : MAX_BOUNTIES_PER_DISCOVERED_REPO;
      const n = perRepo.get(repo) ?? 0;
      if (n >= cap) continue;
      perRepo.set(repo, n + 1);
      seenRepoTitles.add(titleKey);
    }
    seen.add(key);
    out.push(j);
  }
  const repos = [...new Set(out.map((j) => j.bounty?.repoFullName).filter((r) => !!r))];
  const refsByRepo = /* @__PURE__ */ new Map();
  const PR_REFS_CONCURRENCY = 15;
  for (let i = 0; i < repos.length; i += PR_REFS_CONCURRENCY) {
    const batch = repos.slice(i, i + PR_REFS_CONCURRENCY);
    const results = await Promise.all(batch.map((r) => fetchRepoOpenPRRefs(r)));
    batch.forEach((r, k) => refsByRepo.set(r, results[k]));
  }
  for (const j of out) {
    const num = bountyIssueNumber(j.bounty?.claimUrl);
    const refs = j.bounty?.repoFullName ? refsByRepo.get(j.bounty.repoFullName) : void 0;
    if (j.bounty && refs && num != null) j.bounty.competingOpenPRs = refs.get(num) ?? 0;
  }
  return out;
}
function bountyIssueNumber(url) {
  const m = url?.match(/\/issues\/(\d+)/);
  return m ? Number(m[1]) : void 0;
}
function normalizeBountyTitle(title) {
  return title.toLowerCase().replace(/#\d+\s*$/, "").replace(/[^a-z0-9]+/g, " ").trim();
}
function flattenTiers(t) {
  return [.../* @__PURE__ */ new Set([...t.bigco, ...t.scaleup, ...t.startup])];
}
async function aggregate(opts) {
  const ghSlugs = opts?.slugs?.["greenhouse"] ?? DEFAULT_GREENHOUSE_SLUGS;
  const ashbySlugs = opts?.slugs?.["ashby"] ?? DEFAULT_ASHBY_SLUGS;
  const leverSlugs = opts?.slugs?.["lever"] ?? DEFAULT_LEVER_SLUGS;
  const workableSlugs = opts?.slugs?.["workable"] ?? DEFAULT_WORKABLE_SLUGS;
  const limit = opts?.limit ?? 150;
  const settled = await Promise.allSettled([
    greenhouse.fetch({ slugs: ghSlugs, limit }),
    ashby.fetch({ slugs: ashbySlugs, limit }),
    lever.fetch({ slugs: leverSlugs, limit }),
    workable.fetch({ slugs: workableSlugs, limit }),
    himalayas.fetch({ limit }),
    wwr.fetch({ limit }),
    hn.fetch({ limit })
  ]);
  const seen = /* @__PURE__ */ new Set();
  const jobs = [];
  const sourceNames = ["greenhouse", "ashby", "lever", "workable", "himalayas", "wwr", "hn"];
  for (let i = 0; i < settled.length; i++) {
    const result = settled[i];
    if (result.status === "rejected") {
      console.warn(`[feeds] ${sourceNames[i]} failed:`, result.reason);
      continue;
    }
    for (const job of result.value) {
      if (!seen.has(job.id)) {
        seen.add(job.id);
        jobs.push(job);
      }
    }
  }
  if (opts?.includeBounties !== false) {
    try {
      const bounties = await aggregateBounties({ repos: opts?.slugs?.["bounty"] });
      for (const b of bounties) {
        if (!seen.has(b.id)) {
          seen.add(b.id);
          jobs.push(b);
        }
      }
    } catch (err) {
      console.warn("[feeds] bounties failed:", err);
    }
  }
  return jobs;
}
var FEEDS, GREENHOUSE_SLUGS_BY_TIER, ASHBY_SLUGS_BY_TIER, LEVER_SLUGS_BY_TIER, DEFAULT_GREENHOUSE_SLUGS, DEFAULT_ASHBY_SLUGS, DEFAULT_LEVER_SLUGS, DEFAULT_WORKABLE_SLUGS;
var init_feeds = __esm({
  "../../packages/core/src/feeds/index.ts"() {
    "use strict";
    init_greenhouse();
    init_ashby();
    init_lever();
    init_himalayas();
    init_wwr();
    init_hn();
    init_github_bounties();
    init_opire();
    init_workable();
    init_bounty_gate();
    init_bounty_gate();
    FEEDS = [greenhouse, ashby, lever, workable, himalayas, wwr, hn];
    GREENHOUSE_SLUGS_BY_TIER = {
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
    ASHBY_SLUGS_BY_TIER = {
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
    LEVER_SLUGS_BY_TIER = {
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
    DEFAULT_GREENHOUSE_SLUGS = flattenTiers(GREENHOUSE_SLUGS_BY_TIER);
    DEFAULT_ASHBY_SLUGS = flattenTiers(ASHBY_SLUGS_BY_TIER);
    DEFAULT_LEVER_SLUGS = flattenTiers(LEVER_SLUGS_BY_TIER);
    DEFAULT_WORKABLE_SLUGS = ["zego", "workmotion"];
  }
});

// ../../packages/core/src/partners.ts
import { readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
function resolveDataPath() {
  try {
    const dir = fileURLToPath(new URL("../../../data", import.meta.url));
    return join(dir, "partner-roles.json");
  } catch {
    return join(process.cwd(), "data", "partner-roles.json");
  }
}
function loadPartnerRoles() {
  const filePath = resolveDataPath();
  try {
    const raw = readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      console.warn("[partners] partner-roles.json is not an array \u2014 skipping");
      return [];
    }
    const valid = [];
    for (const entry of parsed) {
      const e = entry;
      if (typeof entry === "object" && entry !== null && typeof e.id === "string" && e.applyMode === "buyer-lead" && typeof e.buyer === "string" && e.buyer.length > 0) {
        valid.push(entry);
      } else {
        console.warn("[partners] Skipping malformed role entry:", entry);
      }
    }
    return valid;
  } catch (err) {
    if (err.code === "ENOENT") {
      console.warn(`[partners] data/partner-roles.json not found at ${filePath} \u2014 no partner roles loaded`);
    } else {
      console.warn("[partners] Failed to load partner-roles.json:", err);
    }
    return [];
  }
}
function getBuyer(id) {
  return BUYER_REGISTRY[id];
}
var EXAMPLE_BUYER, BUYER_REGISTRY;
var init_partners = __esm({
  "../../packages/core/src/partners.ts"() {
    "use strict";
    EXAMPLE_BUYER = {
      id: "northstar",
      legalName: "Northstar Talent Partners",
      matchCriteria: { roleTypes: ["full_time"] }
    };
    BUYER_REGISTRY = {
      [EXAMPLE_BUYER.id]: EXAMPLE_BUYER
    };
  }
});

// ../../packages/core/src/indexer.ts
async function buildIndex(opts) {
  const includePartners = opts?.includePartners ?? true;
  const publicJobs = await aggregate(opts);
  const allJobs = [...publicJobs];
  const seen = new Set(publicJobs.map((j) => j.id));
  const partnerJobs = [
    ...includePartners ? loadPartnerRoles() : [],
    ...opts?.partnerRoles ?? []
  ];
  for (const job of partnerJobs) {
    if (!seen.has(job.id)) {
      seen.add(job.id);
      allJobs.push(job);
    }
  }
  const jobs = allJobs.map(({ raw: _raw, ...rest }) => rest);
  return {
    builtAt: (/* @__PURE__ */ new Date()).toISOString(),
    jobs
  };
}
var init_indexer = __esm({
  "../../packages/core/src/indexer.ts"() {
    "use strict";
    init_feeds();
    init_partners();
  }
});

// ../../packages/core/src/index.ts
var src_exports = {};
__export(src_exports, {
  ASHBY_SLUGS_BY_TIER: () => ASHBY_SLUGS_BY_TIER,
  DECAY_FLOOR: () => DECAY_FLOOR,
  DEFAULT_ASHBY_SLUGS: () => DEFAULT_ASHBY_SLUGS,
  DEFAULT_BOUNTY_REPOS: () => DEFAULT_BOUNTY_REPOS,
  DEFAULT_GREENHOUSE_SLUGS: () => DEFAULT_GREENHOUSE_SLUGS,
  DEFAULT_LEVER_SLUGS: () => DEFAULT_LEVER_SLUGS,
  DEFAULT_WORKABLE_SLUGS: () => DEFAULT_WORKABLE_SLUGS,
  EXAMPLE_BUYER: () => EXAMPLE_BUYER,
  FEEDS: () => FEEDS,
  GRAPH: () => GRAPH,
  GREENHOUSE_SLUGS_BY_TIER: () => GREENHOUSE_SLUGS_BY_TIER,
  IDF_BACKGROUND: () => IDF_BACKGROUND,
  LEVER_SLUGS_BY_TIER: () => LEVER_SLUGS_BY_TIER,
  SYNONYMS: () => SYNONYMS,
  VOCABULARY: () => VOCABULARY,
  VOCAB_NODES: () => VOCAB_NODES,
  acceptanceCountForDomains: () => acceptanceCountForDomains,
  aggregate: () => aggregate,
  aggregateBounties: () => aggregateBounties,
  ashby: () => ashby,
  bestAcceptanceDomain: () => bestAcceptanceDomain,
  buildGraph: () => buildGraph,
  buildIndex: () => buildIndex,
  buildReason: () => buildReason,
  computeAcceptanceCredential: () => computeAcceptanceCredential,
  computeAcceptanceCredentialPublic: () => computeAcceptanceCredentialPublic,
  coreTagsFromTitle: () => coreTagsFromTitle,
  deriveResumeTrend: () => deriveResumeTrend,
  expandWeighted: () => expandWeighted,
  extractSkillTags: () => extractSkillTags,
  fetchGitHubProfile: () => fetchGitHubProfile,
  fetchRepoRecency: () => fetchRepoRecency,
  flattenTiers: () => flattenTiers,
  getBuyer: () => getBuyer,
  githubBounties: () => githubBounties,
  githubToFingerprint: () => githubToFingerprint,
  greenhouse: () => greenhouse,
  himalayas: () => himalayas,
  hn: () => hn,
  isBounty: () => isBounty,
  lever: () => lever,
  loadPartnerRoles: () => loadPartnerRoles,
  looksLikeEngRole: () => looksLikeEngRole,
  match: () => match,
  normalize: () => normalize,
  opire: () => opire,
  passesMaturityGate: () => passesMaturityGate,
  tokenize: () => tokenize,
  validateGraph: () => validateGraph,
  workable: () => workable,
  wwr: () => wwr
});
var init_src = __esm({
  "../../packages/core/src/index.ts"() {
    "use strict";
    init_types();
    init_vocabulary();
    init_matcher();
    init_feeds();
    init_indexer();
    init_partners();
    init_github();
  }
});

// src/profile.ts
var profile_exports = {};
__export(profile_exports, {
  accumulateGitHubTags: () => accumulateGitHubTags,
  accumulateSession: () => accumulateSession,
  accumulateTags: () => accumulateTags,
  addSavedJob: () => addSavedJob,
  deleteProfile: () => deleteProfile,
  listSavedJobs: () => listSavedJobs,
  profileToFingerprint: () => profileToFingerprint,
  readProfile: () => readProfile,
  removeSavedJob: () => removeSavedJob,
  writeProfile: () => writeProfile
});
import {
  createCipheriv,
  createDecipheriv,
  randomBytes
} from "crypto";
import {
  readFileSync as readFileSync2,
  writeFileSync,
  mkdirSync,
  existsSync
} from "fs";
import { join as join2 } from "path";
import { homedir } from "os";
async function loadKey() {
  try {
    const kt = await import("keytar");
    const stored = await kt.getPassword("terminalhire", "profile-key");
    if (stored) {
      return Buffer.from(stored, "hex");
    }
    const key2 = randomBytes(KEY_BYTES);
    await kt.setPassword("terminalhire", "profile-key", key2.toString("hex"));
    return key2;
  } catch {
  }
  mkdirSync(TERMINALHIRE_DIR, { recursive: true });
  if (existsSync(KEY_FILE)) {
    return Buffer.from(readFileSync2(KEY_FILE, "utf8").trim(), "hex");
  }
  const key = randomBytes(KEY_BYTES);
  writeFileSync(KEY_FILE, key.toString("hex"), { mode: 384, encoding: "utf8" });
  return key;
}
function encrypt(plaintext, key) {
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv(ALGO, key, iv);
  const ct = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    iv: iv.toString("hex"),
    tag: tag.toString("hex"),
    ciphertext: ct.toString("hex")
  };
}
function decrypt(blob, key) {
  const decipher = createDecipheriv(
    ALGO,
    key,
    Buffer.from(blob.iv, "hex")
  );
  decipher.setAuthTag(Buffer.from(blob.tag, "hex"));
  const plain = Buffer.concat([
    decipher.update(Buffer.from(blob.ciphertext, "hex")),
    decipher.final()
  ]);
  return plain.toString("utf8");
}
function blankProfile() {
  return {
    version: 3,
    skillTags: [],
    tagWeights: {},
    hasEmployerSessions: false,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
}
function recencyDecay(lastSeen) {
  const ageMs = Date.now() - new Date(lastSeen).getTime();
  return Math.pow(0.5, ageMs / DECAY_HALF_LIFE_MS);
}
function tagScore(w) {
  return w.count * recencyDecay(w.lastSeen);
}
function deriveSkillTags(tagWeights) {
  return Object.entries(tagWeights).filter(([, w]) => w.count >= 1).sort(([, a], [, b]) => tagScore(b) - tagScore(a)).map(([tag]) => tag);
}
function migrateTagWeights(profile) {
  if (!profile.tagWeights) {
    profile.tagWeights = {};
  }
  const seed = profile.updatedAt ?? (/* @__PURE__ */ new Date()).toISOString();
  for (const tag of profile.skillTags) {
    if (!profile.tagWeights[tag]) {
      profile.tagWeights[tag] = { count: 1, firstSeen: seed, lastSeen: seed, sessions: 1 };
    }
  }
}
async function readProfile() {
  if (!existsSync(PROFILE_FILE)) return blankProfile();
  try {
    const key = await loadKey();
    const raw = readFileSync2(PROFILE_FILE, "utf8");
    const blob = JSON.parse(raw);
    const plaintext = decrypt(blob, key);
    const parsed = JSON.parse(plaintext);
    migrateTagWeights(parsed);
    return parsed;
  } catch {
    return blankProfile();
  }
}
async function writeProfile(profile) {
  mkdirSync(TERMINALHIRE_DIR, { recursive: true });
  const key = await loadKey();
  profile.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
  profile.skillTags = deriveSkillTags(profile.tagWeights);
  const blob = encrypt(JSON.stringify(profile), key);
  writeFileSync(PROFILE_FILE, JSON.stringify(blob, null, 2), { encoding: "utf8" });
}
function accumulateSession(profile, tags, isEmployerContext2, inferredSeniority, seniorityIsAuthoritative = false) {
  const now = (/* @__PURE__ */ new Date()).toISOString();
  let filtered = normalize(tags);
  if (isEmployerContext2) {
    filtered = filtered.filter((t) => LANGUAGE_TAGS.has(t));
    profile.hasEmployerSessions = true;
  }
  for (const tag of filtered) {
    const existing = profile.tagWeights[tag];
    if (existing) {
      existing.count += 1;
      existing.sessions += 1;
      existing.lastSeen = now;
    } else {
      profile.tagWeights[tag] = { count: 1, firstSeen: now, lastSeen: now, sessions: 1 };
    }
  }
  if (inferredSeniority && !isEmployerContext2) {
    if (seniorityIsAuthoritative || !profile.github) {
      profile.seniority = inferredSeniority;
    }
  }
}
async function accumulateTags(rawTokens, isEmployerContext2, inferredSeniority) {
  const profile = await readProfile();
  accumulateSession(profile, rawTokens, isEmployerContext2, inferredSeniority);
  await writeProfile(profile);
}
function accumulateGitHubTags(profile, tags, inferredSeniority) {
  accumulateSession(
    profile,
    tags,
    /* isEmployerContext */
    false,
    inferredSeniority,
    true
  );
}
async function listSavedJobs() {
  const profile = await readProfile();
  return profile.savedJobs ?? [];
}
async function addSavedJob(job) {
  const profile = await readProfile();
  const existing = profile.savedJobs ?? [];
  const filtered = existing.filter((j) => j.id !== job.id);
  profile.savedJobs = [...filtered, { ...job, savedAt: (/* @__PURE__ */ new Date()).toISOString() }];
  await writeProfile(profile);
}
async function removeSavedJob(id) {
  const profile = await readProfile();
  const existing = profile.savedJobs ?? [];
  const filtered = existing.filter((j) => j.id !== id);
  if (filtered.length === existing.length) return false;
  profile.savedJobs = filtered;
  await writeProfile(profile);
  return true;
}
async function deleteProfile() {
  const { rmSync } = await import("fs");
  try {
    rmSync(PROFILE_FILE);
  } catch {
  }
  try {
    rmSync(KEY_FILE);
  } catch {
  }
}
function profileToFingerprint(profile) {
  const rankedTags = Object.entries(profile.tagWeights).map(([tag, w]) => ({ tag, score: tagScore(w) })).filter(({ score }) => score >= MIN_FINGERPRINT_SCORE).sort((a, b) => b.score - a.score).map(({ tag }) => tag);
  const skillTags = rankedTags.length > 0 ? rankedTags : profile.skillTags;
  return {
    skillTags,
    seniorityBand: profile.seniority,
    prefs: {
      roleTypes: profile.roleTypes,
      remoteOnly: profile.remoteOnly,
      compFloorUsd: profile.compFloorUsd
    }
  };
}
var TERMINALHIRE_DIR, PROFILE_FILE, KEY_FILE, ALGO, KEY_BYTES, IV_BYTES, DECAY_HALF_LIFE_MS, LANGUAGE_TAGS, MIN_FINGERPRINT_SCORE;
var init_profile = __esm({
  "src/profile.ts"() {
    "use strict";
    init_src();
    TERMINALHIRE_DIR = join2(homedir(), ".terminalhire");
    PROFILE_FILE = join2(TERMINALHIRE_DIR, "profile.enc");
    KEY_FILE = join2(TERMINALHIRE_DIR, "key");
    ALGO = "aes-256-gcm";
    KEY_BYTES = 32;
    IV_BYTES = 12;
    DECAY_HALF_LIFE_MS = 30 * 24 * 60 * 60 * 1e3;
    LANGUAGE_TAGS = /* @__PURE__ */ new Set([
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
    MIN_FINGERPRINT_SCORE = 0.05;
  }
});

// bin/spinner.js
var spinner_exports = {};
__export(spinner_exports, {
  SPINNER_DEFAULTS: () => SPINNER_DEFAULTS,
  applySpinnerTips: () => applySpinnerTips,
  applySpinnerVerbs: () => applySpinnerVerbs,
  buildContextVerbs: () => buildContextVerbs,
  buildSpinnerPool: () => buildSpinnerPool,
  buildTips: () => buildTips,
  clearSpinnerTips: () => clearSpinnerTips,
  clearSpinnerVerbs: () => clearSpinnerVerbs,
  ctaVerb: () => ctaVerb,
  formatVerbs: () => formatVerbs,
  interleaveBySource: () => interleaveBySource,
  rankBySessionTags: () => rankBySessionTags,
  readSpinnerConfig: () => readSpinnerConfig
});
import {
  readFileSync as readFileSync3,
  writeFileSync as writeFileSync2,
  existsSync as existsSync2,
  mkdirSync as mkdirSync2,
  renameSync
} from "fs";
import { join as join3, dirname } from "path";
import { homedir as homedir2 } from "os";
function readJson(path, fallback) {
  try {
    return existsSync2(path) ? JSON.parse(readFileSync3(path, "utf8")) : fallback;
  } catch {
    return fallback;
  }
}
function atomicWriteJson(path, obj) {
  mkdirSync2(dirname(path), { recursive: true });
  const tmp = `${path}.tmp-${process.pid}`;
  writeFileSync2(tmp, JSON.stringify(obj, null, 2) + "\n", "utf8");
  renameSync(tmp, path);
}
function titleCase(s) {
  return String(s || "").replace(/\b\w/g, (c) => c.toUpperCase());
}
function readSpinnerConfig() {
  const cfg = readJson(CONFIG_FILE, {});
  const spinner = cfg && typeof cfg.spinner === "object" ? cfg.spinner : {};
  const merged = { ...SPINNER_DEFAULTS, ...spinner };
  if (merged.mode !== "append" && merged.mode !== "replace") merged.mode = SPINNER_DEFAULTS.mode;
  merged.max = Math.max(1, Math.min(12, Number(merged.max) || SPINNER_DEFAULTS.max));
  merged.enabled = merged.enabled === true;
  if (!["always", "sometimes", "rare"].includes(merged.frequency)) {
    merged.frequency = SPINNER_DEFAULTS.frequency;
  }
  return merged;
}
function ctaVerb() {
  return "\u2605 jobs that fit you \xB7 run: terminalhire jobs";
}
function formatVerbs(topMatches, max = 6) {
  const out = [];
  const seen = /* @__PURE__ */ new Set();
  for (const m of Array.isArray(topMatches) ? topMatches : []) {
    if (!m || !m.title || !m.company) continue;
    let title = String(m.title).trim().replace(/\s+/g, " ");
    if (title.length > 32) title = title.slice(0, 31).trimEnd() + "\u2026";
    const company = titleCase(String(m.company).trim().replace(/\s+/g, " "));
    const pct = Math.max(1, Math.min(99, Math.round((Number(m.score) || 0) * 100)));
    const key = `${title.toLowerCase()}@${company.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const intro = VERB_INTROS[out.length % VERB_INTROS.length];
    out.push(`${intro} ${title} @ ${company} \xB7 ${pct}% match`);
    if (out.length >= max) break;
  }
  return out;
}
function rankBySessionTags(topMatches, sessionTags) {
  const tags = Array.isArray(sessionTags) ? sessionTags.filter(Boolean) : [];
  if (tags.length === 0 || !Array.isArray(topMatches)) return topMatches;
  const normalized = tags.map((t) => String(t).toLowerCase().trim());
  return topMatches.map((m, originalIndex) => {
    const haystack = `${String(m.title || "").toLowerCase()} ${String(m.company || "").toLowerCase()}`;
    const hits = normalized.reduce((n, tag) => n + (haystack.includes(tag) ? 1 : 0), 0);
    return { m, hits, originalIndex };
  }).sort((a, b) => b.hits - a.hits || a.originalIndex - b.originalIndex).map(({ m }) => m);
}
function verbCountForFrequency(frequency, max) {
  switch (frequency) {
    case "always":
      return max;
    case "rare":
      return 1;
    case "sometimes":
    default:
      return 2;
  }
}
function buildContextVerbs(topMatches, sessionTags) {
  const sess = (Array.isArray(sessionTags) ? sessionTags : []).map((t) => String(t).toLowerCase().trim()).filter(Boolean);
  const roleTags = /* @__PURE__ */ new Set();
  for (const m of Array.isArray(topMatches) ? topMatches : []) {
    const mt = m && Array.isArray(m.matchedTags) ? m.matchedTags : [];
    for (const t of mt) roleTags.add(String(t).toLowerCase().trim());
  }
  const overlap = [];
  for (const t of sess) {
    if (roleTags.has(t) && !overlap.includes(t)) overlap.push(t);
  }
  let headers;
  if (overlap.length >= 2) {
    const a = titleCase(overlap[0]);
    const b = titleCase(overlap[1]);
    headers = [`\u2726 Fits your ${a} + ${b} work`, `\u2726 A match for what you're building \u2014 link below`];
  } else if (overlap.length === 1) {
    const a = titleCase(overlap[0]);
    headers = [`\u2726 Work in your ${a} stack \u2014 link below`, `\u2726 Your ${a} work \u2014 link in the tip below`];
  } else {
    headers = [`\u2726 Work that fits your stack`, `\u2726 A match for you \u2014 link in the tip below`];
  }
  const list = Array.isArray(topMatches) ? topMatches : [];
  const hasBounty = list.some((m) => m && m.source === "bounty");
  if (hasBounty) headers.push(`\u2726 Roles + \u{1F48E} paid bounties in your stack \u2014 link below`);
  return headers;
}
function buildSpinnerPool(topMatches, max = 6, opts = {}) {
  const { sessionTags, frequency = "always" } = opts;
  const ranked = rankBySessionTags(topMatches, sessionTags);
  if (!Array.isArray(ranked) || ranked.length === 0) return [];
  const headers = buildContextVerbs(ranked, sessionTags);
  const cap = Math.max(1, verbCountForFrequency(frequency, headers.length));
  return [...headers.slice(0, cap), ctaVerb()];
}
function readState() {
  return readJson(SPINNER_STATE_FILE, { verbs: [], mode: "replace" });
}
function applySpinnerVerbs(ourVerbs, mode = "replace") {
  const verbs = (Array.isArray(ourVerbs) ? ourVerbs : []).filter(Boolean);
  if (verbs.length === 0) return clearSpinnerVerbs();
  const settings = readJson(CLAUDE_SETTINGS, {}) || {};
  const existing = settings.spinnerVerbs && typeof settings.spinnerVerbs === "object" ? settings.spinnerVerbs : null;
  const prevOurs = new Set(readState().verbs || []);
  const userVerbs = existing && Array.isArray(existing.verbs) ? existing.verbs.filter((v) => !prevOurs.has(v)) : [];
  const newVerbs = [...verbs, ...userVerbs];
  settings.spinnerVerbs = { mode: mode === "append" ? "append" : "replace", verbs: newVerbs };
  atomicWriteJson(CLAUDE_SETTINGS, settings);
  const st = readState();
  atomicWriteJson(SPINNER_STATE_FILE, { ...st, verbs, mode, ts: Date.now() });
  return { applied: verbs.length, total: newVerbs.length };
}
function clearSpinnerVerbs() {
  const settings = readJson(CLAUDE_SETTINGS, null);
  const prevOurs = new Set(readState().verbs || []);
  let keptUserVerbs = 0;
  if (settings && settings.spinnerVerbs && Array.isArray(settings.spinnerVerbs.verbs)) {
    const userVerbs = settings.spinnerVerbs.verbs.filter((v) => !prevOurs.has(v));
    keptUserVerbs = userVerbs.length;
    if (userVerbs.length > 0) {
      settings.spinnerVerbs = {
        mode: settings.spinnerVerbs.mode === "append" ? "append" : "replace",
        verbs: userVerbs
      };
    } else {
      delete settings.spinnerVerbs;
    }
    atomicWriteJson(CLAUDE_SETTINGS, settings);
  }
  try {
    const st = readState();
    atomicWriteJson(SPINNER_STATE_FILE, { ...st, verbs: [], mode: st.mode || "replace", ts: Date.now() });
  } catch {
  }
  return { cleared: true, keptUserVerbs };
}
function interleaveBySource(topMatches) {
  if (!Array.isArray(topMatches) || topMatches.length === 0) return topMatches;
  const buckets = /* @__PURE__ */ new Map();
  const order = [];
  for (const m of topMatches) {
    const id = m && m.id ? String(m.id) : "";
    const idx = id.indexOf(":");
    const source = idx > 0 ? id.slice(0, idx) : "_";
    if (!buckets.has(source)) {
      buckets.set(source, []);
      order.push(source);
    }
    buckets.get(source).push(m);
  }
  const out = [];
  let remaining = topMatches.length;
  while (remaining > 0) {
    for (const source of order) {
      const b = buckets.get(source);
      if (b && b.length) {
        out.push(b.shift());
        remaining--;
      }
    }
  }
  return out;
}
function buildTips(topMatches, baseUrl, max = 8) {
  const base = String(baseUrl || "https://terminalhire.com").replace(/\/+$/, "");
  const out = [];
  const seenRole = /* @__PURE__ */ new Set();
  const perCompany = /* @__PURE__ */ new Map();
  const COMPANY_CAP = 2;
  const all = Array.isArray(topMatches) ? topMatches : [];
  const bountyQ = all.filter((m) => m && m.source === "bounty");
  const roleQ = interleaveBySource(all.filter((m) => m && m.source !== "bounty"));
  const ordered = [];
  let bi = 0;
  let ri = 0;
  while (bi < bountyQ.length || ri < roleQ.length) {
    if (ri < roleQ.length) ordered.push(roleQ[ri++]);
    if (bi < bountyQ.length) ordered.push(bountyQ[bi++]);
  }
  for (const m of ordered) {
    if (!m || !m.title || !m.company || !m.id) continue;
    const idx = String(m.id).indexOf(":");
    if (idx <= 0) continue;
    const source = String(m.id).slice(0, idx);
    const ext = String(m.id).slice(idx + 1);
    if (!source || !ext) continue;
    const companyRaw = String(m.company).trim().replace(/\s+/g, " ");
    const titleRaw = String(m.title).trim().replace(/\s+/g, " ");
    const roleKey = `${titleRaw.toLowerCase()}@${companyRaw.toLowerCase()}`;
    const coKey = companyRaw.toLowerCase();
    if (seenRole.has(roleKey)) continue;
    if ((perCompany.get(coKey) || 0) >= COMPANY_CAP) continue;
    seenRole.add(roleKey);
    perCompany.set(coKey, (perCompany.get(coKey) || 0) + 1);
    let title = titleRaw;
    if (title.length > 34) title = title.slice(0, 33).trimEnd() + "\u2026";
    const company = titleCase(companyRaw);
    const pct = Math.max(1, Math.min(99, Math.round((Number(m.score) || 0) * 100)));
    const token = Buffer.from(String(m.id)).toString("base64url");
    const url = `${base}/j/${token}`;
    if (source === "bounty") {
      const money = m.amountUSD != null ? `$${Number(m.amountUSD).toLocaleString()}` : "$\u2014";
      const repo = m.repo || companyRaw;
      out.push(`\u{1F48E} ${money} \xB7 ${title} \xB7 ${repo} \xB7 ${pct}% \u2014 ${url}`);
    } else {
      out.push(`\u2197 ${title} @ ${company} \xB7 ${pct}% \u2014 ${url}`);
    }
    if (out.length >= max) break;
  }
  return out;
}
function applySpinnerTips(ourTips) {
  const tips = (Array.isArray(ourTips) ? ourTips : []).filter(Boolean);
  if (tips.length === 0) return clearSpinnerTips();
  const settings = readJson(CLAUDE_SETTINGS, {}) || {};
  const existing = settings.spinnerTipsOverride && Array.isArray(settings.spinnerTipsOverride.tips) ? settings.spinnerTipsOverride.tips : [];
  const prevOurs = new Set(readState().tips || []);
  const userTips = existing.filter((t) => !prevOurs.has(t));
  settings.spinnerTipsEnabled = true;
  settings.spinnerTipsOverride = { excludeDefault: true, tips: [...tips, ...userTips] };
  atomicWriteJson(CLAUDE_SETTINGS, settings);
  const st = readState();
  atomicWriteJson(SPINNER_STATE_FILE, { ...st, tips, ts: Date.now() });
  return { applied: tips.length };
}
function clearSpinnerTips() {
  const settings = readJson(CLAUDE_SETTINGS, null);
  const prevOurs = new Set(readState().tips || []);
  if (settings && settings.spinnerTipsOverride && Array.isArray(settings.spinnerTipsOverride.tips)) {
    const userTips = settings.spinnerTipsOverride.tips.filter((t) => !prevOurs.has(t));
    if (userTips.length > 0) {
      settings.spinnerTipsOverride = {
        excludeDefault: settings.spinnerTipsOverride.excludeDefault === true,
        tips: userTips
      };
    } else {
      delete settings.spinnerTipsOverride;
      delete settings.spinnerTipsEnabled;
    }
    atomicWriteJson(CLAUDE_SETTINGS, settings);
  }
  try {
    const st = readState();
    atomicWriteJson(SPINNER_STATE_FILE, { ...st, tips: [], ts: Date.now() });
  } catch {
  }
  return { cleared: true };
}
var TH_DIR, CLAUDE_SETTINGS, CONFIG_FILE, SPINNER_STATE_FILE, SPINNER_DEFAULTS, VERB_INTROS;
var init_spinner = __esm({
  "bin/spinner.js"() {
    "use strict";
    TH_DIR = process.env["TERMINALHIRE_DIR"] || join3(homedir2(), ".terminalhire");
    CLAUDE_SETTINGS = process.env["TERMINALHIRE_CLAUDE_SETTINGS"] || join3(homedir2(), ".claude", "settings.json");
    CONFIG_FILE = join3(TH_DIR, "config.json");
    SPINNER_STATE_FILE = join3(TH_DIR, "spinner-state.json");
    SPINNER_DEFAULTS = { enabled: false, mode: "append", max: 6, frequency: "sometimes" };
    VERB_INTROS = ["Matched:", "You\u2019d fit:", "Worth a look:", "On your radar:", "Fits your stack:"];
  }
});

// src/signal.ts
var signal_exports = {};
__export(signal_exports, {
  extractFingerprint: () => extractFingerprint
});
import { readFileSync as readFileSync4, readdirSync } from "fs";
import { execFileSync } from "child_process";
import { join as join4 } from "path";
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
    return JSON.parse(readFileSync4(path, "utf8"));
  } catch {
    return null;
  }
}
function readFileSafe(path) {
  try {
    return readFileSync4(path, "utf8");
  } catch {
    return "";
  }
}
function tokensFromPackageJson(cwd) {
  const pkg = readJsonSafe(join4(cwd, "package.json"));
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
      const groupDir = join4(cwd, group);
      for (const e of readdirSync(groupDir, { withFileTypes: true })) {
        if (e.isDirectory() && !e.isSymbolicLink()) dirs.push(join4(groupDir, e.name));
      }
    } catch {
    }
  }
  return dirs;
}
function tokensFromRequirementsTxt(cwd) {
  const content = readFileSafe(join4(cwd, "requirements.txt"));
  if (!content) return [];
  return content.split("\n").map((l) => l.trim().split(/[>=<!\[;]/)[0].trim().toLowerCase()).filter(Boolean);
}
function tokensFromGoMod(cwd) {
  const content = readFileSafe(join4(cwd, "go.mod"));
  if (!content) return [];
  const requires = Array.from(content.matchAll(/^\s+([^\s]+)\s+v/gm)).map((m) => m[1].split("/").pop() ?? "").filter(Boolean);
  return ["go", ...requires];
}
function tokensFromCargoToml(cwd) {
  const content = readFileSafe(join4(cwd, "Cargo.toml"));
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
    const srcDir = join4(cwd, "src");
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
function inferSeniority3(rawTokens) {
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
    skillTags = skillTags.filter((t) => LANGUAGE_TAGS2.has(t));
  }
  const seniorityBand = employer ? void 0 : inferSeniority3(rawTokens);
  return {
    skillTags,
    seniorityBand,
    employerContext: employer
  };
}
var LANGUAGE_TAGS2, EXT_MAP, PERSONAL_GIT_HOSTS, PERSONAL_EMAIL_DOMAINS;
var init_signal = __esm({
  "src/signal.ts"() {
    "use strict";
    init_src();
    LANGUAGE_TAGS2 = /* @__PURE__ */ new Set([
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
    EXT_MAP = {
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
    PERSONAL_GIT_HOSTS = /* @__PURE__ */ new Set([
      "github.com",
      "gitlab.com",
      "bitbucket.org",
      "codeberg.org",
      "sr.ht"
    ]);
    PERSONAL_EMAIL_DOMAINS = /* @__PURE__ */ new Set([
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
  }
});

// bin/jpi-refresh.js
import { readFileSync as readFileSync5, writeFileSync as writeFileSync3, existsSync as existsSync3, mkdirSync as mkdirSync3 } from "fs";
import { join as join5 } from "path";
import { homedir as homedir3 } from "os";
import { fileURLToPath as fileURLToPath2 } from "url";
var __dirname = fileURLToPath2(new URL(".", import.meta.url));
var TERMINALHIRE_DIR2 = join5(homedir3(), ".terminalhire");
var INDEX_CACHE_FILE = join5(TERMINALHIRE_DIR2, "index-cache.json");
var API_URL = process.env["TERMINALHIRE_API_URL"] ?? process.env["JPI_API_URL"] ?? "https://terminalhire.com";
async function run() {
  try {
    let index;
    try {
      const res = await fetch(`${API_URL}/api/index`, {
        signal: AbortSignal.timeout(15e3),
        headers: { "Accept": "application/json" }
      });
      if (!res.ok) {
        process.stderr.write(`terminalhire refresh: index fetch failed (HTTP ${res.status})
`);
        process.exit(1);
      }
      index = await res.json();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      process.stderr.write(`terminalhire refresh: fetch error \u2014 ${msg}
`);
      process.exit(1);
    }
    const jobs = index?.jobs ?? [];
    let matchCount = 0;
    let topMatches = [];
    try {
      const { readProfile: readProfile2, profileToFingerprint: profileToFingerprint2 } = await Promise.resolve().then(() => (init_profile(), profile_exports));
      const { match: match2 } = await Promise.resolve().then(() => (init_src(), src_exports));
      const profile = await readProfile2();
      if (profile.skillTags.length > 0 && jobs.length > 0) {
        const fp = profileToFingerprint2(profile);
        const results = match2(fp, jobs, jobs.length);
        matchCount = results.length;
        const BOUNTY_SLOTS = 5;
        const bountyMatches = results.filter((r) => r.job.source === "bounty");
        const rot = bountyMatches.length > 0 ? Math.floor(Date.now() / (5 * 60 * 1e3)) % bountyMatches.length : 0;
        const bountyTop = [...bountyMatches.slice(rot), ...bountyMatches.slice(0, rot)].slice(0, BOUNTY_SLOTS);
        const roleTop = results.filter((r) => r.job.source !== "bounty").slice(0, 25 - bountyTop.length);
        topMatches = [...roleTop, ...bountyTop].map((r) => ({
          id: r.job.id,
          title: r.job.title,
          company: r.job.company,
          score: r.score,
          remote: r.job.remote,
          matchedTags: r.matchedTags,
          // Bounty fields so the spinner can render bounty framing ($ + 💎).
          // Public job text, stays LOCAL (same as the rest of topMatches).
          source: r.job.source,
          amountUSD: r.job.bounty?.amountUSD,
          repo: r.job.bounty?.repoFullName
        }));
      }
    } catch {
    }
    mkdirSync3(TERMINALHIRE_DIR2, { recursive: true });
    const cacheEntry = {
      ts: Date.now(),
      index,
      matchCount,
      topMatches
    };
    writeFileSync3(INDEX_CACHE_FILE, JSON.stringify(cacheEntry), "utf8");
    try {
      const {
        readSpinnerConfig: readSpinnerConfig2,
        buildSpinnerPool: buildSpinnerPool2,
        applySpinnerVerbs: applySpinnerVerbs2,
        clearSpinnerVerbs: clearSpinnerVerbs2,
        buildTips: buildTips2,
        applySpinnerTips: applySpinnerTips2,
        clearSpinnerTips: clearSpinnerTips2,
        rankBySessionTags: rankBySessionTags2
      } = await Promise.resolve().then(() => (init_spinner(), spinner_exports));
      const sc = readSpinnerConfig2();
      if (sc.enabled) {
        let sessionTags;
        try {
          const { extractFingerprint: extractFingerprint2 } = await Promise.resolve().then(() => (init_signal(), signal_exports));
          const fp = extractFingerprint2(process.cwd());
          if (Array.isArray(fp.skillTags) && fp.skillTags.length > 0) {
            sessionTags = fp.skillTags;
          }
        } catch {
        }
        const ranked = rankBySessionTags2(topMatches, sessionTags);
        const verbs = buildSpinnerPool2(ranked, sc.max, { sessionTags, frequency: sc.frequency });
        if (verbs.length > 0) applySpinnerVerbs2(verbs, sc.mode);
        else clearSpinnerVerbs2();
        const tips = buildTips2(ranked, API_URL, 8);
        if (tips.length > 0) applySpinnerTips2(tips);
        else clearSpinnerTips2();
      } else {
        clearSpinnerVerbs2();
        clearSpinnerTips2();
      }
    } catch {
    }
    process.exit(0);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    process.stderr.write(`terminalhire refresh: unexpected error \u2014 ${msg}
`);
    process.exit(1);
  }
}
export {
  run
};
