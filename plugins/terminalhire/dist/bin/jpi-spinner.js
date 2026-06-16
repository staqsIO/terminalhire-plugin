#!/usr/bin/env node

// bin/jpi-spinner.js
import {
  readFileSync as readFileSync2,
  writeFileSync as writeFileSync2,
  copyFileSync,
  existsSync as existsSync2,
  mkdirSync as mkdirSync2
} from "fs";
import { join as join2 } from "path";
import { homedir as homedir2 } from "os";
import { createInterface } from "readline";

// bin/spinner.js
import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  renameSync
} from "fs";
import { join, dirname } from "path";
import { homedir } from "os";
var TH_DIR = process.env["TERMINALHIRE_DIR"] || join(homedir(), ".terminalhire");
var CLAUDE_SETTINGS = process.env["TERMINALHIRE_CLAUDE_SETTINGS"] || join(homedir(), ".claude", "settings.json");
var CONFIG_FILE = join(TH_DIR, "config.json");
var SPINNER_STATE_FILE = join(TH_DIR, "spinner-state.json");
var SPINNER_DEFAULTS = { enabled: false, mode: "append", max: 6, frequency: "sometimes" };
function readJson(path, fallback) {
  try {
    return existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : fallback;
  } catch {
    return fallback;
  }
}
function atomicWriteJson(path, obj) {
  mkdirSync(dirname(path), { recursive: true });
  const tmp = `${path}.tmp-${process.pid}`;
  writeFileSync(tmp, JSON.stringify(obj, null, 2) + "\n", "utf8");
  renameSync(tmp, path);
}
function titleCase(s) {
  return String(s || "").replace(/\b\w/g, (c) => c.toUpperCase());
}
function readSpinnerConfig() {
  const cfg = readJson(CONFIG_FILE, {});
  const spinner = cfg && typeof cfg.spinner === "object" ? cfg.spinner : {};
  const merged = { ...SPINNER_DEFAULTS, ...spinner };
  if (merged.mode !== "append" && merged.mode !== "replace") merged.mode = SPINNER_DEFAULTS.mode;
  merged.max = Math.max(1, Math.min(12, Number(merged.max) || SPINNER_DEFAULTS.max));
  merged.enabled = merged.enabled === true;
  if (!["always", "sometimes", "rare"].includes(merged.frequency)) {
    merged.frequency = SPINNER_DEFAULTS.frequency;
  }
  return merged;
}
function ctaVerb() {
  return "\u2605 jobs that fit you \xB7 run: terminalhire jobs";
}
function rankBySessionTags(topMatches, sessionTags) {
  const tags = Array.isArray(sessionTags) ? sessionTags.filter(Boolean) : [];
  if (tags.length === 0 || !Array.isArray(topMatches)) return topMatches;
  const normalized = tags.map((t) => String(t).toLowerCase().trim());
  return topMatches.map((m, originalIndex) => {
    const haystack = `${String(m.title || "").toLowerCase()} ${String(m.company || "").toLowerCase()}`;
    const hits = normalized.reduce((n, tag) => n + (haystack.includes(tag) ? 1 : 0), 0);
    return { m, hits, originalIndex };
  }).sort((a, b) => b.hits - a.hits || a.originalIndex - b.originalIndex).map(({ m }) => m);
}
function verbCountForFrequency(frequency, max) {
  switch (frequency) {
    case "always":
      return max;
    case "rare":
      return 1;
    case "sometimes":
    default:
      return 2;
  }
}
function buildContextVerbs(topMatches, sessionTags) {
  const sess = (Array.isArray(sessionTags) ? sessionTags : []).map((t) => String(t).toLowerCase().trim()).filter(Boolean);
  const roleTags = /* @__PURE__ */ new Set();
  for (const m of Array.isArray(topMatches) ? topMatches : []) {
    const mt = m && Array.isArray(m.matchedTags) ? m.matchedTags : [];
    for (const t of mt) roleTags.add(String(t).toLowerCase().trim());
  }
  const overlap = [];
  for (const t of sess) {
    if (roleTags.has(t) && !overlap.includes(t)) overlap.push(t);
  }
  let headers;
  if (overlap.length >= 2) {
    const a = titleCase(overlap[0]);
    const b = titleCase(overlap[1]);
    headers = [`\u2726 Fits your ${a} + ${b} work`, `\u2726 A match for what you're building \u2014 link below`];
  } else if (overlap.length === 1) {
    const a = titleCase(overlap[0]);
    headers = [`\u2726 Work in your ${a} stack \u2014 link below`, `\u2726 Your ${a} work \u2014 link in the tip below`];
  } else {
    headers = [`\u2726 Work that fits your stack`, `\u2726 A match for you \u2014 link in the tip below`];
  }
  const list = Array.isArray(topMatches) ? topMatches : [];
  const hasBounty = list.some((m) => m && m.source === "bounty");
  if (hasBounty) headers.push(`\u2726 Roles + \u{1F48E} paid bounties in your stack \u2014 link below`);
  return headers;
}
function buildSpinnerPool(topMatches, max = 6, opts = {}) {
  const { sessionTags, frequency = "always" } = opts;
  const ranked = rankBySessionTags(topMatches, sessionTags);
  if (!Array.isArray(ranked) || ranked.length === 0) return [];
  const headers = buildContextVerbs(ranked, sessionTags);
  const cap = Math.max(1, verbCountForFrequency(frequency, headers.length));
  return [...headers.slice(0, cap), ctaVerb()];
}
function readState() {
  return readJson(SPINNER_STATE_FILE, { verbs: [], mode: "replace" });
}
function applySpinnerVerbs(ourVerbs, mode = "replace") {
  const verbs = (Array.isArray(ourVerbs) ? ourVerbs : []).filter(Boolean);
  if (verbs.length === 0) return clearSpinnerVerbs();
  const settings = readJson(CLAUDE_SETTINGS, {}) || {};
  const existing = settings.spinnerVerbs && typeof settings.spinnerVerbs === "object" ? settings.spinnerVerbs : null;
  const prevOurs = new Set(readState().verbs || []);
  const userVerbs = existing && Array.isArray(existing.verbs) ? existing.verbs.filter((v) => !prevOurs.has(v)) : [];
  const newVerbs = [...verbs, ...userVerbs];
  settings.spinnerVerbs = { mode: mode === "append" ? "append" : "replace", verbs: newVerbs };
  atomicWriteJson(CLAUDE_SETTINGS, settings);
  const st = readState();
  atomicWriteJson(SPINNER_STATE_FILE, { ...st, verbs, mode, ts: Date.now() });
  return { applied: verbs.length, total: newVerbs.length };
}
function clearSpinnerVerbs() {
  const settings = readJson(CLAUDE_SETTINGS, null);
  const prevOurs = new Set(readState().verbs || []);
  let keptUserVerbs = 0;
  if (settings && settings.spinnerVerbs && Array.isArray(settings.spinnerVerbs.verbs)) {
    const userVerbs = settings.spinnerVerbs.verbs.filter((v) => !prevOurs.has(v));
    keptUserVerbs = userVerbs.length;
    if (userVerbs.length > 0) {
      settings.spinnerVerbs = {
        mode: settings.spinnerVerbs.mode === "append" ? "append" : "replace",
        verbs: userVerbs
      };
    } else {
      delete settings.spinnerVerbs;
    }
    atomicWriteJson(CLAUDE_SETTINGS, settings);
  }
  try {
    const st = readState();
    atomicWriteJson(SPINNER_STATE_FILE, { ...st, verbs: [], mode: st.mode || "replace", ts: Date.now() });
  } catch {
  }
  return { cleared: true, keptUserVerbs };
}
function clearSpinnerTips() {
  const settings = readJson(CLAUDE_SETTINGS, null);
  const prevOurs = new Set(readState().tips || []);
  if (settings && settings.spinnerTipsOverride && Array.isArray(settings.spinnerTipsOverride.tips)) {
    const userTips = settings.spinnerTipsOverride.tips.filter((t) => !prevOurs.has(t));
    if (userTips.length > 0) {
      settings.spinnerTipsOverride = {
        excludeDefault: settings.spinnerTipsOverride.excludeDefault === true,
        tips: userTips
      };
    } else {
      delete settings.spinnerTipsOverride;
      delete settings.spinnerTipsEnabled;
    }
    atomicWriteJson(CLAUDE_SETTINGS, settings);
  }
  try {
    const st = readState();
    atomicWriteJson(SPINNER_STATE_FILE, { ...st, tips: [], ts: Date.now() });
  } catch {
  }
  return { cleared: true };
}

