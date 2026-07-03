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
var init_open_url = __esm({
  "src/open-url.js"() {
    "use strict";
  }
});

// ../../node_modules/keytar/build/Release/keytar.node
var keytar_default;
var init_keytar = __esm({
  "../../node_modules/keytar/build/Release/keytar.node"() {
    keytar_default = "../keytar-KOAAH267.node";
  }
});

// node-file:/private/tmp/claude-501/-Users-ericgang-job-placement-inline/3ffac25b-ca95-4a86-9e17-a4cf326551de/scratchpad/rel/node_modules/keytar/build/Release/keytar.node
var require_keytar = __commonJS({
  "node-file:/private/tmp/claude-501/-Users-ericgang-job-placement-inline/3ffac25b-ca95-4a86-9e17-a4cf326551de/scratchpad/rel/node_modules/keytar/build/Release/keytar.node"(exports, module) {
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
var github_auth_exports = {};
__export(github_auth_exports, {
  GITHUB_SCOPE: () => GITHUB_SCOPE,
  decrypt: () => decrypt,
  deleteGitHubToken: () => deleteGitHubToken,
  encrypt: () => encrypt,
  hasGitHubToken: () => hasGitHubToken,
  loadKey: () => loadKey,
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
    const kt = await Promise.resolve().then(() => __toESM(require_keytar2(), 1));
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
  return new Promise((resolve) => setTimeout(resolve, ms));
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

// ../../packages/core/src/feeds/contribution-gate.ts
function passesContributionGate(input) {
  if (input.contributors === void 0) return false;
  return input.stars >= MIN_STARS && input.contributors >= MIN_CONTRIBUTORS && !TRIVIAL_PR_TITLE.test(input.title) && !input.archived && !input.fork;
}
var MIN_STARS, MIN_CONTRIBUTORS, TRIVIAL_PR_TITLE;
var init_contribution_gate = __esm({
  "../../packages/core/src/feeds/contribution-gate.ts"() {
    "use strict";
    MIN_STARS = 50;
    MIN_CONTRIBUTORS = 10;
    TRIVIAL_PR_TITLE = /^\s*(fix\s+typo|typo\b|update\s+readme|readme\b|docs?:|docs?\(|chore:|chore\(|style:|ci:|build:|bump\b|update\s+dependenc)/i;
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
async function fetchOwnedRepoTraction(login, token) {
  const computedAt = (/* @__PURE__ */ new Date()).toISOString();
  const empty = (status) => ({
    status,
    totalStars: 0,
    totalForks: 0,
    reposWithStars: 0,
    top: [],
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
    ranked.push({ name: r.name, stars, forks });
  }
  ranked.sort((a, b) => b.stars - a.stars || b.forks - a.forks);
  return {
    status: "ok",
    totalStars,
    totalForks,
    reposWithStars,
    top: ranked.slice(0, TRACTION_TOP_N),
    computedAt
  };
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
var TRACTION_TOP_N, CANDIDATE_PR_PAGE, RESUME_DECAY_HALF_LIFE_MS, RESUME_MIN_SCORE;
var init_github = __esm({
  "../../packages/core/src/github.ts"() {
    "use strict";
    init_vocabulary();
    init_contribution_gate();
    TRACTION_TOP_N = 6;
    CANDIDATE_PR_PAGE = 50;
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
      "ucfopen/Obojobo",
      "moorcheh-ai/memanto",
      "PrismarineJS/mineflayer"
    ];
    BOUNTY_REPO_DENYLIST = [
      "SecureBananaLabs/bug-bounty",
      // Meta-farm: a bounty PLATFORM whose own issues are an assignment-gated
      // contributor queue ("please assign me, my chief") — an unsolicited PR won't
      // merge, so it's not a real claimable bounty. Not structurally derivable from
      // any fetched field, so it's a manual entry (also dropped from the allowlist).
      "boundlessfi/boundless"
    ];
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
    init_directory();
    init_bounty_gate();
    init_bounty_gate();
    init_contribution_gate();
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

// ../../packages/core/src/feeds/contributions.ts
function authHeaders2() {
  const token = process.env["GITHUB_TOKEN"] ?? process.env["GH_TOKEN"];
  const h = {
    Accept: "application/vnd.github+json",
    "User-Agent": "terminalhire",
    "X-GitHub-Api-Version": "2022-11-28"
  };
  if (token) h["Authorization"] = `Bearer ${token}`;
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
function makeClient(fetchImpl) {
  async function raw(path) {
    try {
      return await fetchImpl(`${GITHUB_API2}${path}`, { headers: authHeaders2() });
    } catch {
      return null;
    }
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
  return { raw, json };
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
  const refs = /* @__PURE__ */ new Set();
  const prs = await client.json(
    `/repos/${fullName}/pulls?state=open&per_page=100`
  );
  if (!Array.isArray(prs)) return refs;
  for (const pr of prs) {
    for (const m of `${pr.title ?? ""}
${pr.body ?? ""}`.matchAll(/#(\d+)\b/g)) {
      refs.add(Number(m[1]));
    }
  }
  return refs;
}
async function searchContribIssues(client, queries) {
  const byUrl = /* @__PURE__ */ new Map();
  for (const q of queries) {
    const res = await client.json(
      `/search/issues?q=${encodeURIComponent(q)}&sort=created&order=desc&per_page=${SEARCH_PER_PAGE2}`
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
async function aggregateContributions(opts = {}) {
  const client = makeClient(opts.fetchImpl ?? fetchWithTimeout);
  const queries = opts.queries ?? CONTRIB_SEARCH_QUERIES;
  const issues = (await searchContribIssues(client, queries)).slice(0, MAX_CONTRIB_ISSUES_SCANNED);
  const repoCache = /* @__PURE__ */ new Map();
  const contribCache = /* @__PURE__ */ new Map();
  const prRefsCache = /* @__PURE__ */ new Map();
  async function repoMeta(fullName) {
    const hit = repoCache.get(fullName);
    if (hit !== void 0) return hit;
    const r = await client.json(`/repos/${fullName}`) ?? null;
    repoCache.set(fullName, r);
    return r;
  }
  async function repoContribCount(fullName) {
    if (contribCache.has(fullName)) return contribCache.get(fullName);
    const n = await contributorCount(client, fullName);
    contribCache.set(fullName, n);
    return n;
  }
  async function repoPRRefs(fullName) {
    const hit = prRefsCache.get(fullName);
    if (hit !== void 0) return hit;
    const refs = await openPRIssueRefs(client, fullName);
    prRefsCache.set(fullName, refs);
    return refs;
  }
  const jobs = [];
  const seen = /* @__PURE__ */ new Set();
  const perRepo = /* @__PURE__ */ new Map();
  for (const issue of issues) {
    if (jobs.length >= MAX_CONTRIB_ITEMS) break;
    const fullName = repoFullNameFromApiUrl2(issue.repository_url);
    if (!fullName) continue;
    const id = `contribute:${fullName}#${issue.number}`;
    if (seen.has(id)) continue;
    if (isDenylistedRepo(fullName)) continue;
    if (isAssigned(issue)) continue;
    if ((perRepo.get(fullName) ?? 0) >= MAX_BOUNTIES_PER_DISCOVERED_REPO) continue;
    const repo = await repoMeta(fullName);
    if (!repo) continue;
    const title = decodeEntities(issue.title).trim();
    const contributors = await repoContribCount(fullName);
    if (!passesContributionGate({
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
    if (prRefs.has(issue.number)) continue;
    const body = issue.body ? decodeEntities(issue.body) : "";
    const labels = labelNames2(issue.labels);
    const tags = normalize(
      tokenize4([title, repo.language ?? "", labels.join(" "), body.slice(0, 2e3)].join(" "))
    );
    seen.add(id);
    perRepo.set(fullName, (perRepo.get(fullName) ?? 0) + 1);
    jobs.push({
      id,
      source: "contribute",
      title,
      company: repo.owner.login,
      url: issue.html_url,
      remote: true,
      location: "Remote",
      tags,
      roleType: "freelance",
      postedAt: issue.created_at,
      applyMode: "direct",
      contribution: {
        repoFullName: fullName,
        repoStars: repo.stargazers_count,
        repoContributors: contributors,
        // gate guarantees a number here
        issueNumber: issue.number,
        labels,
        issueUrl: issue.html_url,
        issueBody: body.slice(0, 1e3) || void 0
      },
      raw: issue
    });
  }
  return jobs;
}
var GITHUB_API2, CONTRIB_SEARCH_QUERIES, SEARCH_PER_PAGE2, MAX_CONTRIB_ITEMS, MAX_CONTRIB_ISSUES_SCANNED;
var init_contributions = __esm({
  "../../packages/core/src/feeds/contributions.ts"() {
    "use strict";
    init_vocabulary();
    init_entities();
    init_bounty_gate();
    init_contribution_gate();
    init_github_bounties();
    init_http();
    GITHUB_API2 = "https://api.github.com";
    CONTRIB_SEARCH_QUERIES = [
      'label:"good first issue" type:issue state:open',
      'label:"help wanted" type:issue state:open',
      'label:"good-first-issue" type:issue state:open',
      'label:"help-wanted" type:issue state:open'
    ];
    SEARCH_PER_PAGE2 = 100;
    MAX_CONTRIB_ITEMS = 150;
    MAX_CONTRIB_ISSUES_SCANNED = 300;
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
  const index = {
    builtAt: (/* @__PURE__ */ new Date()).toISOString(),
    jobs
  };
  if (opts?.includeContribute) {
    const contributions = await aggregateContributions(opts.contributeOpts);
    index.contribute = contributions.map(({ raw: _raw, ...rest }) => rest);
  }
  return index;
}
var init_indexer = __esm({
  "../../packages/core/src/indexer.ts"() {
    "use strict";
    init_feeds();
    init_contributions();
    init_partners();
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
function randomBytes2(bytesLength = 32) {
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
  const randomBytes5 = eddsaOpts.randomBytes || randomBytes2;
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
  const randomBytes_ = rand || randomBytes2;
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
import { hkdfSync, createHash, randomBytes as randomBytes3 } from "crypto";
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
  const nonce = new Uint8Array(randomBytes3(NONCE_BYTES));
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
    if (rec.status) counts[rec.status]++;
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
  const orgCount = Object.values(domains).reduce((m, d) => Math.max(m, d.distinctOrgs), 0);
  let proofSentence;
  if (!ok) {
    proofSentence = "Contribution credential unavailable \u2014 could not verify.";
  } else {
    const prs = credential.qualifyingTotal;
    let s = `${prs} substantive PR${prs === 1 ? "" : "s"} merged into at least ${orgCount} external org${orgCount === 1 ? "" : "s"} (\u2265${MIN_STARS}\u2605, \u2265${MIN_CONTRIBUTORS} contributors)`;
    if (daysAgo !== void 0) s += ` \u2014 most recent ${daysAgo}d ago`;
    proofSentence = `${s}.`;
  }
  const auditableBadge = ok ? {
    mergedTotal: credential.qualifyingTotal,
    distinctOrgs: orgCount,
    thresholds: { stars: MIN_STARS, contributors: MIN_CONTRIBUTORS }
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

// ../../packages/core/src/short-token.ts
import { createHash as createHash2 } from "crypto";
function contributeShortToken(id) {
  return createHash2("sha256").update(id, "utf8").digest("base64url").slice(0, 8);
}
var init_short_token = __esm({
  "../../packages/core/src/short-token.ts"() {
    "use strict";
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
  INTRO_ACCEPTED_TTL_MS: () => INTRO_ACCEPTED_TTL_MS,
  INTRO_ALLOWED_FIELDS: () => INTRO_ALLOWED_FIELDS,
  INTRO_PENDING_TTL_MS: () => INTRO_PENDING_TTL_MS,
  LEVER_SLUGS_BY_TIER: () => LEVER_SLUGS_BY_TIER,
  MIN_CONTRIBUTORS: () => MIN_CONTRIBUTORS,
  MIN_STARS: () => MIN_STARS,
  STRONG_MATCH_THRESHOLD: () => STRONG_MATCH_THRESHOLD,
  SYNONYMS: () => SYNONYMS,
  TRIVIAL_PR_TITLE: () => TRIVIAL_PR_TITLE,
  VOCABULARY: () => VOCABULARY,
  VOCAB_NODES: () => VOCAB_NODES,
  acceptanceCountForDomains: () => acceptanceCountForDomains,
  aggregate: () => aggregate,
  aggregateBounties: () => aggregateBounties,
  ashby: () => ashby,
  authorizeIntroDecision: () => authorizeIntroDecision,
  authorizeIntroDeletion: () => authorizeIntroDeletion,
  bestAcceptanceDomain: () => bestAcceptanceDomain,
  buildDirectoryIndex: () => buildDirectoryIndex,
  buildGraph: () => buildGraph,
  buildIndex: () => buildIndex,
  buildIntroListItem: () => buildIntroListItem,
  buildIntroPayload: () => buildIntroPayload,
  buildReason: () => buildReason,
  composeIntroAcceptedEmail: () => composeIntroAcceptedEmail,
  composeIntroEmail: () => composeIntroEmail,
  computeAcceptanceCredential: () => computeAcceptanceCredential,
  computeAcceptanceCredentialPublic: () => computeAcceptanceCredentialPublic,
  contributeShortToken: () => contributeShortToken,
  coreTagsFromTitle: () => coreTagsFromTitle,
  decorate: () => decorate,
  decryptMessage: () => decryptMessage,
  deriveLegibleProfile: () => deriveLegibleProfile,
  deriveResumeTrend: () => deriveResumeTrend,
  deriveSharedKey: () => deriveSharedKey,
  encryptMessage: () => encryptMessage,
  expandWeighted: () => expandWeighted,
  extractSkillTags: () => extractSkillTags,
  fetchGitHubProfile: () => fetchGitHubProfile,
  fetchOwnedRepoTraction: () => fetchOwnedRepoTraction,
  fetchRepoRecency: () => fetchRepoRecency,
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
  isBounty: () => isBounty,
  isContribution: () => isContribution,
  isOverIntroLimit: () => isOverIntroLimit,
  lever: () => lever,
  loadPartnerRoles: () => loadPartnerRoles,
  looksLikeEngRole: () => looksLikeEngRole,
  match: () => match,
  normalize: () => normalize,
  opire: () => opire,
  pageMatches: () => pageMatches,
  passesContributionGate: () => passesContributionGate,
  passesMaturityGate: () => passesMaturityGate,
  personCardToJob: () => personCardToJob,
  projectCardToJob: () => projectCardToJob,
  recordClick: () => recordClick,
  rejectExtraIntroFields: () => rejectExtraIntroFields,
  revealIntroContacts: () => revealIntroContacts,
  safetyNumber: () => safetyNumber,
  sameLogin: () => sameLogin,
  setStatus: () => setStatus,
  tokenize: () => tokenize,
  validateGraph: () => validateGraph,
  validateIntroPayload: () => validateIntroPayload,
  validateTargetContact: () => validateTargetContact,
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
    init_intro();
    init_directoryThreshold();
    init_chatCrypto();
    init_job_status();
    init_legible();
    init_short_token();
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
  randomBytes as randomBytes4
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
    const kt = await Promise.resolve().then(() => __toESM(require_keytar2(), 1));
    const stored = await kt.getPassword("terminalhire", "profile-key");
    if (stored) {
      return Buffer.from(stored, "hex");
    }
    const key2 = randomBytes4(KEY_BYTES2);
    await kt.setPassword("terminalhire", "profile-key", key2.toString("hex"));
    return key2;
  } catch {
  }
  mkdirSync2(TERMINALHIRE_DIR2, { recursive: true });
  if (existsSync2(KEY_FILE2)) {
    return Buffer.from(readFileSync3(KEY_FILE2, "utf8").trim(), "hex");
  }
  const key = randomBytes4(KEY_BYTES2);
  writeFileSync2(KEY_FILE2, key.toString("hex"), { mode: 384, encoding: "utf8" });
  return key;
}
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
    rmSync2(KEY_FILE2);
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

// src/config.ts
import { readFileSync as readFileSync4, writeFileSync as writeFileSync3, mkdirSync as mkdirSync3, existsSync as existsSync3 } from "fs";
import { join as join4 } from "path";
import { homedir as homedir3 } from "os";
function readConfig() {
  try {
    if (!existsSync3(CONFIG_FILE)) return { ...DEFAULT_CONFIG };
    const raw = readFileSync4(CONFIG_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_CONFIG, ...parsed };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}
function writeConfig(config) {
  mkdirSync3(TERMINALHIRE_DIR3, { recursive: true });
  const current = readConfig();
  const merged = { ...current, ...config };
  writeFileSync3(CONFIG_FILE, JSON.stringify(merged, null, 2) + "\n", "utf8");
}
var TERMINALHIRE_DIR3, CONFIG_FILE, DEFAULT_CONFIG;
var init_config = __esm({
  "src/config.ts"() {
    "use strict";
    TERMINALHIRE_DIR3 = join4(homedir3(), ".terminalhire");
    CONFIG_FILE = join4(TERMINALHIRE_DIR3, "config.json");
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
      contributePrompted: false
    };
  }
});

// bin/peer-connect-prompt.js
var peer_connect_prompt_exports = {};
__export(peer_connect_prompt_exports, {
  maybePromptPeerConnect: () => maybePromptPeerConnect
});
import { createInterface } from "readline";
function buildSupplyPrompt(login) {
  const resumeUrl = login ? `terminalhire.com/r/${login}` : "terminalhire.com/r/<your-login>";
  return [
    "",
    "  Let other builders find you too?",
    "",
    `  Publish your verifiable r\xE9sum\xE9 (${resumeUrl}) \u2014 it lists you in the`,
    "  builder directory so matches are mutual. You'll confirm in your browser; nothing",
    "  is published until you click publish there. Open it now? [y/N]: "
  ].join("\n");
}
async function maybePromptPeerConnect({
  input = process.stdin,
  output = process.stdout,
  isInteractive = Boolean(process.stdin.isTTY && process.stdout.isTTY),
  login,
  openUrl = openInBrowser,
  ask
} = {}) {
  const promptOnce = ask ? async (q) => String(await ask(q) ?? "").trim().toLowerCase() : async (q) => {
    const rl = createInterface({ input, output });
    const a = await new Promise((resolve) => {
      rl.question(q, (x) => {
        rl.close();
        resolve(x);
      });
    });
    return String(a).trim().toLowerCase();
  };
  const cfg = readConfig();
  if (cfg.peerConnectPrompted) {
    return {
      prompted: false,
      peerConnect: cfg.peerConnect === true,
      resumePublishPrompted: cfg.resumePublishPrompted === true,
      resumePublishOpened: false
    };
  }
  if (!isInteractive) {
    return {
      prompted: false,
      peerConnect: cfg.peerConnect === true,
      resumePublishPrompted: cfg.resumePublishPrompted === true,
      resumePublishOpened: false
    };
  }
  const answer = await promptOnce(PROMPT);
  const optedIn = answer === "y" || answer === "yes";
  writeConfig({ peerConnect: optedIn, peerConnectPrompted: true });
  output.write(
    optedIn ? "\n  Peer-connect ON \u2014 peers & founders may surface in your spinner.\n  Turn it off anytime: terminalhire config --connect off\n\n" : "\n  Peer-connect stays OFF. Enable anytime: terminalhire config --connect on\n\n"
  );
  let resumePublishOpened = false;
  if (optedIn && cfg.resumePublishPrompted !== true) {
    const supplyAnswer = await promptOnce(buildSupplyPrompt(login));
    const wantsPublish = supplyAnswer === "y" || supplyAnswer === "yes";
    writeConfig({ resumePublishPrompted: true });
    if (wantsPublish) {
      const next = "/dashboard?publish=1";
      const url = `${OAUTH_BASE}/api/auth/github?next=${encodeURIComponent(next)}`;
      output.write(
        `
  Opening your browser to confirm \u2014 nothing is published until you click
  publish there: ${url}
  (You can also publish anytime from terminalhire.com/dashboard.)

`
      );
      openUrl(url);
      resumePublishOpened = true;
    } else {
      output.write(
        "\n  No worries \u2014 you stay viewer-only (not listed in the directory).\n  Publish anytime from terminalhire.com/dashboard.\n\n"
      );
    }
  }
  return {
    prompted: true,
    peerConnect: optedIn,
    resumePublishPrompted: readConfig().resumePublishPrompted === true,
    resumePublishOpened
  };
}
var OAUTH_BASE, PROMPT;
var init_peer_connect_prompt = __esm({
  "bin/peer-connect-prompt.js"() {
    "use strict";
    init_config();
    init_open_url();
    OAUTH_BASE = "https://terminalhire.com";
    PROMPT = [
      "",
      "  Connect with other builders?",
      "",
      "  See peers and founders building what you're building \u2014 matched on your machine,",
      "  so nothing about you leaves it. The only thing ever sent is anonymous: the",
      "  matched person's public username, never yours, never your profile or fingerprint.",
      "",
      "  Change it anytime: terminalhire config --connect on|off",
      "",
      "  Opt in? [y/N]: "
    ].join("\n");
  }
});

// bin/jpi-login.js
init_open_url();
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
      const { fileURLToPath: fileURLToPath2 } = await import("url");
      const { join: join5 } = await import("path");
      const __dirname = fileURLToPath2(new URL(".", import.meta.url));
      const fixturePath = join5(__dirname, "../../fixtures/github-sample.json");
      const { readFileSync: readFileSync5 } = await import("fs");
      ghProfile = JSON.parse(readFileSync5(fixturePath, "utf8"));
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
        const OAUTH_BASE2 = "https://terminalhire.com";
        const webUrl = `${OAUTH_BASE2}/api/auth/github?next=/dashboard`;
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
    if (process.env["JPI_SKIP_PEER_PROMPT"] !== "1") try {
      const { maybePromptPeerConnect: maybePromptPeerConnect2 } = await Promise.resolve().then(() => (init_peer_connect_prompt(), peer_connect_prompt_exports));
      await maybePromptPeerConnect2({ login: ghProfile.login });
    } catch {
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
export {
  run
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
