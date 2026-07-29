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
var SECRET_PATTERNS = [
  { label: "a GitHub token", re: /\bgh[pousr]_[A-Za-z0-9_]{20,}\b/ },
  { label: "an AWS access key", re: /\bAKIA[0-9A-Z]{16}\b/ },
  { label: "a Stripe secret key", re: /\bsk_(?:live|test)_[A-Za-z0-9]{12,}\b/ },
  { label: "a private key", re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
  {
    label: "an assigned secret",
    re: /\b(?:password|passwd|secret|token|api[_-]?key)\s*[:=]\s*["']?[^\s"']{12,}/i
  }
];
var SECRET_PATH_RE = /(?:^|[/\\])(?:\.env(?:\.[^/\\]+)?|id_(?:rsa|ed25519)|credentials(?:\.json)?|secrets?)(?:$|[/\\])/i;
var CROSS_PLATFORM_HOME_RE = /(?:\/(?:Users|home)\/[^/\s]+|[A-Za-z]:\\Users\\[^\\\s]+)/;
function inspectPostingSubmission(draft, currentHome = homedir()) {
  const reasons = draft.captureFailures.map((failure) => `capture failed: ${failure}`);
  const posting = toSubmittedPosting(draft);
  const wire = [posting.title, posting.symptom, posting.repo].filter(Boolean).join("\n");
  for (const pattern of SECRET_PATTERNS) {
    if (pattern.re.test(wire)) reasons.push(`submission contains ${pattern.label}`);
  }
  if (currentHome && wire.includes(currentHome)) reasons.push("submission contains your home path");
  if (CROSS_PLATFORM_HOME_RE.test(wire)) reasons.push("submission contains a home-directory path");
  if (draft.changedPaths.some((path) => SECRET_PATH_RE.test(path))) {
    reasons.push("submission names a secret-shaped file path");
  }
  return reasons.length > 0 ? { ok: false, reasons: [...new Set(reasons)] } : { ok: true, posting };
}
function postingDraftStoreExists() {
  return existsSync(postingDraftFilePath());
}
export {
  POSTING_DRAFT_FIELD_POLICY,
  SUBMITTED_POSTING_FIELDS,
  getPostingDraft,
  inspectPostingSubmission,
  listPostingDrafts,
  postingDraftFilePath,
  postingDraftStoreExists,
  savePostingDraft,
  toSubmittedPosting,
  updatePostingDraft,
  withdrawPostingDraft
};
