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

// ../../packages/envrun/dist/classify.js
function readCounts(stdout, stderr = "") {
  const out = `${stdout}
${stderr}`;
  for (const reader of READERS) {
    const counts = reader.read(out);
    if (counts)
      return { ...counts, runner: reader.runner };
  }
  return null;
}
function isCommandUnavailable(facts, countsRead) {
  if (facts.exitCode === 127 || facts.exitCode === 126)
    return true;
  if (countsRead)
    return false;
  if (facts.exitCode === 0 || facts.exitCode === null)
    return false;
  return facts.stdout.trim().length === 0 && EXEC_FAILURE.test(facts.stderr);
}
function classifyVerification(facts) {
  if (facts.timedOut) {
    return {
      outcome: "budget-exceeded",
      counts: null,
      reason: "the run was killed for exceeding its time budget, so no result is trustworthy"
    };
  }
  const counts = readCounts(facts.stdout, facts.stderr);
  if (isCommandUnavailable(facts, counts !== null)) {
    return {
      outcome: "test-command-unavailable",
      counts,
      reason: `the test command could not be invoked (exit ${String(facts.exitCode)}). This is an environment failure on our side \u2014 a missing interpreter, a binary outside PATH, or a dependency installed somewhere the command cannot see it. The repo has not been judged.`
    };
  }
  if (counts !== null) {
    if (counts.tests_failed > 0) {
      return {
        outcome: "tests-failed",
        counts,
        reason: `${String(counts.tests_failed)} test(s) failed (read by the ${counts.runner} reporter)`
      };
    }
    if (facts.exitCode !== 0) {
      return {
        outcome: "tests-failed",
        counts,
        reason: `no test reported a failure but the command exited ${String(facts.exitCode)} (${counts.runner}); something outside the assertions failed`
      };
    }
    if (counts.tests_passed > 0) {
      return {
        outcome: "completed",
        counts,
        reason: `${String(counts.tests_passed)} test(s) passed, none failed (${counts.runner})`
      };
    }
    return {
      outcome: "no-tests-observed",
      counts,
      reason: `the ${counts.runner} reporter was read and reports zero tests passed and zero failed \u2014 the suite genuinely ran nothing`
    };
  }
  if (facts.exitCode === 0) {
    return {
      outcome: "counts-unparsed",
      counts: null,
      reason: 'the command exited 0 but no supported reporter format was found in its output, so the number of tests that ran is UNKNOWN. Not the same as "nothing ran": reporting that would tell a developer their passing work is unverified. Supported formats: ' + SUPPORTED_RUNNERS.join(", ")
    };
  }
  return {
    outcome: "tests-failed",
    counts: null,
    reason: `the command exited ${String(facts.exitCode)} and no reporter format could be read. A nonzero exit that is not an invocation failure is a failure we can name, even without counts.`
  };
}
function isGreen(outcome) {
  return outcome === "completed";
}
function isOurFault(outcome) {
  return outcome === "test-command-unavailable" || outcome === "counts-unparsed";
}
var int, READERS, SUPPORTED_RUNNERS, EXEC_FAILURE;
var init_classify = __esm({
  "../../packages/envrun/dist/classify.js"() {
    "use strict";
    int = (m, i = 1) => m ? Number(m[i]) : 0;
    READERS = [
      {
        // `node --test` TAP. Anchored to line start, which is what makes it a
        // protocol match rather than a phrase match.
        runner: "node --test (TAP)",
        read: (out) => {
          const pass = /^# pass (\d+)$/m.exec(out);
          const fail = /^# fail (\d+)$/m.exec(out);
          if (!pass || !fail)
            return null;
          return { tests_passed: int(pass), tests_failed: int(fail) };
        }
      },
      {
        // jest: `Tests:       1 failed, 2 passed, 3 total`
        runner: "jest",
        read: (out) => {
          const line = /^Tests:\s+(.+?)\s*$/m.exec(out);
          if (!line || !/\btotal\b/.test(line[1]))
            return null;
          return {
            tests_passed: int(/(\d+) passed/.exec(line[1])),
            tests_failed: int(/(\d+) failed/.exec(line[1]))
          };
        }
      },
      {
        // vitest: `Tests  3 passed (3)` / `Tests  1 failed | 2 passed (3)`
        runner: "vitest",
        read: (out) => {
          const line = /^\s*Tests\s+([^\n]*\(\d+\))\s*$/m.exec(out);
          if (!line)
            return null;
          const passed = /(\d+) passed/.exec(line[1]);
          const failed = /(\d+) failed/.exec(line[1]);
          if (!passed && !failed)
            return null;
          return { tests_passed: int(passed), tests_failed: int(failed) };
        }
      },
      {
        // pytest summary rule: `===== 297 passed in 0.54s =====`,
        // `=== 1 failed, 296 passed in 0.6s ===`, `=== no tests ran in 0.01s ===`.
        // `no tests ran` is POSITIVE evidence of zero, so it returns {0,0} rather
        // than null — that is the distinction this module is about.
        runner: "pytest",
        read: (out) => {
          const all = [
            ...out.matchAll(/^=+ ([^\n]*?(?:passed|failed|error|no tests ran)[^\n]*?) =+$/gm)
          ];
          const line = all.at(-1);
          if (!line)
            return null;
          if (/no tests ran/.test(line[1]))
            return { tests_passed: 0, tests_failed: 0 };
          const passed = /(\d+) passed/.exec(line[1]);
          const failed = /(\d+) failed/.exec(line[1]);
          const errors = /(\d+) error/.exec(line[1]);
          if (!passed && !failed && !errors)
            return null;
          return { tests_passed: int(passed), tests_failed: int(failed) + int(errors) };
        }
      },
      {
        // mocha: `  440 passing (1s)` and `  2 failing`
        runner: "mocha",
        read: (out) => {
          const passing = /^\s*(\d+) passing\b/m.exec(out);
          const failing = /^\s*(\d+) failing\b/m.exec(out);
          if (!passing && !failing)
            return null;
          return { tests_passed: int(passing), tests_failed: int(failing) };
        }
      },
      {
        // ava: `  3 tests passed` / `  1 test failed`
        runner: "ava",
        read: (out) => {
          const passed = /^\s*(\d+) tests? passed\b/m.exec(out);
          const failed = /^\s*(\d+) tests? failed\b/m.exec(out);
          if (!passed && !failed)
            return null;
          return { tests_passed: int(passed), tests_failed: int(failed) };
        }
      },
      {
        // uvu: a `Total:` / `Passed:` / `Skipped:` block.
        runner: "uvu",
        read: (out) => {
          const total = /^\s*Total:\s+(\d+)/m.exec(out);
          const passed = /^\s*Passed:\s+(\d+)/m.exec(out);
          if (!total || !passed)
            return null;
          const t = int(total);
          const p = int(passed);
          return { tests_passed: p, tests_failed: Math.max(0, t - p) };
        }
      }
    ];
    SUPPORTED_RUNNERS = READERS.map((r) => r.runner);
    EXEC_FAILURE = /(?:command not found|: not found|No such file or directory|ENOENT)/;
  }
});

// ../../packages/containment/dist/env.js
import { homedir } from "os";
import { posix } from "path";
function realHomeCandidates(source) {
  const candidates = [];
  const fromEnv = source["HOME"];
  if (typeof fromEnv === "string" && fromEnv !== "")
    candidates.push(fromEnv);
  let fromOs;
  try {
    fromOs = homedir();
  } catch {
    fromOs = void 0;
  }
  if (typeof fromOs === "string" && fromOs !== "" && !candidates.includes(fromOs)) {
    candidates.push(fromOs);
  }
  if (candidates.length === 0) {
    throw new SandboxEnvError("cannot resolve the real home directory: HOME is unset and os.homedir() returned nothing, so the jailHome-is-real-HOME check cannot be evaluated \u2014 refusing to build a sandbox environment whose guard would have to be skipped");
  }
  return candidates;
}
function scrubEnv(source, opts) {
  const { jailHome, tmpDir } = opts;
  if (!jailHome.startsWith("/")) {
    throw new SandboxEnvError(`jailHome must be an absolute path, got ${JSON.stringify(jailHome)}`);
  }
  if (!tmpDir.startsWith("/")) {
    throw new SandboxEnvError(`tmpDir must be an absolute path, got ${JSON.stringify(tmpDir)}`);
  }
  for (const realHome of realHomeCandidates(source)) {
    if (jailHome === realHome || jailHome === `${realHome}/`) {
      throw new SandboxEnvError("jailHome is the real HOME \u2014 the sandbox would read the user profile");
    }
  }
  const env = {};
  for (const key of ENV_ALLOWLIST) {
    const value = source[key];
    if (typeof value === "string" && value !== "")
      env[key] = value;
  }
  env["PATH"] = [...opts.toolPaths ?? [], ...BASE_PATH].join(":");
  env["HOME"] = jailHome;
  env["TMPDIR"] = tmpDir;
  env["XDG_CONFIG_HOME"] = join(jailHome, ".config");
  env["XDG_CACHE_HOME"] = join(jailHome, ".cache");
  env["XDG_DATA_HOME"] = join(jailHome, ".local", "share");
  env["GIT_CONFIG_GLOBAL"] = join(jailHome, ".gitconfig");
  env["GIT_CONFIG_SYSTEM"] = "/dev/null";
  env["GIT_TERMINAL_PROMPT"] = "0";
  env["GIT_ASKPASS"] = "/usr/bin/false";
  env["SSH_ASKPASS"] = "/usr/bin/false";
  env["npm_config_userconfig"] = join(jailHome, ".npmrc");
  env["npm_config_cache"] = join(jailHome, ".npm");
  env["npm_config_update_notifier"] = "false";
  env["npm_config_fund"] = "false";
  env["npm_config_audit"] = "false";
  const proxy = opts.proxyUrl ?? DEAD_PROXY;
  env["HTTP_PROXY"] = proxy;
  env["HTTPS_PROXY"] = proxy;
  env["http_proxy"] = proxy;
  env["https_proxy"] = proxy;
  for (const [key, value] of Object.entries(opts.extra ?? {})) {
    if (FORBIDDEN_EXTRA.test(key)) {
      throw new SandboxEnvError(`refusing to inject ${key}: extras may not carry credentials`);
    }
    env[key] = value;
  }
  return env;
}
function auditEnv(env) {
  const leaks = [];
  for (const [key, value] of Object.entries(env)) {
    if (FORBIDDEN_EXTRA.test(key))
      leaks.push(key);
    if (/\bgh[pousr]_[A-Za-z0-9]{16,}/.test(value) || /\bgithub_pat_[A-Za-z0-9_]{20,}/.test(value)) {
      leaks.push(`${key} (value looks like a GitHub token)`);
    }
    if (/\bsk-ant-[A-Za-z0-9-]{16,}/.test(value)) {
      leaks.push(`${key} (value looks like an Anthropic key)`);
    }
  }
  return leaks;
}
var join, ENV_ALLOWLIST, BASE_PATH, DEAD_PROXY, SandboxEnvError, FORBIDDEN_EXTRA;
var init_env = __esm({
  "../../packages/containment/dist/env.js"() {
    "use strict";
    join = posix.join;
    ENV_ALLOWLIST = ["LANG", "LC_ALL", "LC_CTYPE", "TZ", "TERM"];
    BASE_PATH = ["/usr/bin", "/bin", "/usr/sbin", "/sbin"];
    DEAD_PROXY = "http://127.0.0.1:1";
    SandboxEnvError = class extends Error {
    };
    FORBIDDEN_EXTRA = /(^|_)(TOKEN|SECRET|PASSWORD|PASSWD|APIKEY|API_KEY|KEY|CREDENTIAL|AUTH|SESSION)(_|$)|^(SSH_AUTH_SOCK|AWS_|GH_|GITHUB_|ANTHROPIC_|CLAUDE_|TERMINALHIRE_|NODE_OPTIONS)/i;
  }
});

// ../../packages/containment/dist/reap.js
import { spawnSync } from "child_process";
function killable(pid) {
  return Number.isInteger(pid) && pid > 1 && pid !== process.pid && pid !== process.ppid;
}
function isAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (err) {
    return err.code === "EPERM";
  }
}
function processTable() {
  const res = spawnSync("ps", ["-axo", "pid=,ppid=,lstart="], {
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024
  });
  if (res.error || typeof res.stdout !== "string")
    return [];
  const rows = [];
  for (const line of res.stdout.split("\n")) {
    const m = /^\s*(\d+)\s+(\d+)\s+(.*)$/.exec(line);
    if (m)
      rows.push({ pid: Number(m[1]), ppid: Number(m[2]), started: m[3].trim() });
  }
  return rows;
}
function descendantsOf(rootPid, table = processTable()) {
  const children = /* @__PURE__ */ new Map();
  for (const row of table) {
    const list = children.get(row.ppid);
    if (list)
      list.push(row.pid);
    else
      children.set(row.ppid, [row.pid]);
  }
  const found = [];
  const seen = /* @__PURE__ */ new Set([rootPid]);
  const queue = [rootPid];
  while (queue.length > 0) {
    for (const kid of children.get(queue.shift()) ?? []) {
      if (seen.has(kid))
        continue;
      seen.add(kid);
      found.push(kid);
      queue.push(kid);
    }
  }
  return found;
}
function commandOf(pid) {
  const res = spawnSync("ps", ["-o", "command=", "-p", String(pid)], { encoding: "utf8" });
  return (res.stdout ?? "").trim() || "(unknown)";
}
function processesUnder(dirs) {
  const targets = dirs.filter((d) => d && d.startsWith("/"));
  if (targets.length === 0)
    return [];
  const res = spawnSync("lsof", ["-F", "pn", "-w", "+D", ...targets], {
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024
  });
  if (res.error)
    return null;
  if (typeof res.stdout !== "string")
    return null;
  const pids = /* @__PURE__ */ new Set();
  for (const line of res.stdout.split("\n")) {
    if (line.startsWith("p")) {
      const pid = Number(line.slice(1));
      if (Number.isInteger(pid))
        pids.add(pid);
    }
  }
  pids.delete(process.pid);
  return [...pids];
}
function signal(pid, sig) {
  if (!killable(pid))
    return false;
  try {
    process.kill(pid, sig);
    return true;
  } catch {
    return false;
  }
}
function killProcessGroup(pid) {
  if (!killable(pid))
    return false;
  try {
    process.kill(-pid, "SIGKILL");
    return true;
  } catch {
    return false;
  }
}
function sleepSync(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}
function sweep(opts) {
  const { pid, dirs, sampler } = opts;
  const rounds = opts.rounds ?? 5;
  const settleMs = opts.settleMs ?? 120;
  const killed = /* @__PURE__ */ new Set();
  const unverifiable = [];
  let survivors = [];
  for (let round = 0; round < rounds; round += 1) {
    if (killProcessGroup(pid))
      killed.add(pid);
    const closure = /* @__PURE__ */ new Set([...descendantsOf(pid), ...sampler?.liveSampled() ?? []]);
    const rooted = processesUnder(dirs);
    if (rooted === null) {
      if (!unverifiable.includes("lsof"))
        unverifiable.push("lsof");
    } else {
      for (const p of rooted)
        closure.add(p);
    }
    closure.delete(process.pid);
    for (const p of closure)
      if (signal(p, "SIGKILL"))
        killed.add(p);
    if (isAlive(pid))
      signal(pid, "SIGKILL");
    sleepSync(settleMs);
    const stillHere = new Set(descendantsOf(pid).filter(isAlive));
    for (const p of sampler?.liveSampled() ?? [])
      if (isAlive(p))
        stillHere.add(p);
    const rootedAfter = processesUnder(dirs);
    if (rootedAfter === null) {
      if (!unverifiable.includes("lsof"))
        unverifiable.push("lsof");
    } else {
      for (const p of rootedAfter)
        if (isAlive(p))
          stillHere.add(p);
    }
    if (isAlive(pid))
      stillHere.add(pid);
    stillHere.delete(process.pid);
    survivors = [...stillHere].map((p) => ({
      pid: p,
      via: p === pid ? "process-group" : rootedAfter?.includes(p) ? "fenced-path" : "ppid-closure",
      command: commandOf(p)
    }));
    if (survivors.length === 0)
      break;
  }
  return {
    contained: survivors.length === 0 && unverifiable.length === 0,
    killed: [...killed],
    survivors,
    unverifiable
  };
}
function describeSweep(result) {
  const parts = [];
  if (result.survivors.length > 0) {
    parts.push(`${result.survivors.length} process(es) survived the fence: ` + result.survivors.map((s) => `pid ${s.pid} [${s.via}] ${s.command}`).join("; "));
  }
  if (result.unverifiable.length > 0) {
    parts.push(`containment could not be verified (unavailable detector: ${result.unverifiable.join(", ")})`);
  }
  return parts.join(" \u2014 ") || "contained";
}
var DescendantSampler;
var init_reap = __esm({
  "../../packages/containment/dist/reap.js"() {
    "use strict";
    DescendantSampler = class {
      rootPid;
      intervalMs;
      seen = /* @__PURE__ */ new Map();
      timer;
      constructor(rootPid, intervalMs = 250) {
        this.rootPid = rootPid;
        this.intervalMs = intervalMs;
      }
      start() {
        this.sample();
        this.timer = setInterval(() => this.sample(), this.intervalMs);
        this.timer.unref?.();
      }
      stop() {
        if (this.timer)
          clearInterval(this.timer);
        this.timer = void 0;
        this.sample();
      }
      sample() {
        const table = processTable();
        if (table.length === 0)
          return;
        const byPid = new Map(table.map((r) => [r.pid, r.started]));
        for (const pid of descendantsOf(this.rootPid, table)) {
          this.seen.set(pid, byPid.get(pid) ?? "");
        }
      }
      /** Sampled PIDs that are still alive AND are still the same process. */
      liveSampled() {
        if (this.seen.size === 0)
          return [];
        const byPid = new Map(processTable().map((r) => [r.pid, r.started]));
        const live = [];
        for (const [pid, started] of this.seen) {
          const now = byPid.get(pid);
          if (now !== void 0 && now === started)
            live.push(pid);
        }
        return live;
      }
    };
  }
});

