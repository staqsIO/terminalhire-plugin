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

// src/open-url.js
import { spawn } from "child_process";
function openInBrowser(url) {
  let cmd;
  let args3;
  if (process.platform === "darwin") {
    cmd = "open";
    args3 = [url];
  } else if (process.platform === "win32") {
    cmd = "cmd";
    args3 = ["/c", "start", "", url];
  } else {
    cmd = "xdg-open";
    args3 = [url];
  }
  try {
    const child = spawn(cmd, args3, { stdio: "ignore", detached: true });
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
  async function run13() {
    for (; ; ) {
      const i = next++;
      if (i >= items.length) return;
      results[i] = await fn(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: workers }, run13));
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
  const { fetchGitHubProfile: fetchGitHubProfile2, githubToFingerprint: githubToFingerprint2, computeAcceptanceCredential: computeAcceptanceCredential2 } = await Promise.resolve().then(() => (init_src(), src_exports));
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
    if (process.env["TERMINALHIRE_GITHUB_MOCK"] === "1" || process.env["JPI_GITHUB_MOCK"] === "1") {
      const { createRequire: createRequire2 } = await import("module");
      const { fileURLToPath: fileURLToPath7 } = await import("url");
      const { join: join17, dirname: dirname3 } = await import("path");
      const __dirname6 = fileURLToPath7(new URL(".", import.meta.url));
      const fixturePath = join17(__dirname6, "../../fixtures/github-sample.json");
      const { readFileSync: readFileSync16 } = await import("fs");
      ghProfile = JSON.parse(readFileSync16(fixturePath, "utf8"));
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
    const isMock = process.env["TERMINALHIRE_GITHUB_MOCK"] === "1" || process.env["JPI_GITHUB_MOCK"] === "1";
    if (!isMock) {
      try {
        console.log("  Computing proof-of-work acceptance credential...");
        profile.acceptance = await computeAcceptanceCredential2(ghProfile.login, token);
      } catch (err) {
        if (process.env["DEBUG"]) console.warn("  [acceptance] credential compute failed:", err);
      }
    }
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
    if (profile.acceptance?.status === "ok" && profile.acceptance.qualifyingTotal > 0) {
      console.log(`    Proof-of-work: ${profile.acceptance.qualifyingTotal} merged PR${profile.acceptance.qualifyingTotal === 1 ? "" : "s"} into external repos`);
    }
    console.log("");
    console.log("  Profile updated at ~/.terminalhire/profile.enc (encrypted at rest)");
    console.log("  GitHub data stays on your machine unless you consent to share it in a lead.");
    console.log("");
    const skipWeb = process.argv.includes("--no-web");
    if (!isMock && !skipWeb) {
      try {
        const OAUTH_BASE = "https://www.terminalhire.com";
        const webUrl = `${OAUTH_BASE}/api/auth/github?next=/dashboard`;
        console.log("  \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500");
        console.log("  Your web profile & r\xE9sum\xE9 \u2014 public GitHub data only,");
        console.log("  your local profile is NOT uploaded.");
        console.log(`  \u2192 ${webUrl}`);
        if (process.stdout.isTTY) {
          console.log("  Opening it now to sign you in at terminalhire.com\u2026");
          openInBrowser(webUrl);
        } else {
          console.log("  Open the link above to sign in & view your r\xE9sum\xE9.");
        }
        console.log("  (skip next time with: terminalhire login --no-web)");
        console.log("");
      } catch {
      }
    }
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
  let changed = false;
  if (profile.github) {
    delete profile.github;
    changed = true;
  }
  if (profile.acceptance) {
    delete profile.acceptance;
    changed = true;
  }
  if (changed) {
    await writeProfile2(profile);
    console.log("\n  GitHub identity + proof-of-work credential cleared from local profile.");
  }
  console.log("  GitHub token deleted from ~/.terminalhire/github-token.enc");
  console.log("  Skill tags accumulated from GitHub remain in your profile.");
  console.log("  To also delete those: terminalhire profile --delete\n");
}
var init_jpi_login = __esm({
  "bin/jpi-login.js"() {
    "use strict";
    init_open_url();
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
  const { job, score, matchedTags, reason, acceptance } = result;
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
  if (acceptance && acceptance.status === "ok" && acceptance.count > 0) {
    console.log(`   \u2713 proof-of-work: ${acceptance.count} merged PR${acceptance.count === 1 ? "" : "s"} into external ${acceptance.domain} repos`);
  }
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
    const allListings = index.jobs ?? [];
    const jobs = allListings.filter((j) => j.source !== "bounty");
    const bountyCount = allListings.length - jobs.length;
    if (jobs.length === 0) {
      console.log("No jobs in index. Try again later.");
      return;
    }
    const fp = profileToFingerprint2(profile);
    if (REMOTE_ONLY) fp.prefs = { ...fp.prefs, remoteOnly: true };
    const results = match2(fp, jobs, SHOW_ALL ? jobs.length : LIMIT, Date.now(), {
      acceptance: profile.acceptance
    });
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
    if (bountyCount > 0) {
      console.log(
        `
\u26A1 ${bountyCount} bount${bountyCount === 1 ? "y" : "ies"} you could knock out today \u2014 run: terminalhire bounties`
      );
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

// bin/jpi-bounties.js
var jpi_bounties_exports = {};
__export(jpi_bounties_exports, {
  run: () => run3
});
import { readFileSync as readFileSync5, writeFileSync as writeFileSync4, mkdirSync as mkdirSync4 } from "fs";
import { join as join5 } from "path";
import { homedir as homedir4 } from "os";
import { createInterface as createInterface2 } from "readline";
function readIndexCache2() {
  try {
    const entry = JSON.parse(readFileSync5(INDEX_CACHE_FILE2, "utf8"));
    if (Date.now() - entry.ts < INDEX_TTL_MS2) return entry.index;
    return null;
  } catch {
    return null;
  }
}
function writeIndexCache2(index) {
  mkdirSync4(TERMINALHIRE_DIR4, { recursive: true });
  writeFileSync4(INDEX_CACHE_FILE2, JSON.stringify({ ts: Date.now(), index }), "utf8");
}
async function fetchIndex2() {
  const cached = readIndexCache2();
  if (cached) return cached;
  const res = await fetch(`${API_URL2}/api/index`, { signal: AbortSignal.timeout(1e4) });
  if (!res.ok) throw new Error(`/api/index returned ${res.status}`);
  const index = await res.json();
  writeIndexCache2(index);
  return index;
}
function prompt2(question) {
  const rl = createInterface2({ input: process.stdin, output: process.stdout });
  return new Promise((resolve2) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve2(answer.trim().toLowerCase());
    });
  });
}
function formatAmount(b) {
  return b.amountUSD != null ? "$" + b.amountUSD.toLocaleString() : "$\u2014";
}
function linkTitle2(title, url) {
  const isTTY = process.stdout.isTTY;
  const noColor = process.env["NO_COLOR"] !== void 0;
  if (isTTY && !noColor && url) return `\x1B]8;;${url}\x1B\\${title}\x1B]8;;\x1B\\`;
  return url ? `${title} (${url})` : title;
}
function printBounty(i, job, score, reason, matchedTags) {
  const b = job.bounty ?? {};
  const stars = b.repoStars != null ? ` \xB7 ${b.repoStars}\u2605` : "";
  const effort = b.estimatedEffort ? ` \xB7 ${EFFORT_LABEL[b.estimatedEffort]}` : "";
  const scoreStr = score > 0 ? ` \xB7 match ${Math.round(score * 100)}%` : "";
  const prs = b.competingOpenPRs;
  const contend = prs != null && prs > 0 ? ` \xB7 \u26A0 ${prs} PR${prs === 1 ? "" : "s"} in flight` : "";
  console.log(`
${i + 1}. ${linkTitle2(job.title, job.url)}`);
  console.log(`   ${formatAmount(b)}${effort} \xB7 ${b.repoFullName ?? job.company}${stars}${scoreStr}${contend}`);
  if (reason) console.log(`   ${reason}`);
  if (matchedTags && matchedTags.length) console.log(`   Tags matched: ${matchedTags.slice(0, 5).join(", ")}`);
  console.log(`   id: ${job.id}`);
  console.log(`   Claim: ${b.claimUrl ?? job.url}`);
}
async function run3() {
  try {
    console.log(`Fetching bounty index from ${API_URL2}/api/index...`);
    const index = await fetchIndex2();
    let bounties = (index.jobs ?? []).filter((j) => j.source === "bounty");
    if (PRICED_ONLY) bounties = bounties.filter((j) => j.bounty?.amountUSD != null);
    if (WINNABLE_ONLY) bounties = bounties.filter((j) => (j.bounty?.competingOpenPRs ?? 0) === 0);
    if (bounties.length === 0) {
      console.log("\nNo bounties available right now. Try again later \u2014 supply refreshes through the day.");
      return;
    }
    const ranked = /* @__PURE__ */ new Map();
    try {
      const { readProfile: readProfile2, profileToFingerprint: profileToFingerprint2 } = await Promise.resolve().then(() => (init_profile(), profile_exports));
      const { match: match2 } = await Promise.resolve().then(() => (init_src(), src_exports));
      const profile = await readProfile2();
      if (profile.skillTags.length > 0) {
        const fp = profileToFingerprint2(profile);
        for (const r of match2(fp, bounties, bounties.length)) {
          ranked.set(r.job.id, { score: r.score, reason: r.reason, matchedTags: r.matchedTags });
        }
      }
    } catch {
    }
    const score = (j) => ranked.get(j.id)?.score ?? 0;
    const amt = (j) => j.bounty?.amountUSD ?? -1;
    const contested = (j) => (j.bounty?.competingOpenPRs ?? 0) > 0 ? 1 : 0;
    bounties.sort((a, b) => contested(a) - contested(b) || score(b) - score(a) || amt(b) - amt(a));
    const shown = SHOW_ALL2 ? bounties : bounties.slice(0, LIMIT2);
    const matchedCount = bounties.filter((j) => score(j) > 0).length;
    console.log(
      `
\u26A1 ${bounties.length} bount${bounties.length === 1 ? "y" : "ies"} you could knock out` + (matchedCount ? ` \u2014 ${matchedCount} matched to your profile` : "") + ` (local rank \u2014 no data sent)
`
    );
    for (let i = 0; i < shown.length; i++) {
      const r = ranked.get(shown[i].id);
      printBounty(i, shown[i], r?.score ?? 0, r?.reason, r?.matchedTags);
    }
    if (!SHOW_ALL2 && bounties.length > shown.length) {
      console.log(`
\u2026and ${bounties.length - shown.length} more \u2014 run with --all to see every bounty.`);
    }
    if (!process.stdin.isTTY) return;
    console.log("\n" + "\u2500".repeat(70));
    const pick = await prompt2(`
Enter a number to open a bounty's claim page, or press Enter to exit: `);
    const idx = parseInt(pick, 10) - 1;
    if (Number.isNaN(idx) || idx < 0 || idx >= shown.length) return;
    const chosen = shown[idx];
    console.log(
      `
Open this to claim/work the bounty (you go straight to the source \u2014 we never touch payment):
  ${chosen.bounty?.claimUrl ?? chosen.url}`
    );
  } catch (err) {
    console.error("terminalhire bounties error:", err.message ?? err);
    process.exit(1);
  }
}
var TERMINALHIRE_DIR4, INDEX_CACHE_FILE2, INDEX_TTL_MS2, API_URL2, DEFAULT_LIMIT2, args2, limitArg2, LIMIT2, PRICED_ONLY, SHOW_ALL2, WINNABLE_ONLY, EFFORT_LABEL;
var init_jpi_bounties = __esm({
  "bin/jpi-bounties.js"() {
    "use strict";
    TERMINALHIRE_DIR4 = join5(homedir4(), ".terminalhire");
    INDEX_CACHE_FILE2 = join5(TERMINALHIRE_DIR4, "index-cache.json");
    INDEX_TTL_MS2 = 15 * 60 * 1e3;
    API_URL2 = process.env["TERMINALHIRE_API_URL"] ?? process.env["JPI_API_URL"] ?? "https://terminalhire.com";
    DEFAULT_LIMIT2 = 15;
    args2 = process.argv.slice(2);
    limitArg2 = args2.indexOf("--limit");
    LIMIT2 = limitArg2 !== -1 ? parseInt(args2[limitArg2 + 1] ?? "15", 10) : DEFAULT_LIMIT2;
    PRICED_ONLY = args2.includes("--priced");
    SHOW_ALL2 = args2.includes("--all");
    WINNABLE_ONLY = args2.includes("--winnable");
    EFFORT_LABEL = { small: "small (~\xBD day)", medium: "medium (~1 day)", large: "large (multi-day)" };
  }
});

// src/claims.ts
var claims_exports = {};
__export(claims_exports, {
  acceptedPRRate: () => acceptedPRRate,
  findClaim: () => findClaim,
  listClaims: () => listClaims,
  readClaims: () => readClaims,
  recordClaim: () => recordClaim,
  removeClaim: () => removeClaim,
  updateClaim: () => updateClaim
});
import { readFileSync as readFileSync6, writeFileSync as writeFileSync5, mkdirSync as mkdirSync5, renameSync, existsSync as existsSync4 } from "fs";
import { join as join6 } from "path";
import { homedir as homedir5 } from "os";
function nowISO() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function readClaims() {
  try {
    if (!existsSync4(CLAIMS_FILE)) return [];
    const data = JSON.parse(readFileSync6(CLAIMS_FILE, "utf8"));
    return Array.isArray(data?.claims) ? data.claims : [];
  } catch {
    return [];
  }
}
function writeClaims(claims) {
  mkdirSync5(TERMINALHIRE_DIR5, { recursive: true });
  const tmp = `${CLAIMS_FILE}.tmp`;
  const payload = { claims };
  writeFileSync5(tmp, JSON.stringify(payload, null, 2), "utf8");
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
var TERMINALHIRE_DIR5, CLAIMS_FILE, TERMINAL_STATES;
var init_claims = __esm({
  "src/claims.ts"() {
    "use strict";
    TERMINALHIRE_DIR5 = join6(homedir5(), ".terminalhire");
    CLAIMS_FILE = join6(TERMINALHIRE_DIR5, "claims.json");
    TERMINAL_STATES = /* @__PURE__ */ new Set(["merged", "abandoned"]);
  }
});

// bin/jpi-claim.js
var jpi_claim_exports = {};
__export(jpi_claim_exports, {
  run: () => run4
});
import { readFileSync as readFileSync7, existsSync as existsSync5 } from "fs";
import { join as join7 } from "path";
import { homedir as homedir6 } from "os";
function findBountyInCache(bountyId) {
  try {
    if (!existsSync5(INDEX_CACHE_FILE3)) return null;
    const entry = JSON.parse(readFileSync7(INDEX_CACHE_FILE3, "utf8"));
    const jobs = entry?.index?.jobs ?? [];
    const job = jobs.find((j) => j.id === bountyId && j.source === "bounty");
    return job ?? null;
  } catch {
    return null;
  }
}
function parseGitHubUrl(url) {
  const m = String(url ?? "").match(/github\.com\/([^/]+)\/([^/]+)\/(?:issues|pull)\/(\d+)/);
  if (!m) return null;
  return { owner: m[1], repo: m[2], number: parseInt(m[3], 10), repoFullName: `${m[1]}/${m[2]}` };
}
async function countOpenPRsReferencingIssue(repoFullName, issueNumber) {
  try {
    const res = await fetch(`${GH_API}/repos/${repoFullName}/pulls?state=open&per_page=100`, {
      headers: GH_HEADERS,
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
    const res = await fetch(`${GH_API}/repos/${repoFullName}/issues/${issueNumber}`, {
      headers: GH_HEADERS,
      signal: AbortSignal.timeout(1e4)
    });
    if (!res.ok) return null;
    const issue = await res.json();
    const state = issue.state === "open" ? "open" : issue.state === "closed" ? "closed" : null;
    return { state, title: typeof issue.title === "string" ? issue.title : null };
  } catch {
    return null;
  }
}
async function pollPR(prUrl) {
  const p = parseGitHubUrl(prUrl);
  if (!p) return null;
  try {
    const res = await fetch(`${GH_API}/repos/${p.repoFullName}/pulls/${p.number}`, {
      headers: GH_HEADERS,
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
function printMetric(rate) {
  const pct = Math.round(rate.rate * 100);
  console.log(`
\u{1F4CA} Accepted-PR rate: ${rate.merged}/${rate.total} claims merged (${pct}%)`);
}
async function resolveBounty(arg) {
  let bountyId, title, repoFullName, issueUrl, amountUSD;
  const job = findBountyInCache(arg);
  if (job) {
    const b = job.bounty ?? {};
    bountyId = job.id;
    title = job.title;
    repoFullName = b.repoFullName ?? job.company ?? "";
    issueUrl = b.claimUrl ?? job.url ?? "";
    amountUSD = b.amountUSD ?? null;
  } else {
    const parsed = parseGitHubUrl(arg);
    if (!parsed) return null;
    bountyId = `gh:${parsed.repoFullName}#${parsed.number}`;
    title = `${parsed.repoFullName}#${parsed.number}`;
    repoFullName = parsed.repoFullName;
    issueUrl = arg;
    amountUSD = null;
  }
  const ghIssue = parseGitHubUrl(issueUrl);
  const [issue, openPRs] = ghIssue ? await Promise.all([
    fetchIssue(repoFullName, ghIssue.number),
    countOpenPRsReferencingIssue(repoFullName, ghIssue.number)
  ]) : [null, null];
  const issueState = issue ? issue.state : null;
  if (!job && issue && issue.title) title = issue.title;
  return {
    bountyId,
    title,
    repoFullName,
    issueUrl,
    amountUSD,
    issueState,
    openPRs,
    issueNumber: ghIssue ? ghIssue.number : null
  };
}
async function cmdRecord(arg) {
  const claims = await Promise.resolve().then(() => (init_claims(), claims_exports));
  if (!arg) {
    console.error("Usage: terminalhire claim record <bountyId|issueUrl>");
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
  let claim;
  try {
    claim = claims.recordClaim({ id: b.bountyId, bountyId: b.bountyId, title: b.title, repoFullName: b.repoFullName, issueUrl: b.issueUrl, amountUSD: b.amountUSD, openPRsAtClaim: b.openPRs });
  } catch (err) {
    console.error(`terminalhire claim: ${err.message ?? err}`);
    process.exit(1);
  }
  console.log(`
\u2713 Claimed: ${claim.title}`);
  console.log(`  id:     ${claim.id}`);
  console.log(`  repo:   ${claim.repoFullName}`);
  console.log(`  amount: ${fmtAmount(claim.amountUSD)}`);
  console.log(`  issue:  ${claim.issueUrl}`);
  if (b.openPRs == null) {
    console.log("  open PRs: unknown (GitHub read unavailable \u2014 check the issue manually before working)");
  } else if (b.openPRs > 0) {
    console.log(`  \u26A0 open PRs referencing this issue: ${b.openPRs} \u2014 someone may already be on it. Check before working.`);
  } else {
    console.log("  open PRs referencing this issue: 0");
  }
  console.log("\n  Executor constraints (enforce when spawning the background agent):");
  console.log("   \u2022 work in an ISOLATED git worktree; scrub the subprocess env (no token/profile inheritance)");
  console.log("   \u2022 MUST NOT `git push` or `gh pr` \u2014 pushing happens only via `terminalhire submit`");
  console.log("   \u2022 clone + static analysis + patch only; NO test/build execution without explicit approval");
  console.log("   \u2022 no access to ~/.terminalhire (the executor never needs your profile)");
  console.log("\n  Next: do the work, then `terminalhire claim update " + claim.id + " <state>` as you progress.");
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
  if (json) {
    process.stdout.write(
      JSON.stringify({
        bountyId: b.bountyId,
        title: b.title,
        amountUSD: b.amountUSD,
        repoFullName: b.repoFullName,
        issueUrl: b.issueUrl,
        issueState: b.issueState,
        openPRs: b.openPRs
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
  if (b.openPRs == null) {
    console.log("  open PRs: unknown (GitHub read unavailable \u2014 check the issue manually before working)");
  } else if (b.openPRs > 0) {
    console.log(`  \u26A0 open PRs referencing this issue: ${b.openPRs} \u2014 someone may already be on it. Check before working.`);
  } else {
    console.log("  open PRs referencing this issue: 0");
  }
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
    console.log(`  [${c.state}] ${fmtAmount(c.amountUSD)} \xB7 ${c.title}`);
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
async function run4() {
  const verb = process.argv[2];
  const rest = process.argv.slice(3).filter((a) => !a.startsWith("--"));
  const active = process.argv.includes("--active");
  const json = process.argv.includes("--json");
  try {
    switch (verb) {
      case "preview":
        await cmdPreview(rest[0], { json });
        break;
      case "record":
        await cmdRecord(rest[0]);
        break;
      case "list":
        await cmdList(active);
        break;
      case "status":
        await cmdStatus(rest[0]);
        break;
      case "update":
        await cmdUpdate(rest[0], rest[1], rest[2]);
        break;
      case "release":
        await cmdRelease(rest[0]);
        break;
      default:
        console.error(`terminalhire claim: unknown verb '${verb ?? ""}'. Expected: preview | record | list | status | update | release`);
        process.exit(1);
    }
  } catch (err) {
    console.error("terminalhire claim error:", err.message ?? err);
    process.exit(1);
  }
}
var TERMINALHIRE_DIR6, INDEX_CACHE_FILE3, GH_API, GH_HEADERS;
var init_jpi_claim = __esm({
  "bin/jpi-claim.js"() {
    "use strict";
    TERMINALHIRE_DIR6 = join7(homedir6(), ".terminalhire");
    INDEX_CACHE_FILE3 = join7(TERMINALHIRE_DIR6, "index-cache.json");
    GH_API = "https://api.github.com";
    GH_HEADERS = { "User-Agent": "terminalhire-claim", Accept: "application/vnd.github+json" };
  }
});

// bin/jpi-profile.js
var jpi_profile_exports = {};
__export(jpi_profile_exports, {
  run: () => run5
});
import { createInterface as createInterface3 } from "readline";
function prompt3(question) {
  const rl = createInterface3({ input: process.stdin, output: process.stdout });
  return new Promise((resolve2) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve2(answer.trim());
    });
  });
}
async function run5() {
  const { readProfile: readProfile2, writeProfile: writeProfile2, deleteProfile: deleteProfile2 } = await Promise.resolve().then(() => (init_profile(), profile_exports));
  const args3 = process.argv.slice(2);
  if (args3.includes("--show")) {
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
  if (args3.includes("--delete")) {
    console.log("\nThis will permanently delete your local terminalhire profile and encryption key.");
    const answer = await prompt3('Type "yes" to confirm: ');
    if (answer !== "yes") {
      console.log("Aborted.");
      process.exit(0);
    }
    await deleteProfile2();
    console.log("Profile and key deleted from ~/.terminalhire/");
    return;
  }
  if (args3.includes("--edit")) {
    const profile = await readProfile2();
    console.log("\n\u2726 terminalhire profile editor (press Enter to keep current value)\n");
    const name = await prompt3(`Display name [${profile.displayName ?? "not set"}]: `);
    if (name) profile.displayName = name;
    const email = await prompt3(`Contact email [${profile.contactEmail ?? "not set"}]: `);
    if (email) profile.contactEmail = email;
    const remote = await prompt3(`Remote only? (y/n) [${profile.remoteOnly ? "y" : "n"}]: `);
    if (remote === "y") profile.remoteOnly = true;
    if (remote === "n") profile.remoteOnly = false;
    const floor = await prompt3(`Comp floor USD [${profile.compFloorUsd ?? "not set"}]: `);
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
import { readFileSync as readFileSync8, readdirSync } from "fs";
import { execFileSync } from "child_process";
import { join as join8 } from "path";
function safeGit(args3, cwd) {
  try {
    return execFileSync("git", ["-C", cwd, ...args3], {
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
    return JSON.parse(readFileSync8(path, "utf8"));
  } catch {
    return null;
  }
}
function readFileSafe(path) {
  try {
    return readFileSync8(path, "utf8");
  } catch {
    return "";
  }
}
function tokensFromPackageJson(cwd) {
  const pkg = readJsonSafe(join8(cwd, "package.json"));
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
      const groupDir = join8(cwd, group);
      for (const e of readdirSync(groupDir, { withFileTypes: true })) {
        if (e.isDirectory() && !e.isSymbolicLink()) dirs.push(join8(groupDir, e.name));
      }
    } catch {
    }
  }
  return dirs;
}
function tokensFromRequirementsTxt(cwd) {
  const content = readFileSafe(join8(cwd, "requirements.txt"));
  if (!content) return [];
  return content.split("\n").map((l) => l.trim().split(/[>=<!\[;]/)[0].trim().toLowerCase()).filter(Boolean);
}
function tokensFromGoMod(cwd) {
  const content = readFileSafe(join8(cwd, "go.mod"));
  if (!content) return [];
  const requires = Array.from(content.matchAll(/^\s+([^\s]+)\s+v/gm)).map((m) => m[1].split("/").pop() ?? "").filter(Boolean);
  return ["go", ...requires];
}
function tokensFromCargoToml(cwd) {
  const content = readFileSafe(join8(cwd, "Cargo.toml"));
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
    const srcDir = join8(cwd, "src");
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
  run: () => run6
});
async function run6() {
  try {
    const args3 = process.argv.slice(2);
    const cwdIdx = args3.indexOf("--cwd");
    const cwd = cwdIdx !== -1 && args3[cwdIdx + 1] ? args3[cwdIdx + 1] : process.cwd();
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
      run6();
    }
  }
});

// bin/jpi-config.js
var jpi_config_exports = {};
__export(jpi_config_exports, {
  run: () => run7
});
import { readFileSync as readFileSync9, writeFileSync as writeFileSync6, mkdirSync as mkdirSync6, existsSync as existsSync6 } from "fs";
import { join as join9 } from "path";
import { homedir as homedir7 } from "os";
function readConfig() {
  try {
    if (!existsSync6(CONFIG_FILE)) return { ...DEFAULT_CONFIG };
    return { ...DEFAULT_CONFIG, ...JSON.parse(readFileSync9(CONFIG_FILE, "utf8")) };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}
function writeConfig(patch) {
  mkdirSync6(TERMINALHIRE_DIR7, { recursive: true });
  const merged = { ...readConfig(), ...patch };
  writeFileSync6(CONFIG_FILE, JSON.stringify(merged, null, 2) + "\n", "utf8");
}
function parseNudgeMode(raw) {
  if (raw === "session" || raw === "always") return raw;
  const m = /^every:(\d+)$/.exec(raw);
  if (m && parseInt(m[1], 10) >= 1) return raw;
  return null;
}
async function run7() {
  const args3 = process.argv.slice(2);
  const filtered = args3[0] === "config" ? args3.slice(1) : args3;
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
var TERMINALHIRE_DIR7, CONFIG_FILE, DEFAULT_CONFIG;
var init_jpi_config = __esm({
  "bin/jpi-config.js"() {
    "use strict";
    TERMINALHIRE_DIR7 = join9(homedir7(), ".terminalhire");
    CONFIG_FILE = join9(TERMINALHIRE_DIR7, "config.json");
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
  readFileSync as readFileSync10,
  writeFileSync as writeFileSync7,
  existsSync as existsSync7,
  mkdirSync as mkdirSync7,
  renameSync as renameSync2
} from "fs";
import { join as join10, dirname } from "path";
import { homedir as homedir8 } from "os";
function readJson(path, fallback) {
  try {
    return existsSync7(path) ? JSON.parse(readFileSync10(path, "utf8")) : fallback;
  } catch {
    return fallback;
  }
}
function atomicWriteJson(path, obj) {
  mkdirSync7(dirname(path), { recursive: true });
  const tmp = `${path}.tmp-${process.pid}`;
  writeFileSync7(tmp, JSON.stringify(obj, null, 2) + "\n", "utf8");
  renameSync2(tmp, path);
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
var TH_DIR, CLAUDE_SETTINGS, CONFIG_FILE2, SPINNER_STATE_FILE, SPINNER_DEFAULTS, VERB_INTROS;
var init_spinner = __esm({
  "bin/spinner.js"() {
    "use strict";
    TH_DIR = process.env["TERMINALHIRE_DIR"] || join10(homedir8(), ".terminalhire");
    CLAUDE_SETTINGS = process.env["TERMINALHIRE_CLAUDE_SETTINGS"] || join10(homedir8(), ".claude", "settings.json");
    CONFIG_FILE2 = join10(TH_DIR, "config.json");
    SPINNER_STATE_FILE = join10(TH_DIR, "spinner-state.json");
    SPINNER_DEFAULTS = { enabled: false, mode: "append", max: 6, frequency: "sometimes" };
    VERB_INTROS = ["Matched:", "You\u2019d fit:", "Worth a look:", "On your radar:", "Fits your stack:"];
  }
});

// bin/jpi-spinner.js
var jpi_spinner_exports = {};
__export(jpi_spinner_exports, {
  run: () => run8
});
import {
  readFileSync as readFileSync11,
  writeFileSync as writeFileSync8,
  copyFileSync,
  existsSync as existsSync8,
  mkdirSync as mkdirSync8
} from "fs";
import { join as join11 } from "path";
import { homedir as homedir9 } from "os";
import { createInterface as createInterface4 } from "readline";
function readConfig2() {
  try {
    return existsSync8(CONFIG_FILE3) ? JSON.parse(readFileSync11(CONFIG_FILE3, "utf8")) : {};
  } catch {
    return {};
  }
}
function writeConfig2(patch) {
  mkdirSync8(TH_DIR2, { recursive: true });
  const merged = { ...readConfig2(), ...patch };
  writeFileSync8(CONFIG_FILE3, JSON.stringify(merged, null, 2) + "\n", "utf8");
}
function backupSettings() {
  if (!existsSync8(SETTINGS_PATH)) return null;
  const ts = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
  const backupPath = `${SETTINGS_PATH}.terminalhire-backup-${ts}`;
  copyFileSync(SETTINGS_PATH, backupPath);
  return backupPath;
}
function ask(question) {
  const rl = createInterface4({ input: process.stdin, output: process.stdout });
  return new Promise((res) => {
    rl.question(question, (answer) => {
      rl.close();
      res(answer.trim().toLowerCase());
    });
  });
}
function readTopMatches() {
  try {
    const c = JSON.parse(readFileSync11(CACHE_FILE, "utf8"));
    return Array.isArray(c.topMatches) ? c.topMatches : [];
  } catch {
    return [];
  }
}
async function run8() {
  const args3 = process.argv.slice(2).filter((a) => a !== "spinner");
  const has = (f) => args3.includes(f);
  const val = (f) => {
    const i = args3.indexOf(f);
    return i >= 0 ? args3[i + 1] : void 0;
  };
  if (has("--show") || args3.length === 0) {
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
    TH_DIR2 = process.env["TERMINALHIRE_DIR"] || join11(homedir9(), ".terminalhire");
    CONFIG_FILE3 = join11(TH_DIR2, "config.json");
    SETTINGS_PATH = process.env["TERMINALHIRE_CLAUDE_SETTINGS"] || join11(homedir9(), ".claude", "settings.json");
    CACHE_FILE = join11(TH_DIR2, "index-cache.json");
  }
});

// bin/jpi-sync.js
var jpi_sync_exports = {};
__export(jpi_sync_exports, {
  run: () => run9
});
import { readFileSync as readFileSync12, writeFileSync as writeFileSync9, mkdirSync as mkdirSync9, existsSync as existsSync9, rmSync as rmSync2 } from "fs";
import { join as join12 } from "path";
import { homedir as homedir10, hostname as osHostname } from "os";
import { createInterface as createInterface5 } from "readline";
function ask2(question) {
  const rl = createInterface5({ input: process.stdin, output: process.stdout });
  return new Promise((res) => {
    rl.question(question, (answer) => {
      rl.close();
      res(answer.trim().toLowerCase());
    });
  });
}
function readMarker() {
  try {
    return existsSync9(TIER1_MARKER) ? JSON.parse(readFileSync12(TIER1_MARKER, "utf8")) : null;
  } catch {
    return null;
  }
}
function writeMarker(marker) {
  mkdirSync9(TH_DIR3, { recursive: true });
  writeFileSync9(TIER1_MARKER, JSON.stringify(marker, null, 2) + "\n", "utf8");
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
    const rl = createInterface5({ input: process.stdin, output: process.stdout });
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
    res = await fetch(`${API_URL3}/api/profile-sync`, {
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
async function run9() {
  const args3 = process.argv.slice(2).filter((a) => a !== "sync");
  const has = (f) => args3.includes(f);
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
var TH_DIR3, TIER1_MARKER, API_URL3, SYNC_BASE, POLL_INTERVAL_MS, POLL_TIMEOUT_MS, CONSENT_VERSION;
var init_jpi_sync = __esm({
  "bin/jpi-sync.js"() {
    "use strict";
    init_open_url();
    TH_DIR3 = process.env["TERMINALHIRE_DIR"] || join12(homedir10(), ".terminalhire");
    TIER1_MARKER = join12(TH_DIR3, "tier1.json");
    API_URL3 = process.env["TERMINALHIRE_API_URL"] || process.env["JPI_API_URL"] || "https://terminalhire.com";
    SYNC_BASE = "https://www.terminalhire.com";
    POLL_INTERVAL_MS = 2e3;
    POLL_TIMEOUT_MS = 10 * 60 * 1e3;
    CONSENT_VERSION = 1;
  }
});

// bin/jpi-init.js
var jpi_init_exports = {};
__export(jpi_init_exports, {
  run: () => run10
});
import { existsSync as existsSync10 } from "fs";
import { join as join13, resolve } from "path";
import { fileURLToPath as fileURLToPath3 } from "url";
import { createInterface as createInterface6 } from "readline";
import { spawnSync, spawn as spawn2 } from "child_process";
import { homedir as homedir11 } from "os";
function ask3(question) {
  const rl = createInterface6({ input: process.stdin, output: process.stdout });
  return new Promise((resolve2) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve2(answer.trim().toLowerCase());
    });
  });
}
function resolveScript(name) {
  const distPath = resolve(join13(__dirname2, "..", "..", "dist", "bin", `${name}.js`));
  const legacyPath = resolve(join13(__dirname2, `${name}.js`));
  return existsSync10(distPath) ? distPath : legacyPath;
}
function resolveInstallJs() {
  const fromDist = resolve(join13(__dirname2, "..", "..", "install.js"));
  const fromBin = resolve(join13(__dirname2, "..", "install.js"));
  if (existsSync10(fromDist)) return fromDist;
  if (existsSync10(fromBin)) return fromBin;
  return fromBin;
}
async function run10() {
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
  run: () => run11
});
import { readFileSync as readFileSync13, writeFileSync as writeFileSync10, existsSync as existsSync11, mkdirSync as mkdirSync10 } from "fs";
import { join as join14 } from "path";
import { homedir as homedir12 } from "os";
import { fileURLToPath as fileURLToPath4 } from "url";
async function run11() {
  try {
    let index;
    try {
      const res = await fetch(`${API_URL4}/api/index`, {
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
    mkdirSync10(TERMINALHIRE_DIR8, { recursive: true });
    const cacheEntry = {
      ts: Date.now(),
      index,
      matchCount,
      topMatches
    };
    writeFileSync10(INDEX_CACHE_FILE4, JSON.stringify(cacheEntry), "utf8");
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
        const tips = buildTips2(ranked, API_URL4, 8);
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
var __dirname3, TERMINALHIRE_DIR8, INDEX_CACHE_FILE4, API_URL4;
var init_jpi_refresh = __esm({
  "bin/jpi-refresh.js"() {
    "use strict";
    __dirname3 = fileURLToPath4(new URL(".", import.meta.url));
    TERMINALHIRE_DIR8 = join14(homedir12(), ".terminalhire");
    INDEX_CACHE_FILE4 = join14(TERMINALHIRE_DIR8, "index-cache.json");
    API_URL4 = process.env["TERMINALHIRE_API_URL"] ?? process.env["JPI_API_URL"] ?? "https://terminalhire.com";
  }
});

// bin/jpi-save.js
var jpi_save_exports = {};
__export(jpi_save_exports, {
  run: () => run12
});
import { readFileSync as readFileSync14, existsSync as existsSync12 } from "fs";
import { join as join15 } from "path";
import { homedir as homedir13 } from "os";
import { fileURLToPath as fileURLToPath5 } from "url";
function findJobInCache(jobId) {
  try {
    if (!existsSync12(INDEX_CACHE_FILE5)) return null;
    const raw = readFileSync14(INDEX_CACHE_FILE5, "utf8");
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
async function run12() {
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
var __dirname4, TERMINALHIRE_DIR9, INDEX_CACHE_FILE5;
var init_jpi_save = __esm({
  "bin/jpi-save.js"() {
    "use strict";
    __dirname4 = fileURLToPath5(new URL(".", import.meta.url));
    TERMINALHIRE_DIR9 = join15(homedir13(), ".terminalhire");
    INDEX_CACHE_FILE5 = join15(TERMINALHIRE_DIR9, "index-cache.json");
  }
});

// bin/jpi-dispatch.js
import { fileURLToPath as fileURLToPath6 } from "url";
import { join as join16, dirname as dirname2 } from "path";
import { existsSync as existsSync13, readFileSync as readFileSync15 } from "fs";
import { createRequire } from "module";
var __dirname5 = fileURLToPath6(new URL(".", import.meta.url));
function readPackageVersion() {
  try {
    const candidates = [
      join16(__dirname5, "..", "..", "package.json"),
      join16(__dirname5, "..", "package.json")
    ];
    for (const p of candidates) {
      if (existsSync13(p)) {
        const pkg = JSON.parse(readFileSync15(p, "utf8"));
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
  const nudgeScript = join16(__dirname5, "jpi.js");
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
  console.log("  terminalhire bounties                       Day-sized paid tasks you can knock out today");
  console.log("  terminalhire bounties --priced              Only bounties with a known $ amount");
  console.log("  terminalhire claim record <id|issueUrl>     Claim a bounty locally + print the executor brief");
  console.log("  terminalhire claim list [--active]          List your claims + accepted-PR rate");
  console.log("  terminalhire claim status [<id>]            Poll source PR merge state (updates the metric)");
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
if (firstArg === "bounties") {
  process.argv.splice(2, 1);
  const mod = await Promise.resolve().then(() => (init_jpi_bounties(), jpi_bounties_exports));
  await mod.run();
  process.exit(0);
}
if (firstArg === "claim") {
  process.argv.splice(2, 1);
  const mod = await Promise.resolve().then(() => (init_jpi_claim(), jpi_claim_exports));
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
