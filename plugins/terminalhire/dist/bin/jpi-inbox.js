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
var __commonJS = (cb, mod2) => function __require2() {
  return mod2 || (0, cb[__getOwnPropNames(cb)[0]])((mod2 = { exports: {} }).exports, mod2), mod2.exports;
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
var __toESM = (mod2, isNodeMode, target) => (target = mod2 != null ? __create(__getProtoOf(mod2)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod2 || !mod2.__esModule ? __defProp(target, "default", { value: mod2, enumerable: true }) : target,
  mod2
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
var FARM_REPO_DENYLIST, CURATION_EXCLUDED_REPOS, EXCLUDED_LC, AI_BAN_DENYLIST, AI_BAN_LC;
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
  }
});

// ../../packages/core/src/feeds/contribution-gate.ts
var init_contribution_gate = __esm({
  "../../packages/core/src/feeds/contribution-gate.ts"() {
    "use strict";
    init_bounty_gate();
  }
});

// ../../packages/core/src/feeds/contribution-classify.ts
var CONTENT_NOUN_STRONG, CONTENT_NOUN_BROAD, FARM_SEED_NOUN, CONTENT_ADD_RE, NUMBERED_SEED_RE, FARM_SEED_RE;
var init_contribution_classify = __esm({
  "../../packages/core/src/feeds/contribution-classify.ts"() {
    "use strict";
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
var init_gh_governor = __esm({
  "../../packages/core/src/gh-governor.ts"() {
    "use strict";
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
    init_contribution_classify();
    init_rigor();
    init_gh_governor();
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
    init_gh_governor();
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
  const randomBytes5 = eddsaOpts.randomBytes || randomBytes;
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
  function randomSecretKey(seed = randomBytes5(lengths.seed)) {
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

// node-file:/private/tmp/claude-501/-Users-ericgang-job-placement-inline/9716ff9c-0531-4844-adf4-286763cf8ab8/scratchpad/deeplink-wt/node_modules/keytar/build/Release/keytar.node
var require_keytar = __commonJS({
  "node-file:/private/tmp/claude-501/-Users-ericgang-job-placement-inline/9716ff9c-0531-4844-adf4-286763cf8ab8/scratchpad/deeplink-wt/node_modules/keytar/build/Release/keytar.node"(exports, module) {
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

// src/github-auth.ts
import {
  createCipheriv,
  createDecipheriv,
  randomBytes as randomBytes3
} from "crypto";
import {
  readFileSync as readFileSync2,
  writeFileSync,
  mkdirSync,
  existsSync,
  rmSync,
  renameSync
} from "fs";
import { join as join2 } from "path";
import { homedir } from "os";
function skipKeychain() {
  return process.env.TERMINALHIRE_NO_KEYCHAIN !== void 0 || process.env.CI !== void 0 || process.env.VITEST !== void 0 || process.env.NODE_ENV === "test";
}
async function loadKey() {
  if (!skipKeychain()) {
    try {
      const kt = await Promise.resolve().then(() => __toESM(require_keytar2(), 1));
      const stored = await kt.getPassword("terminalhire", "profile-key");
      if (stored) return Buffer.from(stored, "hex");
      const key2 = randomBytes3(KEY_BYTES);
      await kt.setPassword("terminalhire", "profile-key", key2.toString("hex"));
      return key2;
    } catch {
    }
  }
  mkdirSync(TERMINALHIRE_DIR, { recursive: true, mode: 448 });
  if (existsSync(KEY_FILE)) {
    return Buffer.from(readFileSync2(KEY_FILE, "utf8").trim(), "hex");
  }
  const key = randomBytes3(KEY_BYTES);
  writeFileSync(KEY_FILE, key.toString("hex"), { mode: 384, encoding: "utf8" });
  return key;
}
function encrypt(plaintext, key) {
  const iv = randomBytes3(IV_BYTES);
  const cipher = createCipheriv(ALGO, key, iv);
  const ct = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return { iv: iv.toString("hex"), tag: tag.toString("hex"), ciphertext: ct.toString("hex") };
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
var TERMINALHIRE_DIR, TOKEN_FILE, KEY_FILE, ALGO, KEY_BYTES, IV_BYTES;
var init_github_auth = __esm({
  "src/github-auth.ts"() {
    "use strict";
    TERMINALHIRE_DIR = join2(homedir(), ".terminalhire");
    TOKEN_FILE = join2(TERMINALHIRE_DIR, "github-token.enc");
    KEY_FILE = join2(TERMINALHIRE_DIR, "key");
    ALGO = "aes-256-gcm";
    KEY_BYTES = 32;
    IV_BYTES = 12;
  }
});

// src/chat-keystore.ts
import { existsSync as existsSync2, mkdirSync as mkdirSync2, readFileSync as readFileSync3, writeFileSync as writeFileSync2, rmSync as rmSync2 } from "fs";
import { homedir as homedir2 } from "os";
import { join as join3 } from "path";
async function loadOrCreateIdentity() {
  const key = await loadKey();
  if (existsSync2(IDENTITY_FILE)) {
    const blob2 = JSON.parse(readFileSync3(IDENTITY_FILE, "utf8"));
    return JSON.parse(decrypt(blob2, key));
  }
  const keypair = generateIdentityKeypair();
  mkdirSync2(TERMINALHIRE_DIR2, { recursive: true });
  const blob = encrypt(JSON.stringify(keypair), key);
  writeFileSync2(IDENTITY_FILE, JSON.stringify(blob, null, 2), { mode: 384, encoding: "utf8" });
  return keypair;
}
var TERMINALHIRE_DIR2, IDENTITY_FILE;
var init_chat_keystore = __esm({
  "src/chat-keystore.ts"() {
    "use strict";
    init_src();
    init_github_auth();
    TERMINALHIRE_DIR2 = join3(homedir2(), ".terminalhire");
    IDENTITY_FILE = join3(TERMINALHIRE_DIR2, "chat-identity.enc");
  }
});

// src/web-session.ts
import {
  chmodSync,
  existsSync as existsSync3,
  mkdirSync as mkdirSync3,
  readFileSync as readFileSync4,
  rmSync as rmSync3,
  writeFileSync as writeFileSync3
} from "fs";
import { homedir as homedir3 } from "os";
import { join as join4 } from "path";
function terminalhireDir() {
  return join4(homedir3(), ".terminalhire");
}
function webSessionFilePath() {
  return join4(terminalhireDir(), "web-session");
}
function readWebSessionFile() {
  try {
    const path = webSessionFilePath();
    if (!existsSync3(path)) return null;
    const v = readFileSync4(path, "utf8").trim();
    return v.length > 0 ? v : null;
  } catch {
    return null;
  }
}
function readWebSessionCookie() {
  const fromFile = readWebSessionFile();
  if (fromFile) return fromFile;
  const env = process.env["TERMINALHIRE_WEB_SESSION"];
  return typeof env === "string" && env.length > 0 ? env : null;
}
var init_web_session = __esm({
  "src/web-session.ts"() {
    "use strict";
  }
});

// src/chat-client.ts
import { existsSync as existsSync4, mkdirSync as mkdirSync4, readFileSync as readFileSync5, writeFileSync as writeFileSync4 } from "fs";
import { homedir as homedir4 } from "os";
import { join as join5 } from "path";
function defaultReadPeerPins() {
  try {
    if (!existsSync4(PEERS_FILE)) return {};
    const parsed = JSON.parse(readFileSync5(PEERS_FILE, "utf8"));
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return {};
    const out = {};
    for (const [login, key] of Object.entries(parsed)) {
      if (typeof key === "string" && key.length > 0) out[login] = key;
    }
    return out;
  } catch {
    return {};
  }
}
function defaultWritePeerPins(pins) {
  mkdirSync4(TERMINALHIRE_DIR3, { recursive: true });
  writeFileSync4(PEERS_FILE, JSON.stringify(pins, null, 2), { mode: 384, encoding: "utf8" });
}
function defaultChatClientDeps() {
  return {
    fetchImpl: (...args) => globalThis.fetch(...args),
    // Session source priority: persisted file (`terminalhire link`) FIRST, then the
    // legacy TERMINALHIRE_WEB_SESSION env, then none.
    sessionCookie: () => readWebSessionCookie(),
    loadIdentity: () => loadOrCreateIdentity(),
    readPeerPins: defaultReadPeerPins,
    writePeerPins: defaultWritePeerPins
  };
}
function createChatClient(overrides) {
  const deps = { ...defaultChatClientDeps(), ...overrides };
  function requireCookie() {
    const cookie = deps.sessionCookie();
    if (!cookie) throw new ChatNotLinkedError();
    return cookie;
  }
  async function authedFetch(path, init) {
    const cookie = requireCookie();
    const headers = {
      ...init.headers ?? {},
      Cookie: `${GH_SESSION_COOKIE}=${cookie}`
    };
    const res = await deps.fetchImpl(`${CHAT_BASE}${path}`, {
      ...init,
      headers,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
    });
    if (res.status === 401) throw new ChatSessionExpiredError();
    return res;
  }
  async function ensureKeyPublished() {
    const identity = await deps.loadIdentity();
    const res = await authedFetch("/api/chat/keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicKey: identity.publicKey })
    });
    if (!res.ok) throw new ChatRequestError("/api/chat/keys", res.status);
  }
  async function fetchPeerKey(peerLogin) {
    const login = peerLogin.trim();
    if (!login) throw new Error("peerLogin is required");
    const res = await authedFetch(`/api/chat/keys?login=${encodeURIComponent(login)}`, {
      method: "GET"
    });
    if (!res.ok) throw new ChatRequestError("/api/chat/keys", res.status);
    const data = await res.json();
    const servedKey = data.publicKey;
    if (typeof servedKey !== "string" || servedKey.length === 0) {
      throw new ChatRequestError("/api/chat/keys", res.status, "missing publicKey in response");
    }
    const pins = deps.readPeerPins();
    const pinned = pins[login];
    if (pinned === void 0) {
      pins[login] = servedKey;
      deps.writePeerPins(pins);
      return servedKey;
    }
    if (pinned !== servedKey) {
      throw new SafetyNumberChangedError(login, pinned, servedKey);
    }
    return pinned;
  }
  async function sendMessage(introId, peerLogin, plaintext) {
    const peerPublicKey = await fetchPeerKey(peerLogin);
    const identity = await deps.loadIdentity();
    const encrypted = encryptMessage(plaintext, identity.privateKey, peerPublicKey);
    const res = await authedFetch("/api/chat/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Wire body is ciphertext-only — the plaintext never leaves this machine.
      body: JSON.stringify({
        introId,
        ciphertext: encrypted.ciphertext,
        nonce: encrypted.nonce
      })
    });
    if (!res.ok) throw new ChatRequestError("/api/chat/send", res.status);
    const data = await res.json();
    if (typeof data.messageId !== "string") {
      throw new ChatRequestError("/api/chat/send", res.status, "missing messageId in response");
    }
    return data.messageId;
  }
  async function pollMessages(introId, peerLogin, since) {
    const peerPublicKey = await fetchPeerKey(peerLogin);
    const identity = await deps.loadIdentity();
    const sinceIso = since === void 0 ? "" : since instanceof Date ? since.toISOString() : String(since);
    const qs = new URLSearchParams({ intro_id: introId });
    if (sinceIso) qs.set("since", sinceIso);
    const res = await authedFetch(`/api/chat/poll?${qs.toString()}`, { method: "GET" });
    if (!res.ok) throw new ChatRequestError("/api/chat/poll", res.status);
    const data = await res.json();
    const messages = data.messages ?? [];
    return messages.map((m) => ({
      id: m.id,
      senderLogin: m.senderLogin,
      plaintext: decryptMessage({ ciphertext: m.ciphertext, nonce: m.nonce }, identity.privateKey, peerPublicKey),
      createdAt: m.createdAt
    }));
  }
  async function heartbeat(optin) {
    const res = await authedFetch("/api/chat/presence", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ optin })
    });
    if (!res.ok) throw new ChatRequestError("/api/chat/presence", res.status);
  }
  async function getPeerPresence(peerLogin) {
    const login = peerLogin.trim();
    if (!login) throw new Error("peerLogin is required");
    const res = await authedFetch("/api/chat/presence", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ optin: true, peer: login })
    });
    if (!res.ok) throw new ChatRequestError("/api/chat/presence", res.status);
    const data = await res.json();
    const presence = data.presence ?? null;
    if (!presence) return null;
    return {
      login: presence.login,
      lastSeen: presence.lastSeen ?? null,
      optin: presence.optin === true,
      shareActivity: presence.shareActivity === true
    };
  }
  async function setActivitySharing(share) {
    const res = await authedFetch("/api/chat/activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ share })
    });
    if (!res.ok) throw new ChatRequestError("/api/chat/activity", res.status);
    await res.json();
  }
  async function applyBlock(login, action) {
    const target = login.trim();
    if (!target) throw new Error("login is required");
    const res = await authedFetch("/api/chat/block", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login: target, action })
    });
    if (!res.ok) throw new ChatRequestError("/api/chat/block", res.status);
  }
  async function getSafetyNumber(peerLogin) {
    const peerPublicKey = await fetchPeerKey(peerLogin);
    const identity = await deps.loadIdentity();
    return safetyNumber(identity.publicKey, peerPublicKey);
  }
  return {
    ensureKeyPublished,
    fetchPeerKey,
    sendMessage,
    pollMessages,
    heartbeat,
    getPeerPresence,
    setActivitySharing,
    blockPeer: (login) => applyBlock(login, "block"),
    unblock: (login) => applyBlock(login, "unblock"),
    getSafetyNumber
  };
}
var CHAT_BASE, GH_SESSION_COOKIE, TERMINALHIRE_DIR3, PEERS_FILE, REQUEST_TIMEOUT_MS, ChatNotLinkedError, ChatSessionExpiredError, SafetyNumberChangedError, ChatRequestError;
var init_chat_client = __esm({
  "src/chat-client.ts"() {
    "use strict";
    init_src();
    init_chat_keystore();
    init_web_session();
    CHAT_BASE = process.env["TERMINALHIRE_API_URL"] || "https://terminalhire.com";
    GH_SESSION_COOKIE = "__jpi_gh_session";
    TERMINALHIRE_DIR3 = join5(homedir4(), ".terminalhire");
    PEERS_FILE = join5(TERMINALHIRE_DIR3, "chat-peers.json");
    REQUEST_TIMEOUT_MS = 1e4;
    ChatNotLinkedError = class extends Error {
      constructor() {
        super(
          "No linked web session found on this machine. Run `terminalhire link` to connect this terminal to your account, then re-run."
        );
        this.name = "ChatNotLinkedError";
      }
    };
    ChatSessionExpiredError = class extends Error {
      constructor() {
        super(
          "Your linked web session expired. Run `terminalhire link` to reconnect this terminal, then re-run."
        );
        this.name = "ChatSessionExpiredError";
      }
    };
    SafetyNumberChangedError = class extends Error {
      peerLogin;
      pinnedKey;
      servedKey;
      constructor(peerLogin, pinnedKey, servedKey) {
        super(`\u26A0 safety number changed for @${peerLogin} \u2014 the key on file does not match the server. Verify before continuing.`);
        this.name = "SafetyNumberChangedError";
        this.peerLogin = peerLogin;
        this.pinnedKey = pinnedKey;
        this.servedKey = servedKey;
      }
    };
    ChatRequestError = class extends Error {
      status;
      constructor(path, status, detail) {
        super(`chat request to ${path} failed (${status})${detail ? `: ${detail}` : ""}`);
        this.name = "ChatRequestError";
        this.status = status;
      }
    };
  }
});

