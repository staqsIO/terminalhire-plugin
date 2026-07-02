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

// src/web-session.ts
var web_session_exports = {};
__export(web_session_exports, {
  clearWebSessionFile: () => clearWebSessionFile,
  readWebSessionCookie: () => readWebSessionCookie,
  readWebSessionFile: () => readWebSessionFile,
  webSessionFilePath: () => webSessionFilePath,
  writeWebSessionFile: () => writeWebSessionFile
});
import {
  chmodSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync
} from "fs";
import { homedir } from "os";
import { join } from "path";
function terminalhireDir() {
  return join(homedir(), ".terminalhire");
}
function webSessionFilePath() {
  return join(terminalhireDir(), "web-session");
}
function readWebSessionFile() {
  try {
    const path = webSessionFilePath();
    if (!existsSync(path)) return null;
    const v = readFileSync(path, "utf8").trim();
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
function writeWebSessionFile(token) {
  mkdirSync(terminalhireDir(), { recursive: true });
  const path = webSessionFilePath();
  writeFileSync(path, token, { mode: 384, encoding: "utf8" });
  try {
    chmodSync(path, 384);
  } catch {
  }
}
function clearWebSessionFile() {
  try {
    rmSync(webSessionFilePath());
  } catch {
  }
}
var init_web_session = __esm({
  "src/web-session.ts"() {
    "use strict";
  }
});

// src/config.ts
var config_exports = {};
__export(config_exports, {
  getNudgeMode: () => getNudgeMode,
  isContributeEnabled: () => isContributeEnabled,
  isContributePrompted: () => isContributePrompted,
  isInboundNudgeMuted: () => isInboundNudgeMuted,
  isPeerConnectEnabled: () => isPeerConnectEnabled,
  parseNudgeMode: () => parseNudgeMode,
  readConfig: () => readConfig,
  writeConfig: () => writeConfig
});
import { readFileSync as readFileSync2, writeFileSync as writeFileSync2, mkdirSync as mkdirSync2, existsSync as existsSync2 } from "fs";
import { join as join2 } from "path";
import { homedir as homedir2 } from "os";
function readConfig() {
  try {
    if (!existsSync2(CONFIG_FILE)) return { ...DEFAULT_CONFIG };
    const raw = readFileSync2(CONFIG_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_CONFIG, ...parsed };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}
function writeConfig(config) {
  mkdirSync2(TERMINALHIRE_DIR, { recursive: true });
  const current = readConfig();
  const merged = { ...current, ...config };
  writeFileSync2(CONFIG_FILE, JSON.stringify(merged, null, 2) + "\n", "utf8");
}
function parseNudgeMode(raw) {
  if (raw === "session" || raw === "always") return raw;
  const m = /^every:(\d+)$/.exec(raw);
  if (m) {
    const n = parseInt(m[1], 10);
    if (n >= 1) return `every:${n}`;
  }
  return null;
}
function getNudgeMode() {
  const envVal = process.env["TERMINALHIRE_NUDGE"];
  if (envVal) {
    const parsed = parseNudgeMode(envVal);
    if (parsed) return parsed;
  }
  const config = readConfig();
  return config.nudge ?? "session";
}
function isPeerConnectEnabled() {
  return readConfig().peerConnect === true;
}
function isInboundNudgeMuted() {
  return readConfig().inboundNudgeMuted === true;
}
function isContributeEnabled() {
  return readConfig().contributeEnabled === true;
}
function isContributePrompted() {
  return readConfig().contributePrompted === true;
}
var TERMINALHIRE_DIR, CONFIG_FILE, DEFAULT_CONFIG;
var init_config = __esm({
  "src/config.ts"() {
    "use strict";
    TERMINALHIRE_DIR = join2(homedir2(), ".terminalhire");
    CONFIG_FILE = join2(TERMINALHIRE_DIR, "config.json");
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

// bin/version-nudge.js
var version_nudge_exports = {};
__export(version_nudge_exports, {
  buildStaleNudge: () => buildStaleNudge,
  cachedStaleNudge: () => cachedStaleNudge,
  compareVersions: () => compareVersions,
  parseVersion: () => parseVersion,
  readLatestVersionFromCache: () => readLatestVersionFromCache,
  readLocalVersion: () => readLocalVersion
});
import { readFileSync as readFileSync3, existsSync as existsSync3 } from "fs";
import { join as join3 } from "path";
import { homedir as homedir3 } from "os";
import { fileURLToPath } from "url";
function parseVersion(v) {
  if (typeof v !== "string") return null;
  const m = v.trim().replace(/^v/, "").match(/^(\d+)\.(\d+)\.(\d+)/);
  if (!m) return null;
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}
function compareVersions(a, b) {
  const pa = parseVersion(a);
  const pb = parseVersion(b);
  if (!pa || !pb) return null;
  for (let i = 0; i < 3; i++) {
    if (pa[i] < pb[i]) return -1;
    if (pa[i] > pb[i]) return 1;
  }
  return 0;
}
function buildStaleNudge(local, latest) {
  if (compareVersions(local, latest) !== -1) return null;
  return `your terminalhire CLI is behind (${local} \u2192 ${latest}) \u2014 npm i -g terminalhire@latest`;
}
function readLocalVersion() {
  try {
    const candidates = [
      join3(__dirname, "..", "..", "package.json"),
      join3(__dirname, "..", "package.json")
    ];
    for (const p of candidates) {
      if (existsSync3(p)) {
        const pkg = JSON.parse(readFileSync3(p, "utf8"));
        if (pkg.version) return pkg.version;
      }
    }
  } catch {
  }
  return null;
}
function readLatestVersionFromCache() {
  try {
    const cache = JSON.parse(readFileSync3(INDEX_CACHE_FILE, "utf8"));
    const v = cache?.index?.cliVersion;
    return typeof v === "string" ? v : null;
  } catch {
    return null;
  }
}
function cachedStaleNudge(localVersion) {
  const local = localVersion ?? readLocalVersion();
  if (!local) return null;
  return buildStaleNudge(local, readLatestVersionFromCache());
}
var __dirname, INDEX_CACHE_FILE;
var init_version_nudge = __esm({
  "bin/version-nudge.js"() {
    "use strict";
    __dirname = fileURLToPath(new URL(".", import.meta.url));
    INDEX_CACHE_FILE = join3(process.env.TERMINALHIRE_DIR || join3(homedir3(), ".terminalhire"), "index-cache.json");
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
  let args5;
  if (process.platform === "darwin") {
    cmd = "open";
    args5 = [url];
  } else if (process.platform === "win32") {
    cmd = "cmd";
    args5 = ["/c", "start", "", url];
  } else {
    cmd = "xdg-open";
    args5 = [url];
  }
  try {
    const child = spawn(cmd, args5, { stdio: "ignore", detached: true });
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
  readFileSync as readFileSync4,
  writeFileSync as writeFileSync3,
  mkdirSync as mkdirSync3,
  existsSync as existsSync4,
  rmSync as rmSync2
} from "fs";
import { join as join4 } from "path";
import { homedir as homedir4 } from "os";
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
  mkdirSync3(TERMINALHIRE_DIR2, { recursive: true });
  if (existsSync4(KEY_FILE)) {
    return Buffer.from(readFileSync4(KEY_FILE, "utf8").trim(), "hex");
  }
  const key = randomBytes(KEY_BYTES);
  writeFileSync3(KEY_FILE, key.toString("hex"), { mode: 384, encoding: "utf8" });
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
  if (!existsSync4(TOKEN_FILE)) return void 0;
  try {
    const key = await loadKey();
    const raw = readFileSync4(TOKEN_FILE, "utf8");
    const blob = JSON.parse(raw);
    return decrypt(blob, key);
  } catch {
    return void 0;
  }
}
async function writeGitHubToken(token) {
  mkdirSync3(TERMINALHIRE_DIR2, { recursive: true });
  const key = await loadKey();
  const blob = encrypt(token, key);
  writeFileSync3(TOKEN_FILE, JSON.stringify(blob, null, 2), { encoding: "utf8" });
}
async function deleteGitHubToken() {
  try {
    rmSync2(TOKEN_FILE);
  } catch {
  }
}
async function hasGitHubToken() {
  return existsSync4(TOKEN_FILE);
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
var TERMINALHIRE_DIR2, TOKEN_FILE, KEY_FILE, ALGO, KEY_BYTES, IV_BYTES, GITHUB_SCOPE, DEVICE_CODE_URL, ACCESS_TOKEN_URL, BAKED_IN_CLIENT_ID, MOCK_TOKEN, MOCK_LOGIN;
var init_github_auth = __esm({
  "src/github-auth.ts"() {
    "use strict";
    TERMINALHIRE_DIR2 = join4(homedir4(), ".terminalhire");
    TOKEN_FILE = join4(TERMINALHIRE_DIR2, "github-token.enc");
    KEY_FILE = join4(TERMINALHIRE_DIR2, "key");
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
  async function run22() {
    for (; ; ) {
      const i = next++;
      if (i >= items.length) return;
      results[i] = await fn(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: workers }, run22));
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
import { readFileSync as readFileSync5 } from "fs";
import { join as join5 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
function resolveDataPath() {
  try {
    const dir = fileURLToPath2(new URL("../../../data", import.meta.url));
    return join5(dir, "partner-roles.json");
  } catch {
    return join5(process.cwd(), "data", "partner-roles.json");
  }
}
function loadPartnerRoles() {
  const filePath = resolveDataPath();
  try {
    const raw = readFileSync5(filePath, "utf-8");
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
function composeIntroEmail(args5) {
  const subject = `New intro request from @${args5.requesterLogin} \xB7 terminalhire`;
  const text = `@${args5.requesterLogin} wants an intro to you on terminalhire.

Sign in to view the request and choose whether to share your contact back:
${args5.dashboardUrl}

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
function composeIntroAcceptedEmail(args5) {
  const subject = `Intro connected with @${args5.counterpartyLogin} \xB7 terminalhire`;
  const lead = args5.recipientRole === "requester" ? `@${args5.counterpartyLogin} accepted your intro request on terminalhire.` : `You accepted @${args5.counterpartyLogin}'s intro request on terminalhire.`;
  const text = `${lead}

You can now reach them directly:
    @${args5.counterpartyLogin} \u2014 ${args5.counterpartyContact}

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
  return (arg, ...args5) => {
    const val = map.get(arg);
    if (val !== void 0)
      return val;
    const computed = fn(arg, ...args5);
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
  const randomBytes6 = eddsaOpts.randomBytes || randomBytes2;
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
  function randomSecretKey(seed = randomBytes6(lengths.seed)) {
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
      function wrappedCipher(key, ...args5) {
        abytes2(key);
        if (!isLE)
          throw new Error("Non little-endian hardware is not yet supported");
        if (params.nonceLength !== void 0) {
          const nonce = args5[0];
          if (!nonce)
            throw new Error("nonce / iv required");
          if (params.varSizeNonce)
            abytes2(nonce);
          else
            abytes2(nonce, params.nonceLength);
        }
        const tagl = params.tagLength;
        if (tagl && args5[1] !== void 0) {
          abytes2(args5[1]);
        }
        const cipher = constructor(key, ...args5);
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
var SCHEMA_VERSION;
var init_schema = __esm({
  "../../packages/core/src/episodes/schema.ts"() {
    "use strict";
    SCHEMA_VERSION = 1;
  }
});

// ../../packages/core/src/episodes/doors.ts
function recruiterMetric(value) {
  return { value };
}
function inwardMetric(value) {
  return { value };
}
function metricValue(metric) {
  return metric.value;
}
function declassify(metrics, coveragePct = 0) {
  const velocity = metrics.skillAdoptionVelocity.value;
  const drift = metrics.distributionDrift.value;
  const recency = metrics.recencySplit.value;
  return {
    schemaVersion: SCHEMA_VERSION,
    headline: {
      distinctSignalCount: velocity.distinctSignalCount,
      recentAdoptionCount: velocity.recentAdoptionCount,
      velocityPerWeek: velocity.velocityPerWeek,
      rising: drift.rising.map((entry) => ({ signal: entry.signal, delta: entry.delta })),
      falling: drift.falling.map((entry) => ({ signal: entry.signal, delta: entry.delta }))
    },
    liveStack: [...recency.live],
    dormantStack: [...recency.dormant],
    coveragePct
  };
}
function buildExport(metrics, coveragePct = 0) {
  return declassify(metrics, coveragePct);
}
var init_doors = __esm({
  "../../packages/core/src/episodes/doors.ts"() {
    "use strict";
    init_schema();
  }
});

// ../../packages/core/src/episodes/node-model.ts
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function asString(value, fallback = "") {
  return typeof value === "string" ? value : fallback;
}
function asStringOrNull(value) {
  return typeof value === "string" ? value : null;
}
function asBool(value) {
  return value === true;
}
function parseBlock(raw) {
  if (!isRecord(raw)) {
    return { type: "unknown", rawType: typeof raw };
  }
  const t = raw.type;
  if (t === "text") {
    return { type: "text", text: asString(raw.text) };
  }
  if (t === "tool_use") {
    return { type: "tool_use", id: asString(raw.id), name: asString(raw.name), input: raw.input };
  }
  if (t === "tool_result") {
    return {
      type: "tool_result",
      toolUseId: asString(raw.tool_use_id),
      content: raw.content,
      isError: asBool(raw.is_error)
    };
  }
  return { type: "unknown", rawType: typeof t === "string" ? t : String(t) };
}
function parseContent(content) {
  if (typeof content === "string") {
    return content.length > 0 ? [{ type: "text", text: content }] : [];
  }
  if (Array.isArray(content)) {
    return content.map(parseBlock);
  }
  return [];
}
function toNode(raw, opts = {}) {
  if (!isRecord(raw)) {
    if (opts.strict) {
      throw new Error(`toNode: node is not an object (got ${typeof raw})`);
    }
    return makeUnknown(emptyBase(), typeof raw);
  }
  const message = isRecord(raw.message) ? raw.message : void 0;
  const content = parseContent(message?.content);
  const base = {
    uuid: asString(raw.uuid),
    parentUuid: asStringOrNull(raw.parentUuid),
    sessionId: asString(raw.sessionId),
    cwd: asString(raw.cwd),
    gitBranch: asString(raw.gitBranch),
    timestamp: asString(raw.timestamp),
    isSidechain: asBool(raw.isSidechain),
    userType: asString(raw.userType),
    role: asString(message?.role),
    content,
    text: content.reduce((acc, b) => b.type === "text" ? [...acc, b.text] : acc, []).join("\n")
  };
  const type = raw.type;
  if (type === "summary" || asBool(raw.isCompactSummary) || isRecord(raw.compactMetadata)) {
    return { ...base, kind: "summary" /* Summary */, toolName: null, toolUseId: null, isError: false, rawType: asString(type, "summary") };
  }
  if (type === "system") {
    return { ...base, kind: "system" /* System */, toolName: null, toolUseId: null, isError: false, rawType: "system" };
  }
  if (type === "user") {
    const tr = content.find((b) => b.type === "tool_result");
    if (tr) {
      return { ...base, kind: "tool_result" /* ToolResult */, toolName: null, toolUseId: tr.toolUseId, isError: tr.isError, rawType: "user" };
    }
    return { ...base, kind: "user" /* User */, toolName: null, toolUseId: null, isError: false, rawType: "user" };
  }
  if (type === "assistant") {
    const tu = content.find((b) => b.type === "tool_use");
    if (tu) {
      return { ...base, kind: "tool_use" /* ToolUse */, toolName: tu.name, toolUseId: tu.id, isError: false, rawType: "assistant" };
    }
    return { ...base, kind: "assistant" /* Assistant */, toolName: null, toolUseId: null, isError: false, rawType: "assistant" };
  }
  const rawType = typeof type === "string" ? type : String(type);
  if (opts.strict) {
    throw new Error(`toNode: unrecognized node kind: ${rawType}`);
  }
  return makeUnknown(base, rawType);
}
function makeUnknown(base, rawType) {
  return { ...base, kind: "unknown" /* Unknown */, toolName: null, toolUseId: null, isError: false, rawType };
}
function emptyBase() {
  return {
    uuid: "",
    parentUuid: null,
    sessionId: "",
    cwd: "",
    gitBranch: "",
    timestamp: "",
    isSidechain: false,
    userType: "",
    role: "",
    content: [],
    text: ""
  };
}
var init_node_model = __esm({
  "../../packages/core/src/episodes/node-model.ts"() {
    "use strict";
  }
});

// ../../packages/core/src/episodes/derivers/signals.ts
function mcpToolSignal(name) {
  const rest = name.slice("mcp__".length);
  const sep = rest.indexOf("__");
  if (sep <= 0) return "mcp:custom";
  const server = rest.slice(0, sep).toLowerCase();
  const leaf = rest.slice(sep + 2);
  if (leaf.length === 0) return "mcp:custom";
  if (MCP_SERVER_CAPABILITY.has(server)) return MCP_SERVER_CAPABILITY.get(server) ?? null;
  return "mcp:custom";
}
function classifyToolSignal(name) {
  if (name.toLowerCase().startsWith("mcp__")) {
    return mcpToolSignal(name);
  }
  const key = name.toLowerCase();
  if (ORCHESTRATION_TOOLS.has(key)) return AGENTIC_WORKFLOW_SIGNAL;
  return null;
}
function isRecord2(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function fileExtLang(input) {
  if (!isRecord2(input)) {
    return null;
  }
  const filePath = input.file_path;
  if (typeof filePath !== "string") {
    return null;
  }
  const dot = filePath.lastIndexOf(".");
  if (dot < 0 || dot === filePath.length - 1) {
    return null;
  }
  const ext = filePath.slice(dot + 1).toLowerCase();
  return EXT_LANG[ext] ?? null;
}
function toolUseInput(node) {
  const block = node.content.find((b) => b.type === "tool_use");
  return block?.input;
}
function compareSignal(a, b) {
  if (a.ts !== b.ts) {
    return a.ts < b.ts ? -1 : 1;
  }
  if (a.signal !== b.signal) {
    return a.signal < b.signal ? -1 : 1;
  }
  return 0;
}
function extractToolSignals(nodes) {
  const out = [];
  for (const node of nodes) {
    if (node.kind !== "tool_use" /* ToolUse */ || node.toolName === null) {
      continue;
    }
    const toolSignal = classifyToolSignal(node.toolName);
    if (toolSignal !== null) {
      out.push({ signal: toolSignal, ts: node.timestamp });
    }
    const lang = fileExtLang(toolUseInput(node));
    if (lang !== null) {
      out.push({ signal: `lang:${lang}`, ts: node.timestamp });
    }
  }
  out.sort(compareSignal);
  return out;
}
var EXT_LANG, MCP_SERVER_CAPABILITY, ORCHESTRATION_TOOLS, AGENTIC_WORKFLOW_SIGNAL;
var init_signals = __esm({
  "../../packages/core/src/episodes/derivers/signals.ts"() {
    "use strict";
    init_node_model();
    EXT_LANG = {
      ts: "ts",
      tsx: "ts",
      js: "js",
      jsx: "js",
      mjs: "js",
      cjs: "js",
      py: "py",
      rs: "rs",
      go: "go",
      rb: "rb",
      java: "java",
      kt: "kt",
      sql: "sql",
      md: "md"
    };
    MCP_SERVER_CAPABILITY = /* @__PURE__ */ new Map([
      // Coding-relevant public servers → a capability.
      ["plugin_playwright_playwright", "cap:ui-automation"],
      ["playwright", "cap:ui-automation"],
      ["claude_ai_linear", "cap:project-mgmt"],
      ["claude_ai_vercel", "cap:deploys"],
      ["plugin_vercel_vercel", "cap:deploys"],
      ["claude_ai_figma", "cap:design"],
      ["figma", "cap:design"],
      ["pencil", "cap:design"],
      ["claude_ai_ideabrowser", "cap:product-research"],
      ["ideabrowser", "cap:product-research"],
      ["blender", "cap:3d-modeling"],
      ["n8n-knowledge", "cap:workflow-automation"],
      // Public but NOT a coding skill → dropped from the trajectory.
      ["plugin_context-mode_context-mode", null],
      // agent context plumbing
      ["claude_ai_gmail", null],
      ["claude_ai_google_calendar", null],
      ["claude_ai_google_drive", null]
    ]);
    ORCHESTRATION_TOOLS = /* @__PURE__ */ new Set([
      "task",
      "agent",
      "workflow",
      "enterworktree",
      "exitworktree",
      "schedulewakeup",
      "monitor",
      "sendmessage",
      "taskcreate",
      "tasklist",
      "taskstop",
      "taskupdate",
      "taskget",
      "taskoutput",
      "croncreate",
      "cronlist",
      "crondelete"
    ]);
    AGENTIC_WORKFLOW_SIGNAL = "cap:agentic-workflow";
  }
});

// ../../packages/core/src/episodes/derivers/recency-split.ts
function deriveRecencySplit(nodes, opts = {}) {
  const signals = extractToolSignals(nodes);
  const lastSeen = /* @__PURE__ */ new Map();
  for (const s of signals) {
    const cur = lastSeen.get(s.signal);
    if (cur === void 0 || s.ts > cur) {
      lastSeen.set(s.signal, s.ts);
    }
  }
  const maxTs = signals.length > 0 ? signals[signals.length - 1].ts : "";
  const now = opts.now ?? maxTs;
  const thresholdDays = opts.thresholdDays ?? DORMANT_THRESHOLD_DAYS;
  const nowMs = now !== "" ? Date.parse(now) : 0;
  const live = [];
  const dormant = [];
  for (const [signal, ts] of [...lastSeen.entries()].sort((a, b) => a[0] < b[0] ? -1 : 1)) {
    const ageDays2 = now !== "" ? (nowMs - Date.parse(ts)) / DAY_MS : 0;
    if (ageDays2 <= thresholdDays) {
      live.push(signal);
    } else {
      dormant.push(signal);
    }
  }
  return recruiterMetric({ now, thresholdDays, live, dormant });
}
var DAY_MS, DORMANT_THRESHOLD_DAYS;
var init_recency_split = __esm({
  "../../packages/core/src/episodes/derivers/recency-split.ts"() {
    "use strict";
    init_doors();
    init_signals();
    DAY_MS = 864e5;
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
    const ageDays2 = (nowMs - Date.parse(mostRecent)) / DAY_MS2;
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
var DAY_MS2, GENERIC_ROLE, ROLE_BY_DOMAIN, CONCEPT_TAGS, DISPLAY_LABEL;
var init_legible = __esm({
  "../../packages/core/src/credential/legible.ts"() {
    "use strict";
    init_contribution_gate();
    init_vocabulary();
    init_recency_split();
    DAY_MS2 = 864e5;
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
  readFileSync as readFileSync6,
  writeFileSync as writeFileSync4,
  mkdirSync as mkdirSync4,
  existsSync as existsSync5
} from "fs";
import { join as join6 } from "path";
import { homedir as homedir5 } from "os";
async function loadKey2() {
  try {
    const kt = await import("keytar");
    const stored = await kt.getPassword("terminalhire", "profile-key");
    if (stored) {
      return Buffer.from(stored, "hex");
    }
    const key2 = randomBytes4(KEY_BYTES2);
    await kt.setPassword("terminalhire", "profile-key", key2.toString("hex"));
    return key2;
  } catch {
  }
  mkdirSync4(TERMINALHIRE_DIR3, { recursive: true });
  if (existsSync5(KEY_FILE2)) {
    return Buffer.from(readFileSync6(KEY_FILE2, "utf8").trim(), "hex");
  }
  const key = randomBytes4(KEY_BYTES2);
  writeFileSync4(KEY_FILE2, key.toString("hex"), { mode: 384, encoding: "utf8" });
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
  mkdirSync4(TERMINALHIRE_DIR3, { recursive: true });
  const key = await loadKey2();
  profile.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
  profile.skillTags = deriveSkillTags(profile.tagWeights);
  const blob = encrypt2(JSON.stringify(profile), key);
  writeFileSync4(PROFILE_FILE, JSON.stringify(blob, null, 2), { encoding: "utf8" });
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
  const { rmSync: rmSync5 } = await import("fs");
  try {
    rmSync5(PROFILE_FILE);
  } catch {
  }
  try {
    rmSync5(KEY_FILE2);
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
var TERMINALHIRE_DIR3, PROFILE_FILE, KEY_FILE2, ALGO2, KEY_BYTES2, IV_BYTES2, DECAY_HALF_LIFE_MS, LANGUAGE_TAGS, MIN_FINGERPRINT_SCORE;
var init_profile = __esm({
  "src/profile.ts"() {
    "use strict";
    init_src();
    TERMINALHIRE_DIR3 = join6(homedir5(), ".terminalhire");
    PROFILE_FILE = join6(TERMINALHIRE_DIR3, "profile.enc");
    KEY_FILE2 = join6(TERMINALHIRE_DIR3, "key");
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
  ask: ask3
} = {}) {
  const promptOnce = ask3 ? async (q) => String(await ask3(q) ?? "").trim().toLowerCase() : async (q) => {
    const rl = createInterface({ input, output });
    const a = await new Promise((resolve2) => {
      rl.question(q, (x) => {
        rl.close();
        resolve2(x);
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
    OAUTH_BASE = "https://www.terminalhire.com";
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
      const { fileURLToPath: fileURLToPath8 } = await import("url");
      const { join: join31 } = await import("path");
      const __dirname7 = fileURLToPath8(new URL(".", import.meta.url));
      const fixturePath = join31(__dirname7, "../../fixtures/github-sample.json");
      const { readFileSync: readFileSync27 } = await import("fs");
      ghProfile = JSON.parse(readFileSync27(fixturePath, "utf8"));
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
        const OAUTH_BASE3 = "https://www.terminalhire.com";
        const webUrl = `${OAUTH_BASE3}/api/auth/github?next=/dashboard`;
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
var init_jpi_login = __esm({
  "bin/jpi-login.js"() {
    "use strict";
    init_open_url();
  }
});

// bin/job-status-store.js
import {
  readFileSync as readFileSync7,
  writeFileSync as writeFileSync5,
  renameSync,
  mkdirSync as mkdirSync5,
  existsSync as existsSync6,
  copyFileSync,
  openSync,
  closeSync,
  unlinkSync
} from "fs";
import { join as join7, dirname } from "path";
import { homedir as homedir6 } from "os";
function atomicWriteJson(path, obj) {
  mkdirSync5(dirname(path), { recursive: true });
  const tmp = `${path}.tmp-${process.pid}`;
  writeFileSync5(tmp, JSON.stringify(obj, null, 2) + "\n", "utf8");
  renameSync(tmp, path);
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
      mkdirSync5(dirname(LOCK_FILE), { recursive: true });
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
  if (!existsSync6(STATUS_FILE)) return {};
  let raw;
  try {
    raw = readFileSync7(STATUS_FILE, "utf8");
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
    const next = setStatus(current, id, status);
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
    TERMINALHIRE_DIR4 = process.env.TERMINALHIRE_DIR || join7(homedir6(), ".terminalhire");
    STATUS_FILE = join7(TERMINALHIRE_DIR4, "job-status.json");
    LOCK_FILE = `${STATUS_FILE}.lock`;
    BAK_FILE = `${STATUS_FILE}.bak`;
  }
});

// bin/jpi-jobs.js
var jpi_jobs_exports = {};
__export(jpi_jobs_exports, {
  VALID_STATUS_FILTERS: () => VALID_STATUS_FILTERS,
  appliedThisWeek: () => appliedThisWeek,
  applyStatusView: () => applyStatusView,
  run: () => run2,
  statusLabel: () => statusLabel
});
import { readFileSync as readFileSync8, writeFileSync as writeFileSync6, mkdirSync as mkdirSync6 } from "fs";
import { join as join8 } from "path";
import { homedir as homedir7 } from "os";
import { createInterface as createInterface2 } from "readline";
import { fileURLToPath as fileURLToPath3 } from "url";
function applyStatusView(decorated, filter) {
  if (!filter) return decorated.filter((d) => d.jobStatus?.status !== "dismissed");
  switch (filter) {
    case "applied":
    case "saved":
    case "dismissed":
      return decorated.filter((d) => d.jobStatus?.status === filter);
    case "clicked":
      return decorated.filter((d) => d.jobStatus?.clicked === true);
    case "unactioned":
      return decorated.filter(
        (d) => !d.jobStatus || !d.jobStatus.clicked && !d.jobStatus.status
      );
    default:
      return decorated;
  }
}
function statusLabel(rec) {
  if (!rec) return "";
  if (rec.status) return ` [${rec.status}]`;
  if (rec.clicked) return " [clicked]";
  return "";
}
function appliedThisWeek(statusMap, now = Date.now()) {
  const weekAgo = now - 7 * 24 * 60 * 60 * 1e3;
  let n = 0;
  for (const rec of Object.values(statusMap)) {
    if (rec && rec.status === "applied" && rec.markedAt && Date.parse(rec.markedAt) >= weekAgo) {
      n++;
    }
  }
  return n;
}
function readIndexCache() {
  try {
    const raw = readFileSync8(INDEX_CACHE_FILE2, "utf8");
    const entry = JSON.parse(raw);
    if (Date.now() - entry.ts < INDEX_TTL_MS) return entry.index;
    return null;
  } catch {
    return null;
  }
}
function writeIndexCache(index) {
  mkdirSync6(TERMINALHIRE_DIR5, { recursive: true });
  writeFileSync6(INDEX_CACHE_FILE2, JSON.stringify({ ts: Date.now(), index }), "utf8");
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
  const rl = createInterface2({ input: process.stdin, output: process.stdout });
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
  const label = statusLabel(result.jobStatus);
  console.log(`
${i + 1}. ${titleStr} \u2014 ${job.company}${mode}${label}`);
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
function handleMark() {
  const id = args[1];
  const status = args[2];
  const VALID = ["applied", "saved", "dismissed"];
  if (!id || !id.includes(":")) {
    console.error(
      "terminalhire jobs mark: expected a job id like 'greenhouse:acme-123' (shown as `id:` in `jobs` output)."
    );
    process.exit(1);
  }
  if (!VALID.includes(status)) {
    console.error(
      `terminalhire jobs mark: status must be one of ${VALID.join(", ")} (got '${status ?? ""}').`
    );
    process.exit(1);
  }
  markStatus(id, status);
  console.log(`Marked ${id} as ${status}.`);
}
async function run2() {
  try {
    if (args[0] === "mark") {
      handleMark();
      return;
    }
    if (STATUS_FILTER !== null && !VALID_STATUS_FILTERS.includes(STATUS_FILTER)) {
      console.error(
        `terminalhire jobs: --status must be one of ${VALID_STATUS_FILTERS.join(", ")} (got '${STATUS_FILTER}').`
      );
      process.exit(1);
    }
    const { readProfile: readProfile2, profileToFingerprint: profileToFingerprint2 } = await Promise.resolve().then(() => (init_profile(), profile_exports));
    const { match: match2, decorate: decorate2, pageMatches: pageMatches2, funnelCounts: funnelCounts2 } = await Promise.resolve().then(() => (init_src(), src_exports));
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
    const ranked = match2(fp, jobs, jobs.length, Date.now(), {
      acceptance: profile.acceptance
    });
    try {
      const cacheRaw = readFileSync8(INDEX_CACHE_FILE2, "utf8");
      const cacheEntry = JSON.parse(cacheRaw);
      cacheEntry.matchCount = ranked.length;
      writeFileSync6(INDEX_CACHE_FILE2, JSON.stringify(cacheEntry), "utf8");
    } catch {
    }
    if (ranked.length === 0) {
      console.log("No matching roles found for your current profile.");
      console.log("  Your tags: " + profile.skillTags.join(", "));
      return;
    }
    const statusMap = readStatusMap();
    const decorated = decorate2(ranked, statusMap);
    const view = applyStatusView(decorated, STATUS_FILTER);
    const pageSize = SHOW_ALL ? Math.max(1, view.length) : LIMIT;
    const pageNum = SHOW_ALL ? 1 : PAGE ?? 1;
    const pageInfo = pageMatches2(view, pageNum, pageSize);
    const shown = pageInfo.items;
    const filterNote = STATUS_FILTER ? ` (--status ${STATUS_FILTER})` : "";
    console.log(
      `
\u2726 ${ranked.length} role${ranked.length === 1 ? "" : "s"} matching your profile (local match \u2014 no data sent)${filterNote}
`
    );
    if (shown.length === 0) {
      console.log(
        STATUS_FILTER ? `  No roles with status "${STATUS_FILTER}".` : "  Nothing to show on this page."
      );
    }
    for (let i = 0; i < shown.length; i++) {
      printResult((pageInfo.page - 1) * pageInfo.limit + i, shown[i]);
    }
    if (pageInfo.hasNext) {
      console.log(
        `
\u2026 page ${pageInfo.page}/${pageInfo.totalPages} \u2014 next: terminalhire jobs --page ${pageInfo.page + 1}${STATUS_FILTER ? " --status " + STATUS_FILTER : ""}  (or --all for the whole list)`
      );
    }
    const counts = funnelCounts2(statusMap);
    if (counts.applied + counts.saved + counts.dismissed + counts.clicked > 0) {
      console.log(
        `
\u{1F4CA} Funnel (local only): applied ${appliedThisWeek(statusMap)} this week \xB7 ${counts.applied} applied \xB7 ${counts.saved} saved \xB7 ${counts.clicked} clicked \xB7 ${counts.dismissed} dismissed`
      );
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
    console.log("  Tip: terminalhire jobs mark <id> applied|saved|dismissed  to track your funnel.");
    const pick = await prompt(
      `
Enter a number to act on a role, or press Enter to exit: `
    );
    const absIdx = parseInt(pick, 10) - 1;
    const localIdx = absIdx - (pageInfo.page - 1) * pageInfo.limit;
    if (isNaN(absIdx) || localIdx < 0 || localIdx >= shown.length) {
      return;
    }
    const chosen = shown[localIdx];
    if (chosen.job.applyMode === "direct") {
      markClicked(chosen.job.id);
      console.log(`
Open this URL to apply directly (no data shared):
  ${chosen.job.url}`);
      console.log(`  (marked "clicked" locally \u2014 mark it applied with: terminalhire jobs mark ${chosen.job.id} applied)`);
    } else if (chosen.job.applyMode === "buyer-lead") {
      await handleBuyerLead(chosen.job, profile);
    }
  } catch (err) {
    console.error("terminalhire jobs error:", err.message ?? err);
    process.exit(1);
  }
}
var __dirname2, TERMINALHIRE_DIR5, INDEX_CACHE_FILE2, INDEX_TTL_MS, API_URL, DEFAULT_LIMIT, args, limitArg, LIMIT, REMOTE_ONLY, SHOW_ALL, pageArg, PAGE, statusArg, STATUS_FILTER, VALID_STATUS_FILTERS;
var init_jpi_jobs = __esm({
  "bin/jpi-jobs.js"() {
    "use strict";
    init_job_status_store();
    __dirname2 = fileURLToPath3(new URL(".", import.meta.url));
    TERMINALHIRE_DIR5 = process.env.TERMINALHIRE_DIR || join8(homedir7(), ".terminalhire");
    INDEX_CACHE_FILE2 = join8(TERMINALHIRE_DIR5, "index-cache.json");
    INDEX_TTL_MS = 15 * 60 * 1e3;
    API_URL = process.env["TERMINALHIRE_API_URL"] ?? process.env["JPI_API_URL"] ?? "https://terminalhire.com";
    DEFAULT_LIMIT = 10;
    args = process.argv.slice(2);
    limitArg = args.indexOf("--limit");
    LIMIT = limitArg !== -1 ? parseInt(args[limitArg + 1] ?? "10", 10) : DEFAULT_LIMIT;
    REMOTE_ONLY = args.includes("--remote-only");
    SHOW_ALL = args.includes("--all");
    pageArg = args.indexOf("--page");
    PAGE = pageArg !== -1 ? parseInt(args[pageArg + 1] ?? "1", 10) : null;
    statusArg = args.indexOf("--status");
    STATUS_FILTER = statusArg !== -1 ? args[statusArg + 1] ?? "" : null;
    VALID_STATUS_FILTERS = ["applied", "saved", "dismissed", "clicked", "unactioned"];
  }
});

// bin/directory.js
import { readFileSync as readFileSync9, writeFileSync as writeFileSync7, mkdirSync as mkdirSync7 } from "fs";
import { join as join9 } from "path";
import { homedir as homedir8 } from "os";
function readDirectoryCache() {
  try {
    const entry = JSON.parse(readFileSync9(DIRECTORY_CACHE_FILE, "utf8"));
    if (typeof entry.ts === "number" && Number.isFinite(entry.ts) && Date.now() - entry.ts < INDEX_TTL_MS2) {
      return { index: entry.index, ts: entry.ts };
    }
    return null;
  } catch {
    return null;
  }
}
function writeDirectoryCache(index) {
  mkdirSync7(TERMINALHIRE_DIR6, { recursive: true });
  writeFileSync7(DIRECTORY_CACHE_FILE, JSON.stringify({ ts: Date.now(), index }), "utf8");
}
function readProject() {
  try {
    return JSON.parse(readFileSync9(PROJECT_FILE, "utf8"));
  } catch {
    return null;
  }
}
function relativeTime(ts) {
  const secs = Math.max(0, Math.round((Date.now() - ts) / 1e3));
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.round(secs / 60);
  return mins < 60 ? `${mins}m ago` : `${Math.round(mins / 60)}h ago`;
}
async function fetchDirectory({ quiet = false } = {}) {
  const cached = readDirectoryCache();
  if (cached) {
    if (!quiet) console.log(`\u2713 Using cached directory (updated ${relativeTime(cached.ts)})`);
    return cached.index;
  }
  if (!quiet) console.log(`\u21BB Refreshing builder directory from ${API_URL2}/api/directory...`);
  const res = await fetch(`${API_URL2}/api/directory`, { signal: AbortSignal.timeout(1e4) });
  if (!res.ok) throw new Error(`/api/directory returned ${res.status}`);
  const index = await res.json();
  writeDirectoryCache(index);
  return index;
}
function reportMatched(results, fetchImpl = fetch) {
  try {
    const logins = [
      ...new Set(
        results.map((r) => r?.job?.company).filter((login) => typeof login === "string" && login.length > 0)
      )
    ];
    if (logins.length === 0) return;
    return Promise.resolve(
      fetchImpl(`${API_URL2}/api/directory/matched`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matched: logins }),
        signal: AbortSignal.timeout(3e3)
      })
    ).catch(() => {
    });
  } catch {
  }
}
function excludeOwnCard(results, ownLogin) {
  if (!Array.isArray(results)) return results;
  if (typeof ownLogin !== "string" || ownLogin.length === 0) return results;
  const own = ownLogin.toLowerCase();
  return results.filter((r) => {
    const handle = r?.job?.company;
    return typeof handle !== "string" || handle.toLowerCase() !== own;
  });
}
var TERMINALHIRE_DIR6, DIRECTORY_CACHE_FILE, PROJECT_FILE, INDEX_TTL_MS2, API_URL2;
var init_directory2 = __esm({
  "bin/directory.js"() {
    "use strict";
    TERMINALHIRE_DIR6 = process.env.TERMINALHIRE_DIR || join9(homedir8(), ".terminalhire");
    DIRECTORY_CACHE_FILE = join9(TERMINALHIRE_DIR6, "directory-cache.json");
    PROJECT_FILE = join9(TERMINALHIRE_DIR6, "project.json");
    INDEX_TTL_MS2 = 15 * 60 * 1e3;
    API_URL2 = process.env["TERMINALHIRE_API_URL"] ?? process.env["JPI_API_URL"] ?? "https://terminalhire.com";
  }
});

// bin/jpi-devs.js
var jpi_devs_exports = {};
__export(jpi_devs_exports, {
  reportMatched: () => reportMatched,
  run: () => run3
});
import { createInterface as createInterface3 } from "readline";
function prompt2(question) {
  const rl = createInterface3({ input: process.stdin, output: process.stdout });
  return new Promise((resolve2) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve2(answer.trim().toLowerCase());
    });
  });
}
function credentialUrl(job) {
  const u = job.url ?? "";
  return u.startsWith("http") ? u : `${API_URL3}${u}`;
}
function linkTitle2(title, url) {
  const isTTY = process.stdout.isTTY;
  const noColor = process.env["NO_COLOR"] !== void 0;
  if (isTTY && !noColor && url) return `\x1B]8;;${url}\x1B\\${title}\x1B]8;;\x1B\\`;
  return url ? `${title} (${url})` : title;
}
function printCard(i, result) {
  const { job, score, matchedTags, reason } = result;
  const url = credentialUrl(job);
  const kind = job.source === "project" ? "project" : "developer";
  const byline = job.source === "project" ? ` \xB7 by @${job.company}` : "";
  const scoreStr = score > 0 ? ` \xB7 match ${Math.round(score * 100)}%` : "";
  console.log(`
${i + 1}. ${linkTitle2(job.title, url)} \u2014 ${kind}${byline}${scoreStr}`);
  console.log(`   id: ${job.id}`);
  if (reason) console.log(`   ${reason}`);
  if (matchedTags && matchedTags.length) console.log(`   Tags matched: ${matchedTags.slice(0, 5).join(", ")}`);
  console.log(`   Profile: ${url}`);
}
async function run3() {
  try {
    const { match: match2 } = await Promise.resolve().then(() => (init_src(), src_exports));
    let fp;
    if (AS_PROJECT) {
      const project = readProject();
      if (!project) {
        console.log("\u2726 terminalhire devs --as-project: no project declared yet.");
        console.log('  Run `terminalhire project "<title>: <skills it needs>"` first, then come back.');
        return;
      }
      if (!project.skillTags || project.skillTags.length === 0) {
        console.log("\u2726 Your declared project has no recognized skills yet.");
        console.log("  Re-run `terminalhire project` with known stack names (react, go, postgres, ...).");
        return;
      }
      fp = { skillTags: project.skillTags, prefs: project.prefs ?? {} };
      console.log(`Ranking builders for your project: ${project.title}`);
    } else {
      const { readProfile: readProfile2, profileToFingerprint: profileToFingerprint2 } = await Promise.resolve().then(() => (init_profile(), profile_exports));
      const profile = await readProfile2();
      if (profile.skillTags.length === 0) {
        console.log("\u2726 terminalhire devs: no skill tags in your local profile yet.");
        console.log("  Run `terminalhire init` first to set up your profile, then come back.");
        console.log("  (Tags also accumulate as you work in Claude Code sessions.)");
        return;
      }
      fp = profileToFingerprint2(profile);
    }
    const index = await fetchDirectory();
    const cards = index.cards ?? [];
    if (cards.length === 0) {
      console.log("\nNo builders or projects published yet. Check back soon \u2014 the directory fills as devs publish.");
      return;
    }
    let results = match2(fp, cards, SHOW_ALL2 ? cards.length : LIMIT2);
    let ownLogin;
    try {
      const { readProfile: readProfile2 } = await Promise.resolve().then(() => (init_profile(), profile_exports));
      ownLogin = (await readProfile2())?.github?.login;
    } catch {
    }
    results = excludeOwnCard(results, ownLogin);
    if (results.length === 0) {
      console.log(`No matching builders or projects for your current ${AS_PROJECT ? "project" : "profile"}.`);
      console.log("  Your tags: " + fp.skillTags.join(", "));
      return;
    }
    reportMatched(results);
    console.log(
      `
\u2726 ${results.length} match${results.length === 1 ? "" : "es"} in the builder directory (local match \u2014 no data sent)
`
    );
    for (let i = 0; i < results.length; i++) {
      printCard(i, results[i]);
    }
    if (!process.stdin.isTTY) return;
    console.log("\n" + "\u2500".repeat(70));
    const pick = await prompt2(`
Enter a number to open a profile, or press Enter to exit: `);
    const idx = parseInt(pick, 10) - 1;
    if (Number.isNaN(idx) || idx < 0 || idx >= results.length) return;
    console.log(`
Open this public credential (no data shared):
  ${credentialUrl(results[idx].job)}`);
  } catch (err) {
    console.error("terminalhire devs error:", err.message ?? err);
    process.exit(1);
  }
}
var API_URL3, DEFAULT_LIMIT2, args2, limitArg2, LIMIT2, SHOW_ALL2, AS_PROJECT;
var init_jpi_devs = __esm({
  "bin/jpi-devs.js"() {
    "use strict";
    init_directory2();
    API_URL3 = process.env["TERMINALHIRE_API_URL"] ?? process.env["JPI_API_URL"] ?? "https://terminalhire.com";
    DEFAULT_LIMIT2 = 10;
    args2 = process.argv.slice(2);
    limitArg2 = args2.indexOf("--limit");
    LIMIT2 = limitArg2 !== -1 ? parseInt(args2[limitArg2 + 1] ?? "10", 10) : DEFAULT_LIMIT2;
    SHOW_ALL2 = args2.includes("--all");
    AS_PROJECT = args2.includes("--as-project");
  }
});

// bin/jpi-project.js
var jpi_project_exports = {};
__export(jpi_project_exports, {
  run: () => run4
});
import { readFileSync as readFileSync10, writeFileSync as writeFileSync8, mkdirSync as mkdirSync8 } from "fs";
import { join as join10 } from "path";
import { homedir as homedir9 } from "os";
import { createInterface as createInterface4 } from "readline";
function readProject2() {
  try {
    return JSON.parse(readFileSync10(PROJECT_FILE2, "utf8"));
  } catch {
    return null;
  }
}
function promptRaw(question) {
  const rl = createInterface4({ input: process.stdin, output: process.stdout });
  return new Promise((resolve2) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve2(answer.trim());
    });
  });
}
function splitDeclaration(line) {
  const m = line.match(/\s*[:：—]|\s-\s/);
  if (m && m.index !== void 0) {
    const title = line.slice(0, m.index).trim();
    const skillsRaw = line.slice(m.index + m[0].length).trim();
    return { title: title || line, skillsRaw: skillsRaw || line };
  }
  return { title: line, skillsRaw: line };
}
function tokenize5(skillsRaw) {
  return skillsRaw.split(/[,/]|\s+/).map((t) => t.trim()).filter(Boolean);
}
async function run4() {
  try {
    if (SHOW) {
      const existing = readProject2();
      if (!existing) {
        console.log("\u2726 terminalhire project: nothing declared yet.");
        console.log('  Run `terminalhire project "<title>: <skills it needs>"` to declare one.');
        return;
      }
      console.log(`
\u2726 Your project (local only \u2014 never sent):
`);
      console.log(`  ${existing.title}`);
      console.log(`  Skills: ${(existing.skillTags ?? []).join(", ") || "(none recognized)"}`);
      console.log(`  Declared: ${existing.createdAt ?? "unknown"}`);
      console.log(`
  Rank builders for it: terminalhire devs --as-project`);
      return;
    }
    const { normalize: normalize2 } = await Promise.resolve().then(() => (init_src(), src_exports));
    let declaration = declarationArg;
    if (!declaration) {
      if (!process.stdin.isTTY) {
        console.log("\u2726 terminalhire project: declare what you are building, e.g.");
        console.log('  terminalhire project "Realtime collab editor: react, typescript, websockets, postgres"');
        return;
      }
      console.log("Declare your project in one line \u2014 a short title and the stack/skills it needs.");
      console.log("Example: Realtime collab editor: react, typescript, websockets, postgres\n");
      declaration = await promptRaw("Project: ");
    }
    if (!declaration) {
      console.log("Nothing declared \u2014 run again with a one-line project.");
      return;
    }
    const { title, skillsRaw } = splitDeclaration(declaration);
    const skillTags = normalize2(tokenize5(skillsRaw));
    if (skillTags.length === 0) {
      console.log("\n\u2726 No recognized skills in that declaration.");
      console.log("  Use known stack names (e.g. react, typescript, go, postgres, kubernetes).");
      console.log("  Nothing was saved.");
      return;
    }
    const project = {
      title,
      declaration,
      skillTags,
      prefs: {},
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    mkdirSync8(TERMINALHIRE_DIR7, { recursive: true });
    writeFileSync8(PROJECT_FILE2, JSON.stringify(project, null, 2), "utf8");
    console.log(`
\u2726 Project saved locally (never sent): ${title}`);
    console.log(`  Skills: ${skillTags.join(", ")}`);
    console.log(`
  Rank builders for it: terminalhire devs --as-project`);
  } catch (err) {
    console.error("terminalhire project error:", err.message ?? err);
    process.exit(1);
  }
}
var TERMINALHIRE_DIR7, PROJECT_FILE2, args3, SHOW, declarationArg;
var init_jpi_project = __esm({
  "bin/jpi-project.js"() {
    "use strict";
    TERMINALHIRE_DIR7 = process.env.TERMINALHIRE_DIR || join10(homedir9(), ".terminalhire");
    PROJECT_FILE2 = join10(TERMINALHIRE_DIR7, "project.json");
    args3 = process.argv.slice(2);
    SHOW = args3.includes("--show");
    declarationArg = args3.filter((a) => !a.startsWith("--")).join(" ").trim();
  }
});

// bin/jpi-bounties.js
var jpi_bounties_exports = {};
__export(jpi_bounties_exports, {
  run: () => run5
});
import { readFileSync as readFileSync11, writeFileSync as writeFileSync9, mkdirSync as mkdirSync9 } from "fs";
import { join as join11 } from "path";
import { homedir as homedir10 } from "os";
import { createInterface as createInterface5 } from "readline";
function readIndexCache2() {
  try {
    const entry = JSON.parse(readFileSync11(INDEX_CACHE_FILE3, "utf8"));
    if (Date.now() - entry.ts < INDEX_TTL_MS3) return entry.index;
    return null;
  } catch {
    return null;
  }
}
function writeIndexCache2(index) {
  mkdirSync9(TERMINALHIRE_DIR8, { recursive: true });
  writeFileSync9(INDEX_CACHE_FILE3, JSON.stringify({ ts: Date.now(), index }), "utf8");
}
async function fetchIndex2() {
  const cached = readIndexCache2();
  if (cached) return cached;
  const res = await fetch(`${API_URL4}/api/index`, { signal: AbortSignal.timeout(1e4) });
  if (!res.ok) throw new Error(`/api/index returned ${res.status}`);
  const index = await res.json();
  writeIndexCache2(index);
  return index;
}
function prompt3(question) {
  const rl = createInterface5({ input: process.stdin, output: process.stdout });
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
function linkTitle3(title, url) {
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
${i + 1}. ${linkTitle3(job.title, job.url)}`);
  console.log(`   ${formatAmount(b)}${effort} \xB7 ${b.repoFullName ?? job.company}${stars}${scoreStr}${contend}`);
  if (reason) console.log(`   ${reason}`);
  if (matchedTags && matchedTags.length) console.log(`   Tags matched: ${matchedTags.slice(0, 5).join(", ")}`);
  console.log(`   id: ${job.id}`);
  console.log(`   Claim: ${b.claimUrl ?? job.url}`);
}
async function run5() {
  try {
    console.log(`Fetching bounty index from ${API_URL4}/api/index...`);
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
    const shown = SHOW_ALL3 ? bounties : bounties.slice(0, LIMIT3);
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
    if (!SHOW_ALL3 && bounties.length > shown.length) {
      console.log(`
\u2026and ${bounties.length - shown.length} more \u2014 run with --all to see every bounty.`);
    }
    if (!process.stdin.isTTY) return;
    console.log("\n" + "\u2500".repeat(70));
    const pick = await prompt3(`
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
var TERMINALHIRE_DIR8, INDEX_CACHE_FILE3, INDEX_TTL_MS3, API_URL4, DEFAULT_LIMIT3, args4, limitArg3, LIMIT3, PRICED_ONLY, SHOW_ALL3, WINNABLE_ONLY, EFFORT_LABEL;
var init_jpi_bounties = __esm({
  "bin/jpi-bounties.js"() {
    "use strict";
    TERMINALHIRE_DIR8 = process.env.TERMINALHIRE_DIR || join11(homedir10(), ".terminalhire");
    INDEX_CACHE_FILE3 = join11(TERMINALHIRE_DIR8, "index-cache.json");
    INDEX_TTL_MS3 = 15 * 60 * 1e3;
    API_URL4 = process.env["TERMINALHIRE_API_URL"] ?? process.env["JPI_API_URL"] ?? "https://terminalhire.com";
    DEFAULT_LIMIT3 = 15;
    args4 = process.argv.slice(2);
    limitArg3 = args4.indexOf("--limit");
    LIMIT3 = limitArg3 !== -1 ? parseInt(args4[limitArg3 + 1] ?? "15", 10) : DEFAULT_LIMIT3;
    PRICED_ONLY = args4.includes("--priced");
    SHOW_ALL3 = args4.includes("--all");
    WINNABLE_ONLY = args4.includes("--winnable");
    EFFORT_LABEL = { small: "small (~\xBD day)", medium: "medium (~1 day)", large: "large (multi-day)" };
  }
});

// bin/jpi-contribute.js
var jpi_contribute_exports = {};
__export(jpi_contribute_exports, {
  rankContributions: () => rankContributions,
  renderRow: () => renderRow,
  run: () => run6
});
import { readFileSync as readFileSync12, writeFileSync as writeFileSync10, mkdirSync as mkdirSync10 } from "fs";
import { join as join12 } from "path";
import { homedir as homedir11 } from "os";
import { createInterface as createInterface6 } from "readline";
function readIndexCache3() {
  try {
    const entry = JSON.parse(readFileSync12(INDEX_CACHE_FILE4, "utf8"));
    if (Date.now() - entry.ts < INDEX_TTL_MS4) return entry.index;
    return null;
  } catch {
    return null;
  }
}
function writeIndexCache3(index) {
  mkdirSync10(TERMINALHIRE_DIR9, { recursive: true });
  writeFileSync10(INDEX_CACHE_FILE4, JSON.stringify({ ts: Date.now(), index }), "utf8");
}
async function fetchIndex3(fetchImpl, useCache = true) {
  if (useCache) {
    const cached = readIndexCache3();
    if (cached) return cached;
  }
  const res = await fetchImpl(`${API_URL5}/api/index`, { signal: AbortSignal.timeout(1e4) });
  if (!res.ok) throw new Error(`/api/index returned ${res.status}`);
  const index = await res.json();
  if (useCache) writeIndexCache3(index);
  return index;
}
function defaultPrompt(question) {
  const rl = createInterface6({ input: process.stdin, output: process.stdout });
  return new Promise((resolve2) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve2(answer.trim().toLowerCase());
    });
  });
}
function rankContributions(fp, items) {
  if (!fp || !Array.isArray(items) || items.length === 0) return [];
  return match(fp, items, items.length);
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
function displayLanguage(job) {
  const tag = (job.tags ?? []).find((t) => LANGUAGES.has(String(t).toLowerCase()));
  return tag ?? "\u2014";
}
function linkTitle4(title, url) {
  const isTTY = process.stdout.isTTY;
  const noColor = process.env["NO_COLOR"] !== void 0;
  if (isTTY && !noColor && url) return `\x1B]8;;${url}\x1B\\${title}\x1B]8;;\x1B\\`;
  return url ? `${title} (${url})` : title;
}
function renderRow(i, result) {
  const job = result.job;
  const c = job.contribution ?? {};
  const repo = c.repoFullName ?? job.company ?? "";
  const num = c.issueNumber != null ? `#${c.issueNumber}` : "";
  const label = c.labels && c.labels.length ? c.labels[0] : "\u2014";
  const lang = displayLanguage(job);
  const scorePct = `match ${Math.round((result.score ?? 0) * 100)}%`;
  const line1 = `${i + 1}. ${linkTitle4(job.title, c.issueUrl ?? job.url)}`;
  const line2 = `   ${repo} \xB7 ${num} \xB7 ${label} \xB7 ${lang} \xB7 ${scorePct}`;
  return `${line1}
${line2}`;
}
async function run6(opts = {}) {
  const log = opts.log ?? console.log;
  const isTTY = opts.isTTY ?? Boolean(process.stdin.isTTY);
  const promptImpl = opts.prompt ?? defaultPrompt;
  const fetchImpl = opts.fetchImpl ?? globalThis.fetch;
  const useCache = opts.fetchImpl == null;
  try {
    if (!isContributeEnabled()) {
      if (isTTY) {
        const answer = await promptImpl(OPT_IN_PROMPT + " ");
        const yes = answer === "y" || answer === "yes";
        writeConfig(yes ? { contributeEnabled: true, contributePrompted: true } : { contributePrompted: true });
        if (!yes) return;
      } else {
        log(OPT_IN_PROMPT);
        writeConfig({ contributePrompted: true });
        return;
      }
    }
    const index = await fetchIndex3(fetchImpl, useCache);
    const items = Array.isArray(index?.contribute) ? index.contribute : [];
    const results = await rankLocally(items, opts.fingerprint);
    if (results.length === 0) {
      log(EMPTY_STATE);
      return;
    }
    log(HEADER);
    log("");
    for (let i = 0; i < results.length; i++) log(renderRow(i, results[i]));
  } catch (err) {
    console.error("terminalhire contribute error:", err?.message ?? err);
    process.exit(1);
  }
}
var TERMINALHIRE_DIR9, INDEX_CACHE_FILE4, INDEX_TTL_MS4, API_URL5, HEADER, OPT_IN_PROMPT, EMPTY_STATE, LANGUAGES;
var init_jpi_contribute = __esm({
  "bin/jpi-contribute.js"() {
    "use strict";
    init_src();
    init_config();
    TERMINALHIRE_DIR9 = process.env.TERMINALHIRE_DIR || join12(homedir11(), ".terminalhire");
    INDEX_CACHE_FILE4 = join12(TERMINALHIRE_DIR9, "index-cache.json");
    INDEX_TTL_MS4 = 15 * 60 * 1e3;
    API_URL5 = process.env["TERMINALHIRE_API_URL"] ?? process.env["JPI_API_URL"] ?? "https://terminalhire.com";
    HEADER = "Contribution opportunities \u2014 open issues where a merged PR actually counts toward your r\xE9sum\xE9.\nRepos \u226550\u2605 / \u226510 contributors \xB7 unassigned \xB7 merit-merge \xB7 matched locally to your stack.";
    OPT_IN_PROMPT = "Contribute is off. Turn it on to see open issues where a merged PR would count toward your r\xE9sum\xE9 \u2014\nmatched to your stack. Matching runs locally; your profile never leaves this machine. Enable? [y/N]";
    EMPTY_STATE = "Nothing clears the bar right now. We only list issues where a merged PR actually counts toward\nyour r\xE9sum\xE9 \u2014 so the list stays honest. Try again after the next refresh.";
    LANGUAGES = /* @__PURE__ */ new Set([
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
import { readFileSync as readFileSync13, writeFileSync as writeFileSync11, mkdirSync as mkdirSync11, renameSync as renameSync2, existsSync as existsSync7 } from "fs";
import { join as join13 } from "path";
import { homedir as homedir12 } from "os";
function nowISO() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function readClaims() {
  try {
    if (!existsSync7(CLAIMS_FILE)) return [];
    const data = JSON.parse(readFileSync13(CLAIMS_FILE, "utf8"));
    return Array.isArray(data?.claims) ? data.claims : [];
  } catch {
    return [];
  }
}
function writeClaims(claims) {
  mkdirSync11(TERMINALHIRE_DIR10, { recursive: true });
  const tmp = `${CLAIMS_FILE}.tmp`;
  const payload = { claims };
  writeFileSync11(tmp, JSON.stringify(payload, null, 2), "utf8");
  renameSync2(tmp, CLAIMS_FILE);
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
var TERMINALHIRE_DIR10, CLAIMS_FILE, TERMINAL_STATES;
var init_claims = __esm({
  "src/claims.ts"() {
    "use strict";
    TERMINALHIRE_DIR10 = join13(homedir12(), ".terminalhire");
    CLAIMS_FILE = join13(TERMINALHIRE_DIR10, "claims.json");
    TERMINAL_STATES = /* @__PURE__ */ new Set(["merged", "abandoned"]);
  }
});

// bin/jpi-claim.js
var jpi_claim_exports = {};
__export(jpi_claim_exports, {
  run: () => run7
});
import { readFileSync as readFileSync14, existsSync as existsSync8 } from "fs";
import { join as join14 } from "path";
import { homedir as homedir13 } from "os";
import { execFile } from "child_process";
import { promisify } from "util";
import { createInterface as createInterface7 } from "readline";
async function sh(cmd, args5, opts = {}) {
  const { stdout } = await pExecFile(cmd, args5, { ...opts, shell: false, maxBuffer: 16 * 1024 * 1024 });
  return String(stdout).trim();
}
async function confirm(question) {
  const rl = createInterface7({ input: process.stdin, output: process.stdout });
  try {
    const ans = await new Promise((resolve2) => rl.question(question, resolve2));
    return /^y(es)?$/i.test(String(ans).trim());
  } finally {
    rl.close();
  }
}
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
function findBountyInCache(bountyId) {
  try {
    if (!existsSync8(INDEX_CACHE_FILE5)) return null;
    const entry = JSON.parse(readFileSync14(INDEX_CACHE_FILE5, "utf8"));
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
  const pct2 = Math.round(rate.rate * 100);
  console.log(`
\u{1F4CA} Accepted-PR rate: ${rate.merged}/${rate.total} claims merged (${pct2}%)`);
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
    const body = issueNum ? `Closes #${issueNum}` : "";
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
async function run7() {
  const verb = process.argv[2];
  const { flags, positional } = parseArgs(process.argv.slice(3));
  const active = Boolean(flags.active);
  const json = Boolean(flags.json);
  try {
    switch (verb) {
      case "preview":
        await cmdPreview(positional[0], { json });
        break;
      case "record":
        await cmdRecord(positional[0]);
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
var TERMINALHIRE_DIR11, INDEX_CACHE_FILE5, GH_API, GH_HEADERS, pExecFile, VALUE_FLAGS;
var init_jpi_claim = __esm({
  "bin/jpi-claim.js"() {
    "use strict";
    TERMINALHIRE_DIR11 = process.env.TERMINALHIRE_DIR || join14(homedir13(), ".terminalhire");
    INDEX_CACHE_FILE5 = join14(TERMINALHIRE_DIR11, "index-cache.json");
    GH_API = "https://api.github.com";
    GH_HEADERS = { "User-Agent": "terminalhire-claim", Accept: "application/vnd.github+json" };
    pExecFile = promisify(execFile);
    VALUE_FLAGS = /* @__PURE__ */ new Set(["worktree", "branch"]);
  }
});

// ../../packages/core/src/episodes/parser.ts
function parseTranscript(text, opts = {}) {
  const nodes = [];
  const unknownKinds = /* @__PURE__ */ new Set();
  let malformedCount = 0;
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed.length === 0) {
      continue;
    }
    let raw;
    try {
      raw = JSON.parse(trimmed);
    } catch {
      malformedCount++;
      continue;
    }
    const node = toNode(raw, { strict: opts.strict });
    if (node.kind === "unknown" /* Unknown */) {
      unknownKinds.add(node.rawType);
    }
    nodes.push(node);
  }
  return { nodes, malformedCount, unknownKinds: [...unknownKinds] };
}
var init_parser = __esm({
  "../../packages/core/src/episodes/parser.ts"() {
    "use strict";
    init_node_model();
  }
});

// ../../packages/core/src/episodes/episode.ts
var init_episode = __esm({
  "../../packages/core/src/episodes/episode.ts"() {
    "use strict";
  }
});

// ../../packages/core/src/episodes/reconstructor.ts
function sidechainRatio(nodes) {
  if (nodes.length === 0) {
    return 0;
  }
  const n = nodes.reduce((acc, node) => node.isSidechain ? acc + 1 : acc, 0);
  return n / nodes.length;
}
function fileSessionId(nodes) {
  return nodes.length > 0 ? nodes[0].sessionId : "";
}
function byTimestamp(a, b) {
  return a.timestamp < b.timestamp ? -1 : a.timestamp > b.timestamp ? 1 : 0;
}
function isGenuineUserTurn(node) {
  return node.kind === "user" /* User */ && !node.isSidechain;
}
function boundMainSession(sessionId, nodes) {
  const ordered = [...nodes].sort(byTimestamp);
  const episodes = [];
  const leading = [];
  let current = null;
  for (const node of ordered) {
    if (isGenuineUserTurn(node)) {
      current = {
        sessionId,
        rootUuid: node.uuid,
        mainNodes: [...leading, node],
        sidechainNodes: [],
        joinedSidechainPaths: []
      };
      leading.length = 0;
      episodes.push(current);
    } else if (current) {
      current.mainNodes.push(node);
    } else {
      leading.push(node);
    }
  }
  if (leading.length > 0) {
    if (episodes.length > 0) {
      episodes[0].mainNodes.unshift(...leading);
    } else {
      episodes.push({
        sessionId,
        rootUuid: leading[0].uuid,
        mainNodes: [...leading],
        sidechainNodes: [],
        joinedSidechainPaths: []
      });
    }
  }
  return episodes;
}
function isCompaction(node) {
  return node.kind === "summary" /* Summary */;
}
function deriveLifecycle(mainNodes) {
  const meaningful = mainNodes.filter((n) => !isCompaction(n)).sort(byTimestamp);
  const hasWork = meaningful.some((n) => n.kind !== "user" /* User */);
  if (!hasWork) {
    return "open";
  }
  const last = meaningful[meaningful.length - 1];
  if (last.kind === "tool_result" /* ToolResult */ && last.isError) {
    return "abandoned";
  }
  if (last.kind === "assistant" /* Assistant */) {
    return "resolved";
  }
  return "updated";
}
function findAgentDispatchEpisodes(episodes) {
  const out = [];
  for (const ep of episodes) {
    for (const node of ep.mainNodes) {
      if (node.kind === "tool_use" /* ToolUse */ && node.toolName === AGENT_TOOL) {
        out.push({ episode: ep, ts: node.timestamp });
      }
    }
  }
  return out.sort((a, b) => a.ts < b.ts ? -1 : a.ts > b.ts ? 1 : 0);
}
function episodeContainingTs(episodes, ts) {
  let chosen = null;
  for (const ep of episodes) {
    const sorted = [...ep.mainNodes].sort(byTimestamp);
    const start = sorted[0]?.timestamp ?? "";
    const end = sorted[sorted.length - 1]?.timestamp ?? "";
    if (ts >= start && ts <= end) {
      return ep;
    }
    if (ts >= start) {
      chosen = ep;
    }
  }
  return chosen ?? (episodes.length > 0 ? episodes[episodes.length - 1] : null);
}
function finalize(build) {
  const mainSorted = [...build.mainNodes].sort(byTimestamp);
  const mainNodeUuids = mainSorted.map((n) => n.uuid);
  const sidechainNodeUuids = [...build.sidechainNodes].sort(byTimestamp).map((n) => n.uuid);
  const compactedNodeUuids = mainSorted.filter(isCompaction).map((n) => n.uuid);
  const start = mainSorted[0]?.timestamp ?? "";
  const end = mainSorted[mainSorted.length - 1]?.timestamp ?? "";
  return {
    id: build.rootUuid,
    sessionId: build.sessionId,
    rootUuid: build.rootUuid,
    lifecycle: deriveLifecycle(build.mainNodes),
    mainNodeUuids,
    sidechainNodeUuids,
    nodeUuids: [...mainNodeUuids, ...sidechainNodeUuids],
    joinedSidechainPaths: [...build.joinedSidechainPaths],
    compacted: compactedNodeUuids.length > 0,
    compactedNodeUuids,
    startTimestamp: start,
    endTimestamp: end
  };
}
function reconstruct(files, opts = {}) {
  const join31 = opts.joinSidechains !== false;
  const mains = [];
  const sidechains = [];
  for (const file of files) {
    const sessionId = fileSessionId(file.nodes);
    if (sidechainRatio(file.nodes) >= SIDECHAIN_FILE_THRESHOLD) {
      const firstTs = [...file.nodes].sort(byTimestamp)[0]?.timestamp ?? "";
      sidechains.push({ path: file.path, sessionId, nodes: file.nodes, firstTs });
    } else {
      mains.push(file);
    }
  }
  const mainNodesBySession = /* @__PURE__ */ new Map();
  for (const file of mains) {
    const sessionId = fileSessionId(file.nodes);
    const acc = mainNodesBySession.get(sessionId) ?? [];
    acc.push(...file.nodes);
    mainNodesBySession.set(sessionId, acc);
  }
  const episodesBySession = /* @__PURE__ */ new Map();
  for (const [sessionId, nodes] of mainNodesBySession) {
    episodesBySession.set(sessionId, boundMainSession(sessionId, nodes));
  }
  const orphanedSidechainPaths = [];
  const joinedPaths = /* @__PURE__ */ new Set();
  if (join31) {
    const sidechainsBySession = /* @__PURE__ */ new Map();
    for (const sc of sidechains) {
      const acc = sidechainsBySession.get(sc.sessionId) ?? [];
      acc.push(sc);
      sidechainsBySession.set(sc.sessionId, acc);
    }
    for (const [sessionId, group] of sidechainsBySession) {
      const parentEpisodes = episodesBySession.get(sessionId);
      if (!parentEpisodes || parentEpisodes.length === 0) {
        for (const sc of group) {
          orphanedSidechainPaths.push(sc.path);
        }
        continue;
      }
      const dispatches = findAgentDispatchEpisodes(parentEpisodes);
      const orderedScs = [...group].sort((a, b) => a.firstTs < b.firstTs ? -1 : a.firstTs > b.firstTs ? 1 : 0);
      orderedScs.forEach((sc, i) => {
        let target = null;
        if (dispatches.length > 0) {
          target = dispatches[Math.min(i, dispatches.length - 1)].episode;
        } else {
          target = episodeContainingTs(parentEpisodes, sc.firstTs);
        }
        if (target) {
          target.sidechainNodes.push(...sc.nodes);
          target.joinedSidechainPaths.push(sc.path);
          joinedPaths.add(sc.path);
        } else {
          orphanedSidechainPaths.push(sc.path);
        }
      });
    }
  } else {
    for (const sc of sidechains) {
      orphanedSidechainPaths.push(sc.path);
    }
  }
  const episodes = [];
  const compactedNodeUuids = [];
  for (const builds of episodesBySession.values()) {
    for (const build of builds) {
      const ep = finalize(build);
      episodes.push(ep);
      compactedNodeUuids.push(...ep.compactedNodeUuids);
    }
  }
  episodes.sort(
    (a, b) => a.startTimestamp < b.startTimestamp ? -1 : a.startTimestamp > b.startTimestamp ? 1 : 0
  );
  const classification = [
    ...mains.map((f) => ({
      path: f.path,
      sessionId: fileSessionId(f.nodes),
      role: "main",
      nodeCount: f.nodes.length,
      joined: false
    })),
    ...sidechains.map((sc) => ({
      path: sc.path,
      sessionId: sc.sessionId,
      role: "sidechain",
      nodeCount: sc.nodes.length,
      joined: joinedPaths.has(sc.path)
    }))
  ];
  return {
    episodes,
    files: classification,
    orphanedSidechainPaths,
    compactedNodeUuids
  };
}
var AGENT_TOOL, SIDECHAIN_FILE_THRESHOLD;
var init_reconstructor = __esm({
  "../../packages/core/src/episodes/reconstructor.ts"() {
    "use strict";
    init_node_model();
    AGENT_TOOL = "Agent";
    SIDECHAIN_FILE_THRESHOLD = 0.5;
  }
});

// ../../packages/core/src/episodes/coverage.ts
function pct(part, whole) {
  return whole === 0 ? 0 : part / whole * 100;
}
function computeCoverage(files, result) {
  const totalNodes = files.reduce((acc, f) => acc + f.nodes.length, 0);
  const nodeCountByPath = /* @__PURE__ */ new Map();
  for (const f of files) {
    nodeCountByPath.set(f.path, f.nodes.length);
  }
  const orphanedNodes = result.orphanedSidechainPaths.reduce(
    (acc, path) => acc + (nodeCountByPath.get(path) ?? 0),
    0
  );
  const attributedNodes = totalNodes - orphanedNodes;
  const compactedNodes = result.compactedNodeUuids.length;
  return {
    totalNodes,
    attributedNodes,
    orphanedNodes,
    compactedNodes,
    attributedPct: pct(attributedNodes, totalNodes),
    orphanedPct: pct(orphanedNodes, totalNodes),
    compactedPct: pct(compactedNodes, totalNodes)
  };
}
var init_coverage = __esm({
  "../../packages/core/src/episodes/coverage.ts"() {
    "use strict";
  }
});

// ../../packages/core/src/episodes/events.ts
var init_events = __esm({
  "../../packages/core/src/episodes/events.ts"() {
    "use strict";
    init_schema();
  }
});

// ../../packages/core/src/episodes/derivers/skill-adoption-velocity.ts
function deriveSkillAdoptionVelocity(nodes, opts = {}) {
  const signals = extractToolSignals(nodes);
  const firstSeen = /* @__PURE__ */ new Map();
  for (const s of signals) {
    const cur = firstSeen.get(s.signal);
    if (cur === void 0 || s.ts < cur) {
      firstSeen.set(s.signal, s.ts);
    }
  }
  const firstAppearances = [...firstSeen.entries()].map(([signal, ts]) => ({ signal, ts })).sort((a, b) => a.ts !== b.ts ? a.ts < b.ts ? -1 : 1 : a.signal < b.signal ? -1 : 1);
  const minTs = signals.length > 0 ? signals[0].ts : "";
  const maxTs = signals.length > 0 ? signals[signals.length - 1].ts : "";
  const now = opts.now ?? maxTs;
  const windowDays = opts.recentWindowDays ?? RECENT_WINDOW_DAYS;
  const spanDays = minTs !== "" && maxTs !== "" ? (Date.parse(maxTs) - Date.parse(minTs)) / DAY_MS3 : 0;
  const nowMs = now !== "" ? Date.parse(now) : 0;
  const recentAdoptionCount = now === "" ? 0 : firstAppearances.filter((f) => nowMs - Date.parse(f.ts) <= windowDays * DAY_MS3).length;
  const spanWeeks = spanDays / 7;
  const velocityPerWeek = spanWeeks > 0 ? firstSeen.size / spanWeeks : firstSeen.size;
  return recruiterMetric({
    distinctSignalCount: firstSeen.size,
    firstAppearances,
    recentAdoptionCount,
    spanDays,
    velocityPerWeek
  });
}
var DAY_MS3, RECENT_WINDOW_DAYS;
var init_skill_adoption_velocity = __esm({
  "../../packages/core/src/episodes/derivers/skill-adoption-velocity.ts"() {
    "use strict";
    init_doors();
    init_signals();
    DAY_MS3 = 864e5;
    RECENT_WINDOW_DAYS = 90;
  }
});

// ../../packages/core/src/episodes/derivers/distribution-drift.ts
function shareMap(signals) {
  const counts = /* @__PURE__ */ new Map();
  for (const s of signals) {
    counts.set(s.signal, (counts.get(s.signal) ?? 0) + 1);
  }
  const total = signals.length > 0 ? signals.length : 1;
  const shares = /* @__PURE__ */ new Map();
  for (const [signal, count] of counts) {
    shares.set(signal, count / total);
  }
  return shares;
}
function deriveDistributionDrift(nodes) {
  const signals = extractToolSignals(nodes);
  const mid = Math.floor(signals.length / 2);
  const early = signals.slice(0, mid);
  const late = signals.slice(mid);
  const earlyShares = shareMap(early);
  const lateShares = shareMap(late);
  const all = /* @__PURE__ */ new Set([...earlyShares.keys(), ...lateShares.keys()]);
  const entries = [...all].map((signal) => {
    const earlyShare = earlyShares.get(signal) ?? 0;
    const lateShare = lateShares.get(signal) ?? 0;
    return { signal, earlyShare, lateShare, delta: lateShare - earlyShare };
  });
  const rising = entries.filter((e) => e.delta > 0).sort((a, b) => b.delta !== a.delta ? b.delta - a.delta : a.signal < b.signal ? -1 : 1);
  const falling = entries.filter((e) => e.delta < 0).sort((a, b) => a.delta !== b.delta ? a.delta - b.delta : a.signal < b.signal ? -1 : 1);
  return recruiterMetric({ rising, falling });
}
var init_distribution_drift = __esm({
  "../../packages/core/src/episodes/derivers/distribution-drift.ts"() {
    "use strict";
    init_doors();
    init_signals();
  }
});

// ../../packages/core/src/episodes/derivers/rework-density.ts
function isRecord3(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function filePathOf(node) {
  const block = node.content.find((b) => b.type === "tool_use");
  const input = block?.input;
  if (isRecord3(input) && typeof input.file_path === "string") {
    return input.file_path;
  }
  return null;
}
function deriveReworkDensity(episodes, nodesByUuid) {
  let totalEdits = 0;
  let reworkEdits = 0;
  let spansConsidered = 0;
  let spansSkipped = 0;
  for (const episode of episodes) {
    if (episode.compacted) {
      spansSkipped++;
      continue;
    }
    spansConsidered++;
    const seen = /* @__PURE__ */ new Set();
    for (const uuid of episode.mainNodeUuids) {
      const node = nodesByUuid.get(uuid);
      if (node === void 0 || node.kind !== "tool_use" /* ToolUse */ || node.toolName === null) {
        continue;
      }
      if (!EDIT_TOOLS.has(node.toolName)) {
        continue;
      }
      const filePath = filePathOf(node);
      if (filePath === null) {
        continue;
      }
      totalEdits++;
      if (seen.has(filePath)) {
        reworkEdits++;
      } else {
        seen.add(filePath);
      }
    }
  }
  const reworkRatio = totalEdits > 0 ? reworkEdits / totalEdits : 0;
  return inwardMetric({ totalEdits, reworkEdits, reworkRatio, spansConsidered, spansSkipped });
}
var EDIT_TOOLS;
var init_rework_density = __esm({
  "../../packages/core/src/episodes/derivers/rework-density.ts"() {
    "use strict";
    init_node_model();
    init_doors();
    EDIT_TOOLS = /* @__PURE__ */ new Set(["Edit", "Write", "NotebookEdit"]);
  }
});

// ../../packages/core/src/episodes/derivers/recovery-depth.ts
function deriveRecoveryDepth(episodes, nodesByUuid) {
  let maxConsecutiveErrors = 0;
  let totalDepth = 0;
  let recoveryChains = 0;
  let spansConsidered = 0;
  let spansSkipped = 0;
  for (const episode of episodes) {
    if (episode.compacted) {
      spansSkipped++;
      continue;
    }
    spansConsidered++;
    let run22 = 0;
    const closeChain = () => {
      if (run22 > 0) {
        recoveryChains++;
        totalDepth += run22;
        run22 = 0;
      }
    };
    for (const uuid of episode.mainNodeUuids) {
      const node = nodesByUuid.get(uuid);
      if (node === void 0) {
        continue;
      }
      if (node.kind === "tool_result" /* ToolResult */ && node.isError) {
        run22++;
        if (run22 > maxConsecutiveErrors) {
          maxConsecutiveErrors = run22;
        }
      } else if (node.kind === "tool_result" /* ToolResult */ && !node.isError) {
        closeChain();
      } else if (node.kind === "assistant" /* Assistant */) {
        closeChain();
      }
    }
    closeChain();
  }
  const meanRecoveryDepth = recoveryChains > 0 ? totalDepth / recoveryChains : 0;
  return inwardMetric({ maxConsecutiveErrors, meanRecoveryDepth, recoveryChains, spansConsidered, spansSkipped });
}
var init_recovery_depth = __esm({
  "../../packages/core/src/episodes/derivers/recovery-depth.ts"() {
    "use strict";
    init_node_model();
    init_doors();
  }
});

// ../../packages/core/src/episodes/index.ts
var init_episodes = __esm({
  "../../packages/core/src/episodes/index.ts"() {
    "use strict";
    init_node_model();
    init_parser();
    init_episode();
    init_reconstructor();
    init_coverage();
    init_schema();
    init_doors();
    init_events();
    init_signals();
    init_skill_adoption_velocity();
    init_distribution_drift();
    init_recency_split();
    init_rework_density();
    init_recovery_depth();
  }
});

// src/trajectory.ts
var trajectory_exports = {};
__export(trajectory_exports, {
  PUSH_DENYLIST: () => PUSH_DENYLIST,
  computeDerivedScore: () => computeDerivedScore,
  runTrajectory: () => runTrajectory,
  runTrajectoryPush: () => runTrajectoryPush
});
import {
  existsSync as existsSync9,
  mkdirSync as mkdirSync12,
  readFileSync as readFileSync15,
  readdirSync,
  writeFileSync as writeFileSync12
} from "fs";
import { homedir as homedir14 } from "os";
import { join as join15 } from "path";
function isRecord4(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function filePathOf2(node) {
  const block = node.content.find((b) => b.type === "tool_use");
  const input = block?.input;
  if (isRecord4(input) && typeof input.file_path === "string") {
    return input.file_path;
  }
  return null;
}
function slimNode(node) {
  if (node.kind === "tool_use" /* ToolUse */) {
    const fp = filePathOf2(node);
    const input = fp === null ? {} : { file_path: fp };
    const content = [
      { type: "tool_use", id: node.toolUseId ?? "", name: node.toolName ?? "", input }
    ];
    return { ...node, content, text: "" };
  }
  return { ...node, content: [], text: "" };
}
function findJsonlFiles(dir) {
  const out = [];
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true, encoding: "utf8" });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = join15(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...findJsonlFiles(full));
    } else if (entry.isFile() && entry.name.endsWith(".jsonl")) {
      out.push(full);
    }
  }
  return out;
}
function loadCorpus(paths) {
  const files = [];
  for (const path of paths) {
    let text;
    try {
      text = readFileSync15(path, "utf8");
    } catch {
      continue;
    }
    const parsed = parseTranscript(text);
    const nodes = parsed.nodes.map(slimNode);
    files.push({ path, nodes });
  }
  return files;
}
function isLang(signal) {
  return signal.startsWith("lang:");
}
function prettySignal(signal) {
  if (signal.startsWith("lang:")) return `.${signal.slice("lang:".length)}`;
  if (CAP_LABELS[signal]) return CAP_LABELS[signal];
  if (signal.startsWith("cap:")) return signal.slice("cap:".length).replace(/-/g, " ");
  return signal;
}
function prettyList(signals, max = 12) {
  if (signals.length === 0) return "(none)";
  const shown = signals.slice(0, max).map(prettySignal).join(", ");
  const extra = signals.length - max;
  return extra > 0 ? `${shown}, +${extra} more` : shown;
}
function round(n) {
  return Math.round(n);
}
function oneDecimal(n) {
  return (Math.round(n * 10) / 10).toFixed(1);
}
function coverageLine(view) {
  const attr = round(view.coverage.attributedPct);
  const sub = round(view.subagentPct);
  const comp = round(view.coverage.compactedPct);
  return `Built from ${view.sessions} session${view.sessions === 1 ? "" : "s"}; ${attr}% attributed, ${sub}% in subagent dispatches, ${comp}% compacted. Covers stack currency + trajectory \u2014 not seniority, impact, or judgment. Pair with a conversation.`;
}
function renderTerminal(view) {
  const h = view.score.headline;
  const rising = h.rising.map((e) => prettySignal(e.signal)).slice(0, 6);
  const falling = h.falling.map((e) => prettySignal(e.signal)).slice(0, 6);
  console.log("");
  console.log("  Trajectory \u2014 your code is your r\xE9sum\xE9");
  console.log("  " + "\u2500".repeat(68));
  console.log("");
  console.log("  \u258C Trajectory");
  console.log(
    `    ${h.distinctSignalCount} distinct tools/languages \xB7 ${h.recentAdoptionCount} adopted in the last 90d \xB7 ${oneDecimal(h.velocityPerWeek)} new/wk`
  );
  if (rising.length > 0) console.log(`    \u2191 rising:  ${rising.join(", ")}`);
  if (falling.length > 0) console.log(`    \u2193 falling: ${falling.join(", ")}`);
  console.log("");
  const liveLangs = view.score.liveStack.filter(isLang);
  const liveCaps = view.score.liveStack.filter((s) => !isLang(s));
  const dormantLangs = view.score.dormantStack.filter(isLang);
  console.log("  \u258C Stack (languages)");
  console.log(`    live (this quarter):      ${prettyList(liveLangs)}`);
  console.log(`    dormant (90d+ untouched): ${prettyList(dormantLangs)}`);
  console.log("");
  console.log("  \u258C Capabilities (tools & integrations)");
  console.log(`    ${prettyList(liveCaps)}`);
  console.log("");
  console.log("  \u258C Coverage / scope");
  console.log(`    ${coverageLine(view)}`);
  console.log("");
}
function renderMarkdown(view) {
  const h = view.score.headline;
  const rising = h.rising.map((e) => prettySignal(e.signal)).slice(0, 8);
  const falling = h.falling.map((e) => prettySignal(e.signal)).slice(0, 8);
  const lines = [];
  lines.push("# Trajectory");
  lines.push("");
  lines.push("> Your code is your r\xE9sum\xE9. Local-first, derived from your own Claude Code corpus.");
  lines.push("");
  lines.push("## Trajectory");
  lines.push("");
  lines.push(`- Distinct tools/languages: **${h.distinctSignalCount}**`);
  lines.push(`- Adopted in the last 90 days: **${h.recentAdoptionCount}**`);
  lines.push(`- Adoption velocity: **${oneDecimal(h.velocityPerWeek)} new/week**`);
  lines.push(`- Rising: ${rising.length > 0 ? rising.join(", ") : "_none_"}`);
  lines.push(`- Falling: ${falling.length > 0 ? falling.join(", ") : "_none_"}`);
  lines.push("");
  lines.push("## Stack (languages)");
  lines.push("");
  lines.push(`- **Live** (used this quarter): ${prettyList(view.score.liveStack.filter(isLang), 64)}`);
  lines.push(`- **Dormant** (90d+ untouched): ${prettyList(view.score.dormantStack.filter(isLang), 64)}`);
  lines.push("");
  lines.push("## Capabilities (tools & integrations)");
  lines.push("");
  lines.push(`- ${prettyList(view.score.liveStack.filter((s) => !isLang(s)), 64)}`);
  lines.push("");
  lines.push("## Coverage / scope");
  lines.push("");
  lines.push(coverageLine(view));
  lines.push("");
  return lines.join("\n");
}
function writeExportArtifacts(score, markdown) {
  const dir = join15(homedir14(), ".terminalhire");
  mkdirSync12(dir, { recursive: true });
  const jsonPath = join15(dir, "trajectory-export.json");
  const mdPath = join15(dir, "trajectory-export.md");
  writeFileSync12(jsonPath, JSON.stringify(score, null, 2) + "\n", "utf8");
  writeFileSync12(mdPath, markdown, "utf8");
  return { jsonPath, mdPath };
}
function renderInward(allNodes, view, files) {
  const result = reconstruct(files);
  const nodesByUuid = /* @__PURE__ */ new Map();
  for (const n of allNodes) nodesByUuid.set(n.uuid, n);
  const rework = metricValue(deriveReworkDensity(result.episodes, nodesByUuid));
  const recovery = metricValue(deriveRecoveryDepth(result.episodes, nodesByUuid));
  console.log("  \u258C Inward (private \u2014 never exported)");
  console.log(
    `    rework: ${rework.reworkEdits}/${rework.totalEdits} edits revisited (ratio ${oneDecimal(rework.reworkRatio * 100)}%) over ${rework.spansConsidered} spans (${rework.spansSkipped} compacted skipped)`
  );
  console.log(
    `    recovery: max chain ${recovery.maxConsecutiveErrors}, mean depth ${oneDecimal(recovery.meanRecoveryDepth)} over ${recovery.recoveryChains} chains (${recovery.spansConsidered} spans, ${recovery.spansSkipped} compacted skipped)`
  );
  console.log("");
}
function buildTrajectory() {
  const projectsDir = join15(homedir14(), ".claude", "projects");
  if (!existsSync9(projectsDir)) return null;
  const paths = findJsonlFiles(projectsDir);
  if (paths.length === 0) return null;
  const files = loadCorpus(paths);
  const allNodes = [];
  for (const f of files) {
    for (const n of f.nodes) allNodes.push(n);
  }
  const reconstructed = reconstruct(files);
  const coverage = computeCoverage(files, reconstructed);
  const velocity = deriveSkillAdoptionVelocity(allNodes);
  const drift = deriveDistributionDrift(allNodes);
  const recency = deriveRecencySplit(allNodes);
  const score = buildExport(
    {
      skillAdoptionVelocity: velocity,
      distributionDrift: drift,
      recencySplit: recency
    },
    round(coverage.attributedPct)
  );
  let sidechainNodes = 0;
  for (const n of allNodes) if (n.isSidechain) sidechainNodes++;
  const subagentPct = allNodes.length > 0 ? sidechainNodes / allNodes.length * 100 : 0;
  const sessions = new Set(reconstructed.files.map((f) => f.sessionId)).size;
  const view = { score, coverage, sessions, subagentPct, fileCount: files.length };
  return { view, allNodes, files };
}
function computeDerivedScore() {
  return buildTrajectory()?.view.score ?? null;
}
async function runTrajectory(opts) {
  const built = buildTrajectory();
  if (!built) {
    console.log("terminalhire trajectory: no transcripts found under ~/.claude/projects.");
    console.log("  Start a Claude Code session and your trajectory will appear here.");
    return;
  }
  const { view, allNodes, files } = built;
  renderTerminal(view);
  if (opts.inward) {
    renderInward(allNodes, view, files);
  }
  if (opts.export) {
    const markdown = renderMarkdown(view);
    const { jsonPath, mdPath } = writeExportArtifacts(view.score, markdown);
    console.log("  Export written:");
    console.log(`    ${jsonPath}`);
    console.log(`    ${mdPath}`);
    console.log("");
  }
}
function dashboardLinkUrl(serialized) {
  const payload = Buffer.from(serialized, "utf8").toString("base64url");
  return `${OAUTH_BASE2}/dashboard#link=${payload}`;
}
function scanDenylist(serialized) {
  const haystack = serialized.toLowerCase();
  return PUSH_DENYLIST.filter((needle) => haystack.includes(needle));
}
function defaultPushDeps() {
  return {
    computeScore: computeDerivedScore,
    readGithubLogin: async () => {
      try {
        const { readProfile: readProfile2 } = await Promise.resolve().then(() => (init_profile(), profile_exports));
        const profile = await readProfile2();
        return profile?.github?.login ?? null;
      } catch {
        return null;
      }
    },
    prompt: async (question) => {
      const { createInterface: createInterface13 } = await import("readline");
      const rl = createInterface13({ input: process.stdin, output: process.stdout });
      return new Promise((res) => {
        rl.question(question, (answer) => {
          rl.close();
          res(answer.trim().toLowerCase());
        });
      });
    },
    fetchImpl: (...args5) => globalThis.fetch(...args5),
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
function renderConsentCard(score, login, log) {
  const h = score.headline;
  const rising = h.rising.map((e) => prettySignal(e.signal)).slice(0, 6);
  const falling = h.falling.map((e) => prettySignal(e.signal)).slice(0, 6);
  log("");
  log("\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510");
  log("\u2502   terminalhire \u2014 link your trajectory (opt-in)                \u2502");
  log("\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518");
  log("");
  log(`  This shares your DERIVED trajectory for @${login} with your`);
  log("  terminalhire.com dashboard, shown next to your GitHub r\xE9sum\xE9:");
  log("");
  log(`    Distinct tools/languages : ${h.distinctSignalCount}`);
  log(`    Adopted in last 90d      : ${h.recentAdoptionCount}`);
  log(`    Adoption velocity        : ${oneDecimal(h.velocityPerWeek)} new/week`);
  log(`    Rising                   : ${rising.length ? rising.join(", ") : "(none)"}`);
  log(`    Falling                  : ${falling.length ? falling.join(", ") : "(none)"}`);
  log(`    Live stack               : ${prettyList(score.liveStack)}`);
  log(`    Dormant stack            : ${prettyList(score.dormantStack)}`);
  log(`    Coverage                 : ${score.coveragePct}%`);
  log("");
  log("  What is NEVER sent:");
  log("    - Raw transcripts, file contents, code, project/file names");
  log("    - Inward metrics (rework / recovery / fatigue) \u2014 local-only");
  log("");
  log("  This is the SAME derived score `terminalhire trajectory --export` writes.");
  log("  Not required to use terminalhire. Revoke any time: trajectory --push --delete");
  log("");
}
async function runTrajectoryPush(opts, overrides) {
  const deps = { ...defaultPushDeps(), ...overrides };
  const login = await deps.readGithubLogin();
  if (!login) {
    deps.log("");
    deps.log("  Not signed in. Run `terminalhire login` first, then re-run this command.");
    deps.log("");
    deps.exit(1);
    return;
  }
  const cookie = deps.sessionCookie();
  if (opts.delete) {
    const answer2 = await deps.prompt('  Unlink your trajectory from terminalhire.com? Type "yes" to confirm: ');
    if (answer2 !== "yes") {
      deps.log("\n  Aborted \u2014 nothing was changed.\n");
      deps.exit(0);
      return;
    }
    if (!cookie) {
      deps.log('\n  Open your dashboard and use "remove trajectory" there, or set a bridged');
      deps.log("  session. Nothing was sent.\n");
      deps.openBrowser(`${LINK_BASE}/dashboard`);
      deps.exit(0);
      return;
    }
    let res2;
    try {
      res2 = await deps.fetchImpl(`${LINK_BASE}/api/trajectory-sync`, {
        method: "DELETE",
        headers: { Cookie: `${GH_SESSION_COOKIE}=${cookie}` },
        signal: AbortSignal.timeout(1e4)
      });
    } catch (err) {
      deps.errorLog(`
  Unlink failed: ${err instanceof Error ? err.message : String(err)}
`);
      deps.exit(1);
      return;
    }
    if (!res2.ok) {
      deps.errorLog(`
  Unlink failed: /api/trajectory-sync returned ${res2.status}.
`);
      deps.exit(1);
      return;
    }
    deps.log("\n  Trajectory unlinked from terminalhire.com.\n");
    return;
  }
  const score = deps.computeScore();
  if (!score) {
    deps.log("");
    deps.log("  No trajectory to link yet \u2014 no transcripts under ~/.claude/projects.");
    deps.log("  Start a Claude Code session, then re-run `terminalhire trajectory --push`.");
    deps.log("");
    deps.exit(1);
    return;
  }
  renderConsentCard(score, login, deps.log);
  const answer = await deps.prompt('  Type "yes" to link your trajectory (anything else cancels): ');
  const consented = answer === "yes";
  if (!consented) {
    deps.log("\n  Cancelled \u2014 nothing was sent.\n");
    deps.exit(0);
    return;
  }
  const serialized = JSON.stringify(score);
  const hits = scanDenylist(serialized);
  if (hits.length > 0) {
    deps.errorLog(`
  Aborted: the derived score unexpectedly contains a private field (${hits.join(", ")}).`);
    deps.errorLog("  This should never happen \u2014 nothing was sent. Please report this.\n");
    deps.exit(1);
    return;
  }
  if (!cookie) {
    const url = dashboardLinkUrl(serialized);
    deps.log("  Opening your browser to finish linking\u2026");
    deps.log(`  \u2192 ${url}`);
    deps.openBrowser(url);
    deps.log("");
    deps.log("  (Sign in if prompted \u2014 your trajectory then appears on your dashboard.)");
    deps.log("");
    return;
  }
  let res;
  try {
    res = await deps.fetchImpl(`${LINK_BASE}/api/trajectory-sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: `${GH_SESSION_COOKIE}=${cookie}` },
      body: serialized,
      signal: AbortSignal.timeout(1e4)
    });
  } catch (err) {
    deps.errorLog(`
  Link failed: ${err instanceof Error ? err.message : String(err)}
`);
    deps.exit(1);
    return;
  }
  if (res.status === 401) {
    const url = dashboardLinkUrl(serialized);
    deps.log("\n  Your web session expired \u2014 opening your browser to re-auth and finish linking\u2026");
    deps.log(`  \u2192 ${url}
`);
    deps.openBrowser(url);
    return;
  }
  if (!res.ok) {
    deps.errorLog(`
  Link failed: /api/trajectory-sync returned ${res.status}.
`);
    deps.exit(1);
    return;
  }
  deps.log("\n  Trajectory linked. It now appears next to your r\xE9sum\xE9 on your dashboard.");
  deps.log(`  \u2192 ${LINK_BASE}/dashboard
`);
}
var CAP_LABELS, LINK_BASE, OAUTH_BASE2, GH_SESSION_COOKIE, PUSH_DENYLIST;
var init_trajectory = __esm({
  "src/trajectory.ts"() {
    "use strict";
    init_episodes();
    init_web_session();
    CAP_LABELS = {
      "cap:ui-automation": "UI automation",
      "cap:deploys": "Deployment",
      "cap:project-mgmt": "Project tracking",
      "cap:product-research": "Product research",
      "cap:design": "Design",
      "cap:3d-modeling": "3D modeling",
      "cap:workflow-automation": "Workflow automation",
      "cap:agentic-workflow": "Agent orchestration",
      "mcp:custom": "Private integrations"
    };
    LINK_BASE = process.env["TERMINALHIRE_API_URL"] || "https://www.terminalhire.com";
    OAUTH_BASE2 = "https://www.terminalhire.com";
    GH_SESSION_COOKIE = "__jpi_gh_session";
    PUSH_DENYLIST = ["rework", "recovery", "within_session", "fatigue", "vector", "mcp__"];
  }
});

// bin/jpi-trajectory.js
var jpi_trajectory_exports = {};
__export(jpi_trajectory_exports, {
  run: () => run8
});
async function run8() {
  try {
    const args5 = process.argv.slice(2);
    if (args5.includes("--push")) {
      const doDelete = args5.includes("--delete") || args5.includes("--unlink");
      const { runTrajectoryPush: runTrajectoryPush2 } = await Promise.resolve().then(() => (init_trajectory(), trajectory_exports));
      await runTrajectoryPush2({ delete: doDelete });
      return;
    }
    const doExport = args5.includes("--export");
    const inward = args5.includes("--inward");
    const { runTrajectory: runTrajectory2 } = await Promise.resolve().then(() => (init_trajectory(), trajectory_exports));
    await runTrajectory2({ export: doExport, inward });
  } catch (err) {
    console.error("terminalhire trajectory error:", err?.message ?? err);
    process.exit(1);
  }
}
var init_jpi_trajectory = __esm({
  "bin/jpi-trajectory.js"() {
    "use strict";
  }
});

// src/intro.ts
var intro_exports = {};
__export(intro_exports, {
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
      const { createInterface: createInterface13 } = await import("readline");
      const rl = createInterface13({ input: process.stdin, output: process.stdout });
      return new Promise((res) => {
        rl.question(question, (answer) => {
          rl.close();
          res(answer.trim().toLowerCase());
        });
      });
    },
    fetchImpl: (...args5) => globalThis.fetch(...args5),
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
function renderConsentCard2(payload, deps) {
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
async function runIntroRequest(args5, overrides) {
  const deps = { ...defaultIntroDeps(), ...overrides };
  const targetLogin = args5.targetLogin?.trim().replace(/^@/, "");
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
  const displayName = (args5.name ?? profile.displayName ?? requesterLogin).trim();
  const explicitContact = (args5.contact ?? "").trim();
  const contact = explicitContact || `@${requesterLogin}`;
  const payload = buildIntroPayload({
    requesterLogin,
    requesterDisplayName: displayName,
    requesterContact: contact,
    targetLogin,
    note: args5.note
  });
  renderConsentCard2(payload, deps);
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
    res = await deps.fetchImpl(`${LINK_BASE2}/api/intro/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: `${GH_SESSION_COOKIE2}=${cookie}` },
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
  const res = await deps.fetchImpl(`${LINK_BASE2}/api/intro/list`, {
    method: "GET",
    headers: { Cookie: `${GH_SESSION_COOKIE2}=${cookie}` },
    signal: AbortSignal.timeout(1e4)
  });
  if (!res.ok) throw new Error(`/api/intro/list returned ${res.status}`);
  const data = await res.json().catch(() => ({}));
  return data.intros ?? [];
}
async function runIntroDecision(args5, overrides) {
  const deps = { ...defaultIntroDeps(), ...overrides };
  let id = args5.id?.trim() ?? "";
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
  ${matches.length} pending requests from @${handle} \u2014 ${args5.action === "accept" ? "accepting" : "declining"} one (the rest are redundant duplicates).`);
    }
    id = matches[0].id;
  }
  let contact = "";
  let shareHandle = false;
  if (args5.action === "accept") {
    contact = (args5.contact ?? "").trim();
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
  const body = args5.action === "accept" ? shareHandle ? { introId: id, action: "accept" } : { introId: id, action: "accept", targetContact: contact } : { introId: id, action: "decline" };
  let res;
  try {
    res = await deps.fetchImpl(`${LINK_BASE2}/api/intro/accept`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: `${GH_SESSION_COOKIE2}=${cookie}` },
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
  if (args5.action === "decline") {
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
async function runIntroList(overrides) {
  const deps = { ...defaultIntroDeps(), ...overrides };
  const cookie = deps.sessionCookie();
  if (!cookie) {
    deps.log("\n  No linked web session found on this machine.");
    deps.log("  Run `terminalhire link` to connect this terminal to your account, then re-run.\n");
    deps.exit(0);
    return;
  }
  let res;
  try {
    res = await deps.fetchImpl(`${LINK_BASE2}/api/intro/list`, {
      method: "GET",
      headers: { Cookie: `${GH_SESSION_COOKIE2}=${cookie}` },
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
  if (!res.ok) {
    deps.errorLog(`
  Request failed: /api/intro/list returned ${res.status}.
`);
    deps.exit(1);
    return;
  }
  let data = {};
  try {
    data = await res.json();
  } catch {
  }
  const intros = data.intros ?? [];
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
}
var LINK_BASE2, GH_SESSION_COOKIE2, UUID_RE;
var init_intro2 = __esm({
  "src/intro.ts"() {
    "use strict";
    init_src();
    init_web_session();
    LINK_BASE2 = process.env["TERMINALHIRE_API_URL"] || "https://www.terminalhire.com";
    GH_SESSION_COOKIE2 = "__jpi_gh_session";
    UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  }
});

// bin/jpi-intro.js
var jpi_intro_exports = {};
__export(jpi_intro_exports, {
  run: () => run9
});
function readOption(args5, name) {
  const i = args5.indexOf(name);
  if (i === -1) return void 0;
  const v = args5[i + 1];
  return typeof v === "string" && !v.startsWith("--") ? v : void 0;
}
async function run9() {
  try {
    const args5 = process.argv.slice(2);
    if (args5.includes("--list")) {
      const { runIntroList: runIntroList2 } = await Promise.resolve().then(() => (init_intro2(), intro_exports));
      await runIntroList2();
      return;
    }
    const acceptId = readOption(args5, "--accept");
    const declineId = readOption(args5, "--decline");
    if (acceptId || declineId) {
      const contact2 = readOption(args5, "--contact");
      const name2 = readOption(args5, "--name");
      const { runIntroDecision: runIntroDecision2 } = await Promise.resolve().then(() => (init_intro2(), intro_exports));
      await runIntroDecision2({
        id: acceptId ?? declineId,
        action: acceptId ? "accept" : "decline",
        contact: contact2,
        name: name2
      });
      return;
    }
    const targetLogin = args5.find((a) => !a.startsWith("--"));
    const note = readOption(args5, "--note");
    const contact = readOption(args5, "--contact");
    const name = readOption(args5, "--name");
    const { runIntroRequest: runIntroRequest2 } = await Promise.resolve().then(() => (init_intro2(), intro_exports));
    await runIntroRequest2({ targetLogin, note, contact, name });
  } catch (err) {
    console.error("terminalhire intro error:", err?.message ?? err);
    process.exit(1);
  }
}
var init_jpi_intro = __esm({
  "bin/jpi-intro.js"() {
    "use strict";
  }
});

// src/chat-keystore.ts
import { existsSync as existsSync10, mkdirSync as mkdirSync13, readFileSync as readFileSync16, writeFileSync as writeFileSync13, rmSync as rmSync3 } from "fs";
import { homedir as homedir15 } from "os";
import { join as join16 } from "path";
async function loadOrCreateIdentity() {
  const key = await loadKey();
  if (existsSync10(IDENTITY_FILE)) {
    const blob2 = JSON.parse(readFileSync16(IDENTITY_FILE, "utf8"));
    return JSON.parse(decrypt(blob2, key));
  }
  const keypair = generateIdentityKeypair();
  mkdirSync13(TERMINALHIRE_DIR12, { recursive: true });
  const blob = encrypt(JSON.stringify(keypair), key);
  writeFileSync13(IDENTITY_FILE, JSON.stringify(blob, null, 2), { mode: 384, encoding: "utf8" });
  return keypair;
}
var TERMINALHIRE_DIR12, IDENTITY_FILE;
var init_chat_keystore = __esm({
  "src/chat-keystore.ts"() {
    "use strict";
    init_src();
    init_github_auth();
    TERMINALHIRE_DIR12 = join16(homedir15(), ".terminalhire");
    IDENTITY_FILE = join16(TERMINALHIRE_DIR12, "chat-identity.enc");
  }
});

// src/chat-client.ts
import { existsSync as existsSync11, mkdirSync as mkdirSync14, readFileSync as readFileSync17, writeFileSync as writeFileSync14 } from "fs";
import { homedir as homedir16 } from "os";
import { join as join17 } from "path";
function defaultReadPeerPins() {
  try {
    if (!existsSync11(PEERS_FILE)) return {};
    const parsed = JSON.parse(readFileSync17(PEERS_FILE, "utf8"));
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
  mkdirSync14(TERMINALHIRE_DIR13, { recursive: true });
  writeFileSync14(PEERS_FILE, JSON.stringify(pins, null, 2), { mode: 384, encoding: "utf8" });
}
function defaultChatClientDeps() {
  return {
    fetchImpl: (...args5) => globalThis.fetch(...args5),
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
      Cookie: `${GH_SESSION_COOKIE3}=${cookie}`
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
var CHAT_BASE, GH_SESSION_COOKIE3, TERMINALHIRE_DIR13, PEERS_FILE, REQUEST_TIMEOUT_MS, ChatNotLinkedError, ChatSessionExpiredError, SafetyNumberChangedError, ChatRequestError;
var init_chat_client = __esm({
  "src/chat-client.ts"() {
    "use strict";
    init_src();
    init_chat_keystore();
    init_web_session();
    CHAT_BASE = process.env["TERMINALHIRE_API_URL"] || "https://www.terminalhire.com";
    GH_SESSION_COOKIE3 = "__jpi_gh_session";
    TERMINALHIRE_DIR13 = join17(homedir16(), ".terminalhire");
    PEERS_FILE = join17(TERMINALHIRE_DIR13, "chat-peers.json");
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
import { existsSync as existsSync12, mkdirSync as mkdirSync15, readFileSync as readFileSync18, writeFileSync as writeFileSync15 } from "fs";
import { homedir as homedir17 } from "os";
import { join as join18 } from "path";
async function syncUnreadBadge(deps = {}) {
  const readCookie = deps.readCookie ?? readWebSessionCookie;
  const fetchImpl = deps.fetchImpl ?? globalThis.fetch;
  const cacheFile = deps.cacheFile ?? INDEX_CACHE_FILE6;
  try {
    const cookie = readCookie();
    if (!cookie || !existsSync12(cacheFile)) return;
    const res = await fetchImpl(`${CHAT_BASE2}/api/chat/inbox`, {
      method: "GET",
      headers: { Cookie: `${GH_SESSION_COOKIE4}=${cookie}` },
      signal: AbortSignal.timeout(2500)
    });
    if (!res.ok) return;
    const body = await res.json();
    const inbox = Array.isArray(body?.inbox) ? body.inbox : [];
    const total = inbox.reduce(
      (sum, it) => sum + (it && typeof it.unreadCount === "number" && it.unreadCount > 0 ? it.unreadCount : 0),
      0
    );
    const entry = JSON.parse(readFileSync18(cacheFile, "utf8"));
    entry.unreadChat = { count: total };
    writeFileSync15(cacheFile, JSON.stringify(entry), "utf8");
  } catch {
  }
}
function readReadCursors() {
  try {
    if (!existsSync12(READS_FILE)) return {};
    const parsed = JSON.parse(readFileSync18(READS_FILE, "utf8"));
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
  mkdirSync15(TERMINALHIRE_DIR14, { recursive: true });
  writeFileSync15(READS_FILE, JSON.stringify(cursors, null, 2), { mode: 384, encoding: "utf8" });
}
async function postReadCursor(peerLogin, lastReadAt, deps = {}) {
  const readCookie = deps.readCookie ?? readWebSessionCookie;
  const cookie = readCookie();
  if (!cookie) return;
  try {
    await fetch(`${CHAT_BASE2}/api/chat/read-cursor`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: `${GH_SESSION_COOKIE4}=${cookie}` },
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
function truncate(s, n) {
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
      const preview = it.preview ? truncate(sanitizeLine(it.preview), 38) : "";
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
var CHAT_BASE2, GH_SESSION_COOKIE4, TERMINALHIRE_DIR14, READS_FILE, INDEX_CACHE_FILE6, REACHABLE_DISPLAY;
var init_jpi_chat_read = __esm({
  "bin/jpi-chat-read.js"() {
    "use strict";
    init_chat_client();
    init_web_session();
    init_jpi_chat();
    CHAT_BASE2 = process.env["TERMINALHIRE_API_URL"] || "https://www.terminalhire.com";
    GH_SESSION_COOKIE4 = "__jpi_gh_session";
    TERMINALHIRE_DIR14 = process.env.TERMINALHIRE_DIR || join18(homedir17(), ".terminalhire");
    READS_FILE = join18(TERMINALHIRE_DIR14, "chat-reads.json");
    INDEX_CACHE_FILE6 = join18(TERMINALHIRE_DIR14, "index-cache.json");
    REACHABLE_DISPLAY = { shareActivity: false, optin: false, lastSeen: null };
  }
});

// bin/jpi-inbox.js
var jpi_inbox_exports = {};
__export(jpi_inbox_exports, {
  defaultDecideIntro: () => defaultDecideIntro,
  formatInbox: () => formatInbox,
  run: () => run10,
  runInboxPane: () => runInboxPane,
  runInboxTui: () => runInboxTui,
  sortConversations: () => sortConversations
});
async function defaultDecideIntro(req, overrides = {}) {
  const { runIntroDecision: runIntroDecision2 } = await Promise.resolve().then(() => (init_intro2(), intro_exports));
  let exited = false;
  let errReason = "";
  const logLines = [];
  const args5 = { id: `@${req.login}`, action: req.action };
  if (req.action === "accept" && req.contact) args5.contact = req.contact;
  await runIntroDecision2(args5, {
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
      const { prompt: prompt5, exit, log, errorLog, ...safe } = overrides;
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
        const preview = row.preview ? truncate2(sanitizeLine(row.preview), 34) : "";
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
  return CLEAR + lines.join("\n") + "\n";
}
function truncate2(s, n) {
  const t = String(s);
  return t.length <= n ? t : `${t.slice(0, n - 1)}\u2026`;
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
  return await new Promise((resolve2) => {
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
        case KEY_ENTER_A:
        case KEY_ENTER_B:
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
      if (s === KEY_ENTER_A || s === KEY_ENTER_B || s === "\r\n") {
        void submitDecision("accept", inputBuffer.trim());
        return;
      }
      if (s === KEY_BACKSPACE_A || s === KEY_BACKSPACE_B) {
        inputBuffer = inputBuffer.slice(0, -1);
        repaint();
        return;
      }
      for (const ch of s) {
        if (ch === KEY_BACKSPACE_A || ch === KEY_BACKSPACE_B) {
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
      if (s === KEY_CTRL_C) {
        finish({ action: "quit" });
        return;
      }
      if (s === KEY_ESC) {
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
      output.write(SHOW_CURSOR + EXIT_ALT);
    }
    function finish(result) {
      if (cleaned) return;
      cleanup();
      resolve2(result);
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
      output.write(ENTER_ALT + HIDE_CURSOR);
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
      resolve2({ action: "quit" });
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
async function run10(opts = {}) {
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
var HIDE_CURSOR, SHOW_CURSOR, ENTER_ALT, EXIT_ALT, CLEAR, INVERSE, RESET, BOLD, BOLD_OFF, KEY_CTRL_C, KEY_ESC, KEY_UP, KEY_DOWN, KEY_ENTER_A, KEY_ENTER_B, KEY_BACKSPACE_A, KEY_BACKSPACE_B, MAX_CONTACT_LEN, DEFAULT_REFRESH_MS;
var init_jpi_inbox = __esm({
  "bin/jpi-inbox.js"() {
    "use strict";
    init_chat_client();
    init_jpi_chat();
    init_jpi_chat_read();
    HIDE_CURSOR = "\x1B[?25l";
    SHOW_CURSOR = "\x1B[?25h";
    ENTER_ALT = "\x1B[?1049h";
    EXIT_ALT = "\x1B[?1049l";
    CLEAR = "\x1B[2J\x1B[H";
    INVERSE = "\x1B[7m";
    RESET = "\x1B[0m";
    BOLD = "\x1B[1m";
    BOLD_OFF = "\x1B[22m";
    KEY_CTRL_C = "";
    KEY_ESC = "\x1B";
    KEY_UP = "\x1B[A";
    KEY_DOWN = "\x1B[B";
    KEY_ENTER_A = "\r";
    KEY_ENTER_B = "\n";
    KEY_BACKSPACE_A = "\x7F";
    KEY_BACKSPACE_B = "\b";
    MAX_CONTACT_LEN = 200;
    DEFAULT_REFRESH_MS = 4e3;
  }
});

// bin/jpi-chat.js
var jpi_chat_exports = {};
__export(jpi_chat_exports, {
  CHAT_AT_REST: () => CHAT_AT_REST,
  CHAT_CODE_OF_CONDUCT: () => CHAT_CODE_OF_CONDUCT,
  CHAT_DISCLOSURE: () => CHAT_DISCLOSURE,
  CHAT_MIN_AGE: () => CHAT_MIN_AGE,
  defaultListConnections: () => defaultListConnections,
  defaultListPendingInvites: () => defaultListPendingInvites,
  defaultResolveConnection: () => defaultResolveConnection,
  ensureChatDisclosure: () => ensureChatDisclosure,
  formatPresence: () => formatPresence,
  formatThread: () => formatThread,
  readCachedSessionStale: () => readCachedSessionStale,
  relativeTime: () => relativeTime2,
  run: () => run11,
  runBlockCommand: () => runBlockCommand,
  runChatPane: () => runChatPane,
  runShareActivityCommand: () => runShareActivityCommand,
  sanitizeLine: () => sanitizeLine
});
import { createInterface as createInterface8 } from "readline";
import { existsSync as existsSync13, readFileSync as readFileSync19 } from "fs";
import { homedir as homedir18 } from "os";
import { join as join19 } from "path";
function sanitizeLine(text) {
  return String(text).replace(ANSI_CSI, "").replace(ANSI_OSC, "").replace(ANSI_OTHER, "").replace(C0_C1_DEL, "");
}
function defaultPromptAck({ input = process.stdin, output = process.stdout } = {}) {
  if (!input || input.isTTY !== true) return Promise.resolve(false);
  const rl = createInterface8({ input, output });
  return new Promise((resolve2) => {
    rl.question("  Press Enter to acknowledge and continue (Ctrl-C to cancel): ", () => {
      rl.close();
      resolve2(true);
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
      headers: { Cookie: `${GH_SESSION_COOKIE5}=${cookie}` },
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
function relativeTime2(then, now = /* @__PURE__ */ new Date()) {
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
    const rel = relativeTime2(presence.lastSeen, now);
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
  return CLEAR2 + lines.join("\n") + "\n";
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
    const p = join19(process.env.TERMINALHIRE_DIR || join19(homedir18(), ".terminalhire"), "index-cache.json");
    if (!existsSync13(p)) return false;
    const cache = JSON.parse(readFileSync19(p, "utf8"));
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
  const resolved = await resolveConnection(target);
  if (resolved.status === "not-linked") {
    output.write(
      "\n  No linked web session found on this machine.\n  Run `terminalhire link` to connect this terminal to your account, then re-run.\n\n"
    );
    return { entered: false, reason: "not-linked" };
  }
  if (resolved.status === "expired") {
    output.write(
      `
  Your web session expired \u2014 sign in again at ${CHAT_BASE3}/dashboard and re-bridge your session, then re-run.

`
    );
    return { entered: false, reason: "expired" };
  }
  if (resolved.status === "error") {
    output.write(`
  Could not check your connections: ${resolved.message}

`);
    return { entered: false, reason: "error" };
  }
  if (resolved.status === "not-connected") {
    output.write(
      `
  You are not connected to @${target}.
  Chat is only available for an accepted intro. Request one with:
    terminalhire intro ${target}

`
    );
    return { entered: false, reason: "not-connected" };
  }
  const { introId, peerLogin } = resolved;
  try {
    await client.ensureKeyPublished();
  } catch (err) {
    if (err instanceof ChatSessionExpiredError || err instanceof ChatNotLinkedError) {
      output.write(`
  ${err.message}

`);
      return { entered: false, reason: "session" };
    }
    output.write(`
  Could not open the chat: ${err instanceof Error ? err.message : String(err)}

`);
    return { entered: false, reason: "error" };
  }
  if (typeof client.fetchPeerKey === "function") {
    try {
      await client.fetchPeerKey(peerLogin);
    } catch (err) {
      if (err instanceof ChatSessionExpiredError || err instanceof ChatNotLinkedError) {
        output.write(`
  ${err.message}

`);
        return { entered: false, reason: "session" };
      }
      if (err instanceof SafetyNumberChangedError) {
        output.write(
          `
  \u26A0 The safety number for @${peerLogin} changed \u2014 the key on file no longer
  matches the server. Verify out of band before continuing. Chat not opened.

`
        );
        return { entered: false, reason: "safety-changed" };
      }
      if (err && err.name === "ChatRequestError" && err.status === 404) {
        output.write(
          `
  @${peerLogin} isn't reachable for chat yet.
  Chat is end-to-end encrypted, so they need to open chat once to
  publish their key. As soon as they run
    terminalhire chat
  on their side, messages will flow.

`
        );
        return { entered: false, reason: "no-key" };
      }
      output.write(`
  Could not open the chat: ${err instanceof Error ? err.message : String(err)}

`);
      return { entered: false, reason: "error" };
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
  return await new Promise((resolve2) => {
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
      output.write(SHOW_CURSOR2 + EXIT_ALT2);
    }
    function finish(reason) {
      if (cleaned) return;
      exitReason = reason;
      cleanup();
      output.write(DEPOSIT_CTA);
      resolve2({ entered: true, reason });
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
            resolve2({ entered: true, reason: "session-expired" });
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
              resolve2({ entered: true, reason: "session-expired" });
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
          resolve2({ entered: true, reason: "blocked" });
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
            resolve2({ entered: true, reason: "session-expired" });
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
      if (s === KEY_ESC2) {
        finish("back");
        return;
      }
      if (s.charCodeAt(0) === 27) return;
      for (const ch of s) {
        if (ch === KEY_CTRL_C2) {
          finish("sigint");
          return;
        }
        if (ch === KEY_CTRL_S) {
          void showSafetyNumber();
          continue;
        }
        if (ch === KEY_ENTER_A2 || ch === KEY_ENTER_B2) {
          const line = inputBuffer;
          inputBuffer = "";
          repaint();
          void submitLine(line);
          continue;
        }
        if (ch === KEY_BACKSPACE_A2 || ch === KEY_BACKSPACE_B2) {
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
      output.write(ENTER_ALT2 + HIDE_CURSOR2);
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
      resolve2({ entered: true, reason: "error" });
    }
  });
}
async function runBlockCommand(opts = {}) {
  const { login, action, client = createChatClient(), output = process.stdout } = opts;
  const target = String(login ?? "").replace(/^@/, "").trim();
  if (!target) {
    output.write("\n  Usage: terminalhire chat <github-login> --block|--unblock\n\n");
    return { ok: false, reason: "no-login" };
  }
  try {
    if (action === "block") {
      await client.blockPeer(target);
      output.write(
        `
  Blocked @${target}. They can no longer message you, fetch your key, or see
  your presence \u2014 and you can't chat with them until you unblock.
  Unblock anytime:  terminalhire chat ${target} --unblock

`
      );
    } else {
      await client.unblock(target);
      output.write(
        `
  Unblocked @${target}. You can chat again:  terminalhire chat ${target}

`
      );
    }
    return { ok: true, action, login: target };
  } catch (err) {
    if (err instanceof ChatSessionExpiredError || err instanceof ChatNotLinkedError) {
      output.write(`
  ${err.message}

`);
      return { ok: false, reason: "session" };
    }
    output.write(`
  Could not ${action} @${target}: ${err instanceof Error ? err.message : String(err)}

`);
    return { ok: false, reason: "error" };
  }
}
async function runShareActivityCommand(opts = {}) {
  const {
    value,
    client = createChatClient(),
    output = process.stdout,
    writeCfg = writeConfig
  } = opts;
  const v = String(value ?? "").trim().toLowerCase();
  if (v !== "on" && v !== "off") {
    output.write("\n  Usage: terminalhire chat --share-activity on|off\n\n");
    return { ok: false, reason: "usage" };
  }
  const share = v === "on";
  try {
    await client.setActivitySharing(share);
  } catch (err) {
    if (err instanceof ChatSessionExpiredError || err instanceof ChatNotLinkedError) {
      output.write(`
  ${err.message}

`);
      return { ok: false, reason: "session" };
    }
    output.write(
      `
  Could not update activity sharing: ${err instanceof Error ? err.message : String(err)}

`
    );
    return { ok: false, reason: "error" };
  }
  try {
    writeCfg({ chatShareActivity: share });
  } catch {
  }
  if (share) {
    output.write(
      '\n  \u2713 Connections can now see your activity \u2014 when you were last active (e.g. "seen 2h ago").\n  Turn off anytime:  terminalhire chat --share-activity off\n\n'
    );
  } else {
    output.write(
      "\n  \u2713 Your activity is now hidden. Connections see only that you're reachable.\n\n"
    );
  }
  return { ok: true, share };
}
async function run11() {
  const args5 = process.argv.slice(2);
  let login;
  let limit = 8;
  let sendText;
  let wantAll = false;
  let wantInbox = false;
  let wantRead = false;
  let wantBlock = false;
  let wantUnblock = false;
  let shareActivityValue;
  for (let i = 0; i < args5.length; i++) {
    const a = args5[i];
    if (a === "--inbox") wantInbox = true;
    else if (a === "--read") wantRead = true;
    else if (a === "--all") wantAll = true;
    else if (a === "--block") wantBlock = true;
    else if (a === "--unblock") wantUnblock = true;
    else if (a === "--share-activity") shareActivityValue = args5[++i];
    else if (a === "--send") sendText = args5[++i];
    else if (a === "-n") {
      const v = parseInt(args5[++i], 10);
      if (Number.isFinite(v) && v > 0) limit = v;
    } else if (!a.startsWith("-")) {
      if (login === void 0) login = a;
    }
  }
  const wantSend = sendText !== void 0;
  const wantShareActivity = shareActivityValue !== void 0;
  try {
    if (wantShareActivity) {
      await runShareActivityCommand({ value: shareActivityValue });
      process.exit(0);
    }
    if (wantSend) {
      const mod2 = await Promise.resolve().then(() => (init_jpi_chat_read(), jpi_chat_read_exports));
      await mod2.runSend({ login, text: sendText });
      process.exit(0);
    }
    if (wantRead) {
      const mod2 = await Promise.resolve().then(() => (init_jpi_chat_read(), jpi_chat_read_exports));
      await mod2.runReadThread({ login, all: wantAll, limit });
      process.exit(0);
    }
    if (wantInbox) {
      const mod2 = await Promise.resolve().then(() => (init_jpi_chat_read(), jpi_chat_read_exports));
      await mod2.runInbox({});
      process.exit(0);
    }
    if (!login && !wantBlock && !wantUnblock) {
      if (process.stdout.isTTY) {
        const mod2 = await Promise.resolve().then(() => (init_jpi_inbox(), jpi_inbox_exports));
        await mod2.run();
      } else {
        const mod2 = await Promise.resolve().then(() => (init_jpi_chat_read(), jpi_chat_read_exports));
        await mod2.runInbox({});
      }
      process.exit(0);
    }
    const disclosure = await ensureChatDisclosure({ input: process.stdin, output: process.stdout });
    if (!disclosure.acknowledged) {
      process.stdout.write(
        "\n  Chat needs you to acknowledge the privacy notice above first. Re-run when ready.\n\n"
      );
      process.exit(0);
    }
    if (wantBlock || wantUnblock) {
      await runBlockCommand({ login, action: wantBlock ? "block" : "unblock" });
      process.exit(0);
    }
    await runChatPane({ login });
    process.exit(0);
  } catch (err) {
    try {
      process.stdout.write(SHOW_CURSOR2 + EXIT_ALT2);
    } catch {
    }
    console.error("terminalhire chat error:", err instanceof Error ? err.message : err);
    process.exit(1);
  }
}
var CHAT_BASE3, GH_SESSION_COOKIE5, HIDE_CURSOR2, SHOW_CURSOR2, ENTER_ALT2, EXIT_ALT2, CLEAR2, KEY_CTRL_C2, KEY_ESC2, KEY_CTRL_S, KEY_ENTER_A2, KEY_ENTER_B2, KEY_BACKSPACE_A2, KEY_BACKSPACE_B2, MAX_INPUT_LEN, ANSI_CSI, ANSI_OSC, ANSI_OTHER, C0_C1_DEL, CHAT_DISCLOSURE, CHAT_AT_REST, CHAT_CODE_OF_CONDUCT, CHAT_MIN_AGE, DEPOSIT_CTA, ACTIVE_WINDOW_MS;
var init_jpi_chat = __esm({
  "bin/jpi-chat.js"() {
    "use strict";
    init_chat_client();
    init_config();
    init_web_session();
    CHAT_BASE3 = process.env["TERMINALHIRE_API_URL"] || "https://www.terminalhire.com";
    GH_SESSION_COOKIE5 = "__jpi_gh_session";
    HIDE_CURSOR2 = "\x1B[?25l";
    SHOW_CURSOR2 = "\x1B[?25h";
    ENTER_ALT2 = "\x1B[?1049h";
    EXIT_ALT2 = "\x1B[?1049l";
    CLEAR2 = "\x1B[2J\x1B[H";
    KEY_CTRL_C2 = "";
    KEY_ESC2 = "\x1B";
    KEY_CTRL_S = "";
    KEY_ENTER_A2 = "\r";
    KEY_ENTER_B2 = "\n";
    KEY_BACKSPACE_A2 = "\x7F";
    KEY_BACKSPACE_B2 = "\b";
    MAX_INPUT_LEN = 2e3;
    ANSI_CSI = /\x1b\[[0-?]*[ -/]*[@-~]/g;
    ANSI_OSC = /\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)/g;
    ANSI_OTHER = /\x1b[@-_]/g;
    C0_C1_DEL = /[\x00-\x1f\x7f-\x9f]/g;
    CHAT_DISCLOSURE = "Messages are end-to-end encrypted using keys stored only on your device. Our server cannot read message content. Since we distribute your contact's public key, verify your connection by comparing Safety Numbers to rule out a server-side substitution. We store metadata: who messaged whom, when, and message count. Content is purged after 90 days.";
    CHAT_AT_REST = "Your private key is encrypted against casual access, not full machine compromise.";
    CHAT_CODE_OF_CONDUCT = "Code of conduct: keep it professional \u2014 harassment, spam, or abuse gets you blocked and removed.";
    CHAT_MIN_AGE = "You must be at least 13 years old to use connections chat.";
    DEPOSIT_CTA = "\n  Keep building together \u2014 publish your r\xE9sum\xE9 so more builders find you:\n    https://www.terminalhire.com/dashboard\n\n";
    ACTIVE_WINDOW_MS = 2 * 60 * 1e3;
  }
});

// bin/jpi-connect.js
var jpi_connect_exports = {};
__export(jpi_connect_exports, {
  run: () => run12
});
async function run12() {
  const args5 = process.argv.slice(2).filter((a) => a !== "connect");
  if (args5.includes("--mute")) {
    writeConfig({ inboundNudgeMuted: true });
    console.log("\n  Muted: your spinner will no longer surface incoming connection requests.");
    console.log("  Pending intros are still there \u2014 see them any time with `terminalhire intro --list`.");
    console.log("  Re-enable with `terminalhire connect --unmute`.\n");
    return;
  }
  if (args5.includes("--unmute")) {
    writeConfig({ inboundNudgeMuted: false });
    console.log("\n  Unmuted: incoming connection requests will surface in your spinner again.");
    console.log("  (Requires a linked terminal \u2014 run `terminalhire link` if you have not.)\n");
    return;
  }
  const muted = isInboundNudgeMuted();
  console.log("\n  terminalhire connect \u2014 find and reach other developers, locally matched:");
  console.log("    terminalhire devs                 Rank opted-in builders & projects for you");
  console.log('    terminalhire project "<title>: <skills>"   Declare a project to staff');
  console.log("    terminalhire connect <github-login> Request a consented intro (alias for `intro`)");
  console.log("    terminalhire intro <github-login>  Request a consented intro (double opt-in)");
  console.log("    terminalhire intro --list          See intros you have sent + received");
  console.log("    terminalhire chat                  Message your accepted connections");
  console.log("");
  console.log(`  Ambient inbound nudge: ${muted ? "muted" : "on"}  (toggle: terminalhire connect --${muted ? "unmute" : "mute"})`);
  console.log("");
}
var init_jpi_connect = __esm({
  "bin/jpi-connect.js"() {
    "use strict";
    init_config();
  }
});

// src/link.ts
var link_exports = {};
__export(link_exports, {
  resolveLoopbackRequest: () => resolveLoopbackRequest,
  runLink: () => runLink,
  runLinkLogout: () => runLinkLogout
});
import { createServer } from "http";
import { randomBytes as randomBytes5 } from "crypto";
function resolveLoopbackRequest(rawUrl, expectedNonce) {
  let u;
  try {
    u = new URL(rawUrl, "http://127.0.0.1");
  } catch {
    return { ok: false, reason: "bad_url" };
  }
  const nonce = u.searchParams.get("nonce");
  if (!nonce || nonce !== expectedNonce) return { ok: false, reason: "nonce_mismatch" };
  const token = u.searchParams.get("token");
  if (!token) return { ok: false, reason: "missing_token" };
  return { ok: true, token };
}
function defaultStartLoopback(expectedNonce, timeoutMs) {
  return new Promise((resolveHandle) => {
    let settle;
    const result = new Promise((res) => {
      settle = res;
    });
    let done = false;
    const finish = (r) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      settle(r);
      setImmediate(() => {
        try {
          server.close();
        } catch {
        }
      });
    };
    const server = createServer((req, res) => {
      const outcome = resolveLoopbackRequest(req.url ?? "", expectedNonce);
      res.writeHead(outcome.ok ? 200 : 400, { "Content-Type": "text/html; charset=utf-8" });
      res.end(outcome.ok ? LINKED_HTML : FAILED_HTML);
      finish(outcome);
    });
    const timer = setTimeout(() => finish({ ok: false, reason: "timeout" }), timeoutMs);
    if (typeof timer.unref === "function") timer.unref();
    server.on("error", () => finish({ ok: false, reason: "listen_error" }));
    server.listen(0, "127.0.0.1", () => {
      const addr = server.address();
      const port = typeof addr === "object" && addr ? addr.port : 0;
      resolveHandle({
        port,
        result,
        close: () => {
          try {
            server.close();
          } catch {
          }
        }
      });
    });
  });
}
function defaultLinkDeps() {
  return {
    startLoopback: defaultStartLoopback,
    openBrowser: (url) => {
      void Promise.resolve().then(() => (init_open_url(), open_url_exports)).then((m) => m.openInBrowser(url)).catch(() => {
      });
    },
    generateNonce: () => randomBytes5(16).toString("hex"),
    persistToken: (token) => writeWebSessionFile(token),
    markNudgeDisclosed: () => writeConfig({ inboundNudgeDisclosed: true }),
    log: (msg) => console.log(msg),
    errorLog: (msg) => console.error(msg),
    exit: (code) => process.exit(code)
  };
}
async function runLink(overrides) {
  const deps = { ...defaultLinkDeps(), ...overrides };
  const nonce = deps.generateNonce();
  const handle = await deps.startLoopback(nonce, LINK_TIMEOUT_MS);
  const url = `${LINK_BASE3}/api/auth/link?port=${handle.port}&nonce=${encodeURIComponent(nonce)}`;
  deps.log("");
  deps.log("  terminalhire \u2014 link this terminal to your account");
  deps.log("  \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500");
  deps.log("  Opening your browser to approve. If it does not open, paste this URL:");
  deps.log(`  \u2192 ${url}`);
  deps.log("  Waiting for approval (this tab closes itself once you approve)\u2026");
  deps.openBrowser(url);
  let outcome;
  try {
    outcome = await handle.result;
  } finally {
    handle.close();
  }
  if (!outcome.ok || !outcome.token) {
    if (outcome.reason === "timeout") {
      deps.errorLog("\n  Link timed out \u2014 run `terminalhire link` again.\n");
    } else if (outcome.reason === "nonce_mismatch") {
      deps.errorLog("\n  Link rejected (nonce did not match) \u2014 run `terminalhire link` again.\n");
    } else {
      deps.errorLog("\n  Link failed \u2014 run `terminalhire link` again.\n");
    }
    deps.exit(1);
    return;
  }
  deps.persistToken(outcome.token);
  deps.log("\n  This terminal is now linked to your terminalhire account.");
  deps.log("  Try `terminalhire intro <login>`, `terminalhire chat`, or `terminalhire trajectory --push`.");
  deps.log("  Your spinner will quietly surface incoming connection requests.");
  deps.log("  Turn that off any time with `terminalhire connect --mute`.");
  deps.log("  Unlink any time with `terminalhire link --logout`.\n");
  try {
    deps.markNudgeDisclosed();
  } catch {
  }
  deps.exit(0);
}
function defaultLinkLogoutDeps() {
  return {
    fetchImpl: (...args5) => globalThis.fetch(...args5),
    readSessionFile: () => readWebSessionFile(),
    clearSessionFile: () => clearWebSessionFile(),
    log: (msg) => console.log(msg),
    errorLog: (msg) => console.error(msg),
    exit: (code) => process.exit(code)
  };
}
async function runLinkLogout(overrides) {
  const deps = { ...defaultLinkLogoutDeps(), ...overrides };
  const token = deps.readSessionFile();
  if (!token) {
    deps.log("\n  No linked web session on this machine \u2014 nothing to unlink.\n");
    deps.exit(0);
    return;
  }
  let revoked = false;
  try {
    const res = await deps.fetchImpl(`${LINK_BASE3}/api/auth/session`, {
      method: "DELETE",
      headers: { Cookie: `${GH_SESSION_COOKIE6}=${token}` },
      signal: AbortSignal.timeout(1e4)
    });
    revoked = res.ok;
  } catch {
  }
  deps.clearSessionFile();
  if (revoked) {
    deps.log("\n  Unlinked \u2014 the session was revoked server-side and removed from this machine.\n");
  } else {
    deps.log("\n  Removed the local session from this machine.");
    deps.log("  (Could not reach the server to revoke it \u2014 it expires on its own.)\n");
  }
  deps.exit(0);
}
var LINK_BASE3, GH_SESSION_COOKIE6, LINK_TIMEOUT_MS, LINKED_HTML, FAILED_HTML;
var init_link = __esm({
  "src/link.ts"() {
    "use strict";
    init_web_session();
    init_config();
    LINK_BASE3 = "https://www.terminalhire.com";
    GH_SESSION_COOKIE6 = "__jpi_gh_session";
    LINK_TIMEOUT_MS = 12e4;
    LINKED_HTML = `<!doctype html><html><head><meta charset="utf-8"><title>terminalhire</title></head>
<body style="font-family:system-ui;padding:2rem;background:#0b0d10;color:#e6e6e6">
<script>history.replaceState({},'','/');</script>
<p>CLI linked \u2014 you can close this tab.</p>
<script>setTimeout(function(){window.close();},400);</script>
</body></html>`;
    FAILED_HTML = `<!doctype html><html><head><meta charset="utf-8"><title>terminalhire</title></head>
<body style="font-family:system-ui;padding:2rem;background:#0b0d10;color:#e6e6e6">
<script>history.replaceState({},'','/');</script>
<p>Link failed \u2014 return to your terminal and run <code>terminalhire link</code> again.</p>
</body></html>`;
  }
});

// bin/jpi-link.js
var jpi_link_exports = {};
__export(jpi_link_exports, {
  run: () => run13
});
async function run13() {
  try {
    const args5 = process.argv.slice(2);
    if (args5.includes("--logout")) {
      const { runLinkLogout: runLinkLogout2 } = await Promise.resolve().then(() => (init_link(), link_exports));
      await runLinkLogout2();
      return;
    }
    const { runLink: runLink2 } = await Promise.resolve().then(() => (init_link(), link_exports));
    await runLink2();
  } catch (err) {
    console.error("terminalhire link error:", err?.message ?? err);
    process.exit(1);
  }
}
var init_jpi_link = __esm({
  "bin/jpi-link.js"() {
    "use strict";
  }
});

// bin/jpi-profile.js
var jpi_profile_exports = {};
__export(jpi_profile_exports, {
  run: () => run14
});
import { createInterface as createInterface9 } from "readline";
function prompt4(question) {
  const rl = createInterface9({ input: process.stdin, output: process.stdout });
  return new Promise((resolve2) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve2(answer.trim());
    });
  });
}
async function run14() {
  const { readProfile: readProfile2, writeProfile: writeProfile2, deleteProfile: deleteProfile2 } = await Promise.resolve().then(() => (init_profile(), profile_exports));
  const args5 = process.argv.slice(2);
  if (args5.includes("--show")) {
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
  if (args5.includes("--delete")) {
    console.log("\nThis will permanently delete your local terminalhire profile and encryption key.");
    const answer = await prompt4('Type "yes" to confirm: ');
    if (answer !== "yes") {
      console.log("Aborted.");
      process.exit(0);
    }
    await deleteProfile2();
    console.log("Profile and key deleted from ~/.terminalhire/");
    return;
  }
  if (args5.includes("--edit")) {
    const profile = await readProfile2();
    console.log("\n\u2726 terminalhire profile editor (press Enter to keep current value)\n");
    const name = await prompt4(`Display name [${profile.displayName ?? "not set"}]: `);
    if (name) profile.displayName = name;
    const email = await prompt4(`Contact email [${profile.contactEmail ?? "not set"}]: `);
    if (email) profile.contactEmail = email;
    const remote = await prompt4(`Remote only? (y/n) [${profile.remoteOnly ? "y" : "n"}]: `);
    if (remote === "y") profile.remoteOnly = true;
    if (remote === "n") profile.remoteOnly = false;
    const floor = await prompt4(`Comp floor USD [${profile.compFloorUsd ?? "not set"}]: `);
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
import { readFileSync as readFileSync20, readdirSync as readdirSync2 } from "fs";
import { execFileSync } from "child_process";
import { join as join20 } from "path";
function safeGit(args5, cwd) {
  try {
    return execFileSync("git", ["-C", cwd, ...args5], {
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
    return JSON.parse(readFileSync20(path, "utf8"));
  } catch {
    return null;
  }
}
function readFileSafe(path) {
  try {
    return readFileSync20(path, "utf8");
  } catch {
    return "";
  }
}
function tokensFromPackageJson(cwd) {
  const pkg = readJsonSafe(join20(cwd, "package.json"));
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
      const groupDir = join20(cwd, group);
      for (const e of readdirSync2(groupDir, { withFileTypes: true })) {
        if (e.isDirectory() && !e.isSymbolicLink()) dirs.push(join20(groupDir, e.name));
      }
    } catch {
    }
  }
  return dirs;
}
function tokensFromRequirementsTxt(cwd) {
  const content = readFileSafe(join20(cwd, "requirements.txt"));
  if (!content) return [];
  return content.split("\n").map((l) => l.trim().split(/[>=<!\[;]/)[0].trim().toLowerCase()).filter(Boolean);
}
function tokensFromGoMod(cwd) {
  const content = readFileSafe(join20(cwd, "go.mod"));
  if (!content) return [];
  const requires = Array.from(content.matchAll(/^\s+([^\s]+)\s+v/gm)).map((m) => m[1].split("/").pop() ?? "").filter(Boolean);
  return ["go", ...requires];
}
function tokensFromCargoToml(cwd) {
  const content = readFileSafe(join20(cwd, "Cargo.toml"));
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
    const srcDir = join20(cwd, "src");
    readdirSync2(srcDir);
    scanDirs.push(srcDir);
  } catch {
  }
  for (const dir of scanDirs) {
    try {
      const entries = readdirSync2(dir, { withFileTypes: true });
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
  run: () => run15
});
async function run15() {
  try {
    const args5 = process.argv.slice(2);
    const cwdIdx = args5.indexOf("--cwd");
    const cwd = cwdIdx !== -1 && args5[cwdIdx + 1] ? args5[cwdIdx + 1] : process.cwd();
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
      run15();
    }
  }
});

// bin/jpi-config.js
var jpi_config_exports = {};
__export(jpi_config_exports, {
  run: () => run16
});
import { join as join21 } from "path";
import { homedir as homedir19 } from "os";
function parseNudgeMode2(raw) {
  if (raw === "session" || raw === "always") return raw;
  const m = /^every:(\d+)$/.exec(raw);
  if (m && parseInt(m[1], 10) >= 1) return raw;
  return null;
}
async function run16() {
  const args5 = process.argv.slice(2);
  const filtered = args5[0] === "config" ? args5.slice(1) : args5;
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
    console.log(`  peer-connect: ${cfg.peerConnect ? "on" : "off"}  (ambient peer & founder surfacing; default off)`);
    console.log(`  config file: ${CONFIG_FILE2}`);
    console.log("");
    console.log("  Valid nudge values:");
    console.log("    session   \u2014 print at most once per Claude Code session (default)");
    console.log("    always    \u2014 print every statusLine render when matches exist");
    console.log("    every:N   \u2014 print every Nth render (e.g. every:3)");
    console.log("");
    console.log("  Peer-connect (--connect on|off):");
    console.log("    on   \u2014 surface peers & founders in the spinner + send an anonymous matched signal");
    console.log("    off  \u2014 no peer matching, no directory fetch, no signal (default)");
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
    const parsed = parseNudgeMode2(value);
    if (!parsed) {
      console.error(`Error: invalid nudge value "${value}". Valid: session | always | every:N`);
      process.exit(1);
    }
    writeConfig({ nudge: parsed });
    console.log(`  nudge set to: ${parsed}`);
    console.log(`  (saved to ${CONFIG_FILE2})`);
    return;
  }
  const connectIdx = filtered.indexOf("--connect");
  if (connectIdx !== -1) {
    const value = filtered[connectIdx + 1];
    if (value !== "on" && value !== "off") {
      console.error("Error: --connect requires a value: on | off");
      process.exit(1);
    }
    writeConfig({ peerConnect: value === "on", peerConnectPrompted: true });
    console.log(`  peer-connect set to: ${value}`);
    console.log(`  (saved to ${CONFIG_FILE2})`);
    return;
  }
  console.error("Usage: terminalhire config --nudge <session|always|every:N>");
  console.error("       terminalhire config --connect <on|off>");
  console.error("       terminalhire config --show");
  process.exit(1);
}
var TERMINALHIRE_DIR15, CONFIG_FILE2;
var init_jpi_config = __esm({
  "bin/jpi-config.js"() {
    "use strict";
    init_config();
    TERMINALHIRE_DIR15 = process.env.TERMINALHIRE_DIR || join21(homedir19(), ".terminalhire");
    CONFIG_FILE2 = join21(TERMINALHIRE_DIR15, "config.json");
  }
});

// bin/spinner-io.js
import {
  readFileSync as readFileSync21,
  writeFileSync as writeFileSync16,
  existsSync as existsSync14,
  mkdirSync as mkdirSync16,
  renameSync as renameSync3
} from "fs";
import { join as join22, dirname as dirname2 } from "path";
import { homedir as homedir20 } from "os";
function thDir() {
  return process.env["TERMINALHIRE_DIR"] || join22(homedir20(), ".terminalhire");
}
function claudeSettingsPath() {
  return process.env["TERMINALHIRE_CLAUDE_SETTINGS"] || join22(homedir20(), ".claude", "settings.json");
}
function spinnerStateFilePath() {
  return join22(thDir(), "spinner-state.json");
}
function readJson(path, fallback) {
  try {
    return existsSync14(path) ? JSON.parse(readFileSync21(path, "utf8")) : fallback;
  } catch {
    return fallback;
  }
}
function atomicWriteJson2(path, obj) {
  mkdirSync16(dirname2(path), { recursive: true });
  const tmp = `${path}.tmp-${process.pid}`;
  writeFileSync16(tmp, JSON.stringify(obj, null, 2) + "\n", "utf8");
  renameSync3(tmp, path);
}
function readState() {
  const SPINNER_STATE_FILE = spinnerStateFilePath();
  return readJson(SPINNER_STATE_FILE, { verbs: [], mode: "replace" });
}
function applySpinnerVerbs(ourVerbs, mode = "replace") {
  const CLAUDE_SETTINGS = claudeSettingsPath();
  const SPINNER_STATE_FILE = spinnerStateFilePath();
  const verbs = (Array.isArray(ourVerbs) ? ourVerbs : []).filter(Boolean);
  if (verbs.length === 0) return clearSpinnerVerbs();
  const settings = readJson(CLAUDE_SETTINGS, {}) || {};
  const existing = settings.spinnerVerbs && typeof settings.spinnerVerbs === "object" ? settings.spinnerVerbs : null;
  const prevOurs = new Set(readState().verbs || []);
  const userVerbs = existing && Array.isArray(existing.verbs) ? existing.verbs.filter((v) => !prevOurs.has(v)) : [];
  const newVerbs = [...verbs, ...userVerbs];
  settings.spinnerVerbs = { mode: mode === "append" ? "append" : "replace", verbs: newVerbs };
  atomicWriteJson2(CLAUDE_SETTINGS, settings);
  const st = readState();
  atomicWriteJson2(SPINNER_STATE_FILE, { ...st, verbs, mode, ts: Date.now() });
  return { applied: verbs.length, total: newVerbs.length };
}
function clearSpinnerVerbs() {
  const CLAUDE_SETTINGS = claudeSettingsPath();
  const SPINNER_STATE_FILE = spinnerStateFilePath();
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
    atomicWriteJson2(CLAUDE_SETTINGS, settings);
  }
  try {
    const st = readState();
    atomicWriteJson2(SPINNER_STATE_FILE, { ...st, verbs: [], mode: st.mode || "replace", ts: Date.now() });
  } catch {
  }
  return { cleared: true, keptUserVerbs };
}
function applySpinnerTips(ourTips) {
  const CLAUDE_SETTINGS = claudeSettingsPath();
  const SPINNER_STATE_FILE = spinnerStateFilePath();
  const tips = (Array.isArray(ourTips) ? ourTips : []).filter(Boolean);
  if (tips.length === 0) return clearSpinnerTips();
  const settings = readJson(CLAUDE_SETTINGS, {}) || {};
  const existing = settings.spinnerTipsOverride && Array.isArray(settings.spinnerTipsOverride.tips) ? settings.spinnerTipsOverride.tips : [];
  const prevOurs = new Set(readState().tips || []);
  const userTips = existing.filter((t) => !prevOurs.has(t));
  settings.spinnerTipsEnabled = true;
  settings.spinnerTipsOverride = { excludeDefault: true, tips: [...tips, ...userTips] };
  atomicWriteJson2(CLAUDE_SETTINGS, settings);
  const st = readState();
  atomicWriteJson2(SPINNER_STATE_FILE, { ...st, tips, ts: Date.now() });
  return { applied: tips.length };
}
function clearSpinnerTips() {
  const CLAUDE_SETTINGS = claudeSettingsPath();
  const SPINNER_STATE_FILE = spinnerStateFilePath();
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
    atomicWriteJson2(CLAUDE_SETTINGS, settings);
  }
  try {
    const st = readState();
    atomicWriteJson2(SPINNER_STATE_FILE, { ...st, tips: [], ts: Date.now() });
  } catch {
  }
  return { cleared: true };
}
var init_spinner_io = __esm({
  "bin/spinner-io.js"() {
    "use strict";
  }
});

// bin/spinner-config.js
import { join as join23 } from "path";
function configFilePath() {
  return join23(thDir(), "config.json");
}
function readSpinnerConfig() {
  const CONFIG_FILE4 = configFilePath();
  const cfg = readJson(CONFIG_FILE4, {});
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
var SPINNER_DEFAULTS;
var init_spinner_config = __esm({
  "bin/spinner-config.js"() {
    "use strict";
    init_spinner_io();
    SPINNER_DEFAULTS = { enabled: false, mode: "append", max: 6, frequency: "sometimes" };
  }
});

// bin/spinner-seen.js
var spinner_seen_exports = {};
__export(spinner_seen_exports, {
  SEEN_MAX_ENTRIES: () => SEEN_MAX_ENTRIES,
  SEEN_TTL_MS: () => SEEN_TTL_MS,
  SEEN_WINDOW_SURFACES: () => SEEN_WINDOW_SURFACES,
  isSuppressed: () => isSuppressed,
  loadSeenHistory: () => loadSeenHistory,
  recordSurface: () => recordSurface,
  seenFilePath: () => seenFilePath
});
import {
  readFileSync as readFileSync22,
  writeFileSync as writeFileSync17,
  renameSync as renameSync4,
  mkdirSync as mkdirSync17
} from "fs";
import { join as join24, dirname as dirname3 } from "path";
import { homedir as homedir21 } from "os";
function seenFilePath() {
  const dir = process.env["TERMINALHIRE_DIR"] || join24(homedir21(), ".terminalhire");
  return join24(dir, "seen-history.json");
}
function atomicWriteJson3(path, obj) {
  mkdirSync17(dirname3(path), { recursive: true });
  const tmp = `${path}.tmp-${process.pid}`;
  writeFileSync17(tmp, JSON.stringify(obj) + "\n", { encoding: "utf8", mode: 384 });
  renameSync4(tmp, path);
}
function emptyHistory() {
  return { surface: 0, entries: {} };
}
function isFiniteNonNegative(n) {
  return typeof n === "number" && Number.isFinite(n) && n >= 0;
}
function pruneEntries(entries, now) {
  const out = {};
  for (const [id, e] of Object.entries(entries)) {
    if (!e || !isFiniteNonNegative(e.lastSurface) || !isFiniteNonNegative(e.lastSeenAt)) continue;
    if (now - e.lastSeenAt > SEEN_TTL_MS) continue;
    out[id] = { lastSurface: e.lastSurface, lastSeenAt: e.lastSeenAt };
  }
  return out;
}
function capEntries(entries) {
  const ids = Object.keys(entries);
  if (ids.length <= SEEN_MAX_ENTRIES) return entries;
  ids.sort((a, b) => entries[b].lastSurface - entries[a].lastSurface || entries[b].lastSeenAt - entries[a].lastSeenAt);
  const out = {};
  for (const id of ids.slice(0, SEEN_MAX_ENTRIES)) out[id] = entries[id];
  return out;
}
function loadSeenHistory(now = Date.now()) {
  let raw;
  try {
    raw = JSON.parse(readFileSync22(seenFilePath(), "utf8"));
  } catch {
    return emptyHistory();
  }
  if (!raw || typeof raw !== "object") return emptyHistory();
  const surface = isFiniteNonNegative(raw.surface) ? Math.floor(raw.surface) : 0;
  const entries = raw.entries && typeof raw.entries === "object" && !Array.isArray(raw.entries) ? pruneEntries(raw.entries, now) : {};
  return { surface, entries };
}
function isSuppressed(id, history) {
  const e = history.entries[id];
  if (!e) return false;
  return history.surface - e.lastSurface < SEEN_WINDOW_SURFACES;
}
function recordSurface(ids, now = Date.now()) {
  const history = loadSeenHistory(now);
  const surface = history.surface + 1;
  const entries = { ...history.entries };
  for (const id of ids) {
    if (typeof id !== "string" || id.length === 0) continue;
    entries[id] = { lastSurface: surface, lastSeenAt: now };
  }
  const next = { surface, entries: capEntries(pruneEntries(entries, now)) };
  try {
    atomicWriteJson3(seenFilePath(), next);
  } catch {
  }
  return next;
}
var SEEN_WINDOW_SURFACES, SEEN_TTL_MS, SEEN_MAX_ENTRIES;
var init_spinner_seen = __esm({
  "bin/spinner-seen.js"() {
    "use strict";
    SEEN_WINDOW_SURFACES = 10;
    SEEN_TTL_MS = 7 * 24 * 60 * 60 * 1e3;
    SEEN_MAX_ENTRIES = 500;
  }
});

// bin/spinner-select.js
function filterFreshMatches(matches, history) {
  const { eligible, suppressed } = partitionFreshMatches(matches, history);
  return suppressed.length === 0 ? matches : [...eligible, ...suppressed];
}
function partitionFreshMatches(matches, history) {
  const list = Array.isArray(matches) ? matches : [];
  if (!history || !history.entries || Object.keys(history.entries).length === 0) {
    return { eligible: list, suppressed: [] };
  }
  const eligible = [];
  const suppressed = [];
  for (const m of list) {
    if (m && m.id != null && isSuppressed(String(m.id), history)) suppressed.push(m);
    else eligible.push(m);
  }
  const stamp = (m) => history.entries[String(m.id)].lastSurface;
  suppressed.sort((a, b) => stamp(a) - stamp(b));
  return { eligible, suppressed };
}
function widenFreshCandidates(matches, history, need, widen) {
  const list = Array.isArray(matches) ? matches.filter(Boolean) : [];
  if (!(need > 0)) return [];
  if (!widen || !Array.isArray(widen.reserve) || typeof widen.getAdjacent !== "function") return [];
  const suppressed = (m) => !!history && !!history.entries && m.id != null && isSuppressed(String(m.id), history);
  const counts = /* @__PURE__ */ new Map();
  for (const m of list) {
    for (const t of Array.isArray(m.matchedTags) ? m.matchedTags : []) {
      const tag = String(t).toLowerCase();
      counts.set(tag, (counts.get(tag) || 0) + 1);
    }
  }
  const maxCount = Math.max(0, ...counts.values());
  if (maxCount === 0) return [];
  const dominant = [...counts.entries()].filter(([, c]) => c === maxCount).map(([t]) => t);
  const inPool = new Set(list.map((m) => String(m.id)));
  const fresh = (m) => m && m.id != null && !inPool.has(String(m.id)) && !suppressed(m);
  const tagged = (m, adj) => (Array.isArray(m.matchedTags) ? m.matchedTags : []).some((t) => adj.has(String(t).toLowerCase()));
  const ringCandidates = (hops) => {
    const adj = new Set(dominant.flatMap((d) => widen.getAdjacent(d, hops)));
    if (adj.size === 0) return [];
    return widen.reserve.filter((m) => fresh(m) && tagged(m, adj));
  };
  let widened = ringCandidates(1);
  if (widened.length === 0) widened = ringCandidates(2);
  if (widened.length === 0) {
    widened = widen.reserve.filter(
      (m) => fresh(m) && (m.source === "bounty" || m.source === "contribute")
    );
  }
  return widened.slice(0, need);
}
var init_spinner_select = __esm({
  "bin/spinner-select.js"() {
    "use strict";
    init_spinner_seen();
  }
});

// bin/spinner-verbs.js
function titleCase(s) {
  return String(s || "").replace(/\b\w/g, (c) => c.toUpperCase());
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
    const pct2 = Math.max(1, Math.min(99, Math.round((Number(m.score) || 0) * 100)));
    const key = `${title.toLowerCase()}@${company.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const intro = VERB_INTROS[out.length % VERB_INTROS.length];
    out.push(`${intro} ${title} @ ${company} \xB7 ${pct2}% match`);
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
function buildPeerLine(topPeers) {
  const n = (Array.isArray(topPeers) ? topPeers : []).filter(Boolean).length;
  if (n < 1) return null;
  return n === 1 ? `\u25C6 1 builder matches what you're building \xB7 terminalhire devs` : `\u25C6 ${n} builders match what you're building \xB7 terminalhire devs`;
}
function buildIncomingIntroLine(incomingPending) {
  const n = incomingPending && typeof incomingPending.count === "number" ? incomingPending.count : 0;
  if (n < 1) return null;
  return n === 1 ? `\u2198 someone wants to connect \xB7 terminalhire intro --list` : `\u2198 ${n} people want to connect \xB7 terminalhire intro --list`;
}
function buildContributeNudgeLine(contributeNudge) {
  const n = contributeNudge && typeof contributeNudge.count === "number" ? contributeNudge.count : 0;
  if (n < 1) return null;
  return n === 1 ? "\u2726 an open-source issue that counts toward your r\xE9sum\xE9 \xB7 terminalhire contribute" : `\u2726 ${n} open-source issues that count toward your r\xE9sum\xE9 \xB7 terminalhire contribute`;
}
function buildSessionStaleLine(sessionStale) {
  return sessionStale === true ? "\u26A0 terminalhire: linked session expired \u2014 run: terminalhire login" : null;
}
function buildSpinnerPool(topMatches, _max = 6, opts = {}) {
  const {
    sessionTags,
    frequency = "always",
    topPeers,
    incomingPending,
    sessionStale,
    contributeNudge,
    seenHistory
  } = opts;
  const staleLine = buildSessionStaleLine(sessionStale);
  const withStale = (pool2) => staleLine ? [staleLine, ...pool2] : pool2;
  const introLine = buildIncomingIntroLine(incomingPending);
  const contributeLine = buildContributeNudgeLine(contributeNudge);
  const ranked = filterFreshMatches(rankBySessionTags(topMatches, sessionTags), seenHistory);
  if (!Array.isArray(ranked) || ranked.length === 0) {
    if (introLine) return withStale([introLine]);
    if (contributeLine) return withStale([contributeLine]);
    const peerLine = buildPeerLine(topPeers);
    return withStale(peerLine ? [peerLine] : []);
  }
  const headers = buildContextVerbs(ranked, sessionTags);
  const cap = Math.max(1, verbCountForFrequency(frequency, headers.length));
  const pool = [...headers.slice(0, cap), ctaVerb()];
  if (introLine) pool.push(introLine);
  if (contributeLine) pool.push(contributeLine);
  return withStale(pool);
}
var VERB_INTROS;
var init_spinner_verbs = __esm({
  "bin/spinner-verbs.js"() {
    "use strict";
    init_spinner_select();
    VERB_INTROS = ["Matched:", "You\u2019d fit:", "Worth a look:", "On your radar:", "Fits your stack:"];
  }
});

// bin/spinner-render.js
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
function buildTipsDetailed(topMatches, baseUrl, max = 8, opts = {}) {
  const base = String(baseUrl || "https://terminalhire.com").replace(/\/+$/, "");
  const out = [];
  const surfacedIds = [];
  const seenRole = /* @__PURE__ */ new Set();
  const perCompany = /* @__PURE__ */ new Map();
  const COMPANY_CAP = 2;
  const { eligible, suppressed } = partitionFreshMatches(
    Array.isArray(topMatches) ? topMatches : [],
    opts.seenHistory
  );
  const orderForEmit = (list) => {
    const bountyQ = list.filter((m) => m && m.source === "bounty");
    const contributeQ = list.filter((m) => m && m.source === "contribute");
    const roleQ = interleaveBySource(
      list.filter((m) => m && m.source !== "bounty" && m.source !== "contribute")
    );
    const ordered = [];
    let bi = 0;
    let ri = 0;
    let ci = 0;
    while (bi < bountyQ.length || ri < roleQ.length || ci < contributeQ.length) {
      if (ri < roleQ.length) ordered.push(roleQ[ri++]);
      if (bi < bountyQ.length) ordered.push(bountyQ[bi++]);
      if (ci < contributeQ.length) ordered.push(contributeQ[ci++]);
    }
    return ordered;
  };
  const emit = (list) => {
    for (const m of orderForEmit(list)) {
      if (out.length >= max) return;
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
      const pct2 = Math.max(1, Math.min(99, Math.round((Number(m.score) || 0) * 100)));
      const token = Buffer.from(String(m.id)).toString("base64url");
      const url = `${base}/j/${token}`;
      if (source === "bounty") {
        const money = m.amountUSD != null ? `$${Number(m.amountUSD).toLocaleString()}` : "$\u2014";
        const repo = m.repo || companyRaw;
        out.push(`\u{1F48E} ${money} \xB7 ${title} \xB7 ${repo} \xB7 ${pct2}% \u2014 ${url}`);
      } else if (source === "contribute") {
        const repo = m.repo || companyRaw;
        const num = m.issueNumber != null ? ` #${m.issueNumber}` : "";
        out.push(`\u2197 contribute \xB7 ${repo}${num} \xB7 counts on your r\xE9sum\xE9 \xB7 ${pct2}%`);
      } else {
        out.push(`\u2197 ${title} @ ${company} \xB7 ${pct2}% \u2014 ${url}`);
      }
      surfacedIds.push(String(m.id));
    }
  };
  emit(eligible);
  if (out.length < max && opts.widen) {
    const widened = widenFreshCandidates(
      Array.isArray(topMatches) ? topMatches : [],
      opts.seenHistory,
      max - out.length,
      opts.widen
    );
    if (widened.length > 0) emit(widened);
  }
  if (out.length < max) emit(suppressed);
  return { tips: out, surfacedIds };
}
function buildTips(topMatches, baseUrl, max = 8, opts = {}) {
  return buildTipsDetailed(topMatches, baseUrl, max, opts).tips;
}
function renderRefreshSurface(topMatches, sc, opts = {}) {
  if (!sc || sc.enabled !== true) {
    clearSpinnerVerbs();
    clearSpinnerTips();
    return { verbs: [], tips: [], surfacedIds: [] };
  }
  const seenHistory = opts.seenHistory || loadSeenHistory();
  const ranked = rankBySessionTags(topMatches, opts.sessionTags);
  const verbs = buildSpinnerPool(ranked, sc.max, {
    sessionTags: opts.sessionTags,
    frequency: sc.frequency,
    topPeers: opts.topPeers,
    incomingPending: opts.incomingPending,
    sessionStale: opts.sessionStale,
    contributeNudge: opts.contributeNudge,
    seenHistory
  });
  if (verbs.length > 0) applySpinnerVerbs(verbs, sc.mode);
  else clearSpinnerVerbs();
  const { tips, surfacedIds } = buildTipsDetailed(ranked, opts.baseUrl, 8, {
    seenHistory,
    widen: opts.widen
  });
  if (tips.length > 0) applySpinnerTips(tips);
  else clearSpinnerTips();
  if (verbs.length > 0 || tips.length > 0) recordSurface(surfacedIds);
  return { verbs, tips, surfacedIds };
}
var init_spinner_render = __esm({
  "bin/spinner-render.js"() {
    "use strict";
    init_spinner_select();
    init_spinner_verbs();
    init_spinner_seen();
    init_spinner_io();
  }
});

// bin/spinner.js
var spinner_exports = {};
__export(spinner_exports, {
  SPINNER_DEFAULTS: () => SPINNER_DEFAULTS,
  applySpinnerTips: () => applySpinnerTips,
  applySpinnerVerbs: () => applySpinnerVerbs,
  buildContextVerbs: () => buildContextVerbs,
  buildContributeNudgeLine: () => buildContributeNudgeLine,
  buildIncomingIntroLine: () => buildIncomingIntroLine,
  buildPeerLine: () => buildPeerLine,
  buildSessionStaleLine: () => buildSessionStaleLine,
  buildSpinnerPool: () => buildSpinnerPool,
  buildTips: () => buildTips,
  buildTipsDetailed: () => buildTipsDetailed,
  clearSpinnerTips: () => clearSpinnerTips,
  clearSpinnerVerbs: () => clearSpinnerVerbs,
  ctaVerb: () => ctaVerb,
  filterFreshMatches: () => filterFreshMatches,
  formatVerbs: () => formatVerbs,
  interleaveBySource: () => interleaveBySource,
  partitionFreshMatches: () => partitionFreshMatches,
  rankBySessionTags: () => rankBySessionTags,
  readSpinnerConfig: () => readSpinnerConfig,
  renderRefreshSurface: () => renderRefreshSurface,
  widenFreshCandidates: () => widenFreshCandidates
});
var init_spinner = __esm({
  "bin/spinner.js"() {
    "use strict";
    init_spinner_config();
    init_spinner_config();
    init_spinner_verbs();
    init_spinner_verbs();
    init_spinner_verbs();
    init_spinner_verbs();
    init_spinner_verbs();
    init_spinner_verbs();
    init_spinner_verbs();
    init_spinner_verbs();
    init_spinner_verbs();
    init_spinner_select();
    init_spinner_select();
    init_spinner_select();
    init_spinner_io();
    init_spinner_io();
    init_spinner_io();
    init_spinner_io();
    init_spinner_render();
    init_spinner_render();
    init_spinner_render();
    init_spinner_render();
  }
});

// bin/jpi-spinner.js
var jpi_spinner_exports = {};
__export(jpi_spinner_exports, {
  run: () => run17
});
import {
  readFileSync as readFileSync23,
  writeFileSync as writeFileSync18,
  copyFileSync as copyFileSync2,
  existsSync as existsSync15,
  mkdirSync as mkdirSync18
} from "fs";
import { join as join25 } from "path";
import { homedir as homedir22 } from "os";
import { createInterface as createInterface10 } from "readline";
function readConfig2() {
  try {
    return existsSync15(CONFIG_FILE3) ? JSON.parse(readFileSync23(CONFIG_FILE3, "utf8")) : {};
  } catch {
    return {};
  }
}
function writeConfig2(patch) {
  mkdirSync18(TH_DIR, { recursive: true });
  const merged = { ...readConfig2(), ...patch };
  writeFileSync18(CONFIG_FILE3, JSON.stringify(merged, null, 2) + "\n", "utf8");
}
function backupSettings() {
  if (!existsSync15(SETTINGS_PATH)) return null;
  const ts = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
  const backupPath = `${SETTINGS_PATH}.terminalhire-backup-${ts}`;
  copyFileSync2(SETTINGS_PATH, backupPath);
  return backupPath;
}
function ask(question) {
  const rl = createInterface10({ input: process.stdin, output: process.stdout });
  return new Promise((res) => {
    rl.question(question, (answer) => {
      rl.close();
      res(answer.trim().toLowerCase());
    });
  });
}
function readTopMatches() {
  try {
    const c = JSON.parse(readFileSync23(CACHE_FILE, "utf8"));
    return Array.isArray(c.topMatches) ? c.topMatches : [];
  } catch {
    return [];
  }
}
async function run17() {
  const args5 = process.argv.slice(2).filter((a) => a !== "spinner");
  const has = (f) => args5.includes(f);
  const val = (f) => {
    const i = args5.indexOf(f);
    return i >= 0 ? args5[i + 1] : void 0;
  };
  if (has("--show") || args5.length === 0) {
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
var TH_DIR, CONFIG_FILE3, SETTINGS_PATH, CACHE_FILE;
var init_jpi_spinner = __esm({
  "bin/jpi-spinner.js"() {
    "use strict";
    init_spinner();
    TH_DIR = process.env["TERMINALHIRE_DIR"] || join25(homedir22(), ".terminalhire");
    CONFIG_FILE3 = join25(TH_DIR, "config.json");
    SETTINGS_PATH = process.env["TERMINALHIRE_CLAUDE_SETTINGS"] || join25(homedir22(), ".claude", "settings.json");
    CACHE_FILE = join25(TH_DIR, "index-cache.json");
  }
});

// bin/jpi-sync.js
var jpi_sync_exports = {};
__export(jpi_sync_exports, {
  run: () => run18
});
import { readFileSync as readFileSync24, writeFileSync as writeFileSync19, mkdirSync as mkdirSync19, existsSync as existsSync16, rmSync as rmSync4 } from "fs";
import { join as join26 } from "path";
import { homedir as homedir23, hostname as osHostname } from "os";
import { createInterface as createInterface11 } from "readline";
function ask2(question) {
  const rl = createInterface11({ input: process.stdin, output: process.stdout });
  return new Promise((res) => {
    rl.question(question, (answer) => {
      rl.close();
      res(answer.trim().toLowerCase());
    });
  });
}
function readMarker() {
  try {
    return existsSync16(TIER1_MARKER) ? JSON.parse(readFileSync24(TIER1_MARKER, "utf8")) : null;
  } catch {
    return null;
  }
}
function writeMarker(marker) {
  mkdirSync19(TH_DIR2, { recursive: true });
  writeFileSync19(TIER1_MARKER, JSON.stringify(marker, null, 2) + "\n", "utf8");
}
function clearMarker() {
  try {
    rmSync4(TIER1_MARKER);
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
    const rl = createInterface11({ input: process.stdin, output: process.stdout });
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
    res = await fetch(`${API_URL6}/api/profile-sync`, {
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
async function run18() {
  const args5 = process.argv.slice(2).filter((a) => a !== "sync");
  const has = (f) => args5.includes(f);
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
var TH_DIR2, TIER1_MARKER, API_URL6, SYNC_BASE, POLL_INTERVAL_MS, POLL_TIMEOUT_MS, CONSENT_VERSION;
var init_jpi_sync = __esm({
  "bin/jpi-sync.js"() {
    "use strict";
    init_open_url();
    TH_DIR2 = process.env["TERMINALHIRE_DIR"] || join26(homedir23(), ".terminalhire");
    TIER1_MARKER = join26(TH_DIR2, "tier1.json");
    API_URL6 = process.env["TERMINALHIRE_API_URL"] || process.env["JPI_API_URL"] || "https://terminalhire.com";
    SYNC_BASE = "https://www.terminalhire.com";
    POLL_INTERVAL_MS = 2e3;
    POLL_TIMEOUT_MS = 10 * 60 * 1e3;
    CONSENT_VERSION = 1;
  }
});

// bin/jpi-init.js
var jpi_init_exports = {};
__export(jpi_init_exports, {
  run: () => run19
});
import { existsSync as existsSync17 } from "fs";
import { join as join27, resolve } from "path";
import { fileURLToPath as fileURLToPath4, pathToFileURL } from "url";
import { createInterface as createInterface12 } from "readline";
import { spawnSync } from "child_process";
function resolveScript(name) {
  const distPath = resolve(join27(__dirname3, "..", "..", "dist", "bin", `${name}.js`));
  const legacyPath = resolve(join27(__dirname3, `${name}.js`));
  return existsSync17(distPath) ? distPath : legacyPath;
}
function resolveSrc(name) {
  const distPath = resolve(join27(__dirname3, "..", "..", "dist", "src", `${name}.js`));
  const legacyPath = resolve(join27(__dirname3, "..", "src", `${name}.js`));
  return existsSync17(distPath) ? distPath : legacyPath;
}
function resolveInstallJs() {
  const fromDist = resolve(join27(__dirname3, "..", "..", "install.js"));
  const fromBin = resolve(join27(__dirname3, "..", "install.js"));
  if (existsSync17(fromDist)) return fromDist;
  if (existsSync17(fromBin)) return fromBin;
  return fromBin;
}
function resolveStatuslineInstallJs() {
  const fromDist = resolve(join27(__dirname3, "..", "..", "statusline-install.js"));
  const fromBin = resolve(join27(__dirname3, "..", "statusline-install.js"));
  if (existsSync17(fromDist)) return fromDist;
  if (existsSync17(fromBin)) return fromBin;
  return fromBin;
}
async function run19() {
  const rl = createInterface12({ input: process.stdin, output: process.stdout });
  const ask3 = (question) => new Promise((resolve2) => {
    let answered = false;
    rl.question(question, (answer) => {
      answered = true;
      resolve2((answer || "").trim().toLowerCase());
    });
    rl.once("close", () => {
      if (!answered) resolve2(null);
    });
  });
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
  console.log("  4. Optionally show connection notifications in your statusLine");
  console.log("     (\u{1F4AC} unread + intro requests only \u2014 never job ads; separate consent)");
  console.log("");
  console.log('You can stop at any step. Nothing is changed until you say "yes".');
  console.log("");
  console.log("Step 1/4 \u2014 GitHub sign-in (optional but recommended)");
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
    rl.pause();
    const child = spawnSync(process.execPath, [loginScript, "login"], {
      stdio: ["ignore", "inherit", "inherit"],
      env: { ...process.env, JPI_SKIP_PEER_PROMPT: "1" }
    });
    try {
      while (process.stdin.read() !== null) {
      }
    } catch {
    }
    rl.resume();
    if (child.status !== 0) {
      console.log("");
      console.log("  GitHub sign-in did not complete. Continuing without GitHub.");
      console.log("  You can sign in any time with: terminalhire login");
    } else {
      try {
        const { maybePromptPeerConnect: maybePromptPeerConnect2 } = await import(pathToFileURL(resolveScript("peer-connect-prompt")).href);
        let login;
        try {
          const { readProfile: readProfile2 } = await import(pathToFileURL(resolveSrc("profile")).href);
          const prof = await readProfile2();
          login = prof?.github?.login;
        } catch {
        }
        await maybePromptPeerConnect2({ ask: ask3, login });
      } catch {
      }
    }
  } else {
    console.log("");
    console.log("  Staying local-only. Tags accumulate from your personal project sessions.");
    console.log("  Sign in any time with: terminalhire login");
  }
  console.log("");
  console.log("Step 2/4 \u2014 Seeding local job cache");
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
  console.log("Step 3/4 \u2014 Enable the ambient spinner job surface in ~/.claude/settings.json");
  console.log("");
  console.log("  This is the only step that modifies a system file.");
  console.log("  A timestamped backup is created before any change.");
  console.log("  Disable at any time: node install.js --uninstall  (or terminalhire spinner --off)");
  console.log("");
  try {
    const installMod = await import(pathToFileURL(resolveInstallJs()).href);
    if (typeof installMod.installSpinner === "function") {
      await installMod.installSpinner({ ask: ask3 });
    } else {
      console.log("");
      console.log("  Hook installation unavailable in this build. Run manually: node install.js");
    }
  } catch {
    console.log("");
    console.log("  Hook installation did not complete. Run manually: node install.js");
  }
  console.log("");
  console.log("Step 4/4 \u2014 Connection notifications in your statusLine (optional)");
  console.log("");
  console.log("  A statusLine that shows ONLY personal connection signals \u2014 \u{1F4AC} unread");
  console.log("  messages and inbound intro requests. Never job ads (those stay in the");
  console.log("  spinner). Local cache read, zero network. Separate consent + backup;");
  console.log("  it stays current across plugin updates and preserves any existing");
  console.log("  statusLine you have. Remove any time: node statusline-install.js --uninstall");
  console.log("");
  try {
    const statuslineMod = await import(pathToFileURL(resolveStatuslineInstallJs()).href);
    if (typeof statuslineMod.installStatusline === "function") {
      await statuslineMod.installStatusline({ ask: ask3 });
    } else {
      console.log("");
      console.log("  statusLine setup unavailable in this build. Run manually: node statusline-install.js");
    }
  } catch {
    console.log("");
    console.log("  statusLine setup did not complete. Run manually: node statusline-install.js");
  }
  rl.close();
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
var __dirname3;
var init_jpi_init = __esm({
  "bin/jpi-init.js"() {
    "use strict";
    __dirname3 = fileURLToPath4(new URL(".", import.meta.url));
  }
});

// bin/jpi-refresh.js
var jpi_refresh_exports = {};
__export(jpi_refresh_exports, {
  run: () => run20
});
import { writeFileSync as writeFileSync20, mkdirSync as mkdirSync20 } from "fs";
import { join as join28 } from "path";
import { homedir as homedir24 } from "os";
import { fileURLToPath as fileURLToPath5 } from "url";
async function run20() {
  try {
    let index;
    for (let attempt = 1; ; attempt++) {
      try {
        const res = await fetch(`${API_URL7}/api/index`, {
          signal: AbortSignal.timeout(15e3),
          headers: { "Accept": "application/json" }
        });
        if (!res.ok) {
          process.stderr.write(`terminalhire refresh: index fetch failed (HTTP ${res.status})
`);
          process.exit(1);
        }
        index = await res.json();
        break;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        if (attempt >= 2) {
          process.stderr.write(`terminalhire refresh: fetch error \u2014 ${msg}
`);
          process.exit(1);
        }
        process.stderr.write(`terminalhire refresh: fetch error \u2014 ${msg} (retrying once)
`);
      }
    }
    const jobs = index?.jobs ?? [];
    const contribute = isContributeEnabled() && Array.isArray(index?.contribute) ? index.contribute : [];
    const contributeNudge = !isContributeEnabled() && !isContributePrompted() && Array.isArray(index?.contribute) && index.contribute.length > 0 ? { count: index.contribute.length } : null;
    let matchCount = 0;
    let topMatches = [];
    let widenReserve = [];
    try {
      const { readProfile: readProfile2, profileToFingerprint: profileToFingerprint2 } = await Promise.resolve().then(() => (init_profile(), profile_exports));
      const { match: match2 } = await Promise.resolve().then(() => (init_src(), src_exports));
      const profile = await readProfile2();
      if (profile.skillTags.length > 0 && jobs.length > 0) {
        const fp = profileToFingerprint2(profile);
        const pool = contribute.length > 0 ? [...jobs, ...contribute] : jobs;
        const results = match2(fp, pool, pool.length);
        matchCount = results.length;
        const BOUNTY_SLOTS = 5;
        const bountyMatches = results.filter((r) => r.job.source === "bounty");
        const rot = bountyMatches.length > 0 ? Math.floor(Date.now() / (5 * 60 * 1e3)) % bountyMatches.length : 0;
        const bountyTop = [...bountyMatches.slice(rot), ...bountyMatches.slice(0, rot)].slice(0, BOUNTY_SLOTS);
        const CONTRIBUTE_SLOTS = 5;
        const contributeMatches = results.filter((r) => r.job.source === "contribute");
        const cRot = contributeMatches.length > 0 ? Math.floor(Date.now() / (5 * 60 * 1e3)) % contributeMatches.length : 0;
        const contributeTop = [...contributeMatches.slice(cRot), ...contributeMatches.slice(0, cRot)].slice(0, CONTRIBUTE_SLOTS);
        const roleSlots = 25 - bountyTop.length - contributeTop.length;
        const roleMatches = results.filter(
          (r) => r.job.source !== "bounty" && r.job.source !== "contribute"
        );
        const ROLE_STABLE = Math.min(8, roleSlots);
        const stableRoles = roleMatches.slice(0, ROLE_STABLE);
        const rotableRoles = roleMatches.slice(ROLE_STABLE, ROLE_STABLE + 60);
        const rRot = rotableRoles.length > 0 ? Math.floor(Date.now() / (5 * 60 * 1e3)) % rotableRoles.length : 0;
        const rotatedRoles = [...rotableRoles.slice(rRot), ...rotableRoles.slice(0, rRot)];
        const roleTop = [...stableRoles, ...rotatedRoles].slice(0, roleSlots);
        const toCard = (r) => ({
          id: r.job.id,
          title: r.job.title,
          company: r.job.company,
          score: r.score,
          remote: r.job.remote,
          matchedTags: r.matchedTags,
          source: r.job.source,
          amountUSD: r.job.bounty?.amountUSD,
          repo: r.job.bounty?.repoFullName ?? r.job.contribution?.repoFullName,
          issueNumber: r.job.contribution?.issueNumber
        });
        topMatches = [...roleTop, ...bountyTop, ...contributeTop].map(toCard);
        const inTop = new Set(topMatches.map((m) => m.id));
        widenReserve = results.filter((r) => !inTop.has(r.job.id)).slice(0, 100).map(toCard);
      }
    } catch {
    }
    let topPeers = [];
    if (isPeerConnectEnabled()) try {
      const { match: match2, STRONG_MATCH_THRESHOLD: STRONG_MATCH_THRESHOLD2 } = await Promise.resolve().then(() => (init_src(), src_exports));
      const { extractFingerprint: extractFingerprint2 } = await Promise.resolve().then(() => (init_signal(), signal_exports));
      const sig = extractFingerprint2(process.cwd());
      const project = readProject();
      const skillTags = [
        .../* @__PURE__ */ new Set([
          ...Array.isArray(sig?.skillTags) ? sig.skillTags : [],
          ...project && Array.isArray(project.skillTags) ? project.skillTags : []
        ])
      ];
      if (skillTags.length > 0) {
        const fp = { skillTags, prefs: project?.prefs ?? {} };
        const directory = await fetchDirectory({ quiet: true });
        const cards = directory?.cards ?? [];
        if (cards.length > 0) {
          const strongPeers = match2(fp, cards, cards.length).filter(
            (r) => r.score >= STRONG_MATCH_THRESHOLD2
          );
          let ownLogin;
          try {
            const { readProfile: readProfile2 } = await Promise.resolve().then(() => (init_profile(), profile_exports));
            ownLogin = (await readProfile2())?.github?.login;
          } catch {
          }
          const peerResults = excludeOwnCard(strongPeers, ownLogin);
          topPeers = peerResults.map((r) => ({
            login: r.job.company,
            // public handle (person login / project owner)
            title: r.job.title,
            // public card title (name or project title)
            score: r.score,
            matchedTags: r.matchedTags,
            source: r.job.source,
            // 'person' | 'project'
            url: r.job.url,
            // public /r/<login> credential link
            id: r.job.id
          }));
          await reportMatched(peerResults);
        }
      }
    } catch {
    }
    let incomingPending = { count: 0 };
    let sessionStale = false;
    const sessionExpired = (res) => res.status === 401;
    const sessionCookie = readWebSessionFile();
    if (sessionCookie && !isInboundNudgeMuted()) try {
      const res = await fetch(`${API_URL7}/api/intro/list`, {
        method: "GET",
        headers: { Cookie: `${GH_SESSION_COOKIE7}=${sessionCookie}` },
        signal: AbortSignal.timeout(1e4)
      });
      if (res.ok) {
        const body = await res.json();
        const intros = Array.isArray(body?.intros) ? body.intros : [];
        const incoming = intros.filter((it) => it && it.role === "incoming" && it.status === "pending");
        incomingPending = { count: incoming.length };
      } else if (sessionExpired(res)) {
        sessionStale = true;
      }
    } catch {
    }
    let unreadChat = { count: 0 };
    if (sessionCookie && !isInboundNudgeMuted()) try {
      const res = await fetch(`${API_URL7}/api/chat/inbox`, {
        method: "GET",
        headers: { Cookie: `${GH_SESSION_COOKIE7}=${sessionCookie}` },
        signal: AbortSignal.timeout(1e4)
      });
      if (res.ok) {
        const body = await res.json();
        const inbox = Array.isArray(body?.inbox) ? body.inbox : [];
        const total = inbox.reduce(
          (sum, it) => sum + (it && typeof it.unreadCount === "number" && it.unreadCount > 0 ? it.unreadCount : 0),
          0
        );
        unreadChat = { count: total };
      } else if (sessionExpired(res)) {
        sessionStale = true;
      }
    } catch {
    }
    let seenHistory;
    try {
      const { loadSeenHistory: loadSeenHistory2 } = await Promise.resolve().then(() => (init_spinner_seen(), spinner_seen_exports));
      const { filterFreshMatches: filterFreshMatches2 } = await Promise.resolve().then(() => (init_spinner(), spinner_exports));
      seenHistory = loadSeenHistory2();
      topMatches = filterFreshMatches2(topMatches, seenHistory);
    } catch {
    }
    mkdirSync20(TERMINALHIRE_DIR16, { recursive: true });
    const cacheEntry = {
      ts: Date.now(),
      index,
      matchCount,
      topMatches,
      topPeers,
      incomingPending,
      unreadChat,
      sessionStale,
      // In-process-only despite being persisted: the render pass receives it as
      // a function argument below. A future cache READER must not gate on this
      // field without re-checking isContributeEnabled/isContributePrompted at
      // read time — the persisted copy can be stale relative to the answer.
      contributeNudge
    };
    writeFileSync20(INDEX_CACHE_FILE7, JSON.stringify(cacheEntry), "utf8");
    try {
      const { readSpinnerConfig: readSpinnerConfig2, renderRefreshSurface: renderRefreshSurface2 } = await Promise.resolve().then(() => (init_spinner(), spinner_exports));
      const sc = readSpinnerConfig2();
      let sessionTags;
      try {
        if (sc.enabled) {
          const { extractFingerprint: extractFingerprint2 } = await Promise.resolve().then(() => (init_signal(), signal_exports));
          const fp = extractFingerprint2(process.cwd());
          if (Array.isArray(fp.skillTags) && fp.skillTags.length > 0) {
            sessionTags = fp.skillTags;
          }
        }
      } catch {
      }
      let widen;
      try {
        if (sc.enabled && widenReserve.length > 0) {
          const { getAdjacentTags: getAdjacentTags2 } = await Promise.resolve().then(() => (init_src(), src_exports));
          widen = { reserve: widenReserve, getAdjacent: getAdjacentTags2 };
        }
      } catch {
      }
      renderRefreshSurface2(topMatches, sc, {
        sessionTags,
        topPeers,
        incomingPending,
        sessionStale,
        contributeNudge,
        baseUrl: API_URL7,
        seenHistory,
        widen
      });
    } catch {
    }
    try {
      const { readLocalVersion: readLocalVersion2, buildStaleNudge: buildStaleNudge2 } = await Promise.resolve().then(() => (init_version_nudge(), version_nudge_exports));
      const nudge = buildStaleNudge2(readLocalVersion2(), index?.cliVersion);
      if (nudge) process.stderr.write(`${nudge}
`);
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
var GH_SESSION_COOKIE7, __dirname4, TERMINALHIRE_DIR16, INDEX_CACHE_FILE7, API_URL7;
var init_jpi_refresh = __esm({
  "bin/jpi-refresh.js"() {
    "use strict";
    init_directory2();
    init_config();
    init_web_session();
    GH_SESSION_COOKIE7 = "__jpi_gh_session";
    __dirname4 = fileURLToPath5(new URL(".", import.meta.url));
    TERMINALHIRE_DIR16 = process.env["TERMINALHIRE_DIR"] || join28(homedir24(), ".terminalhire");
    INDEX_CACHE_FILE7 = join28(TERMINALHIRE_DIR16, "index-cache.json");
    API_URL7 = process.env["TERMINALHIRE_API_URL"] ?? process.env["JPI_API_URL"] ?? "https://www.terminalhire.com";
  }
});

// bin/jpi-save.js
var jpi_save_exports = {};
__export(jpi_save_exports, {
  run: () => run21
});
import { readFileSync as readFileSync25, existsSync as existsSync18 } from "fs";
import { join as join29 } from "path";
import { homedir as homedir25 } from "os";
import { fileURLToPath as fileURLToPath6 } from "url";
function findJobInCache(jobId) {
  try {
    if (!existsSync18(INDEX_CACHE_FILE8)) return null;
    const raw = readFileSync25(INDEX_CACHE_FILE8, "utf8");
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
async function run21() {
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
var __dirname5, TERMINALHIRE_DIR17, INDEX_CACHE_FILE8;
var init_jpi_save = __esm({
  "bin/jpi-save.js"() {
    "use strict";
    __dirname5 = fileURLToPath6(new URL(".", import.meta.url));
    TERMINALHIRE_DIR17 = process.env.TERMINALHIRE_DIR || join29(homedir25(), ".terminalhire");
    INDEX_CACHE_FILE8 = join29(TERMINALHIRE_DIR17, "index-cache.json");
  }
});

// bin/jpi-dispatch.js
import { fileURLToPath as fileURLToPath7 } from "url";
import { join as join30 } from "path";
import { existsSync as existsSync19, readFileSync as readFileSync26 } from "fs";
var __dirname6 = fileURLToPath7(new URL(".", import.meta.url));
function readPackageVersion() {
  try {
    const candidates = [
      join30(__dirname6, "..", "..", "package.json"),
      join30(__dirname6, "..", "package.json")
    ];
    for (const p of candidates) {
      if (existsSync19(p)) {
        const pkg = JSON.parse(readFileSync26(p, "utf8"));
        if (pkg.version) return pkg.version;
      }
    }
  } catch {
  }
  return "0.1.1";
}
var SUBCOMMANDS = ["jobs", "devs", "project", "bounties", "contribute", "claim", "trajectory", "mirror", "intro", "chat", "inbox", "connect", "link", "profile", "login", "logout", "learn", "config", "spinner", "statusline", "sync", "init", "refresh", "save", "saved", "unsave", "help", "--help", "-h", "--version", "-v"];
var firstArg = process.argv[2];
if (!firstArg && !process.stdin.isTTY) {
  const { default: childProcess } = await import("child_process");
  const nudgeScript = join30(__dirname6, "jpi.js");
  const child = childProcess.spawnSync(process.execPath, [nudgeScript], {
    stdio: ["inherit", "inherit", "inherit"]
  });
  process.exit(child.status ?? 0);
}
if (firstArg && SUBCOMMANDS.includes(firstArg) && process.stdin.isTTY) {
  try {
    const { readWebSessionFile: readWebSessionFile2 } = await Promise.resolve().then(() => (init_web_session(), web_session_exports));
    if (readWebSessionFile2()) {
      const { readConfig: readConfig3, writeConfig: writeConfig3, isInboundNudgeMuted: isInboundNudgeMuted2 } = await Promise.resolve().then(() => (init_config(), config_exports));
      if (!readConfig3().inboundNudgeDisclosed && !isInboundNudgeMuted2()) {
        process.stderr.write(
          "\n  Heads up: terminalhire now surfaces incoming connection requests in your spinner.\n  Turn it off any time with `terminalhire connect --mute`.\n\n"
        );
        writeConfig3({ inboundNudgeDisclosed: true });
      }
    }
  } catch {
  }
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
  console.log("  terminalhire jobs --all                     Page through the WHOLE ranked list (not just the top 10)");
  console.log("  terminalhire jobs --page N                  Show page N of the ranked list (page size = --limit)");
  console.log("  terminalhire jobs --status <s>              Filter: applied|saved|dismissed|clicked|unactioned");
  console.log("  terminalhire jobs --remote-only             Filter to remote roles only");
  console.log("  terminalhire jobs mark <id> <status>        Track your funnel locally: applied|saved|dismissed");
  console.log("  terminalhire devs                           Rank opted-in builders & projects locally (dev\u2194dev)");
  console.log("  terminalhire devs --as-project              Rank builders against your declared project (founder side)");
  console.log('  terminalhire project "<title>: <skills>"    Declare a project locally (never sent) to rank builders for');
  console.log("  terminalhire project --show                 Show your locally-declared project");
  console.log("  terminalhire bounties                       Day-sized paid tasks you can knock out today");
  console.log("  terminalhire bounties --priced              Only bounties with a known $ amount");
  console.log("  terminalhire contribute                     Open issues where a merged PR counts toward your r\xE9sum\xE9");
  console.log("  terminalhire claim record <id|issueUrl>     Claim a bounty locally + print the executor brief");
  console.log("  terminalhire claim list [--active]          List your claims + accepted-PR rate");
  console.log("  terminalhire claim status [<id>]            Poll source PR merge state (updates the metric)");
  console.log("  terminalhire trajectory                     Trajectory from your local Claude Code corpus");
  console.log("  terminalhire trajectory --export            Write a derived score + Markdown to ~/.terminalhire/");
  console.log("  terminalhire trajectory --inward            Also show private rework/recovery (never exported)");
  console.log("  terminalhire trajectory --push              Opt-in: link your derived trajectory to your dashboard (typed-yes)");
  console.log("  terminalhire trajectory --push --delete     Unlink (revoke) your trajectory from the dashboard");
  console.log("  terminalhire intro <github-login>           Request a consented intro to another developer (typed-yes)");
  console.log("  terminalhire intro --list                   See your sent + received intros");
  console.log("  terminalhire intro --accept @<login>        Accept a pending request by handle (or --decline)");
  console.log("  terminalhire chat                           Inbox: one line per connection (presence \xB7 unread \xB7 last)");
  console.log("  terminalhire chat <github-login> --read     Read a thread inline (last 8; -n N / --all for depth)");
  console.log('  terminalhire chat <github-login> --send "\u2026" Send one line to a connection (E2E encrypted)');
  console.log("  terminalhire chat <github-login>            Open the live E2E chat pane with an accepted connection");
  console.log("  terminalhire inbox                          Interactive inbox: navigate conversations, open/read, act on invites");
  console.log("  terminalhire connect <github-login>         Request a consented intro (alias for `intro`)");
  console.log("  terminalhire connect                        Connect family overview + inbound-nudge state");
  console.log("  terminalhire connect --mute                 Stop surfacing incoming connection requests in the spinner");
  console.log("  terminalhire connect --unmute               Resume surfacing incoming connection requests");
  console.log("  terminalhire link                           Connect this terminal to your terminalhire account");
  console.log("  terminalhire link --logout                  Revoke + remove this terminal's linked session");
  console.log("  terminalhire profile --show                 Display your encrypted local profile");
  console.log("  terminalhire profile --edit                 Set displayName, contactEmail, prefs");
  console.log("  terminalhire profile --delete               Wipe profile and encryption key from disk");
  console.log("  terminalhire config --nudge session         Nudge at most once per session (default)");
  console.log("  terminalhire config --nudge always          Nudge every statusLine render");
  console.log("  terminalhire config --nudge every:N         Nudge every Nth render");
  console.log("  terminalhire config --connect on|off        Opt in/out of ambient peer & founder surfacing (default off)");
  console.log("  terminalhire config --show                  Print current config");
  console.log("  terminalhire spinner --show                 Job matches in the spinner line while Claude works");
  console.log("  terminalhire spinner --off                  Turn the spinner job surface off (restores your spinner)");
  console.log("  terminalhire spinner --mode append|replace  Mix with Claude defaults, or show only matches");
  console.log("  terminalhire statusline --on                Connection-only statusLine (\u{1F4AC} unread + intro requests)");
  console.log("  terminalhire statusline --off               Remove it + restore your prior statusLine");
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
  const local = readPackageVersion();
  console.log(`terminalhire v${local}`);
  try {
    const { cachedStaleNudge: cachedStaleNudge2 } = await Promise.resolve().then(() => (init_version_nudge(), version_nudge_exports));
    const nudge = cachedStaleNudge2(local);
    if (nudge) process.stderr.write(`${nudge}
`);
  } catch {
  }
  process.exit(0);
}
if (firstArg === "login" || firstArg === "logout") {
  const mod2 = await Promise.resolve().then(() => (init_jpi_login(), jpi_login_exports));
  await mod2.run();
  process.exit(0);
}
if (firstArg === "jobs") {
  process.argv.splice(2, 1);
  const mod2 = await Promise.resolve().then(() => (init_jpi_jobs(), jpi_jobs_exports));
  await mod2.run();
  process.exit(0);
}
if (firstArg === "devs") {
  process.argv.splice(2, 1);
  const mod2 = await Promise.resolve().then(() => (init_jpi_devs(), jpi_devs_exports));
  await mod2.run();
  process.exit(0);
}
if (firstArg === "project") {
  process.argv.splice(2, 1);
  const mod2 = await Promise.resolve().then(() => (init_jpi_project(), jpi_project_exports));
  await mod2.run();
  process.exit(0);
}
if (firstArg === "bounties") {
  process.argv.splice(2, 1);
  const mod2 = await Promise.resolve().then(() => (init_jpi_bounties(), jpi_bounties_exports));
  await mod2.run();
  process.exit(0);
}
if (firstArg === "contribute") {
  process.argv.splice(2, 1);
  const mod2 = await Promise.resolve().then(() => (init_jpi_contribute(), jpi_contribute_exports));
  await mod2.run();
  process.exit(0);
}
if (firstArg === "claim") {
  process.argv.splice(2, 1);
  const mod2 = await Promise.resolve().then(() => (init_jpi_claim(), jpi_claim_exports));
  await mod2.run();
  process.exit(0);
}
if (firstArg === "trajectory" || firstArg === "mirror") {
  process.argv.splice(2, 1);
  const mod2 = await Promise.resolve().then(() => (init_jpi_trajectory(), jpi_trajectory_exports));
  await mod2.run();
  process.exit(0);
}
if (firstArg === "intro") {
  process.argv.splice(2, 1);
  const mod2 = await Promise.resolve().then(() => (init_jpi_intro(), jpi_intro_exports));
  await mod2.run();
  process.exit(0);
}
if (firstArg === "chat") {
  process.argv.splice(2, 1);
  const mod2 = await Promise.resolve().then(() => (init_jpi_chat(), jpi_chat_exports));
  await mod2.run();
  process.exit(0);
}
if (firstArg === "inbox") {
  process.argv.splice(2, 1);
  const mod2 = await Promise.resolve().then(() => (init_jpi_inbox(), jpi_inbox_exports));
  try {
    await mod2.run();
  } catch (err) {
    process.stdout.write("\x1B[?25h\x1B[?1049l");
    console.error(`inbox error: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  }
  process.exit(0);
}
if (firstArg === "connect") {
  const sub = process.argv[3];
  const isConnectOwn = !sub || sub === "--mute" || sub === "--unmute";
  if (!isConnectOwn) {
    process.argv.splice(2, 1);
    const mod3 = await Promise.resolve().then(() => (init_jpi_intro(), jpi_intro_exports));
    await mod3.run();
    process.exit(0);
  }
  const mod2 = await Promise.resolve().then(() => (init_jpi_connect(), jpi_connect_exports));
  await mod2.run();
  process.exit(0);
}
if (firstArg === "link") {
  process.argv.splice(2, 1);
  const mod2 = await Promise.resolve().then(() => (init_jpi_link(), jpi_link_exports));
  await mod2.run();
  process.exit(0);
}
if (firstArg === "profile") {
  const mod2 = await Promise.resolve().then(() => (init_jpi_profile(), jpi_profile_exports));
  await mod2.run();
  process.exit(0);
}
if (firstArg === "learn") {
  const mod2 = await Promise.resolve().then(() => (init_jpi_learn(), jpi_learn_exports));
  await mod2.run();
  process.exit(0);
}
if (firstArg === "config") {
  const mod2 = await Promise.resolve().then(() => (init_jpi_config(), jpi_config_exports));
  await mod2.run();
  process.exit(0);
}
if (firstArg === "spinner") {
  const mod2 = await Promise.resolve().then(() => (init_jpi_spinner(), jpi_spinner_exports));
  await mod2.run();
  process.exit(0);
}
if (firstArg === "statusline") {
  const flags = process.argv.slice(3);
  const uninstall = flags.includes("--off") || flags.includes("--uninstall");
  const on = flags.includes("--on");
  if (!on && !uninstall) {
    console.error("Usage: terminalhire statusline --on | --off");
    process.exit(1);
  }
  const fromDist = join30(__dirname6, "..", "..", "statusline-install.js");
  const fromBin = join30(__dirname6, "..", "statusline-install.js");
  const installer = existsSync19(fromDist) ? fromDist : fromBin;
  const { spawnSync: spawnSync2 } = await import("child_process");
  const child = spawnSync2(
    process.execPath,
    uninstall ? [installer, "--uninstall"] : [installer],
    { stdio: ["inherit", "inherit", "inherit"], env: process.env }
  );
  process.exit(child.status ?? 0);
}
if (firstArg === "sync") {
  const mod2 = await Promise.resolve().then(() => (init_jpi_sync(), jpi_sync_exports));
  await mod2.run();
  process.exit(0);
}
if (firstArg === "init") {
  const mod2 = await Promise.resolve().then(() => (init_jpi_init(), jpi_init_exports));
  await mod2.run();
  process.exit(0);
}
if (firstArg === "refresh") {
  const mod2 = await Promise.resolve().then(() => (init_jpi_refresh(), jpi_refresh_exports));
  await mod2.run();
  process.exit(0);
}
if (firstArg === "save" || firstArg === "saved" || firstArg === "unsave") {
  const mod2 = await Promise.resolve().then(() => (init_jpi_save(), jpi_save_exports));
  await mod2.run();
  process.exit(0);
}
console.error(`terminalhire: unknown command '${firstArg}'. Run 'terminalhire help' for usage.`);
process.exit(1);
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
