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
function buildContributeNudgeLine(contributeNudge) {
  const n = contributeNudge && typeof contributeNudge.count === "number" ? contributeNudge.count : 0;
  if (n < 1) return null;
  if (contributeNudge.onRamp === true) {
    return n === 1 ? "\u2726 Build your Proof of Work \u2014 1 credential-building issue matched to your stack \xB7 terminalhire contribute" : `\u2726 Build your Proof of Work \u2014 ${n} credential-building issues matched to your stack \xB7 terminalhire contribute`;
  }
  return n === 1 ? "\u2726 an open-source issue that counts toward your r\xE9sum\xE9 \xB7 terminalhire contribute" : `\u2726 ${n} open-source issues that count toward your r\xE9sum\xE9 \xB7 terminalhire contribute`;
}
function buildSessionStaleLine(sessionStale) {
  return sessionStale === true ? "\u26A0 terminalhire: linked session expired \u2014 run: terminalhire login" : null;
}
function buildUnpushedClaimsLine(unpushedClaims) {
  return unpushedClaims === true ? "\u26A0 new claims not yet on your dashboard \u2014 run: terminalhire claim --push --keep-updated" : null;
}
function buildSpinnerPool(topMatches, max = 6, opts = {}) {
  const {
    sessionTags,
    frequency = "always",
    topPeers,
    incomingPending,
    sessionStale,
    contributeNudge,
    unpushedClaims,
    seenHistory
  } = opts;
  const staleLine = buildSessionStaleLine(sessionStale);
  const withStale = (pool2) => staleLine ? [staleLine, ...pool2] : pool2;
  const introLine = buildIncomingIntroLine(incomingPending);
  const contributeLine = buildContributeNudgeLine(contributeNudge);
  const unpushedLine = buildUnpushedClaimsLine(unpushedClaims);
  const ranked = filterFreshMatches(rankBySessionTags(topMatches, sessionTags), seenHistory);
  if (!Array.isArray(ranked) || ranked.length === 0) {
    if (introLine) return withStale([introLine]);
    if (contributeLine) return withStale([contributeLine]);
    if (unpushedLine) return withStale([unpushedLine]);
    const peerLine = buildPeerLine(topPeers);
    return withStale(peerLine ? [peerLine] : []);
  }
  const headers = buildContextVerbs(ranked, sessionTags);
  const ceiling = Math.min(headers.length, Math.max(1, Number(max) || 6));
  const cap = Math.max(1, verbCountForFrequency(frequency, ceiling));
  const pool = [...headers.slice(0, cap), ctaVerb()];
  if (introLine) pool.push(introLine);
  if (contributeLine) pool.push(contributeLine);
  if (unpushedLine) pool.push(unpushedLine);
  return withStale(pool);
}

