#!/usr/bin/env node

// bin/jpi-statusline.js
import { readFileSync } from "fs";
import { join } from "path";
import { homedir } from "os";
import { pathToFileURL } from "url";
var INDEX_CACHE_FILE = join(homedir(), ".terminalhire", "index-cache.json");
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
function render() {
  try {
    const entry = readFreshCache();
    if (!entry) return "";
    const unread = unreadChatCount(entry);
    const incoming = incomingCount(entry);
    const stale = sessionStale(entry) && unread === 0 && incoming === 0;
    const parts = [];
    if (unread > 0) parts.push(`\u{1F4AC} ${unread} unread`);
    if (incoming > 0) parts.push(`\u2709 ${incoming} waiting to connect`);
    if (parts.length > 0) {
      let line = parts.join("  \xB7  ");
      line += unread > 0 ? " \u2014 run: terminalhire chat" : " \u2014 run: terminalhire intro --list";
      return line;
    }
    if (stale) {
      return "\u26A0 terminalhire session expired \u2014 run: terminalhire link";
    }
    return "";
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