// ../../packages/containment/dist/fence.js
import { spawn, spawnSync as spawnSync2 } from "child_process";
import { existsSync, mkdirSync, realpathSync, writeFileSync } from "fs";
import { dirname, isAbsolute, join as join2 } from "path";
import { fileURLToPath } from "url";
function profileDir() {
  return join2(dirname(fileURLToPath(import.meta.url)), "..", "sandbox");
}
function profilePath(profile) {
  const path = join2(profileDir(), `fence-${profile}.sb`);
  if (!existsSync(path)) {
    throw new FenceError(`seatbelt profile is missing: ${path}`);
  }
  return path;
}
function canonical(path, label) {
  if (!isAbsolute(path)) {
    throw new FenceError(`${label} must be an absolute path, got ${JSON.stringify(path)}`);
  }
  try {
    return realpathSync(path);
  } catch {
    throw new FenceError(`${label} does not exist: ${path}`);
  }
}
function jailPasswd(uid = idOrNull("getuid"), gid = idOrNull("getgid")) {
  const rows = ["root:x:0:0:root:/root:/usr/sbin/nologin"];
  if (uid !== null && gid !== null && uid !== 0) {
    rows.push(`${FENCE_USER}:x:${uid}:${gid}:fenced build user:${GUEST_JAIL}:/usr/sbin/nologin`);
  }
  rows.push("nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin");
  return `${rows.join("\n")}
`;
}
function jailGroup(gid = idOrNull("getgid")) {
  const rows = ["root:x:0:"];
  if (gid !== null && gid !== 0)
    rows.push(`${FENCE_USER}:x:${gid}:`);
  rows.push("nogroup:x:65534:");
  return `${rows.join("\n")}
`;
}
function idOrNull(fn) {
  const f = process[fn];
  return typeof f === "function" ? f.call(process) : null;
}
function buildJail(root) {
  const jail = join2(root, "jail");
  const tmp = join2(root, "tmp");
  for (const dir of [jail, tmp, join2(jail, ".config"), join2(jail, ".cache"), join2(jail, ".npm")]) {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(join2(jail, ".npmrc"), "", "utf8");
  writeFileSync(join2(jail, JAIL_PASSWD_FILE), jailPasswd(), "utf8");
  writeFileSync(join2(jail, JAIL_GROUP_FILE), jailGroup(), "utf8");
  writeFileSync(join2(jail, ".gitconfig"), '[user]\n	name = sandbox\n	email = sandbox@localhost\n[safe]\n	directory = *\n[url "https://github.com/"]\n	insteadOf = ssh://git@github.com/\n	insteadOf = git@github.com:\n', "utf8");
  return { jail, tmp };
}
function fenceArgs(spec) {
  if (spec.profile === "install" && !spec.proxyAddr) {
    throw new FenceError("the install profile requires proxyAddr; refusing to build a profile with an unbound param");
  }
  if (spec.profile === "offline" && spec.proxyAddr) {
    throw new FenceError("the offline profile grants no network; passing proxyAddr is a category error");
  }
  if (spec.proxyAddr && !/^localhost:\d{1,5}$/.test(spec.proxyAddr)) {
    throw new FenceError(`proxyAddr must be "localhost:<port>", got ${JSON.stringify(spec.proxyAddr)}`);
  }
  if (!isAbsolute(spec.program)) {
    throw new FenceError(`program must be an absolute path, got ${JSON.stringify(spec.program)}`);
  }
  const args = [
    "-f",
    profilePath(spec.profile),
    "-D",
    `CLONE=${canonical(spec.clone, "clone")}`,
    "-D",
    `JAIL=${canonical(spec.jail, "jail")}`,
    "-D",
    `TMP=${canonical(spec.tmp, "tmp")}`
  ];
  if (spec.proxyAddr)
    args.push("-D", `PROXYADDR=${spec.proxyAddr}`);
  args.push(spec.program, ...spec.args ?? []);
  return args;
}
function enforceContainment(pid, spec, sampler) {
  sampler?.stop();
  return sweep({ pid, dirs: [spec.clone, spec.jail, spec.tmp], sampler });
}
function runFencedAsync(spec, env, opts = {}) {
  const leaks = auditEnv(env);
  if (leaks.length > 0) {
    return Promise.reject(new FenceError(`refusing to spawn: environment carries credential material (${leaks.join(", ")})`));
  }
  const argv = fenceArgs(spec);
  return new Promise((resolvePromise, reject) => {
    const child = spawn("sandbox-exec", argv, {
      env,
      cwd: opts.cwd ?? spec.clone,
      // LOAD-BEARING. `detached` makes the child a process-group LEADER, so its
      // whole tree can be reaped with one kill(-pgid). Without it the child
      // shares our group and that same call would signal the pipeline itself.
      // It also drops the controlling terminal, so fenced code cannot reach the
      // operator's tty to prompt for anything.
      detached: true
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (d) => {
      stdout += d.toString();
    });
    child.stderr.on("data", (d) => {
      stderr += d.toString();
    });
    const sampler = new DescendantSampler(child.pid ?? -1);
    if (child.pid)
      sampler.start();
    let timedOut = false;
    let settled = false;
    const timer = setTimeout(() => {
      timedOut = true;
      if (child.pid)
        killProcessGroup(child.pid);
      child.kill("SIGKILL");
    }, opts.timeoutMs ?? 9e5);
    const onParentExit = () => {
      if (child.pid)
        killProcessGroup(child.pid);
    };
    process.once("exit", onParentExit);
    const finish = (fn) => {
      if (settled)
        return;
      settled = true;
      clearTimeout(timer);
      process.removeListener("exit", onParentExit);
      fn();
    };
    child.on("error", (err) => {
      finish(() => {
        sampler.stop();
        if (child.pid)
          enforceContainment(child.pid, spec, sampler);
        reject(new FenceError(`sandbox-exec failed to start: ${err.message}`));
      });
    });
    child.on("close", (status) => {
      finish(() => {
        const containment = enforceContainment(child.pid ?? -1, spec, sampler);
        if (!containment.contained) {
          reject(new ContainmentError(`the fence did not contain the run: ${describeSweep(containment)}`, containment));
          return;
        }
        resolvePromise({
          status,
          stdout,
          stderr,
          argv: ["sandbox-exec", ...argv],
          timedOut,
          containment
        });
      });
    });
  });
}
function seatbeltAvailable() {
  const res = spawnSync2("sandbox-exec", ["-f", "/dev/null", "/usr/bin/true"], { encoding: "utf8" });
  return !res.error;
}
var FenceError, ContainmentError, JAIL_PASSWD_FILE, JAIL_GROUP_FILE, GUEST_JAIL, FENCE_USER;
var init_fence = __esm({
  "../../packages/containment/dist/fence.js"() {
    "use strict";
    init_env();
    init_reap();
    FenceError = class extends Error {
    };
    ContainmentError = class extends FenceError {
      sweep;
      constructor(message, sweep2) {
        super(message);
        this.sweep = sweep2;
      }
    };
    JAIL_PASSWD_FILE = ".fence-passwd";
    JAIL_GROUP_FILE = ".fence-group";
    GUEST_JAIL = "/fenced/jail";
    FENCE_USER = "fenced";
  }
});

// ../../packages/containment/dist/egressProxy.js
import net from "net";
import http from "http";
var DEFAULT_INSTALL_ALLOWLIST;
var init_egressProxy = __esm({
  "../../packages/containment/dist/egressProxy.js"() {
    "use strict";
    DEFAULT_INSTALL_ALLOWLIST = [
      "registry.npmjs.org",
      "pypi.org",
      "files.pythonhosted.org",
      "proxy.golang.org",
      "sum.golang.org",
      "static.crates.io",
      "index.crates.io",
      "crates.io",
      // Git dependencies. Approved by Eric 2026-07-22 after a live run measured the
      // chokepoint working under load (20 events, 16 allowed / 4 denied by host).
      //
      // READ THE MATCHER BEFORE JUDGING THIS ENTRY'S SCOPE. `hostAllowed` is
      // dot-anchored SUFFIX matching, so this one line grants every `*.github.com`
      // — codeload, api, gist, raw — not just the apex. `codeload.github.com` is
      // therefore deliberately NOT listed separately: a redundant entry would
      // advertise the grant as narrower than it is, which is a worse defect in an
      // allowlist than breadth.
      //
      // What it does NOT grant: `githubusercontent.com` is a DIFFERENT domain, so
      // release assets and raw blobs stay denied. If a real install needs them,
      // that should arrive as a measured egress denial, not a pre-emptive guess.
      //
      // Proportionality: install already runs with `--ignore-scripts`, and the
      // fenced environment carries no GitHub token, so the added capability is
      // "fetch a public tarball or ref", not "act as us".
      "github.com"
    ];
  }
});

// ../../packages/containment/dist/container.js
import { spawn as spawn2, spawnSync as spawnSync3 } from "child_process";
import { fileURLToPath as fileURLToPath2 } from "url";
import { dirname as dirname2, join as join3 } from "path";
import { copyFileSync, existsSync as existsSync2, mkdtempSync, rmSync } from "fs";
import { tmpdir } from "os";
function scrubEnvPathsFor(containmentKind, host) {
  return containmentKind === "container" ? { jailHome: GUEST.jail, tmpDir: GUEST.tmp } : { jailHome: host.jail, tmpDir: host.tmp };
}
function buildTranslation(spec) {
  const roots = [
    { raw: spec.clone, guest: GUEST.clone, label: "clone" },
    { raw: spec.jail, guest: GUEST.jail, label: "jail" },
    { raw: spec.tmp, guest: GUEST.tmp, label: "tmp" }
  ];
  const pairs = [];
  const seen = /* @__PURE__ */ new Set();
  for (const { raw, guest, label } of roots) {
    for (const host of [raw, canonical(raw, label)]) {
      if (seen.has(host))
        continue;
      seen.add(host);
      pairs.push([host, guest]);
    }
  }
  pairs.sort((a, b) => b[0].length - a[0].length);
  return { pairs };
}
function translate(value, t) {
  for (const [host, guest] of t.pairs) {
    if (value === host)
      return guest;
    if (!value.startsWith(host))
      continue;
    const boundary = value.charAt(host.length);
    if (isWindowsNativeRoot(host)) {
      if (boundary === "/" || boundary === "\\") {
        const rest = value.slice(host.length + 1).split(/[\\/]/).join("/");
        return `${guest}/${rest}`;
      }
    } else if (boundary === "/") {
      return guest + value.slice(host.length);
    }
  }
  return value;
}
function isWindowsNativeRoot(root) {
  return WINDOWS_DRIVE_ROOT.test(root) || root.startsWith("\\\\");
}
function assertGuestSafe(value, t, ctx) {
  const foldedValue = value.split("\\").join("/").toLowerCase();
  for (const [host] of t.pairs) {
    const hit = isWindowsNativeRoot(host) ? foldedValue.includes(host.split("\\").join("/").toLowerCase()) : value.includes(host);
    if (hit) {
      throw new FenceError(`refusing to run: a fenced host path survived translation in ${ctx} (${JSON.stringify(value)}). It would reach the guest as an unmounted host path. This means a value the translator cannot resolve to a guest mount (a bare-root list, a file:// URI, a double-slash path, or a root embedded after a non-delimiter). Keep fenced roots out of it, or present the field as a plain path or delimited list.`);
    }
  }
}
function translateChecked(value, t, ctx) {
  const out = translate(value, t);
  assertGuestSafe(out, t, ctx);
  return out;
}
function translateProgram(spec, t) {
  if (spec.program === process.execPath)
    return "node";
  if (spec.program === "/bin/sh")
    return "/bin/sh";
  const translated = translate(spec.program, t);
  if (translated !== spec.program) {
    assertGuestSafe(translated, t, "the program path");
    return translated;
  }
  throw new FenceError(`container runner cannot translate program ${JSON.stringify(spec.program)}: it is not the host Node, not /bin/sh, and not inside a fenced directory, so it cannot exist in the guest`);
}
function validateImage(image) {
  if (image.length === 0)
    throw new FenceError("container image reference is empty");
  if (image.startsWith("-")) {
    throw new FenceError(`refusing image ${JSON.stringify(image)}: a leading "-" is an option-injection vector (an option-shaped image can override --network=none and restore egress)`);
  }
  if (!IMAGE_REF.test(image)) {
    throw new FenceError(`refusing image ${JSON.stringify(image)}: not a well-formed docker image reference`);
  }
  return image;
}
function labelArgs(labels) {
  if (!labels)
    return [];
  const out = [];
  for (const [key, value] of Object.entries(labels)) {
    if (!LABEL_KEY.test(key)) {
      throw new FenceError(`refusing label key ${JSON.stringify(key)}: must match ${String(LABEL_KEY)}. A label that does not apply as written makes an absolute labelled-count assertion read clean while resources leak unlabelled.`);
    }
    if (/[\r\n]/.test(value)) {
      throw new FenceError(`refusing label ${key}: the value contains a newline, which docker cannot round-trip`);
    }
    out.push(`--label=${key}=${value}`);
  }
  return out;
}
function hostUserFlag() {
  const uid = typeof process.getuid === "function" ? process.getuid() : null;
  const gid = typeof process.getgid === "function" ? process.getgid() : null;
  if (uid === null || gid === null)
    return [];
  return [`--user=${uid}:${gid}`];
}
function guestIdentityMounts(spec) {
  if (hostUserFlag().length === 0)
    return [];
  const jail = canonical(spec.jail, "jail");
  const passwd = canonical(join3(jail, JAIL_PASSWD_FILE), "the jail passwd file");
  const group = canonical(join3(jail, JAIL_GROUP_FILE), "the jail group file");
  return [`--volume=${passwd}:/etc/passwd:ro`, `--volume=${group}:/etc/group:ro`];
}
function containerArgs(spec, env, opts) {
  if (spec.profile === "offline" && opts.net) {
    throw new FenceError("the offline profile grants no network; passing a sidecar net is a category error");
  }
  if (spec.profile === "install" && !opts.net) {
    throw new FenceError("the container install profile requires a proxy sidecar net \u2014 without it the guest would need a general network, which bypasses the egress allowlist entirely. Refusing.");
  }
  const t = buildTranslation(spec);
  const args = [
    "run",
    "--rm",
    "--init",
    `--name=${opts.name}`,
    // Offline: no interface at all. Install: ONLY the sidecar's internal network
    // (no gateway), so the proxy container is the guest's sole route out and the
    // allowlist is enforced, not advisory.
    opts.net ? `--network=${opts.net.network}` : "--network=none",
    "--cap-drop=ALL",
    "--security-opt=no-new-privileges",
    "--pids-limit=512",
    ...labelArgs(opts.labels),
    // TERM-198. Run as the HOST owner of the three bind mounts, not as the
    // image's default uid 0. On Linux a bind mount is a passthrough: the guest
    // sees the host's uid/gid/mode verbatim. The clone is created by the
    // non-root invoking user at mode 0755 and nothing chowns it, so a uid-0
    // guest lands in the "other" class — r-x, no write — and `--cap-drop=ALL`
    // above has already emptied the bounding set that would otherwise give root
    // CAP_DAC_OVERRIDE. The child then gets EACCES writing its OWN clone.
    // macOS/Windows Docker Desktop never showed this: their mount type is
    // `fakeowner`, which synthesizes 0:0 ownership for the guest.
    // `--cap-add=DAC_OVERRIDE` would also restore the write, by handing the
    // guest the power to ignore every permission bit on all three mounts —
    // exactly what the `--cap-drop=ALL` on the line above is here to prevent.
    // Matching the owner is the narrower fix and it also drops the guest out of
    // root. `getuid`/`getgid` do not exist on Windows; omit the flag there.
    ...hostUserFlag(),
    `--volume=${canonical(spec.clone, "clone")}:${GUEST.clone}:rw`,
    `--volume=${canonical(spec.jail, "jail")}:${GUEST.jail}:rw`,
    `--volume=${canonical(spec.tmp, "tmp")}:${GUEST.tmp}:rw`,
    ...guestIdentityMounts(spec),
    `--workdir=${translateChecked(canonical(opts.cwd ?? spec.clone, "cwd"), t, "the working directory")}`
  ];
  for (const [key, value] of Object.entries(env)) {
    if (key === "PATH" || PROXY_ENV_KEYS.has(key))
      continue;
    args.push(`--env=${key}=${translateChecked(value, t, `env ${key}`)}`);
  }
  if (opts.net) {
    const url = `http://${opts.net.proxyHost}:${String(opts.net.proxyPort)}`;
    for (const k of ["HTTP_PROXY", "HTTPS_PROXY", "http_proxy", "https_proxy"]) {
      args.push(`--env=${k}=${url}`);
    }
    args.push("--env=NO_PROXY=", "--env=no_proxy=");
  }
  args.push("--");
  args.push(validateImage(opts.image ?? DEFAULT_CONTAINER_IMAGE));
  args.push(translateProgram(spec, t));
  for (const a of spec.args ?? [])
    args.push(translateChecked(a, t, "a command argument"));
  return args;
}
function containerAvailable() {
  if (probed !== null)
    return probed;
  const res = spawnSync3("docker", ["info", "--format", "{{.ServerVersion}}"], {
    encoding: "utf8",
    timeout: DOCKER_TIMEOUT_MS
  });
  probed = !res.error && res.status === 0 && (res.stdout ?? "").trim().length > 0;
  return probed;
}
function inspectContainer(name) {
  const res = spawnSync3("docker", ["inspect", "--format", "{{.State.Status}}", name], {
    encoding: "utf8",
    timeout: DOCKER_TIMEOUT_MS
  });
  if (res.error) {
    return { state: "unverifiable", detail: `docker inspect failed to run: ${res.error.message}` };
  }
  if (res.status === 0) {
    return { state: "present", detail: (res.stdout ?? "").trim() || "running" };
  }
  const stderr = (res.stderr ?? "").toLowerCase();
  if (stderr.includes("no such object") || stderr.includes("no such container")) {
    return { state: "gone", detail: "no such container" };
  }
  return {
    state: "unverifiable",
    detail: `docker inspect exited ${res.status ?? "null"}: ${(res.stderr ?? "").trim() || "no stderr"}`
  };
}
function classifyNetworkInspect(ok, stderr) {
  if (ok)
    return "present";
  const s = stderr.toLowerCase();
  if (s.includes("not found") || s.includes("no such network"))
    return "gone";
  return "unverifiable";
}
function inspectNetwork(name) {
  const res = dockerSync(["network", "inspect", name]);
  return classifyNetworkInspect(res.ok, res.stderr);
}
function enforceContainerContainment(name) {
  const contained = { contained: true, killed: [], survivors: [], unverifiable: [] };
  if (inspectContainer(name).state === "gone")
    return contained;
  spawnSync3("docker", ["rm", "-f", name], { encoding: "utf8", timeout: DOCKER_TIMEOUT_MS });
  const after = inspectContainer(name);
  if (after.state === "gone")
    return contained;
  const reason = after.state === "present" ? `container ${name} still exists (status ${after.detail}) after docker rm -f` : `container ${name} containment is unverifiable: ${after.detail}`;
  return { contained: false, killed: [], survivors: [], unverifiable: [reason] };
}
function dockerSync(args, timeoutMs = DOCKER_TIMEOUT_MS) {
  const res = spawnSync3("docker", args, { encoding: "utf8", timeout: timeoutMs });
  return {
    ok: !res.error && res.status === 0,
    stdout: res.stdout ?? "",
    stderr: (res.error ? res.error.message : "") + (res.stderr ?? "")
  };
}
function pickProxyDir(baseDir) {
  const scoped = join3(baseDir, "proxy");
  if (existsSync2(join3(scoped, "proxyEntry.js")))
    return scoped;
  return baseDir;
}
function resolveProxyCodeSource() {
  return pickProxyDir(dirname2(fileURLToPath2(import.meta.url)));
}
function stageProxyCode() {
  const source = resolveProxyCodeSource();
  const missing = PROXY_FILES.map((f) => join3(source, f)).filter((p) => !existsSync2(p));
  if (missing.length > 0) {
    throw new FenceError(`the egress proxy is missing from this install: ${missing.join(", ")} not found. Reinstall the CLI, or update the Claude Code plugin.`);
  }
  const dir = mkdtempSync(join3(tmpdir(), "th-proxy-"));
  for (const file of PROXY_FILES) {
    copyFileSync(join3(source, file), join3(dir, file));
  }
  return {
    dir,
    cleanup: () => {
      try {
        rmSync(dir, { recursive: true, force: true });
      } catch {
      }
    }
  };
}
async function sleep(ms) {
  await new Promise((r) => setTimeout(r, ms));
}
async function waitForProxyReady(proxyName) {
  const deadline = Date.now() + 15e3;
  for (; ; ) {
    const logs = dockerSync(["logs", proxyName]);
    if (/proxy-ready/.test(logs.stdout + logs.stderr))
      return;
    const st = inspectContainer(proxyName);
    if (st.state === "gone" || st.state === "present" && /exited|dead/.test(st.detail)) {
      throw new FenceError(`the proxy sidecar exited before becoming ready: ${(logs.stdout + logs.stderr).trim().slice(-300)}`);
    }
    if (Date.now() > deadline) {
      throw new FenceError("the proxy sidecar did not become ready within 15s");
    }
    await sleep(250);
  }
}
async function startProxySidecar(allow, idBase, labels) {
  const label = labelArgs(labels);
  const netInt = `${idBase}-int`;
  const netExt = `${idBase}-ext`;
  const proxyName = `${idBase}-proxy`;
  const RETRIES = 3;
  const ensureContainerGone = (name) => {
    for (let i = 0; i < RETRIES; i++) {
      if (inspectContainer(name).state === "gone")
        return true;
      dockerSync(["rm", "-f", name]);
    }
    return inspectContainer(name).state === "gone";
  };
  const ensureNetworkGone = (name) => {
    for (let i = 0; i < RETRIES; i++) {
      if (inspectNetwork(name) === "gone")
        return true;
      dockerSync(["network", "rm", name]);
    }
    return inspectNetwork(name) === "gone";
  };
  const staged = stageProxyCode();
  const teardown = () => {
    const proxyGone = ensureContainerGone(proxyName);
    const intGone = ensureNetworkGone(netInt);
    const extGone = ensureNetworkGone(netExt);
    staged.cleanup();
    const leaked = [];
    if (!proxyGone)
      leaked.push(`proxy container ${proxyName} (idle post-run, but egress-capable)`);
    if (!intGone)
      leaked.push(`network ${netInt}`);
    if (!extGone)
      leaked.push(`network ${netExt}`);
    if (leaked.length > 0) {
      console.error(`merge-agent: WARNING \u2014 sidecar resources could not be confirmed removed after ${String(RETRIES)} attempts: ${leaked.join("; ")}. Remove manually (docker rm -f / docker network rm). A leaked network wastes an address pool; a leaked proxy is idle but egress-capable.`);
    }
  };
  try {
    if (!dockerSync([
      "network",
      "create",
      "--internal",
      "-o",
      "com.docker.network.bridge.inhibit_ipv4=true",
      ...label,
      netInt
    ]).ok) {
      throw new FenceError(`could not create the isolated internal network ${netInt} (needs a Docker daemon that supports the inhibit_ipv4 bridge option; an older daemon fails closed here rather than run install on a leaky net)`);
    }
    if (!dockerSync(["network", "create", ...label, netExt]).ok) {
      throw new FenceError(`could not create the egress network ${netExt}`);
    }
    const run2 = dockerSync([
      "run",
      "-d",
      `--name=${proxyName}`,
      `--network=${netInt}`,
      "--cap-drop=ALL",
      "--security-opt=no-new-privileges",
      "--pids-limit=128",
      ...label,
      `--volume=${staged.dir}:${SIDECAR_CODE_GUEST}:ro`,
      `--env=PROXY_PORT=${String(SIDECAR_PROXY_PORT)}`,
      `--env=PROXY_ALLOW=${allow.join(",")}`,
      "--",
      DEFAULT_CONTAINER_IMAGE,
      "node",
      `${SIDECAR_CODE_GUEST}/proxyEntry.js`
    ], 3e4);
    if (!run2.ok)
      throw new FenceError(`could not start the proxy sidecar: ${run2.stderr.trim()}`);
    if (!dockerSync(["network", "connect", netExt, proxyName]).ok) {
      throw new FenceError(`could not attach the proxy to the egress network ${netExt}`);
    }
    await waitForProxyReady(proxyName);
    return {
      net: { network: netInt, proxyHost: proxyName, proxyPort: SIDECAR_PROXY_PORT },
      teardown
    };
  } catch (err) {
    teardown();
    throw err;
  }
}
function spawnWorkload(name, argv, timeoutMs) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn2("docker", argv, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    let timedOut = false;
    child.stdout.on("data", (d) => stdout += d.toString());
    child.stderr.on("data", (d) => stderr += d.toString());
    const timer = setTimeout(() => {
      timedOut = true;
      spawnSync3("docker", ["kill", name], { encoding: "utf8", timeout: DOCKER_TIMEOUT_MS });
    }, timeoutMs);
    timer.unref();
    child.on("error", (err) => {
      clearTimeout(timer);
      reject(new FenceError(`docker failed to start: ${err.message}`));
    });
    child.on("close", (status) => {
      clearTimeout(timer);
      const containment = enforceContainerContainment(name);
      if (!containment.contained) {
        reject(new ContainmentError(`the container did not contain the run: ${containment.unverifiable.join("; ") || "survivors on host"}`, containment));
        return;
      }
      resolvePromise({ status, stdout, stderr, argv: ["docker", ...argv], timedOut, containment });
    });
  });
}
async function runContained(spec, env, opts = {}) {
  const leaks = auditEnv(env);
  if (leaks.length > 0) {
    throw new FenceError(`refusing to spawn: environment carries credential material (${leaks.join(", ")})`);
  }
  const idBase = `merge-agent-${process.pid}-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`;
  let sidecar = null;
  try {
    if (spec.profile === "install") {
      const allow = opts.installAllowlist ?? DEFAULT_INSTALL_ALLOWLIST;
      sidecar = await startProxySidecar(allow, `${idBase}-sc`, opts.labels);
    }
    const argv = containerArgs(spec, env, {
      name: idBase,
      cwd: opts.cwd,
      image: opts.image,
      net: sidecar?.net,
      labels: opts.labels
    });
    return await spawnWorkload(idBase, argv, opts.timeoutMs ?? 9e5);
  } finally {
    sidecar?.teardown();
  }
}
var DEFAULT_CONTAINER_IMAGE, GUEST, DOCKER_TIMEOUT_MS, SIDECAR_PROXY_PORT, SIDECAR_CODE_GUEST, PROXY_ENV_KEYS, WINDOWS_DRIVE_ROOT, IMAGE_HOST, IMAGE_NAME, IMAGE_PATH, IMAGE_TAG, IMAGE_DIGEST, IMAGE_REF, LABEL_KEY, probed, PROXY_FILES, containerContainment;
var init_container = __esm({
  "../../packages/containment/dist/container.js"() {
    "use strict";
    init_fence();
    init_env();
    init_egressProxy();
    DEFAULT_CONTAINER_IMAGE = "node:22-bookworm-slim";
    GUEST = { clone: "/fenced/clone", jail: "/fenced/jail", tmp: "/fenced/tmp" };
    DOCKER_TIMEOUT_MS = 1e4;
    SIDECAR_PROXY_PORT = 8080;
    SIDECAR_CODE_GUEST = "/proxy";
    PROXY_ENV_KEYS = /* @__PURE__ */ new Set([
      "HTTP_PROXY",
      "HTTPS_PROXY",
      "http_proxy",
      "https_proxy",
      "NO_PROXY",
      "no_proxy"
    ]);
    WINDOWS_DRIVE_ROOT = /^[A-Za-z]:[\\/]/;
    IMAGE_HOST = "(?:[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)+(?::[0-9]+)?|localhost(?::[0-9]+)?)";
    IMAGE_NAME = "[a-z0-9]+(?:[._-][a-z0-9]+)*";
    IMAGE_PATH = `${IMAGE_NAME}(?:/${IMAGE_NAME})*`;
    IMAGE_TAG = "[a-zA-Z0-9_][a-zA-Z0-9._-]{0,127}";
    IMAGE_DIGEST = "[a-z0-9]+(?:[+._-][a-z0-9]+)*:[a-fA-F0-9]{32,}";
    IMAGE_REF = new RegExp(`^(?:${IMAGE_HOST}/)?${IMAGE_PATH}(?::${IMAGE_TAG})?(?:@${IMAGE_DIGEST})?$`);
    LABEL_KEY = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;
    probed = null;
    PROXY_FILES = ["proxyEntry.js", "egressProxy.js"];
    containerContainment = {
      kind: "container",
      available: containerAvailable,
      run: (spec, env, opts = {}) => runContained(spec, env, opts)
    };
  }
});

// ../../packages/containment/dist/containment.js
function selectContainment(candidates = [seatbeltContainment, containerContainment]) {
  for (const c of candidates) {
    if (c.available())
      return c;
  }
  throw new NoContainmentError(candidates.map((c) => c.kind));
}
var seatbeltContainment, NoContainmentError;
var init_containment = __esm({
  "../../packages/containment/dist/containment.js"() {
    "use strict";
    init_fence();
    init_container();
    seatbeltContainment = {
      kind: "seatbelt",
      available: seatbeltAvailable,
      run: (spec, env, opts = {}) => runFencedAsync(spec, env, opts)
    };
    NoContainmentError = class extends Error {
      constructor(tried) {
        super(`no containment mechanism is available on this host (tried: ${tried.join(", ")}). Refusing to run third-party code unfenced \u2014 this is the invariant, not a missing feature. On macOS, sandbox-exec should always be present; elsewhere a container runtime is required (TERM-78).`);
        this.name = "NoContainmentError";
      }
    };
  }
});

// ../../packages/containment/dist/index.js
var init_dist = __esm({
  "../../packages/containment/dist/index.js"() {
    "use strict";
    init_env();
    init_fence();
    init_containment();
    init_container();
    init_reap();
    init_egressProxy();
  }
});