// ../../packages/core/src/vocab/graph.data.ts
var VOCAB_NODES = [
  // ── Languages ─────────────────────────────────────────────────────────────
  { id: "javascript", synonyms: ["js"], related: [{ to: "typescript", w: 0.6 }] },
  { id: "typescript", parents: ["javascript"], synonyms: ["ts"] },
  { id: "python", synonyms: ["py"] },
  { id: "go", synonyms: ["golang"] },
  { id: "rust" },
  { id: "java", related: [{ to: "kotlin", w: 0.45 }, { to: "scala", w: 0.4 }] },
  { id: "ruby" },
  { id: "elixir" },
  { id: "scala", related: [{ to: "java", w: 0.4 }] },
  { id: "kotlin", related: [{ to: "java", w: 0.45 }] },
  { id: "swift" },
  { id: "cpp", synonyms: ["c++"] },
  { id: "csharp", synonyms: ["c#"] },
  { id: "php" },
  { id: "haskell" },
  { id: "clojure" },
  { id: "r" },
  { id: "dart" },
  // ── Frontend ──────────────────────────────────────────────────────────────
  {
    id: "react",
    parents: ["javascript"],
    synonyms: ["reactjs"],
    related: [{ to: "nextjs", w: 0.55 }, { to: "vue", w: 0.4 }, { to: "svelte", w: 0.4 }, { to: "solidjs", w: 0.5 }, { to: "angular", w: 0.35 }]
  },
  { id: "nextjs", parents: ["react"], synonyms: ["next", "next.js"], related: [{ to: "remix", w: 0.5 }] },
  { id: "vue", parents: ["javascript"], synonyms: ["vue.js"], related: [{ to: "nuxt", w: 0.6 }] },
  { id: "nuxt", parents: ["vue"], synonyms: ["nuxt.js"] },
  { id: "svelte", parents: ["javascript"], related: [{ to: "sveltekit", w: 0.65 }] },
  { id: "sveltekit", parents: ["svelte"] },
  { id: "angular", parents: ["typescript"], synonyms: ["angular.js", "angularjs"] },
  { id: "solidjs", parents: ["javascript"] },
  { id: "remix", parents: ["react"], synonyms: ["remix.run"] },
  { id: "astro", parents: ["javascript"], related: [{ to: "nextjs", w: 0.4 }] },
  { id: "qwik", parents: ["javascript"] },
  { id: "tailwind", parents: ["css"], synonyms: ["tailwindcss", "tw"] },
  { id: "css" },
  { id: "html" },
  { id: "redux", parents: ["react"] },
  { id: "vite", parents: ["frontend"] },
  { id: "webpack", parents: ["frontend"] },
  { id: "storybook", parents: ["frontend"] },
  // ── Backend frameworks / runtimes ───────────────────────────────────────────
  {
    id: "nodejs",
    parents: ["javascript"],
    synonyms: ["node", "node.js"],
    related: [{ to: "express", w: 0.5 }, { to: "fastify", w: 0.45 }, { to: "nestjs", w: 0.45 }]
  },
  { id: "express", parents: ["nodejs"], synonyms: ["express.js", "expressjs"], related: [{ to: "fastify", w: 0.5 }] },
  { id: "fastify", parents: ["nodejs"] },
  { id: "nestjs", parents: ["nodejs"], synonyms: ["nest", "nest.js"] },
  { id: "hono", parents: ["nodejs"] },
  { id: "deno", parents: ["javascript"], related: [{ to: "nodejs", w: 0.5 }, { to: "bun", w: 0.5 }] },
  { id: "bun", parents: ["javascript"], related: [{ to: "nodejs", w: 0.5 }] },
  { id: "django", parents: ["python"], related: [{ to: "flask", w: 0.5 }, { to: "fastapi", w: 0.45 }] },
  { id: "fastapi", parents: ["python"], related: [{ to: "flask", w: 0.55 }, { to: "django", w: 0.45 }] },
  { id: "flask", parents: ["python"] },
  { id: "rails", parents: ["ruby"], synonyms: ["ruby-on-rails", "ror"] },
  { id: "spring", parents: ["java"], synonyms: ["spring-boot", "springboot"] },
  { id: "actix", parents: ["rust"] },
  { id: "gin", parents: ["go"] },
  { id: "phoenix", parents: ["elixir"] },
  { id: "laravel", parents: ["php"] },
  { id: "dotnet", parents: ["csharp"], synonyms: [".net", "asp.net", "dotnet-core"] },
  // ── Infrastructure & DevOps ─────────────────────────────────────────────────
  { id: "kubernetes", synonyms: ["k8s", "kube"], related: [{ to: "docker", w: 0.5 }, { to: "helm", w: 0.55 }, { to: "terraform", w: 0.4 }, { to: "argocd", w: 0.45 }] },
  { id: "docker", parents: ["devops"], related: [{ to: "kubernetes", w: 0.5 }] },
  { id: "terraform", synonyms: ["tf"], related: [{ to: "pulumi", w: 0.55 }, { to: "ansible", w: 0.4 }, { to: "aws", w: 0.4 }] },
  { id: "pulumi", related: [{ to: "terraform", w: 0.55 }] },
  { id: "ansible" },
  { id: "aws", synonyms: ["amazon-web-services"], related: [{ to: "gcp", w: 0.4 }, { to: "azure", w: 0.4 }] },
  { id: "gcp", synonyms: ["google-cloud", "google-cloud-platform"], related: [{ to: "aws", w: 0.4 }, { to: "azure", w: 0.4 }] },
  { id: "azure", synonyms: ["microsoft-azure"], related: [{ to: "aws", w: 0.4 }] },
  { id: "ci-cd", synonyms: ["cicd", "jenkins", "circleci", "circle-ci", "travis"], related: [{ to: "github-actions", w: 0.6 }, { to: "gitlab-ci", w: 0.6 }] },
  { id: "github-actions", parents: ["ci-cd"], synonyms: ["github-action"] },
  { id: "gitlab-ci", parents: ["ci-cd"], synonyms: ["gitlab"] },
  { id: "linux" },
  { id: "nginx" },
  { id: "prometheus", parents: ["observability"], related: [{ to: "grafana", w: 0.6 }] },
  { id: "grafana", parents: ["observability"] },
  { id: "datadog", parents: ["observability"] },
  { id: "opentelemetry", parents: ["observability"], synonyms: ["otel"] },
  { id: "vercel", related: [{ to: "netlify", w: 0.5 }, { to: "nextjs", w: 0.4 }] },
  { id: "netlify" },
  { id: "fly", synonyms: ["fly.io"], related: [{ to: "railway", w: 0.5 }, { to: "render", w: 0.5 }] },
  { id: "railway", related: [{ to: "render", w: 0.5 }] },
  { id: "render" },
  { id: "cloudflare", synonyms: ["cloudflare-workers"] },
  { id: "helm", parents: ["kubernetes"] },
  { id: "argocd", parents: ["kubernetes"] },
  { id: "serverless", parents: ["devops"] },
  // ── Databases & storage ─────────────────────────────────────────────────────
  { id: "postgresql", synonyms: ["postgres", "pg"], related: [{ to: "mysql", w: 0.45 }, { to: "sqlite", w: 0.4 }] },
  { id: "mysql", related: [{ to: "postgresql", w: 0.45 }] },
  { id: "sqlite" },
  { id: "mongodb", synonyms: ["mongo"] },
  { id: "redis", related: [{ to: "caching", w: 0.5 }] },
  { id: "elasticsearch", synonyms: ["elastic"], related: [{ to: "search", w: 0.55 }] },
  { id: "kafka", synonyms: ["apache-kafka"], related: [{ to: "rabbitmq", w: 0.5 }, { to: "message-queue", w: 0.55 }] },
  { id: "rabbitmq", related: [{ to: "message-queue", w: 0.55 }] },
  { id: "cassandra" },
  { id: "dynamodb", parents: ["aws"] },
  { id: "snowflake", parents: ["data-engineering"], related: [{ to: "clickhouse", w: 0.4 }] },
  { id: "clickhouse", parents: ["data-engineering"], related: [{ to: "duckdb", w: 0.35 }] },
  { id: "duckdb", parents: ["data-engineering"] },
  { id: "supabase", related: [{ to: "postgresql", w: 0.5 }, { to: "neon", w: 0.4 }] },
  { id: "planetscale", related: [{ to: "mysql", w: 0.5 }] },
  { id: "neon", related: [{ to: "postgresql", w: 0.5 }] },
  { id: "turso", related: [{ to: "sqlite", w: 0.5 }] },
  { id: "cockroachdb", related: [{ to: "postgresql", w: 0.45 }] },
  { id: "prisma", parents: ["backend"], synonyms: ["@prisma/client"], related: [{ to: "drizzle", w: 0.5 }, { to: "typeorm", w: 0.45 }, { to: "sequelize", w: 0.4 }] },
  { id: "drizzle", synonyms: ["drizzle-orm"], related: [{ to: "prisma", w: 0.5 }] },
  { id: "sequelize", related: [{ to: "typeorm", w: 0.4 }] },
  { id: "typeorm", related: [{ to: "prisma", w: 0.45 }] },
  { id: "sqlalchemy", parents: ["python"] },
  // ── Data engineering & ML ───────────────────────────────────────────────────
  { id: "data-engineering", synonyms: ["data-eng"], related: [{ to: "spark", w: 0.5 }, { to: "airflow", w: 0.5 }, { to: "dbt", w: 0.45 }] },
  { id: "spark", parents: ["data-engineering"], synonyms: ["apache-spark"] },
  { id: "airflow", parents: ["data-engineering"], synonyms: ["apache-airflow"] },
  { id: "dbt", parents: ["data-engineering"] },
  { id: "ml", synonyms: ["machine-learning"], related: [{ to: "pytorch", w: 0.5 }, { to: "tensorflow", w: 0.5 }, { to: "scikit-learn", w: 0.5 }, { to: "data-engineering", w: 0.4 }] },
  { id: "llm", parents: ["ml"], synonyms: ["llms", "genai", "generative-ai", "gpt"], related: [{ to: "langchain", w: 0.5 }, { to: "rag", w: 0.55 }, { to: "openai", w: 0.45 }, { to: "anthropic", w: 0.45 }] },
  { id: "pytorch", parents: ["ml"], synonyms: ["torch"], related: [{ to: "tensorflow", w: 0.5 }] },
  { id: "tensorflow", parents: ["ml"], synonyms: ["keras", "tf-keras"] },
  { id: "pandas", parents: ["python"], related: [{ to: "numpy", w: 0.6 }, { to: "data-engineering", w: 0.45 }, { to: "spark", w: 0.4 }] },
  { id: "numpy", parents: ["python"] },
  { id: "scikit-learn", parents: ["ml"], synonyms: ["sklearn"] },
  { id: "jupyter", parents: ["python"] },
  { id: "langchain", parents: ["llm"], synonyms: ["llamaindex"] },
  { id: "huggingface", parents: ["ml"], synonyms: ["hugging-face"] },
  { id: "openai", parents: ["llm"] },
  { id: "anthropic", parents: ["llm"], synonyms: ["claude"] },
  { id: "rag", parents: ["llm"], synonyms: ["retrieval-augmented-generation"] },
  { id: "mlops", parents: ["ml"], related: [{ to: "devops", w: 0.4 }] },
  { id: "agents", parents: ["llm"], synonyms: ["agentic", "ai-agents", "multi-agent", "agent-orchestration"], related: [{ to: "rag", w: 0.4 }] },
  { id: "mcp", parents: ["agents"], synonyms: ["model-context-protocol"], related: [{ to: "llm", w: 0.45 }] },
  { id: "inference", parents: ["ml"], synonyms: ["model-inference", "llm-inference", "model-serving"], related: [{ to: "mlops", w: 0.5 }, { to: "llm", w: 0.4 }] },
  { id: "embeddings", parents: ["ml"], synonyms: ["embedding", "vector-embeddings"], related: [{ to: "rag", w: 0.55 }, { to: "llm", w: 0.45 }] },
  { id: "prompt-engineering", parents: ["llm"], synonyms: ["prompting", "prompt"] },
  { id: "fine-tuning", parents: ["ml"], synonyms: ["finetuning", "fine-tune", "rlhf"], related: [{ to: "llm", w: 0.5 }] },
  { id: "computer-vision", parents: ["ml"], synonyms: ["image-recognition", "object-detection"] },
  { id: "recsys", parents: ["ml"], synonyms: ["recommender-systems", "recommendation-systems", "recommendation"] },
  // ── Mobile ──────────────────────────────────────────────────────────────────
  { id: "mobile", related: [{ to: "ios", w: 0.5 }, { to: "android", w: 0.5 }] },
  { id: "ios", parents: ["mobile", "swift"], related: [{ to: "android", w: 0.4 }] },
  { id: "android", parents: ["mobile"], related: [{ to: "kotlin", w: 0.4 }] },
  { id: "swiftui", parents: ["ios", "swift"] },
  { id: "react-native", parents: ["mobile", "react"], synonyms: ["reactnative"], related: [{ to: "flutter", w: 0.4 }, { to: "expo", w: 0.6 }] },
  { id: "flutter", parents: ["mobile", "dart"] },
  { id: "expo", parents: ["react-native"] },
  { id: "kotlin-multiplatform", parents: ["mobile", "kotlin"], synonyms: ["kmp"] },
  // ── Domains / capabilities ──────────────────────────────────────────────────
  { id: "frontend", related: [{ to: "react", w: 0.4 }, { to: "css", w: 0.3 }] },
  { id: "backend", related: [{ to: "api-design", w: 0.4 }, { to: "microservices", w: 0.4 }] },
  { id: "devops", related: [{ to: "kubernetes", w: 0.4 }, { to: "ci-cd", w: 0.4 }, { to: "docker", w: 0.4 }] },
  { id: "authentication", synonyms: ["auth", "jwt", "saml", "passport", "auth0", "clerk", "nextauth"], related: [{ to: "oauth", w: 0.6 }, { to: "security", w: 0.5 }] },
  { id: "oauth", parents: ["authentication"], synonyms: ["oauth2", "oidc"], related: [{ to: "security", w: 0.4 }] },
  { id: "security", related: [{ to: "authentication", w: 0.5 }] },
  { id: "payments", synonyms: ["stripe", "braintree", "paddle", "lemonsqueezy", "@stripe/stripe-js"], related: [{ to: "billing", w: 0.6 }] },
  { id: "billing", synonyms: ["recurly", "chargebee"] },
  { id: "api-design", synonyms: ["rest", "restful", "rest-api"], related: [{ to: "graphql", w: 0.4 }, { to: "grpc", w: 0.4 }, { to: "backend", w: 0.4 }] },
  { id: "graphql", synonyms: ["gql"], related: [{ to: "trpc", w: 0.4 }] },
  { id: "trpc", related: [{ to: "graphql", w: 0.4 }] },
  { id: "grpc", synonyms: ["grpc-web"], related: [{ to: "microservices", w: 0.3 }] },
  { id: "microservices" },
  { id: "websockets", synonyms: ["ws", "socket.io"], related: [{ to: "realtime", w: 0.6 }] },
  { id: "realtime", synonyms: ["real-time"] },
  { id: "message-queue", synonyms: ["mq"] },
  { id: "caching", synonyms: ["cache"] },
  { id: "search", synonyms: ["full-text-search"] },
  { id: "observability", synonyms: ["o11y"], related: [{ to: "monitoring", w: 0.6 }] },
  { id: "monitoring", related: [{ to: "prometheus", w: 0.4 }] },
  { id: "testing", related: [{ to: "unit-testing", w: 0.5 }, { to: "e2e-testing", w: 0.5 }] },
  { id: "unit-testing", parents: ["testing"] },
  { id: "e2e-testing", parents: ["testing"], synonyms: ["e2e", "end-to-end-testing"] },
  { id: "jest", parents: ["testing"], related: [{ to: "vitest", w: 0.6 }, { to: "mocha", w: 0.5 }] },
  { id: "vitest", parents: ["testing"], related: [{ to: "jest", w: 0.6 }] },
  { id: "playwright", parents: ["e2e-testing"], related: [{ to: "cypress", w: 0.6 }] },
  { id: "cypress", parents: ["e2e-testing"] },
  { id: "mocha", parents: ["testing"] },
  { id: "pytest", parents: ["testing", "python"] },
  { id: "accessibility", synonyms: ["a11y"] },
  { id: "seo" },
  { id: "performance", synonyms: ["perf", "web-performance"] }
];

