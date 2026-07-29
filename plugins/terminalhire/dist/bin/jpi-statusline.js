#!/usr/bin/env node

// bin/jpi-statusline.js
import { readFileSync } from "fs";
import { join } from "path";
import { homedir } from "os";
import { pathToFileURL, fileURLToPath } from "url";
var INDEX_CACHE_FILE = join(
  process.env.TERMINALHIRE_DIR || join(homedir(), ".terminalhire"),
  "index-cache.json"
);
var INDEX_CACHE_TTL_MS = 15 * 60 * 1e3;
function readFreshCache() {
  try {
    const entry = JSON.parse(readFileSync(INDEX_CACHE_FILE, "utf8"));
    if (typeof entry.ts !== "number" || Date.now() - entry.ts > INDEX_CACHE_TTL_MS) return null;
    return entry;
  } catch {
    return null;
  }
}
function unreadChatCount(entry) {
  const n = entry && entry.unreadChat && entry.unreadChat.count;
  return typeof n === "number" && n > 0 ? n : 0;
}
function incomingCount(entry) {
  const n = entry && entry.incomingPending && entry.incomingPending.count;
  return typeof n === "number" && n > 0 ? n : 0;
}
function sessionStale(entry) {
  return !!entry && entry.sessionStale === true;
}
function founderPaidCount(entry) {
  const n = entry && entry.founderPaid && entry.founderPaid.count;
  return typeof n === "number" && n > 0 ? n : 0;
}
function approvedClaimsCount(entry) {
  const n = entry && entry.approvedClaims && entry.approvedClaims.count;
  return typeof n === "number" && n > 0 ? n : 0;
}
function founderNeedsYouCount(entry) {
  if (!entry || entry.surfaceLead !== "founder") return 0;
  const n = entry.founderSurface && entry.founderSurface.needsYouCount;
  return typeof n === "number" && n > 0 ? n : 0;
}
function founderOpenCount(entry) {
  if (!entry || entry.surfaceLead !== "founder") return 0;
  const n = entry.founderSurface && entry.founderSurface.openPostingCount;
  return typeof n === "number" && n > 0 ? n : 0;
}
var SEMVER_HEAD = /^(\d+)\.(\d+)\.(\d+)/;
function parsePatchTriple(v) {
  if (typeof v !== "string") return null;
  const m = SEMVER_HEAD.exec(v.trim().replace(/^v/, ""));
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
}
function isBehind(local, latest) {
  const a = parsePatchTriple(local);
  const b = parsePatchTriple(latest);
  if (!a || !b) return false;
  for (let i = 0; i < 3; i++) {
    if (a[i] < b[i]) return true;
    if (a[i] > b[i]) return false;
  }
  return false;
}
function localVersion() {
  const here = fileURLToPath(new URL(".", import.meta.url));
  for (const p of [join(here, "..", "..", "package.json"), join(here, "..", "package.json")]) {
    try {
      const pkg = JSON.parse(readFileSync(p, "utf8"));
      if (pkg.name === "terminalhire" && pkg.version) return pkg.version;
    } catch {
    }
  }
  return null;
}
function updateAvailable(entry) {
  const latest = entry && entry.index && entry.index.cliVersion;
  const local = localVersion();
  return isBehind(local, latest) ? `${local} \u2192 ${latest}` : "";
}
function render() {
  try {
    const entry = readFreshCache();
    if (!entry) return "";
    const unread = unreadChatCount(entry);
    const incoming = incomingCount(entry);
    const paid = founderPaidCount(entry);
    const approved = approvedClaimsCount(entry);
    const founderNeedsYou = founderNeedsYouCount(entry);
    const founderOpen = founderOpenCount(entry);
    const stale = sessionStale(entry) && unread === 0 && incoming === 0;
    const segments = [];
    if (approved > 0) segments.push(`\u2705 ${approved} approved \u2014 run: th claim list`);
    if (founderNeedsYou > 0) {
      segments.push(
        `\u{1F9ED} ${founderNeedsYou} claim${founderNeedsYou === 1 ? "" : "s"} await your decision \u2014 run: th bounties`
      );
    } else if (founderOpen > 0) {
      segments.push(
        `\u{1F9ED} ${founderOpen} posting${founderOpen === 1 ? "" : "s"} open \u2014 run: th bounties`
      );
    }
    if (paid > 0) segments.push(`\u{1F48E} ${paid} paid \u2014 run: th bounties`);
    const conn = [];
    if (unread > 0) conn.push(`\u{1F4AC} ${unread} unread`);
    if (incoming > 0) conn.push(`\u2709 ${incoming} intro request${incoming === 1 ? "" : "s"}`);
    if (conn.length > 0) {
      segments.push(`${conn.join("  \xB7  ")} \u2014 run: th inbox`);
    } else if (stale) {
      segments.push("\u26A0 terminalhire session expired \u2014 run: th link");
    }
    const update = updateAvailable(entry);
    if (update) segments.push(`\u2B06 terminalhire ${update} \u2014 run: th update`);
    return segments.join("  \xB7  ");
  } catch {
    return "";
  }
}
try {
  const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
  if (isMain) {
    const line = render();
    if (line) process.stdout.write(line + "\n");
    process.exit(0);
  }
} catch {
  process.exit(0);
}
export {
  render
};