// bin/jpi-spinner.js
var TH_DIR2 = process.env["TERMINALHIRE_DIR"] || join2(homedir2(), ".terminalhire");
var CONFIG_FILE2 = join2(TH_DIR2, "config.json");
var SETTINGS_PATH = process.env["TERMINALHIRE_CLAUDE_SETTINGS"] || join2(homedir2(), ".claude", "settings.json");
var CACHE_FILE = join2(TH_DIR2, "index-cache.json");
function readConfig() {
  try {
    return existsSync2(CONFIG_FILE2) ? JSON.parse(readFileSync2(CONFIG_FILE2, "utf8")) : {};
  } catch {
    return {};
  }
}
function writeConfig(patch) {
  mkdirSync2(TH_DIR2, { recursive: true });
  const merged = { ...readConfig(), ...patch };
  writeFileSync2(CONFIG_FILE2, JSON.stringify(merged, null, 2) + "\n", "utf8");
}
function backupSettings() {
  if (!existsSync2(SETTINGS_PATH)) return null;
  const ts = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
  const backupPath = `${SETTINGS_PATH}.terminalhire-backup-${ts}`;
  copyFileSync(SETTINGS_PATH, backupPath);
  return backupPath;
}
function ask(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((res) => {
    rl.question(question, (answer) => {
      rl.close();
      res(answer.trim().toLowerCase());
    });
  });
}
function readTopMatches() {
  try {
    const c = JSON.parse(readFileSync2(CACHE_FILE, "utf8"));
    return Array.isArray(c.topMatches) ? c.topMatches : [];
  } catch {
    return [];
  }
}
async function run() {
  const args = process.argv.slice(2).filter((a) => a !== "spinner");
  const has = (f) => args.includes(f);
  const val = (f) => {
    const i = args.indexOf(f);
    return i >= 0 ? args[i + 1] : void 0;
  };
  if (has("--show") || args.length === 0) {
    const sc = readSpinnerConfig();
    console.log("");
    console.log("terminalhire spinner \u2014 job matches in the Claude Code spinner line");
    console.log("");
    console.log(`  enabled:   ${sc.enabled}`);
    console.log(`  mode:      ${sc.mode}   (replace = only job matches; append = mixed with Claude defaults)`);
    console.log(`  max:       ${sc.max}    (max job verbs that rotate)`);
    console.log(`  frequency: ${sc.frequency}   (always = up to max; sometimes = up to 2; rare = 1 per cycle)`);
    console.log("");
    console.log("  terminalhire spinner --on                      enable (asks consent, backs up settings.json)");
    console.log("  terminalhire spinner --off                     disable + restore your original spinner");
    console.log("  terminalhire spinner --mode append             mix job verbs with Claude's defaults");
    console.log("  terminalhire spinner --mode replace            show only job matches");
    console.log("  terminalhire spinner --max N                   cap how many job verbs rotate (1\u201312)");
    console.log("  terminalhire spinner --frequency always        surface up to max role verbs every cycle");
    console.log("  terminalhire spinner --frequency sometimes     surface up to 2 role verbs (default)");
    console.log("  terminalhire spinner --frequency rare          surface 1 role verb per cycle (quietest)");
    console.log("");
    return;
  }
  if (has("--off")) {
    const res = clearSpinnerVerbs();
    clearSpinnerTips();
    writeConfig({ spinner: { ...readSpinnerConfig(), enabled: false } });
    console.log("");
    console.log("  Spinner job verbs removed.");
    if (res.keptUserVerbs > 0) {
      console.log(`  Preserved ${res.keptUserVerbs} spinner verb(s) you set yourself.`);
    } else {
      console.log("  Your original spinner is restored.");
    }
    console.log("  Re-enable any time: terminalhire spinner --on");
    console.log("");
    return;
  }
  if ((has("--mode") || has("--max") || has("--frequency")) && !has("--on")) {
    const cur = readSpinnerConfig();
    const next = { ...cur };
    const m = val("--mode");
    if (m) {
      if (m !== "append" && m !== "replace") {
        console.error('Error: --mode must be "append" or "replace".');
        process.exit(1);
      }
      next.mode = m;
    }
    const mx = val("--max");
    if (mx) {
      const n = parseInt(mx, 10);
      if (!(n >= 1 && n <= 12)) {
        console.error("Error: --max must be a number 1\u201312.");
        process.exit(1);
      }
      next.max = n;
    }
    const freq = val("--frequency");
    if (freq) {
      if (!["always", "sometimes", "rare"].includes(freq)) {
        console.error('Error: --frequency must be "always", "sometimes", or "rare".');
        process.exit(1);
      }
      next.frequency = freq;
    }
    writeConfig({ spinner: next });
    console.log(`  spinner config updated: mode=${next.mode} max=${next.max} frequency=${next.frequency} enabled=${next.enabled}`);
    if (next.enabled) {
      const verbs = buildSpinnerPool(readTopMatches(), next.max, { frequency: next.frequency });
      if (verbs.length) applySpinnerVerbs(verbs, next.mode);
      else clearSpinnerVerbs();
    }
    return;
  }
  if (has("--on")) {
    const mode = val("--mode") === "replace" ? "replace" : "append";
    const maxRaw = parseInt(val("--max"), 10);
    const max = maxRaw >= 1 && maxRaw <= 12 ? maxRaw : 6;
    const freqRaw = val("--frequency");
    const frequency = ["always", "sometimes", "rare"].includes(freqRaw) ? freqRaw : "sometimes";
    console.log("");
    console.log("\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510");
    console.log("\u2502   terminalhire \u2014 enable the spinner job surface                  \u2502");
    console.log("\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518");
    console.log("");
    console.log("WHAT THIS CHANGES:");
    console.log('  \u2022 Adds a "spinnerVerbs" key to ~/.claude/settings.json \u2014 the official,');
    console.log("    documented Claude Code setting. No patching, no binary changes (Rule 7).");
    console.log("  \u2022 While Claude works, the spinner line shows your TOP LOCAL JOB MATCHES,");
    console.log("    e.g.  Senior Backend Engineer @ Stripe \xB7 82% \u2026");
    console.log("  \u2022 The tip line below shows a \u2318-clickable terminalhire.com/j/\u2026 link to open");
    console.log("    the listing (clicks logged anonymously, no profile data).");
    console.log(`  \u2022 mode=${mode}  (replace = only job matches; append = mixed with defaults)`);
    console.log(`  \u2022 frequency=${frequency}  (always = every cycle; sometimes = up to 2 verbs; rare = 1 verb)`);
    console.log("  \u2022 Matches are computed LOCALLY and refreshed in the background.");
    console.log("    ZERO egress \u2014 your profile never leaves the machine; only public job");
    console.log("    text appears on YOUR screen.");
    console.log("  \u2022 Any spinner verbs you already set are preserved, never clobbered.");
    console.log("");
    console.log("FULLY REVERSIBLE:");
    console.log("  terminalhire spinner --off    removes job verbs, restores your spinner");
    console.log("  (a timestamped backup of settings.json is taken now)");
    console.log("");
    const answer = await ask('Enable the spinner job surface? Type "yes" to continue: ');
    if (answer !== "yes") {
      console.log("\nAborted \u2014 nothing changed.");
      process.exit(0);
    }
    const backup = backupSettings();
    writeConfig({ spinner: { enabled: true, mode, max, frequency } });
    const verbs = buildSpinnerPool(readTopMatches(), max, { frequency });
    if (verbs.length) applySpinnerVerbs(verbs, mode);
    console.log("");
    if (backup) console.log(`  Backed up settings to: ${backup}`);
    console.log(`  Enabled. ${verbs.length} job verb(s) live now; refreshes in the background.`);
    if (verbs.length === 0) {
      console.log("  (No matches cached yet \u2014 run `terminalhire refresh` or wait for the monitor.)");
    }
    console.log("  Claude Code picks up settings.json changes automatically.");
    console.log("  Turn off any time: terminalhire spinner --off");
    console.log("");
    return;
  }
  console.error("Usage: terminalhire spinner --on | --off | --show | --mode <append|replace> | --max N | --frequency <always|sometimes|rare>");
  process.exit(1);
}
export {
  run
};