// ../../packages/core/src/vocab/closure.ts
var PARENT_UP = 0.6;
var PARENT_DOWN = 0.35;
var DECAY_FLOOR = 0.25;
function round3(n) {
  return Math.round(n * 1e3) / 1e3;
}
function validateGraph(nodes) {
  const ids = /* @__PURE__ */ new Set();
  for (const n of nodes) {
    if (ids.has(n.id)) throw new Error(`vocab: duplicate id "${n.id}"`);
    ids.add(n.id);
  }
  const seenAlias = /* @__PURE__ */ new Map();
  for (const n of nodes) {
    for (const p of n.parents ?? []) {
      if (p === n.id) throw new Error(`vocab: "${n.id}" lists itself as a parent`);
      if (!ids.has(p)) throw new Error(`vocab: "${n.id}" parent "${p}" is not a defined id`);
    }
    for (const e of n.related ?? []) {
      if (e.to === n.id) throw new Error(`vocab: "${n.id}" relates to itself`);
      if (!ids.has(e.to)) throw new Error(`vocab: "${n.id}" related "${e.to}" is not a defined id`);
      if (!(e.w > 0 && e.w <= 1)) throw new Error(`vocab: "${n.id}"\u2192"${e.to}" weight ${e.w} out of (0,1]`);
    }
    for (const s of n.synonyms ?? []) {
      const alias = s.toLowerCase();
      if (ids.has(alias)) throw new Error(`vocab: synonym "${alias}" collides with a canonical id`);
      const prev = seenAlias.get(alias);
      if (prev && prev !== n.id) throw new Error(`vocab: synonym "${alias}" maps to both "${prev}" and "${n.id}"`);
      seenAlias.set(alias, n.id);
    }
  }
  const visiting = /* @__PURE__ */ new Set();
  const done = /* @__PURE__ */ new Set();
  const parentMap = new Map(nodes.map((n) => [n.id, n.parents ?? []]));
  const walk = (id, path) => {
    if (done.has(id)) return;
    if (visiting.has(id)) throw new Error(`vocab: parent cycle ${[...path, id].join(" \u2192 ")}`);
    visiting.add(id);
    for (const p of parentMap.get(id) ?? []) walk(p, [...path, id]);
    visiting.delete(id);
    done.add(id);
  };
  for (const n of nodes) walk(n.id, []);
}
function buildAdjacency(nodes) {
  const adj = /* @__PURE__ */ new Map();
  const add = (from, to, w) => {
    let m = adj.get(from);
    if (!m) adj.set(from, m = /* @__PURE__ */ new Map());
    if (w > (m.get(to) ?? 0)) m.set(to, w);
  };
  for (const n of nodes) {
    for (const p of n.parents ?? []) {
      add(n.id, p, PARENT_UP);
      add(p, n.id, PARENT_DOWN);
    }
    for (const e of n.related ?? []) {
      add(n.id, e.to, e.w);
      add(e.to, n.id, e.w);
    }
  }
  return adj;
}
function closureFrom(source, adj) {
  const best = /* @__PURE__ */ new Map();
  for (const [t, w] of adj.get(source) ?? []) {
    if (w >= DECAY_FLOOR) best.set(t, { w: round3(w), via: t });
  }
  const settled = /* @__PURE__ */ new Set([source]);
  while (true) {
    let u;
    let uw = 0;
    for (const [t, e] of best) {
      if (!settled.has(t) && e.w > uw) {
        u = t;
        uw = e.w;
      }
    }
    if (!u) break;
    settled.add(u);
    const via = best.get(u).via;
    for (const [t, we] of adj.get(u) ?? []) {
      if (settled.has(t)) continue;
      const cand = round3(uw * we);
      if (cand >= DECAY_FLOOR && cand > (best.get(t)?.w ?? 0)) {
        best.set(t, { w: cand, via });
      }
    }
  }
  best.delete(source);
  return best;
}
function buildGraph(nodes) {
  validateGraph(nodes);
  const ids = new Set(nodes.map((n) => n.id));
  const synonyms = /* @__PURE__ */ new Map();
  for (const n of nodes) {
    for (const s of n.synonyms ?? []) synonyms.set(s.toLowerCase(), n.id);
  }
  const adj = buildAdjacency(nodes);
  const closure = /* @__PURE__ */ new Map();
  for (const n of nodes) closure.set(n.id, closureFrom(n.id, adj));
  return { ids, synonyms, closure };
}

