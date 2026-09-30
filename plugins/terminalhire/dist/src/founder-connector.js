// src/founder-connector.ts
import { homedir as homedir2 } from "os";
import { join as join4 } from "path";
import { existsSync as existsSync4, rmSync as rmSync2 } from "fs";

// src/crypto-store.ts
import { createCipheriv, createDecipheriv, randomBytes as randomBytes2 } from "crypto";
import { readFileSync as readFileSync2, writeFileSync as writeFileSync2, existsSync as existsSync3, renameSync, rmSync, readdirSync } from "fs";
import { join as join3, dirname, basename } from "path";
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

// src/shared-key.ts
import { randomBytes } from "crypto";
import { readFileSync, writeFileSync, existsSync as existsSync2, linkSync, unlinkSync } from "fs";
import { join as join2 } from "path";
import { homedir } from "os";

// src/test-race-barrier.ts
import { closeSync as closeSync2, constants as constants2, existsSync, lstatSync, openSync as openSync2 } from "fs";
import { join } from "path";
var ENV_VAR = "TERMINALHIRE_TEST_RACE_BARRIER_DIR";
function syncSleepMs(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}
function waitForTestRaceBarrier(phase) {
  const root = process.env[ENV_VAR];
  if (!root) return;
  const phaseDir = join(root, phase);
  if (!existsSync(phaseDir)) return;
  const readyFile = join(phaseDir, `ready-${process.pid}`);
  const goFile = join(phaseDir, "go");
  const noFollow = constants2.O_NOFOLLOW ?? 0;
  if (lstatSync(readyFile, { throwIfNoEntry: false })) {
    throw new Error(
      `terminalhire: test race barrier "${phase}" found something already at its ready marker path ${readyFile} (regular file or symlink) \u2014 refusing rather than following or overwriting whatever is already there (this only fires under ${ENV_VAR}, never in production).`
    );
  }
  let readyFd;
  try {
    readyFd = openSync2(
      readyFile,
      constants2.O_CREAT | constants2.O_EXCL | constants2.O_WRONLY | noFollow
    );
  } catch (err) {
    throw new Error(
      `terminalhire: test race barrier "${phase}" could not create its ready marker at ${readyFile} (${err instanceof Error ? err.message : String(err)}) \u2014 refusing rather than blocking on or writing through whatever is already there (this only fires under ${ENV_VAR}, never in production).`
    );
  }
  closeSync2(readyFd);
  const deadline = Date.now() + 3e4;
  while (!existsSync(goFile)) {
    if (Date.now() > deadline) {
      throw new Error(
        `terminalhire: test race barrier "${phase}" timed out waiting for ${goFile} (the test process never released it \u2014 this only fires under ${ENV_VAR}, never in production).`
      );
    }
    syncSleepMs(2);
  }
}

// src/shared-key.ts
var TERMINALHIRE_DIR = process.env.TERMINALHIRE_DIR || join2(homedir(), ".terminalhire");
var KEY_FILE = join2(TERMINALHIRE_DIR, "key");
var KEY_BYTES = 32;
var KEY_HEX_RE = new RegExp(`^[0-9a-f]{${KEY_BYTES * 2}}$`);
function isValidKeyHex(value) {
  return KEY_HEX_RE.test(value);
}
function readKeyFileOrThrow() {
  const raw = readFileSync(KEY_FILE, "utf8").trim();
  if (!isValidKeyHex(raw)) {
    throw new Error(
      `terminalhire: the shared encryption key at ${KEY_FILE} is not in the expected format (expected exactly ${KEY_BYTES * 2} lowercase-hex characters \u2014 a ${KEY_BYTES}-byte key).
This key decrypts the GitHub token, local profile, and chat identity stores under ~/.terminalhire \u2014 it should never be hand-edited.
Recovery: if you intend to reset it, delete the file yourself (this INVALIDATES every encrypted store under ~/.terminalhire, which will need to be re-created/re-authenticated):
  rm ${KEY_FILE}`
    );
  }
  return Buffer.from(raw, "hex");
}
function publishKeyBlob(key) {
  const tmpFile = `${KEY_FILE}.${process.pid}.${randomBytes(6).toString("hex")}.tmp`;
  try {
    writeFileSync(tmpFile, key.toString("hex"), { encoding: "utf8", mode: 384, flag: "wx" });
    try {
      linkSync(tmpFile, KEY_FILE);
      return true;
    } catch (err) {
      if (err?.code === "EEXIST") {
        return false;
      }
      throw err;
    }
  } finally {
    try {
      unlinkSync(tmpFile);
    } catch {
    }
  }
}
function loadOrCreateSharedKey() {
  ensureStateDirForSecret(TERMINALHIRE_DIR);
  if (existsSync2(KEY_FILE)) {
    return readKeyFileOrThrow();
  }
  waitForTestRaceBarrier("key");
  const key = randomBytes(KEY_BYTES);
  if (publishKeyBlob(key)) {
    return key;
  }
  return readKeyFileOrThrow();
}

