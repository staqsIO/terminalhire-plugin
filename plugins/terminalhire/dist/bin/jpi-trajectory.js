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

// ../../packages/core/src/episodes/node-model.ts
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function asString(value, fallback = "") {
  return typeof value === "string" ? value : fallback;
}
function asStringOrNull(value) {
  return typeof value === "string" ? value : null;
}
function asBool(value) {
  return value === true;
}
function parseBlock(raw) {
  if (!isRecord(raw)) {
    return { type: "unknown", rawType: typeof raw };
  }
  const t = raw.type;
  if (t === "text") {
    return { type: "text", text: asString(raw.text) };
  }
  if (t === "tool_use") {
    return { type: "tool_use", id: asString(raw.id), name: asString(raw.name), input: raw.input };
  }
  if (t === "tool_result") {
    return {
      type: "tool_result",
      toolUseId: asString(raw.tool_use_id),
      content: raw.content,
      isError: asBool(raw.is_error)
    };
  }
  return { type: "unknown", rawType: typeof t === "string" ? t : String(t) };
}
function parseContent(content) {
  if (typeof content === "string") {
    return content.length > 0 ? [{ type: "text", text: content }] : [];
  }
  if (Array.isArray(content)) {
    return content.map(parseBlock);
  }
  return [];
}
function toNode(raw, opts = {}) {
  if (!isRecord(raw)) {
    if (opts.strict) {
      throw new Error(`toNode: node is not an object (got ${typeof raw})`);
    }
    return makeUnknown(emptyBase(), typeof raw);
  }
  const message = isRecord(raw.message) ? raw.message : void 0;
  const content = parseContent(message?.content);
  const base = {
    uuid: asString(raw.uuid),
    parentUuid: asStringOrNull(raw.parentUuid),
    sessionId: asString(raw.sessionId),
    cwd: asString(raw.cwd),
    gitBranch: asString(raw.gitBranch),
    timestamp: asString(raw.timestamp),
    isSidechain: asBool(raw.isSidechain),
    userType: asString(raw.userType),
    role: asString(message?.role),
    content,
    text: content.reduce((acc, b) => b.type === "text" ? [...acc, b.text] : acc, []).join("\n")
  };
  const type = raw.type;
  if (type === "summary" || asBool(raw.isCompactSummary) || isRecord(raw.compactMetadata)) {
    return { ...base, kind: "summary" /* Summary */, toolName: null, toolUseId: null, isError: false, rawType: asString(type, "summary") };
  }
  if (type === "system") {
    return { ...base, kind: "system" /* System */, toolName: null, toolUseId: null, isError: false, rawType: "system" };
  }
  if (type === "user") {
    const tr = content.find((b) => b.type === "tool_result");
    if (tr) {
      return { ...base, kind: "tool_result" /* ToolResult */, toolName: null, toolUseId: tr.toolUseId, isError: tr.isError, rawType: "user" };
    }
    return { ...base, kind: "user" /* User */, toolName: null, toolUseId: null, isError: false, rawType: "user" };
  }
  if (type === "assistant") {
    const tu = content.find((b) => b.type === "tool_use");
    if (tu) {
      return { ...base, kind: "tool_use" /* ToolUse */, toolName: tu.name, toolUseId: tu.id, isError: false, rawType: "assistant" };
    }
    return { ...base, kind: "assistant" /* Assistant */, toolName: null, toolUseId: null, isError: false, rawType: "assistant" };
  }
  const rawType = typeof type === "string" ? type : String(type);
  if (opts.strict) {
    throw new Error(`toNode: unrecognized node kind: ${rawType}`);
  }
  return makeUnknown(base, rawType);
}
function makeUnknown(base, rawType) {
  return { ...base, kind: "unknown" /* Unknown */, toolName: null, toolUseId: null, isError: false, rawType };
}
function emptyBase() {
  return {
    uuid: "",
    parentUuid: null,
    sessionId: "",
    cwd: "",
    gitBranch: "",
    timestamp: "",
    isSidechain: false,
    userType: "",
    role: "",
    content: [],
    text: ""
  };
}
var init_node_model = __esm({
  "../../packages/core/src/episodes/node-model.ts"() {
    "use strict";
  }
});

// ../../packages/core/src/episodes/parser.ts
function parseTranscript(text, opts = {}) {
  const nodes = [];
  const unknownKinds = /* @__PURE__ */ new Set();
  let malformedCount = 0;
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed.length === 0) {
      continue;
    }
    let raw;
    try {
      raw = JSON.parse(trimmed);
    } catch {
      malformedCount++;
      continue;
    }
    const node = toNode(raw, { strict: opts.strict });
    if (node.kind === "unknown" /* Unknown */) {
      unknownKinds.add(node.rawType);
    }
    nodes.push(node);
  }
  return { nodes, malformedCount, unknownKinds: [...unknownKinds] };
}
var init_parser = __esm({
  "../../packages/core/src/episodes/parser.ts"() {
    "use strict";
    init_node_model();
  }
});