// ../../packages/core/src/vocab/extract.ts
var SOFT_DOMAIN = /* @__PURE__ */ new Set([
  "frontend",
  "backend",
  "devops",
  "security",
  "payments",
  "billing",
  "microservices",
  "caching",
  "search",
  "observability",
  "monitoring",
  "testing",
  "accessibility",
  "seo",
  "performance",
  "realtime",
  "authentication",
  "api-design"
]);
var SYNONYM_ONLY = /* @__PURE__ */ new Set(["performance", "security", "seo"]);
for (const id of SYNONYM_ONLY) {
  if (!SOFT_DOMAIN.has(id)) throw new Error(`extract: SYNONYM_ONLY "${id}" not in SOFT_DOMAIN`);
}

// ../../packages/core/src/vocab/index.ts
var GRAPH = buildGraph(VOCAB_NODES);
var VOCABULARY = [...GRAPH.ids];
var SYNONYMS = Object.fromEntries(GRAPH.synonyms);

// ../../packages/core/src/feeds/bounty-gate.ts
var FARM_REPO_DENYLIST = [
  "SecureBananaLabs/bug-bounty",
  // Meta-farm: a bounty PLATFORM whose own issues are an assignment-gated
  // contributor queue ("please assign me, my chief") — an unsolicited PR won't
  // merge, so it's not a real claimable bounty. Not structurally derivable from
  // any fetched field, so it's a manual entry (also dropped from the allowlist).
  "boundlessfi/boundless"
];
var CURATION_EXCLUDED_REPOS = [
  // Owner call, asked twice: "get rid of that particular project — I hate it as the
  // example." Excluded at the REPO level because that is the ONLY level at which
  // "don't feature this project" is expressible: projectCuration emits any repo with
  // >= 1 winnable issue.
  //
  // To be clear about what this repo is, since it sits next to a farm list: kana-dojo
  // is NOT a farm. Measured live 2026-07-17 — 2,960 stars, active, 113 open issues, of
  // which 58 are genuine substantive bug reports ("年 Onyomi incorrectly displayed as
  // 'れン'", "Unable to install app as PWA"). The other 55 are a bot's templated
  // "[Good First Issue] <emoji> Add new <NOUN> [N] - Beginner-Friendly Open-source
  // Contribution" run, which is what drew our attention — but a content classifier
  // correctly KEEPS all 58 real bugs, so it can never remove the project. Two prior
  // attempts to do this per-issue (PR #221, #260) both shipped and left it live.
  "lingdojo/kana-dojo"
];
var EXCLUDED_LC = new Set(
  [...FARM_REPO_DENYLIST, ...CURATION_EXCLUDED_REPOS].map((r) => r.toLowerCase())
);
var AI_BAN_DENYLIST = [
  // Gentoo Council voted 6-0 (2024-04-14) to ban AI/ML-generated contributions
  // project-wide. https://wiki.gentoo.org/wiki/Project:Council/AI_policy
  "gentoo",
  // NetBSD Commit Guidelines: code generated by an LLM/similar technology is
  // "presumed to be tainted code, and must not be committed without prior
  // written approval by core". https://www.netbsd.org/developers/commit-guidelines.html
  "NetBSD"
  // NOT listed (checked, deliberately excluded): QEMU's blanket AI-contribution
  // ban is IN FLUX as of 2026-05 — a patch replacing it with a disclosure-based
  // policy ("AI-used-for:" tag) was posted to qemu-devel and appears to have
  // developer buy-in, so it is no longer a clean/current ban to key a hard
  // supply-side drop on. https://www.theregister.com/ai-and-ml/2026/05/29/qemu-mulls-relaxing-ai-contribution-ban/
];
var AI_BAN_LC = new Set(AI_BAN_DENYLIST.map((g) => g.toLowerCase()));

