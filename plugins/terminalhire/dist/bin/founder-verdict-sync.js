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

// bin/founder-verdict-sync.js
var CLAIM_SYNC_BASE = resolveApiBase();
var TERMINAL = /* @__PURE__ */ new Set(["merged", "abandoned"]);
function verdictState(verdict) {
  return verdict === "rejected" ? "abandoned" : "merged";
}
async function fetchFounderVerdicts(pushToken, fetchImpl = fetch) {
  if (typeof pushToken !== "string" || pushToken.length === 0) return null;
  try {
    const res = await fetchImpl(`${CLAIM_SYNC_BASE}/api/claim/verdicts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pushToken }),
      signal: AbortSignal.timeout(15e3)
    });
    if (!res?.ok) return null;
    const body = await res.json();
    if (!body || !Array.isArray(body.verdicts)) return null;
    const verdicts = body.verdicts.filter(
      (v) => v && typeof v.claimId === "string" && v.claimId !== "" && (v.verdict === "accepted" || v.verdict === "rejected")
    );
    return { verdicts, latestAt: typeof body.latestAt === "string" ? body.latestAt : null };
  } catch {
    return null;
  }
}
function planVerdictTransitions(claims, verdicts, nextPolledState) {
  if (!Array.isArray(claims) || !Array.isArray(verdicts)) return [];
  const byClaimId = /* @__PURE__ */ new Map();
  for (const v of verdicts) {
    if (v && typeof v.claimId === "string" && v.claimId !== "") byClaimId.set(v.claimId, v);
  }
  const plan = [];
  for (const c of claims) {
    const claimId = c?.approval?.claimId;
    if (!claimId) continue;
    const v = byClaimId.get(claimId);
    if (!v) continue;
    if (TERMINAL.has(c.state)) continue;
    const to = verdictState(v.verdict);
    const next = nextPolledState(c.state, to);
    if (next === c.state) continue;
    plan.push({
      id: c.id,
      claimId,
      from: c.state,
      to: next,
      verdict: v.verdict,
      settled: v.settled === true,
      amountUSD: typeof c.amountUSD === "number" ? c.amountUSD : null,
      title: typeof c.title === "string" ? c.title : ""
    });
  }
  return plan;
}
function buildVerdictNotice(t) {
  if (!t || typeof t.to !== "string") return null;
  const amount = typeof t.amountUSD === "number" && t.amountUSD > 0 ? `$${t.amountUSD}` : null;
  if (t.verdict === "rejected") {
    return `  \u2717 founder rejected${amount ? ` \u2014 ${amount}` : ""} \xB7 claim moved to ${t.to}`;
  }
  const paid = t.settled ? " \xB7 paid" : "";
  return `  \u2713 founder accepted${amount ? ` \u2014 ${amount}` : ""}${paid} \xB7 claim moved to ${t.to}`;
}
async function syncFounderVerdicts({
  claimsModule,
  targets,
  readPushTokenEnc,
  fetchImpl = fetch,
  log = console.log
} = {}) {
  const quiet = { checked: false, unavailable: false, applied: [] };
  try {
    const founderTargets = (targets ?? []).filter(
      (c) => Boolean(c?.approval) && !TERMINAL.has(c.state)
    );
    if (founderTargets.length === 0) return quiet;
    let pushToken = null;
    try {
      pushToken = await readPushTokenEnc();
    } catch {
      pushToken = null;
    }
    if (!pushToken) return quiet;
    const res = await fetchFounderVerdicts(pushToken, fetchImpl);
    if (!res) return { checked: false, unavailable: true, applied: [] };
    const plan = planVerdictTransitions(founderTargets, res.verdicts, claimsModule.nextPolledState);
    const applied = [];
    for (const t of plan) {
      try {
        claimsModule.updateClaim(t.id, { state: t.to });
        applied.push(t);
        const line = buildVerdictNotice(t);
        if (line) log(line);
      } catch {
      }
    }
    return { checked: true, unavailable: false, applied };
  } catch {
    return quiet;
  }
}
export {
  buildVerdictNotice,
  fetchFounderVerdicts,
  planVerdictTransitions,
  syncFounderVerdicts,
  verdictState
};
