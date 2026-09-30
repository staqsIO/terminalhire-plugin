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
var open_url_exports = {};
__export(open_url_exports, {
  openInBrowser: () => openInBrowser,
  shouldOpenBrowser: () => shouldOpenBrowser
});
import { spawn as nodeSpawn } from "child_process";
function shouldOpenBrowser(env = process.env) {
  if (env.NODE_TEST_CONTEXT) return false;
  const off = String(env.TERMINALHIRE_NO_BROWSER ?? "").trim().toLowerCase();
  return !(off === "1" || off === "true");
}
function openInBrowser(url, { env = process.env, spawn = nodeSpawn } = {}) {
  if (!shouldOpenBrowser(env)) return;
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

// src/founder-oauth.ts
import { createServer } from "http";
import { createHash, randomBytes } from "crypto";
var OAUTH_TIMEOUT_MS = 3e5;
var OAUTH_CLIENT_NAME = "terminalhire setup";
function pkceChallenge(verifier) {
  return createHash("sha256").update(verifier).digest("base64url");
}
function createPkcePair() {
  const verifier = randomBytes(32).toString("base64url");
  return { verifier, challenge: pkceChallenge(verifier) };
}
function resolveOAuthCallback(rawUrl, expectedState) {
  let u;
  try {
    u = new URL(rawUrl, "http://127.0.0.1");
  } catch {
    return { ok: false, reason: "bad_url" };
  }
  if (u.pathname !== "/callback") return null;
  const state = u.searchParams.get("state");
  if (!state || state !== expectedState) return { ok: false, reason: "state_mismatch" };
  if (u.searchParams.get("error")) return { ok: false, reason: "denied" };
  const code = u.searchParams.get("code");
  if (!code) return { ok: false, reason: "missing_code" };
  return { ok: true, code };
}
var DONE_HTML = `<!doctype html><html><head><meta charset="utf-8"><title>terminalhire</title></head>
<body style="font-family:system-ui;padding:2rem;background:#0b0d10;color:#e6e6e6">
<script>history.replaceState({},'','/');</script>
<p>Approved. Go back to your terminal; you can close this tab.</p>
</body></html>`;
var FAILED_HTML = `<!doctype html><html><head><meta charset="utf-8"><title>terminalhire</title></head>
<body style="font-family:system-ui;padding:2rem;background:#0b0d10;color:#e6e6e6">
<script>history.replaceState({},'','/');</script>
<p>That did not work. Go back to your terminal and run <code>terminalhire setup</code> again.</p>
</body></html>`;
function startOAuthLoopback(expectedState, timeoutMs, host = "127.0.0.1") {
  return new Promise((resolveHandle, rejectHandle) => {
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
      const outcome = resolveOAuthCallback(req.url ?? "", expectedState);
      if (outcome === null) {
        res.writeHead(404);
        res.end();
        return;
      }
      if (!outcome.ok && (outcome.reason === "state_mismatch" || outcome.reason === "bad_url")) {
        res.writeHead(400);
        res.end();
        return;
      }
      res.writeHead(outcome.ok ? 200 : 400, { "Content-Type": "text/html; charset=utf-8" });
      res.end(outcome.ok ? DONE_HTML : FAILED_HTML);
      finish(outcome);
    });
    const timer = setTimeout(() => finish({ ok: false, reason: "timeout" }), timeoutMs);
    if (typeof timer.unref === "function") timer.unref();
    let listening = false;
    server.on("error", (err) => {
      if (!listening) rejectHandle(err);
      else finish({ ok: false, reason: "listen_error" });
    });
    server.listen(0, host, () => {
      listening = true;
      const addr = server.address();
      const port = typeof addr === "object" && addr ? addr.port : 0;
      resolveHandle({
        port,
        result,
        close: () => {
          clearTimeout(timer);
          try {
            server.close();
          } catch {
          }
        }
      });
    });
  });
}
var FounderOAuthError = class extends Error {
};
async function registerClient(base, redirectUri, fetchImpl = globalThis.fetch) {
  const res = await fetchImpl(`${base}/api/founder/mcp/oauth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_name: OAUTH_CLIENT_NAME, redirect_uris: [redirectUri] }),
    signal: AbortSignal.timeout(15e3)
  });
  const body = await res.json().catch(() => ({}));
  const clientId = body["client_id"];
  if (!res.ok || typeof clientId !== "string") {
    const why = typeof body["error_description"] === "string" ? body["error_description"] : res.status;
    throw new FounderOAuthError(`could not register this terminal with ${base} (${why})`);
  }
  return clientId;
}
function authorizeUrl(base, p) {
  const u = new URL("/api/founder/mcp/oauth/authorize", base);
  u.searchParams.set("response_type", "code");
  u.searchParams.set("client_id", p.clientId);
  u.searchParams.set("redirect_uri", p.redirectUri);
  u.searchParams.set("code_challenge", p.challenge);
  u.searchParams.set("code_challenge_method", "S256");
  u.searchParams.set("state", p.state);
  return u.toString();
}
async function exchangeCode(base, p, fetchImpl = globalThis.fetch) {
  const res = await fetchImpl(`${base}/api/founder/mcp/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: p.code,
      client_id: p.clientId,
      redirect_uri: p.redirectUri,
      code_verifier: p.verifier
    }).toString(),
    signal: AbortSignal.timeout(15e3)
  });
  const body = await res.json().catch(() => ({}));
  const token = body["access_token"];
  if (!res.ok || typeof token !== "string") {
    throw new FounderOAuthError("the approval could not be exchanged for a connector token");
  }
  const scope = typeof body["scope"] === "string" ? body["scope"] : "";
  return { token, canWrite: scope.split(/\s+/).includes("mcp:write") };
}
var REASON_TEXT = {
  state_mismatch: "the browser came back with an answer this terminal did not ask for",
  missing_code: "the browser came back without an approval code",
  denied: "the approval was declined",
  bad_url: "the browser came back with an unreadable address",
  timeout: "no approval arrived in time",
  listen_error: "the local listener stopped"
};
async function runFounderOAuth(overrides) {
  const deps = {
    startLoopback: (state2, timeoutMs) => startOAuthLoopback(state2, timeoutMs),
    openBrowser: (url) => {
      void Promise.resolve().then(() => (init_open_url(), open_url_exports)).then((m) => m.openInBrowser(url)).catch(() => {
      });
    },
    fetchImpl: globalThis.fetch,
    onAuthorizeUrl: () => {
    },
    timeoutMs: OAUTH_TIMEOUT_MS,
    randomState: () => randomBytes(16).toString("hex"),
    pkce: createPkcePair,
    ...overrides
  };
  const state = deps.randomState();
  const { verifier, challenge } = deps.pkce();
  const handle = await deps.startLoopback(state, deps.timeoutMs);
  try {
    const redirectUri = `http://127.0.0.1:${handle.port}/callback`;
    const clientId = await registerClient(deps.base, redirectUri, deps.fetchImpl);
    const url = authorizeUrl(deps.base, { clientId, redirectUri, challenge, state });
    deps.onAuthorizeUrl(url);
    deps.openBrowser(url);
    const outcome = await handle.result;
    if (!outcome.ok || !outcome.code) {
      throw new FounderOAuthError(REASON_TEXT[outcome.reason ?? "missing_code"]);
    }
    return await exchangeCode(
      deps.base,
      { code: outcome.code, clientId, redirectUri, verifier },
      deps.fetchImpl
    );
  } finally {
    handle.close();
  }
}
export {
  FounderOAuthError,
  OAUTH_CLIENT_NAME,
  OAUTH_TIMEOUT_MS,
  authorizeUrl,
  createPkcePair,
  exchangeCode,
  pkceChallenge,
  registerClient,
  resolveOAuthCallback,
  runFounderOAuth,
  startOAuthLoopback
};
