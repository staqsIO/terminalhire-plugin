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
var TERMINALHIRE_DIR, KEY_FILE, KEYTAR_SERVICE, KEYTAR_ACCOUNT, ALGO, KEY_BYTES, IV_BYTES, forceKeytarUnavailableForTests, dependentStoreFiles;
var init_crypto_store = __esm({
  "src/crypto-store.ts"() {
    "use strict";
    TERMINALHIRE_DIR = join(homedir(), ".terminalhire");
    KEY_FILE = join(TERMINALHIRE_DIR, "key");
    KEYTAR_SERVICE = "terminalhire";
    KEYTAR_ACCOUNT = "profile-key";
    ALGO = "aes-256-gcm";
    KEY_BYTES = 32;
    IV_BYTES = 12;
    forceKeytarUnavailableForTests = false;
    dependentStoreFiles = /* @__PURE__ */ new Set();
  }
});

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
import { readFileSync as readFileSync2 } from "fs";
import { join as join2 } from "path";
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
import { hkdfSync, createHash, randomBytes as randomBytes2 } from "crypto";
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

// src/profile.ts
import { join as join3 } from "path";
import { homedir as homedir2 } from "os";
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
var TERMINALHIRE_DIR2, PROFILE_FILE, profileStore;
var init_profile = __esm({
  "src/profile.ts"() {
    "use strict";
    init_src();
    init_crypto_store();
    TERMINALHIRE_DIR2 = join3(homedir2(), ".terminalhire");
    PROFILE_FILE = join3(TERMINALHIRE_DIR2, "profile.enc");
    profileStore = createEncryptedStore(PROFILE_FILE, {
      blank: blankProfile,
      keyPolicy: "keytar-first-file-fallback"
    });
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
import { join as join4 } from "path";
import { homedir as homedir3 } from "os";
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
var TERMINALHIRE_DIR3, REPO_EXPERIENCE_FILE, MAX_REPOS, MAX_CULTURE_SAMPLES, MAX_NOTES, MAX_BACKFILL, store, activeStore;
var init_repo_experience = __esm({
  "src/repo-experience.ts"() {
    "use strict";
    init_crypto_store();
    init_profile();
    TERMINALHIRE_DIR3 = process.env.TERMINALHIRE_DIR || join4(homedir3(), ".terminalhire");
    REPO_EXPERIENCE_FILE = join4(TERMINALHIRE_DIR3, "repo-experience.enc");
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
import { readFileSync as readFileSync3, writeFileSync as writeFileSync2, mkdirSync as mkdirSync2, renameSync as renameSync2, existsSync as existsSync2, rmSync as rmSync2, statSync } from "fs";
import { randomBytes as randomBytes3 } from "crypto";
import { join as join5 } from "path";
import { homedir as homedir4 } from "os";
function sleepSync(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}
function withClaimsLock(fn) {
  mkdirSync2(TERMINALHIRE_DIR4, { recursive: true, mode: 448 });
  const deadline = Date.now() + LOCK_TIMEOUT_MS;
  for (; ; ) {
    try {
      mkdirSync2(LOCK_DIR, { mode: 448 });
      break;
    } catch {
      try {
        if (Date.now() - statSync(LOCK_DIR).mtimeMs > LOCK_STALE_MS) {
          rmSync2(LOCK_DIR, { recursive: true, force: true });
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
    rmSync2(LOCK_DIR, { recursive: true, force: true });
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
    if (!existsSync2(CLAIMS_FILE)) return [];
    const data = JSON.parse(readFileSync3(CLAIMS_FILE, "utf8"));
    const claims = Array.isArray(data?.claims) ? data.claims : [];
    return claims.map(normalizeClaim);
  } catch {
    return [];
  }
}
function writeClaims(claims) {
  mkdirSync2(TERMINALHIRE_DIR4, { recursive: true, mode: 448 });
  const tmp = `${CLAIMS_FILE}.${process.pid}.${randomBytes3(6).toString("hex")}.tmp`;
  const payload = { claims };
  try {
    writeFileSync2(tmp, JSON.stringify(payload, null, 2), { encoding: "utf8", mode: 384, flag: "wx" });
    renameSync2(tmp, CLAIMS_FILE);
  } catch (err) {
    try {
      rmSync2(tmp, { force: true });
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
var TERMINALHIRE_DIR4, CLAIMS_FILE, LOCK_DIR, LOCK_STALE_MS, LOCK_RETRY_MS, LOCK_TIMEOUT_MS, PUSHED_CLAIM_FIELDS, TERMINAL_STATES, POLL_TRANSITIONS;
var init_claims = __esm({
  "src/claims.ts"() {
    "use strict";
    TERMINALHIRE_DIR4 = process.env.TERMINALHIRE_DIR || join5(homedir4(), ".terminalhire");
    CLAIMS_FILE = join5(TERMINALHIRE_DIR4, "claims.json");
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
      merged: /* @__PURE__ */ new Set(["claimed", "working", "in-review", "ready", "submitted", "abandoned"]),
      abandoned: /* @__PURE__ */ new Set(["claimed", "working", "in-review", "ready", "submitted", "merged"]),
      submitted: /* @__PURE__ */ new Set(["claimed", "working", "in-review", "ready"])
    };
  }
});

// bin/jpi-repo.js
import { execFile } from "child_process";
import { promisify } from "util";
var pExecFile = promisify(execFile);
async function sh(cmd, args) {
  const { stdout } = await pExecFile(cmd, args, { shell: false, maxBuffer: 16 * 1024 * 1024 });
  return stdout.trim();
}
function isRepoFullName(s) {
  return typeof s === "string" && /^[\w.-]+\/[\w.-]+$/.test(s);
}
async function cmdShow(repoFullName) {
  if (!isRepoFullName(repoFullName)) {
    console.error(`Usage: terminalhire repo <owner/repo>
  '${repoFullName ?? ""}' does not look like an owner/repo.`);
    process.exit(1);
  }
  const { getRepoEntry: getRepoEntry2, projectOutcomes: projectOutcomes2, continuity: continuity2, calibrationSummary: calibrationSummary2, briefingLines: briefingLines2 } = await Promise.resolve().then(() => (init_repo_experience(), repo_experience_exports));
  const claims = await Promise.resolve().then(() => (init_claims(), claims_exports));
  const entry = await getRepoEntry2(repoFullName);
  const allClaims = claims.readClaims();
  const projection = projectOutcomes2(allClaims, entry?.tombstones ?? [], repoFullName, entry?.backfill ?? []);
  console.log(`
  ${repoFullName}`);
  if (!entry && projection.mergedCount === 0) {
    console.log("  No local history for this repo yet.");
    console.log(`  Claim something here, or run \`terminalhire repo sync ${repoFullName}\` to backfill from GitHub.`);
    return;
  }
  const personalTTY = process.stdout.isTTY;
  if (personalTTY) {
    const cont = continuity2(projection);
    console.log(`  Continuity: ${cont.score.toFixed(2)}  (${cont.reasons.join(" \xB7 ")})`);
    const calib = calibrationSummary2(allClaims, repoFullName);
    if (calib.available) console.log(`  Calibration: ${calib.text}`);
  }
  if (entry?.policyCache) {
    const reqs = entry.policyCache.requirements.length ? ` [${entry.policyCache.requirements.join(", ")}]` : "";
    console.log(`  Policy (cached ${entry.policyCache.checkedAt}): ${entry.policyCache.verdict}${reqs}`);
    console.log("    (cache is DISPLAY-ONLY \u2014 `claim record`/`preview` always re-check live before you commit)");
  }
  if (personalTTY) {
    const brief = briefingLines2({ repoFullName, entry, claims: allClaims });
    if (brief.length > 0) console.log(`  Briefing: ${brief.join(" \xB7 ")}`);
  }
  if (entry?.notes.length) {
    console.log("  Notes:");
    for (const n of entry.notes) console.log(`    \xB7 ${n.text}  (${n.source}, ${n.addedAt})`);
  }
  if (personalTTY) {
    console.log(
      `  Merges recorded: ${projection.mergedCount}${projection.lastMergedAt ? ` (last ${projection.lastMergedAt})` : ""}`
    );
    console.log(
      `  Backfilled from GitHub: ${entry?.backfill.length ?? 0} (run \`terminalhire repo sync ${repoFullName}\` to refresh)`
    );
  }
}
async function cmdNote(repoFullName, text) {
  if (!isRepoFullName(repoFullName) || !text) {
    console.error('Usage: terminalhire repo note <owner/repo> "text"');
    process.exit(1);
  }
  const { addNote: addNote2 } = await Promise.resolve().then(() => (init_repo_experience(), repo_experience_exports));
  await addNote2(repoFullName, text, "manual");
  console.log(`Noted for ${repoFullName}.`);
}
async function cmdSync(repoFullName) {
  if (!isRepoFullName(repoFullName)) {
    console.error("Usage: terminalhire repo sync <owner/repo>");
    process.exit(1);
  }
  console.log(`Syncing your merged PR history in ${repoFullName} from GitHub\u2026`);
  let raw;
  try {
    raw = await sh("gh", [
      "pr",
      "list",
      "--repo",
      repoFullName,
      "--author",
      "@me",
      "--state",
      "merged",
      "--json",
      "number,mergedAt",
      "--limit",
      "100"
    ]);
  } catch (err) {
    console.error(`terminalhire repo sync: \`gh pr list\` failed \u2014 ${err.message ?? err}`);
    process.exit(1);
  }
  let prs;
  try {
    prs = JSON.parse(raw);
  } catch {
    console.error("terminalhire repo sync: could not parse `gh pr list` output.");
    process.exit(1);
  }
  const entries = (Array.isArray(prs) ? prs : []).filter((p) => p && typeof p.number === "number" && p.mergedAt).map((p) => ({ prNumber: p.number, mergedAt: p.mergedAt }));
  const { recordBackfill: recordBackfill2 } = await Promise.resolve().then(() => (init_repo_experience(), repo_experience_exports));
  await recordBackfill2(repoFullName, entries);
  console.log(`Synced ${entries.length} merged PR${entries.length === 1 ? "" : "s"} for ${repoFullName}.`);
}
async function run() {
  const args = process.argv.slice(2);
  const filtered = args[0] === "repo" ? args.slice(1) : args;
  const [first, ...rest] = filtered;
  if (!first) {
    console.error('Usage: terminalhire repo <owner/repo> | repo note <owner/repo> "text" | repo sync <owner/repo>');
    process.exit(1);
  }
  try {
    if (first === "note") {
      await cmdNote(rest[0], rest.slice(1).join(" "));
      return;
    }
    if (first === "sync") {
      await cmdSync(rest[0]);
      return;
    }
    await cmdShow(first);
  } catch (err) {
    console.error("terminalhire repo error:", err.message ?? err);
    process.exit(1);
  }
}
export {
  run
};
