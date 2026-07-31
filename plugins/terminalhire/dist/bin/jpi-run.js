#!/usr/bin/env node

// bin/jpi-run.js
import { existsSync, readFileSync } from "fs";
import { join, resolve } from "path";
import { tmpdir } from "os";
import { mkdtempSync, rmSync } from "fs";
var USAGE = `terminalhire run \u2014 verify your working diff in a fresh container

Usage:
  th run [options]

Options:
  --claim <id>          The claim this work belongs to.
  --target <git-url>    Repository the work is verified against.
  --sha <40-hex>        The commit your diff applies on top of.
  --slice <a,b,c>       Comma-separated files this claim shares. A diff touching
                        anything else is refused locally, before any container.
  --local <dir>         Checkout to read the working diff from (default: cwd).
  --watch               Re-run when a file in the checkout changes.
  --json                Print the run result as JSON instead of a report.
  --no-preview          Skip the preview URL.
  --keep <seconds>      Hold the preview open this long (default: until Ctrl-C).
  --test-command <cmd>  Disclosed override of the derived test command.
  --help

Defaults are read from .th-run.json in the local checkout when present, so a
claim you run repeatedly needs no flags. Every flag overrides the file.

Needs Docker running. Needs network for the first clone of the target.`;
function parseArgs(argv) {
  const out = { flags: {}, bools: /* @__PURE__ */ new Set() };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;
    const name = arg.slice(2);
    if (["watch", "json", "no-preview", "help", "verbose"].includes(name)) {
      out.bools.add(name);
      continue;
    }
    const next = argv[i + 1];
    if (next === void 0 || next.startsWith("--")) {
      throw new Error(`terminalhire: --${name} needs a value`);
    }
    out.flags[name] = next;
    i += 1;
  }
  return out;
}
function runScratchRoot() {
  const root = mkdtempSync(join(tmpdir(), "th-run-"));
  let cleaned = false;
  const cleanup = () => {
    if (cleaned) return;
    cleaned = true;
    try {
      rmSync(root, { recursive: true, force: true });
    } catch {
    }
  };
  process.on("exit", cleanup);
  for (const sig of ["SIGINT", "SIGTERM", "SIGHUP"]) {
    process.on(sig, () => {
      cleanup();
      process.exit(130);
    });
  }
  return { root, cleanup };
}
async function loadEngine() {
  try {
    return await import("@terminalhire/envrun");
  } catch (err) {
    throw new Error(
      `terminalhire: \`run\` needs the @terminalhire/envrun engine, which is not installed here.
It drives Docker and is not published, so this verb works from a monorepo checkout today. Run \`npm run -w @terminalhire/envrun build\` there first.
(resolution error: ${err && err.message ? err.message : String(err)})`
    );
  }
}
function readConfig(localDir) {
  const file = join(localDir, ".th-run.json");
  if (!existsSync(file)) return {};
  try {
    const parsed = JSON.parse(readFileSync(file, "utf8"));
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (err) {
    throw new Error(
      `terminalhire: ${file} is not readable JSON (${err && err.message ? err.message : String(err)}). Fix or remove it \u2014 a config we cannot read is not a config we should guess at.`
    );
  }
}
function requireField(value, name, hint) {
  if (typeof value === "string" && value.trim() !== "") return value.trim();
  throw new Error(`terminalhire: run needs ${name}. ${hint}`);
}
async function once(engine, opts) {
  const { root } = opts.scratch;
  const started = Date.now();
  const outcome = await engine.verifyWorkingDiff({
    claimId: opts.claimId,
    localRepoDir: opts.localDir,
    sliceFiles: opts.slice,
    targetRepo: opts.target,
    targetSha: opts.sha,
    scratchRoot: root,
    preview: opts.preview,
    ...opts.testCommand ? { testCommandOverride: opts.testCommand } : {},
    onProgress: (stage, detail) => {
      if (!opts.json) process.stderr.write(`  ${stage.padEnd(8)} ${detail}
`);
    }
  });
  const { result, preview } = outcome;
  if (opts.json) {
    process.stdout.write(`${JSON.stringify(result, null, 2)}
`);
  } else {
    process.stdout.write(`
${engine.renderRunReport(result)}
`);
  }
  if (preview) {
    if (opts.keepSeconds !== null) {
      await new Promise((r) => setTimeout(r, opts.keepSeconds * 1e3));
      preview.teardown();
    } else if (!opts.watch) {
      process.stderr.write(
        `
Preview is live at ${preview.url} \u2014 press Ctrl-C to tear it down.
Expiry and revocation are not built yet (TERM-350 phase 5); Ctrl-C is the only stop.
`
      );
      await new Promise((resolve_) => {
        process.on("SIGINT", () => {
          preview.teardown();
          resolve_();
        });
      });
    } else {
      preview.teardown();
    }
  }
  if (!opts.json) {
    process.stderr.write(`  total    ${String(Date.now() - started)}ms
`);
  }
  if (result.status === "refused") return 2;
  return result.outcome === "completed" ? 0 : 1;
}
async function run() {
  const argv = process.argv.slice(2);
  const parsed = parseArgs(argv);
  if (parsed.bools.has("help") || argv.length === 0) {
    process.stdout.write(`${USAGE}
`);
    return 0;
  }
  const localDir = resolve(parsed.flags["local"] ?? process.cwd());
  const config = readConfig(localDir);
  const pick = (name) => parsed.flags[name] ?? config[name];
  const sliceRaw = pick("slice");
  const slice = Array.isArray(sliceRaw) ? sliceRaw : typeof sliceRaw === "string" ? sliceRaw.split(",").map((s) => s.trim()).filter((s) => s.length > 0) : [];
  if (slice.length === 0) {
    throw new Error(
      'terminalhire: run needs --slice (or a "slice" array in .th-run.json). An empty slice means nothing may be touched, so every diff would be refused \u2014 that is almost never what you meant, so it is an error rather than a silent refusal.'
    );
  }
  const opts = {
    claimId: requireField(pick("claim"), "--claim", "It is the id the result is filed under."),
    target: requireField(pick("target"), "--target", "e.g. https://github.com/koajs/koa.git"),
    sha: requireField(pick("sha"), "--sha", "The full 40-character commit your diff applies to."),
    slice,
    localDir,
    preview: !parsed.bools.has("no-preview"),
    watch: parsed.bools.has("watch"),
    json: parsed.bools.has("json"),
    testCommand: pick("test-command") ?? null,
    keepSeconds: pick("keep") === void 0 ? null : Number(pick("keep")),
    scratch: runScratchRoot()
  };
  if (!/^[0-9a-f]{40}$/.test(opts.sha)) {
    throw new Error(
      `terminalhire: --sha must be a full 40-character commit, got ${JSON.stringify(opts.sha)}. An abbreviated sha cannot be checked against what was actually fetched.`
    );
  }
  const engine = await loadEngine();
  if (!opts.watch) return once(engine, opts);
  const { watch } = await import("fs");
  let last = await once(engine, opts);
  let timer = null;
  let running = false;
  process.stderr.write("\nwatching for changes \u2014 Ctrl-C to stop\n");
  watch(opts.localDir, { recursive: true }, (_event, filename) => {
    if (typeof filename === "string" && filename.includes(".git/")) return;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      if (running) return;
      running = true;
      once(engine, opts).then((code) => {
        last = code;
      }).catch((err) => {
        process.stderr.write(`${err && err.message ? err.message : String(err)}
`);
      }).finally(() => {
        running = false;
      });
    }, 500);
  });
  await new Promise(() => {
  });
  return last;
}
if (process.argv[1] && process.argv[1].endsWith("jpi-run.js")) {
  run().then((code) => process.exit(code ?? 0)).catch((err) => {
    process.stderr.write(`${err && err.message ? err.message : String(err)}
`);
    process.exit(1);
  });
}
export {
  run
};
