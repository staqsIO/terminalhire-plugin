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
function isContribution(job) {
  return job.source === "contribute" && job.contribution != null;
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
      { id: "agents", parents: ["llm"], synonyms: ["agentic", "ai-agents", "multi-agent", "agent-orchestration"], related: [{ to: "rag", w: 0.4 }] },
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
  const add2 = (from, to, w) => {
    let m = adj.get(from);
    if (!m) adj.set(from, m = /* @__PURE__ */ new Map());
    if (w > (m.get(to) ?? 0)) m.set(to, w);
  };
  for (const n of nodes) {
    for (const p of n.parents ?? []) {
      add2(n.id, p, PARENT_UP);
      add2(p, n.id, PARENT_DOWN);
    }
    for (const e of n.related ?? []) {
      add2(n.id, e.to, e.w);
      add2(e.to, n.id, e.w);
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
    const synGate = AMBIGUOUS_SYNONYM[tok] ?? AMBIGUOUS_SYNONYM[tok.replace(/^[.\-+#]+|[.\-+#]+$/g, "")];
    if (synGate && r.id === synGate.id) {
      if (synGate.cue.test(text)) ids.add(r.id);
      continue;
    }
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
var SOFT_DOMAIN, SYNONYM_ONLY, NON_EXTRACTABLE, AMBIGUOUS, AMBIGUOUS_SYNONYM, ENG_INTENT, NON_ENG_TITLE;
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
    AMBIGUOUS_SYNONYM = {
      // "prompt" is the LLM skill only in AI context. In raw JD prose it is "prompt
      // delivery / response / payment / communication / attention". Accept only with
      // the explicit "prompt engineering" phrase OR an LLM/AI ecosystem cue; the cue
      // deliberately excludes the bare word "prompt(s)" itself so it can't self-satisfy.
      prompt: {
        id: "prompt-engineering",
        cue: /\bprompt[\s-]?engineer(?:ing|s)?\b|\b(llms?|gpt-?[0-9o]*|claude|gemini|llama|mistral|openai|anthropic|langchain|llama[\s-]?index|rag|retrieval[\s-]?augmented|embeddings?|fine[\s-]?tun(?:e|ed|ing)|vector[\s-]?(?:db|database|store)|agentic|ai agents?|chatbots?|generative ai|gen[\s-]?ai|genai|few[\s-]?shot|zero[\s-]?shot)\b/i
      }
      // Plan-061 note: the AI-eng generic words (orchestration/evals/evaluation/guardrails/
      // governance) were briefly added as raw agents/llm synonyms, but `normalize()` — the
      // context-free firewall shared by the declaration path AND the GitHub bounty/
      // contribution feeds — resolves synonyms with NO cue, so those words false-mined
      // agents/llm from ordinary infra/SRE prose on every normalize() caller. A cue gate
      // here only covers extractSkillTags(), not normalize(). Fix: they are NOT graph
      // synonyms at all (see graph.data.ts) → they fall to the 3-tier SOFT/novel bucket,
      // which is exactly where ambiguous, uncategorizable words belong. Nothing to gate.
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

// ../../packages/core/src/vocab/classify.ts
function editDistance(a, b, max) {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const prev = new Array(b.length + 1);
  const cur = new Array(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;
  for (let i = 1; i <= a.length; i++) {
    cur[0] = i;
    let rowMin = cur[0];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      if (cur[j] < rowMin) rowMin = cur[j];
    }
    if (rowMin > max) return max + 1;
    for (let j = 0; j <= b.length; j++) prev[j] = cur[j];
  }
  return prev[b.length];
}
function canonicalOf(surface, graph) {
  if (graph.ids.has(surface)) return surface;
  return graph.synonyms.get(surface);
}
function nearBudget(len) {
  if (len <= 3) return 0;
  if (len <= 6) return 1;
  return 2;
}
function classifyToken(raw, graph = GRAPH) {
  const token = String(raw ?? "").toLowerCase().trim();
  const exact = canonicalOf(token, graph);
  if (exact) return { raw: token, tier: "matched", canonical: exact };
  const budget = nearBudget(token.length);
  if (budget > 0) {
    let bestSurface;
    let bestDist = budget + 1;
    const consider = (surface) => {
      const d = editDistance(token, surface, budget);
      if (d <= budget && (d < bestDist || d === bestDist && bestSurface !== void 0 && (surface.length < bestSurface.length || surface.length === bestSurface.length && surface < bestSurface))) {
        bestDist = d;
        bestSurface = surface;
      }
    };
    for (const id of graph.ids) consider(id);
    for (const alias of graph.synonyms.keys()) consider(alias);
    if (bestSurface !== void 0) {
      const suggestion = canonicalOf(bestSurface, graph);
      if (suggestion) return { raw: token, tier: "near-miss", suggestion };
    }
  }
  return { raw: token, tier: "novel", soft: token };
}
function classifyTokens(raws, graph = GRAPH) {
  return raws.map((r) => classifyToken(r, graph));
}
var init_classify = __esm({
  "../../packages/core/src/vocab/classify.ts"() {
    "use strict";
    init_vocab();
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
function getAdjacentTags(tag, hops = 1, graph = GRAPH) {
  const lower = String(tag ?? "").toLowerCase().trim();
  const id = graph.ids.has(lower) ? lower : graph.synonyms.get(lower);
  if (!id) return [];
  const oneHop = (source) => {
    const out = [];
    for (const [to, edge] of graph.closure.get(source) ?? []) {
      if (edge.via === to) out.push([to, edge.w]);
    }
    return out;
  };
  const byWeightThenId = (a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1);
  const ring1 = oneHop(id).sort(byWeightThenId);
  if (hops === 1) return ring1.map(([to]) => to);
  const exclude = /* @__PURE__ */ new Set([id, ...ring1.map(([to]) => to)]);
  const best = /* @__PURE__ */ new Map();
  for (const [n, w1] of ring1) {
    for (const [to, w2] of oneHop(n)) {
      if (exclude.has(to)) continue;
      const w = w1 * w2;
      if (w > (best.get(to) ?? 0)) best.set(to, w);
    }
  }
  return [...best.entries()].sort(byWeightThenId).map(([to]) => to);
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
    init_classify();
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

// ../../packages/core/src/feeds/bounty-gate.ts
function isExcludedRepo(fullName) {
  return EXCLUDED_LC.has(fullName.toLowerCase());
}
function isAiBanRepo(fullName) {
  const lc = fullName.toLowerCase();
  const owner = lc.split("/")[0];
  return AI_BAN_LC.has(lc) || AI_BAN_LC.has(owner);
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
  if (isExcludedRepo(repo.fullName)) return false;
  if (isAiBanRepo(repo.fullName)) return false;
  if (repo.archived || repo.disabled) return false;
  if (repo.stargazers < MIN_REPO_STARS) return false;
  if (ageDays(repo.createdAt) < MIN_REPO_AGE_DAYS) return false;
  return true;
}
var DEFAULT_BOUNTY_REPOS, FARM_REPO_DENYLIST, CURATION_EXCLUDED_REPOS, EXCLUDED_LC, AI_BAN_DENYLIST, AI_BAN_LC, MAX_BOUNTIES_PER_REPO, MAX_BOUNTIES_PER_DISCOVERED_REPO, MIN_REPO_STARS, HIGH_VALUE_USD, HIGH_VALUE_MIN_STARS, MIN_REPO_AGE_DAYS;
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
      "ucfopen/Obojobo",
      "moorcheh-ai/memanto",
      "PrismarineJS/mineflayer"
    ];
    FARM_REPO_DENYLIST = [
      "SecureBananaLabs/bug-bounty",
      // Meta-farm: a bounty PLATFORM whose own issues are an assignment-gated
      // contributor queue ("please assign me, my chief") — an unsolicited PR won't
      // merge, so it's not a real claimable bounty. Not structurally derivable from
      // any fetched field, so it's a manual entry (also dropped from the allowlist).
      "boundlessfi/boundless"
    ];
    CURATION_EXCLUDED_REPOS = [
      // Owner call, asked twice: "get rid of that particular project — I hate it as the
      // example." Excluded at the REPO level because that is the ONLY level at which
      // "don't feature this project" is expressible: projectCuration emits any repo with
      // >= 1 winnable issue.
      //
      // To be clear about what this repo is, since it sits next to a farm list: kana-dojo
      // is NOT a farm. Measured live 2026-07-17 — 2,960 stars, active, 113 open issues, of
      // which 58 are genuine substantive bug reports ("年 Onyomi incorrectly displayed as
      // 'れン'", "Unable to install app as PWA"). The other 55 are a bot's templated
      // "[Good First Issue] <emoji> Add new <NOUN> [N] - Beginner-Friendly Open-source
      // Contribution" run, which is what drew our attention — but a content classifier
      // correctly KEEPS all 58 real bugs, so it can never remove the project. Two prior
      // attempts to do this per-issue (PR #221, #260) both shipped and left it live.
      "lingdojo/kana-dojo"
    ];
    EXCLUDED_LC = new Set(
      [...FARM_REPO_DENYLIST, ...CURATION_EXCLUDED_REPOS].map((r) => r.toLowerCase())
    );
    AI_BAN_DENYLIST = [
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
    AI_BAN_LC = new Set(AI_BAN_DENYLIST.map((g) => g.toLowerCase()));
    MAX_BOUNTIES_PER_REPO = 10;
    MAX_BOUNTIES_PER_DISCOVERED_REPO = 3;
    MIN_REPO_STARS = 5;
    HIGH_VALUE_USD = 500;
    HIGH_VALUE_MIN_STARS = 50;
    MIN_REPO_AGE_DAYS = 30;
  }
});

// ../../packages/core/src/feeds/contribution-gate.ts
function passesContributionGate(input) {
  if (input.contributors === void 0) return false;
  if (isAiBanRepo(input.fullName)) return false;
  return input.stars >= MIN_STARS && input.contributors >= MIN_CONTRIBUTORS && !TRIVIAL_PR_TITLE.test(input.title) && !input.archived && !input.fork;
}
function qualifiesMaintainer(repos) {
  const eligible = repos.filter(
    (r) => r.externalContributors >= MAINTAINER_MIN_EXTERNAL_CONTRIBUTORS && r.stars >= MAINTAINER_MIN_STARS && !r.archived && !r.fork
  );
  if (eligible.length === 0) return { qualifies: false, bestRepoName: null };
  eligible.sort((a, b) => b.externalContributors - a.externalContributors || b.stars - a.stars);
  return { qualifies: true, bestRepoName: eligible[0].name };
}
var MIN_STARS, MIN_CONTRIBUTORS, TRIVIAL_PR_TITLE, MAINTAINER_MIN_EXTERNAL_CONTRIBUTORS, MAINTAINER_MIN_STARS;
var init_contribution_gate = __esm({
  "../../packages/core/src/feeds/contribution-gate.ts"() {
    "use strict";
    init_bounty_gate();
    MIN_STARS = 50;
    MIN_CONTRIBUTORS = 10;
    TRIVIAL_PR_TITLE = /^\s*(fix\s+typo|typo\b|update\s+readme|readme\b|docs?:|docs?\(|chore:|chore\(|style:|ci:|build:|bump\b|update\s+dependenc)/i;
    MAINTAINER_MIN_EXTERNAL_CONTRIBUTORS = 5;
    MAINTAINER_MIN_STARS = 50;
  }
});

// ../../packages/core/src/feeds/contribution-classify.ts
function hasStrongCodeSignal(title, body, labels) {
  if (labels.some((l) => CODE_LABEL_RE.test(l))) return true;
  const text = `${title}
${body}`;
  if (CODE_TERM_RE.test(text)) return true;
  if (CODE_EXCEPTION_RE.test(text)) return true;
  if (CODE_FENCE_RE.test(body)) return true;
  if (FILE_PATH_RE.test(text)) return true;
  return false;
}
function hasContentSignal(title, body, labels) {
  if (labels.some((l) => CONTENT_LABEL_RE.test(l))) return true;
  const text = `${title}
${body}`;
  if (CONTENT_ADD_RE.test(text)) return true;
  if (ADD_TO_CORPUS_RE.test(text)) return true;
  const seedTitle = title.replace(DECORATION_SUFFIX_RE, "");
  if (NUMBERED_SEED_RE.test(seedTitle)) return true;
  if (TRANSLATE_RE.test(text)) return true;
  if (TYPO_RE.test(text)) return true;
  return false;
}
function isNumberedContentSeedTitle(title) {
  const t = title ?? "";
  if (hasStrongCodeSignal(t, "", [])) return false;
  const seedTitle = t.replace(DECORATION_SUFFIX_RE, "");
  return FARM_SEED_RE.test(seedTitle);
}
function classifyContributionKind(input) {
  const title = input.title ?? "";
  const body = input.body ?? "";
  const labels = input.labels ?? [];
  if (isNumberedContentSeedTitle(title)) return "content";
  if (hasStrongCodeSignal(title, body, labels)) return "code";
  if (hasContentSignal(title, body, labels)) return "content";
  return "ambiguous";
}
function looksLikeContentTask(input) {
  return classifyContributionKind(input) === "content";
}
function looksLikeContentFarmTitle(title) {
  return isNumberedContentSeedTitle(title);
}
var CONTENT_LABEL_RE, CODE_LABEL_RE, CODE_TERM_RE, CODE_EXCEPTION_RE, CODE_FENCE_RE, FILE_PATH_RE, CONTENT_NOUN_STRONG, CONTENT_NOUN_BROAD, FARM_SEED_NOUN, CONTENT_ADD_RE, NUMBERED_SEED_RE, FARM_SEED_RE, DECORATION_SUFFIX_RE, ADD_TO_CORPUS_RE, TRANSLATE_RE, TYPO_RE;
var init_contribution_classify = __esm({
  "../../packages/core/src/feeds/contribution-classify.ts"() {
    "use strict";
    CONTENT_LABEL_RE = /\b(content|copy|copywriting|wording|translation|translations|i18n|l10n|localization|localisation|data|dataset|documentation|docs)\b/i;
    CODE_LABEL_RE = /\b(bug|bugfix|fix|enhancement|feature|refactor|refactoring|test|tests|testing|performance|perf|security|api|backend|frontend|typescript|javascript|golang|rust|python|build|ci)\b/i;
    CODE_TERM_RE = /\b(bug|crash|crashes|crashing|exception|stack\s?trace|stacktrace|null\s?pointer|npe|segfault|refactor|implement|endpoint|api|component|function|method|class|module|compile|compiler|build\s+(?:error|fail)|runtime|regression|unit\s+test|integration\s+test|test\s+coverage|typecheck|lint|dependency|dependencies|import|async|await|race\s+condition|memory\s+leak|deadlock|parser|serialize|deserialize|schema|migration|websocket|http|json|sql|cli|sdk)\b/i;
    CODE_EXCEPTION_RE = /exception|stacktrace|segfault|traceback/i;
    CODE_FENCE_RE = /```|(?:^|\n)\s{4,}\S/;
    FILE_PATH_RE = /\b[\w./-]+\.(?:ts|tsx|js|jsx|mjs|cjs|py|rb|go|rs|java|kt|scala|c|cc|cpp|cxx|h|hpp|cs|php|swift|m|mm|sh|bash|zsh|sql|graphql|proto|css|scss|sass|less|vue|svelte|toml|ini|gradle|dockerfile)\b/i;
    CONTENT_NOUN_STRONG = String.raw`proverbs?|words?|phrases?|sayings?|translations?|entry|entries|definitions?|terms?|idioms?|synonyms?|antonyms?|acronyms?|abbreviations?|nazonazo`;
    CONTENT_NOUN_BROAD = String.raw`trivia\s+questions?|grammar\s+points?|brain\s?teasers?|trivia|facts?|quotes?|quotations?|quiz(?:zes)?|riddles?|puzzles?|flash\s?cards?|vocab(?:ulary)?|lessons?|kanji`;
    FARM_SEED_NOUN = String.raw`trivia\s+questions?|grammar\s+points?|brain\s?teasers?|proverbs?|sayings?|idioms?|quotes?|quotations?|riddles?|nazonazo`;
    CONTENT_ADD_RE = new RegExp(
      String.raw`\badd(?:ing|s)?\s+(?:\w+\s+){0,4}?(?:${CONTENT_NOUN_STRONG})\b`,
      "i"
    );
    NUMBERED_SEED_RE = new RegExp(
      String.raw`\badd(?:ing|s)?\s+(?:\w+\s+){0,4}?(?:${CONTENT_NOUN_STRONG}|${CONTENT_NOUN_BROAD})\s*#?\s*(?!(?:19|20)\d{2}(?!\d))\d{1,5}\s*$`,
      "i"
    );
    FARM_SEED_RE = new RegExp(
      String.raw`\badd(?:ing|s)?\s+(?:\w+\s+){0,4}?(?:${FARM_SEED_NOUN})\s*#?\s*(?!(?:19|20)\d{2}(?!\d))\d{1,5}\s*$`,
      "i"
    );
    DECORATION_SUFFIX_RE = /\s*[-–—:]\s*(?:(?:beginner[-\s]?friendly|good[-\s]?first[-\s]?issue|open[-\s]?source\s+contribution|beginner\s+contribution)[\s\W]*)+$/i;
    ADD_TO_CORPUS_RE = /\badd\b[\s\S]*?\bto\s+(?:the\s+)?(?:word\s?list|dictionary|glossary|phrasebook)\b/i;
    TRANSLATE_RE = /\b(?:translate|translating|translation|localize|localise|localization|localisation)\b/i;
    TYPO_RE = /\bfix(?:ing)?\s+(?:a\s+|the\s+|some\s+)?typos?\b/i;
  }
});

// ../../packages/core/src/credential/rigor.ts
function deriveRigorTiers(input) {
  const tiers = {};
  if (input.reviewerAssociations !== void 0) {
    tiers.maintainerReviewed = input.reviewerAssociations.some(
      (a) => MAINTAINER_SET.has(String(a).toUpperCase())
    );
  }
  return tiers;
}
var RIGOR, MAINTAINER_SET;
var init_rigor = __esm({
  "../../packages/core/src/credential/rigor.ts"() {
    "use strict";
    RIGOR = {
      /** `authorAssociation` values that count as a maintainer review. */
      MAINTAINER_ASSOCIATIONS: ["OWNER", "MEMBER", "COLLABORATOR"]
    };
    MAINTAINER_SET = new Set(
      RIGOR.MAINTAINER_ASSOCIATIONS.map((a) => a.toUpperCase())
    );
  }
});

// ../../packages/core/src/gh-governor.ts
function readReqGapMs() {
  const raw = process.env["CONTRIB_REQ_GAP_MS"];
  if (raw == null) return DEFAULT_REQ_GAP_MS;
  const n = Number.parseInt(raw, 10);
  if (Number.isNaN(n)) return DEFAULT_REQ_GAP_MS;
  return Math.min(Math.max(n, 0), 1e3);
}
function readBuildBudgetMs() {
  const raw = process.env["CONTRIB_BUILD_BUDGET_MS"];
  if (raw == null) return DEFAULT_BUILD_BUDGET_MS;
  const n = Number.parseInt(raw, 10);
  if (Number.isNaN(n)) return DEFAULT_BUILD_BUDGET_MS;
  return Math.min(Math.max(n, MIN_BUILD_BUDGET_MS), MAX_BUILD_BUDGET_MS);
}
function makeDefaultGovernorConfig(o) {
  return {
    paceEnabled: o.paceEnabled,
    gapMs: readReqGapMs(),
    budgetMs: o.budgetMs ?? readBuildBudgetMs(),
    sleep: o.sleep ?? realSleep,
    now: o.now ?? Date.now,
    probeTimeoutMs: o.probeTimeoutMs ?? (o.paceEnabled ? PROBE_TIMEOUT_MS : null)
  };
}
function makeGitHubGovernor(fetchImpl, cfg) {
  const startedAt = cfg.now();
  let lastRequestAt = 0;
  let pacedMs = 0;
  let secondaryHits = 0;
  let aborted = false;
  let secondaryAborted = false;
  let budgetAborted = false;
  let gqlCost = 0;
  let gqlRemaining = null;
  let coreHealthyAtStart = false;
  async function noteAndMaybeBackOff(res) {
    if (res.status !== 403) return;
    const remaining = res.headers.get("x-ratelimit-remaining");
    const retryAfter = res.headers.get("retry-after");
    const positiveSecondary = retryAfter != null || remaining != null && remaining !== "0";
    const isSecondary = positiveSecondary || coreHealthyAtStart;
    if (!isSecondary) return;
    await recordSecondaryStrike(retryAfter);
  }
  async function recordSecondaryStrike(retryAfter) {
    secondaryHits++;
    if (secondaryHits >= 2) {
      aborted = true;
      secondaryAborted = true;
      return;
    }
    if (cfg.paceEnabled) {
      const trimmed = (retryAfter ?? "").trim();
      const parsed = trimmed.length === 0 ? Number.NaN : Number(trimmed);
      const sec = Number.isNaN(parsed) ? SECONDARY_BACKOFF_CAP_S : Math.min(Math.max(parsed, 0), SECONDARY_BACKOFF_CAP_S);
      const remainingBudget = Math.max(0, cfg.budgetMs - (cfg.now() - startedAt));
      await cfg.sleep(Math.min(sec * 1e3, remainingBudget));
    }
  }
  async function noteGraphQLAndMaybeBackOff(res, body) {
    const b = body ?? {};
    const rl = b.data?.rateLimit;
    if (rl) {
      if (typeof rl.cost === "number") gqlCost += rl.cost;
      if (typeof rl.remaining === "number") gqlRemaining = rl.remaining;
    }
    const remainingHdr = res.headers?.get("x-ratelimit-remaining") ?? null;
    const retryAfter = res.headers?.get("retry-after") ?? null;
    const headerRate = retryAfter != null || remainingHdr === "0";
    const errs = Array.isArray(b.errors) ? b.errors : [];
    const bodyRate = errs.some((e) => e?.type === "RATE_LIMITED" || /rate limit/i.test(String(e?.message ?? ""))) || typeof rl?.remaining === "number" && rl.remaining <= 0;
    if (headerRate || bodyRate) await recordSecondaryStrike(retryAfter);
  }
  async function preflight() {
    if (aborted) return false;
    if (cfg.now() - startedAt >= cfg.budgetMs) {
      aborted = true;
      budgetAborted = true;
      return false;
    }
    if (cfg.paceEnabled && cfg.gapMs > 0) {
      const wait = cfg.gapMs - (cfg.now() - lastRequestAt);
      if (wait > 0) {
        await cfg.sleep(wait);
        pacedMs += wait;
        if (cfg.now() - startedAt >= cfg.budgetMs) {
          aborted = true;
          budgetAborted = true;
          return false;
        }
      }
      lastRequestAt = cfg.now();
    }
    return true;
  }
  async function get(url, init) {
    if (!await preflight()) return null;
    try {
      const res = await fetchImpl(url, init);
      await noteAndMaybeBackOff(res);
      return res;
    } catch {
      return null;
    }
  }
  async function graphql(url, init) {
    if (!await preflight()) return null;
    let res;
    try {
      res = await fetchImpl(url, init);
    } catch {
      return null;
    }
    let body;
    try {
      body = await res.json();
    } catch {
      return null;
    }
    await noteGraphQLAndMaybeBackOff(res, body);
    if (!res.ok) return null;
    return body;
  }
  async function probe(url, init) {
    const bound = cfg.probeTimeoutMs;
    let timer;
    const fetchP = fetchImpl(url, init).then(
      (r) => r,
      () => null
    );
    try {
      const res = bound == null ? await fetchP : await Promise.race([
        fetchP,
        new Promise((resolve) => {
          timer = setTimeout(() => resolve(null), bound);
        })
      ]);
      if (!res || !res.ok) return null;
      return await res.json();
    } catch {
      return null;
    } finally {
      if (timer) clearTimeout(timer);
    }
  }
  function setSecondaryHint(coreHealthy) {
    coreHealthyAtStart = coreHealthy;
  }
  function getStats() {
    return {
      pacedMs,
      secondaryAborted: secondaryAborted ? 1 : 0,
      budgetAborted: budgetAborted ? 1 : 0,
      elapsedMs: cfg.now() - startedAt,
      gqlCost,
      gqlRemaining
    };
  }
  function tripped() {
    return secondaryAborted;
  }
  function budgetExhausted() {
    return budgetAborted || cfg.now() - startedAt >= cfg.budgetMs;
  }
  return { get, graphql, probe, setSecondaryHint, getStats, tripped, budgetExhausted };
}
var DEFAULT_REQ_GAP_MS, SECONDARY_BACKOFF_CAP_S, DEFAULT_BUILD_BUDGET_MS, MIN_BUILD_BUDGET_MS, MAX_BUILD_BUDGET_MS, PROBE_TIMEOUT_MS, realSleep;
var init_gh_governor = __esm({
  "../../packages/core/src/gh-governor.ts"() {
    "use strict";
    DEFAULT_REQ_GAP_MS = 75;
    SECONDARY_BACKOFF_CAP_S = 30;
    DEFAULT_BUILD_BUDGET_MS = 9e4;
    MIN_BUILD_BUDGET_MS = 1e4;
    MAX_BUILD_BUDGET_MS = 9e4;
    PROBE_TIMEOUT_MS = 3e3;
    realSleep = (ms) => new Promise((r) => setTimeout(r, ms));
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
async function ghFetch(path, token, signal) {
  const url = `https://api.github.com${path}`;
  const res = await fetch(url, { headers: ghHeaders(token), signal });
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
    id: user.id,
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
async function repoExternalContributorCount(owner, name, ownerLogin, token, signal) {
  try {
    const res = await ghFetchRaw(
      `/repos/${owner}/${name}/contributors?per_page=100&anon=false`,
      token,
      signal
    );
    if (!res.ok) return 0;
    const body = await res.json();
    if (!Array.isArray(body)) return 0;
    const ownerLc = ownerLogin.toLowerCase();
    const seen = /* @__PURE__ */ new Set();
    for (const c of body) {
      const login = typeof c?.login === "string" ? c.login : null;
      if (!login) continue;
      if (c.type?.toLowerCase() === "bot" || /\[bot\]$/i.test(login)) continue;
      const lc = login.toLowerCase();
      if (lc === ownerLc) continue;
      seen.add(lc);
    }
    return seen.size;
  } catch {
    return 0;
  }
}
async function fetchOwnedRepoTraction(login, token) {
  const computedAt = (/* @__PURE__ */ new Date()).toISOString();
  const empty = (status) => ({
    status,
    totalStars: 0,
    totalForks: 0,
    reposWithStars: 0,
    top: [],
    qualifies: false,
    // honesty rail: no maintainer claim on a non-'ok' status
    bestRepoName: null,
    bestRepoExternalContributors: null,
    bestRepoStars: null,
    computedAt
  });
  let repos;
  try {
    repos = await ghFetch(
      `/users/${login}/repos?sort=pushed&per_page=100`,
      token
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const status = /HTTP 403|HTTP 429|rate limit/i.test(msg) ? "rate-limited" : "failed";
    console.warn(`[github] ${login}: traction fetch failed (${status}) \u2014`, msg);
    return empty(status);
  }
  if (!Array.isArray(repos)) return empty("failed");
  const owned = repos.filter((r) => r && !r.fork && !r.archived);
  let totalStars = 0;
  let totalForks = 0;
  let reposWithStars = 0;
  const ranked = [];
  for (const r of owned) {
    const stars = typeof r.stargazers_count === "number" ? r.stargazers_count : 0;
    const forks = typeof r.forks_count === "number" ? r.forks_count : 0;
    totalStars += stars;
    totalForks += forks;
    if (stars >= 1) reposWithStars++;
    ranked.push({ name: r.name, stars, forks, externalContributors: 0 });
  }
  ranked.sort((a, b) => b.stars - a.stars || b.forks - a.forks);
  const enrichCandidates = ranked.filter((r) => r.stars >= MAINTAINER_MIN_STARS).slice(0, MAINTAINER_ENRICH_MAX);
  for (const r of enrichCandidates) {
    r.externalContributors = await repoExternalContributorCount(login, r.name, login, token);
  }
  const gate = qualifiesMaintainer(
    ranked.map((r) => ({
      name: r.name,
      stars: r.stars,
      externalContributors: r.externalContributors,
      archived: false,
      fork: false
    }))
  );
  const best = gate.qualifies ? ranked.find((r) => r.name === gate.bestRepoName) ?? null : null;
  return {
    status: "ok",
    totalStars,
    totalForks,
    reposWithStars,
    top: ranked.slice(0, TRACTION_TOP_N),
    qualifies: gate.qualifies,
    bestRepoName: gate.bestRepoName,
    bestRepoExternalContributors: best ? best.externalContributors : null,
    bestRepoStars: best ? best.stars : null,
    computedAt
  };
}
async function ghFetchRaw(path, token, signal) {
  return fetch(`https://api.github.com${path}`, { headers: ghHeaders(token), signal });
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
async function repoContributorCount(owner, name, token, signal) {
  try {
    const res = await ghFetchRaw(
      `/repos/${owner}/${name}/contributors?per_page=1&anon=false`,
      token,
      signal
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
async function fetchRepoMeta(owner, name, token, cache, stats) {
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
      private: !!r.private,
      language: r.language ?? null,
      topics: r.topics ?? [],
      // `|| null` collapses "" → null so an empty description never crosses the wire.
      description: r.description || null,
      contributors
    };
  } catch (err) {
    meta = null;
    const msg = err instanceof Error ? err.message : String(err);
    if (stats && TRANSIENT_META_ERROR.test(msg)) stats.transient += 1;
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
    const q = encodeURIComponent(`type:pr is:merged is:public author:${login} -user:${login} sort:updated`);
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
  const distinctOrgSet = /* @__PURE__ */ new Set();
  let qualifyingTotal = 0;
  const qualifyingPRs = [];
  const metaStats = { transient: 0 };
  for (const item of items) {
    const repo = parseRepoUrl(item.repository_url);
    if (!repo) continue;
    const ownerLc = repo.owner.toLowerCase();
    if (ownerLc === loginLc) continue;
    if (ownedOrgs.has(ownerLc)) continue;
    if (isTrivialPRTitle(item.title)) continue;
    if (looksLikeContentFarmTitle(item.title)) continue;
    const meta = await fetchRepoMeta(repo.owner, repo.name, token, cache, metaStats);
    if (metaStats.transient > 0) {
      console.warn(
        `[acceptance] ${login}: per-repo metadata transient failure (${metaStats.transient}) \u2014 degrading to 'rate-limited' rather than a fabricated count`
      );
      return emptyCredential("rate-limited");
    }
    if (!meta) continue;
    if (meta.private) continue;
    if (meta.archived || meta.fork) continue;
    if (meta.stars < gates.minStars) continue;
    if (meta.contributors !== void 0 && meta.contributors < gates.minContributors) continue;
    qualifyingTotal += 1;
    distinctOrgSet.add(ownerLc);
    const mergedAt = item.pull_request?.merged_at ?? item.closed_at ?? item.created_at;
    const rawDomains = [meta.language ?? "", ...meta.topics].filter(Boolean);
    const domainTags = [...new Set(normalize(rawDomains))];
    qualifyingPRs.push({
      url: item.html_url,
      title: item.title,
      repo: `${repo.owner}/${repo.name}`,
      domains: domainTags,
      mergedAt,
      repoStars: meta.stars,
      repoDescription: meta.description
    });
    for (const d of domainTags) {
      const b = byDomain[d] ?? (byDomain[d] = { mergedPRs: 0, distinctOrgs: 0, lastMergedAt: mergedAt, orgs: /* @__PURE__ */ new Set() });
      b.mergedPRs += 1;
      b.orgs.add(ownerLc);
      if (mergedAt > b.lastMergedAt) b.lastMergedAt = mergedAt;
    }
  }
  if (token) {
    const enrichStats = { transient: 0 };
    const enrichCount = Math.min(qualifyingPRs.length, MAX_ENRICH_PRS);
    for (let i = 0; i < enrichCount; i++) {
      const pr = qualifyingPRs[i];
      const ref = parseGitHubRef(pr.url);
      if (!ref || ref.kind !== "pull") continue;
      try {
        const reviews = await ghFetch(
          `/repos/${ref.owner}/${ref.repo}/pulls/${ref.number}/reviews?per_page=100`,
          token
        );
        const reviewerAssociations = reviews.map((r) => r.author_association);
        const tiers = deriveRigorTiers({ reviewerAssociations });
        if (tiers.maintainerReviewed !== void 0) pr.maintainerReviewed = tiers.maintainerReviewed;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        if (TRANSIENT_META_ERROR.test(msg)) {
          enrichStats.transient += 1;
          console.warn(
            `[acceptance] ${login}: per-PR rigor enrichment transient failure (${enrichStats.transient}) \u2014 leaving remaining tiers undefined rather than fabricating a false`
          );
          break;
        }
      }
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
  return {
    status: "ok",
    byDomain: finalDomains,
    qualifyingTotal,
    qualifyingPRs,
    distinctOrgs: distinctOrgSet.size,
    computedAt
  };
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
async function fetchOpenExternalPRs(login, token, cache = /* @__PURE__ */ new Map(), gates = {
  minStars: MIN_STARS,
  minContributors: MIN_CONTRIBUTORS
}) {
  if (!token) return [];
  const loginLc = login.toLowerCase();
  let ownedOrgs;
  try {
    ownedOrgs = await fetchPublicOrgs(login, token);
  } catch {
    return null;
  }
  let items;
  try {
    const q = encodeURIComponent(`type:pr is:open is:public author:${login} -user:${login} sort:updated`);
    const res = await ghFetch(
      `/search/issues?q=${q}&per_page=${OPEN_PR_PAGE}`,
      token
    );
    items = res.items ?? [];
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn("[open-prs] search failed:", msg);
    return null;
  }
  const metaStats = { transient: 0 };
  const out = [];
  for (const item of items) {
    const repo = parseRepoUrl(item.repository_url);
    if (!repo) continue;
    const ownerLc = repo.owner.toLowerCase();
    if (ownerLc === loginLc) continue;
    if (ownedOrgs.has(ownerLc)) continue;
    if (isTrivialPRTitle(item.title)) continue;
    const meta = await fetchRepoMeta(repo.owner, repo.name, token, cache, metaStats);
    if (metaStats.transient > 0) {
      console.warn(
        `[open-prs] ${login}: per-repo metadata transient failure (${metaStats.transient}) \u2014 returning null (keep prior strip)`
      );
      return null;
    }
    if (!meta) continue;
    if (meta.private) continue;
    if (meta.archived || meta.fork) continue;
    if (meta.stars < gates.minStars) continue;
    if (meta.contributors !== void 0 && meta.contributors < gates.minContributors) continue;
    out.push({
      title: item.title,
      url: item.html_url,
      repoFullName: `${repo.owner}/${repo.name}`,
      openedAt: item.created_at
    });
  }
  return out;
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
function isExternalAuthor(pr) {
  const assoc = (pr.author_association ?? "").toUpperCase();
  return assoc !== "OWNER" && assoc !== "MEMBER" && assoc !== "COLLABORATOR";
}
async function fetchRepoReceptivity(fullName, opts = {}) {
  const doFetch = opts.fetchImpl ?? fetch;
  const now = opts.now ?? Date.now();
  try {
    const url = `https://api.github.com/repos/${fullName}/pulls?state=closed&per_page=50&sort=updated&direction=desc`;
    const res = opts.governor ? await opts.governor.get(url, { headers: ghHeaders(opts.token) }) : await doFetch(url, { headers: ghHeaders(opts.token) });
    if (!res || !res.ok) return null;
    const prs = await res.json();
    if (!Array.isArray(prs)) return null;
    const external = prs.filter(isExternalAuthor);
    if (external.length === 0) return null;
    const merged = external.filter((p) => p.merged_at != null);
    const mergedFraction = merged.length / external.length;
    if (merged.length === 0) return 0;
    let lastMergeMs = 0;
    for (const p of merged) {
      const t = Date.parse(p.merged_at);
      if (Number.isFinite(t) && t > lastMergeMs) lastMergeMs = t;
    }
    const ageDays2 = (now - lastMergeMs) / (24 * 60 * 60 * 1e3);
    const recencyWeight = Math.max(
      RECEPTIVITY_RECENCY_FLOOR,
      Math.min(1, 1 - ageDays2 / RECEPTIVITY_RECENCY_DAYS)
    );
    return Math.max(0, Math.min(1, mergedFraction * recencyWeight));
  } catch {
    return null;
  }
}
async function fetchTrendingSlugs(opts = {}) {
  const doFetch = opts.fetchImpl ?? fetch;
  try {
    const res = await doFetch("https://github.com/trending?since=daily", {
      headers: { "User-Agent": "terminalhire", Accept: "text/html" }
    });
    if (!res.ok) return null;
    const html = await res.text();
    const slugs = /* @__PURE__ */ new Set();
    for (const m of html.matchAll(/<h2[^>]*>\s*<a[^>]*href="\/([^"/]+\/[^"/]+)"/g)) {
      slugs.add(m[1].toLowerCase());
    }
    return slugs.size > 0 ? slugs : null;
  } catch {
    return null;
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
function parseGitHubRef(url) {
  const m = String(url ?? "").match(/github\.com\/([^/]+)\/([^/]+)\/(issues|pull)\/(\d+)/);
  if (!m) return null;
  return { owner: m[1], repo: m[2], number: parseInt(m[4], 10), kind: m[3] === "pull" ? "pull" : "issue" };
}
async function ghGraphQL(query, variables, token, signal, governor) {
  const init = {
    method: "POST",
    headers: { ...ghHeaders(token), "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    signal
  };
  if (governor) {
    const json2 = await governor.graphql(GITHUB_GRAPHQL_URL, init);
    if (json2 === null) return null;
    if (json2.errors?.length) throw new Error("GitHub GraphQL errors: " + JSON.stringify(json2.errors));
    return json2;
  }
  const res = await fetch(GITHUB_GRAPHQL_URL, init);
  if (!res.ok) throw new Error(`GitHub GraphQL: HTTP ${res.status}`);
  const json = await res.json();
  if (json.errors?.length) throw new Error("GitHub GraphQL errors: " + JSON.stringify(json.errors));
  return json;
}
async function resolveClosingIssues(owner, name, number, body, token, signal, governor) {
  if (token) {
    try {
      const q = `query($o:String!,$n:String!,$p:Int!){repository(owner:$o,name:$n){pullRequest(number:$p){closingIssuesReferences(first:20){nodes{number}}}}rateLimit{cost remaining}}`;
      const r = await ghGraphQL(q, { o: owner, n: name, p: number }, token, signal, governor);
      if (r) {
        const nodes = r.data?.repository?.pullRequest?.closingIssuesReferences?.nodes ?? [];
        return { closesIssues: nodes.map((x) => x.number), linkageSource: "graphql" };
      }
    } catch {
    }
  }
  const nums = /* @__PURE__ */ new Set();
  const re = /\b(?:clos(?:e|es|ed)|fix(?:es|ed)?|resolv(?:e|es|ed))\s+#(\d+)/gi;
  let m;
  while ((m = re.exec(body)) !== null) nums.add(parseInt(m[1], 10));
  return { closesIssues: [...nums], linkageSource: nums.size ? "body-keyword" : "none" };
}
async function openPRClosingRefs(owner, name, token, signal, governor) {
  const q = `query($o:String!,$n:String!){repository(owner:$o,name:$n){pullRequests(states:OPEN,first:100){totalCount nodes{number closingIssuesReferences(first:20){nodes{number}}}}}rateLimit{cost remaining}}`;
  try {
    const r = await ghGraphQL(q, { o: owner, n: name }, token, signal, governor);
    if (r === null) return null;
    if (!r.data?.repository) return null;
    const prs = r.data.repository.pullRequests;
    if (prs && prs.nodes !== void 0 && !Array.isArray(prs.nodes)) return null;
    const nodes = prs?.nodes ?? [];
    const refs = /* @__PURE__ */ new Set();
    for (const node of nodes) {
      for (const ref of node.closingIssuesReferences?.nodes ?? []) refs.add(ref.number);
    }
    const totalCount = prs?.totalCount ?? nodes.length;
    return { refs, capHit: totalCount > nodes.length, totalCount };
  } catch {
    return null;
  }
}
async function issueCrossRefPRAttempts(owner, name, issueNumber, token, signal, governor) {
  const url = `https://api.github.com/repos/${owner}/${name}/issues/${issueNumber}/timeline?per_page=100`;
  try {
    const res = governor ? await governor.get(url, { headers: ghHeaders(token), signal }) : await fetch(url, { headers: ghHeaders(token), signal });
    if (!res || !res.ok) return null;
    const link = res.headers?.get("link") ?? null;
    const hasNextPage = link != null && /\brel="next"/.test(link);
    const events = await res.json();
    if (!Array.isArray(events)) return null;
    if (hasNextPage || events.length >= 100) return null;
    let hasOpenPR = false;
    let hasClosedPR = false;
    const prNumbers = [];
    for (const ev of events) {
      if (ev?.event !== "cross-referenced") continue;
      const src = ev.source?.issue;
      if (!src || src.pull_request == null) continue;
      if (typeof src.number === "number") prNumbers.push(src.number);
      if (src.state === "open") hasOpenPR = true;
      else if (src.state === "closed") hasClosedPR = true;
    }
    return { hasOpenPR, hasClosedPR, prNumbers };
  } catch {
    return null;
  }
}
function makeScoringGovernor(governor) {
  return governor ?? makeGitHubGovernor(
    ((url, init) => fetch(url, init)),
    makeDefaultGovernorConfig({ paceEnabled: false })
  );
}
function reviewerPseudonym(repoFullName, reviewerId) {
  const s = `${repoFullName}:${reviewerId}`;
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return `R${h.toString(16).padStart(8, "0")}`;
}
async function fetchPublicOrgsOrNull(login, token, sig) {
  try {
    const orgs = await ghFetch(
      `/users/${encodeURIComponent(login)}/orgs?per_page=100`,
      token,
      sig
    );
    return new Set(orgs.map((o) => o.login.toLowerCase()));
  } catch {
    return null;
  }
}
async function fetchPRScoringFacts(prUrl, token, signal, governor) {
  const ref = parseGitHubRef(prUrl);
  if (!ref || ref.kind !== "pull") return null;
  const { owner, repo, number } = ref;
  const sig = signal ?? AbortSignal.timeout(1e4);
  const gov = makeScoringGovernor(governor);
  if (gov.tripped() || gov.budgetExhausted()) return null;
  let pr;
  try {
    pr = await ghFetch(`/repos/${owner}/${repo}/pulls/${number}`, token, sig);
  } catch {
    return null;
  }
  let repoMeta = null;
  if (!gov.tripped() && !gov.budgetExhausted()) {
    try {
      repoMeta = await ghFetch(`/repos/${owner}/${repo}`, token, sig);
    } catch {
    }
  }
  const contributors = gov.tripped() || gov.budgetExhausted() ? null : await repoContributorCount(owner, repo, token, sig);
  const { closesIssues, linkageSource } = await resolveClosingIssues(owner, repo, number, pr.body ?? "", token, sig, gov);
  let reviewerAssociations;
  let reviewSources;
  if (!gov.tripped() && !gov.budgetExhausted()) {
    try {
      const reviews = await ghFetch(
        `/repos/${owner}/${repo}/pulls/${number}/reviews?per_page=100`,
        token,
        sig
      );
      reviewerAssociations = reviews.map((r) => r.author_association);
      reviewSources = reviews.map((r) => ({
        association: r.author_association,
        isBot: isLifecycleBot(r.user ?? null),
        isSelf: r.user?.id != null && pr.user?.id != null && r.user.id === pr.user.id,
        ...r.user?.id != null ? { pseudonym: reviewerPseudonym(`${owner}/${repo}`, r.user.id) } : {},
        ...r.state ? { state: r.state } : {},
        submittedAt: r.submitted_at ?? null
      }));
      const authorLogin = pr.user?.login;
      if (authorLogin && !gov.tripped() && !gov.budgetExhausted()) {
        const authorOrgs = await fetchPublicOrgsOrNull(authorLogin, token, sig);
        if (authorOrgs != null) {
          const humanReviewers = /* @__PURE__ */ new Map();
          for (const r of reviews) {
            if (r.user?.id == null || r.user.login == null) continue;
            if (isLifecycleBot(r.user) || pr.user?.id != null && r.user.id === pr.user.id) continue;
            const p = reviewerPseudonym(`${owner}/${repo}`, r.user.id);
            if (!humanReviewers.has(p) && humanReviewers.size < AFFILIATION_REVIEWER_CAP) {
              humanReviewers.set(p, r.user.login);
            }
          }
          const shared = /* @__PURE__ */ new Map();
          for (const [p, login] of humanReviewers) {
            if (gov.tripped() || gov.budgetExhausted()) break;
            const reviewerOrgs = await fetchPublicOrgsOrNull(login, token, sig);
            if (reviewerOrgs == null) continue;
            shared.set(p, [...reviewerOrgs].some((o) => authorOrgs.has(o)));
          }
          for (const src of reviewSources) {
            if (src.pseudonym && shared.has(src.pseudonym)) {
              src.sharedOrgWithAuthor = shared.get(src.pseudonym);
            }
          }
        }
      }
    } catch {
      reviewerAssociations = void 0;
      reviewSources = void 0;
    }
  }
  let commits;
  if (!gov.tripped() && !gov.budgetExhausted()) {
    try {
      const url = `https://api.github.com/repos/${owner}/${repo}/pulls/${number}/commits?per_page=100`;
      const res = await gov.get(url, { headers: ghHeaders(token), signal: sig });
      if (res && res.ok) {
        const rawCommits = await res.json();
        commits = !Array.isArray(rawCommits) || rawCommits.length === 100 ? void 0 : rawCommits.map((c) => ({
          sha: c.sha,
          committedAt: c.commit?.committer?.date ?? c.commit?.author?.date ?? null
        }));
      }
    } catch {
      commits = void 0;
    }
  }
  let reviewThreadStats;
  if (token && !gov.tripped() && !gov.budgetExhausted()) {
    try {
      const q = `query($o:String!,$n:String!,$p:Int!){repository(owner:$o,name:$n){pullRequest(number:$p){reviewThreads(first:100){totalCount nodes{isResolved}}}}rateLimit{cost remaining}}`;
      const r = await ghGraphQL(q, { o: owner, n: repo, p: number }, token, sig, gov);
      const threads = r?.data?.repository?.pullRequest?.reviewThreads;
      if (threads && typeof threads.totalCount === "number" && threads.totalCount <= 100 && Array.isArray(threads.nodes)) {
        const resolved = threads.nodes.filter((t) => t.isResolved).length;
        reviewThreadStats = {
          total: threads.totalCount,
          resolved,
          unresolved: threads.totalCount - resolved
        };
      }
    } catch {
      reviewThreadStats = void 0;
    }
  }
  return {
    repo: `${owner}/${repo}`,
    prNumber: number,
    prUrl: pr.html_url,
    merged: pr.merged === true,
    mergedAt: pr.merged_at ?? null,
    authorId: pr.user?.id ?? null,
    authorLogin: pr.user?.login ?? null,
    mergedById: pr.merged_by?.id ?? null,
    mergedByLogin: pr.merged_by?.login ?? null,
    closesIssues,
    linkageSource,
    repoStars: repoMeta?.stargazers_count ?? null,
    repoContributors: contributors ?? null,
    repoArchived: !!repoMeta?.archived,
    repoFork: !!repoMeta?.fork,
    // TERM-46: preserve UNKNOWN when the repo-meta read failed/was skipped — do NOT
    // coerce a missing read to `false` (public), which would fail OPEN in the
    // provenance gate. A successful read reports the real flag (GitHub always sends it).
    repoPrivate: repoMeta ? repoMeta.private ?? false : null,
    additions: pr.additions ?? null,
    deletions: pr.deletions ?? null,
    changedFiles: pr.changed_files ?? null,
    repoForks: repoMeta?.forks_count ?? null,
    reviewerAssociations,
    reviewSources,
    // TERM-46 provenance RAW inputs. `created_at` rides the existing repo read;
    // repoOrgVerified / repoDependents are deferred (extra API) → left undefined.
    repoCreatedAt: repoMeta?.created_at ?? null,
    // TERM-50: PR creation rides the existing detail read; null = unknown (older
    // callers / list shapes) → time-to-merge honestly absent, never fabricated.
    prCreatedAt: pr.created_at ?? null,
    // §7 PR-A: commit + review-thread enrichment (undefined when degraded/truncated).
    commits,
    reviewThreadStats,
    fetchedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
}
function isLifecycleBot(actor) {
  if (!actor) return false;
  if (actor.type === "Bot") return true;
  const login = String(actor.login ?? "");
  if (/\[bot\]$/i.test(login)) return true;
  return LIFECYCLE_BOT_LOGINS.has(login.toLowerCase());
}
async function fetchPRLifecycle(prUrl, token, signal, governor) {
  const ref = parseGitHubRef(prUrl);
  if (!ref || ref.kind !== "pull") return null;
  const { owner, repo, number } = ref;
  const sig = signal ?? AbortSignal.timeout(1e4);
  const gov = makeScoringGovernor(governor);
  if (gov.tripped() || gov.budgetExhausted()) return null;
  let pr;
  try {
    pr = await ghFetch(`/repos/${owner}/${repo}/pulls/${number}`, token, sig);
  } catch {
    return null;
  }
  const authorId = pr.user?.id ?? null;
  const events = [];
  const complete = { reviews: false, comments: false, commits: false };
  if (pr.created_at) {
    events.push({
      event_type: "pr_opened",
      source_id: `pr-${number}`,
      actor_id: authorId ?? 0,
      actor_assoc: "",
      is_author: true,
      is_bot: false,
      occurred_at: pr.created_at
    });
  }
  if (!gov.tripped() && !gov.budgetExhausted()) {
    try {
      const reviews = await ghFetch(
        `/repos/${owner}/${repo}/pulls/${number}/reviews?per_page=100`,
        token,
        sig
      );
      for (const r of reviews) {
        if (r.state === "PENDING" || !r.submitted_at) continue;
        const aid = r.user?.id ?? 0;
        events.push({
          event_type: "review_submitted",
          source_id: `review-${r.id}`,
          actor_id: aid,
          actor_assoc: r.author_association ?? "",
          is_author: authorId != null && aid === authorId,
          is_bot: isLifecycleBot(r.user),
          occurred_at: r.submitted_at
        });
      }
      complete.reviews = true;
    } catch {
      complete.reviews = false;
    }
  }
  if (!gov.tripped() && !gov.budgetExhausted()) {
    try {
      const comments = await ghFetch(
        `/repos/${owner}/${repo}/issues/${number}/comments?per_page=100`,
        token,
        sig
      );
      for (const c of comments) {
        if (!c.created_at) continue;
        const aid = c.user?.id ?? 0;
        events.push({
          event_type: "issue_comment",
          source_id: `comment-${c.id}`,
          actor_id: aid,
          actor_assoc: c.author_association ?? "",
          is_author: authorId != null && aid === authorId,
          is_bot: isLifecycleBot(c.user),
          occurred_at: c.created_at
        });
      }
      complete.comments = true;
    } catch {
      complete.comments = false;
    }
  }
  if (!gov.tripped() && !gov.budgetExhausted()) {
    try {
      const commits = await ghFetch(
        `/repos/${owner}/${repo}/pulls/${number}/commits?per_page=100`,
        token,
        sig
      );
      for (const cm of commits) {
        const when = cm.commit?.author?.date ?? null;
        if (!when) continue;
        const aid = cm.author?.id ?? authorId ?? 0;
        events.push({
          event_type: "commit_pushed",
          source_id: `commit-${cm.sha}`,
          actor_id: aid,
          actor_assoc: "",
          is_author: authorId != null && aid === authorId,
          is_bot: isLifecycleBot(cm.author),
          occurred_at: when
        });
      }
      complete.commits = true;
    } catch {
      complete.commits = false;
    }
  }
  if (pr.merged && pr.merged_at) {
    events.push({
      event_type: "pr_merged",
      source_id: `merged-${number}`,
      actor_id: pr.merged_by?.id ?? 0,
      actor_assoc: "",
      is_author: authorId != null && pr.merged_by?.id === authorId,
      // A bot merger (mergify[bot], a merge queue, etc.) must NOT count as an
      // independent human counterparty. Classify it like every other actor (§4b V4).
      is_bot: isLifecycleBot(pr.merged_by),
      occurred_at: pr.merged_at
    });
  } else if (pr.state === "closed" && pr.closed_at) {
    events.push({
      event_type: "pr_closed_unmerged",
      source_id: `closed-${number}`,
      actor_id: 0,
      actor_assoc: "",
      is_author: false,
      is_bot: false,
      occurred_at: pr.closed_at
    });
  }
  return {
    prNumber: number,
    prUrl: pr.html_url,
    openedAt: pr.created_at ?? null,
    merged: pr.merged === true,
    mergedAt: pr.merged_at ?? null,
    closedUnmergedAt: !pr.merged && pr.state === "closed" ? pr.closed_at ?? null : null,
    authorId,
    events,
    complete
  };
}
var TRACTION_TOP_N, MAINTAINER_ENRICH_MAX, CANDIDATE_PR_PAGE, MAX_ENRICH_PRS, OPEN_PR_PAGE, TRANSIENT_META_ERROR, RESUME_DECAY_HALF_LIFE_MS, RESUME_MIN_SCORE, RECEPTIVITY_RECENCY_DAYS, RECEPTIVITY_RECENCY_FLOOR, GITHUB_GRAPHQL_URL, AFFILIATION_REVIEWER_CAP, LIFECYCLE_BOT_LOGINS;
var init_github = __esm({
  "../../packages/core/src/github.ts"() {
    "use strict";
    init_vocabulary();
    init_contribution_gate();
    init_contribution_gate();
    init_contribution_classify();
    init_rigor();
    init_gh_governor();
    TRACTION_TOP_N = 6;
    MAINTAINER_ENRICH_MAX = 25;
    CANDIDATE_PR_PAGE = 50;
    MAX_ENRICH_PRS = 12;
    OPEN_PR_PAGE = 20;
    TRANSIENT_META_ERROR = /HTTP 403|HTTP 429|rate limit|HTTP 5\d\d|timeout|network|fetch failed/i;
    RESUME_DECAY_HALF_LIFE_MS = 30 * 24 * 60 * 60 * 1e3;
    RESUME_MIN_SCORE = 0.05;
    RECEPTIVITY_RECENCY_DAYS = 180;
    RECEPTIVITY_RECENCY_FLOOR = 0.1;
    GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";
    AFFILIATION_REVIEWER_CAP = 5;
    LIFECYCLE_BOT_LOGINS = /* @__PURE__ */ new Set([
      "mergify",
      "mergify[bot]",
      "bors",
      "bors[bot]",
      "kodiakhq",
      "kodiakhq[bot]",
      "dependabot",
      "dependabot[bot]",
      "renovate",
      "renovate[bot]",
      "github-actions",
      "github-actions[bot]"
    ]);
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
function mergeSoftCoverage(covMap, softTags, cap) {
  for (const st of softTags) {
    const w = Math.max(0, Math.min(1, st.weight)) * cap;
    for (const [tag, hit] of expandWeighted([st.tag])) {
      const scaled = hit.weight * w;
      const existing = covMap.get(tag);
      if (!existing || scaled > existing.weight) {
        covMap.set(tag, {
          weight: existing ? Math.max(existing.weight, scaled) : scaled,
          via: existing?.via ?? st.tag
        });
      }
    }
  }
  return covMap;
}
function tagKernel(job, ctx) {
  const { expanded, covMap, maxDevScore, skillTags } = ctx;
  const details = [];
  let jobMatchScore = 0;
  let jobMaxScore = 0;
  const devCovByTag = /* @__PURE__ */ new Map();
  for (const tag of job.tags) {
    const w = backgroundIdf(tag);
    jobMaxScore += w;
    const covHit = covMap.get(tag);
    if (covHit) jobMatchScore += w * Math.pow(covHit.weight, SHARPEN);
    const fpHit = expanded.get(tag);
    if (fpHit) {
      const credit = Math.pow(fpHit.weight, SHARPEN);
      details.push({ tag, weight: fpHit.weight, via: fpHit.via });
      if (credit > (devCovByTag.get(fpHit.via) ?? 0)) devCovByTag.set(fpHit.via, credit);
    }
  }
  let devScore = 0;
  for (const t of skillTags) devScore += backgroundIdf(t) * (devCovByTag.get(t) ?? 0);
  const devCov = maxDevScore > 0 ? Math.min(1, devScore / maxDevScore) : 0;
  const jobCov = jobMaxScore > 0 ? Math.min(1, jobMatchScore / jobMaxScore) : 0;
  return { tagComponent: harmonicMean(devCov, jobCov), details };
}
function relevanceScore(fp, job, softTags = []) {
  const expanded = expandWeighted(fp.skillTags);
  const covMap = softTags.length > 0 ? mergeSoftCoverage(new Map(expanded), softTags, INTEREST_CAP) : expanded;
  const maxDevScore = fp.skillTags.reduce((acc, t) => acc + backgroundIdf(t), 0);
  return tagKernel(job, { expanded, covMap, maxDevScore, skillTags: fp.skillTags }).tagComponent;
}
function match(fp, jobs, limit = 5, now = Date.now(), opts = {}) {
  const idfOf = backgroundIdf;
  const expanded = expandWeighted(fp.skillTags);
  const covMap = opts.softTags && opts.softTags.length > 0 ? mergeSoftCoverage(new Map(expanded), opts.softTags, INTEREST_CAP) : expanded;
  const maxDevScore = fp.skillTags.reduce((acc, t) => acc + idfOf(t), 0);
  const ctx = { expanded, covMap, maxDevScore, skillTags: fp.skillTags };
  const candidates = jobs.filter((j) => passesFilters(fp, j));
  const scored = candidates.map((job) => {
    const { tagComponent, details } = tagKernel(job, ctx);
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
  return scored.filter((r) => r !== null && r.score >= (opts.minScore ?? MIN_SCORE)).sort((a, b) => {
    const byScore = b.score - a.score;
    if (Math.abs(byScore) > TIEBREAK_EPS) return byScore;
    const byAcceptance = (b.acceptance?.count ?? 0) - (a.acceptance?.count ?? 0);
    if (byAcceptance !== 0) return byAcceptance;
    return byScore;
  }).slice(0, limit);
}
var MIN_SCORE, TIEBREAK_EPS, SHARPEN, CORE_MISS_PENALTY, INTEREST_CAP, SENIORITY_RANK, SENIORITY_PATTERNS, ENG_TITLE, UNKNOWN_RECENCY;
var init_matcher = __esm({
  "../../packages/core/src/matcher.ts"() {
    "use strict";
    init_vocabulary();
    init_github();
    MIN_SCORE = 0.15;
    TIEBREAK_EPS = 5e-3;
    SHARPEN = 1.6;
    CORE_MISS_PENALTY = 0.4;
    INTEREST_CAP = 0.6;
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

// ../../packages/core/src/rerank.ts
function jaccardSim(a, b) {
  if (a.size === 0 && b.size === 0) return 1;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  const union = a.size + b.size - inter;
  return union === 0 ? 1 : inter / union;
}
function tagDissimilarity(a, b) {
  return 1 - jaccardSim(new Set(a.job.tags ?? []), new Set(b.job.tags ?? []));
}
function mmrRerank(results, opts = {}) {
  const lambda = opts.lambda ?? 0.7;
  const k = opts.k ?? 8;
  const simOf = opts.simOf ?? tagDissimilarity;
  if (results.length < 2 || k < 2) return results.slice();
  let maxScore = 0;
  for (const r of results) if (r.score > maxScore) maxScore = r.score;
  const relNorm = (r) => maxScore > 0 ? r.score / maxScore : 0;
  const remaining = results.slice();
  const selected = [];
  const window = Math.min(k, remaining.length);
  for (let pos = 0; pos < window; pos++) {
    let bestIdx = 0;
    let bestObj = -Infinity;
    for (let i = 0; i < remaining.length; i++) {
      const cand = remaining[i];
      let minDissim = selected.length === 0 ? 0 : Infinity;
      for (const s of selected) {
        const d = simOf(cand, s);
        if (d < minDissim) minDissim = d;
      }
      const obj = lambda * relNorm(cand) + (1 - lambda) * minDissim;
      if (obj > bestObj) {
        bestObj = obj;
        bestIdx = i;
      }
    }
    selected.push(remaining.splice(bestIdx, 1)[0]);
  }
  return [...selected, ...remaining];
}
var init_rerank = __esm({
  "../../packages/core/src/rerank.ts"() {
    "use strict";
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

// ../../packages/core/src/feeds/effort.ts
function effortFromAmount(amount) {
  if (amount == null) return void 0;
  if (amount <= 500) return "small";
  if (amount <= 2e3) return "medium";
  return "large";
}
var init_effort = __esm({
  "../../packages/core/src/feeds/effort.ts"() {
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
function labelNames(issue) {
  return (issue.labels ?? []).map((l) => typeof l === "string" ? l : l.name ?? "").filter(Boolean);
}
function isBountyIssue(issue) {
  if (issue.pull_request) return false;
  const labels = labelNames(issue);
  if (labels.some((n) => BOUNTY_LABEL_RE.test(n))) return true;
  return /bounty/i.test(issue.title) && parseAmountUSD(issue.title) != null;
}
function isAssigned(issue) {
  return !!issue.assignee || (issue.assignees?.length ?? 0) > 0;
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
  const bounties = issues.filter((i) => isBountyIssue(i) && !isAssigned(i)).slice(0, MAX_BOUNTIES_PER_REPO);
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
    if (isAssigned(issue)) continue;
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
    init_effort();
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
    init_effort();
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
            estimatedEffort: effortFromAmount(amountUSD),
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

// ../../packages/core/src/feeds/directory.ts
function personCardToJob(row) {
  const tags = [...row.skill_tags];
  return {
    id: `dev:${row.login}`,
    source: "person",
    title: row.name ?? row.login,
    company: row.login,
    url: `/r/${row.login}`,
    remote: true,
    tags,
    coreTags: tags.slice(0, TOP_CORE_TAGS),
    roleType: "full_time",
    applyMode: "direct"
  };
}
function buildDirectoryIndex(people, opts) {
  return {
    builtAt: opts?.builtAt ?? (/* @__PURE__ */ new Date()).toISOString(),
    cards: people.map(personCardToJob)
  };
}
function projectCardToJob(row) {
  const tags = [...row.needed_skills];
  return {
    id: `proj:${row.id}`,
    source: "project",
    title: row.title,
    company: row.owner_login,
    url: `/r/${row.owner_login}`,
    remote: true,
    tags,
    coreTags: tags.slice(0, TOP_CORE_TAGS),
    roleType: "full_time",
    applyMode: "direct"
  };
}
var TOP_CORE_TAGS;
var init_directory = __esm({
  "../../packages/core/src/feeds/directory.ts"() {
    "use strict";
    TOP_CORE_TAGS = 4;
  }
});

// ../../packages/core/src/feeds/contributions.ts
function readSearchMaxPages() {
  const raw = process.env["CONTRIB_SEARCH_MAX_PAGES"];
  if (raw == null) return DEFAULT_SEARCH_MAX_PAGES;
  const n = Number.parseInt(raw, 10);
  if (Number.isNaN(n)) return DEFAULT_SEARCH_MAX_PAGES;
  return Math.min(Math.max(n, MIN_SEARCH_MAX_PAGES), MAX_SEARCH_MAX_PAGES);
}
function readMaxContribItems() {
  const raw = process.env["CONTRIB_MAX_ITEMS"];
  if (raw == null) return DEFAULT_MAX_CONTRIB_ITEMS;
  const n = Number.parseInt(raw, 10);
  if (Number.isNaN(n)) return DEFAULT_MAX_CONTRIB_ITEMS;
  return Math.min(Math.max(n, MIN_MAX_CONTRIB_ITEMS), MAX_MAX_CONTRIB_ITEMS);
}
function readMaxContribIssuesScanned() {
  const raw = process.env["CONTRIB_MAX_ISSUES_SCANNED"];
  if (raw == null) return DEFAULT_MAX_CONTRIB_ISSUES_SCANNED;
  const n = Number.parseInt(raw, 10);
  if (Number.isNaN(n)) return DEFAULT_MAX_CONTRIB_ISSUES_SCANNED;
  return Math.min(
    Math.max(n, MIN_MAX_CONTRIB_ISSUES_SCANNED),
    MAX_MAX_CONTRIB_ISSUES_SCANNED
  );
}
function authHeaders2(token) {
  const bearer = token ?? process.env["GITHUB_TOKEN"] ?? process.env["GH_TOKEN"];
  const h = {
    Accept: "application/vnd.github+json",
    "User-Agent": "terminalhire",
    "X-GitHub-Api-Version": "2022-11-28"
  };
  if (bearer) h["Authorization"] = `Bearer ${bearer}`;
  return h;
}
function tokenize4(text) {
  return text.toLowerCase().replace(/[^a-z0-9.\-+#]/g, " ").split(/\s+/).filter(Boolean);
}
function labelNames2(labels) {
  return (labels ?? []).map((l) => typeof l === "string" ? l : l.name ?? "").filter(Boolean);
}
function repoFullNameFromApiUrl2(url) {
  const m = url.match(/\/repos\/([^/]+)\/([^/]+)\/?$/);
  return m ? `${m[1]}/${m[2]}` : null;
}
function makeClient(fetchImpl, cfg, token) {
  const gov = makeGitHubGovernor(fetchImpl, cfg);
  const effectiveToken = token ?? process.env["GITHUB_TOKEN"] ?? process.env["GH_TOKEN"];
  const headers = authHeaders2(effectiveToken);
  async function raw(path) {
    return gov.get(`${GITHUB_API2}${path}`, { headers });
  }
  async function json(path) {
    const res = await raw(path);
    if (!res) return null;
    if (res.status === 403 && res.headers.get("x-ratelimit-remaining") === "0") return null;
    if (!res.ok) return null;
    try {
      return await res.json();
    } catch {
      return null;
    }
  }
  async function probe(path) {
    return gov.probe(`${GITHUB_API2}${path}`, { headers });
  }
  let supplyFailures = 0;
  const noteSupplyFailure = () => {
    supplyFailures += 1;
  };
  return {
    raw,
    json,
    probe,
    governor: gov,
    token: effectiveToken,
    setSecondaryHint: gov.setSecondaryHint,
    noteSupplyFailure,
    // Merge the client-level supply-failure count into the governor stats so callers
    // read ONE stats object (the cron's metrics line + the B2 degraded check).
    getStats: () => ({ ...gov.getStats(), supplyFailures })
  };
}
async function contributorCount(client, fullName) {
  const res = await client.raw(`/repos/${fullName}/contributors?per_page=1&anon=false`);
  if (!res || !res.ok) return void 0;
  const link = res.headers.get("link");
  const m = link?.match(/[?&]page=(\d+)>;\s*rel="last"/);
  if (m) return Number(m[1]);
  try {
    const body = await res.json();
    return Array.isArray(body) ? body.length : 0;
  } catch {
    return void 0;
  }
}
async function openPRIssueRefs(client, fullName) {
  const token = client.token;
  const [owner, name] = fullName.split("/");
  if (token && owner && name) {
    const res = await openPRClosingRefs(owner, name, token, void 0, client.governor);
    if (res === null) return null;
    if (res.capHit) {
      console.warn(
        `[contribute] open-PR closing-ref scan capped at 100/${res.totalCount} open PRs for ${fullName} (closing refs beyond the first 100 open PRs not scanned)`
      );
    }
    return res.refs;
  }
  const prs = await client.json(
    `/repos/${fullName}/pulls?state=open&per_page=100`
  );
  if (!Array.isArray(prs)) return null;
  const refs = /* @__PURE__ */ new Set();
  for (const pr of prs) {
    const text = `${pr.title ?? ""}
${pr.body ?? ""}`;
    for (const m of text.matchAll(/\b(?:close[sd]?|fix(?:e[sd])?|resolve[sd]?)\s+#(\d+)/gi)) {
      refs.add(Number(m[1]));
    }
  }
  return refs;
}
async function fetchRateLimit(client) {
  const r = await client.probe("/rate_limit");
  return r?.resources ?? null;
}
async function searchContribIssues(client, queries) {
  const byUrl = /* @__PURE__ */ new Map();
  const maxPages = readSearchMaxPages();
  for (const q of queries) {
    for (let page = 1; page <= maxPages; page++) {
      const res = await client.json(
        `/search/issues?q=${encodeURIComponent(q)}&sort=created&order=desc&per_page=${SEARCH_PER_PAGE2}&page=${page}`
      );
      const items = res?.items;
      if (items == null) {
        const st = client.getStats();
        if (!st.budgetAborted && !st.secondaryAborted) client.noteSupplyFailure();
        break;
      }
      for (const it of items) {
        if (it.pull_request) continue;
        if (!byUrl.has(it.html_url)) byUrl.set(it.html_url, it);
      }
      if (items.length < SEARCH_PER_PAGE2) break;
      const stats = client.getStats();
      if (stats.budgetAborted || stats.secondaryAborted) break;
    }
  }
  return [...byUrl.values()].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}
function buildContributionJob(a) {
  return {
    id: a.id,
    source: "contribute",
    title: a.title,
    company: a.repo.owner.login,
    url: a.issue.html_url,
    remote: true,
    location: "Remote",
    tags: a.tags,
    roleType: "freelance",
    postedAt: a.issue.created_at,
    applyMode: "direct",
    contribution: {
      repoFullName: a.fullName,
      repoStars: a.repo.stargazers_count,
      repoContributors: a.contributors,
      issueNumber: a.issue.number,
      labels: a.labels,
      issueUrl: a.issue.html_url,
      issueBody: a.body.slice(0, 1e3) || void 0,
      // Provably 0 open PRs ONLY when the open-PR check actually ran and returned a
      // verified-empty/non-matching set; a failed check leaves it undefined (never a
      // fabricated 0), so the claim path falls through to a live re-count.
      openPRsAtDiscovery: a.openPRsAtDiscovery,
      repoDescription: a.repo.description || null,
      // TERM-27: persist the repo's primary language so project curation can
      // exclude the repo's OWN language id (folded into every issue's tags) from
      // the distinct-skill signal. Same `repo` used by the tokenize() tag build.
      language: a.repo.language ?? null,
      // TERM-35: stamp the search item's comment count (already in the response —
      // zero extra egress). A NEUTRAL volume signal only: set solely when the
      // search item carries a finite count >= 0; a failed/absent value leaves it
      // undefined (never a fabricated 0), so a render's chip falls through cleanly.
      commentsAtDiscovery: typeof a.issue.comments === "number" && Number.isFinite(a.issue.comments) && a.issue.comments >= 0 ? a.issue.comments : void 0
    },
    // Provenance: repo-first discovered items only (label-first omits the field).
    ...a.discovered ? { discovered: true } : {},
    raw: a.issue
  };
}
async function aggregateContributions(opts = {}) {
  const paceEnabled = opts.paceEnabled ?? !opts.fetchImpl;
  const client = makeClient(opts.fetchImpl ?? fetchWithTimeout, {
    paceEnabled,
    gapMs: readReqGapMs(),
    // Request-path callers (plan B2) can LOWER the budget but never raise it past the
    // vetted default — take the min so a per-user pass caps its own wall-clock.
    budgetMs: Math.min(opts.budgetMs ?? Infinity, readBuildBudgetMs()),
    sleep: opts.sleepImpl ?? realSleep,
    now: opts.nowImpl ?? Date.now,
    // Bound the unguarded probe on the REAL network only; injected-fetch tests get
    // null so the probe stays deterministic (and its shared spy sleeper untouched).
    probeTimeoutMs: opts.fetchImpl ? null : PROBE_TIMEOUT_MS
  }, opts.token);
  const queries = opts.queries ?? CONTRIB_SEARCH_QUERIES;
  const maxContribItems = readMaxContribItems();
  const startRl = await fetchRateLimit(client);
  const coreHealthyAtStart = (startRl?.core?.remaining ?? 0) >= 500;
  client.setSecondaryHint(coreHealthyAtStart);
  const issues = (await searchContribIssues(client, queries)).slice(
    0,
    readMaxContribIssuesScanned()
  );
  const repoCache = /* @__PURE__ */ new Map();
  const contribCache = /* @__PURE__ */ new Map();
  const prRefsCache = /* @__PURE__ */ new Map();
  const xbuild = opts.repoMetaCache;
  const servedFromXbuild = /* @__PURE__ */ new Set();
  const persistedXbuild = /* @__PURE__ */ new Set();
  const xbuildTried = /* @__PURE__ */ new Set();
  async function primeFromXbuild(key, fullName) {
    if (!xbuild || xbuildTried.has(key)) return;
    xbuildTried.add(key);
    if (repoCache.has(key) && contribCache.has(key)) return;
    let cached = null;
    try {
      cached = await xbuild.get(key);
    } catch {
      return;
    }
    if (!cached) return;
    if (!repoCache.has(key)) {
      const owner = fullName.split("/")[0] ?? "";
      repoCache.set(key, {
        full_name: fullName,
        stargazers_count: cached.stars,
        archived: cached.archived,
        disabled: cached.disabled,
        fork: cached.fork,
        language: cached.language,
        description: cached.description,
        owner: { login: owner }
      });
    }
    if (!contribCache.has(key)) {
      contribCache.set(key, cached.contributors);
      servedFromXbuild.add(key);
    }
  }
  async function persistRepoMeta(fullName, repo, contributors) {
    if (!xbuild) return;
    const key = repoKey(fullName);
    if (servedFromXbuild.has(key) || persistedXbuild.has(key)) return;
    if (contributors === void 0) return;
    persistedXbuild.add(key);
    try {
      await xbuild.set(key, {
        stars: repo.stargazers_count,
        contributors,
        language: repo.language,
        archived: repo.archived,
        fork: repo.fork,
        disabled: repo.disabled,
        description: repo.description || null
      });
    } catch {
    }
  }
  async function repoMeta(fullName) {
    const key = repoKey(fullName);
    const hit = repoCache.get(key);
    if (hit !== void 0) return hit;
    await primeFromXbuild(key, fullName);
    const primed = repoCache.get(key);
    if (primed !== void 0) return primed;
    const r = await client.json(`/repos/${fullName}`) ?? null;
    repoCache.set(key, r);
    return r;
  }
  async function repoContribCount(fullName) {
    const key = repoKey(fullName);
    if (contribCache.has(key)) return contribCache.get(key);
    await primeFromXbuild(key, fullName);
    if (contribCache.has(key)) return contribCache.get(key);
    const n = await contributorCount(client, fullName);
    contribCache.set(key, n);
    return n;
  }
  async function repoPRRefs(fullName) {
    const key = repoKey(fullName);
    if (prRefsCache.has(key)) return prRefsCache.get(key) ?? null;
    const refs = await openPRIssueRefs(client, fullName);
    prRefsCache.set(key, refs);
    return refs;
  }
  const jobs = [];
  const seen = /* @__PURE__ */ new Set();
  const perRepo = /* @__PURE__ */ new Map();
  let metaNull = 0;
  let contribUndefined = 0;
  let prRefsNull = 0;
  for (const issue of issues) {
    if (jobs.length >= maxContribItems) break;
    const fullName = repoFullNameFromApiUrl2(issue.repository_url);
    if (!fullName) continue;
    const id = `contribute:${repoKey(fullName)}#${issue.number}`;
    if (seen.has(id)) continue;
    if (isExcludedRepo(fullName)) continue;
    if (isAssigned(issue)) continue;
    if ((perRepo.get(repoKey(fullName)) ?? 0) >= MAX_BOUNTIES_PER_DISCOVERED_REPO) continue;
    const title = decodeEntities(issue.title).trim();
    const body = issue.body ? decodeEntities(issue.body) : "";
    const labels = labelNames2(issue.labels);
    if (looksLikeContentTask({ title, body, labels })) continue;
    const repo = await repoMeta(fullName);
    if (!repo) {
      metaNull++;
      continue;
    }
    const contributors = await repoContribCount(fullName);
    if (contributors === void 0) contribUndefined++;
    await persistRepoMeta(fullName, repo, contributors);
    if (!passesContributionGate({
      fullName,
      stars: repo.stargazers_count,
      contributors,
      title,
      archived: repo.archived,
      fork: repo.fork
    })) {
      continue;
    }
    if (repo.disabled) continue;
    const prRefs = await repoPRRefs(fullName);
    if (prRefs === null) prRefsNull++;
    const openPRsAtDiscovery = prRefs ? prRefs.has(issue.number) ? 1 : 0 : void 0;
    const tags = normalize(
      tokenize4([title, repo.language ?? "", labels.join(" "), body.slice(0, 2e3)].join(" "))
    );
    seen.add(id);
    perRepo.set(repoKey(fullName), (perRepo.get(repoKey(fullName)) ?? 0) + 1);
    jobs.push(
      buildContributionJob({
        id,
        fullName,
        repo,
        issue,
        title,
        body,
        labels,
        tags,
        contributors,
        // gate guarantees a number here
        openPRsAtDiscovery
      })
    );
  }
  const doDiscovery = opts.discoverRepos ?? (opts.trendingSlugs != null || opts.vocabTerms != null || opts.seedSlugs != null);
  let discoveredEmitted = 0;
  let discoveryBudgetStopped = false;
  if (doDiscovery && jobs.length < maxContribItems) {
    const maxRepos = Math.min(
      Math.max(0, opts.maxDiscoveredRepos ?? MAX_DISCOVERED_REPOS),
      MAX_DISCOVERED_REPOS
    );
    const vocabTerms = (opts.vocabTerms ?? DISCOVERY_VOCAB_TERMS).slice(
      0,
      DISCOVERY_VOCAB_TERMS.length
    );
    const vocabCandidates = [];
    for (const term of vocabTerms) {
      if (client.getStats().budgetAborted || client.getStats().secondaryAborted) {
        discoveryBudgetStopped = true;
        break;
      }
      const res = await client.json(
        `/search/repositories?q=${encodeURIComponent(term)}&sort=updated&order=desc&per_page=${DISCOVERY_REPOS_PER_TERM}`
      );
      for (const r of res?.items ?? []) {
        if (!r?.full_name) continue;
        if (!repoCache.has(repoKey(r.full_name))) {
          repoCache.set(repoKey(r.full_name), {
            full_name: r.full_name,
            stargazers_count: r.stargazers_count,
            archived: r.archived,
            disabled: r.disabled ?? false,
            fork: r.fork,
            language: r.language,
            description: r.description || null,
            owner: r.owner
          });
        }
        vocabCandidates.push({ fullName: r.full_name, stars: r.stargazers_count ?? 0 });
      }
    }
    vocabCandidates.sort((a, b) => b.stars - a.stars);
    const candidates = [];
    const candSeen = /* @__PURE__ */ new Set();
    for (const slug of opts.seedSlugs ?? []) {
      const s = slug?.toLowerCase();
      if (s && !candSeen.has(repoKey(s))) {
        candSeen.add(repoKey(s));
        candidates.push(s);
      }
    }
    for (const slug of opts.trendingSlugs ?? []) {
      const s = slug?.toLowerCase();
      if (s && !candSeen.has(repoKey(s))) {
        candSeen.add(repoKey(s));
        candidates.push(s);
      }
    }
    for (const { fullName } of vocabCandidates) {
      if (!candSeen.has(repoKey(fullName))) {
        candSeen.add(repoKey(fullName));
        candidates.push(fullName);
      }
    }
    const scanned = candidates.slice(0, maxRepos);
    for (const fullName of scanned) {
      if (jobs.length >= maxContribItems) break;
      if (client.getStats().budgetAborted || client.getStats().secondaryAborted) {
        discoveryBudgetStopped = true;
        break;
      }
      if (isExcludedRepo(fullName)) continue;
      const repo = await repoMeta(fullName);
      if (!repo) {
        metaNull++;
        continue;
      }
      if (repo.disabled) continue;
      const contributors = await repoContribCount(fullName);
      if (contributors === void 0) contribUndefined++;
      await persistRepoMeta(fullName, repo, contributors);
      if (repo.archived || repo.fork || repo.stargazers_count < MIN_STARS || contributors === void 0 || contributors < MIN_CONTRIBUTORS) {
        continue;
      }
      const q = `repo:${fullName} is:issue is:open label:${DISCOVERY_ISSUE_LABELS}`;
      const searchRes = await client.json(
        `/search/issues?q=${encodeURIComponent(q)}&sort=created&order=desc&per_page=${SEARCH_PER_PAGE2}`
      );
      const repoIssues = (searchRes?.items ?? []).filter((it) => !it.pull_request);
      let perRepoDiscovered = 0;
      for (const issue of repoIssues) {
        if (jobs.length >= maxContribItems) break;
        if (perRepoDiscovered >= MAX_ISSUES_PER_DISCOVERED_REPO) break;
        if ((perRepo.get(repoKey(fullName)) ?? 0) >= MAX_BOUNTIES_PER_DISCOVERED_REPO) break;
        const id = `contribute:${repoKey(fullName)}#${issue.number}`;
        if (seen.has(id)) continue;
        if (isAssigned(issue)) continue;
        const title = decodeEntities(issue.title).trim();
        if (!passesContributionGate({
          fullName,
          stars: repo.stargazers_count,
          contributors,
          title,
          archived: repo.archived,
          fork: repo.fork
        })) {
          continue;
        }
        const body = issue.body ? decodeEntities(issue.body) : "";
        const labels = labelNames2(issue.labels);
        if (looksLikeContentTask({ title, body, labels })) continue;
        const prRefs = await repoPRRefs(fullName);
        if (prRefs === null) prRefsNull++;
        const openPRsAtDiscovery = prRefs ? prRefs.has(issue.number) ? 1 : 0 : void 0;
        const tags = normalize(
          tokenize4([title, repo.language ?? "", labels.join(" "), body.slice(0, 2e3)].join(" "))
        );
        seen.add(id);
        perRepo.set(repoKey(fullName), (perRepo.get(repoKey(fullName)) ?? 0) + 1);
        perRepoDiscovered++;
        discoveredEmitted++;
        jobs.push(
          buildContributionJob({
            id,
            fullName,
            repo,
            issue,
            title,
            body,
            labels,
            tags,
            contributors,
            openPRsAtDiscovery,
            discovered: true
          })
        );
      }
    }
  }
  if (!opts.fetchImpl) {
    const rl = await fetchRateLimit(client);
    const core = rl?.core ? `${rl.core.remaining}/${rl.core.limit}` : "n/a";
    const search = rl?.search ? `${rl.search.remaining}/${rl.search.limit}` : "n/a";
    const noToken = !client.token;
    const { pacedMs, secondaryAborted, budgetAborted, elapsedMs, gqlCost, gqlRemaining } = client.getStats();
    console.info(
      `[contribute] build metrics \u2014 scanned=${issues.length} reposDistinct=${repoCache.size} emitted=${jobs.length} discovered=${discoveredEmitted} metaNull=${metaNull} contribUndefined=${contribUndefined} prRefsNull=${prRefsNull} paced=${pacedMs} secondaryAborted=${secondaryAborted} budgetAborted=${budgetAborted} core=${core} search=${search} gqlCost=${gqlCost} gqlRemaining=${gqlRemaining ?? "n/a"} elapsed=${elapsedMs}` + (noToken ? " (NO TOKEN \u2192 60/hr)" : "")
    );
    if (discoveryBudgetStopped) {
      console.warn(
        `[contribute] repo-first discovery stopped early \u2014 build budget exhausted (emitted ${discoveredEmitted} discovered before the cap)`
      );
    }
  }
  if (opts.onStats) {
    const { budgetAborted, secondaryAborted, supplyFailures } = client.getStats();
    opts.onStats({
      // A PARTIAL crawl from ANY cause: the governor's budget/secondary abort, an early
      // discovery stop, OR an ordinary /search page failure (supplyFailures) that
      // truncated the primary supply. Any of these ⇒ the pool is incomplete.
      degraded: Boolean(budgetAborted || secondaryAborted || discoveryBudgetStopped || supplyFailures > 0),
      emitted: jobs.length,
      scanned: issues.length
    });
  }
  return jobs;
}
var GITHUB_API2, CONTRIB_LABEL_QUERIES, CONTRIB_LANGUAGE_QUERIES, CONTRIB_SEARCH_QUERIES, SEARCH_PER_PAGE2, DEFAULT_SEARCH_MAX_PAGES, MIN_SEARCH_MAX_PAGES, MAX_SEARCH_MAX_PAGES, DEFAULT_MAX_CONTRIB_ITEMS, MIN_MAX_CONTRIB_ITEMS, MAX_MAX_CONTRIB_ITEMS, DEFAULT_MAX_CONTRIB_ISSUES_SCANNED, MIN_MAX_CONTRIB_ISSUES_SCANNED, MAX_MAX_CONTRIB_ISSUES_SCANNED, MAX_DISCOVERED_REPOS, MAX_ISSUES_PER_DISCOVERED_REPO, DISCOVERY_REPOS_PER_TERM, DISCOVERY_VOCAB_TERMS, DISCOVERY_ISSUE_LABELS, repoKey;
var init_contributions = __esm({
  "../../packages/core/src/feeds/contributions.ts"() {
    "use strict";
    init_vocabulary();
    init_entities();
    init_bounty_gate();
    init_contribution_gate();
    init_contribution_classify();
    init_github_bounties();
    init_github();
    init_http();
    init_gh_governor();
    GITHUB_API2 = "https://api.github.com";
    CONTRIB_LABEL_QUERIES = [
      'label:"good first issue" type:issue state:open',
      'label:"good-first-issue" type:issue state:open',
      'label:"help wanted" type:issue state:open',
      'label:"help-wanted" type:issue state:open',
      'label:"up-for-grabs" type:issue state:open',
      // supply-expansion D: two more first-contribution label families widen the
      // global newest-first slice WITHOUT relaxing the credential gate.
      'label:"beginner-friendly" type:issue state:open',
      'label:"first-timers-only" type:issue state:open'
    ];
    CONTRIB_LANGUAGE_QUERIES = [
      ...["rust", "go", "python", "c++", "ruby"].map(
        (lang) => `label:"help wanted" language:${lang} type:issue state:open`
      ),
      ...["rust", "go"].map(
        (lang) => `label:"good first issue" language:${lang} type:issue state:open`
      ),
      // supply-expansion D: cover the high-volume web/enterprise ecosystems the
      // original set omitted. TS/JS were previously left out of "good first issue"
      // (the global slice over-represented them) but a LANGUAGE-scoped page surfaces
      // DIFFERENT repos than the global newest-first slice, so re-including them widens
      // distinct-repo coverage rather than duplicating it.
      ...["typescript", "javascript", "java", "python"].map(
        (lang) => `label:"good first issue" language:${lang} type:issue state:open`
      ),
      ...["typescript", "javascript", "c#", "php"].map(
        (lang) => `label:"help wanted" language:${lang} type:issue state:open`
      )
    ];
    CONTRIB_SEARCH_QUERIES = [...CONTRIB_LABEL_QUERIES, ...CONTRIB_LANGUAGE_QUERIES];
    SEARCH_PER_PAGE2 = 100;
    DEFAULT_SEARCH_MAX_PAGES = 1;
    MIN_SEARCH_MAX_PAGES = 1;
    MAX_SEARCH_MAX_PAGES = 5;
    DEFAULT_MAX_CONTRIB_ITEMS = 400;
    MIN_MAX_CONTRIB_ITEMS = 50;
    MAX_MAX_CONTRIB_ITEMS = 1e3;
    DEFAULT_MAX_CONTRIB_ISSUES_SCANNED = 1500;
    MIN_MAX_CONTRIB_ISSUES_SCANNED = 100;
    MAX_MAX_CONTRIB_ISSUES_SCANNED = 5e3;
    MAX_DISCOVERED_REPOS = 15;
    MAX_ISSUES_PER_DISCOVERED_REPO = 3;
    DISCOVERY_REPOS_PER_TERM = 20;
    DISCOVERY_VOCAB_TERMS = ["rust", "go", "python", "typescript"];
    DISCOVERY_ISSUE_LABELS = '"good first issue","help wanted","good-first-issue","help-wanted"';
    repoKey = (name) => name.toLowerCase();
  }
});

// ../../packages/core/src/winnability.ts
function clamp01(n) {
  if (!Number.isFinite(n)) return 0;
  return n < 0 ? 0 : n > 1 ? 1 : n;
}
function credentialValue(s) {
  const velocity = clamp01((s.starVelocity30d ?? 0) / WINNABILITY_NORM.starVelocity);
  const social = clamp01((s.socialMentions ?? 0) / WINNABILITY_NORM.socialMentions);
  const stars = s.repoStars ?? 0;
  const starsFloor = stars > 0 ? clamp01(Math.log(stars) / WINNABILITY_NORM.starsLog) * CREDENTIAL_WEIGHTS.starsFloor : 0;
  let momentum;
  if (s.trending === void 0) {
    const rest = CREDENTIAL_WEIGHTS.starVelocity + CREDENTIAL_WEIGHTS.socialMentions;
    const scale = 1 / rest;
    momentum = velocity * CREDENTIAL_WEIGHTS.starVelocity * scale + social * CREDENTIAL_WEIGHTS.socialMentions * scale;
  } else {
    const trending = s.trending ? 1 : 0;
    momentum = trending * CREDENTIAL_WEIGHTS.trending + velocity * CREDENTIAL_WEIGHTS.starVelocity + social * CREDENTIAL_WEIGHTS.socialMentions;
  }
  return momentum + starsFloor;
}
function mergeProbability(s) {
  const recept = s.mergeReceptivity ?? MERGE_PROBABILITY.receptivityUnknownPrior;
  const contested = (s.competingOpenPRs ?? 0) > 0;
  const contentionFactor = contested ? 1 - MERGE_PROBABILITY.contentionPenalty : 1;
  const vocabFactor = MERGE_PROBABILITY.vocabFloor + (1 - MERGE_PROBABILITY.vocabFloor) * clamp01(s.vocabMatch ?? 0);
  return clamp01(recept) * contentionFactor * vocabFactor;
}
function computeWinnability(s) {
  const cv = credentialValue(s);
  const mp = mergeProbability(s);
  const velocity = clamp01((s.starVelocity30d ?? 0) / WINNABILITY_NORM.starVelocity);
  const social = clamp01((s.socialMentions ?? 0) / WINNABILITY_NORM.socialMentions);
  const stars = s.repoStars ?? 0;
  const contested = (s.competingOpenPRs ?? 0) > 0;
  return {
    score: cv * mp,
    credentialValue: cv,
    mergeProbability: mp,
    components: {
      trending: s.trending === void 0 ? -1 : s.trending ? 1 : 0,
      starVelocity: velocity,
      socialMentions: social,
      starsFloor: stars > 0 ? clamp01(Math.log(stars) / WINNABILITY_NORM.starsLog) : 0,
      mergeReceptivity: s.mergeReceptivity ?? -1,
      contentionFactor: contested ? 1 - MERGE_PROBABILITY.contentionPenalty : 1,
      vocabFactor: MERGE_PROBABILITY.vocabFloor + (1 - MERGE_PROBABILITY.vocabFloor) * clamp01(s.vocabMatch ?? 0)
    }
  };
}
var CREDENTIAL_WEIGHTS, WINNABILITY_NORM, MERGE_PROBABILITY;
var init_winnability = __esm({
  "../../packages/core/src/winnability.ts"() {
    "use strict";
    CREDENTIAL_WEIGHTS = {
      trending: 0.5,
      starVelocity: 0.3,
      socialMentions: 0.2,
      starsFloor: 0.2
    };
    WINNABILITY_NORM = {
      /** ~500 new stars in a build interval is treated as "maxed" momentum. */
      starVelocity: 500,
      /** ~10 HN mentions is treated as "maxed" social. */
      socialMentions: 10,
      /** log(stars) ceiling — ~100k-star repos saturate the absolute-traction floor. */
      starsLog: Math.log(1e5)
    };
    MERGE_PROBABILITY = {
      /** Neutral prior used when mergeReceptivity is UNMEASURED (undefined). NOT used
       *  when it is a measured 0 — a real 0 must zero the score (the thesis). Callers
       *  that only attach winnabilityScore on measured receptivity never hit this in
       *  production; it exists so the composite is total for internal/debug callers. */
      receptivityUnknownPrior: 0.5,
      /** Multiplicative factor applied when the item is contested (≥1 competing open PR).
       *  `1 − contentionPenalty`; uncontested = 1.0. */
      contentionPenalty: 0.6,
      /** vocabMatch is folded as `vocabFloor + (1−vocabFloor)·vocabMatch` so a
       *  tag-sparse title (vocabMatch≈0) NEVER zeroes mergeProbability — vocab is ONE
       *  input, never the gate (bounty/issue titles are token-sparse by nature). */
      vocabFloor: 0.5
    };
  }
});

// ../../packages/core/src/feeds/projectCuration.ts
function clamp012(n) {
  if (!Number.isFinite(n)) return 0;
  return n < 0 ? 0 : n > 1 ? 1 : n;
}
function firstNonEmptyString(xs) {
  for (const x of xs) if (typeof x === "string" && x.length > 0) return x;
  return "";
}
function firstNumber(xs) {
  for (const x of xs) if (typeof x === "number" && Number.isFinite(x)) return x;
  return void 0;
}
function isWinnableIssue(issue) {
  const contested = (issue.contribution.openPRsAtDiscovery ?? 0) > 0;
  if (contested) return false;
  if (issue.winnabilityScore != null && issue.winnabilityScore <= 0) return false;
  return true;
}
function issueRecency(postedAt, now) {
  if (!postedAt) return 0;
  const t = Date.parse(postedAt);
  if (!Number.isFinite(t)) return 0;
  const ageDays2 = (now - t) / 864e5;
  if (ageDays2 <= CURATION_NORM.freshnessFullDays) return 1;
  if (ageDays2 >= CURATION_NORM.freshnessZeroDays) return 0;
  return clamp012(
    (CURATION_NORM.freshnessZeroDays - ageDays2) / (CURATION_NORM.freshnessZeroDays - CURATION_NORM.freshnessFullDays)
  );
}
function curateProjects(issues, opts = {}) {
  const now = opts.now ?? Date.now();
  const vocabSet = new Set(opts.vocabTerms ?? []);
  const applyFloor = opts.applySkillFloor ?? SKILL_FLOOR_ENABLED;
  const groups = /* @__PURE__ */ new Map();
  for (const issue of issues) {
    const key = repoKeyOf(issue.contribution.repoFullName);
    const g = groups.get(key);
    if (g) g.push(issue);
    else groups.set(key, [issue]);
  }
  const partials = [];
  for (const [key, repoIssues] of groups) {
    const winnableIssues = repoIssues.filter(isWinnableIssue);
    if (winnableIssues.length === 0) continue;
    const commitCadence = firstNumber(winnableIssues.map((i) => i.commitCadence));
    const mergeReceptivity = firstNumber(winnableIssues.map((i) => i.mergeReceptivity));
    const repoStars = firstNumber(winnableIssues.map((i) => i.contribution.repoStars));
    const repoContributors = firstNumber(winnableIssues.map((i) => i.contribution.repoContributors));
    const description = firstNonEmptyString(winnableIssues.map((i) => i.contribution.repoDescription));
    const topTags = [];
    const tagSeen = /* @__PURE__ */ new Set();
    for (const iss of winnableIssues) {
      for (const t of iss.tags ?? []) {
        if (topTags.length >= 4) break;
        if (tagSeen.has(t)) continue;
        tagSeen.add(t);
        topTags.push(t);
      }
      if (topTags.length >= 4) break;
    }
    const repoLanguageRaw = firstNonEmptyString(
      winnableIssues.map((i) => i.contribution.language ?? "")
    );
    const languageIds = new Set(repoLanguageRaw ? normalize(tokenize(repoLanguageRaw)) : []);
    const skillTagUnion = /* @__PURE__ */ new Set();
    for (const iss of winnableIssues) for (const t of iss.tags ?? []) skillTagUnion.add(t);
    let distinctNonLanguageSkillTags = 0;
    for (const t of skillTagUnion) if (!languageIds.has(t)) distinctNonLanguageSkillTags++;
    if (applyFloor && distinctNonLanguageSkillTags < SKILL_FLOOR_MIN) continue;
    const skillDensity = clamp012(distinctNonLanguageSkillTags / SKILL_DENSITY_SATURATION);
    let vocabRelevance = 0;
    if (vocabSet.size > 0 && skillTagUnion.size > 0) {
      let matched = 0;
      for (const t of skillTagUnion) if (vocabSet.has(t)) matched++;
      vocabRelevance = matched / skillTagUnion.size;
    }
    const cadence = clamp012((commitCadence ?? 0) / CURATION_NORM.commitCadence);
    let recency = 0;
    for (const iss of winnableIssues) recency = Math.max(recency, issueRecency(iss.postedAt, now));
    const freshness = Math.max(cadence, recency);
    const mergeVelocity = clamp012(mergeReceptivity ?? 0);
    const stars = repoStars ?? 0;
    const logStars = stars > 0 ? clamp012(Math.log(stars) / CURATION_NORM.starsLog) : 0;
    const contribFrac = clamp012((repoContributors ?? 0) / CURATION_NORM.contributors);
    const popularity = clamp012(0.7 * logStars + 0.3 * contribFrac);
    partials.push({
      repoKey: key,
      description,
      winnableIssues,
      repoStars: repoStars ?? null,
      repoContributors: repoContributors ?? null,
      topTags,
      vocabRelevance,
      distinctNonLanguageSkillTags,
      skillDensity,
      freshness,
      mergeVelocity,
      popularity
    });
  }
  const maxCount = partials.reduce((m, p) => Math.max(m, p.winnableIssues.length), 0);
  const cards = partials.map((p) => {
    const winnableCount = p.winnableIssues.length;
    const winnableCountNorm = maxCount > 0 ? winnableCount / maxCount : 0;
    const score = CURATION_WEIGHTS.winnableCount * winnableCountNorm + CURATION_WEIGHTS.vocabRelevance * p.vocabRelevance + CURATION_WEIGHTS.skillDensity * p.skillDensity + CURATION_WEIGHTS.freshness * p.freshness + CURATION_WEIGHTS.mergeVelocity * p.mergeVelocity + CURATION_WEIGHTS.popularity * p.popularity;
    return {
      repoKey: p.repoKey,
      description: p.description,
      winnableIssues: p.winnableIssues,
      repoStars: p.repoStars,
      repoContributors: p.repoContributors,
      topTags: p.topTags,
      score,
      signals: {
        winnableCount,
        winnableCountNorm,
        vocabRelevance: p.vocabRelevance,
        distinctNonLanguageSkillTags: p.distinctNonLanguageSkillTags,
        skillDensity: p.skillDensity,
        freshness: p.freshness,
        mergeVelocity: p.mergeVelocity,
        popularity: p.popularity
      }
    };
  });
  cards.sort(
    (a, b) => b.score - a.score || b.signals.winnableCount - a.signals.winnableCount || (a.repoKey < b.repoKey ? -1 : a.repoKey > b.repoKey ? 1 : 0)
  );
  return cards;
}
function rosterActiveFromContribution(issues) {
  return curateProjects(issues).map((c) => ({ repoKey: c.repoKey, topTags: c.topTags }));
}
var CURATION_WEIGHTS, SKILL_DENSITY_SATURATION, SKILL_FLOOR_ENABLED, SKILL_FLOOR_MIN, CURATION_NORM, repoKeyOf;
var init_projectCuration = __esm({
  "../../packages/core/src/feeds/projectCuration.ts"() {
    "use strict";
    init_vocab();
    init_winnability();
    CURATION_WEIGHTS = {
      winnableCount: 0.45,
      vocabRelevance: 0.05,
      skillDensity: 0.15,
      freshness: 0.15,
      mergeVelocity: 0.15,
      popularity: 0.05
    };
    SKILL_DENSITY_SATURATION = 3;
    SKILL_FLOOR_ENABLED = false;
    SKILL_FLOOR_MIN = 1;
    {
      const _sum = Object.values(CURATION_WEIGHTS).reduce((a, b) => a + b, 0);
      if (Math.abs(_sum - 1) > 1e-9) {
        throw new Error(`CURATION_WEIGHTS must sum to 1.0, got ${_sum}`);
      }
    }
    CURATION_NORM = {
      /** ~60 commits in the last ~30d is treated as "maxed" commit-cadence freshness. */
      commitCadence: 60,
      /** An issue posted within this many days is maximally fresh. */
      freshnessFullDays: 30,
      /** …and older than this contributes zero recency (linear decay between). */
      freshnessZeroDays: 180,
      /** log(stars) ceiling for popularity — reuses the winnability absolute-traction
       *  ceiling so "popular" means the same thing across both scorers. */
      starsLog: WINNABILITY_NORM.starsLog,
      /** Distinct contributors treated as "maxed" for the popularity tiebreaker. */
      contributors: 500
    };
    repoKeyOf = (fullName) => fullName.toLowerCase();
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
      if (isExcludedRepo(repo)) continue;
      if (isAiBanRepo(repo)) continue;
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
function normalizeCompany(company) {
  return (company ?? "").trim().toLowerCase();
}
function companyTierForJob(job) {
  const pool = BIGCO_SLUGS_BY_SOURCE[job.source];
  return pool && pool.has(normalizeCompany(job.company)) ? "bigco" : "standard";
}
function capJobsPerCompany(jobs, max = MAX_JOBS_PER_COMPANY) {
  if (!Number.isFinite(max) || max <= 0) return jobs.slice();
  const perCompany = /* @__PURE__ */ new Map();
  const out = [];
  for (const job of jobs) {
    const key = normalizeCompany(job.company);
    if (!key) {
      out.push(job);
      continue;
    }
    const n = perCompany.get(key) ?? 0;
    if (n >= max) continue;
    perCompany.set(key, n + 1);
    out.push(job);
  }
  return out;
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
  const seenFeedIds = /* @__PURE__ */ new Set();
  const feedJobs = [];
  const sourceNames = ["greenhouse", "ashby", "lever", "workable", "himalayas", "wwr", "hn"];
  for (let i = 0; i < settled.length; i++) {
    const result = settled[i];
    if (result.status === "rejected") {
      console.warn(`[feeds] ${sourceNames[i]} failed:`, result.reason);
      continue;
    }
    for (const job of result.value) {
      if (!seenFeedIds.has(job.id)) {
        seenFeedIds.add(job.id);
        feedJobs.push(job);
      }
    }
  }
  for (const job of feedJobs) job.companyTier = companyTierForJob(job);
  const jobs = capJobsPerCompany(feedJobs, opts?.maxJobsPerCompany ?? MAX_JOBS_PER_COMPANY);
  const seen = new Set(jobs.map((j) => j.id));
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
var FEEDS, GREENHOUSE_SLUGS_BY_TIER, ASHBY_SLUGS_BY_TIER, LEVER_SLUGS_BY_TIER, DEFAULT_GREENHOUSE_SLUGS, DEFAULT_ASHBY_SLUGS, DEFAULT_LEVER_SLUGS, DEFAULT_WORKABLE_SLUGS, MAX_JOBS_PER_COMPANY, BIGCO_SLUGS_BY_SOURCE;
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
    init_directory();
    init_bounty_gate();
    init_bounty_gate();
    init_contribution_gate();
    init_contribution_classify();
    init_contributions();
    init_projectCuration();
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
    MAX_JOBS_PER_COMPANY = 10;
    BIGCO_SLUGS_BY_SOURCE = {
      greenhouse: new Set(GREENHOUSE_SLUGS_BY_TIER.bigco.map((s) => s.toLowerCase())),
      ashby: new Set(ASHBY_SLUGS_BY_TIER.bigco.map((s) => s.toLowerCase())),
      lever: new Set(LEVER_SLUGS_BY_TIER.bigco.map((s) => s.toLowerCase()))
    };
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
function collectScoreTargets(jobs, contribute) {
  const out = [];
  for (const j of jobs) {
    if (j.source === "bounty" && j.bounty?.repoFullName) {
      out.push({
        job: j,
        repo: j.bounty.repoFullName,
        stars: j.bounty.repoStars ?? 0,
        competingOpenPRs: j.bounty.competingOpenPRs
      });
    }
  }
  for (const j of contribute) {
    if (j.contribution?.repoFullName) {
      out.push({
        job: j,
        repo: j.contribution.repoFullName,
        stars: j.contribution.repoStars ?? 0,
        competingOpenPRs: j.contribution.openPRsAtDiscovery
      });
    }
  }
  return out;
}
async function enrichWinnability(jobs, contribute, w) {
  const maxRepos = w.maxRepos ?? 30;
  const now = w.now ?? Date.now();
  const priorStars = w.priorStars ?? {};
  const hnText = jobs.filter((j) => j.source === "hn").map((j) => `${j.title} ${j.company} ${j.url}`.toLowerCase());
  const mentionsOf = (slug) => {
    const s = slug.toLowerCase();
    let n = 0;
    for (const t of hnText) if (t.includes(s)) n++;
    return n;
  };
  const byRepo = /* @__PURE__ */ new Map();
  for (const t of collectScoreTargets(jobs, contribute)) {
    const bucket = byRepo.get(t.repo);
    if (bucket) bucket.push(t);
    else byRepo.set(t.repo, [t]);
  }
  const starsOf = (repo) => byRepo.get(repo)?.[0]?.stars ?? 0;
  const repos = [...byRepo.keys()].sort((a, b) => starsOf(b) - starsOf(a));
  const scored = repos.slice(0, maxRepos);
  const cappedOut = repos.length - scored.length;
  const gov = w.governor ?? makeGitHubGovernor(
    w.fetchImpl ?? fetch,
    makeDefaultGovernorConfig({ paceEnabled: !w.fetchImpl })
  );
  let stoppedEarly = false;
  for (const repo of scored) {
    if (gov.tripped() || gov.budgetExhausted()) {
      stoppedEarly = true;
      break;
    }
    const targets = byRepo.get(repo) ?? [];
    const receptivity = await fetchRepoReceptivity(repo, {
      token: w.token,
      fetchImpl: w.fetchImpl,
      now,
      governor: gov
    });
    const stars = starsOf(repo);
    const prev = priorStars[repo];
    const velocity = prev != null ? Math.max(0, stars - prev) : 0;
    const social = mentionsOf(repo);
    const onTrending = w.trendingSlugs ? w.trendingSlugs.has(repo.toLowerCase()) : void 0;
    for (const { job, competingOpenPRs } of targets) {
      job.starVelocity30d = velocity;
      job.socialMentions = social;
      if (onTrending !== void 0) job.trending = onTrending;
      if (receptivity != null) {
        job.mergeReceptivity = receptivity;
        const signals = {
          trending: onTrending,
          starVelocity30d: velocity,
          socialMentions: social,
          repoStars: stars,
          mergeReceptivity: receptivity,
          competingOpenPRs,
          // vocabMatch is intentionally omitted server-side: the index is shared
          // anonymously (no dev fingerprint here). The CLI's own match() folds
          // vocab back in as the getBounties() comparator tiebreaker.
          vocabMatch: void 0
        };
        job.winnabilityScore = computeWinnability(signals).score;
      }
    }
  }
  if (stoppedEarly) {
    const reason = gov.tripped() ? "secondary-abuse breaker" : "wall-clock budget";
    console.warn(
      `[winnability] receptivity governor stopped the loop \u2014 ${reason} tripped; remaining repos left un-scored (legacy ranking). Governed egress halted to avoid prolonging the GitHub rate-limit window.`
    );
  }
  if (cappedOut > 0) {
    console.warn(
      `[winnability] receptivity cap hit \u2014 scored ${scored.length}/${repos.length} repos (${cappedOut} beyond maxRepos=${maxRepos} left un-scored, legacy ranking)`
    );
  }
}
function hasClickableUrl(url) {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}
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
    if (!hasClickableUrl(job.url)) continue;
    if (!seen.has(job.id)) {
      seen.add(job.id);
      allJobs.push(job);
    }
  }
  const jobs = allJobs.map(({ raw: _raw, ...rest }) => rest);
  const index = {
    builtAt: (/* @__PURE__ */ new Date()).toISOString(),
    jobs
  };
  if (opts?.includeContribute) {
    const contributions = await aggregateContributions(opts.contributeOpts);
    index.contribute = contributions.map(({ raw: _raw, ...rest }) => rest);
  }
  if (opts?.winnability) {
    await enrichWinnability(jobs, index.contribute ?? [], opts.winnability);
  }
  return index;
}
var init_indexer = __esm({
  "../../packages/core/src/indexer.ts"() {
    "use strict";
    init_feeds();
    init_contributions();
    init_partners();
    init_github();
    init_gh_governor();
    init_winnability();
  }
});

// ../../packages/core/src/github-issue-status.ts
function issueStatusHeaders(token) {
  const h = {
    Accept: "application/vnd.github+json",
    "User-Agent": "terminalhire",
    "X-GitHub-Api-Version": "2022-11-28"
  };
  if (token) h["Authorization"] = `Bearer ${token}`;
  return h;
}
async function getWithTimeout(governor, url, token, timeoutMs) {
  const headers = issueStatusHeaders(token);
  if (timeoutMs == null || timeoutMs <= 0) {
    return governor.get(url, { headers });
  }
  const controller = new AbortController();
  let timer;
  const getP = governor.get(url, { headers, signal: controller.signal });
  try {
    const res = await Promise.race([
      getP,
      new Promise((resolve) => {
        timer = setTimeout(() => resolve(null), timeoutMs);
      })
    ]);
    if (res === null) controller.abort();
    return res;
  } finally {
    if (timer) clearTimeout(timer);
  }
}
async function fetchIssueStatus(fullName, issueNumber, opts = {}) {
  const fetchImpl = opts.fetchImpl ?? ((url2, init) => fetch(url2, init));
  const governor = opts.governor ?? makeGitHubGovernor(fetchImpl, makeDefaultGovernorConfig({ paceEnabled: false }));
  const timeoutMs = opts.timeoutMs === void 0 ? DEFAULT_ISSUE_STATUS_TIMEOUT_MS : opts.timeoutMs;
  const url = `${GITHUB_API3}/repos/${fullName}/issues/${issueNumber}`;
  const res = await getWithTimeout(governor, url, opts.token, timeoutMs);
  if (!res || !res.ok) return null;
  let body;
  try {
    body = await res.json();
  } catch {
    return null;
  }
  const state = body.state === "open" ? "open" : body.state === "closed" ? "closed" : null;
  const assignees = /* @__PURE__ */ new Set();
  if (body.assignee && typeof body.assignee.login === "string") assignees.add(body.assignee.login);
  for (const a of body.assignees ?? []) {
    if (a && typeof a.login === "string") assignees.add(a.login);
  }
  const comments = typeof body.comments === "number" && Number.isFinite(body.comments) && body.comments >= 0 ? body.comments : null;
  return { state, assignees: [...assignees], comments };
}
var GITHUB_API3, DEFAULT_ISSUE_STATUS_TIMEOUT_MS;
var init_github_issue_status = __esm({
  "../../packages/core/src/github-issue-status.ts"() {
    "use strict";
    init_gh_governor();
    GITHUB_API3 = "https://api.github.com";
    DEFAULT_ISSUE_STATUS_TIMEOUT_MS = 4e3;
  }
});

// ../../packages/core/src/credit.ts
function verifyClaimCredit(claim, facts) {
  const reasons = [];
  const fail = (code, message) => reasons.push({ code, message });
  const norm = (r) => r.trim().toLowerCase();
  if (norm(facts.repo) !== norm(claim.repo))
    fail("repo-mismatch", `PR is in ${facts.repo}, claim is against ${claim.repo}`);
  if (!facts.merged) fail("not-merged", `PR #${facts.prNumber} is not merged`);
  if (facts.authorId == null || facts.authorId !== claim.claimantId)
    fail("author-mismatch", `PR author id ${facts.authorId} !== claimant id ${claim.claimantId}`);
  if (facts.merged && facts.mergedById != null && facts.authorId != null && facts.mergedById === facts.authorId)
    fail("self-merged", `PR was merged by its own author (id ${facts.authorId})`);
  if (claim.claimedIssueNumber != null) {
    if (facts.closesIssues.length === 0)
      fail("issue-linkage-missing", `PR closes no issue; claim names #${claim.claimedIssueNumber}`);
    else if (!facts.closesIssues.includes(claim.claimedIssueNumber))
      fail(
        "issue-linkage-mismatch",
        `PR closes ${facts.closesIssues.map((n) => "#" + n).join(", ")}; claim names #${claim.claimedIssueNumber}`
      );
  }
  if (reasons.length === 0) reasons.push({ code: "ok", message: "all credit predicates hold" });
  return { ok: reasons.every((r) => r.code === "ok"), reasons };
}
var init_credit = __esm({
  "../../packages/core/src/credit.ts"() {
    "use strict";
  }
});

// ../../packages/core/src/intro.ts
function buildIntroPayload(input) {
  const payload = {
    requesterLogin: input.requesterLogin,
    requesterDisplayName: input.requesterDisplayName,
    requesterContact: input.requesterContact,
    targetLogin: input.targetLogin
  };
  const note = input.note?.trim();
  if (note) payload.note = note;
  return payload;
}
function rejectExtraIntroFields(body) {
  for (const key of Object.keys(body)) {
    if (!INTRO_ALLOWED_SET.has(key)) {
      return `intro payload contains disallowed field: "${key}"`;
    }
  }
  return null;
}
function validateIntroPayload(body) {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return { ok: false, reason: "intro payload must be a JSON object" };
  }
  const b = body;
  const extra = rejectExtraIntroFields(b);
  if (extra) return { ok: false, reason: extra };
  const ok = (v, max) => typeof v === "string" && v.trim().length > 0 && v.length <= max;
  if (!ok(b.requesterLogin, MAX_SHORT)) return { ok: false, reason: "requesterLogin is required" };
  if (!ok(b.requesterDisplayName, MAX_SHORT)) return { ok: false, reason: "requesterDisplayName is required" };
  if (!ok(b.requesterContact, MAX_SHORT)) return { ok: false, reason: "requesterContact is required" };
  if (!ok(b.targetLogin, MAX_SHORT)) return { ok: false, reason: "targetLogin is required" };
  if (b.note !== void 0 && (typeof b.note !== "string" || b.note.length > MAX_NOTE)) {
    return { ok: false, reason: "note must be a string of at most 500 chars" };
  }
  const value = {
    requesterLogin: b.requesterLogin.trim(),
    requesterDisplayName: b.requesterDisplayName.trim(),
    requesterContact: b.requesterContact.trim(),
    targetLogin: b.targetLogin.trim()
  };
  const note = typeof b.note === "string" ? b.note.trim() : "";
  if (note) value.note = note;
  return { ok: true, value };
}
function introRateLimitCheck(history, now, opts) {
  const cutoff = now - opts.windowMs;
  const recent = history.filter((t) => t > cutoff);
  if (recent.length >= opts.max) {
    const oldest = recent[0] ?? now;
    return { allowed: false, retained: recent, retryAfterMs: Math.max(0, oldest + opts.windowMs - now) };
  }
  return { allowed: true, retained: [...recent, now], retryAfterMs: 0 };
}
function isOverIntroLimit(recentCount, max) {
  return recentCount >= max;
}
function composeIntroEmail(args) {
  const subject = `New intro request from @${args.requesterLogin} \xB7 terminalhire`;
  const text = `@${args.requesterLogin} wants an intro to you on terminalhire.

Sign in to view the request and choose whether to share your contact back:
${args.dashboardUrl}

You control whether this connects \u2014 no contact details are shared unless you accept.

\u2014 Terminalhire`;
  return { subject, text };
}
function introActorRole(intro, actorLogin) {
  if (sameLogin(actorLogin, intro.targetLogin)) return "target";
  if (sameLogin(actorLogin, intro.requesterLogin)) return "requester";
  return "other";
}
function sameLogin(a, b) {
  const an = a.trim().toLowerCase();
  return an.length > 0 && an === b.trim().toLowerCase();
}
function authorizeIntroDecision(intro, actorLogin) {
  const role = introActorRole(intro, actorLogin);
  if (role === "target") return { ok: true };
  if (role === "requester") {
    return { ok: false, status: 403, reason: "the requester cannot accept or decline their own intro request" };
  }
  return { ok: false, status: 404, reason: "intro not found" };
}
function authorizeIntroDeletion(intro, actorLogin) {
  const role = introActorRole(intro, actorLogin);
  if (role === "other") return { ok: false, status: 404, reason: "intro not found" };
  return { ok: true };
}
function revealIntroContacts(intro) {
  if (intro.status !== "accepted") return { toRequester: null, toTarget: null };
  return { toRequester: intro.targetContact ?? null, toTarget: intro.requesterContact };
}
function validateTargetContact(v) {
  if (typeof v !== "string" || v.trim().length === 0) return { ok: false, reason: "targetContact is required" };
  if (v.length > MAX_SHORT) return { ok: false, reason: `targetContact must be at most ${MAX_SHORT} chars` };
  return { ok: true, value: v.trim() };
}
function buildIntroListItem(intro, viewerLogin) {
  const role = introActorRole(intro, viewerLogin);
  if (role === "other") return null;
  const reveal = revealIntroContacts(intro);
  if (role === "target") {
    return {
      id: intro.id,
      role: "incoming",
      counterpartyLogin: intro.requesterLogin,
      status: intro.status,
      note: intro.note ?? null,
      contact: reveal.toTarget
    };
  }
  return {
    id: intro.id,
    role: "outgoing",
    counterpartyLogin: intro.targetLogin,
    status: intro.status,
    note: intro.note ?? null,
    contact: reveal.toRequester
  };
}
function composeIntroAcceptedEmail(args) {
  const subject = `Intro connected with @${args.counterpartyLogin} \xB7 terminalhire`;
  const lead = args.recipientRole === "requester" ? `@${args.counterpartyLogin} accepted your intro request on terminalhire.` : `You accepted @${args.counterpartyLogin}'s intro request on terminalhire.`;
  const text = `${lead}

You can now reach them directly:
    @${args.counterpartyLogin} \u2014 ${args.counterpartyContact}

Take it from here.

\u2014 Terminalhire`;
  return { subject, text };
}
function introRetentionAction(row, now) {
  if (row.status === "pending") {
    const created = Date.parse(row.createdAt);
    if (Number.isFinite(created) && now - created > INTRO_PENDING_TTL_MS) return "purge";
    return "keep";
  }
  if (row.status === "declined") {
    return row.hasContact ? "scrub-declined" : "keep";
  }
  if (row.status === "accepted") {
    const updated = Date.parse(row.updatedAt);
    if (row.hasContact && Number.isFinite(updated) && now - updated > INTRO_ACCEPTED_TTL_MS) {
      return "expire-accepted";
    }
    return "keep";
  }
  return "keep";
}
var INTRO_ALLOWED_FIELDS, INTRO_ALLOWED_SET, MAX_SHORT, MAX_NOTE, INTRO_PENDING_TTL_MS, INTRO_ACCEPTED_TTL_MS;
var init_intro = __esm({
  "../../packages/core/src/intro.ts"() {
    "use strict";
    INTRO_ALLOWED_FIELDS = [
      "requesterLogin",
      "requesterDisplayName",
      "requesterContact",
      "note",
      "targetLogin"
    ];
    INTRO_ALLOWED_SET = new Set(INTRO_ALLOWED_FIELDS);
    MAX_SHORT = 200;
    MAX_NOTE = 500;
    INTRO_PENDING_TTL_MS = 30 * 24 * 60 * 60 * 1e3;
    INTRO_ACCEPTED_TTL_MS = 365 * 24 * 60 * 60 * 1e3;
  }
});

// ../../packages/core/src/directoryThreshold.ts
var STRONG_MATCH_THRESHOLD;
var init_directoryThreshold = __esm({
  "../../packages/core/src/directoryThreshold.ts"() {
    "use strict";
    STRONG_MATCH_THRESHOLD = 0.58;
  }
});

// ../../node_modules/@noble/hashes/esm/cryptoNode.js
import * as nc from "crypto";
var crypto;
var init_cryptoNode = __esm({
  "../../node_modules/@noble/hashes/esm/cryptoNode.js"() {
    "use strict";
    crypto = nc && typeof nc === "object" && "webcrypto" in nc ? nc.webcrypto : nc && typeof nc === "object" && "randomBytes" in nc ? nc : void 0;
  }
});

// ../../node_modules/@noble/hashes/esm/utils.js
function isBytes(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
}
function anumber(n) {
  if (!Number.isSafeInteger(n) || n < 0)
    throw new Error("positive integer expected, got " + n);
}
function abytes(b, ...lengths) {
  if (!isBytes(b))
    throw new Error("Uint8Array expected");
  if (lengths.length > 0 && !lengths.includes(b.length))
    throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b.length);
}
function aexists(instance, checkFinished = true) {
  if (instance.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (checkFinished && instance.finished)
    throw new Error("Hash#digest() has already been called");
}
function aoutput(out, instance) {
  abytes(out);
  const min = instance.outputLen;
  if (out.length < min) {
    throw new Error("digestInto() expects output buffer of length at least " + min);
  }
}
function clean(...arrays) {
  for (let i = 0; i < arrays.length; i++) {
    arrays[i].fill(0);
  }
}
function createView(arr) {
  return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
function bytesToHex(bytes) {
  abytes(bytes);
  if (hasHexBuiltin)
    return bytes.toHex();
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex += hexes[bytes[i]];
  }
  return hex;
}
function asciiToBase16(ch) {
  if (ch >= asciis._0 && ch <= asciis._9)
    return ch - asciis._0;
  if (ch >= asciis.A && ch <= asciis.F)
    return ch - (asciis.A - 10);
  if (ch >= asciis.a && ch <= asciis.f)
    return ch - (asciis.a - 10);
  return;
}
function hexToBytes(hex) {
  if (typeof hex !== "string")
    throw new Error("hex string expected, got " + typeof hex);
  if (hasHexBuiltin)
    return Uint8Array.fromHex(hex);
  const hl = hex.length;
  const al = hl / 2;
  if (hl % 2)
    throw new Error("hex string expected, got unpadded hex of length " + hl);
  const array = new Uint8Array(al);
  for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
    const n1 = asciiToBase16(hex.charCodeAt(hi));
    const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
    if (n1 === void 0 || n2 === void 0) {
      const char = hex[hi] + hex[hi + 1];
      throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
    }
    array[ai] = n1 * 16 + n2;
  }
  return array;
}
function utf8ToBytes(str) {
  if (typeof str !== "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(str));
}
function toBytes(data) {
  if (typeof data === "string")
    data = utf8ToBytes(data);
  abytes(data);
  return data;
}
function concatBytes(...arrays) {
  let sum = 0;
  for (let i = 0; i < arrays.length; i++) {
    const a = arrays[i];
    abytes(a);
    sum += a.length;
  }
  const res = new Uint8Array(sum);
  for (let i = 0, pad = 0; i < arrays.length; i++) {
    const a = arrays[i];
    res.set(a, pad);
    pad += a.length;
  }
  return res;
}
function createHasher(hashCons) {
  const hashC = (msg) => hashCons().update(toBytes(msg)).digest();
  const tmp = hashCons();
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = () => hashCons();
  return hashC;
}
function randomBytes(bytesLength = 32) {
  if (crypto && typeof crypto.getRandomValues === "function") {
    return crypto.getRandomValues(new Uint8Array(bytesLength));
  }
  if (crypto && typeof crypto.randomBytes === "function") {
    return Uint8Array.from(crypto.randomBytes(bytesLength));
  }
  throw new Error("crypto.getRandomValues must be defined");
}
var hasHexBuiltin, hexes, asciis, Hash;
var init_utils = __esm({
  "../../node_modules/@noble/hashes/esm/utils.js"() {
    "use strict";
    init_cryptoNode();
    hasHexBuiltin = /* @__PURE__ */ (() => (
      // @ts-ignore
      typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function"
    ))();
    hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
    asciis = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
    Hash = class {
    };
  }
});

// ../../node_modules/@noble/hashes/esm/_md.js
function setBigUint64(view, byteOffset, value, isLE2) {
  if (typeof view.setBigUint64 === "function")
    return view.setBigUint64(byteOffset, value, isLE2);
  const _32n2 = BigInt(32);
  const _u32_max = BigInt(4294967295);
  const wh = Number(value >> _32n2 & _u32_max);
  const wl = Number(value & _u32_max);
  const h = isLE2 ? 4 : 0;
  const l = isLE2 ? 0 : 4;
  view.setUint32(byteOffset + h, wh, isLE2);
  view.setUint32(byteOffset + l, wl, isLE2);
}
var HashMD, SHA512_IV;
var init_md = __esm({
  "../../node_modules/@noble/hashes/esm/_md.js"() {
    "use strict";
    init_utils();
    HashMD = class extends Hash {
      constructor(blockLen, outputLen, padOffset, isLE2) {
        super();
        this.finished = false;
        this.length = 0;
        this.pos = 0;
        this.destroyed = false;
        this.blockLen = blockLen;
        this.outputLen = outputLen;
        this.padOffset = padOffset;
        this.isLE = isLE2;
        this.buffer = new Uint8Array(blockLen);
        this.view = createView(this.buffer);
      }
      update(data) {
        aexists(this);
        data = toBytes(data);
        abytes(data);
        const { view, buffer, blockLen } = this;
        const len = data.length;
        for (let pos = 0; pos < len; ) {
          const take = Math.min(blockLen - this.pos, len - pos);
          if (take === blockLen) {
            const dataView = createView(data);
            for (; blockLen <= len - pos; pos += blockLen)
              this.process(dataView, pos);
            continue;
          }
          buffer.set(data.subarray(pos, pos + take), this.pos);
          this.pos += take;
          pos += take;
          if (this.pos === blockLen) {
            this.process(view, 0);
            this.pos = 0;
          }
        }
        this.length += data.length;
        this.roundClean();
        return this;
      }
      digestInto(out) {
        aexists(this);
        aoutput(out, this);
        this.finished = true;
        const { buffer, view, blockLen, isLE: isLE2 } = this;
        let { pos } = this;
        buffer[pos++] = 128;
        clean(this.buffer.subarray(pos));
        if (this.padOffset > blockLen - pos) {
          this.process(view, 0);
          pos = 0;
        }
        for (let i = pos; i < blockLen; i++)
          buffer[i] = 0;
        setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE2);
        this.process(view, 0);
        const oview = createView(out);
        const len = this.outputLen;
        if (len % 4)
          throw new Error("_sha2: outputLen should be aligned to 32bit");
        const outLen = len / 4;
        const state = this.get();
        if (outLen > state.length)
          throw new Error("_sha2: outputLen bigger than state");
        for (let i = 0; i < outLen; i++)
          oview.setUint32(4 * i, state[i], isLE2);
      }
      digest() {
        const { buffer, outputLen } = this;
        this.digestInto(buffer);
        const res = buffer.slice(0, outputLen);
        this.destroy();
        return res;
      }
      _cloneInto(to) {
        to || (to = new this.constructor());
        to.set(...this.get());
        const { blockLen, buffer, length, finished, destroyed, pos } = this;
        to.destroyed = destroyed;
        to.finished = finished;
        to.length = length;
        to.pos = pos;
        if (length % blockLen)
          to.buffer.set(buffer);
        return to;
      }
      clone() {
        return this._cloneInto();
      }
    };
    SHA512_IV = /* @__PURE__ */ Uint32Array.from([
      1779033703,
      4089235720,
      3144134277,
      2227873595,
      1013904242,
      4271175723,
      2773480762,
      1595750129,
      1359893119,
      2917565137,
      2600822924,
      725511199,
      528734635,
      4215389547,
      1541459225,
      327033209
    ]);
  }
});

// ../../node_modules/@noble/hashes/esm/_u64.js
function fromBig(n, le = false) {
  if (le)
    return { h: Number(n & U32_MASK64), l: Number(n >> _32n & U32_MASK64) };
  return { h: Number(n >> _32n & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
}
function split(lst, le = false) {
  const len = lst.length;
  let Ah = new Uint32Array(len);
  let Al = new Uint32Array(len);
  for (let i = 0; i < len; i++) {
    const { h, l } = fromBig(lst[i], le);
    [Ah[i], Al[i]] = [h, l];
  }
  return [Ah, Al];
}
function add(Ah, Al, Bh, Bl) {
  const l = (Al >>> 0) + (Bl >>> 0);
  return { h: Ah + Bh + (l / 2 ** 32 | 0) | 0, l: l | 0 };
}
var U32_MASK64, _32n, shrSH, shrSL, rotrSH, rotrSL, rotrBH, rotrBL, add3L, add3H, add4L, add4H, add5L, add5H;
var init_u64 = __esm({
  "../../node_modules/@noble/hashes/esm/_u64.js"() {
    "use strict";
    U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
    _32n = /* @__PURE__ */ BigInt(32);
    shrSH = (h, _l, s) => h >>> s;
    shrSL = (h, l, s) => h << 32 - s | l >>> s;
    rotrSH = (h, l, s) => h >>> s | l << 32 - s;
    rotrSL = (h, l, s) => h << 32 - s | l >>> s;
    rotrBH = (h, l, s) => h << 64 - s | l >>> s - 32;
    rotrBL = (h, l, s) => h >>> s - 32 | l << 64 - s;
    add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
    add3H = (low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0;
    add4L = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
    add4H = (low, Ah, Bh, Ch, Dh) => Ah + Bh + Ch + Dh + (low / 2 ** 32 | 0) | 0;
    add5L = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
    add5H = (low, Ah, Bh, Ch, Dh, Eh) => Ah + Bh + Ch + Dh + Eh + (low / 2 ** 32 | 0) | 0;
  }
});

// ../../node_modules/@noble/hashes/esm/sha2.js
var K512, SHA512_Kh, SHA512_Kl, SHA512_W_H, SHA512_W_L, SHA512, sha512;
var init_sha2 = __esm({
  "../../node_modules/@noble/hashes/esm/sha2.js"() {
    "use strict";
    init_md();
    init_u64();
    init_utils();
    K512 = /* @__PURE__ */ (() => split([
      "0x428a2f98d728ae22",
      "0x7137449123ef65cd",
      "0xb5c0fbcfec4d3b2f",
      "0xe9b5dba58189dbbc",
      "0x3956c25bf348b538",
      "0x59f111f1b605d019",
      "0x923f82a4af194f9b",
      "0xab1c5ed5da6d8118",
      "0xd807aa98a3030242",
      "0x12835b0145706fbe",
      "0x243185be4ee4b28c",
      "0x550c7dc3d5ffb4e2",
      "0x72be5d74f27b896f",
      "0x80deb1fe3b1696b1",
      "0x9bdc06a725c71235",
      "0xc19bf174cf692694",
      "0xe49b69c19ef14ad2",
      "0xefbe4786384f25e3",
      "0x0fc19dc68b8cd5b5",
      "0x240ca1cc77ac9c65",
      "0x2de92c6f592b0275",
      "0x4a7484aa6ea6e483",
      "0x5cb0a9dcbd41fbd4",
      "0x76f988da831153b5",
      "0x983e5152ee66dfab",
      "0xa831c66d2db43210",
      "0xb00327c898fb213f",
      "0xbf597fc7beef0ee4",
      "0xc6e00bf33da88fc2",
      "0xd5a79147930aa725",
      "0x06ca6351e003826f",
      "0x142929670a0e6e70",
      "0x27b70a8546d22ffc",
      "0x2e1b21385c26c926",
      "0x4d2c6dfc5ac42aed",
      "0x53380d139d95b3df",
      "0x650a73548baf63de",
      "0x766a0abb3c77b2a8",
      "0x81c2c92e47edaee6",
      "0x92722c851482353b",
      "0xa2bfe8a14cf10364",
      "0xa81a664bbc423001",
      "0xc24b8b70d0f89791",
      "0xc76c51a30654be30",
      "0xd192e819d6ef5218",
      "0xd69906245565a910",
      "0xf40e35855771202a",
      "0x106aa07032bbd1b8",
      "0x19a4c116b8d2d0c8",
      "0x1e376c085141ab53",
      "0x2748774cdf8eeb99",
      "0x34b0bcb5e19b48a8",
      "0x391c0cb3c5c95a63",
      "0x4ed8aa4ae3418acb",
      "0x5b9cca4f7763e373",
      "0x682e6ff3d6b2b8a3",
      "0x748f82ee5defb2fc",
      "0x78a5636f43172f60",
      "0x84c87814a1f0ab72",
      "0x8cc702081a6439ec",
      "0x90befffa23631e28",
      "0xa4506cebde82bde9",
      "0xbef9a3f7b2c67915",
      "0xc67178f2e372532b",
      "0xca273eceea26619c",
      "0xd186b8c721c0c207",
      "0xeada7dd6cde0eb1e",
      "0xf57d4f7fee6ed178",
      "0x06f067aa72176fba",
      "0x0a637dc5a2c898a6",
      "0x113f9804bef90dae",
      "0x1b710b35131c471b",
      "0x28db77f523047d84",
      "0x32caab7b40c72493",
      "0x3c9ebe0a15c9bebc",
      "0x431d67c49c100d4c",
      "0x4cc5d4becb3e42b6",
      "0x597f299cfc657e2a",
      "0x5fcb6fab3ad6faec",
      "0x6c44198c4a475817"
    ].map((n) => BigInt(n))))();
    SHA512_Kh = /* @__PURE__ */ (() => K512[0])();
    SHA512_Kl = /* @__PURE__ */ (() => K512[1])();
    SHA512_W_H = /* @__PURE__ */ new Uint32Array(80);
    SHA512_W_L = /* @__PURE__ */ new Uint32Array(80);
    SHA512 = class extends HashMD {
      constructor(outputLen = 64) {
        super(128, outputLen, 16, false);
        this.Ah = SHA512_IV[0] | 0;
        this.Al = SHA512_IV[1] | 0;
        this.Bh = SHA512_IV[2] | 0;
        this.Bl = SHA512_IV[3] | 0;
        this.Ch = SHA512_IV[4] | 0;
        this.Cl = SHA512_IV[5] | 0;
        this.Dh = SHA512_IV[6] | 0;
        this.Dl = SHA512_IV[7] | 0;
        this.Eh = SHA512_IV[8] | 0;
        this.El = SHA512_IV[9] | 0;
        this.Fh = SHA512_IV[10] | 0;
        this.Fl = SHA512_IV[11] | 0;
        this.Gh = SHA512_IV[12] | 0;
        this.Gl = SHA512_IV[13] | 0;
        this.Hh = SHA512_IV[14] | 0;
        this.Hl = SHA512_IV[15] | 0;
      }
      // prettier-ignore
      get() {
        const { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
        return [Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl];
      }
      // prettier-ignore
      set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl) {
        this.Ah = Ah | 0;
        this.Al = Al | 0;
        this.Bh = Bh | 0;
        this.Bl = Bl | 0;
        this.Ch = Ch | 0;
        this.Cl = Cl | 0;
        this.Dh = Dh | 0;
        this.Dl = Dl | 0;
        this.Eh = Eh | 0;
        this.El = El | 0;
        this.Fh = Fh | 0;
        this.Fl = Fl | 0;
        this.Gh = Gh | 0;
        this.Gl = Gl | 0;
        this.Hh = Hh | 0;
        this.Hl = Hl | 0;
      }
      process(view, offset) {
        for (let i = 0; i < 16; i++, offset += 4) {
          SHA512_W_H[i] = view.getUint32(offset);
          SHA512_W_L[i] = view.getUint32(offset += 4);
        }
        for (let i = 16; i < 80; i++) {
          const W15h = SHA512_W_H[i - 15] | 0;
          const W15l = SHA512_W_L[i - 15] | 0;
          const s0h = rotrSH(W15h, W15l, 1) ^ rotrSH(W15h, W15l, 8) ^ shrSH(W15h, W15l, 7);
          const s0l = rotrSL(W15h, W15l, 1) ^ rotrSL(W15h, W15l, 8) ^ shrSL(W15h, W15l, 7);
          const W2h = SHA512_W_H[i - 2] | 0;
          const W2l = SHA512_W_L[i - 2] | 0;
          const s1h = rotrSH(W2h, W2l, 19) ^ rotrBH(W2h, W2l, 61) ^ shrSH(W2h, W2l, 6);
          const s1l = rotrSL(W2h, W2l, 19) ^ rotrBL(W2h, W2l, 61) ^ shrSL(W2h, W2l, 6);
          const SUMl = add4L(s0l, s1l, SHA512_W_L[i - 7], SHA512_W_L[i - 16]);
          const SUMh = add4H(SUMl, s0h, s1h, SHA512_W_H[i - 7], SHA512_W_H[i - 16]);
          SHA512_W_H[i] = SUMh | 0;
          SHA512_W_L[i] = SUMl | 0;
        }
        let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
        for (let i = 0; i < 80; i++) {
          const sigma1h = rotrSH(Eh, El, 14) ^ rotrSH(Eh, El, 18) ^ rotrBH(Eh, El, 41);
          const sigma1l = rotrSL(Eh, El, 14) ^ rotrSL(Eh, El, 18) ^ rotrBL(Eh, El, 41);
          const CHIh = Eh & Fh ^ ~Eh & Gh;
          const CHIl = El & Fl ^ ~El & Gl;
          const T1ll = add5L(Hl, sigma1l, CHIl, SHA512_Kl[i], SHA512_W_L[i]);
          const T1h = add5H(T1ll, Hh, sigma1h, CHIh, SHA512_Kh[i], SHA512_W_H[i]);
          const T1l = T1ll | 0;
          const sigma0h = rotrSH(Ah, Al, 28) ^ rotrBH(Ah, Al, 34) ^ rotrBH(Ah, Al, 39);
          const sigma0l = rotrSL(Ah, Al, 28) ^ rotrBL(Ah, Al, 34) ^ rotrBL(Ah, Al, 39);
          const MAJh = Ah & Bh ^ Ah & Ch ^ Bh & Ch;
          const MAJl = Al & Bl ^ Al & Cl ^ Bl & Cl;
          Hh = Gh | 0;
          Hl = Gl | 0;
          Gh = Fh | 0;
          Gl = Fl | 0;
          Fh = Eh | 0;
          Fl = El | 0;
          ({ h: Eh, l: El } = add(Dh | 0, Dl | 0, T1h | 0, T1l | 0));
          Dh = Ch | 0;
          Dl = Cl | 0;
          Ch = Bh | 0;
          Cl = Bl | 0;
          Bh = Ah | 0;
          Bl = Al | 0;
          const All = add3L(T1l, sigma0l, MAJl);
          Ah = add3H(All, T1h, sigma0h, MAJh);
          Al = All | 0;
        }
        ({ h: Ah, l: Al } = add(this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
        ({ h: Bh, l: Bl } = add(this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
        ({ h: Ch, l: Cl } = add(this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
        ({ h: Dh, l: Dl } = add(this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
        ({ h: Eh, l: El } = add(this.Eh | 0, this.El | 0, Eh | 0, El | 0));
        ({ h: Fh, l: Fl } = add(this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
        ({ h: Gh, l: Gl } = add(this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
        ({ h: Hh, l: Hl } = add(this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
        this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
      }
      roundClean() {
        clean(SHA512_W_H, SHA512_W_L);
      }
      destroy() {
        clean(this.buffer);
        this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
      }
    };
    sha512 = /* @__PURE__ */ createHasher(() => new SHA512());
  }
});

// ../../node_modules/@noble/curves/esm/utils.js
function _abool2(value, title = "") {
  if (typeof value !== "boolean") {
    const prefix = title && `"${title}"`;
    throw new Error(prefix + "expected boolean, got type=" + typeof value);
  }
  return value;
}
function _abytes2(value, length, title = "") {
  const bytes = isBytes(value);
  const len = value?.length;
  const needsLen = length !== void 0;
  if (!bytes || needsLen && len !== length) {
    const prefix = title && `"${title}" `;
    const ofLen = needsLen ? ` of length ${length}` : "";
    const got = bytes ? `length=${len}` : `type=${typeof value}`;
    throw new Error(prefix + "expected Uint8Array" + ofLen + ", got " + got);
  }
  return value;
}
function hexToNumber(hex) {
  if (typeof hex !== "string")
    throw new Error("hex string expected, got " + typeof hex);
  return hex === "" ? _0n : BigInt("0x" + hex);
}
function bytesToNumberBE(bytes) {
  return hexToNumber(bytesToHex(bytes));
}
function bytesToNumberLE(bytes) {
  abytes(bytes);
  return hexToNumber(bytesToHex(Uint8Array.from(bytes).reverse()));
}
function numberToBytesBE(n, len) {
  return hexToBytes(n.toString(16).padStart(len * 2, "0"));
}
function numberToBytesLE(n, len) {
  return numberToBytesBE(n, len).reverse();
}
function ensureBytes(title, hex, expectedLength) {
  let res;
  if (typeof hex === "string") {
    try {
      res = hexToBytes(hex);
    } catch (e) {
      throw new Error(title + " must be hex string or Uint8Array, cause: " + e);
    }
  } else if (isBytes(hex)) {
    res = Uint8Array.from(hex);
  } else {
    throw new Error(title + " must be hex string or Uint8Array");
  }
  const len = res.length;
  if (typeof expectedLength === "number" && len !== expectedLength)
    throw new Error(title + " of length " + expectedLength + " expected, got " + len);
  return res;
}
function equalBytes(a, b) {
  if (a.length !== b.length)
    return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++)
    diff |= a[i] ^ b[i];
  return diff === 0;
}
function copyBytes(bytes) {
  return Uint8Array.from(bytes);
}
function inRange(n, min, max) {
  return isPosBig(n) && isPosBig(min) && isPosBig(max) && min <= n && n < max;
}
function aInRange(title, n, min, max) {
  if (!inRange(n, min, max))
    throw new Error("expected valid " + title + ": " + min + " <= n < " + max + ", got " + n);
}
function bitLen(n) {
  let len;
  for (len = 0; n > _0n; n >>= _1n, len += 1)
    ;
  return len;
}
function _validateObject(object, fields, optFields = {}) {
  if (!object || typeof object !== "object")
    throw new Error("expected valid options object");
  function checkField(fieldName, expectedType, isOpt) {
    const val = object[fieldName];
    if (isOpt && val === void 0)
      return;
    const current = typeof val;
    if (current !== expectedType || val === null)
      throw new Error(`param "${fieldName}" is invalid: expected ${expectedType}, got ${current}`);
  }
  Object.entries(fields).forEach(([k, v]) => checkField(k, v, false));
  Object.entries(optFields).forEach(([k, v]) => checkField(k, v, true));
}
function memoized(fn) {
  const map = /* @__PURE__ */ new WeakMap();
  return (arg, ...args) => {
    const val = map.get(arg);
    if (val !== void 0)
      return val;
    const computed = fn(arg, ...args);
    map.set(arg, computed);
    return computed;
  };
}
var _0n, _1n, isPosBig, bitMask, notImplemented;
var init_utils2 = __esm({
  "../../node_modules/@noble/curves/esm/utils.js"() {
    "use strict";
    init_utils();
    init_utils();
    _0n = /* @__PURE__ */ BigInt(0);
    _1n = /* @__PURE__ */ BigInt(1);
    isPosBig = (n) => typeof n === "bigint" && _0n <= n;
    bitMask = (n) => (_1n << BigInt(n)) - _1n;
    notImplemented = () => {
      throw new Error("not implemented");
    };
  }
});

// ../../node_modules/@noble/curves/esm/abstract/modular.js
function mod(a, b) {
  const result = a % b;
  return result >= _0n2 ? result : b + result;
}
function pow2(x, power, modulo) {
  let res = x;
  while (power-- > _0n2) {
    res *= res;
    res %= modulo;
  }
  return res;
}
function invert(number, modulo) {
  if (number === _0n2)
    throw new Error("invert: expected non-zero number");
  if (modulo <= _0n2)
    throw new Error("invert: expected positive modulus, got " + modulo);
  let a = mod(number, modulo);
  let b = modulo;
  let x = _0n2, y = _1n2, u = _1n2, v = _0n2;
  while (a !== _0n2) {
    const q = b / a;
    const r = b % a;
    const m = x - u * q;
    const n = y - v * q;
    b = a, a = r, x = u, y = v, u = m, v = n;
  }
  const gcd = b;
  if (gcd !== _1n2)
    throw new Error("invert: does not exist");
  return mod(x, modulo);
}
function assertIsSquare(Fp2, root, n) {
  if (!Fp2.eql(Fp2.sqr(root), n))
    throw new Error("Cannot find square root");
}
function sqrt3mod4(Fp2, n) {
  const p1div4 = (Fp2.ORDER + _1n2) / _4n;
  const root = Fp2.pow(n, p1div4);
  assertIsSquare(Fp2, root, n);
  return root;
}
function sqrt5mod8(Fp2, n) {
  const p5div8 = (Fp2.ORDER - _5n) / _8n;
  const n2 = Fp2.mul(n, _2n);
  const v = Fp2.pow(n2, p5div8);
  const nv = Fp2.mul(n, v);
  const i = Fp2.mul(Fp2.mul(nv, _2n), v);
  const root = Fp2.mul(nv, Fp2.sub(i, Fp2.ONE));
  assertIsSquare(Fp2, root, n);
  return root;
}
function sqrt9mod16(P) {
  const Fp_ = Field(P);
  const tn = tonelliShanks(P);
  const c1 = tn(Fp_, Fp_.neg(Fp_.ONE));
  const c2 = tn(Fp_, c1);
  const c3 = tn(Fp_, Fp_.neg(c1));
  const c4 = (P + _7n) / _16n;
  return (Fp2, n) => {
    let tv1 = Fp2.pow(n, c4);
    let tv2 = Fp2.mul(tv1, c1);
    const tv3 = Fp2.mul(tv1, c2);
    const tv4 = Fp2.mul(tv1, c3);
    const e1 = Fp2.eql(Fp2.sqr(tv2), n);
    const e2 = Fp2.eql(Fp2.sqr(tv3), n);
    tv1 = Fp2.cmov(tv1, tv2, e1);
    tv2 = Fp2.cmov(tv4, tv3, e2);
    const e3 = Fp2.eql(Fp2.sqr(tv2), n);
    const root = Fp2.cmov(tv1, tv2, e3);
    assertIsSquare(Fp2, root, n);
    return root;
  };
}
function tonelliShanks(P) {
  if (P < _3n)
    throw new Error("sqrt is not defined for small field");
  let Q = P - _1n2;
  let S = 0;
  while (Q % _2n === _0n2) {
    Q /= _2n;
    S++;
  }
  let Z = _2n;
  const _Fp = Field(P);
  while (FpLegendre(_Fp, Z) === 1) {
    if (Z++ > 1e3)
      throw new Error("Cannot find square root: probably non-prime P");
  }
  if (S === 1)
    return sqrt3mod4;
  let cc = _Fp.pow(Z, Q);
  const Q1div2 = (Q + _1n2) / _2n;
  return function tonelliSlow(Fp2, n) {
    if (Fp2.is0(n))
      return n;
    if (FpLegendre(Fp2, n) !== 1)
      throw new Error("Cannot find square root");
    let M = S;
    let c = Fp2.mul(Fp2.ONE, cc);
    let t = Fp2.pow(n, Q);
    let R = Fp2.pow(n, Q1div2);
    while (!Fp2.eql(t, Fp2.ONE)) {
      if (Fp2.is0(t))
        return Fp2.ZERO;
      let i = 1;
      let t_tmp = Fp2.sqr(t);
      while (!Fp2.eql(t_tmp, Fp2.ONE)) {
        i++;
        t_tmp = Fp2.sqr(t_tmp);
        if (i === M)
          throw new Error("Cannot find square root");
      }
      const exponent = _1n2 << BigInt(M - i - 1);
      const b = Fp2.pow(c, exponent);
      M = i;
      c = Fp2.sqr(b);
      t = Fp2.mul(t, c);
      R = Fp2.mul(R, b);
    }
    return R;
  };
}
function FpSqrt(P) {
  if (P % _4n === _3n)
    return sqrt3mod4;
  if (P % _8n === _5n)
    return sqrt5mod8;
  if (P % _16n === _9n)
    return sqrt9mod16(P);
  return tonelliShanks(P);
}
function validateField(field) {
  const initial = {
    ORDER: "bigint",
    MASK: "bigint",
    BYTES: "number",
    BITS: "number"
  };
  const opts = FIELD_FIELDS.reduce((map, val) => {
    map[val] = "function";
    return map;
  }, initial);
  _validateObject(field, opts);
  return field;
}
function FpPow(Fp2, num, power) {
  if (power < _0n2)
    throw new Error("invalid exponent, negatives unsupported");
  if (power === _0n2)
    return Fp2.ONE;
  if (power === _1n2)
    return num;
  let p = Fp2.ONE;
  let d = num;
  while (power > _0n2) {
    if (power & _1n2)
      p = Fp2.mul(p, d);
    d = Fp2.sqr(d);
    power >>= _1n2;
  }
  return p;
}
function FpInvertBatch(Fp2, nums, passZero = false) {
  const inverted = new Array(nums.length).fill(passZero ? Fp2.ZERO : void 0);
  const multipliedAcc = nums.reduce((acc, num, i) => {
    if (Fp2.is0(num))
      return acc;
    inverted[i] = acc;
    return Fp2.mul(acc, num);
  }, Fp2.ONE);
  const invertedAcc = Fp2.inv(multipliedAcc);
  nums.reduceRight((acc, num, i) => {
    if (Fp2.is0(num))
      return acc;
    inverted[i] = Fp2.mul(acc, inverted[i]);
    return Fp2.mul(acc, num);
  }, invertedAcc);
  return inverted;
}
function FpLegendre(Fp2, n) {
  const p1mod2 = (Fp2.ORDER - _1n2) / _2n;
  const powered = Fp2.pow(n, p1mod2);
  const yes = Fp2.eql(powered, Fp2.ONE);
  const zero = Fp2.eql(powered, Fp2.ZERO);
  const no = Fp2.eql(powered, Fp2.neg(Fp2.ONE));
  if (!yes && !zero && !no)
    throw new Error("invalid Legendre symbol result");
  return yes ? 1 : zero ? 0 : -1;
}
function nLength(n, nBitLength) {
  if (nBitLength !== void 0)
    anumber(nBitLength);
  const _nBitLength = nBitLength !== void 0 ? nBitLength : n.toString(2).length;
  const nByteLength = Math.ceil(_nBitLength / 8);
  return { nBitLength: _nBitLength, nByteLength };
}
function Field(ORDER, bitLenOrOpts, isLE2 = false, opts = {}) {
  if (ORDER <= _0n2)
    throw new Error("invalid field: expected ORDER > 0, got " + ORDER);
  let _nbitLength = void 0;
  let _sqrt = void 0;
  let modFromBytes = false;
  let allowedLengths = void 0;
  if (typeof bitLenOrOpts === "object" && bitLenOrOpts != null) {
    if (opts.sqrt || isLE2)
      throw new Error("cannot specify opts in two arguments");
    const _opts = bitLenOrOpts;
    if (_opts.BITS)
      _nbitLength = _opts.BITS;
    if (_opts.sqrt)
      _sqrt = _opts.sqrt;
    if (typeof _opts.isLE === "boolean")
      isLE2 = _opts.isLE;
    if (typeof _opts.modFromBytes === "boolean")
      modFromBytes = _opts.modFromBytes;
    allowedLengths = _opts.allowedLengths;
  } else {
    if (typeof bitLenOrOpts === "number")
      _nbitLength = bitLenOrOpts;
    if (opts.sqrt)
      _sqrt = opts.sqrt;
  }
  const { nBitLength: BITS, nByteLength: BYTES } = nLength(ORDER, _nbitLength);
  if (BYTES > 2048)
    throw new Error("invalid field: expected ORDER of <= 2048 bytes");
  let sqrtP;
  const f = Object.freeze({
    ORDER,
    isLE: isLE2,
    BITS,
    BYTES,
    MASK: bitMask(BITS),
    ZERO: _0n2,
    ONE: _1n2,
    allowedLengths,
    create: (num) => mod(num, ORDER),
    isValid: (num) => {
      if (typeof num !== "bigint")
        throw new Error("invalid field element: expected bigint, got " + typeof num);
      return _0n2 <= num && num < ORDER;
    },
    is0: (num) => num === _0n2,
    // is valid and invertible
    isValidNot0: (num) => !f.is0(num) && f.isValid(num),
    isOdd: (num) => (num & _1n2) === _1n2,
    neg: (num) => mod(-num, ORDER),
    eql: (lhs, rhs) => lhs === rhs,
    sqr: (num) => mod(num * num, ORDER),
    add: (lhs, rhs) => mod(lhs + rhs, ORDER),
    sub: (lhs, rhs) => mod(lhs - rhs, ORDER),
    mul: (lhs, rhs) => mod(lhs * rhs, ORDER),
    pow: (num, power) => FpPow(f, num, power),
    div: (lhs, rhs) => mod(lhs * invert(rhs, ORDER), ORDER),
    // Same as above, but doesn't normalize
    sqrN: (num) => num * num,
    addN: (lhs, rhs) => lhs + rhs,
    subN: (lhs, rhs) => lhs - rhs,
    mulN: (lhs, rhs) => lhs * rhs,
    inv: (num) => invert(num, ORDER),
    sqrt: _sqrt || ((n) => {
      if (!sqrtP)
        sqrtP = FpSqrt(ORDER);
      return sqrtP(f, n);
    }),
    toBytes: (num) => isLE2 ? numberToBytesLE(num, BYTES) : numberToBytesBE(num, BYTES),
    fromBytes: (bytes, skipValidation = true) => {
      if (allowedLengths) {
        if (!allowedLengths.includes(bytes.length) || bytes.length > BYTES) {
          throw new Error("Field.fromBytes: expected " + allowedLengths + " bytes, got " + bytes.length);
        }
        const padded = new Uint8Array(BYTES);
        padded.set(bytes, isLE2 ? 0 : padded.length - bytes.length);
        bytes = padded;
      }
      if (bytes.length !== BYTES)
        throw new Error("Field.fromBytes: expected " + BYTES + " bytes, got " + bytes.length);
      let scalar = isLE2 ? bytesToNumberLE(bytes) : bytesToNumberBE(bytes);
      if (modFromBytes)
        scalar = mod(scalar, ORDER);
      if (!skipValidation) {
        if (!f.isValid(scalar))
          throw new Error("invalid field element: outside of range 0..ORDER");
      }
      return scalar;
    },
    // TODO: we don't need it here, move out to separate fn
    invertBatch: (lst) => FpInvertBatch(f, lst),
    // We can't move this out because Fp6, Fp12 implement it
    // and it's unclear what to return in there.
    cmov: (a, b, c) => c ? b : a
  });
  return Object.freeze(f);
}
var _0n2, _1n2, _2n, _3n, _4n, _5n, _7n, _8n, _9n, _16n, isNegativeLE, FIELD_FIELDS;
var init_modular = __esm({
  "../../node_modules/@noble/curves/esm/abstract/modular.js"() {
    "use strict";
    init_utils2();
    _0n2 = BigInt(0);
    _1n2 = BigInt(1);
    _2n = /* @__PURE__ */ BigInt(2);
    _3n = /* @__PURE__ */ BigInt(3);
    _4n = /* @__PURE__ */ BigInt(4);
    _5n = /* @__PURE__ */ BigInt(5);
    _7n = /* @__PURE__ */ BigInt(7);
    _8n = /* @__PURE__ */ BigInt(8);
    _9n = /* @__PURE__ */ BigInt(9);
    _16n = /* @__PURE__ */ BigInt(16);
    isNegativeLE = (num, modulo) => (mod(num, modulo) & _1n2) === _1n2;
    FIELD_FIELDS = [
      "create",
      "isValid",
      "is0",
      "neg",
      "inv",
      "sqrt",
      "sqr",
      "eql",
      "add",
      "sub",
      "mul",
      "pow",
      "div",
      "addN",
      "subN",
      "mulN",
      "sqrN"
    ];
  }
});

// ../../node_modules/@noble/curves/esm/abstract/curve.js
function negateCt(condition, item) {
  const neg = item.negate();
  return condition ? neg : item;
}
function normalizeZ(c, points) {
  const invertedZs = FpInvertBatch(c.Fp, points.map((p) => p.Z));
  return points.map((p, i) => c.fromAffine(p.toAffine(invertedZs[i])));
}
function validateW(W, bits) {
  if (!Number.isSafeInteger(W) || W <= 0 || W > bits)
    throw new Error("invalid window size, expected [1.." + bits + "], got W=" + W);
}
function calcWOpts(W, scalarBits) {
  validateW(W, scalarBits);
  const windows = Math.ceil(scalarBits / W) + 1;
  const windowSize = 2 ** (W - 1);
  const maxNumber = 2 ** W;
  const mask = bitMask(W);
  const shiftBy = BigInt(W);
  return { windows, windowSize, mask, maxNumber, shiftBy };
}
function calcOffsets(n, window, wOpts) {
  const { windowSize, mask, maxNumber, shiftBy } = wOpts;
  let wbits = Number(n & mask);
  let nextN = n >> shiftBy;
  if (wbits > windowSize) {
    wbits -= maxNumber;
    nextN += _1n3;
  }
  const offsetStart = window * windowSize;
  const offset = offsetStart + Math.abs(wbits) - 1;
  const isZero = wbits === 0;
  const isNeg = wbits < 0;
  const isNegF = window % 2 !== 0;
  const offsetF = offsetStart;
  return { nextN, offset, isZero, isNeg, isNegF, offsetF };
}
function validateMSMPoints(points, c) {
  if (!Array.isArray(points))
    throw new Error("array expected");
  points.forEach((p, i) => {
    if (!(p instanceof c))
      throw new Error("invalid point at index " + i);
  });
}
function validateMSMScalars(scalars, field) {
  if (!Array.isArray(scalars))
    throw new Error("array of scalars expected");
  scalars.forEach((s, i) => {
    if (!field.isValid(s))
      throw new Error("invalid scalar at index " + i);
  });
}
function getW(P) {
  return pointWindowSizes.get(P) || 1;
}
function assert0(n) {
  if (n !== _0n3)
    throw new Error("invalid wNAF");
}
function pippenger(c, fieldN, points, scalars) {
  validateMSMPoints(points, c);
  validateMSMScalars(scalars, fieldN);
  const plength = points.length;
  const slength = scalars.length;
  if (plength !== slength)
    throw new Error("arrays of points and scalars must have equal length");
  const zero = c.ZERO;
  const wbits = bitLen(BigInt(plength));
  let windowSize = 1;
  if (wbits > 12)
    windowSize = wbits - 3;
  else if (wbits > 4)
    windowSize = wbits - 2;
  else if (wbits > 0)
    windowSize = 2;
  const MASK = bitMask(windowSize);
  const buckets = new Array(Number(MASK) + 1).fill(zero);
  const lastBits = Math.floor((fieldN.BITS - 1) / windowSize) * windowSize;
  let sum = zero;
  for (let i = lastBits; i >= 0; i -= windowSize) {
    buckets.fill(zero);
    for (let j = 0; j < slength; j++) {
      const scalar = scalars[j];
      const wbits2 = Number(scalar >> BigInt(i) & MASK);
      buckets[wbits2] = buckets[wbits2].add(points[j]);
    }
    let resI = zero;
    for (let j = buckets.length - 1, sumI = zero; j > 0; j--) {
      sumI = sumI.add(buckets[j]);
      resI = resI.add(sumI);
    }
    sum = sum.add(resI);
    if (i !== 0)
      for (let j = 0; j < windowSize; j++)
        sum = sum.double();
  }
  return sum;
}
function createField(order, field, isLE2) {
  if (field) {
    if (field.ORDER !== order)
      throw new Error("Field.ORDER must match order: Fp == p, Fn == n");
    validateField(field);
    return field;
  } else {
    return Field(order, { isLE: isLE2 });
  }
}
function _createCurveFields(type, CURVE, curveOpts = {}, FpFnLE) {
  if (FpFnLE === void 0)
    FpFnLE = type === "edwards";
  if (!CURVE || typeof CURVE !== "object")
    throw new Error(`expected valid ${type} CURVE object`);
  for (const p of ["p", "n", "h"]) {
    const val = CURVE[p];
    if (!(typeof val === "bigint" && val > _0n3))
      throw new Error(`CURVE.${p} must be positive bigint`);
  }
  const Fp2 = createField(CURVE.p, curveOpts.Fp, FpFnLE);
  const Fn2 = createField(CURVE.n, curveOpts.Fn, FpFnLE);
  const _b = type === "weierstrass" ? "b" : "d";
  const params = ["Gx", "Gy", "a", _b];
  for (const p of params) {
    if (!Fp2.isValid(CURVE[p]))
      throw new Error(`CURVE.${p} must be valid field element of CURVE.Fp`);
  }
  CURVE = Object.freeze(Object.assign({}, CURVE));
  return { CURVE, Fp: Fp2, Fn: Fn2 };
}
var _0n3, _1n3, pointPrecomputes, pointWindowSizes, wNAF;
var init_curve = __esm({
  "../../node_modules/@noble/curves/esm/abstract/curve.js"() {
    "use strict";
    init_utils2();
    init_modular();
    _0n3 = BigInt(0);
    _1n3 = BigInt(1);
    pointPrecomputes = /* @__PURE__ */ new WeakMap();
    pointWindowSizes = /* @__PURE__ */ new WeakMap();
    wNAF = class {
      // Parametrized with a given Point class (not individual point)
      constructor(Point, bits) {
        this.BASE = Point.BASE;
        this.ZERO = Point.ZERO;
        this.Fn = Point.Fn;
        this.bits = bits;
      }
      // non-const time multiplication ladder
      _unsafeLadder(elm, n, p = this.ZERO) {
        let d = elm;
        while (n > _0n3) {
          if (n & _1n3)
            p = p.add(d);
          d = d.double();
          n >>= _1n3;
        }
        return p;
      }
      /**
       * Creates a wNAF precomputation window. Used for caching.
       * Default window size is set by `utils.precompute()` and is equal to 8.
       * Number of precomputed points depends on the curve size:
       * 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
       * - 𝑊 is the window size
       * - 𝑛 is the bitlength of the curve order.
       * For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
       * @param point Point instance
       * @param W window size
       * @returns precomputed point tables flattened to a single array
       */
      precomputeWindow(point, W) {
        const { windows, windowSize } = calcWOpts(W, this.bits);
        const points = [];
        let p = point;
        let base = p;
        for (let window = 0; window < windows; window++) {
          base = p;
          points.push(base);
          for (let i = 1; i < windowSize; i++) {
            base = base.add(p);
            points.push(base);
          }
          p = base.double();
        }
        return points;
      }
      /**
       * Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
       * More compact implementation:
       * https://github.com/paulmillr/noble-secp256k1/blob/47cb1669b6e506ad66b35fe7d76132ae97465da2/index.ts#L502-L541
       * @returns real and fake (for const-time) points
       */
      wNAF(W, precomputes, n) {
        if (!this.Fn.isValid(n))
          throw new Error("invalid scalar");
        let p = this.ZERO;
        let f = this.BASE;
        const wo = calcWOpts(W, this.bits);
        for (let window = 0; window < wo.windows; window++) {
          const { nextN, offset, isZero, isNeg, isNegF, offsetF } = calcOffsets(n, window, wo);
          n = nextN;
          if (isZero) {
            f = f.add(negateCt(isNegF, precomputes[offsetF]));
          } else {
            p = p.add(negateCt(isNeg, precomputes[offset]));
          }
        }
        assert0(n);
        return { p, f };
      }
      /**
       * Implements ec unsafe (non const-time) multiplication using precomputed tables and w-ary non-adjacent form.
       * @param acc accumulator point to add result of multiplication
       * @returns point
       */
      wNAFUnsafe(W, precomputes, n, acc = this.ZERO) {
        const wo = calcWOpts(W, this.bits);
        for (let window = 0; window < wo.windows; window++) {
          if (n === _0n3)
            break;
          const { nextN, offset, isZero, isNeg } = calcOffsets(n, window, wo);
          n = nextN;
          if (isZero) {
            continue;
          } else {
            const item = precomputes[offset];
            acc = acc.add(isNeg ? item.negate() : item);
          }
        }
        assert0(n);
        return acc;
      }
      getPrecomputes(W, point, transform) {
        let comp = pointPrecomputes.get(point);
        if (!comp) {
          comp = this.precomputeWindow(point, W);
          if (W !== 1) {
            if (typeof transform === "function")
              comp = transform(comp);
            pointPrecomputes.set(point, comp);
          }
        }
        return comp;
      }
      cached(point, scalar, transform) {
        const W = getW(point);
        return this.wNAF(W, this.getPrecomputes(W, point, transform), scalar);
      }
      unsafe(point, scalar, transform, prev) {
        const W = getW(point);
        if (W === 1)
          return this._unsafeLadder(point, scalar, prev);
        return this.wNAFUnsafe(W, this.getPrecomputes(W, point, transform), scalar, prev);
      }
      // We calculate precomputes for elliptic curve point multiplication
      // using windowed method. This specifies window size and
      // stores precomputed values. Usually only base point would be precomputed.
      createCache(P, W) {
        validateW(W, this.bits);
        pointWindowSizes.set(P, W);
        pointPrecomputes.delete(P);
      }
      hasCache(elm) {
        return getW(elm) !== 1;
      }
    };
  }
});

// ../../node_modules/@noble/curves/esm/abstract/edwards.js
function isEdValidXY(Fp2, CURVE, x, y) {
  const x2 = Fp2.sqr(x);
  const y2 = Fp2.sqr(y);
  const left = Fp2.add(Fp2.mul(CURVE.a, x2), y2);
  const right = Fp2.add(Fp2.ONE, Fp2.mul(CURVE.d, Fp2.mul(x2, y2)));
  return Fp2.eql(left, right);
}
function edwards(params, extraOpts = {}) {
  const validated = _createCurveFields("edwards", params, extraOpts, extraOpts.FpFnLE);
  const { Fp: Fp2, Fn: Fn2 } = validated;
  let CURVE = validated.CURVE;
  const { h: cofactor } = CURVE;
  _validateObject(extraOpts, {}, { uvRatio: "function" });
  const MASK = _2n2 << BigInt(Fn2.BYTES * 8) - _1n4;
  const modP = (n) => Fp2.create(n);
  const uvRatio2 = extraOpts.uvRatio || ((u, v) => {
    try {
      return { isValid: true, value: Fp2.sqrt(Fp2.div(u, v)) };
    } catch (e) {
      return { isValid: false, value: _0n4 };
    }
  });
  if (!isEdValidXY(Fp2, CURVE, CURVE.Gx, CURVE.Gy))
    throw new Error("bad curve params: generator point");
  function acoord(title, n, banZero = false) {
    const min = banZero ? _1n4 : _0n4;
    aInRange("coordinate " + title, n, min, MASK);
    return n;
  }
  function aextpoint(other) {
    if (!(other instanceof Point))
      throw new Error("ExtendedPoint expected");
  }
  const toAffineMemo = memoized((p, iz) => {
    const { X, Y, Z } = p;
    const is0 = p.is0();
    if (iz == null)
      iz = is0 ? _8n2 : Fp2.inv(Z);
    const x = modP(X * iz);
    const y = modP(Y * iz);
    const zz = Fp2.mul(Z, iz);
    if (is0)
      return { x: _0n4, y: _1n4 };
    if (zz !== _1n4)
      throw new Error("invZ was invalid");
    return { x, y };
  });
  const assertValidMemo = memoized((p) => {
    const { a, d } = CURVE;
    if (p.is0())
      throw new Error("bad point: ZERO");
    const { X, Y, Z, T } = p;
    const X2 = modP(X * X);
    const Y2 = modP(Y * Y);
    const Z2 = modP(Z * Z);
    const Z4 = modP(Z2 * Z2);
    const aX2 = modP(X2 * a);
    const left = modP(Z2 * modP(aX2 + Y2));
    const right = modP(Z4 + modP(d * modP(X2 * Y2)));
    if (left !== right)
      throw new Error("bad point: equation left != right (1)");
    const XY = modP(X * Y);
    const ZT = modP(Z * T);
    if (XY !== ZT)
      throw new Error("bad point: equation left != right (2)");
    return true;
  });
  class Point {
    constructor(X, Y, Z, T) {
      this.X = acoord("x", X);
      this.Y = acoord("y", Y);
      this.Z = acoord("z", Z, true);
      this.T = acoord("t", T);
      Object.freeze(this);
    }
    static CURVE() {
      return CURVE;
    }
    static fromAffine(p) {
      if (p instanceof Point)
        throw new Error("extended point not allowed");
      const { x, y } = p || {};
      acoord("x", x);
      acoord("y", y);
      return new Point(x, y, _1n4, modP(x * y));
    }
    // Uses algo from RFC8032 5.1.3.
    static fromBytes(bytes, zip215 = false) {
      const len = Fp2.BYTES;
      const { a, d } = CURVE;
      bytes = copyBytes(_abytes2(bytes, len, "point"));
      _abool2(zip215, "zip215");
      const normed = copyBytes(bytes);
      const lastByte = bytes[len - 1];
      normed[len - 1] = lastByte & ~128;
      const y = bytesToNumberLE(normed);
      const max = zip215 ? MASK : Fp2.ORDER;
      aInRange("point.y", y, _0n4, max);
      const y2 = modP(y * y);
      const u = modP(y2 - _1n4);
      const v = modP(d * y2 - a);
      let { isValid, value: x } = uvRatio2(u, v);
      if (!isValid)
        throw new Error("bad point: invalid y coordinate");
      const isXOdd = (x & _1n4) === _1n4;
      const isLastByteOdd = (lastByte & 128) !== 0;
      if (!zip215 && x === _0n4 && isLastByteOdd)
        throw new Error("bad point: x=0 and x_0=1");
      if (isLastByteOdd !== isXOdd)
        x = modP(-x);
      return Point.fromAffine({ x, y });
    }
    static fromHex(bytes, zip215 = false) {
      return Point.fromBytes(ensureBytes("point", bytes), zip215);
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    precompute(windowSize = 8, isLazy = true) {
      wnaf.createCache(this, windowSize);
      if (!isLazy)
        this.multiply(_2n2);
      return this;
    }
    // Useful in fromAffine() - not for fromBytes(), which always created valid points.
    assertValidity() {
      assertValidMemo(this);
    }
    // Compare one point to another.
    equals(other) {
      aextpoint(other);
      const { X: X1, Y: Y1, Z: Z1 } = this;
      const { X: X2, Y: Y2, Z: Z2 } = other;
      const X1Z2 = modP(X1 * Z2);
      const X2Z1 = modP(X2 * Z1);
      const Y1Z2 = modP(Y1 * Z2);
      const Y2Z1 = modP(Y2 * Z1);
      return X1Z2 === X2Z1 && Y1Z2 === Y2Z1;
    }
    is0() {
      return this.equals(Point.ZERO);
    }
    negate() {
      return new Point(modP(-this.X), this.Y, this.Z, modP(-this.T));
    }
    // Fast algo for doubling Extended Point.
    // https://hyperelliptic.org/EFD/g1p/auto-twisted-extended.html#doubling-dbl-2008-hwcd
    // Cost: 4M + 4S + 1*a + 6add + 1*2.
    double() {
      const { a } = CURVE;
      const { X: X1, Y: Y1, Z: Z1 } = this;
      const A = modP(X1 * X1);
      const B = modP(Y1 * Y1);
      const C = modP(_2n2 * modP(Z1 * Z1));
      const D = modP(a * A);
      const x1y1 = X1 + Y1;
      const E = modP(modP(x1y1 * x1y1) - A - B);
      const G = D + B;
      const F = G - C;
      const H = D - B;
      const X3 = modP(E * F);
      const Y3 = modP(G * H);
      const T3 = modP(E * H);
      const Z3 = modP(F * G);
      return new Point(X3, Y3, Z3, T3);
    }
    // Fast algo for adding 2 Extended Points.
    // https://hyperelliptic.org/EFD/g1p/auto-twisted-extended.html#addition-add-2008-hwcd
    // Cost: 9M + 1*a + 1*d + 7add.
    add(other) {
      aextpoint(other);
      const { a, d } = CURVE;
      const { X: X1, Y: Y1, Z: Z1, T: T1 } = this;
      const { X: X2, Y: Y2, Z: Z2, T: T2 } = other;
      const A = modP(X1 * X2);
      const B = modP(Y1 * Y2);
      const C = modP(T1 * d * T2);
      const D = modP(Z1 * Z2);
      const E = modP((X1 + Y1) * (X2 + Y2) - A - B);
      const F = D - C;
      const G = D + C;
      const H = modP(B - a * A);
      const X3 = modP(E * F);
      const Y3 = modP(G * H);
      const T3 = modP(E * H);
      const Z3 = modP(F * G);
      return new Point(X3, Y3, Z3, T3);
    }
    subtract(other) {
      return this.add(other.negate());
    }
    // Constant-time multiplication.
    multiply(scalar) {
      if (!Fn2.isValidNot0(scalar))
        throw new Error("invalid scalar: expected 1 <= sc < curve.n");
      const { p, f } = wnaf.cached(this, scalar, (p2) => normalizeZ(Point, p2));
      return normalizeZ(Point, [p, f])[0];
    }
    // Non-constant-time multiplication. Uses double-and-add algorithm.
    // It's faster, but should only be used when you don't care about
    // an exposed private key e.g. sig verification.
    // Does NOT allow scalars higher than CURVE.n.
    // Accepts optional accumulator to merge with multiply (important for sparse scalars)
    multiplyUnsafe(scalar, acc = Point.ZERO) {
      if (!Fn2.isValid(scalar))
        throw new Error("invalid scalar: expected 0 <= sc < curve.n");
      if (scalar === _0n4)
        return Point.ZERO;
      if (this.is0() || scalar === _1n4)
        return this;
      return wnaf.unsafe(this, scalar, (p) => normalizeZ(Point, p), acc);
    }
    // Checks if point is of small order.
    // If you add something to small order point, you will have "dirty"
    // point with torsion component.
    // Multiplies point by cofactor and checks if the result is 0.
    isSmallOrder() {
      return this.multiplyUnsafe(cofactor).is0();
    }
    // Multiplies point by curve order and checks if the result is 0.
    // Returns `false` is the point is dirty.
    isTorsionFree() {
      return wnaf.unsafe(this, CURVE.n).is0();
    }
    // Converts Extended point to default (x, y) coordinates.
    // Can accept precomputed Z^-1 - for example, from invertBatch.
    toAffine(invertedZ) {
      return toAffineMemo(this, invertedZ);
    }
    clearCofactor() {
      if (cofactor === _1n4)
        return this;
      return this.multiplyUnsafe(cofactor);
    }
    toBytes() {
      const { x, y } = this.toAffine();
      const bytes = Fp2.toBytes(y);
      bytes[bytes.length - 1] |= x & _1n4 ? 128 : 0;
      return bytes;
    }
    toHex() {
      return bytesToHex(this.toBytes());
    }
    toString() {
      return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
    }
    // TODO: remove
    get ex() {
      return this.X;
    }
    get ey() {
      return this.Y;
    }
    get ez() {
      return this.Z;
    }
    get et() {
      return this.T;
    }
    static normalizeZ(points) {
      return normalizeZ(Point, points);
    }
    static msm(points, scalars) {
      return pippenger(Point, Fn2, points, scalars);
    }
    _setWindowSize(windowSize) {
      this.precompute(windowSize);
    }
    toRawBytes() {
      return this.toBytes();
    }
  }
  Point.BASE = new Point(CURVE.Gx, CURVE.Gy, _1n4, modP(CURVE.Gx * CURVE.Gy));
  Point.ZERO = new Point(_0n4, _1n4, _1n4, _0n4);
  Point.Fp = Fp2;
  Point.Fn = Fn2;
  const wnaf = new wNAF(Point, Fn2.BITS);
  Point.BASE.precompute(8);
  return Point;
}
function eddsa(Point, cHash, eddsaOpts = {}) {
  if (typeof cHash !== "function")
    throw new Error('"hash" function param is required');
  _validateObject(eddsaOpts, {}, {
    adjustScalarBytes: "function",
    randomBytes: "function",
    domain: "function",
    prehash: "function",
    mapToCurve: "function"
  });
  const { prehash } = eddsaOpts;
  const { BASE, Fp: Fp2, Fn: Fn2 } = Point;
  const randomBytes6 = eddsaOpts.randomBytes || randomBytes;
  const adjustScalarBytes2 = eddsaOpts.adjustScalarBytes || ((bytes) => bytes);
  const domain = eddsaOpts.domain || ((data, ctx, phflag) => {
    _abool2(phflag, "phflag");
    if (ctx.length || phflag)
      throw new Error("Contexts/pre-hash are not supported");
    return data;
  });
  function modN_LE(hash) {
    return Fn2.create(bytesToNumberLE(hash));
  }
  function getPrivateScalar(key) {
    const len = lengths.secretKey;
    key = ensureBytes("private key", key, len);
    const hashed = ensureBytes("hashed private key", cHash(key), 2 * len);
    const head = adjustScalarBytes2(hashed.slice(0, len));
    const prefix = hashed.slice(len, 2 * len);
    const scalar = modN_LE(head);
    return { head, prefix, scalar };
  }
  function getExtendedPublicKey(secretKey) {
    const { head, prefix, scalar } = getPrivateScalar(secretKey);
    const point = BASE.multiply(scalar);
    const pointBytes = point.toBytes();
    return { head, prefix, scalar, point, pointBytes };
  }
  function getPublicKey(secretKey) {
    return getExtendedPublicKey(secretKey).pointBytes;
  }
  function hashDomainToScalar(context = Uint8Array.of(), ...msgs) {
    const msg = concatBytes(...msgs);
    return modN_LE(cHash(domain(msg, ensureBytes("context", context), !!prehash)));
  }
  function sign(msg, secretKey, options = {}) {
    msg = ensureBytes("message", msg);
    if (prehash)
      msg = prehash(msg);
    const { prefix, scalar, pointBytes } = getExtendedPublicKey(secretKey);
    const r = hashDomainToScalar(options.context, prefix, msg);
    const R = BASE.multiply(r).toBytes();
    const k = hashDomainToScalar(options.context, R, pointBytes, msg);
    const s = Fn2.create(r + k * scalar);
    if (!Fn2.isValid(s))
      throw new Error("sign failed: invalid s");
    const rs = concatBytes(R, Fn2.toBytes(s));
    return _abytes2(rs, lengths.signature, "result");
  }
  const verifyOpts = { zip215: true };
  function verify(sig, msg, publicKey, options = verifyOpts) {
    const { context, zip215 } = options;
    const len = lengths.signature;
    sig = ensureBytes("signature", sig, len);
    msg = ensureBytes("message", msg);
    publicKey = ensureBytes("publicKey", publicKey, lengths.publicKey);
    if (zip215 !== void 0)
      _abool2(zip215, "zip215");
    if (prehash)
      msg = prehash(msg);
    const mid = len / 2;
    const r = sig.subarray(0, mid);
    const s = bytesToNumberLE(sig.subarray(mid, len));
    let A, R, SB;
    try {
      A = Point.fromBytes(publicKey, zip215);
      R = Point.fromBytes(r, zip215);
      SB = BASE.multiplyUnsafe(s);
    } catch (error) {
      return false;
    }
    if (!zip215 && A.isSmallOrder())
      return false;
    const k = hashDomainToScalar(context, R.toBytes(), A.toBytes(), msg);
    const RkA = R.add(A.multiplyUnsafe(k));
    return RkA.subtract(SB).clearCofactor().is0();
  }
  const _size = Fp2.BYTES;
  const lengths = {
    secretKey: _size,
    publicKey: _size,
    signature: 2 * _size,
    seed: _size
  };
  function randomSecretKey(seed = randomBytes6(lengths.seed)) {
    return _abytes2(seed, lengths.seed, "seed");
  }
  function keygen(seed) {
    const secretKey = utils.randomSecretKey(seed);
    return { secretKey, publicKey: getPublicKey(secretKey) };
  }
  function isValidSecretKey(key) {
    return isBytes(key) && key.length === Fn2.BYTES;
  }
  function isValidPublicKey(key, zip215) {
    try {
      return !!Point.fromBytes(key, zip215);
    } catch (error) {
      return false;
    }
  }
  const utils = {
    getExtendedPublicKey,
    randomSecretKey,
    isValidSecretKey,
    isValidPublicKey,
    /**
     * Converts ed public key to x public key. Uses formula:
     * - ed25519:
     *   - `(u, v) = ((1+y)/(1-y), sqrt(-486664)*u/x)`
     *   - `(x, y) = (sqrt(-486664)*u/v, (u-1)/(u+1))`
     * - ed448:
     *   - `(u, v) = ((y-1)/(y+1), sqrt(156324)*u/x)`
     *   - `(x, y) = (sqrt(156324)*u/v, (1+u)/(1-u))`
     */
    toMontgomery(publicKey) {
      const { y } = Point.fromBytes(publicKey);
      const size = lengths.publicKey;
      const is25519 = size === 32;
      if (!is25519 && size !== 57)
        throw new Error("only defined for 25519 and 448");
      const u = is25519 ? Fp2.div(_1n4 + y, _1n4 - y) : Fp2.div(y - _1n4, y + _1n4);
      return Fp2.toBytes(u);
    },
    toMontgomerySecret(secretKey) {
      const size = lengths.secretKey;
      _abytes2(secretKey, size);
      const hashed = cHash(secretKey.subarray(0, size));
      return adjustScalarBytes2(hashed).subarray(0, size);
    },
    /** @deprecated */
    randomPrivateKey: randomSecretKey,
    /** @deprecated */
    precompute(windowSize = 8, point = Point.BASE) {
      return point.precompute(windowSize, false);
    }
  };
  return Object.freeze({
    keygen,
    getPublicKey,
    sign,
    verify,
    utils,
    Point,
    lengths
  });
}
function _eddsa_legacy_opts_to_new(c) {
  const CURVE = {
    a: c.a,
    d: c.d,
    p: c.Fp.ORDER,
    n: c.n,
    h: c.h,
    Gx: c.Gx,
    Gy: c.Gy
  };
  const Fp2 = c.Fp;
  const Fn2 = Field(CURVE.n, c.nBitLength, true);
  const curveOpts = { Fp: Fp2, Fn: Fn2, uvRatio: c.uvRatio };
  const eddsaOpts = {
    randomBytes: c.randomBytes,
    adjustScalarBytes: c.adjustScalarBytes,
    domain: c.domain,
    prehash: c.prehash,
    mapToCurve: c.mapToCurve
  };
  return { CURVE, curveOpts, hash: c.hash, eddsaOpts };
}
function _eddsa_new_output_to_legacy(c, eddsa2) {
  const Point = eddsa2.Point;
  const legacy = Object.assign({}, eddsa2, {
    ExtendedPoint: Point,
    CURVE: c,
    nBitLength: Point.Fn.BITS,
    nByteLength: Point.Fn.BYTES
  });
  return legacy;
}
function twistedEdwards(c) {
  const { CURVE, curveOpts, hash, eddsaOpts } = _eddsa_legacy_opts_to_new(c);
  const Point = edwards(CURVE, curveOpts);
  const EDDSA = eddsa(Point, hash, eddsaOpts);
  return _eddsa_new_output_to_legacy(c, EDDSA);
}
var _0n4, _1n4, _2n2, _8n2, PrimeEdwardsPoint;
var init_edwards = __esm({
  "../../node_modules/@noble/curves/esm/abstract/edwards.js"() {
    "use strict";
    init_utils2();
    init_curve();
    init_modular();
    _0n4 = BigInt(0);
    _1n4 = BigInt(1);
    _2n2 = BigInt(2);
    _8n2 = BigInt(8);
    PrimeEdwardsPoint = class {
      constructor(ep) {
        this.ep = ep;
      }
      // Static methods that must be implemented by subclasses
      static fromBytes(_bytes) {
        notImplemented();
      }
      static fromHex(_hex) {
        notImplemented();
      }
      get x() {
        return this.toAffine().x;
      }
      get y() {
        return this.toAffine().y;
      }
      // Common implementations
      clearCofactor() {
        return this;
      }
      assertValidity() {
        this.ep.assertValidity();
      }
      toAffine(invertedZ) {
        return this.ep.toAffine(invertedZ);
      }
      toHex() {
        return bytesToHex(this.toBytes());
      }
      toString() {
        return this.toHex();
      }
      isTorsionFree() {
        return true;
      }
      isSmallOrder() {
        return false;
      }
      add(other) {
        this.assertSame(other);
        return this.init(this.ep.add(other.ep));
      }
      subtract(other) {
        this.assertSame(other);
        return this.init(this.ep.subtract(other.ep));
      }
      multiply(scalar) {
        return this.init(this.ep.multiply(scalar));
      }
      multiplyUnsafe(scalar) {
        return this.init(this.ep.multiplyUnsafe(scalar));
      }
      double() {
        return this.init(this.ep.double());
      }
      negate() {
        return this.init(this.ep.negate());
      }
      precompute(windowSize, isLazy) {
        return this.init(this.ep.precompute(windowSize, isLazy));
      }
      /** @deprecated use `toBytes` */
      toRawBytes() {
        return this.toBytes();
      }
    };
  }
});

// ../../node_modules/@noble/curves/esm/abstract/montgomery.js
function validateOpts(curve) {
  _validateObject(curve, {
    adjustScalarBytes: "function",
    powPminus2: "function"
  });
  return Object.freeze({ ...curve });
}
function montgomery(curveDef) {
  const CURVE = validateOpts(curveDef);
  const { P, type, adjustScalarBytes: adjustScalarBytes2, powPminus2, randomBytes: rand } = CURVE;
  const is25519 = type === "x25519";
  if (!is25519 && type !== "x448")
    throw new Error("invalid type");
  const randomBytes_ = rand || randomBytes;
  const montgomeryBits = is25519 ? 255 : 448;
  const fieldLen = is25519 ? 32 : 56;
  const Gu = is25519 ? BigInt(9) : BigInt(5);
  const a24 = is25519 ? BigInt(121665) : BigInt(39081);
  const minScalar = is25519 ? _2n3 ** BigInt(254) : _2n3 ** BigInt(447);
  const maxAdded = is25519 ? BigInt(8) * _2n3 ** BigInt(251) - _1n5 : BigInt(4) * _2n3 ** BigInt(445) - _1n5;
  const maxScalar = minScalar + maxAdded + _1n5;
  const modP = (n) => mod(n, P);
  const GuBytes = encodeU(Gu);
  function encodeU(u) {
    return numberToBytesLE(modP(u), fieldLen);
  }
  function decodeU(u) {
    const _u = ensureBytes("u coordinate", u, fieldLen);
    if (is25519)
      _u[31] &= 127;
    return modP(bytesToNumberLE(_u));
  }
  function decodeScalar(scalar) {
    return bytesToNumberLE(adjustScalarBytes2(ensureBytes("scalar", scalar, fieldLen)));
  }
  function scalarMult(scalar, u) {
    const pu = montgomeryLadder(decodeU(u), decodeScalar(scalar));
    if (pu === _0n5)
      throw new Error("invalid private or public key received");
    return encodeU(pu);
  }
  function scalarMultBase(scalar) {
    return scalarMult(scalar, GuBytes);
  }
  function cswap(swap, x_2, x_3) {
    const dummy = modP(swap * (x_2 - x_3));
    x_2 = modP(x_2 - dummy);
    x_3 = modP(x_3 + dummy);
    return { x_2, x_3 };
  }
  function montgomeryLadder(u, scalar) {
    aInRange("u", u, _0n5, P);
    aInRange("scalar", scalar, minScalar, maxScalar);
    const k = scalar;
    const x_1 = u;
    let x_2 = _1n5;
    let z_2 = _0n5;
    let x_3 = u;
    let z_3 = _1n5;
    let swap = _0n5;
    for (let t = BigInt(montgomeryBits - 1); t >= _0n5; t--) {
      const k_t = k >> t & _1n5;
      swap ^= k_t;
      ({ x_2, x_3 } = cswap(swap, x_2, x_3));
      ({ x_2: z_2, x_3: z_3 } = cswap(swap, z_2, z_3));
      swap = k_t;
      const A = x_2 + z_2;
      const AA = modP(A * A);
      const B = x_2 - z_2;
      const BB = modP(B * B);
      const E = AA - BB;
      const C = x_3 + z_3;
      const D = x_3 - z_3;
      const DA = modP(D * A);
      const CB = modP(C * B);
      const dacb = DA + CB;
      const da_cb = DA - CB;
      x_3 = modP(dacb * dacb);
      z_3 = modP(x_1 * modP(da_cb * da_cb));
      x_2 = modP(AA * BB);
      z_2 = modP(E * (AA + modP(a24 * E)));
    }
    ({ x_2, x_3 } = cswap(swap, x_2, x_3));
    ({ x_2: z_2, x_3: z_3 } = cswap(swap, z_2, z_3));
    const z2 = powPminus2(z_2);
    return modP(x_2 * z2);
  }
  const lengths = {
    secretKey: fieldLen,
    publicKey: fieldLen,
    seed: fieldLen
  };
  const randomSecretKey = (seed = randomBytes_(fieldLen)) => {
    abytes(seed, lengths.seed);
    return seed;
  };
  function keygen(seed) {
    const secretKey = randomSecretKey(seed);
    return { secretKey, publicKey: scalarMultBase(secretKey) };
  }
  const utils = {
    randomSecretKey,
    randomPrivateKey: randomSecretKey
  };
  return {
    keygen,
    getSharedSecret: (secretKey, publicKey) => scalarMult(secretKey, publicKey),
    getPublicKey: (secretKey) => scalarMultBase(secretKey),
    scalarMult,
    scalarMultBase,
    utils,
    GuBytes: GuBytes.slice(),
    lengths
  };
}
var _0n5, _1n5, _2n3;
var init_montgomery = __esm({
  "../../node_modules/@noble/curves/esm/abstract/montgomery.js"() {
    "use strict";
    init_utils2();
    init_modular();
    _0n5 = BigInt(0);
    _1n5 = BigInt(1);
    _2n3 = BigInt(2);
  }
});

// ../../node_modules/@noble/curves/esm/ed25519.js
function ed25519_pow_2_252_3(x) {
  const _10n = BigInt(10), _20n = BigInt(20), _40n = BigInt(40), _80n = BigInt(80);
  const P = ed25519_CURVE_p;
  const x2 = x * x % P;
  const b2 = x2 * x % P;
  const b4 = pow2(b2, _2n4, P) * b2 % P;
  const b5 = pow2(b4, _1n6, P) * x % P;
  const b10 = pow2(b5, _5n2, P) * b5 % P;
  const b20 = pow2(b10, _10n, P) * b10 % P;
  const b40 = pow2(b20, _20n, P) * b20 % P;
  const b80 = pow2(b40, _40n, P) * b40 % P;
  const b160 = pow2(b80, _80n, P) * b80 % P;
  const b240 = pow2(b160, _80n, P) * b80 % P;
  const b250 = pow2(b240, _10n, P) * b10 % P;
  const pow_p_5_8 = pow2(b250, _2n4, P) * x % P;
  return { pow_p_5_8, b2 };
}
function adjustScalarBytes(bytes) {
  bytes[0] &= 248;
  bytes[31] &= 127;
  bytes[31] |= 64;
  return bytes;
}
function uvRatio(u, v) {
  const P = ed25519_CURVE_p;
  const v3 = mod(v * v * v, P);
  const v7 = mod(v3 * v3 * v, P);
  const pow = ed25519_pow_2_252_3(u * v7).pow_p_5_8;
  let x = mod(u * v3 * pow, P);
  const vx2 = mod(v * x * x, P);
  const root1 = x;
  const root2 = mod(x * ED25519_SQRT_M1, P);
  const useRoot1 = vx2 === u;
  const useRoot2 = vx2 === mod(-u, P);
  const noRoot = vx2 === mod(-u * ED25519_SQRT_M1, P);
  if (useRoot1)
    x = root1;
  if (useRoot2 || noRoot)
    x = root2;
  if (isNegativeLE(x, P))
    x = mod(-x, P);
  return { isValid: useRoot1 || useRoot2, value: x };
}
function calcElligatorRistrettoMap(r0) {
  const { d } = ed25519_CURVE;
  const P = ed25519_CURVE_p;
  const mod2 = (n) => Fp.create(n);
  const r = mod2(SQRT_M1 * r0 * r0);
  const Ns = mod2((r + _1n6) * ONE_MINUS_D_SQ);
  let c = BigInt(-1);
  const D = mod2((c - d * r) * mod2(r + d));
  let { isValid: Ns_D_is_sq, value: s } = uvRatio(Ns, D);
  let s_ = mod2(s * r0);
  if (!isNegativeLE(s_, P))
    s_ = mod2(-s_);
  if (!Ns_D_is_sq)
    s = s_;
  if (!Ns_D_is_sq)
    c = r;
  const Nt = mod2(c * (r - _1n6) * D_MINUS_ONE_SQ - D);
  const s2 = s * s;
  const W0 = mod2((s + s) * D);
  const W1 = mod2(Nt * SQRT_AD_MINUS_ONE);
  const W2 = mod2(_1n6 - s2);
  const W3 = mod2(_1n6 + s2);
  return new ed25519.Point(mod2(W0 * W3), mod2(W2 * W1), mod2(W1 * W3), mod2(W0 * W2));
}
function ristretto255_map(bytes) {
  abytes(bytes, 64);
  const r1 = bytes255ToNumberLE(bytes.subarray(0, 32));
  const R1 = calcElligatorRistrettoMap(r1);
  const r2 = bytes255ToNumberLE(bytes.subarray(32, 64));
  const R2 = calcElligatorRistrettoMap(r2);
  return new _RistrettoPoint(R1.add(R2));
}
var _0n6, _1n6, _2n4, _3n2, _5n2, _8n3, ed25519_CURVE_p, ed25519_CURVE, ED25519_SQRT_M1, Fp, Fn, ed25519Defaults, ed25519, x25519, SQRT_M1, SQRT_AD_MINUS_ONE, INVSQRT_A_MINUS_D, ONE_MINUS_D_SQ, D_MINUS_ONE_SQ, invertSqrt, MAX_255B, bytes255ToNumberLE, _RistrettoPoint;
var init_ed25519 = __esm({
  "../../node_modules/@noble/curves/esm/ed25519.js"() {
    "use strict";
    init_sha2();
    init_utils();
    init_curve();
    init_edwards();
    init_modular();
    init_montgomery();
    init_utils2();
    _0n6 = /* @__PURE__ */ BigInt(0);
    _1n6 = BigInt(1);
    _2n4 = BigInt(2);
    _3n2 = BigInt(3);
    _5n2 = BigInt(5);
    _8n3 = BigInt(8);
    ed25519_CURVE_p = BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffed");
    ed25519_CURVE = /* @__PURE__ */ (() => ({
      p: ed25519_CURVE_p,
      n: BigInt("0x1000000000000000000000000000000014def9dea2f79cd65812631a5cf5d3ed"),
      h: _8n3,
      a: BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffec"),
      d: BigInt("0x52036cee2b6ffe738cc740797779e89800700a4d4141d8ab75eb4dca135978a3"),
      Gx: BigInt("0x216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a"),
      Gy: BigInt("0x6666666666666666666666666666666666666666666666666666666666666658")
    }))();
    ED25519_SQRT_M1 = /* @__PURE__ */ BigInt("19681161376707505956807079304988542015446066515923890162744021073123829784752");
    Fp = /* @__PURE__ */ (() => Field(ed25519_CURVE.p, { isLE: true }))();
    Fn = /* @__PURE__ */ (() => Field(ed25519_CURVE.n, { isLE: true }))();
    ed25519Defaults = /* @__PURE__ */ (() => ({
      ...ed25519_CURVE,
      Fp,
      hash: sha512,
      adjustScalarBytes,
      // dom2
      // Ratio of u to v. Allows us to combine inversion and square root. Uses algo from RFC8032 5.1.3.
      // Constant-time, u/√v
      uvRatio
    }))();
    ed25519 = /* @__PURE__ */ (() => twistedEdwards(ed25519Defaults))();
    x25519 = /* @__PURE__ */ (() => {
      const P = Fp.ORDER;
      return montgomery({
        P,
        type: "x25519",
        powPminus2: (x) => {
          const { pow_p_5_8, b2 } = ed25519_pow_2_252_3(x);
          return mod(pow2(pow_p_5_8, _3n2, P) * b2, P);
        },
        adjustScalarBytes
      });
    })();
    SQRT_M1 = ED25519_SQRT_M1;
    SQRT_AD_MINUS_ONE = /* @__PURE__ */ BigInt("25063068953384623474111414158702152701244531502492656460079210482610430750235");
    INVSQRT_A_MINUS_D = /* @__PURE__ */ BigInt("54469307008909316920995813868745141605393597292927456921205312896311721017578");
    ONE_MINUS_D_SQ = /* @__PURE__ */ BigInt("1159843021668779879193775521855586647937357759715417654439879720876111806838");
    D_MINUS_ONE_SQ = /* @__PURE__ */ BigInt("40440834346308536858101042469323190826248399146238708352240133220865137265952");
    invertSqrt = (number) => uvRatio(_1n6, number);
    MAX_255B = /* @__PURE__ */ BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
    bytes255ToNumberLE = (bytes) => ed25519.Point.Fp.create(bytesToNumberLE(bytes) & MAX_255B);
    _RistrettoPoint = class __RistrettoPoint extends PrimeEdwardsPoint {
      constructor(ep) {
        super(ep);
      }
      static fromAffine(ap) {
        return new __RistrettoPoint(ed25519.Point.fromAffine(ap));
      }
      assertSame(other) {
        if (!(other instanceof __RistrettoPoint))
          throw new Error("RistrettoPoint expected");
      }
      init(ep) {
        return new __RistrettoPoint(ep);
      }
      /** @deprecated use `import { ristretto255_hasher } from '@noble/curves/ed25519.js';` */
      static hashToCurve(hex) {
        return ristretto255_map(ensureBytes("ristrettoHash", hex, 64));
      }
      static fromBytes(bytes) {
        abytes(bytes, 32);
        const { a, d } = ed25519_CURVE;
        const P = ed25519_CURVE_p;
        const mod2 = (n) => Fp.create(n);
        const s = bytes255ToNumberLE(bytes);
        if (!equalBytes(Fp.toBytes(s), bytes) || isNegativeLE(s, P))
          throw new Error("invalid ristretto255 encoding 1");
        const s2 = mod2(s * s);
        const u1 = mod2(_1n6 + a * s2);
        const u2 = mod2(_1n6 - a * s2);
        const u1_2 = mod2(u1 * u1);
        const u2_2 = mod2(u2 * u2);
        const v = mod2(a * d * u1_2 - u2_2);
        const { isValid, value: I } = invertSqrt(mod2(v * u2_2));
        const Dx = mod2(I * u2);
        const Dy = mod2(I * Dx * v);
        let x = mod2((s + s) * Dx);
        if (isNegativeLE(x, P))
          x = mod2(-x);
        const y = mod2(u1 * Dy);
        const t = mod2(x * y);
        if (!isValid || isNegativeLE(t, P) || y === _0n6)
          throw new Error("invalid ristretto255 encoding 2");
        return new __RistrettoPoint(new ed25519.Point(x, y, _1n6, t));
      }
      /**
       * Converts ristretto-encoded string to ristretto point.
       * Described in [RFC9496](https://www.rfc-editor.org/rfc/rfc9496#name-decode).
       * @param hex Ristretto-encoded 32 bytes. Not every 32-byte string is valid ristretto encoding
       */
      static fromHex(hex) {
        return __RistrettoPoint.fromBytes(ensureBytes("ristrettoHex", hex, 32));
      }
      static msm(points, scalars) {
        return pippenger(__RistrettoPoint, ed25519.Point.Fn, points, scalars);
      }
      /**
       * Encodes ristretto point to Uint8Array.
       * Described in [RFC9496](https://www.rfc-editor.org/rfc/rfc9496#name-encode).
       */
      toBytes() {
        let { X, Y, Z, T } = this.ep;
        const P = ed25519_CURVE_p;
        const mod2 = (n) => Fp.create(n);
        const u1 = mod2(mod2(Z + Y) * mod2(Z - Y));
        const u2 = mod2(X * Y);
        const u2sq = mod2(u2 * u2);
        const { value: invsqrt } = invertSqrt(mod2(u1 * u2sq));
        const D1 = mod2(invsqrt * u1);
        const D2 = mod2(invsqrt * u2);
        const zInv = mod2(D1 * D2 * T);
        let D;
        if (isNegativeLE(T * zInv, P)) {
          let _x = mod2(Y * SQRT_M1);
          let _y = mod2(X * SQRT_M1);
          X = _x;
          Y = _y;
          D = mod2(D1 * INVSQRT_A_MINUS_D);
        } else {
          D = D2;
        }
        if (isNegativeLE(X * zInv, P))
          Y = mod2(-Y);
        let s = mod2((Z - Y) * D);
        if (isNegativeLE(s, P))
          s = mod2(-s);
        return Fp.toBytes(s);
      }
      /**
       * Compares two Ristretto points.
       * Described in [RFC9496](https://www.rfc-editor.org/rfc/rfc9496#name-equals).
       */
      equals(other) {
        this.assertSame(other);
        const { X: X1, Y: Y1 } = this.ep;
        const { X: X2, Y: Y2 } = other.ep;
        const mod2 = (n) => Fp.create(n);
        const one = mod2(X1 * Y2) === mod2(Y1 * X2);
        const two = mod2(Y1 * Y2) === mod2(X1 * X2);
        return one || two;
      }
      is0() {
        return this.equals(__RistrettoPoint.ZERO);
      }
    };
    _RistrettoPoint.BASE = /* @__PURE__ */ (() => new _RistrettoPoint(ed25519.Point.BASE))();
    _RistrettoPoint.ZERO = /* @__PURE__ */ (() => new _RistrettoPoint(ed25519.Point.ZERO))();
    _RistrettoPoint.Fp = /* @__PURE__ */ (() => Fp)();
    _RistrettoPoint.Fn = /* @__PURE__ */ (() => Fn)();
  }
});

// ../../node_modules/@noble/ciphers/esm/utils.js
function isBytes2(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
}
function abool(b) {
  if (typeof b !== "boolean")
    throw new Error(`boolean expected, not ${b}`);
}
function anumber2(n) {
  if (!Number.isSafeInteger(n) || n < 0)
    throw new Error("positive integer expected, got " + n);
}
function abytes2(b, ...lengths) {
  if (!isBytes2(b))
    throw new Error("Uint8Array expected");
  if (lengths.length > 0 && !lengths.includes(b.length))
    throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b.length);
}
function aexists2(instance, checkFinished = true) {
  if (instance.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (checkFinished && instance.finished)
    throw new Error("Hash#digest() has already been called");
}
function aoutput2(out, instance) {
  abytes2(out);
  const min = instance.outputLen;
  if (out.length < min) {
    throw new Error("digestInto() expects output buffer of length at least " + min);
  }
}
function u32(arr) {
  return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
}
function clean2(...arrays) {
  for (let i = 0; i < arrays.length; i++) {
    arrays[i].fill(0);
  }
}
function createView2(arr) {
  return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
function utf8ToBytes2(str) {
  if (typeof str !== "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(str));
}
function toBytes2(data) {
  if (typeof data === "string")
    data = utf8ToBytes2(data);
  else if (isBytes2(data))
    data = copyBytes2(data);
  else
    throw new Error("Uint8Array expected, got " + typeof data);
  return data;
}
function checkOpts(defaults, opts) {
  if (opts == null || typeof opts !== "object")
    throw new Error("options must be defined");
  const merged = Object.assign(defaults, opts);
  return merged;
}
function equalBytes2(a, b) {
  if (a.length !== b.length)
    return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++)
    diff |= a[i] ^ b[i];
  return diff === 0;
}
function getOutput(expectedLength, out, onlyAligned = true) {
  if (out === void 0)
    return new Uint8Array(expectedLength);
  if (out.length !== expectedLength)
    throw new Error("invalid output length, expected " + expectedLength + ", got: " + out.length);
  if (onlyAligned && !isAligned32(out))
    throw new Error("invalid output, must be aligned");
  return out;
}
function setBigUint642(view, byteOffset, value, isLE2) {
  if (typeof view.setBigUint64 === "function")
    return view.setBigUint64(byteOffset, value, isLE2);
  const _32n2 = BigInt(32);
  const _u32_max = BigInt(4294967295);
  const wh = Number(value >> _32n2 & _u32_max);
  const wl = Number(value & _u32_max);
  const h = isLE2 ? 4 : 0;
  const l = isLE2 ? 0 : 4;
  view.setUint32(byteOffset + h, wh, isLE2);
  view.setUint32(byteOffset + l, wl, isLE2);
}
function u64Lengths(dataLength, aadLength, isLE2) {
  abool(isLE2);
  const num = new Uint8Array(16);
  const view = createView2(num);
  setBigUint642(view, 0, BigInt(aadLength), isLE2);
  setBigUint642(view, 8, BigInt(dataLength), isLE2);
  return num;
}
function isAligned32(bytes) {
  return bytes.byteOffset % 4 === 0;
}
function copyBytes2(bytes) {
  return Uint8Array.from(bytes);
}
var isLE, wrapCipher;
var init_utils3 = __esm({
  "../../node_modules/@noble/ciphers/esm/utils.js"() {
    "use strict";
    isLE = /* @__PURE__ */ (() => new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68)();
    wrapCipher = /* @__NO_SIDE_EFFECTS__ */ (params, constructor) => {
      function wrappedCipher(key, ...args) {
        abytes2(key);
        if (!isLE)
          throw new Error("Non little-endian hardware is not yet supported");
        if (params.nonceLength !== void 0) {
          const nonce = args[0];
          if (!nonce)
            throw new Error("nonce / iv required");
          if (params.varSizeNonce)
            abytes2(nonce);
          else
            abytes2(nonce, params.nonceLength);
        }
        const tagl = params.tagLength;
        if (tagl && args[1] !== void 0) {
          abytes2(args[1]);
        }
        const cipher = constructor(key, ...args);
        const checkOutput = (fnLength, output) => {
          if (output !== void 0) {
            if (fnLength !== 2)
              throw new Error("cipher output not supported");
            abytes2(output);
          }
        };
        let called = false;
        const wrCipher = {
          encrypt(data, output) {
            if (called)
              throw new Error("cannot encrypt() twice with same key + nonce");
            called = true;
            abytes2(data);
            checkOutput(cipher.encrypt.length, output);
            return cipher.encrypt(data, output);
          },
          decrypt(data, output) {
            abytes2(data);
            if (tagl && data.length < tagl)
              throw new Error("invalid ciphertext length: smaller than tagLength=" + tagl);
            checkOutput(cipher.decrypt.length, output);
            return cipher.decrypt(data, output);
          }
        };
        return wrCipher;
      }
      Object.assign(wrappedCipher, params);
      return wrappedCipher;
    };
  }
});

// ../../node_modules/@noble/ciphers/esm/_arx.js
function rotl(a, b) {
  return a << b | a >>> 32 - b;
}
function isAligned322(b) {
  return b.byteOffset % 4 === 0;
}
function runCipher(core, sigma, key, nonce, data, output, counter, rounds) {
  const len = data.length;
  const block = new Uint8Array(BLOCK_LEN);
  const b32 = u32(block);
  const isAligned = isAligned322(data) && isAligned322(output);
  const d32 = isAligned ? u32(data) : U32_EMPTY;
  const o32 = isAligned ? u32(output) : U32_EMPTY;
  for (let pos = 0; pos < len; counter++) {
    core(sigma, key, nonce, b32, counter, rounds);
    if (counter >= MAX_COUNTER)
      throw new Error("arx: counter overflow");
    const take = Math.min(BLOCK_LEN, len - pos);
    if (isAligned && take === BLOCK_LEN) {
      const pos32 = pos / 4;
      if (pos % 4 !== 0)
        throw new Error("arx: invalid block position");
      for (let j = 0, posj; j < BLOCK_LEN32; j++) {
        posj = pos32 + j;
        o32[posj] = d32[posj] ^ b32[j];
      }
      pos += BLOCK_LEN;
      continue;
    }
    for (let j = 0, posj; j < take; j++) {
      posj = pos + j;
      output[posj] = data[posj] ^ block[j];
    }
    pos += take;
  }
}
function createCipher(core, opts) {
  const { allowShortKeys, extendNonceFn, counterLength, counterRight, rounds } = checkOpts({ allowShortKeys: false, counterLength: 8, counterRight: false, rounds: 20 }, opts);
  if (typeof core !== "function")
    throw new Error("core must be a function");
  anumber2(counterLength);
  anumber2(rounds);
  abool(counterRight);
  abool(allowShortKeys);
  return (key, nonce, data, output, counter = 0) => {
    abytes2(key);
    abytes2(nonce);
    abytes2(data);
    const len = data.length;
    if (output === void 0)
      output = new Uint8Array(len);
    abytes2(output);
    anumber2(counter);
    if (counter < 0 || counter >= MAX_COUNTER)
      throw new Error("arx: counter overflow");
    if (output.length < len)
      throw new Error(`arx: output (${output.length}) is shorter than data (${len})`);
    const toClean = [];
    let l = key.length;
    let k;
    let sigma;
    if (l === 32) {
      toClean.push(k = copyBytes2(key));
      sigma = sigma32_32;
    } else if (l === 16 && allowShortKeys) {
      k = new Uint8Array(32);
      k.set(key);
      k.set(key, 16);
      sigma = sigma16_32;
      toClean.push(k);
    } else {
      throw new Error(`arx: invalid 32-byte key, got length=${l}`);
    }
    if (!isAligned322(nonce))
      toClean.push(nonce = copyBytes2(nonce));
    const k32 = u32(k);
    if (extendNonceFn) {
      if (nonce.length !== 24)
        throw new Error(`arx: extended nonce must be 24 bytes`);
      extendNonceFn(sigma, k32, u32(nonce.subarray(0, 16)), k32);
      nonce = nonce.subarray(16);
    }
    const nonceNcLen = 16 - counterLength;
    if (nonceNcLen !== nonce.length)
      throw new Error(`arx: nonce must be ${nonceNcLen} or 16 bytes`);
    if (nonceNcLen !== 12) {
      const nc2 = new Uint8Array(12);
      nc2.set(nonce, counterRight ? 0 : 12 - nonce.length);
      nonce = nc2;
      toClean.push(nonce);
    }
    const n32 = u32(nonce);
    runCipher(core, sigma, k32, n32, data, output, counter, rounds);
    clean2(...toClean);
    return output;
  };
}
var _utf8ToBytes, sigma16, sigma32, sigma16_32, sigma32_32, BLOCK_LEN, BLOCK_LEN32, MAX_COUNTER, U32_EMPTY;
var init_arx = __esm({
  "../../node_modules/@noble/ciphers/esm/_arx.js"() {
    "use strict";
    init_utils3();
    _utf8ToBytes = (str) => Uint8Array.from(str.split("").map((c) => c.charCodeAt(0)));
    sigma16 = _utf8ToBytes("expand 16-byte k");
    sigma32 = _utf8ToBytes("expand 32-byte k");
    sigma16_32 = u32(sigma16);
    sigma32_32 = u32(sigma32);
    BLOCK_LEN = 64;
    BLOCK_LEN32 = 16;
    MAX_COUNTER = 2 ** 32 - 1;
    U32_EMPTY = new Uint32Array();
  }
});

// ../../node_modules/@noble/ciphers/esm/_poly1305.js
function wrapConstructorWithKey(hashCons) {
  const hashC = (msg, key) => hashCons(key).update(toBytes2(msg)).digest();
  const tmp = hashCons(new Uint8Array(32));
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = (key) => hashCons(key);
  return hashC;
}
var u8to16, Poly1305, poly1305;
var init_poly1305 = __esm({
  "../../node_modules/@noble/ciphers/esm/_poly1305.js"() {
    "use strict";
    init_utils3();
    u8to16 = (a, i) => a[i++] & 255 | (a[i++] & 255) << 8;
    Poly1305 = class {
      constructor(key) {
        this.blockLen = 16;
        this.outputLen = 16;
        this.buffer = new Uint8Array(16);
        this.r = new Uint16Array(10);
        this.h = new Uint16Array(10);
        this.pad = new Uint16Array(8);
        this.pos = 0;
        this.finished = false;
        key = toBytes2(key);
        abytes2(key, 32);
        const t0 = u8to16(key, 0);
        const t1 = u8to16(key, 2);
        const t2 = u8to16(key, 4);
        const t3 = u8to16(key, 6);
        const t4 = u8to16(key, 8);
        const t5 = u8to16(key, 10);
        const t6 = u8to16(key, 12);
        const t7 = u8to16(key, 14);
        this.r[0] = t0 & 8191;
        this.r[1] = (t0 >>> 13 | t1 << 3) & 8191;
        this.r[2] = (t1 >>> 10 | t2 << 6) & 7939;
        this.r[3] = (t2 >>> 7 | t3 << 9) & 8191;
        this.r[4] = (t3 >>> 4 | t4 << 12) & 255;
        this.r[5] = t4 >>> 1 & 8190;
        this.r[6] = (t4 >>> 14 | t5 << 2) & 8191;
        this.r[7] = (t5 >>> 11 | t6 << 5) & 8065;
        this.r[8] = (t6 >>> 8 | t7 << 8) & 8191;
        this.r[9] = t7 >>> 5 & 127;
        for (let i = 0; i < 8; i++)
          this.pad[i] = u8to16(key, 16 + 2 * i);
      }
      process(data, offset, isLast = false) {
        const hibit = isLast ? 0 : 1 << 11;
        const { h, r } = this;
        const r0 = r[0];
        const r1 = r[1];
        const r2 = r[2];
        const r3 = r[3];
        const r4 = r[4];
        const r5 = r[5];
        const r6 = r[6];
        const r7 = r[7];
        const r8 = r[8];
        const r9 = r[9];
        const t0 = u8to16(data, offset + 0);
        const t1 = u8to16(data, offset + 2);
        const t2 = u8to16(data, offset + 4);
        const t3 = u8to16(data, offset + 6);
        const t4 = u8to16(data, offset + 8);
        const t5 = u8to16(data, offset + 10);
        const t6 = u8to16(data, offset + 12);
        const t7 = u8to16(data, offset + 14);
        let h0 = h[0] + (t0 & 8191);
        let h1 = h[1] + ((t0 >>> 13 | t1 << 3) & 8191);
        let h2 = h[2] + ((t1 >>> 10 | t2 << 6) & 8191);
        let h3 = h[3] + ((t2 >>> 7 | t3 << 9) & 8191);
        let h4 = h[4] + ((t3 >>> 4 | t4 << 12) & 8191);
        let h5 = h[5] + (t4 >>> 1 & 8191);
        let h6 = h[6] + ((t4 >>> 14 | t5 << 2) & 8191);
        let h7 = h[7] + ((t5 >>> 11 | t6 << 5) & 8191);
        let h8 = h[8] + ((t6 >>> 8 | t7 << 8) & 8191);
        let h9 = h[9] + (t7 >>> 5 | hibit);
        let c = 0;
        let d0 = c + h0 * r0 + h1 * (5 * r9) + h2 * (5 * r8) + h3 * (5 * r7) + h4 * (5 * r6);
        c = d0 >>> 13;
        d0 &= 8191;
        d0 += h5 * (5 * r5) + h6 * (5 * r4) + h7 * (5 * r3) + h8 * (5 * r2) + h9 * (5 * r1);
        c += d0 >>> 13;
        d0 &= 8191;
        let d1 = c + h0 * r1 + h1 * r0 + h2 * (5 * r9) + h3 * (5 * r8) + h4 * (5 * r7);
        c = d1 >>> 13;
        d1 &= 8191;
        d1 += h5 * (5 * r6) + h6 * (5 * r5) + h7 * (5 * r4) + h8 * (5 * r3) + h9 * (5 * r2);
        c += d1 >>> 13;
        d1 &= 8191;
        let d2 = c + h0 * r2 + h1 * r1 + h2 * r0 + h3 * (5 * r9) + h4 * (5 * r8);
        c = d2 >>> 13;
        d2 &= 8191;
        d2 += h5 * (5 * r7) + h6 * (5 * r6) + h7 * (5 * r5) + h8 * (5 * r4) + h9 * (5 * r3);
        c += d2 >>> 13;
        d2 &= 8191;
        let d3 = c + h0 * r3 + h1 * r2 + h2 * r1 + h3 * r0 + h4 * (5 * r9);
        c = d3 >>> 13;
        d3 &= 8191;
        d3 += h5 * (5 * r8) + h6 * (5 * r7) + h7 * (5 * r6) + h8 * (5 * r5) + h9 * (5 * r4);
        c += d3 >>> 13;
        d3 &= 8191;
        let d4 = c + h0 * r4 + h1 * r3 + h2 * r2 + h3 * r1 + h4 * r0;
        c = d4 >>> 13;
        d4 &= 8191;
        d4 += h5 * (5 * r9) + h6 * (5 * r8) + h7 * (5 * r7) + h8 * (5 * r6) + h9 * (5 * r5);
        c += d4 >>> 13;
        d4 &= 8191;
        let d5 = c + h0 * r5 + h1 * r4 + h2 * r3 + h3 * r2 + h4 * r1;
        c = d5 >>> 13;
        d5 &= 8191;
        d5 += h5 * r0 + h6 * (5 * r9) + h7 * (5 * r8) + h8 * (5 * r7) + h9 * (5 * r6);
        c += d5 >>> 13;
        d5 &= 8191;
        let d6 = c + h0 * r6 + h1 * r5 + h2 * r4 + h3 * r3 + h4 * r2;
        c = d6 >>> 13;
        d6 &= 8191;
        d6 += h5 * r1 + h6 * r0 + h7 * (5 * r9) + h8 * (5 * r8) + h9 * (5 * r7);
        c += d6 >>> 13;
        d6 &= 8191;
        let d7 = c + h0 * r7 + h1 * r6 + h2 * r5 + h3 * r4 + h4 * r3;
        c = d7 >>> 13;
        d7 &= 8191;
        d7 += h5 * r2 + h6 * r1 + h7 * r0 + h8 * (5 * r9) + h9 * (5 * r8);
        c += d7 >>> 13;
        d7 &= 8191;
        let d8 = c + h0 * r8 + h1 * r7 + h2 * r6 + h3 * r5 + h4 * r4;
        c = d8 >>> 13;
        d8 &= 8191;
        d8 += h5 * r3 + h6 * r2 + h7 * r1 + h8 * r0 + h9 * (5 * r9);
        c += d8 >>> 13;
        d8 &= 8191;
        let d9 = c + h0 * r9 + h1 * r8 + h2 * r7 + h3 * r6 + h4 * r5;
        c = d9 >>> 13;
        d9 &= 8191;
        d9 += h5 * r4 + h6 * r3 + h7 * r2 + h8 * r1 + h9 * r0;
        c += d9 >>> 13;
        d9 &= 8191;
        c = (c << 2) + c | 0;
        c = c + d0 | 0;
        d0 = c & 8191;
        c = c >>> 13;
        d1 += c;
        h[0] = d0;
        h[1] = d1;
        h[2] = d2;
        h[3] = d3;
        h[4] = d4;
        h[5] = d5;
        h[6] = d6;
        h[7] = d7;
        h[8] = d8;
        h[9] = d9;
      }
      finalize() {
        const { h, pad } = this;
        const g = new Uint16Array(10);
        let c = h[1] >>> 13;
        h[1] &= 8191;
        for (let i = 2; i < 10; i++) {
          h[i] += c;
          c = h[i] >>> 13;
          h[i] &= 8191;
        }
        h[0] += c * 5;
        c = h[0] >>> 13;
        h[0] &= 8191;
        h[1] += c;
        c = h[1] >>> 13;
        h[1] &= 8191;
        h[2] += c;
        g[0] = h[0] + 5;
        c = g[0] >>> 13;
        g[0] &= 8191;
        for (let i = 1; i < 10; i++) {
          g[i] = h[i] + c;
          c = g[i] >>> 13;
          g[i] &= 8191;
        }
        g[9] -= 1 << 13;
        let mask = (c ^ 1) - 1;
        for (let i = 0; i < 10; i++)
          g[i] &= mask;
        mask = ~mask;
        for (let i = 0; i < 10; i++)
          h[i] = h[i] & mask | g[i];
        h[0] = (h[0] | h[1] << 13) & 65535;
        h[1] = (h[1] >>> 3 | h[2] << 10) & 65535;
        h[2] = (h[2] >>> 6 | h[3] << 7) & 65535;
        h[3] = (h[3] >>> 9 | h[4] << 4) & 65535;
        h[4] = (h[4] >>> 12 | h[5] << 1 | h[6] << 14) & 65535;
        h[5] = (h[6] >>> 2 | h[7] << 11) & 65535;
        h[6] = (h[7] >>> 5 | h[8] << 8) & 65535;
        h[7] = (h[8] >>> 8 | h[9] << 5) & 65535;
        let f = h[0] + pad[0];
        h[0] = f & 65535;
        for (let i = 1; i < 8; i++) {
          f = (h[i] + pad[i] | 0) + (f >>> 16) | 0;
          h[i] = f & 65535;
        }
        clean2(g);
      }
      update(data) {
        aexists2(this);
        data = toBytes2(data);
        abytes2(data);
        const { buffer, blockLen } = this;
        const len = data.length;
        for (let pos = 0; pos < len; ) {
          const take = Math.min(blockLen - this.pos, len - pos);
          if (take === blockLen) {
            for (; blockLen <= len - pos; pos += blockLen)
              this.process(data, pos);
            continue;
          }
          buffer.set(data.subarray(pos, pos + take), this.pos);
          this.pos += take;
          pos += take;
          if (this.pos === blockLen) {
            this.process(buffer, 0, false);
            this.pos = 0;
          }
        }
        return this;
      }
      destroy() {
        clean2(this.h, this.r, this.buffer, this.pad);
      }
      digestInto(out) {
        aexists2(this);
        aoutput2(out, this);
        this.finished = true;
        const { buffer, h } = this;
        let { pos } = this;
        if (pos) {
          buffer[pos++] = 1;
          for (; pos < 16; pos++)
            buffer[pos] = 0;
          this.process(buffer, 0, true);
        }
        this.finalize();
        let opos = 0;
        for (let i = 0; i < 8; i++) {
          out[opos++] = h[i] >>> 0;
          out[opos++] = h[i] >>> 8;
        }
        return out;
      }
      digest() {
        const { buffer, outputLen } = this;
        this.digestInto(buffer);
        const res = buffer.slice(0, outputLen);
        this.destroy();
        return res;
      }
    };
    poly1305 = wrapConstructorWithKey((key) => new Poly1305(key));
  }
});

// ../../node_modules/@noble/ciphers/esm/chacha.js
function chachaCore(s, k, n, out, cnt, rounds = 20) {
  let y00 = s[0], y01 = s[1], y02 = s[2], y03 = s[3], y04 = k[0], y05 = k[1], y06 = k[2], y07 = k[3], y08 = k[4], y09 = k[5], y10 = k[6], y11 = k[7], y12 = cnt, y13 = n[0], y14 = n[1], y15 = n[2];
  let x00 = y00, x01 = y01, x02 = y02, x03 = y03, x04 = y04, x05 = y05, x06 = y06, x07 = y07, x08 = y08, x09 = y09, x10 = y10, x11 = y11, x12 = y12, x13 = y13, x14 = y14, x15 = y15;
  for (let r = 0; r < rounds; r += 2) {
    x00 = x00 + x04 | 0;
    x12 = rotl(x12 ^ x00, 16);
    x08 = x08 + x12 | 0;
    x04 = rotl(x04 ^ x08, 12);
    x00 = x00 + x04 | 0;
    x12 = rotl(x12 ^ x00, 8);
    x08 = x08 + x12 | 0;
    x04 = rotl(x04 ^ x08, 7);
    x01 = x01 + x05 | 0;
    x13 = rotl(x13 ^ x01, 16);
    x09 = x09 + x13 | 0;
    x05 = rotl(x05 ^ x09, 12);
    x01 = x01 + x05 | 0;
    x13 = rotl(x13 ^ x01, 8);
    x09 = x09 + x13 | 0;
    x05 = rotl(x05 ^ x09, 7);
    x02 = x02 + x06 | 0;
    x14 = rotl(x14 ^ x02, 16);
    x10 = x10 + x14 | 0;
    x06 = rotl(x06 ^ x10, 12);
    x02 = x02 + x06 | 0;
    x14 = rotl(x14 ^ x02, 8);
    x10 = x10 + x14 | 0;
    x06 = rotl(x06 ^ x10, 7);
    x03 = x03 + x07 | 0;
    x15 = rotl(x15 ^ x03, 16);
    x11 = x11 + x15 | 0;
    x07 = rotl(x07 ^ x11, 12);
    x03 = x03 + x07 | 0;
    x15 = rotl(x15 ^ x03, 8);
    x11 = x11 + x15 | 0;
    x07 = rotl(x07 ^ x11, 7);
    x00 = x00 + x05 | 0;
    x15 = rotl(x15 ^ x00, 16);
    x10 = x10 + x15 | 0;
    x05 = rotl(x05 ^ x10, 12);
    x00 = x00 + x05 | 0;
    x15 = rotl(x15 ^ x00, 8);
    x10 = x10 + x15 | 0;
    x05 = rotl(x05 ^ x10, 7);
    x01 = x01 + x06 | 0;
    x12 = rotl(x12 ^ x01, 16);
    x11 = x11 + x12 | 0;
    x06 = rotl(x06 ^ x11, 12);
    x01 = x01 + x06 | 0;
    x12 = rotl(x12 ^ x01, 8);
    x11 = x11 + x12 | 0;
    x06 = rotl(x06 ^ x11, 7);
    x02 = x02 + x07 | 0;
    x13 = rotl(x13 ^ x02, 16);
    x08 = x08 + x13 | 0;
    x07 = rotl(x07 ^ x08, 12);
    x02 = x02 + x07 | 0;
    x13 = rotl(x13 ^ x02, 8);
    x08 = x08 + x13 | 0;
    x07 = rotl(x07 ^ x08, 7);
    x03 = x03 + x04 | 0;
    x14 = rotl(x14 ^ x03, 16);
    x09 = x09 + x14 | 0;
    x04 = rotl(x04 ^ x09, 12);
    x03 = x03 + x04 | 0;
    x14 = rotl(x14 ^ x03, 8);
    x09 = x09 + x14 | 0;
    x04 = rotl(x04 ^ x09, 7);
  }
  let oi = 0;
  out[oi++] = y00 + x00 | 0;
  out[oi++] = y01 + x01 | 0;
  out[oi++] = y02 + x02 | 0;
  out[oi++] = y03 + x03 | 0;
  out[oi++] = y04 + x04 | 0;
  out[oi++] = y05 + x05 | 0;
  out[oi++] = y06 + x06 | 0;
  out[oi++] = y07 + x07 | 0;
  out[oi++] = y08 + x08 | 0;
  out[oi++] = y09 + x09 | 0;
  out[oi++] = y10 + x10 | 0;
  out[oi++] = y11 + x11 | 0;
  out[oi++] = y12 + x12 | 0;
  out[oi++] = y13 + x13 | 0;
  out[oi++] = y14 + x14 | 0;
  out[oi++] = y15 + x15 | 0;
}
function hchacha(s, k, i, o32) {
  let x00 = s[0], x01 = s[1], x02 = s[2], x03 = s[3], x04 = k[0], x05 = k[1], x06 = k[2], x07 = k[3], x08 = k[4], x09 = k[5], x10 = k[6], x11 = k[7], x12 = i[0], x13 = i[1], x14 = i[2], x15 = i[3];
  for (let r = 0; r < 20; r += 2) {
    x00 = x00 + x04 | 0;
    x12 = rotl(x12 ^ x00, 16);
    x08 = x08 + x12 | 0;
    x04 = rotl(x04 ^ x08, 12);
    x00 = x00 + x04 | 0;
    x12 = rotl(x12 ^ x00, 8);
    x08 = x08 + x12 | 0;
    x04 = rotl(x04 ^ x08, 7);
    x01 = x01 + x05 | 0;
    x13 = rotl(x13 ^ x01, 16);
    x09 = x09 + x13 | 0;
    x05 = rotl(x05 ^ x09, 12);
    x01 = x01 + x05 | 0;
    x13 = rotl(x13 ^ x01, 8);
    x09 = x09 + x13 | 0;
    x05 = rotl(x05 ^ x09, 7);
    x02 = x02 + x06 | 0;
    x14 = rotl(x14 ^ x02, 16);
    x10 = x10 + x14 | 0;
    x06 = rotl(x06 ^ x10, 12);
    x02 = x02 + x06 | 0;
    x14 = rotl(x14 ^ x02, 8);
    x10 = x10 + x14 | 0;
    x06 = rotl(x06 ^ x10, 7);
    x03 = x03 + x07 | 0;
    x15 = rotl(x15 ^ x03, 16);
    x11 = x11 + x15 | 0;
    x07 = rotl(x07 ^ x11, 12);
    x03 = x03 + x07 | 0;
    x15 = rotl(x15 ^ x03, 8);
    x11 = x11 + x15 | 0;
    x07 = rotl(x07 ^ x11, 7);
    x00 = x00 + x05 | 0;
    x15 = rotl(x15 ^ x00, 16);
    x10 = x10 + x15 | 0;
    x05 = rotl(x05 ^ x10, 12);
    x00 = x00 + x05 | 0;
    x15 = rotl(x15 ^ x00, 8);
    x10 = x10 + x15 | 0;
    x05 = rotl(x05 ^ x10, 7);
    x01 = x01 + x06 | 0;
    x12 = rotl(x12 ^ x01, 16);
    x11 = x11 + x12 | 0;
    x06 = rotl(x06 ^ x11, 12);
    x01 = x01 + x06 | 0;
    x12 = rotl(x12 ^ x01, 8);
    x11 = x11 + x12 | 0;
    x06 = rotl(x06 ^ x11, 7);
    x02 = x02 + x07 | 0;
    x13 = rotl(x13 ^ x02, 16);
    x08 = x08 + x13 | 0;
    x07 = rotl(x07 ^ x08, 12);
    x02 = x02 + x07 | 0;
    x13 = rotl(x13 ^ x02, 8);
    x08 = x08 + x13 | 0;
    x07 = rotl(x07 ^ x08, 7);
    x03 = x03 + x04 | 0;
    x14 = rotl(x14 ^ x03, 16);
    x09 = x09 + x14 | 0;
    x04 = rotl(x04 ^ x09, 12);
    x03 = x03 + x04 | 0;
    x14 = rotl(x14 ^ x03, 8);
    x09 = x09 + x14 | 0;
    x04 = rotl(x04 ^ x09, 7);
  }
  let oi = 0;
  o32[oi++] = x00;
  o32[oi++] = x01;
  o32[oi++] = x02;
  o32[oi++] = x03;
  o32[oi++] = x12;
  o32[oi++] = x13;
  o32[oi++] = x14;
  o32[oi++] = x15;
}
function computeTag(fn, key, nonce, data, AAD) {
  const authKey = fn(key, nonce, ZEROS32);
  const h = poly1305.create(authKey);
  if (AAD)
    updatePadded(h, AAD);
  updatePadded(h, data);
  const num = u64Lengths(data.length, AAD ? AAD.length : 0, true);
  h.update(num);
  const res = h.digest();
  clean2(authKey, num);
  return res;
}
var chacha20, xchacha20, ZEROS16, updatePadded, ZEROS32, _poly1305_aead, chacha20poly1305, xchacha20poly1305;
var init_chacha = __esm({
  "../../node_modules/@noble/ciphers/esm/chacha.js"() {
    "use strict";
    init_arx();
    init_poly1305();
    init_utils3();
    chacha20 = /* @__PURE__ */ createCipher(chachaCore, {
      counterRight: false,
      counterLength: 4,
      allowShortKeys: false
    });
    xchacha20 = /* @__PURE__ */ createCipher(chachaCore, {
      counterRight: false,
      counterLength: 8,
      extendNonceFn: hchacha,
      allowShortKeys: false
    });
    ZEROS16 = /* @__PURE__ */ new Uint8Array(16);
    updatePadded = (h, msg) => {
      h.update(msg);
      const left = msg.length % 16;
      if (left)
        h.update(ZEROS16.subarray(left));
    };
    ZEROS32 = /* @__PURE__ */ new Uint8Array(32);
    _poly1305_aead = (xorStream) => (key, nonce, AAD) => {
      const tagLength = 16;
      return {
        encrypt(plaintext, output) {
          const plength = plaintext.length;
          output = getOutput(plength + tagLength, output, false);
          output.set(plaintext);
          const oPlain = output.subarray(0, -tagLength);
          xorStream(key, nonce, oPlain, oPlain, 1);
          const tag = computeTag(xorStream, key, nonce, oPlain, AAD);
          output.set(tag, plength);
          clean2(tag);
          return output;
        },
        decrypt(ciphertext, output) {
          output = getOutput(ciphertext.length - tagLength, output, false);
          const data = ciphertext.subarray(0, -tagLength);
          const passedTag = ciphertext.subarray(-tagLength);
          const tag = computeTag(xorStream, key, nonce, data, AAD);
          if (!equalBytes2(passedTag, tag))
            throw new Error("invalid tag");
          output.set(ciphertext.subarray(0, -tagLength));
          xorStream(key, nonce, output, output, 1);
          clean2(tag);
          return output;
        }
      };
    };
    chacha20poly1305 = /* @__PURE__ */ wrapCipher({ blockSize: 64, nonceLength: 12, tagLength: 16 }, _poly1305_aead(chacha20));
    xchacha20poly1305 = /* @__PURE__ */ wrapCipher({ blockSize: 64, nonceLength: 24, tagLength: 16 }, _poly1305_aead(xchacha20));
  }
});

// ../../packages/core/src/chatCrypto.ts
import { hkdfSync, createHash, randomBytes as randomBytes2 } from "crypto";
function bytesToHex2(bytes) {
  return Buffer.from(bytes).toString("hex");
}
function hexToBytes2(hex) {
  const buf = Buffer.from(hex, "hex");
  if (buf.length === 0 || buf.toString("hex") !== hex.toLowerCase()) {
    throw new Error("chatCrypto: invalid hex-encoded key");
  }
  return new Uint8Array(buf);
}
function bytesToB64(bytes) {
  return Buffer.from(bytes).toString("base64");
}
function b64ToBytes(b64) {
  return new Uint8Array(Buffer.from(b64, "base64"));
}
function generateIdentityKeypair() {
  const privateKey = x25519.utils.randomPrivateKey();
  const publicKey = x25519.getPublicKey(privateKey);
  return { publicKey: bytesToHex2(publicKey), privateKey: bytesToHex2(privateKey) };
}
function deriveSharedKey(myPrivateKey, peerPublicKey) {
  const shared = x25519.getSharedSecret(hexToBytes2(myPrivateKey), hexToBytes2(peerPublicKey));
  const derived = hkdfSync("sha256", shared, new Uint8Array(0), KDF_INFO, SHARED_KEY_BYTES);
  return new Uint8Array(derived);
}
function encryptMessage(plaintext, myPrivateKey, peerPublicKey) {
  const key = deriveSharedKey(myPrivateKey, peerPublicKey);
  const nonce = new Uint8Array(randomBytes2(NONCE_BYTES));
  const cipher = xchacha20poly1305(key, nonce);
  const ct = cipher.encrypt(new Uint8Array(Buffer.from(plaintext, "utf8")));
  return { ciphertext: bytesToB64(ct), nonce: bytesToB64(nonce) };
}
function decryptMessage(message, myPrivateKey, peerPublicKey) {
  const key = deriveSharedKey(myPrivateKey, peerPublicKey);
  const nonce = b64ToBytes(message.nonce);
  if (nonce.length !== NONCE_BYTES) {
    throw new Error(`chatCrypto: bad nonce length (expected ${NONCE_BYTES}, got ${nonce.length})`);
  }
  const ciphertext = b64ToBytes(message.ciphertext);
  if (ciphertext.length === 0) {
    throw new Error("chatCrypto: empty ciphertext");
  }
  const cipher = xchacha20poly1305(key, nonce);
  const pt = cipher.decrypt(ciphertext);
  return Buffer.from(pt).toString("utf8");
}
function safetyNumber(pubA, pubB) {
  const [first, second] = [pubA.toLowerCase(), pubB.toLowerCase()].sort();
  const digest = createHash("sha256").update(first).update("\n").update(second).digest();
  const groups = [];
  for (let i = 0; i < 12; i++) {
    const chunk = digest.readUInt16BE(i * 2 % 30);
    groups.push(String(chunk % 1e5).padStart(5, "0"));
  }
  return groups.join(" ");
}
var KDF_INFO, SHARED_KEY_BYTES, NONCE_BYTES;
var init_chatCrypto = __esm({
  "../../packages/core/src/chatCrypto.ts"() {
    "use strict";
    init_ed25519();
    init_chacha();
    KDF_INFO = Buffer.from("terminalhire-chat-v1");
    SHARED_KEY_BYTES = 32;
    NONCE_BYTES = 24;
  }
});

// ../../packages/core/src/job-status.ts
function recordClick(map, id) {
  const prev = map[id];
  if (prev?.clicked === true) return map;
  return { ...map, [id]: { ...prev, clicked: true } };
}
function setStatus(map, id, s, markedAt = (/* @__PURE__ */ new Date()).toISOString()) {
  const prev = map[id];
  return { ...map, [id]: { ...prev, status: s, markedAt } };
}
function funnelCounts(map) {
  const counts = { clicked: 0, applied: 0, saved: 0, dismissed: 0 };
  for (const key of Object.keys(map)) {
    const rec = map[key];
    if (rec.clicked === true) counts.clicked++;
    if (rec.status && Object.prototype.hasOwnProperty.call(counts, rec.status)) counts[rec.status]++;
  }
  return counts;
}
function pageMatches(items, page, limit) {
  const lim = Math.max(1, Math.floor(limit));
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / lim));
  const clamped = Math.min(Math.max(1, Math.floor(page)), totalPages);
  const start = (clamped - 1) * lim;
  return {
    items: items.slice(start, start + lim),
    page: clamped,
    limit: lim,
    total,
    totalPages,
    hasPrev: clamped > 1,
    hasNext: clamped < totalPages
  };
}
function decorate(matches, statusMap) {
  return matches.map((m) => {
    const rec = statusMap[m.job.id];
    return rec ? { ...m, jobStatus: rec } : { ...m };
  });
}
var init_job_status = __esm({
  "../../packages/core/src/job-status.ts"() {
    "use strict";
  }
});

// ../../packages/core/src/episodes/schema.ts
var init_schema = __esm({
  "../../packages/core/src/episodes/schema.ts"() {
    "use strict";
  }
});

// ../../packages/core/src/episodes/doors.ts
var init_doors = __esm({
  "../../packages/core/src/episodes/doors.ts"() {
    "use strict";
    init_schema();
  }
});

// ../../packages/core/src/episodes/node-model.ts
var init_node_model = __esm({
  "../../packages/core/src/episodes/node-model.ts"() {
    "use strict";
  }
});

// ../../packages/core/src/episodes/derivers/signals.ts
var init_signals = __esm({
  "../../packages/core/src/episodes/derivers/signals.ts"() {
    "use strict";
    init_node_model();
  }
});

// ../../packages/core/src/episodes/derivers/recency-split.ts
var DORMANT_THRESHOLD_DAYS;
var init_recency_split = __esm({
  "../../packages/core/src/episodes/derivers/recency-split.ts"() {
    "use strict";
    init_doors();
    init_signals();
    DORMANT_THRESHOLD_DAYS = 90;
  }
});

// ../../packages/core/src/credential/legible.ts
function labelFor(id) {
  return DISPLAY_LABEL[id] ?? id.split("-").map((w) => w.length > 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w).join(" ");
}
function capitalize(s) {
  return s.length > 0 ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}
function deriveLegibleProfile(credential, recency, traction, seniorityBand) {
  const ok = credential.status === "ok";
  const domains = ok ? credential.byDomain : {};
  const chips = Object.entries(domains).map(([rawDomain, d]) => {
    const canon = normalize([rawDomain])[0];
    return canon ? { domain: canon, mergedPRs: d.mergedPRs } : null;
  }).filter((c) => c !== null).sort((a, b) => b.mergedPRs - a.mergedPRs || (a.domain < b.domain ? -1 : 1));
  const dominant = chips.length > 0 ? chips[0].domain : void 0;
  const role = dominant ? ROLE_BY_DOMAIN[dominant] ?? GENERIC_ROLE : GENERIC_ROLE;
  const stackChips = chips.filter((c) => !(c.domain in CONCEPT_TAGS));
  const conceptChips = chips.filter((c) => c.domain in CONCEPT_TAGS && c.domain !== dominant);
  const topStacks = stackChips.slice(0, 3).map((c) => labelFor(c.domain)).join(", ");
  const specialization = dominant && dominant in CONCEPT_TAGS ? CONCEPT_TAGS[dominant] : conceptChips.length > 0 ? CONCEPT_TAGS[conceptChips[0].domain] : "";
  const sen = seniorityBand ? capitalize(seniorityBand) : "";
  let headline;
  if (chips.length > 0) {
    const roleSeg = sen ? `${sen} ${role}` : role;
    const segs = [roleSeg];
    if (specialization) segs.push(specialization);
    if (topStacks) segs.push(topStacks);
    headline = segs.join(" \xB7 ");
  } else {
    const roleSeg = sen ? `${sen} ${GENERIC_ROLE}` : GENERIC_ROLE;
    headline = traction.status === "ok" && traction.totalStars > 0 ? `${roleSeg} \xB7 ${traction.totalStars}\u2605 across owned repos` : roleSeg;
  }
  const mergedDates = Object.values(domains).map((d) => d.lastMergedAt).filter((s) => typeof s === "string" && s.length > 0).sort();
  const mostRecent = mergedDates.length > 0 ? mergedDates[mergedDates.length - 1] : void 0;
  const thresholdDays = Number.isFinite(recency.value.thresholdDays) && recency.value.thresholdDays > 0 ? recency.value.thresholdDays : DORMANT_THRESHOLD_DAYS;
  const nowIso = recency.value.now && recency.value.now.length > 0 ? recency.value.now : credential.computedAt || (/* @__PURE__ */ new Date()).toISOString();
  const nowMs = Date.parse(nowIso);
  let recencyBadge = null;
  let daysAgo;
  if (mostRecent) {
    const ageDays2 = (nowMs - Date.parse(mostRecent)) / DAY_MS;
    daysAgo = Math.max(0, Math.round(ageDays2));
    recencyBadge = { lastMergedAt: mostRecent, state: ageDays2 <= thresholdDays ? "live" : "dormant" };
  }
  const exactOrgCount = typeof credential.distinctOrgs === "number" && credential.distinctOrgs > 0;
  const orgCount = exactOrgCount ? credential.distinctOrgs : Object.values(domains).reduce((m, d) => Math.max(m, d.distinctOrgs), 0);
  let proofSentence;
  if (!ok) {
    proofSentence = "Contribution credential unavailable \u2014 could not verify.";
  } else {
    const prs = credential.qualifyingTotal;
    const orgPhrase = exactOrgCount ? `${orgCount}` : `at least ${orgCount}`;
    let s = `${prs} substantive PR${prs === 1 ? "" : "s"} merged into ${orgPhrase} external org${orgCount === 1 ? "" : "s"} (\u2265${MIN_STARS}\u2605, \u2265${MIN_CONTRIBUTORS} contributors)`;
    if (daysAgo !== void 0) s += ` \u2014 most recent ${daysAgo}d ago`;
    proofSentence = `${s}.`;
  }
  const enrichedPRs = ok ? credential.qualifyingPRs ?? [] : [];
  const maintainerReviewedCount = enrichedPRs.some((p) => p.maintainerReviewed !== void 0) ? enrichedPRs.filter((p) => p.maintainerReviewed === true).length : void 0;
  const auditableBadge = ok ? {
    mergedTotal: credential.qualifyingTotal,
    distinctOrgs: orgCount,
    thresholds: { stars: MIN_STARS, contributors: MIN_CONTRIBUTORS },
    ...maintainerReviewedCount !== void 0 ? { maintainerReviewedCount } : {}
  } : null;
  const profile = {
    headline,
    verifiedSkillChips: chips,
    recencyBadge,
    proofSentence,
    auditableBadge
  };
  if (seniorityBand) profile.seniority = seniorityBand;
  return profile;
}
var DAY_MS, GENERIC_ROLE, ROLE_BY_DOMAIN, CONCEPT_TAGS, DISPLAY_LABEL;
var init_legible = __esm({
  "../../packages/core/src/credential/legible.ts"() {
    "use strict";
    init_contribution_gate();
    init_vocabulary();
    init_recency_split();
    DAY_MS = 864e5;
    GENERIC_ROLE = "Software Engineer";
    ROLE_BY_DOMAIN = {
      backend: "Backend Engineer",
      go: "Backend Engineer",
      rust: "Backend Engineer",
      java: "Backend Engineer",
      python: "Backend Engineer",
      nodejs: "Backend Engineer",
      "api-design": "Backend Engineer",
      microservices: "Backend Engineer",
      postgresql: "Backend Engineer",
      frontend: "Frontend Engineer",
      react: "Frontend Engineer",
      vue: "Frontend Engineer",
      css: "Frontend Engineer",
      ml: "ML Engineer",
      pytorch: "ML Engineer",
      llm: "ML Engineer",
      "computer-vision": "ML Engineer",
      devops: "Platform Engineer",
      kubernetes: "Platform Engineer",
      terraform: "Platform Engineer",
      docker: "Platform Engineer",
      aws: "Platform Engineer",
      ios: "Mobile Engineer",
      android: "Mobile Engineer"
    };
    CONCEPT_TAGS = {
      "distributed-systems": "Distributed systems",
      microservices: "Microservices",
      security: "Security",
      payments: "Payments",
      ml: "Machine learning",
      llm: "LLM systems",
      "computer-vision": "Computer vision",
      recsys: "Recommendation systems",
      "api-design": "API design"
    };
    DISPLAY_LABEL = {
      postgresql: "Postgres",
      nodejs: "Node.js",
      ml: "ML",
      llm: "LLM",
      "api-design": "API design",
      "ci-cd": "CI/CD",
      "computer-vision": "Computer vision",
      "distributed-systems": "Distributed systems",
      ios: "iOS",
      css: "CSS",
      graphql: "GraphQL",
      aws: "AWS"
    };
  }
});

// ../../packages/core/src/credential/legible-trajectory.ts
function signalLabel(signal) {
  if (signal.startsWith("lang:")) {
    const token = signal.slice("lang:".length);
    return LANG_LABELS[token] ?? token.toUpperCase();
  }
  if (CAP_LABELS[signal]) return CAP_LABELS[signal];
  if (signal.startsWith("cap:")) return signal.slice("cap:".length).replace(/-/g, " ");
  return signal;
}
function joinLabels(labels) {
  if (labels.length === 0) return "";
  if (labels.length === 1) return labels[0];
  return `${labels.slice(0, -1).join(", ")} and ${labels[labels.length - 1]}`;
}
function mentionable(entries) {
  return entries.filter((e) => Math.abs(e.delta) >= MENTION_DELTA).slice(0, MAX_NAMED).map((e) => signalLabel(e.signal));
}
function displayableDrift(entries) {
  return entries.filter((e) => Math.abs(e.delta) >= DISPLAY_DELTA_FLOOR);
}
function deriveTrajectoryNarrative(score) {
  const risingLabels = mentionable(score.headline.rising);
  const fallingLabels = mentionable(score.headline.falling);
  let momentum;
  if (risingLabels.length === 0 && fallingLabels.length === 0) {
    momentum = "Steady focus \u2014 no major shifts recently.";
  } else {
    const parts = [];
    if (risingLabels.length > 0) parts.push(`Trending toward ${joinLabels(risingLabels)}`);
    if (fallingLabels.length > 0) {
      parts.push(
        risingLabels.length > 0 ? `shifting away from ${joinLabels(fallingLabels)}` : `Shifting away from ${joinLabels(fallingLabels)}`
      );
    }
    momentum = `${parts.join(", ")}.`;
  }
  const liveLangs = score.liveStack.filter((s) => s.startsWith("lang:")).map(signalLabel);
  const liveCaps = score.liveStack.filter((s) => !s.startsWith("lang:")).map(signalLabel);
  const focusParts = [];
  if (liveLangs.length > 0) focusParts.push(`Ships in ${joinLabels(liveLangs)}`);
  if (liveCaps.length > 0) {
    const verb = liveLangs.length > 0 ? "works with" : "Works with";
    focusParts.push(`${verb} ${joinLabels(liveCaps)}`);
  }
  const focus = focusParts.length > 0 ? `${focusParts.join(" \xB7 ")}.` : "";
  return { momentum, focus, risingLabels, fallingLabels };
}
var LANG_LABELS, CAP_LABELS, MENTION_DELTA, DISPLAY_DELTA_FLOOR, MAX_NAMED;
var init_legible_trajectory = __esm({
  "../../packages/core/src/credential/legible-trajectory.ts"() {
    "use strict";
    LANG_LABELS = {
      ts: "TypeScript",
      js: "JavaScript",
      py: "Python",
      rs: "Rust",
      go: "Go",
      rb: "Ruby",
      java: "Java",
      kt: "Kotlin",
      sql: "SQL",
      md: "Documentation"
    };
    CAP_LABELS = {
      "cap:ui-automation": "UI automation",
      "cap:deploys": "Deployment",
      "cap:project-mgmt": "Project tracking",
      "cap:product-research": "Product research",
      "cap:design": "Design",
      "cap:3d-modeling": "3D modeling",
      "cap:workflow-automation": "Workflow automation",
      "cap:agentic-workflow": "Agent orchestration",
      "mcp:custom": "Private integrations"
    };
    MENTION_DELTA = 0.05;
    DISPLAY_DELTA_FLOOR = 5e-4;
    MAX_NAMED = 3;
  }
});

// ../../packages/core/src/credential/sources.ts
function classifyOne(src) {
  if (src.isSelf) return "C";
  if (src.isBot) return "B";
  if (src.association !== void 0 && HUMAN_SET.has(src.association.toUpperCase())) return "A";
  return "B";
}
function classifyReviewSources(input) {
  if (input.reviewSources === void 0) return void 0;
  return input.reviewSources.map((src) => {
    const cls = classifyOne(src);
    return { class: cls, association: src.association, label: CLASS_LABEL[cls] };
  });
}
var SOURCE_CLASS, HUMAN_SET, CLASS_LABEL;
var init_sources = __esm({
  "../../packages/core/src/credential/sources.ts"() {
    "use strict";
    SOURCE_CLASS = {
      /** `author_association` values that make a (non-bot, non-self) reviewer a
       *  class-A independent human. Independence itself (is this maintainer affiliated
       *  with the contributor?) is refined by the repo-provenance/independence layer
       *  (TERM-46); this establishes the HUMAN class. */
      HUMAN_ASSOCIATIONS: ["OWNER", "MEMBER", "COLLABORATOR"]
    };
    HUMAN_SET = new Set(
      SOURCE_CLASS.HUMAN_ASSOCIATIONS.map((a) => a.toUpperCase())
    );
    CLASS_LABEL = {
      A: "independent-human",
      B: "automation",
      C: "self-review"
    };
  }
});

// ../../packages/core/src/credential/independence.ts
function repoOwner(repo) {
  const owner = repo.split("/")[0];
  return owner ? owner.toLowerCase() : null;
}
function computeRepoProvenance(facts) {
  const reasons = [];
  const owner = repoOwner(facts.repo);
  const selfOwned = owner != null && facts.authorLogin != null && owner === facts.authorLogin.toLowerCase();
  let ageDays2 = null;
  if (facts.repoCreatedAt) {
    const created = Date.parse(facts.repoCreatedAt);
    const seen = Date.parse(facts.fetchedAt);
    if (!Number.isNaN(created) && !Number.isNaN(seen)) ageDays2 = (seen - created) / MS_PER_DAY;
  }
  const dayOld = ageDays2 != null && ageDays2 < PROVENANCE.MIN_AGE_DAYS;
  if (dayOld) reasons.push(`repo is ${Math.max(0, Math.floor(ageDays2))}d old (< ${PROVENANCE.MIN_AGE_DAYS}d)`);
  if (selfOwned) reasons.push("repo is owned by the contributor (self-owned)");
  if (facts.repoPrivate === true) reasons.push("repo is private (not a public OSS signal)");
  if (selfOwned || dayOld || facts.repoPrivate === true) {
    return { tier: "flagged", reasons };
  }
  if (facts.repoFork) reasons.push("repo is a fork");
  const stars = facts.repoStars ?? 0;
  const contributors = facts.repoContributors ?? 0;
  const strongStars = facts.repoStars != null && stars >= PROVENANCE.STAR_FLOOR;
  const strongContribs = facts.repoContributors != null && contributors >= PROVENANCE.CONTRIB_FLOOR;
  const knownPublic = facts.repoPrivate === false;
  const ageEstablished = ageDays2 != null && ageDays2 >= PROVENANCE.MIN_AGE_DAYS;
  if (strongStars && strongContribs && knownPublic && ageEstablished) {
    reasons.push(`${stars}\u2605, ${contributors}+ contributors, public, ${Math.floor(ageDays2)}d old`);
    return { tier: "established", reasons };
  }
  reasons.push("external signals unknown or below floor");
  return { tier: "weak", reasons };
}
function computeEventIndependence(facts) {
  if (!facts.merged) return void 0;
  if (facts.mergedById == null || facts.authorId == null) {
    return {
      merger: {
        party: "merger",
        independence: "unverified",
        reasons: ["merger or author identity unresolved"]
      }
    };
  }
  if (facts.mergedById === facts.authorId) {
    return {
      merger: {
        party: "merger",
        independence: "affiliated",
        reasons: ["self-merged (merger id === author id)"]
      }
    };
  }
  return {
    merger: {
      party: "merger",
      independence: "independent",
      reasons: ["distinct merger id (identity check only; deeper affiliation not yet verified)"]
    }
  };
}
function eventCountsAtFullWeight(event, provenance) {
  return event.independence === "independent" && provenance.tier === "established";
}
function computeReviewerIndependence(signals) {
  if (signals.isSelf) {
    return { party: "reviewer", independence: "affiliated", reasons: ["self-review (reviewer is the contributor)"] };
  }
  if (signals.isBot) {
    return { party: "reviewer", independence: "unverified", reasons: ["automated reviewer \u2014 not an independent human party"] };
  }
  if (signals.sharedOrgWithAuthor === true) {
    return { party: "reviewer", independence: "affiliated", reasons: ["shares a public org with the author"] };
  }
  if (signals.sharedOrgWithAuthor === false) {
    return {
      party: "reviewer",
      independence: "independent",
      reasons: ["no shared public org with the author (public-org check only; external-history check deferred)"]
    };
  }
  return { party: "reviewer", independence: "unverified", reasons: ["affiliation signal absent (read failed/skipped)"] };
}
var PROVENANCE, MS_PER_DAY;
var init_independence = __esm({
  "../../packages/core/src/credential/independence.ts"() {
    "use strict";
    PROVENANCE = {
      /** A repo younger than this (days) is "day-old" → flagged (can't have earned
       *  external trust yet). */
      MIN_AGE_DAYS: 30,
      /** Stars floor for an `established` external signal. */
      STAR_FLOOR: 50,
      /** Distinct-contributor floor for an `established` external signal (matches the
       *  ≥5 external-contributor maintainer gate, plan 062). */
      CONTRIB_FLOOR: 5
    };
    MS_PER_DAY = 864e5;
  }
});

// ../../packages/core/src/credential/redaction.ts
function redactThirdParty(party, consent) {
  const c = consent ?? DENY_CONSENT;
  const showIdentity = c.identityOptIn === true && c.erased === false;
  return {
    label: showIdentity ? party.login : ANON_MAINTAINER_LABEL,
    identity: showIdentity ? party.login : null
  };
}
function renderMaintainerQuote(quote, consent) {
  const c = consent ?? DENY_CONSENT;
  if (quote && c.quoteOptIn === true && c.erased === false) {
    return { text: quote, kind: "verbatim" };
  }
  return { text: "", kind: "omitted" };
}
var ANON_MAINTAINER_LABEL, DENY_CONSENT;
var init_redaction = __esm({
  "../../packages/core/src/credential/redaction.ts"() {
    "use strict";
    ANON_MAINTAINER_LABEL = "a repo maintainer";
    DENY_CONSENT = {
      identityOptIn: false,
      quoteOptIn: false,
      erased: false
    };
  }
});

// ../../packages/core/src/credential/decisions.ts
function classifyDecisionEvidence(facts) {
  const d = facts.defense;
  const defenseQualifies = d != null && d.substantiveCorrectness === true && d.maintainerVerified === true && d.reviewerIndependence === "independent" && facts.provenance.tier === "established";
  if (defenseQualifies) return "defended_finding";
  const frictionless = facts.defense == null && facts.humanChangeRequests === 0 && facts.merger?.independence === "independent" && facts.provenance.tier === "established";
  if (frictionless) return "frictionless_merge";
  const engaged = facts.humanChangeRequests != null && facts.humanChangeRequests > 0 || d != null;
  return engaged ? "responsive" : "none";
}
var DECISION_LABEL;
var init_decisions = __esm({
  "../../packages/core/src/credential/decisions.ts"() {
    "use strict";
    DECISION_LABEL = {
      frictionless_merge: "clean execution \u2014 merged with zero human change-requests",
      defended_finding: "defended finding \u2014 verified by the maintainer",
      responsive: "responsive to review",
      none: "no decision evidence"
    };
  }
});

// ../../packages/core/src/credential/metrics-hygiene.ts
function knownCount(v) {
  return v != null && Number.isFinite(v) && v >= 0;
}
function hoursBetween(startIso, endIso) {
  if (!startIso || !endIso) return null;
  const start = Date.parse(startIso);
  const end = Date.parse(endIso);
  if (Number.isNaN(start) || Number.isNaN(end) || end < start) return null;
  return (end - start) / MS_PER_HOUR;
}
function deriveHygienicMetrics(facts) {
  const reasons = [];
  const sized = knownCount(facts.additions) && knownCount(facts.deletions);
  const totalLines = sized ? facts.additions + facts.deletions : null;
  let sizeClass;
  if (totalLines != null) {
    sizeClass = totalLines >= METRICS.LARGE_DIFF_LINES ? "large" : totalLines < METRICS.SMALL_DIFF_LINES ? "small" : "medium";
  }
  const deletionHeavy = sized ? facts.deletions >= METRICS.DELETION_HEAVY_FLOOR && facts.deletions > facts.additions * 2 : void 0;
  const hours = hoursBetween(facts.prCreatedAt, facts.mergedAt);
  const median2 = facts.repoMedianHoursToMerge != null && Number.isFinite(facts.repoMedianHoursToMerge) ? facts.repoMedianHoursToMerge : null;
  let timeToMerge;
  if (hours != null && median2 != null && median2 > 0) {
    timeToMerge = { hours, repoMedianHours: median2, ratio: hours / median2 };
  }
  const fastAbsolute = hours != null && hours <= METRICS.FAST_MERGE_HOURS;
  const fastVsBaseline = timeToMerge != null && timeToMerge.ratio <= METRICS.FAST_VS_MEDIAN_RATIO;
  const riskySurface = sizeClass === "large" || facts.securitySensitive === true;
  const rubberStampRisk = (fastAbsolute || fastVsBaseline) && riskySurface;
  if (rubberStampRisk) {
    if (fastAbsolute) reasons.push(`merged in ${hours.toFixed(2)}h (\u2264 ${METRICS.FAST_MERGE_HOURS}h)`);
    if (fastVsBaseline) reasons.push(`merged at ${timeToMerge.ratio.toFixed(2)}\xD7 the repo median`);
    if (sizeClass === "large") reasons.push("large diff");
    if (facts.securitySensitive === true) reasons.push("security-sensitive paths");
  }
  return {
    ...timeToMerge ? { timeToMerge } : {},
    ...sizeClass ? { sizeClass } : {},
    ...deletionHeavy !== void 0 ? { deletionHeavy } : {},
    rubberStampRisk,
    rubberStampReasons: reasons
  };
}
var METRICS, MS_PER_HOUR;
var init_metrics_hygiene = __esm({
  "../../packages/core/src/credential/metrics-hygiene.ts"() {
    "use strict";
    METRICS = {
      /** Total changed lines at/above which a diff is `large`. */
      LARGE_DIFF_LINES: 400,
      /** Total changed lines below which a diff is `small`. */
      SMALL_DIFF_LINES: 50,
      /** A merge at/under this many hours is "fast" in absolute terms. */
      FAST_MERGE_HOURS: 1,
      /** A merge at/under this fraction of the repo median is "fast" vs baseline. */
      FAST_VS_MEDIAN_RATIO: 0.1,
      /** Deletions must be at least this many lines AND exceed additions×2 to count as
       *  deletion-heavy (avoids flagging trivial cleanups). */
      DELETION_HEAVY_FLOOR: 50
    };
    MS_PER_HOUR = 36e5;
  }
});

// ../../packages/core/src/credential/dossier.ts
function toMs(iso) {
  const t = Date.parse(iso);
  return Number.isNaN(t) ? null : t;
}
function buildTimeline(facts, sourceClasses) {
  const { prCreatedAt, commits } = facts;
  const sources = facts.reviewSources;
  if (prCreatedAt == null) return {};
  if (commits == null) return {};
  if (sources == null || sourceClasses == null) return {};
  if (!sources.every((s) => s.submittedAt != null)) return {};
  if (!commits.every((c) => c.committedAt != null)) return {};
  const events = [];
  const openedMs = toMs(prCreatedAt);
  if (openedMs == null) return {};
  events.push({ at: openedMs, rank: TIMELINE_TIE_RANK.opened, isReview: false, isSelf: false, node: { kind: "opened", at: prCreatedAt } });
  for (const c of commits) {
    const cm = toMs(c.committedAt);
    if (cm == null) return {};
    events.push({ at: cm, rank: TIMELINE_TIE_RANK.commit, isReview: false, isSelf: false, node: { kind: "commit", at: c.committedAt, shortSha: c.sha.slice(0, 8) } });
  }
  for (let i = 0; i < sources.length; i++) {
    const s = sources[i];
    const rm = toMs(s.submittedAt);
    if (rm == null) return {};
    events.push({
      at: rm,
      rank: TIMELINE_TIE_RANK.review,
      isReview: true,
      isSelf: s.isSelf === true,
      node: {
        kind: "review",
        at: s.submittedAt,
        class: sourceClasses[i]?.class ?? "B",
        ...s.pseudonym ? { pseudonym: s.pseudonym } : {},
        ...s.state ? { state: s.state } : {}
      }
    });
  }
  if (facts.merged && facts.mergedAt) {
    const mm = toMs(facts.mergedAt);
    if (mm != null) events.push({ at: mm, rank: TIMELINE_TIE_RANK.merged, isReview: false, isSelf: false, node: { kind: "merged", at: facts.mergedAt } });
  }
  events.sort((a, b) => a.at - b.at || a.rank - b.rank);
  let reviewRounds = 0;
  let runHasNonSelf = false;
  for (const e of events) {
    if (e.node.kind === "commit") {
      if (runHasNonSelf) reviewRounds++;
      runHasNonSelf = false;
    } else if (e.isReview && !e.isSelf) {
      runHasNonSelf = true;
    }
  }
  if (runHasNonSelf) reviewRounds++;
  return { timeline: events.map((e) => e.node), reviewRounds };
}
function buildDossierEnvelope(facts, defense) {
  const provenance = computeRepoProvenance(facts);
  const event = computeEventIndependence(facts);
  const merger = event?.merger;
  const sourceClasses = classifyReviewSources({ reviewSources: facts.reviewSources });
  let humanChangeRequests;
  const sources = facts.reviewSources;
  if (sources != null && sources.every((s) => s.state != null)) {
    humanChangeRequests = sources.filter(
      (s) => !s.isBot && !s.isSelf && s.state === "CHANGES_REQUESTED"
    ).length;
  }
  const reviewThread = sources != null && sourceClasses != null ? sources.map((s, i) => ({
    ...s.pseudonym ? { pseudonym: s.pseudonym } : {},
    class: sourceClasses[i]?.class ?? "B",
    ...s.state ? { state: s.state } : {},
    submittedAt: s.submittedAt ?? null,
    independence: computeReviewerIndependence(s).independence
  })) : void 0;
  const decisionEvidence = classifyDecisionEvidence({
    humanChangeRequests,
    merger,
    provenance,
    defense
  });
  const hygienicMetrics = deriveHygienicMetrics({
    prCreatedAt: facts.prCreatedAt,
    mergedAt: facts.mergedAt,
    additions: facts.additions,
    deletions: facts.deletions
    // Repo-median baseline is deferred (governor-budget review, plan risk #5) —
    // absent baseline ⇒ time-to-merge honestly omitted by the deriver.
  });
  const prStats = knownCount(facts.additions) && knownCount(facts.deletions) && knownCount(facts.changedFiles) ? { additions: facts.additions, deletions: facts.deletions, changedFiles: facts.changedFiles } : void 0;
  const linkage = facts.closesIssues.length > 0 && facts.linkageSource !== "none" ? { closesIssues: [...facts.closesIssues], linkageSource: facts.linkageSource } : void 0;
  const { timeline, reviewRounds } = buildTimeline(facts, sourceClasses);
  const threadStats = facts.reviewThreadStats ? {
    total: facts.reviewThreadStats.total,
    resolved: facts.reviewThreadStats.resolved,
    unresolved: facts.reviewThreadStats.unresolved
  } : void 0;
  return {
    v: "dossier/1",
    provenance,
    ...merger ? { merger } : {},
    fullWeight: merger != null && eventCountsAtFullWeight(merger, provenance),
    ...sourceClasses ? { sourceClasses } : {},
    ...reviewThread ? { reviewThread } : {},
    ...humanChangeRequests !== void 0 ? { humanChangeRequests } : {},
    decisionEvidence,
    hygienicMetrics,
    ...prStats ? { prStats } : {},
    ...linkage ? linkage : {},
    ...timeline ? { timeline } : {},
    ...reviewRounds !== void 0 ? { reviewRounds } : {},
    ...threadStats ? { threadStats } : {}
  };
}
var TIMELINE_TIE_RANK;
var init_dossier = __esm({
  "../../packages/core/src/credential/dossier.ts"() {
    "use strict";
    init_sources();
    init_independence();
    init_decisions();
    init_metrics_hygiene();
    TIMELINE_TIE_RANK = { opened: 0, commit: 1, review: 2, merged: 3 };
  }
});

// ../../packages/core/src/credential/synthesis.ts
function parsePath(path) {
  if (path.length === 0) return null;
  const segments = [];
  for (const part of path.split(".")) {
    const m = part.match(/^([^[\]]*)((?:\[\d+\])*)$/);
    if (!m) return null;
    const base = m[1];
    if (base.length > 0) {
      if (FORBIDDEN_SEGMENTS.has(base)) return null;
      segments.push(base);
    } else if (m[2].length === 0) {
      return null;
    }
    const idx = m[2];
    if (idx) {
      for (const g of idx.matchAll(/\[(\d+)\]/g)) segments.push(g[1]);
    }
  }
  return segments.length > 0 ? segments : null;
}
function resolveCitation(source, cite) {
  if (typeof cite !== "string" || !cite.startsWith(CITE_PREFIX)) {
    return { cite: String(cite), path: "", resolved: false };
  }
  const path = cite.slice(CITE_PREFIX.length);
  const segments = parsePath(path);
  if (!segments) return { cite, path, resolved: false };
  let cur = source;
  for (const seg of segments) {
    if (cur == null || typeof cur !== "object") return { cite, path, resolved: false };
    if (Array.isArray(cur)) {
      const i = Number(seg);
      if (!Number.isInteger(i) || i < 0 || i >= cur.length) return { cite, path, resolved: false };
      cur = cur[i];
    } else {
      if (!Object.prototype.hasOwnProperty.call(cur, seg)) return { cite, path, resolved: false };
      cur = cur[seg];
    }
  }
  if (cur === void 0) return { cite, path, resolved: false };
  return { cite, path, resolved: true, value: cur };
}
function resolveCitations(source, cites) {
  return cites.map((c) => resolveCitation(source, c));
}
function citeSourceClass(source, cite) {
  if (typeof cite !== "string") return null;
  const m = cite.match(/^env:(sourceClasses|reviewThread)\[(\d+)\]/);
  if (!m) return null;
  const r = resolveCitation(source, `${CITE_PREFIX}${m[1]}[${m[2]}].class`);
  const v = r.resolved ? r.value : void 0;
  return v === "A" || v === "B" || v === "C" ? v : null;
}
function citesConverge(source, cites) {
  if (!Array.isArray(cites)) return false;
  const classes = /* @__PURE__ */ new Set();
  for (const c of cites) {
    const cls = citeSourceClass(source, c);
    if (cls) classes.add(cls);
  }
  return classes.size >= 2;
}
function claimFullyResolves(source, claim) {
  if (claim.cites.length === 0) return false;
  return claim.cites.every((c) => resolveCitation(source, c).resolved);
}
function citablePaths(source, prefix = "", depth = 0) {
  if (depth > 6 || source == null || typeof source !== "object") return [];
  const out = [];
  const push = (p, v) => {
    out.push(`${CITE_PREFIX}${p}`);
    if (v != null && typeof v === "object") out.push(...citablePaths(v, p, depth + 1));
  };
  if (Array.isArray(source)) {
    source.forEach((v, i) => push(prefix ? `${prefix}[${i}]` : `[${i}]`, v));
  } else {
    for (const [k, v] of Object.entries(source)) {
      if (v === void 0) continue;
      push(prefix ? `${prefix}.${k}` : k, v);
    }
  }
  return out;
}
function projectForSynthesis(env) {
  if (env == null || typeof env !== "object") return null;
  const tier = enumOf(env.provenance?.tier, TIER_SET);
  const decisionEvidence = enumOf(env.decisionEvidence, DECISION_SET);
  const rubberStampRisk = typeof env.hygienicMetrics?.rubberStampRisk === "boolean" ? env.hygienicMetrics.rubberStampRisk : void 0;
  if (tier === void 0 || typeof env.fullWeight !== "boolean" || decisionEvidence === void 0 || rubberStampRisk === void 0) {
    return null;
  }
  const src = {
    provenance: { tier },
    fullWeight: env.fullWeight,
    decisionEvidence,
    hygienicMetrics: { rubberStampRisk }
  };
  const hm = env.hygienicMetrics;
  const sizeClass = enumOf(hm.sizeClass, SIZE_CLASS_SET);
  if (sizeClass !== void 0) src.hygienicMetrics.sizeClass = sizeClass;
  if (typeof hm.deletionHeavy === "boolean") src.hygienicMetrics.deletionHeavy = hm.deletionHeavy;
  if (hm.timeToMerge) {
    const hours = boundedNum(hm.timeToMerge.hours);
    const repoMedianHours = boundedNum(hm.timeToMerge.repoMedianHours);
    const ratio = boundedNum(hm.timeToMerge.ratio);
    if (hours !== void 0 && repoMedianHours !== void 0 && ratio !== void 0) {
      src.hygienicMetrics.timeToMerge = { hours, repoMedianHours, ratio };
    }
  }
  if (env.merger) {
    const party = enumOf(env.merger.party, PARTY_SET);
    const independence = enumOf(env.merger.independence, INDEPENDENCE_SET);
    if (party !== void 0 && independence !== void 0) src.merger = { party, independence };
  }
  if (Array.isArray(env.sourceClasses)) {
    const out = [];
    for (const s of env.sourceClasses) {
      const cls = enumOf(s?.class, /* @__PURE__ */ new Set(["A", "B", "C"]));
      const label = enumOf(s?.label, LABEL_SET);
      if (cls === void 0 || label === void 0) continue;
      const entry = { class: cls, label };
      const association = enumOf(s.association, ASSOCIATION_SET);
      if (association !== void 0) entry.association = association;
      out.push(entry);
    }
    if (out.length > 0) src.sourceClasses = out;
  }
  if (Array.isArray(env.reviewThread)) {
    const out = [];
    for (const t of env.reviewThread) {
      const cls = enumOf(t?.class, /* @__PURE__ */ new Set(["A", "B", "C"]));
      const independence = enumOf(t?.independence, INDEPENDENCE_SET);
      if (cls === void 0 || independence === void 0) continue;
      const entry = { class: cls, independence };
      const pseudonym = validPseudonym(t.pseudonym);
      if (pseudonym !== void 0) entry.pseudonym = pseudonym;
      const state = enumOf(t.state, REVIEW_STATE_SET);
      if (state !== void 0) entry.state = state;
      const submittedAt = validTs(t.submittedAt);
      if (submittedAt !== void 0) entry.submittedAt = submittedAt;
      out.push(entry);
    }
    if (out.length > 0) src.reviewThread = out;
  }
  const hcr = boundedCount(env.humanChangeRequests);
  if (hcr !== void 0) src.humanChangeRequests = hcr;
  if (env.prStats) {
    const additions = boundedCount(env.prStats.additions);
    const deletions = boundedCount(env.prStats.deletions);
    const changedFiles = boundedCount(env.prStats.changedFiles);
    if (additions !== void 0 && deletions !== void 0 && changedFiles !== void 0) {
      src.prStats = { additions, deletions, changedFiles };
    }
  }
  if (Array.isArray(env.closesIssues)) {
    const nums = env.closesIssues.filter((n) => boundedCount(n) !== void 0);
    const linkageSource = enumOf(env.linkageSource, LINKAGE_SET);
    if (nums.length > 0 && nums.length === env.closesIssues.length && linkageSource !== void 0) {
      src.closesIssues = nums;
      src.linkageSource = linkageSource;
    }
  }
  if (Array.isArray(env.timeline)) {
    const out = [];
    let ok = true;
    for (const node of env.timeline) {
      const kind = enumOf(node?.kind, /* @__PURE__ */ new Set(["opened", "commit", "review", "merged"]));
      const at = validTs(node?.at);
      if (kind === void 0 || at === void 0) {
        ok = false;
        break;
      }
      const n = { kind, at };
      if (kind === "commit") {
        const shortSha = typeof node.shortSha === "string" && SHORT_SHA_RE.test(node.shortSha) ? node.shortSha : void 0;
        if (shortSha === void 0) {
          ok = false;
          break;
        }
        n.shortSha = shortSha;
      } else if (kind === "review") {
        const cls = enumOf(node.class, /* @__PURE__ */ new Set(["A", "B", "C"]));
        if (cls === void 0) {
          ok = false;
          break;
        }
        n.class = cls;
        const pseudonym = validPseudonym(node.pseudonym);
        if (pseudonym !== void 0) n.pseudonym = pseudonym;
        const state = enumOf(node.state, REVIEW_STATE_SET);
        if (state !== void 0) n.state = state;
      }
      out.push(n);
    }
    if (ok && out.length > 0) src.timeline = out;
  }
  const reviewRounds = boundedCount(env.reviewRounds);
  if (reviewRounds !== void 0) src.reviewRounds = reviewRounds;
  if (env.threadStats) {
    const total = boundedCount(env.threadStats.total);
    const resolved = boundedCount(env.threadStats.resolved);
    const unresolved = boundedCount(env.threadStats.unresolved);
    if (total !== void 0 && resolved !== void 0 && unresolved !== void 0) {
      src.threadStats = { total, resolved, unresolved };
    }
  }
  return src;
}
function buildRollupSource(baseRepo, inputs) {
  let fullWeightCount = 0;
  let totalAdditions = 0;
  let totalDeletions = 0;
  let totalChangedFiles = 0;
  let reviewRoundsTotal = 0;
  let independentReviewCount = 0;
  let defendedFindingCount = 0;
  let issueLinkedCount = 0;
  let bestTier = "weak";
  const tierRank = {
    flagged: 0,
    weak: 1,
    established: 2
  };
  const gradeMap = /* @__PURE__ */ new Map();
  for (const it of inputs) {
    const env = it.env;
    if (env.fullWeight) fullWeightCount += 1;
    const tier = env.provenance?.tier;
    if ((tier === "established" || tier === "weak" || tier === "flagged") && tierRank[tier] > tierRank[bestTier]) {
      bestTier = tier;
    }
    if (env.prStats) {
      totalAdditions += env.prStats.additions;
      totalDeletions += env.prStats.deletions;
      totalChangedFiles += env.prStats.changedFiles;
    }
    if (typeof env.reviewRounds === "number") reviewRoundsTotal += env.reviewRounds;
    if (env.merger?.independence === "independent") independentReviewCount += 1;
    if (env.decisionEvidence === "defended_finding") defendedFindingCount += 1;
    if (env.closesIssues && env.closesIssues.length > 0) issueLinkedCount += 1;
    const gradeRank = {
      "no-signal": 0,
      process: 1,
      medium: 2,
      high: 3
    };
    for (const c of it.sections?.competencies ?? []) {
      const prev = gradeMap.get(c.name);
      if (!prev || gradeRank[c.grade] > gradeRank[prev.grade]) {
        gradeMap.set(c.name, { name: c.name, grade: c.grade });
      }
    }
  }
  return {
    baseRepo,
    prCount: inputs.length,
    fullWeightCount,
    repoTier: bestTier,
    totalAdditions,
    totalDeletions,
    totalChangedFiles,
    reviewRoundsTotal,
    independentReviewCount,
    defendedFindingCount,
    issueLinkedCount,
    competencyGrades: COMPETENCY_NAMES.map((n) => gradeMap.get(n)).filter(
      (g) => g !== void 0
    )
  };
}
function buildPass1System(kind) {
  const hygiene = HYGIENE_PRINCIPLES_S6.map((p, i) => `${i + 1}. ${p}`).join("\n");
  const taxonomy = kind === "pr" ? `

COMPETENCY TAXONOMY (use these names ONLY, never free text): ${COMPETENCY_NAMES.join(", ")}.
Grades: ${COMPETENCY_GRADES.join(", ")}. Grade "process" = procedural/engagement-level signal (e.g. a review round occurred), NOT strong competence; "no-signal" = the facts carry nothing for it (omit rather than pad).` : '\n\nEmit EXACTLY one claim of kind="bullet": a single, plain, non-inflated r\xE9sum\xE9 bullet for this repository rollup. No superlatives, no unverifiable scope.';
  const framing = kind === "pr" ? 'Produce: one kind="thesis" claim (what the contribution was), one kind="decision" claim (how it was reviewed/decided), and zero or more kind="competency" claims.' : "Produce the single r\xE9sum\xE9 bullet described below.";
  return `${CITATION_CONTRACT}

METRICS-HYGIENE PRINCIPLES (obey all \u2014 the render enforces the same rails):
${hygiene}${taxonomy}

${framing}`;
}
function buildPass1User(source, kind) {
  const allowed = citablePaths(source);
  return [
    `KIND: ${kind}`,
    "SOURCE (the only facts you may use):",
    JSON.stringify(source),
    "",
    "ALLOWED CITES (cite ONLY from this list):",
    allowed.join("\n")
  ].join("\n");
}
function buildPass2System() {
  return VERIFY_CONTRACT;
}
function buildPass2User(claims, source) {
  const blocks = claims.map((cl) => {
    const resolved = resolveCitations(source, cl.cites).map((r) => `  ${r.cite} = ${r.resolved ? JSON.stringify(r.value) : "<UNRESOLVED>"}`).join("\n");
    const comp = cl.competency ? ` [competency ${cl.competency.name}=${cl.competency.grade}]` : "";
    return `CLAIM ${cl.id} (${cl.kind})${comp}:
  text: ${JSON.stringify(cl.text)}
  evidence:
${resolved}`;
  });
  return `Verify each claim against ITS evidence excerpts only.

${blocks.join("\n\n")}`;
}
function extractJson(text) {
  if (typeof text !== "string") return null;
  const start = text.indexOf("{");
  if (start < 0) return null;
  let depth = 0;
  let inStr = false;
  let esc = false;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (inStr) {
      if (esc) esc = false;
      else if (ch === "\\") esc = true;
      else if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') inStr = true;
    else if (ch === "{") depth += 1;
    else if (ch === "}") {
      depth -= 1;
      if (depth === 0) {
        try {
          return JSON.parse(text.slice(start, i + 1));
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}
function parsePass1(raw) {
  const obj = typeof raw === "string" ? extractJson(raw) : raw;
  if (obj == null || typeof obj !== "object" || !Array.isArray(obj.claims)) {
    return { claims: [] };
  }
  const claims = [];
  const seen = /* @__PURE__ */ new Set();
  for (const c of obj.claims) {
    if (c == null || typeof c !== "object") continue;
    const o = c;
    const kind = o.kind;
    if (kind !== "thesis" && kind !== "decision" && kind !== "competency" && kind !== "bullet") continue;
    const text = typeof o.text === "string" ? o.text.trim() : "";
    if (text.length === 0) continue;
    const cites = Array.isArray(o.cites) ? o.cites.filter((x) => typeof x === "string") : [];
    let id = typeof o.id === "string" && o.id.length > 0 ? o.id : `c${claims.length + 1}`;
    while (seen.has(id)) id = `${id}_`;
    seen.add(id);
    const claim = { id, kind, text, cites };
    if (kind === "competency") {
      const comp = o.competency;
      if (!comp || !isCompetencyName(comp.name) || !isCompetencyGrade(comp.grade)) continue;
      claim.competency = { name: comp.name, grade: comp.grade };
    }
    claims.push(claim);
  }
  return { claims };
}
function parseVerdict(raw) {
  const obj = typeof raw === "string" ? extractJson(raw) : raw;
  const supported = obj != null && typeof obj === "object" && Array.isArray(obj.supported) ? obj.supported.filter((x) => typeof x === "string") : [];
  return { supported };
}
function applyVerdict(claims, verdict) {
  const ok = new Set(verdict.supported);
  const kept = claims.filter((c) => ok.has(c.id));
  return { kept, dropped: claims.length - kept.length };
}
function dropUnresolvableCites(source, claims) {
  const kept = claims.filter((c) => claimFullyResolves(source, c));
  return { kept, dropped: claims.length - kept.length };
}
function words(text) {
  return text.toLowerCase().match(/[a-z0-9_]+/g) ?? [];
}
function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function textContainsLogin(text, login) {
  if (typeof text !== "string" || typeof login !== "string") return false;
  const f = login.trim();
  if (f.length === 0) return false;
  return new RegExp(`(^|[^a-z0-9-])${escapeRegex(f)}([^a-z0-9-]|$)`, "i").test(text);
}
function dropIdentityTokens(forbidden, claims) {
  const logins = forbidden.filter((f) => typeof f === "string" && f.trim().length > 0).map((f) => f.trim());
  if (logins.length === 0) return { kept: claims, dropped: 0 };
  const patterns = logins.map((f) => new RegExp(`(^|[^a-z0-9-])${escapeRegex(f)}([^a-z0-9-]|$)`, "i"));
  const kept = claims.filter((c) => !patterns.some((re) => re.test(c.text)));
  return { kept, dropped: claims.length - kept.length };
}
function dropNgramOverlap(promptSources, claims, maxRun = 10) {
  const windowLen = maxRun + 1;
  const sourceGrams = /* @__PURE__ */ new Set();
  for (const src of promptSources) {
    const toks = words(src);
    for (let i = 0; i + windowLen <= toks.length; i++) {
      sourceGrams.add(toks.slice(i, i + windowLen).join(" "));
    }
  }
  if (sourceGrams.size === 0) return { kept: claims, dropped: 0 };
  const overlaps = (text) => {
    const toks = words(text);
    for (let i = 0; i + windowLen <= toks.length; i++) {
      if (sourceGrams.has(toks.slice(i, i + windowLen).join(" "))) return true;
    }
    return false;
  };
  const kept = claims.filter((c) => !overlaps(c.text));
  return { kept, dropped: claims.length - kept.length };
}
function assembleSections(kept) {
  const thesis = kept.find((c) => c.kind === "thesis");
  const decision = kept.find((c) => c.kind === "decision");
  const gradeRank = {
    "no-signal": 0,
    process: 1,
    medium: 2,
    high: 3
  };
  const byName = /* @__PURE__ */ new Map();
  for (const c of kept) {
    if (c.kind !== "competency" || !c.competency) continue;
    const entry = { name: c.competency.name, grade: c.competency.grade, cites: c.cites, text: c.text };
    const prev = byName.get(entry.name);
    if (!prev || gradeRank[entry.grade] > gradeRank[prev.grade]) byName.set(entry.name, entry);
  }
  const competencies = COMPETENCY_NAMES.map((n) => byName.get(n)).filter(
    (c) => c !== void 0
  );
  return {
    thesisContribution: thesis?.text ?? "",
    decisionNarrative: decision?.text ?? "",
    competencies
  };
}
function assembleRollup(kept) {
  const bullet = kept.find((c) => c.kind === "bullet");
  return { resumeBullet: bullet?.text ?? "" };
}
var SYNTHESIS_MODEL, SYNTHESIS_VERSION, ROLLUP_VERSION, CITE_PREFIX, COMPETENCY_NAMES, COMPETENCY_NAME_SET, isCompetencyName, COMPETENCY_GRADES, COMPETENCY_GRADE_SET, isCompetencyGrade, FORBIDDEN_SEGMENTS, TIER_SET, DECISION_SET, INDEPENDENCE_SET, PARTY_SET, LABEL_SET, ASSOCIATION_SET, REVIEW_STATE_SET, SIZE_CLASS_SET, LINKAGE_SET, SYN_PSEUDONYM_RE, SHORT_SHA_RE, ISO_TS_RE, enumOf, boundedCount, boundedNum, validTs, validPseudonym, HYGIENE_PRINCIPLES_S6, CITATION_CONTRACT, VERIFY_CONTRACT;
var init_synthesis = __esm({
  "../../packages/core/src/credential/synthesis.ts"() {
    "use strict";
    SYNTHESIS_MODEL = "claude-sonnet-5";
    SYNTHESIS_VERSION = "synthesis/1";
    ROLLUP_VERSION = "rollup/1";
    CITE_PREFIX = "env:";
    COMPETENCY_NAMES = [
      "code-authorship",
      "iterative-refinement",
      "independent-review",
      "defect-resolution",
      "repository-standing",
      "issue-linkage"
    ];
    COMPETENCY_NAME_SET = new Set(COMPETENCY_NAMES);
    isCompetencyName = (v) => typeof v === "string" && COMPETENCY_NAME_SET.has(v);
    COMPETENCY_GRADES = [
      "high",
      "medium",
      "process",
      "no-signal"
    ];
    COMPETENCY_GRADE_SET = new Set(COMPETENCY_GRADES);
    isCompetencyGrade = (v) => typeof v === "string" && COMPETENCY_GRADE_SET.has(v);
    FORBIDDEN_SEGMENTS = /* @__PURE__ */ new Set(["__proto__", "prototype", "constructor"]);
    TIER_SET = /* @__PURE__ */ new Set(["established", "weak", "flagged"]);
    DECISION_SET = /* @__PURE__ */ new Set(["frictionless_merge", "defended_finding", "responsive", "none"]);
    INDEPENDENCE_SET = /* @__PURE__ */ new Set(["independent", "affiliated", "unverified"]);
    PARTY_SET = /* @__PURE__ */ new Set(["merger", "reviewer"]);
    LABEL_SET = /* @__PURE__ */ new Set(["independent-human", "automation", "self-review"]);
    ASSOCIATION_SET = /* @__PURE__ */ new Set([
      "COLLABORATOR",
      "CONTRIBUTOR",
      "FIRST_TIMER",
      "FIRST_TIME_CONTRIBUTOR",
      "MANNEQUIN",
      "MEMBER",
      "NONE",
      "OWNER"
    ]);
    REVIEW_STATE_SET = /* @__PURE__ */ new Set(["APPROVED", "CHANGES_REQUESTED", "COMMENTED", "DISMISSED", "PENDING"]);
    SIZE_CLASS_SET = /* @__PURE__ */ new Set(["small", "medium", "large"]);
    LINKAGE_SET = /* @__PURE__ */ new Set(["graphql", "body-keyword"]);
    SYN_PSEUDONYM_RE = /^R[0-9a-f]{8}$/;
    SHORT_SHA_RE = /^[0-9a-f]{4,40}$/i;
    ISO_TS_RE = /^\d{4}-\d{2}-\d{2}T[0-9:.]+(?:Z|[+-]\d{2}:?\d{2})?$/;
    enumOf = (v, set) => typeof v === "string" && set.has(v) ? v : void 0;
    boundedCount = (v) => typeof v === "number" && Number.isInteger(v) && v >= 0 && v <= 1e9 ? v : void 0;
    boundedNum = (v) => typeof v === "number" && Number.isFinite(v) && Math.abs(v) <= 1e9 ? v : void 0;
    validTs = (v) => typeof v === "string" && v.length <= 40 && ISO_TS_RE.test(v) && !Number.isNaN(Date.parse(v)) ? v : void 0;
    validPseudonym = (v) => typeof v === "string" && SYN_PSEUDONYM_RE.test(v) ? v : void 0;
    HYGIENE_PRINCIPLES_S6 = [
      "Time-to-merge demoted from headline. If shown, contextualized against the repo\u2019s historical average for similar-size PRs; an abnormally fast merge of a large/security diff is flagged as a risk (possible rubber-stamp), not an achievement.",
      "Value over volume \u2014 no raw +LOC celebration; normalize by impact; treat large deletions/refactors as potentially high-value.",
      'Explicit scope statement on every dossier: "Reflects merged public-repo code contributions. Does not capture private, non-code, or correct-but-overruled work." Names the survivorship limit up front.',
      "reviewRounds + threadStats are ENGAGEMENT metrics, never validation. A review round and a thread-resolution tally describe how much back-and-forth a PR drew \u2014 not whether the work was vetted. They render with honest absence and the render never fuses human + automation into one review count."
    ];
    CITATION_CONTRACT = [
      "You write ONE developer-contribution dossier section from STRUCTURED FACTS ONLY.",
      "You are given a JSON `source` object of identity-free facts (pseudonym labels, enums,",
      "counts, timestamps). You have NO other information. You must NOT invent, infer beyond,",
      "or embellish these facts, and you must NOT name any person, account, email, or handle.",
      "",
      "Every claim you emit MUST carry one or more citations. A citation is the exact string",
      "`env:<path>` pointing at the source value that proves the claim (e.g. `env:threadStats.resolved`,",
      "`env:provenance.tier`, `env:reviewRounds`). Cite ONLY paths present in the provided",
      "ALLOWED CITES list. A claim you cannot ground in a real path \u2014 DO NOT emit it. Prefer",
      "fewer, fully-grounded claims over broad ones. If the facts support nothing, emit no claims.",
      "",
      'Return STRICT JSON: {"claims":[{"id":"c1","kind":"thesis|decision|competency|bullet",',
      '"text":"...","cites":["env:..."],"competency":{"name":"<taxonomy>","grade":"high|medium|process|no-signal"}}]}',
      'The `competency` field is present ONLY on kind="competency" claims. `id` is unique per claim.'
    ].join("\n");
    VERIFY_CONTRACT = [
      "You are an ADVERSARIAL verifier. Your job is to DISPROVE claims, not to help.",
      "For each claim you are given the claim text and the RESOLVED source excerpts its",
      "citations point at (the actual values). Keep a claim ONLY if the excerpts",
      "UNEQUIVOCALLY support every assertion in its text \u2014 the excerpts alone, with no",
      "outside knowledge, no inference, no benefit of the doubt. If a claim overstates,",
      "generalizes beyond the excerpt, names anyone, or is not fully entailed by the",
      "excerpts: REJECT it. When in doubt, REJECT (default-to-fail).",
      "",
      "OUTPUT FORMAT \u2014 obey exactly: respond with ONLY the JSON object and NOTHING ELSE.",
      "No preamble, no per-claim commentary, no reasoning prose, no markdown fence, no text",
      "before or after. Decide internally; emit only the verdict:",
      '{"supported":["c1","c3"]} \u2014 the ids of the claims that survive (omit all others; use',
      '{"supported":[]} if none do). Any surviving id MUST be one you were given.'
    ].join("\n");
  }
});

// ../../packages/core/src/short-token.ts
import { createHash as createHash2 } from "crypto";
function opportunityShortToken(id) {
  return createHash2("sha256").update(id, "utf8").digest("base64url").slice(0, 8);
}
function jobShortToken(id) {
  return createHash2("sha256").update(`job:${id}`, "utf8").digest("base64url").slice(0, 8);
}
function jobTokenMap(index) {
  const cached = jobTokenMaps.get(index);
  if (cached) return cached;
  const map = /* @__PURE__ */ new Map();
  for (const job of index.jobs) {
    const token = jobShortToken(job.id);
    map.set(token, map.has(token) ? AMBIGUOUS_JOB_TOKEN : job);
  }
  jobTokenMaps.set(index, map);
  return map;
}
function resolveJobToken(index, token) {
  const hit = jobTokenMap(index).get(token);
  return hit && hit !== AMBIGUOUS_JOB_TOKEN ? hit : null;
}
function _jobTokenMapForTests(index) {
  return jobTokenMap(index);
}
var contributeShortToken, AMBIGUOUS_JOB_TOKEN, jobTokenMaps, _AMBIGUOUS_JOB_TOKEN_FOR_TESTS;
var init_short_token = __esm({
  "../../packages/core/src/short-token.ts"() {
    "use strict";
    contributeShortToken = opportunityShortToken;
    AMBIGUOUS_JOB_TOKEN = /* @__PURE__ */ Symbol("ambiguous-job-token");
    jobTokenMaps = /* @__PURE__ */ new WeakMap();
    _AMBIGUOUS_JOB_TOKEN_FOR_TESTS = AMBIGUOUS_JOB_TOKEN;
  }
});

// ../../packages/core/src/index.ts
var src_exports = {};
__export(src_exports, {
  AI_BAN_DENYLIST: () => AI_BAN_DENYLIST,
  ANON_MAINTAINER_LABEL: () => ANON_MAINTAINER_LABEL,
  ASHBY_SLUGS_BY_TIER: () => ASHBY_SLUGS_BY_TIER,
  CAP_LABELS: () => CAP_LABELS,
  CITE_PREFIX: () => CITE_PREFIX,
  COMPETENCY_GRADES: () => COMPETENCY_GRADES,
  COMPETENCY_NAMES: () => COMPETENCY_NAMES,
  CREDENTIAL_WEIGHTS: () => CREDENTIAL_WEIGHTS,
  CURATION_NORM: () => CURATION_NORM,
  CURATION_WEIGHTS: () => CURATION_WEIGHTS,
  DECAY_FLOOR: () => DECAY_FLOOR,
  DECISION_LABEL: () => DECISION_LABEL,
  DEFAULT_ASHBY_SLUGS: () => DEFAULT_ASHBY_SLUGS,
  DEFAULT_BOUNTY_REPOS: () => DEFAULT_BOUNTY_REPOS,
  DEFAULT_GREENHOUSE_SLUGS: () => DEFAULT_GREENHOUSE_SLUGS,
  DEFAULT_ISSUE_STATUS_TIMEOUT_MS: () => DEFAULT_ISSUE_STATUS_TIMEOUT_MS,
  DEFAULT_LEVER_SLUGS: () => DEFAULT_LEVER_SLUGS,
  DEFAULT_WORKABLE_SLUGS: () => DEFAULT_WORKABLE_SLUGS,
  DENY_CONSENT: () => DENY_CONSENT,
  DISPLAY_DELTA_FLOOR: () => DISPLAY_DELTA_FLOOR,
  EXAMPLE_BUYER: () => EXAMPLE_BUYER,
  FEEDS: () => FEEDS,
  GRAPH: () => GRAPH,
  GREENHOUSE_SLUGS_BY_TIER: () => GREENHOUSE_SLUGS_BY_TIER,
  HYGIENE_PRINCIPLES_S6: () => HYGIENE_PRINCIPLES_S6,
  IDF_BACKGROUND: () => IDF_BACKGROUND,
  INTEREST_CAP: () => INTEREST_CAP,
  INTRO_ACCEPTED_TTL_MS: () => INTRO_ACCEPTED_TTL_MS,
  INTRO_ALLOWED_FIELDS: () => INTRO_ALLOWED_FIELDS,
  INTRO_PENDING_TTL_MS: () => INTRO_PENDING_TTL_MS,
  LANG_LABELS: () => LANG_LABELS,
  LEVER_SLUGS_BY_TIER: () => LEVER_SLUGS_BY_TIER,
  MAX_JOBS_PER_COMPANY: () => MAX_JOBS_PER_COMPANY,
  MENTION_DELTA: () => MENTION_DELTA,
  MERGE_PROBABILITY: () => MERGE_PROBABILITY,
  METRICS: () => METRICS,
  MIN_CONTRIBUTORS: () => MIN_CONTRIBUTORS,
  MIN_STARS: () => MIN_STARS,
  PROBE_TIMEOUT_MS: () => PROBE_TIMEOUT_MS,
  PROVENANCE: () => PROVENANCE,
  RIGOR: () => RIGOR,
  ROLLUP_VERSION: () => ROLLUP_VERSION,
  SKILL_DENSITY_SATURATION: () => SKILL_DENSITY_SATURATION,
  SKILL_FLOOR_ENABLED: () => SKILL_FLOOR_ENABLED,
  SKILL_FLOOR_MIN: () => SKILL_FLOOR_MIN,
  SOURCE_CLASS: () => SOURCE_CLASS,
  STRONG_MATCH_THRESHOLD: () => STRONG_MATCH_THRESHOLD,
  SYNONYMS: () => SYNONYMS,
  SYNTHESIS_MODEL: () => SYNTHESIS_MODEL,
  SYNTHESIS_VERSION: () => SYNTHESIS_VERSION,
  TRIVIAL_PR_TITLE: () => TRIVIAL_PR_TITLE,
  VOCABULARY: () => VOCABULARY,
  VOCAB_NODES: () => VOCAB_NODES,
  WINNABILITY_NORM: () => WINNABILITY_NORM,
  _AMBIGUOUS_JOB_TOKEN_FOR_TESTS: () => _AMBIGUOUS_JOB_TOKEN_FOR_TESTS,
  _jobTokenMapForTests: () => _jobTokenMapForTests,
  acceptanceCountForDomains: () => acceptanceCountForDomains,
  aggregate: () => aggregate,
  aggregateBounties: () => aggregateBounties,
  aggregateContributions: () => aggregateContributions,
  applyVerdict: () => applyVerdict,
  ashby: () => ashby,
  assembleRollup: () => assembleRollup,
  assembleSections: () => assembleSections,
  authorizeIntroDecision: () => authorizeIntroDecision,
  authorizeIntroDeletion: () => authorizeIntroDeletion,
  bestAcceptanceDomain: () => bestAcceptanceDomain,
  buildDirectoryIndex: () => buildDirectoryIndex,
  buildDossierEnvelope: () => buildDossierEnvelope,
  buildGraph: () => buildGraph,
  buildIndex: () => buildIndex,
  buildIntroListItem: () => buildIntroListItem,
  buildIntroPayload: () => buildIntroPayload,
  buildPass1System: () => buildPass1System,
  buildPass1User: () => buildPass1User,
  buildPass2System: () => buildPass2System,
  buildPass2User: () => buildPass2User,
  buildReason: () => buildReason,
  buildRollupSource: () => buildRollupSource,
  capJobsPerCompany: () => capJobsPerCompany,
  citablePaths: () => citablePaths,
  citeSourceClass: () => citeSourceClass,
  citesConverge: () => citesConverge,
  claimFullyResolves: () => claimFullyResolves,
  classifyDecisionEvidence: () => classifyDecisionEvidence,
  classifyReviewSources: () => classifyReviewSources,
  classifyToken: () => classifyToken,
  classifyTokens: () => classifyTokens,
  companyTierForJob: () => companyTierForJob,
  composeIntroAcceptedEmail: () => composeIntroAcceptedEmail,
  composeIntroEmail: () => composeIntroEmail,
  computeAcceptanceCredential: () => computeAcceptanceCredential,
  computeAcceptanceCredentialPublic: () => computeAcceptanceCredentialPublic,
  computeEventIndependence: () => computeEventIndependence,
  computeRepoProvenance: () => computeRepoProvenance,
  computeReviewerIndependence: () => computeReviewerIndependence,
  computeWinnability: () => computeWinnability,
  contributeShortToken: () => contributeShortToken,
  coreTagsFromTitle: () => coreTagsFromTitle,
  credentialValue: () => credentialValue,
  curateProjects: () => curateProjects,
  decorate: () => decorate,
  decryptMessage: () => decryptMessage,
  deriveHygienicMetrics: () => deriveHygienicMetrics,
  deriveLegibleProfile: () => deriveLegibleProfile,
  deriveResumeTrend: () => deriveResumeTrend,
  deriveRigorTiers: () => deriveRigorTiers,
  deriveSharedKey: () => deriveSharedKey,
  deriveTrajectoryNarrative: () => deriveTrajectoryNarrative,
  displayableDrift: () => displayableDrift,
  dropIdentityTokens: () => dropIdentityTokens,
  dropNgramOverlap: () => dropNgramOverlap,
  dropUnresolvableCites: () => dropUnresolvableCites,
  encryptMessage: () => encryptMessage,
  eventCountsAtFullWeight: () => eventCountsAtFullWeight,
  expandWeighted: () => expandWeighted,
  extractJson: () => extractJson,
  extractSkillTags: () => extractSkillTags,
  fetchGitHubProfile: () => fetchGitHubProfile,
  fetchIssueStatus: () => fetchIssueStatus,
  fetchOpenExternalPRs: () => fetchOpenExternalPRs,
  fetchOwnedRepoTraction: () => fetchOwnedRepoTraction,
  fetchPRLifecycle: () => fetchPRLifecycle,
  fetchPRScoringFacts: () => fetchPRScoringFacts,
  fetchRepoRecency: () => fetchRepoRecency,
  fetchRepoReceptivity: () => fetchRepoReceptivity,
  fetchTrendingSlugs: () => fetchTrendingSlugs,
  flattenTiers: () => flattenTiers,
  funnelCounts: () => funnelCounts,
  generateIdentityKeypair: () => generateIdentityKeypair,
  getAdjacentTags: () => getAdjacentTags,
  getBuyer: () => getBuyer,
  githubBounties: () => githubBounties,
  githubToFingerprint: () => githubToFingerprint,
  greenhouse: () => greenhouse,
  himalayas: () => himalayas,
  hn: () => hn,
  introActorRole: () => introActorRole,
  introRateLimitCheck: () => introRateLimitCheck,
  introRetentionAction: () => introRetentionAction,
  isAiBanRepo: () => isAiBanRepo,
  isBounty: () => isBounty,
  isCompetencyGrade: () => isCompetencyGrade,
  isCompetencyName: () => isCompetencyName,
  isContribution: () => isContribution,
  isExcludedRepo: () => isExcludedRepo,
  isOverIntroLimit: () => isOverIntroLimit,
  isTrivialPRTitle: () => isTrivialPRTitle,
  isWinnableIssue: () => isWinnableIssue,
  issueCrossRefPRAttempts: () => issueCrossRefPRAttempts,
  jobShortToken: () => jobShortToken,
  joinLabels: () => joinLabels,
  knownCount: () => knownCount,
  labelFor: () => labelFor,
  lever: () => lever,
  loadPartnerRoles: () => loadPartnerRoles,
  looksLikeContentFarmTitle: () => looksLikeContentFarmTitle,
  looksLikeEngRole: () => looksLikeEngRole,
  makeDefaultGovernorConfig: () => makeDefaultGovernorConfig,
  makeGitHubGovernor: () => makeGitHubGovernor,
  makeScoringGovernor: () => makeScoringGovernor,
  match: () => match,
  mergeProbability: () => mergeProbability,
  mmrRerank: () => mmrRerank,
  normalize: () => normalize,
  openPRClosingRefs: () => openPRClosingRefs,
  opire: () => opire,
  opportunityShortToken: () => opportunityShortToken,
  pageMatches: () => pageMatches,
  parseGitHubRef: () => parseGitHubRef,
  parsePass1: () => parsePass1,
  parseVerdict: () => parseVerdict,
  passesContributionGate: () => passesContributionGate,
  passesMaturityGate: () => passesMaturityGate,
  personCardToJob: () => personCardToJob,
  projectCardToJob: () => projectCardToJob,
  projectForSynthesis: () => projectForSynthesis,
  readBuildBudgetMs: () => readBuildBudgetMs,
  readReqGapMs: () => readReqGapMs,
  realSleep: () => realSleep,
  recordClick: () => recordClick,
  redactThirdParty: () => redactThirdParty,
  rejectExtraIntroFields: () => rejectExtraIntroFields,
  relevanceScore: () => relevanceScore,
  renderMaintainerQuote: () => renderMaintainerQuote,
  resolveCitation: () => resolveCitation,
  resolveCitations: () => resolveCitations,
  resolveJobToken: () => resolveJobToken,
  revealIntroContacts: () => revealIntroContacts,
  rosterActiveFromContribution: () => rosterActiveFromContribution,
  safetyNumber: () => safetyNumber,
  sameLogin: () => sameLogin,
  setStatus: () => setStatus,
  signalLabel: () => signalLabel,
  tagDissimilarity: () => tagDissimilarity,
  textContainsLogin: () => textContainsLogin,
  tokenize: () => tokenize,
  validateGraph: () => validateGraph,
  validateIntroPayload: () => validateIntroPayload,
  validateTargetContact: () => validateTargetContact,
  verifyClaimCredit: () => verifyClaimCredit,
  workable: () => workable,
  wwr: () => wwr
});
var init_src = __esm({
  "../../packages/core/src/index.ts"() {
    "use strict";
    init_types();
    init_vocabulary();
    init_matcher();
    init_rerank();
    init_feeds();
    init_indexer();
    init_winnability();
    init_partners();
    init_github();
    init_gh_governor();
    init_github_issue_status();
    init_credit();
    init_intro();
    init_directoryThreshold();
    init_chatCrypto();
    init_job_status();
    init_legible();
    init_legible_trajectory();
    init_rigor();
    init_sources();
    init_independence();
    init_redaction();
    init_decisions();
    init_metrics_hygiene();
    init_dossier();
    init_synthesis();
    init_short_token();
  }
});

// src/state-dir.ts
import { closeSync, constants, fchmodSync, fstatSync, mkdirSync, openSync } from "fs";
function warnStateDirOnce(dir, message) {
  if (warnedDirs.has(dir)) return;
  warnedDirs.add(dir);
  try {
    process.stderr.write(message);
  } catch {
  }
}
function ensureStateDir(dir) {
  mkdirSync(dir, { recursive: true, mode: STATE_DIR_MODE });
  const noFollow = constants.O_NOFOLLOW ?? 0;
  let fd;
  try {
    fd = openSync(dir, constants.O_RDONLY | noFollow);
  } catch (err) {
    if (err?.code === "ELOOP") {
      warnStateDirOnce(
        dir,
        `terminalhire: ${dir} is a symlink \u2014 leaving its permissions alone; the 0700 guarantee on the state directory is NOT enforced.
`
      );
      return STATE_DIR_SYMLINK;
    }
    return STATE_DIR_UNVERIFIED;
  }
  try {
    const currentMode = fstatSync(fd).mode & 511;
    if ((currentMode & ~STATE_DIR_MODE) !== 0) {
      fchmodSync(fd, currentMode & STATE_DIR_MODE);
    }
    return STATE_DIR_OK;
  } catch {
    return STATE_DIR_UNVERIFIED;
  } finally {
    try {
      closeSync(fd);
    } catch {
    }
  }
}
var STATE_DIR_MODE, STATE_DIR_OK, STATE_DIR_SYMLINK, STATE_DIR_UNVERIFIED, warnedDirs;
var init_state_dir = __esm({
  "src/state-dir.ts"() {
    "use strict";
    STATE_DIR_MODE = 448;
    STATE_DIR_OK = "ok";
    STATE_DIR_SYMLINK = "symlink";
    STATE_DIR_UNVERIFIED = "unverified";
    warnedDirs = /* @__PURE__ */ new Set();
  }
});

// src/claims.ts
var claims_exports = {};
__export(claims_exports, {
  PUSHED_CLAIM_FIELDS: () => PUSHED_CLAIM_FIELDS,
  acceptedPRRate: () => acceptedPRRate,
  findClaim: () => findClaim,
  listClaims: () => listClaims,
  nextPolledState: () => nextPolledState,
  readClaims: () => readClaims,
  recordClaim: () => recordClaim,
  removeClaim: () => removeClaim,
  toPushedClaim: () => toPushedClaim,
  updateClaim: () => updateClaim
});
import {
  readFileSync as readFileSync3,
  writeFileSync as writeFileSync2,
  mkdirSync as mkdirSync2,
  renameSync,
  existsSync,
  rmSync,
  statSync
} from "fs";
import { randomBytes as randomBytes3 } from "crypto";
import { join as join3 } from "path";
import { homedir as homedir2 } from "os";
function sleepSync(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}
function withClaimsLock(fn) {
  ensureStateDir(TERMINALHIRE_DIR2);
  const deadline = Date.now() + LOCK_TIMEOUT_MS;
  for (; ; ) {
    try {
      mkdirSync2(LOCK_DIR, { mode: 448 });
      break;
    } catch {
      try {
        if (Date.now() - statSync(LOCK_DIR).mtimeMs > LOCK_STALE_MS) {
          rmSync(LOCK_DIR, { recursive: true, force: true });
          continue;
        }
      } catch {
      }
      if (Date.now() > deadline) {
        throw new Error(
          `claims store is locked (another terminalhire process?) \u2014 remove ${LOCK_DIR} if no other process is running`
        );
      }
      sleepSync(LOCK_RETRY_MS);
    }
  }
  try {
    return fn();
  } finally {
    rmSync(LOCK_DIR, { recursive: true, force: true });
  }
}
function toPushedClaim(claim) {
  return {
    kind: claim.kind,
    repoFullName: claim.repoFullName,
    state: claim.state,
    prUrl: claim.prUrl,
    merged: claim.state === "merged",
    claimedAt: claim.claimedAt,
    updatedAt: claim.updatedAt
  };
}
function nextPolledState(from, observed) {
  return POLL_TRANSITIONS[observed].has(from) ? observed : from;
}
function nowISO() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function normalizeClaim(c) {
  return { ...c, kind: c.kind ?? "bounty", policy: c.policy ?? null };
}
function readClaims() {
  try {
    if (!existsSync(CLAIMS_FILE)) return [];
    const data = JSON.parse(readFileSync3(CLAIMS_FILE, "utf8"));
    const claims = Array.isArray(data?.claims) ? data.claims : [];
    return claims.map(normalizeClaim);
  } catch {
    return [];
  }
}
function writeClaims(claims) {
  ensureStateDir(TERMINALHIRE_DIR2);
  const tmp = `${CLAIMS_FILE}.${process.pid}.${randomBytes3(6).toString("hex")}.tmp`;
  const payload = { claims };
  try {
    writeFileSync2(tmp, JSON.stringify(payload, null, 2), {
      encoding: "utf8",
      mode: 384,
      flag: "wx"
    });
    renameSync(tmp, CLAIMS_FILE);
  } catch (err) {
    try {
      rmSync(tmp, { force: true });
    } catch {
    }
    throw err;
  }
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
  return withClaimsLock(() => {
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
  });
}
function updateClaim(id, patch) {
  return withClaimsLock(() => {
    const claims = readClaims();
    const idx = claims.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    claims[idx] = { ...claims[idx], ...patch, updatedAt: nowISO() };
    writeClaims(claims);
    return claims[idx];
  });
}
function removeClaim(id) {
  return withClaimsLock(() => {
    const claims = readClaims();
    const next = claims.filter((c) => c.id !== id);
    if (next.length === claims.length) return false;
    writeClaims(next);
    return true;
  });
}
function acceptedPRRate(claims = readClaims()) {
  const total = claims.length;
  const merged = claims.filter((c) => c.state === "merged").length;
  return { merged, total, rate: total === 0 ? 0 : merged / total };
}
var TERMINALHIRE_DIR2, CLAIMS_FILE, LOCK_DIR, LOCK_STALE_MS, LOCK_RETRY_MS, LOCK_TIMEOUT_MS, PUSHED_CLAIM_FIELDS, TERMINAL_STATES, POLL_TRANSITIONS;
var init_claims = __esm({
  "src/claims.ts"() {
    "use strict";
    init_state_dir();
    TERMINALHIRE_DIR2 = process.env.TERMINALHIRE_DIR || join3(homedir2(), ".terminalhire");
    CLAIMS_FILE = join3(TERMINALHIRE_DIR2, "claims.json");
    LOCK_DIR = `${CLAIMS_FILE}.lock`;
    LOCK_STALE_MS = Number(process.env.TERMINALHIRE_LOCK_STALE_MS) || 1e4;
    LOCK_RETRY_MS = Number(process.env.TERMINALHIRE_LOCK_RETRY_MS) || 25;
    LOCK_TIMEOUT_MS = Number(process.env.TERMINALHIRE_LOCK_TIMEOUT_MS) || 5e3;
    PUSHED_CLAIM_FIELDS = [
      "kind",
      "repoFullName",
      "state",
      "prUrl",
      "merged",
      "claimedAt",
      "updatedAt"
    ];
    TERMINAL_STATES = /* @__PURE__ */ new Set(["merged", "abandoned"]);
    POLL_TRANSITIONS = {
      merged: /* @__PURE__ */ new Set([
        "claimed",
        "working",
        "in-review",
        "ready",
        "submitted",
        "abandoned"
      ]),
      abandoned: /* @__PURE__ */ new Set([
        "claimed",
        "working",
        "in-review",
        "ready",
        "submitted",
        "merged"
      ]),
      submitted: /* @__PURE__ */ new Set(["claimed", "working", "in-review", "ready"])
    };
  }
});

// src/repo-policy.ts
var repo_policy_exports = {};
__export(repo_policy_exports, {
  POLICY_RULESET_VERSION: () => POLICY_RULESET_VERSION,
  auditContent: () => auditContent,
  checkRepoPolicy: () => checkRepoPolicy
});
import { createHash as createHash4 } from "crypto";
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
  const h = createHash4("sha256");
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
var GH_API, GH_HEADERS, MAX_REQUESTS, POLICY_RULESET_VERSION, AI_SIGNAL_PATTERNS, AI_TERM, PROHIBITED_PATTERNS, DISCLOSURE_PATTERNS, REQUIREMENT_PATTERNS, CANDIDATE_GROUPS, VERDICT_SEVERITY;
var init_repo_policy = __esm({
  "src/repo-policy.ts"() {
    "use strict";
    GH_API = "https://api.github.com";
    GH_HEADERS = { "User-Agent": "terminalhire-claim", Accept: "application/vnd.github+json" };
    MAX_REQUESTS = 7;
    POLICY_RULESET_VERSION = 2;
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
    AI_TERM = "(?:ai|llms?|generative(?:\\s+ai)?|artificial intelligence|language models?|copilot|chatgpt|claude|machine[\\s-]generated)";
    PROHIBITED_PATTERNS = [
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
    DISCLOSURE_PATTERNS = [
      new RegExp(`disclos\\w+[^.\\n]{0,60}\\b${AI_TERM}`, "i"),
      new RegExp(`\\b${AI_TERM}[^.\\n]{0,60}disclos`, "i"),
      new RegExp(`\\b${AI_TERM}[\\s-]assist\\w*[^.\\n]{0,60}\\b(?:must|should|required?)\\b`, "i"),
      // PR-template checkbox, e.g. "- [ ] I used AI tools and have reviewed the output"
      new RegExp(`\\[ \\][^\\n]{0,80}\\b${AI_TERM}`, "i")
    ];
    REQUIREMENT_PATTERNS = [
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
    CANDIDATE_GROUPS = [
      ["CONTRIBUTING.md", ".github/CONTRIBUTING.md", "docs/CONTRIBUTING.md"],
      ["AGENTS.md", "AGENTS.MD"],
      [".github/PULL_REQUEST_TEMPLATE.md", "PULL_REQUEST_TEMPLATE.md"]
    ];
    VERDICT_SEVERITY = {
      "ai-mentioned": 1,
      "disclosure-required": 2,
      prohibited: 3
    };
  }
});

// src/crypto-store.ts
import { createCipheriv as createCipheriv2, createDecipheriv as createDecipheriv2, randomBytes as randomBytes5 } from "crypto";
import { readFileSync as readFileSync6, writeFileSync as writeFileSync5, existsSync as existsSync4, renameSync as renameSync3, rmSync as rmSync4 } from "fs";
import { join as join6, dirname, basename } from "path";
import { homedir as homedir5 } from "os";
import { createRequire } from "module";
function encrypt2(plaintext, key) {
  const iv = randomBytes5(IV_BYTES2);
  const cipher = createCipheriv2(ALGO2, key, iv);
  const ct = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    iv: iv.toString("hex"),
    tag: tag.toString("hex"),
    ciphertext: ct.toString("hex")
  };
}
function decrypt2(blob, key) {
  const decipher = createDecipheriv2(ALGO2, key, Buffer.from(blob.iv, "hex"));
  decipher.setAuthTag(Buffer.from(blob.tag, "hex"));
  const plain = Buffer.concat([
    decipher.update(Buffer.from(blob.ciphertext, "hex")),
    decipher.final()
  ]);
  return plain.toString("utf8");
}
function skipKeychain() {
  return process.env.TERMINALHIRE_NO_KEYCHAIN !== void 0 || process.env.CI !== void 0 || process.env.VITEST !== void 0 || process.env.NODE_ENV === "test";
}
async function tryLoadFromKeytar() {
  if (forceKeytarUnavailableForTests || skipKeychain()) return null;
  try {
    const kt = createRequire(import.meta.url)("keytar");
    const stored = await kt.getPassword(KEYTAR_SERVICE, KEYTAR_ACCOUNT);
    if (stored) {
      return Buffer.from(stored, "hex");
    }
    const key = randomBytes5(KEY_BYTES2);
    await kt.setPassword(KEYTAR_SERVICE, KEYTAR_ACCOUNT, key.toString("hex"));
    return key;
  } catch {
    return null;
  }
}
function loadOrCreateFileKey() {
  ensureStateDir(TERMINALHIRE_DIR5);
  if (existsSync4(KEY_FILE2)) {
    return Buffer.from(readFileSync6(KEY_FILE2, "utf8").trim(), "hex");
  }
  const key = randomBytes5(KEY_BYTES2);
  writeFileSync5(KEY_FILE2, key.toString("hex"), { mode: 384, encoding: "utf8" });
  return key;
}
function warnStderr(message) {
  process.stderr.write(`${message}
`);
}
function atomicWriteFileSync(filePath, content) {
  const dir = dirname(filePath);
  ensureStateDir(dir);
  const tmp = join6(
    dir,
    `.${basename(filePath)}.tmp-${process.pid}-${randomBytes5(6).toString("hex")}`
  );
  writeFileSync5(tmp, content, { encoding: "utf8", mode: 384 });
  renameSync3(tmp, filePath);
}
async function deleteKey() {
  for (const filePath of dependentStoreFiles) {
    try {
      rmSync4(filePath);
    } catch {
    }
  }
  if (!forceKeytarUnavailableForTests && !skipKeychain()) {
    try {
      const kt = createRequire(import.meta.url)("keytar");
      await kt.deletePassword(KEYTAR_SERVICE, KEYTAR_ACCOUNT);
    } catch {
    }
  }
  try {
    rmSync4(KEY_FILE2);
  } catch {
  }
}
async function resolveKey(filePath, opts) {
  if (opts.keyPolicy === "keychain-required") {
    const key = await tryLoadFromKeytar();
    if (!key) {
      warnStderr(
        `crypto-store: OS keychain unavailable \u2014 store at ${filePath} is disabled (no plaintext key file will be written)`
      );
      return null;
    }
    return key;
  }
  return loadOrCreateFileKey();
}
function createEncryptedStore(filePath, opts) {
  dependentStoreFiles.add(filePath);
  async function read() {
    const key = await resolveKey(filePath, opts);
    if (!key) return opts.blank();
    if (!existsSync4(filePath)) return opts.blank();
    try {
      const raw = readFileSync6(filePath, "utf8");
      const blob = JSON.parse(raw);
      const plaintext = decrypt2(blob, key);
      return JSON.parse(plaintext);
    } catch {
      warnStderr(`crypto-store: failed to decrypt ${filePath} \u2014 returning blank`);
      return opts.blank();
    }
  }
  async function write(value) {
    const key = await resolveKey(filePath, opts);
    if (!key) return;
    const blob = encrypt2(JSON.stringify(value), key);
    atomicWriteFileSync(filePath, JSON.stringify(blob, null, 2));
  }
  return { read, write };
}
var TERMINALHIRE_DIR5, KEY_FILE2, KEYTAR_SERVICE, KEYTAR_ACCOUNT, ALGO2, KEY_BYTES2, IV_BYTES2, forceKeytarUnavailableForTests, dependentStoreFiles;
var init_crypto_store = __esm({
  "src/crypto-store.ts"() {
    "use strict";
    init_state_dir();
    TERMINALHIRE_DIR5 = process.env.TERMINALHIRE_DIR || join6(homedir5(), ".terminalhire");
    KEY_FILE2 = join6(TERMINALHIRE_DIR5, "key");
    KEYTAR_SERVICE = "terminalhire";
    KEYTAR_ACCOUNT = "profile-key";
    ALGO2 = "aes-256-gcm";
    KEY_BYTES2 = 32;
    IV_BYTES2 = 12;
    forceKeytarUnavailableForTests = false;
    dependentStoreFiles = /* @__PURE__ */ new Set();
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
  recencyDecay: () => recencyDecay,
  removeSavedJob: () => removeSavedJob,
  writeProfile: () => writeProfile
});
import { join as join7 } from "path";
import { homedir as homedir6 } from "os";
function blankProfile() {
  return {
    version: 3,
    skillTags: [],
    tagWeights: {},
    hasEmployerSessions: false,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
}
function recencyDecay(lastSeen, halfLifeDays = 30, now = Date.now()) {
  const ageMs = now - new Date(lastSeen).getTime();
  const halfLifeMs = halfLifeDays * 24 * 60 * 60 * 1e3;
  return Math.pow(0.5, ageMs / halfLifeMs);
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
  const parsed = await profileStore.read();
  migrateTagWeights(parsed);
  return parsed;
}
async function writeProfile(profile) {
  profile.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
  profile.skillTags = deriveSkillTags(profile.tagWeights);
  await profileStore.write(profile);
}
function accumulateSession(profile, tags, isEmployerContext, inferredSeniority, seniorityIsAuthoritative = false) {
  const now = (/* @__PURE__ */ new Date()).toISOString();
  let filtered = normalize(tags);
  if (isEmployerContext) {
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
  if (inferredSeniority && !isEmployerContext) {
    if (seniorityIsAuthoritative || !profile.github) {
      profile.seniority = inferredSeniority;
    }
  }
}
async function accumulateTags(rawTokens, isEmployerContext, inferredSeniority) {
  const profile = await readProfile();
  accumulateSession(profile, rawTokens, isEmployerContext, inferredSeniority);
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
  await deleteKey();
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
var TERMINALHIRE_DIR6, PROFILE_FILE, profileStore, LANGUAGE_TAGS, MIN_FINGERPRINT_SCORE;
var init_profile = __esm({
  "src/profile.ts"() {
    "use strict";
    init_src();
    init_crypto_store();
    TERMINALHIRE_DIR6 = process.env.TERMINALHIRE_DIR || join7(homedir6(), ".terminalhire");
    PROFILE_FILE = join7(TERMINALHIRE_DIR6, "profile.enc");
    profileStore = createEncryptedStore(PROFILE_FILE, {
      blank: blankProfile,
      keyPolicy: "keytar-first-file-fallback"
    });
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

// src/repo-experience.ts
var repo_experience_exports = {};
__export(repo_experience_exports, {
  __setStoreForTests: () => __setStoreForTests,
  addNote: () => addNote,
  briefingLines: () => briefingLines,
  calibrationSummary: () => calibrationSummary,
  continuity: () => continuity,
  continuityForRepo: () => continuityForRepo,
  getRepoEntry: () => getRepoEntry,
  projectOutcomes: () => projectOutcomes,
  readRepoExperience: () => readRepoExperience,
  recordAuditSample: () => recordAuditSample,
  recordBackfill: () => recordBackfill,
  recordPolicySnapshot: () => recordPolicySnapshot,
  writeTombstone: () => writeTombstone
});
import { join as join8 } from "path";
import { homedir as homedir7 } from "os";
function blankFile() {
  return { version: 1, repos: {} };
}
function __setStoreForTests(testStore) {
  activeStore = testStore ?? store;
}
function nowISO2() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function blankEntry() {
  return {
    updatedAt: nowISO2(),
    policyCache: null,
    cultureSamples: [],
    tombstones: [],
    backfill: [],
    notes: []
  };
}
function evictLRU(file) {
  const keys = Object.keys(file.repos);
  if (keys.length <= MAX_REPOS) return;
  const sorted = [...keys].sort((a, b) => file.repos[a].updatedAt.localeCompare(file.repos[b].updatedAt));
  for (const key of sorted.slice(0, keys.length - MAX_REPOS)) {
    delete file.repos[key];
  }
}
async function withEntry(repoFullName, mutate) {
  const file = await activeStore.read();
  const entry = file.repos[repoFullName] ?? blankEntry();
  mutate(entry);
  entry.updatedAt = nowISO2();
  file.repos[repoFullName] = entry;
  evictLRU(file);
  await activeStore.write(file);
}
async function readRepoExperience() {
  return activeStore.read();
}
async function getRepoEntry(repoFullName) {
  const file = await activeStore.read();
  return file.repos[repoFullName] ?? null;
}
async function recordPolicySnapshot(repoFullName, policy) {
  await withEntry(repoFullName, (entry) => {
    entry.policyCache = {
      verdict: policy.verdict,
      assignment: policy.assignment,
      requirements: policy.requirements.map((r) => r.kind),
      rulesetVersion: policy.rulesetVersion,
      checkedAt: nowISO2()
    };
  });
}
async function recordAuditSample(repoFullName, signals, completeness) {
  await withEntry(repoFullName, (entry) => {
    entry.cultureSamples.push({
      hoursToFirstResponse: signals.hoursToFirstResponse,
      iterationsAfterFirstResponse: signals.iterationsAfterFirstResponse,
      hoursToMerge: signals.hoursToMerge,
      completeness,
      sampledAt: nowISO2()
    });
    if (entry.cultureSamples.length > MAX_CULTURE_SAMPLES) {
      entry.cultureSamples.splice(0, entry.cultureSamples.length - MAX_CULTURE_SAMPLES);
    }
  });
}
async function addNote(repoFullName, text, source = "manual") {
  await withEntry(repoFullName, (entry) => {
    entry.notes.push({ text, source, addedAt: nowISO2() });
    if (entry.notes.length > MAX_NOTES) {
      entry.notes.splice(0, entry.notes.length - MAX_NOTES);
    }
  });
}
async function writeTombstone(repoFullName, claimId, outcome) {
  await withEntry(repoFullName, (entry) => {
    if (entry.tombstones.some((t) => t.claimId === claimId)) return;
    entry.tombstones.push({ claimId, outcome, resolvedAt: nowISO2() });
  });
}
async function recordBackfill(repoFullName, entries) {
  await withEntry(repoFullName, (entry) => {
    const known = new Set(entry.backfill.map((b) => b.prNumber));
    for (const e of entries) {
      if (known.has(e.prNumber)) continue;
      known.add(e.prNumber);
      entry.backfill.push({ prNumber: e.prNumber, mergedAt: e.mergedAt });
    }
    if (entry.backfill.length > MAX_BACKFILL) {
      entry.backfill.sort((a, b) => a.mergedAt.localeCompare(b.mergedAt));
      entry.backfill.splice(0, entry.backfill.length - MAX_BACKFILL);
    }
  });
}
function prNumberFromUrl(prUrl) {
  if (!prUrl) return null;
  const m = /\/pull\/(\d+)/.exec(prUrl);
  return m ? Number(m[1]) : null;
}
function projectOutcomes(claims, tombstones, repo, backfill = []) {
  const events = [];
  const seenPrNumbers = /* @__PURE__ */ new Set();
  for (const c of claims) {
    if (c.repoFullName !== repo || c.state !== "merged") continue;
    const prNumber = prNumberFromUrl(c.prUrl);
    if (prNumber !== null) seenPrNumbers.add(prNumber);
    events.push({ prNumber, mergedAt: c.updatedAt, source: "claim" });
  }
  for (const t of tombstones) {
    if (t.outcome !== "merged") continue;
    events.push({ prNumber: null, mergedAt: t.resolvedAt, source: "tombstone" });
  }
  for (const b of backfill) {
    if (seenPrNumbers.has(b.prNumber)) continue;
    seenPrNumbers.add(b.prNumber);
    events.push({ prNumber: b.prNumber, mergedAt: b.mergedAt, source: "backfill" });
  }
  events.sort((a, b) => a.mergedAt.localeCompare(b.mergedAt));
  const lastMergedAt = events.length > 0 ? events[events.length - 1].mergedAt : null;
  return { mergedCount: events.length, lastMergedAt, events };
}
function continuity(projection, now = Date.now()) {
  if (!projection.lastMergedAt) {
    return { score: 0, reasons: ["no merges recorded here yet"] };
  }
  const countFactor = Math.min(projection.mergedCount, 4) / 4;
  const decay = recencyDecay(projection.lastMergedAt, 90, now);
  const score = countFactor * decay;
  const mergeWord = projection.mergedCount === 1 ? "merge" : "merges";
  return {
    score,
    reasons: [`${projection.mergedCount} ${mergeWord} recorded here`, `most recent merge ${projection.lastMergedAt}`]
  };
}
async function continuityForRepo(repoFullName, claims) {
  try {
    const entry = await getRepoEntry(repoFullName);
    const projection = projectOutcomes(claims, entry?.tombstones ?? [], repoFullName, entry?.backfill ?? []);
    const result = continuity(projection);
    return { score: result.score, mergedCount: projection.mergedCount };
  } catch {
    return { score: 0, mergedCount: 0 };
  }
}
function calibrationSummary(claims, repo) {
  const resolved = claims.filter(
    (c) => c.repoFullName === repo && (c.state === "merged" || c.state === "abandoned") && c.review?.acceptanceScore != null
  );
  const n = resolved.length;
  if (n < 5) return { available: false, n, text: null };
  const meanForecast = resolved.reduce((sum, c) => sum + c.review.acceptanceScore, 0) / n;
  const mergedCount = resolved.filter((c) => c.state === "merged").length;
  const mergeRate = mergedCount / n;
  const delta = Math.round((meanForecast - mergeRate) * 10) / 10;
  let direction;
  if (delta > 0) direction = `~${delta} optimistic`;
  else if (delta < 0) direction = `~${Math.abs(delta)} pessimistic`;
  else direction = "well-calibrated";
  return {
    available: true,
    n,
    meanForecast,
    mergeRate,
    delta,
    text: `forecasts here ran ${direction} (n=${n})`
  };
}
function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}
function briefingLines(params) {
  const { repoFullName, entry, claims } = params;
  const projection = projectOutcomes(claims, entry?.tombstones ?? [], repoFullName, entry?.backfill ?? []);
  const lines = [];
  if (projection.mergedCount > 0) {
    const months = projection.events.map(
      (e) => new Date(e.mergedAt).toLocaleString("en-US", { month: "short" })
    );
    lines.push(`You: ${projection.mergedCount} merged here (${months.join(", ")})`);
  }
  const samplesWithResponse = (entry?.cultureSamples ?? []).filter(
    (s) => s.completeness.comments && s.hoursToFirstResponse != null
  );
  if (samplesWithResponse.length > 0) {
    const hours = Math.round(median(samplesWithResponse.map((s) => s.hoursToFirstResponse)));
    lines.push(`maintainer 1st response ~${hours}h`);
  }
  if (entry?.policyCache) {
    lines.push(`policy: ${entry.policyCache.verdict}`);
  }
  const latestNote = entry?.notes[entry.notes.length - 1];
  if (latestNote) {
    lines.push(`note: ${latestNote.text}`);
  }
  return lines;
}
var TERMINALHIRE_DIR7, REPO_EXPERIENCE_FILE, MAX_REPOS, MAX_CULTURE_SAMPLES, MAX_NOTES, MAX_BACKFILL, store, activeStore;
var init_repo_experience = __esm({
  "src/repo-experience.ts"() {
    "use strict";
    init_crypto_store();
    init_profile();
    TERMINALHIRE_DIR7 = process.env.TERMINALHIRE_DIR || join8(homedir7(), ".terminalhire");
    REPO_EXPERIENCE_FILE = join8(TERMINALHIRE_DIR7, "repo-experience.enc");
    MAX_REPOS = 100;
    MAX_CULTURE_SAMPLES = 12;
    MAX_NOTES = 10;
    MAX_BACKFILL = 50;
    store = createEncryptedStore(REPO_EXPERIENCE_FILE, {
      blank: blankFile,
      keyPolicy: "keychain-required"
    });
    activeStore = store;
  }
});

// bin/job-status-store.js
var job_status_store_exports = {};
__export(job_status_store_exports, {
  markClicked: () => markClicked,
  markStatus: () => markStatus,
  readStatusMap: () => readStatusMap,
  statusFilePath: () => statusFilePath
});
import {
  readFileSync as readFileSync7,
  writeFileSync as writeFileSync6,
  renameSync as renameSync4,
  existsSync as existsSync5,
  copyFileSync,
  openSync as openSync2,
  closeSync as closeSync2,
  unlinkSync
} from "fs";
import { join as join9, dirname as dirname2 } from "path";
import { homedir as homedir8 } from "os";
function statusFilePath() {
  return STATUS_FILE;
}
function atomicWriteJson(path, obj) {
  ensureStateDir(dirname2(path));
  const tmp = `${path}.tmp-${process.pid}`;
  writeFileSync6(tmp, JSON.stringify(obj, null, 2) + "\n", "utf8");
  renameSync4(tmp, path);
}
function sleepMs(ms) {
  try {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
  } catch {
    const end = Date.now() + ms;
    while (Date.now() < end) {
    }
  }
}
function withLock(fn) {
  const deadline = Date.now() + 2e3;
  for (; ; ) {
    let fd;
    try {
      ensureStateDir(dirname2(LOCK_FILE));
      fd = openSync2(LOCK_FILE, "wx");
    } catch (err) {
      if (err && err.code === "EEXIST") {
        if (Date.now() > deadline) {
          try {
            unlinkSync(LOCK_FILE);
          } catch {
          }
          continue;
        }
        sleepMs(5);
        continue;
      }
      throw err;
    }
    try {
      return fn();
    } finally {
      try {
        closeSync2(fd);
      } catch {
      }
      try {
        unlinkSync(LOCK_FILE);
      } catch {
      }
    }
  }
}
function readStatusMap() {
  if (!existsSync5(STATUS_FILE)) return {};
  let raw;
  try {
    raw = readFileSync7(STATUS_FILE, "utf8");
  } catch {
    return {};
  }
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed;
    throw new Error("status store is not an object");
  } catch {
    try {
      copyFileSync(STATUS_FILE, BAK_FILE);
    } catch {
    }
    return {};
  }
}
function markStatus(id, status) {
  return withLock(() => {
    const current = readStatusMap();
    const next = status === "claimed" ? {
      ...current,
      [id]: { ...current[id], status: "claimed", markedAt: (/* @__PURE__ */ new Date()).toISOString() }
    } : setStatus(current, id, status);
    atomicWriteJson(STATUS_FILE, next);
    return next[id];
  });
}
function markClicked(id) {
  return withLock(() => {
    const current = readStatusMap();
    const next = recordClick(current, id);
    atomicWriteJson(STATUS_FILE, next);
    return next[id];
  });
}
var TERMINALHIRE_DIR8, STATUS_FILE, LOCK_FILE, BAK_FILE;
var init_job_status_store = __esm({
  "bin/job-status-store.js"() {
    "use strict";
    init_src();
    init_state_dir();
    TERMINALHIRE_DIR8 = process.env.TERMINALHIRE_DIR || join9(homedir8(), ".terminalhire");
    STATUS_FILE = join9(TERMINALHIRE_DIR8, "job-status.json");
    LOCK_FILE = `${STATUS_FILE}.lock`;
    BAK_FILE = `${STATUS_FILE}.bak`;
  }
});

// src/acceptance-score.ts
var acceptance_score_exports = {};
__export(acceptance_score_exports, {
  scoreDiffAcceptance: () => scoreDiffAcceptance
});
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
  return { score: Math.round(clamp013(score) * 100) / 100, reasons };
}
var clamp013;
var init_acceptance_score = __esm({
  "src/acceptance-score.ts"() {
    "use strict";
    clamp013 = (n) => Math.max(0, Math.min(1, n));
  }
});

// src/reputation/identity.ts
var identity_exports = {};
__export(identity_exports, {
  resolveCallerIdentity: () => resolveCallerIdentity
});
import { execFile } from "child_process";
import { promisify } from "util";
async function resolveCallerIdentity() {
  try {
    const { stdout } = await execFileAsync("gh", ["api", "user"], { timeout: 1e4 });
    const u = JSON.parse(stdout);
    if (typeof u.id === "number" && typeof u.login === "string" && u.login.length > 0) {
      return { id: u.id, login: u.login };
    }
    return null;
  } catch {
    return null;
  }
}
var execFileAsync;
var init_identity = __esm({
  "src/reputation/identity.ts"() {
    "use strict";
    execFileAsync = promisify(execFile);
  }
});

// src/reputation/fetch.ts
var fetch_exports = {};
__export(fetch_exports, {
  gatherAudit: () => gatherAudit
});
async function gatherAudit(prUrl, token) {
  const signal = AbortSignal.timeout(2e4);
  const governor = makeScoringGovernor();
  const [lifecycle, facts] = await Promise.all([
    fetchPRLifecycle(prUrl, token, signal, governor),
    fetchPRScoringFacts(prUrl, token, signal, governor)
  ]);
  return { lifecycle, facts };
}
var init_fetch = __esm({
  "src/reputation/fetch.ts"() {
    "use strict";
    init_src();
  }
});

// src/reputation/audit.ts
var audit_exports = {};
__export(audit_exports, {
  buildAuditView: () => buildAuditView
});
function roleOf(e) {
  if (e.is_bot) return "bot";
  if (e.is_author) return "you";
  const a = String(e.actor_assoc || "").toUpperCase();
  if (MAINTAINER_ASSOC.has(a)) return "maintainer";
  if (a === "CONTRIBUTOR") return "contributor";
  if (a === "NONE") return "outside";
  return "unknown";
}
function isMaintainerResponse(e) {
  return !e.is_author && !e.is_bot && MAINTAINER_ASSOC.has(String(e.actor_assoc || "").toUpperCase());
}
function byTime(a, b) {
  if (a.occurred_at < b.occurred_at) return -1;
  if (a.occurred_at > b.occurred_at) return 1;
  if (a.source_id < b.source_id) return -1;
  if (a.source_id > b.source_id) return 1;
  return 0;
}
function hoursBetween2(a, b) {
  if (!a || !b) return null;
  const ta = Date.parse(a);
  const tb = Date.parse(b);
  if (Number.isNaN(ta) || Number.isNaN(tb)) return null;
  return Math.round((tb - ta) / 36e5 * 10) / 10;
}
function buildAuditView(lifecycle, facts) {
  const events = [...lifecycle.events].sort(byTime);
  const counterpartyIds = /* @__PURE__ */ new Set();
  for (const e of events) {
    if (!e.is_author && !e.is_bot && e.actor_id !== 0) counterpartyIds.add(e.actor_id);
  }
  const firstResponse = events.find(isMaintainerResponse) ?? null;
  const firstResponseAt = firstResponse?.occurred_at ?? null;
  const maintainerReviews = events.filter(
    (e) => e.event_type === "review_submitted" && isMaintainerResponse(e)
  ).length;
  const iterationsAfterFirstResponse = firstResponseAt ? events.filter(
    (e) => e.event_type === "commit_pushed" && e.is_author && e.occurred_at > firstResponseAt
  ).length : 0;
  const outcome = lifecycle.merged ? "merged" : lifecycle.closedUnmergedAt ? "closed_unmerged" : "open";
  const signals = {
    distinctCounterparties: counterpartyIds.size,
    maintainerReviews,
    iterationsAfterFirstResponse,
    hoursToFirstResponse: hoursBetween2(lifecycle.openedAt, firstResponseAt),
    hoursToMerge: hoursBetween2(lifecycle.openedAt, lifecycle.mergedAt)
  };
  const timeline = events.map((e) => ({
    at: e.occurred_at,
    event: e.event_type,
    role: roleOf(e)
  }));
  const notes = [];
  if (!lifecycle.complete.reviews) notes.push("Review data incomplete \u2014 review counts may undercount.");
  if (!lifecycle.complete.comments) notes.push("Comment data incomplete \u2014 response detection may be partial.");
  if (!lifecycle.complete.commits) notes.push("Commit data incomplete \u2014 iteration count may undercount.");
  if (lifecycle.authorId == null) notes.push("PR author identity unavailable \u2014 author/counterparty split may be imprecise.");
  return {
    repo: facts?.repo ?? "",
    prNumber: lifecycle.prNumber,
    prUrl: lifecycle.prUrl,
    openedAt: lifecycle.openedAt,
    outcome,
    mergedAt: lifecycle.mergedAt,
    closedUnmergedAt: lifecycle.closedUnmergedAt,
    signals,
    timeline,
    completeness: { ...lifecycle.complete },
    notes,
    limitations: [...AUDIT_LIMITATIONS]
  };
}
var MAINTAINER_ASSOC, AUDIT_LIMITATIONS;
var init_audit = __esm({
  "src/reputation/audit.ts"() {
    "use strict";
    MAINTAINER_ASSOC = /* @__PURE__ */ new Set(["OWNER", "MEMBER", "COLLABORATOR"]);
    AUDIT_LIMITATIONS = [
      "Post-merge bug/revert rate \u2014 longitudinal; it only shows up after the merge this audit stops at.",
      "Downstream adoption / real-world impact \u2014 a repo-level, slow signal not visible in one PR timeline.",
      "Reviewer satisfaction and collaboration quality \u2014 not observable from public timeline events."
    ];
  }
});

// bin/jpi-claim.js
init_src();
import { readFileSync as readFileSync8, writeFileSync as writeFileSync7, mkdirSync as mkdirSync3, existsSync as existsSync6, rmSync as rmSync5 } from "fs";
import { join as join10 } from "path";
import { homedir as homedir9, hostname as osHostname } from "os";
import { execFile as execFile2 } from "child_process";
import { promisify as promisify2 } from "util";
import { createInterface } from "readline";

// src/open-url.js
import { spawn } from "child_process";
function openInBrowser(url) {
  let cmd;
  let args;
  if (process.platform === "darwin") {
    cmd = "open";
    args = [url];
  } else if (process.platform === "win32") {
    cmd = "cmd";
    args = ["/c", "start", "", url];
  } else {
    cmd = "xdg-open";
    args = [url];
  }
  try {
    const child = spawn(cmd, args, { stdio: "ignore", detached: true });
    child.on("error", () => {
    });
    child.unref();
  } catch {
  }
}

// src/policy-acks.ts
init_state_dir();
import { lstatSync, readFileSync as readFileSync2, writeFileSync } from "fs";
import { join as join2 } from "path";
import { homedir } from "os";
var TERMINALHIRE_DIR = process.env.TERMINALHIRE_DIR || join2(homedir(), ".terminalhire");
var ACKS_FILE = join2(TERMINALHIRE_DIR, "policy-acks.json");
var REMEMBERABLE_VERDICTS = /* @__PURE__ */ new Set(["ai-mentioned", "disclosure-required"]);
var HEX64 = /^[0-9a-f]{64}$/;
function isSymlink(path) {
  try {
    return lstatSync(path).isSymbolicLink();
  } catch {
    return false;
  }
}
function storeIsRedirected() {
  return isSymlink(ACKS_FILE) || isSymlink(TERMINALHIRE_DIR);
}
function isValidAck(value, repoKey2) {
  if (!value || typeof value !== "object") return false;
  const a = value;
  return a.repo === repoKey2 && // the row must belong to the key it is filed under
  typeof a.contentHash === "string" && HEX64.test(a.contentHash) && typeof a.rulesetVersion === "number" && typeof a.verdict === "string" && REMEMBERABLE_VERDICTS.has(a.verdict) && // never honor a forged prohibited/clean
  typeof a.ackedAt === "string";
}
function readAcks() {
  if (storeIsRedirected()) return {};
  try {
    const parsed = JSON.parse(readFileSync2(ACKS_FILE, "utf8"));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return parsed;
  } catch {
    return {};
  }
}
function findPolicyAck(repo, contentHash, rulesetVersion) {
  if (!contentHash) return null;
  const ack = readAcks()[repo];
  if (!isValidAck(ack, repo)) return null;
  if (ack.contentHash !== contentHash) return null;
  if (ack.rulesetVersion !== rulesetVersion) return null;
  return ack;
}
function rememberPolicyAck(ack) {
  if (!ack.contentHash) return;
  if (!REMEMBERABLE_VERDICTS.has(ack.verdict)) return;
  if (storeIsRedirected()) return;
  try {
    ensureStateDir(TERMINALHIRE_DIR);
    const all = readAcks();
    all[ack.repo] = ack;
    writeFileSync(ACKS_FILE, `${JSON.stringify(all, null, 2)}
`, { mode: 384 });
  } catch {
  }
}

// bin/jpi-claim.js
init_claims();
init_state_dir();

// bin/claim-push-bg.js
import { createHash as createHash3 } from "crypto";
import { readFileSync as readFileSync5, writeFileSync as writeFileSync4, existsSync as existsSync3, rmSync as rmSync3 } from "fs";
import { join as join5 } from "path";
import { homedir as homedir4 } from "os";

// src/github-auth.ts
init_state_dir();
import { createCipheriv, createDecipheriv, randomBytes as randomBytes4 } from "crypto";
import { readFileSync as readFileSync4, writeFileSync as writeFileSync3, existsSync as existsSync2, rmSync as rmSync2, renameSync as renameSync2 } from "fs";
import { join as join4 } from "path";
import { homedir as homedir3 } from "os";
var TERMINALHIRE_DIR3 = process.env.TERMINALHIRE_DIR || join4(homedir3(), ".terminalhire");
var TOKEN_FILE = join4(TERMINALHIRE_DIR3, "github-token.enc");
var KEY_FILE = join4(TERMINALHIRE_DIR3, "key");
var ALGO = "aes-256-gcm";
var KEY_BYTES = 32;
var IV_BYTES = 12;
async function loadKey() {
  ensureStateDir(TERMINALHIRE_DIR3);
  if (existsSync2(KEY_FILE)) {
    return Buffer.from(readFileSync4(KEY_FILE, "utf8").trim(), "hex");
  }
  const key = randomBytes4(KEY_BYTES);
  writeFileSync3(KEY_FILE, key.toString("hex"), { mode: 384, encoding: "utf8" });
  return key;
}
function encrypt(plaintext, key) {
  const iv = randomBytes4(IV_BYTES);
  const cipher = createCipheriv(ALGO, key, iv);
  const ct = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return { iv: iv.toString("hex"), tag: tag.toString("hex"), ciphertext: ct.toString("hex") };
}

// bin/claim-push-bg.js
init_state_dir();
var TERMINALHIRE_DIR4 = process.env.TERMINALHIRE_DIR || join5(homedir4(), ".terminalhire");
var CLAIM_PUSH_AUTO_MARKER = join5(TERMINALHIRE_DIR4, "claim-push-auto.json");
var CLAIM_PUSH_TOKEN_FILE = join5(TERMINALHIRE_DIR4, "claim-push-token.enc");
var CLAIM_PUSH_MANUAL_MARKER = join5(TERMINALHIRE_DIR4, "claim-push.json");
var AUTO_CONSENT_VERSION = 2;
var AUTO_PUSH_THROTTLE_MS = 24 * 60 * 60 * 1e3;
async function writePushTokenEnc(rawToken) {
  ensureStateDir(TERMINALHIRE_DIR4);
  const key = await loadKey();
  const blob = encrypt(rawToken, key);
  writeFileSync4(CLAIM_PUSH_TOKEN_FILE, JSON.stringify(blob, null, 2), { encoding: "utf8" });
}
function clearPushTokenEnc() {
  try {
    rmSync3(CLAIM_PUSH_TOKEN_FILE);
  } catch {
  }
}
function writeAutoMarker(marker) {
  ensureStateDir(TERMINALHIRE_DIR4);
  writeFileSync4(CLAIM_PUSH_AUTO_MARKER, JSON.stringify(marker, null, 2) + "\n", "utf8");
}
function clearAutoMarker() {
  try {
    rmSync3(CLAIM_PUSH_AUTO_MARKER);
  } catch {
  }
}
function computeSnapshotHash(pushed) {
  return createHash3("sha256").update(JSON.stringify(pushed)).digest("hex");
}
function unpushedNudgeGate(params) {
  const {
    autoMarkerExists,
    tokenFileExists,
    manualMarkerExists,
    lastSnapshotHash,
    currentHash,
    claimCount
  } = params;
  if (autoMarkerExists && tokenFileExists) return false;
  if (!manualMarkerExists) return false;
  if (!(claimCount > 0)) return false;
  return lastSnapshotHash !== currentHash;
}
async function shouldNudgeUnpushed() {
  try {
    const { listClaims: listClaims2, toPushedClaim: toPushedClaim2 } = await Promise.resolve().then(() => (init_claims(), claims_exports));
    const pushed = listClaims2().map((c) => toPushedClaim2(c));
    const currentHash = computeSnapshotHash(pushed);
    let manual = null;
    try {
      manual = existsSync3(CLAIM_PUSH_MANUAL_MARKER) ? JSON.parse(readFileSync5(CLAIM_PUSH_MANUAL_MARKER, "utf8")) : null;
    } catch {
      manual = null;
    }
    return unpushedNudgeGate({
      autoMarkerExists: existsSync3(CLAIM_PUSH_AUTO_MARKER),
      tokenFileExists: existsSync3(CLAIM_PUSH_TOKEN_FILE),
      manualMarkerExists: !!manual,
      lastSnapshotHash: manual?.lastSnapshotHash ?? null,
      currentHash,
      claimCount: pushed.length
    });
  } catch {
    return false;
  }
}

// bin/jpi-claim.js
var TERMINALHIRE_DIR9 = process.env.TERMINALHIRE_DIR || join10(homedir9(), ".terminalhire");
var INDEX_CACHE_FILE = join10(TERMINALHIRE_DIR9, "index-cache.json");
var CLAIM_PUSH_MARKER = join10(TERMINALHIRE_DIR9, "claim-push.json");
var REPO_CONTINUITY_NUDGE_MARKER = join10(TERMINALHIRE_DIR9, "repo-continuity-nudged.json");
function readNudgedClaimIds() {
  try {
    const raw = JSON.parse(readFileSync8(REPO_CONTINUITY_NUDGE_MARKER, "utf8"));
    return new Set(Array.isArray(raw.claimIds) ? raw.claimIds : []);
  } catch {
    return /* @__PURE__ */ new Set();
  }
}
function markClaimNudged(id) {
  try {
    const ids = readNudgedClaimIds();
    ids.add(id);
    ensureStateDir(TERMINALHIRE_DIR9);
    writeFileSync7(REPO_CONTINUITY_NUDGE_MARKER, JSON.stringify({ claimIds: [...ids] }), "utf8");
  } catch {
  }
}
var API_URL = process.env["TERMINALHIRE_API_URL"] ?? process.env["JPI_API_URL"] ?? "https://terminalhire.com";
var CLAIM_SYNC_BASE = "https://terminalhire.com";
var CLAIM_CONSENT_VERSION = 1;
var CLAIM_POLL_INTERVAL_MS = 2e3;
var CLAIM_POLL_TIMEOUT_MS = 10 * 60 * 1e3;
var GH_API2 = "https://api.github.com";
var GH_HEADERS2 = { "User-Agent": "terminalhire-claim", Accept: "application/vnd.github+json" };
var CONTENTION_HINT = "    tip: if scopes overlap, comment on the ISSUE comparing scope \u2014 generous + compatible wins triage.";
var AI_DISCLOSURE_NOTE = "---\nThis contribution was developed with AI assistance via [terminalhire](https://terminalhire.com). The author has reviewed the change and takes responsibility for its content.";
function buildSubmitBody(issueNumber, opts = {}) {
  const { bodyText, noCloses } = opts;
  const closesLine = issueNumber && !noCloses ? `Closes #${issueNumber}

` : "";
  const hasBody = typeof bodyText === "string" && bodyText.length > 0;
  if (hasBody && bodyText.includes(AI_DISCLOSURE_NOTE)) {
    return `${closesLine}${bodyText}`;
  }
  const main = hasBody ? `${bodyText}

` : "";
  return `${closesLine}${main}${AI_DISCLOSURE_NOTE}`;
}
function printPolicySection(policy) {
  const verdict = policy.verdict ?? (policy.status === "flagged" ? "ai-mentioned" : policy.status);
  if (verdict === "prohibited") {
    console.log(
      "\n  POLICY: \u2717 this repo PROHIBITS AI-generated contributions \u2014 READ BEFORE CLAIMING:"
    );
  } else if (verdict === "disclosure-required") {
    console.log("\n  POLICY: \u26A0 this repo requires disclosing AI assistance \u2014 READ BEFORE WORKING:");
  } else if (verdict === "ai-mentioned") {
    console.log(
      "\n  POLICY: \u26A0 possible AI-assistance policy language found \u2014 READ BEFORE WORKING:"
    );
  } else if (policy.status === "unavailable") {
    console.log(
      "\n  POLICY: could not read this repo's CONTRIBUTING/PR-template/AGENTS docs (rate-limited or unreachable) \u2014 read them yourself before working."
    );
  } else {
    console.log(
      "  policy: no AI-assistance policy language detected in CONTRIBUTING/PR-template/AGENTS docs"
    );
  }
  for (const hit of policy.hits ?? []) {
    console.log(`    [${hit.file}]`);
    for (const line of hit.excerpt.split("\n")) console.log(`      ${line}`);
  }
  const requirements = policy.requirements ?? [];
  if (requirements.length > 0) {
    console.log("\n  REQUIREMENTS: this repo sets contribution expectations \u2014 in its own words:");
    for (const req of requirements) {
      console.log(`    ${req.kind} [${req.file}]`);
      for (const line of req.excerpt.split("\n")) console.log(`      ${line}`);
    }
  }
  const assignment = policy.assignment ?? "none";
  if (assignment === "take-bot") {
    console.log(
      "  assignment: repo self-assigns via a /take comment \u2014 `claim start` will post `/take` on the issue"
    );
  } else if (assignment === "required") {
    console.log(
      "  assignment: repo expects you to request assignment \u2014 `claim start` will post a request comment on the issue"
    );
  } else {
    console.log(
      "  assignment: no assignment expectation found in repo docs \u2014 `claim start` will not comment (pass --assign to request anyway)"
    );
  }
}
var pExecFile = promisify2(execFile2);
async function sh(cmd, args, opts = {}) {
  const { stdout } = await pExecFile(cmd, args, {
    ...opts,
    shell: false,
    maxBuffer: 16 * 1024 * 1024
  });
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
var VALUE_FLAGS = /* @__PURE__ */ new Set(["worktree", "branch", "body-file", "title"]);
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
function selectPushRemote(remotes, upstreamFullName, ghUser) {
  const upstream = String(upstreamFullName ?? "").toLowerCase();
  const list = Array.isArray(remotes) ? remotes : [];
  const origin = list.find((r) => r && r.name === "origin" && r.repo);
  if (origin && origin.repo.toLowerCase() !== upstream) return origin;
  const user = String(ghUser ?? "").toLowerCase();
  const fork = list.find((r) => {
    if (!r || !r.repo) return false;
    const owner = r.repo.split("/")[0];
    return owner.toLowerCase() === user && r.repo.toLowerCase() !== upstream;
  });
  return fork ?? null;
}
function resolveSubmitWorktree({ override, cwdToplevel, recorded, recordedIsGit }) {
  if (override !== void 0) {
    if (override === recorded) return { wt: recorded };
    return {
      error: `worktree mismatch \u2014 refusing to push.
  expected: ${recorded}
  found:    ${override ?? "(not a git work tree)"}
  Run submit from inside the claim's worktree (or pass --worktree <path>).`
    };
  }
  if (cwdToplevel === recorded) return { wt: recorded };
  if (recordedIsGit) {
    return {
      wt: recorded,
      note: `using recorded worktree: ${recorded} (you are in ${cwdToplevel ?? "a non-git directory"})`
    };
  }
  return {
    error: `recorded worktree ${recorded} no longer exists \u2014 re-attach:
  terminalhire claim attach <id> --worktree ${recorded} --branch <branch>`
  };
}
function pickBodySource({ bodyFileFlag, noBody, prBodyExists }) {
  if (bodyFileFlag) return "body-file";
  if (!noBody && prBodyExists) return "pr-body";
  return "none";
}
function pickExistingPr(prListJson, ghUser) {
  if (!Array.isArray(prListJson)) return null;
  const user = String(ghUser ?? "").toLowerCase();
  const match2 = prListJson.find((pr) => {
    const login = pr && pr.headRepositoryOwner && pr.headRepositoryOwner.login;
    return typeof login === "string" && login.toLowerCase() === user;
  });
  return match2 && typeof match2.url === "string" ? match2.url : null;
}
function readClaimablePool() {
  if (!existsSync6(INDEX_CACHE_FILE)) return [];
  const entry = JSON.parse(readFileSync8(INDEX_CACHE_FILE, "utf8"));
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
function isVerblessShortRefClaim(verb, positional) {
  return looksLikeShortRef(verb) && positional.length === 0;
}
function isStrayArgShortRefClaim(verb, positional) {
  return looksLikeShortRef(verb) && positional.length > 0;
}
function findClaimableByShortRef(ref) {
  try {
    return findByShortRefInPool(readClaimablePool(), ref);
  } catch {
    return null;
  }
}
function findByShortRefInPool(pool, ref) {
  return pool.find((j) => opportunityShortToken(j.id) === ref) ?? null;
}
async function fetchFreshClaimablePool() {
  let index;
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(`${API_URL}/api/index`, {
        signal: AbortSignal.timeout(15e3),
        headers: { Accept: "application/json" }
      });
      if (!res.ok) return null;
      index = await res.json();
      break;
    } catch {
      if (attempt >= 2) return null;
    }
  }
  const bounties = (index?.jobs ?? []).filter((j) => j.source === "bounty");
  const contributions = (index?.contribute ?? []).filter((j) => j.source === "contribute");
  return [...bounties, ...contributions];
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
      source: "contribute",
      // Fix 2: the aggregator persists a discovery-time open-PR presence flag
      // (0 = verified-uncontested, 1 = contested — kept and flagged, not dropped,
      // undefined = the PR check couldn't run). Carry it through so resolveBounty
      // can prefer it over a live re-count that degrades to null under a rate limit
      // / >100-PR page. Display/fallback ONLY — the contention gate still forces a
      // LIVE recount (see resolveBounty); the snapshot never decides contention.
      openPRsAtDiscovery: c.openPRsAtDiscovery
    };
  }
  const b = job.bounty ?? {};
  return {
    bountyId: job.id,
    title: job.title,
    repoFullName: b.repoFullName ?? job.company ?? "",
    issueUrl: b.claimUrl ?? job.url ?? "",
    amountUSD: b.amountUSD ?? null,
    source: "bounty",
    // Bounties carry no discovery-time PR proof — always live-count (unchanged).
    openPRsAtDiscovery: void 0
  };
}
function parseGitHubUrl(url) {
  const m = String(url ?? "").match(/github\.com\/([^/]+)\/([^/]+)\/(?:issues|pull)\/(\d+)/);
  if (!m) return null;
  return { owner: m[1], repo: m[2], number: parseInt(m[3], 10), repoFullName: `${m[1]}/${m[2]}` };
}
function matchReferencingPrs(prs, issueNumber) {
  if (!Array.isArray(prs)) return [];
  const needle = new RegExp(`#${issueNumber}\\b`);
  const matched = [];
  for (const p of prs) {
    if (!p) continue;
    if (needle.test(`${p.title ?? ""}
${p.body ?? ""}`)) {
      matched.push({
        number: p.number,
        url: p.html_url ?? p.url ?? null,
        author: p.user && p.user.login || null,
        createdAt: p.created_at ?? null
      });
    }
  }
  return matched;
}
function selectCompetingPrs(prs, selfLogin) {
  if (!Array.isArray(prs)) return [];
  return prs.filter((pr) => pr && pr.author !== selfLogin);
}
async function listOpenPRsReferencingIssue(repoFullName, issueNumber) {
  try {
    const res = await fetch(`${GH_API2}/repos/${repoFullName}/pulls?state=open&per_page=100`, {
      headers: GH_HEADERS2,
      signal: AbortSignal.timeout(1e4)
    });
    if (!res.ok) return null;
    const prs = await res.json();
    if (!Array.isArray(prs)) return null;
    if (prs.length === 100) return null;
    const matched = matchReferencingPrs(prs, issueNumber);
    return { total: matched.length, prs: matched };
  } catch {
    return null;
  }
}
async function countOpenPRsReferencingIssue(repoFullName, issueNumber) {
  return (await listOpenPRsReferencingIssue(repoFullName, issueNumber))?.total ?? null;
}
function fmtAge(isoString, nowMs) {
  const t = Date.parse(isoString);
  if (Number.isNaN(t)) return "unknown";
  const mins = Math.floor(Math.max(0, nowMs - t) / 6e4);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
function diffContention(prevNumbers, currentNumbers) {
  const prev = new Set(Array.isArray(prevNumbers) ? prevNumbers : []);
  const cur = new Set(Array.isArray(currentNumbers) ? currentNumbers : []);
  const added = (Array.isArray(currentNumbers) ? currentNumbers : []).filter((n) => !prev.has(n));
  const removed = (Array.isArray(prevNumbers) ? prevNumbers : []).filter((n) => !cur.has(n));
  return { added, removed };
}
function fmtContentionPr(pr, nowMs, isNew) {
  const who = pr.author ? `@${pr.author}` : "unknown";
  const link = pr.url ? ` ${pr.url}` : "";
  return `    - #${pr.number} by ${who} (opened ${fmtAge(pr.createdAt, nowMs)})${link}${isNew ? " [NEW]" : ""}`;
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
    const logins = /* @__PURE__ */ new Set();
    if (issue.assignee && typeof issue.assignee.login === "string")
      logins.add(issue.assignee.login);
    if (Array.isArray(issue.assignees)) {
      for (const a of issue.assignees) {
        if (a && typeof a.login === "string") logins.add(a.login);
      }
    }
    return {
      state,
      title: typeof issue.title === "string" ? issue.title : null,
      assignees: [...logins]
    };
  } catch {
    return null;
  }
}
var ASSIGNMENT_MARKER = "<!-- terminalhire:assignment-request -->";
var TAKE_BOT_REPOS = /* @__PURE__ */ new Set(["paradedb/paradedb"]);
function buildAssignmentComment(repoFullName, opts = {}) {
  const usesTakeBot = TAKE_BOT_REPOS.has(repoFullName.toLowerCase()) || Boolean(opts.takeBot);
  const body = usesTakeBot ? "/take" : `Hi! I'd like to work on this issue. Could you assign it to me? Thanks!

${ASSIGNMENT_MARKER}`;
  return { usesTakeBot, body };
}
async function hasPriorAssignmentRequest(repoFullName, issueNumber, login) {
  try {
    const res = await fetch(
      `${GH_API2}/repos/${repoFullName}/issues/${issueNumber}/comments?per_page=100&sort=created&direction=desc`,
      { headers: GH_HEADERS2, signal: AbortSignal.timeout(1e4) }
    );
    if (!res.ok) return false;
    const comments = await res.json();
    if (!Array.isArray(comments)) return false;
    return comments.some(
      (c) => c && c.user && c.user.login === login && typeof c.body === "string" && c.body.includes(ASSIGNMENT_MARKER)
    );
  } catch {
    return false;
  }
}
function shouldRequestAssignment(claim, flags = {}) {
  const expectation = claim && claim.policy ? claim.policy.assignment : void 0;
  const post = Boolean(flags.assign) || expectation === void 0 || expectation === "required" || expectation === "take-bot";
  return { post, takeBot: expectation === "take-bot" };
}
async function requestIssueAssignment(claim, flags = {}, ghUser) {
  if (flags["no-assign"]) {
    console.log(
      "  (--no-assign \u2014 skipping the assignment request; request it manually before working)"
    );
    return;
  }
  const parsed = parseGitHubUrl(claim.issueUrl);
  if (!parsed) return;
  const { repoFullName, number } = parsed;
  const expectation = shouldRequestAssignment(claim, flags);
  if (!expectation.post) {
    console.log(
      "  (no assignment expectation found in repo docs \u2014 pass --assign to request assignment anyway)"
    );
    return;
  }
  let login = ghUser;
  if (!login) {
    try {
      login = await sh("gh", ["api", "user", "-q", ".login"]);
    } catch {
      console.log(
        "  (assignment not requested: 'gh' not authenticated \u2014 comment on the issue manually before working)"
      );
      return;
    }
  }
  const issue = await fetchIssue(repoFullName, number);
  if (issue && issue.assignees.includes(login)) {
    console.log(`  \u2713 Already assigned to @${login} on ${repoFullName}#${number}.`);
    return;
  }
  const { usesTakeBot, body } = buildAssignmentComment(repoFullName, {
    takeBot: expectation.takeBot
  });
  if (!usesTakeBot && await hasPriorAssignmentRequest(repoFullName, number, login)) {
    console.log(`  \u2713 Assignment already requested on ${repoFullName}#${number}.`);
    return;
  }
  if (process.stdin.isTTY) {
    console.log(`
  About to comment on ${repoFullName}#${number} as @${login}:`);
    for (const line of body.split("\n")) console.log(`    ${line}`);
    const go = await confirm("  Post it? (y/N) ");
    if (!go) {
      console.log("  (skipped \u2014 request assignment manually before working)");
      return;
    }
  }
  try {
    await sh("gh", ["issue", "comment", String(number), "--repo", repoFullName, "--body", body]);
    console.log(
      usesTakeBot ? `  \u2713 Requested assignment via /take on ${repoFullName}#${number}.` : `  \u2713 Requested assignment on ${repoFullName}#${number}.`
    );
  } catch (err) {
    console.log(
      `  (could not post the assignment request: ${err.stderr || err.message || err} \u2014 do it manually before working)`
    );
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
  let bountyId, title, repoFullName, issueUrl, amountUSD, source, openPRsAtDiscovery, indexNativeId;
  let job = findClaimableInCache(arg) ?? (looksLikeShortRef(arg) ? findClaimableByShortRef(arg) : null);
  let freshPool;
  if (!job && looksLikeShortRef(arg)) {
    freshPool = await fetchFreshClaimablePool();
    if (freshPool) job = findByShortRefInPool(freshPool, arg);
  }
  if (job) {
    ({ bountyId, title, repoFullName, issueUrl, amountUSD, source, openPRsAtDiscovery } = extractClaimableFields(job));
    indexNativeId = bountyId;
  } else {
    const parsed = parseGitHubUrl(arg);
    if (!parsed) return null;
    bountyId = `gh:${parsed.repoFullName}#${parsed.number}`;
    title = `${parsed.repoFullName}#${parsed.number}`;
    repoFullName = parsed.repoFullName;
    issueUrl = arg;
    amountUSD = null;
    source = "bounty";
    indexNativeId = `bounty:${parsed.repoFullName}#${parsed.number}`;
    if (freshPool === void 0) freshPool = await fetchFreshClaimablePool();
    const pooled = (freshPool ?? []).find((j) => {
      const p = parseGitHubUrl(extractClaimableFields(j).issueUrl);
      return p && p.repoFullName.toLowerCase() === parsed.repoFullName.toLowerCase() && p.number === parsed.number;
    });
    if (pooled) {
      const f = extractClaimableFields(pooled);
      indexNativeId = f.bountyId;
      source = f.source;
    }
  }
  const ghIssue = parseGitHubUrl(issueUrl);
  const issue = ghIssue ? await fetchIssue(repoFullName, ghIssue.number) : null;
  let openPRs;
  let openPRsFromDiscovery = false;
  if (openPRsAtDiscovery != null) {
    openPRs = openPRsAtDiscovery;
    openPRsFromDiscovery = true;
  } else {
    openPRs = ghIssue ? await countOpenPRsReferencingIssue(repoFullName, ghIssue.number) : null;
  }
  let openPRsLive;
  if (openPRsFromDiscovery) {
    openPRsLive = ghIssue ? await countOpenPRsReferencingIssue(repoFullName, ghIssue.number) : null;
  } else {
    openPRsLive = openPRs;
  }
  const issueState = issue ? issue.state : null;
  const assignees = issue ? issue.assignees : null;
  if (!job && issue && issue.title) title = issue.title;
  return {
    bountyId,
    indexNativeId,
    title,
    repoFullName,
    issueUrl,
    amountUSD,
    source,
    issueState,
    assignees,
    openPRs,
    openPRsFromDiscovery,
    // Live open-PR count for the contention decision only (Fix 2). Distinct from
    // `openPRs`, which may be the discovery-time snapshot used for display.
    openPRsLive,
    issueNumber: ghIssue ? ghIssue.number : null
  };
}
function fmtOpenPRsLine(b) {
  const atDiscovery = b.openPRsFromDiscovery ? " (at discovery)" : "";
  if (b.openPRs == null) {
    return "  open PRs: unknown (GitHub read unavailable \u2014 check the issue manually before working)";
  } else if (b.openPRs > 0) {
    return `  \u26A0 open PRs referencing this issue${atDiscovery}: ${b.openPRs} \u2014 someone may already be on it. Check before working.`;
  }
  return `  open PRs referencing this issue${atDiscovery}: 0`;
}
function isContested(b) {
  const assignedToSomeoneElse = Array.isArray(b.assignees) && b.assignees.length > 0;
  const hasOpenPR = b.openPRsLive != null && b.openPRsLive > 0;
  return assignedToSomeoneElse || hasOpenPR;
}
function fmtContestedWarning(b) {
  if (!isContested(b)) return null;
  const parts = [];
  if (Array.isArray(b.assignees) && b.assignees.length > 0) {
    parts.push(`assigned to ${b.assignees.map((l) => `@${l}`).join(", ")}`);
  }
  if (b.openPRsLive != null && b.openPRsLive > 0) {
    parts.push(`${b.openPRsLive} open PR${b.openPRsLive === 1 ? "" : "s"} referencing it`);
  }
  return `  \u26A0 This issue looks taken: ${parts.join(" / ")}. A merged PR here is unlikely.`;
}
async function cmdRecord(arg, flags = {}) {
  const claims = await Promise.resolve().then(() => (init_claims(), claims_exports));
  if (!arg) {
    console.error(
      "Usage: terminalhire claim record <bountyId|issueUrl> [--ack-policy] [--ack-policy-prohibited] [--ack-contested]"
    );
    console.error("  Run `terminalhire bounties` first to populate the local index cache,");
    console.error("  then pass the id shown in its output \u2014 or pass a GitHub issue URL directly.");
    process.exit(1);
  }
  const b = await resolveBounty(arg);
  if (!b) {
    console.error(
      `terminalhire claim: '${arg}' is not in the index cache and is not a GitHub issue URL.`
    );
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
  const contestedWarning = fmtContestedWarning(b);
  if (contestedWarning) {
    console.log(`
${contestedWarning}`);
    let acked = Boolean(flags["ack-contested"]);
    if (!acked && process.stdin.isTTY) {
      acked = await confirm("\n  Claim it anyway? (y/N) ");
    }
    if (!acked) {
      console.error(
        "\nterminalhire claim: refusing to record \u2014 this issue looks taken.\n  Re-run with --ack-contested to claim it anyway (or confirm interactively)."
      );
      process.exit(1);
    }
  }
  const { checkRepoPolicy: checkRepoPolicy2 } = await Promise.resolve().then(() => (init_repo_policy(), repo_policy_exports));
  const policy = await checkRepoPolicy2(b.repoFullName);
  printPolicySection(policy);
  if (process.stdout.isTTY) {
    try {
      const { getRepoEntry: getRepoEntry2, briefingLines: briefingLines2 } = await Promise.resolve().then(() => (init_repo_experience(), repo_experience_exports));
      const entry = await getRepoEntry2(b.repoFullName);
      const lines = briefingLines2({
        repoFullName: b.repoFullName,
        entry,
        claims: claims.readClaims()
      });
      if (lines.length > 0) console.log(`
  ${lines.join(" \xB7 ")}`);
    } catch {
    }
  }
  let ackedAt = null;
  if (policy.verdict === "prohibited") {
    let acked = Boolean(flags["ack-policy-prohibited"]);
    if (!acked && process.stdin.isTTY) {
      acked = await confirm(
        "\n  This repo PROHIBITS AI-generated contributions \u2014 continuing means everything you submit must be hand-written by you. Continue? (y/N) "
      );
    }
    if (!acked) {
      console.error(
        `
terminalhire claim: refusing to record \u2014 ${b.repoFullName} prohibits AI-generated contributions.
  Read the excerpts above. If you will hand-write the work yourself, re-run with
  --ack-policy-prohibited (or confirm interactively). --ack-policy is not enough here.`
      );
      process.exit(1);
    }
    ackedAt = (/* @__PURE__ */ new Date()).toISOString();
  } else if (policy.status === "flagged" || policy.status === "unavailable") {
    const prior = policy.scanComplete ? findPolicyAck(b.repoFullName, policy.contentHash, policy.rulesetVersion) : null;
    if (prior) {
      console.log(
        `
  policy unchanged since you acknowledged it on ${prior.ackedAt.slice(0, 10)} \u2014 not asking again.`
      );
      ackedAt = prior.ackedAt;
    } else {
      const reason = policy.status === "flagged" ? "This repo has AI-assistance policy language" : "This repo's contribution policy could not be checked";
      let acked = Boolean(flags["ack-policy"]);
      if (!acked && process.stdin.isTTY) {
        acked = await confirm(
          `
  ${reason} \u2014 read it before working. Acknowledge and proceed? (y/N) `
        );
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
      if (policy.status === "flagged" && policy.scanComplete) {
        rememberPolicyAck({
          repo: b.repoFullName,
          contentHash: policy.contentHash,
          rulesetVersion: policy.rulesetVersion,
          verdict: policy.verdict,
          ackedAt
        });
      }
    }
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
      // Persist the full audit verdict (not just the coarse status) so `claim
      // start` can drive the assignment decision from it and `claim audit` can
      // show what ruleset the dev acknowledged. Excerpts are NOT persisted —
      // the record stores the conclusion; the docs stay the source of truth.
      policy: {
        status: policy.status,
        verdict: policy.verdict,
        assignment: policy.assignment,
        requirements: (policy.requirements ?? []).map((r) => r.kind),
        rulesetVersion: policy.rulesetVersion,
        ackedAt
      }
    });
  } catch (err) {
    console.error(`terminalhire claim: ${err.message ?? err}`);
    process.exit(1);
  }
  try {
    const { recordPolicySnapshot: recordPolicySnapshot2 } = await Promise.resolve().then(() => (init_repo_experience(), repo_experience_exports));
    await recordPolicySnapshot2(b.repoFullName, policy);
  } catch {
  }
  try {
    const { markStatus: markStatus2 } = await Promise.resolve().then(() => (init_job_status_store(), job_status_store_exports));
    markStatus2(b.indexNativeId, "claimed");
  } catch {
  }
  console.log(`
\u2713 Claimed: ${claim.title}`);
  console.log(`  id:     ${claim.id}`);
  console.log(`  repo:   ${claim.repoFullName}`);
  console.log(`  amount: ${fmtAmount(claim.amountUSD)}`);
  console.log(`  issue:  ${claim.issueUrl}`);
  console.log(fmtOpenPRsLine(b));
  console.log("\n  Executor constraints (enforce when spawning the background agent):");
  console.log(
    "   \u2022 work in an ISOLATED git worktree; scrub the subprocess env (no token/profile inheritance)"
  );
  console.log(
    "   \u2022 MUST NOT `git push` or `gh pr` \u2014 pushing happens only via `terminalhire submit`"
  );
  console.log(
    "   \u2022 clone + static analysis + patch only; NO test/build execution without explicit approval"
  );
  console.log("   \u2022 no access to ~/.terminalhire (the executor never needs your profile)");
  console.log(
    "\n  Next \u2014 start work (forks + clones into an isolated worktree; your terminal stays put):"
  );
  console.log("    terminalhire claim start " + claim.id);
  console.log("  Then publish when it is done (the only step that pushes + opens the PR):");
  console.log("    terminalhire claim submit " + claim.id);
  if (flags.start) {
    await cmdStart(claim.id, { start: true });
  } else if (process.stdin.isTTY && !flags["no-start"]) {
    const go = await confirm(`
  Fork ${claim.repoFullName} and start now? (y/N) `);
    if (go) await cmdStart(claim.id, { start: true });
    else console.log(`
  Saved. Start anytime:  terminalhire claim start ${claim.id}`);
  }
}
async function cmdPreview(arg, { json } = {}) {
  if (!arg) {
    console.error("Usage: terminalhire claim preview <bountyId|issueUrl> [--json]");
    process.exit(1);
  }
  const b = await resolveBounty(arg);
  if (!b) {
    console.error(
      `terminalhire claim: '${arg}' is not in the index cache and is not a GitHub issue URL.`
    );
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
        assignees: b.assignees,
        contested: isContested(b),
        policy: {
          status: policy.status,
          verdict: policy.verdict,
          assignment: policy.assignment,
          rulesetVersion: policy.rulesetVersion,
          hits: policy.hits,
          requirements: policy.requirements
        }
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
    console.log(
      "  \u2717 CLOSED \u2014 not claimable (the pool drops closed issues; likely a stale cache entry)"
    );
  }
  console.log(fmtOpenPRsLine(b));
  const previewContested = fmtContestedWarning(b);
  if (previewContested) console.log(previewContested);
  printPolicySection(policy);
  if (process.stdout.isTTY) {
    try {
      const { getRepoEntry: getRepoEntry2, briefingLines: briefingLines2 } = await Promise.resolve().then(() => (init_repo_experience(), repo_experience_exports));
      const claimsForBrief = await Promise.resolve().then(() => (init_claims(), claims_exports));
      const entry = await getRepoEntry2(b.repoFullName);
      const lines = briefingLines2({
        repoFullName: b.repoFullName,
        entry,
        claims: claimsForBrief.readClaims()
      });
      if (lines.length > 0) console.log(`
  ${lines.join(" \xB7 ")}`);
    } catch {
    }
  }
  console.log(
    "\n  Preview only \u2014 NOT claimed. Run `terminalhire claim record " + arg + "` to claim it."
  );
}
async function cmdList(active) {
  const claims = await Promise.resolve().then(() => (init_claims(), claims_exports));
  const list = claims.listClaims({ active });
  if (list.length === 0) {
    console.log(
      active ? "No active claims." : "No claims yet. Use `terminalhire claim record <bountyId>`."
    );
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
  try {
    if (await shouldNudgeUnpushed()) {
      console.log(
        "\n  \u26A0 new claims not yet on your dashboard \u2014 run: terminalhire claim --push --keep-updated"
      );
    }
  } catch {
  }
  if (process.stdout.isTTY) {
    try {
      const { calibrationSummary: calibrationSummary2 } = await Promise.resolve().then(() => (init_repo_experience(), repo_experience_exports));
      const allClaims = claims.readClaims();
      const repos = [...new Set(allClaims.map((c) => c.repoFullName))];
      for (const repo of repos) {
        const summary = calibrationSummary2(allClaims, repo);
        if (summary.available) console.log(`  \u24D8 ${repo}: ${summary.text}`);
      }
    } catch {
    }
  }
}
async function cmdStatus(id) {
  const claims = await Promise.resolve().then(() => (init_claims(), claims_exports));
  const targets = id ? [claims.findClaim(id)].filter(Boolean) : claims.listClaims();
  if (targets.length === 0) {
    console.log(id ? `No claim with id '${id}'.` : "No claims to poll.");
    return;
  }
  const ACTIVE_PRE_SUBMIT = /* @__PURE__ */ new Set(["claimed", "working", "in-review", "ready"]);
  const renderContention = (c, result, { excludeNumber } = {}) => {
    const nowMs = Date.now();
    const prs = result.prs.filter((p) => p.number !== excludeNumber);
    const curNumbers = prs.map((p) => p.number);
    const hadSnapshot = Boolean(c.contention && Array.isArray(c.contention.prNumbers));
    const { added } = diffContention(hadSnapshot ? c.contention.prNumbers : [], curNumbers);
    const newSet = hadSnapshot ? new Set(added) : /* @__PURE__ */ new Set();
    if (prs.length > 0) {
      const label = excludeNumber ? "other open PR(s) reference" : "open PR(s) reference";
      console.log(`  \u26A0 contention: ${prs.length} ${label} this issue \u2014 ${c.title}`);
      for (const pr of prs) console.log(fmtContentionPr(pr, nowMs, newSet.has(pr.number)));
    }
    claims.updateClaim(c.id, {
      contention: { checkedAt: new Date(nowMs).toISOString(), prNumbers: curNumbers }
    });
    return prs.length > 0;
  };
  let polled = 0;
  for (const c of targets) {
    if (!c.prUrl) {
      if (ACTIVE_PRE_SUBMIT.has(c.state)) {
        const num = (parseGitHubUrl(c.issueUrl) || {}).number;
        const result = num ? await listOpenPRsReferencingIssue(c.repoFullName, num) : null;
        if (result && result.total > 0 && renderContention(c, result)) {
          console.log(CONTENTION_HINT);
        }
      }
      continue;
    }
    const res = await pollPR(c.prUrl);
    if (!res) {
      console.log(`  ? ${c.title} \u2014 could not read PR state (${c.prUrl})`);
      continue;
    }
    polled++;
    let observed = c.state;
    if (res.merged) observed = "merged";
    else if (res.state === "closed")
      observed = "abandoned";
    else observed = "submitted";
    const next = claims.nextPolledState(c.state, observed);
    const isNewMerge = next === "merged" && c.state !== "merged";
    if (next !== c.state) {
      claims.updateClaim(c.id, { state: next });
    }
    const mark = res.merged ? "\u2713 merged" : res.state === "closed" ? "\u2717 closed (unmerged)" : "\u2026 open";
    console.log(`  ${mark} \u2014 ${c.title}  (${c.prUrl})`);
    if (isNewMerge && process.stdout.isTTY) {
      try {
        const nudged = readNudgedClaimIds();
        if (!nudged.has(c.id)) {
          const { getRepoEntry: getRepoEntry2, projectOutcomes: projectOutcomes2, continuity: continuity2 } = await Promise.resolve().then(() => (init_repo_experience(), repo_experience_exports));
          const entry = await getRepoEntry2(c.repoFullName);
          const allClaims = claims.readClaims();
          const projection = projectOutcomes2(
            allClaims,
            entry?.tombstones ?? [],
            c.repoFullName,
            entry?.backfill ?? []
          );
          const result = continuity2(projection);
          if (result.score > 0) {
            console.log(
              `  \u24D8 ${result.reasons.join(" \xB7 ")} \u2014 building continuity in ${c.repoFullName}`
            );
          }
          markClaimNudged(c.id);
        }
      } catch {
      }
    }
    if (!res.merged && res.state !== "closed") {
      const num = (parseGitHubUrl(c.issueUrl) || {}).number;
      const ourNum = (parseGitHubUrl(c.prUrl) || {}).number;
      const result = num ? await listOpenPRsReferencingIssue(c.repoFullName, num) : null;
      if (result) renderContention(c, result, { excludeNumber: ourNum });
    }
  }
  if (polled === 0)
    console.log(
      "  No submitted claims with a PR URL yet. Set one via `claim update <id> submitted` after `submit`."
    );
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
  if (patch.prUrl) {
    try {
      const core = await Promise.resolve().then(() => (init_src(), src_exports));
      const facts = await core.fetchPRScoringFacts(prUrl, process.env.GITHUB_TOKEN || void 0);
      if (facts) {
        if (!facts.merged)
          console.log("  \u24D8 heads-up: that PR is not merged yet \u2014 it will not count until it is.");
        if (facts.mergedById != null && facts.authorId != null && facts.mergedById === facts.authorId)
          console.log(
            "  \u24D8 heads-up: that PR was merged by its own author \u2014 self-merges are not external acceptance."
          );
        const claim = claims.findClaim(id);
        const claimedIssueRef = claim && claim.issueUrl ? parseGitHubUrl(claim.issueUrl) : null;
        const claimedIssue = claimedIssueRef ? claimedIssueRef.number : null;
        if (claimedIssue != null && facts.closesIssues.length && !facts.closesIssues.includes(claimedIssue))
          console.log(
            `  \u24D8 heads-up: that PR closes ${facts.closesIssues.map((n) => "#" + n).join(", ")}, not the issue you claimed (#${claimedIssue}).`
          );
      }
    } catch {
    }
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
  const target = claims.findClaim(id);
  if (target) {
    try {
      const { writeTombstone: writeTombstone2 } = await Promise.resolve().then(() => (init_repo_experience(), repo_experience_exports));
      await writeTombstone2(
        target.repoFullName,
        id,
        target.state === "merged" ? "merged" : "abandoned"
      );
    } catch {
    }
  }
  const removed = claims.removeClaim(id);
  console.log(removed ? `Released claim: ${id}` : `terminalhire claim: no claim with id '${id}'.`);
  if (!removed) process.exit(1);
}
async function cmdAttach(id, worktree, branch) {
  const claims = await Promise.resolve().then(() => (init_claims(), claims_exports));
  if (!id || !worktree || !branch) {
    console.error("Usage: terminalhire claim attach <id> --worktree <path> --branch <branchName>");
    console.error(
      "  Records the worktree + branch so `terminalhire claim submit` can verify identity before pushing."
    );
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
function workDirFor(repoFullName, issueNumber) {
  const [owner, repo] = String(repoFullName).split("/");
  const suffix = issueNumber ? `-${issueNumber}` : "";
  return join10(homedir9(), "terminalhire", "work", `${owner}-${repo}${suffix}`);
}
function startBranchFor(repoFullName, issueNumber) {
  const repo = String(repoFullName).split("/")[1] || "claim";
  return `th/${repo}-${issueNumber || "work"}`;
}
function explicitForkConsent(flags = {}) {
  return Boolean(flags.start) || Boolean(flags.fork);
}
async function ensureForkExists(repoFullName, ghUser) {
  const repoShort = repoFullName.split("/")[1];
  const forkFullName = `${ghUser}/${repoShort}`;
  await sh("gh", ["repo", "fork", repoFullName, "--clone=false"]);
  let isFork = false;
  try {
    isFork = await sh("gh", ["api", `repos/${forkFullName}`, "--jq", ".fork"]) === "true";
  } catch {
    isFork = false;
  }
  if (!isFork) throw new Error(`fork ${forkFullName} created but could not be verified as a fork`);
  return forkFullName;
}
async function cmdStart(id, flags = {}) {
  const claims = await Promise.resolve().then(() => (init_claims(), claims_exports));
  if (!id) {
    const startable = claims.listClaims({ active: true }).filter((c) => c.state === "claimed");
    if (startable.length === 0) {
      console.log("No claims ready to start. Claim one first:  terminalhire claim <ref>");
      return;
    }
    console.log(
      `
${startable.length} claim${startable.length === 1 ? "" : "s"} ready to start:
`
    );
    for (const c of startable) {
      console.log(`  ${c.title}`);
      console.log(`    terminalhire claim start ${c.id}`);
    }
    console.log("\nRun the command under the one you want to start.");
    return;
  }
  const claim = claims.findClaim(id);
  if (!claim) {
    console.error(`terminalhire claim: no claim with id '${id}'.`);
    process.exit(1);
  }
  if (claim.worktreePath) {
    let stillThere = false;
    try {
      stillThere = await sh("git", ["-C", claim.worktreePath, "rev-parse", "--show-toplevel"]) === claim.worktreePath;
    } catch {
      stillThere = false;
    }
    if (stillThere) {
      console.log("Already started \u2014 your worktree is ready (your terminal stays put):");
      console.log(`  cd ${claim.worktreePath}`);
      if (claim.branch) console.log(`  branch: ${claim.branch}`);
      console.log(`
When it's done:  terminalhire claim submit ${id}`);
      return;
    }
  }
  if (flags.here) {
    await cmdStartHere(claims, claim, flags);
    return;
  }
  let ghUser;
  try {
    ghUser = await sh("gh", ["api", "user", "-q", ".login"]);
  } catch {
    console.error(
      "terminalhire claim: 'gh' CLI not available or not authenticated. Run 'gh auth login'."
    );
    process.exit(1);
  }
  let consented = explicitForkConsent(flags);
  if (!consented && process.stdin.isTTY) {
    consented = await confirm(
      `
  Fork ${claim.repoFullName} to @${ghUser} and clone it to start? (y/N) `
    );
  }
  if (!consented) {
    console.error(
      `
terminalhire claim: not started \u2014 starting forks ${claim.repoFullName} to your GitHub account (a network write).
  Re-run in a terminal to confirm interactively, or pass --fork to consent non-interactively.`
    );
    process.exit(1);
  }
  const issueNumber = (parseGitHubUrl(claim.issueUrl) || {}).number;
  const destDir = workDirFor(claim.repoFullName, issueNumber);
  if (existsSync6(destDir)) {
    console.error(
      `terminalhire claim: ${destDir} already exists \u2014 refusing to clobber it.
  Remove it and retry, or attach it: terminalhire claim attach ${id} --worktree ${destDir} --branch <branch>`
    );
    process.exit(1);
  }
  mkdirSync3(join10(homedir9(), "terminalhire", "work"), { recursive: true });
  let forkFullName;
  try {
    forkFullName = await ensureForkExists(claim.repoFullName, ghUser);
  } catch (err) {
    console.error(
      `terminalhire claim: could not create your fork of ${claim.repoFullName}. ${err.message ?? err}`
    );
    process.exit(1);
  }
  try {
    await sh("gh", ["repo", "clone", forkFullName, destDir]);
  } catch (err) {
    try {
      rmSync5(destDir, { recursive: true, force: true });
    } catch {
    }
    console.error(
      `terminalhire claim: clone of ${forkFullName} failed. ${err.stderr || err.message || err}`
    );
    process.exit(1);
  }
  try {
    await sh("git", ["-C", destDir, "remote", "get-url", "upstream"]);
  } catch {
    try {
      await sh("git", [
        "-C",
        destDir,
        "remote",
        "add",
        "upstream",
        `https://github.com/${claim.repoFullName}.git`
      ]);
    } catch {
    }
  }
  const branch = startBranchFor(claim.repoFullName, issueNumber);
  await sh("git", ["-C", destDir, "checkout", "-b", branch]);
  const toplevel = await sh("git", ["-C", destDir, "rev-parse", "--show-toplevel"]);
  claims.updateClaim(id, { worktreePath: toplevel, branch, state: "working" });
  await requestIssueAssignment(claim, flags, ghUser);
  console.log(`
\u2713 Started: ${claim.title}`);
  console.log(`  fork:   ${forkFullName}`);
  console.log(`  branch: ${branch}`);
  console.log("\n  Your isolated worktree is ready \u2014 your current terminal is untouched:");
  console.log(`    cd ${toplevel}`);
  console.log("\n  When the work is done (the only step that pushes + opens the PR):");
  console.log(`    terminalhire claim submit ${id}`);
}
async function cmdStartHere(claims, claim, flags = {}) {
  let toplevel;
  try {
    toplevel = await sh("git", ["-C", process.cwd(), "rev-parse", "--show-toplevel"]);
  } catch {
    console.error("terminalhire claim: --here must be run inside a git repository.");
    process.exit(1);
  }
  const remotesOut = await sh("git", ["-C", toplevel, "remote", "-v"]).catch(() => "");
  const repos = new Set(
    remotesOut.split("\n").map((l) => parseRepoFromRemote(l.split(/\s+/)[1])).filter(Boolean).map((r) => r.toLowerCase())
  );
  if (!repos.has(claim.repoFullName.toLowerCase())) {
    console.error(
      `terminalhire claim: --here expects a clone of ${claim.repoFullName}, but no remote here points there.
  Use \`terminalhire claim start ${claim.id}\` (no --here) to fork + clone it into a fresh worktree.`
    );
    process.exit(1);
  }
  const dirty = await sh("git", [
    "-C",
    toplevel,
    "status",
    "--porcelain",
    "--untracked-files=no"
  ]).catch(() => "");
  if (dirty) {
    console.error(
      "terminalhire claim: --here needs a clean working tree (claim work must not mix with your current changes).\n  Commit or stash first, or use `terminalhire claim start` for an isolated worktree."
    );
    process.exit(1);
  }
  const issueNumber = (parseGitHubUrl(claim.issueUrl) || {}).number;
  const branch = startBranchFor(claim.repoFullName, issueNumber);
  await sh("git", ["-C", toplevel, "checkout", "-b", branch]);
  claims.updateClaim(claim.id, { worktreePath: toplevel, branch, state: "working" });
  await requestIssueAssignment(claim, flags);
  console.log(`
\u2713 Started here: ${claim.title}`);
  console.log(`  worktree: ${toplevel}`);
  console.log(`  branch:   ${branch}`);
  console.log(`
  When the work is done:  terminalhire claim submit ${claim.id}`);
}
async function cmdSubmit(id, flags = {}) {
  const worktreeOverride = flags.worktree;
  const claims = await Promise.resolve().then(() => (init_claims(), claims_exports));
  if (!id) {
    console.error(
      "Usage: terminalhire claim submit <id> [--worktree <path>] [--yes] [--body-file <path>] [--no-body] [--title <t>] [--no-closes]"
    );
    process.exit(1);
  }
  const claim = claims.findClaim(id);
  if (!claim) {
    console.error(`terminalhire claim: no claim with id '${id}'.`);
    process.exit(1);
  }
  if (claim.state !== "working" && claim.state !== "ready") {
    console.error(
      `terminalhire claim: ${id} is '${claim.state}'. Submit runs once work has started ('working', via 'claim start') or the review gate cleared it ('ready'). Start it first:
  terminalhire claim start ${id}`
    );
    process.exit(1);
  }
  if (claim.review && claim.review.verdict === "revise") {
    console.error(
      `terminalhire claim: ${id} review verdict is 'revise' \u2014 the gate said do not submit. Resolve blockers and re-review first.`
    );
    process.exit(1);
  }
  if (!claim.worktreePath || !claim.branch) {
    console.error(
      `terminalhire claim: ${id} has no recorded worktree/branch \u2014 cannot verify what to push. Run:
  terminalhire claim attach ${id} --worktree <path> --branch <branch>`
    );
    process.exit(1);
  }
  const toplevelOf = async (dir) => {
    try {
      return await sh("git", ["-C", dir, "rev-parse", "--show-toplevel"]);
    } catch {
      return null;
    }
  };
  const recorded = claim.worktreePath;
  const override = worktreeOverride === void 0 ? void 0 : await toplevelOf(worktreeOverride);
  const cwdToplevel = await toplevelOf(process.cwd());
  const recordedIsGit = await toplevelOf(recorded) === recorded;
  const resolved = resolveSubmitWorktree({ override, cwdToplevel, recorded, recordedIsGit });
  if (resolved.error) {
    console.error(`terminalhire claim: ${resolved.error}`);
    process.exit(1);
  }
  if (resolved.note) console.log(`  ${resolved.note}`);
  const wt = resolved.wt;
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
    console.error(
      `terminalhire claim: '${claim.branch}' is the default branch \u2014 open the PR from a feature branch.`
    );
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
      console.error(
        `terminalhire claim: branch has no commits ahead of origin/${defaultBranch} \u2014 nothing to submit.`
      );
      process.exit(1);
    }
  }
  const dirty = await sh("git", ["-C", wt, "status", "--porcelain", "--untracked-files=no"]);
  if (dirty) {
    console.error(
      "terminalhire claim: working tree is not clean \u2014 commit or stash before submitting (submit pushes what was reviewed)."
    );
    process.exit(1);
  }
  let untrackedFiles = [];
  try {
    const untrackedOut = await sh("git", [
      "-C",
      wt,
      "status",
      "--porcelain",
      "--untracked-files=normal"
    ]);
    untrackedFiles = untrackedOut.split("\n").filter((l) => l.startsWith("?? ")).map((l) => l.slice(3).trim()).filter(Boolean);
  } catch {
  }
  let ghUser;
  try {
    ghUser = await sh("gh", ["api", "user", "-q", ".login"]);
  } catch {
    console.error(
      "terminalhire claim: 'gh' CLI not available or not authenticated. Run 'gh auth login'."
    );
    process.exit(1);
  }
  const collectRemotes = async () => {
    let names;
    try {
      names = (await sh("git", ["-C", wt, "remote"])).split("\n").map((s) => s.trim()).filter(Boolean);
    } catch {
      console.error("terminalhire claim: could not list git remotes in the worktree.");
      process.exit(1);
    }
    const parsed = [];
    for (const name of names) {
      let url;
      try {
        url = await sh("git", ["-C", wt, "remote", "get-url", name]);
      } catch {
        continue;
      }
      const repo = parseRepoFromRemote(url);
      if (repo) parsed.push({ name, repo });
    }
    return { names, remotes: parsed };
  };
  let { names: remoteNames, remotes } = await collectRemotes();
  let pushRemote = selectPushRemote(remotes, claim.repoFullName, ghUser);
  if (!pushRemote) {
    const noForkError = () => {
      console.error(
        `terminalhire claim: no remote points at your fork of the UPSTREAM bounty repo (${claim.repoFullName}) \u2014 refusing to push.
  Pushing would create a branch directly on the target repo. Fork first:
    gh repo fork ${claim.repoFullName} --clone=false
  add your fork as a remote, then retry.`
      );
    };
    const upstreamRepoName = claim.repoFullName.split("/")[1];
    const forkFullName = `${ghUser}/${upstreamRepoName}`;
    if (process.stdin.isTTY && !flags.yes) {
      console.log(`
  No remote points at your fork of ${claim.repoFullName}.`);
      const doFork = await confirm(
        `  Create fork ${forkFullName} with gh and add it as remote 'fork'? (y/N) `
      );
      if (doFork) {
        try {
          await sh("gh", ["repo", "fork", claim.repoFullName, "--clone=false"]);
        } catch (err) {
          console.error(
            `terminalhire claim: 'gh repo fork' failed. ${err.stderr || err.message || err}`
          );
          noForkError();
          process.exit(1);
        }
        let verified = false;
        try {
          verified = await sh("gh", ["api", `repos/${forkFullName}`, "--jq", ".fork"]) === "true";
        } catch {
          verified = false;
        }
        if (!verified) {
          noForkError();
          console.error(
            "  (fork created but could not be verified \u2014 add it as a remote manually.)"
          );
          process.exit(1);
        }
        if (remoteNames.includes("fork")) {
          console.error(
            `terminalhire claim: a remote named 'fork' already exists but does not point at your fork \u2014 refusing to clobber it. Fix it manually and retry.`
          );
          process.exit(1);
        }
        try {
          await sh("git", [
            "-C",
            wt,
            "remote",
            "add",
            "fork",
            `https://github.com/${forkFullName}.git`
          ]);
        } catch (err) {
          console.error(
            `terminalhire claim: could not add the 'fork' remote. ${err.stderr || err.message || err}`
          );
          process.exit(1);
        }
        console.log(`  \u2713 Forked ${claim.repoFullName} \u2192 ${forkFullName} and added remote 'fork'.`);
        ({ names: remoteNames, remotes } = await collectRemotes());
        pushRemote = selectPushRemote(remotes, claim.repoFullName, ghUser);
      }
    }
    if (!pushRemote) {
      noForkError();
      process.exit(1);
    }
  }
  const originRepo = pushRemote.repo;
  const upstream = claim.repoFullName;
  const head = `${ghUser}:${claim.branch}`;
  const title = flags.title || claim.title;
  const noBody = Boolean(flags["no-body"]);
  const prBodyPath = join10(wt, "PR-BODY.md");
  const bodySource = pickBodySource({
    bodyFileFlag: flags["body-file"],
    noBody,
    prBodyExists: existsSync6(prBodyPath)
  });
  let bodyText;
  let bodyDescr;
  if (bodySource === "body-file") {
    try {
      bodyText = readFileSync8(flags["body-file"], "utf8");
    } catch (err) {
      console.error(
        `terminalhire claim: could not read --body-file '${flags["body-file"]}': ${err.message ?? err}`
      );
      process.exit(1);
    }
    bodyDescr = `--body-file ${flags["body-file"]}`;
  } else if (bodySource === "pr-body") {
    bodyText = readFileSync8(prBodyPath, "utf8");
    bodyDescr = "PR-BODY.md (auto-detected)";
  } else {
    bodyDescr = "(default: Closes + disclosure)";
  }
  const noCloses = Boolean(flags["no-closes"]);
  console.log(`
  SUBMIT \xB7 ${claim.title}`);
  console.log(`  upstream: ${upstream}`);
  console.log(`  fork:     ${originRepo} (remote '${pushRemote.name}')`);
  console.log(`  branch:   ${claim.branch}`);
  console.log(`  head:     ${head}`);
  console.log(`  issue:    ${claim.issueUrl}`);
  console.log(`  title:    ${title}`);
  console.log(`  body:     ${bodyDescr} (+ disclosure)`);
  if (untrackedFiles.length > 0) {
    console.log(
      `  note:     ${untrackedFiles.length} untracked file(s) present (never pushed): ${untrackedFiles.join(", ")}`
    );
  }
  {
    const issueNo = (parseGitHubUrl(claim.issueUrl) || {}).number;
    const contention = issueNo ? await listOpenPRsReferencingIssue(claim.repoFullName, issueNo) : null;
    if (contention && contention.total > 0) {
      const nowMs = Date.now();
      console.log(`  \u26A0 contention: ${contention.total} open PR(s) already reference this issue:`);
      for (const pr of contention.prs) console.log(fmtContentionPr(pr, nowMs, false));
      console.log(CONTENTION_HINT);
      const competing = selectCompetingPrs(contention.prs, ghUser);
      if (competing.length > 0 && !flags["force-competing"]) {
        console.error(
          `
terminalhire claim: refusing to submit \u2014 ${competing.length} open PR(s) by someone else already address ${claim.repoFullName}#${issueNo}:`
        );
        for (const pr of competing) console.error(fmtContentionPr(pr, nowMs, false));
        console.error(
          "\n  Opening a competing PR reads as low-effort duplication and burns maintainer goodwill.\n  Stand down, or add value on the existing PR instead (a review, a test, a comment).\n  If you are certain yours should still go up, re-run with --force-competing."
        );
        process.exit(1);
      }
    }
  }
  let ok;
  if (flags.yes) {
    console.log("\n  --yes supplied \u2014 skipping interactive confirm.");
    ok = true;
  } else if (!process.stdin.isTTY) {
    console.error(
      "\nterminalhire claim: stdin is not a TTY \u2014 cannot ask for confirmation.\n  Re-run with --yes to confirm non-interactively (a human must type it;\n  agents/skills must never pass --yes)."
    );
    process.exit(1);
  } else {
    ok = await confirm(
      `
  Push '${claim.branch}' to ${originRepo} and open a PR against ${upstream}? (y/N) `
    );
  }
  if (!ok) {
    console.log("Aborted \u2014 nothing pushed.");
    return;
  }
  try {
    await sh("git", ["-C", wt, "push", pushRemote.name, claim.branch]);
  } catch (err) {
    console.error(
      `terminalhire claim: git push failed (NOT force-pushed). ${err.stderr || err.message || err}`
    );
    console.error(
      `  Resolve and retry, or open the PR manually then: terminalhire claim update ${id} submitted <prUrl>`
    );
    process.exit(1);
  }
  let prUrl = null;
  try {
    const out = await sh("gh", [
      "pr",
      "list",
      "--repo",
      upstream,
      "--head",
      claim.branch,
      "--state",
      "open",
      "--json",
      "url,headRepositoryOwner"
    ]);
    prUrl = pickExistingPr(JSON.parse(out || "[]"), ghUser);
    if (prUrl) console.log(`  Found existing open PR \u2014 adopting: ${prUrl}`);
  } catch {
  }
  if (!prUrl) {
    const issueNum = (parseGitHubUrl(claim.issueUrl) || {}).number;
    const body = buildSubmitBody(issueNum, { bodyText, noCloses });
    try {
      const out = await sh("gh", [
        "pr",
        "create",
        "--repo",
        upstream,
        "--head",
        head,
        "--title",
        title,
        "--body",
        body
      ]);
      prUrl = out.split("\n").map((l) => l.trim()).filter((l) => l.startsWith("https://github.com/")).pop() || null;
    } catch (err) {
      const stderrText = err.stderr || err.message || String(err);
      if (/already exists/i.test(stderrText)) {
        try {
          const retryOut = await sh("gh", [
            "pr",
            "list",
            "--repo",
            upstream,
            "--head",
            claim.branch,
            "--state",
            "open",
            "--json",
            "url,headRepositoryOwner"
          ]);
          const recovered = pickExistingPr(JSON.parse(retryOut || "[]"), ghUser);
          if (recovered) {
            prUrl = recovered;
            console.log(`  Found existing open PR \u2014 adopting: ${prUrl}`);
          }
        } catch {
        }
      }
      if (!prUrl) {
        console.error(
          `terminalhire claim: branch pushed, but 'gh pr create' failed. ${stderrText}`
        );
        console.error(
          `  Open the PR manually (gh pr create / web UI), then: terminalhire claim update ${id} submitted <prUrl>`
        );
        process.exit(1);
      }
    }
  }
  if (!prUrl || !parseGitHubUrl(prUrl)) {
    console.error(
      `terminalhire claim: could not determine the PR URL. Set it manually: terminalhire claim update ${id} submitted <prUrl>`
    );
    process.exit(1);
  }
  let review;
  try {
    if (defaultBranch) {
      const { scoreDiffAcceptance: scoreDiffAcceptance2 } = await Promise.resolve().then(() => (init_acceptance_score(), acceptance_score_exports));
      const numstat = await sh("git", [
        "-C",
        wt,
        "diff",
        "--numstat",
        `origin/${defaultBranch}...HEAD`
      ]);
      let filesChanged = 0;
      let linesChanged = 0;
      let touchesTests = false;
      for (const line of numstat.split("\n")) {
        const row = line.trim();
        if (!row) continue;
        const [added, deleted, ...pathParts] = row.split("	");
        const path = pathParts.join("	");
        filesChanged += 1;
        linesChanged += (added === "-" ? 0 : parseInt(added, 10) || 0) + (deleted === "-" ? 0 : parseInt(deleted, 10) || 0);
        if (/(^|\/)(tests?|__tests__|spec|specs)\//i.test(path) || /\.(test|spec)\./i.test(path))
          touchesTests = true;
      }
      const result = scoreDiffAcceptance2({
        competingOpenPRs: claim.openPRsAtClaim ?? 0,
        filesChanged,
        linesChanged,
        touchesTests,
        matchesIssueArea: null
        // issue-area match is not resolved at submit time
      });
      console.log(
        `  acceptance forecast: ${result.score.toFixed(2)} \u2014 ${result.reasons.map((r) => r.text).join(", ")}`
      );
      review = {
        verdict: claim.review?.verdict ?? null,
        blockers: claim.review?.blockers ?? [],
        acceptanceScore: result.score,
        acceptanceReasonCodes: result.reasons.map((r) => r.code)
      };
    }
  } catch {
  }
  claims.updateClaim(
    id,
    review ? { state: "submitted", prUrl, review } : { state: "submitted", prUrl }
  );
  console.log(`
\u2713 Submitted ${id} \u2192 ${prUrl}`);
  console.log(
    `  Run 'terminalhire claim status ${id}' after the maintainer acts to fold the merge into your accepted-PR rate.`
  );
}
function askYes(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(
    (res) => rl.question(question, (a) => {
      rl.close();
      res(String(a).trim().toLowerCase());
    })
  );
}
function claimSleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}
function readClaimPushMarker() {
  try {
    return existsSync6(CLAIM_PUSH_MARKER) ? JSON.parse(readFileSync8(CLAIM_PUSH_MARKER, "utf8")) : null;
  } catch {
    return null;
  }
}
function writeClaimPushMarker(marker) {
  ensureStateDir(TERMINALHIRE_DIR9);
  writeFileSync7(CLAIM_PUSH_MARKER, JSON.stringify(marker, null, 2) + "\n", "utf8");
}
function clearClaimPushMarker() {
  try {
    rmSync5(CLAIM_PUSH_MARKER);
  } catch {
  }
}
function renderClaimConsent(pushed, login) {
  console.log("");
  console.log("  terminalhire \u2014 show your claims on your dashboard (opt-in)");
  console.log("");
  console.log(
    `  As @${login}, the following SCORE-FREE fields of your ${pushed.length} claim${pushed.length === 1 ? "" : "s"}`
  );
  console.log("  will be shared with staqs (terminalhire.com) after you confirm in the browser:");
  console.log("");
  for (const f of PUSHED_CLAIM_FIELDS) console.log(`    - ${f}`);
  console.log("");
  console.log("  What is NEVER sent: your diff-acceptance score, review blockers,");
  console.log("  branch names, worktree paths, repo policy, amounts, or any private data.");
  console.log("");
  console.log("  Revoke any time: terminalhire claim --push --revoke");
  console.log("  This is NOT required to use terminalhire.");
  console.log("");
}
function renderAutoConsent() {
  console.log("");
  console.log("  keep your dashboard updated in the background (opt-in)");
  console.log("");
  console.log("  Terminal Hire will keep your dashboard updated in the background \u2014");
  console.log("  pushing the SAME score-free fields, at most once/day \u2014 until you run");
  console.log("  `terminalhire claim --push --revoke`.");
  console.log("");
  console.log("  This stores a push-only credential on this machine (encrypted). It can");
  console.log("  ONLY add/update your OWN dashboard rows \u2014 it can never read or delete.");
  console.log("  Nothing new is sent: the payload is identical to the manual push above.");
  console.log("");
}
function backgroundEnableFailed(autoConsent, pushToken) {
  return Boolean(autoConsent) && !pushToken;
}
function revokeFailureAction(status) {
  if (status === 404) {
    return { clearLocal: true, exitCode: 0 };
  }
  return { clearLocal: false, exitCode: 1 };
}
async function cmdPush({ keepUpdated = false } = {}) {
  const claimsMod = await Promise.resolve().then(() => (init_claims(), claims_exports));
  const { readProfile: readProfile2 } = await Promise.resolve().then(() => (init_profile(), profile_exports));
  const profile = await readProfile2();
  const login = profile.github && profile.github.login ? profile.github.login : null;
  if (!login) {
    console.log("\n  No GitHub data in your local profile yet.");
    console.log("  Run `terminalhire login` first, then re-run `terminalhire claim --push`.\n");
    process.exit(1);
  }
  const all = claimsMod.listClaims();
  if (all.length === 0) {
    console.log("\n  No claims recorded yet \u2014 nothing to push.");
    console.log("  Record one first: terminalhire claim record <bountyId|issueUrl>\n");
    process.exit(0);
  }
  const pushed = all.map((c) => claimsMod.toPushedClaim(c));
  renderClaimConsent(pushed, login);
  const answer = await askYes('  Share these with your dashboard? Type "yes" to confirm: ');
  if (answer !== "yes") {
    console.log("\n  Aborted \u2014 nothing was shared.\n");
    process.exit(0);
  }
  const consentedAt = (/* @__PURE__ */ new Date()).toISOString();
  let autoConsent = null;
  if (keepUpdated) {
    renderAutoConsent();
    const autoAnswer = await askYes('  Keep it updated in the background? Type "yes" to confirm: ');
    if (autoAnswer === "yes") {
      autoConsent = { version: AUTO_CONSENT_VERSION, consentedAt };
    } else {
      console.log("\n  Background updates NOT enabled \u2014 doing a one-time push instead.");
    }
  }
  console.log("\n  Starting browser verification...");
  let begin;
  try {
    const r = await fetch(`${CLAIM_SYNC_BASE}/api/claim-sync/begin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hostname: osHostname() }),
      signal: AbortSignal.timeout(1e4)
    });
    if (!r.ok) {
      let detail = "";
      try {
        detail = (await r.json())?.message || "";
      } catch {
      }
      console.error(
        `
  Could not start claim sync: /api/claim-sync/begin returned ${r.status}. ${detail}`
      );
      process.exit(1);
    }
    begin = await r.json();
  } catch (err) {
    console.error(
      `
  Could not start claim sync: ${err instanceof Error ? err.message : String(err)}`
    );
    process.exit(1);
  }
  const { challenge, verifyUrl } = begin || {};
  if (!challenge || !verifyUrl) {
    console.error("\n  Could not start claim sync: malformed begin response.");
    process.exit(1);
  }
  console.log("\n  Open this URL to authorize (sign in with GitHub, then Confirm):");
  console.log(`    ${verifyUrl}`);
  console.log("\n  (Attempting to open it automatically...)");
  openInBrowser(verifyUrl);
  console.log("  Waiting for browser verification...");
  const deadline = Date.now() + CLAIM_POLL_TIMEOUT_MS;
  let proofToken = null;
  while (Date.now() < deadline) {
    await claimSleep(CLAIM_POLL_INTERVAL_MS);
    let statusRes;
    try {
      statusRes = await fetch(
        `${CLAIM_SYNC_BASE}/api/claim-sync/status?challenge=${encodeURIComponent(challenge)}`,
        { signal: AbortSignal.timeout(1e4) }
      );
    } catch {
      continue;
    }
    if (!statusRes.ok) continue;
    let body;
    try {
      body = await statusRes.json();
    } catch {
      continue;
    }
    if (body && body.status === "verified" && body.proofToken) {
      proofToken = body.proofToken;
      break;
    }
  }
  if (!proofToken) {
    console.error("\n  Timed out waiting for browser verification (10 min).");
    console.error("  Re-run `terminalhire claim --push` to try again.\n");
    process.exit(1);
  }
  const consentReceipt = {
    consentedAt,
    version: CLAIM_CONSENT_VERSION,
    fields: PUSHED_CLAIM_FIELDS
  };
  console.log("\n  Verified. Sharing your claims...");
  let res;
  try {
    res = await fetch(`${CLAIM_SYNC_BASE}/api/claim-sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // autoConsent is included ONLY when the dev opted into background updates —
      // the server mints the pushToken in the same push when it is present + valid.
      body: JSON.stringify({
        consentToken: consentReceipt,
        claims: pushed,
        proofToken,
        ...autoConsent ? { autoConsent } : {}
      }),
      signal: AbortSignal.timeout(1e4)
    });
  } catch (err) {
    console.error(`
  Claim sync failed: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  }
  if (!res.ok) {
    let detail = "";
    try {
      detail = (await res.json())?.message || "";
    } catch {
    }
    console.error(`
  Claim sync failed: /api/claim-sync returned ${res.status}. ${detail}`);
    process.exit(1);
  }
  let deleteToken = null;
  let pushToken = null;
  try {
    const body = await res.json();
    deleteToken = body?.deleteToken || null;
    pushToken = body?.pushToken || null;
  } catch {
  }
  writeClaimPushMarker({
    consentedAt,
    login,
    deleteToken,
    lastPushedAt: consentedAt,
    lastSnapshotHash: computeSnapshotHash(pushed)
  });
  if (autoConsent && pushToken) {
    try {
      await writePushTokenEnc(pushToken);
      writeAutoMarker({
        autoConsentedAt: consentedAt,
        version: AUTO_CONSENT_VERSION,
        login,
        lastPushedAt: consentedAt,
        lastSnapshotHash: computeSnapshotHash(pushed)
      });
      console.log("\n  \u2713 Background updates enabled \u2014 your dashboard will stay current");
      console.log("    (at most once/day). Stop any time: terminalhire claim --push --revoke");
    } catch {
      console.log("\n  \u2713 Pushed, but could not enable background updates on this machine.");
      console.log("    Re-run `terminalhire claim --push --keep-updated` to retry.");
    }
  } else if (backgroundEnableFailed(autoConsent, pushToken)) {
    console.log(
      "\n  \u2713 Pushed, but background updates could NOT be enabled (server did not issue a token)."
    );
    console.log("    Re-run `terminalhire claim --push --keep-updated` to retry.");
  }
  console.log("\n  \u2713 Your claims now show on your dashboard: https://terminalhire.com/dashboard");
  console.log("  Delete them any time: terminalhire claim --push --revoke\n");
}
async function cmdRevoke() {
  const marker = readClaimPushMarker();
  console.log("\n  This hard-deletes your pushed claims from staqs (terminalhire.com)");
  console.log("  and removes the local marker. There is no soft-delete.\n");
  const answer = await askYes('  Delete your pushed claims? Type "yes" to confirm: ');
  if (answer !== "yes") {
    console.log("\n  Aborted \u2014 nothing was deleted.\n");
    process.exit(0);
  }
  const login = marker && marker.login ? marker.login : null;
  const deleteToken = marker && marker.deleteToken ? marker.deleteToken : null;
  if (!login || !deleteToken) {
    clearPushTokenEnc();
    clearAutoMarker();
    console.log("\n  No claim-push marker found on this machine.");
    console.log(
      "  Deletion must run from the machine that pushed (the delete token is stored there),"
    );
    console.log('  or use the "delete my pushed claims" button on your dashboard.\n');
    process.exit(1);
  }
  console.log("\n  Requesting deletion...");
  let res;
  try {
    res = await fetch(`${CLAIM_SYNC_BASE}/api/claim-sync`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, deleteToken }),
      signal: AbortSignal.timeout(1e4)
    });
  } catch (err) {
    console.error(`
  Delete failed: ${err instanceof Error ? err.message : String(err)}`);
    console.error("  Local marker NOT cleared (server state unknown). Re-run to retry.\n");
    process.exit(1);
  }
  if (!res.ok) {
    const action = revokeFailureAction(res.status);
    if (action.clearLocal) {
      clearClaimPushMarker();
      clearPushTokenEnc();
      clearAutoMarker();
      console.log(
        `
  Nothing to delete server-side (${res.status}); local marker and background updates cleared.
`
      );
      console.log("  Background updates (if any) have been stopped.\n");
    } else if (res.status === 401 || res.status === 403) {
      console.error(
        `
  Server refused the delete (${res.status}); local marker NOT cleared \u2014 the pushToken may still be live.`
      );
      console.error("  Re-authenticate (terminalhire login) and retry.\n");
    } else {
      console.error(`
  Delete failed: /api/claim-sync returned ${res.status}.`);
      console.error("  Local marker NOT cleared (server state unknown). Re-run to retry.\n");
    }
    process.exit(action.exitCode);
  }
  clearClaimPushMarker();
  clearPushTokenEnc();
  clearAutoMarker();
  console.log("\n  \u2713 Pushed claims deleted and local marker cleared.\n");
  console.log("  Background updates (if any) have been stopped.\n");
}
function renderAudit(view) {
  const roleLabel = {
    you: "you",
    maintainer: "maintainer",
    contributor: "contributor",
    outside: "outside",
    bot: "bot",
    unknown: "\u2014"
  };
  const eventLabel = {
    pr_opened: "opened PR",
    review_submitted: "reviewed",
    issue_comment: "commented",
    commit_pushed: "pushed commit",
    pr_merged: "merged",
    pr_closed_unmerged: "closed (unmerged)"
  };
  const outcomeLabel = {
    merged: "\u2714 merged",
    closed_unmerged: "\u2715 closed without merge",
    open: "\u2026 still open"
  };
  const hrs = (h) => h == null ? "\u2014" : `${h}h`;
  console.log(`
  Audit \u2014 ${view.repo || "repo"} #${view.prNumber}`);
  console.log(`  ${view.prUrl}`);
  console.log(`  Outcome: ${outcomeLabel[view.outcome] ?? view.outcome}`);
  console.log("\n  Engagement (raw counts \u2014 not a score):");
  console.log(`    Independent counterparties engaged : ${view.signals.distinctCounterparties}`);
  console.log(`    Maintainer reviews                 : ${view.signals.maintainerReviews}`);
  console.log(
    `    Your commits after first response  : ${view.signals.iterationsAfterFirstResponse}`
  );
  console.log(`    Time to first maintainer response  : ${hrs(view.signals.hoursToFirstResponse)}`);
  console.log(`    Time to merge                      : ${hrs(view.signals.hoursToMerge)}`);
  console.log("\n  Timeline:");
  if (view.timeline.length === 0) {
    console.log("    (no events captured)");
  } else {
    for (const e of view.timeline) {
      console.log(`    ${e.at}  ${roleLabel[e.role] ?? e.role} ${eventLabel[e.event] ?? e.event}`);
    }
  }
  if (view.notes.length > 0) {
    console.log("\n  Notes:");
    for (const n of view.notes) console.log(`    \u26A0 ${n}`);
  }
  console.log("\n  What this does NOT measure:");
  for (const l of view.limitations || []) console.log(`    \xB7 ${l}`);
  console.log("");
}
async function cmdAudit(id, flags = {}) {
  if (!id) {
    console.error("terminalhire claim audit: needs a claim id. Try `terminalhire claim list`.");
    process.exit(1);
  }
  const claims = await Promise.resolve().then(() => (init_claims(), claims_exports));
  const claim = claims.findClaim(id);
  if (!claim) {
    console.error(`No claim with id '${id}'.`);
    process.exit(1);
  }
  if (!claim.prUrl) {
    console.log(
      `Claim '${id}' has no submitted PR yet \u2014 nothing to audit. Submit first: terminalhire claim submit ${id}`
    );
    return;
  }
  const { resolveCallerIdentity: resolveCallerIdentity2 } = await Promise.resolve().then(() => (init_identity(), identity_exports));
  const identity = await resolveCallerIdentity2();
  if (!identity) {
    console.error(
      "terminalhire claim audit: could not verify your GitHub identity (`gh api user`). Run `gh auth login` and retry."
    );
    process.exit(1);
  }
  let token;
  try {
    token = await sh("gh", ["auth", "token"]);
  } catch {
    token = void 0;
  }
  const { gatherAudit: gatherAudit2 } = await Promise.resolve().then(() => (init_fetch(), fetch_exports));
  const { lifecycle, facts } = await gatherAudit2(claim.prUrl, token || void 0);
  if (!lifecycle) {
    console.error(
      `terminalhire claim audit: could not fetch the PR lifecycle for ${claim.prUrl} (private, deleted, rate-limited, or not a PR).`
    );
    process.exit(1);
  }
  if (lifecycle.authorId !== identity.id) {
    console.error(
      `terminalhire claim audit: PR ${claim.prUrl} was not authored by you (@${identity.login}); the audit only covers your own PRs.`
    );
    process.exit(1);
  }
  const { buildAuditView: buildAuditView2 } = await Promise.resolve().then(() => (init_audit(), audit_exports));
  const view = buildAuditView2(lifecycle, facts);
  if (flags.remember) {
    try {
      const { recordAuditSample: recordAuditSample2 } = await Promise.resolve().then(() => (init_repo_experience(), repo_experience_exports));
      await recordAuditSample2(claim.repoFullName, view.signals, view.completeness);
    } catch {
    }
  }
  if (flags.json) {
    console.log(JSON.stringify(view, null, 2));
    return;
  }
  renderAudit(view);
}
async function run() {
  const verb = process.argv[2];
  const rawArgs = process.argv.slice(3).map((a) => a === "-y" ? "--yes" : a);
  const { flags, positional } = parseArgs(rawArgs);
  const active = Boolean(flags.active);
  const json = Boolean(flags.json);
  if (verb === "--push") {
    if (flags.revoke) await cmdRevoke();
    else await cmdPush({ keepUpdated: Boolean(flags["keep-updated"]) });
    return;
  }
  if (isVerblessShortRefClaim(verb, positional)) {
    await cmdRecord(verb, flags);
    return;
  }
  if (isStrayArgShortRefClaim(verb, positional)) {
    console.error(
      `terminalhire claim: '${verb}' is a short ref and takes no extra arguments (got: ${positional.join(" ")}). Did you mean \`terminalhire claim ${verb}\`?`
    );
    process.exit(1);
  }
  try {
    switch (verb) {
      case "preview":
        await cmdPreview(positional[0], { json });
        break;
      case "record":
        await cmdRecord(positional[0], flags);
        break;
      case "start":
        await cmdStart(positional[0], flags);
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
        await cmdSubmit(positional[0], flags);
        break;
      case "release":
        await cmdRelease(positional[0]);
        break;
      case "audit":
        await cmdAudit(positional[0], flags);
        break;
      default:
        console.error(
          `terminalhire claim: unknown verb '${verb ?? ""}'. Expected: preview | record | start | attach | list | status | update | submit | audit | release`
        );
        process.exit(1);
    }
  } catch (err) {
    console.error("terminalhire claim error:", err.message ?? err);
    process.exit(1);
  }
}
export {
  AI_DISCLOSURE_NOTE,
  CLAIM_CONSENT_VERSION,
  backgroundEnableFailed,
  buildAssignmentComment,
  buildSubmitBody,
  cmdRecord,
  countOpenPRsReferencingIssue,
  diffContention,
  explicitForkConsent,
  findClaimableByShortRef,
  findClaimableInCache,
  fmtAge,
  fmtContestedWarning,
  isContested,
  isStrayArgShortRefClaim,
  isVerblessShortRefClaim,
  listOpenPRsReferencingIssue,
  matchReferencingPrs,
  pickBodySource,
  pickExistingPr,
  resolveBounty,
  resolveSubmitWorktree,
  revokeFailureAction,
  run,
  selectCompetingPrs,
  selectPushRemote,
  shouldRequestAssignment,
  startBranchFor,
  workDirFor
};
/*! Bundled license information:

@noble/hashes/esm/utils.js:
  (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/utils.js:
@noble/curves/esm/abstract/modular.js:
@noble/curves/esm/abstract/curve.js:
@noble/curves/esm/abstract/edwards.js:
@noble/curves/esm/abstract/montgomery.js:
@noble/curves/esm/ed25519.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/ciphers/esm/utils.js:
  (*! noble-ciphers - MIT License (c) 2023 Paul Miller (paulmillr.com) *)
*/