// ../../packages/envrun/dist/labels.js
import { spawnSync as spawnSync4 } from "child_process";
function censusTotal(c) {
  return c.containers.length + c.volumes.length + c.networks.length;
}
function ids(args) {
  const res = spawnSync4("docker", [...args], { encoding: "utf8", timeout: 15e3 });
  if (res.error || res.status !== 0)
    return [];
  return (res.stdout ?? "").split("\n").map((s) => s.trim()).filter((s) => s.length > 0);
}
function census(label) {
  const filter = `label=${label}`;
  return {
    containers: ids(["ps", "-aq", "--filter", filter]),
    volumes: ids(["volume", "ls", "-q", "--filter", filter]),
    networks: ids(["network", "ls", "-q", "--filter", filter])
  };
}
function judgeLeaks(peak, after) {
  const labelObserved = peak.containers.length > 0;
  const reaped = censusTotal(after) === 0;
  let note;
  if (!labelObserved && reaped) {
    note = "INCONCLUSIVE, not clean: nothing labelled was ever seen alive, so an empty final census is equally consistent with the label never being applied. The control failed, so the denial proves nothing.";
  } else if (!labelObserved) {
    note = "no labelled container was observed alive AND objects remain \u2014 the label wiring is wrong.";
  } else if (!reaped) {
    note = `LEAK: ${String(censusTotal(after))} labelled object(s) survived teardown (containers=${String(after.containers.length)} volumes=${String(after.volumes.length)} networks=${String(after.networks.length)}).`;
  } else {
    note = `clean: peak ${String(peak.containers.length)} labelled container(s) observed alive, 0 labelled objects remain after teardown.`;
  }
  return { labelObserved, reaped, clean: labelObserved && reaped, peak, after, note };
}
var RUN_LABEL_KEY, LabelWatch;
var init_labels = __esm({
  "../../packages/envrun/dist/labels.js"() {
    "use strict";
    RUN_LABEL_KEY = "supergoal.run";
    LabelWatch = class {
      label;
      intervalMs;
      #timer = null;
      #peak = { containers: [], volumes: [], networks: [] };
      #samples = 0;
      constructor(label, intervalMs = 250) {
        this.label = label;
        this.intervalMs = intervalMs;
      }
      start() {
        if (this.#timer !== null)
          return;
        this.#sample();
        this.#timer = setInterval(() => this.#sample(), this.intervalMs);
        this.#timer.unref();
      }
      #sample() {
        this.#samples += 1;
        const now = census(this.label);
        this.#peak = {
          containers: now.containers.length > this.#peak.containers.length ? now.containers : this.#peak.containers,
          volumes: now.volumes.length > this.#peak.volumes.length ? now.volumes : this.#peak.volumes,
          networks: now.networks.length > this.#peak.networks.length ? now.networks : this.#peak.networks
        };
      }
      stop() {
        if (this.#timer !== null) {
          clearInterval(this.#timer);
          this.#timer = null;
        }
        this.#sample();
      }
      get peak() {
        return this.#peak;
      }
      get samples() {
        return this.#samples;
      }
    };
  }
});

// ../../packages/envrun/dist/execute.js
import { mkdirSync as mkdirSync2 } from "fs";
function imageForRuntime(runtime, override) {
  if (override)
    return override;
  const image = RUNTIME_IMAGES[runtime];
  if (!image) {
    throw new EnvRunError(`no container image is mapped for runtime ${JSON.stringify(runtime)}. Refusing to run it in the Node image: a missing interpreter surfaces as "command not found", which the classifier reads as tests-failed \u2014 a false red blamed on the repo.`);
  }
  return image;
}
function classifySingleRun(run2) {
  return classifyVerification(run2).outcome;
}
function selectContainerTier() {
  return selectContainment([containerContainment]);
}
function toExecution(step) {
  return {
    exitCode: step.exitCode,
    stdout: step.stdout,
    stderr: step.stderr,
    timedOut: step.timedOut
  };
}
async function runEnvironmentSpec(req) {
  const startedAt = Date.now();
  const containment = req.containment ?? selectContainerTier();
  if (containment.kind !== "container") {
    throw new EnvRunError(`phase 2 requires the container tier, got ${containment.kind}. Refusing: a container phase that silently ran under seatbelt would make every container claim vacuous.`);
  }
  const image = imageForRuntime(req.spec.runtime, req.image);
  const { jail, tmp } = buildJail(req.scratchRoot);
  mkdirSync2(jail, { recursive: true });
  mkdirSync2(tmp, { recursive: true });
  const env = scrubEnv(process.env, scrubEnvPathsFor("container", { jail, tmp }));
  const labels = req.labels;
  const watch = labels ? new LabelWatch(labelSelector(labels)) : null;
  watch?.start();
  let install = null;
  let test = null;
  let result;
  try {
    if (req.spec.installCommand !== null) {
      install = await runStep(containment, {
        step: "install",
        profile: "install",
        command: req.spec.installCommand,
        repoDir: req.repoDir,
        jail,
        tmp,
        env,
        image,
        labels,
        timeoutMs: req.installTimeoutMs ?? 9e5
      });
    }
    if (install !== null && install.exitCode !== 0) {
      result = {
        outcome: "test-command-unavailable",
        note: `the install step exited ${String(install.exitCode)}, so the test command was never invoked. The repo has not been judged; this is an environment failure.`,
        installOk: false
      };
    } else if (req.spec.testCommand === null) {
      result = {
        outcome: "no-tests-observed",
        note: "the spec derived no test command, so nothing was executed: nothing failed and nothing ran. Certain, not inferred \u2014 no command was ever invoked.",
        installOk: true
      };
    } else {
      test = await runStep(containment, {
        step: "test",
        profile: "offline",
        command: req.spec.testCommand,
        repoDir: req.repoDir,
        jail,
        tmp,
        env,
        image,
        labels,
        timeoutMs: req.testTimeoutMs ?? 9e5
      });
      const verdict = classifyVerification(toExecution(test));
      result = { outcome: verdict.outcome, note: verdict.reason, installOk: true };
    }
  } finally {
    watch?.stop();
  }
  const peak = watch?.peak ?? { containers: [], volumes: [], networks: [] };
  const after = labels ? census(labelSelector(labels)) : { containers: [], volumes: [], networks: [] };
  return {
    outcome: result.outcome,
    tier: "container",
    image,
    install,
    test,
    installOk: result.installOk,
    counts: test ? readCounts(test.stdout, test.stderr) : null,
    leaks: judgeLeaks(peak, after),
    note: result.note,
    wallMs: Date.now() - startedAt
  };
}
function labelSelector(labels) {
  const first = Object.entries(labels)[0];
  if (!first)
    throw new EnvRunError("labels object is empty; pass at least one label or omit it");
  return `${first[0]}=${first[1]}`;
}
async function runStep(containment, r) {
  const spec = {
    profile: r.profile,
    clone: r.repoDir,
    jail: r.jail,
    tmp: r.tmp,
    program: "/bin/sh",
    args: ["-c", r.command]
  };
  const startedAt = Date.now();
  const res = await containment.run(spec, r.env, {
    timeoutMs: r.timeoutMs,
    image: r.image,
    ...r.labels ? { labels: r.labels } : {}
  });
  return {
    step: r.step,
    profile: r.profile,
    command: r.command,
    argv: res.argv,
    exitCode: res.status,
    stdout: res.stdout,
    stderr: res.stderr,
    timedOut: res.timedOut,
    wallMs: Date.now() - startedAt
  };
}
var EnvRunError, RUNTIME_IMAGES;
var init_execute = __esm({
  "../../packages/envrun/dist/execute.js"() {
    "use strict";
    init_dist();
    init_classify();
    init_labels();
    EnvRunError = class extends Error {
    };
    RUNTIME_IMAGES = {
      node: "node:22-bookworm-slim",
      python: "python:3.12-bookworm",
      go: "golang:1.23-bookworm",
      ruby: "ruby:3.3-bookworm",
      rust: "rust:1-bookworm"
    };
  }
});

// ../../packages/attest/dist/types.js
var IN_TOTO_STATEMENT_TYPE, ACCEPTANCE_RUN_PREDICATE_TYPE, IN_TOTO_PAYLOAD_TYPE, TEST_COMMAND_SOURCES;
var init_types = __esm({
  "../../packages/attest/dist/types.js"() {
    "use strict";
    IN_TOTO_STATEMENT_TYPE = "https://in-toto.io/Statement/v1";
    ACCEPTANCE_RUN_PREDICATE_TYPE = "https://terminalhire.com/attestations/acceptance-run/v1";
    IN_TOTO_PAYLOAD_TYPE = "application/vnd.in-toto+json";
    TEST_COMMAND_SOURCES = ["detected", "founder-declared", "none"];
  }
});

// ../../packages/attest/dist/pae.js
function pae(payloadType, body) {
  const typeBytes = Buffer.from(payloadType, "utf8");
  return Buffer.concat([
    Buffer.from(`DSSEv1 ${typeBytes.length} `, "utf8"),
    typeBytes,
    Buffer.from(` ${body.length} `, "utf8"),
    body
  ]);
}
var init_pae = __esm({
  "../../packages/attest/dist/pae.js"() {
    "use strict";
  }
});

// ../../packages/attest/dist/keys.js
import { createPrivateKey, createPublicKey, generateKeyPairSync, sign as cryptoSign, verify as cryptoVerify } from "crypto";
function signBytes(privateKey, data) {
  return cryptoSign(null, data, privateKey);
}
var init_keys = __esm({
  "../../packages/attest/dist/keys.js"() {
    "use strict";
    init_pae();
  }
});

// ../../packages/attest/dist/dsse.js
function createAcceptanceStatement(predicate) {
  return {
    _type: IN_TOTO_STATEMENT_TYPE,
    subject: [{ name: predicate.claim_id, digest: { sha256: predicate.tree_digest } }],
    predicateType: ACCEPTANCE_RUN_PREDICATE_TYPE,
    predicate
  };
}
function signStatementWith(statement, sign, keyid) {
  const body = Buffer.from(JSON.stringify(statement), "utf8");
  const sig = Buffer.from(sign(pae(IN_TOTO_PAYLOAD_TYPE, body)));
  return {
    payload: body.toString("base64"),
    payloadType: IN_TOTO_PAYLOAD_TYPE,
    signatures: [{ ...keyid === void 0 ? {} : { keyid }, sig: sig.toString("base64") }]
  };
}
function signStatement(statement, privateKey, keyid) {
  return signStatementWith(statement, (data) => signBytes(privateKey, data), keyid);
}
var init_dsse = __esm({
  "../../packages/attest/dist/dsse.js"() {
    "use strict";
    init_pae();
    init_keys();
    init_types();
  }
});

// ../../packages/attest/dist/sealedbox.js
import { createCipheriv, createDecipheriv, diffieHellman, generateKeyPairSync as generateKeyPairSync2, hkdfSync, randomBytes } from "crypto";
var init_sealedbox = __esm({
  "../../packages/attest/dist/sealedbox.js"() {
    "use strict";
    init_keys();
    init_pae();
  }
});

// ../../packages/attest/dist/aead.js
import { createCipheriv as createCipheriv2, createDecipheriv as createDecipheriv2, randomBytes as randomBytes2 } from "crypto";
var init_aead = __esm({
  "../../packages/attest/dist/aead.js"() {
    "use strict";
    init_pae();
  }
});

// ../../packages/attest/dist/manifest.js
var init_manifest = __esm({
  "../../packages/attest/dist/manifest.js"() {
    "use strict";
    init_pae();
    init_keys();
    init_types();
  }
});

// ../../packages/attest/dist/attestation.js
var init_attestation = __esm({
  "../../packages/attest/dist/attestation.js"() {
    "use strict";
    init_manifest();
    init_types();
  }
});

// ../../packages/attest/dist/nonce.js
var init_nonce = __esm({
  "../../packages/attest/dist/nonce.js"() {
    "use strict";
  }
});

// ../../packages/attest/dist/verify.js
var init_verify = __esm({
  "../../packages/attest/dist/verify.js"() {
    "use strict";
    init_dsse();
    init_manifest();
    init_types();
  }
});

// ../../packages/attest/dist/index.js
var init_dist2 = __esm({
  "../../packages/attest/dist/index.js"() {
    "use strict";
    init_types();
    init_pae();
    init_keys();
    init_dsse();
    init_sealedbox();
    init_aead();
    init_manifest();
    init_attestation();
    init_nonce();
    init_verify();
  }
});

// ../../packages/envrun/dist/result.js
function fmtMs(ms) {
  return ms < 1e3 ? `${String(ms)}ms` : `${(ms / 1e3).toFixed(1)}s`;
}
function renderVerdictLine(r) {
  if (r.status === "refused") {
    const first = r.boundaryRefusals[0];
    const where = first?.path ?? "the patch";
    return `REFUSED   ${where} is outside this bounty's slice \u2014 nothing was run, no container started.`;
  }
  const t = fmtMs(r.wallMs);
  switch (r.outcome) {
    case "completed":
      return `GREEN     ${String(r.counts?.tests_passed ?? 0)} test(s) passed, none failed \u2014 ${t}${r.preview ? ` \u2014 ${r.preview.url}` : ""}`;
    case "tests-failed":
      return `RED       ${r.counts ? `${String(r.counts.tests_failed)} test(s) failed` : `exit ${String(r.exitCode)}`} \u2014 ${t}${r.preview ? ` \u2014 ${r.preview.url}` : ""}`;
    case "no-tests-observed":
      return `NOTHING RAN  the suite reported zero tests passed and zero failed \u2014 ${t}`;
    case "counts-unparsed":
      return `UNKNOWN   exit 0 but no reporter format was readable, so nothing is verified \u2014 ${t}`;
    case "test-command-unavailable":
      return `OUR FAULT  the test command could not be invoked; your work has not been judged \u2014 ${t}`;
    case "budget-exceeded":
      return `TIMED OUT  the run was killed for exceeding its budget \u2014 ${t}`;
    case null:
      throw new Error("a verified run has no outcome \u2014 the result was assembled wrong");
  }
}
function renderRunReport(r) {
  const lines = [renderVerdictLine(r), ""];
  for (const field of RUN_RESULT_FIELDS) {
    const view = FIELD_VIEWS[field];
    if (view === RENDER_NONE)
      continue;
    const rendered = view(r);
    if (rendered !== null)
      lines.push(rendered);
  }
  const showOutput = r.status === "verified" && r.outcome !== null && !isGreen(r.outcome) && r.testOutputTail !== "";
  if (showOutput) {
    lines.push("", "--- test output (tail) ---", r.testOutputTail);
  }
  if (r.status === "verified" && r.outcome !== null && isOurFault(r.outcome)) {
    lines.push("", "This is an environment failure on our side, not a statement about your work.");
  }
  return lines.join("\n");
}
function answerDidItPass(r) {
  const passed = r.status === "verified" && r.outcome !== null && isGreen(r.outcome);
  return { passed, summary: renderVerdictLine(r), lookAt: r.preview?.url ?? null };
}
var RUN_TEST_COMMAND_SOURCES, RUN_RESULT_SCHEMA, RUN_RESULT_FIELDS, RENDER_NONE, FIELD_VIEWS;
var init_result = __esm({
  "../../packages/envrun/dist/result.js"() {
    "use strict";
    init_dist2();
    init_classify();
    RUN_TEST_COMMAND_SOURCES = [...TEST_COMMAND_SOURCES, "developer-declared"];
    RUN_RESULT_SCHEMA = "terminalhire.verification-run/1";
    RUN_RESULT_FIELDS = [
      "schema",
      "runId",
      "claimId",
      "status",
      "outcome",
      "reason",
      "exitCode",
      "testCommand",
      "testOutputTail",
      "counts",
      "wallMs",
      "targetRepo",
      "targetSha",
      "patchSha256",
      "treeDigest",
      "testCommandSource",
      "baselinePatchSha256",
      "boundaryRefusals",
      "touchedPaths",
      "preview",
      "containerImage",
      "leaksClean"
    ];
    RENDER_NONE = null;
    FIELD_VIEWS = {
      schema: RENDER_NONE,
      runId: (r) => `run          ${r.runId}`,
      claimId: (r) => `claim        ${r.claimId}`,
      status: RENDER_NONE,
      // carried by the verdict line, which is always printed
      outcome: (r) => r.outcome === null ? null : `outcome      ${r.outcome}`,
      reason: (r) => `why          ${r.reason}`,
      exitCode: (r) => r.exitCode === null ? null : `exit code    ${String(r.exitCode)}`,
      testCommand: (r) => r.testCommand === null ? null : `test command ${r.testCommand}`,
      testOutputTail: RENDER_NONE,
      // printed as a block below the fields, when red
      counts: (r) => r.counts === null ? null : `tests        ${String(r.counts.tests_passed)} passed, ${String(r.counts.tests_failed)} failed (${r.counts.runner})`,
      wallMs: (r) => `round trip   ${fmtMs(r.wallMs)}`,
      targetRepo: (r) => `target       ${r.targetRepo}`,
      targetSha: (r) => `commit       ${r.targetSha.slice(0, 12)}`,
      patchSha256: (r) => r.patchSha256 === null ? null : `patch        ${r.patchSha256.slice(0, 12)}`,
      treeDigest: (r) => r.treeDigest === null ? null : `tree         ${r.treeDigest.slice(0, 12)}`,
      // Worth a line of its own: `detected` means the repo chose the command, not us and not a
      // founder picking one that suits the outcome.
      testCommandSource: (r) => `cmd source   ${r.testCommandSource}`,
      // Shown only when set, because it is the unusual case and it blocks signing.
      baselinePatchSha256: (r) => r.baselinePatchSha256 === null ? null : `base patch   ${r.baselinePatchSha256.slice(0, 12)} (not in the signed binding)`,
      boundaryRefusals: (r) => r.boundaryRefusals.length === 0 ? null : ["refused", ...r.boundaryRefusals.map((b) => `  - ${b.detail}`)].join("\n"),
      touchedPaths: (r) => r.touchedPaths.length === 0 ? null : `files        ${String(r.touchedPaths.length)}: ${r.touchedPaths.join(", ")}`,
      preview: (r) => r.preview === null ? null : `preview      ${r.preview.url}`,
      containerImage: (r) => r.containerImage === null ? null : `image        ${r.containerImage}`,
      leaksClean: (r) => r.leaksClean === null ? null : r.leaksClean ? null : "WARNING      labelled Docker objects survived teardown"
    };
  }
});

// ../../packages/envrun/dist/receipt.js
function toRecordPatchRunVerification(result) {
  const testCounts = result.counts === null ? null : {
    passed: result.counts.tests_passed,
    failed: result.counts.tests_failed,
    total: result.counts.tests_passed + result.counts.tests_failed
  };
  return {
    testCounts,
    testCommand: result.testCommand,
    patchSha256: result.patchSha256
  };
}
var init_receipt = __esm({
  "../../packages/envrun/dist/receipt.js"() {
    "use strict";
  }
});

// ../../packages/envrun/dist/attestation.js
import { createHash, randomBytes as randomBytes3 } from "crypto";
function contradicts(outcome, counts, exitCode) {
  const budget = OUTCOME_TO_BUDGET[outcome];
  if (budget === null)
    return null;
  return CONTRADICTS_COUNTS[budget](counts, exitCode);
}
function localMeasurement(imageReference) {
  return `${LOCAL_MEASUREMENT_PREFIX}${imageReference}`;
}
function sha256Hex(data) {
  return createHash("sha256").update(typeof data === "string" ? Buffer.from(data, "utf8") : data).digest("hex");
}
function toTestRunResult(result, outputSha256) {
  return {
    exit_code: result.exitCode ?? -1,
    ...outputSha256 === void 0 ? {} : { output_sha256: outputSha256 },
    ...result.counts === null ? {} : { tests_passed: result.counts.tests_passed, tests_failed: result.counts.tests_failed }
  };
}
function toAcceptancePredicate(pair, opts = {}) {
  const { baseline, patched } = pair;
  if (baseline.runId === patched.runId) {
    return refuse2("pair-is-the-same-run", `both sides are run ${patched.runId}. A baseline and a patched result that are the same execution prove nothing about the patch, and every field of the pair would be equal by construction.`);
  }
  if (patched.status === "refused") {
    return refuse2("run-was-refused", `the patched run was refused before executing (${patched.boundaryRefusals.length} boundary refusal(s)), so there is no result to attest`);
  }
  if (patched.outcome === null) {
    return refuse2("no-outcome-recorded", "the patched run recorded no outcome");
  }
  if (baseline.status === "refused") {
    return refuse2("baseline-was-refused", `the baseline run was refused before executing (${baseline.boundaryRefusals.length} boundary refusal(s)), so there is no "before" to compare against`);
  }
  if (baseline.outcome === null) {
    return refuse2("baseline-no-outcome", "the baseline run recorded no outcome");
  }
  if (!BASELINE_IS_A_VERDICT[baseline.outcome]) {
    return refuse2("baseline-environment-failed", `the baseline ended ${baseline.outcome}, which is not an observed verdict about the unpatched tree. Signing it would let a baseline we could not read stand in for one that failed, and a broken baseline flatters every patch.`);
  }
  const budget = OUTCOME_TO_BUDGET[patched.outcome];
  if (budget === null) {
    return refuse2("our-environment-failed", `the patched run ended ${patched.outcome}: the test command could not be invoked, which is our environment failing and not a verdict about the work. No statement is emitted, because every possible value would be a claim we cannot support.`);
  }
  if (patched.testCommand === null) {
    return refuse2("no-test-command", "no test command was recorded, so none can be attested");
  }
  if (baseline.testCommand !== patched.testCommand) {
    return refuse2("pair-disagrees-on-harness", `baseline ran ${JSON.stringify(baseline.testCommand)} and patched ran ${JSON.stringify(patched.testCommand)}. Opposite verdicts from different harnesses say nothing about the patch.`);
  }
  if (baseline.targetSha !== patched.targetSha) {
    return refuse2("pair-disagrees-on-base", `baseline is at ${baseline.targetSha} and patched at ${patched.targetSha}`);
  }
  if (patched.treeDigest === null || patched.treeDigest === "") {
    return refuse2("missing-tree-digest", "the patched run recorded no tree digest to bind to");
  }
  if (patched.patchSha256 === null || patched.patchSha256 === "") {
    return refuse2("missing-patch-digest", "the patched run recorded no patch digest");
  }
  if (baseline.treeDigest === null || baseline.treeDigest === "") {
    return refuse2("missing-tree-digest", "the baseline recorded no tree digest, so the two halves cannot be shown to differ");
  }
  if (baseline.treeDigest === patched.treeDigest) {
    return refuse2("pair-has-identical-tree", `both sides are tree ${String(patched.treeDigest).slice(0, 12)}\u2026, so whatever the two runs disagree about, it is not the patch`);
  }
  if (patched.baselinePatchSha256 !== null || baseline.baselinePatchSha256 !== null) {
    return refuse2("patch-binding-incomplete", `a baseline patch shaped the ${patched.baselinePatchSha256 !== null ? "patched" : "baseline"} tree, so it cannot be reproduced from (base_commit_oid, patch_sha256) alone. Fold it into the binding before signing; do not sign a triple a verifier cannot follow.`);
  }
  for (const [side, outcome, counts, exitCode] of [
    ["patched", patched.outcome, patched.counts, patched.exitCode],
    ["baseline", baseline.outcome, baseline.counts, baseline.exitCode]
  ]) {
    const why = contradicts(outcome, counts, exitCode);
    if (why !== null) {
      return refuse2("outcome-contradicts-counts", `the ${side} run is ${why}`);
    }
  }
  for (const [side, source] of [
    ["patched", patched.testCommandSource],
    ["baseline", baseline.testCommandSource]
  ]) {
    const why = SOURCE_IS_SIGNABLE[source](patched.testCommand);
    if (why !== null)
      return refuse2("test-command-origin-unattested", `the ${side} run ${why}`);
  }
  if (patched.testCommandSource === "developer-declared") {
    return refuse2("test-command-origin-unattested", "the developer supplied the test command (unreachable \u2014 the source rules above cover it)");
  }
  if (baseline.testCommandSource !== patched.testCommandSource) {
    return refuse2("test-command-origin-unattested", `the pair disagrees on where the command came from: baseline ${baseline.testCommandSource}, patched ${patched.testCommandSource}. One signed value cannot describe both.`);
  }
  if (baseline.containerImage !== patched.containerImage) {
    return refuse2("pair-disagrees-on-image", `baseline ran in ${String(baseline.containerImage)} and patched in ${String(patched.containerImage)}. The signed measurement names one image, so a pair from two environments would attribute to the patch whatever the image changed.`);
  }
  if (patched.containerImage === null || patched.containerImage === "") {
    return refuse2("missing-container-image", "no container image was recorded, so the measurement would name a stand-in rather than the environment the suite actually ran in");
  }
  return {
    ok: true,
    predicate: {
      claim_id: patched.claimId,
      base_commit_oid: patched.targetSha,
      patch_sha256: patched.patchSha256,
      tree_digest: patched.treeDigest,
      test_command: patched.testCommand,
      test_command_source: patched.testCommandSource,
      baseline_result: toTestRunResult(baseline, opts.baselineOutputSha256),
      patched_result: toTestRunResult(patched, opts.patchedOutputSha256),
      // No `?? 'unknown-image'`: `missing-container-image` refuses above, so the value here is
      // always one the run actually observed. A fallback would have made the fabrication
      // unreachable to notice.
      enclave_measurement: localMeasurement(patched.containerImage),
      nonce: opts.nonce ?? randomBytes3(16).toString("hex"),
      run_policy: { max_attempts: opts.maxAttempts ?? 1, budget_outcome: budget }
    }
  };
}
function signRunStatement(predicate, privateKey, keyid) {
  const statement = createAcceptanceStatement(predicate);
  return { statement, envelope: signStatement(statement, privateKey, keyid) };
}
var OUTCOME_TO_BUDGET, BASELINE_IS_A_VERDICT, CONTRADICTS_COUNTS, SOURCE_IS_SIGNABLE, ATTEST_REFUSAL_REASONS, refuse2, LOCAL_MEASUREMENT_PREFIX;
var init_attestation2 = __esm({
  "../../packages/envrun/dist/attestation.js"() {
    "use strict";
    init_dist2();
    OUTCOME_TO_BUDGET = {
      completed: "completed",
      "tests-failed": "tests-failed",
      "no-tests-observed": "no-tests-observed",
      "budget-exceeded": "budget-exceeded",
      "counts-unparsed": "no-tests-observed",
      "test-command-unavailable": null
    };
    BASELINE_IS_A_VERDICT = {
      completed: true,
      "tests-failed": true,
      "no-tests-observed": true,
      "budget-exceeded": false,
      "counts-unparsed": false,
      "test-command-unavailable": false
    };
    CONTRADICTS_COUNTS = {
      // Green asserts three things, and the first version checked one. `{0, 0}` signed as
      // `completed` — green with nothing having run, which is precisely what
      // `no-tests-observed` exists to say — and `exitCode: 1` signed as green too.
      completed: (counts, exitCode) => counts === null ? "`completed` with no parsed counts \u2014 green with no evidence any test asserted, which is exactly what `no-tests-observed` exists to say" : counts.tests_failed > 0 ? `\`completed\` alongside ${String(counts.tests_failed)} recorded failure(s)` : counts.tests_passed === 0 ? "`completed` with zero tests passed \u2014 green asserts a suite RAN, not merely that nothing failed" : exitCode !== 0 ? `\`completed\` with exit code ${String(exitCode)} \u2014 green cannot come from a command that reported failure` : null,
      // BOTH count fields, not just passes. `{0 passed, 4 failed}` signed as "evidence of zero"
      // for one round. A nonzero exit contradicts it too: `classify.ts` returns `tests-failed`
      // for that, so this member can only come from a clean exit.
      "no-tests-observed": (counts, exitCode) => counts === null ? null : counts.tests_passed > 0 || counts.tests_failed > 0 ? `mapped to \`no-tests-observed\` but records ${String(counts.tests_passed)} passed and ${String(counts.tests_failed)} failed, and that member asserts evidence of zero` : exitCode !== null && exitCode !== 0 ? `mapped to \`no-tests-observed\` with exit code ${String(exitCode)} \u2014 a nonzero exit is \`tests-failed\`, not evidence of zero` : null,
      // A killed run was never read to the end, so ANY counts beside it are a claim we cannot
      // support. `classify.ts` hardcodes `counts: null` on the timeout branch — but nothing in the
      // TYPE ties them, which is this whole family's rationale.
      "budget-exceeded": (counts) => counts === null ? null : `mapped to \`budget-exceeded\` \u2014 a run killed mid-flight \u2014 yet carries counts (${String(counts.tests_passed)} passed, ${String(counts.tests_failed)} failed), which asserts we read a suite that never finished`,
      // ABSTAINS, and on both observables. `classify.ts` reaches `tests-failed` two ways: counted
      // failures (any exit code, because a runner can report failures and still exit 0 under
      // `|| true`), and a nonzero exit with no counted failure ("something outside the assertions
      // failed"). So neither zero failures NOR a zero exit is a contradiction here, and guarding
      // either would redden honest evidence. This is a decision with its reason attached, not a
      // gap — the distinction the outer table exists to make visible.
      "tests-failed": () => null
    };
    SOURCE_IS_SIGNABLE = {
      detected: () => null,
      "founder-declared": () => null,
      // The party under verification chose it, and no signed member can say so. Per ADR-005
      // Decision 2, emit nothing rather than pick the closest word.
      "developer-declared": () => "had its test command supplied by the developer whose work is under verification, and the signed vocabulary has no member for that. `founder-declared` would attribute the choice to the other party; `detected` would claim the repo chose it. Both are false.",
      // `none` means nobody chose a command, so a command beside it is a contradiction. Shadowed
      // today — `thrun.ts` sets `none` only when the derived command is null, and `no-test-command`
      // fires first — but that coupling runs through `runEnvironmentSpec` and lives in no type.
      none: (command) => command === null ? null : `records its command source as \`none\` \u2014 nobody chose one \u2014 beside the command ${JSON.stringify(command)}`
    };
    ATTEST_REFUSAL_REASONS = [
      "our-environment-failed",
      "run-was-refused",
      "no-outcome-recorded",
      "no-test-command",
      "pair-disagrees-on-harness",
      "pair-disagrees-on-base",
      "pair-is-the-same-run",
      "missing-tree-digest",
      "missing-patch-digest",
      // Round 4: the pair-agreement axis. `testCommand` and `targetSha` were compared across the
      // halves and `containerImage` was not, so two different environments signed one measurement.
      "pair-disagrees-on-image",
      "missing-container-image",
      // ── The BASELINE half. Added TERM-354 review round 2: every guard above reads
      // `patched`, so a baseline could be anything at all and still be signed as the "before"
      // half of a comparison. That is the worst direction for this bug to point, because a
      // BROKEN baseline manufactures a favourable result: install dies, nothing runs, and the
      // pair reads "it was failing, the patch fixed it".
      "baseline-was-refused",
      "baseline-no-outcome",
      "baseline-environment-failed",
      "pair-has-identical-tree",
      // The signed triple must be reproducible from what it names — see the guard.
      "patch-binding-incomplete",
      "outcome-contradicts-counts",
      "test-command-origin-unattested"
    ];
    refuse2 = (reason, detail) => ({
      ok: false,
      reason,
      detail
    });
    LOCAL_MEASUREMENT_PREFIX = "NOT-AN-ENCLAVE:local-container:";
  }
});

