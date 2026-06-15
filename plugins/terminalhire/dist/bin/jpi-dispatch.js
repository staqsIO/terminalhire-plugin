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

// src/github-auth.ts
var github_auth_exports = {};
__export(github_auth_exports, {
  GITHUB_SCOPE: () => GITHUB_SCOPE,
  deleteGitHubToken: () => deleteGitHubToken,
  hasGitHubToken: () => hasGitHubToken,
  readGitHubToken: () => readGitHubToken,
  resolveStoredLogin: () => resolveStoredLogin,
  runDeviceFlow: () => runDeviceFlow,
  writeGitHubToken: () => writeGitHubToken
});
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
  rmSync
} from "fs";
import { join } from "path";
import { homedir } from "os";
async function loadKey() {
  try {
    const kt = await import("keytar");
    const stored = await kt.getPassword("terminalhire", "profile-key");
    if (stored) return Buffer.from(stored, "hex");
    const key2 = randomBytes(KEY_BYTES);
    await kt.setPassword("terminalhire", "profile-key", key2.toString("hex"));
    return key2;
  } catch {
  }
  mkdirSync(TERMINALHIRE_DIR, { recursive: true });
  if (existsSync(KEY_FILE)) {
    return Buffer.from(readFileSync(KEY_FILE, "utf8").trim(), "hex");
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
async function readGitHubToken() {
  if (!existsSync(TOKEN_FILE)) return void 0;
  try {
    const key = await loadKey();
    const raw = readFileSync(TOKEN_FILE, "utf8");
    const blob = JSON.parse(raw);
    return decrypt(blob, key);
  } catch {
    return void 0;
  }
}
async function writeGitHubToken(token) {
  mkdirSync(TERMINALHIRE_DIR, { recursive: true });
  const key = await loadKey();
  const blob = encrypt(token, key);
  writeFileSync(TOKEN_FILE, JSON.stringify(blob, null, 2), { encoding: "utf8" });
}
async function deleteGitHubToken() {
  try {
    rmSync(TOKEN_FILE);
  } catch {
  }
}
async function hasGitHubToken() {
  return existsSync(TOKEN_FILE);
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
    console.warn("Remove it to use the baked-in client ID, or set it to your own OAuth App Client ID.\n");
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
  throw new Error("GitHub device code expired before authorization. Please run `terminalhire login` again.");
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
  if (process.env["TERMINALHIRE_GITHUB_MOCK"] === "1" || process.env["TERMINALHIRE_GITHUB_MOCK"] === "1" || process.env["JPI_GITHUB_MOCK"] === "1") return MOCK_LOGIN;
  const token = await readGitHubToken();
  if (!token) return void 0;
  try {
    return await fetchAuthedLogin(token);
  } catch {
    return void 0;
  }
}
function sleep(ms) {
  return new Promise((resolve2) => setTimeout(resolve2, ms));
}
var TERMINALHIRE_DIR, TOKEN_FILE, KEY_FILE, ALGO, KEY_BYTES, IV_BYTES, GITHUB_SCOPE, DEVICE_CODE_URL, ACCESS_TOKEN_URL, BAKED_IN_CLIENT_ID, MOCK_TOKEN, MOCK_LOGIN;
var init_github_auth = __esm({
  "src/github-auth.ts"() {
    "use strict";
    TERMINALHIRE_DIR = join(homedir(), ".terminalhire");
    TOKEN_FILE = join(TERMINALHIRE_DIR, "github-token.enc");
    KEY_FILE = join(TERMINALHIRE_DIR, "key");
    ALGO = "aes-256-gcm";
    KEY_BYTES = 32;
    IV_BYTES = 12;
    GITHUB_SCOPE = "read:user";
    DEVICE_CODE_URL = "https://github.com/login/device/code";
    ACCESS_TOKEN_URL = "https://github.com/login/oauth/access_token";
    BAKED_IN_CLIENT_ID = "Ov23lignE2ZSBe0J3a6B";
    MOCK_TOKEN = "mock-github-token-jpi-dev";
    MOCK_LOGIN = "janedev";
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
      { id: "ml", synonyms: ["machine-learning"], related: [{ to: "pytorch", w: 0.5 }, { to: "tensorflow", w: 0.5 }, { to: "scikit-learn", w: 0.5 }] },
      { id: "llm", parents: ["ml"], synonyms: ["llms", "genai", "generative-ai"], related: [{ to: "langchain", w: 0.5 }, { to: "rag", w: 0.55 }, { to: "openai", w: 0.45 }, { to: "anthropic", w: 0.45 }] },
      { id: "pytorch", parents: ["ml"], synonyms: ["torch"], related: [{ to: "tensorflow", w: 0.5 }] },
      { id: "tensorflow", parents: ["ml"], synonyms: ["keras", "tf-keras"] },
      { id: "pandas", parents: ["python"], related: [{ to: "numpy", w: 0.6 }] },
      { id: "numpy", parents: ["python"] },
      { id: "scikit-learn", parents: ["ml"], synonyms: ["sklearn"] },
      { id: "jupyter", parents: ["python"] },
      { id: "langchain", parents: ["llm"], synonyms: ["llamaindex"] },
      { id: "huggingface", parents: ["ml"], synonyms: ["hugging-face"] },
      { id: "openai", parents: ["llm"] },
      { id: "anthropic", parents: ["llm"], synonyms: ["claude"] },
      { id: "rag", parents: ["llm"], synonyms: ["retrieval-augmented-generation"] },
      { id: "mlops", parents: ["ml"], related: [{ to: "devops", w: 0.4 }] },
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

// ../../packages/core/src/matcher.ts
function computeIdf(jobs) {
  const docFreq = /* @__PURE__ */ new Map();
  const N = jobs.length;
  for (const job of jobs) {
    const unique = new Set(job.tags);
    for (const tag of unique) {
      docFreq.set(tag, (docFreq.get(tag) ?? 0) + 1);
    }
  }
  const idf = /* @__PURE__ */ new Map();
  for (const [tag, df] of docFreq) {
    idf.set(tag, Math.log((N + 1) / (df + 1)) + 1);
  }
  return idf;
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
  if (!postedAt) return 0.75;
  const ageDays = (now - new Date(postedAt).getTime()) / 864e5;
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
function match(fp, jobs, limit = 5, now = Date.now()) {
  const idf = computeIdf(jobs);
  const idfOf = (t) => idf.get(t) ?? 0;
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
    details.sort((a, b) => idfOf(b.tag) * b.weight - idfOf(a.tag) * a.weight);
    const sScore = seniorityScore(fp, job);
    const rScore = recencyScore(job.postedAt, now);
    const score = tagComponent * 0.6 + sScore * 0.25 + rScore * 0.15;
    const matchedTags = [...new Set(details.map((d) => d.via ?? d.tag))];
    return {
      job,
      score: Math.round(score * 1e3) / 1e3,
      matchedTags,
      matchDetails: details,
      reason: buildReason(details)
    };
  });
  return scored.filter((r) => r !== null && r.score >= MIN_SCORE).sort((a, b) => b.score - a.score).slice(0, limit);
}
function matchOne(fp, job) {
  const results = match(fp, [job], 1);
  return results.length > 0 ? results[0] : null;
}
var MIN_SCORE, SHARPEN, SENIORITY_RANK, SENIORITY_PATTERNS, ENG_TITLE;
var init_matcher = __esm({
  "../../packages/core/src/matcher.ts"() {
    "use strict";
    init_vocabulary();
    MIN_SCORE = 0.15;
    SHARPEN = 1.6;
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
  }
});

// ../../packages/core/src/feeds/greenhouse.ts
function tokenize(text) {
  return text.toLowerCase().replace(/[^a-z0-9.\-+#]/g, " ").split(/\s+/).filter(Boolean);
}
function extractTags(job) {
  const texts = [
    job.title,
    ...(job.departments ?? []).map((d) => d.name),
    job.location?.name ?? "",
    ...(job.offices ?? []).map((o) => o.name),
    // mine the full HTML description for additional signal when present
    ...job.content ? [job.content.replace(/<[^>]*>/g, " ")] : []
  ].filter(Boolean);
  const tokens = texts.flatMap(tokenize);
  return normalize(tokens);
}
function inferRemote(location) {
  const l = location.toLowerCase();
  return l.includes("remote") || l.includes("anywhere") || l.includes("worldwide");
}
async function fetchSlug(slug) {
  const url = `https://boards-api.greenhouse.io/v1/boards/${slug}/jobs?content=true`;
  let res;
  try {
    res = await fetch(url, { headers: { Accept: "application/json" } });
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
function tokenize2(text) {
  return text.toLowerCase().replace(/[^a-z0-9.\-+#]/g, " ").split(/\s+/).filter(Boolean);
}
function extractTags2(job) {
  const texts = [
    job.title,
    job.teamName ?? "",
    job.locationName ?? "",
    ...(job.secondaryLocations ?? []).map((l) => l.locationName ?? "")
  ];
  return normalize(texts.flatMap(tokenize2));
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
  const loc = (job.locationName ?? "").toLowerCase();
  return loc.includes("remote") || loc.includes("anywhere");
}
async function fetchSlug2(slug) {
  const url = `https://api.ashbyhq.com/posting-api/job-board/${slug}`;
  const res = await fetch(url, {
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
      url: j.applyUrl ?? `https://jobs.ashbyhq.com/${slug}/${j.id}`,
      remote: inferRemote2(j),
      location: j.locationName,
      compMin: comp?.minValue,
      compMax: comp?.maxValue,
      tags: extractTags2(j),
      roleType: mapEmploymentType(j.employmentType),
      postedAt: j.publishedDate,
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
function tokenize3(text) {
  return text.toLowerCase().replace(/[^a-z0-9.\-+#]/g, " ").split(/\s+/).filter(Boolean);
}
function extractTags3(p) {
  const cat = p.categories ?? {};
  const texts = [
    p.text,
    cat.team ?? "",
    cat.department ?? "",
    cat.location ?? "",
    ...cat.allLocations ?? [],
    p.descriptionPlain ?? ""
  ];
  return normalize(texts.flatMap(tokenize3));
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
  const res = await fetch(url, { headers: { Accept: "application/json" } });
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
function tokenize4(text) {
  return text.toLowerCase().replace(/[^a-z0-9.\-+#]/g, " ").split(/\s+/).filter(Boolean);
}
function extractTags4(job) {
  const texts = [
    job.title,
    ...job.tags ?? []
  ];
  return normalize(texts.flatMap(tokenize4));
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
    himalayas = {
      source: "himalayas",
      async fetch(opts) {
        const limit = opts?.limit ?? 100;
        const url = `https://himalayas.app/jobs/api?limit=${limit}`;
        const res = await fetch(url, {
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

// ../../packages/core/src/feeds/wwr.ts
function tokenize5(text) {
  return text.toLowerCase().replace(/[^a-z0-9.\-+#]/g, " ").split(/\s+/).filter(Boolean);
}
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
      if (cdataMatch) return cdataMatch[1].trim();
      const plainMatch = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
      return plainMatch?.[1].trim() ?? "";
    };
    const rawTitle = get("title");
    const colonIdx = rawTitle.indexOf(":");
    const company = colonIdx !== -1 ? rawTitle.slice(0, colonIdx).trim() : "Unknown";
    const titleAfterColon = colonIdx !== -1 ? rawTitle.slice(colonIdx + 1).trim() : rawTitle;
    const title = titleAfterColon.replace(/\s*\([^)]*\)\s*$/, "").trim();
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
  const text = [item.title, item.category, stripHtml(item.description)].join(" ");
  return normalize(tokenize5(text));
}
var WWR_RSS_URL, wwr;
var init_wwr = __esm({
  "../../packages/core/src/feeds/wwr.ts"() {
    "use strict";
    init_vocabulary();
    WWR_RSS_URL = "https://weworkremotely.com/remote-jobs.rss";
    wwr = {
      source: "wwr",
      async fetch(opts) {
        const limit = opts?.limit ?? 200;
        const res = await fetch(WWR_RSS_URL, {
          headers: { Accept: "application/rss+xml, application/xml, text/xml" }
        });
        if (!res.ok) {
          throw new Error(`WWR RSS: HTTP ${res.status}`);
        }
        const xml = await res.text();
        const items = parseRss(xml).slice(0, limit);
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
          postedAt: item.pubDate ? new Date(item.pubDate).toISOString() : void 0,
          applyMode: "direct",
          raw: item
        }));
      }
    };
  }
});

// ../../packages/core/src/feeds/hn.ts
function tokenize6(text) {
  return text.toLowerCase().replace(/[^a-z0-9.\-+#]/g, " ").split(/\s+/).filter(Boolean);
}
function stripHtml2(html) {
  return html.replace(/<p>/gi, " ").replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/\s+/g, " ").trim();
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
  const tags = extractTags6(raw);
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
function extractTags6(text) {
  return normalize(tokenize6(text));
}
var ALGOLIA_SEARCH, ALGOLIA_ITEMS, hn;
var init_hn = __esm({
  "../../packages/core/src/feeds/hn.ts"() {
    "use strict";
    init_vocabulary();
    ALGOLIA_SEARCH = "https://hn.algolia.com/api/v1/search?query=Ask+HN%3A+Who+is+Hiring%3F&tags=story,ask_hn&hitsPerPage=1";
    ALGOLIA_ITEMS = "https://hn.algolia.com/api/v1/items/";
    hn = {
      source: "hn",
      async fetch(opts) {
        const limit = opts?.limit ?? 150;
        const searchRes = await fetch(ALGOLIA_SEARCH, {
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
        const itemRes = await fetch(`${ALGOLIA_ITEMS}${story.objectID}`, {
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

// ../../packages/core/src/feeds/index.ts
function flattenTiers(t) {
  return [.../* @__PURE__ */ new Set([...t.bigco, ...t.scaleup, ...t.startup])];
}
async function aggregate(opts) {
  const ghSlugs = opts?.slugs?.["greenhouse"] ?? DEFAULT_GREENHOUSE_SLUGS;
  const ashbySlugs = opts?.slugs?.["ashby"] ?? DEFAULT_ASHBY_SLUGS;
  const leverSlugs = opts?.slugs?.["lever"] ?? DEFAULT_LEVER_SLUGS;
  const limit = opts?.limit ?? 150;
  const settled = await Promise.allSettled([
    greenhouse.fetch({ slugs: ghSlugs, limit }),
    ashby.fetch({ slugs: ashbySlugs, limit }),
    lever.fetch({ slugs: leverSlugs, limit }),
    himalayas.fetch({ limit }),
    wwr.fetch({ limit }),
    hn.fetch({ limit })
  ]);
  const seen = /* @__PURE__ */ new Set();
  const jobs = [];
  const sourceNames = ["greenhouse", "ashby", "lever", "himalayas", "wwr", "hn"];
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
  return jobs;
}
var FEEDS, GREENHOUSE_SLUGS_BY_TIER, ASHBY_SLUGS_BY_TIER, LEVER_SLUGS_BY_TIER, DEFAULT_GREENHOUSE_SLUGS, DEFAULT_ASHBY_SLUGS, DEFAULT_LEVER_SLUGS;
var init_feeds = __esm({
  "../../packages/core/src/feeds/index.ts"() {
    "use strict";
    init_greenhouse();
    init_ashby();
    init_lever();
    init_himalayas();
    init_wwr();
    init_hn();
    FEEDS = [greenhouse, ashby, lever, himalayas, wwr, hn];
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

// ../../packages/core/src/partners.ts
import { readFileSync as readFileSync2 } from "fs";
import { join as join2 } from "path";
import { fileURLToPath } from "url";
function resolveDataPath() {
  try {
    const dir = fileURLToPath(new URL("../../../data", import.meta.url));
    return join2(dir, "partner-roles.json");
  } catch {
    return join2(process.cwd(), "data", "partner-roles.json");
  }
}
function loadPartnerRoles() {
  const filePath = resolveDataPath();
  try {
    const raw = readFileSync2(filePath, "utf-8");
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

// ../../packages/core/src/github.ts
function ghHeaders(token) {
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28"
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
function inferSeniority2(p) {
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
  const seniorityBand = inferSeniority2(p);
  return { skillTags, seniorityBand };
}
var init_github = __esm({
  "../../packages/core/src/github.ts"() {
    "use strict";
    init_vocabulary();
  }
});

// ../../packages/core/src/index.ts
var src_exports = {};
__export(src_exports, {
  ASHBY_SLUGS_BY_TIER: () => ASHBY_SLUGS_BY_TIER,
  DECAY_FLOOR: () => DECAY_FLOOR,
  DEFAULT_ASHBY_SLUGS: () => DEFAULT_ASHBY_SLUGS,
  DEFAULT_GREENHOUSE_SLUGS: () => DEFAULT_GREENHOUSE_SLUGS,
  DEFAULT_LEVER_SLUGS: () => DEFAULT_LEVER_SLUGS,
  EXAMPLE_BUYER: () => EXAMPLE_BUYER,
  FEEDS: () => FEEDS,
  GRAPH: () => GRAPH,
  GREENHOUSE_SLUGS_BY_TIER: () => GREENHOUSE_SLUGS_BY_TIER,
  LEVER_SLUGS_BY_TIER: () => LEVER_SLUGS_BY_TIER,
  SYNONYMS: () => SYNONYMS,
  VOCABULARY: () => VOCABULARY,
  VOCAB_NODES: () => VOCAB_NODES,
  aggregate: () => aggregate,
  ashby: () => ashby,
  buildGraph: () => buildGraph,
  buildIndex: () => buildIndex,
  buildReason: () => buildReason,
  expandWeighted: () => expandWeighted,
  fetchGitHubProfile: () => fetchGitHubProfile,
  flattenTiers: () => flattenTiers,
  getBuyer: () => getBuyer,
  githubToFingerprint: () => githubToFingerprint,
  greenhouse: () => greenhouse,
  himalayas: () => himalayas,
  hn: () => hn,
  lever: () => lever,
  loadPartnerRoles: () => loadPartnerRoles,
  match: () => match,
  matchOne: () => matchOne,
  normalize: () => normalize,
  validateGraph: () => validateGraph,
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
  createCipheriv as createCipheriv2,
  createDecipheriv as createDecipheriv2,
  randomBytes as randomBytes2
} from "crypto";
import {
  readFileSync as readFileSync3,
  writeFileSync as writeFileSync2,
  mkdirSync as mkdirSync2,
  existsSync as existsSync2
} from "fs";
import { join as join3 } from "path";
import { homedir as homedir2 } from "os";
async function loadKey2() {
  try {
    const kt = await import("keytar");
    const stored = await kt.getPassword("terminalhire", "profile-key");
    if (stored) {
      return Buffer.from(stored, "hex");
    }
    const key2 = randomBytes2(KEY_BYTES2);
    await kt.setPassword("terminalhire", "profile-key", key2.toString("hex"));
    return key2;
  } catch {
  }
  mkdirSync2(TERMINALHIRE_DIR2, { recursive: true });
  if (existsSync2(KEY_FILE2)) {
    return Buffer.from(readFileSync3(KEY_FILE2, "utf8").trim(), "hex");
  }
  const key = randomBytes2(KEY_BYTES2);
  writeFileSync2(KEY_FILE2, key.toString("hex"), { mode: 384, encoding: "utf8" });
  return key;
}
function encrypt2(plaintext, key) {
  const iv = randomBytes2(IV_BYTES2);
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
  if (!existsSync2(PROFILE_FILE)) return blankProfile();
  try {
    const key = await loadKey2();
    const raw = readFileSync3(PROFILE_FILE, "utf8");
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
  mkdirSync2(TERMINALHIRE_DIR2, { recursive: true });
  const key = await loadKey2();
  profile.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
  profile.skillTags = deriveSkillTags(profile.tagWeights);
  const blob = encrypt2(JSON.stringify(profile), key);
  writeFileSync2(PROFILE_FILE, JSON.stringify(blob, null, 2), { encoding: "utf8" });
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
  const { rmSync: rmSync3 } = await import("fs");
  try {
    rmSync3(PROFILE_FILE);
  } catch {
  }
  try {
    rmSync3(KEY_FILE2);
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
var TERMINALHIRE_DIR2, PROFILE_FILE, KEY_FILE2, ALGO2, KEY_BYTES2, IV_BYTES2, DECAY_HALF_LIFE_MS, LANGUAGE_TAGS, MIN_FINGERPRINT_SCORE;
var init_profile = __esm({
  "src/profile.ts"() {
    "use strict";
    init_src();
    TERMINALHIRE_DIR2 = join3(homedir2(), ".terminalhire");
    PROFILE_FILE = join3(TERMINALHIRE_DIR2, "profile.enc");
    KEY_FILE2 = join3(TERMINALHIRE_DIR2, "key");
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

// bin/jpi-login.js
var jpi_login_exports = {};
__export(jpi_login_exports, {
  run: () => run
});
async function run() {
  const subcommand = process.argv[2];
  if (subcommand === "logout") {
    await runLogout();
  } else {
    await runLogin();
  }
}
async function runLogin() {
  const { runDeviceFlow: runDeviceFlow2, readGitHubToken: readGitHubToken2 } = await Promise.resolve().then(() => (init_github_auth(), github_auth_exports));
  const { fetchGitHubProfile: fetchGitHubProfile2, githubToFingerprint: githubToFingerprint2 } = await Promise.resolve().then(() => (init_src(), src_exports));
  const { readProfile: readProfile2, writeProfile: writeProfile2, accumulateGitHubTags: accumulateGitHubTags2 } = await Promise.resolve().then(() => (init_profile(), profile_exports));
  console.log("");
  console.log("  terminalhire \u2014 Sign in with GitHub");
  console.log("  \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500");
  console.log("  Scope: read:user  (public profile + public repos only)");
  console.log("  Your token is encrypted and stored at ~/.terminalhire/github-token.enc");
  console.log("  GitHub data enriches your LOCAL profile \u2014 no data leaves your machine.");
  console.log("  \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500");
  try {
    const login = await runDeviceFlow2();
    const token = await readGitHubToken2();
    if (!token) throw new Error("Token was not stored after device flow \u2014 unexpected.");
    console.log(`
  Fetching public profile for @${login}...`);
    let ghProfile;
    if (process.env["TERMINALHIRE_GITHUB_MOCK"] === "1" || process.env["TERMINALHIRE_GITHUB_MOCK"] === "1" || process.env["JPI_GITHUB_MOCK"] === "1") {
      const { createRequire: createRequire2 } = await import("module");
      const { fileURLToPath: fileURLToPath7 } = await import("url");
      const { join: join14, dirname: dirname3 } = await import("path");
      const __dirname6 = fileURLToPath7(new URL(".", import.meta.url));
      const fixturePath = join14(__dirname6, "../../fixtures/github-sample.json");
      const { readFileSync: readFileSync13 } = await import("fs");
      ghProfile = JSON.parse(readFileSync13(fixturePath, "utf8"));
    } else {
      ghProfile = await fetchGitHubProfile2(login, token);
    }
    const fragment = githubToFingerprint2(ghProfile);
    const profile = await readProfile2();
    accumulateGitHubTags2(profile, fragment.skillTags, fragment.seniorityBand);
    if (!profile.displayName && ghProfile.name) {
      profile.displayName = ghProfile.name;
    }
    if (!profile.contactEmail && ghProfile.publicEmail) {
      profile.contactEmail = ghProfile.publicEmail;
    }
    profile.github = {
      login: ghProfile.login,
      profileUrl: `https://github.com/${ghProfile.login}`,
      topLanguages: ghProfile.topLanguages.slice(0, 5),
      publicRepos: ghProfile.publicRepos
    };
    await writeProfile2(profile);
    console.log("");
    console.log("  GitHub profile merged into local encrypted profile:");
    console.log(`    Login:         @${ghProfile.login}`);
    if (ghProfile.name) {
      console.log(`    Name:          ${ghProfile.name}`);
    }
    console.log(`    Public repos:  ${ghProfile.publicRepos}`);
    console.log(`    Top languages: ${ghProfile.topLanguages.slice(0, 5).join(", ")}`);
    if (fragment.seniorityBand) {
      console.log(`    Seniority est: ${fragment.seniorityBand}`);
    }
    console.log(`    Skill tags:    ${fragment.skillTags.join(", ")}`);
    if (fragment.skillTags.length === 0) {
      console.log("    (No matching vocabulary tags found in public repos/topics)");
    }
    console.log("");
    console.log("  Profile updated at ~/.terminalhire/profile.enc (encrypted at rest)");
    console.log("  GitHub data stays on your machine unless you consent to share it in a lead.");
    console.log("");
    console.log("  Run `terminalhire jobs` to see matching roles using your enriched profile.");
    console.log("");
  } catch (err) {
    console.error("\n  Login error:", err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
}
async function runLogout() {
  const { deleteGitHubToken: deleteGitHubToken2, hasGitHubToken: hasGitHubToken2 } = await Promise.resolve().then(() => (init_github_auth(), github_auth_exports));
  const { readProfile: readProfile2, writeProfile: writeProfile2 } = await Promise.resolve().then(() => (init_profile(), profile_exports));
  const hasToken = await hasGitHubToken2();
  if (!hasToken) {
    console.log("\n  No GitHub token stored \u2014 nothing to remove.\n");
    process.exit(0);
  }
  await deleteGitHubToken2();
  const profile = await readProfile2();
  if (profile.github) {
    delete profile.github;
    await writeProfile2(profile);
    console.log("\n  GitHub identity cleared from local profile.");
  }
  console.log("  GitHub token deleted from ~/.terminalhire/github-token.enc");
  console.log("  Skill tags accumulated from GitHub remain in your profile.");
  console.log("  To also delete those: terminalhire profile --delete\n");
}
var init_jpi_login = __esm({
  "bin/jpi-login.js"() {
    "use strict";
  }
});

// bin/jpi-jobs.js
var jpi_jobs_exports = {};
__export(jpi_jobs_exports, {
  run: () => run2
});
import { readFileSync as readFileSync4, writeFileSync as writeFileSync3, mkdirSync as mkdirSync3, existsSync as existsSync3 } from "fs";
import { join as join4 } from "path";
import { homedir as homedir3 } from "os";
import { createInterface } from "readline";
import { fileURLToPath as fileURLToPath2 } from "url";
function readIndexCache() {
  try {
    const raw = readFileSync4(INDEX_CACHE_FILE, "utf8");
    const entry = JSON.parse(raw);
    if (Date.now() - entry.ts < INDEX_TTL_MS) return entry.index;
    return null;
  } catch {
    return null;
  }
}
function writeIndexCache(index) {
  mkdirSync3(TERMINALHIRE_DIR3, { recursive: true });
  writeFileSync3(INDEX_CACHE_FILE, JSON.stringify({ ts: Date.now(), index }), "utf8");
}
async function fetchIndex() {
  const cached = readIndexCache();
  if (cached) return cached;
  const res = await fetch(`${API_URL}/api/index`, {
    signal: AbortSignal.timeout(1e4)
  });
  if (!res.ok) throw new Error(`/api/index returned ${res.status}`);
  const index = await res.json();
  writeIndexCache(index);
  return index;
}
function prompt(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve2) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve2(answer.trim().toLowerCase());
    });
  });
}
function buildConsentText(job, profile) {
  const fields = ["skillTags: " + JSON.stringify(profile.skillTags)];
  if (profile.seniority) fields.push('seniorityBand: "' + profile.seniority + '"');
  if (profile.displayName) fields.push('displayName: "' + profile.displayName + '"');
  if (profile.contactEmail) fields.push('contactEmail: "' + profile.contactEmail + '"');
  if (profile.github) {
    fields.push(
      'github.login: "' + profile.github.login + '"',
      'github.profileUrl: "' + profile.github.profileUrl + '"',
      "github.topLanguages: " + JSON.stringify(profile.github.topLanguages),
      "github.publicRepos: " + profile.github.publicRepos
    );
  }
  const githubNote = profile.github ? "\nGitHub fields above are public data only (scope: read:user). No private repos.\n" : "";
  return `You are about to share the following information with Coastal Recruiting LLC
for opportunity: ${job.title} at ${job.company} (${job.id})

Fields that will be sent:
` + fields.map((f) => `  \u2022 ${f}`).join("\n") + "\n" + githubNote + `
Nothing else leaves your machine. This action is specific to this role.
Coastal Recruiting LLC will use this to evaluate you for the role.
You can delete your profile at any time with: terminalhire profile --delete`;
}
function buildLeadPayload(job, profile, consentText, note) {
  const approvedFields = {
    skillTags: profile.skillTags
  };
  if (profile.seniority) approvedFields.seniorityBand = profile.seniority;
  if (profile.displayName) approvedFields.displayName = profile.displayName;
  if (profile.contactEmail) approvedFields.contactEmail = profile.contactEmail;
  if (note) approvedFields.note = note;
  if (profile.github) {
    approvedFields.github = {
      login: profile.github.login,
      profileUrl: profile.github.profileUrl,
      topLanguages: profile.github.topLanguages,
      publicRepos: profile.github.publicRepos
    };
  }
  return {
    opportunityId: job.id,
    buyerId: "coastal",
    buyerLegalName: "Coastal Recruiting LLC",
    approvedFields,
    consentText,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
}
function formatScore(score) {
  return Math.round(score * 100) + "%";
}
function formatComp(job) {
  if (job.compMin && job.compMax) {
    return `$${Math.round(job.compMin / 1e3)}k\u2013$${Math.round(job.compMax / 1e3)}k`;
  }
  if (job.compMin) return `$${Math.round(job.compMin / 1e3)}k+`;
  return "";
}
function linkTitle(title, url) {
  const isTTY = process.stdout.isTTY;
  const noColor = process.env["NO_COLOR"] !== void 0;
  if (isTTY && !noColor && url) {
    return `\x1B]8;;${url}\x1B\\${title}\x1B]8;;\x1B\\`;
  }
  return url ? `${title} (${url})` : title;
}
function printResult(i, result) {
  const { job, score, matchedTags, reason } = result;
  const comp = formatComp(job);
  const remote = job.remote ? "remote" : job.location ?? "onsite";
  const compStr = comp ? ` \xB7 ${comp}` : "";
  const mode = job.applyMode === "buyer-lead" ? " [COASTAL LEAD]" : "";
  const titleStr = linkTitle(job.title, job.url);
  console.log(`
${i + 1}. ${titleStr} \u2014 ${job.company}${mode}`);
  console.log(`   id: ${job.id}`);
  console.log(`   ${remote}${compStr} \xB7 ${job.roleType} \xB7 score: ${formatScore(score)}`);
  console.log(`   ${reason}`);
  console.log(`   Tags matched: ${matchedTags.slice(0, 5).join(", ")}`);
  if (job.applyMode === "direct") {
    console.log(`   Apply: ${job.url}`);
  } else {
    console.log(`   Apply: via Coastal Recruiting LLC (consent required)`);
  }
}
async function handleBuyerLead(job, profile) {
  const consentText = buildConsentText(job, profile);
  console.log("\n" + "\u2500".repeat(70));
  console.log(consentText);
  console.log("\u2500".repeat(70));
  const answer = await prompt(
    "\nShare your profile with Coastal Recruiting LLC for this role? [y/N] "
  );
  if (answer !== "y" && answer !== "yes") {
    console.log("Aborted \u2014 nothing was sent.");
    return;
  }
  let note;
  const noteAnswer = await prompt("Optional note to Coastal (press Enter to skip): ");
  if (noteAnswer.trim()) note = noteAnswer.trim();
  const payload = buildLeadPayload(job, profile, consentText, note);
  console.log("\nSending lead payload...");
  const res = await fetch(`${API_URL}/api/lead`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(1e4)
  });
  if (!res.ok) {
    console.error(`Error: /api/lead returned ${res.status}`);
    return;
  }
  console.log("Lead sent. Coastal Recruiting LLC will be in touch if there is a match.");
}
async function run2() {
  try {
    const { readProfile: readProfile2, profileToFingerprint: profileToFingerprint2 } = await Promise.resolve().then(() => (init_profile(), profile_exports));
    const { match: match2 } = await Promise.resolve().then(() => (init_src(), src_exports));
    const profile = await readProfile2();
    if (profile.skillTags.length === 0) {
      console.log("\u2726 terminalhire jobs: no skill tags in local profile yet.");
      console.log("  Start a Claude Code session in a personal project to accumulate tags.");
      console.log("  Or edit your profile: terminalhire profile --edit");
      return;
    }
    console.log(`Fetching job index from ${API_URL}/api/index...`);
    const index = await fetchIndex();
    const jobs = index.jobs ?? [];
    if (jobs.length === 0) {
      console.log("No jobs in index. Try again later.");
      return;
    }
    const fp = profileToFingerprint2(profile);
    if (REMOTE_ONLY) fp.prefs = { ...fp.prefs, remoteOnly: true };
    const results = match2(fp, jobs, SHOW_ALL ? jobs.length : LIMIT);
    try {
      const cacheRaw = readFileSync4(INDEX_CACHE_FILE, "utf8");
      const cacheEntry = JSON.parse(cacheRaw);
      cacheEntry.matchCount = results.length;
      writeFileSync3(INDEX_CACHE_FILE, JSON.stringify(cacheEntry), "utf8");
    } catch {
    }
    if (results.length === 0) {
      console.log("No matching roles found for your current profile.");
      console.log("  Your tags: " + profile.skillTags.join(", "));
      return;
    }
    console.log(`
\u2726 ${results.length} role${results.length === 1 ? "" : "s"} matching your profile (local match \u2014 no data sent)
`);
    for (let i = 0; i < results.length; i++) {
      printResult(i, results[i]);
    }
    if (!process.stdin.isTTY) {
      return;
    }
    console.log("\n" + "\u2500".repeat(70));
    const pick = await prompt(
      `
Enter a number to act on a role, or press Enter to exit: `
    );
    const idx = parseInt(pick, 10) - 1;
    if (isNaN(idx) || idx < 0 || idx >= results.length) {
      return;
    }
    const chosen = results[idx];
    if (chosen.job.applyMode === "direct") {
      console.log(`
Open this URL to apply directly (no data shared):
  ${chosen.job.url}`);
    } else if (chosen.job.applyMode === "buyer-lead") {
      await handleBuyerLead(chosen.job, profile);
    }
  } catch (err) {
    console.error("terminalhire jobs error:", err.message ?? err);
    process.exit(1);
  }
}
var __dirname, TERMINALHIRE_DIR3, INDEX_CACHE_FILE, INDEX_TTL_MS, API_URL, DEFAULT_LIMIT, args, limitArg, LIMIT, REMOTE_ONLY, SHOW_ALL;
var init_jpi_jobs = __esm({
  "bin/jpi-jobs.js"() {
    "use strict";
    __dirname = fileURLToPath2(new URL(".", import.meta.url));
    TERMINALHIRE_DIR3 = join4(homedir3(), ".terminalhire");
    INDEX_CACHE_FILE = join4(TERMINALHIRE_DIR3, "index-cache.json");
    INDEX_TTL_MS = 15 * 60 * 1e3;
    API_URL = process.env["TERMINALHIRE_API_URL"] ?? process.env["JPI_API_URL"] ?? "https://terminalhire.com";
    DEFAULT_LIMIT = 10;
    args = process.argv.slice(2);
    limitArg = args.indexOf("--limit");
    LIMIT = limitArg !== -1 ? parseInt(args[limitArg + 1] ?? "10", 10) : DEFAULT_LIMIT;
    REMOTE_ONLY = args.includes("--remote-only");
    SHOW_ALL = args.includes("--all");
  }
});

// bin/jpi-profile.js
var jpi_profile_exports = {};
__export(jpi_profile_exports, {
  run: () => run3
});
import { createInterface as createInterface2 } from "readline";
function prompt2(question) {
  const rl = createInterface2({ input: process.stdin, output: process.stdout });
  return new Promise((resolve2) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve2(answer.trim());
    });
  });
}
async function run3() {
  const { readProfile: readProfile2, writeProfile: writeProfile2, deleteProfile: deleteProfile2 } = await Promise.resolve().then(() => (init_profile(), profile_exports));
  const args2 = process.argv.slice(2);
  if (args2.includes("--show")) {
    const profile = await readProfile2();
    console.log("\n\u2726 terminalhire local profile (encrypted at rest \u2014 shown here for your review only)\n");
    console.log("  Skill tags:      " + (profile.skillTags.length > 0 ? profile.skillTags.join(", ") : "(none yet)"));
    console.log("  Seniority:       " + (profile.seniority ?? "(not set)"));
    if (profile.displayName) console.log("  Display name:    " + profile.displayName);
    if (profile.contactEmail) console.log("  Contact email:   " + profile.contactEmail);
    if (profile.remoteOnly !== void 0) console.log("  Remote only:     " + profile.remoteOnly);
    if (profile.compFloorUsd !== void 0) console.log("  Comp floor USD:  $" + profile.compFloorUsd);
    console.log("  Employer sessions contributed: " + profile.hasEmployerSessions);
    if (profile.github) {
      console.log("");
      console.log("  GitHub (public data only, scope: read:user):");
      console.log("    Login:         @" + profile.github.login);
      console.log("    Profile URL:   " + profile.github.profileUrl);
      console.log("    Top languages: " + profile.github.topLanguages.join(", "));
      console.log("    Public repos:  " + profile.github.publicRepos);
      console.log("");
      console.log('  GitHub fields are included in a lead ONLY when you consent "yes".');
      console.log("  To disconnect GitHub: terminalhire logout");
    } else {
      console.log("");
      console.log("  GitHub: not connected  (run: terminalhire login for instant enrichment)");
    }
    console.log("");
    console.log("  Raw profile JSON:");
    console.log(JSON.stringify(profile, null, 2));
    console.log("\nThis profile NEVER leaves your machine except in a consented lead payload.");
    return;
  }
  if (args2.includes("--delete")) {
    console.log("\nThis will permanently delete your local terminalhire profile and encryption key.");
    const answer = await prompt2('Type "yes" to confirm: ');
    if (answer !== "yes") {
      console.log("Aborted.");
      process.exit(0);
    }
    await deleteProfile2();
    console.log("Profile and key deleted from ~/.terminalhire/");
    return;
  }
  if (args2.includes("--edit")) {
    const profile = await readProfile2();
    console.log("\n\u2726 terminalhire profile editor (press Enter to keep current value)\n");
    const name = await prompt2(`Display name [${profile.displayName ?? "not set"}]: `);
    if (name) profile.displayName = name;
    const email = await prompt2(`Contact email [${profile.contactEmail ?? "not set"}]: `);
    if (email) profile.contactEmail = email;
    const remote = await prompt2(`Remote only? (y/n) [${profile.remoteOnly ? "y" : "n"}]: `);
    if (remote === "y") profile.remoteOnly = true;
    if (remote === "n") profile.remoteOnly = false;
    const floor = await prompt2(`Comp floor USD [${profile.compFloorUsd ?? "not set"}]: `);
    if (floor && !isNaN(parseInt(floor, 10))) profile.compFloorUsd = parseInt(floor, 10);
    await writeProfile2(profile);
    console.log("\nProfile updated (encrypted at ~/.terminalhire/profile.enc)");
    return;
  }
  console.log("Usage: terminalhire profile --show | --edit | --delete");
}
var init_jpi_profile = __esm({
  "bin/jpi-profile.js"() {
    "use strict";
  }
});

// src/signal.ts
var signal_exports = {};
__export(signal_exports, {
  extractFingerprint: () => extractFingerprint
});
import { readFileSync as readFileSync5, readdirSync } from "fs";
import { execFileSync } from "child_process";
import { join as join5 } from "path";
function safeGit(args2, cwd) {
  try {
    return execFileSync("git", ["-C", cwd, ...args2], {
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
    return JSON.parse(readFileSync5(path, "utf8"));
  } catch {
    return null;
  }
}
function readFileSafe(path) {
  try {
    return readFileSync5(path, "utf8");
  } catch {
    return "";
  }
}
function tokensFromPackageJson(cwd) {
  const pkg = readJsonSafe(join5(cwd, "package.json"));
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
      const groupDir = join5(cwd, group);
      for (const e of readdirSync(groupDir, { withFileTypes: true })) {
        if (e.isDirectory() && !e.isSymbolicLink()) dirs.push(join5(groupDir, e.name));
      }
    } catch {
    }
  }
  return dirs;
}
function tokensFromRequirementsTxt(cwd) {
  const content = readFileSafe(join5(cwd, "requirements.txt"));
  if (!content) return [];
  return content.split("\n").map((l) => l.trim().split(/[>=<!\[;]/)[0].trim().toLowerCase()).filter(Boolean);
}
function tokensFromGoMod(cwd) {
  const content = readFileSafe(join5(cwd, "go.mod"));
  if (!content) return [];
  const requires = Array.from(content.matchAll(/^\s+([^\s]+)\s+v/gm)).map((m) => m[1].split("/").pop() ?? "").filter(Boolean);
  return ["go", ...requires];
}
function tokensFromCargoToml(cwd) {
  const content = readFileSafe(join5(cwd, "Cargo.toml"));
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
    const srcDir = join5(cwd, "src");
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

// bin/jpi-learn.js
var jpi_learn_exports = {};
__export(jpi_learn_exports, {
  run: () => run4
});
async function run4() {
  try {
    const args2 = process.argv.slice(2);
    const cwdIdx = args2.indexOf("--cwd");
    const cwd = cwdIdx !== -1 && args2[cwdIdx + 1] ? args2[cwdIdx + 1] : process.cwd();
    const { extractFingerprint: extractFingerprint2 } = await Promise.resolve().then(() => (init_signal(), signal_exports));
    const { readProfile: readProfile2, writeProfile: writeProfile2, accumulateSession: accumulateSession2 } = await Promise.resolve().then(() => (init_profile(), profile_exports));
    const fingerprint = extractFingerprint2(cwd);
    const profile = await readProfile2();
    accumulateSession2(
      profile,
      fingerprint.skillTags,
      fingerprint.employerContext,
      fingerprint.seniorityBand
    );
    await writeProfile2(profile);
    process.exit(0);
  } catch {
    process.exit(0);
  }
}
var isMain;
var init_jpi_learn = __esm({
  "bin/jpi-learn.js"() {
    "use strict";
    isMain = process.argv[1]?.endsWith("jpi-learn.js") || process.argv[1]?.endsWith("jpi-learn");
    if (isMain) {
      run4();
    }
  }
});

// bin/jpi-config.js
var jpi_config_exports = {};
__export(jpi_config_exports, {
  run: () => run5
});
import { readFileSync as readFileSync6, writeFileSync as writeFileSync4, mkdirSync as mkdirSync4, existsSync as existsSync4 } from "fs";
import { join as join6 } from "path";
import { homedir as homedir4 } from "os";
function readConfig() {
  try {
    if (!existsSync4(CONFIG_FILE)) return { ...DEFAULT_CONFIG };
    return { ...DEFAULT_CONFIG, ...JSON.parse(readFileSync6(CONFIG_FILE, "utf8")) };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}
function writeConfig(patch) {
  mkdirSync4(TERMINALHIRE_DIR4, { recursive: true });
  const merged = { ...readConfig(), ...patch };
  writeFileSync4(CONFIG_FILE, JSON.stringify(merged, null, 2) + "\n", "utf8");
}
function parseNudgeMode(raw) {
  if (raw === "session" || raw === "always") return raw;
  const m = /^every:(\d+)$/.exec(raw);
  if (m && parseInt(m[1], 10) >= 1) return raw;
  return null;
}
async function run5() {
  const args2 = process.argv.slice(2);
  const filtered = args2[0] === "config" ? args2.slice(1) : args2;
  if (filtered.includes("--show") || filtered.length === 0) {
    const cfg = readConfig();
    const envOverride = process.env["TERMINALHIRE_NUDGE"];
    console.log("");
    console.log("terminalhire config");
    console.log("");
    console.log(`  nudge: ${cfg.nudge}`);
    if (envOverride) {
      console.log(`  (overridden by TERMINALHIRE_NUDGE=${envOverride} at runtime)`);
    }
    console.log(`  config file: ${CONFIG_FILE}`);
    console.log("");
    console.log("  Valid nudge values:");
    console.log("    session   \u2014 print at most once per Claude Code session (default)");
    console.log("    always    \u2014 print every statusLine render when matches exist");
    console.log("    every:N   \u2014 print every Nth render (e.g. every:3)");
    console.log("");
    return;
  }
  const nudgeIdx = filtered.indexOf("--nudge");
  if (nudgeIdx !== -1) {
    const value = filtered[nudgeIdx + 1];
    if (!value) {
      console.error("Error: --nudge requires a value: session | always | every:N");
      process.exit(1);
    }
    const parsed = parseNudgeMode(value);
    if (!parsed) {
      console.error(`Error: invalid nudge value "${value}". Valid: session | always | every:N`);
      process.exit(1);
    }
    writeConfig({ nudge: parsed });
    console.log(`  nudge set to: ${parsed}`);
    console.log(`  (saved to ${CONFIG_FILE})`);
    return;
  }
  console.error("Usage: terminalhire config --nudge <session|always|every:N>");
  console.error("       terminalhire config --show");
  process.exit(1);
}
var TERMINALHIRE_DIR4, CONFIG_FILE, DEFAULT_CONFIG;
var init_jpi_config = __esm({
  "bin/jpi-config.js"() {
    "use strict";
    TERMINALHIRE_DIR4 = join6(homedir4(), ".terminalhire");
    CONFIG_FILE = join6(TERMINALHIRE_DIR4, "config.json");
    DEFAULT_CONFIG = { nudge: "session" };
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
  readFileSync as readFileSync7,
  writeFileSync as writeFileSync5,
  existsSync as existsSync5,
  mkdirSync as mkdirSync5,
  renameSync
} from "fs";
import { join as join7, dirname } from "path";
import { homedir as homedir5 } from "os";
function readJson(path, fallback) {
  try {
    return existsSync5(path) ? JSON.parse(readFileSync7(path, "utf8")) : fallback;
  } catch {
    return fallback;
  }
}
function atomicWriteJson(path, obj) {
  mkdirSync5(dirname(path), { recursive: true });
  const tmp = `${path}.tmp-${process.pid}`;
  writeFileSync5(tmp, JSON.stringify(obj, null, 2) + "\n", "utf8");
  renameSync(tmp, path);
}
function titleCase(s) {
  return String(s || "").replace(/\b\w/g, (c) => c.toUpperCase());
}
function readSpinnerConfig() {
  const cfg = readJson(CONFIG_FILE2, {});
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
  if (overlap.length >= 2) {
    const a = titleCase(overlap[0]);
    const b = titleCase(overlap[1]);
    return [`\u2726 Fits your ${a} + ${b} work`, `\u2726 A role matching what you're building`];
  }
  if (overlap.length === 1) {
    const a = titleCase(overlap[0]);
    return [`\u2726 A role matching your ${a} work`, `\u2726 Your ${a} work \u2014 link in the tip below`];
  }
  return [`\u2726 A role that fits your work`, `\u2726 Job match for you \u2014 link in the tip below`];
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
  for (const m of interleaveBySource(Array.isArray(topMatches) ? topMatches : [])) {
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
    out.push(`\u2197 ${title} @ ${company} \xB7 ${pct}% \u2014 ${url}`);
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
var TH_DIR, CLAUDE_SETTINGS, CONFIG_FILE2, SPINNER_STATE_FILE, SPINNER_DEFAULTS, VERB_INTROS;
var init_spinner = __esm({
  "bin/spinner.js"() {
    "use strict";
    TH_DIR = process.env["TERMINALHIRE_DIR"] || join7(homedir5(), ".terminalhire");
    CLAUDE_SETTINGS = process.env["TERMINALHIRE_CLAUDE_SETTINGS"] || join7(homedir5(), ".claude", "settings.json");
    CONFIG_FILE2 = join7(TH_DIR, "config.json");
    SPINNER_STATE_FILE = join7(TH_DIR, "spinner-state.json");
    SPINNER_DEFAULTS = { enabled: false, mode: "append", max: 6, frequency: "sometimes" };
    VERB_INTROS = ["Matched:", "You\u2019d fit:", "Worth a look:", "On your radar:", "Fits your stack:"];
  }
});

// bin/jpi-spinner.js
var jpi_spinner_exports = {};
__export(jpi_spinner_exports, {
  run: () => run6
});
import {
  readFileSync as readFileSync8,
  writeFileSync as writeFileSync6,
  copyFileSync,
  existsSync as existsSync6,
  mkdirSync as mkdirSync6
} from "fs";
import { join as join8 } from "path";
import { homedir as homedir6 } from "os";
import { createInterface as createInterface3 } from "readline";
function readConfig2() {
  try {
    return existsSync6(CONFIG_FILE3) ? JSON.parse(readFileSync8(CONFIG_FILE3, "utf8")) : {};
  } catch {
    return {};
  }
}
function writeConfig2(patch) {
  mkdirSync6(TH_DIR2, { recursive: true });
  const merged = { ...readConfig2(), ...patch };
  writeFileSync6(CONFIG_FILE3, JSON.stringify(merged, null, 2) + "\n", "utf8");
}
function backupSettings() {
  if (!existsSync6(SETTINGS_PATH)) return null;
  const ts = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
  const backupPath = `${SETTINGS_PATH}.terminalhire-backup-${ts}`;
  copyFileSync(SETTINGS_PATH, backupPath);
  return backupPath;
}
function ask(question) {
  const rl = createInterface3({ input: process.stdin, output: process.stdout });
  return new Promise((res) => {
    rl.question(question, (answer) => {
      rl.close();
      res(answer.trim().toLowerCase());
    });
  });
}
function readTopMatches() {
  try {
    const c = JSON.parse(readFileSync8(CACHE_FILE, "utf8"));
    return Array.isArray(c.topMatches) ? c.topMatches : [];
  } catch {
    return [];
  }
}
async function run6() {
  const args2 = process.argv.slice(2).filter((a) => a !== "spinner");
  const has = (f) => args2.includes(f);
  const val = (f) => {
    const i = args2.indexOf(f);
    return i >= 0 ? args2[i + 1] : void 0;
  };
  if (has("--show") || args2.length === 0) {
    const sc = readSpinnerConfig();
    console.log("");
    console.log("terminalhire spinner \u2014 job matches in the Claude Code spinner line");
    console.log("");
    console.log(`  enabled:   ${sc.enabled}`);
    console.log(`  mode:      ${sc.mode}   (replace = only job matches; append = mixed with Claude defaults)`);
    console.log(`  max:       ${sc.max}    (max job verbs that rotate)`);
    console.log(`  frequency: ${sc.frequency}   (always = up to max; sometimes = up to 2; rare = 1 per cycle)`);
    console.log("");
    console.log("  terminalhire spinner --on                      enable (asks consent, backs up settings.json)");
    console.log("  terminalhire spinner --off                     disable + restore your original spinner");
    console.log("  terminalhire spinner --mode append             mix job verbs with Claude's defaults");
    console.log("  terminalhire spinner --mode replace            show only job matches");
    console.log("  terminalhire spinner --max N                   cap how many job verbs rotate (1\u201312)");
    console.log("  terminalhire spinner --frequency always        surface up to max role verbs every cycle");
    console.log("  terminalhire spinner --frequency sometimes     surface up to 2 role verbs (default)");
    console.log("  terminalhire spinner --frequency rare          surface 1 role verb per cycle (quietest)");
    console.log("");
    return;
  }
  if (has("--off")) {
    const res = clearSpinnerVerbs();
    clearSpinnerTips();
    writeConfig2({ spinner: { ...readSpinnerConfig(), enabled: false } });
    console.log("");
    console.log("  Spinner job verbs removed.");
    if (res.keptUserVerbs > 0) {
      console.log(`  Preserved ${res.keptUserVerbs} spinner verb(s) you set yourself.`);
    } else {
      console.log("  Your original spinner is restored.");
    }
    console.log("  Re-enable any time: terminalhire spinner --on");
    console.log("");
    return;
  }
  if ((has("--mode") || has("--max") || has("--frequency")) && !has("--on")) {
    const cur = readSpinnerConfig();
    const next = { ...cur };
    const m = val("--mode");
    if (m) {
      if (m !== "append" && m !== "replace") {
        console.error('Error: --mode must be "append" or "replace".');
        process.exit(1);
      }
      next.mode = m;
    }
    const mx = val("--max");
    if (mx) {
      const n = parseInt(mx, 10);
      if (!(n >= 1 && n <= 12)) {
        console.error("Error: --max must be a number 1\u201312.");
        process.exit(1);
      }
      next.max = n;
    }
    const freq = val("--frequency");
    if (freq) {
      if (!["always", "sometimes", "rare"].includes(freq)) {
        console.error('Error: --frequency must be "always", "sometimes", or "rare".');
        process.exit(1);
      }
      next.frequency = freq;
    }
    writeConfig2({ spinner: next });
    console.log(`  spinner config updated: mode=${next.mode} max=${next.max} frequency=${next.frequency} enabled=${next.enabled}`);
    if (next.enabled) {
      const verbs = buildSpinnerPool(readTopMatches(), next.max, { frequency: next.frequency });
      if (verbs.length) applySpinnerVerbs(verbs, next.mode);
      else clearSpinnerVerbs();
    }
    return;
  }
  if (has("--on")) {
    const mode = val("--mode") === "replace" ? "replace" : "append";
    const maxRaw = parseInt(val("--max"), 10);
    const max = maxRaw >= 1 && maxRaw <= 12 ? maxRaw : 6;
    const freqRaw = val("--frequency");
    const frequency = ["always", "sometimes", "rare"].includes(freqRaw) ? freqRaw : "sometimes";
    console.log("");
    console.log("\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510");
    console.log("\u2502   terminalhire \u2014 enable the spinner job surface                  \u2502");
    console.log("\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518");
    console.log("");
    console.log("WHAT THIS CHANGES:");
    console.log('  \u2022 Adds a "spinnerVerbs" key to ~/.claude/settings.json \u2014 the official,');
    console.log("    documented Claude Code setting. No patching, no binary changes (Rule 7).");
    console.log("  \u2022 While Claude works, the spinner line shows your TOP LOCAL JOB MATCHES,");
    console.log("    e.g.  Senior Backend Engineer @ Stripe \xB7 82% \u2026");
    console.log("  \u2022 The tip line below shows a \u2318-clickable terminalhire.com/j/\u2026 link to open");
    console.log("    the listing (clicks logged anonymously, no profile data).");
    console.log(`  \u2022 mode=${mode}  (replace = only job matches; append = mixed with defaults)`);
    console.log(`  \u2022 frequency=${frequency}  (always = every cycle; sometimes = up to 2 verbs; rare = 1 verb)`);
    console.log("  \u2022 Matches are computed LOCALLY and refreshed in the background.");
    console.log("    ZERO egress \u2014 your profile never leaves the machine; only public job");
    console.log("    text appears on YOUR screen.");
    console.log("  \u2022 Any spinner verbs you already set are preserved, never clobbered.");
    console.log("");
    console.log("FULLY REVERSIBLE:");
    console.log("  terminalhire spinner --off    removes job verbs, restores your spinner");
    console.log("  (a timestamped backup of settings.json is taken now)");
    console.log("");
    const answer = await ask('Enable the spinner job surface? Type "yes" to continue: ');
    if (answer !== "yes") {
      console.log("\nAborted \u2014 nothing changed.");
      process.exit(0);
    }
    const backup = backupSettings();
    writeConfig2({ spinner: { enabled: true, mode, max, frequency } });
    const verbs = buildSpinnerPool(readTopMatches(), max, { frequency });
    if (verbs.length) applySpinnerVerbs(verbs, mode);
    console.log("");
    if (backup) console.log(`  Backed up settings to: ${backup}`);
    console.log(`  Enabled. ${verbs.length} job verb(s) live now; refreshes in the background.`);
    if (verbs.length === 0) {
      console.log("  (No matches cached yet \u2014 run `terminalhire refresh` or wait for the monitor.)");
    }
    console.log("  Claude Code picks up settings.json changes automatically.");
    console.log("  Turn off any time: terminalhire spinner --off");
    console.log("");
    return;
  }
  console.error("Usage: terminalhire spinner --on | --off | --show | --mode <append|replace> | --max N | --frequency <always|sometimes|rare>");
  process.exit(1);
}
var TH_DIR2, CONFIG_FILE3, SETTINGS_PATH, CACHE_FILE;
var init_jpi_spinner = __esm({
  "bin/jpi-spinner.js"() {
    "use strict";
    init_spinner();
    TH_DIR2 = process.env["TERMINALHIRE_DIR"] || join8(homedir6(), ".terminalhire");
    CONFIG_FILE3 = join8(TH_DIR2, "config.json");
    SETTINGS_PATH = process.env["TERMINALHIRE_CLAUDE_SETTINGS"] || join8(homedir6(), ".claude", "settings.json");
    CACHE_FILE = join8(TH_DIR2, "index-cache.json");
  }
});

// bin/jpi-sync.js
var jpi_sync_exports = {};
__export(jpi_sync_exports, {
  run: () => run7
});
import { readFileSync as readFileSync9, writeFileSync as writeFileSync7, mkdirSync as mkdirSync7, existsSync as existsSync7, rmSync as rmSync2 } from "fs";
import { join as join9 } from "path";
import { homedir as homedir7, hostname as osHostname } from "os";
import { createInterface as createInterface4 } from "readline";
import { spawn } from "child_process";
function ask2(question) {
  const rl = createInterface4({ input: process.stdin, output: process.stdout });
  return new Promise((res) => {
    rl.question(question, (answer) => {
      rl.close();
      res(answer.trim().toLowerCase());
    });
  });
}
function readMarker() {
  try {
    return existsSync7(TIER1_MARKER) ? JSON.parse(readFileSync9(TIER1_MARKER, "utf8")) : null;
  } catch {
    return null;
  }
}
function writeMarker(marker) {
  mkdirSync7(TH_DIR3, { recursive: true });
  writeFileSync7(TIER1_MARKER, JSON.stringify(marker, null, 2) + "\n", "utf8");
}
function clearMarker() {
  try {
    rmSync2(TIER1_MARKER);
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
function openInBrowser(url) {
  let cmd;
  let args2;
  if (process.platform === "darwin") {
    cmd = "open";
    args2 = [url];
  } else if (process.platform === "win32") {
    cmd = "cmd";
    args2 = ["/c", "start", "", url];
  } else {
    cmd = "xdg-open";
    args2 = [url];
  }
  try {
    const child = spawn(cmd, args2, { stdio: "ignore", detached: true });
    child.on("error", () => {
    });
    child.unref();
  } catch {
  }
}
function sleep2(ms) {
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
  await new Promise((resolve2) => {
    const rl = createInterface4({ input: process.stdin, output: process.stdout });
    rl.question(
      "  Press Enter to open your browser to authorize + consent (or Ctrl-C to cancel)... ",
      () => {
        rl.close();
        resolve2();
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
    await sleep2(POLL_INTERVAL_MS);
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
  const answer = await ask2('  Delete your synced profile? Type "yes" to confirm: ');
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
    res = await fetch(`${API_URL2}/api/profile-sync`, {
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
async function run7() {
  const args2 = process.argv.slice(2).filter((a) => a !== "sync");
  const has = (f) => args2.includes(f);
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
var TH_DIR3, TIER1_MARKER, API_URL2, SYNC_BASE, POLL_INTERVAL_MS, POLL_TIMEOUT_MS, CONSENT_VERSION;
var init_jpi_sync = __esm({
  "bin/jpi-sync.js"() {
    "use strict";
    TH_DIR3 = process.env["TERMINALHIRE_DIR"] || join9(homedir7(), ".terminalhire");
    TIER1_MARKER = join9(TH_DIR3, "tier1.json");
    API_URL2 = process.env["TERMINALHIRE_API_URL"] || process.env["JPI_API_URL"] || "https://terminalhire.com";
    SYNC_BASE = "https://www.terminalhire.com";
    POLL_INTERVAL_MS = 2e3;
    POLL_TIMEOUT_MS = 10 * 60 * 1e3;
    CONSENT_VERSION = 1;
  }
});

// bin/jpi-init.js
var jpi_init_exports = {};
__export(jpi_init_exports, {
  run: () => run8
});
import { existsSync as existsSync8 } from "fs";
import { join as join10, resolve } from "path";
import { fileURLToPath as fileURLToPath3 } from "url";
import { createInterface as createInterface5 } from "readline";
import { spawnSync, spawn as spawn2 } from "child_process";
import { homedir as homedir8 } from "os";
function ask3(question) {
  const rl = createInterface5({ input: process.stdin, output: process.stdout });
  return new Promise((resolve2) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve2(answer.trim().toLowerCase());
    });
  });
}
function resolveScript(name) {
  const distPath = resolve(join10(__dirname2, "..", "..", "dist", "bin", `${name}.js`));
  const legacyPath = resolve(join10(__dirname2, `${name}.js`));
  return existsSync8(distPath) ? distPath : legacyPath;
}
function resolveInstallJs() {
  const fromDist = resolve(join10(__dirname2, "..", "..", "install.js"));
  const fromBin = resolve(join10(__dirname2, "..", "install.js"));
  if (existsSync8(fromDist)) return fromDist;
  if (existsSync8(fromBin)) return fromBin;
  return fromBin;
}
async function run8() {
  console.log("");
  console.log("\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510");
  console.log("\u2502           terminalhire init \u2014 one-command onboarding            \u2502");
  console.log("\u2502       Local-first job matching for developers in Claude Code     \u2502");
  console.log("\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518");
  console.log("");
  console.log("This will:");
  console.log("  1. Optionally sign you in with GitHub (public profile only, read:user)");
  console.log("  2. Seed your local job cache (anonymous index download)");
  console.log("  3. Enable the ambient spinner job surface in ~/.claude/settings.json");
  console.log("     (with backup + your explicit consent before any file is touched)");
  console.log("");
  console.log('You can stop at any step. Nothing is changed until you say "yes".');
  console.log("");
  console.log("Step 1/3 \u2014 GitHub sign-in (optional but recommended)");
  console.log("");
  console.log("  Scope: read:user \u2014 public profile + public repos only.");
  console.log("  Your token is encrypted at ~/.terminalhire/github-token.enc.");
  console.log("  GitHub data enriches your local profile. Nothing leaves your machine");
  console.log("  until you explicitly consent to a specific lead.");
  console.log("");
  const githubAnswer = await ask3("Sign in with GitHub now? [Y/n] (Enter = yes, n = stay local): ");
  const doGitHub = githubAnswer === "" || githubAnswer === "y" || githubAnswer === "yes";
  if (doGitHub) {
    console.log("");
    console.log("  Starting GitHub device flow...");
    const loginScript = resolveScript("jpi-login");
    const child = spawnSync(process.execPath, [loginScript, "login"], {
      stdio: ["inherit", "inherit", "inherit"],
      env: process.env
    });
    if (child.status !== 0) {
      console.log("");
      console.log("  GitHub sign-in did not complete. Continuing without GitHub.");
      console.log("  You can sign in any time with: terminalhire login");
    }
  } else {
    console.log("");
    console.log("  Staying local-only. Tags accumulate from your personal project sessions.");
    console.log("  Sign in any time with: terminalhire login");
  }
  console.log("");
  console.log("Step 2/3 \u2014 Seeding local job cache");
  console.log("");
  console.log("  Fetching anonymous job index (no dev data sent)...");
  const jobsScript = resolveScript("jpi-jobs");
  const seedChild = spawnSync(
    process.execPath,
    [jobsScript, "--limit", "0"],
    {
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, TERMINALHIRE_SEED_ONLY: "1" },
      timeout: 15e3
    }
  );
  if (seedChild.status === 0) {
    console.log("  Job cache seeded successfully.");
  } else {
    console.log("  Could not seed job cache right now (no profile tags yet, or offline).");
    console.log("  Run `terminalhire jobs` after a few Claude Code sessions to populate it.");
  }
  console.log("");
  console.log("Step 3/3 \u2014 Enable the ambient spinner job surface in ~/.claude/settings.json");
  console.log("");
  console.log("  This is the only step that modifies a system file.");
  console.log("  A timestamped backup is created before any change.");
  console.log("  Disable at any time: node install.js --uninstall  (or terminalhire spinner --off)");
  console.log("");
  const installJs = resolveInstallJs();
  const installChild = spawnSync(process.execPath, [installJs], {
    stdio: ["inherit", "inherit", "inherit"],
    env: process.env
  });
  if (installChild.status !== 0) {
    console.log("");
    console.log("  Hook installation did not complete. Run manually: node install.js");
  }
  console.log("");
  console.log("\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510");
  console.log("\u2502  terminalhire init complete!                                    \u2502");
  console.log("\u2502                                                                  \u2502");
  console.log("\u2502  Restart Claude Code to see the ambient spinner job surface.    \u2502");
  console.log("\u2502                                                                  \u2502");
  console.log("\u2502  Quick reference:                                               \u2502");
  console.log("\u2502    terminalhire jobs          \u2014 browse matching roles           \u2502");
  console.log("\u2502    terminalhire spinner --off \u2014 disable the spinner surface     \u2502");
  console.log("\u2502    terminalhire login         \u2014 sign in with GitHub             \u2502");
  console.log("\u2502    terminalhire profile --show \u2014 inspect your local profile     \u2502");
  console.log("\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518");
  console.log("");
}
var __dirname2;
var init_jpi_init = __esm({
  "bin/jpi-init.js"() {
    "use strict";
    __dirname2 = fileURLToPath3(new URL(".", import.meta.url));
  }
});

// bin/jpi-refresh.js
var jpi_refresh_exports = {};
__export(jpi_refresh_exports, {
  run: () => run9
});
import { readFileSync as readFileSync10, writeFileSync as writeFileSync8, existsSync as existsSync9, mkdirSync as mkdirSync8 } from "fs";
import { join as join11 } from "path";
import { homedir as homedir9 } from "os";
import { fileURLToPath as fileURLToPath4 } from "url";
async function run9() {
  try {
    let index;
    try {
      const res = await fetch(`${API_URL3}/api/index`, {
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
        topMatches = results.slice(0, 25).map((r) => ({
          id: r.job.id,
          title: r.job.title,
          company: r.job.company,
          score: r.score,
          remote: r.job.remote,
          matchedTags: r.matchedTags
        }));
      }
    } catch {
    }
    mkdirSync8(TERMINALHIRE_DIR5, { recursive: true });
    const cacheEntry = {
      ts: Date.now(),
      index,
      matchCount,
      topMatches
    };
    writeFileSync8(INDEX_CACHE_FILE2, JSON.stringify(cacheEntry), "utf8");
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
        const tips = buildTips2(ranked, API_URL3, 8);
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
var __dirname3, TERMINALHIRE_DIR5, INDEX_CACHE_FILE2, API_URL3;
var init_jpi_refresh = __esm({
  "bin/jpi-refresh.js"() {
    "use strict";
    __dirname3 = fileURLToPath4(new URL(".", import.meta.url));
    TERMINALHIRE_DIR5 = join11(homedir9(), ".terminalhire");
    INDEX_CACHE_FILE2 = join11(TERMINALHIRE_DIR5, "index-cache.json");
    API_URL3 = process.env["TERMINALHIRE_API_URL"] ?? process.env["JPI_API_URL"] ?? "https://terminalhire.com";
  }
});

// bin/jpi-save.js
var jpi_save_exports = {};
__export(jpi_save_exports, {
  run: () => run10
});
import { readFileSync as readFileSync11, existsSync as existsSync10 } from "fs";
import { join as join12 } from "path";
import { homedir as homedir10 } from "os";
import { fileURLToPath as fileURLToPath5 } from "url";
function findJobInCache(jobId) {
  try {
    if (!existsSync10(INDEX_CACHE_FILE3)) return null;
    const raw = readFileSync11(INDEX_CACHE_FILE3, "utf8");
    const entry = JSON.parse(raw);
    const jobs = entry?.index?.jobs ?? [];
    return jobs.find((j) => j.id === jobId) ?? null;
  } catch {
    return null;
  }
}
async function cmdSave(jobId) {
  if (!jobId) {
    console.error("Usage: terminalhire save <jobId>");
    console.error("  jobId is shown in `terminalhire jobs` output (e.g. greenhouse:abc123)");
    process.exit(1);
  }
  const { addSavedJob: addSavedJob2 } = await Promise.resolve().then(() => (init_profile(), profile_exports));
  const job = findJobInCache(jobId);
  if (!job) {
    console.error(`terminalhire save: job '${jobId}' not found in local index cache.`);
    console.error("  Run `terminalhire jobs` first to populate the cache.");
    process.exit(1);
  }
  await addSavedJob2({
    id: job.id,
    title: job.title,
    company: job.company,
    url: job.url,
    source: job.source,
    savedAt: (/* @__PURE__ */ new Date()).toISOString()
    // overwritten by addSavedJob, but required by type
  });
  console.log(`Saved: ${job.title} \u2014 ${job.company}`);
  console.log(`  id: ${job.id}`);
  console.log(`  url: ${job.url}`);
  console.log("  Stored locally in encrypted profile. Run `terminalhire saved` to list.");
}
async function cmdSaved() {
  const { listSavedJobs: listSavedJobs2 } = await Promise.resolve().then(() => (init_profile(), profile_exports));
  const jobs = await listSavedJobs2();
  if (jobs.length === 0) {
    console.log("No saved jobs. Use `terminalhire save <jobId>` to save a role.");
    return;
  }
  console.log(`
${jobs.length} saved job${jobs.length === 1 ? "" : "s"}:
`);
  for (const j of jobs) {
    const date = new Date(j.savedAt).toLocaleDateString();
    console.log(`  ${j.id}`);
    console.log(`    ${j.title} \u2014 ${j.company}`);
    console.log(`    ${j.url}`);
    console.log(`    Saved: ${date}`);
    console.log("");
  }
  console.log("To remove: terminalhire unsave <jobId>");
}
async function cmdUnsave(jobId) {
  if (!jobId) {
    console.error("Usage: terminalhire unsave <jobId>");
    process.exit(1);
  }
  const { removeSavedJob: removeSavedJob2 } = await Promise.resolve().then(() => (init_profile(), profile_exports));
  const removed = await removeSavedJob2(jobId);
  if (removed) {
    console.log(`Removed saved job: ${jobId}`);
  } else {
    console.error(`terminalhire unsave: job '${jobId}' was not in your saved list.`);
    process.exit(1);
  }
}
async function run10() {
  const verb = process.argv[2];
  const jobId = process.argv[3];
  try {
    if (verb === "save") {
      await cmdSave(jobId);
    } else if (verb === "saved") {
      await cmdSaved();
    } else if (verb === "unsave") {
      await cmdUnsave(jobId);
    } else {
      console.error(`terminalhire: unknown save verb '${verb}'. Expected: save | saved | unsave`);
      process.exit(1);
    }
  } catch (err) {
    console.error("terminalhire save error:", err.message ?? err);
    process.exit(1);
  }
}
var __dirname4, TERMINALHIRE_DIR6, INDEX_CACHE_FILE3;
var init_jpi_save = __esm({
  "bin/jpi-save.js"() {
    "use strict";
    __dirname4 = fileURLToPath5(new URL(".", import.meta.url));
    TERMINALHIRE_DIR6 = join12(homedir10(), ".terminalhire");
    INDEX_CACHE_FILE3 = join12(TERMINALHIRE_DIR6, "index-cache.json");
  }
});

// bin/jpi-dispatch.js
import { fileURLToPath as fileURLToPath6 } from "url";
import { join as join13, dirname as dirname2 } from "path";
import { existsSync as existsSync11, readFileSync as readFileSync12 } from "fs";
import { createRequire } from "module";
var __dirname5 = fileURLToPath6(new URL(".", import.meta.url));
function readPackageVersion() {
  try {
    const candidates = [
      join13(__dirname5, "..", "..", "package.json"),
      join13(__dirname5, "..", "package.json")
    ];
    for (const p of candidates) {
      if (existsSync11(p)) {
        const pkg = JSON.parse(readFileSync12(p, "utf8"));
        if (pkg.version) return pkg.version;
      }
    }
  } catch {
  }
  return "0.1.1";
}
var firstArg = process.argv[2];
if (!firstArg && !process.stdin.isTTY) {
  const { default: childProcess } = await import("child_process");
  const nudgeScript = join13(__dirname5, "jpi.js");
  const child = childProcess.spawnSync(process.execPath, [nudgeScript], {
    stdio: ["inherit", "inherit", "inherit"]
  });
  process.exit(child.status ?? 0);
}
if (!firstArg || firstArg === "help" || firstArg === "--help" || firstArg === "-h") {
  console.log("");
  console.log(`terminalhire v${readPackageVersion()} \u2014 local-first job matching for developers`);
  console.log("");
  console.log("Commands:");
  console.log("  terminalhire init                           One-command onboarding (start here)");
  console.log("  terminalhire login                          Sign in with GitHub (enriches profile instantly)");
  console.log("  terminalhire logout                         Clear stored GitHub token");
  console.log("  terminalhire jobs                           Fetch job index, match locally, browse roles");
  console.log("  terminalhire jobs --limit N                 Show top N results (default: 10)");
  console.log("  terminalhire jobs --remote-only             Filter to remote roles only");
  console.log("  terminalhire profile --show                 Display your encrypted local profile");
  console.log("  terminalhire profile --edit                 Set displayName, contactEmail, prefs");
  console.log("  terminalhire profile --delete               Wipe profile and encryption key from disk");
  console.log("  terminalhire config --nudge session         Nudge at most once per session (default)");
  console.log("  terminalhire config --nudge always          Nudge every statusLine render");
  console.log("  terminalhire config --nudge every:N         Nudge every Nth render");
  console.log("  terminalhire config --show                  Print current config");
  console.log("  terminalhire spinner --show                 Job matches in the spinner line while Claude works");
  console.log("  terminalhire spinner --off                  Turn the spinner job surface off (restores your spinner)");
  console.log("  terminalhire spinner --mode append|replace  Mix with Claude defaults, or show only matches");
  console.log("  terminalhire refresh                        Fetch index + match locally, update cache (non-interactive)");
  console.log("  terminalhire save <jobId>                   Save a job locally (id shown in `jobs` output)");
  console.log("  terminalhire saved                          List all locally-saved jobs");
  console.log("  terminalhire unsave <jobId>                 Remove a saved job");
  console.log("  terminalhire sync --push                    Opt-in: send your profile to staqs (typed-yes consent)");
  console.log("  terminalhire sync --status                  Show whether you have consented (local read only)");
  console.log("  terminalhire sync --delete                  Hard-delete your synced profile (revocation)");
  console.log("");
  console.log("Install / uninstall the Claude Code statusLine nudge:");
  console.log("  terminalhire init               (preferred \u2014 full guided onboarding)");
  console.log("  node install.js                 (manual install)");
  console.log("  node install.js --uninstall     (manual uninstall)");
  console.log("");
  console.log("Privacy: your profile never leaves your device.");
  console.log("  GET /api/index   \u2014 anonymous index download (no dev data)");
  console.log("  POST /api/lead   \u2014 only after explicit per-role named-entity consent");
  console.log("  POST /api/profile-sync \u2014 only via `terminalhire sync --push` with a typed-yes consent token");
  console.log("  GitHub token     \u2014 encrypted at ~/.terminalhire/github-token.enc, scope: read:user");
  console.log("");
  process.exit(0);
}
if (firstArg === "--version" || firstArg === "-v") {
  console.log(`terminalhire v${readPackageVersion()}`);
  process.exit(0);
}
if (firstArg === "login" || firstArg === "logout") {
  const mod = await Promise.resolve().then(() => (init_jpi_login(), jpi_login_exports));
  await mod.run();
  process.exit(0);
}
if (firstArg === "jobs") {
  process.argv.splice(2, 1);
  const mod = await Promise.resolve().then(() => (init_jpi_jobs(), jpi_jobs_exports));
  await mod.run();
  process.exit(0);
}
if (firstArg === "profile") {
  const mod = await Promise.resolve().then(() => (init_jpi_profile(), jpi_profile_exports));
  await mod.run();
  process.exit(0);
}
if (firstArg === "learn") {
  const mod = await Promise.resolve().then(() => (init_jpi_learn(), jpi_learn_exports));
  await mod.run();
  process.exit(0);
}
if (firstArg === "config") {
  const mod = await Promise.resolve().then(() => (init_jpi_config(), jpi_config_exports));
  await mod.run();
  process.exit(0);
}
if (firstArg === "spinner") {
  const mod = await Promise.resolve().then(() => (init_jpi_spinner(), jpi_spinner_exports));
  await mod.run();
  process.exit(0);
}
if (firstArg === "sync") {
  const mod = await Promise.resolve().then(() => (init_jpi_sync(), jpi_sync_exports));
  await mod.run();
  process.exit(0);
}
if (firstArg === "init") {
  const mod = await Promise.resolve().then(() => (init_jpi_init(), jpi_init_exports));
  await mod.run();
  process.exit(0);
}
if (firstArg === "refresh") {
  const mod = await Promise.resolve().then(() => (init_jpi_refresh(), jpi_refresh_exports));
  await mod.run();
  process.exit(0);
}
if (firstArg === "save" || firstArg === "saved" || firstArg === "unsave") {
  const mod = await Promise.resolve().then(() => (init_jpi_save(), jpi_save_exports));
  await mod.run();
  process.exit(0);
}
console.error(`terminalhire: unknown command '${firstArg}'. Run 'terminalhire help' for usage.`);
process.exit(1);
