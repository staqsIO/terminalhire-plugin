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
var FARM_REPO_DENYLIST, CURATION_EXCLUDED_REPOS, EXCLUDED_LC, AI_BAN_DENYLIST, AI_BAN_LC, MAX_BOUNTIES_PER_DISCOVERED_REPO;
var init_bounty_gate = __esm({
  "../../packages/core/src/feeds/bounty-gate.ts"() {
    "use strict";
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
    MAX_BOUNTIES_PER_DISCOVERED_REPO = 3;
  }
});

// ../../packages/core/src/feeds/contribution-gate.ts
function passesContributionGate(input) {
  if (input.contributors === void 0) return false;
  if (isAiBanRepo(input.fullName)) return false;
  return input.stars >= MIN_STARS && input.contributors >= MIN_CONTRIBUTORS && !TRIVIAL_PR_TITLE.test(input.title) && !input.archived && !input.fork;
}
var MIN_STARS, MIN_CONTRIBUTORS, TRIVIAL_PR_TITLE;
var init_contribution_gate = __esm({
  "../../packages/core/src/feeds/contribution-gate.ts"() {
    "use strict";
    init_bounty_gate();
    MIN_STARS = 50;
    MIN_CONTRIBUTORS = 10;
    TRIVIAL_PR_TITLE = /^\s*(fix\s+typo|typo\b|update\s+readme|readme\b|docs?:|docs?\(|chore:|chore\(|style:|ci:|build:|bump\b|update\s+dependenc)/i;
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
function bestAcceptanceDomain(cred, domains) {
  if (cred.status !== "ok") return null;
  let best = null;
  for (const d of domains) {
    const count = cred.byDomain[d]?.mergedPRs ?? 0;
    if (count > 0 && (best === null || count > best.count)) best = { domain: d, count };
  }
  return best;
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
var RESUME_DECAY_HALF_LIFE_MS, GITHUB_GRAPHQL_URL;
var init_github = __esm({
  "../../packages/core/src/github.ts"() {
    "use strict";
    init_vocabulary();
    init_contribution_gate();
    init_contribution_gate();
    init_contribution_classify();
    init_rigor();
    init_gh_governor();
    RESUME_DECAY_HALF_LIFE_MS = 30 * 24 * 60 * 60 * 1e3;
    GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";
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
function inferSeniority(title) {
  if (!ENG_TITLE.test(title)) return void 0;
  for (const [re, level] of SENIORITY_PATTERNS) {
    if (re.test(title)) return level;
  }
  return void 0;
}
function seniorityScore(fp, job) {
  if (!fp.seniorityBand) return 1;
  const jobLevel = inferSeniority(job.title);
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
  const ageDays = (now - ms) / 864e5;
  if (ageDays < 7) return 1;
  if (ageDays < 30) return 0.9;
  if (ageDays < 90) return 0.75;
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
var init_greenhouse = __esm({
  "../../packages/core/src/feeds/greenhouse.ts"() {
    "use strict";
    init_vocabulary();
    init_http();
  }
});

// ../../packages/core/src/feeds/ashby.ts
var init_ashby = __esm({
  "../../packages/core/src/feeds/ashby.ts"() {
    "use strict";
    init_vocabulary();
    init_http();
  }
});

// ../../packages/core/src/feeds/lever.ts
var init_lever = __esm({
  "../../packages/core/src/feeds/lever.ts"() {
    "use strict";
    init_vocabulary();
    init_http();
  }
});

// ../../packages/core/src/feeds/himalayas.ts
var init_himalayas = __esm({
  "../../packages/core/src/feeds/himalayas.ts"() {
    "use strict";
    init_vocabulary();
    init_http();
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
var init_wwr = __esm({
  "../../packages/core/src/feeds/wwr.ts"() {
    "use strict";
    init_vocabulary();
    init_entities();
    init_http();
  }
});

// ../../packages/core/src/feeds/hn.ts
var init_hn = __esm({
  "../../packages/core/src/feeds/hn.ts"() {
    "use strict";
    init_vocabulary();
    init_entities();
    init_http();
  }
});

// ../../packages/core/src/concurrency.ts
var init_concurrency = __esm({
  "../../packages/core/src/concurrency.ts"() {
    "use strict";
  }
});

// ../../packages/core/src/feeds/effort.ts
var init_effort = __esm({
  "../../packages/core/src/feeds/effort.ts"() {
    "use strict";
  }
});

// ../../packages/core/src/feeds/github-bounties.ts
function isAssigned(issue) {
  return !!issue.assignee || (issue.assignees?.length ?? 0) > 0;
}
var init_github_bounties = __esm({
  "../../packages/core/src/feeds/github-bounties.ts"() {
    "use strict";
    init_vocabulary();
    init_entities();
    init_bounty_gate();
    init_http();
    init_concurrency();
    init_effort();
  }
});

// ../../packages/core/src/feeds/opire.ts
var init_opire = __esm({
  "../../packages/core/src/feeds/opire.ts"() {
    "use strict";
    init_vocabulary();
    init_bounty_gate();
    init_github_bounties();
    init_http();
    init_effort();
  }
});

// ../../packages/core/src/feeds/workable.ts
var init_workable = __esm({
  "../../packages/core/src/feeds/workable.ts"() {
    "use strict";
    init_vocabulary();
    init_http();
  }
});

// ../../packages/core/src/feeds/directory.ts
var init_directory = __esm({
  "../../packages/core/src/feeds/directory.ts"() {
    "use strict";
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
function authHeaders(token) {
  const bearer = token ?? process.env["GITHUB_TOKEN"] ?? process.env["GH_TOKEN"];
  const h = {
    Accept: "application/vnd.github+json",
    "User-Agent": "terminalhire",
    "X-GitHub-Api-Version": "2022-11-28"
  };
  if (bearer) h["Authorization"] = `Bearer ${bearer}`;
  return h;
}
function tokenize2(text) {
  return text.toLowerCase().replace(/[^a-z0-9.\-+#]/g, " ").split(/\s+/).filter(Boolean);
}
function labelNames(labels) {
  return (labels ?? []).map((l) => typeof l === "string" ? l : l.name ?? "").filter(Boolean);
}
function repoFullNameFromApiUrl(url) {
  const m = url.match(/\/repos\/([^/]+)\/([^/]+)\/?$/);
  return m ? `${m[1]}/${m[2]}` : null;
}
function makeClient(fetchImpl, cfg, token) {
  const gov = makeGitHubGovernor(fetchImpl, cfg);
  const effectiveToken = token ?? process.env["GITHUB_TOKEN"] ?? process.env["GH_TOKEN"];
  const headers = authHeaders(effectiveToken);
  async function raw(path) {
    return gov.get(`${GITHUB_API}${path}`, { headers });
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
    return gov.probe(`${GITHUB_API}${path}`, { headers });
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
        `/search/issues?q=${encodeURIComponent(q)}&sort=created&order=desc&per_page=${SEARCH_PER_PAGE}&page=${page}`
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
      if (items.length < SEARCH_PER_PAGE) break;
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
    const fullName = repoFullNameFromApiUrl(issue.repository_url);
    if (!fullName) continue;
    const id = `contribute:${repoKey(fullName)}#${issue.number}`;
    if (seen.has(id)) continue;
    if (isExcludedRepo(fullName)) continue;
    if (isAssigned(issue)) continue;
    if ((perRepo.get(repoKey(fullName)) ?? 0) >= MAX_BOUNTIES_PER_DISCOVERED_REPO) continue;
    const title = decodeEntities(issue.title).trim();
    const body = issue.body ? decodeEntities(issue.body) : "";
    const labels = labelNames(issue.labels);
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
      tokenize2([title, repo.language ?? "", labels.join(" "), body.slice(0, 2e3)].join(" "))
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
        `/search/issues?q=${encodeURIComponent(q)}&sort=created&order=desc&per_page=${SEARCH_PER_PAGE}`
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
        const labels = labelNames(issue.labels);
        if (looksLikeContentTask({ title, body, labels })) continue;
        const prRefs = await repoPRRefs(fullName);
        if (prRefs === null) prRefsNull++;
        const openPRsAtDiscovery = prRefs ? prRefs.has(issue.number) ? 1 : 0 : void 0;
        const tags = normalize(
          tokenize2([title, repo.language ?? "", labels.join(" "), body.slice(0, 2e3)].join(" "))
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
var GITHUB_API, CONTRIB_LABEL_QUERIES, CONTRIB_LANGUAGE_QUERIES, CONTRIB_SEARCH_QUERIES, SEARCH_PER_PAGE, DEFAULT_SEARCH_MAX_PAGES, MIN_SEARCH_MAX_PAGES, MAX_SEARCH_MAX_PAGES, DEFAULT_MAX_CONTRIB_ITEMS, MIN_MAX_CONTRIB_ITEMS, MAX_MAX_CONTRIB_ITEMS, DEFAULT_MAX_CONTRIB_ISSUES_SCANNED, MIN_MAX_CONTRIB_ISSUES_SCANNED, MAX_MAX_CONTRIB_ISSUES_SCANNED, MAX_DISCOVERED_REPOS, MAX_ISSUES_PER_DISCOVERED_REPO, DISCOVERY_REPOS_PER_TERM, DISCOVERY_VOCAB_TERMS, DISCOVERY_ISSUE_LABELS, repoKey;
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
    GITHUB_API = "https://api.github.com";
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
    SEARCH_PER_PAGE = 100;
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
var WINNABILITY_NORM;
var init_winnability = __esm({
  "../../packages/core/src/winnability.ts"() {
    "use strict";
    WINNABILITY_NORM = {
      /** ~500 new stars in a build interval is treated as "maxed" momentum. */
      starVelocity: 500,
      /** ~10 HN mentions is treated as "maxed" social. */
      socialMentions: 10,
      /** log(stars) ceiling — ~100k-star repos saturate the absolute-traction floor. */
      starsLog: Math.log(1e5)
    };
  }
});

// ../../packages/core/src/feeds/projectCuration.ts
var CURATION_WEIGHTS, CURATION_NORM;
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
  }
});

// ../../packages/core/src/feeds/index.ts
function flattenTiers(t) {
  return [.../* @__PURE__ */ new Set([...t.bigco, ...t.scaleup, ...t.startup])];
}
var GREENHOUSE_SLUGS_BY_TIER, ASHBY_SLUGS_BY_TIER, LEVER_SLUGS_BY_TIER, DEFAULT_GREENHOUSE_SLUGS, DEFAULT_ASHBY_SLUGS, DEFAULT_LEVER_SLUGS, BIGCO_SLUGS_BY_SOURCE;
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
var init_github_issue_status = __esm({
  "../../packages/core/src/github-issue-status.ts"() {
    "use strict";
    init_gh_governor();
  }
});

// ../../packages/core/src/credit.ts
var init_credit = __esm({
  "../../packages/core/src/credit.ts"() {
    "use strict";
  }
});

// ../../packages/core/src/intro.ts
var INTRO_ALLOWED_FIELDS, INTRO_ALLOWED_SET, INTRO_PENDING_TTL_MS, INTRO_ACCEPTED_TTL_MS;
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
    INTRO_PENDING_TTL_MS = 30 * 24 * 60 * 60 * 1e3;
    INTRO_ACCEPTED_TTL_MS = 365 * 24 * 60 * 60 * 1e3;
  }
});

// ../../packages/core/src/directoryThreshold.ts
var init_directoryThreshold = __esm({
  "../../packages/core/src/directoryThreshold.ts"() {
    "use strict";
  }
});

// ../../packages/core/src/chatCrypto.ts
import { hkdfSync, createHash, randomBytes } from "crypto";
var KDF_INFO;
var init_chatCrypto = __esm({
  "../../packages/core/src/chatCrypto.ts"() {
    "use strict";
    KDF_INFO = Buffer.from("terminalhire-chat-v1");
  }
});

// ../../packages/core/src/job-status.ts
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
var init_recency_split = __esm({
  "../../packages/core/src/episodes/derivers/recency-split.ts"() {
    "use strict";
    init_doors();
    init_signals();
  }
});

// ../../packages/core/src/credential/legible.ts
var init_legible = __esm({
  "../../packages/core/src/credential/legible.ts"() {
    "use strict";
    init_contribution_gate();
    init_vocabulary();
    init_recency_split();
  }
});

// ../../packages/core/src/credential/legible-trajectory.ts
var init_legible_trajectory = __esm({
  "../../packages/core/src/credential/legible-trajectory.ts"() {
    "use strict";
  }
});

// ../../packages/core/src/credential/sources.ts
var SOURCE_CLASS, HUMAN_SET;
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
  }
});

// ../../packages/core/src/credential/independence.ts
var init_independence = __esm({
  "../../packages/core/src/credential/independence.ts"() {
    "use strict";
  }
});

// ../../packages/core/src/credential/redaction.ts
var init_redaction = __esm({
  "../../packages/core/src/credential/redaction.ts"() {
    "use strict";
  }
});

// ../../packages/core/src/credential/decisions.ts
var init_decisions = __esm({
  "../../packages/core/src/credential/decisions.ts"() {
    "use strict";
  }
});

// ../../packages/core/src/credential/metrics-hygiene.ts
var init_metrics_hygiene = __esm({
  "../../packages/core/src/credential/metrics-hygiene.ts"() {
    "use strict";
  }
});

// ../../packages/core/src/credential/dossier.ts
var init_dossier = __esm({
  "../../packages/core/src/credential/dossier.ts"() {
    "use strict";
    init_sources();
    init_independence();
    init_decisions();
    init_metrics_hygiene();
  }
});

// ../../packages/core/src/credential/synthesis.ts
var COMPETENCY_NAMES, COMPETENCY_NAME_SET, COMPETENCY_GRADES, COMPETENCY_GRADE_SET, CITATION_CONTRACT, VERIFY_CONTRACT;
var init_synthesis = __esm({
  "../../packages/core/src/credential/synthesis.ts"() {
    "use strict";
    COMPETENCY_NAMES = [
      "code-authorship",
      "iterative-refinement",
      "independent-review",
      "defect-resolution",
      "repository-standing",
      "issue-linkage"
    ];
    COMPETENCY_NAME_SET = new Set(COMPETENCY_NAMES);
    COMPETENCY_GRADES = [
      "high",
      "medium",
      "process",
      "no-signal"
    ];
    COMPETENCY_GRADE_SET = new Set(COMPETENCY_GRADES);
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
var init_short_token = __esm({
  "../../packages/core/src/short-token.ts"() {
    "use strict";
  }
});

// ../../packages/core/src/index.ts
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

// src/crypto-store.ts
import { createCipheriv, createDecipheriv, randomBytes as randomBytes2 } from "crypto";
import { readFileSync as readFileSync4, writeFileSync as writeFileSync3, existsSync as existsSync2, renameSync as renameSync2, rmSync } from "fs";
import { join as join4, dirname, basename } from "path";
import { homedir as homedir3 } from "os";
import { createRequire } from "module";
function encrypt(plaintext, key) {
  const iv = randomBytes2(IV_BYTES);
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
  const decipher = createDecipheriv(ALGO, key, Buffer.from(blob.iv, "hex"));
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
    const key = randomBytes2(KEY_BYTES);
    await kt.setPassword(KEYTAR_SERVICE, KEYTAR_ACCOUNT, key.toString("hex"));
    return key;
  } catch {
    return null;
  }
}
function loadOrCreateFileKey() {
  ensureStateDir(TERMINALHIRE_DIR3);
  if (existsSync2(KEY_FILE)) {
    return Buffer.from(readFileSync4(KEY_FILE, "utf8").trim(), "hex");
  }
  const key = randomBytes2(KEY_BYTES);
  writeFileSync3(KEY_FILE, key.toString("hex"), { mode: 384, encoding: "utf8" });
  return key;
}
function warnStderr(message) {
  process.stderr.write(`${message}
`);
}
function atomicWriteFileSync(filePath, content) {
  const dir = dirname(filePath);
  ensureStateDir(dir);
  const tmp = join4(
    dir,
    `.${basename(filePath)}.tmp-${process.pid}-${randomBytes2(6).toString("hex")}`
  );
  writeFileSync3(tmp, content, { encoding: "utf8", mode: 384 });
  renameSync2(tmp, filePath);
}
async function deleteKey() {
  for (const filePath of dependentStoreFiles) {
    try {
      rmSync(filePath);
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
    rmSync(KEY_FILE);
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
    if (!existsSync2(filePath)) return opts.blank();
    try {
      const raw = readFileSync4(filePath, "utf8");
      const blob = JSON.parse(raw);
      const plaintext = decrypt(blob, key);
      return JSON.parse(plaintext);
    } catch {
      warnStderr(`crypto-store: failed to decrypt ${filePath} \u2014 returning blank`);
      return opts.blank();
    }
  }
  async function write(value) {
    const key = await resolveKey(filePath, opts);
    if (!key) return;
    const blob = encrypt(JSON.stringify(value), key);
    atomicWriteFileSync(filePath, JSON.stringify(blob, null, 2));
  }
  return { read, write };
}
var TERMINALHIRE_DIR3, KEY_FILE, KEYTAR_SERVICE, KEYTAR_ACCOUNT, ALGO, KEY_BYTES, IV_BYTES, forceKeytarUnavailableForTests, dependentStoreFiles;
var init_crypto_store = __esm({
  "src/crypto-store.ts"() {
    "use strict";
    init_state_dir();
    TERMINALHIRE_DIR3 = process.env.TERMINALHIRE_DIR || join4(homedir3(), ".terminalhire");
    KEY_FILE = join4(TERMINALHIRE_DIR3, "key");
    KEYTAR_SERVICE = "terminalhire";
    KEYTAR_ACCOUNT = "profile-key";
    ALGO = "aes-256-gcm";
    KEY_BYTES = 32;
    IV_BYTES = 12;
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
import { join as join5 } from "path";
import { homedir as homedir4 } from "os";
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
var TERMINALHIRE_DIR4, PROFILE_FILE, profileStore, LANGUAGE_TAGS, MIN_FINGERPRINT_SCORE;
var init_profile = __esm({
  "src/profile.ts"() {
    "use strict";
    init_src();
    init_crypto_store();
    TERMINALHIRE_DIR4 = process.env.TERMINALHIRE_DIR || join5(homedir4(), ".terminalhire");
    PROFILE_FILE = join5(TERMINALHIRE_DIR4, "profile.enc");
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

// src/github-auth.ts
var github_auth_exports = {};
__export(github_auth_exports, {
  GITHUB_SCOPE: () => GITHUB_SCOPE,
  decrypt: () => decrypt2,
  deleteGitHubToken: () => deleteGitHubToken,
  encrypt: () => encrypt2,
  hasGitHubToken: () => hasGitHubToken,
  loadKey: () => loadKey,
  readGitHubToken: () => readGitHubToken,
  resolveStoredLogin: () => resolveStoredLogin,
  runDeviceFlow: () => runDeviceFlow,
  writeGitHubToken: () => writeGitHubToken
});
import { createCipheriv as createCipheriv2, createDecipheriv as createDecipheriv2, randomBytes as randomBytes3 } from "crypto";
import { readFileSync as readFileSync5, writeFileSync as writeFileSync4, existsSync as existsSync3, rmSync as rmSync2, renameSync as renameSync3 } from "fs";
import { join as join6 } from "path";
import { homedir as homedir5 } from "os";
async function loadKey() {
  ensureStateDir(TERMINALHIRE_DIR5);
  if (existsSync3(KEY_FILE2)) {
    return Buffer.from(readFileSync5(KEY_FILE2, "utf8").trim(), "hex");
  }
  const key = randomBytes3(KEY_BYTES2);
  writeFileSync4(KEY_FILE2, key.toString("hex"), { mode: 384, encoding: "utf8" });
  return key;
}
function encrypt2(plaintext, key) {
  const iv = randomBytes3(IV_BYTES2);
  const cipher = createCipheriv2(ALGO2, key, iv);
  const ct = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return { iv: iv.toString("hex"), tag: tag.toString("hex"), ciphertext: ct.toString("hex") };
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
async function readGitHubToken() {
  if (!existsSync3(TOKEN_FILE)) return void 0;
  try {
    const key = await loadKey();
    const raw = readFileSync5(TOKEN_FILE, "utf8");
    const blob = JSON.parse(raw);
    return decrypt2(blob, key);
  } catch {
    return void 0;
  }
}
async function writeGitHubToken(token) {
  ensureStateDir(TERMINALHIRE_DIR5);
  const key = await loadKey();
  const blob = encrypt2(token, key);
  const tmpFile = `${TOKEN_FILE}.${process.pid}.${randomBytes3(6).toString("hex")}.tmp`;
  try {
    writeFileSync4(tmpFile, JSON.stringify(blob, null, 2), {
      encoding: "utf8",
      mode: 384,
      flag: "wx"
    });
    renameSync3(tmpFile, TOKEN_FILE);
  } catch (err) {
    try {
      rmSync2(tmpFile, { force: true });
    } catch {
    }
    throw err;
  }
}
async function deleteGitHubToken() {
  try {
    rmSync2(TOKEN_FILE);
  } catch {
  }
}
async function hasGitHubToken() {
  return existsSync3(TOKEN_FILE);
}
async function runDeviceFlow() {
  if (process.env["TERMINALHIRE_GITHUB_MOCK"] === "1" || process.env["TERMINALHIRE_GITHUB_MOCK"] === "1" || process.env["JPI_GITHUB_MOCK"] === "1") {
    console.log("\n[mock] GitHub OAuth skipped (JPI_GITHUB_MOCK=1)");
    console.log(`[mock] Using fixture profile: ${MOCK_LOGIN}`);
    await writeGitHubToken(MOCK_TOKEN);
    return MOCK_LOGIN;
  }
  const clientId = process.env["GITHUB_DEVICE_CLIENT_ID"] ?? process.env["GITHUB_CLIENT_ID"] ?? BAKED_IN_CLIENT_ID;
  if (clientId === "Iv1.PLACEHOLDER_REGISTER_YOUR_APP") {
    console.warn("\nWarning: GITHUB_CLIENT_ID env var looks like a placeholder.");
    console.warn(
      "Remove it to use the baked-in client ID, or set it to your own OAuth App Client ID.\n"
    );
  }
  const deviceRes = await fetch(DEVICE_CODE_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({ client_id: clientId, scope: GITHUB_SCOPE }).toString(),
    signal: AbortSignal.timeout(15e3)
  });
  if (!deviceRes.ok) {
    throw new Error(`GitHub device code request failed: HTTP ${deviceRes.status}`);
  }
  const deviceData = await deviceRes.json();
  console.log("");
  console.log("  GitHub sign-in (device flow)");
  console.log("  \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500");
  console.log(`  1. Open: ${deviceData.verification_uri}`);
  console.log(`  2. Enter code: ${deviceData.user_code}`);
  console.log('  3. Authorize "Terminalhire" (scope: read:user \u2014 public data only)');
  console.log("  \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500");
  console.log("  Waiting for authorization...");
  console.log("");
  let intervalSecs = deviceData.interval ?? 5;
  const expiresAt = Date.now() + (deviceData.expires_in ?? 900) * 1e3;
  const clientSecret = process.env["GITHUB_CLIENT_SECRET"];
  while (Date.now() < expiresAt) {
    await sleep(intervalSecs * 1e3);
    const body = new URLSearchParams({
      client_id: clientId,
      device_code: deviceData.device_code,
      grant_type: "urn:ietf:params:oauth:grant-type:device_code"
    });
    if (clientSecret) body.set("client_secret", clientSecret);
    const tokenRes = await fetch(ACCESS_TOKEN_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: body.toString(),
      signal: AbortSignal.timeout(15e3)
    });
    if (!tokenRes.ok) {
      throw new Error(`GitHub token poll failed: HTTP ${tokenRes.status}`);
    }
    const tokenData = await tokenRes.json();
    if (tokenData.access_token) {
      await writeGitHubToken(tokenData.access_token);
      const login = await fetchAuthedLogin(tokenData.access_token);
      console.log(`  Authorized as: ${login}`);
      return login;
    }
    if (tokenData.error === "authorization_pending") {
      continue;
    }
    if (tokenData.error === "slow_down") {
      intervalSecs = (tokenData.interval ?? intervalSecs) + 5;
      continue;
    }
    if (tokenData.error === "expired_token") {
      throw new Error("GitHub device code expired. Please run `terminalhire login` again.");
    }
    if (tokenData.error === "access_denied") {
      throw new Error("GitHub authorization was denied by the user.");
    }
    throw new Error(
      `GitHub device flow error: ${tokenData.error ?? "unknown"} \u2014 ${tokenData.error_description ?? ""}`
    );
  }
  throw new Error(
    "GitHub device code expired before authorization. Please run `terminalhire login` again."
  );
}
async function fetchAuthedLogin(token) {
  if (token === MOCK_TOKEN) return MOCK_LOGIN;
  const res = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28"
    },
    signal: AbortSignal.timeout(1e4)
  });
  if (!res.ok) throw new Error(`GitHub /user: HTTP ${res.status}`);
  const data = await res.json();
  return data.login;
}
async function resolveStoredLogin() {
  if (process.env["TERMINALHIRE_GITHUB_MOCK"] === "1" || process.env["TERMINALHIRE_GITHUB_MOCK"] === "1" || process.env["JPI_GITHUB_MOCK"] === "1")
    return MOCK_LOGIN;
  const token = await readGitHubToken();
  if (!token) return void 0;
  try {
    return await fetchAuthedLogin(token);
  } catch {
    return void 0;
  }
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
var TERMINALHIRE_DIR5, TOKEN_FILE, KEY_FILE2, ALGO2, KEY_BYTES2, IV_BYTES2, GITHUB_SCOPE, DEVICE_CODE_URL, ACCESS_TOKEN_URL, BAKED_IN_CLIENT_ID, MOCK_TOKEN, MOCK_LOGIN;
var init_github_auth = __esm({
  "src/github-auth.ts"() {
    "use strict";
    init_state_dir();
    TERMINALHIRE_DIR5 = process.env.TERMINALHIRE_DIR || join6(homedir5(), ".terminalhire");
    TOKEN_FILE = join6(TERMINALHIRE_DIR5, "github-token.enc");
    KEY_FILE2 = join6(TERMINALHIRE_DIR5, "key");
    ALGO2 = "aes-256-gcm";
    KEY_BYTES2 = 32;
    IV_BYTES2 = 12;
    GITHUB_SCOPE = "read:user";
    DEVICE_CODE_URL = "https://github.com/login/device/code";
    ACCESS_TOKEN_URL = "https://github.com/login/oauth/access_token";
    BAKED_IN_CLIENT_ID = "Ov23lignE2ZSBe0J3a6B";
    MOCK_TOKEN = "mock-github-token-jpi-dev";
    MOCK_LOGIN = "janedev";
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
import { join as join7 } from "path";
import { homedir as homedir6 } from "os";
function blankFile() {
  return { version: 1, repos: {} };
}
function __setStoreForTests(testStore) {
  activeStore = testStore ?? store;
}
function nowISO() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function blankEntry() {
  return {
    updatedAt: nowISO(),
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
  entry.updatedAt = nowISO();
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
      checkedAt: nowISO()
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
      sampledAt: nowISO()
    });
    if (entry.cultureSamples.length > MAX_CULTURE_SAMPLES) {
      entry.cultureSamples.splice(0, entry.cultureSamples.length - MAX_CULTURE_SAMPLES);
    }
  });
}
async function addNote(repoFullName, text, source = "manual") {
  await withEntry(repoFullName, (entry) => {
    entry.notes.push({ text, source, addedAt: nowISO() });
    if (entry.notes.length > MAX_NOTES) {
      entry.notes.splice(0, entry.notes.length - MAX_NOTES);
    }
  });
}
async function writeTombstone(repoFullName, claimId, outcome) {
  await withEntry(repoFullName, (entry) => {
    if (entry.tombstones.some((t) => t.claimId === claimId)) return;
    entry.tombstones.push({ claimId, outcome, resolvedAt: nowISO() });
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
var TERMINALHIRE_DIR6, REPO_EXPERIENCE_FILE, MAX_REPOS, MAX_CULTURE_SAMPLES, MAX_NOTES, MAX_BACKFILL, store, activeStore;
var init_repo_experience = __esm({
  "src/repo-experience.ts"() {
    "use strict";
    init_crypto_store();
    init_profile();
    TERMINALHIRE_DIR6 = process.env.TERMINALHIRE_DIR || join7(homedir6(), ".terminalhire");
    REPO_EXPERIENCE_FILE = join7(TERMINALHIRE_DIR6, "repo-experience.enc");
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
  readFileSync as readFileSync6,
  writeFileSync as writeFileSync5,
  mkdirSync as mkdirSync2,
  renameSync as renameSync4,
  existsSync as existsSync4,
  rmSync as rmSync3,
  statSync
} from "fs";
import { randomBytes as randomBytes4 } from "crypto";
import { join as join8 } from "path";
import { homedir as homedir7 } from "os";
function sleepSync(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}
function withClaimsLock(fn) {
  ensureStateDir(TERMINALHIRE_DIR7);
  const deadline = Date.now() + LOCK_TIMEOUT_MS;
  for (; ; ) {
    try {
      mkdirSync2(LOCK_DIR, { mode: 448 });
      break;
    } catch {
      try {
        if (Date.now() - statSync(LOCK_DIR).mtimeMs > LOCK_STALE_MS) {
          rmSync3(LOCK_DIR, { recursive: true, force: true });
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
    rmSync3(LOCK_DIR, { recursive: true, force: true });
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
function nowISO2() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function normalizeClaim(c) {
  return { ...c, kind: c.kind ?? "bounty", policy: c.policy ?? null };
}
function readClaims() {
  try {
    if (!existsSync4(CLAIMS_FILE)) return [];
    const data = JSON.parse(readFileSync6(CLAIMS_FILE, "utf8"));
    const claims = Array.isArray(data?.claims) ? data.claims : [];
    return claims.map(normalizeClaim);
  } catch {
    return [];
  }
}
function writeClaims(claims) {
  ensureStateDir(TERMINALHIRE_DIR7);
  const tmp = `${CLAIMS_FILE}.${process.pid}.${randomBytes4(6).toString("hex")}.tmp`;
  const payload = { claims };
  try {
    writeFileSync5(tmp, JSON.stringify(payload, null, 2), {
      encoding: "utf8",
      mode: 384,
      flag: "wx"
    });
    renameSync4(tmp, CLAIMS_FILE);
  } catch (err) {
    try {
      rmSync3(tmp, { force: true });
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
    const ts = nowISO2();
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
    claims[idx] = { ...claims[idx], ...patch, updatedAt: nowISO2() };
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
var TERMINALHIRE_DIR7, CLAIMS_FILE, LOCK_DIR, LOCK_STALE_MS, LOCK_RETRY_MS, LOCK_TIMEOUT_MS, PUSHED_CLAIM_FIELDS, TERMINAL_STATES, POLL_TRANSITIONS;
var init_claims = __esm({
  "src/claims.ts"() {
    "use strict";
    init_state_dir();
    TERMINALHIRE_DIR7 = process.env.TERMINALHIRE_DIR || join8(homedir7(), ".terminalhire");
    CLAIMS_FILE = join8(TERMINALHIRE_DIR7, "claims.json");
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

// bin/jpi-contribute.js
init_src();
import { readFileSync as readFileSync7, writeFileSync as writeFileSync6, renameSync as renameSync5 } from "fs";
import { join as join9 } from "path";
import { homedir as homedir8 } from "os";
import { createHash as createHash3, randomBytes as randomBytes5 } from "crypto";

// bin/cache-store.js
init_state_dir();
import { readFileSync as readFileSync2, writeFileSync, renameSync } from "fs";
import { join as join2 } from "path";
import { homedir } from "os";
var TERMINALHIRE_DIR = process.env.TERMINALHIRE_DIR || join2(homedir(), ".terminalhire");
var INDEX_CACHE_FILE = join2(TERMINALHIRE_DIR, "index-cache.json");
var SCHEMA_VERSION2 = 1;
var tmpCounter = 0;
function readCacheEntry() {
  try {
    return JSON.parse(readFileSync2(INDEX_CACHE_FILE, "utf8"));
  } catch {
    return null;
  }
}
function updateIndexCache(patch) {
  ensureStateDir(TERMINALHIRE_DIR);
  const existing = readCacheEntry() ?? {};
  const entry = {
    ...existing,
    ...patch,
    schemaVersion: SCHEMA_VERSION2,
    ts: Date.now()
  };
  const tmp = `${INDEX_CACHE_FILE}.${process.pid}.${tmpCounter++}.tmp`;
  writeFileSync(tmp, JSON.stringify(entry), "utf8");
  renameSync(tmp, INDEX_CACHE_FILE);
  return entry;
}

// src/config.ts
init_state_dir();
import { readFileSync as readFileSync3, writeFileSync as writeFileSync2, existsSync } from "fs";
import { join as join3 } from "path";
import { homedir as homedir2 } from "os";
var TERMINALHIRE_DIR2 = process.env.TERMINALHIRE_DIR || join3(homedir2(), ".terminalhire");
var CONFIG_FILE = join3(TERMINALHIRE_DIR2, "config.json");
var DEFAULT_CONFIG = {
  nudge: "session",
  peerConnect: false,
  peerConnectPrompted: false,
  resumePublishPrompted: false,
  chatDisclosureAck: false,
  chatShareActivity: false,
  inboundNudgeMuted: false,
  inboundNudgeDisclosed: false,
  contributeEnabled: true,
  betaOptIn: false,
  lastFullFeedbackAt: null,
  lastPulseAskAt: null,
  pulseDisclosed: false,
  mix: "balanced"
};
function readConfig() {
  try {
    if (!existsSync(CONFIG_FILE)) return { ...DEFAULT_CONFIG };
    const raw = readFileSync3(CONFIG_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_CONFIG, ...parsed };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}
function isContributeEnabled() {
  const cfg = readConfig();
  return !(cfg.contributeEnabled === false && !("contributePrompted" in cfg));
}

// bin/jpi-contribute.js
init_state_dir();

// bin/sanitize.js
var CONTROL_CHARS = /[\x00-\x1f\x7f-\x9f]/g;
function sanitizeText(s) {
  if (s == null) return "";
  return String(s).replace(CONTROL_CHARS, "");
}
function safeHttpUrl(url) {
  if (url == null) return null;
  const raw = String(url);
  CONTROL_CHARS.lastIndex = 0;
  if (CONTROL_CHARS.test(raw)) return null;
  let parsed;
  try {
    parsed = new URL(raw);
  } catch {
    return null;
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
  return parsed.href;
}
function linkTitle(title, url) {
  const safeTitle = sanitizeText(title);
  const href = safeHttpUrl(url);
  const isTTY = process.stdout.isTTY;
  const noColor = process.env["NO_COLOR"] !== void 0;
  if (isTTY && !noColor && href) {
    return `\x1B]8;;${href}\x1B\\${safeTitle}\x1B]8;;\x1B\\`;
  }
  return href ? `${safeTitle} (${href})` : safeTitle;
}

// bin/jpi-contribute.js
var TERMINALHIRE_DIR8 = process.env.TERMINALHIRE_DIR || join9(homedir8(), ".terminalhire");
var INDEX_CACHE_FILE2 = join9(TERMINALHIRE_DIR8, "index-cache.json");
var INDEX_TTL_MS = 15 * 60 * 1e3;
var API_URL = process.env["TERMINALHIRE_API_URL"] ?? process.env["JPI_API_URL"] ?? "https://terminalhire.com";
var CONTINUITY_RANK_DISABLED = process.env["TERMINALHIRE_NO_CONTINUITY_RANK"] === "1";
var LOCAL_CONTRIB_CACHE_FILE = join9(TERMINALHIRE_DIR8, "contribute-local-cache.json");
var LOCAL_DISCOVERY_TTL_MS = 6 * 60 * 60 * 1e3;
var LOCAL_DISCOVERY_RETRY_TTL_MS = 15 * 60 * 1e3;
var LOCAL_DISCOVERY_BUDGET_MS = 12e3;
var LOCAL_CACHE_SCHEMA = 1;
var LOCAL_DISCOVERY_DISABLED = process.env["TERMINALHIRE_NO_LOCAL_DISCOVERY"] === "1";
var HEADER = "Contribution opportunities \u2014 open issues where a merged PR actually counts toward your r\xE9sum\xE9.\nRepos \u226550\u2605 / \u226510 contributors \xB7 unassigned \xB7 merit-merge \xB7 matched to your stack.";
var CONTRIBUTE_OFF = "Contribute is off \u2014 you set contributeEnabled: false in ~/.terminalhire/config.json.\nRemove that line (or set it to true) to see open issues where a merged PR would count toward your r\xE9sum\xE9.";
var EMPTY_STATE = "Nothing clears the bar right now. We only list issues where a merged PR actually counts toward\nyour r\xE9sum\xE9 \u2014 so the list stays honest. Try again after the next refresh.";
function readIndexCache() {
  try {
    const entry = JSON.parse(readFileSync7(INDEX_CACHE_FILE2, "utf8"));
    if (Date.now() - entry.ts < INDEX_TTL_MS) return entry.index;
    return null;
  } catch {
    return null;
  }
}
function writeIndexCache(index) {
  updateIndexCache({ index });
}
async function fetchIndex(fetchImpl, useCache = true) {
  if (useCache) {
    const cached = readIndexCache();
    if (cached) return cached;
  }
  const res = await fetchImpl(`${API_URL}/api/index`, { signal: AbortSignal.timeout(1e4) });
  if (!res.ok) throw new Error(`/api/index returned ${res.status}`);
  const index = await res.json();
  if (useCache) writeIndexCache(index);
  return index;
}
var STRONG_THRESHOLD = 0.5;
if (STRONG_THRESHOLD <= 0) {
  throw new Error("STRONG_THRESHOLD must be > 0 or the contested-issue fail-safe breaks");
}
function rankContributions(fp, items) {
  if (!fp || !Array.isArray(items) || items.length === 0) return [];
  const ranked = match(fp, items, items.length);
  const rel = new Map(ranked.map((r) => [r, relevanceScore(fp, r.job)]));
  ranked.sort((a, b) => (rel.get(b) ?? 0) - (rel.get(a) ?? 0));
  return ranked.filter((r) => {
    const contested = (r.job.contribution?.openPRsAtDiscovery ?? 0) > 0;
    return !contested || (rel.get(r) ?? 0) >= STRONG_THRESHOLD;
  });
}
async function rankLocally(items, injectedFp) {
  if (!Array.isArray(items) || items.length === 0) return [];
  let fp = injectedFp;
  if (!fp) {
    try {
      const { readProfile: readProfile2, profileToFingerprint: profileToFingerprint2 } = await Promise.resolve().then(() => (init_profile(), profile_exports));
      const profile = await readProfile2();
      if (!profile.skillTags || profile.skillTags.length === 0) return [];
      fp = profileToFingerprint2(profile);
    } catch {
      return [];
    }
  }
  return rankContributions(fp, items);
}
function stripRaw(job) {
  if (!job || typeof job !== "object" || !("raw" in job)) return job;
  const { raw: _raw, ...rest } = job;
  return rest;
}
function mergeContribDedup(shared, local) {
  const base = Array.isArray(shared) ? shared : [];
  if (!Array.isArray(local) || local.length === 0) return base;
  const seen = new Set(base.map((j) => j?.id));
  const merged = base.slice();
  for (const j of local) {
    if (j && typeof j.id === "string" && !seen.has(j.id)) {
      seen.add(j.id);
      merged.push(j);
    }
  }
  return merged;
}
var STARRED_PER_PAGE = 100;
var STARRED_MAX_PAGES = 2;
var MAX_SEEDS = 40;
async function fetchStarredSlugs(token, fetchImpl = globalThis.fetch) {
  const out = [];
  const seen = /* @__PURE__ */ new Set();
  for (let page = 1; page <= STARRED_MAX_PAGES; page++) {
    let items = null;
    try {
      const res = await fetchImpl(
        `https://api.github.com/user/starred?per_page=${STARRED_PER_PAGE}&sort=updated&direction=desc&page=${page}`,
        {
          headers: {
            Accept: "application/vnd.github+json",
            "User-Agent": "terminalhire",
            "X-GitHub-Api-Version": "2022-11-28",
            Authorization: `Bearer ${token}`
          },
          signal: AbortSignal.timeout(8e3)
        }
      );
      if (!res.ok) break;
      const body = await res.json();
      items = Array.isArray(body) ? body : null;
    } catch {
      break;
    }
    if (!items || items.length === 0) break;
    for (const it of items) {
      const slug = typeof it?.full_name === "string" ? it.full_name.toLowerCase().trim() : null;
      if (slug && /^[^/\s]+\/[^/\s]+$/.test(slug) && !seen.has(slug) && out.length < MAX_SEEDS) {
        seen.add(slug);
        out.push(slug);
      }
    }
    if (out.length >= MAX_SEEDS) break;
    if (items.length < STARRED_PER_PAGE) break;
  }
  return out;
}
function readLocalPoolCache() {
  try {
    return JSON.parse(readFileSync7(LOCAL_CONTRIB_CACHE_FILE, "utf8"));
  } catch {
    return null;
  }
}
function cacheKeyFor(login, token) {
  if (typeof login === "string" && login.length > 0) return login;
  return "tok:" + createHash3("sha256").update(String(token)).digest("hex").slice(0, 16);
}
function writeLocalPoolCache(entry) {
  try {
    ensureStateDir(TERMINALHIRE_DIR8);
    const tmp = `${LOCAL_CONTRIB_CACHE_FILE}.${process.pid}.${randomBytes5(6).toString("hex")}.tmp`;
    writeFileSync6(tmp, JSON.stringify({ v: LOCAL_CACHE_SCHEMA, ...entry }), {
      encoding: "utf8",
      flag: "wx",
      mode: 384
    });
    renameSync5(tmp, LOCAL_CONTRIB_CACHE_FILE);
  } catch {
  }
}
async function localContributionDiscovery({
  token,
  login = null,
  now = Date.now,
  discoverImpl = aggregateContributions,
  seedImpl = fetchStarredSlugs,
  stderr
} = {}) {
  if (!token) return [];
  const key = cacheKeyFor(login, token);
  const cached = readLocalPoolCache();
  if (cached && cached.v === LOCAL_CACHE_SCHEMA && cached.key === key && typeof cached.ts === "number") {
    const ttl = cached.degraded ? LOCAL_DISCOVERY_RETRY_TTL_MS : LOCAL_DISCOVERY_TTL_MS;
    if (now() - cached.ts < ttl) return Array.isArray(cached.pool) ? cached.pool : [];
  }
  const seedSlugs = await Promise.resolve(seedImpl(token)).catch(() => []);
  const err = stderr ?? process.stderr;
  const showNote = !!err.isTTY;
  if (showNote) err.write("\xB7 searching your GitHub for more matches\u2026\r");
  let degraded = false;
  let pool = [];
  try {
    const raw = await discoverImpl({
      token,
      discoverRepos: true,
      seedSlugs: Array.isArray(seedSlugs) && seedSlugs.length ? seedSlugs : void 0,
      // NO vocabTerms — profile-derived search terms must never cross the wire; the
      // core default vocab does breadth backfill, the starred seeds diversify.
      budgetMs: LOCAL_DISCOVERY_BUDGET_MS,
      onStats: (s) => {
        degraded = !!s?.degraded;
      }
    });
    pool = (Array.isArray(raw) ? raw : []).map(stripRaw);
  } catch {
    degraded = true;
    pool = [];
  } finally {
    if (showNote) err.write("\x1B[2K\r");
  }
  writeLocalPoolCache({ ts: now(), key, degraded, pool });
  return pool;
}
function applyContinuityRank(results, continuityOf, { enabled = true } = {}) {
  if (!enabled) return results;
  const effectiveVal = (r) => {
    const s = r.score ?? 0;
    const repo = r.job.contribution?.repoFullName;
    const c = repo ? continuityOf(repo) || 0 : 0;
    return s * (1 + 0.15 * c);
  };
  results.sort((a, b) => effectiveVal(b) - effectiveVal(a));
  return results;
}
function continuityNoteForRow(entry, isTTY) {
  if (!isTTY || !entry || !(entry.score > 0) || !(entry.mergedCount > 0)) return null;
  const n = entry.mergedCount;
  const word = n === 1 ? "once" : n === 2 ? "twice" : `${n} times`;
  return `\u2191 you've merged here ${word}`;
}
var LANGUAGES = /* @__PURE__ */ new Set([
  "typescript",
  "javascript",
  "python",
  "go",
  "golang",
  "rust",
  "java",
  "ruby",
  "php",
  "c",
  "cpp",
  "c++",
  "csharp",
  "c#",
  "kotlin",
  "swift",
  "scala",
  "elixir",
  "erlang",
  "haskell",
  "clojure",
  "dart",
  "lua",
  "perl",
  "r",
  "ocaml",
  "julia",
  "shell",
  "bash",
  "html",
  "css",
  "sql",
  "zig",
  "nim",
  "crystal",
  "objective-c"
]);
function displayLanguage(job) {
  const tag = (job.tags ?? []).find((t) => LANGUAGES.has(String(t).toLowerCase()));
  return tag ?? "\u2014";
}
function renderRow(i, result, claimedIds = /* @__PURE__ */ new Set(), continuityNote = null) {
  const job = result.job;
  const c = job.contribution ?? {};
  const repo = sanitizeText(c.repoFullName ?? job.company ?? "");
  const num = c.issueNumber != null ? `#${c.issueNumber}` : "";
  const label = c.labels && c.labels.length ? sanitizeText(c.labels[0]) : "\u2014";
  const lang = sanitizeText(displayLanguage(job));
  const scorePct = `match ${Math.round((result.score ?? 0) * 100)}%`;
  const ref = opportunityShortToken(job.id);
  const claimed = claimedIds.has(job.id);
  const badge = claimed ? " \xB7 \u25CF claimed by you" : "";
  const line1 = `${i + 1}. ${linkTitle(job.title, c.issueUrl ?? job.url)} [${ref}]`;
  const line2 = `   ${repo} \xB7 ${num} \xB7 ${label} \xB7 ${lang} \xB7 ${scorePct}${badge}`;
  const noteLine = continuityNote ? `
   ${continuityNote}` : "";
  const line3 = claimed ? `   \u2192 claimed by you \u2014 terminalhire claim status ${job.id}` : `   \u2192 terminalhire claim ${ref}`;
  return `${line1}
${line2}${noteLine}
${line3}`;
}
async function run(opts = {}) {
  const log = opts.log ?? console.log;
  const fetchImpl = opts.fetchImpl ?? globalThis.fetch;
  const useCache = opts.fetchImpl == null;
  try {
    if (!isContributeEnabled()) {
      log(CONTRIBUTE_OFF);
      return;
    }
    const index = await fetchIndex(fetchImpl, useCache);
    let items = Array.isArray(index?.contribute) ? index.contribute : [];
    let fp = opts.fingerprint;
    if (!fp) {
      try {
        const { readProfile: readProfile2, profileToFingerprint: profileToFingerprint2 } = await Promise.resolve().then(() => (init_profile(), profile_exports));
        const profile = await readProfile2();
        if (profile.skillTags?.length) fp = profileToFingerprint2(profile);
      } catch {
      }
    }
    if (fp?.skillTags?.length && !LOCAL_DISCOVERY_DISABLED && (opts.discoverContributions || useCache)) {
      try {
        let token = opts.token;
        let login = opts.login ?? null;
        if (token == null && useCache) {
          const auth = await Promise.resolve().then(() => (init_github_auth(), github_auth_exports));
          token = await auth.readGitHubToken();
          if (token && login == null) {
            login = await auth.resolveStoredLogin().catch(() => null);
          }
        }
        if (token) {
          const localPool = await localContributionDiscovery({
            token,
            login,
            discoverImpl: opts.discoverContributions,
            // Real runs seed from starred repos (default fetchStarredSlugs); a test
            // that injects a discovery fn but no seeds gets an inert seeder so it
            // never touches the network.
            seedImpl: opts.discoverSeeds ?? (opts.discoverContributions ? () => [] : void 0),
            stderr: opts.stderr
          });
          items = mergeContribDedup(items, localPool);
        }
      } catch {
      }
    }
    const results = await rankLocally(items, fp);
    if (results.length === 0) {
      log(EMPTY_STATE);
      return;
    }
    let continuityByRepo = /* @__PURE__ */ new Map();
    if (!CONTINUITY_RANK_DISABLED && process.stdout.isTTY) {
      try {
        const { continuityForRepo: continuityForRepo2 } = await Promise.resolve().then(() => (init_repo_experience(), repo_experience_exports));
        const { readClaims: readClaims2 } = await Promise.resolve().then(() => (init_claims(), claims_exports));
        const claims = readClaims2();
        const repos = [
          ...new Set(results.map((r) => r.job.contribution?.repoFullName).filter(Boolean))
        ];
        for (const repo of repos) {
          continuityByRepo.set(repo, await continuityForRepo2(repo, claims));
        }
        applyContinuityRank(results, (repo) => continuityByRepo.get(repo)?.score ?? 0);
      } catch {
      }
    }
    let claimedIds = /* @__PURE__ */ new Set();
    try {
      const { listClaims: listClaims2 } = await Promise.resolve().then(() => (init_claims(), claims_exports));
      claimedIds = new Set(listClaims2({ active: true }).map((c) => c.id));
    } catch {
    }
    log(HEADER);
    log("");
    for (let i = 0; i < results.length; i++) {
      const continuityEntry = continuityByRepo.get(results[i].job.contribution?.repoFullName);
      const continuityNote = continuityNoteForRow(continuityEntry, process.stdout.isTTY);
      log(renderRow(i, results[i], claimedIds, continuityNote));
    }
  } catch (err) {
    console.error("terminalhire contribute error:", err?.message ?? err);
    process.exit(1);
  }
}
export {
  applyContinuityRank,
  continuityNoteForRow,
  localContributionDiscovery,
  mergeContribDedup,
  rankContributions,
  renderRow,
  run
};