// ../../packages/envrun/dist/boundary.js
function unquoteDiffPath(token) {
  if (!token.startsWith('"'))
    return token === "" ? null : token;
  if (token.length < 2 || !token.endsWith('"'))
    return null;
  const chars = [...token.slice(1, -1)];
  const bytes = [];
  for (let i = 0; i < chars.length; i += 1) {
    const ch = chars[i];
    if (ch === void 0)
      return null;
    if (ch === '"')
      return null;
    if (ch !== "\\") {
      for (const b of TEXT_ENCODER.encode(ch))
        bytes.push(b);
      continue;
    }
    const next = chars[i + 1];
    if (next === void 0)
      return null;
    const simple = C_ESCAPES[next];
    if (simple !== void 0) {
      bytes.push(simple);
      i += 1;
      continue;
    }
    const octal = `${next}${chars[i + 2] ?? ""}${chars[i + 3] ?? ""}`;
    if (!/^[0-7]{3}$/.test(octal))
      return null;
    bytes.push(parseInt(octal, 8));
    i += 3;
  }
  try {
    return TEXT_DECODER.decode(new Uint8Array(bytes));
  } catch {
    return null;
  }
}
function normalizePath(raw) {
  if (raw === "" || raw.includes("\\"))
    return null;
  if (/[\u0000-\u001f\u007f]/.test(raw))
    return null;
  if (raw.startsWith("/"))
    return null;
  if (/^[A-Za-z]:/.test(raw))
    return null;
  const trimmed = raw.startsWith("./") ? raw.slice(2) : raw;
  if (trimmed === "" || trimmed.endsWith("/"))
    return null;
  const segments = trimmed.split("/");
  for (const segment of segments) {
    if (segment === "" || segment === "." || segment === "..")
      return null;
  }
  const base = segments[segments.length - 1];
  if (base === void 0)
    return null;
  return { path: segments.join("/"), segments, base };
}
function splitDiffHeader(body) {
  if (body.startsWith('"')) {
    let end = -1;
    for (let i = 1; i < body.length; i += 1) {
      if (body[i] === "\\") {
        i += 1;
        continue;
      }
      if (body[i] === '"') {
        end = i;
        break;
      }
    }
    if (end === -1 || body[end + 1] !== " ")
      return null;
    return [body.slice(0, end + 1), body.slice(end + 2)];
  }
  const candidates = [];
  for (let i = 0; i < body.length; i += 1) {
    if (body[i] !== " ")
      continue;
    const left = body.slice(0, i);
    const right = body.slice(i + 1);
    if (left.startsWith("a/") && right.startsWith("b/"))
      candidates.push([left, right]);
  }
  if (candidates.length === 1)
    return candidates[0] ?? null;
  if (candidates.length === 0)
    return null;
  const equal = candidates.filter(([l, r]) => l.slice(2) === r.slice(2));
  return equal.length === 1 ? equal[0] ?? null : null;
}
function stripSidePrefix(token, expected) {
  return token.startsWith(expected) ? token.slice(2) : null;
}
function parsePatchPaths(patch) {
  const lines = patch.split("\n");
  const entries = [];
  let entry = null;
  let skippingBinary = false;
  let oldRemaining = 0;
  let newRemaining = 0;
  let inHunk = false;
  const fail = (detail) => ({ failure: { code: "unparseable", detail } });
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (line === void 0)
      continue;
    if (line.startsWith(DIFF_HEADER)) {
      if (inHunk && (oldRemaining > 0 || newRemaining > 0)) {
        return fail("a change block ended before it delivered the lines it announced");
      }
      inHunk = false;
      skippingBinary = false;
      entry = { rawPaths: [], binary: false };
      entries.push(entry);
      const split = splitDiffHeader(line.slice(DIFF_HEADER.length));
      if (split !== null) {
        const [leftToken, rightToken] = split;
        const left = unquoteDiffPath(leftToken);
        const right = unquoteDiffPath(rightToken);
        if (left === null || right === null) {
          return fail("a file name in the patch is quoted in a form we cannot read back");
        }
        const oldPath = stripSidePrefix(left, "a/");
        const newPath = stripSidePrefix(right, "b/");
        if (oldPath === null || newPath === null) {
          return fail("the patch was written without the standard a/ and b/ file-name prefixes, so we cannot tell a prefix from a real directory");
        }
        entry.rawPaths.push(oldPath, newPath);
      }
      continue;
    }
    if (entry === null)
      continue;
    if (skippingBinary)
      continue;
    if (inHunk) {
      const marker = line === "" ? " " : line[0];
      if (marker === "\\")
        continue;
      if (marker === " ") {
        oldRemaining -= 1;
        newRemaining -= 1;
      } else if (marker === "-") {
        oldRemaining -= 1;
      } else if (marker === "+") {
        newRemaining -= 1;
      } else {
        return fail("a change block contains a line that is neither an addition, a removal nor context");
      }
      if (oldRemaining < 0 || newRemaining < 0) {
        return fail("a change block delivered more lines than it announced");
      }
      if (oldRemaining === 0 && newRemaining === 0)
        inHunk = false;
      continue;
    }
    if (line === "-- " || line === "--")
      break;
    if (line.startsWith("@@")) {
      const m = HUNK_HEADER.exec(line);
      if (m === null) {
        return fail("a change block header is malformed, so we cannot tell which lines belong to it");
      }
      oldRemaining = m[2] === void 0 ? 1 : Number(m[2]);
      newRemaining = m[4] === void 0 ? 1 : Number(m[4]);
      inHunk = oldRemaining > 0 || newRemaining > 0;
      continue;
    }
    if (line === "GIT binary patch" || line.startsWith("Binary files ")) {
      entry.binary = true;
      skippingBinary = true;
      continue;
    }
    const sideMarker = line.startsWith("--- ") ? "a/" : line.startsWith("+++ ") ? "b/" : null;
    if (sideMarker !== null) {
      const rest = line.slice(4);
      const tab = rest.indexOf("	");
      const token = tab === -1 ? rest : rest.slice(0, tab);
      if (token === "/dev/null")
        continue;
      const decoded = unquoteDiffPath(token);
      if (decoded === null) {
        return fail("a file name in the patch is quoted in a form we cannot read back");
      }
      const stripped = stripSidePrefix(decoded, sideMarker);
      if (stripped === null) {
        return fail("the patch was written without the standard a/ and b/ file-name prefixes, so we cannot tell a prefix from a real directory");
      }
      entry.rawPaths.push(stripped);
      continue;
    }
    const moveMarker = ["rename from ", "rename to ", "copy from ", "copy to "].find((p) => line.startsWith(p));
    if (moveMarker !== void 0) {
      const decoded = unquoteDiffPath(line.slice(moveMarker.length));
      if (decoded === null) {
        return fail("a file name in the patch is quoted in a form we cannot read back");
      }
      entry.rawPaths.push(decoded);
      continue;
    }
    if (line.startsWith("+") || line.startsWith("-")) {
      return fail("the patch contains a changed line that belongs to no change block");
    }
  }
  if (inHunk && (oldRemaining > 0 || newRemaining > 0)) {
    return fail("the patch ends in the middle of a change block");
  }
  if (entries.length === 0) {
    return { failure: { code: "empty-patch", detail: "The patch contains no changes at all." } };
  }
  for (const e of entries) {
    if (e.rawPaths.length === 0)
      return fail("a change in the patch names no file");
  }
  return { entries };
}
function refusal(code, path, detail) {
  return { code, path, detail };
}
function preflightBoundary(input) {
  const parsed = parsePatchPaths(typeof input.patch === "string" ? input.patch : "");
  if ("failure" in parsed) {
    const { code, detail } = parsed.failure;
    const sentence = code === "empty-patch" ? detail : `The patch could not be read: ${detail}. A patch we cannot read in full is refused rather than applied in part.`;
    return { refused: true, refusals: [refusal(code, null, sentence)], touchedPaths: [] };
  }
  const slice = /* @__PURE__ */ new Set();
  for (const raw of input.sliceFiles) {
    if (typeof raw !== "string")
      continue;
    const normalized = normalizePath(raw);
    if (normalized !== null)
      slice.add(normalized.path);
  }
  const refusals = [];
  const touched = /* @__PURE__ */ new Set();
  const seenPaths = /* @__PURE__ */ new Set();
  for (const entry of parsed.entries) {
    if (entry.binary) {
      const name = entry.rawPaths[0] ?? "a file";
      refusals.push(refusal("binary-patch", normalizePath(name)?.path ?? null, `${name} is changed as binary content, which nobody can review line by line. Binary changes are refused.`));
      continue;
    }
    const entryPaths = [];
    for (const raw of entry.rawPaths) {
      const normalized = normalizePath(raw);
      if (normalized === null) {
        if (!seenPaths.has(raw)) {
          seenPaths.add(raw);
          refusals.push(refusal("unsafe-path", raw, `${raw} is not a file name a patch may name \u2014 it points outside the repository, or it is written in a form we cannot check.`));
        }
        continue;
      }
      if (entryPaths.some((p) => p.path === normalized.path))
        continue;
      entryPaths.push(normalized);
    }
    for (const { path, segments, base } of entryPaths) {
      touched.add(path);
      if (seenPaths.has(path))
        continue;
      seenPaths.add(path);
      const denied = DENY_RULES.find((rule) => rule.matches(path, segments, base));
      if (denied !== void 0) {
        refusals.push(refusal(denied.code, path, `${path} ${denied.why}.`));
        continue;
      }
      if (!slice.has(path)) {
        refusals.push(refusal("out-of-slice", path, `${path} is not one of the files shared for this bounty, so a change to it is outside what the developer was asked to work on.`));
      }
    }
  }
  return { refused: refusals.length > 0, refusals, touchedPaths: [...touched].sort() };
}
var PATH_REFUSAL_CODES, LOCKFILE_NAMES, DENY_RULES, TEXT_ENCODER, TEXT_DECODER, C_ESCAPES, DIFF_HEADER, HUNK_HEADER;
var init_boundary = __esm({
  "../../packages/envrun/dist/boundary.js"() {
    "use strict";
    PATH_REFUSAL_CODES = [
      "empty-patch",
      "unparseable",
      "binary-patch",
      "unsafe-path",
      "out-of-slice",
      "ci-config",
      "lockfile",
      "build-file",
      "git-internals"
    ];
    LOCKFILE_NAMES = /* @__PURE__ */ new Set([
      "package-lock.json",
      "npm-shrinkwrap.json",
      "yarn.lock",
      "pnpm-lock.yaml",
      "bun.lockb",
      "Cargo.lock",
      "poetry.lock",
      "Pipfile.lock",
      "Gemfile.lock",
      "go.sum",
      "composer.lock"
    ]);
    DENY_RULES = [
      {
        code: "git-internals",
        matches: (_p, segments) => segments.includes(".git"),
        why: "is inside the repository\u2019s own git storage, which a patch may never write"
      },
      {
        code: "ci-config",
        matches: (path) => path.startsWith(".github/workflows/") || path.startsWith(".github/actions/"),
        why: "changes how the repository builds and tests itself. A patch may not edit CI, because CI runs with the repository\u2019s own secrets"
      },
      {
        code: "ci-config",
        matches: (_p, segments) => segments.includes(".circleci"),
        why: "changes the CircleCI build, and a patch may not edit CI, because CI runs with the repository\u2019s own secrets"
      },
      {
        code: "ci-config",
        matches: (_p, _segments, base) => base.startsWith(".gitlab-ci") || base.startsWith("azure-pipelines") || base.startsWith("Jenkinsfile"),
        why: "is a continuous-integration config, and a patch may not edit CI, because CI runs with the repository\u2019s own secrets"
      },
      {
        code: "build-file",
        matches: (_p, segments) => segments.some((s) => s === ".husky" || s.endsWith(".husky")),
        why: "is a git hook that runs on every commit in the repository"
      },
      {
        code: "build-file",
        matches: (_p, segments, base) => segments.length === 1 && base.startsWith("Dockerfile"),
        why: "is the build image at the top of the repository, which decides what runs during a build"
      },
      {
        code: "build-file",
        matches: (_p, segments, base) => segments.length === 1 && base === "Makefile",
        why: "is the build script at the top of the repository, which decides what runs during a build"
      },
      {
        code: "lockfile",
        matches: (_p, _segments, base) => LOCKFILE_NAMES.has(base),
        why: "is a dependency lockfile. Nobody reads a lockfile diff, so a change to one is refused rather than shown"
      }
    ];
    TEXT_ENCODER = new TextEncoder();
    TEXT_DECODER = new TextDecoder("utf-8", { fatal: true });
    C_ESCAPES = {
      a: 7,
      b: 8,
      t: 9,
      n: 10,
      v: 11,
      f: 12,
      r: 13,
      '"': 34,
      "\\": 92
    };
    DIFF_HEADER = "diff --git ";
    HUNK_HEADER = /^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/;
  }
});

// ../../packages/envrun/dist/placement.js
function localDockerPlacement() {
  return {
    kind: "local-docker",
    containment: () => selectContainerTier(),
    imageFor: (runtime, override) => imageForRuntime(runtime, override)
  };
}
function placementFor(kind) {
  return PLACEMENTS[kind]();
}
var PLACEMENTS;
var init_placement = __esm({
  "../../packages/envrun/dist/placement.js"() {
    "use strict";
    init_execute();
    PLACEMENTS = {
      "local-docker": localDockerPlacement
    };
  }
});

// ../../packages/envrun/dist/preview.js
import { spawnSync as spawnSync5 } from "child_process";
import { mkdirSync as mkdirSync3, writeFileSync as writeFileSync2 } from "fs";
import { join as join4 } from "path";
function docker(args, timeoutMs = 6e4) {
  const res = spawnSync5("docker", [...args], { encoding: "utf8", timeout: timeoutMs });
  return {
    ok: !res.error && res.status === 0,
    stdout: res.stdout ?? "",
    stderr: (res.error ? res.error.message : "") + (res.stderr ?? "")
  };
}
function reapLive() {
  for (const container of LIVE_CONTAINERS) {
    spawnSync5("docker", ["rm", "-f", container], { encoding: "utf8", timeout: 15e3 });
  }
  LIVE_CONTAINERS.clear();
}
function installReaper() {
  if (reaperInstalled)
    return;
  reaperInstalled = true;
  process.on("exit", reapLive);
}
function readHostPort(container) {
  const res = docker(["port", container, `${String(GUEST_PORT)}/tcp`]);
  if (!res.ok)
    return null;
  for (const line of res.stdout.split("\n")) {
    const trimmed = line.trim();
    if (trimmed === "")
      continue;
    const idx = trimmed.lastIndexOf(":");
    if (idx === -1)
      continue;
    const port = Number(trimmed.slice(idx + 1));
    if (Number.isInteger(port) && port > 0)
      return port;
  }
  return null;
}
async function fetchInstanceToken(url) {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok)
      return null;
    const body = await res.json();
    return typeof body.instanceToken === "string" ? body.instanceToken : null;
  } catch {
    return null;
  }
}
async function startPreview(req) {
  const label = labelArgs(req.labels);
  const container = `${req.idBase}-preview`;
  const image = validateImage(req.image);
  mkdirSync3(req.scratchDir, { recursive: true });
  const docPath = join4(req.scratchDir, "preview-run.json");
  writeFileSync2(docPath, JSON.stringify(req.document, null, 2), "utf8");
  const teardown = () => {
    LIVE_CONTAINERS.delete(container);
    for (let i = 0; i < 3; i += 1) {
      const inspect = docker(["inspect", "--format", "{{.State.Status}}", container]);
      if (!inspect.ok)
        return { clean: true, leaked: [] };
      docker(["rm", "-f", container]);
    }
    const still = docker(["inspect", "--format", "{{.State.Status}}", container]);
    return still.ok ? { clean: false, leaked: [`container ${container}`] } : { clean: true, leaked: [] };
  };
  const startedAt = Date.now();
  try {
    const run2 = docker([
      "run",
      "-d",
      "--init",
      `--name=${container}`,
      // A network IS granted here, unlike the verification step. It carries our
      // own argv over a document we wrote; the repo's code never runs in it.
      "--network=bridge",
      // Loopback only. `-p 8080` would bind 0.0.0.0 and put a developer's
      // in-progress work on their local network.
      `--publish=127.0.0.1:0:${String(GUEST_PORT)}`,
      "--cap-drop=ALL",
      "--security-opt=no-new-privileges",
      "--pids-limit=64",
      "--memory=256m",
      "--read-only",
      "--tmpfs=/tmp:rw,noexec,nosuid,size=8m",
      ...label,
      `--volume=${docPath}:${GUEST_DOC}:ro`,
      "--",
      image,
      "node",
      "-e",
      SERVER_SOURCE
    ]);
    if (!run2.ok) {
      throw new PreviewError(`could not start the preview container: ${run2.stderr.trim()}`);
    }
    const deadline = Date.now() + (req.readyTimeoutMs ?? 6e4);
    let hostPort = null;
    let token = null;
    let lastDetail = "never answered";
    while (Date.now() < deadline) {
      hostPort ??= readHostPort(container);
      if (hostPort === null) {
        lastDetail = "Docker never reported a published host port";
        await sleep2(200);
        continue;
      }
      token = await fetchInstanceToken(`http://127.0.0.1:${String(hostPort)}/`);
      if (token !== null)
        break;
      const alive = docker(["inspect", "--format", "{{.State.Running}}", container]);
      if (alive.stdout.trim() !== "true") {
        const logs = docker(["logs", "--tail", "20", container]);
        throw new PreviewError(`the preview container exited before serving: ${logs.stdout.trim()}${logs.stderr.trim()}`);
      }
      lastDetail = "the port is published but the server has not answered yet";
      await sleep2(150);
    }
    if (hostPort === null || token === null) {
      throw new PreviewError(`the preview URL never became reachable: ${lastDetail}`);
    }
    LIVE_CONTAINERS.add(container);
    installReaper();
    return {
      url: `http://127.0.0.1:${String(hostPort)}/`,
      instanceToken: token,
      container,
      hostPort,
      readyMs: Date.now() - startedAt,
      teardown
    };
  } catch (err) {
    teardown();
    throw err;
  }
}
var PreviewError, GUEST_PORT, GUEST_DOC, SERVER_SOURCE, LIVE_CONTAINERS, reaperInstalled, sleep2;
var init_preview = __esm({
  "../../packages/envrun/dist/preview.js"() {
    "use strict";
    init_dist();
    PreviewError = class extends Error {
    };
    GUEST_PORT = 8080;
    GUEST_DOC = "/preview/run.json";
    SERVER_SOURCE = `
const http = require('node:http');
const { readFileSync } = require('node:fs');
const { randomUUID } = require('node:crypto');

// Per-INSTANCE, minted at boot. Not passed in, not derived from anything the
// host controls \u2014 that is what makes "same token \u21D2 same instance" hold.
const INSTANCE_TOKEN = randomUUID();
const DOC = JSON.parse(readFileSync(${JSON.stringify(GUEST_DOC)}, 'utf8'));
let served = 0;

http
  .createServer((req, res) => {
    served += 1;
    const body = JSON.stringify(
      {
        instanceToken: INSTANCE_TOKEN,
        servedCount: served,
        pid: process.pid,
        run: DOC,
      },
      null,
      2,
    );
    res.writeHead(200, {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-th-instance': INSTANCE_TOKEN,
    });
    res.end(body);
  })
  .listen(${String(GUEST_PORT)}, '0.0.0.0', () => {
    console.log('preview-ready ' + INSTANCE_TOKEN);
  });
`;
    LIVE_CONTAINERS = /* @__PURE__ */ new Set();
    reaperInstalled = false;
    sleep2 = (ms) => new Promise((r) => setTimeout(r, ms));
  }
});

