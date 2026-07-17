var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../../node_modules/keytar/build/Release/keytar.node
var keytar_default;
var init_keytar = __esm({
  "../../node_modules/keytar/build/Release/keytar.node"() {
    keytar_default = "../keytar-KOAAH267.node";
  }
});

// node-file:/private/tmp/claude-501/-Users-ericgang-job-placement-inline/9716ff9c-0531-4844-adf4-286763cf8ab8/scratchpad/wt-v034/node_modules/keytar/build/Release/keytar.node
var require_keytar = __commonJS({
  "node-file:/private/tmp/claude-501/-Users-ericgang-job-placement-inline/9716ff9c-0531-4844-adf4-286763cf8ab8/scratchpad/wt-v034/node_modules/keytar/build/Release/keytar.node"(exports, module) {
    "use strict";
    init_keytar();
    try {
      module.exports = __require(keytar_default);
    } catch {
    }
  }
});

// ../../node_modules/keytar/lib/keytar.js
var require_keytar2 = __commonJS({
  "../../node_modules/keytar/lib/keytar.js"(exports, module) {
    "use strict";
    var keytar = require_keytar();
    function checkRequired(val, name) {
      if (!val || val.length <= 0) {
        throw new Error(name + " is required.");
      }
    }
    module.exports = {
      getPassword: function(service, account) {
        checkRequired(service, "Service");
        checkRequired(account, "Account");
        return keytar.getPassword(service, account);
      },
      setPassword: function(service, account, password) {
        checkRequired(service, "Service");
        checkRequired(account, "Account");
        checkRequired(password, "Password");
        return keytar.setPassword(service, account, password);
      },
      deletePassword: function(service, account) {
        checkRequired(service, "Service");
        checkRequired(account, "Account");
        return keytar.deletePassword(service, account);
      },
      findPassword: function(service) {
        checkRequired(service, "Service");
        return keytar.findPassword(service);
      },
      findCredentials: function(service) {
        checkRequired(service, "Service");
        return keytar.findCredentials(service);
      }
    };
  }
});

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
var TERMINALHIRE_DIR = join(homedir(), ".terminalhire");
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
async function tryLoadFromKeytar(policy) {
  if (forceKeytarUnavailableForTests || skipKeychain()) return null;
  try {
    const kt = policy === "keychain-required" ? createRequire(import.meta.url)("keytar") : await Promise.resolve().then(() => __toESM(require_keytar2(), 1));
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
      const kt = await Promise.resolve().then(() => __toESM(require_keytar2(), 1));
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
    const key = await tryLoadFromKeytar("keychain-required");
    if (!key) {
      warnStderr(`crypto-store: OS keychain unavailable \u2014 store at ${filePath} is disabled (no plaintext key file will be written)`);
      return null;
    }
    return key;
  }
  const fromKeytar = await tryLoadFromKeytar("keytar-first-file-fallback");
  if (fromKeytar) return fromKeytar;
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
