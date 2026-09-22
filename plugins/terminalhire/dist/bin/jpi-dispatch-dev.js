#!/usr/bin/env node

// bin/jpi-dispatch-dev.js
import { spawn } from "child_process";
import { dirname, join as join2 } from "path";
import { fileURLToPath } from "url";

// src/api-base.ts
import { homedir } from "os";
import { basename, join, normalize } from "path";
var PROD_API_BASE = "https://terminalhire.com";
var DEV_API_BASE = "https://dev.terminalhire.com";
var DEV_STATE_DIR_NAME = ".terminalhire-dev";
var ALLOW_LOCAL_API_KEY = "TERMINALHIRE_ALLOW_LOCAL_API";
var ALLOWED_DESCRIPTION = [
  PROD_API_BASE,
  DEV_API_BASE,
  `http://localhost:<port> (requires ${ALLOW_LOCAL_API_KEY}=1)`,
  `http://127.0.0.1:<port> (requires ${ALLOW_LOCAL_API_KEY}=1)`
].join(", ");
function pinToDevApiBase(env = process.env) {
  env["TERMINALHIRE_API_URL"] = DEV_API_BASE;
  env["TERMINALHIRE_DIR"] = env["TERMINALHIRE_DIR"] || join(homedir(), DEV_STATE_DIR_NAME);
  return DEV_API_BASE;
}

// bin/jpi-dispatch-dev.js
pinToDevApiBase();
var dispatch = join2(dirname(fileURLToPath(import.meta.url)), "jpi-dispatch.js");
var child = spawn(process.execPath, [dispatch, ...process.argv.slice(2)], {
  stdio: "inherit",
  env: process.env
});
child.on("error", (err) => {
  const msg = err instanceof Error ? err.message : String(err);
  try {
    process.stderr.write(`terminalhiredev: failed to start the CLI: ${msg}
`);
  } catch {
  }
  process.exit(1);
});
child.on("exit", (code, signal) => {
  if (signal) {
    try {
      process.kill(process.pid, signal);
      return;
    } catch {
      process.exit(1);
    }
  }
  process.exit(code ?? 1);
});
