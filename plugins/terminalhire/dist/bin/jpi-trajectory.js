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
  const join4 = opts.joinSidechains !== false;
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
  if (join4) {
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
function mcpToolSignal(name) {
  const rest = name.slice("mcp__".length);
  const sep = rest.indexOf("__");
  if (sep <= 0) return "mcp:custom";
  const server = rest.slice(0, sep).toLowerCase();
  const leaf = rest.slice(sep + 2);
  if (leaf.length === 0) return "mcp:custom";
  if (MCP_SERVER_CAPABILITY.has(server)) return MCP_SERVER_CAPABILITY.get(server) ?? null;
  return "mcp:custom";
}
function classifyToolSignal(name) {
  if (name.toLowerCase().startsWith("mcp__")) {
    return mcpToolSignal(name);
  }
  const key = name.toLowerCase();
  if (ORCHESTRATION_TOOLS.has(key)) return AGENTIC_WORKFLOW_SIGNAL;
  return null;
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
    const toolSignal = classifyToolSignal(node.toolName);
    if (toolSignal !== null) {
      out.push({ signal: toolSignal, ts: node.timestamp });
    }
    const lang = fileExtLang(toolUseInput(node));
    if (lang !== null) {
      out.push({ signal: `lang:${lang}`, ts: node.timestamp });
    }
  }
  out.sort(compareSignal);
  return out;
}
var EXT_LANG, MCP_SERVER_CAPABILITY, ORCHESTRATION_TOOLS, AGENTIC_WORKFLOW_SIGNAL;
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
    MCP_SERVER_CAPABILITY = /* @__PURE__ */ new Map([
      // Coding-relevant public servers → a capability.
      ["plugin_playwright_playwright", "cap:ui-automation"],
      ["playwright", "cap:ui-automation"],
      ["claude_ai_linear", "cap:project-mgmt"],
      ["claude_ai_vercel", "cap:deploys"],
      ["plugin_vercel_vercel", "cap:deploys"],
      ["claude_ai_figma", "cap:design"],
      ["figma", "cap:design"],
      ["pencil", "cap:design"],
      ["claude_ai_ideabrowser", "cap:product-research"],
      ["ideabrowser", "cap:product-research"],
      ["blender", "cap:3d-modeling"],
      ["n8n-knowledge", "cap:workflow-automation"],
      // Public but NOT a coding skill → dropped from the trajectory.
      ["plugin_context-mode_context-mode", null],
      // agent context plumbing
      ["claude_ai_gmail", null],
      ["claude_ai_google_calendar", null],
      ["claude_ai_google_drive", null]
    ]);
    ORCHESTRATION_TOOLS = /* @__PURE__ */ new Set([
      "task",
      "agent",
      "workflow",
      "enterworktree",
      "exitworktree",
      "schedulewakeup",
      "monitor",
      "sendmessage",
      "taskcreate",
      "tasklist",
      "taskstop",
      "taskupdate",
      "taskget",
      "taskoutput",
      "croncreate",
      "cronlist",
      "crondelete"
    ]);
    AGENTIC_WORKFLOW_SIGNAL = "cap:agentic-workflow";
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

// ../../packages/core/src/types.ts
var init_types = __esm({
  "../../packages/core/src/types.ts"() {
    "use strict";
  }
});

