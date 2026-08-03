// src/posting-drafts.ts
import {
  chmodSync,
  existsSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync
} from "fs";
import { homedir } from "os";
import { join } from "path";
import { randomUUID } from "crypto";

// src/state-dir.ts
import { closeSync, constants, fchmodSync, fstatSync, mkdirSync, openSync } from "fs";
var STATE_DIR_MODE = 448;
var STATE_DIR_OK = "ok";
var STATE_DIR_SYMLINK = "symlink";
var STATE_DIR_UNVERIFIED = "unverified";
var warnedDirs = /* @__PURE__ */ new Set();
function warnStateDirOnce(dir, message) {
  if (warnedDirs.has(dir)) return;
  warnedDirs.add(dir);
  try {
    process.stderr.write(message);
  } catch {
  }
}
function ensureStateDir(dir) {
  mkdirSync(dir, { recursive: true, mode: STATE_DIR_MODE });
  const noFollow = constants.O_NOFOLLOW ?? 0;
  let fd;
  try {
    fd = openSync(dir, constants.O_RDONLY | noFollow);
  } catch (err) {
    if (err?.code === "ELOOP") {
      warnStateDirOnce(
        dir,
        `terminalhire: ${dir} is a symlink \u2014 leaving its permissions alone; the 0700 guarantee on the state directory is NOT enforced.
`
      );
      return STATE_DIR_SYMLINK;
    }
    return STATE_DIR_UNVERIFIED;
  }
  try {
    const currentMode = fstatSync(fd).mode & 511;
    if ((currentMode & ~STATE_DIR_MODE) !== 0) {
      fchmodSync(fd, currentMode & STATE_DIR_MODE);
    }
    return STATE_DIR_OK;
  } catch {
    return STATE_DIR_UNVERIFIED;
  } finally {
    try {
      closeSync(fd);
    } catch {
    }
  }
}
var warnedUnverifiedSecretWriteThisProcess = false;
function applyStateDirSecretPolicy(dir, status) {
  if (status === STATE_DIR_SYMLINK) {
    throw new Error(
      `terminalhire: refusing to write key material into ${dir} \u2014 it is a symlink, not a directory.
A write through it would FOLLOW THE LINK and place key/token material wherever the symlink points, outside our control and outside the "owner-only" (0700) guarantee this directory is supposed to carry.
Fix: remove the symlink so terminalhire can recreate it as a real directory \u2014
  rm ${dir}
then re-run the command. If the symlink is intentional, point TERMINALHIRE_DIR at a real directory instead of routing it through this one.`
    );
  }
  if (status === STATE_DIR_UNVERIFIED && !warnedUnverifiedSecretWriteThisProcess) {
    warnedUnverifiedSecretWriteThisProcess = true;
    try {
      process.stderr.write(
        `terminalhire: could not verify ${dir}'s permissions (expected on Windows \u2014 POSIX mode bits do not apply there) \u2014 proceeding, but the "owner-only" guarantee on key/token storage is NOT enforced on this platform.
`
      );
    } catch {
    }
  }
}
function ensureStateDirForSecret(dir) {
  applyStateDirSecretPolicy(dir, ensureStateDir(dir));
}