// ../../packages/envspec/dist/yaml.js
function parseYaml(source) {
  const lines = splitLines(source);
  const cursor = { lines, index: 0 };
  skipIgnorable(cursor);
  if (cursor.index >= lines.length)
    return null;
  const value = parseNode(cursor, lines[cursor.index].indent);
  skipIgnorable(cursor);
  if (cursor.index < lines.length) {
    const stray = lines[cursor.index];
    throw new YamlUnsupportedError("trailing-content", stray.number, `content after the end of the top-level node ("${stray.text.slice(0, 24)}")`);
  }
  return value;
}
function splitLines(source) {
  const raw = source.replace(/\r\n/g, "\n").split("\n");
  const out = [];
  let sawDocumentStart = false;
  for (let i = 0; i < raw.length; i += 1) {
    const line = raw[i];
    const number = i + 1;
    const withoutIndent = line.replace(/^[ ]+/, "");
    const indent = line.length - withoutIndent.length;
    if (/^[ ]*\t/.test(line)) {
      throw new YamlUnsupportedError("tab-indent", number, "tab used for indentation");
    }
    const trimmed = withoutIndent.trimEnd();
    if (trimmed === "---") {
      if (sawDocumentStart || out.some((l) => !l.ignorable)) {
        throw new YamlUnsupportedError("multi-document", number, "multi-document stream (a second `---`)");
      }
      sawDocumentStart = true;
      out.push({ indent, text: trimmed, number, ignorable: true });
      continue;
    }
    if (trimmed === "...") {
      throw new YamlUnsupportedError("document-end", number, "explicit document end (`...`)");
    }
    out.push({
      indent,
      text: trimmed,
      number,
      ignorable: trimmed === "" || trimmed.startsWith("#")
    });
  }
  return out;
}
function skipIgnorable(cursor) {
  while (cursor.index < cursor.lines.length && cursor.lines[cursor.index].ignorable) {
    cursor.index += 1;
  }
}
function peek(cursor) {
  skipIgnorable(cursor);
  return cursor.index < cursor.lines.length ? cursor.lines[cursor.index] : null;
}
function parseNode(cursor, indent) {
  const line = peek(cursor);
  if (line === null)
    return null;
  if (line.text === "-" || line.text.startsWith("- "))
    return parseSequence(cursor, indent);
  if (line.text === "?" || line.text.startsWith("? ")) {
    throw new YamlUnsupportedError("explicit-key", line.number, "explicit key syntax (`? `)");
  }
  if (KEY_PATTERN.test(line.text))
    return parseMapping(cursor, indent);
  cursor.index += 1;
  return parseScalar(stripComment(line.text), line.number);
}
function parseSequence(cursor, indent) {
  const items = [];
  for (; ; ) {
    const line = peek(cursor);
    if (line === null || line.indent < indent)
      break;
    if (line.indent > indent) {
      throw new YamlUnsupportedError("indent", line.number, `unexpected indentation inside a sequence (expected ${indent}, saw ${line.indent})`);
    }
    if (line.text !== "-" && !line.text.startsWith("- "))
      break;
    if (line.text === "-") {
      cursor.index += 1;
      const next = peek(cursor);
      items.push(next !== null && next.indent > indent ? parseNode(cursor, next.indent) : null);
      continue;
    }
    const afterDash = line.text.slice(1);
    const extraSpaces = afterDash.length - afterDash.replace(/^[ ]+/, "").length;
    const itemIndent = indent + 1 + extraSpaces;
    cursor.lines[cursor.index] = {
      indent: itemIndent,
      text: afterDash.trimStart(),
      number: line.number,
      ignorable: false
    };
    items.push(parseNode(cursor, itemIndent));
  }
  return items;
}
function parseMapping(cursor, indent) {
  const entries = [];
  for (; ; ) {
    const line = peek(cursor);
    if (line === null || line.indent < indent)
      break;
    if (line.indent > indent) {
      throw new YamlUnsupportedError("indent", line.number, `unexpected indentation inside a mapping (expected ${indent}, saw ${line.indent})`);
    }
    if (line.text.startsWith("- ") || line.text === "-")
      break;
    if (line.text.startsWith("? ")) {
      throw new YamlUnsupportedError("explicit-key", line.number, "explicit key syntax (`? `)");
    }
    const match = KEY_PATTERN.exec(line.text);
    if (match === null) {
      throw new YamlUnsupportedError("not-a-mapping-entry", line.number, `expected \`key: value\` but read "${line.text.slice(0, 40)}"`);
    }
    const key = match[1] ?? unescapeSingle(match[2]) ?? match[3] ?? "";
    if (key.trim() === "<<") {
      throw new YamlUnsupportedError("merge-key", line.number, "merge key (`<<:`)");
    }
    const inline = match[4];
    cursor.index += 1;
    const inlineText = inline === void 0 ? "" : stripComment(inline);
    let value;
    if (/^[|>][-+]?[0-9]*$/.test(inlineText)) {
      value = readBlockScalar(cursor, indent, inlineText, line.number);
    } else if (inlineText === "") {
      const next = peek(cursor);
      value = next !== null && next.indent > indent ? parseNode(cursor, next.indent) : null;
    } else {
      value = parseInlineScalar(inlineText, line.number);
    }
    entries.push({ key: key.trim(), value });
  }
  return { kind: "map", entries };
}
function readBlockScalar(cursor, parentIndent, header, headerLine) {
  const folded = header.startsWith(">");
  const chomp = header.includes("-") ? "strip" : header.includes("+") ? "keep" : "clip";
  const explicit = /[0-9]/.exec(header);
  if (explicit !== null) {
    throw new YamlUnsupportedError("explicit-indent-indicator", headerLine, `explicit block-scalar indentation indicator (\`${header}\`)`);
  }
  let contentIndent = -1;
  const collected = [];
  while (cursor.index < cursor.lines.length) {
    const line = cursor.lines[cursor.index];
    const blank = line.text === "";
    if (!blank && line.indent <= parentIndent)
      break;
    if (contentIndent === -1 && !blank)
      contentIndent = line.indent;
    collected.push(blank ? "" : " ".repeat(Math.max(0, line.indent - contentIndent)) + line.text);
    cursor.index += 1;
  }
  while (collected.length > 0 && collected[collected.length - 1] === "")
    collected.pop();
  if (collected.length === 0)
    return "";
  let body;
  if (folded) {
    body = collected.reduce((acc, cur, i) => {
      if (i === 0)
        return cur;
      const prev = collected[i - 1];
      const joinable = prev !== "" && cur !== "" && !cur.startsWith(" ") && !prev.startsWith(" ");
      return acc + (joinable ? " " : "\n") + cur;
    }, "");
  } else {
    body = collected.join("\n");
  }
  return chomp === "strip" ? body : body + "\n";
}
function stripComment(text) {
  const trimmed = text.trim();
  if (trimmed.startsWith('"') || trimmed.startsWith("'"))
    return trimmed;
  const at = trimmed.search(/\s#/);
  return at === -1 ? trimmed : trimmed.slice(0, at).trimEnd();
}
function parseInlineScalar(text, lineNumber) {
  if (text.startsWith("["))
    return parseFlowSequence(text, lineNumber);
  if (text.startsWith("{"))
    return parseFlowMapping(text, lineNumber);
  return parseScalar(text, lineNumber);
}
function parseScalar(text, lineNumber) {
  if (text.startsWith("&") || text.startsWith("*")) {
    throw new YamlUnsupportedError(text.startsWith("&") ? "anchor" : "alias", lineNumber, `${text.startsWith("&") ? "anchor" : "alias"} (\`${text.split(/\s/)[0]}\`)`);
  }
  if (text.startsWith("!")) {
    throw new YamlUnsupportedError("tag", lineNumber, `tag (\`${text.split(/\s/)[0]}\`)`);
  }
  if (text === "~" || text === "null")
    return null;
  if (text.startsWith('"') && text.endsWith('"') && text.length >= 2) {
    return unescapeDouble(text.slice(1, -1));
  }
  if (text.startsWith("'") && text.endsWith("'") && text.length >= 2) {
    return text.slice(1, -1).replace(/''/g, "'");
  }
  return text;
}
function unescapeSingle(text) {
  return text === void 0 ? void 0 : text.replace(/''/g, "'");
}
function unescapeDouble(text) {
  return text.replace(/\\(["\\/nrt])/g, (_all, ch) => {
    if (ch === "n")
      return "\n";
    if (ch === "r")
      return "\r";
    if (ch === "t")
      return "	";
    return ch;
  });
}
function parseFlowSequence(text, lineNumber) {
  if (!text.endsWith("]")) {
    throw new YamlUnsupportedError("multiline-flow", lineNumber, "flow sequence spanning more than one line");
  }
  const inner = text.slice(1, -1).trim();
  if (inner === "")
    return [];
  return splitFlowItems(inner, lineNumber).map((item) => parseScalar(item, lineNumber));
}
function parseFlowMapping(text, lineNumber) {
  if (!text.endsWith("}")) {
    throw new YamlUnsupportedError("multiline-flow", lineNumber, "flow mapping spanning more than one line");
  }
  const inner = text.slice(1, -1).trim();
  if (inner === "")
    return { kind: "map", entries: [] };
  const entries = splitFlowItems(inner, lineNumber).map((item) => {
    const at = item.indexOf(":");
    if (at === -1) {
      throw new YamlUnsupportedError("flow-mapping-entry", lineNumber, `flow mapping entry without a value ("${item}")`);
    }
    return {
      key: (parseScalar(item.slice(0, at).trim(), lineNumber) ?? "").trim(),
      value: parseScalar(item.slice(at + 1).trim(), lineNumber)
    };
  });
  return { kind: "map", entries };
}
function splitFlowItems(inner, lineNumber) {
  const items = [];
  let current = "";
  let quote = null;
  let depth = 0;
  for (const ch of inner) {
    if (quote !== null) {
      current += ch;
      if (ch === quote)
        quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      current += ch;
      continue;
    }
    if (ch === "[" || ch === "{")
      depth += 1;
    if (ch === "]" || ch === "}")
      depth -= 1;
    if (ch === "," && depth === 0) {
      items.push(current.trim());
      current = "";
      continue;
    }
    current += ch;
  }
  items.push(current.trim());
  if (depth !== 0) {
    throw new YamlUnsupportedError("flow-nesting", lineNumber, "unbalanced flow collection");
  }
  return items.filter((item) => item !== "");
}
function isMap(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isList(value) {
  return Array.isArray(value);
}
function asString(value) {
  return typeof value === "string" ? value : null;
}
function mapGet(value, key) {
  if (!isMap(value))
    return null;
  for (const entry of value.entries) {
    if (entry.key === key)
      return entry.value;
  }
  return null;
}
function mapEntries(value) {
  return isMap(value) ? value.entries : [];
}
function asStringList(value) {
  if (typeof value === "string")
    return [value];
  if (isList(value)) {
    return value.filter((item) => typeof item === "string");
  }
  return [];
}
var YamlUnsupportedError, KEY_PATTERN;
var init_yaml = __esm({
  "../../packages/envspec/dist/yaml.js"() {
    "use strict";
    YamlUnsupportedError = class extends Error {
      line;
      construct;
      constructor(construct, line, detail) {
        super(`unsupported YAML at line ${line}: ${detail}`);
        this.name = "YamlUnsupportedError";
        this.construct = construct;
        this.line = line;
      }
    };
    KEY_PATTERN = /^(?:"((?:[^"\\]|\\.)*)"|'((?:[^']|'')*)'|([^'":#][^:]*?))\s*:(?:\s+(.*))?$/;
  }
});

// ../../packages/envspec/dist/database.js
function findMigrations(repo) {
  const out = /* @__PURE__ */ new Set();
  for (const dir of MIGRATION_DIRS) {
    for (const file of repo.listFiles(dir)) {
      if (file.endsWith("migration_lock.toml"))
        continue;
      if (MIGRATION_EXTENSIONS.some((ext) => file.endsWith(ext)))
        out.add(file);
    }
  }
  return [...out].sort();
}
function findSeeds(repo) {
  const out = /* @__PURE__ */ new Set();
  for (const dir of SEED_DIRS) {
    for (const name of repo.listNames(dir)) {
      if (!SEED_BASENAME.test(name))
        continue;
      const path = dir === "" ? name : `${dir}/${name}`;
      if (!repo.isDirectory(path))
        out.add(path);
    }
  }
  for (const tree of SEED_TREES) {
    for (const file of repo.listFiles(tree))
      out.add(file);
  }
  return [...out].sort();
}
function scanCompose(repo) {
  for (const file of COMPOSE_FILES) {
    const scan = scanComposeFile(repo, file);
    if (scan !== null)
      return scan;
  }
  return { services: [], file: null, unparsed: false };
}
function scanComposeFile(repo, file) {
  {
    const text = repo.readText(file);
    if (text === null)
      return null;
    let document;
    try {
      document = parseYaml(text);
    } catch {
      return { services: [], file, unparsed: true };
    }
    const services = [];
    for (const entry of mapEntries(mapGet(document, "services"))) {
      const image = asString(mapGet(entry.value, "image"));
      if (image === null)
        continue;
      const ports = /* @__PURE__ */ new Set();
      for (const port of asStringList(mapGet(entry.value, "ports"))) {
        const segments = port.split(":");
        const parsed = Number.parseInt(segments[segments.length - 1], 10);
        if (Number.isInteger(parsed))
          ports.add(parsed);
      }
      services.push({
        name: entry.key,
        image,
        ports: [...ports].sort((a, b) => a - b),
        env: readComposeEnvironment(mapGet(entry.value, "environment")),
        declaredIn: "compose"
      });
    }
    return {
      services: services.sort((a, b) => a.name.localeCompare(b.name)),
      file,
      unparsed: false
    };
  }
}
function readComposeEnvironment(node) {
  const pairs = [];
  if (isList(node)) {
    for (const item of node) {
      const text = asString(item);
      if (text === null)
        continue;
      const at = text.indexOf("=");
      if (at === -1)
        continue;
      pairs.push({ name: text.slice(0, at), value: text.slice(at + 1) });
    }
  } else {
    for (const entry of mapEntries(node)) {
      const value = asString(entry.value);
      if (value !== null)
        pairs.push({ name: entry.key, value });
    }
  }
  return pairs.filter((pair) => !/\$\{/.test(pair.value)).sort((a, b) => a.name.localeCompare(b.name));
}
function devcontainerComposeFiles(repo) {
  for (const path of [".devcontainer/devcontainer.json", ".devcontainer.json"]) {
    const text = repo.readText(path);
    if (text === null)
      continue;
    const stripped = text.replace(/^\s*\/\/.*$/gm, "");
    let parsed;
    try {
      parsed = JSON.parse(stripped);
    } catch {
      return [];
    }
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed))
      return [];
    const value = parsed["dockerComposeFile"];
    if (typeof value === "string")
      return [value];
    if (Array.isArray(value))
      return value.filter((item) => typeof item === "string");
    return [];
  }
  return [];
}
var MIGRATION_DIRS, MIGRATION_EXTENSIONS, COMPOSE_FILES, SEED_BASENAME, SEED_DIRS, SEED_TREES;
var init_database = __esm({
  "../../packages/envspec/dist/database.js"() {
    "use strict";
    init_yaml();
    MIGRATION_DIRS = [
      "alembic/versions",
      "db/migrate",
      "db/migrations",
      "migrations",
      "prisma/migrations",
      "sql/migrations",
      "supabase/migrations"
    ];
    MIGRATION_EXTENSIONS = [".sql", ".py", ".rb", ".ts", ".js"];
    COMPOSE_FILES = [
      "compose.yaml",
      "compose.yml",
      "docker-compose.yaml",
      "docker-compose.yml"
    ];
    SEED_BASENAME = /^seeds?\.(?:sql|ts|js|mjs|py|rb)$/;
    SEED_DIRS = ["", "db", "prisma", "scripts", "supabase"];
    SEED_TREES = ["db/seeds", "seeds", "supabase/seeds"];
  }
});

