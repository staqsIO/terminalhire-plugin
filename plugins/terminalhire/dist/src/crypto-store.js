// src/crypto-store.ts
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";
import { readFileSync, writeFileSync, existsSync, renameSync, rmSync } from "fs";
import { join, dirname, basename } from "path";
import { homedir } from "os";
import { createRequire } from "module";

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

// src/crypto-store.ts
var TERMINALHIRE_DIR = process.env.TERMINALHIRE_DIR || join(homedir(), ".terminalhire");
var KEY_FILE = join(TERMINALHIRE_DIR, "key");
var KEYTAR_SERVICE = "terminalhire";
var KEYTAR_ACCOUNT = "profile-key";
var ALGO = "aes-256-gcm";
var KEY_BYTES = 32;
var IV_BYTES = 12;
function encrypt(plaintext, key) {
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv(ALGO, key, iv);
  const ct = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    iv: iv.toString("hex"),
    tag: tag.toString("hex"),
    ciphertext: ct.toString("hex")
  };
}
function decrypt(blob, key) {
  const decipher = createDecipheriv(ALGO, key, Buffer.from(blob.iv, "hex"));
  decipher.setAuthTag(Buffer.from(blob.tag, "hex"));
  const plain = Buffer.concat([
    decipher.update(Buffer.from(blob.ciphertext, "hex")),
    decipher.final()
  ]);
  return plain.toString("utf8");
}
var forceKeytarUnavailableForTests = false;
function __setForceKeytarUnavailableForTests(value) {
  forceKeytarUnavailableForTests = value;
}
function skipKeychain() {
  return process.env.TERMINALHIRE_NO_KEYCHAIN !== void 0 || process.env.CI !== void 0 || process.env.VITEST !== void 0 || process.env.NODE_ENV === "test";
}
async function tryLoadFromKeytar() {
  if (forceKeytarUnavailableForTests || skipKeychain()) return null;
  try {
    const kt = createRequire(import.meta.url)("keytar");
    const stored = await kt.getPassword(KEYTAR_SERVICE, KEYTAR_ACCOUNT);
    if (stored) {
      return Buffer.from(stored, "hex");
    }
    const key = randomBytes(KEY_BYTES);
    await kt.setPassword(KEYTAR_SERVICE, KEYTAR_ACCOUNT, key.toString("hex"));
    return key;
  } catch {
    return null;
  }
}
function loadOrCreateFileKey() {
  ensureStateDir(TERMINALHIRE_DIR);
  if (existsSync(KEY_FILE)) {
    return Buffer.from(readFileSync(KEY_FILE, "utf8").trim(), "hex");
  }
  const key = randomBytes(KEY_BYTES);
  writeFileSync(KEY_FILE, key.toString("hex"), { mode: 384, encoding: "utf8" });
  return key;
}
function warnStderr(message) {
  process.stderr.write(`${message}
`);
}
function atomicWriteFileSync(filePath, content) {
  const dir = dirname(filePath);
  ensureStateDir(dir);
  const tmp = join(
    dir,
    `.${basename(filePath)}.tmp-${process.pid}-${randomBytes(6).toString("hex")}`
  );
  writeFileSync(tmp, content, { encoding: "utf8", mode: 384 });
  renameSync(tmp, filePath);
}
var dependentStoreFiles = /* @__PURE__ */ new Set();
async function deleteKey() {
  for (const filePath of dependentStoreFiles) {
    try {
      rmSync(filePath);
    } catch {
    }
  }
  if (!forceKeytarUnavailableForTests && !skipKeychain()) {
    try {
      const kt = createRequire(import.meta.url)("keytar");
      await kt.deletePassword(KEYTAR_SERVICE, KEYTAR_ACCOUNT);
    } catch {
    }
  }
  try {
    rmSync(KEY_FILE);
  } catch {
  }
}
async function resolveKey(filePath, opts) {
  if (opts.keyPolicy === "keychain-required") {
    const key = await tryLoadFromKeytar();
    if (!key) {
      warnStderr(
        `crypto-store: OS keychain unavailable \u2014 store at ${filePath} is disabled (no plaintext key file will be written)`
      );
      return null;
    }
    return key;
  }
  return loadOrCreateFileKey();
}
function createEncryptedStore(filePath, opts) {
  dependentStoreFiles.add(filePath);
  async function read() {
    const key = await resolveKey(filePath, opts);
    if (!key) return opts.blank();
    if (!existsSync(filePath)) return opts.blank();
    try {
      const raw = readFileSync(filePath, "utf8");
      const blob = JSON.parse(raw);
      const plaintext = decrypt(blob, key);
      return JSON.parse(plaintext);
    } catch {
      warnStderr(`crypto-store: failed to decrypt ${filePath} \u2014 returning blank`);
      return opts.blank();
    }
  }
  async function write(value) {
    const key = await resolveKey(filePath, opts);
    if (!key) return;
    const blob = encrypt(JSON.stringify(value), key);
    atomicWriteFileSync(filePath, JSON.stringify(blob, null, 2));
  }
  return { read, write };
}
export {
  __setForceKeytarUnavailableForTests,
  createEncryptedStore,
  decrypt,
  deleteKey,
  encrypt
};