// src/crypto-store.ts
var KEYTAR_SERVICE = "terminalhire";
var KEYTAR_ACCOUNT = "profile-key";
var ALGO = "aes-256-gcm";
var IV_BYTES = 12;
function encrypt(plaintext, key) {
  const iv = randomBytes2(IV_BYTES);
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
    const key = randomBytes2(KEY_BYTES);
    await kt.setPassword(KEYTAR_SERVICE, KEYTAR_ACCOUNT, key.toString("hex"));
    return key;
  } catch {
    return null;
  }
}
function warnStderr(message) {
  process.stderr.write(`${message}
`);
}
function makeWarnOnce() {
  const seen = /* @__PURE__ */ new Set();
  return (message) => {
    if (seen.has(message)) return;
    seen.add(message);
    warnStderr(message);
  };
}
function atomicWriteFileSync(filePath, content) {
  const dir = dirname(filePath);
  ensureStateDirForSecret(dir);
  const tmp = join3(
    dir,
    `.${basename(filePath)}.tmp-${process.pid}-${randomBytes2(6).toString("hex")}`
  );
  writeFileSync2(tmp, content, { encoding: "utf8", mode: 384, flag: "wx" });
  renameSync(tmp, filePath);
}
async function resolveKey(filePath, opts, warnOnce) {
  if (opts.keyPolicy === "keychain-required") {
    const key = await tryLoadFromKeytar();
    if (!key) {
      warnOnce(
        `crypto-store: OS keychain unavailable \u2014 store at ${filePath} is disabled (no plaintext key file will be written)`
      );
      return null;
    }
    return key;
  }
  return loadOrCreateSharedKey();
}
function createEncryptedStore(filePath, opts) {
  const warnOnce = makeWarnOnce();
  async function read() {
    const key = await resolveKey(filePath, opts, warnOnce);
    if (!key) return opts.blank();
    if (!existsSync3(filePath)) return opts.blank();
    try {
      const raw = readFileSync2(filePath, "utf8");
      const blob = JSON.parse(raw);
      const plaintext = decrypt(blob, key);
      return JSON.parse(plaintext);
    } catch {
      warnOnce(`crypto-store: failed to decrypt ${filePath} \u2014 returning blank`);
      return opts.blank();
    }
  }
  async function write(value) {
    const key = await resolveKey(filePath, opts, warnOnce);
    if (!key) return;
    const blob = encrypt(JSON.stringify(value), key);
    atomicWriteFileSync(filePath, JSON.stringify(blob, null, 2));
  }
  return { read, write };
}

// src/founder-connector.ts
function terminalhireDir() {
  return process.env.TERMINALHIRE_DIR || join4(homedir2(), ".terminalhire");
}
function founderConnectorFilePath() {
  return join4(terminalhireDir(), "founder-connector.enc");
}
function store() {
  return createEncryptedStore(founderConnectorFilePath(), {
    blank: () => ({ records: {} }),
    keyPolicy: "keytar-first-file-fallback"
  });
}
async function readAll() {
  const data = await store().read();
  const records = data?.records;
  return records && typeof records === "object" ? { ...records } : {};
}
async function writeFounderConnector(record) {
  const records = await readAll();
  records[record.host] = record;
  await store().write({ records });
}
async function readFounderConnector(host) {
  const record = (await readAll())[host];
  if (!record || typeof record.token !== "string" || record.host !== host) return null;
  return record;
}
async function clearFounderConnector(host) {
  const records = await readAll();
  delete records[host];
  if (Object.keys(records).length > 0) {
    await store().write({ records });
    return;
  }
  const p = founderConnectorFilePath();
  if (existsSync4(p)) rmSync2(p, { force: true });
}
var FounderMcpError = class extends Error {
};
async function callFounderTool(base, token, name, args, fetchImpl = globalThis.fetch) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  let res;
  try {
    res = await fetchImpl(`${base}/api/founder/mcp`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "tools/call",
        params: { name, arguments: args }
      }),
      signal: AbortSignal.timeout(3e4)
    });
  } catch (error2) {
    throw new FounderMcpError(
      `could not reach ${base}: ${error2 instanceof Error ? error2.message : String(error2)}`
    );
  }
  if (res.status === 401) {
    return { unauthorized: true, isError: true, text: "", structured: {} };
  }
  if (!res.ok) throw new FounderMcpError(`${base} answered ${res.status}`);
  const body = await res.json().catch(() => null);
  const error = body?.["error"];
  if (error) {
    throw new FounderMcpError(typeof error.message === "string" ? error.message : "protocol error");
  }
  const raw = body?.["result"];
  if (typeof raw !== "object" || raw === null) {
    throw new FounderMcpError(`${base} sent a response this CLI cannot read`);
  }
  const result = raw;
  const content = Array.isArray(result["content"]) ? result["content"] : [];
  const first = content[0];
  return {
    unauthorized: false,
    isError: result["isError"] === true,
    text: typeof first?.text === "string" ? first.text : "",
    structured: typeof result["structuredContent"] === "object" && result["structuredContent"] !== null ? result["structuredContent"] : {}
  };
}
export {
  FounderMcpError,
  callFounderTool,
  clearFounderConnector,
  founderConnectorFilePath,
  readFounderConnector,
  writeFounderConnector
};
