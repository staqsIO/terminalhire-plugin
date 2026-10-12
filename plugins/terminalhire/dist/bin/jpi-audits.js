#!/usr/bin/env node

// bin/jpi-audits.js
import { readFile, stat } from "fs/promises";
import { basename as basename2, join as join3 } from "path";
import { createInterface } from "readline/promises";

// src/web-session.ts
import { chmodSync, existsSync, readFileSync, rmSync, writeFileSync } from "fs";
import { homedir as homedir2 } from "os";
import { join as join2 } from "path";

// src/api-base.ts
import { homedir } from "os";
import { basename, join, normalize } from "path";
var PROD_API_BASE = "https://terminalhire.com";
var DEV_API_BASE = "https://dev.terminalhire.com";
var ApiBaseError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "ApiBaseError";
  }
};
var ALLOWED_HOSTS = {
  "terminalhire.com": "https:",
  "www.terminalhire.com": "https:",
  "dev.terminalhire.com": "https:",
  localhost: "http:",
  "127.0.0.1": "http:"
};
var ALLOW_LOCAL_API_KEY = "TERMINALHIRE_ALLOW_LOCAL_API";
var ALLOWED_DESCRIPTION = [
  PROD_API_BASE,
  DEV_API_BASE,
  `http://localhost:<port> (requires ${ALLOW_LOCAL_API_KEY}=1)`,
  `http://127.0.0.1:<port> (requires ${ALLOW_LOCAL_API_KEY}=1)`
].join(", ");
var CANONICAL_REWRITES = {
  "www.terminalhire.com": PROD_API_BASE
};
var ENV_KEYS = ["TERMINALHIRE_API_URL", "JPI_API_URL"];
function sanitizeOverrideForError(raw) {
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return `(disallowed scheme: ${url.protocol.slice(0, -1)})`;
    }
    if (url.username !== "" || url.password !== "") {
      return `${url.protocol}//***@${url.host}`;
    }
    return url.origin;
  } catch {
    return "(unparseable override)";
  }
}
function isLoopbackOrigin(origin) {
  try {
    const host = new URL(origin).hostname;
    return host === "localhost" || host === "127.0.0.1";
  } catch {
    return false;
  }
}
function localApiAllowed(env) {
  return env[ALLOW_LOCAL_API_KEY] === "1";
}
function resolveApiBase(env = process.env) {
  for (const key of ENV_KEYS) {
    const raw = env[key];
    if (typeof raw !== "string") continue;
    const trimmed = raw.trim();
    if (trimmed === "") continue;
    const normalized = normalizeOverride(trimmed);
    if (normalized === null) {
      throw new ApiBaseError(
        `terminalhire: ${key}=${sanitizeOverrideForError(trimmed)} is not an allowed API host (allowed: ${ALLOWED_DESCRIPTION}). Refusing to continue so we do not silently hit production.`
      );
    }
    if (isLoopbackOrigin(normalized) && !localApiAllowed(env)) {
      throw new ApiBaseError(
        `terminalhire: ${key}=${normalized} is a loopback origin. Set ${ALLOW_LOCAL_API_KEY}=1 to talk to a local web app on purpose. Refusing so stored credentials cannot be exfiltrated to localhost by a poisoned override.`
      );
    }
    return normalized;
  }
  return PROD_API_BASE;
}
function normalizeOverride(raw) {
  let url;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.username !== "" || url.password !== "") return null;
  const expectedProtocol = ALLOWED_HOSTS[url.hostname];
  if (expectedProtocol === void 0) return null;
  if (url.protocol !== expectedProtocol) return null;
  if (url.hostname !== "localhost" && url.hostname !== "127.0.0.1" && url.port !== "") {
    return null;
  }
  const rewrite = CANONICAL_REWRITES[url.hostname];
  if (rewrite !== void 0) return rewrite;
  return url.origin;
}

// src/state-dir.ts
import { closeSync, constants, fchmodSync, fstatSync, mkdirSync, openSync } from "fs";

