#!/usr/bin/env node
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/state-dir.ts
import { closeSync, constants, fchmodSync, fstatSync, mkdirSync, openSync } from "fs";
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
var STATE_DIR_MODE, STATE_DIR_OK, STATE_DIR_SYMLINK, STATE_DIR_UNVERIFIED, warnedDirs;
var init_state_dir = __esm({
  "src/state-dir.ts"() {
    "use strict";
    STATE_DIR_MODE = 448;
    STATE_DIR_OK = "ok";
    STATE_DIR_SYMLINK = "symlink";
    STATE_DIR_UNVERIFIED = "unverified";
    warnedDirs = /* @__PURE__ */ new Set();
  }
});

// bin/founder-pin.js
function isPinnedFounderBounty(j) {
  return j?.bounty?.bountySource === "founder" && j?.bounty?.claimable === true;
}
var init_founder_pin = __esm({
  "bin/founder-pin.js"() {
    "use strict";
  }
});

// bin/founder-paid-badge.js
var founder_paid_badge_exports = {};
__export(founder_paid_badge_exports, {
  acknowledgeFounderPaid: () => acknowledgeFounderPaid,
  computeFounderPaid: () => computeFounderPaid,
  openPaidIds: () => openPaidIds
});
function openPaidIds(index) {
  const jobs = index && index.jobs || [];
  const ids = [];
  for (const j of jobs) {
    if (!j || typeof j.id !== "string") continue;
    if (isPinnedFounderBounty(j)) ids.push(j.id);
  }
  return [...new Set(ids)].sort();
}
function gate(openIds, seenIds) {
  const seen = new Set(seenIds);
  const acknowledged = openIds.filter((id) => seen.has(id));
  return { count: openIds.length - acknowledged.length, acknowledged };
}
function computeFounderPaid(index, previous) {
  const open = openPaidIds(index);
  const prior = previous && previous.acknowledged;
  return gate(open, Array.isArray(prior) ? prior : []);
}
function acknowledgeFounderPaid({ shown = [], open = [], previous } = {}) {
  const prior = previous && Array.isArray(previous.acknowledged) ? previous.acknowledged : [];
  return gate(openPaidIds({ jobs: open }), [...prior, ...openPaidIds({ jobs: shown })]);
}
var init_founder_paid_badge = __esm({
  "bin/founder-paid-badge.js"() {
    "use strict";
    init_founder_pin();
  }
});

// bin/cache-store.js
var cache_store_exports = {};
__export(cache_store_exports, {
  readCacheEntry: () => readCacheEntry,
  updateIndexCache: () => updateIndexCache
});
import { readFileSync as readFileSync2, writeFileSync as writeFileSync2, renameSync } from "fs";
import { join as join2 } from "path";
import { homedir as homedir2 } from "os";
function readCacheEntry() {
  try {
    return JSON.parse(readFileSync2(INDEX_CACHE_FILE, "utf8"));
  } catch {
    return null;
  }
}
function updateIndexCache(patch) {
  ensureStateDir(TERMINALHIRE_DIR2);
  const existing = readCacheEntry() ?? {};
  const entry = {
    ...existing,
    ...patch,
    schemaVersion: SCHEMA_VERSION,
    ts: Date.now()
  };
  const tmp = `${INDEX_CACHE_FILE}.${process.pid}.${tmpCounter++}.tmp`;
  writeFileSync2(tmp, JSON.stringify(entry), "utf8");
  renameSync(tmp, INDEX_CACHE_FILE);
  return entry;
}
var TERMINALHIRE_DIR2, INDEX_CACHE_FILE, SCHEMA_VERSION, tmpCounter;
var init_cache_store = __esm({
  "bin/cache-store.js"() {
    "use strict";
    init_state_dir();
    TERMINALHIRE_DIR2 = process.env.TERMINALHIRE_DIR || join2(homedir2(), ".terminalhire");
    INDEX_CACHE_FILE = join2(TERMINALHIRE_DIR2, "index-cache.json");
    SCHEMA_VERSION = 1;
    tmpCounter = 0;
  }
});

// bin/jpi-config.js
import { join as join3 } from "path";
import { homedir as homedir3 } from "os";

