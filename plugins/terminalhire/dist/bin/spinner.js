#!/usr/bin/env node

// bin/spinner-config.js
import { join as join2 } from "path";

// bin/spinner-io.js
import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  renameSync
} from "fs";
import { join, dirname } from "path";
import { homedir } from "os";
function thDir() {
  return process.env["TERMINALHIRE_DIR"] || join(homedir(), ".terminalhire");
}
function claudeSettingsPath() {
  return process.env["TERMINALHIRE_CLAUDE_SETTINGS"] || join(homedir(), ".claude", "settings.json");
}
function spinnerStateFilePath() {
  return join(thDir(), "spinner-state.json");
}
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
function readState() {
  const SPINNER_STATE_FILE = spinnerStateFilePath();
  return readJson(SPINNER_STATE_FILE, { verbs: [], mode: "replace" });
}
function applySpinnerVerbs(ourVerbs, mode = "replace") {
  const CLAUDE_SETTINGS = claudeSettingsPath();
  const SPINNER_STATE_FILE = spinnerStateFilePath();
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
  const CLAUDE_SETTINGS = claudeSettingsPath();
  const SPINNER_STATE_FILE = spinnerStateFilePath();
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
function applySpinnerTips(ourTips) {
  const CLAUDE_SETTINGS = claudeSettingsPath();
  const SPINNER_STATE_FILE = spinnerStateFilePath();
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
  const CLAUDE_SETTINGS = claudeSettingsPath();
  const SPINNER_STATE_FILE = spinnerStateFilePath();
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

// bin/spinner-config.js
function configFilePath() {
  return join2(thDir(), "config.json");
}
var SPINNER_DEFAULTS = { enabled: false, mode: "append", max: 6, frequency: "sometimes" };
function readSpinnerConfig() {
  const CONFIG_FILE = configFilePath();
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

// bin/spinner-seen.js
import {
  readFileSync as readFileSync2,
  writeFileSync as writeFileSync2,
  renameSync as renameSync2,
  mkdirSync as mkdirSync2
} from "fs";
import { join as join3, dirname as dirname2 } from "path";
import { homedir as homedir2 } from "os";
var SEEN_WINDOW_SURFACES = 10;
var SEEN_TTL_MS = 7 * 24 * 60 * 60 * 1e3;
var SEEN_MAX_ENTRIES = 500;
function seenFilePath() {
  const dir = process.env["TERMINALHIRE_DIR"] || join3(homedir2(), ".terminalhire");
  return join3(dir, "seen-history.json");
}
function atomicWriteJson2(path, obj) {
  mkdirSync2(dirname2(path), { recursive: true });
  const tmp = `${path}.tmp-${process.pid}`;
  writeFileSync2(tmp, JSON.stringify(obj) + "\n", { encoding: "utf8", mode: 384 });
  renameSync2(tmp, path);
}
function emptyHistory() {
  return { surface: 0, entries: {} };
}
function isFiniteNonNegative(n) {
  return typeof n === "number" && Number.isFinite(n) && n >= 0;
}
function pruneEntries(entries, now) {
  const out = {};
  for (const [id, e] of Object.entries(entries)) {
    if (!e || !isFiniteNonNegative(e.lastSurface) || !isFiniteNonNegative(e.lastSeenAt)) continue;
    if (now - e.lastSeenAt > SEEN_TTL_MS) continue;
    out[id] = { lastSurface: e.lastSurface, lastSeenAt: e.lastSeenAt };
  }
  return out;
}
function capEntries(entries) {
  const ids = Object.keys(entries);
  if (ids.length <= SEEN_MAX_ENTRIES) return entries;
  ids.sort((a, b) => entries[b].lastSurface - entries[a].lastSurface || entries[b].lastSeenAt - entries[a].lastSeenAt);
  const out = {};
  for (const id of ids.slice(0, SEEN_MAX_ENTRIES)) out[id] = entries[id];
  return out;
}
function loadSeenHistory(now = Date.now()) {
  let raw;
  try {
    raw = JSON.parse(readFileSync2(seenFilePath(), "utf8"));
  } catch {
    return emptyHistory();
  }
  if (!raw || typeof raw !== "object") return emptyHistory();
  const surface = isFiniteNonNegative(raw.surface) ? Math.floor(raw.surface) : 0;
  const entries = raw.entries && typeof raw.entries === "object" && !Array.isArray(raw.entries) ? pruneEntries(raw.entries, now) : {};
  return { surface, entries };
}
function isSuppressed(id, history) {
  const e = history.entries[id];
  if (!e) return false;
  return history.surface - e.lastSurface < SEEN_WINDOW_SURFACES;
}
function recordSurface(ids, now = Date.now()) {
  const history = loadSeenHistory(now);
  const surface = history.surface + 1;
  const entries = { ...history.entries };
  for (const id of ids) {
    if (typeof id !== "string" || id.length === 0) continue;
    entries[id] = { lastSurface: surface, lastSeenAt: now };
  }
  const next = { surface, entries: capEntries(pruneEntries(entries, now)) };
  try {
    atomicWriteJson2(seenFilePath(), next);
  } catch {
  }
  return next;
}

// bin/spinner-select.js
function filterFreshMatches(matches, history) {
  const { eligible, suppressed } = partitionFreshMatches(matches, history);
  return suppressed.length === 0 ? matches : [...eligible, ...suppressed];
}
function partitionFreshMatches(matches, history) {
  const list = Array.isArray(matches) ? matches : [];
  if (!history || !history.entries || Object.keys(history.entries).length === 0) {
    return { eligible: list, suppressed: [] };
  }
  const eligible = [];
  const suppressed = [];
  for (const m of list) {
    if (m && m.id != null && isSuppressed(String(m.id), history)) suppressed.push(m);
    else eligible.push(m);
  }
  const stamp = (m) => history.entries[String(m.id)].lastSurface;
  suppressed.sort((a, b) => stamp(a) - stamp(b));
  return { eligible, suppressed };
}
function widenFreshCandidates(matches, history, need, widen) {
  const list = Array.isArray(matches) ? matches.filter(Boolean) : [];
  if (!(need > 0)) return [];
  if (!widen || !Array.isArray(widen.reserve) || typeof widen.getAdjacent !== "function") return [];
  const suppressed = (m) => !!history && !!history.entries && m.id != null && isSuppressed(String(m.id), history);
  const counts = /* @__PURE__ */ new Map();
  for (const m of list) {
    for (const t of Array.isArray(m.matchedTags) ? m.matchedTags : []) {
      const tag = String(t).toLowerCase();
      counts.set(tag, (counts.get(tag) || 0) + 1);
    }
  }
  const maxCount = Math.max(0, ...counts.values());
  if (maxCount === 0) return [];
  const dominant = [...counts.entries()].filter(([, c]) => c === maxCount).map(([t]) => t);
  const inPool = new Set(list.map((m) => String(m.id)));
  const fresh = (m) => m && m.id != null && !inPool.has(String(m.id)) && !suppressed(m);
  const tagged = (m, adj) => (Array.isArray(m.matchedTags) ? m.matchedTags : []).some((t) => adj.has(String(t).toLowerCase()));
  const ringCandidates = (hops) => {
    const adj = new Set(dominant.flatMap((d) => widen.getAdjacent(d, hops)));
    if (adj.size === 0) return [];
    return widen.reserve.filter((m) => fresh(m) && tagged(m, adj));
  };
  let widened = ringCandidates(1);
  if (widened.length === 0) widened = ringCandidates(2);
  if (widened.length === 0) {
    widened = widen.reserve.filter(
      (m) => fresh(m) && (m.source === "bounty" || m.source === "contribute")
    );
  }
  return widened.slice(0, need);
}

// bin/spinner-verbs.js
function titleCase(s) {
  return String(s || "").replace(/\b\w/g, (c) => c.toUpperCase());
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
function buildSessionStaleLine(sessionStale) {
  return sessionStale === true ? "\u26A0 terminalhire: linked session expired \u2014 run: terminalhire login" : null;
}
function buildSpinnerPool(topMatches, _max = 6, opts = {}) {
  const { sessionTags, frequency = "always", topPeers, incomingPending, sessionStale, seenHistory } = opts;
  const staleLine = buildSessionStaleLine(sessionStale);
  const withStale = (pool2) => staleLine ? [staleLine, ...pool2] : pool2;
  const introLine = buildIncomingIntroLine(incomingPending);
  const ranked = filterFreshMatches(rankBySessionTags(topMatches, sessionTags), seenHistory);
  if (!Array.isArray(ranked) || ranked.length === 0) {
    if (introLine) return withStale([introLine]);
    const peerLine = buildPeerLine(topPeers);
    return withStale(peerLine ? [peerLine] : []);
  }
  const headers = buildContextVerbs(ranked, sessionTags);
  const cap = Math.max(1, verbCountForFrequency(frequency, headers.length));
  const pool = [...headers.slice(0, cap), ctaVerb()];
  if (introLine) pool.push(introLine);
  return withStale(pool);
}

// bin/spinner-render.js
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
function buildTipsDetailed(topMatches, baseUrl, max = 8, opts = {}) {
  const base = String(baseUrl || "https://terminalhire.com").replace(/\/+$/, "");
  const out = [];
  const surfacedIds = [];
  const seenRole = /* @__PURE__ */ new Set();
  const perCompany = /* @__PURE__ */ new Map();
  const COMPANY_CAP = 2;
  const { eligible, suppressed } = partitionFreshMatches(
    Array.isArray(topMatches) ? topMatches : [],
    opts.seenHistory
  );
  const orderForEmit = (list) => {
    const bountyQ = list.filter((m) => m && m.source === "bounty");
    const contributeQ = list.filter((m) => m && m.source === "contribute");
    const roleQ = interleaveBySource(
      list.filter((m) => m && m.source !== "bounty" && m.source !== "contribute")
    );
    const ordered = [];
    let bi = 0;
    let ri = 0;
    let ci = 0;
    while (bi < bountyQ.length || ri < roleQ.length || ci < contributeQ.length) {
      if (ri < roleQ.length) ordered.push(roleQ[ri++]);
      if (bi < bountyQ.length) ordered.push(bountyQ[bi++]);
      if (ci < contributeQ.length) ordered.push(contributeQ[ci++]);
    }
    return ordered;
  };
  const emit = (list) => {
    for (const m of orderForEmit(list)) {
      if (out.length >= max) return;
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
      } else if (source === "contribute") {
        const repo = m.repo || companyRaw;
        const num = m.issueNumber != null ? ` #${m.issueNumber}` : "";
        out.push(`\u2197 contribute \xB7 ${repo}${num} \xB7 counts on your r\xE9sum\xE9 \xB7 ${pct}%`);
      } else {
        out.push(`\u2197 ${title} @ ${company} \xB7 ${pct}% \u2014 ${url}`);
      }
      surfacedIds.push(String(m.id));
    }
  };
  emit(eligible);
  if (out.length < max && opts.widen) {
    const widened = widenFreshCandidates(
      Array.isArray(topMatches) ? topMatches : [],
      opts.seenHistory,
      max - out.length,
      opts.widen
    );
    if (widened.length > 0) emit(widened);
  }
  if (out.length < max) emit(suppressed);
  return { tips: out, surfacedIds };
}
function buildTips(topMatches, baseUrl, max = 8, opts = {}) {
  return buildTipsDetailed(topMatches, baseUrl, max, opts).tips;
}
function renderRefreshSurface(topMatches, sc, opts = {}) {
  if (!sc || sc.enabled !== true) {
    clearSpinnerVerbs();
    clearSpinnerTips();
    return { verbs: [], tips: [], surfacedIds: [] };
  }
  const seenHistory = opts.seenHistory || loadSeenHistory();
  const ranked = rankBySessionTags(topMatches, opts.sessionTags);
  const verbs = buildSpinnerPool(ranked, sc.max, {
    sessionTags: opts.sessionTags,
    frequency: sc.frequency,
    topPeers: opts.topPeers,
    incomingPending: opts.incomingPending,
    sessionStale: opts.sessionStale,
    seenHistory
  });
  if (verbs.length > 0) applySpinnerVerbs(verbs, sc.mode);
  else clearSpinnerVerbs();
  const { tips, surfacedIds } = buildTipsDetailed(ranked, opts.baseUrl, 8, {
    seenHistory,
    widen: opts.widen
  });
  if (tips.length > 0) applySpinnerTips(tips);
  else clearSpinnerTips();
  if (verbs.length > 0 || tips.length > 0) recordSurface(surfacedIds);
  return { verbs, tips, surfacedIds };
}
export {
  SPINNER_DEFAULTS,
  applySpinnerTips,
  applySpinnerVerbs,
  buildContextVerbs,
  buildIncomingIntroLine,
  buildPeerLine,
  buildSessionStaleLine,
  buildSpinnerPool,
  buildTips,
  buildTipsDetailed,
  clearSpinnerTips,
  clearSpinnerVerbs,
  ctaVerb,
  filterFreshMatches,
  formatVerbs,
  interleaveBySource,
  partitionFreshMatches,
  rankBySessionTags,
  readSpinnerConfig,
  renderRefreshSurface,
  widenFreshCandidates
};
