#!/usr/bin/env node

// bin/jpi-statusline.js
import { readFileSync } from "fs";
import { join } from "path";
import { homedir } from "os";
import { pathToFileURL } from "url";
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
function render() {
  try {
    const entry = readFreshCache();
    if (!entry) return "";
    const unread = unreadChatCount(entry);
    const incoming = incomingCount(entry);
    const paid = founderPaidCount(entry);
    const approved = approvedClaimsCount(entry);
    const stale = sessionStale(entry) && unread === 0 && incoming === 0;
    const segments = [];
    if (approved > 0) segments.push(`\u2705 ${approved} approved \u2014 run: th claim list`);
    if (paid > 0) segments.push(`\u{1F48E} ${paid} paid \u2014 run: th bounties`);
    const conn = [];
    if (unread > 0) conn.push(`\u{1F4AC} ${unread} unread`);
    if (incoming > 0) conn.push(`\u2709 ${incoming} intro request${incoming === 1 ? "" : "s"}`);
    if (conn.length > 0) {
      segments.push(`${conn.join("  \xB7  ")} \u2014 run: th inbox`);
    } else if (stale) {
      segments.push("\u26A0 terminalhire session expired \u2014 run: th link");
    }
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
