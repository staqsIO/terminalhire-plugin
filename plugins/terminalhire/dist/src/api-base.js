// src/api-base.ts
var PROD_API_BASE = "https://terminalhire.com";
var DEV_API_BASE = "https://dev.terminalhire.com";
var ApiBaseError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "ApiBaseError";
  }
};
var ALLOWED_HOSTS = {
  "terminalhire.com": "https:",
  "www.terminalhire.com": "https:",
  "dev.terminalhire.com": "https:",
  localhost: "http:",
  "127.0.0.1": "http:"
};
var OAUTH_ALLOWED_ORIGINS = [PROD_API_BASE, DEV_API_BASE];
var ALLOW_LOCAL_OAUTH_KEY = "TERMINALHIRE_ALLOW_LOCAL_OAUTH";
var ALLOW_LOCAL_API_KEY = "TERMINALHIRE_ALLOW_LOCAL_API";
var ALLOWED_DESCRIPTION = [
  PROD_API_BASE,
  DEV_API_BASE,
  `http://localhost:<port> (requires ${ALLOW_LOCAL_API_KEY}=1)`,
  `http://127.0.0.1:<port> (requires ${ALLOW_LOCAL_API_KEY}=1)`
].join(", ");
var CANONICAL_REWRITES = {
  "www.terminalhire.com": PROD_API_BASE
};
var ENV_KEYS = ["TERMINALHIRE_API_URL", "JPI_API_URL"];
function sanitizeOverrideForError(raw) {
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return `(disallowed scheme: ${url.protocol.slice(0, -1)})`;
    }
    if (url.username !== "" || url.password !== "") {
      return `${url.protocol}//***@${url.host}`;
    }
    return url.origin;
  } catch {
    return "(unparseable override)";
  }
}
function isLoopbackOrigin(origin) {
  try {
    const host = new URL(origin).hostname;
    return host === "localhost" || host === "127.0.0.1";
  } catch {
    return false;
  }
}
function localApiAllowed(env) {
  return env[ALLOW_LOCAL_API_KEY] === "1";
}
function resolveApiBase(env = process.env) {
  for (const key of ENV_KEYS) {
    const raw = env[key];
    if (typeof raw !== "string") continue;
    const trimmed = raw.trim();
    if (trimmed === "") continue;
    const normalized = normalizeOverride(trimmed);
    if (normalized === null) {
      throw new ApiBaseError(
        `terminalhire: ${key}=${sanitizeOverrideForError(trimmed)} is not an allowed API host (allowed: ${ALLOWED_DESCRIPTION}). Refusing to continue so we do not silently hit production.`
      );
    }
    if (isLoopbackOrigin(normalized) && !localApiAllowed(env)) {
      throw new ApiBaseError(
        `terminalhire: ${key}=${normalized} is a loopback origin. Set ${ALLOW_LOCAL_API_KEY}=1 to talk to a local web app on purpose. Refusing so stored credentials cannot be exfiltrated to localhost by a poisoned override.`
      );
    }
    return normalized;
  }
  return PROD_API_BASE;
}
function resolveOAuthBase(env = process.env) {
  const base = resolveApiBase(env);
  if (OAUTH_ALLOWED_ORIGINS.includes(base)) return base;
  if (env[ALLOW_LOCAL_OAUTH_KEY] === "1") return base;
  throw new ApiBaseError(
    `terminalhire: the API base is ${base}, which is not a trusted origin for a browser sign-in. Point the CLI at ${DEV_API_BASE} for an end-to-end login, or set ${ALLOW_LOCAL_OAUTH_KEY}=1 (with ${ALLOW_LOCAL_API_KEY}=1) if you are running the web app locally on purpose. Refusing to open production sign-in while the API is local.`
  );
}
function resolveApiBaseOrProd(env = process.env) {
  try {
    return resolveApiBase(env);
  } catch {
    return PROD_API_BASE;
  }
}
function normalizeOverride(raw) {
  let url;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.username !== "" || url.password !== "") return null;
  const expectedProtocol = ALLOWED_HOSTS[url.hostname];
  if (expectedProtocol === void 0) return null;
  if (url.protocol !== expectedProtocol) return null;
  if (url.hostname !== "localhost" && url.hostname !== "127.0.0.1" && url.port !== "") {
    return null;
  }
  const rewrite = CANONICAL_REWRITES[url.hostname];
  if (rewrite !== void 0) return rewrite;
  return url.origin;
}
function isNonProdApiBase(base = resolveApiBaseOrProd()) {
  return base !== PROD_API_BASE;
}
function formatDevMarker(base = resolveApiBaseOrProd()) {
  if (!isNonProdApiBase(base)) return null;
  let host = base;
  try {
    host = new URL(base).host;
  } catch {
  }
  return `[dev \u2192 ${host}]`;
}
var markerPrinted = false;
function printDevMarkerIfNeeded(stream = process.stderr) {
  if (markerPrinted) return;
  const marker = formatDevMarker();
  if (marker === null) return;
  markerPrinted = true;
  try {
    stream.write(`${marker}
`);
  } catch {
  }
}
function __resetDevMarkerLatchForTests() {
  markerPrinted = false;
}
function warnSharedCredentialsIfNonProd(base, stream = process.stderr) {
  if (!isNonProdApiBase(base)) return;
  try {
    stream.write(
      "terminalhire: non-prod API base \u2014 using the same local session/push credentials as prod; do not mix environments casually.\n"
    );
  } catch {
  }
}
export {
  ApiBaseError,
  DEV_API_BASE,
  PROD_API_BASE,
  __resetDevMarkerLatchForTests,
  formatDevMarker,
  isNonProdApiBase,
  printDevMarkerIfNeeded,
  resolveApiBase,
  resolveOAuthBase,
  warnSharedCredentialsIfNonProd
};