// src/config.ts
import { readFileSync as readFileSync6, writeFileSync as writeFileSync5, mkdirSync as mkdirSync5, existsSync as existsSync5 } from "fs";
import { join as join6 } from "path";
import { homedir as homedir5 } from "os";
function readConfig() {
  try {
    if (!existsSync5(CONFIG_FILE)) return { ...DEFAULT_CONFIG };
    const raw = readFileSync6(CONFIG_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_CONFIG, ...parsed };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}
function writeConfig(config) {
  mkdirSync5(TERMINALHIRE_DIR4, { recursive: true });
  const current = readConfig();
  const merged = { ...current, ...config };
  writeFileSync5(CONFIG_FILE, JSON.stringify(merged, null, 2) + "\n", "utf8");
}
var TERMINALHIRE_DIR4, CONFIG_FILE, DEFAULT_CONFIG;
var init_config = __esm({
  "src/config.ts"() {
    "use strict";
    TERMINALHIRE_DIR4 = join6(homedir5(), ".terminalhire");
    CONFIG_FILE = join6(TERMINALHIRE_DIR4, "config.json");
    DEFAULT_CONFIG = {
      nudge: "session",
      peerConnect: false,
      peerConnectPrompted: false,
      resumePublishPrompted: false,
      chatDisclosureAck: false,
      chatShareActivity: false,
      inboundNudgeMuted: false,
      inboundNudgeDisclosed: false,
      contributeEnabled: false,
      contributePrompted: false,
      betaOptIn: false,
      lastFullFeedbackAt: null,
      lastPulseAskAt: null,
      pulseDisclosed: false
    };
  }
});

// bin/tui-core.js
function sanitizeLine(text) {
  return String(text).replace(ANSI_CSI, "").replace(ANSI_OSC, "").replace(ANSI_OTHER, "").replace(C0_C1_DEL, "");
}
function truncate(s, n) {
  const t = String(s);
  return t.length <= n ? t : `${t.slice(0, n - 1)}\u2026`;
}
var ANSI_CSI, ANSI_OSC, ANSI_OTHER, C0_C1_DEL, PALETTE, COLOR_ROLES;
var init_tui_core = __esm({
  "bin/tui-core.js"() {
    "use strict";
    ANSI_CSI = /\x1b\[[0-?]*[ -/]*[@-~]/g;
    ANSI_OSC = /\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)/g;
    ANSI_OTHER = /\x1b[@-_]/g;
    C0_C1_DEL = /[\x00-\x1f\x7f-\x9f]/g;
    PALETTE = {
      truecolor: {
        bg: "\x1B[48;2;13;17;23m",
        panel: "\x1B[48;2;22;27;34m",
        rule: "\x1B[38;2;48;54;61m",
        text: "\x1B[38;2;201;209;217m",
        muted: "\x1B[38;2;125;133;144m",
        accent: "\x1B[38;2;88;166;255m",
        "accent-bright": "\x1B[38;2;121;192;255m",
        green: "\x1B[38;2;63;185;80m",
        amber: "\x1B[38;2;210;153;34m"
      },
      256: {
        bg: "\x1B[48;5;233m",
        panel: "\x1B[48;5;235m",
        rule: "\x1B[38;5;240m",
        text: "\x1B[38;5;252m",
        muted: "\x1B[38;5;245m",
        accent: "\x1B[38;5;75m",
        "accent-bright": "\x1B[38;5;117m",
        green: "\x1B[38;5;71m",
        amber: "\x1B[38;5;178m"
      },
      16: {
        bg: "\x1B[40m",
        panel: "\x1B[100m",
        rule: "\x1B[90m",
        text: "\x1B[37m",
        muted: "\x1B[90m",
        accent: "\x1B[94m",
        "accent-bright": "\x1B[96m",
        green: "\x1B[92m",
        amber: "\x1B[93m"
      }
    };
    COLOR_ROLES = Object.keys(PALETTE.truecolor);
  }
});

// bin/jpi-chat-read.js
var jpi_chat_read_exports = {};
__export(jpi_chat_read_exports, {
  buildInboxItems: () => buildInboxItems,
  formatClock: () => formatClock,
  formatStamp: () => formatStamp,
  postReadCursor: () => postReadCursor,
  readReadCursors: () => readReadCursors,
  renderInbox: () => renderInbox,
  renderThread: () => renderThread,
  runInbox: () => runInbox,
  runReadThread: () => runReadThread,
  runSend: () => runSend,
  syncUnreadBadge: () => syncUnreadBadge,
  writeReadCursor: () => writeReadCursor
});
import { existsSync as existsSync6, mkdirSync as mkdirSync6, readFileSync as readFileSync7, writeFileSync as writeFileSync6 } from "fs";
import { homedir as homedir6 } from "os";
import { join as join7 } from "path";
async function syncUnreadBadge(deps = {}) {
  const readCookie = deps.readCookie ?? readWebSessionCookie;
  const fetchImpl = deps.fetchImpl ?? globalThis.fetch;
  const cacheFile = deps.cacheFile ?? INDEX_CACHE_FILE;
  try {
    const cookie = readCookie();
    if (!cookie || !existsSync6(cacheFile)) return;
    const res = await fetchImpl(`${CHAT_BASE2}/api/chat/inbox`, {
      method: "GET",
      headers: { Cookie: `${GH_SESSION_COOKIE2}=${cookie}` },
      signal: AbortSignal.timeout(2500)
    });
    if (!res.ok) return;
    const body = await res.json();
    const inbox = Array.isArray(body?.inbox) ? body.inbox : [];
    const total = inbox.reduce(
      (sum, it) => sum + (it && typeof it.unreadCount === "number" && it.unreadCount > 0 ? it.unreadCount : 0),
      0
    );
    const entry = JSON.parse(readFileSync7(cacheFile, "utf8"));
    entry.unreadChat = { count: total };
    writeFileSync6(cacheFile, JSON.stringify(entry), "utf8");
  } catch {
  }
}
function readReadCursors() {
  try {
    if (!existsSync6(READS_FILE)) return {};
    const parsed = JSON.parse(readFileSync7(READS_FILE, "utf8"));
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return {};
    const out = {};
    for (const [login, iso] of Object.entries(parsed)) {
      if (typeof iso === "string" && iso.length > 0) out[login] = iso;
    }
    return out;
  } catch {
    return {};
  }
}
function writeReadCursor(login, iso, deps = {}) {
  const read = deps.readReadCursors ?? readReadCursors;
  const cursors = read();
  const prev = cursors[login];
  if (prev && iso <= prev) return;
  cursors[login] = iso;
  mkdirSync6(TERMINALHIRE_DIR5, { recursive: true });
  writeFileSync6(READS_FILE, JSON.stringify(cursors, null, 2), { mode: 384, encoding: "utf8" });
}
async function postReadCursor(peerLogin, lastReadAt, deps = {}) {
  const readCookie = deps.readCookie ?? readWebSessionCookie;
  const cookie = readCookie();
  if (!cookie) return;
  try {
    await fetch(`${CHAT_BASE2}/api/chat/read-cursor`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: `${GH_SESSION_COOKIE2}=${cookie}` },
      body: JSON.stringify({ peerLogin, lastReadAt }),
      // Best-effort cross-device sync — not latency-sensitive, so a short bound
      // keeps a cold/unreachable server from stalling the reader's exit.
      signal: AbortSignal.timeout(2500)
    });
  } catch {
  }
}
function formatClock(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "--:--";
  let h = d.getHours();
  const m = d.getMinutes();
  const ampm = h >= 12 ? "p" : "a";
  h %= 12;
  if (h === 0) h = 12;
  return `${h}:${String(m).padStart(2, "0")}${ampm}`;
}
function formatStamp(iso, now = /* @__PURE__ */ new Date()) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const sameDay = d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
  if (sameDay) return formatClock(iso);
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}
function truncate2(s, n) {
  const t = String(s);
  return t.length <= n ? t : `${t.slice(0, n - 1)}\u2026`;
}
function renderInbox(items, invites = []) {
  const lines = [];
  lines.push("  connections \xB7 terminalhire chat");
  lines.push("  " + "\u2500".repeat(64));
  if (invites && invites.length > 0) {
    lines.push(`  PENDING INVITATIONS (${invites.length})`);
    for (const iv of invites) {
      const login = sanitizeLine(iv.login);
      const handle = `@${login}`;
      lines.push(`  \u2198 ${handle.padEnd(18)} wants to connect \xB7 terminalhire intro --accept ${handle}`);
    }
    lines.push("  " + "\u2500".repeat(64));
  }
  if (!items || items.length === 0) {
    lines.push("  (no accepted connections yet \u2014 request one: terminalhire intro <login>)");
  } else {
    for (const it of items) {
      const dot = formatPresence(it.presence).charAt(0);
      const unread = it.unread > 0 ? `\u2709 ${it.unread}` : "\u2014";
      const login = `@${sanitizeLine(it.login)}`;
      const stamp = sanitizeLine(it.lastStamp || "");
      const preview = it.preview ? truncate2(sanitizeLine(it.preview), 38) : "";
      lines.push(
        `  ${dot} ${login.padEnd(18)} ${unread.padEnd(5)} ${stamp.padStart(6)}  ${preview}`
      );
    }
  }
  lines.push("  " + "\u2500".repeat(64));
  lines.push('  read: terminalhire chat <login> --read   \xB7   reply: terminalhire chat <login> --send "\u2026"');
  return lines.join("\n") + "\n";
}
function renderThread(state) {
  const { peerLogin, presence, safety, messages, total } = state;
  const safePeer = sanitizeLine(peerLogin);
  const status = formatPresence(presence);
  const lines = [];
  lines.push(
    `  @${safePeer}  ${status}` + (safety ? `  \xB7 safety# ${sanitizeLine(safety)}` : "")
  );
  lines.push("  " + "\u2500".repeat(64));
  if (!messages || messages.length === 0) {
    lines.push(`  (no messages yet \u2014 say hi: terminalhire chat ${safePeer} --send "\u2026")`);
  } else {
    for (const m of messages) {
      const who = m.senderLogin === peerLogin ? `@${safePeer}` : "you";
      lines.push(`  ${formatClock(m.createdAt).padStart(6)}  ${who.padEnd(16)} ${sanitizeLine(m.plaintext)}`);
    }
  }
  lines.push("  " + "\u2500".repeat(64));
  const shown = messages ? messages.length : 0;
  const more = total > shown ? " \xB7 --all for older" : "";
  lines.push(`  ${shown} shown${more} \xB7 reply: terminalhire chat ${safePeer} --send "\u2026"`);
  return lines.join("\n") + "\n";
}
function writeProblem(output, result, target) {
  switch (result.status) {
    case "not-linked":
      output.write(
        "\n  No linked web session found on this machine.\n  Run `terminalhire link` to connect this terminal to your account, then re-run.\n\n"
      );
      return "not-linked";
    case "expired":
      output.write(
        `
  Your web session expired \u2014 sign in again at ${CHAT_BASE2}/dashboard and re-bridge your session, then re-run.

`
      );
      return "expired";
    case "not-connected":
      output.write(
        `
  You are not connected to @${sanitizeLine(target)}.
  Chat is only available for an accepted intro. Request one with:
    terminalhire intro ${sanitizeLine(target)}

`
      );
      return "not-connected";
    default:
      output.write(`
  Could not reach your connections: ${sanitizeLine(result.message ?? "unknown error")}

`);
      return "error";
  }
}
async function gateDisclosure(ensureDisclosure, input, output) {
  const ack = await ensureDisclosure({ input, output });
  if (!ack.acknowledged) {
    output.write(
      "\n  Chat needs you to acknowledge the privacy notice first.\n  Run `terminalhire chat <login>` once in your terminal to read & accept it,\n  then re-run this command.\n\n"
    );
    return false;
  }
  return true;
}
async function buildInboxItems(deps = {}) {
  const {
    client = createChatClient(),
    listConnections = defaultListConnections,
    readCursors = readReadCursors
  } = deps;
  const listed = await listConnections();
  if (listed.status !== "ok") return listed;
  const cursors = readCursors();
  const items = [];
  for (const conn of listed.connections) {
    let messages = [];
    try {
      messages = await client.pollMessages(conn.introId, conn.peerLogin);
    } catch {
      messages = [];
    }
    const cursor = cursors[conn.peerLogin];
    const unread = messages.filter(
      (m) => m.senderLogin === conn.peerLogin && (!cursor || m.createdAt > cursor)
    ).length;
    const last = messages.length > 0 ? messages[messages.length - 1] : null;
    items.push({
      login: conn.peerLogin,
      presence: REACHABLE_DISPLAY,
      unread,
      lastStamp: last ? formatStamp(last.createdAt) : "",
      // Raw ISO of the newest message — the TUI's `r` key marks the thread read at
      // this exact watermark (postReadCursor). The formatted lastStamp is display-only.
      lastStampIso: last ? last.createdAt : null,
      preview: last ? last.plaintext : ""
    });
  }
  return { status: "ok", items };
}
async function runInbox(opts = {}) {
  const {
    output = process.stdout,
    input = process.stdin,
    client = createChatClient(),
    listConnections = defaultListConnections,
    listInvites = defaultListPendingInvites,
    readCursors = readReadCursors,
    ensureDisclosure = ensureChatDisclosure
  } = opts;
  if (!await gateDisclosure(ensureDisclosure, input, output)) {
    return { ok: false, reason: "not-acknowledged" };
  }
  const built = await buildInboxItems({ client, listConnections, readCursors });
  if (built.status !== "ok") {
    return { ok: false, reason: writeProblem(output, built, "") };
  }
  let invites = [];
  try {
    const inv = await listInvites();
    if (inv && inv.status === "ok") invites = inv.invites;
  } catch {
  }
  output.write(renderInbox(built.items, invites));
  return { ok: true, count: built.items.length, invites: invites.length };
}
async function runReadThread(opts = {}) {
  const {
    login,
    all = false,
    limit = 8,
    output = process.stdout,
    input = process.stdin,
    client = createChatClient(),
    resolveConnection = defaultResolveConnection,
    writeCursor = writeReadCursor,
    syncCursor = postReadCursor,
    syncBadge = syncUnreadBadge,
    ensureDisclosure = ensureChatDisclosure
  } = opts;
  const target = String(login ?? "").replace(/^@/, "").trim();
  if (!target) {
    output.write("\n  Usage: terminalhire chat <github-login> --read [-n N | --all]\n\n");
    return { ok: false, reason: "no-login" };
  }
  if (!await gateDisclosure(ensureDisclosure, input, output)) {
    return { ok: false, reason: "not-acknowledged" };
  }
  const resolved = await resolveConnection(target);
  if (resolved.status !== "ok") {
    return { ok: false, reason: writeProblem(output, resolved, target) };
  }
  const { introId, peerLogin } = resolved;
  let messages = [];
  try {
    messages = await client.pollMessages(introId, peerLogin);
  } catch (err) {
    output.write(`
  Could not read the thread: ${sanitizeLine(err instanceof Error ? err.message : String(err))}

`);
    return { ok: false, reason: "error" };
  }
  const total = messages.length;
  const shownMessages = all ? messages : messages.slice(Math.max(0, total - limit));
  let safety = "";
  if (typeof client.getSafetyNumber === "function") {
    try {
      safety = await client.getSafetyNumber(peerLogin);
    } catch {
      safety = "";
    }
  }
  output.write(renderThread({ peerLogin, presence: REACHABLE_DISPLAY, safety, messages: shownMessages, total }));
  if (total > 0) {
    const newest = messages[total - 1];
    if (newest && newest.createdAt) {
      try {
        writeCursor(peerLogin, newest.createdAt);
      } catch {
      }
      await syncCursor(peerLogin, newest.createdAt);
      await syncBadge();
    }
  }
  return { ok: true, shown: shownMessages.length, total };
}
async function runSend(opts = {}) {
  const {
    login,
    text,
    output = process.stdout,
    input = process.stdin,
    client = createChatClient(),
    resolveConnection = defaultResolveConnection,
    ensureDisclosure = ensureChatDisclosure,
    writeCursor = writeReadCursor,
    syncCursor = postReadCursor,
    syncBadge = syncUnreadBadge
  } = opts;
  const target = String(login ?? "").replace(/^@/, "").trim();
  const body = String(text ?? "").trim();
  if (!target || !body) {
    output.write('\n  Usage: terminalhire chat <github-login> --send "<message>"\n\n');
    return { ok: false, reason: "usage" };
  }
  if (!await gateDisclosure(ensureDisclosure, input, output)) {
    return { ok: false, reason: "not-acknowledged" };
  }
  const resolved = await resolveConnection(target);
  if (resolved.status !== "ok") {
    return { ok: false, reason: writeProblem(output, resolved, target) };
  }
  const { introId, peerLogin } = resolved;
  try {
    if (typeof client.ensureKeyPublished === "function") await client.ensureKeyPublished();
    await client.sendMessage(introId, peerLogin, body);
  } catch (err) {
    output.write(`
  Could not send to @${sanitizeLine(peerLogin)}: ${sanitizeLine(err instanceof Error ? err.message : String(err))}

`);
    return { ok: false, reason: "error" };
  }
  const nowIso = (/* @__PURE__ */ new Date()).toISOString();
  try {
    writeCursor(peerLogin, nowIso);
  } catch {
  }
  await syncCursor(peerLogin, nowIso);
  await syncBadge();
  if (typeof client.heartbeat === "function") {
    try {
      await client.heartbeat(false);
    } catch {
    }
  }
  output.write(
    `
  Sent to @${sanitizeLine(peerLogin)}: ${sanitizeLine(body)}
  Read the thread: terminalhire chat ${sanitizeLine(peerLogin)} --read

`
  );
  return { ok: true };
}
var CHAT_BASE2, GH_SESSION_COOKIE2, TERMINALHIRE_DIR5, READS_FILE, INDEX_CACHE_FILE, REACHABLE_DISPLAY;
var init_jpi_chat_read = __esm({
  "bin/jpi-chat-read.js"() {
    "use strict";
    init_chat_client();
    init_web_session();
    init_jpi_chat();
    CHAT_BASE2 = process.env["TERMINALHIRE_API_URL"] || "https://terminalhire.com";
    GH_SESSION_COOKIE2 = "__jpi_gh_session";
    TERMINALHIRE_DIR5 = process.env.TERMINALHIRE_DIR || join7(homedir6(), ".terminalhire");
    READS_FILE = join7(TERMINALHIRE_DIR5, "chat-reads.json");
    INDEX_CACHE_FILE = join7(TERMINALHIRE_DIR5, "index-cache.json");
    REACHABLE_DISPLAY = { shareActivity: false, optin: false, lastSeen: null };
  }
});

