// src/github-auth.ts
import { createCipheriv, createDecipheriv, randomBytes as randomBytes2 } from "crypto";
import { readFileSync as readFileSync2, writeFileSync as writeFileSync2, existsSync as existsSync3, rmSync, renameSync } from "fs";
import { join as join3 } from "path";
import { homedir as homedir2 } from "os";

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
function __publishKeyBlobForTests(key) {
  return publishKeyBlob(key);
}

// src/github-auth.ts
var TERMINALHIRE_DIR2 = process.env.TERMINALHIRE_DIR || join3(homedir2(), ".terminalhire");
var TOKEN_FILE = join3(TERMINALHIRE_DIR2, "github-token.enc");
var ALGO = "aes-256-gcm";
var IV_BYTES = 12;
var GITHUB_SCOPE = "read:user";
var DEVICE_CODE_URL = "https://github.com/login/device/code";
var ACCESS_TOKEN_URL = "https://github.com/login/oauth/access_token";
var BAKED_IN_CLIENT_ID = "Ov23lignE2ZSBe0J3a6B";
async function loadKey() {
  return loadOrCreateSharedKey();
}
function encrypt(plaintext, key) {
  const iv = randomBytes2(IV_BYTES);
  const cipher = createCipheriv(ALGO, key, iv);
  const ct = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return { iv: iv.toString("hex"), tag: tag.toString("hex"), ciphertext: ct.toString("hex") };
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
async function readGitHubToken() {
  if (!existsSync3(TOKEN_FILE)) return void 0;
  try {
    const key = await loadKey();
    const raw = readFileSync2(TOKEN_FILE, "utf8");
    const blob = JSON.parse(raw);
    return decrypt(blob, key);
  } catch {
    return void 0;
  }
}
async function writeGitHubToken(token) {
  ensureStateDirForSecret(TERMINALHIRE_DIR2);
  const key = await loadKey();
  const blob = encrypt(token, key);
  const tmpFile = `${TOKEN_FILE}.${process.pid}.${randomBytes2(6).toString("hex")}.tmp`;
  try {
    writeFileSync2(tmpFile, JSON.stringify(blob, null, 2), {
      encoding: "utf8",
      mode: 384,
      flag: "wx"
    });
    renameSync(tmpFile, TOKEN_FILE);
  } catch (err) {
    try {
      rmSync(tmpFile, { force: true });
    } catch {
    }
    throw err;
  }
}
async function deleteGitHubToken() {
  try {
    rmSync(TOKEN_FILE);
  } catch {
  }
}
async function hasGitHubToken() {
  return existsSync3(TOKEN_FILE);
}
var MOCK_TOKEN = "mock-github-token-jpi-dev";
var MOCK_LOGIN = "janedev";
async function runDeviceFlow() {
  if (process.env["TERMINALHIRE_GITHUB_MOCK"] === "1" || process.env["TERMINALHIRE_GITHUB_MOCK"] === "1" || process.env["JPI_GITHUB_MOCK"] === "1") {
    console.log("\n[mock] GitHub OAuth skipped (JPI_GITHUB_MOCK=1)");
    console.log(`[mock] Using fixture profile: ${MOCK_LOGIN}`);
    await writeGitHubToken(MOCK_TOKEN);
    return MOCK_LOGIN;
  }
  const clientId = process.env["GITHUB_DEVICE_CLIENT_ID"] ?? process.env["GITHUB_CLIENT_ID"] ?? BAKED_IN_CLIENT_ID;
  if (clientId === "Iv1.PLACEHOLDER_REGISTER_YOUR_APP") {
    console.warn("\nWarning: GITHUB_CLIENT_ID env var looks like a placeholder.");
    console.warn(
      "Remove it to use the baked-in client ID, or set it to your own OAuth App Client ID.\n"
    );
  }
  const deviceRes = await fetch(DEVICE_CODE_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({ client_id: clientId, scope: GITHUB_SCOPE }).toString(),
    signal: AbortSignal.timeout(15e3)
  });
  if (!deviceRes.ok) {
    throw new Error(`GitHub device code request failed: HTTP ${deviceRes.status}`);
  }
  const deviceData = await deviceRes.json();
  console.log("");
  console.log("  GitHub sign-in (device flow)");
  console.log("  \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500");
  console.log(`  1. Open: ${deviceData.verification_uri}`);
  console.log(`  2. Enter code: ${deviceData.user_code}`);
  console.log('  3. Authorize "Terminalhire" (scope: read:user \u2014 public data only)');
  console.log("  \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500");
  console.log("  Waiting for authorization...");
  console.log("");
  let intervalSecs = deviceData.interval ?? 5;
  const expiresAt = Date.now() + (deviceData.expires_in ?? 900) * 1e3;
  const clientSecret = process.env["GITHUB_CLIENT_SECRET"];
  while (Date.now() < expiresAt) {
    await sleep(intervalSecs * 1e3);
    const body = new URLSearchParams({
      client_id: clientId,
      device_code: deviceData.device_code,
      grant_type: "urn:ietf:params:oauth:grant-type:device_code"
    });
    if (clientSecret) body.set("client_secret", clientSecret);
    const tokenRes = await fetch(ACCESS_TOKEN_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: body.toString(),
      signal: AbortSignal.timeout(15e3)
    });
    if (!tokenRes.ok) {
      throw new Error(`GitHub token poll failed: HTTP ${tokenRes.status}`);
    }
    const tokenData = await tokenRes.json();
    if (tokenData.access_token) {
      await writeGitHubToken(tokenData.access_token);
      const login = await fetchAuthedLogin(tokenData.access_token);
      console.log(`  Authorized as: ${login}`);
      return login;
    }
    if (tokenData.error === "authorization_pending") {
      continue;
    }
    if (tokenData.error === "slow_down") {
      intervalSecs = (tokenData.interval ?? intervalSecs) + 5;
      continue;
    }
    if (tokenData.error === "expired_token") {
      throw new Error("GitHub device code expired. Please run `terminalhire login` again.");
    }
    if (tokenData.error === "access_denied") {
      throw new Error("GitHub authorization was denied by the user.");
    }
    throw new Error(
      `GitHub device flow error: ${tokenData.error ?? "unknown"} \u2014 ${tokenData.error_description ?? ""}`
    );
  }
  throw new Error(
    "GitHub device code expired before authorization. Please run `terminalhire login` again."
  );
}
async function fetchAuthedLogin(token) {
  if (token === MOCK_TOKEN) return MOCK_LOGIN;
  const res = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28"
    },
    signal: AbortSignal.timeout(1e4)
  });
  if (!res.ok) throw new Error(`GitHub /user: HTTP ${res.status}`);
  const data = await res.json();
  return data.login;
}
async function resolveStoredLogin() {
  if (process.env["TERMINALHIRE_GITHUB_MOCK"] === "1" || process.env["TERMINALHIRE_GITHUB_MOCK"] === "1" || process.env["JPI_GITHUB_MOCK"] === "1")
    return MOCK_LOGIN;
  const token = await readGitHubToken();
  if (!token) return void 0;
  try {
    return await fetchAuthedLogin(token);
  } catch {
    return void 0;
  }
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export {
  GITHUB_SCOPE,
  __publishKeyBlobForTests,
  decrypt,
  deleteGitHubToken,
  encrypt,
  hasGitHubToken,
  loadKey,
  readGitHubToken,
  resolveStoredLogin,
  runDeviceFlow,
  writeGitHubToken
};
