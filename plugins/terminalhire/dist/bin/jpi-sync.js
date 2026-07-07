#!/usr/bin/env node
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

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
var SOFT_DOMAIN, SYNONYM_ONLY;
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
    for (const id of SYNONYM_ONLY) {
      if (!SOFT_DOMAIN.has(id)) throw new Error(`extract: SYNONYM_ONLY "${id}" not in SOFT_DOMAIN`);
    }
  }
});

// ../../packages/core/src/vocab/idf-background.ts
var init_idf_background = __esm({
  "../../packages/core/src/vocab/idf-background.ts"() {
    "use strict";
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
var BOUNTY_REPO_DENYLIST, DENYLIST_LC, AI_BAN_DENYLIST, AI_BAN_LC;
var init_bounty_gate = __esm({
  "../../packages/core/src/feeds/bounty-gate.ts"() {
    "use strict";
    BOUNTY_REPO_DENYLIST = [
      "SecureBananaLabs/bug-bounty",
      // Meta-farm: a bounty PLATFORM whose own issues are an assignment-gated
      // contributor queue ("please assign me, my chief") — an unsolicited PR won't
      // merge, so it's not a real claimable bounty. Not structurally derivable from
      // any fetched field, so it's a manual entry (also dropped from the allowlist).
      "boundlessfi/boundless"
    ];
    DENYLIST_LC = new Set(BOUNTY_REPO_DENYLIST.map((r) => r.toLowerCase()));
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
  }
});

// ../../packages/core/src/feeds/contribution-gate.ts
var init_contribution_gate = __esm({
  "../../packages/core/src/feeds/contribution-gate.ts"() {
    "use strict";
    init_bounty_gate();
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

// ../../packages/core/src/github.ts
var RESUME_DECAY_HALF_LIFE_MS;
var init_github = __esm({
  "../../packages/core/src/github.ts"() {
    "use strict";
    init_vocabulary();
    init_contribution_gate();
    init_contribution_gate();
    init_rigor();
    RESUME_DECAY_HALF_LIFE_MS = 30 * 24 * 60 * 60 * 1e3;
  }
});

// ../../packages/core/src/matcher.ts
var init_matcher = __esm({
  "../../packages/core/src/matcher.ts"() {
    "use strict";
    init_vocabulary();
    init_github();
  }
});

// ../../packages/core/src/rerank.ts
var init_rerank = __esm({
  "../../packages/core/src/rerank.ts"() {
    "use strict";
  }
});

// ../../packages/core/src/feeds/http.ts
var init_http = __esm({
  "../../packages/core/src/feeds/http.ts"() {
    "use strict";
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
var init_entities = __esm({
  "../../packages/core/src/feeds/entities.ts"() {
    "use strict";
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

// ../../packages/core/src/feeds/index.ts
function flattenTiers(t) {
  return [.../* @__PURE__ */ new Set([...t.bigco, ...t.scaleup, ...t.startup])];
}
var GREENHOUSE_SLUGS_BY_TIER, ASHBY_SLUGS_BY_TIER, LEVER_SLUGS_BY_TIER, DEFAULT_GREENHOUSE_SLUGS, DEFAULT_ASHBY_SLUGS, DEFAULT_LEVER_SLUGS;
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
  }
});

// ../../packages/core/src/feeds/contribution-classify.ts
var init_contribution_classify = __esm({
  "../../packages/core/src/feeds/contribution-classify.ts"() {
    "use strict";
  }
});

// ../../packages/core/src/feeds/contributions.ts
var CONTRIB_LABEL_QUERIES, CONTRIB_LANGUAGE_QUERIES, CONTRIB_SEARCH_QUERIES;
var init_contributions = __esm({
  "../../packages/core/src/feeds/contributions.ts"() {
    "use strict";
    init_vocabulary();
    init_entities();
    init_bounty_gate();
    init_contribution_gate();
    init_contribution_classify();
    init_github_bounties();
    init_http();
    CONTRIB_LABEL_QUERIES = [
      'label:"good first issue" type:issue state:open',
      'label:"good-first-issue" type:issue state:open',
      'label:"help wanted" type:issue state:open',
      'label:"help-wanted" type:issue state:open',
      'label:"up-for-grabs" type:issue state:open'
    ];
    CONTRIB_LANGUAGE_QUERIES = [
      ...["rust", "go", "python", "c++", "ruby"].map(
        (lang) => `label:"help wanted" language:${lang} type:issue state:open`
      ),
      ...["rust", "go"].map(
        (lang) => `label:"good first issue" language:${lang} type:issue state:open`
      )
    ];
    CONTRIB_SEARCH_QUERIES = [...CONTRIB_LABEL_QUERIES, ...CONTRIB_LANGUAGE_QUERIES];
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

// ../../packages/core/src/indexer.ts
var init_indexer = __esm({
  "../../packages/core/src/indexer.ts"() {
    "use strict";
    init_feeds();
    init_contributions();
    init_partners();
    init_github();
    init_winnability();
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

// ../../packages/core/src/short-token.ts
import { createHash as createHash2 } from "crypto";
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
    init_credit();
    init_intro();
    init_directoryThreshold();
    init_chatCrypto();
    init_job_status();
    init_legible();
    init_legible_trajectory();
    init_rigor();
    init_short_token();
  }
});

// ../../node_modules/keytar/build/Release/keytar.node
var keytar_default;
var init_keytar = __esm({
  "../../node_modules/keytar/build/Release/keytar.node"() {
    keytar_default = "../keytar-KOAAH267.node";
  }
});

// node-file:/private/tmp/claude-501/-Users-ericgang-job-placement-inline/b71aee8e-782d-49b4-ac3c-a32c7d372392/scratchpad/wt-release-v0250/node_modules/keytar/build/Release/keytar.node
var require_keytar = __commonJS({
  "node-file:/private/tmp/claude-501/-Users-ericgang-job-placement-inline/b71aee8e-782d-49b4-ac3c-a32c7d372392/scratchpad/wt-release-v0250/node_modules/keytar/build/Release/keytar.node"(exports, module) {
    "use strict";
    init_keytar();
    try {
      module.exports = __require(keytar_default);
    } catch {
    }
  }
});

// ../../node_modules/keytar/lib/keytar.js
var require_keytar2 = __commonJS({
  "../../node_modules/keytar/lib/keytar.js"(exports, module) {
    "use strict";
    var keytar = require_keytar();
    function checkRequired(val, name) {
      if (!val || val.length <= 0) {
        throw new Error(name + " is required.");
      }
    }
    module.exports = {
      getPassword: function(service, account) {
        checkRequired(service, "Service");
        checkRequired(account, "Account");
        return keytar.getPassword(service, account);
      },
      setPassword: function(service, account, password) {
        checkRequired(service, "Service");
        checkRequired(account, "Account");
        checkRequired(password, "Password");
        return keytar.setPassword(service, account, password);
      },
      deletePassword: function(service, account) {
        checkRequired(service, "Service");
        checkRequired(account, "Account");
        return keytar.deletePassword(service, account);
      },
      findPassword: function(service) {
        checkRequired(service, "Service");
        return keytar.findPassword(service);
      },
      findCredentials: function(service) {
        checkRequired(service, "Service");
        return keytar.findCredentials(service);
      }
    };
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
  randomBytes as randomBytes2
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
    const kt = await Promise.resolve().then(() => __toESM(require_keytar2(), 1));
    const stored = await kt.getPassword("terminalhire", "profile-key");
    if (stored) {
      return Buffer.from(stored, "hex");
    }
    const key2 = randomBytes2(KEY_BYTES);
    await kt.setPassword("terminalhire", "profile-key", key2.toString("hex"));
    return key2;
  } catch {
  }
  mkdirSync(TERMINALHIRE_DIR, { recursive: true });
  if (existsSync(KEY_FILE)) {
    return Buffer.from(readFileSync2(KEY_FILE, "utf8").trim(), "hex");
  }
  const key = randomBytes2(KEY_BYTES);
  writeFileSync(KEY_FILE, key.toString("hex"), { mode: 384, encoding: "utf8" });
  return key;
}
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
  const { rmSync: rmSync2 } = await import("fs");
  try {
    rmSync2(PROFILE_FILE);
  } catch {
  }
  try {
    rmSync2(KEY_FILE);
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

// bin/jpi-sync.js
import { readFileSync as readFileSync3, writeFileSync as writeFileSync2, mkdirSync as mkdirSync2, existsSync as existsSync2, rmSync } from "fs";
import { join as join3 } from "path";
import { homedir as homedir2, hostname as osHostname } from "os";
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

// bin/jpi-sync.js
var TH_DIR = process.env["TERMINALHIRE_DIR"] || join3(homedir2(), ".terminalhire");
var TIER1_MARKER = join3(TH_DIR, "tier1.json");
var API_URL = process.env["TERMINALHIRE_API_URL"] || process.env["JPI_API_URL"] || "https://terminalhire.com";
var SYNC_BASE = "https://terminalhire.com";
var POLL_INTERVAL_MS = 2e3;
var POLL_TIMEOUT_MS = 10 * 60 * 1e3;
var CONSENT_VERSION = 1;
function ask(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((res) => {
    rl.question(question, (answer) => {
      rl.close();
      res(answer.trim().toLowerCase());
    });
  });
}
function readMarker() {
  try {
    return existsSync2(TIER1_MARKER) ? JSON.parse(readFileSync3(TIER1_MARKER, "utf8")) : null;
  } catch {
    return null;
  }
}
function writeMarker(marker) {
  mkdirSync2(TH_DIR, { recursive: true });
  writeFileSync2(TIER1_MARKER, JSON.stringify(marker, null, 2) + "\n", "utf8");
}
function clearMarker() {
  try {
    rmSync(TIER1_MARKER);
  } catch {
  }
}
function buildConsentFields(profile) {
  const gh = profile.github || {};
  const fields = [
    { key: "login", label: "GitHub login", value: gh.login },
    { key: "publicEmail", label: "Public email", value: gh.publicEmail || null },
    { key: "topLanguages", label: "Top languages", value: gh.topLanguages || [] },
    { key: "skillTags", label: "Skill tags", value: profile.skillTags || [] }
  ];
  if (profile.displayName) {
    fields.push({ key: "displayName", label: "Display name", value: profile.displayName });
  }
  if (profile.contactEmail) {
    fields.push({ key: "contactEmail", label: "Contact email", value: profile.contactEmail });
  }
  return fields;
}
function renderPreview(fields) {
  console.log("");
  console.log("\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510");
  console.log("\u2502   terminalhire \u2014 sync your profile (Tier-1, opt-in)            \u2502");
  console.log("\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518");
  console.log("");
  console.log("  The following data will be shared with staqs (terminalhire.com)");
  console.log("  AFTER you authorize + consent in the browser:");
  console.log("");
  for (const f of fields) {
    const shown = Array.isArray(f.value) ? JSON.stringify(f.value) : String(f.value ?? "(not set)");
    console.log(`    ${f.label.padEnd(16)}: ${shown}`);
  }
  console.log("");
  console.log("  What is NEVER sent:");
  console.log("    - Private repos, employer repos, raw code");
  console.log("    - Employer-repo-derived tags (filtered at source)");
  console.log("    - Session history, file paths, project names");
  console.log("");
  console.log("  This is a ONE-TIME snapshot. Nothing is sent automatically;");
  console.log("  re-run `terminalhire sync --push` to update it later.");
  console.log("  Delete it any time: terminalhire sync --delete");
  console.log("");
  console.log("  This is NOT required to use terminalhire.");
  console.log("");
}
function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}
async function runPush() {
  const { readProfile: readProfile2 } = await Promise.resolve().then(() => (init_profile(), profile_exports));
  const profile = await readProfile2();
  if (!profile.github || !profile.github.login) {
    console.log("");
    console.log("  No GitHub data in your local profile yet.");
    console.log("  Run `terminalhire login` first, then re-run `terminalhire sync --push`.");
    console.log("");
    process.exit(1);
  }
  const fields = buildConsentFields(profile);
  renderPreview(fields);
  await new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    rl.question(
      "  Press Enter to open your browser to authorize + consent (or Ctrl-C to cancel)... ",
      () => {
        rl.close();
        resolve();
      }
    );
  });
  console.log("");
  console.log("  Starting browser verification...");
  let begin;
  try {
    const r = await fetch(`${SYNC_BASE}/api/profile-sync/begin`, {
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
      console.error(`
  Could not start sync: /api/profile-sync/begin returned ${r.status}. ${detail}`);
      if (r.status === 503) console.error("  (Tier-1 sync is not enabled on the server yet.)");
      process.exit(1);
    }
    begin = await r.json();
  } catch (err) {
    console.error(`
  Could not start sync: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  }
  const { challenge, verifyUrl } = begin || {};
  if (!challenge || !verifyUrl) {
    console.error("\n  Could not start sync: malformed begin response.");
    process.exit(1);
  }
  console.log("");
  console.log("  Open this URL in your browser to authorize + consent:");
  console.log(`    ${verifyUrl}`);
  console.log("");
  console.log("  (Attempting to open it automatically...)");
  openInBrowser(verifyUrl);
  console.log("  Waiting for browser verification...");
  const deadline = Date.now() + POLL_TIMEOUT_MS;
  let proofToken = null;
  while (Date.now() < deadline) {
    await sleep(POLL_INTERVAL_MS);
    let statusRes;
    try {
      statusRes = await fetch(
        `${SYNC_BASE}/api/profile-sync/status?challenge=${encodeURIComponent(challenge)}`,
        { signal: AbortSignal.timeout(1e4) }
      );
    } catch {
      continue;
    }
    if (!statusRes.ok) {
      if (statusRes.status === 503) {
        console.error("\n  Tier-1 sync is not enabled on the server yet.\n");
        process.exit(1);
      }
      continue;
    }
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
    console.error("  Re-run `terminalhire sync --push` to try again.\n");
    process.exit(1);
  }
  const consentedAt = (/* @__PURE__ */ new Date()).toISOString();
  const consentToken = {
    consentedAt,
    version: CONSENT_VERSION,
    fields: fields.map((f) => f.key)
  };
  const payloadProfile = {
    login: profile.github.login,
    name: profile.displayName || null,
    publicEmail: profile.github.publicEmail || null,
    topLanguages: profile.github.topLanguages || [],
    skillTags: profile.skillTags || [],
    displayName: profile.displayName || null,
    contactEmail: profile.contactEmail || null
  };
  const priorMarker = readMarker();
  const rowToken = priorMarker && priorMarker.deleteToken ? priorMarker.deleteToken : null;
  const requestBody = { consentToken, profile: payloadProfile, proofToken };
  if (rowToken) {
    requestBody.rowToken = rowToken;
  }
  console.log("\n  Verified. Sending one-time snapshot...");
  let res;
  try {
    res = await fetch(`${SYNC_BASE}/api/profile-sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(1e4)
    });
  } catch (err) {
    console.error(`
  Sync failed: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  }
  if (!res.ok) {
    let detail = "";
    try {
      detail = (await res.json())?.message || "";
    } catch {
    }
    console.error(`
  Sync failed: /api/profile-sync returned ${res.status}. ${detail}`);
    if (res.status === 503) {
      console.error("  (Tier-1 sync is not enabled on the server yet.)");
    }
    if (res.status === 403) {
      console.error("  (Ownership proof rejected, expired, or already used \u2014 re-run sync --push.)");
    }
    process.exit(1);
  }
  let deleteToken = null;
  try {
    deleteToken = (await res.json())?.deleteToken || null;
  } catch {
  }
  writeMarker({ consentedAt, login: profile.github.login, deleteToken });
  console.log("\n  Profile synced. A local consent marker was written to ~/.terminalhire/tier1.json");
  console.log("  Delete your synced profile any time: terminalhire sync --delete\n");
}
function runStatus() {
  const marker = readMarker();
  console.log("");
  if (marker && marker.consentedAt) {
    console.log("  Tier-1 sync: CONSENTED (local marker present)");
    console.log(`    login:       ${marker.login || "(unknown)"}`);
    console.log(`    consented at: ${marker.consentedAt}`);
    console.log("");
    console.log("  This reflects your local marker only (no network call was made).");
    console.log("  Update: terminalhire sync --push   |   Delete: terminalhire sync --delete");
  } else {
    console.log("  Tier-1 sync: NOT CONSENTED (no local marker).");
    console.log("  Your profile has not been synced. Enable: terminalhire sync --push");
  }
  console.log("");
}
async function runDelete() {
  const marker = readMarker();
  console.log("");
  console.log("  This will hard-delete your synced profile from staqs (terminalhire.com)");
  console.log("  and remove the local consent marker. There is no soft-delete.");
  console.log("");
  const answer = await ask('  Delete your synced profile? Type "yes" to confirm: ');
  if (answer !== "yes") {
    console.log("\n  Aborted \u2014 nothing was deleted.\n");
    process.exit(0);
  }
  let login = marker && marker.login ? marker.login : null;
  if (!login) {
    const { readProfile: readProfile2 } = await Promise.resolve().then(() => (init_profile(), profile_exports));
    const profile = await readProfile2();
    login = profile.github && profile.github.login ? profile.github.login : null;
  }
  if (!login) {
    console.log("\n  No github login to delete (no marker, no GitHub profile). Clearing local marker.\n");
    clearMarker();
    process.exit(0);
  }
  const deleteToken = marker && marker.deleteToken ? marker.deleteToken : null;
  if (!deleteToken) {
    console.log("\n  No delete token found in ~/.terminalhire/tier1.json.");
    console.log("  Deletion must be run from the machine that originally pushed your profile");
    console.log("  (the delete token is stored there), or re-run `terminalhire sync --push`");
    console.log("  first to obtain a fresh token, then `terminalhire sync --delete`.\n");
    process.exit(1);
  }
  const consentToken = {
    consentedAt: marker && marker.consentedAt || (/* @__PURE__ */ new Date()).toISOString(),
    version: CONSENT_VERSION,
    fields: ["login"]
  };
  console.log("\n  Requesting deletion...");
  let res;
  try {
    res = await fetch(`${API_URL}/api/profile-sync`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ consentToken, login, deleteToken }),
      signal: AbortSignal.timeout(1e4)
    });
  } catch (err) {
    console.error(`
  Delete failed: ${err instanceof Error ? err.message : String(err)}`);
    console.error("  Local marker NOT cleared (server state unknown). Re-run to retry.\n");
    process.exit(1);
  }
  if (!res.ok) {
    console.error(`
  Delete failed: /api/profile-sync returned ${res.status}.`);
    if (res.status === 503) {
      console.error("  (Tier-1 sync is not enabled on the server yet.) Clearing local marker.");
      clearMarker();
    }
    process.exit(1);
  }
  clearMarker();
  console.log("\n  Synced profile deleted and local marker cleared.\n");
}
async function run() {
  const args = process.argv.slice(2).filter((a) => a !== "sync");
  const has = (f) => args.includes(f);
  if (has("--push") || has("--enable")) {
    await runPush();
    return;
  }
  if (has("--status")) {
    runStatus();
    return;
  }
  if (has("--delete")) {
    await runDelete();
    return;
  }
  console.log("");
  console.log("  terminalhire sync \u2014 opt-in Tier-1 profile sync (one-time snapshot)");
  console.log("");
  console.log('  terminalhire sync --push     Send your profile (shows a consent card, requires typed "yes")');
  console.log("  terminalhire sync --status   Show whether you have consented (local read only)");
  console.log("  terminalhire sync --delete   Hard-delete your synced profile (revocation)");
  console.log("");
  console.log('  Your profile is NEVER sent without an explicit typed "yes".');
  console.log("  This is NOT required to use terminalhire.");
  console.log("");
}
export {
  run
};
