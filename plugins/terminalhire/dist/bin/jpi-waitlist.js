#!/usr/bin/env node

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

// src/web-session.ts
import { chmodSync, existsSync, readFileSync, rmSync, writeFileSync } from "fs";
import { homedir as homedir2 } from "os";
import { join as join2 } from "path";

// src/state-dir.ts
import { closeSync, constants, fchmodSync, fstatSync, mkdirSync, openSync } from "fs";

// src/web-session.ts
function terminalhireDir() {
  return process.env.TERMINALHIRE_DIR || join2(homedir2(), ".terminalhire");
}
function webSessionFilePath() {
  return join2(terminalhireDir(), "web-session");
}
function parseWebSessionFile(raw) {
  const trimmed = raw.trim();
  if (trimmed.length === 0) return null;
  if (!trimmed.startsWith("{")) return { token: trimmed, host: null };
  try {
    const parsed = JSON.parse(trimmed);
    if (typeof parsed !== "object" || parsed === null) return null;
    const rec = parsed;
    if (typeof rec.token !== "string" || rec.token.length === 0) return null;
    const host = typeof rec.host === "string" ? rec.host.trim() : "";
    return { token: rec.token, host: host === "" ? null : host };
  } catch {
    return null;
  }
}
function readWebSessionRecord() {
  try {
    const path = webSessionFilePath();
    if (!existsSync(path)) return null;
    return parseWebSessionFile(readFileSync(path, "utf8"));
  } catch {
    return null;
  }
}
function webSessionForHost(apiBase) {
  assertBase(apiBase, "webSessionForHost");
  const record = readWebSessionRecord();
  if (!record) return { cookie: null, mismatch: null };
  if (record.host !== null && record.host !== apiBase) {
    return { cookie: null, mismatch: { linkedHost: record.host, currentHost: apiBase } };
  }
  return { cookie: record.token, mismatch: null };
}
function webSessionCookieForHost(apiBase) {
  const fromFile = webSessionForHost(apiBase);
  if (fromFile.cookie || fromFile.mismatch) return fromFile;
  const env = process.env["TERMINALHIRE_WEB_SESSION"];
  return { cookie: typeof env === "string" && env.length > 0 ? env : null, mismatch: null };
}
function assertBase(apiBase, fn) {
  if (typeof apiBase !== "string" || apiBase.length === 0) {
    throw new TypeError(
      `${fn}(apiBase) requires the destination base as a non-empty string; received ${apiBase === "" ? "''" : String(apiBase)}. This is a wiring bug in the calling command, not a developer misconfiguration: pass the same resolveApiBase() value the request is sent to, so the session's host affinity can be checked (TERM-991).`
    );
  }
}
function hostLabel(base) {
  return String(base ?? "").replace(/^https?:\/\//, "");
}
function missingSessionLines(mismatch) {
  if (!mismatch) {
    return [
      "No linked web session found on this machine.",
      "Run `terminalhire link` to connect this terminal to your account, then re-run."
    ];
  }
  const linked = hostLabel(mismatch.linkedHost);
  const current = hostLabel(mismatch.currentHost);
  const reach = mismatch.linkedHost === PROD_API_BASE ? `unset TERMINALHIRE_API_URL to reach ${linked}` : isLoopbackOrigin(mismatch.linkedHost) ? `set TERMINALHIRE_ALLOW_LOCAL_API=1 TERMINALHIRE_API_URL=${mismatch.linkedHost} to reach ${linked}` : `set TERMINALHIRE_API_URL=${mismatch.linkedHost} to reach ${linked}`;
  const link = isLoopbackOrigin(mismatch.currentHost) ? "`TERMINALHIRE_ALLOW_LOCAL_OAUTH=1 terminalhire link`" : "`terminalhire link`";
  return [
    `This terminal is on ${current}, but your linked session belongs to ${linked}. Nothing was sent.`,
    `Either ${reach}, or run ${link} to link this terminal to ${current} instead.`
  ];
}
function refusedSessionLines(apiBase) {
  return [
    `${hostLabel(apiBase)} refused your linked session.`,
    "Run `terminalhire link` to link this terminal again, then re-run."
  ];
}

// bin/sanitize.js
var WHITESPACE_CONTROLS = /[\t\n\v\f\r]+/g;
var CONTROL_CHARS = /[\x00-\x1f\x7f-\x9f]/g;
function sanitizeText(s) {
  if (s == null) return "";
  return String(s).replace(WHITESPACE_CONTROLS, " ").replace(CONTROL_CHARS, "");
}

// bin/jpi-waitlist.js
var WAITLIST_SRC = "cli-waitlist";
var GH_SESSION_COOKIE = "__jpi_gh_session";
var REQUEST_TIMEOUT_MS = 1e4;
var EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,255}$/;
var EMAIL_MAX_CHARS = 320;
var NOTE_MAX_CHARS = 280;
var LINKEDIN_MAX_CHARS = 200;
var LINKEDIN_HOST_RE = /^(?:[a-z]{1,3}\.)?linkedin\.com$/;
var LINKEDIN_SLUG_RE = /^\/in\/(?:[A-Za-z0-9_-]|%[89A-Fa-f][0-9A-Fa-f]){1,100}\/?$/;
var GITHUB_LOGIN_RE = /^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i;
var MAX_BODY_BYTES = 4 * 1024;
var USAGE = "Usage: terminalhire waitlist join --email <address> [--note <text>] [--linkedin <url>] [--json]";
var HELP = [
  USAGE,
  "",
  "Asks to be considered for paid tasks by joining the TerminalHire developer waitlist.",
  "Joining grants nothing. Confirm your address from the email we send; an unconfirmed",
  "sign-up is deleted after 7 days.",
  "",
  "  --email <address>  Required. Where the confirmation link goes.",
  `  --note <text>      Optional. Up to ${NOTE_MAX_CHARS} characters.`,
  "  --linkedin <url>   Optional. Your LinkedIn profile, like linkedin.com/in/your-name.",
  "  --json             Print one JSON object instead of text.",
  "",
  "When this terminal is linked (terminalhire link), the entry carries your GitHub login."
];
var SUCCESS_LINES = [
  "Check your inbox for a confirmation link.",
  "An unconfirmed sign-up is deleted after 7 days.",
  "Joining asks to be considered for paid tasks and grants nothing."
];
var VALUE_FLAGS = /* @__PURE__ */ new Set(["email", "note", "linkedin"]);
var BOOLEAN_FLAGS = /* @__PURE__ */ new Set(["json", "help"]);
function parseWaitlistArgs(argv) {
  const flags = {};
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const a = String(argv[i]);
    if (a === "-h") {
      flags.help = true;
      continue;
    }
    if (!a.startsWith("--")) {
      positional.push(a);
      continue;
    }
    const eq = a.indexOf("=");
    const key = eq === -1 ? a.slice(2) : a.slice(2, eq);
    if (VALUE_FLAGS.has(key)) {
      if (eq !== -1) {
        flags[key] = a.slice(eq + 1);
        continue;
      }
      const value = argv[i + 1];
      if (value === void 0 || String(value).startsWith("--")) {
        return {
          refusal: {
            code: "bad-argument",
            message: `terminalhire waitlist: --${key} needs a value.`
          }
        };
      }
      flags[key] = String(value);
      i++;
    } else if (BOOLEAN_FLAGS.has(key) && eq === -1) {
      flags[key] = true;
    } else {
      const shown = sanitizeText(`--${key}`).slice(0, 40);
      return {
        refusal: {
          code: "usage",
          message: `terminalhire waitlist: unknown option ${shown}. ${USAGE}`
        }
      };
    }
  }
  return { flags, positional };
}
function refusal(code, message, field) {
  return field ? { ok: false, code, field, message } : { ok: false, code, message };
}
function waitlistBody({ email, note, linkedin }) {
  const body = { email, src: WAITLIST_SRC };
  if (note) body.note = note;
  if (linkedin) body.linkedin = linkedin;
  return body;
}
function linkedinProfile(raw) {
  if (raw === void 0 || raw === null) return null;
  const s = String(raw).trim();
  if (s === "") return null;
  if (s.length > LINKEDIN_MAX_CHARS) return false;
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(s) ? s : `https://${s}`;
  let url;
  try {
    url = new URL(withScheme);
  } catch {
    return false;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:" || url.username || url.password || url.port || !LINKEDIN_HOST_RE.test(url.hostname) || !LINKEDIN_SLUG_RE.test(url.pathname)) {
    return false;
  }
  return `https://www.linkedin.com${url.pathname.replace(/\/$/, "")}`;
}
function checkWaitlistInput({ email, note, linkedin } = {}) {
  if (typeof email !== "string") {
    return refusal(
      "invalid-email",
      "terminalhire waitlist: give the address to sign up with --email.",
      "email"
    );
  }
  const address = email.trim().toLowerCase();
  if (address.length === 0 || address.length > EMAIL_MAX_CHARS || !EMAIL_RE.test(address)) {
    return refusal(
      "invalid-email",
      "terminalhire waitlist: --email must be one email address, like you@example.com.",
      "email"
    );
  }
  let text = null;
  if (note !== void 0 && note !== null) {
    text = String(note).trim();
    if (text.length > NOTE_MAX_CHARS) {
      return refusal(
        "invalid-note",
        `terminalhire waitlist: --note can be at most ${NOTE_MAX_CHARS} characters.`,
        "note"
      );
    }
  }
  const profile = linkedinProfile(linkedin);
  if (profile === false) {
    return refusal(
      "invalid-linkedin",
      "terminalhire waitlist: --linkedin must be a LinkedIn profile link, like linkedin.com/in/your-name.",
      "linkedin"
    );
  }
  const body = waitlistBody({ email: address, note: text, linkedin: profile });
  if (Buffer.byteLength(JSON.stringify(body), "utf8") > MAX_BODY_BYTES) {
    return refusal(
      "too-large",
      `terminalhire waitlist: this sign-up is over the ${MAX_BODY_BYTES} bytes the server accepts. Shorten the note.`
    );
  }
  return { ok: true, body };
}
function createOutput({ json, stdout, stderr }) {
  let lastOut = Promise.resolve();
  let lastErr = Promise.resolve();
  const write = (stream, text) => new Promise((resolve) => {
    try {
      stream.write(text, () => resolve());
    } catch {
      resolve();
    }
  });
  const block = (lines, indent = "  ") => `${lines.map((line) => line === "" ? "" : `${indent}${sanitizeText(line)}`).join("\n")}
`;
  return {
    json,
    say(lines) {
      if (json) lastErr = write(stderr, block(lines));
      else lastOut = write(stdout, block(lines));
    },
    emit(obj) {
      lastOut = write(stdout, `${JSON.stringify(obj)}
`);
    },
    refuse({ code, message, field, lines }) {
      const said = lines ?? [message];
      if (json) {
        const obj = { ok: false, status: "refused", code, message: sanitizeText(said.join(" ")) };
        if (field) obj.field = field;
        lastOut = write(stdout, `${JSON.stringify(obj)}
`);
      } else {
        lastErr = write(stderr, `
${block(said)}
`);
      }
      return 1;
    },
    drained: () => Promise.all([lastOut, lastErr])
  };
}
function reasonOf(err) {
  if (err && err.name === "TimeoutError") return "timed out";
  const code = err && err.cause && err.cause.code;
  if (typeof code === "string") return code;
  return sanitizeText(err instanceof Error && err.message ? err.message : String(err)).slice(
    0,
    120
  );
}
function failed(code, message, field) {
  return { ok: false, refusal: field ? { code, message, field } : { code, message } };
}
async function sessionLogin(fetchImpl, base, cookie) {
  const host = hostLabel(base);
  let res;
  try {
    res = await fetchImpl(`${base}/api/auth/session`, {
      method: "GET",
      headers: { Accept: "application/json", Cookie: `${GH_SESSION_COOKIE}=${cookie}` },
      redirect: "error",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
    });
  } catch (err) {
    return failed(
      "request-failed",
      `terminalhire waitlist: could not ask ${host} which login your linked session carries (${reasonOf(err)}). The sign-up was not sent.`
    );
  }
  if (!res.ok) {
    return failed(
      "request-failed",
      `terminalhire waitlist: ${host} answered HTTP ${res.status} when asked about your linked session. The sign-up was not sent.`
    );
  }
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  if (data && data.signedIn === false) {
    return { ok: false, refusal: { code: "session-refused", lines: refusedSessionLines(base) } };
  }
  if (!data || data.signedIn !== true || typeof data.login !== "string" || !GITHUB_LOGIN_RE.test(data.login)) {
    return failed(
      "request-failed",
      `terminalhire waitlist: ${host} did not name a GitHub login for your linked session. The sign-up was not sent.`
    );
  }
  return { ok: true, login: data.login };
}
var FIELD_REFUSALS = {
  "invalid email": ["invalid-email", "email", "did not accept that email address."],
  "email is required": ["invalid-email", "email", "did not accept that email address."],
  "invalid note": ["invalid-note", "note", "did not accept the note."],
  "invalid linkedin": [
    "invalid-linkedin",
    "linkedin",
    "did not accept the LinkedIn link. Use one like linkedin.com/in/your-name."
  ]
};
async function sendSignup(fetchImpl, base, body, cookie) {
  const host = hostLabel(base);
  const headers = { "Content-Type": "application/json", Accept: "application/json" };
  if (cookie) headers.Cookie = `${GH_SESSION_COOKIE}=${cookie}`;
  let res;
  try {
    res = await fetchImpl(`${base}/api/newsletter`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      redirect: "error",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
    });
  } catch (err) {
    return failed(
      "request-failed",
      `terminalhire waitlist: could not finish the sign-up with ${host} (${reasonOf(err)}). Try again.`
    );
  }
  if (res.status === 413) {
    return failed(
      "too-large",
      `terminalhire waitlist: ${host} refused the sign-up as too large (HTTP 413). Shorten the note.`
    );
  }
  if (res.status === 422) {
    let data2 = null;
    try {
      data2 = await res.json();
    } catch {
      data2 = null;
    }
    const known = data2 && typeof data2.error === "string" ? FIELD_REFUSALS[data2.error] : void 0;
    if (known) return failed(known[0], `terminalhire waitlist: ${host} ${known[2]}`, known[1]);
    return failed(
      "request-failed",
      `terminalhire waitlist: ${host} refused the sign-up (HTTP 422).`
    );
  }
  if (res.status === 429) {
    return failed(
      "request-failed",
      `terminalhire waitlist: ${host} is limiting sign-ups right now (HTTP 429). Try again later.`
    );
  }
  if (!res.ok) {
    return failed(
      "request-failed",
      `terminalhire waitlist: ${host} answered HTTP ${res.status}. Try again later.`
    );
  }
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  if (!data || data.ok !== true) {
    return failed(
      "request-failed",
      `terminalhire waitlist: ${host} gave an answer this command does not recognise, so the sign-up may not have been recorded.`
    );
  }
  return { ok: true };
}
async function waitlist(argv, out, deps) {
  const parsed = parseWaitlistArgs(argv);
  if (parsed.refusal) return out.refuse(parsed.refusal);
  const { flags, positional } = parsed;
  if (flags.help) {
    if (out.json) out.emit({ ok: true, status: "usage", message: USAGE });
    else out.say(HELP);
    return 0;
  }
  if (positional.length !== 1 || positional[0] !== "join") {
    return out.refuse({ code: "usage", message: USAGE });
  }
  const checked = checkWaitlistInput({
    email: flags.email,
    note: flags.note,
    linkedin: flags.linkedin
  });
  if (!checked.ok) return out.refuse(checked);
  let base;
  try {
    base = deps.resolveBase();
  } catch (err) {
    const message = err instanceof Error && err.message ? err.message : String(err);
    return out.refuse({ code: err && err.name === "ApiBaseError" ? "api-base" : "error", message });
  }
  const { cookie, mismatch } = deps.session(base);
  if (!cookie && mismatch) {
    return out.refuse({ code: "session-elsewhere", lines: missingSessionLines(mismatch) });
  }
  let login = null;
  if (cookie) {
    const who = await sessionLogin(deps.fetch, base, cookie);
    if (!who.ok) return out.refuse(who.refusal);
    login = who.login;
    out.say(["", `Joining as @${login}, the GitHub account this terminal is linked to.`]);
  } else {
    out.say(["", "Joining without a GitHub login: this terminal is not linked to an account."]);
  }
  const sent = await sendSignup(deps.fetch, base, checked.body, cookie);
  if (!sent.ok) return out.refuse(sent.refusal);
  if (out.json) {
    out.emit({ ok: true, status: "requested", login, message: SUCCESS_LINES.join(" ") });
  } else {
    out.say([`\u2713 Sent. ${SUCCESS_LINES[0]}`, `  ${SUCCESS_LINES[1]}`, `  ${SUCCESS_LINES[2]}`, ""]);
  }
  return 0;
}
async function run(argv = [], deps = {}) {
  const json = argv.includes("--json");
  const out = createOutput({
    json,
    stdout: deps.stdout ?? process.stdout,
    stderr: deps.stderr ?? process.stderr
  });
  const real = {
    fetch: deps.fetch ?? ((url, init) => fetch(url, init)),
    resolveBase: deps.resolveBase ?? (() => resolveApiBase()),
    session: deps.session ?? ((base) => webSessionCookieForHost(base))
  };
  let code;
  try {
    code = await waitlist(argv, out, real);
  } catch (err) {
    if (!json) throw err;
    const message = err instanceof Error && err.message ? err.message : String(err);
    code = out.refuse({ code: "error", message: `terminalhire waitlist: ${message}` });
  }
  await out.drained();
  return code;
}
export {
  EMAIL_MAX_CHARS,
  EMAIL_RE,
  GITHUB_LOGIN_RE,
  LINKEDIN_HOST_RE,
  LINKEDIN_MAX_CHARS,
  LINKEDIN_SLUG_RE,
  MAX_BODY_BYTES,
  NOTE_MAX_CHARS,
  WAITLIST_SRC,
  checkWaitlistInput,
  parseWaitlistArgs,
  run,
  waitlistBody
};