// ../../packages/core/src/episodes/episode.ts
var init_episode = __esm({
  "../../packages/core/src/episodes/episode.ts"() {
    "use strict";
  }
});

// ../../packages/core/src/episodes/reconstructor.ts
function sidechainRatio(nodes) {
  if (nodes.length === 0) {
    return 0;
  }
  const n = nodes.reduce((acc, node) => node.isSidechain ? acc + 1 : acc, 0);
  return n / nodes.length;
}
function fileSessionId(nodes) {
  return nodes.length > 0 ? nodes[0].sessionId : "";
}
function byTimestamp(a, b) {
  return a.timestamp < b.timestamp ? -1 : a.timestamp > b.timestamp ? 1 : 0;
}
function isGenuineUserTurn(node) {
  return node.kind === "user" /* User */ && !node.isSidechain;
}
function boundMainSession(sessionId, nodes) {
  const ordered = [...nodes].sort(byTimestamp);
  const episodes = [];
  const leading = [];
  let current = null;
  for (const node of ordered) {
    if (isGenuineUserTurn(node)) {
      current = {
        sessionId,
        rootUuid: node.uuid,
        mainNodes: [...leading, node],
        sidechainNodes: [],
        joinedSidechainPaths: []
      };
      leading.length = 0;
      episodes.push(current);
    } else if (current) {
      current.mainNodes.push(node);
    } else {
      leading.push(node);
    }
  }
  if (leading.length > 0) {
    if (episodes.length > 0) {
      episodes[0].mainNodes.unshift(...leading);
    } else {
      episodes.push({
        sessionId,
        rootUuid: leading[0].uuid,
        mainNodes: [...leading],
        sidechainNodes: [],
        joinedSidechainPaths: []
      });
    }
  }
  return episodes;
}
function isCompaction(node) {
  return node.kind === "summary" /* Summary */;
}
function deriveLifecycle(mainNodes) {
  const meaningful = mainNodes.filter((n) => !isCompaction(n)).sort(byTimestamp);
  const hasWork = meaningful.some((n) => n.kind !== "user" /* User */);
  if (!hasWork) {
    return "open";
  }
  const last = meaningful[meaningful.length - 1];
  if (last.kind === "tool_result" /* ToolResult */ && last.isError) {
    return "abandoned";
  }
  if (last.kind === "assistant" /* Assistant */) {
    return "resolved";
  }
  return "updated";
}
function findAgentDispatchEpisodes(episodes) {
  const out = [];
  for (const ep of episodes) {
    for (const node of ep.mainNodes) {
      if (node.kind === "tool_use" /* ToolUse */ && node.toolName === AGENT_TOOL) {
        out.push({ episode: ep, ts: node.timestamp });
      }
    }
  }
  return out.sort((a, b) => a.ts < b.ts ? -1 : a.ts > b.ts ? 1 : 0);
}
function episodeContainingTs(episodes, ts) {
  let chosen = null;
  for (const ep of episodes) {
    const sorted = [...ep.mainNodes].sort(byTimestamp);
    const start = sorted[0]?.timestamp ?? "";
    const end = sorted[sorted.length - 1]?.timestamp ?? "";
    if (ts >= start && ts <= end) {
      return ep;
    }
    if (ts >= start) {
      chosen = ep;
    }
  }
  return chosen ?? (episodes.length > 0 ? episodes[episodes.length - 1] : null);
}
function finalize(build) {
  const mainSorted = [...build.mainNodes].sort(byTimestamp);
  const mainNodeUuids = mainSorted.map((n) => n.uuid);
  const sidechainNodeUuids = [...build.sidechainNodes].sort(byTimestamp).map((n) => n.uuid);
  const compactedNodeUuids = mainSorted.filter(isCompaction).map((n) => n.uuid);
  const start = mainSorted[0]?.timestamp ?? "";
  const end = mainSorted[mainSorted.length - 1]?.timestamp ?? "";
  return {
    id: build.rootUuid,
    sessionId: build.sessionId,
    rootUuid: build.rootUuid,
    lifecycle: deriveLifecycle(build.mainNodes),
    mainNodeUuids,
    sidechainNodeUuids,
    nodeUuids: [...mainNodeUuids, ...sidechainNodeUuids],
    joinedSidechainPaths: [...build.joinedSidechainPaths],
    compacted: compactedNodeUuids.length > 0,
    compactedNodeUuids,
    startTimestamp: start,
    endTimestamp: end
  };
}
function reconstruct(files, opts = {}) {
  const join2 = opts.joinSidechains !== false;
  const mains = [];
  const sidechains = [];
  for (const file of files) {
    const sessionId = fileSessionId(file.nodes);
    if (sidechainRatio(file.nodes) >= SIDECHAIN_FILE_THRESHOLD) {
      const firstTs = [...file.nodes].sort(byTimestamp)[0]?.timestamp ?? "";
      sidechains.push({ path: file.path, sessionId, nodes: file.nodes, firstTs });
    } else {
      mains.push(file);
    }
  }
  const mainNodesBySession = /* @__PURE__ */ new Map();
  for (const file of mains) {
    const sessionId = fileSessionId(file.nodes);
    const acc = mainNodesBySession.get(sessionId) ?? [];
    acc.push(...file.nodes);
    mainNodesBySession.set(sessionId, acc);
  }
  const episodesBySession = /* @__PURE__ */ new Map();
  for (const [sessionId, nodes] of mainNodesBySession) {
    episodesBySession.set(sessionId, boundMainSession(sessionId, nodes));
  }
  const orphanedSidechainPaths = [];
  const joinedPaths = /* @__PURE__ */ new Set();
  if (join2) {
    const sidechainsBySession = /* @__PURE__ */ new Map();
    for (const sc of sidechains) {
      const acc = sidechainsBySession.get(sc.sessionId) ?? [];
      acc.push(sc);
      sidechainsBySession.set(sc.sessionId, acc);
    }
    for (const [sessionId, group] of sidechainsBySession) {
      const parentEpisodes = episodesBySession.get(sessionId);
      if (!parentEpisodes || parentEpisodes.length === 0) {
        for (const sc of group) {
          orphanedSidechainPaths.push(sc.path);
        }
        continue;
      }
      const dispatches = findAgentDispatchEpisodes(parentEpisodes);
      const orderedScs = [...group].sort((a, b) => a.firstTs < b.firstTs ? -1 : a.firstTs > b.firstTs ? 1 : 0);
      orderedScs.forEach((sc, i) => {
        let target = null;
        if (dispatches.length > 0) {
          target = dispatches[Math.min(i, dispatches.length - 1)].episode;
        } else {
          target = episodeContainingTs(parentEpisodes, sc.firstTs);
        }
        if (target) {
          target.sidechainNodes.push(...sc.nodes);
          target.joinedSidechainPaths.push(sc.path);
          joinedPaths.add(sc.path);
        } else {
          orphanedSidechainPaths.push(sc.path);
        }
      });
    }
  } else {
    for (const sc of sidechains) {
      orphanedSidechainPaths.push(sc.path);
    }
  }
  const episodes = [];
  const compactedNodeUuids = [];
  for (const builds of episodesBySession.values()) {
    for (const build of builds) {
      const ep = finalize(build);
      episodes.push(ep);
      compactedNodeUuids.push(...ep.compactedNodeUuids);
    }
  }
  episodes.sort(
    (a, b) => a.startTimestamp < b.startTimestamp ? -1 : a.startTimestamp > b.startTimestamp ? 1 : 0
  );
  const classification = [
    ...mains.map((f) => ({
      path: f.path,
      sessionId: fileSessionId(f.nodes),
      role: "main",
      nodeCount: f.nodes.length,
      joined: false
    })),
    ...sidechains.map((sc) => ({
      path: sc.path,
      sessionId: sc.sessionId,
      role: "sidechain",
      nodeCount: sc.nodes.length,
      joined: joinedPaths.has(sc.path)
    }))
  ];
  return {
    episodes,
    files: classification,
    orphanedSidechainPaths,
    compactedNodeUuids
  };
}
var AGENT_TOOL, SIDECHAIN_FILE_THRESHOLD;
var init_reconstructor = __esm({
  "../../packages/core/src/episodes/reconstructor.ts"() {
    "use strict";
    init_node_model();
    AGENT_TOOL = "Agent";
    SIDECHAIN_FILE_THRESHOLD = 0.5;
  }
});