// ../../packages/core/src/feeds/contribution-classify.ts
var CONTENT_NOUN_STRONG = String.raw`proverbs?|words?|phrases?|sayings?|translations?|entry|entries|definitions?|terms?|idioms?|synonyms?|antonyms?|acronyms?|abbreviations?|nazonazo`;
var CONTENT_NOUN_BROAD = String.raw`trivia\s+questions?|grammar\s+points?|brain\s?teasers?|trivia|facts?|quotes?|quotations?|quiz(?:zes)?|riddles?|puzzles?|flash\s?cards?|vocab(?:ulary)?|lessons?|kanji`;
var FARM_SEED_NOUN = String.raw`trivia\s+questions?|grammar\s+points?|brain\s?teasers?|proverbs?|sayings?|idioms?|quotes?|quotations?|riddles?|nazonazo`;
var CONTENT_ADD_RE = new RegExp(
  String.raw`\badd(?:ing|s)?\s+(?:\w+\s+){0,4}?(?:${CONTENT_NOUN_STRONG})\b`,
  "i"
);
var NUMBERED_SEED_RE = new RegExp(
  String.raw`\badd(?:ing|s)?\s+(?:\w+\s+){0,4}?(?:${CONTENT_NOUN_STRONG}|${CONTENT_NOUN_BROAD})\s*#?\s*(?!(?:19|20)\d{2}(?!\d))\d{1,5}\s*$`,
  "i"
);
var FARM_SEED_RE = new RegExp(
  String.raw`\badd(?:ing|s)?\s+(?:\w+\s+){0,4}?(?:${FARM_SEED_NOUN})\s*#?\s*(?!(?:19|20)\d{2}(?!\d))\d{1,5}\s*$`,
  "i"
);

