// src/api-base.ts
import { homedir } from "os";
import { basename, join, normalize } from "path";
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

// bin/sanitize.js
var WHITESPACE_CONTROLS = /[\t\n\v\f\r]+/g;
var CONTROL_CHARS = /[\x00-\x1f\x7f-\x9f]/g;
function sanitizeText(s) {
  if (s == null) return "";
  return String(s).replace(WHITESPACE_CONTROLS, " ").replace(CONTROL_CHARS, "");
}
var NON_LINE_CONTROLS = /[\x00-\x08\x0b-\x1f\x7f-\x9f]/g;
function sanitizeMultiline(s) {
  if (s == null) return "";
  return String(s).replace(/\r\n?/g, "\n").replace(NON_LINE_CONTROLS, "");
}
var INVISIBLE_MARKS = new RegExp(
  `[${[
    [8203, 8207],
    [8234, 8238],
    [8294, 8297],
    [65279, 65279]
  ].map(([from, to]) => `${String.fromCodePoint(from)}-${String.fromCodePoint(to)}`).join("")}]`,
  "g"
);
function stripInvisibleMarks(s) {
  if (s == null) return "";
  return String(s).replace(INVISIBLE_MARKS, "");
}
function safeHttpUrl(url) {
  if (url == null) return null;
  const raw = String(url);
  CONTROL_CHARS.lastIndex = 0;
  if (CONTROL_CHARS.test(raw)) return null;
  let parsed;
  try {
    parsed = new URL(raw);
  } catch {
    return null;
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
  return parsed.href;
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
var filled = (v) => typeof v === "string" && v !== "";
var id = (v) => filled(v) && sanitizeText(v) === v;
function contextClaim(c) {
  if (!c || !id(c.claimId)) return null;
  if (c.state === "after-approval")
    return { claimId: c.claimId, state: "after-approval", notes: [], links: [] };
  if (c.state !== "available") return null;
  const notes = (Array.isArray(c.notes) ? c.notes : []).filter((n) => n && filled(n.id) && typeof n.text === "string" && filled(n.at)).map((n) => ({
    id: n.id,
    text: n.text,
    at: n.at,
    files: (Array.isArray(n.files) ? n.files : []).filter(
      (f) => f && id(f.id) && filled(f.name) && Number.isSafeInteger(f.sizeBytes) && f.sizeBytes >= 0
    ).map((f) => ({
      id: f.id,
      name: f.name,
      contentType: filled(f.contentType) ? f.contentType : "application/octet-stream",
      sizeBytes: f.sizeBytes
    }))
  }));
  const links = (Array.isArray(c.links) ? c.links : []).filter((l) => l && filled(l.url)).map((l) => ({ url: l.url, label: filled(l.label) ? l.label : null }));
  return { claimId: c.claimId, state: "available", notes, links };
}
async function fetchClaimContext(pushToken, fetchImpl = fetch) {
  if (!filled(pushToken)) return null;
  try {
    const res = await fetchImpl(`${CLAIM_SYNC_BASE}/api/claim/context`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pushToken }),
      signal: AbortSignal.timeout(15e3)
    });
    if (!res?.ok) return null;
    const body = await res.json();
    if (!body || !Array.isArray(body.claims)) return null;
    return {
      claims: body.claims.map(contextClaim).filter(Boolean),
      truncated: body.truncated === true
    };
  } catch {
    return null;
  }
}
async function fetchClaimContextFile(pushToken, fileId, range, fetchImpl = fetch) {
  if (!filled(pushToken) || !filled(fileId) || !filled(range)) return null;
  try {
    const res = await fetchImpl(`${CLAIM_SYNC_BASE}/api/claim/context/file`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pushToken, fileId, range }),
      signal: AbortSignal.timeout(6e4)
    });
    if (!res?.ok) return null;
    return new Uint8Array(await res.arrayBuffer());
  } catch {
    return null;
  }
}
function contextView(claims) {
  return (Array.isArray(claims) ? claims : []).map((c) => ({
    claimId: sanitizeText(c.claimId),
    state: c.state,
    notes: c.notes.map((n) => ({
      id: sanitizeText(n.id),
      at: sanitizeText(n.at),
      text: sanitizeMultiline(n.text).trim(),
      files: n.files.map((f) => ({
        id: sanitizeText(f.id),
        name: stripInvisibleMarks(sanitizeText(f.name)),
        contentType: sanitizeText(f.contentType),
        sizeBytes: f.sizeBytes
      }))
    })),
    links: c.links.map((l) => ({ url: safeHttpUrl(l.url), label: l.label ? sanitizeText(l.label) : null })).filter((l) => l.url)
  }));
}
function formatBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(n < 10 * 1024 ? 1 : 0)} KB`;
  return `${(n / (1024 * 1024)).toFixed(n < 10 * 1024 * 1024 ? 1 : 0)} MB`;
}
function formatContext(claim) {
  const out = [`  Context \xB7 ${claim.claimId}`];
  if (claim.state === "after-approval") {
    out.push("    Available after approval");
    return out.join("\n");
  }
  if (claim.notes.length === 0 && claim.links.length === 0) {
    out.push("    No Context on this task");
    return out.join("\n");
  }
  for (const note of claim.notes) {
    out.push(`    ${note.at.slice(0, 16).replace("T", " ")}`);
    if (note.text) out.push(`      ${note.text.replace(/\t/g, " ").split("\n").join("\n      ")}`);
    for (const f of note.files) out.push(`      File: ${f.name} (${formatBytes(f.sizeBytes)})`);
  }
  for (const link of claim.links)
    out.push(`    Link: ${link.label ? `${link.label} \xB7 ` : ""}${link.url}`);
  return out.join("\n");
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
  const text = sanitizeMultiline(note.note).replace(/\t/g, " ");
  return `  ${sanitizeText(note.at).slice(0, 16).replace("T", " ")}  [${label}]  ${sanitizeText(note.claimId)}
    ${text.split("\n").join("\n    ")}`;
}
export {
  acknowledgeFounderNotes,
  computeFounderNotes,
  contextView,
  fetchClaimContext,
  fetchClaimContextFile,
  fetchFounderNotes,
  formatBytes,
  formatContext,
  formatNote,
  noteKey,
  syncFounderNotes
};
