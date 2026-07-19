// src/crypto-store.ts
import {
  createCipheriv,
  createDecipheriv,
  randomBytes
} from "crypto";
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  renameSync,
  rmSync
} from "fs";
import { join, dirname, basename } from "path";
import { homedir } from "os";
import { createRequire } from "module";
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
  const decipher = createDecipheriv(
    ALGO,
    key,
    Buffer.from(blob.iv, "hex")
  );
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
  mkdirSync(TERMINALHIRE_DIR, { recursive: true, mode: 448 });
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
  mkdirSync(dir, { recursive: true, mode: 448 });
  const tmp = join(dir, `.${basename(filePath)}.tmp-${process.pid}-${randomBytes(6).toString("hex")}`);
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
      warnStderr(`crypto-store: OS keychain unavailable \u2014 store at ${filePath} is disabled (no plaintext key file will be written)`);
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