// ../../packages/core/src/credential/rigor.ts
var RIGOR = {
  /** `authorAssociation` values that count as a maintainer review. */
  MAINTAINER_ASSOCIATIONS: ["OWNER", "MEMBER", "COLLABORATOR"]
};
var MAINTAINER_SET = new Set(
  RIGOR.MAINTAINER_ASSOCIATIONS.map((a) => a.toUpperCase())
);

// ../../packages/core/src/github.ts
var RESUME_DECAY_HALF_LIFE_MS = 30 * 24 * 60 * 60 * 1e3;

// ../../packages/core/src/winnability.ts
var WINNABILITY_NORM = {
  /** ~500 new stars in a build interval is treated as "maxed" momentum. */
  starVelocity: 500,
  /** ~10 HN mentions is treated as "maxed" social. */
  socialMentions: 10,
  /** log(stars) ceiling — ~100k-star repos saturate the absolute-traction floor. */
  starsLog: Math.log(1e5)
};

// ../../packages/core/src/feeds/projectCuration.ts
var CURATION_WEIGHTS = {
  winnableCount: 0.45,
  vocabRelevance: 0.05,
  skillDensity: 0.15,
  freshness: 0.15,
  mergeVelocity: 0.15,
  popularity: 0.05
};
{
  const _sum = Object.values(CURATION_WEIGHTS).reduce((a, b) => a + b, 0);
  if (Math.abs(_sum - 1) > 1e-9) {
    throw new Error(`CURATION_WEIGHTS must sum to 1.0, got ${_sum}`);
  }
}
var CURATION_NORM = {
  /** ~60 commits in the last ~30d is treated as "maxed" commit-cadence freshness. */
  commitCadence: 60,
  /** An issue posted within this many days is maximally fresh. */
  freshnessFullDays: 30,
  /** …and older than this contributes zero recency (linear decay between). */
  freshnessZeroDays: 180,
  /** log(stars) ceiling for popularity — reuses the winnability absolute-traction
   *  ceiling so "popular" means the same thing across both scorers. */
  starsLog: WINNABILITY_NORM.starsLog,
  /** Distinct contributors treated as "maxed" for the popularity tiebreaker. */
  contributors: 500
};

