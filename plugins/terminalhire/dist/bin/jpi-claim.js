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

// ../../packages/core/src/github.ts
var RESUME_DECAY_HALF_LIFE_MS;
var init_github = __esm({
  "../../packages/core/src/github.ts"() {
    "use strict";
    init_vocabulary();
    init_contribution_gate();
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

// ../../packages/core/src/indexer.ts
var init_indexer = __esm({
  "../../packages/core/src/indexer.ts"() {
    "use strict";
    init_feeds();
    init_contributions();
    init_partners();
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
function recordClick(map, id) {
  const prev = map[id];
  if (prev?.clicked === true) return map;
  return { ...map, [id]: { ...prev, clicked: true } };
}
function setStatus(map, id, s, markedAt = (/* @__PURE__ */ new Date()).toISOString()) {
  const prev = map[id];
  return { ...map, [id]: { ...prev, status: s, markedAt } };
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
    init_partners();
    init_github();
    init_intro();
    init_directoryThreshold();
    init_chatCrypto();
    init_job_status();
    init_legible();
    init_legible_trajectory();
    init_short_token();
  }
});

// src/claims.ts
var claims_exports = {};
__export(claims_exports, {
  PUSHED_CLAIM_FIELDS: () => PUSHED_CLAIM_FIELDS,
  acceptedPRRate: () => acceptedPRRate,
  findClaim: () => findClaim,
  listClaims: () => listClaims,
  readClaims: () => readClaims,
  recordClaim: () => recordClaim,
  removeClaim: () => removeClaim,
  toPushedClaim: () => toPushedClaim,
  updateClaim: () => updateClaim
});
import { readFileSync as readFileSync2, writeFileSync, mkdirSync, renameSync, existsSync } from "fs";
import { join as join2 } from "path";
import { homedir } from "os";
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
var TERMINALHIRE_DIR, CLAIMS_FILE, PUSHED_CLAIM_FIELDS, TERMINAL_STATES;
var init_claims = __esm({
  "src/claims.ts"() {
    "use strict";
    TERMINALHIRE_DIR = process.env.TERMINALHIRE_DIR || join2(homedir(), ".terminalhire");
    CLAIMS_FILE = join2(TERMINALHIRE_DIR, "claims.json");
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
  }
});

// ../../node_modules/keytar/build/Release/keytar.node
var keytar_default;
var init_keytar = __esm({
  "../../node_modules/keytar/build/Release/keytar.node"() {
    keytar_default = "../keytar-KOAAH267.node";
  }
});

// node-file:/Users/ericgang/job-placement-inline/node_modules/keytar/build/Release/keytar.node
var require_keytar = __commonJS({
  "node-file:/Users/ericgang/job-placement-inline/node_modules/keytar/build/Release/keytar.node"(exports, module) {
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

// bin/job-status-store.js
var job_status_store_exports = {};
__export(job_status_store_exports, {
  markClicked: () => markClicked,
  markStatus: () => markStatus,
  readStatusMap: () => readStatusMap,
  statusFilePath: () => statusFilePath
});
import {
  readFileSync as readFileSync5,
  writeFileSync as writeFileSync4,
  renameSync as renameSync2,
  mkdirSync as mkdirSync4,
  existsSync as existsSync4,
  copyFileSync,
  openSync,
  closeSync,
  unlinkSync
} from "fs";
import { join as join5, dirname } from "path";
import { homedir as homedir4 } from "os";
function statusFilePath() {
  return STATUS_FILE;
}
function atomicWriteJson(path, obj) {
  mkdirSync4(dirname(path), { recursive: true });
  const tmp = `${path}.tmp-${process.pid}`;
  writeFileSync4(tmp, JSON.stringify(obj, null, 2) + "\n", "utf8");
  renameSync2(tmp, path);
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
      mkdirSync4(dirname(LOCK_FILE), { recursive: true });
      fd = openSync(LOCK_FILE, "wx");
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
        closeSync(fd);
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
  if (!existsSync4(STATUS_FILE)) return {};
  let raw;
  try {
    raw = readFileSync5(STATUS_FILE, "utf8");
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
    const next = status === "claimed" ? { ...current, [id]: { ...current[id], status: "claimed", markedAt: (/* @__PURE__ */ new Date()).toISOString() } } : setStatus(current, id, status);
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
var TERMINALHIRE_DIR4, STATUS_FILE, LOCK_FILE, BAK_FILE;
var init_job_status_store = __esm({
  "bin/job-status-store.js"() {
    "use strict";
    init_src();
    TERMINALHIRE_DIR4 = process.env.TERMINALHIRE_DIR || join5(homedir4(), ".terminalhire");
    STATUS_FILE = join5(TERMINALHIRE_DIR4, "job-status.json");
    LOCK_FILE = `${STATUS_FILE}.lock`;
    BAK_FILE = `${STATUS_FILE}.bak`;
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
  createCipheriv as createCipheriv2,
  createDecipheriv as createDecipheriv2,
  randomBytes as randomBytes3
} from "crypto";
import {
  readFileSync as readFileSync6,
  writeFileSync as writeFileSync5,
  mkdirSync as mkdirSync5,
  existsSync as existsSync5
} from "fs";
import { join as join6 } from "path";
import { homedir as homedir5 } from "os";
async function loadKey2() {
  try {
    const kt = await Promise.resolve().then(() => __toESM(require_keytar2(), 1));
    const stored = await kt.getPassword("terminalhire", "profile-key");
    if (stored) {
      return Buffer.from(stored, "hex");
    }
    const key2 = randomBytes3(KEY_BYTES2);
    await kt.setPassword("terminalhire", "profile-key", key2.toString("hex"));
    return key2;
  } catch {
  }
  mkdirSync5(TERMINALHIRE_DIR5, { recursive: true });
  if (existsSync5(KEY_FILE2)) {
    return Buffer.from(readFileSync6(KEY_FILE2, "utf8").trim(), "hex");
  }
  const key = randomBytes3(KEY_BYTES2);
  writeFileSync5(KEY_FILE2, key.toString("hex"), { mode: 384, encoding: "utf8" });
  return key;
}
function encrypt2(plaintext, key) {
  const iv = randomBytes3(IV_BYTES2);
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
  const decipher = createDecipheriv2(
    ALGO2,
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
  if (!existsSync5(PROFILE_FILE)) return blankProfile();
  try {
    const key = await loadKey2();
    const raw = readFileSync6(PROFILE_FILE, "utf8");
    const blob = JSON.parse(raw);
    const plaintext = decrypt2(blob, key);
    const parsed = JSON.parse(plaintext);
    migrateTagWeights(parsed);
    return parsed;
  } catch {
    return blankProfile();
  }
}
async function writeProfile(profile) {
  mkdirSync5(TERMINALHIRE_DIR5, { recursive: true });
  const key = await loadKey2();
  profile.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
  profile.skillTags = deriveSkillTags(profile.tagWeights);
  const blob = encrypt2(JSON.stringify(profile), key);
  writeFileSync5(PROFILE_FILE, JSON.stringify(blob, null, 2), { encoding: "utf8" });
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
  const { rmSync: rmSync4 } = await import("fs");
  try {
    rmSync4(PROFILE_FILE);
  } catch {
  }
  try {
    rmSync4(KEY_FILE2);
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
var TERMINALHIRE_DIR5, PROFILE_FILE, KEY_FILE2, ALGO2, KEY_BYTES2, IV_BYTES2, DECAY_HALF_LIFE_MS, LANGUAGE_TAGS, MIN_FINGERPRINT_SCORE;
var init_profile = __esm({
  "src/profile.ts"() {
    "use strict";
    init_src();
    TERMINALHIRE_DIR5 = join6(homedir5(), ".terminalhire");
    PROFILE_FILE = join6(TERMINALHIRE_DIR5, "profile.enc");
    KEY_FILE2 = join6(TERMINALHIRE_DIR5, "key");
    ALGO2 = "aes-256-gcm";
    KEY_BYTES2 = 32;
    IV_BYTES2 = 12;
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

// bin/jpi-claim.js
init_src();
import { readFileSync as readFileSync7, writeFileSync as writeFileSync6, mkdirSync as mkdirSync6, existsSync as existsSync6, rmSync as rmSync3 } from "fs";
import { join as join7 } from "path";
import { homedir as homedir6, hostname as osHostname } from "os";
import { execFile } from "child_process";
import { promisify } from "util";
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

// bin/jpi-claim.js
init_claims();

// bin/claim-push-bg.js
import { createHash as createHash3 } from "crypto";
import { readFileSync as readFileSync4, writeFileSync as writeFileSync3, mkdirSync as mkdirSync3, existsSync as existsSync3, rmSync as rmSync2 } from "fs";
import { join as join4 } from "path";
import { homedir as homedir3 } from "os";

// src/github-auth.ts
import {
  createCipheriv,
  createDecipheriv,
  randomBytes as randomBytes2
} from "crypto";
import {
  readFileSync as readFileSync3,
  writeFileSync as writeFileSync2,
  mkdirSync as mkdirSync2,
  existsSync as existsSync2,
  rmSync
} from "fs";
import { join as join3 } from "path";
import { homedir as homedir2 } from "os";
var TERMINALHIRE_DIR2 = join3(homedir2(), ".terminalhire");
var TOKEN_FILE = join3(TERMINALHIRE_DIR2, "github-token.enc");
var KEY_FILE = join3(TERMINALHIRE_DIR2, "key");
var ALGO = "aes-256-gcm";
var KEY_BYTES = 32;
var IV_BYTES = 12;
async function loadKey() {
  try {
    const kt = await Promise.resolve().then(() => __toESM(require_keytar2(), 1));
    const stored = await kt.getPassword("terminalhire", "profile-key");
    if (stored) return Buffer.from(stored, "hex");
    const key2 = randomBytes2(KEY_BYTES);
    await kt.setPassword("terminalhire", "profile-key", key2.toString("hex"));
    return key2;
  } catch {
  }
  mkdirSync2(TERMINALHIRE_DIR2, { recursive: true });
  if (existsSync2(KEY_FILE)) {
    return Buffer.from(readFileSync3(KEY_FILE, "utf8").trim(), "hex");
  }
  const key = randomBytes2(KEY_BYTES);
  writeFileSync2(KEY_FILE, key.toString("hex"), { mode: 384, encoding: "utf8" });
  return key;
}
function encrypt(plaintext, key) {
  const iv = randomBytes2(IV_BYTES);
  const cipher = createCipheriv(ALGO, key, iv);
  const ct = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return { iv: iv.toString("hex"), tag: tag.toString("hex"), ciphertext: ct.toString("hex") };
}

// bin/claim-push-bg.js
var TERMINALHIRE_DIR3 = process.env.TERMINALHIRE_DIR || join4(homedir3(), ".terminalhire");
var CLAIM_PUSH_AUTO_MARKER = join4(TERMINALHIRE_DIR3, "claim-push-auto.json");
var CLAIM_PUSH_TOKEN_FILE = join4(TERMINALHIRE_DIR3, "claim-push-token.enc");
var AUTO_CONSENT_VERSION = 2;
var AUTO_PUSH_THROTTLE_MS = 24 * 60 * 60 * 1e3;
async function writePushTokenEnc(rawToken) {
  mkdirSync3(TERMINALHIRE_DIR3, { recursive: true });
  const key = await loadKey();
  const blob = encrypt(rawToken, key);
  writeFileSync3(CLAIM_PUSH_TOKEN_FILE, JSON.stringify(blob, null, 2), { encoding: "utf8" });
}
function clearPushTokenEnc() {
  try {
    rmSync2(CLAIM_PUSH_TOKEN_FILE);
  } catch {
  }
}
function writeAutoMarker(marker) {
  mkdirSync3(TERMINALHIRE_DIR3, { recursive: true });
  writeFileSync3(CLAIM_PUSH_AUTO_MARKER, JSON.stringify(marker, null, 2) + "\n", "utf8");
}
function clearAutoMarker() {
  try {
    rmSync2(CLAIM_PUSH_AUTO_MARKER);
  } catch {
  }
}
function computeSnapshotHash(pushed) {
  return createHash3("sha256").update(JSON.stringify(pushed)).digest("hex");
}

// bin/jpi-claim.js
var TERMINALHIRE_DIR6 = process.env.TERMINALHIRE_DIR || join7(homedir6(), ".terminalhire");
var INDEX_CACHE_FILE = join7(TERMINALHIRE_DIR6, "index-cache.json");
var CLAIM_PUSH_MARKER = join7(TERMINALHIRE_DIR6, "claim-push.json");
var API_URL = process.env["TERMINALHIRE_API_URL"] ?? process.env["JPI_API_URL"] ?? "https://terminalhire.com";
var CLAIM_SYNC_BASE = "https://terminalhire.com";
var CLAIM_CONSENT_VERSION = 1;
var CLAIM_POLL_INTERVAL_MS = 2e3;
var CLAIM_POLL_TIMEOUT_MS = 10 * 60 * 1e3;
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
  if (!existsSync6(INDEX_CACHE_FILE)) return [];
  const entry = JSON.parse(readFileSync7(INDEX_CACHE_FILE, "utf8"));
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
      // Fix 2: the aggregator proved 0 open PRs at discovery (it only admits an
      // uncontested issue). Carry it through so resolveBounty can prefer it over
      // a live re-count that degrades to null under a rate limit / >100-PR page.
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
    const logins = /* @__PURE__ */ new Set();
    if (issue.assignee && typeof issue.assignee.login === "string") logins.add(issue.assignee.login);
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
    console.error("Usage: terminalhire claim record <bountyId|issueUrl> [--ack-policy] [--ack-contested]");
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
        assignees: b.assignees,
        contested: isContested(b),
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
  console.log(fmtOpenPRsLine(b));
  const previewContested = fmtContestedWarning(b);
  if (previewContested) console.log(previewContested);
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
function askYes(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((res) => rl.question(question, (a) => {
    rl.close();
    res(String(a).trim().toLowerCase());
  }));
}
function claimSleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}
function readClaimPushMarker() {
  try {
    return existsSync6(CLAIM_PUSH_MARKER) ? JSON.parse(readFileSync7(CLAIM_PUSH_MARKER, "utf8")) : null;
  } catch {
    return null;
  }
}
function writeClaimPushMarker(marker) {
  mkdirSync6(TERMINALHIRE_DIR6, { recursive: true });
  writeFileSync6(CLAIM_PUSH_MARKER, JSON.stringify(marker, null, 2) + "\n", "utf8");
}
function clearClaimPushMarker() {
  try {
    rmSync3(CLAIM_PUSH_MARKER);
  } catch {
  }
}
function renderClaimConsent(pushed, login) {
  console.log("");
  console.log("  terminalhire \u2014 show your claims on your dashboard (opt-in)");
  console.log("");
  console.log(`  As @${login}, the following SCORE-FREE fields of your ${pushed.length} claim${pushed.length === 1 ? "" : "s"}`);
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
      console.error(`
  Could not start claim sync: /api/claim-sync/begin returned ${r.status}. ${detail}`);
      process.exit(1);
    }
    begin = await r.json();
  } catch (err) {
    console.error(`
  Could not start claim sync: ${err instanceof Error ? err.message : String(err)}`);
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
  const consentReceipt = { consentedAt, version: CLAIM_CONSENT_VERSION, fields: PUSHED_CLAIM_FIELDS };
  console.log("\n  Verified. Sharing your claims...");
  let res;
  try {
    res = await fetch(`${CLAIM_SYNC_BASE}/api/claim-sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // autoConsent is included ONLY when the dev opted into background updates —
      // the server mints the pushToken in the same push when it is present + valid.
      body: JSON.stringify({ consentToken: consentReceipt, claims: pushed, proofToken, ...autoConsent ? { autoConsent } : {} }),
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
  writeClaimPushMarker({ consentedAt, login, deleteToken });
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
    console.log("\n  \u2713 Pushed, but background updates could NOT be enabled (server did not issue a token).");
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
    console.log("  Deletion must run from the machine that pushed (the delete token is stored there),");
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
      console.log(`
  Nothing to delete server-side (${res.status}); local marker and background updates cleared.
`);
      console.log("  Background updates (if any) have been stopped.\n");
    } else if (res.status === 401 || res.status === 403) {
      console.error(`
  Server refused the delete (${res.status}); local marker NOT cleared \u2014 the pushToken may still be live.`);
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
async function run() {
  const verb = process.argv[2];
  const { flags, positional } = parseArgs(process.argv.slice(3));
  const active = Boolean(flags.active);
  const json = Boolean(flags.json);
  if (verb === "--push") {
    if (flags.revoke) await cmdRevoke();
    else await cmdPush({ keepUpdated: Boolean(flags["keep-updated"]) });
    return;
  }
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
  CLAIM_CONSENT_VERSION,
  backgroundEnableFailed,
  buildSubmitBody,
  cmdRecord,
  findClaimableByShortRef,
  findClaimableInCache,
  fmtContestedWarning,
  isContested,
  resolveBounty,
  revokeFailureAction,
  run
};
