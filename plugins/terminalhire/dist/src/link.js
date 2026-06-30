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

// src/link.ts
import { createServer } from "http";
import { randomBytes } from "crypto";

// src/web-session.ts
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

// src/link.ts
var LINK_BASE = "https://www.terminalhire.com";
var GH_SESSION_COOKIE = "__jpi_gh_session";
var LINK_TIMEOUT_MS = 12e4;
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
var LINKED_HTML = `<!doctype html><html><head><meta charset="utf-8"><title>terminalhire</title></head>
<body style="font-family:system-ui;padding:2rem;background:#0b0d10;color:#e6e6e6">
<script>history.replaceState({},'','/');</script>
<p>CLI linked \u2014 you can close this tab.</p>
<script>setTimeout(function(){window.close();},400);</script>
</body></html>`;
var FAILED_HTML = `<!doctype html><html><head><meta charset="utf-8"><title>terminalhire</title></head>
<body style="font-family:system-ui;padding:2rem;background:#0b0d10;color:#e6e6e6">
<script>history.replaceState({},'','/');</script>
<p>Link failed \u2014 return to your terminal and run <code>terminalhire link</code> again.</p>
</body></html>`;
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
    generateNonce: () => randomBytes(16).toString("hex"),
    persistToken: (token) => writeWebSessionFile(token),
    log: (msg) => console.log(msg),
    errorLog: (msg) => console.error(msg),
    exit: (code) => process.exit(code)
  };
}
async function runLink(overrides) {
  const deps = { ...defaultLinkDeps(), ...overrides };
  const nonce = deps.generateNonce();
  const handle = await deps.startLoopback(nonce, LINK_TIMEOUT_MS);
  const url = `${LINK_BASE}/api/auth/link?port=${handle.port}&nonce=${encodeURIComponent(nonce)}`;
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
  deps.log("  Unlink any time with `terminalhire link --logout`.\n");
  deps.exit(0);
}
function defaultLinkLogoutDeps() {
  return {
    fetchImpl: (...args) => globalThis.fetch(...args),
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
    const res = await deps.fetchImpl(`${LINK_BASE}/api/auth/session`, {
      method: "DELETE",
      headers: { Cookie: `${GH_SESSION_COOKIE}=${token}` },
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
export {
  resolveLoopbackRequest,
  runLink,
  runLinkLogout
};