// ../../packages/core/src/feeds/index.ts
var GREENHOUSE_SLUGS_BY_TIER = {
  bigco: [
    "stripe",
    "anthropic",
    "figma",
    "discord",
    "brex",
    "mercury",
    "plaid",
    "gusto",
    "scale",
    "databricks",
    "coinbase",
    "robinhood",
    "doordash",
    "airbnb",
    "dropbox",
    "datadog",
    "cloudflare",
    "reddit",
    "lyft",
    "instacart"
  ],
  scaleup: [
    "samsara",
    "verkada",
    "affirm",
    "gitlab",
    "asana",
    "flexport",
    "faire",
    "twitch",
    "airtable",
    "retool"
  ],
  startup: [
    "watershed"
  ]
};
var ASHBY_SLUGS_BY_TIER = {
  bigco: [
    "openai"
  ],
  scaleup: [
    "harvey",
    "elevenlabs",
    "notion",
    "sierra",
    "cohere",
    "ramp",
    "vanta",
    "decagon",
    "cursor",
    "replit",
    "perplexity",
    "baseten",
    "drata",
    "writer",
    "temporal",
    "supabase"
  ],
  startup: [
    "suno",
    "attio",
    "modal",
    "workos",
    "linear",
    "render",
    "warp",
    "plain",
    "posthog",
    "pylon",
    "resend",
    "langfuse",
    "railway",
    "mintlify",
    "neon",
    "browserbase",
    "knock",
    "speakeasy",
    "stytch",
    "runway",
    "doppler",
    "inngest",
    "hightouch",
    "zed"
  ]
};
var LEVER_SLUGS_BY_TIER = {
  bigco: [
    "palantir",
    "spotify"
  ],
  scaleup: [
    "mistral",
    "ro",
    "secureframe"
  ],
  startup: [
    "anyscale"
  ]
};
function flattenTiers(t) {
  return [.../* @__PURE__ */ new Set([...t.bigco, ...t.scaleup, ...t.startup])];
}
var DEFAULT_GREENHOUSE_SLUGS = flattenTiers(GREENHOUSE_SLUGS_BY_TIER);
var DEFAULT_ASHBY_SLUGS = flattenTiers(ASHBY_SLUGS_BY_TIER);
var DEFAULT_LEVER_SLUGS = flattenTiers(LEVER_SLUGS_BY_TIER);
var BIGCO_SLUGS_BY_SOURCE = {
  greenhouse: new Set(GREENHOUSE_SLUGS_BY_TIER.bigco.map((s) => s.toLowerCase())),
  ashby: new Set(ASHBY_SLUGS_BY_TIER.bigco.map((s) => s.toLowerCase())),
  lever: new Set(LEVER_SLUGS_BY_TIER.bigco.map((s) => s.toLowerCase()))
};