// ../../packages/core/src/episodes/coverage.ts
function pct(part, whole) {
  return whole === 0 ? 0 : part / whole * 100;
}
function computeCoverage(files, result) {
  const totalNodes = files.reduce((acc, f) => acc + f.nodes.length, 0);
  const nodeCountByPath = /* @__PURE__ */ new Map();
  for (const f of files) {
    nodeCountByPath.set(f.path, f.nodes.length);
  }
  const orphanedNodes = result.orphanedSidechainPaths.reduce(
    (acc, path) => acc + (nodeCountByPath.get(path) ?? 0),
    0
  );
  const attributedNodes = totalNodes - orphanedNodes;
  const compactedNodes = result.compactedNodeUuids.length;
  return {
    totalNodes,
    attributedNodes,
    orphanedNodes,
    compactedNodes,
    attributedPct: pct(attributedNodes, totalNodes),
    orphanedPct: pct(orphanedNodes, totalNodes),
    compactedPct: pct(compactedNodes, totalNodes)
  };
}
var init_coverage = __esm({
  "../../packages/core/src/episodes/coverage.ts"() {
    "use strict";
  }
});

// ../../packages/core/src/episodes/schema.ts
var SCHEMA_VERSION;
var init_schema = __esm({
  "../../packages/core/src/episodes/schema.ts"() {
    "use strict";
    SCHEMA_VERSION = 1;
  }
});