// ../../packages/core/src/vocab/graph.data.ts
var VOCAB_NODES;
var init_graph_data = __esm({
  "../../packages/core/src/vocab/graph.data.ts"() {
    "use strict";
    VOCAB_NODES = [
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
      { id: "agents", parents: ["llm"], synonyms: ["agentic", "ai-agents", "multi-agent"], related: [{ to: "rag", w: 0.4 }] },
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
  }
});

// ../../packages/core/src/vocab/closure.ts
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
var PARENT_UP, PARENT_DOWN, DECAY_FLOOR;
var init_closure = __esm({
  "../../packages/core/src/vocab/closure.ts"() {
    "use strict";
    PARENT_UP = 0.6;
    PARENT_DOWN = 0.35;
    DECAY_FLOOR = 0.25;
  }
});

// ../../packages/core/src/vocab/types.ts
var init_types2 = __esm({
  "../../packages/core/src/vocab/types.ts"() {
    "use strict";
  }
});

// ../../packages/core/src/vocab/extract.ts
var SOFT_DOMAIN, SYNONYM_ONLY;
var init_extract = __esm({
  "../../packages/core/src/vocab/extract.ts"() {
    "use strict";
    init_vocab();
    SOFT_DOMAIN = /* @__PURE__ */ new Set([
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
    SYNONYM_ONLY = /* @__PURE__ */ new Set(["performance", "security", "seo"]);
    for (const id of SYNONYM_ONLY) {
      if (!SOFT_DOMAIN.has(id)) throw new Error(`extract: SYNONYM_ONLY "${id}" not in SOFT_DOMAIN`);
    }
  }
});

// ../../packages/core/src/vocab/idf-background.ts
var init_idf_background = __esm({
  "../../packages/core/src/vocab/idf-background.ts"() {
    "use strict";
  }
});

// ../../packages/core/src/vocab/index.ts
function normalize(tokens) {
  const result = /* @__PURE__ */ new Set();
  for (const raw of tokens) {
    const lower = raw.toLowerCase().trim();
    if (GRAPH.ids.has(lower)) {
      result.add(lower);
      continue;
    }
    const mapped = GRAPH.synonyms.get(lower);
    if (mapped) result.add(mapped);
  }
  return Array.from(result);
}
var GRAPH, VOCABULARY, SYNONYMS;
var init_vocab = __esm({
  "../../packages/core/src/vocab/index.ts"() {
    "use strict";
    init_graph_data();
    init_closure();
    init_types2();
    init_closure();
    init_graph_data();
    init_extract();
    init_idf_background();
    GRAPH = buildGraph(VOCAB_NODES);
    VOCABULARY = [...GRAPH.ids];
    SYNONYMS = Object.fromEntries(GRAPH.synonyms);
  }
});

// ../../packages/core/src/vocabulary.ts
var init_vocabulary = __esm({
  "../../packages/core/src/vocabulary.ts"() {
    "use strict";
    init_vocab();
  }
});

// ../../packages/core/src/github.ts
var RESUME_DECAY_HALF_LIFE_MS;
var init_github = __esm({
  "../../packages/core/src/github.ts"() {
    "use strict";
    init_vocabulary();
    RESUME_DECAY_HALF_LIFE_MS = 30 * 24 * 60 * 60 * 1e3;
  }
});

// ../../packages/core/src/matcher.ts
var init_matcher = __esm({
  "../../packages/core/src/matcher.ts"() {
    "use strict";
    init_vocabulary();
    init_github();
  }
});

// ../../packages/core/src/feeds/http.ts
var init_http = __esm({
  "../../packages/core/src/feeds/http.ts"() {
    "use strict";
  }
});

// ../../packages/core/src/feeds/greenhouse.ts
var init_greenhouse = __esm({
  "../../packages/core/src/feeds/greenhouse.ts"() {
    "use strict";
    init_vocabulary();
    init_http();
  }
});

// ../../packages/core/src/feeds/ashby.ts
var init_ashby = __esm({
  "../../packages/core/src/feeds/ashby.ts"() {
    "use strict";
    init_vocabulary();
    init_http();
  }
});

// ../../packages/core/src/feeds/lever.ts
var init_lever = __esm({
  "../../packages/core/src/feeds/lever.ts"() {
    "use strict";
    init_vocabulary();
    init_http();
  }
});

// ../../packages/core/src/feeds/himalayas.ts
var init_himalayas = __esm({
  "../../packages/core/src/feeds/himalayas.ts"() {
    "use strict";
    init_vocabulary();
    init_http();
  }
});

// ../../packages/core/src/feeds/entities.ts
var init_entities = __esm({
  "../../packages/core/src/feeds/entities.ts"() {
    "use strict";
  }
});

// ../../packages/core/src/feeds/wwr.ts
var init_wwr = __esm({
  "../../packages/core/src/feeds/wwr.ts"() {
    "use strict";
    init_vocabulary();
    init_entities();
    init_http();
  }
});

// ../../packages/core/src/feeds/hn.ts
var init_hn = __esm({
  "../../packages/core/src/feeds/hn.ts"() {
    "use strict";
    init_vocabulary();
    init_entities();
    init_http();
  }
});

// ../../packages/core/src/feeds/bounty-gate.ts
var BOUNTY_REPO_DENYLIST, DENYLIST_LC;
var init_bounty_gate = __esm({
  "../../packages/core/src/feeds/bounty-gate.ts"() {
    "use strict";
    BOUNTY_REPO_DENYLIST = ["SecureBananaLabs/bug-bounty"];
    DENYLIST_LC = new Set(BOUNTY_REPO_DENYLIST.map((r) => r.toLowerCase()));
  }
});

// ../../packages/core/src/concurrency.ts
var init_concurrency = __esm({
  "../../packages/core/src/concurrency.ts"() {
    "use strict";
  }
});

// ../../packages/core/src/feeds/github-bounties.ts
var init_github_bounties = __esm({
  "../../packages/core/src/feeds/github-bounties.ts"() {
    "use strict";
    init_vocabulary();
    init_entities();
    init_bounty_gate();
    init_http();
    init_concurrency();
  }
});

// ../../packages/core/src/feeds/opire.ts
var init_opire = __esm({
  "../../packages/core/src/feeds/opire.ts"() {
    "use strict";
    init_vocabulary();
    init_bounty_gate();
    init_github_bounties();
    init_http();
  }
});

// ../../packages/core/src/feeds/workable.ts
var init_workable = __esm({
  "../../packages/core/src/feeds/workable.ts"() {
    "use strict";
    init_vocabulary();
    init_http();
  }
});

// ../../packages/core/src/feeds/directory.ts
var init_directory = __esm({
  "../../packages/core/src/feeds/directory.ts"() {
    "use strict";
  }
});

// ../../packages/core/src/feeds/index.ts
function flattenTiers(t) {
  return [.../* @__PURE__ */ new Set([...t.bigco, ...t.scaleup, ...t.startup])];
}
var GREENHOUSE_SLUGS_BY_TIER, ASHBY_SLUGS_BY_TIER, LEVER_SLUGS_BY_TIER, DEFAULT_GREENHOUSE_SLUGS, DEFAULT_ASHBY_SLUGS, DEFAULT_LEVER_SLUGS;
var init_feeds = __esm({
  "../../packages/core/src/feeds/index.ts"() {
    "use strict";
    init_greenhouse();
    init_ashby();
    init_lever();
    init_himalayas();
    init_wwr();
    init_hn();
    init_github_bounties();
    init_opire();
    init_workable();
    init_directory();
    init_bounty_gate();
    init_bounty_gate();
    GREENHOUSE_SLUGS_BY_TIER = {
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
    ASHBY_SLUGS_BY_TIER = {
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
    LEVER_SLUGS_BY_TIER = {
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
    DEFAULT_GREENHOUSE_SLUGS = flattenTiers(GREENHOUSE_SLUGS_BY_TIER);
    DEFAULT_ASHBY_SLUGS = flattenTiers(ASHBY_SLUGS_BY_TIER);
    DEFAULT_LEVER_SLUGS = flattenTiers(LEVER_SLUGS_BY_TIER);
  }
});

// ../../packages/core/src/partners.ts
import { readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
var EXAMPLE_BUYER, BUYER_REGISTRY;
var init_partners = __esm({
  "../../packages/core/src/partners.ts"() {
    "use strict";
    EXAMPLE_BUYER = {
      id: "northstar",
      legalName: "Northstar Talent Partners",
      matchCriteria: { roleTypes: ["full_time"] }
    };
    BUYER_REGISTRY = {
      [EXAMPLE_BUYER.id]: EXAMPLE_BUYER
    };
  }
});

// ../../packages/core/src/indexer.ts
var init_indexer = __esm({
  "../../packages/core/src/indexer.ts"() {
    "use strict";
    init_feeds();
    init_partners();
  }
});

// ../../packages/core/src/intro.ts
var INTRO_ALLOWED_FIELDS, INTRO_ALLOWED_SET, INTRO_PENDING_TTL_MS, INTRO_ACCEPTED_TTL_MS;
var init_intro = __esm({
  "../../packages/core/src/intro.ts"() {
    "use strict";
    INTRO_ALLOWED_FIELDS = [
      "requesterLogin",
      "requesterDisplayName",
      "requesterContact",
      "note",
      "targetLogin"
    ];
    INTRO_ALLOWED_SET = new Set(INTRO_ALLOWED_FIELDS);
    INTRO_PENDING_TTL_MS = 30 * 24 * 60 * 60 * 1e3;
    INTRO_ACCEPTED_TTL_MS = 365 * 24 * 60 * 60 * 1e3;
  }
});

// ../../packages/core/src/directoryThreshold.ts
var init_directoryThreshold = __esm({
  "../../packages/core/src/directoryThreshold.ts"() {
    "use strict";
  }
});

// ../../packages/core/src/chatCrypto.ts
import { hkdfSync, createHash, randomBytes } from "crypto";
var KDF_INFO;
var init_chatCrypto = __esm({
  "../../packages/core/src/chatCrypto.ts"() {
    "use strict";
    KDF_INFO = Buffer.from("terminalhire-chat-v1");
  }
});

// ../../packages/core/src/index.ts
var init_src = __esm({
  "../../packages/core/src/index.ts"() {
    "use strict";
    init_types();
    init_vocabulary();
    init_matcher();
    init_feeds();
    init_indexer();
    init_partners();
    init_github();
    init_intro();
    init_directoryThreshold();
    init_chatCrypto();
  }
});

// src/profile.ts
var profile_exports = {};
__export(profile_exports, {
  accumulateGitHubTags: () => accumulateGitHubTags,
  accumulateSession: () => accumulateSession,
  accumulateTags: () => accumulateTags,
  addSavedJob: () => addSavedJob,
  deleteProfile: () => deleteProfile,
  listSavedJobs: () => listSavedJobs,
  profileToFingerprint: () => profileToFingerprint,
  readProfile: () => readProfile,
  removeSavedJob: () => removeSavedJob,
  writeProfile: () => writeProfile
});
import {
  createCipheriv,
  createDecipheriv,
  randomBytes as randomBytes2
} from "crypto";
import {
  readFileSync as readFileSync2,
  writeFileSync,
  mkdirSync,
  existsSync
} from "fs";
import { join as join2 } from "path";
import { homedir } from "os";
async function loadKey() {
  try {
    const kt = await import("keytar");
    const stored = await kt.getPassword("terminalhire", "profile-key");
    if (stored) {
      return Buffer.from(stored, "hex");
    }
    const key2 = randomBytes2(KEY_BYTES);
    await kt.setPassword("terminalhire", "profile-key", key2.toString("hex"));
    return key2;
  } catch {
  }
  mkdirSync(TERMINALHIRE_DIR, { recursive: true });
  if (existsSync(KEY_FILE)) {
    return Buffer.from(readFileSync2(KEY_FILE, "utf8").trim(), "hex");
  }
  const key = randomBytes2(KEY_BYTES);
  writeFileSync(KEY_FILE, key.toString("hex"), { mode: 384, encoding: "utf8" });
  return key;
}
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
function blankProfile() {
  return {
    version: 3,
    skillTags: [],
    tagWeights: {},
    hasEmployerSessions: false,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
}
function recencyDecay(lastSeen) {
  const ageMs = Date.now() - new Date(lastSeen).getTime();
  return Math.pow(0.5, ageMs / DECAY_HALF_LIFE_MS);
}
function tagScore(w) {
  return w.count * recencyDecay(w.lastSeen);
}
function deriveSkillTags(tagWeights) {
  return Object.entries(tagWeights).filter(([, w]) => w.count >= 1).sort(([, a], [, b]) => tagScore(b) - tagScore(a)).map(([tag]) => tag);
}
function migrateTagWeights(profile) {
  if (!profile.tagWeights) {
    profile.tagWeights = {};
  }
  const seed = profile.updatedAt ?? (/* @__PURE__ */ new Date()).toISOString();
  for (const tag of profile.skillTags) {
    if (!profile.tagWeights[tag]) {
      profile.tagWeights[tag] = { count: 1, firstSeen: seed, lastSeen: seed, sessions: 1 };
    }
  }
}
async function readProfile() {
  if (!existsSync(PROFILE_FILE)) return blankProfile();
  try {
    const key = await loadKey();
    const raw = readFileSync2(PROFILE_FILE, "utf8");
    const blob = JSON.parse(raw);
    const plaintext = decrypt(blob, key);
    const parsed = JSON.parse(plaintext);
    migrateTagWeights(parsed);
    return parsed;
  } catch {
    return blankProfile();
  }
}
async function writeProfile(profile) {
  mkdirSync(TERMINALHIRE_DIR, { recursive: true });
  const key = await loadKey();
  profile.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
  profile.skillTags = deriveSkillTags(profile.tagWeights);
  const blob = encrypt(JSON.stringify(profile), key);
  writeFileSync(PROFILE_FILE, JSON.stringify(blob, null, 2), { encoding: "utf8" });
}
function accumulateSession(profile, tags, isEmployerContext, inferredSeniority, seniorityIsAuthoritative = false) {
  const now = (/* @__PURE__ */ new Date()).toISOString();
  let filtered = normalize(tags);
  if (isEmployerContext) {
    filtered = filtered.filter((t) => LANGUAGE_TAGS.has(t));
    profile.hasEmployerSessions = true;
  }
  for (const tag of filtered) {
    const existing = profile.tagWeights[tag];
    if (existing) {
      existing.count += 1;
      existing.sessions += 1;
      existing.lastSeen = now;
    } else {
      profile.tagWeights[tag] = { count: 1, firstSeen: now, lastSeen: now, sessions: 1 };
    }
  }
  if (inferredSeniority && !isEmployerContext) {
    if (seniorityIsAuthoritative || !profile.github) {
      profile.seniority = inferredSeniority;
    }
  }
}
async function accumulateTags(rawTokens, isEmployerContext, inferredSeniority) {
  const profile = await readProfile();
  accumulateSession(profile, rawTokens, isEmployerContext, inferredSeniority);
  await writeProfile(profile);
}
function accumulateGitHubTags(profile, tags, inferredSeniority) {
  accumulateSession(
    profile,
    tags,
    /* isEmployerContext */
    false,
    inferredSeniority,
    true
  );
}
async function listSavedJobs() {
  const profile = await readProfile();
  return profile.savedJobs ?? [];
}
async function addSavedJob(job) {
  const profile = await readProfile();
  const existing = profile.savedJobs ?? [];
  const filtered = existing.filter((j) => j.id !== job.id);
  profile.savedJobs = [...filtered, { ...job, savedAt: (/* @__PURE__ */ new Date()).toISOString() }];
  await writeProfile(profile);
}
async function removeSavedJob(id) {
  const profile = await readProfile();
  const existing = profile.savedJobs ?? [];
  const filtered = existing.filter((j) => j.id !== id);
  if (filtered.length === existing.length) return false;
  profile.savedJobs = filtered;
  await writeProfile(profile);
  return true;
}
async function deleteProfile() {
  const { rmSync } = await import("fs");
  try {
    rmSync(PROFILE_FILE);
  } catch {
  }
  try {
    rmSync(KEY_FILE);
  } catch {
  }
}
function profileToFingerprint(profile) {
  const rankedTags = Object.entries(profile.tagWeights).map(([tag, w]) => ({ tag, score: tagScore(w) })).filter(({ score }) => score >= MIN_FINGERPRINT_SCORE).sort((a, b) => b.score - a.score).map(({ tag }) => tag);
  const skillTags = rankedTags.length > 0 ? rankedTags : profile.skillTags;
  return {
    skillTags,
    seniorityBand: profile.seniority,
    prefs: {
      roleTypes: profile.roleTypes,
      remoteOnly: profile.remoteOnly,
      compFloorUsd: profile.compFloorUsd
    }
  };
}
var TERMINALHIRE_DIR, PROFILE_FILE, KEY_FILE, ALGO, KEY_BYTES, IV_BYTES, DECAY_HALF_LIFE_MS, LANGUAGE_TAGS, MIN_FINGERPRINT_SCORE;
var init_profile = __esm({
  "src/profile.ts"() {
    "use strict";
    init_src();
    TERMINALHIRE_DIR = join2(homedir(), ".terminalhire");
    PROFILE_FILE = join2(TERMINALHIRE_DIR, "profile.enc");
    KEY_FILE = join2(TERMINALHIRE_DIR, "key");
    ALGO = "aes-256-gcm";
    KEY_BYTES = 32;
    IV_BYTES = 12;
    DECAY_HALF_LIFE_MS = 30 * 24 * 60 * 60 * 1e3;
    LANGUAGE_TAGS = /* @__PURE__ */ new Set([
      "typescript",
      "javascript",
      "python",
      "go",
      "rust",
      "java",
      "ruby",
      "elixir",
      "scala",
      "kotlin",
      "swift",
      "cpp",
      "csharp",
      "php",
      "haskell",
      "clojure",
      "r"
    ]);
    MIN_FINGERPRINT_SCORE = 0.05;
  }
});

// src/open-url.js
var open_url_exports = {};
__export(open_url_exports, {
  openInBrowser: () => openInBrowser
});
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
var init_open_url = __esm({
  "src/open-url.js"() {
    "use strict";
  }
});

// src/trajectory.ts
var trajectory_exports = {};
__export(trajectory_exports, {
  PUSH_DENYLIST: () => PUSH_DENYLIST,
  computeDerivedScore: () => computeDerivedScore,
  runTrajectory: () => runTrajectory,
  runTrajectoryPush: () => runTrajectoryPush
});
import {
  existsSync as existsSync2,
  mkdirSync as mkdirSync2,
  readFileSync as readFileSync3,
  readdirSync,
  writeFileSync as writeFileSync2
} from "fs";
import { homedir as homedir2 } from "os";
import { join as join3 } from "path";
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
    const full = join3(dir, entry.name);
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
      text = readFileSync3(path, "utf8");
    } catch {
      continue;
    }
    const parsed = parseTranscript(text);
    const nodes = parsed.nodes.map(slimNode);
    files.push({ path, nodes });
  }
  return files;
}
function isLang(signal) {
  return signal.startsWith("lang:");
}
function prettySignal(signal) {
  if (signal.startsWith("lang:")) return `.${signal.slice("lang:".length)}`;
  if (CAP_LABELS[signal]) return CAP_LABELS[signal];
  if (signal.startsWith("cap:")) return signal.slice("cap:".length).replace(/-/g, " ");
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
  const liveLangs = view.score.liveStack.filter(isLang);
  const liveCaps = view.score.liveStack.filter((s) => !isLang(s));
  const dormantLangs = view.score.dormantStack.filter(isLang);
  console.log("  \u258C Stack (languages)");
  console.log(`    live (this quarter):      ${prettyList(liveLangs)}`);
  console.log(`    dormant (90d+ untouched): ${prettyList(dormantLangs)}`);
  console.log("");
  console.log("  \u258C Capabilities (tools & integrations)");
  console.log(`    ${prettyList(liveCaps)}`);
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
  lines.push("## Stack (languages)");
  lines.push("");
  lines.push(`- **Live** (used this quarter): ${prettyList(view.score.liveStack.filter(isLang), 64)}`);
  lines.push(`- **Dormant** (90d+ untouched): ${prettyList(view.score.dormantStack.filter(isLang), 64)}`);
  lines.push("");
  lines.push("## Capabilities (tools & integrations)");
  lines.push("");
  lines.push(`- ${prettyList(view.score.liveStack.filter((s) => !isLang(s)), 64)}`);
  lines.push("");
  lines.push("## Coverage / scope");
  lines.push("");
  lines.push(coverageLine(view));
  lines.push("");
  return lines.join("\n");
}
function writeExportArtifacts(score, markdown) {
  const dir = join3(homedir2(), ".terminalhire");
  mkdirSync2(dir, { recursive: true });
  const jsonPath = join3(dir, "trajectory-export.json");
  const mdPath = join3(dir, "trajectory-export.md");
  writeFileSync2(jsonPath, JSON.stringify(score, null, 2) + "\n", "utf8");
  writeFileSync2(mdPath, markdown, "utf8");
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
function buildTrajectory() {
  const projectsDir = join3(homedir2(), ".claude", "projects");
  if (!existsSync2(projectsDir)) return null;
  const paths = findJsonlFiles(projectsDir);
  if (paths.length === 0) return null;
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
  const view = { score, coverage, sessions, subagentPct, fileCount: files.length };
  return { view, allNodes, files };
}
function computeDerivedScore() {
  return buildTrajectory()?.view.score ?? null;
}
async function runTrajectory(opts) {
  const built = buildTrajectory();
  if (!built) {
    console.log("terminalhire trajectory: no transcripts found under ~/.claude/projects.");
    console.log("  Start a Claude Code session and your trajectory will appear here.");
    return;
  }
  const { view, allNodes, files } = built;
  renderTerminal(view);
  if (opts.inward) {
    renderInward(allNodes, view, files);
  }
  if (opts.export) {
    const markdown = renderMarkdown(view);
    const { jsonPath, mdPath } = writeExportArtifacts(view.score, markdown);
    console.log("  Export written:");
    console.log(`    ${jsonPath}`);
    console.log(`    ${mdPath}`);
    console.log("");
  }
}
function dashboardLinkUrl(serialized) {
  const payload = Buffer.from(serialized, "utf8").toString("base64url");
  return `${OAUTH_BASE}/dashboard#link=${payload}`;
}
function scanDenylist(serialized) {
  const haystack = serialized.toLowerCase();
  return PUSH_DENYLIST.filter((needle) => haystack.includes(needle));
}
function defaultPushDeps() {
  return {
    computeScore: computeDerivedScore,
    readGithubLogin: async () => {
      try {
        const { readProfile: readProfile2 } = await Promise.resolve().then(() => (init_profile(), profile_exports));
        const profile = await readProfile2();
        return profile?.github?.login ?? null;
      } catch {
        return null;
      }
    },
    prompt: async (question) => {
      const { createInterface } = await import("readline");
      const rl = createInterface({ input: process.stdin, output: process.stdout });
      return new Promise((res) => {
        rl.question(question, (answer) => {
          rl.close();
          res(answer.trim().toLowerCase());
        });
      });
    },
    fetchImpl: (...args) => globalThis.fetch(...args),
    openBrowser: (url) => {
      void Promise.resolve().then(() => (init_open_url(), open_url_exports)).then((m) => m.openInBrowser(url)).catch(() => {
      });
    },
    sessionCookie: () => {
      const v = process.env["TERMINALHIRE_WEB_SESSION"];
      return typeof v === "string" && v.length > 0 ? v : null;
    },
    log: (msg) => console.log(msg),
    errorLog: (msg) => console.error(msg),
    exit: (code) => process.exit(code)
  };
}
function renderConsentCard(score, login, log) {
  const h = score.headline;
  const rising = h.rising.map((e) => prettySignal(e.signal)).slice(0, 6);
  const falling = h.falling.map((e) => prettySignal(e.signal)).slice(0, 6);
  log("");
  log("\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510");
  log("\u2502   terminalhire \u2014 link your trajectory (opt-in)                \u2502");
  log("\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518");
  log("");
  log(`  This shares your DERIVED trajectory for @${login} with your`);
  log("  terminalhire.com dashboard, shown next to your GitHub r\xE9sum\xE9:");
  log("");
  log(`    Distinct tools/languages : ${h.distinctSignalCount}`);
  log(`    Adopted in last 90d      : ${h.recentAdoptionCount}`);
  log(`    Adoption velocity        : ${oneDecimal(h.velocityPerWeek)} new/week`);
  log(`    Rising                   : ${rising.length ? rising.join(", ") : "(none)"}`);
  log(`    Falling                  : ${falling.length ? falling.join(", ") : "(none)"}`);
  log(`    Live stack               : ${prettyList(score.liveStack)}`);
  log(`    Dormant stack            : ${prettyList(score.dormantStack)}`);
  log(`    Coverage                 : ${score.coveragePct}%`);
  log("");
  log("  What is NEVER sent:");
  log("    - Raw transcripts, file contents, code, project/file names");
  log("    - Inward metrics (rework / recovery / fatigue) \u2014 local-only");
  log("");
  log("  This is the SAME derived score `terminalhire trajectory --export` writes.");
  log("  Not required to use terminalhire. Revoke any time: trajectory --push --delete");
  log("");
}
async function runTrajectoryPush(opts, overrides) {
  const deps = { ...defaultPushDeps(), ...overrides };
  const login = await deps.readGithubLogin();
  if (!login) {
    deps.log("");
    deps.log("  Not signed in. Run `terminalhire login` first, then re-run this command.");
    deps.log("");
    deps.exit(1);
    return;
  }
  const cookie = deps.sessionCookie();
  if (opts.delete) {
    const answer2 = await deps.prompt('  Unlink your trajectory from terminalhire.com? Type "yes" to confirm: ');
    if (answer2 !== "yes") {
      deps.log("\n  Aborted \u2014 nothing was changed.\n");
      deps.exit(0);
      return;
    }
    if (!cookie) {
      deps.log('\n  Open your dashboard and use "remove trajectory" there, or set a bridged');
      deps.log("  session. Nothing was sent.\n");
      deps.openBrowser(`${LINK_BASE}/dashboard`);
      deps.exit(0);
      return;
    }
    let res2;
    try {
      res2 = await deps.fetchImpl(`${LINK_BASE}/api/trajectory-sync`, {
        method: "DELETE",
        headers: { Cookie: `${GH_SESSION_COOKIE}=${cookie}` },
        signal: AbortSignal.timeout(1e4)
      });
    } catch (err) {
      deps.errorLog(`
  Unlink failed: ${err instanceof Error ? err.message : String(err)}
`);
      deps.exit(1);
      return;
    }
    if (!res2.ok) {
      deps.errorLog(`
  Unlink failed: /api/trajectory-sync returned ${res2.status}.
`);
      deps.exit(1);
      return;
    }
    deps.log("\n  Trajectory unlinked from terminalhire.com.\n");
    return;
  }
  const score = deps.computeScore();
  if (!score) {
    deps.log("");
    deps.log("  No trajectory to link yet \u2014 no transcripts under ~/.claude/projects.");
    deps.log("  Start a Claude Code session, then re-run `terminalhire trajectory --push`.");
    deps.log("");
    deps.exit(1);
    return;
  }
  renderConsentCard(score, login, deps.log);
  const answer = await deps.prompt('  Type "yes" to link your trajectory (anything else cancels): ');
  const consented = answer === "yes";
  if (!consented) {
    deps.log("\n  Cancelled \u2014 nothing was sent.\n");
    deps.exit(0);
    return;
  }
  const serialized = JSON.stringify(score);
  const hits = scanDenylist(serialized);
  if (hits.length > 0) {
    deps.errorLog(`
  Aborted: the derived score unexpectedly contains a private field (${hits.join(", ")}).`);
    deps.errorLog("  This should never happen \u2014 nothing was sent. Please report this.\n");
    deps.exit(1);
    return;
  }
  if (!cookie) {
    const url = dashboardLinkUrl(serialized);
    deps.log("  Opening your browser to finish linking\u2026");
    deps.log(`  \u2192 ${url}`);
    deps.openBrowser(url);
    deps.log("");
    deps.log("  (Sign in if prompted \u2014 your trajectory then appears on your dashboard.)");
    deps.log("");
    return;
  }
  let res;
  try {
    res = await deps.fetchImpl(`${LINK_BASE}/api/trajectory-sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: `${GH_SESSION_COOKIE}=${cookie}` },
      body: serialized,
      signal: AbortSignal.timeout(1e4)
    });
  } catch (err) {
    deps.errorLog(`
  Link failed: ${err instanceof Error ? err.message : String(err)}
`);
    deps.exit(1);
    return;
  }
  if (res.status === 401) {
    const url = dashboardLinkUrl(serialized);
    deps.log("\n  Your web session expired \u2014 opening your browser to re-auth and finish linking\u2026");
    deps.log(`  \u2192 ${url}
`);
    deps.openBrowser(url);
    return;
  }
  if (!res.ok) {
    deps.errorLog(`
  Link failed: /api/trajectory-sync returned ${res.status}.
`);
    deps.exit(1);
    return;
  }
  deps.log("\n  Trajectory linked. It now appears next to your r\xE9sum\xE9 on your dashboard.");
  deps.log(`  \u2192 ${LINK_BASE}/dashboard
`);
}
var CAP_LABELS, LINK_BASE, OAUTH_BASE, GH_SESSION_COOKIE, PUSH_DENYLIST;
var init_trajectory = __esm({
  "src/trajectory.ts"() {
    "use strict";
    init_episodes();
    CAP_LABELS = {
      "cap:ui-automation": "UI automation",
      "cap:deploys": "Deployment",
      "cap:project-mgmt": "Project tracking",
      "cap:product-research": "Product research",
      "cap:design": "Design",
      "cap:3d-modeling": "3D modeling",
      "cap:workflow-automation": "Workflow automation",
      "cap:agentic-workflow": "Agent orchestration",
      "mcp:custom": "Private integrations"
    };
    LINK_BASE = process.env["TERMINALHIRE_API_URL"] || "https://www.terminalhire.com";
    OAUTH_BASE = "https://www.terminalhire.com";
    GH_SESSION_COOKIE = "__jpi_gh_session";
    PUSH_DENYLIST = ["rework", "recovery", "within_session", "fatigue", "vector", "mcp__"];
  }
});

// bin/jpi-trajectory.js
async function run() {
  try {
    const args = process.argv.slice(2);
    if (args.includes("--push")) {
      const doDelete = args.includes("--delete") || args.includes("--unlink");
      const { runTrajectoryPush: runTrajectoryPush2 } = await Promise.resolve().then(() => (init_trajectory(), trajectory_exports));
      await runTrajectoryPush2({ delete: doDelete });
      return;
    }
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