// ../../packages/core/src/feeds/contributions.ts
var CONTRIB_LABEL_QUERIES = [
  'label:"good first issue" type:issue state:open',
  'label:"good-first-issue" type:issue state:open',
  'label:"help wanted" type:issue state:open',
  'label:"help-wanted" type:issue state:open',
  'label:"up-for-grabs" type:issue state:open'
];
var CONTRIB_LANGUAGE_QUERIES = [
  ...["rust", "go", "python", "c++", "ruby"].map(
    (lang) => `label:"help wanted" language:${lang} type:issue state:open`
  ),
  ...["rust", "go"].map(
    (lang) => `label:"good first issue" language:${lang} type:issue state:open`
  )
];
var CONTRIB_SEARCH_QUERIES = [...CONTRIB_LABEL_QUERIES, ...CONTRIB_LANGUAGE_QUERIES];

// ../../packages/core/src/partners.ts
import { readFileSync as readFileSync3 } from "fs";
import { join as join4 } from "path";
import { fileURLToPath } from "url";
var EXAMPLE_BUYER = {
  id: "northstar",
  legalName: "Northstar Talent Partners",
  matchCriteria: { roleTypes: ["full_time"] }
};
var BUYER_REGISTRY = {
  [EXAMPLE_BUYER.id]: EXAMPLE_BUYER
};

// ../../packages/core/src/intro.ts
var INTRO_ALLOWED_FIELDS = [
  "requesterLogin",
  "requesterDisplayName",
  "requesterContact",
  "note",
  "targetLogin"
];
var INTRO_ALLOWED_SET = new Set(INTRO_ALLOWED_FIELDS);
var INTRO_PENDING_TTL_MS = 30 * 24 * 60 * 60 * 1e3;
var INTRO_ACCEPTED_TTL_MS = 365 * 24 * 60 * 60 * 1e3;

// ../../packages/core/src/chatCrypto.ts
import { hkdfSync, createHash, randomBytes } from "crypto";
var KDF_INFO = Buffer.from("terminalhire-chat-v1");

// ../../packages/core/src/short-token.ts
import { createHash as createHash2 } from "crypto";
function opportunityShortToken(id) {
  return createHash2("sha256").update(id, "utf8").digest("base64url").slice(0, 8);
}
var contributeShortToken = opportunityShortToken;

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
        const repoFull = m.repo || companyRaw;
        const slashIdx = repoFull.indexOf("/");
        const repoName = slashIdx >= 0 ? repoFull.slice(slashIdx + 1) : repoFull;
        const num = m.issueNumber != null ? ` #${m.issueNumber}` : "";
        const shortUrl = `${base}/c/${contributeShortToken(String(m.id))}`;
        const fit = m.interest ? m.interest : `${pct}%`;
        out.push(`\u2197 contribute \xB7 ${repoName}${num} \xB7 counts on your r\xE9sum\xE9 \xB7 ${fit} \u2014 ${shortUrl}`);
      } else {
        const fit = m.interest ? m.interest : `${pct}%`;
        out.push(`\u2197 ${title} @ ${company} \xB7 ${fit} \u2014 ${url}`);
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
    contributeNudge: opts.contributeNudge,
    unpushedClaims: opts.unpushedClaims,
    seenHistory
  });
  if (verbs.length > 0) applySpinnerVerbs(verbs, sc.mode);
  else clearSpinnerVerbs();
  const { tips, surfacedIds } = buildTipsDetailed(ranked, opts.baseUrl, 8, {
    seenHistory,
    widen: opts.widen,
    clickCatcher: opts.clickCatcher
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
  buildContributeNudgeLine,
  buildIncomingIntroLine,
  buildPeerLine,
  buildSessionStaleLine,
  buildSpinnerPool,
  buildTips,
  buildTipsDetailed,
  buildUnpushedClaimsLine,
  clearSpinnerTips,
  clearSpinnerVerbs,
  ctaVerb,
  filterFreshMatches,
  interleaveBySource,
  partitionFreshMatches,
  rankBySessionTags,
  readSpinnerConfig,
  renderRefreshSurface,
  widenFreshCandidates
};
