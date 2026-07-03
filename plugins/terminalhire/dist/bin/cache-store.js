// bin/cache-store.js
import { readFileSync, writeFileSync, mkdirSync, renameSync } from "fs";
import { join } from "path";
import { homedir } from "os";
var TERMINALHIRE_DIR = process.env.TERMINALHIRE_DIR || join(homedir(), ".terminalhire");
var INDEX_CACHE_FILE = join(TERMINALHIRE_DIR, "index-cache.json");
var SCHEMA_VERSION = 1;
var tmpCounter = 0;
function readCacheEntry() {
  try {
    return JSON.parse(readFileSync(INDEX_CACHE_FILE, "utf8"));
  } catch {
    return null;
  }
}
function updateIndexCache(patch) {
  mkdirSync(TERMINALHIRE_DIR, { recursive: true });
  const existing = readCacheEntry() ?? {};
  const entry = {
    ...existing,
    ...patch,
    schemaVersion: SCHEMA_VERSION,
    ts: Date.now()
  };
  const tmp = `${INDEX_CACHE_FILE}.${process.pid}.${tmpCounter++}.tmp`;
  writeFileSync(tmp, JSON.stringify(entry), "utf8");
  renameSync(tmp, INDEX_CACHE_FILE);
  return entry;
}
export {
  readCacheEntry,
  updateIndexCache
};
