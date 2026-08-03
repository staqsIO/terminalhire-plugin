#!/usr/bin/env node

// bin/jpi-post.js
import { existsSync as existsSync2, readFileSync as readFileSync2 } from "fs";
import { spawnSync } from "child_process";
import { createInterface } from "readline";
import { basename, join as join2 } from "path";

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
var REDACTED = "[redacted]";
var EMPTY_AFTER_REDACTION_RE = /(?:\b(?:password|passwd|secret|token|api[_-]?key)\s*[:=]\s*|\[redacted\]|["'`~]|\s)+/g;
var FIXED_SECRET_RULES = [
  { label: "a GitHub token", re: /\bgh[pousr]_[A-Za-z0-9_]{20,}\b/g },
  { label: "an AWS access key", re: /\bAKIA[0-9A-Z]{16}\b/g },
  { label: "a Stripe secret key", re: /\bsk_(?:live|test)_[A-Za-z0-9]{12,}\b/g },
  {
    label: "a private key",
    re: /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?(?:-----END [A-Z ]*PRIVATE KEY-----|$)/g
  }
];
var ASSIGNED_SECRET_RE = /\b(password|passwd|secret|token|api[_-]?key)(\s*[:=]\s*)(["'`]?)([^\s"'`]{12,})\3/gi;
var SECRET_REFERENCE_RE = new RegExp(
  [
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
  ].join("|"),
  "i"
);
var SECRET_PATH_RE = /(?:^|[/\\])(?:\.env(?:\.[^/\\]+)?|id_(?:rsa|ed25519)|credentials(?:\.json)?|secrets?)(?:$|[/\\])/i;
var CROSS_PLATFORM_HOME_RE = /(?:\/(?:Users|home)\/[^/\s]+|[A-Za-z]:\\Users\\[^\\\s]+)/g;
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
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
  const found = [];
  const scan = (pattern, label, span) => {
    const re = new RegExp(pattern.source, pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`);
    let match;
    while ((match = re.exec(value)) !== null) {
      if (match[0].length === 0) {
        re.lastIndex += 1;
        continue;
      }
      const hit = span(match);
      if (hit) found.push({ label, ...hit });
    }
  };
  const whole = (m, replacement) => ({
    start: m.index,
    end: m.index + m[0].length,
    replacement
  });
  for (const rule of FIXED_SECRET_RULES) scan(rule.re, rule.label, (m) => whole(m, REDACTED));
  if (fixedOnly) return found;
  scan(ASSIGNED_SECRET_RE, "an assigned secret", (m) => {
    const secret = m[4] ?? "";
    if (SECRET_REFERENCE_RE.test(secret)) return null;
    const start = m.index + (m[1] ?? "").length + (m[2] ?? "").length + (m[3] ?? "").length;
    return { start, end: start + secret.length, replacement: REDACTED };
  });
  if (currentHome) scan(new RegExp(escapeRegExp(currentHome)), "a home-directory path", (m) => whole(m, "~"));
  scan(CROSS_PLATFORM_HOME_RE, "a home-directory path", (m) => whole(m, "~"));
  return found;
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

// bin/jpi-post.js
var API_URL = process.env["TERMINALHIRE_API_URL"] ?? process.env["JPI_API_URL"] ?? "https://terminalhire.com";
var VALUE_FLAGS = /* @__PURE__ */ new Set([
  "title",
  "symptom",
  "symptom-file",
  "repo",
  "command",
  "output",
  "output-file",
  "with-context"
]);
function parsePostArgs(argv) {
  const flags = {};
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const value = argv[i];
    if (!value.startsWith("--")) {
      positional.push(value);
      continue;
    }
    const key = value.slice(2);
    if (!VALUE_FLAGS.has(key)) {
      flags[key] = true;
      continue;
    }
    const next = argv[i + 1];
    if (next === void 0 || next.startsWith("--")) {
      throw new Error(`--${key} requires a value`);
    }
    flags[key] = next;
    i++;
  }
  return { flags, positional };
}
function git(args, cwd) {
  const result = spawnSync("git", ["-C", cwd, ...args], {
    encoding: "utf8",
    timeout: 1e4,
    stdio: ["ignore", "pipe", "pipe"]
  });
  if (result.status !== 0) {
    return { ok: false, error: String(result.stderr || result.error?.message || "git failed").trim() };
  }
  return { ok: true, value: String(result.stdout || "").trim() };
}
function ownerRepo(remote) {
  if (!remote) return null;
  const match = remote.match(/github\.com[:/]([^/]+)\/([^/]+?)(?:\.git)?$/i);
  return match ? `${match[1]}/${match[2]}` : null;
}
function detectStack(cwd) {
  const stack = [];
  if (existsSync2(join2(cwd, "package.json"))) stack.push("node");
  if (existsSync2(join2(cwd, "next.config.js")) || existsSync2(join2(cwd, "next.config.mjs"))) {
    stack.push("next.js");
  }
  if (existsSync2(join2(cwd, "pyproject.toml")) || existsSync2(join2(cwd, "requirements.txt"))) {
    stack.push("python");
  }
  if (existsSync2(join2(cwd, "Cargo.toml"))) stack.push("rust");
  if (existsSync2(join2(cwd, "go.mod"))) stack.push("go");
  return stack;
}
function captureRepository(cwd = process.cwd()) {
  const failures = [];
  const top = git(["rev-parse", "--show-toplevel"], cwd);
  if (!top.ok) {
    return {
      repo: null,
      branch: null,
      changedPaths: [],
      stack: detectStack(cwd),
      remote: null,
      captureFailures: ["current directory is not a readable git worktree"]
    };
  }
  const root = top.value;
  const branchResult = git(["rev-parse", "--abbrev-ref", "HEAD"], root);
  const remoteResult = git(["remote", "get-url", "origin"], root);
  const changedResult = git(["diff", "--name-only", "HEAD"], root);
  const untrackedResult = git(["ls-files", "--others", "--exclude-standard"], root);
  if (!branchResult.ok) failures.push("could not read the current branch");
  if (!remoteResult.ok) failures.push("could not read the origin remote");
  if (!changedResult.ok) failures.push("could not list changed paths");
  if (!untrackedResult.ok) failures.push("could not list untracked paths");
  const changedPaths = [
    ...new Set(
      [changedResult.ok ? changedResult.value : "", untrackedResult.ok ? untrackedResult.value : ""].flatMap((value) => value.split("\n")).map((value) => value.trim()).filter(Boolean)
    )
  ].sort();
  const remote = remoteResult.ok ? remoteResult.value || null : null;
  return {
    repo: ownerRepo(remote),
    branch: branchResult.ok ? branchResult.value || null : null,
    changedPaths,
    stack: detectStack(root),
    remote,
    captureFailures: failures
  };
}
function readFlagOrFile(flags, valueKey, fileKey) {
  if (typeof flags[fileKey] === "string") {
    try {
      return { value: readFileSync2(flags[fileKey], "utf8"), failure: null };
    } catch {
      return { value: null, failure: `could not read ${basename(flags[fileKey])}` };
    }
  }
  return { value: typeof flags[valueKey] === "string" ? flags[valueKey] : null, failure: null };
}
function printDraft(draft) {
  console.log(`
  draft: ${draft.id}`);
  console.log(`  title: ${draft.title ?? "(set on the browser confirmation page)"}`);
  console.log(`  repo: ${draft.repo ?? "(not detected)"}`);
  console.log(`  branch: ${draft.branch ?? "(not detected)"}`);
  console.log(`  failing command: ${draft.failingCommand ?? "(not supplied)"}`);
  console.log(`  changed paths: ${draft.changedPaths.length ? draft.changedPaths.join(", ") : "(none)"}`);
  console.log(`  stack: ${draft.stack.length ? draft.stack.join(", ") : "(not detected)"}`);
  console.log(`  remote: ${draft.remote ?? "(not detected)"}`);
  if (draft.captureFailures.length) {
    console.log(`  capture failures: ${draft.captureFailures.join("; ")}`);
  }
  console.log("\n  problem:\n");
  console.log(draft.symptom);
  if (draft.failingOutput) {
    console.log("\n  output:\n");
    console.log(draft.failingOutput);
  }
  if (draft.sessionSummary) {
    console.log("\n  session context:\n");
    console.log(draft.sessionSummary);
  }
  console.log("");
}
function usage() {
  console.log(`
Usage:
  terminalhire post draft --symptom "what is stuck" [--title "..."] [--command "..."]
                          [--output-file path] [--with-context "agent summary"]
  terminalhire post show <draft-id>
  terminalhire post edit <draft-id> [--title "..."] [--symptom "..."] [--repo owner/name]
                         [--command "..."] [--output-file path] [--with-context "..."]
  terminalhire post submit <draft-id>
  terminalhire post list
  terminalhire post withdraw <draft-id>

Draft, show, edit, list, and withdraw are local-only. Submit requires a human at
an interactive terminal and creates an unowned web draft; the browser publishes it.`);
}
async function ask(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    return await new Promise((resolve) => rl.question(question, (answer) => resolve(answer.trim())));
  } finally {
    rl.close();
  }
}
async function runDraft(flags) {
  const symptomInput = readFlagOrFile(flags, "symptom", "symptom-file");
  let symptom = symptomInput.value?.trim() ?? "";
  if (!symptom && process.stdin.isTTY) {
    symptom = await ask("  What is stuck or broken? ");
  }
  if (!symptom) throw new Error("draft needs --symptom or --symptom-file");
  const captured = captureRepository();
  const outputInput = readFlagOrFile(flags, "output", "output-file");
  const failures = [...captured.captureFailures];
  if (symptomInput.failure) failures.push(symptomInput.failure);
  if (outputInput.failure) failures.push(outputInput.failure);
  const draft = savePostingDraft({
    title: typeof flags.title === "string" ? flags.title.trim() || null : null,
    symptom,
    repo: typeof flags.repo === "string" ? flags.repo.trim() || null : captured.repo,
    branch: captured.branch,
    failingCommand: typeof flags.command === "string" ? flags.command : null,
    failingOutput: outputInput.value,
    changedPaths: captured.changedPaths,
    stack: captured.stack,
    remote: captured.remote,
    sessionSummary: typeof flags["with-context"] === "string" ? flags["with-context"] : null,
    captureFailures: failures
  });
  printDraft(draft);
  console.log(`  Saved locally. Review: terminalhire post show ${draft.id}`);
  console.log(`  Human submit: terminalhire post submit ${draft.id}
`);
}
function runEdit(id, flags) {
  const current = getPostingDraft(id);
  if (!current) throw new Error(`draft not found: ${id}`);
  const patch = {};
  if (typeof flags.title === "string") patch.title = flags.title.trim() || null;
  if (typeof flags.symptom === "string") patch.symptom = flags.symptom.trim();
  if (typeof flags.repo === "string") patch.repo = flags.repo.trim() || null;
  if (typeof flags.command === "string") patch.failingCommand = flags.command || null;
  if (typeof flags["with-context"] === "string") {
    patch.sessionSummary = flags["with-context"] || null;
  }
  const outputInput = readFlagOrFile(flags, "output", "output-file");
  if (outputInput.value !== null) patch.failingOutput = outputInput.value;
  if (outputInput.failure) {
    patch.captureFailures = [...current.captureFailures, outputInput.failure];
  }
  if (Object.keys(patch).length === 0) {
    throw new Error("edit needs at least one field flag; run `terminalhire post` for usage");
  }
  const updated = updatePostingDraft(id, patch);
  printDraft(updated);
}
async function runSubmit(id) {
  const draft = getPostingDraft(id);
  if (!draft) throw new Error(`draft not found: ${id}`);
  const prepared = preparePostingSubmission(draft);
  if (!prepared.ok) {
    console.error("\n  Nothing to send:");
    for (const reason of prepared.reasons) console.error(`    - ${reason}`);
    console.error("");
    process.exitCode = 1;
    return;
  }
  if (prepared.redactions.length) {
    console.log("\n  Redacted \u2014 the body below is what goes out:");
    for (const { field, label } of prepared.redactions) {
      console.log(`    - ${label}, in ${field}`);
    }
  }
  if (prepared.notices.length) {
    console.log("\n  Missing from the report (not a problem, just thinner):");
    for (const notice of prepared.notices) console.log(`    - ${notice}`);
  }
  console.log("\n  EXACT network body:\n");
  console.log(JSON.stringify(prepared.posting, null, 2));
  console.log("");
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    console.error("  Refused \u2014 submit requires a human at an interactive terminal. Nothing was sent.\n");
    process.exitCode = 1;
    return;
  }
  let response;
  try {
    response = await fetch(`${API_URL}/api/founder/mcp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: draft.id,
        method: "tools/call",
        params: { name: "draft_posting", arguments: prepared.posting }
      }),
      signal: AbortSignal.timeout(1e4)
    });
  } catch (error) {
    throw new Error(`submit failed: ${error instanceof Error ? error.message : String(error)}`);
  }
  if (!response.ok) throw new Error(`submit failed: server returned ${response.status}`);
  const body = await response.json();
  if (body?.error) throw new Error(`submit failed: ${body.error.message ?? "protocol error"}`);
  if (body?.result?.isError) {
    throw new Error(body.result.content?.[0]?.text ?? "server refused the draft");
  }
  const text = body?.result?.content?.[0]?.text;
  if (typeof text !== "string") throw new Error("submit failed: server returned no confirmation");
  console.log(`
${text}
`);
  console.log("  The posting is still not public. Open the link, sign in, review, and confirm it.\n");
}
async function run() {
  try {
    const raw = process.argv.slice(2);
    if (raw[0] === "post") raw.shift();
    const { flags, positional } = parsePostArgs(raw);
    const verb = positional[0];
    const id = positional[1];
    if (!verb || flags.help) {
      usage();
      return;
    }
    if (verb === "draft") return await runDraft(flags);
    if (verb === "list") {
      const drafts = listPostingDrafts();
      if (!drafts.length) {
        console.log("\n  No local posting drafts.\n");
        return;
      }
      console.log("");
      for (const draft of drafts) {
        console.log(
          `  ${draft.id}  ${draft.title ?? draft.symptom.split("\n")[0].slice(0, 70)}  ${draft.updatedAt}`
        );
      }
      console.log("");
      return;
    }
    if (!id) throw new Error(`${verb} needs a draft id`);
    if (verb === "show") {
      const draft = getPostingDraft(id);
      if (!draft) throw new Error(`draft not found: ${id}`);
      printDraft(draft);
      return;
    }
    if (verb === "edit") return runEdit(id, flags);
    if (verb === "withdraw") {
      if (!withdrawPostingDraft(id)) throw new Error(`draft not found: ${id}`);
      console.log(`
  Withdrew local draft ${id}. Nothing was sent.
`);
      return;
    }
    if (verb === "submit") return await runSubmit(id);
    throw new Error(`unknown verb: ${verb}`);
  } catch (error) {
    console.error(`terminalhire post: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  }
}
export {
  captureRepository,
  parsePostArgs,
  run
};