// ../../packages/core/src/episodes/doors.ts
function recruiterMetric(value) {
  return { value };
}
function inwardMetric(value) {
  return { value };
}
function metricValue(metric) {
  return metric.value;
}
function declassify(metrics, coveragePct = 0) {
  const velocity = metrics.skillAdoptionVelocity.value;
  const drift = metrics.distributionDrift.value;
  const recency = metrics.recencySplit.value;
  return {
    schemaVersion: SCHEMA_VERSION,
    headline: {
      distinctSignalCount: velocity.distinctSignalCount,
      recentAdoptionCount: velocity.recentAdoptionCount,
      velocityPerWeek: velocity.velocityPerWeek,
      rising: drift.rising.map((entry) => ({ signal: entry.signal, delta: entry.delta })),
      falling: drift.falling.map((entry) => ({ signal: entry.signal, delta: entry.delta }))
    },
    liveStack: [...recency.live],
    dormantStack: [...recency.dormant],
    coveragePct
  };
}
function buildExport(metrics, coveragePct = 0) {
  return declassify(metrics, coveragePct);
}
var init_doors = __esm({
  "../../packages/core/src/episodes/doors.ts"() {
    "use strict";
    init_schema();
  }
});

// ../../packages/core/src/episodes/events.ts
var init_events = __esm({
  "../../packages/core/src/episodes/events.ts"() {
    "use strict";
    init_schema();
  }
});