// src/crypto-store.ts
import {
  createCipheriv as createCipheriv2,
  createDecipheriv as createDecipheriv2,
  randomBytes as randomBytes4
} from "crypto";
import {
  readFileSync as readFileSync8,
  writeFileSync as writeFileSync7,
  mkdirSync as mkdirSync7,
  existsSync as existsSync7,
  renameSync as renameSync2,
  rmSync as rmSync4
} from "fs";
import { join as join8, dirname, basename } from "path";
import { homedir as homedir7 } from "os";
import { createRequire } from "module";
function encrypt2(plaintext, key) {
  const iv = randomBytes4(IV_BYTES2);
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
function skipKeychain2() {
  return process.env.TERMINALHIRE_NO_KEYCHAIN !== void 0 || process.env.CI !== void 0 || process.env.VITEST !== void 0 || process.env.NODE_ENV === "test";
}
async function tryLoadFromKeytar(policy) {
  if (forceKeytarUnavailableForTests || skipKeychain2()) return null;
  try {
    const kt = policy === "keychain-required" ? createRequire(import.meta.url)("keytar") : await Promise.resolve().then(() => __toESM(require_keytar2(), 1));
    const stored = await kt.getPassword(KEYTAR_SERVICE, KEYTAR_ACCOUNT);
    if (stored) {
      return Buffer.from(stored, "hex");
    }
    const key = randomBytes4(KEY_BYTES2);
    await kt.setPassword(KEYTAR_SERVICE, KEYTAR_ACCOUNT, key.toString("hex"));
    return key;
  } catch {
    return null;
  }
}
function loadOrCreateFileKey() {
  mkdirSync7(TERMINALHIRE_DIR6, { recursive: true, mode: 448 });
  if (existsSync7(KEY_FILE2)) {
    return Buffer.from(readFileSync8(KEY_FILE2, "utf8").trim(), "hex");
  }
  const key = randomBytes4(KEY_BYTES2);
  writeFileSync7(KEY_FILE2, key.toString("hex"), { mode: 384, encoding: "utf8" });
  return key;
}
function warnStderr(message) {
  process.stderr.write(`${message}
`);
}
function atomicWriteFileSync(filePath, content) {
  const dir = dirname(filePath);
  mkdirSync7(dir, { recursive: true, mode: 448 });
  const tmp = join8(dir, `.${basename(filePath)}.tmp-${process.pid}-${randomBytes4(6).toString("hex")}`);
  writeFileSync7(tmp, content, { encoding: "utf8", mode: 384 });
  renameSync2(tmp, filePath);
}
async function deleteKey() {
  for (const filePath of dependentStoreFiles) {
    try {
      rmSync4(filePath);
    } catch {
    }
  }
  if (!forceKeytarUnavailableForTests && !skipKeychain2()) {
    try {
      const kt = await Promise.resolve().then(() => __toESM(require_keytar2(), 1));
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
    const key = await tryLoadFromKeytar("keychain-required");
    if (!key) {
      warnStderr(`crypto-store: OS keychain unavailable \u2014 store at ${filePath} is disabled (no plaintext key file will be written)`);
      return null;
    }
    return key;
  }
  const fromKeytar = await tryLoadFromKeytar("keytar-first-file-fallback");
  if (fromKeytar) return fromKeytar;
  return loadOrCreateFileKey();
}
function createEncryptedStore(filePath, opts) {
  dependentStoreFiles.add(filePath);
  async function read() {
    const key = await resolveKey(filePath, opts);
    if (!key) return opts.blank();
    if (!existsSync7(filePath)) return opts.blank();
    try {
      const raw = readFileSync8(filePath, "utf8");
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
var TERMINALHIRE_DIR6, KEY_FILE2, KEYTAR_SERVICE, KEYTAR_ACCOUNT, ALGO2, KEY_BYTES2, IV_BYTES2, forceKeytarUnavailableForTests, dependentStoreFiles;
var init_crypto_store = __esm({
  "src/crypto-store.ts"() {
    "use strict";
    TERMINALHIRE_DIR6 = join8(homedir7(), ".terminalhire");
    KEY_FILE2 = join8(TERMINALHIRE_DIR6, "key");
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
import { join as join9 } from "path";
import { homedir as homedir8 } from "os";
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
var TERMINALHIRE_DIR7, PROFILE_FILE, profileStore, LANGUAGE_TAGS, MIN_FINGERPRINT_SCORE;
var init_profile = __esm({
  "src/profile.ts"() {
    "use strict";
    init_src();
    init_crypto_store();
    TERMINALHIRE_DIR7 = join9(homedir8(), ".terminalhire");
    PROFILE_FILE = join9(TERMINALHIRE_DIR7, "profile.enc");
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

// bin/jpi-chat.js
import { createInterface } from "readline";
import { existsSync as existsSync8, readFileSync as readFileSync9 } from "fs";
import { homedir as homedir9 } from "os";
import { join as join10 } from "path";
function defaultPromptAck({ input = process.stdin, output = process.stdout } = {}) {
  if (!input || input.isTTY !== true) return Promise.resolve(false);
  const rl = createInterface({ input, output });
  return new Promise((resolve) => {
    rl.question("  Press Enter to acknowledge and continue (Ctrl-C to cancel): ", () => {
      rl.close();
      resolve(true);
    });
  });
}
async function ensureChatDisclosure(opts = {}) {
  const {
    output = process.stdout,
    input = process.stdin,
    readCfg = readConfig,
    writeCfg = writeConfig,
    promptAck = defaultPromptAck
  } = opts;
  if (readCfg().chatDisclosureAck === true) {
    return { shown: false, acknowledged: true };
  }
  output.write(
    `
  Before your first chat \u2014 please read:

  ${CHAT_DISCLOSURE}

  ${CHAT_AT_REST}

  ${CHAT_CODE_OF_CONDUCT}
  ${CHAT_MIN_AGE}

`
  );
  const ok = await promptAck({ input, output });
  if (!ok) return { shown: true, acknowledged: false };
  writeCfg({ chatDisclosureAck: true });
  return { shown: true, acknowledged: true };
}
function defaultSessionCookie() {
  return readWebSessionCookie();
}
async function fetchIntroList(deps = {}) {
  const fetchImpl = deps.fetchImpl ?? ((...a) => globalThis.fetch(...a));
  const sessionCookie = deps.sessionCookie ?? defaultSessionCookie;
  const cookie = sessionCookie();
  if (!cookie) return { status: "not-linked" };
  let res;
  try {
    res = await fetchImpl(`${CHAT_BASE3}/api/intro/list`, {
      method: "GET",
      headers: { Cookie: `${GH_SESSION_COOKIE3}=${cookie}` },
      signal: AbortSignal.timeout(1e4)
    });
  } catch (err) {
    return { status: "error", message: err instanceof Error ? err.message : String(err) };
  }
  if (res.status === 401) return { status: "expired" };
  if (!res.ok) return { status: "error", message: `/api/intro/list returned ${res.status}` };
  let data = {};
  try {
    data = await res.json();
  } catch {
  }
  const intros = Array.isArray(data?.intros) ? data.intros : [];
  return { status: "ok", intros };
}
async function defaultResolveConnection(login, deps = {}) {
  const listed = await fetchIntroList(deps);
  if (listed.status !== "ok") return listed;
  const want = String(login).replace(/^@/, "").toLowerCase();
  const hit = listed.intros.find(
    (it) => it && it.status === "accepted" && String(it.counterpartyLogin).toLowerCase() === want
  );
  if (!hit) return { status: "not-connected" };
  return { status: "ok", introId: hit.id, peerLogin: hit.counterpartyLogin };
}
async function defaultListConnections(deps = {}) {
  const listed = await fetchIntroList(deps);
  if (listed.status !== "ok") return listed;
  const connections = listed.intros.filter((it) => it && it.status === "accepted" && it.counterpartyLogin).map((it) => ({ introId: it.id, peerLogin: it.counterpartyLogin }));
  return { status: "ok", connections };
}
async function defaultListPendingInvites(deps = {}) {
  const listed = await fetchIntroList(deps);
  if (listed.status !== "ok") return listed;
  const invites = listed.intros.filter((it) => it && it.role === "incoming" && it.status === "pending" && it.counterpartyLogin).map((it) => ({ login: it.counterpartyLogin }));
  return { status: "ok", invites };
}
function relativeTime(then, now = /* @__PURE__ */ new Date()) {
  const t = new Date(then).getTime();
  if (Number.isNaN(t)) return "";
  const deltaMs = Math.max(0, now.getTime() - t);
  const sec = Math.floor(deltaMs / 1e3);
  if (sec < 60) return "just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${Math.max(1, min)}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  const wk = Math.floor(day / 7);
  if (wk < 5) return `${wk}w ago`;
  return "a while ago";
}
function formatPresence(presence, now = /* @__PURE__ */ new Date()) {
  if (!presence) return "\u25CB not on chat yet";
  const share = presence.shareActivity === true;
  const seenMs = share && presence.lastSeen ? new Date(presence.lastSeen).getTime() : NaN;
  const hasSeen = !Number.isNaN(seenMs);
  const fresh = hasSeen && now.getTime() - seenMs <= ACTIVE_WINDOW_MS;
  if (share && presence.optin === true && fresh) return "\u25CF active now";
  if (share && hasSeen) {
    const rel = relativeTime(presence.lastSeen, now);
    return rel ? `\u25D0 reachable \xB7 seen ${rel}` : "\u25D0 reachable";
  }
  return "\u25D0 reachable";
}
function formatThread(state) {
  const { peerLogin, presence, self, messages, inputBuffer, banner, backHint } = state;
  const safePeer = sanitizeLine(peerLogin);
  const status = formatPresence(presence);
  const lines = [];
  lines.push(`  chat with @${safePeer}   ${status}`);
  if (self && (self.login || self.expired)) {
    if (self.expired) {
      lines.push("  \u26A0 your linked session expired \u2014 run: terminalhire login");
    } else {
      const activity = self.shareActivity === true ? "visible" : "hidden";
      lines.push(`  you: @${sanitizeLine(self.login)} \xB7 connected \xB7 activity: ${activity}`);
    }
  }
  lines.push("  " + "\u2500".repeat(56));
  if (!messages || messages.length === 0) {
    lines.push("  (no messages yet \u2014 say hi)");
  } else {
    for (const m of messages) {
      const who = m.senderLogin === peerLogin ? `@${safePeer}` : "you";
      lines.push(`  ${who}: ${sanitizeLine(m.plaintext)}`);
    }
  }
  if (banner) {
    lines.push("  " + "\u2500".repeat(56));
    lines.push(`  ${banner}`);
  }
  lines.push("  " + "\u2500".repeat(56));
  lines.push(`  > ${inputBuffer}`);
  lines.push(
    backHint ? `  Esc back to ${sanitizeLine(backHint)} \xB7 Enter send \xB7 Ctrl-S safety number \xB7 /safety \xB7 /block \xB7 q quit` : "  Enter send \xB7 Ctrl-S safety number \xB7 /safety \xB7 /block \xB7 q quit"
  );
  return CLEAR + lines.join("\n") + "\n";
}
function mergeMessages(existing, incoming) {
  const seen = new Set(existing.map((m) => m.id));
  const out = existing.slice();
  for (const m of incoming) {
    if (m && !seen.has(m.id)) {
      seen.add(m.id);
      out.push(m);
    }
  }
  return out;
}
function readCachedSessionStale() {
  try {
    const p = join10(process.env.TERMINALHIRE_DIR || join10(homedir9(), ".terminalhire"), "index-cache.json");
    if (!existsSync8(p)) return false;
    const cache = JSON.parse(readFileSync9(p, "utf8"));
    return cache?.sessionStale === true;
  } catch {
    return false;
  }
}
async function defaultMarkThreadRead(peerLogin, iso) {
  const { writeReadCursor: writeReadCursor2, postReadCursor: postReadCursor2, syncUnreadBadge: syncUnreadBadge2 } = await Promise.resolve().then(() => (init_jpi_chat_read(), jpi_chat_read_exports));
  writeReadCursor2(peerLogin, iso);
  await syncUnreadBadge2().catch(() => {
  });
  await postReadCursor2(peerLogin, iso).catch(() => {
  });
}
function runNoticePane(opts = {}) {
  const {
    message,
    backHint = null,
    input = process.stdin,
    output = process.stdout,
    signals = process
  } = opts;
  return new Promise((resolve) => {
    let cleaned = false;
    const body = String(message ?? "").replace(/^\n+/, "").replace(/\n+$/, "");
    function render() {
      const lines = ["", ...body.split("\n"), ""];
      lines.push(
        backHint ? `  Press Esc, Enter, or q to go back to ${sanitizeLine(backHint)}.` : "  Press Esc, Enter, or q to continue."
      );
      output.write(CLEAR + lines.join("\n") + "\n");
    }
    function cleanup() {
      if (cleaned) return;
      cleaned = true;
      try {
        if (typeof input.setRawMode === "function") input.setRawMode(false);
      } catch {
      }
      try {
        input.removeListener("data", onData);
      } catch {
      }
      try {
        if (typeof input.pause === "function") input.pause();
      } catch {
      }
      try {
        signals.removeListener("SIGINT", onDismiss);
        signals.removeListener("SIGTERM", onDismiss);
        signals.removeListener("SIGHUP", onDismiss);
        signals.removeListener("uncaughtException", onUncaught);
        signals.removeListener("unhandledRejection", onUncaught);
        signals.removeListener("exit", cleanup);
      } catch {
      }
      output.write(SHOW_CURSOR + EXIT_ALT);
    }
    function onDismiss() {
      if (cleaned) return;
      cleanup();
      resolve();
    }
    function onUncaught(err) {
      cleanup();
      throw err;
    }
    function onData(chunk) {
      if (cleaned) return;
      const s = chunk.toString("utf8");
      if (s === KEY_ESC || s === KEY_ENTER_A || s === KEY_ENTER_B) {
        onDismiss();
        return;
      }
      if (s.charCodeAt(0) === 27) return;
      for (const ch of s) {
        if (ch === KEY_CTRL_C || ch === "q" || ch === "Q") {
          onDismiss();
          return;
        }
      }
    }
    try {
      if (typeof input.setRawMode === "function") input.setRawMode(true);
      if (typeof input.resume === "function") input.resume();
      output.write(ENTER_ALT + HIDE_CURSOR);
      input.on("data", onData);
      signals.on("SIGINT", onDismiss);
      signals.on("SIGTERM", onDismiss);
      signals.on("SIGHUP", onDismiss);
      signals.on("uncaughtException", onUncaught);
      signals.on("unhandledRejection", onUncaught);
      signals.on("exit", cleanup);
      render();
    } catch (err) {
      cleanup();
      output.write(`
  ${err instanceof Error ? err.message : String(err)}

`);
      resolve();
    }
  });
}
async function runChatPane(opts = {}) {
  const {
    login,
    client = createChatClient(),
    resolveConnection = defaultResolveConnection,
    input = process.stdin,
    output = process.stdout,
    signals = process,
    pollIntervalMs = 1500,
    setTimer = (fn, ms) => setInterval(fn, ms),
    clearTimer = (t) => clearInterval(t),
    markRead = defaultMarkThreadRead,
    // Where Esc returns to, when opened from a parent surface (the inbox TUI
    // passes 'inbox'). Copy-only — the caller's loop does the actual returning.
    backHint = null
  } = opts;
  const target = String(login ?? "").replace(/^@/, "").trim();
  if (!target) {
    output.write("\n  Usage: terminalhire chat <github-login>\n\n");
    return { entered: false, reason: "no-login" };
  }
  async function noticeStop(message, reason) {
    if (backHint && input && input.isTTY === true && typeof input.setRawMode === "function") {
      await runNoticePane({ message, backHint, input, output, signals });
    } else {
      output.write(message);
    }
    return { entered: false, reason };
  }
  const resolved = await resolveConnection(target);
  if (resolved.status === "not-linked") {
    return await noticeStop(
      "\n  No linked web session found on this machine.\n  Run `terminalhire link` to connect this terminal to your account, then re-run.\n\n",
      "not-linked"
    );
  }
  if (resolved.status === "expired") {
    return await noticeStop(
      `
  Your web session expired \u2014 sign in again at ${CHAT_BASE3}/dashboard and re-bridge your session, then re-run.

`,
      "expired"
    );
  }
  if (resolved.status === "error") {
    return await noticeStop(`
  Could not check your connections: ${resolved.message}

`, "error");
  }
  if (resolved.status === "not-connected") {
    return await noticeStop(
      `
  You are not connected to @${target}.
  Chat is only available for an accepted intro. Request one with:
    terminalhire intro ${target}

`,
      "not-connected"
    );
  }
  const { introId, peerLogin } = resolved;
  try {
    await client.ensureKeyPublished();
  } catch (err) {
    if (err instanceof ChatSessionExpiredError || err instanceof ChatNotLinkedError) {
      return await noticeStop(`
  ${err.message}

`, "session");
    }
    return await noticeStop(
      `
  Could not open the chat: ${err instanceof Error ? err.message : String(err)}

`,
      "error"
    );
  }
  if (typeof client.fetchPeerKey === "function") {
    try {
      await client.fetchPeerKey(peerLogin);
    } catch (err) {
      if (err instanceof ChatSessionExpiredError || err instanceof ChatNotLinkedError) {
        return await noticeStop(`
  ${err.message}

`, "session");
      }
      if (err instanceof SafetyNumberChangedError) {
        return await noticeStop(
          `
  \u26A0 The safety number for @${peerLogin} changed \u2014 the key on file no longer
  matches the server. Verify out of band before continuing. Chat not opened.

`,
          "safety-changed"
        );
      }
      if (err && err.name === "ChatRequestError" && err.status === 404) {
        return await noticeStop(
          `
  @${peerLogin} isn't reachable for chat yet.
  Chat is end-to-end encrypted, so they need to open chat once to
  publish their key. As soon as they run
    terminalhire chat
  on their side, messages will flow.

`,
          "no-key"
        );
      }
      return await noticeStop(
        `
  Could not open the chat: ${err instanceof Error ? err.message : String(err)}

`,
        "error"
      );
    }
  }
  let selfLogin;
  try {
    const { readProfile: readProfile2 } = await Promise.resolve().then(() => (init_profile(), profile_exports));
    selfLogin = (await readProfile2())?.github?.login;
  } catch {
  }
  let selfExpired = readCachedSessionStale();
  let selfShareActivity = false;
  try {
    selfShareActivity = readConfig().chatShareActivity === true;
  } catch {
  }
  return await new Promise((resolve) => {
    let messages = [];
    let inputBuffer = "";
    let presence = null;
    let banner = "";
    let lastSeen;
    let lastReadMarked;
    let timer = null;
    let polling = false;
    let cleaned = false;
    let exitReason = "quit";
    function repaint() {
      output.write(
        formatThread({
          peerLogin,
          presence,
          self: { login: selfLogin, expired: selfExpired, shareActivity: selfShareActivity },
          messages,
          inputBuffer,
          banner,
          backHint
        })
      );
    }
    function cleanup() {
      if (cleaned) return;
      cleaned = true;
      try {
        if (typeof client.heartbeat === "function") {
          void Promise.resolve(client.heartbeat(false)).catch(() => {
          });
        }
      } catch {
      }
      if (timer) {
        try {
          clearTimer(timer);
        } catch {
        }
        timer = null;
      }
      try {
        if (typeof input.setRawMode === "function") input.setRawMode(false);
      } catch {
      }
      try {
        input.removeListener("data", onData);
      } catch {
      }
      try {
        if (typeof input.pause === "function") input.pause();
      } catch {
      }
      try {
        signals.removeListener("SIGINT", onSignal);
        signals.removeListener("SIGTERM", onTerm);
        signals.removeListener("SIGHUP", onTerm);
        signals.removeListener("uncaughtException", onUncaught);
        signals.removeListener("unhandledRejection", onUncaught);
        signals.removeListener("exit", onExit);
      } catch {
      }
      output.write(SHOW_CURSOR + EXIT_ALT);
    }
    function finish(reason) {
      if (cleaned) return;
      exitReason = reason;
      cleanup();
      output.write(DEPOSIT_CTA);
      resolve({ entered: true, reason });
    }
    async function doPoll() {
      if (polling || cleaned) return;
      polling = true;
      try {
        const fresh = await client.pollMessages(introId, peerLogin, lastSeen);
        if (fresh.length > 0) {
          messages = mergeMessages(messages, fresh);
          const newest = fresh[fresh.length - 1];
          if (newest && newest.createdAt) lastSeen = newest.createdAt;
          let newestIncoming;
          for (const m of fresh) {
            if (m && m.senderLogin === peerLogin && m.createdAt && (!newestIncoming || m.createdAt > newestIncoming)) {
              newestIncoming = m.createdAt;
            }
          }
          if (newestIncoming && (!lastReadMarked || newestIncoming > lastReadMarked)) {
            lastReadMarked = newestIncoming;
            try {
              void Promise.resolve(markRead(peerLogin, newestIncoming)).catch(() => {
              });
            } catch {
            }
          }
          if (banner && !banner.startsWith("\u26A0")) banner = "";
        }
        try {
          presence = await client.getPeerPresence(peerLogin);
        } catch {
          presence = null;
        }
        if (!cleaned) repaint();
      } catch (err) {
        if (err instanceof ChatSessionExpiredError) {
          if (!cleaned) {
            cleanup();
            output.write(`
  ${err.message}

`);
            resolve({ entered: true, reason: "session-expired" });
          }
          return;
        }
        if (err instanceof SafetyNumberChangedError) {
          banner = `\u26A0 safety number CHANGED for @${peerLogin} \u2014 verify out of band before continuing.`;
          if (!cleaned) repaint();
        } else {
          banner = `(poll error: ${err instanceof Error ? err.message : String(err)})`;
          if (!cleaned) repaint();
        }
      } finally {
        polling = false;
      }
    }
    async function showSafetyNumber() {
      try {
        const sn = await client.getSafetyNumber(peerLogin);
        banner = `safety number: ${sn}`;
      } catch (err) {
        if (err instanceof SafetyNumberChangedError) {
          banner = `\u26A0 safety number CHANGED for @${peerLogin} \u2014 verify out of band before continuing.`;
        } else {
          banner = `(could not read safety number: ${err instanceof Error ? err.message : String(err)})`;
        }
      }
      if (!cleaned) repaint();
    }
    async function submitLine(line) {
      const trimmed = line.trim();
      if (trimmed === "q" || trimmed === "/quit") {
        finish("quit");
        return;
      }
      if (trimmed === "/safety") {
        await showSafetyNumber();
        return;
      }
      if (trimmed === "/block") {
        if (typeof client.blockPeer !== "function") {
          banner = "(block is unavailable in this build)";
          if (!cleaned) repaint();
          return;
        }
        try {
          await client.blockPeer(peerLogin);
        } catch (err) {
          if (err instanceof ChatSessionExpiredError) {
            if (!cleaned) {
              cleanup();
              output.write(`
  ${err.message}

`);
              resolve({ entered: true, reason: "session-expired" });
            }
            return;
          }
          banner = `(block failed: ${err instanceof Error ? err.message : String(err)})`;
          if (!cleaned) repaint();
          return;
        }
        if (!cleaned) {
          cleanup();
          output.write(
            `
  Blocked @${peerLogin}. They can no longer message you, fetch your key, or
  see your presence \u2014 and chat is now closed.
  Unblock anytime:  terminalhire chat ${peerLogin} --unblock

`
          );
          resolve({ entered: true, reason: "blocked" });
        }
        return;
      }
      if (trimmed.length === 0) return;
      try {
        await client.sendMessage(introId, peerLogin, trimmed);
        await doPoll();
      } catch (err) {
        if (err instanceof ChatSessionExpiredError) {
          if (!cleaned) {
            cleanup();
            output.write(`
  ${err.message}

`);
            resolve({ entered: true, reason: "session-expired" });
          }
          return;
        }
        if (err instanceof SafetyNumberChangedError) {
          banner = `\u26A0 safety number CHANGED for @${peerLogin} \u2014 message NOT sent. Verify out of band.`;
        } else {
          banner = `(send failed: ${err instanceof Error ? err.message : String(err)})`;
        }
        if (!cleaned) repaint();
      }
    }
    function onData(chunk) {
      if (cleaned) return;
      const s = chunk.toString("utf8");
      if (s === KEY_ESC) {
        finish("back");
        return;
      }
      if (s.charCodeAt(0) === 27) return;
      for (const ch of s) {
        if (ch === KEY_CTRL_C) {
          finish("sigint");
          return;
        }
        if (ch === KEY_CTRL_S) {
          void showSafetyNumber();
          continue;
        }
        if (ch === KEY_ENTER_A || ch === KEY_ENTER_B) {
          const line = inputBuffer;
          inputBuffer = "";
          repaint();
          void submitLine(line);
          continue;
        }
        if (ch === KEY_BACKSPACE_A || ch === KEY_BACKSPACE_B) {
          inputBuffer = inputBuffer.slice(0, -1);
          repaint();
          continue;
        }
        if (ch >= " ") {
          if (inputBuffer.length >= MAX_INPUT_LEN) {
            banner = `(message too long \u2014 ${MAX_INPUT_LEN}-char limit; press Enter to send or backspace)`;
            repaint();
            continue;
          }
          inputBuffer += ch;
          repaint();
        }
      }
    }
    function onSignal() {
      finish("sigint");
    }
    function onTerm() {
      finish("signal");
    }
    function onUncaught(err) {
      cleanup();
      throw err;
    }
    function onExit() {
      cleanup();
    }
    try {
      if (typeof input.setRawMode === "function") input.setRawMode(true);
      if (typeof input.resume === "function") input.resume();
      output.write(ENTER_ALT + HIDE_CURSOR);
      input.on("data", onData);
      signals.on("SIGINT", onSignal);
      signals.on("SIGTERM", onTerm);
      signals.on("SIGHUP", onTerm);
      signals.on("uncaughtException", onUncaught);
      signals.on("unhandledRejection", onUncaught);
      signals.on("exit", onExit);
      repaint();
      void doPoll();
      timer = setTimer(() => {
        void doPoll();
      }, pollIntervalMs);
    } catch (err) {
      cleanup();
      output.write(`
  Chat pane error: ${err instanceof Error ? err.message : String(err)}

`);
      resolve({ entered: true, reason: "error" });
    }
  });
}
var CHAT_BASE3, GH_SESSION_COOKIE3, HIDE_CURSOR, SHOW_CURSOR, ENTER_ALT, EXIT_ALT, CLEAR, KEY_CTRL_C, KEY_ESC, KEY_CTRL_S, KEY_ENTER_A, KEY_ENTER_B, KEY_BACKSPACE_A, KEY_BACKSPACE_B, MAX_INPUT_LEN, CHAT_DISCLOSURE, CHAT_AT_REST, CHAT_CODE_OF_CONDUCT, CHAT_MIN_AGE, DEPOSIT_CTA, ACTIVE_WINDOW_MS;
var init_jpi_chat = __esm({
  "bin/jpi-chat.js"() {
    "use strict";
    init_chat_client();
    init_config();
    init_web_session();
    init_tui_core();
    CHAT_BASE3 = process.env["TERMINALHIRE_API_URL"] || "https://terminalhire.com";
    GH_SESSION_COOKIE3 = "__jpi_gh_session";
    HIDE_CURSOR = "\x1B[?25l";
    SHOW_CURSOR = "\x1B[?25h";
    ENTER_ALT = "\x1B[?1049h";
    EXIT_ALT = "\x1B[?1049l";
    CLEAR = "\x1B[2J\x1B[H";
    KEY_CTRL_C = "";
    KEY_ESC = "\x1B";
    KEY_CTRL_S = "";
    KEY_ENTER_A = "\r";
    KEY_ENTER_B = "\n";
    KEY_BACKSPACE_A = "\x7F";
    KEY_BACKSPACE_B = "\b";
    MAX_INPUT_LEN = 2e3;
    CHAT_DISCLOSURE = "Messages are end-to-end encrypted using keys stored only on your device. Our server cannot read message content. Since we distribute your contact's public key, verify your connection by comparing Safety Numbers to rule out a server-side substitution. We store metadata: who messaged whom, when, and message count. Content is purged after 90 days.";
    CHAT_AT_REST = "Your private key is encrypted against casual access, not full machine compromise.";
    CHAT_CODE_OF_CONDUCT = "Code of conduct: keep it professional \u2014 harassment, spam, or abuse gets you blocked and removed.";
    CHAT_MIN_AGE = "You must be at least 13 years old to use connections chat.";
    DEPOSIT_CTA = "\n  Keep building together \u2014 publish your r\xE9sum\xE9 so more builders find you:\n    https://terminalhire.com/dashboard\n\n";
    ACTIVE_WINDOW_MS = 2 * 60 * 1e3;
  }
});

// src/open-url.js
var open_url_exports = {};
__export(open_url_exports, {
  openInBrowser: () => openInBrowser
});
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
var init_open_url = __esm({
  "src/open-url.js"() {
    "use strict";
  }
});

// src/intro.ts
var intro_exports = {};
__export(intro_exports, {
  getIntros: () => getIntros,
  runIntroDecision: () => runIntroDecision,
  runIntroList: () => runIntroList,
  runIntroRequest: () => runIntroRequest
});
function defaultIntroDeps() {
  return {
    readGithubLogin: async () => {
      try {
        const { readProfile: readProfile2 } = await Promise.resolve().then(() => (init_profile(), profile_exports));
        const profile = await readProfile2();
        return profile?.github?.login ?? null;
      } catch {
        return null;
      }
    },
    readProfileContact: async () => {
      try {
        const { readProfile: readProfile2 } = await Promise.resolve().then(() => (init_profile(), profile_exports));
        const profile = await readProfile2();
        return { displayName: profile?.displayName };
      } catch {
        return {};
      }
    },
    prompt: async (question) => {
      const { createInterface: createInterface2 } = await import("readline");
      const rl = createInterface2({ input: process.stdin, output: process.stdout });
      return new Promise((res) => {
        rl.question(question, (answer) => {
          rl.close();
          res(answer.trim().toLowerCase());
        });
      });
    },
    fetchImpl: (...args) => globalThis.fetch(...args),
    openBrowser: (url) => {
      void Promise.resolve().then(() => (init_open_url(), open_url_exports)).then((m) => m.openInBrowser(url)).catch(() => {
      });
    },
    // Session source priority: persisted file (`terminalhire link`) FIRST, then the
    // legacy TERMINALHIRE_WEB_SESSION env, then none.
    sessionCookie: () => readWebSessionCookie(),
    log: (msg) => console.log(msg),
    errorLog: (msg) => console.error(msg),
    exit: (code) => process.exit(code)
  };
}
function renderConsentCard(payload, deps) {
  const { log } = deps;
  log("");
  log("\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510");
  log("\u2502   terminalhire \u2014 request an intro (opt-in)                    \u2502");
  log("\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518");
  log("");
  log("  This sends the following \u2014 and ONLY the following \u2014 to terminalhire,");
  log(`  to ask @${payload.targetLogin} for an intro:`);
  log("");
  log(`    Your GitHub login   : @${payload.requesterLogin}`);
  log(`    Your display name   : ${payload.requesterDisplayName}`);
  log(`    Your contact        : ${payload.requesterContact}`);
  log(`    Note                : ${payload.note ?? "(none)"}`);
  log(`    To developer        : @${payload.targetLogin}`);
  log("");
  log("  What is NEVER sent: your fingerprint, trajectory, repos, or any other");
  log("  profile field. @" + payload.targetLogin + " sees only your public login");
  log("  until they accept \u2014 your contact is shared only on their acceptance.");
  log("");
}
async function runIntroRequest(args, overrides) {
  const deps = { ...defaultIntroDeps(), ...overrides };
  const targetLogin = args.targetLogin?.trim().replace(/^@/, "");
  if (!targetLogin) {
    deps.errorLog('\n  Usage: terminalhire intro <github-login> [--note "..."] [--contact <email>] [--name "..."]\n');
    deps.exit(1);
    return;
  }
  const requesterLogin = await deps.readGithubLogin();
  if (!requesterLogin) {
    deps.log("\n  Not signed in. Run `terminalhire login` first, then re-run this command.\n");
    deps.exit(1);
    return;
  }
  if (targetLogin.toLowerCase() === requesterLogin.toLowerCase()) {
    deps.errorLog("\n  You cannot request an intro to yourself.\n");
    deps.exit(1);
    return;
  }
  const profile = await deps.readProfileContact();
  const displayName = (args.name ?? profile.displayName ?? requesterLogin).trim();
  const explicitContact = (args.contact ?? "").trim();
  const contact = explicitContact || `@${requesterLogin}`;
  const payload = buildIntroPayload({
    requesterLogin,
    requesterDisplayName: displayName,
    requesterContact: contact,
    targetLogin,
    note: args.note
  });
  renderConsentCard(payload, deps);
  const answer = await deps.prompt('  Type "yes" to send this intro request (anything else cancels): ');
  if (answer !== "yes") {
    deps.log("\n  Cancelled \u2014 nothing was sent.\n");
    deps.exit(0);
    return;
  }
  const cookie = deps.sessionCookie();
  if (!cookie) {
    deps.log("\n  No linked web session found on this machine.");
    deps.log("  Run `terminalhire link` to connect this terminal to your account, then re-run.\n");
    deps.exit(0);
    return;
  }
  let res;
  try {
    res = await deps.fetchImpl(`${LINK_BASE}/api/intro/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: `${GH_SESSION_COOKIE4}=${cookie}` },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(1e4)
    });
  } catch (err) {
    deps.errorLog(`
  Request failed: ${err instanceof Error ? err.message : String(err)}
`);
    deps.exit(1);
    return;
  }
  if (res.status === 401) {
    deps.log("\n  Your linked web session expired.");
    deps.log("  Run `terminalhire link` to reconnect this terminal, then re-run.\n");
    deps.exit(1);
    return;
  }
  if (res.status === 429) {
    deps.errorLog("\n  Too many intro requests right now \u2014 please try again later.\n");
    deps.exit(1);
    return;
  }
  if (res.status === 409) {
    let reason = "an intro between you two already exists \u2014 check `terminalhire intro --list`.";
    try {
      const data = await res.json();
      if (typeof data.error === "string" && data.error) reason = data.error;
    } catch {
    }
    deps.log(`
  ${reason}
`);
    deps.exit(1);
    return;
  }
  if (!res.ok) {
    deps.errorLog(`
  Request failed: /api/intro/request returned ${res.status}.
`);
    deps.exit(1);
    return;
  }
  let notified = false;
  let deduped = false;
  try {
    const data = await res.json();
    notified = data.notified === true;
    deduped = data.deduped === true;
  } catch {
  }
  if (deduped) {
    deps.log(`
  You already have a pending intro request to @${targetLogin} \u2014 nothing new was sent.`);
    deps.log("  They can accept it any time from `terminalhire intro --list` or their dashboard.\n");
  } else if (notified) {
    deps.log(`
  Intro request sent to @${targetLogin}. They will see only your public login`);
    deps.log("  until they accept; your contact is shared only if they do.\n");
  } else {
    deps.log(`
  Intro request recorded for @${targetLogin} \u2014 but we couldn't email them`);
    deps.log("  automatically (no public email on file). Send it to them yourself: they can run");
    deps.log("  `terminalhire intro --list` (or open their dashboard) to see and accept it.");
    deps.log("  They will see only your public login until they accept; your contact is");
    deps.log("  shared only if they do.\n");
  }
}
async function fetchIntros(deps, cookie) {
  const res = await deps.fetchImpl(`${LINK_BASE}/api/intro/list`, {
    method: "GET",
    headers: { Cookie: `${GH_SESSION_COOKIE4}=${cookie}` },
    signal: AbortSignal.timeout(1e4)
  });
  if (!res.ok) throw new Error(`/api/intro/list returned ${res.status}`);
  const data = await res.json().catch(() => ({}));
  return data.intros ?? [];
}
async function runIntroDecision(args, overrides) {
  const deps = { ...defaultIntroDeps(), ...overrides };
  let id = args.id?.trim() ?? "";
  if (!id) {
    deps.errorLog("\n  Usage: terminalhire intro --accept <@handle|id> | --decline <@handle|id>\n");
    deps.exit(1);
    return;
  }
  const cookie = deps.sessionCookie();
  if (!cookie) {
    deps.log("\n  No linked web session found on this machine.");
    deps.log("  Run `terminalhire link` to connect this terminal to your account, then re-run.\n");
    deps.exit(0);
    return;
  }
  if (!UUID_RE.test(id)) {
    const handle = id.replace(/^@/, "").toLowerCase();
    let intros;
    try {
      intros = await fetchIntros(deps, cookie);
    } catch (err) {
      deps.errorLog(`
  Could not look up the request: ${err instanceof Error ? err.message : String(err)}
`);
      deps.exit(1);
      return;
    }
    const matches = intros.filter(
      (it) => it.role === "incoming" && it.status === "pending" && it.counterpartyLogin.toLowerCase() === handle
    );
    if (matches.length === 0) {
      deps.errorLog(`
  No pending connection request from @${handle}.`);
      deps.errorLog("  See your requests with `terminalhire intro --list`.\n");
      deps.exit(1);
      return;
    }
    if (matches.length > 1) {
      deps.errorLog(`
  ${matches.length} pending requests from @${handle} \u2014 ${args.action === "accept" ? "accepting" : "declining"} one (the rest are redundant duplicates).`);
    }
    id = matches[0].id;
  }
  let contact = "";
  let shareHandle = false;
  if (args.action === "accept") {
    contact = (args.contact ?? "").trim();
    shareHandle = contact.length === 0;
    let shareLabel = contact;
    if (shareHandle) {
      const login = await deps.readGithubLogin().catch(() => null);
      shareLabel = login ? `your GitHub handle (@${login})` : "your GitHub handle";
    }
    deps.log("");
    deps.log("  Accepting shares a contact with the requester so they can reach you:");
    deps.log(`    Your contact : ${shareLabel}`);
    if (shareHandle) {
      deps.log("    (share an email/handle instead with `--contact <email-or-handle>`)");
    }
    deps.log("  Nothing else is shared. Declining shares nothing.");
    deps.log("");
    const answer = await deps.prompt('  Type "yes" to accept and share your contact (anything else cancels): ');
    if (answer !== "yes") {
      deps.log("\n  Cancelled \u2014 nothing was sent.\n");
      deps.exit(0);
      return;
    }
  }
  const body = args.action === "accept" ? shareHandle ? { introId: id, action: "accept" } : { introId: id, action: "accept", targetContact: contact } : { introId: id, action: "decline" };
  let res;
  try {
    res = await deps.fetchImpl(`${LINK_BASE}/api/intro/accept`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: `${GH_SESSION_COOKIE4}=${cookie}` },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(1e4)
    });
  } catch (err) {
    deps.errorLog(`
  Request failed: ${err instanceof Error ? err.message : String(err)}
`);
    deps.exit(1);
    return;
  }
  if (res.status === 401) {
    deps.log("\n  Your linked web session expired.");
    deps.log("  Run `terminalhire link` to reconnect this terminal, then re-run.\n");
    deps.exit(1);
    return;
  }
  if (res.status === 403) {
    deps.errorLog("\n  You are not the developer this intro was sent to.\n");
    deps.exit(1);
    return;
  }
  if (res.status === 404) {
    deps.errorLog("\n  Intro not found.\n");
    deps.exit(1);
    return;
  }
  if (!res.ok) {
    deps.errorLog(`
  Request failed: /api/intro/accept returned ${res.status}.
`);
    deps.exit(1);
    return;
  }
  let data = {};
  try {
    data = await res.json();
  } catch {
  }
  if (args.action === "decline") {
    deps.log("\n  Declined \u2014 no contact was shared.\n");
    return;
  }
  const peer = data.counterpartyLogin;
  deps.log(`
  \u2713 Connected${peer ? ` with @${peer}` : ""}.`);
  if (peer) deps.log(`  Message them any time:  terminalhire chat @${peer}`);
  if (data.contact) deps.log(`  They also shared: ${data.contact}`);
  deps.log("");
}
async function getIntros(overrides) {
  const deps = { ...defaultIntroDeps(), ...overrides };
  const cookie = deps.sessionCookie();
  if (!cookie) {
    return { status: "no-session" };
  }
  let res;
  try {
    res = await deps.fetchImpl(`${LINK_BASE}/api/intro/list`, {
      method: "GET",
      headers: { Cookie: `${GH_SESSION_COOKIE4}=${cookie}` },
      signal: AbortSignal.timeout(1e4)
    });
  } catch (err) {
    return { status: "request-failed", message: err instanceof Error ? err.message : String(err) };
  }
  if (res.status === 401) {
    return { status: "expired" };
  }
  if (!res.ok) {
    return { status: "error", httpStatus: res.status };
  }
  let data = {};
  try {
    data = await res.json();
  } catch {
  }
  return { status: "ok", intros: data.intros ?? [] };
}
async function runIntroList(overrides) {
  const deps = { ...defaultIntroDeps(), ...overrides };
  const result = await getIntros(deps);
  switch (result.status) {
    case "no-session":
      deps.log("\n  No linked web session found on this machine.");
      deps.log("  Run `terminalhire link` to connect this terminal to your account, then re-run.\n");
      deps.exit(0);
      return;
    case "expired":
      deps.log("\n  Your linked web session expired.");
      deps.log("  Run `terminalhire link` to reconnect this terminal, then re-run.\n");
      deps.exit(1);
      return;
    case "request-failed":
      deps.errorLog(`
  Request failed: ${result.message}
`);
      deps.exit(1);
      return;
    case "error":
      deps.errorLog(`
  Request failed: /api/intro/list returned ${result.httpStatus}.
`);
      deps.exit(1);
      return;
    case "ok": {
      const intros = result.intros;
      if (intros.length === 0) {
        deps.log("\n  No intros yet.\n");
        return;
      }
      deps.log("");
      for (const it of intros) {
        const dir = it.role === "incoming" ? "from" : "to";
        deps.log(`  [${it.status}] ${dir} @${it.counterpartyLogin}`);
        if (it.note) deps.log(`      note: ${it.note}`);
        if (it.contact) deps.log(`      contact: ${it.contact}`);
        else if (it.role === "incoming" && it.status === "pending") {
          deps.log(`      \u2192 accept: terminalhire intro --accept @${it.counterpartyLogin}`);
        }
      }
      deps.log("");
      return;
    }
  }
}
var LINK_BASE, GH_SESSION_COOKIE4, UUID_RE;
var init_intro2 = __esm({
  "src/intro.ts"() {
    "use strict";
    init_src();
    init_web_session();
    LINK_BASE = process.env["TERMINALHIRE_API_URL"] || "https://terminalhire.com";
    GH_SESSION_COOKIE4 = "__jpi_gh_session";
    UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  }
});

// bin/jpi-inbox.js
async function defaultDecideIntro(req, overrides = {}) {
  const { runIntroDecision: runIntroDecision2 } = await Promise.resolve().then(() => (init_intro2(), intro_exports));
  let exited = false;
  let errReason = "";
  const logLines = [];
  const args = { id: `@${req.login}`, action: req.action };
  if (req.action === "accept" && req.contact) args.contact = req.contact;
  await runIntroDecision2(args, {
    prompt: async () => "yes",
    exit: () => {
      exited = true;
    },
    log: (msg) => {
      const t = typeof msg === "string" ? msg.trim() : "";
      if (t) logLines.push(t);
    },
    errorLog: (msg) => {
      const t = typeof msg === "string" ? msg.trim() : "";
      if (t && !errReason) errReason = t;
    },
    // Overrides last so tests can stub the engine's own IO (fetchImpl,
    // sessionCookie, readGithubLogin) — but never the capture handlers above…
    ...(() => {
      const { prompt, exit, log, errorLog, ...safe } = overrides;
      return safe;
    })()
  });
  const reason = exited ? errReason || logLines.slice(-2).join(" ") : "";
  return { ok: !exited, reason };
}
function sortConversations(items) {
  return items.slice().sort((a, b) => {
    if (b.unread !== a.unread) return b.unread - a.unread;
    const at = a.lastStampIso || "";
    const bt = b.lastStampIso || "";
    if (at === bt) return 0;
    return at > bt ? -1 : 1;
  });
}
function formatInbox(state) {
  const { rows, selected, mode, inputBuffer, activeLogin, banner, inviteCount, loading } = state;
  const lines = [];
  lines.push("  inbox \xB7 terminalhire chat");
  lines.push("  " + "\u2500".repeat(64));
  if (!rows || rows.length === 0) {
    lines.push(
      loading ? "  \u2726 loading your conversations\u2026" : "  (no connections yet \u2014 request one: terminalhire intro <login>)"
    );
  } else {
    let printedInviteHeader = false;
    let printedConvSep = false;
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const sel = i === selected;
      if (row.type === "invite") {
        if (!printedInviteHeader) {
          lines.push(`  PENDING INVITATIONS (${inviteCount})`);
          printedInviteHeader = true;
        }
        const handle = `@${sanitizeLine(row.login)}`;
        const text = `  \u2198 ${handle.padEnd(18)} wants to connect`;
        lines.push(sel ? INVERSE + text + RESET : text);
      } else {
        if (inviteCount > 0 && !printedConvSep) {
          lines.push("  " + "\u2500".repeat(64));
          printedConvSep = true;
        }
        const dot = formatPresence(row.presence).charAt(0);
        const login = `@${sanitizeLine(row.login)}`;
        const badgeVisible = row.unread > 0 ? `\u2709 ${row.unread}` : "\u2014";
        const badgeCell = badgeVisible.padEnd(5);
        const badge = row.unread > 0 ? BOLD + badgeCell + BOLD_OFF : badgeCell;
        const stamp = sanitizeLine(row.lastStamp || "").padStart(6);
        const preview = row.preview ? truncate(sanitizeLine(row.preview), 34) : "";
        const text = `  ${dot} ${login.padEnd(18)} ${badge} ${stamp}  ${preview}`;
        lines.push(sel ? INVERSE + text + RESET : text);
      }
    }
  }
  lines.push("  " + "\u2500".repeat(64));
  if (mode === "input") {
    lines.push(
      `  contact to share with @${sanitizeLine(activeLogin)} (blank = share your @handle): ${inputBuffer}\u258A`
    );
    lines.push("  Enter accept \xB7 Esc cancel");
  } else if (mode === "confirm") {
    lines.push(`  Decline @${sanitizeLine(activeLogin)}? Declining is permanent.`);
    lines.push("  y decline \xB7 n cancel");
  } else {
    const cur = rows && rows.length > 0 ? rows[selected] : null;
    if (cur && cur.type === "invite") {
      lines.push("  \u2191/\u2193 move \xB7 Enter/a accept \xB7 d decline \xB7 R refresh \xB7 q quit");
    } else {
      lines.push("  \u2191/\u2193 move \xB7 Enter open \xB7 r read \xB7 R refresh \xB7 q quit");
    }
  }
  if (banner) {
    lines.push("  " + "\u2500".repeat(64));
    lines.push(`  ${banner}`);
  }
  return CLEAR2 + lines.join("\n") + "\n";
}
async function runInboxPane(opts = {}) {
  const {
    input = process.stdin,
    output = process.stdout,
    signals = process,
    client = createChatClient(),
    listConnections = defaultListConnections,
    readCursors = readReadCursors,
    buildItems = () => buildInboxItems({ client, listConnections, readCursors }),
    listInvites = defaultListPendingInvites,
    decideIntro = defaultDecideIntro,
    writeCursor = writeReadCursor,
    postReadCursor: postCursor = postReadCursor,
    syncUnreadBadge: syncBadge = syncUnreadBadge,
    setTimer = (fn, ms) => setInterval(fn, ms),
    clearTimer = (t) => clearInterval(t),
    refreshMs = DEFAULT_REFRESH_MS
  } = opts;
  return await new Promise((resolve) => {
    let rows = [];
    let inviteCount = 0;
    let selected = 0;
    let mode = "list";
    let inputBuffer = "";
    let activeLogin = "";
    let banner = "";
    let selectedLogin = "";
    let busy = false;
    let fetching = false;
    let marking = false;
    let loading = true;
    let timer = null;
    let cleaned = false;
    function repaint() {
      if (cleaned) return;
      output.write(
        formatInbox({ rows, selected, mode, inputBuffer, activeLogin, banner, inviteCount, loading })
      );
    }
    function setRows(items, invites) {
      const inviteRows = (invites || []).map((iv) => ({ type: "invite", login: iv.login }));
      const convRows = sortConversations(items || []).map((it) => ({ type: "conv", ...it }));
      rows = [...inviteRows, ...convRows];
      inviteCount = inviteRows.length;
      if (rows.length === 0) {
        selected = 0;
        return;
      }
      const idx = selectedLogin ? rows.findIndex((r) => r.login === selectedLogin) : -1;
      selected = idx >= 0 ? idx : Math.min(selected, rows.length - 1);
      selectedLogin = rows[selected].login;
    }
    async function refetch() {
      if (fetching) return;
      fetching = true;
      try {
        const built = await buildItems();
        const items = built && built.status === "ok" ? built.items : [];
        let invites = [];
        try {
          const inv = await listInvites();
          if (inv && inv.status === "ok") invites = inv.invites;
        } catch {
        }
        setRows(items, invites);
        loading = false;
      } catch {
      } finally {
        fetching = false;
      }
      if (!cleaned) repaint();
    }
    function moveSelection(delta) {
      if (rows.length === 0) return;
      selected = Math.max(0, Math.min(rows.length - 1, selected + delta));
      selectedLogin = rows[selected].login;
      repaint();
    }
    function beginAccept(row) {
      mode = "input";
      inputBuffer = "";
      activeLogin = row.login;
      banner = "";
      repaint();
    }
    function beginDecline(row) {
      mode = "confirm";
      activeLogin = row.login;
      banner = "";
      repaint();
    }
    function cancelMode() {
      mode = "list";
      inputBuffer = "";
      banner = "";
      repaint();
    }
    async function submitDecision(action, contact) {
      if (busy) return;
      busy = true;
      const login = activeLogin;
      mode = "list";
      inputBuffer = "";
      banner = action === "accept" ? `accepting @${login}\u2026` : `declining @${login}\u2026`;
      repaint();
      let ok = false;
      let reason = "";
      try {
        const req = action === "accept" && contact ? { login, action, contact } : { login, action };
        const res = await decideIntro(req);
        ok = !!(res && res.ok);
        if (!ok && res && typeof res.reason === "string") reason = res.reason;
      } catch {
        ok = false;
      }
      const why = sanitizeLine(reason).slice(0, 64);
      banner = ok ? action === "accept" ? `\u2713 connected with @${login}` : `\u2713 declined @${login}` : `\u26A0 could not ${action} @${login} \u2014 ${why || "try again"}`;
      if (ok) {
        try {
          await refetch();
        } catch {
        }
      }
      busy = false;
      repaint();
    }
    async function markRowRead(row) {
      if (busy || marking || !row || row.type !== "conv" || !row.lastStampIso) return;
      marking = true;
      row.unread = 0;
      repaint();
      try {
        writeCursor(row.login, row.lastStampIso);
      } catch {
      }
      try {
        await postCursor(row.login, row.lastStampIso);
      } catch {
      }
      try {
        await syncBadge();
      } catch {
      }
      marking = false;
    }
    function activateRow() {
      const row = rows[selected];
      if (!row) return;
      if (row.type === "invite") {
        beginAccept(row);
        return;
      }
      finish({ action: "open", login: row.login });
    }
    function handleListChar(ch) {
      if (busy) return;
      const row = rows[selected];
      switch (ch) {
        case "j":
          moveSelection(1);
          break;
        case "k":
          moveSelection(-1);
          break;
        case "q":
          finish({ action: "quit" });
          break;
        case KEY_ENTER_A2:
        case KEY_ENTER_B2:
          activateRow();
          break;
        case "a":
          if (row && row.type === "invite") beginAccept(row);
          break;
        case "d":
          if (row && row.type === "invite") beginDecline(row);
          break;
        case "r":
          if (row && row.type === "conv") void markRowRead(row);
          break;
        case "R":
          if (!busy) void refetch();
          break;
        default:
          break;
      }
    }
    function handleInputChunk(s) {
      if (s === KEY_ENTER_A2 || s === KEY_ENTER_B2 || s === "\r\n") {
        void submitDecision("accept", inputBuffer.trim());
        return;
      }
      if (s === KEY_BACKSPACE_A2 || s === KEY_BACKSPACE_B2) {
        inputBuffer = inputBuffer.slice(0, -1);
        repaint();
        return;
      }
      for (const ch of s) {
        if (ch === KEY_BACKSPACE_A2 || ch === KEY_BACKSPACE_B2) {
          inputBuffer = inputBuffer.slice(0, -1);
        } else if (ch >= " " && inputBuffer.length < MAX_CONTACT_LEN) {
          inputBuffer += ch;
        }
      }
      repaint();
    }
    function handleConfirmChar(ch) {
      if (ch === "y" || ch === "Y") {
        void submitDecision("decline");
        return;
      }
      if (ch === "n" || ch === "N") {
        cancelMode();
      }
    }
    function onData(chunk) {
      if (cleaned) return;
      const s = chunk.toString("utf8");
      if (s === KEY_CTRL_C2) {
        finish({ action: "quit" });
        return;
      }
      if (s === KEY_ESC2) {
        if (mode === "input" || mode === "confirm") cancelMode();
        else finish({ action: "quit" });
        return;
      }
      if (s.charCodeAt(0) === 27) {
        if (mode === "list" && !busy) {
          if (s === KEY_UP) moveSelection(-1);
          else if (s === KEY_DOWN) moveSelection(1);
        }
        return;
      }
      if (mode === "input") {
        handleInputChunk(s);
        return;
      }
      for (const ch of s) {
        if (mode === "confirm") handleConfirmChar(ch);
        else handleListChar(ch);
      }
    }
    function onResize() {
      if (!cleaned) repaint();
    }
    function cleanup() {
      if (cleaned) return;
      cleaned = true;
      if (timer) {
        try {
          clearTimer(timer);
        } catch {
        }
        timer = null;
      }
      try {
        if (typeof input.setRawMode === "function") input.setRawMode(false);
      } catch {
      }
      try {
        input.removeListener("data", onData);
      } catch {
      }
      try {
        if (typeof input.pause === "function") input.pause();
      } catch {
      }
      try {
        if (typeof output.removeListener === "function") output.removeListener("resize", onResize);
      } catch {
      }
      try {
        signals.removeListener("SIGINT", onSignal);
        signals.removeListener("SIGTERM", onTerm);
        signals.removeListener("SIGHUP", onTerm);
        signals.removeListener("uncaughtException", onUncaught);
        signals.removeListener("unhandledRejection", onUncaught);
        signals.removeListener("exit", onExit);
      } catch {
      }
      output.write(SHOW_CURSOR2 + EXIT_ALT2);
    }
    function finish(result) {
      if (cleaned) return;
      cleanup();
      resolve(result);
    }
    function onSignal() {
      finish({ action: "quit" });
    }
    function onTerm() {
      finish({ action: "quit" });
    }
    function onUncaught(err) {
      cleanup();
      throw err;
    }
    function onExit() {
      cleanup();
    }
    try {
      if (typeof input.setRawMode === "function") input.setRawMode(true);
      if (typeof input.resume === "function") input.resume();
      output.write(ENTER_ALT2 + HIDE_CURSOR2);
      input.on("data", onData);
      if (typeof output.on === "function") output.on("resize", onResize);
      signals.on("SIGINT", onSignal);
      signals.on("SIGTERM", onTerm);
      signals.on("SIGHUP", onTerm);
      signals.on("uncaughtException", onUncaught);
      signals.on("unhandledRejection", onUncaught);
      signals.on("exit", onExit);
      repaint();
      void refetch();
      timer = setTimer(() => {
        if (mode === "list" && !busy) void refetch();
      }, refreshMs);
    } catch (err) {
      cleanup();
      output.write(`
  Inbox error: ${err instanceof Error ? err.message : String(err)}

`);
      resolve({ action: "quit" });
    }
  });
}
async function runInboxTui(deps = {}) {
  const {
    input = process.stdin,
    output = process.stdout,
    ensureDisclosure = ensureChatDisclosure,
    openChatPane = runChatPane,
    ...paneDeps
  } = deps;
  const ack = await ensureDisclosure({ input, output });
  if (!ack.acknowledged) {
    output.write(
      "\n  Chat needs you to acknowledge the privacy notice above first. Re-run when ready.\n\n"
    );
    return { ok: false, reason: "not-acknowledged" };
  }
  for (; ; ) {
    const sel = await runInboxPane({ input, output, ...paneDeps });
    if (!sel || sel.action === "quit") break;
    if (sel.action === "open" && sel.login) {
      await openChatPane({ login: sel.login, input, output, backHint: "inbox" });
    }
  }
  return { ok: true };
}
async function run(opts = {}) {
  const {
    isTTY = process.stdout.isTTY,
    input = process.stdin,
    output = process.stdout,
    runTui = runInboxTui,
    runStatic = null
  } = opts;
  if (isTTY) {
    await runTui({ input, output });
  } else if (runStatic) {
    await runStatic({});
  } else {
    const mod2 = await Promise.resolve().then(() => (init_jpi_chat_read(), jpi_chat_read_exports));
    await mod2.runInbox({});
  }
}
var HIDE_CURSOR2, SHOW_CURSOR2, ENTER_ALT2, EXIT_ALT2, CLEAR2, INVERSE, RESET, BOLD, BOLD_OFF, KEY_CTRL_C2, KEY_ESC2, KEY_UP, KEY_DOWN, KEY_ENTER_A2, KEY_ENTER_B2, KEY_BACKSPACE_A2, KEY_BACKSPACE_B2, MAX_CONTACT_LEN, DEFAULT_REFRESH_MS;
var init_jpi_inbox = __esm({
  "bin/jpi-inbox.js"() {
    init_chat_client();
    init_jpi_chat();
    init_jpi_chat_read();
    init_tui_core();
    HIDE_CURSOR2 = "\x1B[?25l";
    SHOW_CURSOR2 = "\x1B[?25h";
    ENTER_ALT2 = "\x1B[?1049h";
    EXIT_ALT2 = "\x1B[?1049l";
    CLEAR2 = "\x1B[2J\x1B[H";
    INVERSE = "\x1B[7m";
    RESET = "\x1B[0m";
    BOLD = "\x1B[1m";
    BOLD_OFF = "\x1B[22m";
    KEY_CTRL_C2 = "";
    KEY_ESC2 = "\x1B";
    KEY_UP = "\x1B[A";
    KEY_DOWN = "\x1B[B";
    KEY_ENTER_A2 = "\r";
    KEY_ENTER_B2 = "\n";
    KEY_BACKSPACE_A2 = "\x7F";
    KEY_BACKSPACE_B2 = "\b";
    MAX_CONTACT_LEN = 200;
    DEFAULT_REFRESH_MS = 4e3;
  }
});
init_jpi_inbox();
export {
  defaultDecideIntro,
  formatInbox,
  run,
  runInboxPane,
  runInboxTui,
  sortConversations
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
