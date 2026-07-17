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
var FARM_REPO_DENYLIST = [
  "SecureBananaLabs/bug-bounty",
  // Meta-farm: a bounty PLATFORM whose own issues are an assignment-gated
  // contributor queue ("please assign me, my chief") — an unsolicited PR won't
  // merge, so it's not a real claimable bounty. Not structurally derivable from
  // any fetched field, so it's a manual entry (also dropped from the allowlist).
  "boundlessfi/boundless"
];
var CURATION_EXCLUDED_REPOS = [
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
var EXCLUDED_LC = new Set(
  [...FARM_REPO_DENYLIST, ...CURATION_EXCLUDED_REPOS].map((r) => r.toLowerCase())
);
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

// ../../packages/core/src/feeds/contribution-classify.ts
var CONTENT_NOUN_STRONG = String.raw`proverbs?|words?|phrases?|sayings?|translations?|entry|entries|definitions?|terms?|idioms?|synonyms?|antonyms?|acronyms?|abbreviations?|nazonazo`;
var CONTENT_NOUN_BROAD = String.raw`trivia\s+questions?|grammar\s+points?|brain\s?teasers?|trivia|facts?|quotes?|quotations?|quiz(?:zes)?|riddles?|puzzles?|flash\s?cards?|vocab(?:ulary)?|lessons?|kanji`;
var FARM_SEED_NOUN = String.raw`trivia\s+questions?|grammar\s+points?|brain\s?teasers?|proverbs?|sayings?|idioms?|quotes?|quotations?|riddles?|nazonazo`;
var CONTENT_ADD_RE = new RegExp(
  String.raw`\badd(?:ing|s)?\s+(?:\w+\s+){0,4}?(?:${CONTENT_NOUN_STRONG})\b`,
  "i"
);
var NUMBERED_SEED_RE = new RegExp(
  String.raw`\badd(?:ing|s)?\s+(?:\w+\s+){0,4}?(?:${CONTENT_NOUN_STRONG}|${CONTENT_NOUN_BROAD})\s*#?\s*(?!(?:19|20)\d{2}(?!\d))\d{1,5}\s*$`,
  "i"
);
var FARM_SEED_RE = new RegExp(
  String.raw`\badd(?:ing|s)?\s+(?:\w+\s+){0,4}?(?:${FARM_SEED_NOUN})\s*#?\s*(?!(?:19|20)\d{2}(?!\d))\d{1,5}\s*$`,
  "i"
);

// ../../packages/core/src/credential/rigor.ts
var RIGOR = {
  /** `authorAssociation` values that count as a maintainer review. */
  MAINTAINER_ASSOCIATIONS: ["OWNER", "MEMBER", "COLLABORATOR"]
};
var MAINTAINER_SET = new Set(
  RIGOR.MAINTAINER_ASSOCIATIONS.map((a) => a.toUpperCase())
);

// ../../packages/core/src/gh-governor.ts
var DEFAULT_REQ_GAP_MS = 75;
var SECONDARY_BACKOFF_CAP_S = 30;
var DEFAULT_BUILD_BUDGET_MS = 9e4;
var MIN_BUILD_BUDGET_MS = 1e4;
var MAX_BUILD_BUDGET_MS = 9e4;
var PROBE_TIMEOUT_MS = 3e3;
var realSleep = (ms) => new Promise((r) => setTimeout(r, ms));
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
async function ghFetchRaw(path, token, signal) {
  return fetch(`https://api.github.com${path}`, { headers: ghHeaders(token), signal });
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
var RESUME_DECAY_HALF_LIFE_MS = 30 * 24 * 60 * 60 * 1e3;
function parseGitHubRef(url) {
  const m = String(url ?? "").match(/github\.com\/([^/]+)\/([^/]+)\/(issues|pull)\/(\d+)/);
  if (!m) return null;
  return { owner: m[1], repo: m[2], number: parseInt(m[4], 10), kind: m[3] === "pull" ? "pull" : "issue" };
}
var GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";
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
function makeScoringGovernor(governor) {
  return governor ?? makeGitHubGovernor(
    ((url, init) => fetch(url, init)),
    makeDefaultGovernorConfig({ paceEnabled: false })
  );
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
  if (!gov.tripped() && !gov.budgetExhausted()) {
    try {
      const reviews = await ghFetch(
        `/repos/${owner}/${repo}/pulls/${number}/reviews?per_page=100`,
        token,
        sig
      );
      reviewerAssociations = reviews.map((r) => r.author_association);
    } catch {
      reviewerAssociations = void 0;
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
    repoPrivate: !!repoMeta?.private,
    additions: pr.additions ?? null,
    deletions: pr.deletions ?? null,
    changedFiles: pr.changed_files ?? null,
    repoForks: repoMeta?.forks_count ?? null,
    reviewerAssociations,
    fetchedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
}
var LIFECYCLE_BOT_LOGINS = /* @__PURE__ */ new Set([
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

// ../../packages/core/src/winnability.ts
var WINNABILITY_NORM = {
  /** ~500 new stars in a build interval is treated as "maxed" momentum. */
  starVelocity: 500,
  /** ~10 HN mentions is treated as "maxed" social. */
  socialMentions: 10,
  /** log(stars) ceiling — ~100k-star repos saturate the absolute-traction floor. */
  starsLog: Math.log(1e5)
};

// ../../packages/core/src/feeds/projectCuration.ts
var CURATION_WEIGHTS = {
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
var CURATION_NORM = {
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
var BIGCO_SLUGS_BY_SOURCE = {
  greenhouse: new Set(GREENHOUSE_SLUGS_BY_TIER.bigco.map((s) => s.toLowerCase())),
  ashby: new Set(ASHBY_SLUGS_BY_TIER.bigco.map((s) => s.toLowerCase())),
  lever: new Set(LEVER_SLUGS_BY_TIER.bigco.map((s) => s.toLowerCase()))
};

// ../../packages/core/src/feeds/contributions.ts
var CONTRIB_LABEL_QUERIES = [
  'label:"good first issue" type:issue state:open',
  'label:"good-first-issue" type:issue state:open',
  'label:"help wanted" type:issue state:open',
  'label:"help-wanted" type:issue state:open',
  'label:"up-for-grabs" type:issue state:open'
];
var CONTRIB_LANGUAGE_QUERIES = [
  ...["rust", "go", "python", "c++", "ruby"].map(
    (lang) => `label:"help wanted" language:${lang} type:issue state:open`
  ),
  ...["rust", "go"].map(
    (lang) => `label:"good first issue" language:${lang} type:issue state:open`
  )
];
var CONTRIB_SEARCH_QUERIES = [...CONTRIB_LABEL_QUERIES, ...CONTRIB_LANGUAGE_QUERIES];

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

// src/reputation/fetch.ts
async function gatherAudit(prUrl, token) {
  const signal = AbortSignal.timeout(2e4);
  const governor = makeScoringGovernor();
  const [lifecycle, facts] = await Promise.all([
    fetchPRLifecycle(prUrl, token, signal, governor),
    fetchPRScoringFacts(prUrl, token, signal, governor)
  ]);
  return { lifecycle, facts };
}
export {
  gatherAudit
};