// ../../packages/core/dist/secretScan.js
var REDACTED = "[redacted]";
var FIXED_SECRET_RULES = [
  { label: "a GitHub token", re: /\bgh[pousr]_[A-Za-z0-9_]{20,}\b/g },
  /**
   * FINE-GRAINED PATS, which the rule above cannot match and which are the format GitHub
   * now issues by default. `github_pat_…` fails `gh[pousr]_` on its third character, and
   * `_` is a word character so there is no boundary for the rule to catch it mid-string
   * either — a fine-grained token scored ZERO findings and went out on the anonymous
   * index. Codex found it after two other reviewers and I had all read this list.
   *
   * The lesson is about the tests, not the regex: every case written for this scanner
   * used `ghp_`, so a hundred more of them would still have missed it. A rule list is
   * only as good as the shapes someone thought to try.
   */
  { label: "a GitHub token", re: /\bgithub_pat_[A-Za-z0-9_]{30,}\b/g },
  { label: "an AWS access key", re: /\bAKIA[0-9A-Z]{16}\b/g },
  /**
   * THE REST OF THE FORMATS A DEVELOPER ACTUALLY PASTES. Found by sweeping candidate
   * credentials through `findSecrets` and printing which scored zero, rather than by
   * reading the list and thinking hard — reading it is what missed `github_pat_`.
   *
   * Every one of these is a self-identifying PREFIX, which is the property that makes a
   * rule safe to add here: it can only match a shape that is already a credential, so it
   * costs nothing when it is wrong. That is also why the AWS SECRET access key is
   * deliberately absent — it is forty characters of base64 with no prefix, and a rule for
   * it would refuse any posting that quoted a hash, a checksum or a build id.
   */
  { label: "an Anthropic API key", re: /\bsk-ant-[A-Za-z0-9-]{20,}\b/g },
  /**
   * NO HYPHEN IN THE BODY, and that restriction is the whole rule. The first cut allowed
   * `[A-Za-z0-9_-]{20,}` and refused `sk-payments-worker-staging`, `sk-checkout-service-eu-west-1`
   * and the branch name `sk-fix-the-retry-loop-again` — kebab-case is how services and
   * branches are named, and `sk-` is an ordinary prefix for one. Four out of four
   * realistic strings I tried were refused as OpenAI keys.
   *
   * A real key carries a long unbroken run of base64 characters; a kebab name never does,
   * because it has a hyphen every few characters. Requiring twenty consecutive non-hyphen
   * characters separates them cleanly and costs nothing on the token side.
   *
   * This is the rule that would have taught founders to switch the scanner off, and I
   * only found it because I went looking for false positives as hard as I had gone
   * looking for misses. The seven prose cases I wrote first all passed.
   */
  { label: "an OpenAI API key", re: /\bsk-(?:proj-)?[A-Za-z0-9_]{20,}\b/g },
  {
    label: "a Slack token",
    // `xoxe` (refresh) and `xapp` (app-level) are documented families the first cut did
    // not know, so both produced zero findings. Same lesson as `github_pat_`: a prefix
    // list is a guess about a vendor's naming until someone checks the vendor's docs.
    re: /\b(?:xox[baprse]-|xapp-)[A-Za-z0-9-]{10,}\b/g
  },
  { label: "a Google API key", re: /\bAIza[A-Za-z0-9_-]{35}\b/g },
  { label: "an npm token", re: /\bnpm_[A-Za-z0-9]{36}\b/g },
  /**
   * A JWT is not always a secret — plenty are short-lived and harmless. It is here anyway
   * because the ones people paste into bug reports are session and access tokens, and the
   * three-segment `eyJ…` shape is specific enough that a false match is nearly impossible.
   */
  { label: "a JSON web token", re: /\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b/g },
  /**
   * A password inline in a connection string. Anchored on the SCHEME so it cannot fire on
   * ordinary prose containing an `@`, and it takes the whole credential pair rather than
   * just the password — publishing the username alongside the host is most of the harm.
   */
  {
    label: "a database password",
    re: /\b(?:postgres|postgresql|mysql|mongodb(?:\+srv)?|redis|amqp):\/\/[^\s:/@]+:[^\s:/@]{6,}@/g
  },
  { label: "a Stripe secret key", re: /\bsk_(?:live|test)_[A-Za-z0-9]{12,}\b/g },
  {
    label: "a private key",
    re: /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?(?:-----END [A-Z ]*PRIVATE KEY-----|$)/g
  }
];
var ASSIGNED_SECRET_RE = /\b(password|passwd|secret|token|api[_-]?key)(\s*[:=]\s*)(["'`]?)([^\s"'`]{12,})\3/gi;
var SECRET_REFERENCE_RE = new RegExp([
  "^process\\.env\\.[A-Za-z_$][\\w$]*$",
  "^process\\.env\\[[\"'`][^\"'`]*[\"'`]\\]$",
  "^import\\.meta\\.env\\.[A-Za-z_$][\\w$]*$",
  "^Deno\\.env\\.get\\([\"'`][^\"'`]*[\"'`]\\)$",
  "^os\\.environ(?:\\.get\\(|\\[)[\"'`]?[A-Za-z_]\\w*[\"'`]?[\\])]$",
  "^ENV\\[[\"'`]?[A-Za-z_]\\w*[\"'`]?\\]$",
  "^\\$\\{?[A-Za-z_]\\w*\\}?$",
  // $VAR, ${VAR}
  "^[A-Za-z_$][\\w$.]*\\(\\s*\\)$",
  // crypto.randomUUID()
  // A call WITH arguments, but only when no argument is long enough to be a
  // credential — `getSecret(actualHardcodedSecret123456)` is not a reference, it is
  // a secret wearing a function's clothes.
  "^[A-Za-z_$][\\w$.]*\\((?![^)]{12,})[\\w$.,\\s]*\\)$",
  "^(?:null|undefined|true|false)$"
].join("|"), "i");
var CROSS_PLATFORM_HOME_RE = /(?:\/(?:Users|home)\/[^/\s]+|[A-Za-z]:\\Users\\[^\\\s]+)/g;
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function findSecrets(value, options = {}) {
  const { currentHome = "", fixedOnly = false } = options;
  const found = [];
  const scan = (pattern, label, severity, span) => {
    const re = new RegExp(pattern.source, pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`);
    let match;
    while ((match = re.exec(value)) !== null) {
      if (match[0].length === 0) {
        re.lastIndex += 1;
        continue;
      }
      const hit = span(match);
      if (hit)
        found.push({ label, severity, ...hit });
    }
  };
  const whole = (m, replacement) => ({
    start: m.index,
    end: m.index + m[0].length,
    replacement
  });
  for (const rule of FIXED_SECRET_RULES) {
    scan(rule.re, rule.label, "credential", (m) => whole(m, REDACTED));
  }
  if (fixedOnly)
    return found;
  scan(ASSIGNED_SECRET_RE, "an assigned secret", "credential", (m) => {
    const secret = m[4] ?? "";
    if (SECRET_REFERENCE_RE.test(secret))
      return null;
    const start = m.index + (m[1] ?? "").length + (m[2] ?? "").length + (m[3] ?? "").length;
    return { start, end: start + secret.length, replacement: REDACTED };
  });
  if (currentHome) {
    scan(new RegExp(escapeRegExp(currentHome)), "a home-directory path", "path", (m) => whole(m, "~"));
  }
  scan(CROSS_PLATFORM_HOME_RE, "a home-directory path", "path", (m) => whole(m, "~"));
  return found;
}

// src/posting-drafts.ts
var POSTING_DRAFT_FIELD_POLICY = {
  id: "local",
  title: "submit",
  symptom: "submit",
  repo: "submit",
  branch: "submit",
  failingCommand: "submit",
  failingOutput: "submit",
  changedPaths: "submit",
  stack: "submit",
  remote: "submit",
  sessionSummary: "submit",
  captureFailures: "local",
  createdAt: "local",
  updatedAt: "local"
};
var SUBMITTED_POSTING_FIELDS = ["title", "symptom", "repo"];
function stateDir() {
  return process.env["TERMINALHIRE_DIR"] || join(homedir(), ".terminalhire");
}
function postingDraftFilePath() {
  return join(stateDir(), "posting-drafts.json");
}
function blankFile() {
  return { version: 1, drafts: [] };
}
function isDraft(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const draft = value;
  return typeof draft.id === "string" && typeof draft.symptom === "string" && Array.isArray(draft.changedPaths) && draft.changedPaths.every((p) => typeof p === "string") && Array.isArray(draft.stack) && draft.stack.every((p) => typeof p === "string") && Array.isArray(draft.captureFailures) && draft.captureFailures.every((p) => typeof p === "string") && typeof draft.createdAt === "string" && typeof draft.updatedAt === "string";
}
function readFile() {
  try {
    const parsed = JSON.parse(readFileSync(postingDraftFilePath(), "utf8"));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return blankFile();
    const file = parsed;
    if (file.version !== 1 || !Array.isArray(file.drafts)) return blankFile();
    return { version: 1, drafts: file.drafts.filter(isDraft) };
  } catch {
    return blankFile();
  }
}
function writeFile(file) {
  const dir = stateDir();
  ensureStateDirForSecret(dir);
  const path = postingDraftFilePath();
  const tmp = `${path}.${process.pid}.${randomUUID()}.tmp`;
  try {
    writeFileSync(tmp, `${JSON.stringify(file, null, 2)}
`, {
      encoding: "utf8",
      mode: 384,
      flag: "wx"
    });
    renameSync(tmp, path);
    try {
      chmodSync(path, 384);
    } catch {
    }
  } finally {
    try {
      rmSync(tmp);
    } catch {
    }
  }
}
function listPostingDrafts() {
  return readFile().drafts.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
function getPostingDraft(id) {
  return readFile().drafts.find((draft) => draft.id === id) ?? null;
}
function savePostingDraft(input) {
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const draft = {
    id: `post_${randomUUID()}`,
    title: input.title,
    symptom: input.symptom,
    repo: input.repo,
    branch: input.branch,
    failingCommand: input.failingCommand,
    failingOutput: input.failingOutput,
    changedPaths: [...input.changedPaths],
    stack: [...input.stack],
    remote: input.remote,
    sessionSummary: input.sessionSummary,
    captureFailures: [...input.captureFailures],
    createdAt: now,
    updatedAt: now
  };
  const file = readFile();
  file.drafts.push(draft);
  writeFile(file);
  return draft;
}
function updatePostingDraft(id, patch) {
  const file = readFile();
  const index = file.drafts.findIndex((draft) => draft.id === id);
  if (index < 0) return null;
  const current = file.drafts[index];
  const next = {
    ...current,
    ...patch,
    changedPaths: patch.changedPaths ? [...patch.changedPaths] : current.changedPaths,
    stack: patch.stack ? [...patch.stack] : current.stack,
    captureFailures: patch.captureFailures ? [...patch.captureFailures] : current.captureFailures,
    id: current.id,
    createdAt: current.createdAt,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  file.drafts[index] = next;
  writeFile(file);
  return next;
}
function withdrawPostingDraft(id) {
  const file = readFile();
  const next = file.drafts.filter((draft) => draft.id !== id);
  if (next.length === file.drafts.length) return false;
  writeFile({ version: 1, drafts: next });
  return true;
}
function section(label, value) {
  return value ? `

${label}
${value}` : "";
}
function toSubmittedPosting(draft) {
  const context = section("Branch", draft.branch) + section("Failing command", draft.failingCommand) + section("Output", draft.failingOutput) + (draft.changedPaths.length ? section("Changed paths", draft.changedPaths.map((path) => `- ${path}`).join("\n")) : "") + (draft.stack.length ? section("Detected stack", draft.stack.join(", ")) : "") + section("Remote", draft.remote) + section("Session context", draft.sessionSummary);
  return {
    ...draft.title ? { title: draft.title } : {},
    symptom: `${draft.symptom}${context}`,
    ...draft.repo ? { repo: draft.repo } : {}
  };
}
var EMPTY_AFTER_REDACTION_RE = /(?:\b(?:password|passwd|secret|token|api[_-]?key)\s*[:=]\s*|\[redacted\]|["'`~]|\s)+/g;
var SECRET_PATH_RE = /(?:^|[/\\])(?:\.env(?:\.[^/\\]+)?|id_(?:rsa|ed25519)|credentials(?:\.json)?|secrets?)(?:$|[/\\])/i;
function assemblePieces(draft) {
  const parts = [];
  if (draft.title) {
    parts.push({ wire: "title", field: "title", text: draft.title });
    parts.push({ wire: null, field: "", text: "\n" });
  }
  parts.push({ wire: "symptom", field: "symptom", text: draft.symptom });
  const add = (label, field, value) => {
    const text = section(label, value);
    if (text) parts.push({ wire: "symptom", field, text });
  };
  add("Branch", "branch", draft.branch);
  add("Failing command", "failing command", draft.failingCommand);
  add("Output", "output", draft.failingOutput);
  add(
    "Changed paths",
    "changed paths",
    draft.changedPaths.length ? draft.changedPaths.map((path) => `- ${path}`).join("\n") : null
  );
  add("Detected stack", "detected stack", draft.stack.length ? draft.stack.join(", ") : null);
  add("Remote", "remote", draft.remote);
  add("Session context", "session context", draft.sessionSummary);
  if (draft.repo) {
    parts.push({ wire: null, field: "", text: "\n" });
    parts.push({ wire: "repo", field: "repo", text: draft.repo });
  }
  let scanned = "";
  const pieces = [];
  for (const part of parts) {
    pieces.push({ ...part, start: scanned.length, end: scanned.length + part.text.length });
    scanned += part.text;
  }
  return { scanned, pieces };
}
function detections(value, currentHome, fixedOnly = false) {
  return findSecrets(value, { currentHome, fixedOnly });
}
function boundaryDetections(scanned, pieces, currentHome, already) {
  let tight = "";
  const map = [];
  for (const piece of pieces) {
    if (piece.wire === null) continue;
    for (let i = 0; i < piece.text.length; i += 1) map.push(piece.start + i);
    tight += piece.text;
  }
  if (tight.length === scanned.length) return [];
  const out = [];
  for (const match of detections(tight, currentHome, true)) {
    let crosses = false;
    for (let i = match.start; i + 1 < match.end; i += 1) {
      if ((map[i + 1] ?? 0) !== (map[i] ?? 0) + 1) {
        crosses = true;
        break;
      }
    }
    if (!crosses) continue;
    const start = map[match.start];
    const last = map[match.end - 1];
    if (start === void 0 || last === void 0) continue;
    if (already.some((seen) => start < seen.end && last + 1 > seen.start)) continue;
    out.push({ ...match, start, end: last + 1 });
  }
  return out;
}
function mergeSpans(found) {
  const sorted = [...found].sort((a, b) => a.start - b.start || a.end - b.end);
  const merged = [];
  for (const span of sorted) {
    const last = merged[merged.length - 1];
    if (last && span.start < last.end) {
      last.end = Math.max(last.end, span.end);
      if (span.replacement !== last.replacement) last.replacement = REDACTED;
      continue;
    }
    merged.push({ ...span });
  }
  return merged;
}
function fieldsCovered(pieces, match) {
  const names = [];
  for (const piece of pieces) {
    if (piece.wire === null) continue;
    if (match.start < piece.end && match.end > piece.start && !names.includes(piece.field)) {
      names.push(piece.field);
    }
  }
  return names;
}
function describeFields(fields) {
  if (fields.length === 0) return "across fields";
  if (fields.length === 1) return fields[0];
  return `${fields.slice(0, -1).join(", ")} and ${fields[fields.length - 1]}`;
}
function rebuild(scanned, pieces, wire, merged) {
  let out = "";
  for (const piece of pieces) {
    if (piece.wire !== wire) continue;
    let cursor = piece.start;
    for (const span of merged) {
      if (span.end <= piece.start || span.start >= piece.end) continue;
      const from = Math.max(span.start, piece.start);
      const to = Math.min(span.end, piece.end);
      out += scanned.slice(cursor, from) + span.replacement;
      cursor = to;
    }
    out += scanned.slice(cursor, piece.end);
  }
  return out;
}
function dedupe(found) {
  const seen = /* @__PURE__ */ new Set();
  return found.filter((redaction) => {
    const key = `${redaction.field}\0${redaction.label}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
function preparePostingSubmission(draft, currentHome = homedir()) {
  const keptPaths = [];
  const found = [];
  for (const path of draft.changedPaths) {
    if (SECRET_PATH_RE.test(path)) {
      found.push({ field: "changed paths", label: "a secret-shaped file path" });
      continue;
    }
    keptPaths.push(path);
  }
  const withPathsDropped = {
    title: draft.title,
    symptom: draft.symptom,
    repo: draft.repo,
    branch: draft.branch,
    failingCommand: draft.failingCommand,
    failingOutput: draft.failingOutput,
    changedPaths: keptPaths,
    stack: draft.stack,
    remote: draft.remote,
    sessionSummary: draft.sessionSummary
  };
  const { scanned, pieces } = assemblePieces(withPathsDropped);
  const raw = toSubmittedPosting(withPathsDropped);
  const rawSymptom = rebuild(scanned, pieces, "symptom", []);
  if (raw.symptom !== rawSymptom || (raw.title ?? "") !== rebuild(scanned, pieces, "title", []) || (raw.repo ?? "") !== rebuild(scanned, pieces, "repo", [])) {
    throw new Error("posting assembly drift: the piece build and toSubmittedPosting disagree");
  }
  const matches = detections(scanned, currentHome);
  for (const match of boundaryDetections(scanned, pieces, currentHome, matches)) {
    matches.push(match);
  }
  for (const match of matches) {
    found.push({ field: describeFields(fieldsCovered(pieces, match)), label: match.label });
  }
  const merged = mergeSpans(matches);
  const posting = {
    ...raw.title ? { title: rebuild(scanned, pieces, "title", merged) } : {},
    symptom: rebuild(scanned, pieces, "symptom", merged),
    ...raw.repo ? { repo: rebuild(scanned, pieces, "repo", merged) } : {}
  };
  if (!posting.symptom.replace(EMPTY_AFTER_REDACTION_RE, "")) {
    return {
      ok: false,
      reasons: ["every word of this draft was redacted \u2014 describe the problem and try again"]
    };
  }
  return {
    ok: true,
    posting,
    redactions: dedupe(found),
    // A capture failure BLOCKED submission before this change, and nothing the
    // founder could type would clear it — the collector, not the draft, is what
    // failed. A field we could not read is a gap in the report, never a leak.
    notices: draft.captureFailures.map((failure) => `could not capture ${failure}`)
  };
}
function postingDraftStoreExists() {
  return existsSync(postingDraftFilePath());
}
export {
  POSTING_DRAFT_FIELD_POLICY,
  SUBMITTED_POSTING_FIELDS,
  getPostingDraft,
  listPostingDrafts,
  postingDraftFilePath,
  postingDraftStoreExists,
  preparePostingSubmission,
  savePostingDraft,
  toSubmittedPosting,
  updatePostingDraft,
  withdrawPostingDraft
};