// ../../packages/core/src/episodes/derivers/signals.ts
function normalizeToolName(name) {
  if (!name.toLowerCase().startsWith("mcp__")) {
    return name;
  }
  const rest = name.slice("mcp__".length);
  const sep = rest.indexOf("__");
  if (sep <= 0) {
    return "mcp:custom";
  }
  const server = rest.slice(0, sep).toLowerCase();
  const leaf = rest.slice(sep + 2);
  if (leaf.length === 0 || !PUBLIC_MCP_SERVERS.has(server)) {
    return "mcp:custom";
  }
  return `mcp:${leaf}`;
}
function isRecord2(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function fileExtLang(input) {
  if (!isRecord2(input)) {
    return null;
  }
  const filePath = input.file_path;
  if (typeof filePath !== "string") {
    return null;
  }
  const dot = filePath.lastIndexOf(".");
  if (dot < 0 || dot === filePath.length - 1) {
    return null;
  }
  const ext = filePath.slice(dot + 1).toLowerCase();
  return EXT_LANG[ext] ?? null;
}
function toolUseInput(node) {
  const block = node.content.find((b) => b.type === "tool_use");
  return block?.input;
}
function compareSignal(a, b) {
  if (a.ts !== b.ts) {
    return a.ts < b.ts ? -1 : 1;
  }
  if (a.signal !== b.signal) {
    return a.signal < b.signal ? -1 : 1;
  }
  return 0;
}
function extractToolSignals(nodes) {
  const out = [];
  for (const node of nodes) {
    if (node.kind !== "tool_use" /* ToolUse */ || node.toolName === null) {
      continue;
    }
    out.push({ signal: `tool:${normalizeToolName(node.toolName)}`, ts: node.timestamp });
    const lang = fileExtLang(toolUseInput(node));
    if (lang !== null) {
      out.push({ signal: `lang:${lang}`, ts: node.timestamp });
    }
  }
  out.sort(compareSignal);
  return out;
}
var EXT_LANG, PUBLIC_MCP_SERVERS;
var init_signals = __esm({
  "../../packages/core/src/episodes/derivers/signals.ts"() {
    "use strict";
    init_node_model();
    EXT_LANG = {
      ts: "ts",
      tsx: "ts",
      js: "js",
      jsx: "js",
      mjs: "js",
      cjs: "js",
      py: "py",
      rs: "rs",
      go: "go",
      rb: "rb",
      java: "java",
      kt: "kt",
      sql: "sql",
      md: "md"
    };
    PUBLIC_MCP_SERVERS = /* @__PURE__ */ new Set([
      // Anthropic first-party connectors (claude.ai)
      "claude_ai_linear",
      "claude_ai_gmail",
      "claude_ai_google_calendar",
      "claude_ai_google_drive",
      "claude_ai_figma",
      "claude_ai_vercel",
      "claude_ai_ideabrowser",
      // Common public Claude Code plugins
      "plugin_playwright_playwright",
      "plugin_context-mode_context-mode",
      "plugin_vercel_vercel",
      "playwright",
      "ideabrowser",
      "blender",
      "figma",
      "n8n-knowledge",
      "pencil"
    ]);
  }
});

// ../../packages/core/src/episodes/derivers/skill-adoption-velocity.ts
function deriveSkillAdoptionVelocity(nodes, opts = {}) {
  const signals = extractToolSignals(nodes);
  const firstSeen = /* @__PURE__ */ new Map();
  for (const s of signals) {
    const cur = firstSeen.get(s.signal);
    if (cur === void 0 || s.ts < cur) {
      firstSeen.set(s.signal, s.ts);
    }
  }
  const firstAppearances = [...firstSeen.entries()].map(([signal, ts]) => ({ signal, ts })).sort((a, b) => a.ts !== b.ts ? a.ts < b.ts ? -1 : 1 : a.signal < b.signal ? -1 : 1);
  const minTs = signals.length > 0 ? signals[0].ts : "";
  const maxTs = signals.length > 0 ? signals[signals.length - 1].ts : "";
  const now = opts.now ?? maxTs;
  const windowDays = opts.recentWindowDays ?? RECENT_WINDOW_DAYS;
  const spanDays = minTs !== "" && maxTs !== "" ? (Date.parse(maxTs) - Date.parse(minTs)) / DAY_MS : 0;
  const nowMs = now !== "" ? Date.parse(now) : 0;
  const recentAdoptionCount = now === "" ? 0 : firstAppearances.filter((f) => nowMs - Date.parse(f.ts) <= windowDays * DAY_MS).length;
  const spanWeeks = spanDays / 7;
  const velocityPerWeek = spanWeeks > 0 ? firstSeen.size / spanWeeks : firstSeen.size;
  return recruiterMetric({
    distinctSignalCount: firstSeen.size,
    firstAppearances,
    recentAdoptionCount,
    spanDays,
    velocityPerWeek
  });
}
var DAY_MS, RECENT_WINDOW_DAYS;
var init_skill_adoption_velocity = __esm({
  "../../packages/core/src/episodes/derivers/skill-adoption-velocity.ts"() {
    "use strict";
    init_doors();
    init_signals();
    DAY_MS = 864e5;
    RECENT_WINDOW_DAYS = 90;
  }
});

// ../../packages/core/src/episodes/derivers/distribution-drift.ts
function shareMap(signals) {
  const counts = /* @__PURE__ */ new Map();
  for (const s of signals) {
    counts.set(s.signal, (counts.get(s.signal) ?? 0) + 1);
  }
  const total = signals.length > 0 ? signals.length : 1;
  const shares = /* @__PURE__ */ new Map();
  for (const [signal, count] of counts) {
    shares.set(signal, count / total);
  }
  return shares;
}
function deriveDistributionDrift(nodes) {
  const signals = extractToolSignals(nodes);
  const mid = Math.floor(signals.length / 2);
  const early = signals.slice(0, mid);
  const late = signals.slice(mid);
  const earlyShares = shareMap(early);
  const lateShares = shareMap(late);
  const all = /* @__PURE__ */ new Set([...earlyShares.keys(), ...lateShares.keys()]);
  const entries = [...all].map((signal) => {
    const earlyShare = earlyShares.get(signal) ?? 0;
    const lateShare = lateShares.get(signal) ?? 0;
    return { signal, earlyShare, lateShare, delta: lateShare - earlyShare };
  });
  const rising = entries.filter((e) => e.delta > 0).sort((a, b) => b.delta !== a.delta ? b.delta - a.delta : a.signal < b.signal ? -1 : 1);
  const falling = entries.filter((e) => e.delta < 0).sort((a, b) => a.delta !== b.delta ? a.delta - b.delta : a.signal < b.signal ? -1 : 1);
  return recruiterMetric({ rising, falling });
}
var init_distribution_drift = __esm({
  "../../packages/core/src/episodes/derivers/distribution-drift.ts"() {
    "use strict";
    init_doors();
    init_signals();
  }
});

// ../../packages/core/src/episodes/derivers/recency-split.ts
function deriveRecencySplit(nodes, opts = {}) {
  const signals = extractToolSignals(nodes);
  const lastSeen = /* @__PURE__ */ new Map();
  for (const s of signals) {
    const cur = lastSeen.get(s.signal);
    if (cur === void 0 || s.ts > cur) {
      lastSeen.set(s.signal, s.ts);
    }
  }
  const maxTs = signals.length > 0 ? signals[signals.length - 1].ts : "";
  const now = opts.now ?? maxTs;
  const thresholdDays = opts.thresholdDays ?? DORMANT_THRESHOLD_DAYS;
  const nowMs = now !== "" ? Date.parse(now) : 0;
  const live = [];
  const dormant = [];
  for (const [signal, ts] of [...lastSeen.entries()].sort((a, b) => a[0] < b[0] ? -1 : 1)) {
    const ageDays = now !== "" ? (nowMs - Date.parse(ts)) / DAY_MS2 : 0;
    if (ageDays <= thresholdDays) {
      live.push(signal);
    } else {
      dormant.push(signal);
    }
  }
  return recruiterMetric({ now, thresholdDays, live, dormant });
}
var DAY_MS2, DORMANT_THRESHOLD_DAYS;
var init_recency_split = __esm({
  "../../packages/core/src/episodes/derivers/recency-split.ts"() {
    "use strict";
    init_doors();
    init_signals();
    DAY_MS2 = 864e5;
    DORMANT_THRESHOLD_DAYS = 90;
  }
});

// ../../packages/core/src/episodes/derivers/rework-density.ts
function isRecord3(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function filePathOf(node) {
  const block = node.content.find((b) => b.type === "tool_use");
  const input = block?.input;
  if (isRecord3(input) && typeof input.file_path === "string") {
    return input.file_path;
  }
  return null;
}
function deriveReworkDensity(episodes, nodesByUuid) {
  let totalEdits = 0;
  let reworkEdits = 0;
  let spansConsidered = 0;
  let spansSkipped = 0;
  for (const episode of episodes) {
    if (episode.compacted) {
      spansSkipped++;
      continue;
    }
    spansConsidered++;
    const seen = /* @__PURE__ */ new Set();
    for (const uuid of episode.mainNodeUuids) {
      const node = nodesByUuid.get(uuid);
      if (node === void 0 || node.kind !== "tool_use" /* ToolUse */ || node.toolName === null) {
        continue;
      }
      if (!EDIT_TOOLS.has(node.toolName)) {
        continue;
      }
      const filePath = filePathOf(node);
      if (filePath === null) {
        continue;
      }
      totalEdits++;
      if (seen.has(filePath)) {
        reworkEdits++;
      } else {
        seen.add(filePath);
      }
    }
  }
  const reworkRatio = totalEdits > 0 ? reworkEdits / totalEdits : 0;
  return inwardMetric({ totalEdits, reworkEdits, reworkRatio, spansConsidered, spansSkipped });
}
var EDIT_TOOLS;
var init_rework_density = __esm({
  "../../packages/core/src/episodes/derivers/rework-density.ts"() {
    "use strict";
    init_node_model();
    init_doors();
    EDIT_TOOLS = /* @__PURE__ */ new Set(["Edit", "Write", "NotebookEdit"]);
  }
});

// ../../packages/core/src/episodes/derivers/recovery-depth.ts
function deriveRecoveryDepth(episodes, nodesByUuid) {
  let maxConsecutiveErrors = 0;
  let totalDepth = 0;
  let recoveryChains = 0;
  let spansConsidered = 0;
  let spansSkipped = 0;
  for (const episode of episodes) {
    if (episode.compacted) {
      spansSkipped++;
      continue;
    }
    spansConsidered++;
    let run2 = 0;
    const closeChain = () => {
      if (run2 > 0) {
        recoveryChains++;
        totalDepth += run2;
        run2 = 0;
      }
    };
    for (const uuid of episode.mainNodeUuids) {
      const node = nodesByUuid.get(uuid);
      if (node === void 0) {
        continue;
      }
      if (node.kind === "tool_result" /* ToolResult */ && node.isError) {
        run2++;
        if (run2 > maxConsecutiveErrors) {
          maxConsecutiveErrors = run2;
        }
      } else if (node.kind === "tool_result" /* ToolResult */ && !node.isError) {
        closeChain();
      } else if (node.kind === "assistant" /* Assistant */) {
        closeChain();
      }
    }
    closeChain();
  }
  const meanRecoveryDepth = recoveryChains > 0 ? totalDepth / recoveryChains : 0;
  return inwardMetric({ maxConsecutiveErrors, meanRecoveryDepth, recoveryChains, spansConsidered, spansSkipped });
}
var init_recovery_depth = __esm({
  "../../packages/core/src/episodes/derivers/recovery-depth.ts"() {
    "use strict";
    init_node_model();
    init_doors();
  }
});

// ../../packages/core/src/episodes/index.ts
var init_episodes = __esm({
  "../../packages/core/src/episodes/index.ts"() {
    "use strict";
    init_node_model();
    init_parser();
    init_episode();
    init_reconstructor();
    init_coverage();
    init_schema();
    init_doors();
    init_events();
    init_signals();
    init_skill_adoption_velocity();
    init_distribution_drift();
    init_recency_split();
    init_rework_density();
    init_recovery_depth();
  }
});

// src/trajectory.ts
var trajectory_exports = {};
__export(trajectory_exports, {
  runTrajectory: () => runTrajectory
});
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync
} from "fs";
import { homedir } from "os";
import { join } from "path";
function isRecord4(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function filePathOf2(node) {
  const block = node.content.find((b) => b.type === "tool_use");
  const input = block?.input;
  if (isRecord4(input) && typeof input.file_path === "string") {
    return input.file_path;
  }
  return null;
}
function slimNode(node) {
  if (node.kind === "tool_use" /* ToolUse */) {
    const fp = filePathOf2(node);
    const input = fp === null ? {} : { file_path: fp };
    const content = [
      { type: "tool_use", id: node.toolUseId ?? "", name: node.toolName ?? "", input }
    ];
    return { ...node, content, text: "" };
  }
  return { ...node, content: [], text: "" };
}
function findJsonlFiles(dir) {
  const out = [];
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true, encoding: "utf8" });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...findJsonlFiles(full));
    } else if (entry.isFile() && entry.name.endsWith(".jsonl")) {
      out.push(full);
    }
  }
  return out;
}
function loadCorpus(paths) {
  const files = [];
  for (const path of paths) {
    let text;
    try {
      text = readFileSync(path, "utf8");
    } catch {
      continue;
    }
    const parsed = parseTranscript(text);
    const nodes = parsed.nodes.map(slimNode);
    files.push({ path, nodes });
  }
  return files;
}
function prettySignal(signal) {
  if (signal.startsWith("tool:")) return signal.slice("tool:".length);
  if (signal.startsWith("lang:")) return `.${signal.slice("lang:".length)}`;
  return signal;
}
function prettyList(signals, max = 12) {
  if (signals.length === 0) return "(none)";
  const shown = signals.slice(0, max).map(prettySignal).join(", ");
  const extra = signals.length - max;
  return extra > 0 ? `${shown}, +${extra} more` : shown;
}
function round(n) {
  return Math.round(n);
}
function oneDecimal(n) {
  return (Math.round(n * 10) / 10).toFixed(1);
}
function coverageLine(view) {
  const attr = round(view.coverage.attributedPct);
  const sub = round(view.subagentPct);
  const comp = round(view.coverage.compactedPct);
  return `Built from ${view.sessions} session${view.sessions === 1 ? "" : "s"}; ${attr}% attributed, ${sub}% in subagent dispatches, ${comp}% compacted. Covers stack currency + trajectory \u2014 not seniority, impact, or judgment. Pair with a conversation.`;
}
function renderTerminal(view) {
  const h = view.score.headline;
  const rising = h.rising.map((e) => prettySignal(e.signal)).slice(0, 6);
  const falling = h.falling.map((e) => prettySignal(e.signal)).slice(0, 6);
  console.log("");
  console.log("  Trajectory \u2014 your code is your r\xE9sum\xE9");
  console.log("  " + "\u2500".repeat(68));
  console.log("");
  console.log("  \u258C Trajectory");
  console.log(
    `    ${h.distinctSignalCount} distinct tools/languages \xB7 ${h.recentAdoptionCount} adopted in the last 90d \xB7 ${oneDecimal(h.velocityPerWeek)} new/wk`
  );
  if (rising.length > 0) console.log(`    \u2191 rising:  ${rising.join(", ")}`);
  if (falling.length > 0) console.log(`    \u2193 falling: ${falling.join(", ")}`);
  console.log("");
  console.log("  \u258C Stack");
  console.log(`    live (this quarter):    ${prettyList(view.score.liveStack)}`);
  console.log(`    dormant (90d+ untouched): ${prettyList(view.score.dormantStack)}`);
  console.log("");
  console.log("  \u258C Coverage / scope");
  console.log(`    ${coverageLine(view)}`);
  console.log("");
}
function renderMarkdown(view) {
  const h = view.score.headline;
  const rising = h.rising.map((e) => prettySignal(e.signal)).slice(0, 8);
  const falling = h.falling.map((e) => prettySignal(e.signal)).slice(0, 8);
  const lines = [];
  lines.push("# Trajectory");
  lines.push("");
  lines.push("> Your code is your r\xE9sum\xE9. Local-first, derived from your own Claude Code corpus.");
  lines.push("");
  lines.push("## Trajectory");
  lines.push("");
  lines.push(`- Distinct tools/languages: **${h.distinctSignalCount}**`);
  lines.push(`- Adopted in the last 90 days: **${h.recentAdoptionCount}**`);
  lines.push(`- Adoption velocity: **${oneDecimal(h.velocityPerWeek)} new/week**`);
  lines.push(`- Rising: ${rising.length > 0 ? rising.join(", ") : "_none_"}`);
  lines.push(`- Falling: ${falling.length > 0 ? falling.join(", ") : "_none_"}`);
  lines.push("");
  lines.push("## Stack");
  lines.push("");
  lines.push(`- **Live** (used this quarter): ${prettyList(view.score.liveStack, 64)}`);
  lines.push(`- **Dormant** (90d+ untouched): ${prettyList(view.score.dormantStack, 64)}`);
  lines.push("");
  lines.push("## Coverage / scope");
  lines.push("");
  lines.push(coverageLine(view));
  lines.push("");
  return lines.join("\n");
}
function writeExportArtifacts(score, markdown) {
  const dir = join(homedir(), ".terminalhire");
  mkdirSync(dir, { recursive: true });
  const jsonPath = join(dir, "trajectory-export.json");
  const mdPath = join(dir, "trajectory-export.md");
  writeFileSync(jsonPath, JSON.stringify(score, null, 2) + "\n", "utf8");
  writeFileSync(mdPath, markdown, "utf8");
  return { jsonPath, mdPath };
}
function renderInward(allNodes, view, files) {
  const result = reconstruct(files);
  const nodesByUuid = /* @__PURE__ */ new Map();
  for (const n of allNodes) nodesByUuid.set(n.uuid, n);
  const rework = metricValue(deriveReworkDensity(result.episodes, nodesByUuid));
  const recovery = metricValue(deriveRecoveryDepth(result.episodes, nodesByUuid));
  console.log("  \u258C Inward (private \u2014 never exported)");
  console.log(
    `    rework: ${rework.reworkEdits}/${rework.totalEdits} edits revisited (ratio ${oneDecimal(rework.reworkRatio * 100)}%) over ${rework.spansConsidered} spans (${rework.spansSkipped} compacted skipped)`
  );
  console.log(
    `    recovery: max chain ${recovery.maxConsecutiveErrors}, mean depth ${oneDecimal(recovery.meanRecoveryDepth)} over ${recovery.recoveryChains} chains (${recovery.spansConsidered} spans, ${recovery.spansSkipped} compacted skipped)`
  );
  console.log("");
}
async function runTrajectory(opts) {
  const projectsDir = join(homedir(), ".claude", "projects");
  if (!existsSync(projectsDir)) {
    console.log("terminalhire trajectory: no ~/.claude/projects directory found.");
    console.log("  Start a Claude Code session and your trajectory will appear here.");
    return;
  }
  const paths = findJsonlFiles(projectsDir);
  if (paths.length === 0) {
    console.log("terminalhire trajectory: no transcripts found under ~/.claude/projects.");
    console.log("  Start a Claude Code session and your trajectory will appear here.");
    return;
  }
  const files = loadCorpus(paths);
  const allNodes = [];
  for (const f of files) {
    for (const n of f.nodes) allNodes.push(n);
  }
  const reconstructed = reconstruct(files);
  const coverage = computeCoverage(files, reconstructed);
  const velocity = deriveSkillAdoptionVelocity(allNodes);
  const drift = deriveDistributionDrift(allNodes);
  const recency = deriveRecencySplit(allNodes);
  const score = buildExport(
    {
      skillAdoptionVelocity: velocity,
      distributionDrift: drift,
      recencySplit: recency
    },
    round(coverage.attributedPct)
  );
  let sidechainNodes = 0;
  for (const n of allNodes) if (n.isSidechain) sidechainNodes++;
  const subagentPct = allNodes.length > 0 ? sidechainNodes / allNodes.length * 100 : 0;
  const sessions = new Set(reconstructed.files.map((f) => f.sessionId)).size;
  const view = {
    score,
    coverage,
    sessions,
    subagentPct,
    fileCount: files.length
  };
  renderTerminal(view);
  if (opts.inward) {
    renderInward(allNodes, view, files);
  }
  if (opts.export) {
    const markdown = renderMarkdown(view);
    const { jsonPath, mdPath } = writeExportArtifacts(score, markdown);
    console.log("  Export written:");
    console.log(`    ${jsonPath}`);
    console.log(`    ${mdPath}`);
    console.log("");
  }
}
var init_trajectory = __esm({
  "src/trajectory.ts"() {
    "use strict";
    init_episodes();
  }
});

// bin/jpi-trajectory.js
async function run() {
  try {
    const args = process.argv.slice(2);
    const doExport = args.includes("--export");
    const inward = args.includes("--inward");
    const { runTrajectory: runTrajectory2 } = await Promise.resolve().then(() => (init_trajectory(), trajectory_exports));
    await runTrajectory2({ export: doExport, inward });
  } catch (err) {
    console.error("terminalhire trajectory error:", err?.message ?? err);
    process.exit(1);
  }
}
export {
  run
};
