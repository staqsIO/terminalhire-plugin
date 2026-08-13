#!/usr/bin/env node

// bin/peer-connect-prompt.js
import { createInterface } from "readline";

// src/config.ts
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";

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

// src/config.ts
var TERMINALHIRE_DIR = process.env.TERMINALHIRE_DIR || join(homedir(), ".terminalhire");
var CONFIG_FILE = join(TERMINALHIRE_DIR, "config.json");
var DEFAULT_CONFIG = {
  nudge: "session",
  peerConnect: false,
  peerConnectPrompted: false,
  resumePublishPrompted: false,
  chatDisclosureAck: false,
  chatShareActivity: false,
  inboundNudgeMuted: false,
  inboundNudgeDisclosed: false,
  contributeEnabled: true,
  betaOptIn: false,
  lastFullFeedbackAt: null,
  lastPulseAskAt: null,
  pulseDisclosed: false,
  mix: "balanced",
  founderBountyNotify: false
};
function readConfig() {
  try {
    if (!existsSync(CONFIG_FILE)) return { ...DEFAULT_CONFIG };
    const raw = readFileSync(CONFIG_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_CONFIG, ...parsed };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}
function writeConfig(config) {
  ensureStateDir(TERMINALHIRE_DIR);
  const current = readConfig();
  const merged = { ...current, ...config };
  if ("contributePrompted" in merged) {
    if (merged.contributeEnabled === false && !("contributeEnabled" in config)) {
      delete merged.contributeEnabled;
    }
    delete merged.contributePrompted;
  }
  writeFileSync(CONFIG_FILE, JSON.stringify(merged, null, 2) + "\n", "utf8");
}

// src/open-url.js
import { spawn } from "child_process";
function openInBrowser(url) {
  let cmd;
  let args;
  if (process.platform === "darwin") {
    cmd = "open";
    args = [url];
  } else if (process.platform === "win32") {
    cmd = "cmd";
    args = ["/c", "start", "", url];
  } else {
    cmd = "xdg-open";
    args = [url];
  }
  try {
    const child = spawn(cmd, args, { stdio: "ignore", detached: true });
    child.on("error", () => {
    });
    child.unref();
  } catch {
  }
}

// src/api-base.ts
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
var OAUTH_ALLOWED_ORIGINS = [PROD_API_BASE, DEV_API_BASE];
var ALLOW_LOCAL_OAUTH_KEY = "TERMINALHIRE_ALLOW_LOCAL_OAUTH";
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
function resolveOAuthBase(env = process.env) {
  const base = resolveApiBase(env);
  if (OAUTH_ALLOWED_ORIGINS.includes(base)) return base;
  if (env[ALLOW_LOCAL_OAUTH_KEY] === "1") return base;
  throw new ApiBaseError(
    `terminalhire: the API base is ${base}, which is not a trusted origin for a browser sign-in. Point the CLI at ${DEV_API_BASE} for an end-to-end login, or set ${ALLOW_LOCAL_OAUTH_KEY}=1 (with ${ALLOW_LOCAL_API_KEY}=1) if you are running the web app locally on purpose. Refusing to open production sign-in while the API is local.`
  );
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

// bin/peer-connect-prompt.js
var PROMPT = [
  "",
  "  Connect with other builders?",
  "",
  "  See peers and founders building what you're building \u2014 from a profile that",
  "  never leaves your machine. The only thing ever sent is anonymous: the",
  "  matched person's public username, never yours, never your profile or fingerprint.",
  "",
  "  Change it anytime: terminalhire config --connect on|off",
  "",
  "  Opt in? [y/N]: "
].join("\n");
function buildSupplyPrompt(login) {
  const resumeUrl = login ? `terminalhire.com/r/${login}` : "terminalhire.com/r/<your-login>";
  return [
    "",
    "  Let other builders find you too?",
    "",
    `  Publish your verifiable r\xE9sum\xE9 (${resumeUrl}) \u2014 it lists you in the`,
    "  builder directory so matches are mutual. You'll confirm in your browser; nothing",
    "  is published until you click publish there. Open it now? [y/N]: "
  ].join("\n");
}
async function maybePromptPeerConnect({
  input = process.stdin,
  output = process.stdout,
  isInteractive = Boolean(process.stdin.isTTY && process.stdout.isTTY),
  login,
  openUrl = openInBrowser,
  ask
} = {}) {
  const promptOnce = ask ? async (q) => String(await ask(q) ?? "").trim().toLowerCase() : async (q) => {
    const rl = createInterface({ input, output });
    const a = await new Promise((resolve) => {
      rl.question(q, (x) => {
        rl.close();
        resolve(x);
      });
    });
    return String(a).trim().toLowerCase();
  };
  const cfg = readConfig();
  if (cfg.peerConnectPrompted) {
    return {
      prompted: false,
      peerConnect: cfg.peerConnect === true,
      resumePublishPrompted: cfg.resumePublishPrompted === true,
      resumePublishOpened: false
    };
  }
  if (!isInteractive) {
    return {
      prompted: false,
      peerConnect: cfg.peerConnect === true,
      resumePublishPrompted: cfg.resumePublishPrompted === true,
      resumePublishOpened: false
    };
  }
  const answer = await promptOnce(PROMPT);
  const optedIn = answer === "y" || answer === "yes";
  writeConfig({ peerConnect: optedIn, peerConnectPrompted: true });
  output.write(
    optedIn ? "\n  Peer-connect ON \u2014 peers & founders may surface in your spinner.\n  Turn it off anytime: terminalhire config --connect off\n\n" : "\n  Peer-connect stays OFF. Enable anytime: terminalhire config --connect on\n\n"
  );
  let resumePublishOpened = false;
  if (optedIn && cfg.resumePublishPrompted !== true) {
    const supplyAnswer = await promptOnce(buildSupplyPrompt(login));
    const wantsPublish = supplyAnswer === "y" || supplyAnswer === "yes";
    writeConfig({ resumePublishPrompted: true });
    if (wantsPublish) {
      const next = "/dashboard?publish=1";
      let url = null;
      try {
        url = `${resolveOAuthBase()}/api/auth/github?next=${encodeURIComponent(next)}`;
      } catch (err) {
        output.write(
          `
  Cannot open the publish confirmation: ${err instanceof Error ? err.message : String(err)}
  You stay viewer-only for now \u2014 publish later from terminalhire.com/dashboard.

`
        );
      }
      if (url !== null) {
        output.write(
          `
  Opening your browser to confirm \u2014 nothing is published until you click
  publish there: ${url}
  (You can also publish anytime from terminalhire.com/dashboard.)

`
        );
        openUrl(url);
        resumePublishOpened = true;
      }
    } else {
      output.write(
        "\n  No worries \u2014 you stay viewer-only (not listed in the directory).\n  Publish anytime from terminalhire.com/dashboard.\n\n"
      );
    }
  }
  return {
    prompted: true,
    peerConnect: optedIn,
    resumePublishPrompted: readConfig().resumePublishPrompted === true,
    resumePublishOpened
  };
}
export {
  maybePromptPeerConnect
};
