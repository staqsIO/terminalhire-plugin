// bin/claim-context-files.js
import {
  closeSync,
  constants,
  lstatSync,
  mkdirSync,
  openSync,
  readFileSync,
  realpathSync,
  renameSync,
  unlinkSync,
  writeSync
} from "fs";
import { join } from "path";
import { randomBytes } from "crypto";

// bin/sanitize.js
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

// bin/claim-context-files.js
var CONTEXT_REL_DIR = ".terminalhire/context";
var CONTEXT_CHUNK_BYTES = 3 * 1024 * 1024;
var CONTEXT_MAX_FILE_BYTES = 100 * 1024 * 1024;
var EXCLUDE_LINE = "/.terminalhire/";
var NAME_MAX_BYTES = 180;
function contextFileName(name, id) {
  const last = String(name ?? "").split(/[\\/]/).pop();
  let clean = stripInvisibleMarks(last).replace(/\s+/g, " ").replace(/[\x00-\x1f\x7f-\x9f<>:"|?*]/g, "").replace(/^[.\s]+/, "").trim();
  if (Buffer.byteLength(clean) > NAME_MAX_BYTES) {
    const dot = clean.lastIndexOf(".");
    const ext = dot > 0 && clean.length - dot <= 12 ? clean.slice(dot) : "";
    const stem = Array.from(clean.slice(0, clean.length - ext.length));
    while (stem.length > 0 && Buffer.byteLength(stem.join("") + ext) > NAME_MAX_BYTES) stem.pop();
    clean = (stem.join("") + ext).trim();
  }
  if (clean === "") clean = "file";
  const tag = String(id ?? "").replace(/[^A-Za-z0-9]/g, "").slice(-8);
  return `${tag || "file"}-${clean}`;
}
var lstatOrNull = (path) => {
  try {
    return lstatSync(path);
  } catch (err) {
    if (err?.code === "ENOENT") return null;
    throw err;
  }
};
function contextDirFor(worktreePath) {
  try {
    if (typeof worktreePath !== "string" || worktreePath === "")
      return { ok: false, reason: "no workspace on this machine" };
    const root = lstatOrNull(worktreePath);
    if (!root || !root.isDirectory()) return { ok: false, reason: "no workspace on this machine" };
    let exclude = "";
    try {
      exclude = readFileSync(join(worktreePath, ".git", "info", "exclude"), "utf8");
    } catch {
    }
    const lines = exclude.split("\n");
    const letsBackIn = lines.some((l) => l.startsWith("!"));
    if (!lines.includes(EXCLUDE_LINE) || letsBackIn)
      return {
        ok: false,
        reason: "this workspace does not keep .terminalhire/ out of git, so a file saved there could end up in your patch"
      };
    let dir = worktreePath;
    for (const part of CONTEXT_REL_DIR.split("/")) {
      dir = join(dir, part);
      const st = lstatOrNull(dir);
      if (st === null) mkdirSync(dir, { mode: 448 });
      else if (!st.isDirectory())
        return { ok: false, reason: `${CONTEXT_REL_DIR} is not a directory` };
    }
    if (realpathSync(dir) !== join(realpathSync(worktreePath), ...CONTEXT_REL_DIR.split("/")))
      return { ok: false, reason: `${CONTEXT_REL_DIR} is not inside the workspace` };
    return { ok: true, dir };
  } catch (err) {
    return { ok: false, reason: `could not prepare ${CONTEXT_REL_DIR} (${err?.code ?? "error"})` };
  }
}
async function saveOne(dir, file, fetchChunk) {
  const name = contextFileName(file.name, file.id);
  const path = join(dir, name);
  const size = file.sizeBytes;
  if (!Number.isSafeInteger(size) || size < 0 || size > CONTEXT_MAX_FILE_BYTES)
    return { name, status: "failed", reason: "larger than a Context file can be" };
  const existing = lstatOrNull(path);
  if (existing && !existing.isFile())
    return { name, status: "failed", reason: "something else is at that path" };
  if (existing && existing.size === size) return { name, path, status: "already-saved" };
  const part = join(dir, `.${name}.${process.pid}.${randomBytes(4).toString("hex")}.part`);
  const fd = openSync(
    part,
    constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW,
    384
  );
  let done = false;
  try {
    for (let at = 0; at < size; ) {
      const want = Math.min(CONTEXT_CHUNK_BYTES, size - at);
      const bytes = await fetchChunk(file.id, `bytes=${at}-${at + want - 1}`);
      if (!(bytes instanceof Uint8Array)) return { name, status: "failed", reason: "unavailable" };
      if (bytes.length !== want)
        return { name, status: "failed", reason: "the server sent a different length" };
      for (let wrote = 0; wrote < want; ) wrote += writeSync(fd, bytes, wrote, want - wrote);
      at += want;
    }
    done = true;
  } finally {
    closeSync(fd);
    if (!done) unlinkSync(part);
  }
  renameSync(part, path);
  return { name, path, status: "saved" };
}
async function saveContextFiles({ worktreePath, files, fetchChunk }) {
  const place = contextDirFor(worktreePath);
  if (!place.ok) return { ok: false, reason: place.reason, files: [] };
  const out = [];
  for (const file of files) {
    try {
      out.push(await saveOne(place.dir, file, fetchChunk));
    } catch (err) {
      out.push({
        name: contextFileName(file.name, file.id),
        status: "failed",
        reason: `could not write (${err?.code ?? "error"})`
      });
    }
  }
  return { ok: true, dir: place.dir, files: out };
}
export {
  CONTEXT_CHUNK_BYTES,
  CONTEXT_MAX_FILE_BYTES,
  CONTEXT_REL_DIR,
  contextDirFor,
  contextFileName,
  saveContextFiles
};