// src/config.ts
init_state_dir();
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";
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
function parseSurfaceMix(raw) {
  if (raw === "jobs" || raw === "balanced" || raw === "credential") return raw;
  return null;
}
function parseSurfaceLead(raw) {
  return raw === "dev" || raw === "founder" ? raw : null;
}

// bin/jpi-config.js
var TERMINALHIRE_DIR3 = process.env.TERMINALHIRE_DIR || join3(homedir3(), ".terminalhire");
var CONFIG_FILE2 = join3(TERMINALHIRE_DIR3, "config.json");
function parseNudgeMode(raw) {
  if (raw === "session" || raw === "always") return raw;
  const m = /^every:(\d+)$/.exec(raw);
  if (m && parseInt(m[1], 10) >= 1) return raw;
  return null;
}
function printMixValues() {
  console.log("  Valid mix values (roles vs. contribution items on the ambient surface):");
  console.log("    jobs       \u2014 more roles, fewer contributions (contribute 5, roles ~15)");
  console.log("    balanced   \u2014 contribution-first default (contribute 10, roles ~10)");
  console.log("    credential \u2014 contribution-forward (contribute 12, roles ~8)");
}
async function run() {
  const args = process.argv.slice(2);
  const filtered = args[0] === "config" ? args.slice(1) : args;
  if (filtered[0] === "get" && filtered[1] === "mix") {
    const cfg = readConfig();
    const envOverride = process.env["TH_MIX"];
    console.log("");
    console.log(`  mix: ${cfg.mix}`);
    if (envOverride) {
      console.log(`  (overridden by TH_MIX=${envOverride} at runtime)`);
    }
    console.log("");
    printMixValues();
    console.log("");
    return;
  }
  if (filtered[0] === "set" && filtered[1] === "mix") {
    const value = filtered[2];
    if (!value) {
      console.error("Error: config set mix requires a value: jobs | balanced | credential");
      process.exit(1);
    }
    const parsed = parseSurfaceMix(value);
    if (!parsed) {
      console.error(`Error: invalid mix value "${value}". Valid: jobs | balanced | credential`);
      process.exit(1);
    }
    writeConfig({ mix: parsed });
    console.log(`  mix set to: ${parsed}`);
    console.log(`  (saved to ${CONFIG_FILE2})`);
    return;
  }
  if (filtered[0] === "get" && filtered[1] === "lead") {
    const cfg = readConfig();
    console.log(`
  lead: ${cfg.surfaceLead ?? "auto"}
`);
    return;
  }
  if (filtered[0] === "set" && filtered[1] === "lead") {
    const value = filtered[2];
    if (value === "auto") {
      writeConfig({ surfaceLead: void 0 });
      console.log("  lead set to: auto");
      return;
    }
    const parsed = value ? parseSurfaceLead(value) : null;
    if (!parsed) {
      console.error("Error: config set lead requires: auto | dev | founder");
      process.exit(1);
    }
    writeConfig({ surfaceLead: parsed });
    console.log(`  lead set to: ${parsed}`);
    return;
  }
  if (filtered.includes("--show") || filtered.length === 0) {
    const cfg = readConfig();
    const envOverride = process.env["TERMINALHIRE_NUDGE"];
    console.log("");
    console.log("terminalhire config");
    console.log("");
    console.log(`  nudge: ${cfg.nudge}`);
    if (envOverride) {
      console.log(`  (overridden by TERMINALHIRE_NUDGE=${envOverride} at runtime)`);
    }
    console.log(
      `  peer-connect: ${cfg.peerConnect ? "on" : "off"}  (ambient peer & founder surfacing; default off)`
    );
    const mixEnv = process.env["TH_MIX"];
    console.log(
      `  mix: ${cfg.mix}  (roles vs. contributions on the ambient surface; default balanced)`
    );
    if (mixEnv) {
      console.log(`  (mix overridden by TH_MIX=${mixEnv} at runtime)`);
    }
    console.log(`  lead: ${cfg.surfaceLead ?? "auto"}  (auto derives from your open postings)`);
    console.log(
      `  founder-notify: ${cfg.founderBountyNotify ? "on" : "off"}  (OS ping when a paid founder bounty drops; default off)`
    );
    console.log(`  config file: ${CONFIG_FILE2}`);
    console.log("");
    console.log("  Valid nudge values:");
    console.log("    session   \u2014 print at most once per Claude Code session (default)");
    console.log("    always    \u2014 print every statusLine render when matches exist");
    console.log("    every:N   \u2014 print every Nth render (e.g. every:3)");
    console.log("");
    printMixValues();
    console.log("  (set with: config set mix <value>  \xB7  read with: config get mix)");
    console.log("");
    console.log("  Peer-connect (--connect on|off):");
    console.log(
      "    on   \u2014 surface peers & founders in the spinner + send an anonymous matched signal"
    );
    console.log("    off  \u2014 no peer matching, no directory fetch, no signal (default)");
    console.log("");
    console.log("  Founder bounty OS notify (--founder-notify on|off):");
    console.log("    on   \u2014 ping when a NEW claimable founder bounty appears (TERM-228)");
    console.log("    off  \u2014 no OS toast for founder supply (default)");
    console.log("");
    return;
  }
  const nudgeIdx = filtered.indexOf("--nudge");
  if (nudgeIdx !== -1) {
    const value = filtered[nudgeIdx + 1];
    if (!value) {
      console.error("Error: --nudge requires a value: session | always | every:N");
      process.exit(1);
    }
    const parsed = parseNudgeMode(value);
    if (!parsed) {
      console.error(`Error: invalid nudge value "${value}". Valid: session | always | every:N`);
      process.exit(1);
    }
    writeConfig({ nudge: parsed });
    console.log(`  nudge set to: ${parsed}`);
    console.log(`  (saved to ${CONFIG_FILE2})`);
    return;
  }
  const connectIdx = filtered.indexOf("--connect");
  if (connectIdx !== -1) {
    const value = filtered[connectIdx + 1];
    if (value !== "on" && value !== "off") {
      console.error("Error: --connect requires a value: on | off");
      process.exit(1);
    }
    writeConfig({ peerConnect: value === "on", peerConnectPrompted: true });
    console.log(`  peer-connect set to: ${value}`);
    console.log(`  (saved to ${CONFIG_FILE2})`);
    return;
  }
  const founderNotifyIdx = filtered.indexOf("--founder-notify");
  if (founderNotifyIdx !== -1) {
    const value = filtered[founderNotifyIdx + 1];
    if (value !== "on" && value !== "off") {
      console.error("Error: --founder-notify requires a value: on | off");
      process.exit(1);
    }
    writeConfig({ founderBountyNotify: value === "on" });
    if (value === "on") {
      try {
        const { openPaidIds: openPaidIds2 } = await Promise.resolve().then(() => (init_founder_paid_badge(), founder_paid_badge_exports));
        const { readCacheEntry: readCacheEntry2, updateIndexCache: updateIndexCache2 } = await Promise.resolve().then(() => (init_cache_store(), cache_store_exports));
        const entry = readCacheEntry2() ?? {};
        const ids = openPaidIds2(entry.index);
        updateIndexCache2({ founderPaidOsNotified: { ids } });
        console.log(`  founder-notify set to: on`);
        console.log(
          `  (seeded ${ids.length} existing open bounty id(s) \u2014 only NEW ones will ping)`
        );
      } catch {
        console.log(`  founder-notify set to: on`);
        console.log("  (could not seed from cache \u2014 first refresh will silent-seed)");
      }
    } else {
      console.log(`  founder-notify set to: off`);
    }
    console.log(`  (saved to ${CONFIG_FILE2})`);
    return;
  }
  console.error("Usage: terminalhire config --nudge <session|always|every:N>");
  console.error("       terminalhire config --connect <on|off>");
  console.error("       terminalhire config --founder-notify <on|off>");
  console.error("       terminalhire config set mix <jobs|balanced|credential>");
  console.error("       terminalhire config get mix");
  console.error("       terminalhire config set lead <auto|dev|founder>");
  console.error("       terminalhire config get lead");
  console.error("       terminalhire config --show");
  process.exit(1);
}
export {
  run
};