// ../../packages/envspec/dist/manifest.js
function detectRuntime(repo) {
  const candidates = [];
  for (const entry of RUNTIME_MANIFESTS) {
    if (entry.files.some((file) => repo.exists(file)))
      candidates.push(entry.runtime);
  }
  if (repo.listNames("").some((name) => /\.(?:csproj|fsproj|sln)$/.test(name))) {
    candidates.push("dotnet");
  }
  return { runtime: candidates[0] ?? "unknown", candidates };
}
function readJsonObject(repo, path) {
  const text = repo.readText(path);
  if (text === null)
    return null;
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    return null;
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed))
    return null;
  return parsed;
}
function readStringField(object, key) {
  if (object === null)
    return null;
  const value = object[key];
  return typeof value === "string" ? value : null;
}
function readObjectField(object, key) {
  if (object === null)
    return null;
  const value = object[key];
  if (typeof value !== "object" || value === null || Array.isArray(value))
    return null;
  return value;
}
function readNodeManifest(repo) {
  const pkg = readJsonObject(repo, "package.json");
  if (pkg === null)
    return null;
  return {
    scripts: readObjectField(pkg, "scripts"),
    enginesNode: readStringField(readObjectField(pkg, "engines"), "node")
  };
}
function nodeTestCommand(manifest) {
  const script = readStringField(manifest.scripts, "test");
  if (script === null)
    return null;
  if (script.trim() === "" || NPM_PLACEHOLDER_TEST.test(script.trim()))
    return null;
  return "npm test";
}
function nodeInstallCommand(repo) {
  if (repo.exists("package-lock.json"))
    return { command: "npm ci", from: "lockfile" };
  if (repo.exists("npm-shrinkwrap.json"))
    return { command: "npm ci", from: "lockfile" };
  if (repo.exists("yarn.lock"))
    return { command: "yarn install --frozen-lockfile", from: "lockfile" };
  if (repo.exists("pnpm-lock.yaml")) {
    return { command: "pnpm install --frozen-lockfile", from: "lockfile" };
  }
  if (repo.exists("package.json"))
    return { command: "npm install", from: "manifest" };
  return null;
}
function pythonTestCommand(repo) {
  const pyproject = repo.readText("pyproject.toml") ?? "";
  if (pyproject.includes("[tool.pytest.ini_options]"))
    return "pytest";
  if (repo.exists("pytest.ini"))
    return "pytest";
  if ((repo.readText("tox.ini") ?? "").includes("pytest"))
    return "pytest";
  if ((repo.readText("setup.cfg") ?? "").includes("[tool:pytest]"))
    return "pytest";
  const declaresPytest = (text) => /(?:^|[\s"'[])pytest(?:[\s"'\]<>=~!,]|$)/m.test(text);
  if (declaresPytest(pyproject))
    return "pytest";
  for (const name of ["requirements.txt", "requirements-dev.txt", "requirements/dev.txt"]) {
    const text = repo.readText(name);
    if (text !== null && declaresPytest(text))
      return "pytest";
  }
  return null;
}
function pythonInstallCommand(repo) {
  if (repo.exists("poetry.lock"))
    return "poetry install";
  if (repo.exists("uv.lock"))
    return "uv sync";
  if (repo.exists("Pipfile.lock") || repo.exists("Pipfile"))
    return "pipenv install --dev";
  if (repo.exists("requirements.txt"))
    return "pip install -r requirements.txt";
  const pyproject = repo.readText("pyproject.toml");
  if (pyproject !== null) {
    return pyproject.includes("[tool.poetry]") ? "poetry install" : "pip install -e .";
  }
  return null;
}
function otherRuntimeCommands(repo, runtime) {
  switch (runtime) {
    case "go":
      return {
        install: "go mod download",
        // A go repo with no `_test.go` file anywhere has no suite to run.
        test: repo.listFiles("").some((f) => f.endsWith("_test.go")) ? "go test ./..." : null
      };
    case "rust":
      return { install: "cargo fetch", test: "cargo test" };
    case "ruby": {
      const gemfile = repo.readText("Gemfile") ?? "";
      const test = gemfile.includes("rspec") ? "bundle exec rspec" : repo.exists("Rakefile") ? "bundle exec rake test" : null;
      return { install: "bundle install", test };
    }
    case "dotnet":
      return { install: "dotnet restore", test: "dotnet test" };
    case "jvm": {
      if (repo.exists("pom.xml"))
        return { install: "mvn -B dependency:go-offline", test: "mvn -B test" };
      const wrapper = repo.exists("gradlew") ? "./gradlew" : "gradle";
      return { install: `${wrapper} dependencies`, test: `${wrapper} test` };
    }
    default:
      return { install: null, test: null };
  }
}
function exactVersion(text) {
  if (text === null)
    return null;
  const match = EXACT_VERSION.exec(text.trim());
  return match === null ? null : match[1];
}
function searchRuntimeVersion(repo, runtime) {
  const sources = [];
  const push = (label, raw) => {
    sources.push({ label, raw: raw === null ? null : raw.trim() });
  };
  if (runtime === "node") {
    push(".nvmrc", repo.readText(".nvmrc"));
    push(".node-version", repo.readText(".node-version"));
    push("package.json engines.node", readNodeManifest(repo)?.enginesNode ?? null);
  } else if (runtime === "python") {
    push(".python-version", repo.readText(".python-version"));
    push("pyproject.toml requires-python", matchFirst(repo.readText("pyproject.toml"), /^requires-python\s*=\s*["']([^"']+)["']/m));
  } else if (runtime === "go") {
    push("go.mod go directive", matchFirst(repo.readText("go.mod"), /^go\s+(\d+(?:\.\d+){0,2})\s*$/m));
  } else if (runtime === "rust") {
    push("Cargo.toml rust-version", matchFirst(repo.readText("Cargo.toml"), /^rust-version\s*=\s*["']([^"']+)["']/m));
  } else if (runtime === "ruby") {
    push(".ruby-version", repo.readText(".ruby-version"));
  } else if (runtime === "dotnet") {
    push("global.json sdk.version", readStringField(readObjectField(readJsonObject(repo, "global.json"), "sdk"), "version"));
  }
  let rangeFound = null;
  for (const source of sources) {
    if (source.raw === null || source.raw === "")
      continue;
    const exact = exactVersion(source.raw);
    if (exact !== null)
      return { version: exact, searched: sources.map((s) => s.label), rangeFound: null };
    if (rangeFound === null)
      rangeFound = source.raw;
  }
  return { version: null, searched: sources.map((s) => s.label), rangeFound };
}
function matchFirst(text, pattern) {
  if (text === null)
    return null;
  const match = pattern.exec(text);
  return match === null ? null : match[1];
}
var RUNTIME_MANIFESTS, MANIFEST_FILENAMES, NPM_PLACEHOLDER_TEST, EXACT_VERSION;
var init_manifest2 = __esm({
  "../../packages/envspec/dist/manifest.js"() {
    "use strict";
    RUNTIME_MANIFESTS = [
      { runtime: "node", files: ["package.json"] },
      { runtime: "python", files: ["pyproject.toml", "setup.py", "setup.cfg", "requirements.txt"] },
      { runtime: "go", files: ["go.mod"] },
      { runtime: "rust", files: ["Cargo.toml"] },
      { runtime: "jvm", files: ["pom.xml", "build.gradle", "build.gradle.kts"] },
      { runtime: "ruby", files: ["Gemfile"] },
      { runtime: "dotnet", files: [] }
    ];
    MANIFEST_FILENAMES = RUNTIME_MANIFESTS.flatMap((m) => m.files).concat(["*.csproj", "*.fsproj", "*.sln"]).sort();
    NPM_PLACEHOLDER_TEST = /^echo\s+["']?Error:\s*no test specified["']?\s*&&\s*exit\s+1$/;
    EXACT_VERSION = /^v?(\d+(?:\.\d+){0,2})$/;
  }
});

// ../../packages/envspec/dist/references.js
function collectSecretReferences(node, basePath, boundNames) {
  const bound = new Set(boundNames);
  const reasons = /* @__PURE__ */ new Map();
  for (const target of flattenStrings(node, basePath)) {
    for (const match of target.text.matchAll(ACTIONS_SECRET)) {
      const secret = match[1];
      record(reasons, {
        kind: "secret-reference",
        secret,
        syntax: "actions-secret",
        where: target.path,
        detail: `${target.path} references the repository secret \`${secret}\`, which this derivation does not hold and will not substitute; a run that needs it cannot be reproduced offline`
      });
    }
    for (const match of target.text.matchAll(SHELL_ENV)) {
      const secret = match[1];
      if (bound.has(secret))
        continue;
      if (NON_SECRET_CONTEXT.test(match[0]))
        continue;
      record(reasons, {
        kind: "secret-reference",
        secret,
        syntax: "shell-env",
        where: target.path,
        detail: `${target.path} references the environment variable \`${secret}\`, which no \`env:\` block in scope binds to a literal value; its value would have to come from outside the repo`
      });
    }
  }
  return [...reasons.values()].sort((a, b) => a.secret.localeCompare(b.secret) || a.where.localeCompare(b.where));
}
function record(into, reason) {
  const key = `${reason.syntax}:${reason.secret}`;
  if (!into.has(key))
    into.set(key, reason);
}
function flattenStrings(node, path) {
  const out = [];
  const walk = (value, at) => {
    if (typeof value === "string") {
      out.push({ text: value, path: at });
      return;
    }
    if (isList(value)) {
      value.forEach((item, index) => walk(item, `${at}[${index}]`));
      return;
    }
    if (isMap(value)) {
      for (const entry of value.entries)
        walk(entry.value, `${at}.${entry.key}`);
    }
  };
  walk(node, path);
  return out;
}
var ACTIONS_SECRET, SHELL_ENV, NON_SECRET_CONTEXT;
var init_references = __esm({
  "../../packages/envspec/dist/references.js"() {
    "use strict";
    init_yaml();
    ACTIONS_SECRET = /\$\{\{\s*secrets\.([A-Za-z_][A-Za-z0-9_]*)\s*\}\}/g;
    SHELL_ENV = /\$\{([A-Za-z_][A-Za-z0-9_]*)\}/g;
    NON_SECRET_CONTEXT = /^\$\{\{\s*(?:matrix|github|runner|job|steps|needs|inputs|env|vars|strategy)\./;
  }
});

// ../../packages/envspec/dist/repo.js
import { readdirSync, readFileSync, statSync } from "fs";
import { join as join5, relative, sep } from "path";
function createRepoReader(repoPath) {
  const resolveIn = (relativePath) => relativePath === "" ? repoPath : join5(repoPath, relativePath);
  const toPosix = (absolute) => relative(repoPath, absolute).split(sep).join("/");
  const readText = (relativePath) => {
    try {
      return readFileSync(resolveIn(relativePath), "utf8");
    } catch {
      return null;
    }
  };
  const statOf = (relativePath) => {
    try {
      return statSync(resolveIn(relativePath));
    } catch {
      return null;
    }
  };
  const listFiles = (relativeDir) => {
    const out = [];
    const walk = (dir, depth) => {
      if (depth > MAX_DEPTH)
        return;
      let names;
      try {
        names = readdirSync(dir);
      } catch {
        return;
      }
      for (const name of names.slice().sort()) {
        if (SKIP_DIRECTORIES.has(name))
          continue;
        const child = join5(dir, name);
        const st = statOf(toPosix(child));
        if (st === null)
          continue;
        if (st.isDirectory()) {
          walk(child, depth + 1);
          continue;
        }
        if (st.isFile())
          out.push(toPosix(child));
      }
    };
    const start = statOf(relativeDir);
    if (start === null || !start.isDirectory())
      return [];
    walk(resolveIn(relativeDir), 0);
    return out.sort();
  };
  return {
    readText,
    exists: (relativePath) => statOf(relativePath) !== null,
    isDirectory: (relativePath) => statOf(relativePath)?.isDirectory() === true,
    listFiles,
    listNames: (relativeDir) => {
      const st = statOf(relativeDir);
      if (st === null || !st.isDirectory())
        return [];
      try {
        return readdirSync(resolveIn(relativeDir)).slice().sort();
      } catch {
        return [];
      }
    }
  };
}
var SKIP_DIRECTORIES, MAX_DEPTH;
var init_repo = __esm({
  "../../packages/envspec/dist/repo.js"() {
    "use strict";
    SKIP_DIRECTORIES = /* @__PURE__ */ new Set([
      ".git",
      "node_modules",
      "dist",
      "build",
      "target",
      ".next",
      ".venv",
      "venv",
      "__pycache__",
      "vendor",
      "coverage"
    ]);
    MAX_DEPTH = 8;
  }
});

// ../../packages/envspec/dist/workflow.js
function scanWorkflows(repo) {
  const jobs = [];
  const fileReasons = [];
  const filesRead = [];
  const names = repo.listNames(WORKFLOW_DIR).filter((name) => name.endsWith(".yml") || name.endsWith(".yaml"));
  for (const name of names) {
    const file = `${WORKFLOW_DIR}/${name}`;
    const text = repo.readText(file);
    if (text === null)
      continue;
    filesRead.push(file);
    let document;
    try {
      document = parseYaml(text);
    } catch (err) {
      const detail = err instanceof YamlUnsupportedError ? `${file} uses ${err.construct} (line ${err.line}), which the workflow reader does not support, so no CI signal was taken from it` : `${file} could not be read as YAML, so no CI signal was taken from it`;
      fileReasons.push({ kind: "unparsed-workflow", file, detail });
      continue;
    }
    const workflowEnv = literalEnvNames(mapGet(document, "env"));
    for (const jobEntry of mapEntries(mapGet(document, "jobs"))) {
      jobs.push(readJob(file, jobEntry.key, jobEntry.value, workflowEnv));
    }
  }
  return { jobs, fileReasons, filesRead };
}
function readJob(file, id, node, workflowEnv) {
  const path = `jobs.${id}`;
  const matrix = readMatrix(mapGet(mapGet(node, "strategy"), "matrix"));
  const singletons = /* @__PURE__ */ new Map();
  for (const dimension of matrix) {
    if (dimension.values.length === 1)
      singletons.set(dimension.key, dimension.values[0]);
  }
  const steps = [];
  const rawSteps = mapGet(node, "steps");
  if (isList(rawSteps)) {
    rawSteps.forEach((step, index) => {
      steps.push({
        index,
        name: asString(mapGet(step, "name")),
        uses: asString(mapGet(step, "uses")),
        run: asString(mapGet(step, "run")),
        withEntries: mapEntries(mapGet(step, "with")).map((entry) => entry.value),
        withMap: mapGet(step, "with"),
        path: `${path}.steps[${index}]`
      });
    });
  }
  const { services, reasons } = readServices(file, path, mapGet(node, "services"));
  return {
    id,
    file,
    runsOn: asStringList(mapGet(node, "runs-on")),
    steps,
    services,
    matrix,
    singletons,
    literalEnvNames: [...workflowEnv, ...literalEnvNames(mapGet(node, "env"))].sort(),
    reasons,
    node,
    path
  };
}
function readMatrix(node) {
  const dimensions = [];
  for (const entry of mapEntries(node)) {
    if (entry.key === "include" || entry.key === "exclude") {
      const count = isList(entry.value) ? entry.value.length : 1;
      dimensions.push({ key: entry.key, values: Array.from({ length: count }, () => "unknown") });
      continue;
    }
    const values = asStringList(entry.value);
    if (values.length > 0)
      dimensions.push({ key: entry.key, values });
  }
  return dimensions;
}
function readServices(file, jobPath, node) {
  const services = [];
  const reasons = [];
  for (const entry of mapEntries(node)) {
    const where = `${file} ${jobPath}.services.${entry.key}`;
    const image = asString(mapGet(entry.value, "image"));
    if (image === null) {
      reasons.push({
        kind: "service-image-undeclared",
        service: entry.key,
        where,
        detail: `the service \`${entry.key}\` is declared in ${where} without an \`image:\`, so no container could be identified for it`
      });
      continue;
    }
    const ports = /* @__PURE__ */ new Set();
    for (const port of asStringList(mapGet(entry.value, "ports"))) {
      const segments = port.split(":");
      const parsed = Number.parseInt(segments[segments.length - 1], 10);
      if (Number.isInteger(parsed))
        ports.add(parsed);
    }
    const env = [];
    for (const pair of mapEntries(mapGet(entry.value, "env"))) {
      const value = asString(pair.value);
      if (value === null)
        continue;
      if (containsExpression(value)) {
        continue;
      }
      env.push({ name: pair.key, value });
    }
    services.push({
      name: entry.key,
      image,
      ports: [...ports].sort((a, b) => a - b),
      env: env.sort((a, b) => a.name.localeCompare(b.name)),
      declaredIn: "ci-workflow"
    });
  }
  return { services: services.sort((a, b) => a.name.localeCompare(b.name)), reasons };
}
function literalEnvNames(node) {
  return mapEntries(node).filter((entry) => {
    const value = asString(entry.value);
    return value !== null && !containsExpression(value);
  }).map((entry) => entry.key);
}
function containsExpression(text) {
  return /\$\{\{/.test(text) || /\$\{[A-Za-z_][A-Za-z0-9_]*\}/.test(text);
}
function reduceExpression(text, singletons) {
  const reduced = text.replace(/\$\{\{\s*matrix\.([A-Za-z0-9_-]+)\s*\}\}/g, (all, key) => {
    const value = singletons.get(key);
    return value === void 0 ? all : value;
  });
  return /\$\{\{/.test(reduced) ? null : reduced;
}
function findTestCommand(job) {
  return findCommand(job, TEST_COMMAND_PATTERNS);
}
function findInstallCommand(job) {
  return findCommand(job, INSTALL_COMMAND_PATTERNS);
}
function findCommand(job, patterns) {
  for (const step of job.steps) {
    if (step.run === null)
      continue;
    const lines = step.run.split("\n");
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i].trim().replace(/\s*\\$/, "");
      const bare = line.replace(/^(?:sudo|time|env)\s+/, "");
      if (patterns.some((pattern) => pattern.test(bare))) {
        return { command: line, where: `${job.file} ${step.path}.run` };
      }
    }
  }
  return null;
}
function findActionInput(job, action, input) {
  for (const step of job.steps) {
    if (step.uses === null || !step.uses.startsWith(action))
      continue;
    const value = asString(mapGet(step.withMap, input));
    if (value === null)
      continue;
    return { command: value, where: `${job.file} ${step.path}.with.${input}` };
  }
  return null;
}
function jobRunsTests(job) {
  return findTestCommand(job) !== null;
}
function selectJob(jobs) {
  const candidates = jobs.filter(jobRunsTests);
  if (candidates.length === 0)
    return null;
  return candidates.find((job) => TEST_JOB_HINT.test(job.id)) ?? candidates[0];
}
var WORKFLOW_DIR, TEST_COMMAND_PATTERNS, INSTALL_COMMAND_PATTERNS, TEST_JOB_HINT;
var init_workflow = __esm({
  "../../packages/envspec/dist/workflow.js"() {
    "use strict";
    init_yaml();
    WORKFLOW_DIR = ".github/workflows";
    TEST_COMMAND_PATTERNS = [
      /^npm\s+(?:run\s+)?test(?::[\w:-]+)?\b/,
      /^(?:yarn|pnpm)\s+(?:run\s+)?test(?::[\w:-]+)?\b/,
      /^(?:npx\s+)?(?:vitest|jest|mocha|ava)\b/,
      /^(?:npx\s+)?playwright\s+test\b/,
      /^(?:python[\d.]*\s+-m\s+)?pytest\b/,
      /^py\.test\b/,
      /^(?:tox|nox)\b/,
      /^go\s+test\b/,
      /^cargo\s+(?:test|nextest\s+run)\b/,
      /^(?:bundle\s+exec\s+)?(?:rspec|rake\s+test)\b/,
      /^(?:mvn|\.\/mvnw)\s+(?:[-\w:.=]+\s+)*test\b/,
      /^(?:gradle|\.\/gradlew)\s+(?:[-\w:.=]+\s+)*(?:test|check)\b/,
      /^dotnet\s+test\b/,
      /^make\s+(?:test|check)\b/
    ];
    INSTALL_COMMAND_PATTERNS = [
      /^npm\s+(?:ci|install)\b/,
      /^yarn\s+(?:install\b|--frozen-lockfile\b|$)/,
      /^pnpm\s+(?:install|i)\b/,
      /^(?:python[\d.]*\s+-m\s+)?pip[\d.]*\s+install\b/,
      /^(?:poetry|pipenv)\s+install\b/,
      /^uv\s+(?:sync|pip\s+install)\b/,
      /^go\s+mod\s+download\b/,
      /^cargo\s+fetch\b/,
      /^bundle\s+install\b/,
      /^dotnet\s+restore\b/,
      /^(?:mvn|\.\/mvnw)\s+dependency:go-offline\b/,
      /^make\s+(?:install|deps)\b/
    ];
    TEST_JOB_HINT = /(?:^|[\W_])(?:test|tests|spec|specs|unit|check|ci)(?:$|[\W_])/i;
  }
});

// ../../packages/envspec/dist/derive.js
function deriveEnvironmentSpec(repoPath) {
  return deriveFromReader(createRepoReader(repoPath));
}
function deriveFromReader(repo) {
  const unresolved = [];
  const derivedFrom = /* @__PURE__ */ new Set();
  const detection = detectRuntime(repo);
  const runtime = detection.runtime;
  if (runtime === "unknown") {
    unresolved.push({
      kind: "unknown-runtime",
      searched: MANIFEST_FILENAMES,
      detail: `no ecosystem manifest was found at the repo root (looked for ${MANIFEST_FILENAMES.join(", ")}), so the language runtime could not be identified`
    });
  } else {
    derivedFrom.add("manifest");
  }
  if (detection.candidates.length > 1) {
    unresolved.push({
      kind: "multiple-runtimes",
      candidates: detection.candidates,
      chosen: runtime,
      detail: `manifests for more than one ecosystem sit at the repo root (${detection.candidates.join(", ")}); \`${runtime}\` was chosen by a fixed precedence, so the derived commands may target the wrong suite`
    });
  }
  const workflows = scanWorkflows(repo);
  unresolved.push(...workflows.fileReasons);
  const job = selectJob(workflows.jobs);
  if (job !== null) {
    derivedFrom.add("ci-workflow");
    unresolved.push(...job.reasons);
    unresolved.push(...runnerReasons(job));
    unresolved.push(...matrixReasons(job));
    unresolved.push(...collectSecretReferences(job.node, `${job.file} ${job.path}`, job.literalEnvNames));
  } else {
    for (const candidate of workflows.jobs) {
      unresolved.push(...collectSecretReferences(candidate.node, `${candidate.file} ${candidate.path}`, candidate.literalEnvNames));
    }
  }
  const testFromCi = job === null ? null : findTestCommand(job);
  let testCommand = null;
  if (testFromCi !== null && job !== null) {
    testCommand = reduceExpression(testFromCi.command, job.singletons);
  }
  if (testCommand === null) {
    const fromManifest = manifestTestCommand(repo, runtime);
    if (fromManifest !== null) {
      testCommand = fromManifest;
      derivedFrom.add("manifest");
    }
  }
  if (testCommand === null) {
    unresolved.push({
      kind: "no-test-command",
      searched: testSearchPaths(runtime, workflows.filesRead),
      detail: testFromCi === null ? `no test command could be derived: ${describeTestSearch(repo, runtime, workflows.filesRead)}` : `a test step was found at ${testFromCi.where} but it depends on a matrix with more than one value, so it does not reduce to a single command`
    });
  }
  const installFromCi = job === null ? null : findInstallCommand(job);
  let installCommand = null;
  if (installFromCi !== null && job !== null) {
    installCommand = reduceExpression(installFromCi.command, job.singletons);
  }
  if (installCommand === null) {
    const fallback = manifestInstallCommand(repo, runtime);
    if (fallback !== null) {
      installCommand = fallback.command;
      derivedFrom.add(fallback.from);
    }
  }
  if (installCommand === null) {
    unresolved.push({
      kind: "no-install-command",
      searched: installSearchPaths(runtime, workflows.filesRead),
      detail: `no dependency install command could be derived for runtime \`${runtime}\`: neither a CI step nor a lockfile or manifest names one`
    });
  }
  const version = deriveRuntimeVersion(repo, runtime, job);
  if (version.value === null && runtime !== "unknown") {
    unresolved.push({
      kind: "runtime-version-undeclared",
      runtime,
      searched: version.searched,
      detail: version.rangeFound === null ? `the repo declares no ${runtime} version, so the container will use our default rather than a version the repo asked for` : `the only ${runtime} version declaration found is the range \`${version.rangeFound}\`, which names no single version; pinning one out of a range would choose an environment the repo never asked for`
    });
  }
  let services = job?.services ?? [];
  if (services.length === 0) {
    const compose = scanCompose(repo);
    if (compose.unparsed && compose.file !== null) {
      unresolved.push({
        kind: "unparsed-workflow",
        file: compose.file,
        detail: `${compose.file} could not be read as YAML by the bounded compose reader, so no service declarations were taken from it`
      });
    }
    services = compose.services;
    if (services.length > 0)
      derivedFrom.add("compose");
  }
  if (services.length === 0) {
    for (const file of devcontainerComposeFiles(repo)) {
      const scan = scanComposeFile(repo, file);
      if (scan === null || scan.services.length === 0)
        continue;
      services = scan.services.map((service) => ({ ...service, declaredIn: "devcontainer" }));
      derivedFrom.add("devcontainer");
      break;
    }
  }
  const migrations = findMigrations(repo);
  const seeds = findSeeds(repo);
  return {
    runtime,
    runtimeVersion: version.value,
    installCommand,
    testCommand,
    services,
    migrations,
    seeds,
    derivedFrom: [...derivedFrom].sort(),
    unresolved: sortReasons(unresolved)
  };
}
function runnerReasons(job) {
  const reasons = [];
  for (const label of job.runsOn) {
    if (label !== "self-hosted")
      continue;
    reasons.push({
      kind: "self-hosted-runner",
      label,
      where: `${job.file} ${job.path}.runs-on`,
      detail: `${job.file} ${job.path} runs on a self-hosted runner, so its environment is defined by a machine outside the repo and cannot be reproduced from the repo alone`
    });
  }
  return reasons;
}
function matrixReasons(job) {
  const reasons = [];
  for (const dimension of job.matrix) {
    if (dimension.values.length <= 1)
      continue;
    reasons.push({
      kind: "irreducible-matrix",
      dimension: dimension.key,
      values: dimension.values,
      where: `${job.file} ${job.path}.strategy.matrix.${dimension.key}`,
      detail: `${job.file} ${job.path} runs a matrix over \`${dimension.key}\` with ${dimension.values.length} values (${dimension.values.join(", ")}); one container is one environment, so this cannot be reduced to a single choice without picking on the repo's behalf`
    });
  }
  return reasons;
}
function manifestTestCommand(repo, runtime) {
  if (runtime === "node") {
    const manifest = readNodeManifest(repo);
    return manifest === null ? null : nodeTestCommand(manifest);
  }
  if (runtime === "python")
    return pythonTestCommand(repo);
  return otherRuntimeCommands(repo, runtime).test;
}
function manifestInstallCommand(repo, runtime) {
  if (runtime === "node") {
    const node = nodeInstallCommand(repo);
    return node === null ? null : { command: node.command, from: node.from };
  }
  if (runtime === "python") {
    const python = pythonInstallCommand(repo);
    return python === null ? null : { command: python, from: "manifest" };
  }
  const other = otherRuntimeCommands(repo, runtime).install;
  return other === null ? null : { command: other, from: "manifest" };
}
function deriveRuntimeVersion(repo, runtime, job) {
  const setup = SETUP_ACTIONS[runtime];
  const searched = [];
  let rangeFound = null;
  if (job !== null && setup !== void 0) {
    const direct = findActionInput(job, setup.action, setup.input);
    if (direct !== null) {
      searched.push(`${job.file} ${setup.action} ${setup.input}`);
      const reduced = reduceExpression(direct.command, job.singletons);
      const exact = exactVersion(reduced);
      if (exact !== null)
        return { value: exact, searched, rangeFound: null };
      if (reduced !== null)
        rangeFound = reduced;
    }
    const viaFile = findActionInput(job, setup.action, setup.fileInput);
    if (viaFile !== null) {
      searched.push(`${job.file} ${setup.action} ${setup.fileInput} -> ${viaFile.command}`);
      const exact = exactVersion(repo.readText(viaFile.command));
      if (exact !== null)
        return { value: exact, searched, rangeFound: null };
    }
  }
  const fromFiles = searchRuntimeVersion(repo, runtime);
  return {
    value: fromFiles.version,
    searched: [...searched, ...fromFiles.searched],
    rangeFound: rangeFound ?? fromFiles.rangeFound
  };
}
function testSearchPaths(runtime, workflowFiles) {
  const paths = [...workflowFiles];
  if (workflowFiles.length === 0)
    paths.push(".github/workflows (absent)");
  if (runtime === "node")
    paths.push("package.json scripts.test");
  if (runtime === "python") {
    paths.push("pyproject.toml", "pytest.ini", "setup.cfg", "tox.ini", "requirements.txt");
  }
  if (runtime === "go")
    paths.push("**/*_test.go");
  if (runtime === "ruby")
    paths.push("Gemfile", "Rakefile");
  if (runtime === "unknown")
    paths.push(...MANIFEST_FILENAMES);
  return [...new Set(paths)].sort();
}
function describeTestSearch(repo, runtime, workflowFiles) {
  const ciPart = workflowFiles.length === 0 ? "the repo has no GitHub Actions workflow" : `no job in ${workflowFiles.join(", ")} runs a recognised test command`;
  if (runtime === "unknown") {
    return `${ciPart}, and no ecosystem manifest identifies a runtime whose test convention we could apply`;
  }
  if (runtime === "node") {
    const manifest = readNodeManifest(repo);
    const hasScripts = manifest?.scripts !== null && manifest?.scripts !== void 0;
    return `${ciPart}, and \`package.json\` ${hasScripts ? "declares no usable `test` script (an `npm init` placeholder that exits 1 does not count)" : "declares no `scripts` block"}`;
  }
  if (runtime === "python") {
    return `${ciPart}, and nothing in the repo names a test runner \u2014 no \`[tool.pytest.ini_options]\`, no \`pytest.ini\`, and no pytest dependency in \`pyproject.toml\` or a requirements file`;
  }
  return `${ciPart}, and no ${runtime} test convention applies to this tree`;
}
function installSearchPaths(runtime, workflowFiles) {
  const paths = [...workflowFiles];
  if (runtime === "node")
    paths.push("package-lock.json", "pnpm-lock.yaml", "yarn.lock");
  if (runtime === "python")
    paths.push("poetry.lock", "pyproject.toml", "requirements.txt", "uv.lock");
  if (runtime === "unknown")
    paths.push(...MANIFEST_FILENAMES);
  return [...new Set(paths)].sort();
}
function sortReasons(reasons) {
  return reasons.slice().sort((a, b) => {
    const byKind = KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind);
    if (byKind !== 0)
      return byKind;
    return secondaryKey(a).localeCompare(secondaryKey(b));
  });
}
function secondaryKey(reason) {
  switch (reason.kind) {
    case "secret-reference":
      return `${reason.secret}:${reason.where}`;
    case "irreducible-matrix":
      return reason.dimension;
    case "self-hosted-runner":
      return reason.where;
    case "service-image-undeclared":
      return reason.service;
    case "unparsed-workflow":
      return reason.file;
    default:
      return "";
  }
}
var SETUP_ACTIONS, KIND_ORDER;
var init_derive = __esm({
  "../../packages/envspec/dist/derive.js"() {
    "use strict";
    init_database();
    init_manifest2();
    init_references();
    init_repo();
    init_workflow();
    SETUP_ACTIONS = {
      node: { action: "actions/setup-node", input: "node-version", fileInput: "node-version-file" },
      python: {
        action: "actions/setup-python",
        input: "python-version",
        fileInput: "python-version-file"
      },
      go: { action: "actions/setup-go", input: "go-version", fileInput: "go-version-file" },
      ruby: { action: "ruby/setup-ruby", input: "ruby-version", fileInput: "ruby-version-file" },
      dotnet: {
        action: "actions/setup-dotnet",
        input: "dotnet-version",
        fileInput: "global-json-file"
      },
      jvm: { action: "actions/setup-java", input: "java-version", fileInput: "java-version-file" }
    };
    KIND_ORDER = [
      "no-test-command",
      "no-install-command",
      "unknown-runtime",
      "multiple-runtimes",
      "self-hosted-runner",
      "irreducible-matrix",
      "secret-reference",
      "service-image-undeclared",
      "unparsed-workflow",
      "runtime-version-undeclared"
    ];
  }
});

// ../../packages/envspec/dist/index.js
var init_dist3 = __esm({
  "../../packages/envspec/dist/index.js"() {
    "use strict";
    init_derive();
    init_repo();
    init_yaml();
  }
});

// ../../packages/envrun/dist/thrun.js
import { execFileSync, spawnSync as spawnSync6 } from "child_process";
import { existsSync as existsSync3, mkdirSync as mkdirSync4 } from "fs";
import { randomUUID } from "crypto";
import { join as join6 } from "path";
function git(repoDir, args, allowNonZero = false) {
  const res = spawnSync6("git", [...args], {
    cwd: repoDir,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024
  });
  if (res.error)
    throw new ThRunError(`git ${args[0] ?? ""} failed: ${res.error.message}`);
  if (res.status !== 0 && !allowNonZero) {
    throw new ThRunError(`git ${args.join(" ")} exited ${String(res.status)} in ${repoDir}: ${(res.stderr ?? "").trim()}`);
  }
  return res.stdout ?? "";
}
function collectWorkingDiff(repoDir) {
  if (!existsSync3(join6(repoDir, ".git"))) {
    throw new ThRunError(`${repoDir} is not a git checkout (no .git). \`th run\` ships the working diff, so it needs a repository to read one from.`);
  }
  const headSha = git(repoDir, ["rev-parse", "HEAD"]).trim();
  const tracked = git(repoDir, ["diff", "HEAD", "--binary"]);
  const trackedChanged = git(repoDir, ["diff", "HEAD", "--name-only"]).split("\n").map((s) => s.trim()).filter((s) => s.length > 0);
  const untracked = git(repoDir, ["ls-files", "--others", "--exclude-standard"]).split("\n").map((s) => s.trim()).filter((s) => s.length > 0);
  const parts = [];
  if (tracked.trim() !== "")
    parts.push(tracked.replace(/\n*$/, "\n"));
  for (const file of untracked) {
    const one = git(repoDir, ["diff", "--no-index", "--binary", "--", "/dev/null", file], true);
    if (one.trim() !== "")
      parts.push(one.replace(/\n*$/, "\n"));
  }
  return { patch: parts.join(""), headSha, trackedChanged, untracked };
}
function cloneTargetAt(opts) {
  mkdirSync4(opts.dest, { recursive: true });
  const source = opts.cacheDir ?? opts.url;
  const run2 = (args) => {
    execFileSync("git", [...args], { cwd: opts.dest, encoding: "utf8", stdio: "pipe" });
  };
  run2(["init", "-q"]);
  run2(["remote", "add", "origin", source]);
  run2(["fetch", "-q", "--depth", "1", "origin", opts.sha]);
  run2(["checkout", "-q", "FETCH_HEAD"]);
  const head = execFileSync("git", ["rev-parse", "HEAD"], {
    cwd: opts.dest,
    encoding: "utf8"
  }).trim();
  if (head !== opts.sha) {
    throw new ThRunError(`the target checkout is at ${head}, not the requested ${opts.sha}. Refusing to verify against a commit the result would misattribute.`);
  }
  return head;
}
function patchedTreeDigest(repoDir) {
  execFileSync("git", ["-C", repoDir, "add", "-A", "-f"], { stdio: "pipe" });
  const treeOid = execFileSync("git", ["-C", repoDir, "write-tree"], {
    encoding: "utf8"
  }).trim();
  return sha256Hex(treeOid);
}
function applyPatch(repoDir, patch, what) {
  if (patch.trim() === "")
    return;
  const res = spawnSync6("git", ["apply", "--whitespace=nowarn", "-"], {
    cwd: repoDir,
    input: patch,
    encoding: "utf8"
  });
  if (res.error)
    throw new ThRunError(`could not run git apply: ${res.error.message}`);
  if (res.status !== 0) {
    throw new ThRunError(`the ${what} did not apply cleanly to the target checkout: ${(res.stderr ?? "").trim()}. The diff was built against a different commit than the one being verified.`);
  }
}
function tail(text, bytes = OUTPUT_TAIL_BYTES) {
  return text.length <= bytes ? text : text.slice(-bytes);
}
function excerptOutput(stdout, stderr) {
  const combined = `${stdout}${stderr}`;
  if (combined.length <= OUTPUT_TAIL_BYTES)
    return combined;
  const lines = combined.split("\n");
  const firstFailure = lines.findIndex((l) => FAILURE_LINE.test(l));
  if (firstFailure === -1)
    return tail(combined);
  const from = Math.max(0, firstFailure - 10);
  const window = lines.slice(from, firstFailure + 80).join("\n");
  const ending = lines.slice(-20).join("\n");
  return tail(`${window}

\u2026 (output trimmed; full log at the preview URL) \u2026

${ending}`);
}
function toPreviewHandle(p) {
  return {
    url: p.url,
    instanceToken: p.instanceToken,
    containerId: p.container,
    readyMs: p.readyMs
  };
}
async function verifyWorkingDiff(req) {
  const startedAt = Date.now();
  const runId = req.runId ?? `run-${randomUUID().slice(0, 8)}`;
  const labels = { ...req.labels ?? {}, [RUN_LABEL_KEY]: "term-350" };
  const progress = req.onProgress ?? (() => {
  });
  progress("collect", `reading the working diff from ${req.localRepoDir}`);
  const diff = collectWorkingDiff(req.localRepoDir);
  progress("collect", `${String(diff.trackedChanged.length)} tracked, ${String(diff.untracked.length)} untracked, ${String(diff.patch.length)} bytes`);
  const pre = diff.patch.trim() === "" ? { refused: false, refusals: [], touchedPaths: [] } : preflightBoundary({ patch: diff.patch, sliceFiles: req.sliceFiles });
  if (pre.refused) {
    const first = pre.refusals[0];
    return {
      result: {
        schema: RUN_RESULT_SCHEMA,
        runId,
        claimId: req.claimId,
        status: "refused",
        outcome: null,
        reason: first?.detail ?? "the diff was refused by the local slice pre-flight, but no reason was recorded",
        exitCode: null,
        testCommand: null,
        testOutputTail: "",
        counts: null,
        wallMs: Date.now() - startedAt,
        targetRepo: req.targetRepo,
        targetSha: req.targetSha,
        // All null/none, and not for tidiness: the diff never reached a tree, so there is
        // nothing to bind a signature to. `toAcceptancePredicate` refuses a run in this
        // state outright rather than signing a statement about work that never ran.
        patchSha256: null,
        treeDigest: null,
        baselinePatchSha256: null,
        testCommandSource: "none",
        boundaryRefusals: pre.refusals,
        touchedPaths: pre.touchedPaths,
        preview: null,
        containerImage: null,
        // NOT `true`. No container was created, so there is nothing to certify
        // clean, and reporting clean here is exactly the false green criterion 4
        // is written against.
        leaksClean: null
      },
      preview: null,
      spec: null,
      verdict: null
    };
  }
  const stage = join6(req.scratchRoot, runId);
  const cloneDir = join6(stage, "clone");
  const scratch = join6(stage, "scratch");
  mkdirSync4(scratch, { recursive: true });
  progress("clone", `${req.targetRepo} @ ${req.targetSha.slice(0, 12)}`);
  cloneTargetAt({
    url: req.targetRepo,
    sha: req.targetSha,
    dest: cloneDir,
    ...req.targetCacheDir ? { cacheDir: req.targetCacheDir } : {}
  });
  const hasBaselinePatch = req.baselinePatch !== void 0 && req.baselinePatch.trim() !== "";
  if (hasBaselinePatch) {
    applyPatch(cloneDir, req.baselinePatch ?? "", "baseline patch");
  }
  applyPatch(cloneDir, diff.patch, "developer's working diff");
  const patchSha256 = sha256Hex(diff.patch);
  const treeDigest = patchedTreeDigest(cloneDir);
  const baselinePatchSha256 = hasBaselinePatch ? sha256Hex(req.baselinePatch ?? "") : null;
  const derived = deriveEnvironmentSpec(cloneDir);
  const spec = req.testCommandOverride === void 0 ? derived : { ...derived, testCommand: req.testCommandOverride };
  progress("derive", `runtime=${spec.runtime} install=${String(spec.installCommand)} test=${String(spec.testCommand)}`);
  const placement = req.placement ?? localDockerPlacement();
  const image = placement.imageFor(spec.runtime, req.image);
  progress("run", `placement ${placement.kind}, image ${image}`);
  const verdict = await runEnvironmentSpec({
    repoDir: cloneDir,
    spec,
    scratchRoot: scratch,
    labels,
    image,
    containment: placement.containment(),
    ...req.installTimeoutMs === void 0 ? {} : { installTimeoutMs: req.installTimeoutMs },
    ...req.testTimeoutMs === void 0 ? {} : { testTimeoutMs: req.testTimeoutMs }
  });
  const outputTail = excerptOutput(verdict.test?.stdout ?? "", verdict.test?.stderr ?? "");
  const base = {
    schema: RUN_RESULT_SCHEMA,
    runId,
    claimId: req.claimId,
    status: "verified",
    outcome: verdict.outcome,
    reason: verdict.note,
    exitCode: verdict.test?.exitCode ?? null,
    testCommand: verdict.test?.command ?? spec.testCommand,
    testOutputTail: outputTail,
    counts: verdict.counts,
    wallMs: Date.now() - startedAt,
    targetRepo: req.targetRepo,
    targetSha: req.targetSha,
    patchSha256,
    treeDigest,
    baselinePatchSha256,
    // `detected` is the only value that carries weight, because it means the REPO chose the
    // command and nobody picked one to suit the outcome. An override records WHICH human
    // chose it, and defaults to `developer-declared` — the CLI's `--test-command` flag is
    // the developer's, run on the developer's machine, judging the developer's work. Calling
    // that `founder-declared` (as this did for one review round) signs the counterparty's
    // name onto the developer's choice, which is worse than laundering it as `detected`:
    // it is a specific false attribution inside a field a reviewer trusts.
    testCommandSource: req.testCommandOverride !== void 0 ? req.testCommandOverrideOrigin === "founder" ? "founder-declared" : "developer-declared" : derived.testCommand === null ? "none" : "detected",
    boundaryRefusals: [],
    touchedPaths: pre.touchedPaths,
    preview: null,
    containerImage: verdict.image,
    leaksClean: verdict.leaks.clean
  };
  if (req.preview === false)
    return { result: base, preview: null, spec, verdict };
  progress("preview", "starting one instance both parties can open");
  const instance = await startPreview({
    labels,
    idBase: `th-${runId}`,
    image,
    scratchDir: join6(stage, "preview"),
    // The document is the result itself, so the URL and the terminal cannot
    // disagree about what happened. `preview` is null inside it on purpose —
    // a document that carried its own URL would be self-referential and would
    // have to be written after the port was known.
    document: base
  });
  return {
    result: {
      ...base,
      preview: toPreviewHandle(instance),
      // Re-taken AFTER the preview is reachable, so the number a developer reads
      // is the time until they could actually open the URL.
      wallMs: Date.now() - startedAt
    },
    preview: instance,
    spec,
    verdict
  };
}
var ThRunError, OUTPUT_TAIL_BYTES, FAILURE_LINE;
var init_thrun = __esm({
  "../../packages/envrun/dist/thrun.js"() {
    "use strict";
    init_dist3();
    init_attestation2();
    init_boundary();
    init_labels();
    init_execute();
    init_placement();
    init_preview();
    init_result();
    ThRunError = class extends Error {
    };
    OUTPUT_TAIL_BYTES = 4e3;
    FAILURE_LINE = /^(?:[ \t]*(?:not ok |FAILED |FAIL )|E {3}|# fail [1-9])/m;
  }
});

// ../../packages/envrun/dist/dbplan.js
function isBookkeepingTable(name) {
  return BOOKKEEPING_TABLES.includes(name);
}
function bookkeepingFor(runner) {
  switch (runner) {
    case "prisma":
      return {
        table: "_prisma_migrations",
        shape: "row-per-migration",
        // A Prisma row is INSERTed before the migration runs and stamped with
        // finished_at after it commits. Counting rows without the filter counts
        // the failure too, which would make a partial application look complete
        // — criterion 1(b) exactly.
        query: "SELECT count(*) FROM _prisma_migrations WHERE finished_at IS NOT NULL AND rolled_back_at IS NULL"
      };
    case "sql":
      return {
        table: "_th_migrations",
        shape: "row-per-migration",
        query: "SELECT count(*) FROM _th_migrations"
      };
    case "rails":
      return {
        table: "schema_migrations",
        shape: "row-per-migration",
        query: "SELECT count(*) FROM schema_migrations"
      };
    case "alembic":
      return {
        table: "alembic_version",
        shape: "single-head-revision",
        // ONE row, holding the head revision id. Deliberately NOT a count:
        // count(*) here is 1 for any number of applied migrations, so it is a
        // check whose passing condition is also satisfied by almost nothing
        // having happened.
        query: "SELECT version_num FROM alembic_version"
      };
  }
}
function detectRunner(migrations) {
  if (migrations.some((p) => p.startsWith("prisma/migrations/")))
    return "prisma";
  if (migrations.some((p) => p.startsWith("alembic/versions/")))
    return "alembic";
  if (migrations.some((p) => p.startsWith("db/migrate/") && p.endsWith(".rb")))
    return "rails";
  if (migrations.some((p) => p.endsWith(".sql")))
    return "sql";
  return null;
}
function migrationUnits(runner, migrations) {
  switch (runner) {
    case "prisma": {
      const byDir = /* @__PURE__ */ new Map();
      for (const path of migrations) {
        const match = /^prisma\/migrations\/([^/]+)\/migration\.sql$/.exec(path);
        if (!match)
          continue;
        byDir.set(match[1], path);
      }
      return [...byDir.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([id, path]) => ({ id, path }));
    }
    case "alembic":
      return migrations.filter((p) => /^alembic\/versions\/[^/]+\.py$/.test(p) && !p.endsWith("/__init__.py")).sort().map((path) => ({ id: basename(path).replace(/\.py$/, ""), path }));
    case "rails":
      return migrations.filter((p) => /^db\/migrate\/[^/]+\.rb$/.test(p)).sort().map((path) => ({ id: /^(\d+)/.exec(basename(path))?.[1] ?? basename(path), path }));
    case "sql":
      return migrations.filter((p) => p.endsWith(".sql") && !p.startsWith("prisma/migrations/")).sort().map((path) => ({ id: path, path }));
  }
}
function basename(path) {
  const at = path.lastIndexOf("/");
  return at === -1 ? path : path.slice(at + 1);
}
function alembicChainPosition(head, revisions) {
  const byRevision = new Map(revisions.map((r) => [r.revision, r]));
  let cursor = head;
  let seen = 0;
  const visited = /* @__PURE__ */ new Set();
  while (cursor !== null) {
    if (visited.has(cursor))
      return null;
    visited.add(cursor);
    const node = byRevision.get(cursor);
    if (!node)
      return null;
    seen += 1;
    cursor = node.downRevision;
  }
  return seen;
}
function parseAlembicRevision(text) {
  const rev = /^\s*revision(?:\s*:\s*str)?\s*=\s*['"]([^'"]+)['"]/m.exec(text);
  const down = /^\s*down_revision(?:\s*:\s*[^=]+)?\s*=\s*(?:['"]([^'"]+)['"]|None)/m.exec(text);
  return {
    revision: rev ? rev[1] : null,
    downRevision: down && down[1] ? down[1] : null
  };
}
function connectionUrl(c) {
  const user = encodeURIComponent(c.user);
  const password = encodeURIComponent(c.password);
  return `postgresql://${user}:${password}@${c.host}:${String(c.port)}/${c.database}`;
}
function findDatabaseService(spec) {
  for (const service of spec.services) {
    if (/(?:^|\/)postgres(?::|$)/.test(service.image) || /^postgres:/.test(service.image)) {
      return { image: service.image };
    }
  }
  return null;
}
function planDatabase(spec) {
  const runner = detectRunner(spec.migrations);
  const units = runner ? migrationUnits(runner, spec.migrations) : [];
  const declared = findDatabaseService(spec);
  if (runner === null || units.length === 0) {
    const reason = spec.migrations.length > 0 ? `no database environment could be derived: ${String(spec.migrations.length)} migration path(s) were discovered but none matched a runner layout we can execute (prisma/migrations/*/migration.sql, alembic/versions/*.py, db/migrate/*.rb, or ordered *.sql)` : "no database environment could be derived: the repo declares no migrations, so there is no schema to replay. We do not invent one.";
    return {
      kind: "unresolved",
      image: null,
      runner: null,
      units: [],
      bookkeeping: null,
      seeds: [],
      reason
    };
  }
  return {
    kind: declared ? "declared-service" : "stock-postgres",
    image: declared ? declared.image : STOCK_POSTGRES_IMAGE,
    runner,
    units,
    bookkeeping: bookkeepingFor(runner),
    seeds: spec.seeds,
    reason: null
  };
}
function readAlembicChain(repo, units) {
  const out = [];
  for (const unit of units) {
    const text = repo.readText(unit.path);
    if (text === null)
      continue;
    const parsed = parseAlembicRevision(text);
    if (parsed.revision === null)
      continue;
    out.push({ revision: parsed.revision, downRevision: parsed.downRevision });
  }
  return out;
}
var BOOKKEEPING_TABLES, STOCK_POSTGRES_IMAGE;
var init_dbplan = __esm({
  "../../packages/envrun/dist/dbplan.js"() {
    "use strict";
    BOOKKEEPING_TABLES = [
      "_prisma_migrations",
      "_th_migrations",
      "alembic_version",
      "ar_internal_metadata",
      "schema_migrations"
    ];
    STOCK_POSTGRES_IMAGE = "postgres:16";
  }
});

// ../../packages/envrun/dist/dbstack.js
import { spawnSync as spawnSync7 } from "child_process";
import { randomBytes as randomBytes4 } from "crypto";
import { mkdirSync as mkdirSync5 } from "fs";
function installCommandFor(runner) {
  switch (runner) {
    case "sql":
      return null;
    case "prisma":
      return "npm i prisma@6 --no-save --no-audit --no-fund 2>&1 | tail -5";
    case "alembic":
      return `python -m venv ${VENV_DIR} && ${VENV_DIR}/bin/pip install --quiet alembic psycopg2-binary 2>&1 | tail -5`;
    default:
      return null;
  }
}
function toolingImageFor(runner) {
  switch (runner) {
    case "prisma":
      return PRISMA_IMAGE;
    case "alembic":
      return ALEMBIC_IMAGE;
    default:
      return PSQL_IMAGE;
  }
}
function docker2(args, timeoutMs = DOCKER_TIMEOUT_MS2) {
  const res = spawnSync7("docker", [...args], { encoding: "utf8", timeout: timeoutMs });
  return {
    ok: !res.error && res.status === 0,
    status: res.status,
    stdout: res.stdout ?? "",
    stderr: (res.error ? res.error.message : "") + (res.stderr ?? "")
  };
}
function generateCredentials(host) {
  return {
    user: "thverify",
    password: randomBytes4(24).toString("base64url"),
    database: "thverify",
    host,
    port: 5432
  };
}
function waitForPostgres(container, creds, timeoutMs) {
  const startedAt = Date.now();
  let lastDetail = "no attempt completed";
  while (Date.now() - startedAt < timeoutMs) {
    const ready = docker2([
      "exec",
      container,
      "pg_isready",
      "-h",
      "127.0.0.1",
      "-U",
      creds.user,
      "-d",
      creds.database,
      "-q"
    ]);
    if (ready.ok) {
      const select = docker2([
        "exec",
        container,
        "psql",
        "-h",
        "127.0.0.1",
        "-U",
        creds.user,
        "-d",
        creds.database,
        "-tAc",
        "SELECT 1"
      ]);
      if (select.ok && select.stdout.trim() === "1") {
        return { ok: true, ms: Date.now() - startedAt, detail: "accepting queries" };
      }
      lastDetail = `pg_isready ok but SELECT 1 failed: ${select.stderr.trim().slice(-200)}`;
    } else {
      lastDetail = ready.stderr.trim().slice(-200) || `pg_isready exited ${String(ready.status)}`;
    }
    const alive = docker2(["inspect", "--format", "{{.State.Running}}", container]);
    if (alive.ok && alive.stdout.trim() !== "true") {
      const logs = docker2(["logs", "--tail", "20", container]);
      return {
        ok: false,
        ms: Date.now() - startedAt,
        detail: `the server container exited before becoming ready: ${(logs.stdout + logs.stderr).trim().slice(-400)}`
      };
    }
    spawnSync7("sleep", ["0.25"]);
  }
  return { ok: false, ms: Date.now() - startedAt, detail: `timed out: ${lastDetail}` };
}
function containerGone(name) {
  const res = docker2(["inspect", "--format", "{{.State.Status}}", name]);
  if (res.ok)
    return false;
  const s = res.stderr.toLowerCase();
  return s.includes("no such object") || s.includes("no such container");
}
function volumeGone(name) {
  const res = docker2(["volume", "inspect", name]);
  if (res.ok)
    return false;
  const s = res.stderr.toLowerCase();
  return s.includes("no such volume") || s.includes("not found");
}
function networkGone(name) {
  const res = docker2(["network", "inspect", name]);
  if (res.ok)
    return false;
  const s = res.stderr.toLowerCase();
  return s.includes("not found") || s.includes("no such network");
}
function startDatabase(req) {
  if (req.plan.kind === "unresolved" || req.plan.image === null) {
    throw new DbStackError(`refusing to start a database for an unresolved plan: ${req.plan.reason ?? "no reason given"}`);
  }
  const label = labelArgs(req.labels);
  const network = `${req.idBase}-dbnet`;
  const volume = `${req.idBase}-pgdata`;
  const container = `${req.idBase}-pg`;
  const image = validateImage(req.plan.image);
  const creds = generateCredentials(container);
  const helpers = [];
  const teardown = () => {
    const leaked = [];
    for (const name of [...helpers, container]) {
      let gone = false;
      for (let i = 0; i < REMOVE_RETRIES && !gone; i++) {
        if (containerGone(name)) {
          gone = true;
          break;
        }
        docker2(["rm", "-f", name]);
      }
      if (!gone && !containerGone(name))
        leaked.push(`container ${name}`);
    }
    let volGone = false;
    for (let i = 0; i < REMOVE_RETRIES && !volGone; i++) {
      if (volumeGone(volume)) {
        volGone = true;
        break;
      }
      docker2(["volume", "rm", "-f", volume]);
    }
    if (!volGone && !volumeGone(volume))
      leaked.push(`volume ${volume} (holds database state)`);
    let netGone = false;
    for (let i = 0; i < REMOVE_RETRIES && !netGone; i++) {
      if (networkGone(network)) {
        netGone = true;
        break;
      }
      docker2(["network", "rm", network]);
    }
    if (!netGone && !networkGone(network))
      leaked.push(`network ${network}`);
    return { clean: leaked.length === 0, leaked };
  };
  try {
    const net2 = docker2([
      "network",
      "create",
      "--internal",
      "-o",
      "com.docker.network.bridge.inhibit_ipv4=true",
      ...label,
      network
    ]);
    if (!net2.ok) {
      throw new DbStackError(`could not create the private database network ${network}: ${net2.stderr.trim()}. This needs a daemon that supports the inhibit_ipv4 bridge option; an older daemon fails closed here rather than run the database on a network with a host endpoint.`);
    }
    const vol = docker2(["volume", "create", ...label, volume]);
    if (!vol.ok) {
      throw new DbStackError(`could not create the data volume ${volume}: ${vol.stderr.trim()}`);
    }
    const run2 = docker2([
      "run",
      "-d",
      `--name=${container}`,
      `--network=${network}`,
      // `--cap-drop=ALL` alone KILLS the official Postgres image. Measured
      // 2026-07-30: its entrypoint starts as root, chowns PGDATA and
      // /var/run/postgresql, then drops to the postgres user — with no
      // capabilities that is `chmod: Operation not permitted` and the container
      // exits before ever accepting a query.
      //
      // So drop everything and add back the five the entrypoint genuinely
      // needs, rather than the usual reflex of removing `--cap-drop=ALL`
      // wholesale. What stays dropped is the part that matters: NET_ADMIN,
      // NET_RAW, SYS_ADMIN, SYS_PTRACE, MKNOD and the rest.
      //
      // Proportionality, stated because a capability grant should never be
      // silent: this container runs the OFFICIAL postgres image executing our
      // own argv. The founder's untrusted migration code runs in the CLIENT
      // containers below, and those keep `--cap-drop=ALL` with nothing added.
      "--cap-drop=ALL",
      "--cap-add=CHOWN",
      // chown PGDATA to the postgres user
      "--cap-add=DAC_OVERRIDE",
      // write into a root-owned fresh volume
      "--cap-add=FOWNER",
      // chmod files it does not own
      "--cap-add=SETGID",
      // drop to the postgres group
      "--cap-add=SETUID",
      // drop to the postgres user
      "--security-opt=no-new-privileges",
      "--pids-limit=512",
      ...label,
      `--volume=${volume}:/var/lib/postgresql/data`,
      `--env=POSTGRES_USER=${creds.user}`,
      `--env=POSTGRES_PASSWORD=${creds.password}`,
      `--env=POSTGRES_DB=${creds.database}`,
      // The founder's data is never here, so fsync buys nothing but latency.
      "--env=PGDATA=/var/lib/postgresql/data/pgdata",
      "--",
      image,
      "postgres",
      "-c",
      "fsync=off",
      "-c",
      "full_page_writes=off"
    ], 6e4);
    if (!run2.ok) {
      throw new DbStackError(`could not start the database container: ${run2.stderr.trim()}`);
    }
    const ready = waitForPostgres(container, creds, req.readyTimeoutMs ?? 9e4);
    if (!ready.ok) {
      throw new DbStackError(`INFRASTRUCTURE/INCONCLUSIVE: Postgres never accepted queries at 127.0.0.1:${String(creds.port)} within the readiness window: ${ready.detail}`);
    }
    const query = (sql) => {
      const res = docker2([
        "exec",
        `--env=PGPASSWORD=${creds.password}`,
        container,
        "psql",
        "-U",
        creds.user,
        "-d",
        creds.database,
        "-tAqc",
        sql
      ]);
      return {
        ok: res.ok,
        rows: res.stdout.split("\n").map((s) => s.trim()).filter((s) => s.length > 0),
        stderr: res.stderr
      };
    };
    const runOnNetwork = (opts) => {
      const name = `${req.idBase}-${opts.nameSuffix}`;
      helpers.push(name);
      const args = [
        "run",
        "--rm",
        "--init",
        `--name=${name}`,
        `--network=${network}`,
        "--cap-drop=ALL",
        "--security-opt=no-new-privileges",
        "--pids-limit=512",
        ...label
      ];
      if (opts.repoDir)
        args.push(`--volume=${opts.repoDir}:${GUEST_REPO}:rw`);
      args.push(`--workdir=${opts.repoDir ? GUEST_REPO : "/"}`);
      for (const [k, v] of Object.entries(opts.env ?? {}))
        args.push(`--env=${k}=${v}`);
      args.push("--", validateImage(opts.image), "/bin/sh", "-c", opts.command);
      return docker2(args, opts.timeoutMs ?? 12e4);
    };
    return {
      network,
      volume,
      container,
      credentials: creds,
      image,
      readyMs: ready.ms,
      query,
      runOnNetwork,
      teardown
    };
  } catch (err) {
    teardown();
    throw err;
  }
}
function shq(value) {
  return `'${value.split("'").join(`'\\''`)}'`;
}
function readEgress(out) {
  return {
    dnsDenied: out.includes("DNS_DENIED"),
    ipDenied: out.includes("IP_DENIED"),
    raw: out.replace(/\s+/g, " ").trim()
  };
}
function probeEgressControl() {
  const res = docker2(["run", "--rm", "--", PSQL_IMAGE, "/bin/bash", "-c", EGRESS_PROBE], 12e4);
  const reading = readEgress(res.stdout);
  const reachable = !reading.dnsDenied && !reading.ipDenied;
  return {
    reachable,
    detail: reachable ? `control OK: the same probe reports reachable on a normal bridge (${reading.raw})` : `CONTROL FAILED \u2014 the probe reports denial even where egress exists, so no denial it reports is evidence of anything (${reading.raw || res.stderr.trim().slice(-200)})`
  };
}
function probeReachability(stack, repoDir) {
  const app = stack.runOnNetwork({
    image: PSQL_IMAGE,
    command: `psql -h ${shq(stack.credentials.host)} -U ${shq(stack.credentials.user)} -d ${shq(stack.credentials.database)} -tAc 'SELECT 1' 2>&1`,
    nameSuffix: "appprobe",
    env: { PGPASSWORD: stack.credentials.password },
    ...repoDir ? { repoDir } : {},
    timeoutMs: 6e4
  });
  const appReachesDb = app.ok && app.stdout.trim().endsWith("1");
  const egress = docker2(["exec", stack.container, "/bin/bash", "-c", EGRESS_PROBE], 6e4);
  const reading = readEgress(egress.stdout);
  const dnsDenied = reading.dnsDenied;
  const ipDenied = reading.ipDenied;
  const dbEgressDenied = dnsDenied && ipDenied;
  return {
    appReachesDb,
    appDetail: appReachesDb ? `a separate container resolved ${stack.credentials.host} over the private network and ran SELECT 1` : `app probe failed (exit ${String(app.status)}): ${(app.stdout + app.stderr).trim().slice(-300)}`,
    dbEgressDenied,
    egressDetail: `from the database container: DNS ${dnsDenied ? "DENIED" : "RESOLVED"}, IP literal ${ipDenied ? "DENIED" : "REACHED"} (raw: ${reading.raw})`,
    // Denial alone is not a pass. Without the control, "nothing got out" is
    // equally consistent with "the probe never ran".
    conclusive: appReachesDb && dbEgressDenied
  };
}
async function installMigrationTooling(opts) {
  const command = installCommandFor(opts.runner);
  if (command === null) {
    return {
      ran: false,
      ok: true,
      detail: `runner ${opts.runner} needs no toolchain install (psql ships in ${PSQL_IMAGE})`
    };
  }
  const { jail, tmp } = buildJail(opts.scratchRoot);
  mkdirSync5(jail, { recursive: true });
  mkdirSync5(tmp, { recursive: true });
  const spec = {
    profile: "install",
    clone: opts.repoDir,
    jail,
    tmp,
    program: "/bin/sh",
    args: ["-c", command]
  };
  const env = scrubEnv(process.env, scrubEnvPathsFor("container", { jail, tmp }));
  const res = await runContained(spec, env, {
    timeoutMs: opts.timeoutMs ?? 3e5,
    image: toolingImageFor(opts.runner),
    labels: opts.labels,
    // Prisma's engine host, granted ONLY for this install and never folded into
    // the default allowlist that merge-agent's untrusted-repo installs share.
    ...opts.runner === "prisma" ? { installAllowlist: [...DEFAULT_INSTALL_ALLOWLIST, ...PRISMA_INSTALL_ALLOWLIST] } : {}
  });
  const ok = res.status === 0 && !res.timedOut;
  return {
    ran: true,
    ok,
    detail: ok ? `installed ${opts.runner} tooling` : `install exited ${String(res.status)}${res.timedOut ? " (timed out)" : ""}: ${(res.stdout + res.stderr).trim().slice(-400)}`
  };
}
function applyMigrations(stack, plan, repoDir) {
  if (plan.runner === null) {
    return { ok: false, attempted: [], reason: "the plan carries no migration runner" };
  }
  switch (plan.runner) {
    case "sql":
      return applySqlMigrations(stack, plan.units, repoDir);
    case "prisma":
      return applyPrismaMigrations(stack, repoDir);
    case "alembic":
      return applyAlembicMigrations(stack, repoDir);
    case "rails":
      return {
        ok: false,
        attempted: [],
        reason: "the Rails migration runner is not implemented in this phase. Refusing rather than applying its .rb migrations as if they were SQL, which would report a schema we never built."
      };
  }
}
function applySqlMigrations(stack, units, repoDir) {
  const bootstrap = stack.query("CREATE TABLE IF NOT EXISTS _th_migrations (id text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())");
  if (!bootstrap.ok) {
    return {
      ok: false,
      attempted: [],
      reason: `INFRASTRUCTURE/INCONCLUSIVE: no migration ran because Postgres could not create the bookkeeping table: ${bootstrap.stderr.trim().slice(-300)}`
    };
  }
  const attempted = [];
  for (const unit of units) {
    const command = `psql -v ON_ERROR_STOP=1 --single-transaction -U ${shq(stack.credentials.user)} -h ${shq(stack.credentials.host)} -d ${shq(stack.credentials.database)} -f ${shq(`${GUEST_REPO}/${unit.path}`)} -c ${shq(`INSERT INTO _th_migrations (id) VALUES ('${unit.id.split("'").join("''")}')`)}`;
    const res = stack.runOnNetwork({
      image: PSQL_IMAGE,
      command,
      nameSuffix: `sqlmig-${attempted.length.toString(10)}`,
      env: { PGPASSWORD: stack.credentials.password },
      repoDir
    });
    attempted.push({ unit, ok: res.ok, stderr: res.stderr });
    if (!res.ok) {
      return {
        ok: false,
        attempted,
        reason: `migration ${unit.id} failed (psql exited ${String(res.status)}) and the run stopped there, so no later migration was applied: ${res.stderr.trim().slice(-400)}`
      };
    }
  }
  return { ok: true, attempted, reason: null };
}
function applyPrismaMigrations(stack, repoDir) {
  const res = stack.runOnNetwork({
    image: PRISMA_IMAGE,
    // `--schema` named explicitly: `migrate deploy` searches for a schema and a
    // search that finds the wrong one, or none, reports a confusing error rather
    // than the real problem.
    command: "node_modules/.bin/prisma migrate deploy --schema prisma/schema.prisma 2>&1",
    nameSuffix: "prismamig",
    env: { DATABASE_URL: connectionUrl(stack.credentials) },
    repoDir,
    timeoutMs: 18e4
  });
  if (!res.ok) {
    return {
      ok: false,
      attempted: [],
      reason: `prisma migrate deploy exited ${String(res.status)}: ${(res.stdout + res.stderr).trim().slice(-500)}`
    };
  }
  return { ok: true, attempted: [], reason: null };
}
function applyAlembicMigrations(stack, repoDir) {
  const res = stack.runOnNetwork({
    image: ALEMBIC_IMAGE,
    command: `${VENV_DIR}/bin/alembic upgrade head 2>&1`,
    nameSuffix: "alembicmig",
    env: {
      // Alembic's own env.py reads this; the repo's alembic.ini refers to it
      // rather than carrying a URL, which is the convention every real project
      // uses and the only one that keeps a production string out of the repo.
      DATABASE_URL: connectionUrl(stack.credentials)
    },
    repoDir,
    timeoutMs: 18e4
  });
  if (!res.ok) {
    return {
      ok: false,
      attempted: [],
      reason: `alembic upgrade head exited ${String(res.status)}: ${(res.stdout + res.stderr).trim().slice(-500)}`
    };
  }
  return { ok: true, attempted: [], reason: null };
}
function applySeeds(stack, seeds, repoDir) {
  const attempted = [];
  for (const seed of seeds) {
    if (!seed.endsWith(".sql")) {
      attempted.push({
        unit: { id: seed, path: seed },
        ok: false,
        stderr: "only .sql seeds are executed in this phase"
      });
      return {
        ok: false,
        attempted,
        reason: `seed ${seed} is not SQL; this phase executes .sql seeds only`
      };
    }
    const command = `psql -v ON_ERROR_STOP=1 --single-transaction -U ${shq(stack.credentials.user)} -h ${shq(stack.credentials.host)} -d ${shq(stack.credentials.database)} -f ${shq(`${GUEST_REPO}/${seed}`)}`;
    const res = stack.runOnNetwork({
      image: PSQL_IMAGE,
      command,
      nameSuffix: `seed-${attempted.length.toString(10)}`,
      env: { PGPASSWORD: stack.credentials.password },
      repoDir
    });
    attempted.push({ unit: { id: seed, path: seed }, ok: res.ok, stderr: res.stderr });
    if (!res.ok) {
      return {
        ok: false,
        attempted,
        reason: `seed ${seed} failed: ${res.stderr.trim().slice(-400)}`
      };
    }
  }
  return { ok: true, attempted, reason: null };
}
function readSchema(stack) {
  const excluded = BOOKKEEPING_TABLES.map((t) => `'${t}'`).join(", ");
  const tables = stack.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' AND table_name NOT IN (${excluded}) ORDER BY table_name`);
  const book = stack.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN (${excluded}) ORDER BY table_name`);
  const columns = stack.query(`SELECT table_name || ':' || column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name NOT IN (${excluded}) ORDER BY table_name, column_name`);
  const columnsByTable = {};
  for (const row of columns.rows) {
    const at = row.indexOf(":");
    if (at === -1)
      continue;
    const table = row.slice(0, at);
    (columnsByTable[table] ??= []).push(row.slice(at + 1));
  }
  return { tables: tables.rows, bookkeeping: book.rows, columnsByTable };
}
function recordedApplied(stack, plan, resolveHead) {
  if (plan.bookkeeping === null)
    return { count: null, detail: "no bookkeeping for this plan" };
  const res = stack.query(plan.bookkeeping.query);
  if (!res.ok) {
    return {
      count: null,
      detail: `could not read ${plan.bookkeeping.table}: ${res.stderr.trim().slice(-300)}. An unreadable bookkeeping table is NOT zero applied migrations \u2014 it is an unknown, and reporting it as 0 would let a broken read satisfy a 0 == 0 comparison.`
    };
  }
  const first = res.rows[0];
  if (first === void 0) {
    return {
      count: 0,
      detail: `${plan.bookkeeping.table} exists but recorded nothing`
    };
  }
  if (plan.bookkeeping.shape === "row-per-migration") {
    const parsed = Number.parseInt(first, 10);
    if (!Number.isInteger(parsed)) {
      return { count: null, detail: `unparseable count from ${plan.bookkeeping.table}: ${first}` };
    }
    return { count: parsed, detail: `${String(parsed)} row(s) in ${plan.bookkeeping.table}` };
  }
  if (!resolveHead) {
    return {
      count: null,
      detail: `${plan.bookkeeping.table} records head ${first}, but no chain resolver was supplied. The row COUNT here is always 1 and must never be used as the applied count.`
    };
  }
  const position = resolveHead(first);
  if (position === null) {
    return {
      count: null,
      detail: `recorded head ${first} is not resolvable in the repo's revision chain \u2014 the database was migrated by code this repo does not contain`
    };
  }
  return {
    count: position,
    detail: `head ${first} is position ${String(position)} in the repo's revision chain`
  };
}
function judgeCompleteness(recorded, discovered, expected) {
  const base = { recorded, discovered, expected };
  if (recorded === null) {
    return {
      ...base,
      complete: false,
      note: "the runner's recorded-applied count is UNKNOWN, which is not zero. Refusing to compare."
    };
  }
  if (expected <= 0) {
    return {
      ...base,
      complete: false,
      note: `the fixture pins an expected migration count of ${String(expected)}; a non-positive literal makes every comparison here vacuous.`
    };
  }
  if (discovered !== expected) {
    return {
      ...base,
      complete: false,
      note: `DISCOVERY REGRESSION: found ${String(discovered)} migration unit(s) but the fixture pins ${String(expected)}. This is the failure the literal exists to catch \u2014 the runner's own tally would have agreed with the wrong number.`
    };
  }
  if (recorded !== discovered) {
    return {
      ...base,
      complete: false,
      note: `PARTIAL APPLICATION: ${String(discovered)} migration(s) discovered, ${String(recorded)} recorded as applied. The schema is incomplete even if the expected tables exist.`
    };
  }
  if (recorded === 0) {
    return {
      ...base,
      complete: false,
      note: "both counts are 0. Absence satisfies equality; it does not prove completeness."
    };
  }
  return {
    ...base,
    complete: true,
    note: `${String(recorded)} recorded == ${String(discovered)} discovered == ${String(expected)} pinned, all > 0.`
  };
}
var DbStackError, DOCKER_TIMEOUT_MS2, GUEST_REPO, VENV_DIR, PSQL_IMAGE, PRISMA_IMAGE, ALEMBIC_IMAGE, PRISMA_INSTALL_ALLOWLIST, REMOVE_RETRIES, EGRESS_PROBE;
var init_dbstack = __esm({
  "../../packages/envrun/dist/dbstack.js"() {
    "use strict";
    init_dist();
    init_dbplan();
    DbStackError = class extends Error {
    };
    DOCKER_TIMEOUT_MS2 = 2e4;
    GUEST_REPO = "/fenced/clone";
    VENV_DIR = ".th-venv";
    PSQL_IMAGE = "postgres:16";
    PRISMA_IMAGE = "node:22-bookworm";
    ALEMBIC_IMAGE = "python:3.12-slim";
    PRISMA_INSTALL_ALLOWLIST = ["binaries.prisma.sh"];
    REMOVE_RETRIES = 3;
    EGRESS_PROBE = 'getent hosts example.com >/dev/null 2>&1 && echo DNS_RESOLVED || echo DNS_DENIED; timeout 5 bash -c "echo > /dev/tcp/1.1.1.1/443" 2>/dev/null && echo IP_REACHED || echo IP_DENIED';
  }
});

// ../../packages/envrun/dist/index.js
var dist_exports = {};
__export(dist_exports, {
  ALEMBIC_IMAGE: () => ALEMBIC_IMAGE,
  ATTEST_REFUSAL_REASONS: () => ATTEST_REFUSAL_REASONS,
  BOOKKEEPING_TABLES: () => BOOKKEEPING_TABLES,
  DbStackError: () => DbStackError,
  EGRESS_PROBE: () => EGRESS_PROBE,
  EnvRunError: () => EnvRunError,
  LOCAL_MEASUREMENT_PREFIX: () => LOCAL_MEASUREMENT_PREFIX,
  LabelWatch: () => LabelWatch,
  OUTCOME_TO_BUDGET: () => OUTCOME_TO_BUDGET,
  PATH_REFUSAL_CODES: () => PATH_REFUSAL_CODES,
  PLACEMENTS: () => PLACEMENTS,
  PRISMA_IMAGE: () => PRISMA_IMAGE,
  PRISMA_INSTALL_ALLOWLIST: () => PRISMA_INSTALL_ALLOWLIST,
  PSQL_IMAGE: () => PSQL_IMAGE,
  PreviewError: () => PreviewError,
  RUN_LABEL_KEY: () => RUN_LABEL_KEY,
  RUN_RESULT_FIELDS: () => RUN_RESULT_FIELDS,
  RUN_RESULT_SCHEMA: () => RUN_RESULT_SCHEMA,
  RUN_TEST_COMMAND_SOURCES: () => RUN_TEST_COMMAND_SOURCES,
  STOCK_POSTGRES_IMAGE: () => STOCK_POSTGRES_IMAGE,
  SUPPORTED_RUNNERS: () => SUPPORTED_RUNNERS,
  ThRunError: () => ThRunError,
  VENV_DIR: () => VENV_DIR,
  alembicChainPosition: () => alembicChainPosition,
  answerDidItPass: () => answerDidItPass,
  applyMigrations: () => applyMigrations,
  applyPatch: () => applyPatch,
  applySeeds: () => applySeeds,
  bookkeepingFor: () => bookkeepingFor,
  census: () => census,
  censusTotal: () => censusTotal,
  classifySingleRun: () => classifySingleRun,
  classifyVerification: () => classifyVerification,
  cloneTargetAt: () => cloneTargetAt,
  collectWorkingDiff: () => collectWorkingDiff,
  connectionUrl: () => connectionUrl,
  detectRunner: () => detectRunner,
  generateCredentials: () => generateCredentials,
  imageForRuntime: () => imageForRuntime,
  installCommandFor: () => installCommandFor,
  installMigrationTooling: () => installMigrationTooling,
  isBookkeepingTable: () => isBookkeepingTable,
  isCommandUnavailable: () => isCommandUnavailable,
  isGreen: () => isGreen,
  isOurFault: () => isOurFault,
  judgeCompleteness: () => judgeCompleteness,
  judgeLeaks: () => judgeLeaks,
  localDockerPlacement: () => localDockerPlacement,
  localMeasurement: () => localMeasurement,
  migrationUnits: () => migrationUnits,
  parseAlembicRevision: () => parseAlembicRevision,
  placementFor: () => placementFor,
  planDatabase: () => planDatabase,
  preflightBoundary: () => preflightBoundary,
  probeEgressControl: () => probeEgressControl,
  probeReachability: () => probeReachability,
  readAlembicChain: () => readAlembicChain,
  readCounts: () => readCounts,
  readSchema: () => readSchema,
  recordedApplied: () => recordedApplied,
  renderRunReport: () => renderRunReport,
  renderVerdictLine: () => renderVerdictLine,
  runEnvironmentSpec: () => runEnvironmentSpec,
  selectContainerTier: () => selectContainerTier,
  sha256Hex: () => sha256Hex,
  signRunStatement: () => signRunStatement,
  startDatabase: () => startDatabase,
  startPreview: () => startPreview,
  toAcceptancePredicate: () => toAcceptancePredicate,
  toRecordPatchRunVerification: () => toRecordPatchRunVerification,
  toolingImageFor: () => toolingImageFor,
  unquoteDiffPath: () => unquoteDiffPath,
  verifyWorkingDiff: () => verifyWorkingDiff
});
var init_dist4 = __esm({
  "../../packages/envrun/dist/index.js"() {
    "use strict";
    init_classify();
    init_execute();
    init_labels();
    init_result();
    init_receipt();
    init_attestation2();
    init_boundary();
    init_placement();
    init_preview();
    init_thrun();
    init_dbplan();
    init_dbstack();
  }
});

// bin/jpi-run.js
import { existsSync as existsSync4, readFileSync as readFileSync2 } from "fs";
import { join as join7, resolve } from "path";
import { tmpdir as tmpdir2 } from "os";
import { mkdtempSync as mkdtempSync2, rmSync as rmSync2 } from "fs";
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
  const root = mkdtempSync2(join7(tmpdir2(), "th-run-"));
  let cleaned = false;
  const cleanup = () => {
    if (cleaned) return;
    cleaned = true;
    try {
      rmSync2(root, { recursive: true, force: true });
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
    return await Promise.resolve().then(() => (init_dist4(), dist_exports));
  } catch (err) {
    throw new Error(
      `terminalhire: \`run\` could not load its verification engine, which ships inside this CLI. That points at a damaged install rather than a missing package \u2014 reinstall with \`npm i -g terminalhire\`, or update the Claude Code plugin.
(resolution error: ${err && err.message ? err.message : String(err)})`
    );
  }
}
function readConfig(localDir) {
  const file = join7(localDir, ".th-run.json");
  if (!existsSync4(file)) return {};
  try {
    const parsed = JSON.parse(readFileSync2(file, "utf8"));
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
  if (typeof opts.recordPatchRun === "function") {
    const fields = typeof engine.toRecordPatchRunVerification === "function" ? engine.toRecordPatchRunVerification(result) : {
      testCounts: result.counts === null ? null : {
        passed: result.counts.tests_passed,
        failed: result.counts.tests_failed,
        total: result.counts.tests_passed + result.counts.tests_failed
      },
      testCommand: result.testCommand ?? null,
      patchSha256: result.patchSha256 ?? null
    };
    try {
      await opts.recordPatchRun({
        claimId: opts.claimId,
        ...fields
      });
    } catch (err) {
      if (!opts.json) {
        process.stderr.write(
          `  warn     could not record this run (${err?.message ?? err}); the result below is unaffected
`
        );
      }
    }
  }
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
  once,
  run
};