// src/web-session.ts
function terminalhireDir() {
  return process.env.TERMINALHIRE_DIR || join2(homedir2(), ".terminalhire");
}
function webSessionFilePath() {
  return join2(terminalhireDir(), "web-session");
}
function parseWebSessionFile(raw) {
  const trimmed = raw.trim();
  if (trimmed.length === 0) return null;
  if (!trimmed.startsWith("{")) return { token: trimmed, host: null };
  try {
    const parsed = JSON.parse(trimmed);
    if (typeof parsed !== "object" || parsed === null) return null;
    const rec = parsed;
    if (typeof rec.token !== "string" || rec.token.length === 0) return null;
    const host = typeof rec.host === "string" ? rec.host.trim() : "";
    return { token: rec.token, host: host === "" ? null : host };
  } catch {
    return null;
  }
}
function readWebSessionRecord() {
  try {
    const path = webSessionFilePath();
    if (!existsSync(path)) return null;
    return parseWebSessionFile(readFileSync(path, "utf8"));
  } catch {
    return null;
  }
}
function webSessionForHost(apiBase) {
  assertBase(apiBase, "webSessionForHost");
  const record = readWebSessionRecord();
  if (!record) return { cookie: null, mismatch: null };
  if (record.host !== null && record.host !== apiBase) {
    return { cookie: null, mismatch: { linkedHost: record.host, currentHost: apiBase } };
  }
  return { cookie: record.token, mismatch: null };
}
function webSessionCookieForHost(apiBase) {
  const fromFile = webSessionForHost(apiBase);
  if (fromFile.cookie || fromFile.mismatch) return fromFile;
  const env = process.env["TERMINALHIRE_WEB_SESSION"];
  return { cookie: typeof env === "string" && env.length > 0 ? env : null, mismatch: null };
}
function assertBase(apiBase, fn) {
  if (typeof apiBase !== "string" || apiBase.length === 0) {
    throw new TypeError(
      `${fn}(apiBase) requires the destination base as a non-empty string; received ${apiBase === "" ? "''" : String(apiBase)}. This is a wiring bug in the calling command, not a developer misconfiguration: pass the same resolveApiBase() value the request is sent to, so the session's host affinity can be checked (TERM-991).`
    );
  }
}
function hostLabel(base) {
  return String(base ?? "").replace(/^https?:\/\//, "");
}
function missingSessionLines(mismatch) {
  if (!mismatch) {
    return [
      "No linked web session found on this machine.",
      "Run `terminalhire link` to connect this terminal to your account, then re-run."
    ];
  }
  const linked = hostLabel(mismatch.linkedHost);
  const current = hostLabel(mismatch.currentHost);
  const reach = mismatch.linkedHost === PROD_API_BASE ? `unset TERMINALHIRE_API_URL to reach ${linked}` : isLoopbackOrigin(mismatch.linkedHost) ? `set TERMINALHIRE_ALLOW_LOCAL_API=1 TERMINALHIRE_API_URL=${mismatch.linkedHost} to reach ${linked}` : `set TERMINALHIRE_API_URL=${mismatch.linkedHost} to reach ${linked}`;
  const link = isLoopbackOrigin(mismatch.currentHost) ? "`TERMINALHIRE_ALLOW_LOCAL_OAUTH=1 terminalhire link`" : "`terminalhire link`";
  return [
    `This terminal is on ${current}, but your linked session belongs to ${linked}. Nothing was sent.`,
    `Either ${reach}, or run ${link} to link this terminal to ${current} instead.`
  ];
}
function refusedSessionLines(apiBase) {
  return [
    `${hostLabel(apiBase)} refused your linked session.`,
    "Run `terminalhire link` to link this terminal again, then re-run."
  ];
}

// bin/jpi-audits.js
var GH_SESSION_COOKIE = "__jpi_gh_session";
var REPORT_FILES = ["review.md", "writeup.md", "findings.json"];
var MAX_REPORT_BYTES = 2e6;
var ORDER_ID = /^ao_[a-zA-Z0-9_-]+$/;
var SHA = /^[a-fA-F0-9]{40}$/;
var USAGE = [
  "Usage: terminalhire audits <command> [--json]",
  "",
  "  list                         Paid and delivered human audits in the queue",
  "  show <id>                    What the poster asked, the commit, and how to clone it",
  "  take <id>                    Assign the order to you",
  "  release <id>                 Give the order back to the queue",
  "  publish <id> --dir <folder>  Dry-run, then publish review.md, writeup.md, findings.json",
  "      [--dry-run] [--notify] [--commit <sha>] [--commit-override]",
  "",
  "For TerminalHire reviewers on the allowlist. Run `terminalhire link` first.",
  "Exit codes: 0 done; 1 usage, network or server failure, and HTTP 408/429 (try again);",
  "2 refused by the server (any other 4xx, including an expired session)."
].join("\n");
var UsageError = class extends Error {
};
function parseAuditsArgs(args) {
  const out = {
    command: args[0] ?? "",
    id: "",
    dir: "",
    commit: "",
    json: false,
    dryRun: false,
    notify: false,
    commitOverride: false
  };
  const flags = {
    "--json": "json",
    "--dry-run": "dryRun",
    "--notify": "notify",
    "--commit-override": "commitOverride"
  };
  const values = { "--dir": "dir", "--commit": "commit" };
  const rest = args.slice(1);
  const seen = /* @__PURE__ */ new Set();
  for (let i = 0; i < rest.length; i++) {
    const arg = rest[i];
    if (Object.hasOwn(flags, arg) || Object.hasOwn(values, arg)) {
      if (seen.has(arg)) throw new UsageError(`${arg} given twice.`);
      seen.add(arg);
    }
    if (Object.hasOwn(flags, arg)) out[flags[arg]] = true;
    else if (Object.hasOwn(values, arg)) {
      const value = rest[i + 1];
      if (!value || value.startsWith("--")) throw new UsageError(`${arg} needs a value.`);
      out[values[arg]] = value;
      i++;
    } else if (!arg.startsWith("--") && !out.id) out.id = arg;
    else throw new UsageError(`Unexpected argument: ${arg}`);
  }
  const needsId = ["show", "take", "release", "publish"];
  if (!["list", ...needsId].includes(out.command))
    throw new UsageError(out.command ? `Unknown audits command: ${out.command}` : "");
  if (out.command === "list" && out.id) throw new UsageError("list takes no order id.");
  if (needsId.includes(out.command) && !ORDER_ID.test(out.id))
    throw new UsageError("Give the order id, which starts with ao_.");
  const publishOnly = out.dir || out.commit || out.dryRun || out.notify || out.commitOverride;
  if (out.command !== "publish" && publishOnly)
    throw new UsageError(
      "--dir, --commit, --dry-run, --notify and --commit-override are for publish."
    );
  if (out.command === "publish") {
    if (!out.dir) throw new UsageError("publish needs --dir <folder>.");
    if (out.commit && !SHA.test(out.commit))
      throw new UsageError("--commit must be a full 40-character SHA.");
    if (out.commitOverride && !out.commit)
      throw new UsageError("--commit-override needs --commit <sha>, the commit you reviewed.");
    out.commit = out.commit.toLowerCase();
  }
  return out;
}
async function loadReportFiles(dir) {
  const paths = REPORT_FILES.map((name) => join3(dir, name));
  let sizes;
  try {
    sizes = await Promise.all(paths.map((path) => stat(path)));
  } catch {
    throw new UsageError(`${dir} must contain ${REPORT_FILES.join(", ")}.`);
  }
  if (sizes.some((size) => !size.isFile()) || sizes.reduce((sum, size) => sum + size.size, 0) > MAX_REPORT_BYTES)
    throw new UsageError("Report files must total at most 2 MB.");
  const [reviewMd, writeupMd, findings] = await Promise.all(
    paths.map((path) => readFile(path, "utf8"))
  );
  let parsed;
  try {
    parsed = JSON.parse(findings);
  } catch {
    throw new UsageError("findings.json is not valid JSON.");
  }
  return { reviewMd, writeupMd, findings: parsed };
}
async function confirmOnTty(repo) {
  if (!process.stdin.isTTY)
    throw new UsageError("Publishing to production needs an interactive terminal.");
  const prompt = createInterface({ input: process.stdin, output: process.stderr });
  try {
    return await prompt.question(`Type ${repo} to publish to production: `);
  } finally {
    prompt.close();
  }
}
var REFUSALS = {
  forbidden: "Your GitHub login is not on the reviewer list for this host.",
  "bad-origin": "The server refused the request origin.",
  "not-found": "No paid or delivered human audit has that id.",
  taken: "Another reviewer holds this order. It can be taken once they release it.",
  "not-deliverable": "This order is not a paid or delivered human audit.",
  "not-holder": "You do not hold this order, so you cannot release it.",
  "not-assignee": "You do not hold this order. Run `terminalhire audits take <id>` first."
};
function refusalLine(status, body) {
  const error = typeof body?.error === "string" ? body.error : "";
  if (status === 422) {
    const field = typeof body?.field === "string" && /^[\w.[\]]{1,160}$/.test(body.field) ? body.field : "";
    if (field === "confirmRepo")
      return "Production needs the repository name typed to publish. Nothing was published.";
    if (field === "commitSha")
      return "The commit does not match the order. Use --commit with --commit-override only for an agreed change of scope.";
    return `The server refused the report${field ? `: field ${field}` : ""}.`;
  }
  return REFUSALS[error] ?? `The server refused the request (HTTP ${status}${error ? `, ${error}` : ""}).`;
}
var Refused = class extends Error {
  constructor(status, body) {
    super(refusalLine(status, body));
    this.status = status;
    this.body = body;
  }
};
var Failed = class extends Error {
};
function dateOnly(iso) {
  return typeof iso === "string" ? iso.slice(0, 10) : "\u2014";
}
function indent(text) {
  return String(text).split("\n").map((line) => `    ${line}`).join("\n");
}
function listWithMore(items, more) {
  return `${items.join(", ")}${more > 0 ? ` and ${more} more` : ""}`;
}
var CONTROL_CHARS = /[\u0000-\u0008\u000B-\u001F\u007F-\u009F]/g;
function printable(value) {
  if (typeof value === "string") return value.replace(CONTROL_CHARS, "");
  if (Array.isArray(value)) return value.map(printable);
  if (value && typeof value === "object")
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, printable(v)]));
  return value;
}
function formatOrderList(rawOrders) {
  const orders = printable(rawOrders);
  if (orders.length === 0) return ["No paid or delivered human audits in the queue."];
  const lines = [];
  for (const o of orders) {
    const holder = o.assignedLogin ? `held by ${o.assignedLogin}` : "unassigned";
    const report = o.reportVersion ? `report v${o.reportVersion}` : "no report";
    lines.push(`${o.id}  ${o.status}  ${o.repoFullName}@${String(o.commitSha).slice(0, 7)}`);
    lines.push(`    paid ${dateOnly(o.paidAt)} \xB7 ${holder} \xB7 ${report}`);
    const question = o.answers?.question;
    if (question) {
      const first = question.split("\n")[0];
      lines.push(`    Q: ${first.length > 100 ? `${first.slice(0, 100)}\u2026` : first}`);
    }
  }
  return lines;
}
function cloneCommands(order) {
  const dir = `./${basename2(order.repoFullName)}`;
  return [
    `git clone https://github.com/${order.repoFullName}.git ${dir}`,
    `git -C ${dir} checkout --detach ${order.commitSha}`
  ];
}
function formatOrder(rawOrder) {
  const order = printable(rawOrder);
  const a = order.answers;
  const lines = [
    `Order:      ${order.id} (${order.status})`,
    `Repository: ${order.repoFullName}`,
    `Commit:     ${order.commitSha}`,
    `Paid:       ${dateOnly(order.paidAt)}`
  ];
  if (order.deliveredAt) lines.push(`Delivered:  ${dateOnly(order.deliveredAt)}`);
  lines.push(
    `Assigned:   ${order.assignedLogin ? `${order.assignedLogin} since ${dateOnly(order.assignedAt)}` : "nobody \u2014 run `terminalhire audits take " + order.id + "`"}`,
    `Report:     ${order.reportVersion ? `version ${order.reportVersion}, published ${dateOnly(order.reportPublishedAt)}` : "not published yet"}`,
    "",
    "What the poster asked:"
  );
  if (!a) lines.push("  (no answers on the quote page)");
  else {
    if (a.question) lines.push("  Question:", indent(a.question));
    if (a.context) lines.push("  The codebase:", indent(a.context));
    if (a.worry?.length) lines.push(`  Worries: ${a.worry.join(", ")}`);
    if (a.worryDetail) lines.push(indent(a.worryDetail));
    if (a.units?.length) lines.push(`  Don't worry about: ${listWithMore(a.units, a.unitsMore)}`);
    if (a.notOurs?.length) lines.push(`  Not theirs: ${listWithMore(a.notOurs, a.notOursMore)}`);
  }
  lines.push("", "Clone at the paid commit:", ...cloneCommands(order).map((c) => `  ${c}`));
  return lines;
}
function previewLines(preview) {
  return [
    `Repository: ${preview.repoFullName}`,
    `Commit: ${preview.commitSha}`,
    `Findings: ${preview.findings.high} high, ${preview.findings.medium} medium, ${preview.findings.low} low`,
    `Words: ${preview.reviewWords} review, ${preview.writeupWords} write-up`,
    `Next version: ${preview.version}`
  ];
}
var EMAIL_REASONS = /* @__PURE__ */ new Set([
  "email-unconfigured",
  "order-unavailable",
  "no-checkout-session",
  "report-unavailable",
  "no-checkout-address"
]);
function publishedLines(result, apiBase, id) {
  const lines = [
    `Published version ${result.version}: ${apiBase}/audit/order/${encodeURIComponent(id)}`
  ];
  if (result.emailed === true) lines.push("Report email accepted for delivery.");
  else {
    const reason = EMAIL_REASONS.has(result.notification?.reason) ? result.notification.reason : ["skipped", "failed", "not-requested"].includes(result.notification?.status) ? result.notification.status : "unknown";
    lines.push(`Email not sent: ${reason}. Re-run with --notify to try again.`);
  }
  lines.push("Cleanup:", "- Remove our repository access.");
  if (result.deliveredAt) {
    const deadline = new Date(
      new Date(result.deliveredAt).getTime() + 7 * 864e5
    ).toISOString();
    lines.push(`- Delete local clones and other repository copies by ${deadline}.`);
  } else
    lines.push("- Delivery date is missing. Check the order before setting a deletion deadline.");
  return lines;
}
var defaults = {
  apiBase: () => resolveApiBase(),
  session: (apiBase) => webSessionCookieForHost(apiBase),
  fetchImpl: (...args) => globalThis.fetch(...args),
  loadFiles: loadReportFiles,
  confirm: confirmOnTty,
  out: (line) => console.log(line),
  err: (line) => console.error(line)
};
async function runAudits(args, overrides = {}) {
  const deps = { ...defaults, ...overrides };
  let opts;
  try {
    opts = parseAuditsArgs(args);
  } catch (error) {
    if (error.message) deps.err(error.message);
    deps.err(USAGE);
    return 1;
  }
  let apiBase;
  try {
    apiBase = deps.apiBase();
  } catch (error) {
    deps.err(error instanceof Error ? error.message : String(error));
    return 1;
  }
  const { cookie, mismatch } = deps.session(apiBase);
  if (!cookie) {
    for (const line of missingSessionLines(mismatch)) deps.err(line);
    return 1;
  }
  if (!/^[\x21-\x7e]+$/.test(cookie)) {
    deps.err(
      "The linked session is malformed. Run `terminalhire link` to link this terminal again."
    );
    return 1;
  }
  const call = async (method, path, body) => {
    let res;
    try {
      res = await deps.fetchImpl(`${apiBase}/api/reviewer/audits${path}`, {
        method,
        redirect: "error",
        headers: {
          Cookie: `${GH_SESSION_COOKIE}=${cookie}`,
          ...body ? { "Content-Type": "application/json" } : {}
        },
        ...body ? { body: JSON.stringify(body) } : {},
        signal: AbortSignal.timeout(body ? 6e4 : 15e3)
      });
    } catch (error) {
      const code = error?.cause?.code ?? error?.code;
      const what = typeof code === "string" && /^[A-Z0-9_]{1,40}$/.test(code) ? code : error?.name === "TimeoutError" ? "timed out" : error?.constructor?.name ?? "error";
      throw new Failed(`Could not reach ${apiBase} (${what}).`);
    }
    const status = res.status;
    let json = null;
    try {
      json = await res.json();
    } catch {
    }
    const answer = json && typeof json === "object" && !Array.isArray(json) ? json : { ok: false, error: `http-${status}` };
    if (status === 408 || status === 429)
      throw new Failed(`${apiBase} asked us to slow down (HTTP ${status}). Try again shortly.`);
    if (status === 401) {
      const error = new Refused(401, answer);
      error.message = refusedSessionLines(apiBase).join("\n");
      throw error;
    }
    if (status >= 400 && status < 500) throw new Refused(status, answer);
    if (!res.ok || json === null || json.ok === false)
      throw new Failed(`${apiBase} could not answer (HTTP ${status}). Try again shortly.`);
    return json;
  };
  const order = (id) => `/${encodeURIComponent(id)}`;
  try {
    switch (opts.command) {
      case "list": {
        const json = await call("GET", "");
        if (opts.json) deps.out(JSON.stringify(json, null, 2));
        else {
          deps.out(`Signed in as ${json.login}. ${json.orders.length} order(s):`);
          for (const line of formatOrderList(json.orders)) deps.out(line);
        }
        return 0;
      }
      case "show": {
        const json = await call("GET", order(opts.id));
        const { cloneHint: _hint, ...rest } = json.order;
        if (opts.json)
          deps.out(
            JSON.stringify(
              { ...json, order: { ...rest, cloneCommands: cloneCommands(rest) } },
              null,
              2
            )
          );
        else for (const line of formatOrder(json.order)) deps.out(line);
        return 0;
      }
      case "take": {
        const json = await call("POST", `${order(opts.id)}/take`, {});
        if (opts.json) deps.out(JSON.stringify(json, null, 2));
        else
          deps.out(
            json.alreadyHeld ? `You already hold ${opts.id}.` : `You hold ${opts.id}. Run \`terminalhire audits show ${opts.id}\` for the brief.`
          );
        return 0;
      }
      case "release": {
        const json = await call("POST", `${order(opts.id)}/release`, {});
        if (opts.json) deps.out(JSON.stringify(json, null, 2));
        else deps.out(`Released ${opts.id} back to the queue.`);
        return 0;
      }
      case "publish":
        return await publish(opts, deps, call, order(opts.id), apiBase);
    }
  } catch (error) {
    if (error instanceof Refused) {
      if (opts.json) deps.out(JSON.stringify({ status: error.status, ...error.body }, null, 2));
      for (const line of error.message.split("\n")) deps.err(line);
      return 2;
    }
    deps.err(error instanceof Error ? error.message : String(error));
    return 1;
  }
  return 1;
}
async function publish(opts, deps, call, orderPath, apiBase) {
  const files = await deps.loadFiles(opts.dir);
  const commitSha = opts.commit || (await call("GET", orderPath)).order.commitSha;
  const body = {
    ...files,
    commitSha,
    notify: opts.notify,
    commitOverride: opts.commitOverride
  };
  const preview = await call("POST", `${orderPath}/publish`, { ...body, dryRun: true });
  const say = opts.json ? deps.err : deps.out;
  for (const line of previewLines(preview)) say(line);
  if (opts.commitOverride) say("Commit override requested. Both commits will be recorded.");
  if (opts.dryRun) {
    if (opts.json) deps.out(JSON.stringify({ preview }, null, 2));
    say("Dry run complete. Nothing was published.");
    return 0;
  }
  const extra = {};
  if (apiBase === PROD_API_BASE) {
    const typed = String(await deps.confirm(preview.repoFullName)).trim();
    if (typed !== preview.repoFullName)
      throw new UsageError("Repository name did not match. Nothing was published.");
    extra.confirmRepo = typed;
  }
  const result = await call("POST", `${orderPath}/publish`, { ...body, ...extra, dryRun: false });
  if (opts.json) deps.out(JSON.stringify({ preview, result }, null, 2));
  for (const line of publishedLines(result, apiBase, opts.id)) say(line);
  return 0;
}
async function run(args = process.argv.slice(3)) {
  return runAudits(args);
}
export {
  USAGE,
  cloneCommands,
  formatOrder,
  formatOrderList,
  loadReportFiles,
  parseAuditsArgs,
  previewLines,
  publishedLines,
  run,
  runAudits
};
