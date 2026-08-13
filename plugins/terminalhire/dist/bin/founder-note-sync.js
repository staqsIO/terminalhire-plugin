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

// bin/founder-note-sync.js
var CLAIM_SYNC_BASE = resolveApiBase();
async function fetchFounderNotes(pushToken, fetchImpl = fetch) {
  if (typeof pushToken !== "string" || pushToken.length === 0) return null;
  try {
    const res = await fetchImpl(`${CLAIM_SYNC_BASE}/api/claim/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pushToken }),
      signal: AbortSignal.timeout(15e3)
    });
    if (!res?.ok) return null;
    const body = await res.json();
    if (!body || !Array.isArray(body.notes)) return null;
    const notes = body.notes.filter(
      (n) => n && typeof n.claimId === "string" && n.claimId !== "" && typeof n.note === "string" && n.note !== "" && typeof n.at === "string" && (n.kind === "founder_note" || n.kind === "feedback")
    );
    return { notes, latestAt: typeof body.latestAt === "string" ? body.latestAt : null };
  } catch {
    return null;
  }
}
function noteKey(note) {
  return `${note.claimId}@${note.at}`;
}
function computeFounderNotes(notes, previous) {
  const keys = Array.isArray(notes) ? notes.map(noteKey) : [];
  const prior = previous && Array.isArray(previous.seen) ? new Set(previous.seen) : /* @__PURE__ */ new Set();
  const seen = keys.filter((k) => prior.has(k));
  return { count: keys.length - seen.length, seen };
}
function acknowledgeFounderNotes(notes) {
  const keys = Array.isArray(notes) ? notes.map(noteKey) : [];
  return { count: 0, seen: keys };
}
async function syncFounderNotes({
  readAutoMarker,
  readPushTokenEnc,
  readPrevious,
  fetchImpl = fetch,
  timeoutMs = 15e3
} = {}) {
  try {
    const marker = readAutoMarker();
    const token = await readPushTokenEnc();
    if (!marker || !token) return null;
    const answer = await fetchFounderNotes(
      token,
      (url, init) => fetchImpl(url, { ...init, signal: AbortSignal.timeout(timeoutMs) })
    );
    if (!answer) return null;
    return computeFounderNotes(answer.notes, readPrevious());
  } catch {
    return null;
  }
}
function formatNote(note) {
  const label = note.kind === "feedback" ? "changes requested" : "note";
  return `  ${note.at.slice(0, 16).replace("T", " ")}  [${label}]  ${note.claimId}
    ${note.note.split("\n").join("\n    ")}`;
}
export {
  acknowledgeFounderNotes,
  computeFounderNotes,
  fetchFounderNotes,
  formatNote,
  noteKey,
  syncFounderNotes
};
