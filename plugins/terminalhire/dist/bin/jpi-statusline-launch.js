#!/usr/bin/env node

// bin/jpi-statusline-launch.js
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";
import { spawnSync } from "child_process";
import { pathToFileURL } from "url";
var TH_DIR = process.env.TERMINALHIRE_DIR || join(homedir(), ".terminalhire");
var POINTER = join(TH_DIR, "engine-path");
var FOREIGN = join(TH_DIR, "statusline-foreign.json");
function firstLine(buf) {
  if (!buf || !buf.length) return "";
  const s = Buffer.isBuffer(buf) ? buf.toString("utf8") : String(buf);
  const nl = s.indexOf("\n");
  return (nl === -1 ? s : s.slice(0, nl)).replace(/\s+$/u, "");
}
async function renderOurs(input) {
  let engine = "";
  try {
    if (!existsSync(POINTER)) return "";
    engine = readFileSync(POINTER, "utf8").trim();
  } catch {
    return "";
  }
  if (!engine || !existsSync(engine)) return "";
  try {
    const line = await Promise.race([
      import(pathToFileURL(engine).href).then(
        (mod) => mod && typeof mod.render === "function" ? firstLine(mod.render()) : null
      ),
      new Promise((resolve) => setTimeout(() => resolve(void 0), 30))
    ]);
    if (typeof line === "string") return line;
  } catch {
  }
  try {
    const r = spawnSync(process.execPath, [engine], { input, timeout: 800 });
    return firstLine(r.stdout);
  } catch {
    return "";
  }
}
function renderForeign(input) {
  try {
    if (!existsSync(FOREIGN)) return "";
    const saved = JSON.parse(readFileSync(FOREIGN, "utf8"));
    const cmd = saved && saved.statusLine && saved.statusLine.command;
    if (!cmd) return "";
    const r = spawnSync(cmd, { shell: true, input, timeout: 4e3 });
    return firstLine(r.stdout);
  } catch {
    return "";
  }
}
try {
  let input = Buffer.alloc(0);
  try {
    if (!process.stdin.isTTY) input = readFileSync(0);
  } catch {
  }
  const segments = [];
  const foreign = renderForeign(input);
  if (foreign) segments.push(foreign);
  const ours = await renderOurs(input);
  if (ours) segments.push(ours);
  if (segments.length > 0) process.stdout.write(segments.join("  \xB7  ") + "\n");
  process.exit(0);
} catch {
  process.exit(0);
}
