#!/usr/bin/env node

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
var VERB_INTROS = ["Matched:", "You\u2019d fit:", "Worth a look:", "On your radar:", "Fits your stack:"];
function ctaVerb() {
  return "\u2605 jobs that fit you \xB7 run: terminalhire jobs";
}
function formatVerbs(topMatches, max = 6) {
  const out = [];
  const seen = /* @__PURE__ */ new Set();
  for (const m of Array.isArray(topMatches) ? topMatches : []) {
    if (!m || !m.title || !m.company) continue;
    let title = String(m.title).trim().replace(/\s+/g, " ");
    if (title.length > 32) title = title.slice(0, 31).trimEnd() + "\u2026";
    const company = titleCase(String(m.company).trim().replace(/\s+/g, " "));
    const pct = Math.max(1, Math.min(99, Math.round((Number(m.score) || 0) * 100)));
    const key = `${title.toLowerCase()}@${company.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const intro = VERB_INTROS[out.length % VERB_INTROS.length];
    out.push(`${intro} ${title} @ ${company} \xB7 ${pct}% match`);
    if (out.length >= max) break;
  }
  return out;
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
function buildPeerLine(topPeers) {
  const n = (Array.isArray(topPeers) ? topPeers : []).filter(Boolean).length;
  if (n < 1) return null;
  return n === 1 ? `\u25C6 1 builder matches what you're building \xB7 terminalhire devs` : `\u25C6 ${n} builders match what you're building \xB7 terminalhire devs`;
}
function buildIncomingIntroLine(incomingPending) {
  const n = incomingPending && typeof incomingPending.count === "number" ? incomingPending.count : 0;
  if (n < 1) return null;
  return n === 1 ? `\u2198 someone wants to connect \xB7 terminalhire intro --list` : `\u2198 ${n} people want to connect \xB7 terminalhire intro --list`;
}
function buildSpinnerPool(topMatches, max = 6, opts = {}) {
  const { sessionTags, frequency = "always", topPeers, incomingPending } = opts;
  const introLine = buildIncomingIntroLine(incomingPending);
  const ranked = rankBySessionTags(topMatches, sessionTags);
  if (!Array.isArray(ranked) || ranked.length === 0) {
    if (introLine) return [introLine];
    const peerLine = buildPeerLine(topPeers);
    return peerLine ? [peerLine] : [];
  }
  const headers = buildContextVerbs(ranked, sessionTags);
  const cap = Math.max(1, verbCountForFrequency(frequency, headers.length));
  const pool = [...headers.slice(0, cap), ctaVerb()];
  if (introLine) pool.push(introLine);
  return pool;
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
function interleaveBySource(topMatches) {
  if (!Array.isArray(topMatches) || topMatches.length === 0) return topMatches;
  const buckets = /* @__PURE__ */ new Map();
  const order = [];
  for (const m of topMatches) {
    const id = m && m.id ? String(m.id) : "";
    const idx = id.indexOf(":");
    const source = idx > 0 ? id.slice(0, idx) : "_";
    if (!buckets.has(source)) {
      buckets.set(source, []);
      order.push(source);
    }
    buckets.get(source).push(m);
  }
  const out = [];
  let remaining = topMatches.length;
  while (remaining > 0) {
    for (const source of order) {
      const b = buckets.get(source);
      if (b && b.length) {
        out.push(b.shift());
        remaining--;
      }
    }
  }
  return out;
}
function buildTips(topMatches, baseUrl, max = 8) {
  const base = String(baseUrl || "https://terminalhire.com").replace(/\/+$/, "");
  const out = [];
  const seenRole = /* @__PURE__ */ new Set();
  const perCompany = /* @__PURE__ */ new Map();
  const COMPANY_CAP = 2;
  const all = Array.isArray(topMatches) ? topMatches : [];
  const bountyQ = all.filter((m) => m && m.source === "bounty");
  const roleQ = interleaveBySource(all.filter((m) => m && m.source !== "bounty"));
  const ordered = [];
  let bi = 0;
  let ri = 0;
  while (bi < bountyQ.length || ri < roleQ.length) {
    if (ri < roleQ.length) ordered.push(roleQ[ri++]);
    if (bi < bountyQ.length) ordered.push(bountyQ[bi++]);
  }
  for (const m of ordered) {
    if (!m || !m.title || !m.company || !m.id) continue;
    const idx = String(m.id).indexOf(":");
    if (idx <= 0) continue;
    const source = String(m.id).slice(0, idx);
    const ext = String(m.id).slice(idx + 1);
    if (!source || !ext) continue;
    const companyRaw = String(m.company).trim().replace(/\s+/g, " ");
    const titleRaw = String(m.title).trim().replace(/\s+/g, " ");
    const roleKey = `${titleRaw.toLowerCase()}@${companyRaw.toLowerCase()}`;
    const coKey = companyRaw.toLowerCase();
    if (seenRole.has(roleKey)) continue;
    if ((perCompany.get(coKey) || 0) >= COMPANY_CAP) continue;
    seenRole.add(roleKey);
    perCompany.set(coKey, (perCompany.get(coKey) || 0) + 1);
    let title = titleRaw;
    if (title.length > 34) title = title.slice(0, 33).trimEnd() + "\u2026";
    const company = titleCase(companyRaw);
    const pct = Math.max(1, Math.min(99, Math.round((Number(m.score) || 0) * 100)));
    const token = Buffer.from(String(m.id)).toString("base64url");
    const url = `${base}/j/${token}`;
    if (source === "bounty") {
      const money = m.amountUSD != null ? `$${Number(m.amountUSD).toLocaleString()}` : "$\u2014";
      const repo = m.repo || companyRaw;
      out.push(`\u{1F48E} ${money} \xB7 ${title} \xB7 ${repo} \xB7 ${pct}% \u2014 ${url}`);
    } else {
      out.push(`\u2197 ${title} @ ${company} \xB7 ${pct}% \u2014 ${url}`);
    }
    if (out.length >= max) break;
  }
  return out;
}
function applySpinnerTips(ourTips) {
  const tips = (Array.isArray(ourTips) ? ourTips : []).filter(Boolean);
  if (tips.length === 0) return clearSpinnerTips();
  const settings = readJson(CLAUDE_SETTINGS, {}) || {};
  const existing = settings.spinnerTipsOverride && Array.isArray(settings.spinnerTipsOverride.tips) ? settings.spinnerTipsOverride.tips : [];
  const prevOurs = new Set(readState().tips || []);
  const userTips = existing.filter((t) => !prevOurs.has(t));
  settings.spinnerTipsEnabled = true;
  settings.spinnerTipsOverride = { excludeDefault: true, tips: [...tips, ...userTips] };
  atomicWriteJson(CLAUDE_SETTINGS, settings);
  const st = readState();
  atomicWriteJson(SPINNER_STATE_FILE, { ...st, tips, ts: Date.now() });
  return { applied: tips.length };
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
export {
  SPINNER_DEFAULTS,
  applySpinnerTips,
  applySpinnerVerbs,
  buildContextVerbs,
  buildIncomingIntroLine,
  buildPeerLine,
  buildSpinnerPool,
  buildTips,
  clearSpinnerTips,
  clearSpinnerVerbs,
  ctaVerb,
  formatVerbs,
  interleaveBySource,
  rankBySessionTags,
  readSpinnerConfig
};
