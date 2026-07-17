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

// src/repo-experience.ts
import { join as join4 } from "path";
import { homedir as homedir3 } from "os";

// src/crypto-store.ts
import {
  createCipheriv,
  createDecipheriv,
  randomBytes
} from "crypto";
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  renameSync,
  rmSync
} from "fs";
import { join, dirname, basename } from "path";
import { homedir } from "os";
import { createRequire } from "module";
var TERMINALHIRE_DIR = join(homedir(), ".terminalhire");
var KEY_FILE = join(TERMINALHIRE_DIR, "key");
var KEYTAR_SERVICE = "terminalhire";
var KEYTAR_ACCOUNT = "profile-key";
var ALGO = "aes-256-gcm";
var KEY_BYTES = 32;
var IV_BYTES = 12;
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
var forceKeytarUnavailableForTests = false;
function skipKeychain() {
  return process.env.TERMINALHIRE_NO_KEYCHAIN !== void 0 || process.env.CI !== void 0 || process.env.VITEST !== void 0 || process.env.NODE_ENV === "test";
}
async function tryLoadFromKeytar(policy) {
  if (forceKeytarUnavailableForTests || skipKeychain()) return null;
  try {
    const kt = policy === "keychain-required" ? createRequire(import.meta.url)("keytar") : await Promise.resolve().then(() => __toESM(require_keytar2(), 1));
    const stored = await kt.getPassword(KEYTAR_SERVICE, KEYTAR_ACCOUNT);
    if (stored) {
      return Buffer.from(stored, "hex");
    }
    const key = randomBytes(KEY_BYTES);
    await kt.setPassword(KEYTAR_SERVICE, KEYTAR_ACCOUNT, key.toString("hex"));
    return key;
  } catch {
    return null;
  }
}
function loadOrCreateFileKey() {
  mkdirSync(TERMINALHIRE_DIR, { recursive: true, mode: 448 });
  if (existsSync(KEY_FILE)) {
    return Buffer.from(readFileSync(KEY_FILE, "utf8").trim(), "hex");
  }
  const key = randomBytes(KEY_BYTES);
  writeFileSync(KEY_FILE, key.toString("hex"), { mode: 384, encoding: "utf8" });
  return key;
}
function warnStderr(message) {
  process.stderr.write(`${message}
`);
}
function atomicWriteFileSync(filePath, content) {
  const dir = dirname(filePath);
  mkdirSync(dir, { recursive: true, mode: 448 });
  const tmp = join(dir, `.${basename(filePath)}.tmp-${process.pid}-${randomBytes(6).toString("hex")}`);
  writeFileSync(tmp, content, { encoding: "utf8", mode: 384 });
  renameSync(tmp, filePath);
}
var dependentStoreFiles = /* @__PURE__ */ new Set();
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
    if (!existsSync(filePath)) return opts.blank();
    try {
      const raw = readFileSync(filePath, "utf8");
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

// src/profile.ts
import { join as join3 } from "path";
import { homedir as homedir2 } from "os";

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

// ../../packages/core/src/github.ts
var RESUME_DECAY_HALF_LIFE_MS = 30 * 24 * 60 * 60 * 1e3;

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
import { readFileSync as readFileSync2 } from "fs";
import { join as join2 } from "path";
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
import { hkdfSync, createHash, randomBytes as randomBytes2 } from "crypto";
var KDF_INFO = Buffer.from("terminalhire-chat-v1");

// ../../packages/core/src/short-token.ts
import { createHash as createHash2 } from "crypto";

// src/profile.ts
var TERMINALHIRE_DIR2 = join3(homedir2(), ".terminalhire");
var PROFILE_FILE = join3(TERMINALHIRE_DIR2, "profile.enc");
function blankProfile() {
  return {
    version: 3,
    skillTags: [],
    tagWeights: {},
    hasEmployerSessions: false,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
}
var profileStore = createEncryptedStore(PROFILE_FILE, {
  blank: blankProfile,
  keyPolicy: "keytar-first-file-fallback"
});
function recencyDecay(lastSeen, halfLifeDays = 30, now = Date.now()) {
  const ageMs = now - new Date(lastSeen).getTime();
  const halfLifeMs = halfLifeDays * 24 * 60 * 60 * 1e3;
  return Math.pow(0.5, ageMs / halfLifeMs);
}

// src/repo-experience.ts
var TERMINALHIRE_DIR3 = process.env.TERMINALHIRE_DIR || join4(homedir3(), ".terminalhire");
var REPO_EXPERIENCE_FILE = join4(TERMINALHIRE_DIR3, "repo-experience.enc");
var MAX_REPOS = 100;
var MAX_CULTURE_SAMPLES = 12;
var MAX_NOTES = 10;
var MAX_BACKFILL = 50;
function blankFile() {
  return { version: 1, repos: {} };
}
var store = createEncryptedStore(REPO_EXPERIENCE_FILE, {
  blank: blankFile,
  keyPolicy: "keychain-required"
});
var activeStore = store;
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
export {
  __setStoreForTests,
  addNote,
  briefingLines,
  calibrationSummary,
  continuity,
  continuityForRepo,
  getRepoEntry,
  projectOutcomes,
  readRepoExperience,
  recordAuditSample,
  recordBackfill,
  recordPolicySnapshot,
  writeTombstone
};
