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
function resourceExhaustion(facts, counts) {
  if (counts !== null && counts.tests_failed > 0)
    return null;
  if (/no space left on device|ENOSPC/i.test(facts.stderr))
    return "no space left on device";
  if (SUITE_REPORTED_FAILURE.test(`${facts.stdout}
${facts.stderr}`))
    return null;
  const said = facts.stderr;
  if (/Killed process|oom-kill|OOMKilled/i.test(said))
    return "out of memory";
  if (facts.exitCode === 137) {
    return "killed (137/SIGKILL), which is how a container OOM kill surfaces";
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
  const exhausted = resourceExhaustion(facts, counts);
  if (exhausted !== null) {
    return {
      outcome: "environment-exhausted",
      counts: null,
      reason: `the run exhausted a resource we cap, not one the repo asked for (${exhausted}). This is an environment failure on our side and the repo has NOT been judged \u2014 reporting it as a test failure would blame a developer for our container running out of room.`
    };
  }
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
var int, withSuiteFailures, READERS, SUPPORTED_RUNNERS, EXEC_FAILURE, SUITE_REPORTED_FAILURE;
var init_classify = __esm({
  "../../packages/envrun/dist/classify.js"() {
    "use strict";
    int = (m, i = 1) => m ? Number(m[i]) : 0;
    withSuiteFailures = (counts, suiteLine) => {
      if (counts.tests_failed > 0 || !suiteLine)
        return counts;
      return { ...counts, tests_failed: int(/(\d+) failed/.exec(suiteLine[1])) };
    };
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
          return withSuiteFailures({
            tests_passed: int(/(\d+) passed/.exec(line[1])),
            tests_failed: int(/(\d+) failed/.exec(line[1]))
          }, /^Test Suites:\s+(.+?)\s*$/m.exec(out));
        }
      },
      {
        // vitest: `Tests  3 passed (3)` / `Tests  1 failed | 2 passed (3)`
        runner: "vitest",
        read: (out) => {
          const files = /^\s*Test Files\s+([^\n]*\(\d+\))\s*$/m.exec(out);
          const line = /^\s*Tests\s+([^\n]*\(\d+\))\s*$/m.exec(out);
          if (!line) {
            const onlyFiles = files ? int(/(\d+) failed/.exec(files[1])) : 0;
            return onlyFiles > 0 ? { tests_passed: 0, tests_failed: onlyFiles } : null;
          }
          const passed = /(\d+) passed/.exec(line[1]);
          const failed = /(\d+) failed/.exec(line[1]);
          if (!passed && !failed)
            return null;
          return withSuiteFailures({ tests_passed: int(passed), tests_failed: int(failed) }, files);
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
    SUITE_REPORTED_FAILURE = new RegExp([
      "---\\s*FAIL:",
      //                                go
      "^\\s*not ok\\s",
      //                              TAP, node --test
      "^\\s*FAIL\\s+\\S",
      //                            jest / vitest per-file line
      "\\bFAILED\\b",
      //                                pytest summary, cargo (both forms)
      "^\\s*failures:",
      //                              cargo's failure block, lowercase
      "^\\s*Failures:",
      //                              rspec's failure block
      "\\d+\\s+examples?,\\s+(?!0\\b)\\d+\\s+failures?"
      // rspec's summary line
    ].join("|"), "m");
  }
});

// ../../packages/containment/dist/env.js
import { homedir as homedir2 } from "os";
import { posix } from "path";
function realHomeCandidates(source) {
  const candidates = [];
  const fromEnv = source["HOME"];
  if (typeof fromEnv === "string" && fromEnv !== "")
    candidates.push(fromEnv);
  let fromOs;
  try {
    fromOs = homedir2();
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
  env["XDG_CONFIG_HOME"] = join3(jailHome, ".config");
  env["XDG_CACHE_HOME"] = join3(jailHome, ".cache");
  env["XDG_DATA_HOME"] = join3(jailHome, ".local", "share");
  env["GIT_CONFIG_GLOBAL"] = join3(jailHome, ".gitconfig");
  env["GIT_CONFIG_SYSTEM"] = "/dev/null";
  env["GIT_TERMINAL_PROMPT"] = "0";
  env["GIT_ASKPASS"] = "/usr/bin/false";
  env["SSH_ASKPASS"] = "/usr/bin/false";
  env["npm_config_userconfig"] = join3(jailHome, ".npmrc");
  env["npm_config_cache"] = join3(jailHome, ".npm");
  env["npm_config_update_notifier"] = "false";
  env["npm_config_fund"] = "false";
  env["npm_config_audit"] = "false";
  env["GOPATH"] = join3(jailHome, "go");
  env["GOMODCACHE"] = join3(jailHome, "go", "pkg", "mod");
  env["GOCACHE"] = join3(jailHome, ".cache", "go-build");
  env["GOFLAGS"] = "-modcacherw";
  env["CARGO_HOME"] = join3(jailHome, ".cargo");
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
var join3, ENV_ALLOWLIST, BASE_PATH, DEAD_PROXY, SandboxEnvError, FORBIDDEN_EXTRA;
var init_env = __esm({
  "../../packages/containment/dist/env.js"() {
    "use strict";
    join3 = posix.join;
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
var init_reap = __esm({
  "../../packages/containment/dist/reap.js"() {
    "use strict";
  }
});

// ../../packages/containment/dist/fence.js
import { spawn, spawnSync as spawnSync2 } from "child_process";
import { existsSync as existsSync3, mkdirSync as mkdirSync2, realpathSync, writeFileSync as writeFileSync2 } from "fs";
import { dirname as dirname2, isAbsolute, join as join4, posix as posix2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
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
function venuePath(path, label) {
  if (!posix2.isAbsolute(path)) {
    throw new FenceError(`${label} must be an absolute POSIX path on the venue, got ${JSON.stringify(path)}`);
  }
  return path;
}
function venueJoin(base, ...parts) {
  return posix2.join(base, ...parts);
}
function resolverFor(domain) {
  return domain === "venue" ? venuePath : canonical;
}
function pathDomainOf(spec) {
  return spec.pathDomain ?? "local";
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
function buildJail(root, guestUser) {
  const jail = join4(root, JAIL_SEGMENT);
  const tmp = join4(root, JAIL_TMP_SEGMENT);
  for (const dir of [jail, tmp, join4(jail, ".config"), join4(jail, ".cache"), join4(jail, ".npm")]) {
    mkdirSync2(dir, { recursive: true });
  }
  writeFileSync2(join4(jail, ".npmrc"), "", "utf8");
  writeFileSync2(join4(jail, JAIL_PASSWD_FILE), guestUser ? jailPasswd(guestUser.uid, guestUser.gid) : jailPasswd(), "utf8");
  writeFileSync2(join4(jail, JAIL_GROUP_FILE), guestUser ? jailGroup(guestUser.gid) : jailGroup(), "utf8");
  writeFileSync2(join4(jail, ".gitconfig"), '[user]\n	name = sandbox\n	email = sandbox@localhost\n[safe]\n	directory = *\n[url "https://github.com/"]\n	insteadOf = ssh://git@github.com/\n	insteadOf = git@github.com:\n', "utf8");
  return { jail, tmp };
}
var FenceError, ContainmentError, ContainmentRefusalError, JAIL_PASSWD_FILE, JAIL_GROUP_FILE, GUEST_JAIL, FENCE_USER, JAIL_SEGMENT, JAIL_TMP_SEGMENT;
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
    ContainmentRefusalError = class extends FenceError {
    };
    JAIL_PASSWD_FILE = ".fence-passwd";
    JAIL_GROUP_FILE = ".fence-group";
    GUEST_JAIL = "/fenced/jail";
    FENCE_USER = "fenced";
    JAIL_SEGMENT = "jail";
    JAIL_TMP_SEGMENT = "tmp";
  }
});

// ../../packages/containment/dist/containment.js
function selectContainment(candidates) {
  for (const c of candidates) {
    if (c.available())
      return c;
  }
  throw new NoContainmentError(candidates.map((c) => c.kind));
}
var NoContainmentError;
var init_containment = __esm({
  "../../packages/containment/dist/containment.js"() {
    "use strict";
    init_fence();
    NoContainmentError = class extends Error {
      constructor(tried) {
        super(`no containment mechanism is available on this host (tried: ${tried.join(", ")}). Refusing to run third-party code unfenced \u2014 this is the invariant, not a missing feature. On macOS, sandbox-exec should always be present; elsewhere a container runtime is required (TERM-78).`);
        this.name = "NoContainmentError";
      }
    };
  }
});

// ../../packages/containment/dist/dockerClient.js
import { spawn as spawn2, spawnSync as spawnSync3 } from "child_process";
function syncResult(res) {
  return {
    status: res.status,
    stdout: res.stdout ?? "",
    stderr: res.stderr ?? "",
    ...res.error ? { error: res.error } : {}
  };
}
function ambientTargetKeysIn(env) {
  return AMBIENT_TARGET_KEYS.filter((k) => {
    const v = (env[k] ?? "").trim();
    if (v.length === 0)
      return false;
    if (k === "DOCKER_HOST")
      return !sharesThisFilesystem(v);
    return true;
  });
}
function sharesThisFilesystem(dockerHost) {
  return dockerHost.toLowerCase().startsWith("unix://");
}
function localDockerClient() {
  return LOCAL;
}
function scrubEndpointEnv(env) {
  const out = {};
  for (const [k, v] of Object.entries(env)) {
    if (v === void 0)
      continue;
    if (SCRUBBED.has(k.toUpperCase()))
      continue;
    out[k] = v;
  }
  return out;
}
function remoteDockerClient(endpoint) {
  if (endpoint.trim().length === 0) {
    throw new Error("remoteDockerClient: endpoint must be a non-empty docker host");
  }
  const target = endpoint.trim();
  const argv = (args) => ["--host", target, ...args];
  return {
    endpoint: target,
    // Always empty, and it is a fact about this client rather than about the
    // process: every call below spawns with `scrubEndpointEnv`, so no ambient
    // selector reaches the child even when one is exported here. Returning
    // `ambientTargetKeysIn(process.env)` would report a redirect that cannot
    // touch this client and refuse a run for no reason.
    ambientTarget() {
      return [];
    },
    spawn(args) {
      return spawn2(DOCKER_BIN, argv(args), {
        stdio: ["ignore", "pipe", "pipe"],
        env: scrubEndpointEnv(process.env)
      });
    },
    sync(args, opts) {
      return syncResult(spawnSync3(DOCKER_BIN, argv(args), {
        encoding: "utf8",
        timeout: opts?.timeoutMs,
        env: scrubEndpointEnv(process.env)
      }));
    },
    commandLine(args) {
      return [DOCKER_BIN, ...argv(args)];
    }
  };
}
var DOCKER_BIN, AMBIENT_ENDPOINT_KEYS, AMBIENT_TARGET_KEYS, LOCAL, SCRUBBED;
var init_dockerClient = __esm({
  "../../packages/containment/dist/dockerClient.js"() {
    "use strict";
    DOCKER_BIN = "docker";
    AMBIENT_ENDPOINT_KEYS = [
      "DOCKER_HOST",
      "DOCKER_CONTEXT",
      "DOCKER_TLS",
      "DOCKER_TLS_VERIFY",
      "DOCKER_CERT_PATH"
    ];
    AMBIENT_TARGET_KEYS = ["DOCKER_HOST", "DOCKER_CONTEXT"];
    LOCAL = {
      endpoint: null,
      ambientTarget() {
        return ambientTargetKeysIn(process.env);
      },
      spawn(args) {
        return spawn2(DOCKER_BIN, [...args], { stdio: ["ignore", "pipe", "pipe"] });
      },
      sync(args, opts) {
        return syncResult(spawnSync3(DOCKER_BIN, [...args], { encoding: "utf8", timeout: opts?.timeoutMs }));
      },
      commandLine(args) {
        return [DOCKER_BIN, ...args];
      }
    };
    SCRUBBED = new Set(AMBIENT_ENDPOINT_KEYS.map((k) => k.toUpperCase()));
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
import { fileURLToPath as fileURLToPath3 } from "url";
import { dirname as dirname3, join as join5 } from "path";
import { chmodSync, copyFileSync, existsSync as existsSync4, mkdtempSync, rmSync } from "fs";
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
  const resolve2 = resolverFor(pathDomainOf(spec));
  const pairs = [];
  const seen = /* @__PURE__ */ new Set();
  for (const { raw, guest, label } of roots) {
    for (const host of [raw, resolve2(raw, label)]) {
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
function guestUserFlag(spec) {
  const declared = spec.guestUser;
  if (declared)
    return [`--user=${declared.uid}:${declared.gid}`];
  if (pathDomainOf(spec) === "venue") {
    throw new FenceError("a venue-domain spec must declare guestUser: the tree is owned by the account that staged it on the venue, and this process\u2019s uid is a fact about a different machine. Handing the guest the local id gives it no write access to its own clone, and that EACCES reaches the classifier as the developer\u2019s suite failing.");
  }
  return hostUserFlag();
}
function guestIdentityMounts(spec) {
  if (guestUserFlag(spec).length === 0)
    return [];
  const domain = pathDomainOf(spec);
  const resolve2 = resolverFor(domain);
  const under = domain === "venue" ? venueJoin : join5;
  const jail = resolve2(spec.jail, "jail");
  const passwd = resolve2(under(jail, JAIL_PASSWD_FILE), "the jail passwd file");
  const group = resolve2(under(jail, JAIL_GROUP_FILE), "the jail group file");
  return [`--volume=${passwd}:/etc/passwd:ro`, `--volume=${group}:/etc/group:ro`];
}
function containerArgs(spec, env, opts) {
  if (spec.profile === "offline" && opts.net) {
    throw new FenceError("the offline profile grants no network; passing a sidecar net is a category error");
  }
  if (spec.profile === "install" && !opts.net) {
    throw new FenceError("the container install profile requires a proxy sidecar net \u2014 without it the guest would need a general network, which bypasses the egress allowlist entirely. Refusing.");
  }
  const resolveSpecPath = resolverFor(pathDomainOf(spec));
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
    ...guestUserFlag(spec),
    `--volume=${resolveSpecPath(spec.clone, "clone")}:${GUEST.clone}:rw`,
    `--volume=${resolveSpecPath(spec.jail, "jail")}:${GUEST.jail}:rw`,
    // TMP IS A TMPFS, NOT A BIND MOUNT (TERM-644), and the reason is two lines
    // above: Docker Desktop's `fakeowner` synthesizes ownership for the guest, so
    // a bind-mounted path does not enforce POSIX permission bits at all.
    //
    // Measured directly, same chmod, same uid, only the mount type differing:
    //
    //   bind   chmod 000 -> stat says mode 0 -> `cat` SUCCEEDS
    //   tmpfs  chmod 000 -> stat says mode 0 -> `cat` refused
    //
    // `stat` agreeing in both is what makes this so quiet — the chmod appears to
    // work. Any test asserting that an unreadable file is unreadable therefore
    // failed, and the run reported `tests-failed`: our mount, blamed on the
    // developer. Found on Boeing/config-file-validator, whose
    // `Test_CLIWithUnreadableFile` is exactly that assertion, and it is the worst
    // shape of this bug because it reads like a real regression rather than an
    // environment error.
    //
    // Safe to stop binding: tmp is scratch. Nothing on the host reads it after a
    // run — `sweep`'s lsof pass over `spec.tmp` belongs to the SEATBELT tier
    // (`fence.ts` is its only caller), which is unaffected because tmpfs is a
    // container concept. The jail must STAY a bind mount: TERM-643 made the
    // package cache depend on it outliving the install container.
    //
    // `exec` preserves the bind mount's behaviour rather than adding privilege —
    // bind mounts are exec by default, and build tools do run scripts out of
    // TMPDIR. `mode=1777` is /tmp's own mode, which is what keeps it writable
    // under `--user`, since a tmpfs starts owned by root rather than inheriting
    // the host directory's owner.
    //
    // ONE BEHAVIOUR CHANGE THIS COSTS, stated because the last unstated
    // assumption of this shape is what TERM-643 spent a day on: the two steps are
    // separate `docker run --rm`, so `/fenced/tmp` no longer survives from
    // install into test. Under the bind mount it did. Nothing in the current
    // command set depends on that — installs write to the clone or to the jail
    // caches, not to TMPDIR — but a future install command that stages something
    // in TMPDIR for the test step would find it gone, and would fail the same
    // quiet way the Go module cache did.
    //
    // `nosuid` is free here rather than load-bearing: `--cap-drop=ALL` and
    // `--security-opt=no-new-privileges` above already make a setuid bit inert
    // (validate-fence C12 proves it). Costs nothing, so it goes on.
    //
    // THE TRADE: tmpfs is RAM-backed and capped, where the bind mount borrowed
    // the host disk. A build whose temp files exceed the cap now fails — and the
    // FIRST version of this comment claimed that failure was "loud and nameable"
    // while nothing anywhere read it. It was loud in stderr and silent in the
    // verdict, so the founder would have read `tests-failed`: our disk running
    // out, reported as the developer's tests failing, which is the exact bug this
    // ticket exists to remove. `resourceExhaustion` in envrun's classify.ts is
    // what makes the sentence true — ENOSPC and OOM route to
    // `environment-exhausted`, which refuses to judge and signs nothing.
    //
    // Which of the two fires depends on Docker Desktop VM RAM we do not control:
    // on a trimmed VM the container is OOM-killed before it can fill 2 GiB. Both
    // are ours and both are classified, so the outcome is the same either way —
    // but the container carries no `--memory` cap, so the OOM path is the
    // machine's decision rather than ours.
    `--tmpfs=${GUEST.tmp}:rw,exec,nosuid,mode=1777,size=${String(TMPFS_SIZE_MB)}m`,
    ...guestIdentityMounts(spec),
    `--workdir=${translateChecked(resolveSpecPath(opts.cwd ?? spec.clone, "cwd"), t, "the working directory")}`
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
function containerAvailableOn(d) {
  const cached = probed.get(d);
  if (cached !== void 0)
    return cached;
  const res = d.sync(["info", "--format", "{{.ServerVersion}}"], { timeoutMs: DOCKER_TIMEOUT_MS });
  const ok = !res.error && res.status === 0 && res.stdout.trim().length > 0;
  probed.set(d, ok);
  return ok;
}
function inspectContainer(d, name) {
  const res = d.sync(["inspect", "--format", "{{.State.Status}}", name], {
    timeoutMs: DOCKER_TIMEOUT_MS
  });
  if (res.error) {
    return { state: "unverifiable", detail: `docker inspect failed to run: ${res.error.message}` };
  }
  if (res.status === 0) {
    return { state: "present", detail: res.stdout.trim() || "running" };
  }
  const stderr = res.stderr.toLowerCase();
  if (stderr.includes("no such object") || stderr.includes("no such container")) {
    return { state: "gone", detail: "no such container" };
  }
  return {
    state: "unverifiable",
    detail: `docker inspect exited ${res.status ?? "null"}: ${res.stderr.trim() || "no stderr"}`
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
function inspectNetwork(d, name) {
  const res = dockerSync(d, ["network", "inspect", name]);
  return classifyNetworkInspect(res.ok, res.stderr);
}
function enforceContainerContainmentOn(d, name) {
  const contained = { contained: true, killed: [], survivors: [], unverifiable: [] };
  if (inspectContainer(d, name).state === "gone")
    return contained;
  d.sync(["rm", "-f", name], { timeoutMs: DOCKER_TIMEOUT_MS });
  const after = inspectContainer(d, name);
  if (after.state === "gone")
    return contained;
  const reason = after.state === "present" ? `container ${name} still exists (status ${after.detail}) after docker rm -f` : `container ${name} containment is unverifiable: ${after.detail}`;
  return { contained: false, killed: [], survivors: [], unverifiable: [reason] };
}
function dockerSync(d, args, timeoutMs = DOCKER_TIMEOUT_MS) {
  const res = d.sync(args, { timeoutMs });
  return {
    ok: !res.error && res.status === 0,
    stdout: res.stdout,
    stderr: (res.error ? res.error.message : "") + res.stderr
  };
}
function pickProxyDir(baseDir) {
  const scoped = join5(baseDir, "proxy");
  if (existsSync4(join5(scoped, "proxyEntry.js")))
    return scoped;
  return baseDir;
}
function resolveProxyCodeSource() {
  return pickProxyDir(dirname3(fileURLToPath3(import.meta.url)));
}
function stageProxyCode(source = resolveProxyCodeSource()) {
  const missing = PROXY_FILES.map((f) => join5(source, f)).filter((p) => !existsSync4(p));
  if (missing.length > 0) {
    throw new FenceError(`the egress proxy is missing from this install: ${missing.join(", ")} not found. Reinstall the CLI, or update the Claude Code plugin.`);
  }
  const dir = mkdtempSync(join5(tmpdir(), "th-proxy-"));
  try {
    for (const file of PROXY_FILES) {
      copyFileSync(join5(source, file), join5(dir, file));
    }
    for (const file of PROXY_FILES) {
      chmodSync(join5(dir, file), 420);
    }
    chmodSync(dir, 493);
  } catch (err) {
    try {
      rmSync(dir, { recursive: true, force: true });
    } catch {
    }
    throw err;
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
function excerptCrash(output) {
  const text = output.trim();
  const points = Array.from(text);
  if (points.length <= 900)
    return text;
  const head = points.slice(0, 600).join("");
  const tail2 = points.slice(-200).join("");
  return `${head}
  \u2026 ${String(points.length - 800)} characters elided \u2026
${tail2}`;
}
async function waitForProxyReady(d, proxyName) {
  const deadline = Date.now() + 15e3;
  for (; ; ) {
    const logs = dockerSync(d, ["logs", proxyName]);
    if (/proxy-ready/.test(logs.stdout + logs.stderr))
      return;
    const st = inspectContainer(d, proxyName);
    if (st.state === "gone" || st.state === "present" && /exited|dead/.test(st.detail)) {
      throw new FenceError(`the proxy sidecar exited before becoming ready: ${excerptCrash(logs.stdout + logs.stderr)}`);
    }
    if (Date.now() > deadline) {
      throw new FenceError("the proxy sidecar did not become ready within 15s");
    }
    await sleep(250);
  }
}
async function startProxySidecar(d, allow, idBase, staged, labels) {
  const label = labelArgs(labels);
  const netInt = `${idBase}-int`;
  const netExt = `${idBase}-ext`;
  const proxyName = `${idBase}-proxy`;
  const RETRIES = 3;
  const ensureContainerGone = (name) => {
    for (let i = 0; i < RETRIES; i++) {
      if (inspectContainer(d, name).state === "gone")
        return true;
      dockerSync(d, ["rm", "-f", name]);
    }
    return inspectContainer(d, name).state === "gone";
  };
  const ensureNetworkGone = (name) => {
    for (let i = 0; i < RETRIES; i++) {
      if (inspectNetwork(d, name) === "gone")
        return true;
      dockerSync(d, ["network", "rm", name]);
    }
    return inspectNetwork(d, name) === "gone";
  };
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
    if (!dockerSync(d, [
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
    if (!dockerSync(d, ["network", "create", ...label, netExt]).ok) {
      throw new FenceError(`could not create the egress network ${netExt}`);
    }
    const run2 = dockerSync(d, [
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
    if (!dockerSync(d, ["network", "connect", netExt, proxyName]).ok) {
      throw new FenceError(`could not attach the proxy to the egress network ${netExt}`);
    }
    await waitForProxyReady(d, proxyName);
    return {
      net: { network: netInt, proxyHost: proxyName, proxyPort: SIDECAR_PROXY_PORT },
      teardown
    };
  } catch (err) {
    teardown();
    throw err;
  }
}
function spawnWorkload(d, name, argv, timeoutMs) {
  return new Promise((resolvePromise, reject) => {
    const child = d.spawn(argv);
    let stdout = "";
    let stderr = "";
    let timedOut = false;
    child.stdout.on("data", (d2) => stdout += d2.toString());
    child.stderr.on("data", (d2) => stderr += d2.toString());
    const timer = setTimeout(() => {
      timedOut = true;
      d.sync(["kill", name], { timeoutMs: DOCKER_TIMEOUT_MS });
    }, timeoutMs);
    timer.unref();
    child.on("error", (err) => {
      clearTimeout(timer);
      reject(new FenceError(`docker failed to start: ${err.message}`));
    });
    child.on("close", (status) => {
      clearTimeout(timer);
      const containment = enforceContainerContainmentOn(d, name);
      if (!containment.contained) {
        reject(new ContainmentError(`the container did not contain the run: ${containment.unverifiable.join("; ") || "survivors on host"}`, containment));
        return;
      }
      resolvePromise({ status, stdout, stderr, argv: d.commandLine(argv), timedOut, containment });
    });
  });
}
function assertDomainDeclared(d, spec) {
  if (d.endpoint === null)
    return;
  if (spec.pathDomain !== void 0)
    return;
  throw new FenceError(`this client targets ${d.endpoint}, not the ambient daemon, so the spec must declare pathDomain: paths default to 'local' and would be canonicalised against THIS machine, which is the #735 defect (a rewritten mount source Docker then creates as an empty directory). State pathDomain: 'venue' for a remote filesystem, or 'local' to confirm these paths really are on this machine.`);
}
function assertNotAmbientlySteered(d, spec) {
  if (d.endpoint !== null)
    return;
  const steering = d.ambientTarget();
  if (steering.length === 0)
    return;
  if (pathDomainOf(spec) === "venue")
    return;
  const names = steering.join(" and ");
  throw new ContainmentRefusalError(`${names} ${steering.length > 1 ? "are" : "is"} set, so the ambient docker client may be talking to a daemon that does not share this filesystem \u2014 while these paths say they are on THIS machine. Every bind mount would then name a path the daemon does not have; Docker creates those as empty directories and the run fails for reasons that have nothing to do with your repository. Unset ${names} to use the local daemon, or declare pathDomain: 'venue' if the paths really are on the machine it points at.`);
}
function assertProxyStagedForVenue(spec, staged) {
  if (spec.profile !== "install")
    return;
  if (pathDomainOf(spec) !== "venue")
    return;
  if (staged !== void 0)
    return;
  throw new FenceError('this install step runs on a venue but no staged proxy code came with it. The runner can only stage on THIS machine, so it would bind-mount a path the venue does not have \u2014 Docker creates that as an empty directory and the sidecar dies with "Cannot find module". Pass RunInFenceOptions.proxyCode from the lease that owns the venue (VenueLease.stageProxyCode).');
}
async function runContainedOn(d, spec, env, opts = {}) {
  assertDomainDeclared(d, spec);
  assertNotAmbientlySteered(d, spec);
  assertProxyStagedForVenue(spec, opts.proxyCode);
  const leaks = auditEnv(env);
  if (leaks.length > 0) {
    throw new FenceError(`refusing to spawn: environment carries credential material (${leaks.join(", ")})`);
  }
  const idBase = `merge-agent-${process.pid}-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`;
  let sidecar = null;
  try {
    if (spec.profile === "install") {
      const allow = opts.installAllowlist ?? DEFAULT_INSTALL_ALLOWLIST;
      const staged = opts.proxyCode ?? stageProxyCode();
      const owned = opts.proxyCode === void 0;
      sidecar = await startProxySidecar(d, allow, `${idBase}-sc`, owned ? staged : { dir: staged.dir, cleanup: leaveToTheLease }, opts.labels);
    }
    const argv = containerArgs(spec, env, {
      name: idBase,
      cwd: opts.cwd,
      image: opts.image,
      net: sidecar?.net,
      labels: opts.labels
    });
    return await spawnWorkload(d, idBase, argv, opts.timeoutMs ?? 9e5);
  } finally {
    sidecar?.teardown();
  }
}
function containerContainmentOn(d) {
  return {
    kind: "container",
    available: () => containerAvailableOn(d),
    run: (spec, env, opts = {}) => runContainedOn(d, spec, env, opts)
  };
}
var DEFAULT_CONTAINER_IMAGE, GUEST, TMPFS_SIZE_MB, DOCKER_TIMEOUT_MS, SIDECAR_PROXY_PORT, SIDECAR_CODE_GUEST, PROXY_ENV_KEYS, WINDOWS_DRIVE_ROOT, IMAGE_HOST, IMAGE_NAME, IMAGE_PATH, IMAGE_TAG, IMAGE_DIGEST, IMAGE_REF, LABEL_KEY, probed, PROXY_FILES, leaveToTheLease;
var init_container = __esm({
  "../../packages/containment/dist/container.js"() {
    "use strict";
    init_fence();
    init_env();
    init_egressProxy();
    DEFAULT_CONTAINER_IMAGE = "node:22-bookworm-slim";
    GUEST = { clone: "/fenced/clone", jail: "/fenced/jail", tmp: "/fenced/tmp" };
    TMPFS_SIZE_MB = 2048;
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
    probed = /* @__PURE__ */ new WeakMap();
    PROXY_FILES = ["proxyEntry.js", "egressProxy.js"];
    leaveToTheLease = () => {
    };
  }
});

// ../../packages/containment/dist/containerLocal.js
var containerContainment;
var init_containerLocal = __esm({
  "../../packages/containment/dist/containerLocal.js"() {
    "use strict";
    init_container();
    init_dockerClient();
    init_containment();
    containerContainment = containerContainmentOn(localDockerClient());
  }
});

// ../../packages/containment/dist/index.js
var init_dist = __esm({
  "../../packages/containment/dist/index.js"() {
    "use strict";
    init_env();
    init_fence();
    init_containment();
    init_dockerClient();
    init_containerLocal();
    init_container();
    init_reap();
    init_egressProxy();
  }
});

// ../../packages/envrun/dist/labels.js
function censusTotal(c) {
  return c.containers.length + c.volumes.length + c.networks.length;
}
function ids(docker3, args) {
  const res = docker3.sync([...args], { timeoutMs: 15e3 });
  if (res.error || res.status !== 0)
    return [];
  return res.stdout.split("\n").map((s) => s.trim()).filter((s) => s.length > 0);
}
function census(docker3, label) {
  const filter = `label=${label}`;
  return {
    containers: ids(docker3, ["ps", "-aq", "--filter", filter]),
    volumes: ids(docker3, ["volume", "ls", "-q", "--filter", filter]),
    networks: ids(docker3, ["network", "ls", "-q", "--filter", filter])
  };
}
function localCensus(label) {
  return census(localDockerClient(), label);
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
    init_dist();
    RUN_LABEL_KEY = "supergoal.run";
    LabelWatch = class {
      label;
      docker;
      intervalMs;
      #timer = null;
      #peak = { containers: [], volumes: [], networks: [] };
      #samples = 0;
      /**
       * `docker` is REQUIRED and second, so a sampler cannot be built without
       * naming the daemon it watches. A watch polling one daemon while the run
       * executes on another reports a high-water mark of 0 — indistinguishable
       * from "the label never applied", which is the exact ambiguity this class
       * exists to remove.
       */
      constructor(label, docker3, intervalMs = 250) {
        this.label = label;
        this.docker = docker3;
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
        const now = census(this.docker, this.label);
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

// ../../packages/envrun/dist/previewRegistry.js
function createPreviewRegistry() {
  const live = /* @__PURE__ */ new Map();
  return {
    register(client, container) {
      const names = live.get(client) ?? /* @__PURE__ */ new Set();
      names.add(container);
      live.set(client, names);
    },
    deregister(client, container) {
      const names = live.get(client);
      if (names === void 0)
        return;
      names.delete(container);
      if (names.size === 0)
        live.delete(client);
    },
    pairs() {
      const out = [];
      for (const [client, names] of live) {
        for (const container of names)
          out.push({ client, container });
      }
      return out;
    },
    reapAll() {
      for (const [client, names] of live) {
        for (const container of names) {
          client.sync(["rm", "-f", container], { timeoutMs: 15e3 });
        }
      }
      live.clear();
    }
  };
}
var init_previewRegistry = __esm({
  "../../packages/envrun/dist/previewRegistry.js"() {
    "use strict";
  }
});

// ../../packages/envrun/dist/preview.js
import { randomBytes } from "crypto";
import { mkdirSync as mkdirSync3, writeFileSync as writeFileSync3 } from "fs";
import { join as join6 } from "path";
function docker(client, args, timeoutMs = 6e4) {
  const res = client.sync([...args], { timeoutMs });
  return {
    ok: !res.error && res.status === 0,
    stdout: res.stdout,
    stderr: (res.error ? res.error.message : "") + res.stderr
  };
}
function installReaper() {
  if (reaperInstalled)
    return;
  reaperInstalled = true;
  process.on("exit", () => {
    livePreviews.reapAll();
  });
}
function readHostPort(client, container) {
  const res = docker(client, ["port", container, `${String(GUEST_PORT)}/tcp`]);
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
async function fetchInstanceToken(url, authToken) {
  try {
    const headers = {};
    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }
    const res = await fetch(url, { cache: "no-store", headers });
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
  const bindAddress = req.bindAddress ?? "127.0.0.1";
  const client = req.docker;
  if (!LOOPBACK_BINDS.has(bindAddress) && req.authToken === void 0) {
    throw new PreviewError(`refusing to publish the preview on ${bindAddress} without an explicit authToken: a bind wider than loopback puts this run \u2014 the test output tail included \u2014 on the developer's local network`);
  }
  const authToken = req.authToken ?? randomBytes(24).toString("base64url");
  const envArgs = ["--env", `PREVIEW_AUTH_TOKEN=${authToken}`];
  const probeHost = WILDCARD_BINDS.has(bindAddress) ? "127.0.0.1" : bindAddress;
  const probeAuthority = probeHost.includes(":") ? `[${probeHost}]` : probeHost;
  mkdirSync3(req.scratchDir, { recursive: true });
  const docPath = join6(req.scratchDir, "preview-run.json");
  writeFileSync3(docPath, JSON.stringify(req.document, null, 2), "utf8");
  const teardown = () => {
    livePreviews.deregister(client, container);
    for (let i = 0; i < 3; i += 1) {
      const inspect = docker(client, ["inspect", "--format", "{{.State.Status}}", container]);
      if (!inspect.ok)
        return { clean: true, leaked: [] };
      docker(client, ["rm", "-f", container]);
    }
    const still = docker(client, ["inspect", "--format", "{{.State.Status}}", container]);
    return still.ok ? { clean: false, leaked: [`container ${container}`] } : { clean: true, leaked: [] };
  };
  const startedAt = Date.now();
  try {
    const run2 = docker(client, [
      "run",
      "-d",
      "--init",
      `--name=${container}`,
      // A network IS granted here, unlike the verification step. It carries our
      // own argv over a document we wrote; the repo's code never runs in it.
      "--network=bridge",
      // Loopback by default, and anything wider was refused above unless the
      // caller named a token. A bare `-p 8080` would bind 0.0.0.0 and put a
      // developer's in-progress work on their local network.
      `--publish=${bindAddress}:0:${String(GUEST_PORT)}`,
      ...envArgs,
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
      hostPort ??= readHostPort(client, container);
      if (hostPort === null) {
        lastDetail = "Docker never reported a published host port";
        await sleep2(200);
        continue;
      }
      token = await fetchInstanceToken(`http://${probeAuthority}:${String(hostPort)}/`, authToken);
      if (token !== null)
        break;
      const alive = docker(client, ["inspect", "--format", "{{.State.Running}}", container]);
      if (alive.stdout.trim() !== "true") {
        const logs = docker(client, ["logs", "--tail", "20", container]);
        throw new PreviewError(`the preview container exited before serving: ${logs.stdout.trim()}${logs.stderr.trim()}`);
      }
      lastDetail = "the port is published but the server has not answered yet";
      await sleep2(150);
    }
    if (hostPort === null || token === null) {
      throw new PreviewError(`the preview URL never became reachable: ${lastDetail}`);
    }
    livePreviews.register(client, container);
    installReaper();
    const origin = `http://${probeAuthority}:${String(hostPort)}/`;
    return {
      url: `${origin}?token=${encodeURIComponent(authToken)}`,
      origin,
      authToken,
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
function startLocalPreview(req) {
  return startPreview({ ...req, docker: localDockerClient() });
}
var PreviewError, GUEST_PORT, GUEST_DOC, LOOPBACK_BINDS, WILDCARD_BINDS, SERVER_SOURCE, livePreviews, reaperInstalled, sleep2;
var init_preview = __esm({
  "../../packages/envrun/dist/preview.js"() {
    "use strict";
    init_dist();
    init_previewRegistry();
    PreviewError = class extends Error {
    };
    GUEST_PORT = 8080;
    GUEST_DOC = "/preview/run.json";
    LOOPBACK_BINDS = /* @__PURE__ */ new Set(["127.0.0.1", "localhost", "::1"]);
    WILDCARD_BINDS = /* @__PURE__ */ new Set(["0.0.0.0", "::"]);
    SERVER_SOURCE = `
const http = require('node:http');
const { readFileSync } = require('node:fs');
const { randomUUID, timingSafeEqual } = require('node:crypto');

// Read ONCE, at startup, and refuse to run without it. An unset token used to
// skip the check entirely, which meant the one configuration nobody sets on
// purpose was also the one that served a developer's in-progress work to
// anything that could reach the port. Absent must never mean permitted \u2014 the
// polarity requireSecret() holds in apps/web/lib/secrets.ts.
const AUTH_TOKEN = process.env.PREVIEW_AUTH_TOKEN || '';
if (AUTH_TOKEN === '') {
  process.stderr.write(
    'preview: refusing to start \u2014 PREVIEW_AUTH_TOKEN is unset, and this server will not ' +
      'serve a run document unauthenticated\\n',
  );
  process.exit(1);
}
const EXPECTED = Buffer.from(AUTH_TOKEN, 'utf8');

/** The token the client presented, or null. */
function presented(req) {
  const header = req.headers['authorization'];
  const bearer = typeof header === 'string' ? /^Bearer\\s+(.+)$/i.exec(header) : null;
  if (bearer !== null) return bearer[1];
  // A non-Bearer Authorization header FALLS THROUGH to the query parameter. The
  // earlier ternary branched on the header merely EXISTING, so a client sending
  // "Basic \u2026" produced an empty string and could never authenticate at all.
  //
  // The query form stays because the founder opens this in a browser and a
  // browser sends no Authorization header. That is the only reason it is
  // accepted: a token in a URL lands in browser history, shell history and any
  // proxy log on the way, where a header does not.
  return new URL(req.url, 'http://localhost').searchParams.get('token');
}

function authorized(req) {
  const given = presented(req);
  if (typeof given !== 'string') return false;
  const got = Buffer.from(given, 'utf8');
  // timingSafeEqual THROWS on a length mismatch, so length is compared first and
  // refused here. The length is not the secret; the bytes are.
  if (got.length !== EXPECTED.length) return false;
  return timingSafeEqual(got, EXPECTED);
}

// Per-INSTANCE, minted at boot. Not passed in, not derived from anything the
// host controls \u2014 that is what makes "same token \u21D2 same instance" hold.
const INSTANCE_TOKEN = randomUUID();
const DOC = JSON.parse(readFileSync(${JSON.stringify(GUEST_DOC)}, 'utf8'));
let served = 0;

http
  .createServer((req, res) => {
    if (!authorized(req)) {
      res.writeHead(401, { 'content-type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ error: 'unauthorized' }));
    }
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
    livePreviews = createPreviewRegistry();
    reaperInstalled = false;
    sleep2 = (ms) => new Promise((r) => setTimeout(r, ms));
  }
});

// ../../packages/envrun/dist/venue.js
import { join as join7 } from "path";
function localJailPaths(scratchRoot) {
  return {
    jail: join7(scratchRoot, JAIL_SEGMENT),
    tmp: join7(scratchRoot, JAIL_TMP_SEGMENT)
  };
}
function localVenue() {
  return {
    kind: "local",
    acquire: (runId) => acquireTransactionally((allocated) => {
      void allocated;
      return Promise.resolve(acquireLocalLease(runId));
    })
  };
}
async function acquireTransactionally(body) {
  const undos = [];
  try {
    return await body({
      onRollback: (undo) => {
        undos.push(undo);
      }
    });
  } catch (err) {
    const failures = [];
    for (const undo of undos.reverse()) {
      let failed = null;
      try {
        await undo();
      } catch (rollbackErr) {
        failed = { thrown: rollbackErr };
      }
      if (failed === null)
        continue;
      let entry;
      try {
        entry = describeThrown(failed.thrown, { includeName: true });
      } catch {
        entry = UNDESCRIBABLE_THROWN;
      }
      failures.push(entry);
    }
    if (failures.length > 0)
      throw new VenueRollbackError(err, failures);
    throw err;
  }
}
function rollbackMessage(cause, rollbackFailures) {
  const headline = describeThrown(cause, { includeName: false });
  let tail2;
  try {
    tail2 = `[venue acquisition rolled back with ${String(rollbackFailures.length)} failure(s): ${rollbackFailures.join("; ")} \u2014 one or more allocated resources may still exist]`;
  } catch {
    tail2 = UNLISTABLE_ROLLBACK_FAILURES;
  }
  return `${headline} ${tail2}`;
}
function describeThrown(thrown, opts) {
  try {
    if (isErrorValue(thrown)) {
      const message = readErrorField(thrown, "message", UNREADABLE_MESSAGE);
      if (!opts.includeName)
        return message;
      const name = readErrorField(thrown, "name", UNREADABLE_NAME);
      return message === "" ? name : `${name}: ${message}`;
    }
    return coerceToString(thrown);
  } catch {
    return UNDESCRIBABLE_THROWN;
  }
}
function isErrorValue(thrown) {
  try {
    return thrown instanceof Error;
  } catch {
    return false;
  }
}
function readErrorField(thrown, key, fallback) {
  let raw;
  try {
    raw = thrown[key];
  } catch {
    return fallback;
  }
  return typeof raw === "string" ? raw : coerceToString(raw);
}
function coerceToString(thrown) {
  try {
    return String(thrown);
  } catch {
    return UNCOERCIBLE_THROWN;
  }
}
function acquireLocalLease(runId) {
  const docker3 = localDockerClient();
  const containment = selectContainment([containerContainmentOn(docker3)]);
  let released = false;
  const stagedProxies = [];
  const lease = {
    kind: "local",
    runId,
    containment,
    docker: docker3,
    // Stated, not inferred from `kind`. On this venue it is the truth twice over:
    // the paths are on this machine AND `canonical()` is what should resolve
    // them, which is the behaviour every local run has always had.
    pathDomain: "local",
    get released() {
      return released;
    },
    stage: (local) => (
      // The local venue IS the developer's machine, so staging is the identity
      // and the paths are already canonical here. This is not a stub: it is the
      // one venue for which the answer is "nothing to copy", and having it go
      // through the same method as a hosted venue is what stops `thrun.ts` from
      // ever holding a path it did not get from a venue.
      //
      // `jail` and `tmp` are DERIVED here rather than carried in on `LocalTree`,
      // because the join differs by side and the venue owns the spelling of its
      // own paths: the host's `join` here, `venueJoin` on a hosted venue. The
      // segments are one constant in `fence.ts`, so the tree `buildJail` wrote
      // and the tree a venue mounts cannot drift apart.
      Promise.resolve({
        cloneDir: local.cloneDir,
        scratchRoot: local.scratchRoot,
        previewDir: local.previewDir,
        ...localJailPaths(local.scratchRoot)
      })
    ),
    // The containment function verbatim, which is the point of the barrel
    // re-export rather than a copy here: this venue's daemon and this process
    // share a filesystem, so the directory it makes under `tmpdir()` is already
    // venue-side and has been on every local run since the sidecar existed.
    //
    // TRACKED, so `release()` can be the guaranteed owner the interface
    // promises. Returning a bare handle made that promise the CALLER's to keep,
    // and a caller that staged and then failed outside `runEnvironmentSpec`'s
    // `finally` left the directory behind while release reported success.
    //
    // REFUSING AFTER RELEASE is the other half of the same promise. Staging onto
    // a drained list would leak with nothing left to drain, and `release()` has
    // already reported it had nothing to do — the split ownership this tracking
    // exists to close, reached from the other side.
    //
    // ONLY THIS ARM CHECKS IT. An earlier draft of this comment said the hosted
    // arm refuses the same way through `check()`, and that is not what `check()`
    // tests: `assertVenueUnchanged` reads the tunnel's failure and classifies
    // the daemon, and never looks at `released`. Hosted refuses a post-release
    // staging only incidentally, because by then the VM is gone. Naming the
    // check and what it actually tests is the rule this branch spent its length
    // on, and that draft broke it in the same breath as stating it.
    //
    // That leaves the two arms answering one programmer error with different
    // exit codes — hosted's incidental failure is a `HostedVenueError` at 2,
    // this one is a plain throw at 1. Recorded on TERM-752 rather than fixed
    // here: it is unreachable while `placement.ts` refuses first.
    //
    // THE EXIT CODE IS WHY IT IS NOT A REFUSAL TYPE. Nothing catches it and
    // `findRunRefusal` does not match it, so it reaches the top-level catch at
    // exit 1 — correct, because only our own call ordering can reach this, which
    // is `assertDomainDeclared`'s reasoning and the same one this branch applied
    // to `assertProxyStagedForVenue`. Giving it `RunRefusalError` would dress
    // our defect as a polite refusal, TERM-649's lie inverted.
    //
    // It is a NAMED subclass rather than a bare `Error` for a hazard already
    // here, not a speculative one. `stageProxyCode()` in `containment` throws
    // `FenceError` on a damaged install, telling the developer to reinstall the
    // CLI. Two distinguishable failures leave this one call, so the day anyone
    // adds a catch to surface that instruction, an unnamed ordering bug gets
    // swept into it and tells a developer to reinstall over our mistake.
    stageProxyCode: () => {
      if (released) {
        return Promise.reject(new LeaseReleasedError("this lease was already released, so a staging made now would never be removed: release() has run and drained what it was holding."));
      }
      const staged = stageProxyCode();
      stagedProxies.push(staged);
      return Promise.resolve(staged);
    },
    census: (label) => Promise.resolve(released ? {
      observed: false,
      census: { containers: [], volumes: [], networks: [] },
      unobservedReason: RELEASED_LEASE_CENSUS_REASON
    } : { observed: true, census: census(docker3, label), unobservedReason: null }),
    publishPreview: (req) => startPreview({ ...req, docker: docker3 }),
    release: () => {
      if (released) {
        return Promise.resolve({
          kind: "local",
          released: false,
          alreadyReleased: true,
          error: null,
          detail: "already released; nothing to do"
        });
      }
      released = true;
      const staged = stagedProxies.splice(0, stagedProxies.length);
      for (const s of staged)
        s.cleanup();
      return Promise.resolve({
        kind: "local",
        released: true,
        alreadyReleased: false,
        error: null,
        detail: "the local venue owns no host resources; the lease is closed"
      });
    }
  };
  return lease;
}
var VenueRollbackError, UNREADABLE_MESSAGE, UNREADABLE_NAME, UNCOERCIBLE_THROWN, UNDESCRIBABLE_THROWN, UNLISTABLE_ROLLBACK_FAILURES, RELEASED_LEASE_CENSUS_REASON, LeaseReleasedError;
var init_venue = __esm({
  "../../packages/envrun/dist/venue.js"() {
    "use strict";
    init_dist();
    init_labels();
    init_preview();
    VenueRollbackError = class extends Error {
      /** Every undo that threw, in the order they ran (reverse allocation order). */
      rollbackFailures;
      constructor(cause, rollbackFailures) {
        super(rollbackMessage(cause, rollbackFailures), { cause });
        this.name = "VenueRollbackError";
        this.rollbackFailures = rollbackFailures;
      }
    };
    UNREADABLE_MESSAGE = "<an error whose message could not be read>";
    UNREADABLE_NAME = "<an error whose name could not be read>";
    UNCOERCIBLE_THROWN = "<a thrown value that cannot be converted to a string>";
    UNDESCRIBABLE_THROWN = "<a thrown value that could not be described>";
    UNLISTABLE_ROLLBACK_FAILURES = "[venue acquisition rolled back, and the failures could not be listed \u2014 one or more allocated resources may still exist]";
    RELEASED_LEASE_CENSUS_REASON = "the lease was already released, so this venue can no longer be interrogated";
    LeaseReleasedError = class extends Error {
      name = "LeaseReleasedError";
    };
  }
});

// ../../packages/envrun/dist/execute.js
import { spawnSync as spawnSync4 } from "child_process";
function findRunRefusal(err) {
  try {
    let current = err;
    for (let depth = 0; depth < MAX_CAUSE_FRAMES; depth += 1) {
      if (current instanceof RunRefusalError)
        return current;
      if (current instanceof ContainmentRefusalError) {
        return new RunRefusalError(current.message, { cause: current });
      }
      const next = current?.cause;
      if (next === void 0 || next === null)
        return null;
      current = next;
    }
  } catch {
    return null;
  }
  return null;
}
function describeCause(err) {
  let out = "";
  let frames = 0;
  const append = (frame) => {
    out = frames === 0 ? frame : `${out}
caused by: ${frame}`;
    frames += 1;
  };
  let current = err;
  try {
    for (let depth = 0; depth < MAX_CAUSE_FRAMES && current !== void 0 && current !== null; depth += 1) {
      let frame = describeThrown(current, { includeName: true });
      let next;
      let asError = null;
      try {
        asError = current instanceof Error ? current : null;
      } catch {
        append(frame);
        append(CHAIN_UNREADABLE);
        return out;
      }
      try {
        const stack = asError?.stack;
        if (typeof stack === "string" && stack !== "")
          frame = stack;
      } catch {
      }
      try {
        next = current.cause;
      } catch {
        append(frame);
        append(CHAIN_UNREADABLE);
        return out;
      }
      append(frame);
      current = next;
    }
    if (current !== void 0 && current !== null)
      append(CHAIN_TOO_DEEP);
  } catch {
    append(CHAIN_UNREADABLE);
  }
  return frames === 0 ? null : out;
}
function atLeast(a, b) {
  const left = a.split(".").map(Number);
  const right = b.split(".").map(Number);
  const shared = Math.min(left.length, right.length);
  for (let i = 0; i < shared; i += 1) {
    const l = left[i];
    const r = right[i];
    if (l !== r)
      return l > r;
  }
  return true;
}
function imageForRuntime(runtime, override, version) {
  if (override)
    return override;
  const shape = RUNTIME_IMAGES[runtime];
  if (!shape) {
    throw new RunRefusalError(`no container image is mapped for runtime ${JSON.stringify(runtime)}. Refusing to run it in the Node image: a missing interpreter surfaces as "command not found", which the classifier reads as tests-failed \u2014 a false red blamed on the repo.`);
  }
  if (version === void 0 || version === null)
    return unversionedImage(shape);
  if (!TAG_VERSION.test(version)) {
    throw new RunRefusalError(`runtime version ${JSON.stringify(version)} is not a bare version, so no image tag can be built from it. Refusing rather than booting the default: the repo asked for a version, and supplying a different one silently is what TERM-643 fixed.`);
  }
  return `${shape.repository}:${version}${shape.suffix}`;
}
function setManifestProbe(probe) {
  const previous = manifestProbe;
  manifestProbe = probe ?? dockerManifestProbe;
  return previous;
}
function imageDefinitelyAbsent(image) {
  const res = manifestProbe(image);
  if (res.status === 0)
    return false;
  return /manifest unknown|no such manifest/i.test(res.output);
}
function resolvePublishedImage(image, runtime, version) {
  if (!imageDefinitelyAbsent(image))
    return image;
  const shape = RUNTIME_IMAGES[runtime];
  if (shape && shape.declaredIsFloor && atLeast(shape.defaultVersion, version)) {
    return unversionedImage(shape);
  }
  throw new RunRefusalError(`the repo declares ${runtime} ${version}, and no image is published at ${image}` + (shape && shape.declaredIsFloor ? `. Our default is ${shape.defaultVersion}, which is OLDER than that, so falling back would run the repo under a toolchain it says it cannot use` : `. ${runtime} treats a declared version as an exact pin, not a minimum, so a different one is a different environment`) + ". Refusing rather than booting a version the repo did not ask for \u2014 that substitution is what made this class of failure unattributable (TERM-643). Pass an explicit image to override.");
}
function resolveImageForSpec(spec, override) {
  const declared = spec.runtimeVersion;
  const image = imageForRuntime(spec.runtime, override, declared);
  const constructed = (() => {
    if (declared === null)
      return null;
    try {
      return imageForRuntime(spec.runtime, void 0, declared);
    } catch {
      return null;
    }
  })();
  if (constructed !== null && image === constructed && declared !== null) {
    return resolvePublishedImage(image, spec.runtime, declared);
  }
  return image;
}
function classifySingleRun(run2) {
  return classifyVerification(run2).outcome;
}
function toExecution(step) {
  return {
    exitCode: step.exitCode,
    stdout: step.stdout,
    stderr: step.stderr,
    timedOut: step.timedOut
  };
}
function assertVenueOwnerDeclared(lease) {
  if (lease.pathDomain !== "venue" || lease.guestUser)
    return;
  throw new RunRefusalError("this venue did not say which account owns the tree it staged, so the guest would run under this machine's uid and could not write its own clone. We refuse rather than report that permission error as the repo's tests failing.");
}
async function runEnvironmentSpec(req) {
  const startedAt = Date.now();
  const containment = req.lease.containment;
  if (containment.kind !== "container") {
    throw new EnvRunError(`phase 2 requires the container tier, got ${containment.kind}. Refusing: a container phase that silently ran under seatbelt would make every container claim vacuous.`);
  }
  assertVenueOwnerDeclared(req.lease);
  const image = resolveImageForSpec(req.spec, req.image);
  const { jail, tmp } = req;
  const env = scrubEnv(process.env, scrubEnvPathsFor("container", { jail, tmp }));
  const labels = req.labels;
  const watch = labels ? new LabelWatch(labelSelector(labels), req.lease.docker) : null;
  watch?.start();
  let install = null;
  let test = null;
  let result;
  let proxyCode = null;
  try {
    if (req.spec.installCommand !== null) {
      proxyCode = await req.lease.stageProxyCode();
      install = await runStep(containment, {
        step: "install",
        profile: "install",
        proxyCode,
        command: req.spec.installCommand,
        repoDir: req.repoDir,
        jail,
        tmp,
        pathDomain: req.lease.pathDomain,
        // TERM-729: travels WITH pathDomain, because it answers the same
        // question about the same machine. Undefined on a local lease.
        guestUser: req.lease.guestUser,
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
        pathDomain: req.lease.pathDomain,
        // TERM-729: travels WITH pathDomain, because it answers the same
        // question about the same machine. Undefined on a local lease.
        guestUser: req.lease.guestUser,
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
    proxyCode?.cleanup();
  }
  const peak = watch?.peak ?? { containers: [], volumes: [], networks: [] };
  const afterReport = labels ? await req.lease.census(labelSelector(labels)) : null;
  const after = afterReport?.census ?? {
    containers: [],
    volumes: [],
    networks: []
  };
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
    // DECLARED, never derived from the docker endpoint — `fence.ts`'s
    // `PathDomain` comment explains why that inference is unavailable: a hosted
    // venue is reached over a forwarded unix socket, so the endpoint is a local
    // path in front of a remote daemon. The venue that produced these paths is
    // the one party that knows, and it is the lease this value came from.
    pathDomain: r.pathDomain,
    guestUser: r.guestUser,
    program: "/bin/sh",
    args: ["-c", r.command]
  };
  const startedAt = Date.now();
  const res = await containment.run(spec, r.env, {
    timeoutMs: r.timeoutMs,
    image: r.image,
    ...r.labels ? { labels: r.labels } : {},
    ...r.proxyCode ? { proxyCode: r.proxyCode } : {}
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
var EnvRunError, RunRefusalError, MAX_CAUSE_FRAMES, CHAIN_UNREADABLE, CHAIN_TOO_DEEP, RUNTIME_IMAGES, unversionedImage, TAG_VERSION, dockerManifestProbe, manifestProbe;
var init_execute = __esm({
  "../../packages/envrun/dist/execute.js"() {
    "use strict";
    init_dist();
    init_classify();
    init_labels();
    init_venue();
    EnvRunError = class extends Error {
    };
    RunRefusalError = class extends EnvRunError {
    };
    MAX_CAUSE_FRAMES = 16;
    CHAIN_UNREADABLE = "<the cause chain stopped: a value refused to be read>";
    CHAIN_TOO_DEEP = `<the cause chain continued past ${MAX_CAUSE_FRAMES} frames and was not followed further>`;
    RUNTIME_IMAGES = {
      node: {
        repository: "node",
        suffix: "-bookworm-slim",
        defaultVersion: "22",
        declaredIsFloor: false
      },
      python: {
        repository: "python",
        suffix: "-bookworm",
        defaultVersion: "3.12",
        declaredIsFloor: false
      },
      go: { repository: "golang", suffix: "-bookworm", defaultVersion: "1.23", declaredIsFloor: true },
      ruby: { repository: "ruby", suffix: "-bookworm", defaultVersion: "3.3", declaredIsFloor: false },
      rust: { repository: "rust", suffix: "-bookworm", defaultVersion: "1", declaredIsFloor: true }
    };
    unversionedImage = (shape) => `${shape.repository}:${shape.defaultVersion}${shape.suffix}`;
    TAG_VERSION = /^\d+(?:\.\d+){0,2}$/;
    dockerManifestProbe = (image) => {
      const res = spawnSync4("docker", ["manifest", "inspect", image], {
        encoding: "utf8",
        timeout: 3e4
      });
      return { status: res.status, output: `${res.stdout ?? ""}${res.stderr ?? ""}` };
    };
    manifestProbe = dockerManifestProbe;
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
import { createCipheriv, createDecipheriv, diffieHellman, generateKeyPairSync as generateKeyPairSync2, hkdfSync, randomBytes as randomBytes2 } from "crypto";
var init_sealedbox = __esm({
  "../../packages/attest/dist/sealedbox.js"() {
    "use strict";
    init_keys();
    init_pae();
  }
});

// ../../packages/attest/dist/aead.js
import { createCipheriv as createCipheriv2, createDecipheriv as createDecipheriv2, randomBytes as randomBytes3 } from "crypto";
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

// ../../packages/attest/dist/gceIdentity.js
import { createHash, createPublicKey as createPublicKey2, verify as cryptoVerify2 } from "crypto";
function expectedAudience(dispatchId) {
  if (dispatchId === "")
    throw new TypeError("expectedAudience: dispatchId is empty");
  return `${VERIFICATION_RUN_AUDIENCE_BASE}#${dispatchId}`;
}
function venueIdentityEmail(projectId) {
  if (projectId === "")
    throw new TypeError("venueIdentityEmail: projectId is empty");
  return `venue-identity@${projectId}.iam.gserviceaccount.com`;
}
function refuseIdentity(reason, detail) {
  return { ok: false, reason, detail };
}
function strictBase64UrlDecode(s) {
  if (!/^[A-Za-z0-9_-]*$/.test(s) || s.length % 4 === 1)
    return null;
  const decoded = Buffer.from(s, "base64url");
  if (decoded.toString("base64url") !== s)
    return null;
  return decoded;
}
function decodeJsonSegment(segment) {
  const bytes = strictBase64UrlDecode(segment);
  if (bytes === null)
    return null;
  let parsed;
  try {
    parsed = JSON.parse(bytes.toString("utf8"));
  } catch {
    return null;
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed))
    return null;
  return parsed;
}
function assertExpectationsComplete(expectations) {
  const required = [
    ["audience", expectations.audience],
    ["serviceAccountEmail", expectations.serviceAccountEmail],
    ["projectId", expectations.projectId],
    ["instanceName", expectations.instanceName]
  ];
  for (const [name, value] of required) {
    if (value === "")
      throw new TypeError(`verifyGceIdentityToken: expectations.${name} is empty`);
  }
  if (expectations.instanceId === "") {
    throw new TypeError("verifyGceIdentityToken: expectations.instanceId is empty");
  }
}
async function verifyGceIdentityToken(token, expectations, deps) {
  assertExpectationsComplete(expectations);
  if (!Number.isFinite(deps.now)) {
    throw new TypeError("verifyGceIdentityToken: deps.now is not a finite number");
  }
  if (token.length > MAX_TOKEN_LENGTH) {
    return refuseIdentity("token-malformed", "longer than any GCE identity token");
  }
  const parts = token.split(".");
  if (parts.length !== 3) {
    return refuseIdentity("token-malformed", "not a three-segment compact JWT");
  }
  const [headerB64, payloadB64, signatureB64] = parts;
  const header = decodeJsonSegment(headerB64);
  if (header === null) {
    return refuseIdentity("token-malformed", "header segment is not base64url-encoded JSON");
  }
  if (header.alg !== "RS256") {
    return refuseIdentity("algorithm-not-rs256", "token names an unsupported algorithm");
  }
  if (typeof header.kid !== "string" || header.kid === "") {
    return refuseIdentity("unknown-key", "token header names no key id");
  }
  const jwks = await deps.fetchJwks();
  const jwk = jwks.keys.find((k) => k.kid === header.kid && k.kty === "RSA");
  if (jwk === void 0) {
    return refuseIdentity("unknown-key", "token key id is not in the published key set");
  }
  const signature = strictBase64UrlDecode(signatureB64);
  if (signature === null) {
    return refuseIdentity("token-malformed", "signature segment is not base64url");
  }
  let signatureValid = false;
  try {
    const publicKey = createPublicKey2({ key: jwk, format: "jwk" });
    signatureValid = cryptoVerify2("sha256", Buffer.from(`${headerB64}.${payloadB64}`, "utf8"), publicKey, signature);
  } catch {
    signatureValid = false;
  }
  if (!signatureValid) {
    return refuseIdentity("signature-invalid", "signature does not verify under the named key");
  }
  const payload = decodeJsonSegment(payloadB64);
  if (payload === null) {
    return refuseIdentity("token-malformed", "payload segment is not base64url-encoded JSON");
  }
  if (payload.iss !== "https://accounts.google.com") {
    return refuseIdentity("issuer-mismatch", "issuer is not https://accounts.google.com");
  }
  if (payload.aud !== expectations.audience) {
    return refuseIdentity("audience-mismatch", "audience is not the one this run expects");
  }
  const nowSeconds = deps.now / 1e3;
  const exp = payload.exp;
  if (typeof exp !== "number" || !Number.isFinite(exp) || exp <= nowSeconds) {
    return refuseIdentity("token-expired", "exp is missing, malformed, or in the past");
  }
  const iat = payload.iat;
  if (typeof iat !== "number" || !Number.isFinite(iat) || iat > nowSeconds + IAT_FUTURE_SKEW_MS / 1e3) {
    return refuseIdentity("issued-in-future", "iat is missing, malformed, or too far in the future");
  }
  if (payload.email !== expectations.serviceAccountEmail || payload.email_verified !== true) {
    return refuseIdentity("wrong-account", "token is not from the venue identity account");
  }
  const google = payload.google;
  const computeEngine = typeof google === "object" && google !== null && !Array.isArray(google) ? google.compute_engine : void 0;
  if (typeof computeEngine !== "object" || computeEngine === null || Array.isArray(computeEngine)) {
    return refuseIdentity("compute-engine-block-missing", "no google.compute_engine block \u2014 was the token fetched with format=full?");
  }
  const ce = computeEngine;
  if (ce.project_id !== expectations.projectId) {
    return refuseIdentity("project-mismatch", "token names an instance in a different project");
  }
  if (ce.instance_name !== expectations.instanceName) {
    return refuseIdentity("instance-name-mismatch", "token names a different instance than this run booted");
  }
  if (typeof ce.instance_id !== "string" || ce.instance_id === "") {
    return refuseIdentity("instance-id-missing", "instance id is absent or not a string");
  }
  if (expectations.instanceId !== void 0 && ce.instance_id !== expectations.instanceId) {
    return refuseIdentity("instance-id-mismatch", "token names a different instance than the boot record");
  }
  if (typeof ce.zone !== "string" || !expectations.allowedZones.includes(ce.zone)) {
    return refuseIdentity("zone-not-allowed", "zone is not one the pool is configured to use");
  }
  return {
    ok: true,
    value: {
      instanceId: ce.instance_id,
      instanceName: expectations.instanceName,
      zone: ce.zone,
      projectId: expectations.projectId,
      email: expectations.serviceAccountEmail,
      iat,
      exp,
      tokenSha256: createHash("sha256").update(token, "utf8").digest("hex")
    }
  };
}
var VERIFICATION_RUN_AUDIENCE_BASE, IAT_FUTURE_SKEW_MS, MAX_TOKEN_LENGTH;
var init_gceIdentity = __esm({
  "../../packages/attest/dist/gceIdentity.js"() {
    "use strict";
    VERIFICATION_RUN_AUDIENCE_BASE = "https://terminalhire.com/api/verification-run";
    IAT_FUTURE_SKEW_MS = 5 * 60 * 1e3;
    MAX_TOKEN_LENGTH = 8192;
  }
});

// ../../packages/attest/dist/venueInstanceName.js
function venueInstanceName(runId) {
  return `th-run-${runId}`.replace(/_/g, "-").toLowerCase().slice(0, 62);
}
var init_venueInstanceName = __esm({
  "../../packages/attest/dist/venueInstanceName.js"() {
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
    init_gceIdentity();
    init_venueInstanceName();
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
    if (first === void 0)
      return `REFUSED   ${r.reason}`;
    const where = first.path ?? "the patch";
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
    case "environment-exhausted":
      return `OUR FAULT  the run ran out of a resource we cap; your work has not been judged \u2014 ${t}`;
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

// ../../packages/envrun/dist/attestation.js
import { createHash as createHash2, randomBytes as randomBytes4 } from "crypto";
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
  return createHash2("sha256").update(typeof data === "string" ? Buffer.from(data, "utf8") : data).digest("hex");
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
      nonce: opts.nonce ?? randomBytes4(16).toString("hex"),
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
      "test-command-unavailable": null,
      // null, with the same reasoning as `test-command-unavailable` and NOT
      // `budget-exceeded` (TERM-644). `budget-exceeded` is a signed statement ABOUT
      // the developer — their work overran a budget. Exhausting the tmpfs we sized,
      // or an OOM kill from memory we did not cap, is a statement about US. Signing
      // either as a budget outcome would put our environment failure into the
      // vocabulary a founder reads to decide whether to pay.
      "environment-exhausted": null
    };
    BASELINE_IS_A_VERDICT = {
      completed: true,
      "tests-failed": true,
      "no-tests-observed": true,
      "budget-exceeded": false,
      "counts-unparsed": false,
      "test-command-unavailable": false,
      "environment-exhausted": false
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
    refusal: null,
    venue: () => localVenue(),
    imageFor: (runtime, override, version) => imageForRuntime(runtime, override, version)
  };
}
function hostedPoolPlacement() {
  return {
    kind: "hosted-pool",
    // Declared AND thrown, from one constant. Two spellings of the same refusal
    // is how a gate on the door stops matching the gate in the room.
    refusal: HOSTED_POOL_REFUSAL,
    // The backstop survives the venue refactor UNCHANGED, and that is the
    // point of writing it here rather than returning some inert venue: a
    // placement that handed back a working `Venue` would become runnable by
    // accident, and the run it then reported as hosted would have happened on
    // the developer's own machine.
    //
    // `hostedVenue()` (design §6 item 4) NOW EXISTS and this still refuses.
    // Building it was never the condition. **The condition is stated ONCE, in
    // index.ts beside the `hostedVenue` export** — deliberately not restated
    // here, because this comment and that one were two copies of the same
    // paragraph and TERM-780 found them disagreeing: one named a blocker that
    // had been fixed underneath it. A pointer cannot drift from its target the
    // way a copy drifts from its original.
    venue: () => {
      throw new Error(HOSTED_POOL_REFUSAL);
    },
    imageFor: (runtime, override, version) => imageForRuntime(runtime, override, version)
  };
}
function placementFor(kind) {
  return PLACEMENTS[kind]();
}
function containmentUnavailableRefusal(detail) {
  return `${CONTAINMENT_UNAVAILABLE_PREFIX}${detail}`;
}
async function resolveLease(placement, runId) {
  try {
    return { ok: true, lease: await placement.venue().acquire(runId) };
  } catch (err) {
    if (findNoContainment(err) === null)
      throw err;
    return {
      ok: false,
      // `describeThrown`, not `err.message`/`String(err)`. Both of those are unguarded
      // reads on a value we have just established we cannot trust, and this expression is
      // evaluated BEFORE `diagnostic` in the same object literal — so a hostile value threw
      // here while the total helper two lines down never ran.
      refusal: containmentUnavailableRefusal(describeThrown(err, { includeName: false })),
      // The error ITSELF, not just the message folded into the sentence above. Kept apart
      // from `refusal` because the two have different audiences and different rules: the
      // sentence is shown to a developer, this is logged for us, after redaction.
      diagnostic: describeCause(err)
    };
  }
}
function findNoContainment(err) {
  try {
    let current = err;
    for (let depth = 0; depth < 16; depth += 1) {
      if (current instanceof NoContainmentError)
        return current;
      const next = current?.cause;
      if (next === void 0 || next === null)
        return null;
      current = next;
    }
  } catch {
    return null;
  }
  return null;
}
function parsePlacementKind(raw) {
  if (raw === void 0 || raw === null)
    return DEFAULT_PLACEMENT_KIND;
  const kinds = Object.keys(PLACEMENTS);
  const text = String(raw);
  if (kinds.includes(text))
    return text;
  const alias = PLACEMENT_ALIASES[text];
  if (alias !== void 0)
    return alias;
  const accepted = [...kinds, ...Object.keys(PLACEMENT_ALIASES)].join(", ");
  throw new Error(`terminalhire: unknown placement ${JSON.stringify(text)}. Accepted: ${accepted}. Refused rather than defaulted: a misspelled placement that quietly ran on your own machine would still print a verdict, and a verdict from the machine under test is exactly what a hosted run exists to avoid.`);
}
var HOSTED_POOL_REFUSAL, PLACEMENTS, CONTAINMENT_UNAVAILABLE_PREFIX, PLACEMENT_ALIASES, DEFAULT_PLACEMENT_KIND;
var init_placement = __esm({
  "../../packages/envrun/dist/placement.js"() {
    "use strict";
    init_dist();
    init_execute();
    init_venue();
    HOSTED_POOL_REFUSAL = "terminalhire: --placement hosted is declared but not implemented yet (TERM-483). The hosted runner currently executes on the LOCAL Docker daemon while booting a billable VM, so a run it reported as hosted would in fact have happened on this machine. Refusing rather than reporting a verification we cannot stand behind. Use --placement local-docker, which is honest about where it runs.";
    PLACEMENTS = {
      "local-docker": localDockerPlacement,
      "hosted-pool": hostedPoolPlacement
    };
    CONTAINMENT_UNAVAILABLE_PREFIX = "terminalhire: no container runtime is available on this machine, so there is nowhere to run your suite under containment. Nothing was built, run or judged \u2014 this is OUR environment refusing, not a verdict on your diff. Start Docker (or point DOCKER_HOST at a reachable daemon) and run again. What the probe found: ";
    PLACEMENT_ALIASES = {
      hosted: "hosted-pool"
    };
    DEFAULT_PLACEMENT_KIND = "local-docker";
  }
});

// ../../packages/envrun/dist/gcpPlacement.js
import { spawn as spawn3, spawnSync as spawnSync5 } from "child_process";
import { randomUUID } from "crypto";
import { existsSync as existsSync5, mkdirSync as mkdirSync4, rmSync as rmSync2 } from "fs";
function assertInstanceIdentity(fn, id) {
  const fields = [
    ["vmName", id.vmName, GCE_INSTANCE_NAME],
    ["project", id.project, GCP_RESOURCE_ID],
    ["zone", id.zone, GCP_RESOURCE_ID]
  ];
  for (const [field, value, pattern] of fields) {
    if (typeof value !== "string" || !pattern.test(value)) {
      throw new GcpPlacementError(`${fn}: ${field} ${JSON.stringify(value)} is not a plain GCP identifier (${String(pattern)}). These three are rendered into a gcloud command line a human is invited to paste, so anything that is not one shell word is refused.`);
    }
  }
}
function gcpBootArgv(p) {
  assertInstanceIdentity("gcpBootArgv", p);
  if (!GCP_LABEL_VALUE.test(p.runId)) {
    throw new GcpPlacementError(`gcpBootArgv: runId ${JSON.stringify(p.runId)} is not a valid GCP label value (${String(GCP_LABEL_VALUE)}). A run id outside that set either fails the instance create or injects extra labels, and an instance whose ${GCP_MANAGED_LABEL_KEY} label is not ours cannot be reaped.`);
  }
  return [
    "compute",
    "instances",
    "create",
    p.vmName,
    `--project=${p.project}`,
    `--zone=${p.zone}`,
    `--machine-type=${p.machineType}`,
    "--image-family=cos-stable",
    "--image-project=cos-cloud",
    // ── THE OUTER REAP. This, not the `finally` below, is what bounds the bill. ──
    //
    // An in-process `finally` is a best effort, not a reap. SIGKILL, a crashed
    // process, or a laptop that goes to sleep skips it entirely, and a boot that
    // exceeds `runGcloud`'s timeout returns before the `try` is ever entered — while
    // the instance GCP actually created keeps running. Nothing in our process can
    // close that class of hole, because the hole IS our process going away.
    //
    // So the lifetime is enforced by the platform: GCP deletes the instance when the
    // clock runs out whether or not we are alive to ask. Both exist on purpose — the
    // `finally` returns the money in seconds on the happy path, this caps the loss at
    // an hour on every other path. Removing either because "the other one handles it"
    // brings the orphan class straight back.
    `--max-run-duration=${String(GCP_MAX_RUN_DURATION_SECONDS)}s`,
    "--instance-termination-action=DELETE",
    // A survivor has to be findable. An unlabelled orphan can only be told apart from
    // a legitimate instance by a human who remembers booting it.
    `--labels=${GCP_RUN_LABEL_KEY}=${p.runId},${GCP_MANAGED_LABEL_KEY}=true`,
    // This instance runs untrusted third-party code, and it now carries a service
    // account — the venue-identity binding needs an instance-identity token, and only
    // an ATTACHED account can mint one (TERM-794/TERM-802). This replaces
    // `--no-service-account`, which used to mean "nothing on the metadata service to
    // steal". Attaching an account removes that, so the safety now rests on two things,
    // and this change MUST land together with proof #2 — never ahead of it:
    //
    //   1. `--no-scopes` + ZERO project roles bound the BLAST RADIUS of a lifted token.
    //      No scopes → the OAuth access-token endpoint serves nothing (measured,
    //      TERM-706); zero roles → the token authorizes no GCP API. But it is NOT
    //      valueless: it is the attestation evidence itself, so a lifted token still
    //      authorizes a false claim about WHERE a run happened (the steal-a-true-token
    //      attack in the item-2 spike). `--no-scopes` stays because it removes lateral
    //      GCP access; it does not make losing the identity token cheap.
    //   2. The untrusted code cannot reach the metadata server to lift the token at all.
    //      The test step runs `--network=none`; the install step runs on an `--internal`
    //      network whose only egress is a CONNECT-only, registry-allowlisted proxy that
    //      denies the metadata host three ways. Measured once on a real VM in
    //      docs/spikes/term-483-item2-metadata-denial.md (only a user bridge, which no
    //      profile here grants, ever reached metadata). The STANDING, per-push proof is
    //      the validate-fence metadata group (TERM-805), which lands in the SAME change
    //      as this SA-attach — that co-landing is the whole safety argument, not a nicety.
    // The email comes from the SAME speller acquire's serviceAccountEmail
    // expectation uses (TERM-832): two inline spellings of one value is how
    // the boot path and the verifier drift apart silently.
    `--service-account=${venueIdentityEmail(p.project)}`,
    "--no-scopes",
    "--shielded-secure-boot",
    "--shielded-vtpm",
    "--shielded-integrity-monitoring",
    // ── `--no-address` IS ABSENT ON PURPOSE, and this paragraph is the only place that
    // says so. It is the obvious next hardening flag — the instance runs untrusted code
    // and has no reason to hold a public IP — and adding it today STRANDS THE VM.
    //
    // Every step after boot reaches the instance over `gcloud compute ssh` with no
    // `--tunnel-through-iap`: the readiness probe, the docker socket tunnel, the remote
    // mkdir, and both tar streams. IAP was dropped from all of those at 263ad8992, so
    // SSH goes to the VM's external address and nothing else can. Take the address away
    // and the readiness probe times out after 60s against an instance that booted fine,
    // billing until the `finally` deletes it.
    //
    // The order is therefore fixed: restore `--tunnel-through-iap` at every ssh site
    // FIRST, then drop the public IP. Doing the second half alone looks like hardening
    // and is an outage.
    "--quiet"
  ];
}
function gcpDeleteArgv(p) {
  assertInstanceIdentity("gcpDeleteArgv", p);
  return [
    "compute",
    "instances",
    "delete",
    p.vmName,
    `--project=${p.project}`,
    `--zone=${p.zone}`,
    "--quiet"
  ];
}
function gcpRunnerPlacement(opts) {
  return {
    kind: "hosted-pool",
    refusal: HOSTED_POOL_REFUSAL,
    // `venue()` since TERM-667, and still a throw. The seam changed shape; what
    // must not change is that this door stays shut — a `Venue` returned here
    // would make the chokepoint runnable, which is the one thing the chokepoint
    // exists to prevent.
    venue: () => {
      throw new GcpPlacementError(HOSTED_POOL_REFUSAL);
    },
    imageFor: (runtime, override, version) => imageForRuntime(runtime, override, version)
  };
}
var DEFAULT_GCP_PROJECT, DEFAULT_GCP_ZONE, DEFAULT_GCP_MACHINE_TYPE, GcpPlacementError, GCP_MAX_RUN_DURATION_SECONDS, GCP_MANAGED_LABEL_KEY, GCP_RUN_LABEL_KEY, GCP_LABEL_VALUE, GCE_INSTANCE_NAME, GCP_RESOURCE_ID;
var init_gcpPlacement = __esm({
  "../../packages/envrun/dist/gcpPlacement.js"() {
    "use strict";
    init_dist();
    init_dist2();
    init_placement();
    init_execute();
    DEFAULT_GCP_PROJECT = "terminalhire-pool";
    DEFAULT_GCP_ZONE = "us-east1-b";
    DEFAULT_GCP_MACHINE_TYPE = "e2-standard-2";
    GcpPlacementError = class extends Error {
      constructor(message) {
        super(message);
        this.name = "GcpPlacementError";
      }
    };
    GCP_MAX_RUN_DURATION_SECONDS = 3600;
    GCP_MANAGED_LABEL_KEY = "th-managed";
    GCP_RUN_LABEL_KEY = "th-run";
    GCP_LABEL_VALUE = /^[a-z0-9_-]{1,63}$/;
    GCE_INSTANCE_NAME = /^[a-z](?:[-a-z0-9]{0,61}[a-z0-9])?$/;
    GCP_RESOURCE_ID = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;
  }
});

// ../../packages/envrun/dist/venueProof.js
function readDaemonId(docker3, label) {
  let res;
  try {
    res = docker3.sync(["info", "--format", "{{.ID}}"], { timeoutMs: PROBE_TIMEOUT_MS });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { id: null, detail: `${label} daemon probe threw: ${msg}` };
  }
  if (res.error) {
    return { id: null, detail: `${label} daemon probe failed: ${res.error.message}` };
  }
  if (res.status !== 0) {
    const tail2 = res.stderr.trim().split("\n").slice(-1)[0] ?? "";
    return { id: null, detail: `${label} daemon probe exited ${String(res.status)}: ${tail2}` };
  }
  const id = res.stdout.trim();
  if (id === "") {
    return { id: null, detail: `${label} daemon reported an empty ID` };
  }
  if (!DAEMON_ID.test(id)) {
    return {
      id: null,
      detail: `${label} daemon returned a non-identity: ${JSON.stringify(id.slice(0, 80))}`
    };
  }
  return { id, detail: `${label} daemon ${id}` };
}
function classifyVenueDaemon(venue, local = localDockerClient()) {
  const v = readDaemonId(venue, "venue");
  const l = readDaemonId(local, "local");
  if (v.id === null || l.id === null) {
    const unread = [v.id === null ? v.detail : null, l.id === null ? l.detail : null].filter((d) => d !== null).join("; ");
    return { distinct: false, reason: "unknown", detail: unread };
  }
  if (v.id === l.id) {
    return {
      distinct: false,
      reason: "same-daemon",
      daemonId: v.id,
      detail: `the venue and this machine are the same Docker daemon (${v.id}), so nothing ran elsewhere`
    };
  }
  return { distinct: true, localDaemonId: l.id, venueDaemonId: v.id };
}
function describeVenueDaemon(verdict) {
  if (verdict.distinct) {
    return `venue daemon ${verdict.venueDaemonId} is a different daemon from this machine's ${verdict.localDaemonId} (which does not by itself establish a different machine)`;
  }
  return `venue daemon not distinct (${verdict.reason}): ${verdict.detail}`;
}
var PROBE_TIMEOUT_MS, DAEMON_ID;
var init_venueProof = __esm({
  "../../packages/envrun/dist/venueProof.js"() {
    "use strict";
    init_dist();
    PROBE_TIMEOUT_MS = 2e4;
    DAEMON_ID = /^[A-Za-z0-9:._-]+$/;
  }
});

// ../../packages/envrun/dist/hostedVenue.js
import { spawn as spawn4, spawnSync as spawnSync6 } from "child_process";
import { chmodSync as chmodSync2, existsSync as existsSync6, mkdtempSync as mkdtempSync2, readFileSync as readFileSync3, rmSync as rmSync3 } from "fs";
import { join as join8 } from "path";
import { tmpdir as tmpdir2 } from "os";
function credentialInGitConfig(text) {
  for (const match of text.matchAll(/\b([a-z][a-z0-9+.-]*):\/\/(\S+)/gi)) {
    const scheme = (match[1] ?? "").toLowerCase();
    const rest = match[2] ?? "";
    const authority = rest.split(/[/?#]/, 1)[0] ?? "";
    const at = authority.lastIndexOf("@");
    if (at >= 0) {
      const overWeb = scheme === "http" || scheme === "https";
      if (overWeb || decodeMaybe(authority.slice(0, at)).includes(":")) {
        return "a credential embedded in a remote URL";
      }
    }
    if (CREDENTIAL_QUERY_PARAM.test(decodeMaybe(rest))) {
      return "a credential in a remote URL query string";
    }
  }
  if (/^[^\n]*\bextraHeader\s*=\s*\S/im.test(text))
    return "a persisted HTTP header";
  if (/^\s*(password|token|secret|apikey|api_key)\s*=\s*\S/im.test(text)) {
    return "a credential in a config value";
  }
  if (/\b(gh[pousr]_[A-Za-z0-9]{16,}|github_pat_[A-Za-z0-9_]{20,})\b/.test(text)) {
    return "a GitHub token";
  }
  return null;
}
function decodeMaybe(url) {
  try {
    return decodeURIComponent(url);
  } catch {
    return UNDECODABLE;
  }
}
function failureSourceOf(err) {
  if (err === null || typeof err !== "object")
    return "venue";
  const source = err.source;
  return source === "ours" ? "ours" : "venue";
}
function venueGcloudEnv(config) {
  return { CLOUDSDK_ACTIVE_CONFIG_NAME: config };
}
function execFailureOf(err, timeoutMs) {
  if (err === void 0)
    return null;
  const code = err.code;
  if (code === "ETIMEDOUT") {
    return { kind: "timeout", message: `killed after ${String(timeoutMs)}ms` };
  }
  return { kind: "spawn", message: `${code ?? "spawn failed"}: ${err.message}` };
}
function childEnv(env) {
  const inherited = { ...process.env };
  for (const name of GCLOUD_PRINCIPAL_OVERRIDES)
    delete inherited[name];
  return { ...inherited, ...env };
}
function execWithSpawnSync(file, args, timeoutMs, env) {
  const res = spawnSync6(file, [...args], {
    encoding: "utf8",
    timeout: timeoutMs,
    env: childEnv(env)
  });
  return {
    ok: res.status === 0,
    stdout: res.stdout ?? "",
    stderr: res.stderr ?? "",
    failure: execFailureOf(res.error, timeoutMs)
  };
}
function pushFailure(timedOut, timeoutMs, spawnFailure) {
  if (timedOut)
    return { kind: "timeout", message: `killed after ${String(timeoutMs)}ms` };
  if (spawnFailure !== null)
    return { kind: "spawn", message: spawnFailure };
  return null;
}
function pushTreeWithTar(from, file, args, timeoutMs, env) {
  return new Promise((settle) => {
    const source = spawn4("tar", ["-C", from, "-cf", "-", "."], {
      stdio: ["ignore", "pipe", "pipe"]
    });
    const sink = spawn4(file, [...args], { stdio: ["pipe", "pipe", "pipe"], env: childEnv(env) });
    let stdout = "";
    let stderr = "";
    let timedOut = false;
    let spawnFailure = null;
    let sourceCode = null;
    let sinkCode = null;
    let sourceDone = false;
    let sinkDone = false;
    source.stderr.setEncoding("utf8");
    sink.stdout.setEncoding("utf8");
    sink.stderr.setEncoding("utf8");
    source.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    sink.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    sink.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    source.stdout.pipe(sink.stdin);
    sink.stdin.on("error", () => {
    });
    const timer = setTimeout(() => {
      timedOut = true;
      source.kill("SIGKILL");
      sink.kill("SIGKILL");
    }, timeoutMs);
    const finish = () => {
      if (!sourceDone || !sinkDone)
        return;
      clearTimeout(timer);
      settle({
        // BOTH exit codes, and `sourceCode === 0` is the half that is easy to
        // drop: a tar that died halfway still writes a well-formed prefix, so
        // the sink untars it, exits 0, and a TRUNCATED tree reads as a staged
        // one. Dropping this conjunct survived the whole suite once.
        ok: !timedOut && spawnFailure === null && sourceCode === 0 && sinkCode === 0,
        stdout,
        stderr: timedOut ? `${stderr}
timed out after ${String(timeoutMs)}ms` : stderr,
        failure: pushFailure(timedOut, timeoutMs, spawnFailure)
      });
    };
    source.on("error", (err) => {
      stderr += `tar: ${err.message}
`;
      spawnFailure ??= `tar: ${err.message}`;
      sourceCode = null;
      sourceDone = true;
      sink.stdin.end();
      finish();
    });
    sink.on("error", (err) => {
      stderr += `${file}: ${err.message}
`;
      spawnFailure ??= `${file}: ${err.message}`;
      sinkCode = null;
      sinkDone = true;
      if (!sourceDone)
        source.kill("SIGTERM");
      finish();
    });
    source.on("close", (code) => {
      if (sourceDone)
        return;
      sourceCode = code;
      sourceDone = true;
      finish();
    });
    sink.on("close", (code) => {
      if (sinkDone)
        return;
      sinkCode = code;
      sinkDone = true;
      if (!sourceDone)
        source.kill("SIGTERM");
      finish();
    });
  });
}
function quoteForRemoteShell(arg) {
  return `'${arg.replace(/'/g, "'\\''")}'`;
}
function iapSshArgv(vm, project, zone, command) {
  return [
    "compute",
    "ssh",
    vm,
    `--project=${project}`,
    `--zone=${zone}`,
    "--tunnel-through-iap",
    "--quiet",
    `--command=${command}`
  ];
}
function iapTunnelArgv(vm, project, zone, socketPath) {
  return [
    "compute",
    "ssh",
    vm,
    `--project=${project}`,
    `--zone=${zone}`,
    "--tunnel-through-iap",
    "--quiet",
    "--",
    "-o",
    "StrictHostKeyChecking=no",
    "-N",
    "-L",
    `${socketPath}:/var/run/docker.sock`
  ];
}
function identityProbeCommand(runId) {
  const url = `${GCE_METADATA_IDENTITY_URL}?audience=${encodeURIComponent(expectedAudience(runId))}&format=full`;
  return `curl -sS -f -m 5 -H ${quoteForRemoteShell("Metadata-Flavor: Google")} ${quoteForRemoteShell(url)} && echo && docker info --format {{.ID}}`;
}
function parseIdentityProbeOutput(stdout) {
  const lines = stdout.split("\n").map((line) => line.trim()).filter((line) => line !== "");
  if (lines.length !== 2)
    return null;
  const token = lines[0];
  const daemonId = lines[1];
  if (token === void 0 || daemonId === void 0)
    return null;
  if (token.length > MAX_TOKEN_LENGTH)
    return null;
  if (!COMPACT_JWT.test(token))
    return null;
  if (!DAEMON_ID.test(daemonId))
    return null;
  return { token, daemonId };
}
function iapUntarArgv(vm, project, zone, dir) {
  return iapSshArgv(vm, project, zone, `tar -C ${quoteForRemoteShell(dir)} -xf -`);
}
function venueStagePaths(stageBase) {
  const scratchRoot = `${stageBase}/scratch`;
  return {
    cloneDir: `${stageBase}/clone`,
    scratchRoot,
    previewDir: `${stageBase}/preview`,
    // UNDER the scratch root, so the tar that pushes the scratch root carries
    // the jail with it — no second transfer, and nothing here writes the jail's
    // contents. `venueJoin` is POSIX whatever this host is: a Windows `join`
    // would emit backslashes and name a directory no Linux venue has.
    //
    // The segments come from `fence.ts` because `buildJail` writes that same
    // tree LOCALLY before `stage()` is called. Two literals would let the tree
    // written and the tree mounted drift, and a bind source nothing wrote is an
    // empty directory Docker creates in silence (TERM-698).
    jail: venueJoin(scratchRoot, JAIL_SEGMENT),
    tmp: venueJoin(scratchRoot, JAIL_TMP_SEGMENT)
  };
}
function venueProxyDir(stageBase) {
  return `${stageBase}/proxy`;
}
function stageMkdirArgv(vm, project, zone, stageBase) {
  const dirs = Object.values(venueStagePaths(stageBase)).map(quoteForRemoteShell);
  return iapSshArgv(vm, project, zone, `mkdir -p ${dirs.join(" ")}`);
}
function iapUntarProxyArgv(vm, project, zone, dir) {
  const d = quoteForRemoteShell(dir);
  return iapSshArgv(vm, project, zone, `mkdir -p ${d} && tar -C ${d} -xf - && chmod 0644 ${d}/*.js && chmod 0755 ${d}`);
}
function lastLineOf(blob) {
  const lines = blob.split("\n").map((line) => line.trim()).filter((line) => line !== "");
  return lines.length === 0 ? "" : lines[lines.length - 1];
}
function classifyProbeFailure(r) {
  const blob = `${r.stdout}
${r.stderr}`;
  if (r.failure?.kind === "timeout") {
    return {
      retryable: true,
      reason: `the probe timed out and told us nothing (${r.failure.message})`
    };
  }
  if (r.failure?.kind === "spawn") {
    return { retryable: false, reason: `could not run the probe \u2014 ${r.failure.message}` };
  }
  if (IAP_DENIED.test(blob)) {
    return { retryable: false, reason: "IAP permission denied" };
  }
  if (SSH_KEY_NOT_READY.test(blob)) {
    return { retryable: true, reason: "the ssh key has not reached the instance yet" };
  }
  if (IAP_NOT_READY.test(blob)) {
    return { retryable: true, reason: "IAP tunnel not established yet" };
  }
  if (IAP_BACKEND_UNREACHABLE.test(blob)) {
    return {
      retryable: true,
      reason: "IAP cannot reach the instance yet (4003) \u2014 if this is still the reason at the end of the budget, the firewall probably does not allow 35.235.240.0/20 on port 22"
    };
  }
  if (DAEMON_NOT_READY.test(blob)) {
    return { retryable: true, reason: "Docker daemon not up yet" };
  }
  if (SSH_NOT_ANSWERING.test(blob)) {
    return { retryable: true, reason: "the instance is not answering ssh yet" };
  }
  if (HOST_KEY_MISMATCH.test(blob)) {
    return {
      retryable: false,
      reason: "the instance's host key does not match the one on record, and waiting cannot fix it"
    };
  }
  if (PREEMPTED.test(blob)) {
    return { retryable: false, reason: "the instance was preempted" };
  }
  if (INSTANCE_NOT_RUNNING.test(blob)) {
    return {
      retryable: false,
      reason: `the instance is not running \u2014 ${lastLineOf(blob).slice(0, 160)}`
    };
  }
  if (TERMINAL_GCP.test(blob)) {
    return { retryable: false, reason: lastLineOf(blob).slice(0, 200) };
  }
  const line = lastLineOf(blob);
  return {
    retryable: true,
    reason: line === "" ? "the probe failed without writing to either stream" : `unrecognised probe failure: ${line.slice(0, 200)}`
  };
}
function assertServiceCredentials(config, io) {
  const env = venueGcloudEnv(config);
  const active = io.exec("gcloud", ["auth", "list", "--filter=status:ACTIVE", "--format=value(account)"], LOCAL_GCLOUD_TIMEOUT_MS, env);
  if (!active.ok) {
    throw new HostedVenueError(`could not read which account the ${config} gcloud configuration acts as, so booting would run as whoever this terminal is signed in as: ${execDetail(active).slice(0, 300)}`, "ours");
  }
  const account = active.stdout.trim();
  if (account === "") {
    throw new HostedVenueError(`the ${config} gcloud configuration has no active account. Activate the service credential first \u2014 docs/runbooks/gcp-tier-1-provisioning.md Step 6.`, "ours");
  }
  if (!account.endsWith(SERVICE_ACCOUNT_SUFFIX)) {
    throw new HostedVenueError(`the ${config} gcloud configuration acts as ${account}, which is a person and not a service account. A dispatched run has nobody at a terminal, so the venue must come up under a credential the service owns \u2014 docs/runbooks/gcp-tier-1-provisioning.md Step 6.`, "ours");
  }
  return account;
}
function resolveServiceAccountKeyFile(opts) {
  const explicit = opts.serviceAccountKeyFile;
  if (explicit !== void 0 && explicit.trim() !== "")
    return explicit;
  const fromEnv = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  return fromEnv === void 0 || fromEnv.trim() === "" ? null : fromEnv;
}
function configurationPresent(config, io) {
  const listed = io.exec("gcloud", ["config", "configurations", "list", "--format=value(name)"], LOCAL_GCLOUD_TIMEOUT_MS, venueGcloudEnv(config));
  if (!listed.ok) {
    throw new HostedVenueError(`could not read the gcloud configuration list, so the ${config} configuration could not be provisioned: ${execDetail(listed).slice(0, 300)}`, "ours");
  }
  return listed.stdout.split("\n").map((line) => line.trim()).includes(config);
}
function redactKeyFile(detail, keyFile) {
  return keyFile === "" ? detail : detail.split(keyFile).join("<key-file>");
}
function ensureVenueServiceCredentials(config, keyFile, io) {
  if (keyFile === null)
    return assertServiceCredentials(config, io);
  if (!configurationPresent(config, io)) {
    const created = io.exec("gcloud", ["config", "configurations", "create", config, "--no-activate"], LOCAL_GCLOUD_TIMEOUT_MS, venueGcloudEnv(config));
    if (!created.ok && !configurationPresent(config, io)) {
      throw new HostedVenueError(`could not create the ${config} gcloud configuration to hold the service credential: ${execDetail(created).slice(0, 300)}`, "ours");
    }
  }
  const activated = io.exec("gcloud", ["auth", "activate-service-account", `--key-file=${keyFile}`], SERVICE_ACCOUNT_ACTIVATE_TIMEOUT_MS, venueGcloudEnv(config));
  if (!activated.ok) {
    throw new HostedVenueError(`could not activate the runner service credential into the ${config} gcloud configuration: ${redactKeyFile(execDetail(activated), keyFile).slice(0, 300)}`, "ours");
  }
  return assertServiceCredentials(config, io);
}
function hostedVenueAvailable(opts = {}, io = defaultHostedVenueIo) {
  const project = opts.project ?? DEFAULT_GCP_PROJECT;
  const config = opts.gcloudConfig ?? VENUE_GCLOUD_CONFIG;
  const env = venueGcloudEnv(config);
  try {
    assertServiceCredentials(config, io);
  } catch {
    return false;
  }
  const iap = io.exec("gcloud", [
    "services",
    "list",
    "--enabled",
    `--project=${project}`,
    "--filter=name:iap.googleapis.com",
    "--format=value(config.name)"
  ], 2e4, env);
  if (!iap.ok || !iap.stdout.includes("iap.googleapis.com"))
    return false;
  const fw = io.exec("gcloud", [
    "compute",
    "firewall-rules",
    "list",
    `--project=${project}`,
    "--format=value(sourceRanges.list())"
  ], 2e4, env);
  return fw.ok && fw.stdout.includes("35.235.240.0/20");
}
function execDetail(res) {
  const said = res.stderr.trim() === "" ? res.stdout.trim() : res.stderr.trim();
  if (res.failure === null)
    return said === "" ? "it said nothing" : said;
  return said === "" ? res.failure.message : `${res.failure.message}: ${said}`;
}
function classifyBootFailure(res) {
  const said = `${res.stdout}
${res.stderr}`;
  const detail = execDetail(res);
  if (res.failure?.kind === "spawn") {
    return {
      source: "ours",
      created: "none",
      reason: `gcloud never ran here, so nothing reached GCE \u2014 ${res.failure.message}`
    };
  }
  if (res.failure?.kind === "timeout") {
    return {
      source: "ours",
      created: "unknown",
      reason: `the create was killed on this machine before GCE answered, so whether an instance exists is unknown \u2014 ${res.failure.message}`
    };
  }
  if (/ZONE_RESOURCE_POOL_EXHAUSTED/.test(said)) {
    return {
      source: "ours",
      created: "none",
      reason: `the zone had no spare capacity, so no venue was ever created \u2014 ${detail}`
    };
  }
  if (/QUOTA_EXCEEDED/.test(said) || /Quota '[A-Z_]+' exceeded/.test(said)) {
    return {
      source: "ours",
      created: "none",
      reason: `the project's quota refused the instance before it existed \u2014 ${detail}`
    };
  }
  if (/PERMISSION_DENIED/.test(said) || /Required '[a-z.]+' permission/.test(said)) {
    return {
      source: "ours",
      created: "none",
      reason: `GCE refused the create for this credential, so no venue was started \u2014 ${detail}`
    };
  }
  return { source: "venue", created: "unknown", reason: detail };
}
function deleteFoundNothing(res, vm) {
  if (res.ok || res.failure !== null)
    return false;
  const named = /The resource '([^']+)' was not found/.exec(`${res.stdout}
${res.stderr}`);
  return named !== null && named[1].endsWith(`/instances/${vm}`);
}
function manualDeleteCommand(vm, project, zone) {
  return `gcloud compute instances delete ${vm} --project=${project} --zone=${zone} --quiet`;
}
function hostedVenue(opts = {}, io = defaultHostedVenueIo) {
  const project = opts.project ?? DEFAULT_GCP_PROJECT;
  const zone = opts.zone ?? DEFAULT_GCP_ZONE;
  const gcloudConfig = opts.gcloudConfig ?? VENUE_GCLOUD_CONFIG;
  const keyFile = resolveServiceAccountKeyFile(opts);
  const env = venueGcloudEnv(gcloudConfig);
  return {
    kind: "hosted-pool",
    acquire: (runId) => acquireTransactionally(async (allocated) => {
      const vm = venueInstanceName(runId);
      const stageBase = `/tmp/th-stage-${runId}`;
      const bootArgv = gcpBootArgv({
        vmName: vm,
        project,
        zone,
        runId,
        machineType: opts.machineType ?? DEFAULT_GCP_MACHINE_TYPE
      });
      ensureVenueServiceCredentials(gcloudConfig, keyFile, io);
      const boot = io.exec("gcloud", bootArgv, BOOT_TIMEOUT_MS, env);
      let instanceState = "unknown";
      allocated.onRollback(() => {
        const del = io.exec("gcloud", gcpDeleteArgv({ vmName: vm, project, zone }), DELETE_TIMEOUT_MS, env);
        const foundNothing = deleteFoundNothing(del, vm);
        if (!del.ok && !(foundNothing && instanceState !== "unknown")) {
          throw new HostedVenueError(foundNothing ? `${vm} was not found when we tried to delete it, but the create never answered \u2014 so it may yet appear and bill until its --max-run-duration expires. Check, and remove it if it is there: ${manualDeleteCommand(vm, project, zone)}` : `${vm} may still exist and is still billing: ${execDetail(del).slice(0, 300)} \u2014 to remove it now: ` + manualDeleteCommand(vm, project, zone));
        }
      });
      if (!boot.ok) {
        const verdict2 = classifyBootFailure(boot);
        instanceState = verdict2.created;
        throw new HostedVenueError(`could not boot ${vm}: ${verdict2.reason.slice(0, 400)}`, verdict2.source);
      }
      instanceState = "exists";
      const deadline = io.now() + SSH_READY_BUDGET_MS;
      let last = { retryable: true, reason: "no probe ran" };
      let identity = null;
      while (io.now() < deadline) {
        const probe = io.exec("gcloud", iapSshArgv(vm, project, zone, identityProbeCommand(runId)), SSH_PROBE_TIMEOUT_MS, env);
        if (probe.ok) {
          identity = parseIdentityProbeOutput(probe.stdout);
          if (identity !== null)
            break;
          last = { retryable: true, reason: "probe answered without token + daemon id" };
        } else {
          last = classifyProbeFailure(probe);
          if (!last.retryable) {
            throw new HostedVenueError(`${vm} cannot be reached over IAP and waiting will not change that \u2014 ${last.reason}`);
          }
        }
        await io.sleep(SSH_PROBE_INTERVAL_MS);
      }
      if (identity === null) {
        throw new HostedVenueError(`${vm} was not reachable over IAP within ${SSH_READY_BUDGET_MS / 1e3}s \u2014 last reason: ${last.reason}`);
      }
      let jwks;
      try {
        jwks = await io.fetchJwks();
      } catch (err) {
        throw new HostedVenueError(`could not reach Google's JWKS to check ${vm}'s identity token \u2014 ${describeErr(err)}`, "ours", { cause: err });
      }
      const identityVerdict = await verifyGceIdentityToken(identity.token, {
        audience: expectedAudience(runId),
        serviceAccountEmail: venueIdentityEmail(project),
        projectId: project,
        instanceName: vm,
        // The exact boot zone, a singleton — "the booted instance", not
        // "a pool VM of the right name" (the expectations docblock's own
        // distinction). No instanceId: this boot path never reads the
        // create call's output, so there is no token-independent id to
        // expect; the token's own id is recorded on the lease instead.
        allowedZones: [zone]
      }, { fetchJwks: () => Promise.resolve(jwks), now: io.now() });
      if (!identityVerdict.ok) {
        throw new HostedVenueError(`${vm} presented an identity token this lease refuses (${identityVerdict.reason}): ${identityVerdict.detail}`);
      }
      const venueIdentity = {
        token: identity.token,
        claims: identityVerdict.value
      };
      let socketDir;
      try {
        socketDir = io.makePrivateDir();
      } catch (err) {
        throw new HostedVenueError(`could not create a private directory for ${vm}'s docker socket, and binding it somewhere shared would let any local process answer for the venue: ${describeErr(err)}`, "ours");
      }
      allocated.onRollback(() => {
        try {
          io.removeTree(socketDir);
        } catch (err) {
          throw new HostedVenueError(`the tunnel socket directory ${socketDir} could not be removed and is left behind: ${describeErr(err)}`);
        }
      });
      const socketPath = join8(socketDir, VENUE_SOCKET_NAME);
      if (io.exists(socketPath)) {
        throw new HostedVenueError(`something already exists at ${socketPath}, inside a directory created seconds ago for this run alone. Refusing rather than clearing it: the tunnel would carry the whole run over a path we cannot account for`, "ours");
      }
      const tunnel = io.spawnTunnel("gcloud", iapTunnelArgv(vm, project, zone, socketPath), env);
      allocated.onRollback(() => {
        try {
          tunnel.kill("SIGTERM");
        } catch {
        }
      });
      const tunnelDeadline = io.now() + TUNNEL_BUDGET_MS;
      while (io.now() < tunnelDeadline && !io.exists(socketPath) && tunnel.failure() === null) {
        await io.sleep(TUNNEL_POLL_INTERVAL_MS);
      }
      const tunnelFailure = tunnel.failure();
      if (tunnelFailure !== null) {
        throw new HostedVenueError(`the docker socket tunnel to ${vm} could not be started \u2014 ${tunnelFailure}`);
      }
      if (!io.exists(socketPath)) {
        throw new HostedVenueError(`the docker socket tunnel to ${vm} never appeared at ${socketPath} within ${String(TUNNEL_BUDGET_MS / 1e3)}s`);
      }
      const docker3 = io.dockerFor(socketPath);
      const verdict = io.classifyDaemon(docker3);
      if (!verdict.distinct) {
        throw new HostedVenueError(`refusing to hand out a hosted lease: ${describeVenueDaemon(verdict)}`);
      }
      if (verdict.venueDaemonId !== identity.daemonId) {
        throw new HostedVenueError(`refusing to hand out a hosted lease: the tunnel answers as daemon ${verdict.venueDaemonId}, but ${vm}'s identity probe reported ${identity.daemonId} from its own socket`);
      }
      const venueDaemonId = verdict.venueDaemonId;
      const prepared = io.exec("gcloud", stageMkdirArgv(vm, project, zone, stageBase), MKDIR_TIMEOUT_MS, env);
      if (!prepared.ok) {
        throw new HostedVenueError(`could not prepare the stage on ${vm}: ${execDetail(prepared).slice(0, 300)}`);
      }
      return makeLease({
        runId,
        vm,
        project,
        zone,
        stageBase,
        docker: docker3,
        tunnel,
        socketDir,
        socketPath,
        venueDaemonId,
        venueIdentity,
        env,
        io
      });
    })
  };
}
function describeErr(err) {
  return err instanceof Error ? err.message : String(err);
}
function assertVenueUnchanged(p, doing) {
  const failure = p.tunnel.failure();
  if (failure !== null) {
    throw new HostedVenueError(`the tunnel carrying ${p.vm}'s docker socket is gone, so ${doing} would go to whatever now answers at ${p.socketPath} \u2014 ${failure}`);
  }
  const verdict = p.io.classifyDaemon(p.docker);
  if (!verdict.distinct) {
    throw new HostedVenueError(`refusing ${doing}: ${p.socketPath} no longer answers as the venue daemon this lease acquired \u2014 ${describeVenueDaemon(verdict)}`);
  }
  if (verdict.venueDaemonId !== p.venueDaemonId) {
    throw new HostedVenueError(`refusing ${doing}: ${p.socketPath} now answers as daemon ${verdict.venueDaemonId}, not the ${p.venueDaemonId} this lease acquired`);
  }
}
function guardedContainment(inner, check) {
  return {
    kind: inner.kind,
    available: () => inner.available(),
    run: async (spec, env, opts) => {
      check(`the ${spec.profile} step`);
      const res = await inner.run(spec, env, opts);
      check(`reporting the ${spec.profile} step`);
      return res;
    }
  };
}
function makeLease(p) {
  let released = false;
  let tunnelClosed = false;
  const check = (doing) => {
    assertVenueUnchanged(p, doing);
  };
  const containment = guardedContainment(p.io.containmentOn(p.docker), check);
  const closeTunnel = () => {
    if (tunnelClosed)
      return null;
    const failures = [];
    try {
      p.tunnel.kill("SIGTERM");
    } catch (err) {
      failures.push(`the tunnel process could not be signalled: ${describeErr(err)}`);
    }
    try {
      p.io.removeTree(p.socketDir);
    } catch (err) {
      failures.push(`the tunnel socket directory ${p.socketDir} could not be removed and is left behind: ${describeErr(err)}`);
    }
    if (failures.length > 0)
      return failures.join("; ");
    tunnelClosed = true;
    return null;
  };
  let stagedOwner;
  const readStagedOwner = () => {
    const res = p.io.exec(
      "gcloud",
      iapSshArgv(p.vm, p.project, p.zone, "id -u && id -g"),
      OWNER_PROBE_TIMEOUT_MS,
      // `p.env`, like every other gcloud call here. TERM-724 made the venue boot under the
      // SERVICE configuration rather than whoever is at the terminal, and a probe that
      // omitted this would ssh under the person's own credential — then report an owner
      // measured against a session the run does not use.
      p.env
    );
    if (!res.ok) {
      throw new HostedVenueError(`could not read the staged tree's owner on ${p.vm}: ${execDetail(res).slice(0, 300)}. Refusing rather than falling back to this machine\u2019s uid, which would hand the guest an id with no write access to its own clone.`);
    }
    const lines = res.stdout.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
    const ids2 = lines.slice(-2).map((l) => Number(l));
    if (ids2.length !== 2 || !ids2.every((n) => Number.isInteger(n) && n > 0)) {
      throw new HostedVenueError(`the venue ${p.vm} answered 'id -u && id -g' with ${JSON.stringify(res.stdout.slice(0, 120))}, which is not a uid/gid pair. Refusing rather than guessing an owner.`);
    }
    return { uid: ids2[0], gid: ids2[1] };
  };
  stagedOwner = readStagedOwner();
  return {
    kind: "hosted-pool",
    runId: p.runId,
    containment,
    // RAW, for the reason above this function. Handing out a client whose
    // `sync` can throw would put the contract break in the one place we cannot
    // see the call sites at all.
    docker: p.docker,
    // Every path `stage()` returns is on the instance, not here. Declaring it
    // is what stops `canonical()` resolving a venue path against this machine —
    // and `assertDomainDeclared` refuses a spec that omits it on a redirected
    // client, so forgetting this is loud rather than silent.
    pathDomain: "venue",
    // Beside `pathDomain` because it answers the same question about the same
    // machine: that one says WHOSE filesystem, this one says WHOSE account.
    get guestUser() {
      return stagedOwner;
    },
    // Verified at acquire, before anything was staged; carried so the caller
    // can hand PR 5's intake the evidence. The lease is the only holder of
    // the raw token — `VenueLease.venueIdentity` says why it is not a result
    // field.
    venueIdentity: p.venueIdentity,
    get released() {
      return released;
    },
    async stageProxyCode() {
      check("staging the egress proxy");
      const dir = venueProxyDir(p.stageBase);
      const buffer = stageProxyCode();
      try {
        const res = await p.io.pushTree(buffer.dir, "gcloud", iapUntarProxyArgv(p.vm, p.project, p.zone, dir), STAGE_PUSH_TIMEOUT_MS, p.env);
        if (!res.ok) {
          throw new HostedVenueError(`could not stage the egress proxy onto ${p.vm}: ${execDetail(res).slice(0, 300)}`);
        }
      } finally {
        buffer.cleanup();
      }
      return {
        dir,
        cleanup: () => {
          p.io.exec("gcloud", iapSshArgv(p.vm, p.project, p.zone, `rm -rf ${quoteForRemoteShell(dir)}`), PROXY_CLEANUP_TIMEOUT_MS, p.env);
        }
      };
    },
    async stage(local) {
      check("staging the tree");
      const paths = venueStagePaths(p.stageBase);
      const push = async (from, to) => {
        const res = await p.io.pushTree(from, "gcloud", iapUntarArgv(p.vm, p.project, p.zone, to), STAGE_PUSH_TIMEOUT_MS, p.env);
        if (!res.ok) {
          throw new HostedVenueError(`could not stage ${from} onto ${p.vm}: ${execDetail(res).slice(0, 300)}`);
        }
      };
      const { jail: localJail, tmp: localTmp } = localJailPaths(local.scratchRoot);
      const required = [
        localTmp,
        join8(localJail, JAIL_PASSWD_FILE),
        join8(localJail, JAIL_GROUP_FILE)
      ];
      const missing = required.filter((path) => !p.io.exists(path));
      if (missing.length > 0) {
        throw new HostedVenueError(`refusing to stage ${local.scratchRoot} onto ${p.vm}: the jail at ${localJail} is incomplete \u2014 missing ${missing.join(", ")}. buildJail must run to completion before stage(), or the venue mounts a directory with no identity database.`);
      }
      const gitConfigPath = join8(local.cloneDir, ".git", "config");
      let gitConfig;
      try {
        gitConfig = p.io.readTextIfPresent(gitConfigPath);
      } catch (err) {
        throw new HostedVenueError(
          `refusing to stage ${local.cloneDir} onto ${p.vm}: ${gitConfigPath} exists but could not be read, so it cannot be screened for a credential, and the whole tree is mounted where the repo\u2019s own test command runs.`,
          // `'ours'` and not the default `'venue'`: the venue is fine, we cannot read a file
          // on this side. The acceptance harness's scheme exists to keep "the venue failed"
          // apart from "we could not look" (TERM-710).
          "ours",
          { cause: err }
        );
      }
      const carried = gitConfig === null ? null : credentialInGitConfig(gitConfig);
      if (carried !== null) {
        throw new HostedVenueError(`refusing to stage ${local.cloneDir} onto ${p.vm}: its .git/config carries ${carried}, and the whole tree is mounted where the repo\u2019s own test command runs. Fetch with the credential out of band (http.extraHeader or GIT_ASKPASS) so it is never written to disk.`);
      }
      await push(local.cloneDir, paths.cloneDir);
      await push(local.scratchRoot, paths.scratchRoot);
      return paths;
    },
    census(label) {
      const nothingSeen = { containers: [], volumes: [], networks: [] };
      if (released) {
        return Promise.resolve({
          observed: false,
          census: nothingSeen,
          unobservedReason: "the lease was already released"
        });
      }
      try {
        check("counting what the run left behind");
        return Promise.resolve({
          observed: true,
          census: census(p.docker, label),
          unobservedReason: null
        });
      } catch (err) {
        return Promise.resolve({
          observed: false,
          census: nothingSeen,
          unobservedReason: err instanceof Error ? err.message : String(err)
        });
      }
    },
    publishPreview(_req) {
      return Promise.reject(new HostedVenueError("a venue-hosted preview needs its own ingress (design \xA76 item 7) and does not exist yet"));
    },
    release() {
      const tunnelResidue = closeTunnel();
      if (released) {
        return Promise.resolve({
          kind: "hosted-pool",
          released: false,
          alreadyReleased: true,
          error: tunnelResidue,
          detail: tunnelResidue === null ? `${p.vm} was already released` : `${p.vm} was already released, but ${tunnelResidue}`
        });
      }
      const del = p.io.exec("gcloud", gcpDeleteArgv({ vmName: p.vm, project: p.project, zone: p.zone }), DELETE_TIMEOUT_MS, p.env);
      if (!del.ok && deleteFoundNothing(del, p.vm)) {
        released = true;
        return Promise.resolve({
          kind: "hosted-pool",
          released: true,
          alreadyReleased: false,
          error: tunnelResidue,
          detail: `${p.vm} is already gone \u2014 GCE reports no such instance, so something removed it first (the hard --max-run-duration is the likely one). Nothing is billing` + (tunnelResidue === null ? "" : `, but ${tunnelResidue}`)
        });
      }
      if (!del.ok) {
        const deleteError = execDetail(del).slice(0, 300);
        return Promise.resolve({
          kind: "hosted-pool",
          released: false,
          alreadyReleased: false,
          // BOTH failures, never the delete alone. They are independent pieces
          // of residue and a report that names one of them lets the other pass
          // for cleaned up.
          error: tunnelResidue === null ? deleteError : `${deleteError}; ${tunnelResidue}`,
          detail: `${p.vm} may still exist and is still billing. Releasing again will retry the delete. It carries a hard --max-run-duration, so the platform deletes it within the hour even if nothing else does. To remove it now: ` + manualDeleteCommand(p.vm, p.project, p.zone)
        });
      }
      released = true;
      return Promise.resolve({
        kind: "hosted-pool",
        released: true,
        alreadyReleased: false,
        error: tunnelResidue,
        detail: tunnelResidue === null ? `deleted ${p.vm}` : `deleted ${p.vm}, but ${tunnelResidue}`
      });
    }
  };
}
var SSH_READY_BUDGET_MS, SSH_PROBE_INTERVAL_MS, SSH_PROBE_TIMEOUT_MS, TUNNEL_BUDGET_MS, TUNNEL_POLL_INTERVAL_MS, GOOGLE_JWKS_URL, JWKS_FETCH_TIMEOUT_MS, CREDENTIAL_QUERY_PARAM, UNDECODABLE, STAGE_PUSH_TIMEOUT_MS, PROXY_CLEANUP_TIMEOUT_MS, OWNER_PROBE_TIMEOUT_MS, BOOT_TIMEOUT_MS, MKDIR_TIMEOUT_MS, DELETE_TIMEOUT_MS, LOCAL_GCLOUD_TIMEOUT_MS, SERVICE_ACCOUNT_ACTIVATE_TIMEOUT_MS, SOCKET_DIR_PREFIX, VENUE_SOCKET_NAME, HostedVenueError, VENUE_GCLOUD_CONFIG, SERVICE_ACCOUNT_SUFFIX, GCLOUD_PRINCIPAL_OVERRIDES, defaultHostedVenueIo, GCE_METADATA_IDENTITY_URL, COMPACT_JWT, IAP_NOT_READY, IAP_BACKEND_UNREACHABLE, IAP_DENIED, TERMINAL_GCP, INSTANCE_NOT_RUNNING, PREEMPTED, HOST_KEY_MISMATCH, SSH_KEY_NOT_READY, DAEMON_NOT_READY, SSH_NOT_ANSWERING;
var init_hostedVenue = __esm({
  "../../packages/envrun/dist/hostedVenue.js"() {
    "use strict";
    init_dist();
    init_dist2();
    init_gcpPlacement();
    init_execute();
    init_labels();
    init_venueProof();
    init_venue();
    SSH_READY_BUDGET_MS = 18e4;
    SSH_PROBE_INTERVAL_MS = 5e3;
    SSH_PROBE_TIMEOUT_MS = 25e3;
    TUNNEL_BUDGET_MS = 6e4;
    TUNNEL_POLL_INTERVAL_MS = 500;
    GOOGLE_JWKS_URL = "https://www.googleapis.com/oauth2/v3/certs";
    JWKS_FETCH_TIMEOUT_MS = 1e4;
    CREDENTIAL_QUERY_PARAM = /[?&][^=&\s]*(token|secret|password|passwd|api[-_]?key|signature|sig|auth|credential)[^=&\s]*=[^\s&]/i;
    UNDECODABLE = "?token=this:url-could-not-be-decoded-so-it-is-refused";
    STAGE_PUSH_TIMEOUT_MS = 3e5;
    PROXY_CLEANUP_TIMEOUT_MS = 3e4;
    OWNER_PROBE_TIMEOUT_MS = 3e4;
    BOOT_TIMEOUT_MS = 18e4;
    MKDIR_TIMEOUT_MS = 6e4;
    DELETE_TIMEOUT_MS = 3e5;
    LOCAL_GCLOUD_TIMEOUT_MS = 2e4;
    SERVICE_ACCOUNT_ACTIVATE_TIMEOUT_MS = 3e4;
    SOCKET_DIR_PREFIX = "th-venue-";
    VENUE_SOCKET_NAME = "docker.sock";
    HostedVenueError = class extends RunRefusalError {
      source;
      constructor(message, source = "venue", options) {
        super(message, options);
        this.name = "HostedVenueError";
        this.source = source;
      }
    };
    VENUE_GCLOUD_CONFIG = "pool-runner";
    SERVICE_ACCOUNT_SUFFIX = ".iam.gserviceaccount.com";
    GCLOUD_PRINCIPAL_OVERRIDES = [
      "CLOUDSDK_AUTH_ACCESS_TOKEN_FILE",
      "CLOUDSDK_AUTH_IMPERSONATE_SERVICE_ACCOUNT",
      "CLOUDSDK_CORE_ACCOUNT"
    ];
    defaultHostedVenueIo = {
      exec: execWithSpawnSync,
      pushTree: pushTreeWithTar,
      readTextIfPresent: (path) => {
        try {
          return readFileSync3(path, "utf8");
        } catch (err) {
          if (err.code === "ENOENT")
            return null;
          throw err;
        }
      },
      spawnTunnel: (file, args, env) => {
        const child = spawn4(file, [...args], {
          stdio: ["ignore", "ignore", "ignore"],
          env: childEnv(env)
        });
        let failure = null;
        let killed = false;
        child.on("error", (err) => {
          failure ??= `${file}: ${err.message}`;
        });
        child.on("exit", (code, signal) => {
          if (killed)
            return;
          failure ??= `${file} exited early (code ${String(code)}, signal ${String(signal)})`;
        });
        return {
          kill: (signal) => {
            killed = true;
            child.kill(signal);
          },
          failure: () => failure
        };
      },
      sleep: (ms) => new Promise((r) => setTimeout(r, ms)),
      now: () => Date.now(),
      exists: (path) => existsSync6(path),
      makePrivateDir: () => {
        const dir = mkdtempSync2(join8(tmpdir2(), SOCKET_DIR_PREFIX));
        chmodSync2(dir, 448);
        return dir;
      },
      removeTree: (path) => {
        rmSync3(path, { recursive: true, force: true });
      },
      dockerFor: (socketPath) => remoteDockerClient(`unix://${socketPath}`),
      classifyDaemon: (docker3) => classifyVenueDaemon(docker3),
      containmentOn: (docker3) => containerContainmentOn(docker3),
      fetchJwks: async () => {
        const res = await globalThis.fetch(GOOGLE_JWKS_URL, {
          signal: AbortSignal.timeout(JWKS_FETCH_TIMEOUT_MS)
        });
        if (!res.ok) {
          throw new Error(`JWKS fetch returned HTTP ${String(res.status)}`);
        }
        const body = await res.json();
        if (typeof body !== "object" || body === null || !Array.isArray(body.keys)) {
          throw new Error("JWKS fetch returned a body with no keys array");
        }
        return body;
      }
    };
    GCE_METADATA_IDENTITY_URL = "http://169.254.169.254/computeMetadata/v1/instance/service-accounts/default/identity";
    COMPACT_JWT = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;
    IAP_NOT_READY = /\b4047\s*[:\]]/;
    IAP_BACKEND_UNREACHABLE = /\b4003\s*[:\]]/;
    IAP_DENIED = /PERMISSION_DENIED|Required '[^']+' permission/;
    TERMINAL_GCP = /QUOTA_EXCEEDED|RESOURCE_EXHAUSTED|quota exceeded|ZONE_RESOURCE_POOL_EXHAUSTED|does not have enough resources available to fulfill the request|PROJECT_NOT_FOUND|Failed to find project|The resource '[^']+' was not found|invalid_grant|Reauthentication (?:required|failed)|You do not currently have an active account/i;
    INSTANCE_NOT_RUNNING = /\bstatus:\s*(?:TERMINATED|STOPPING|STOPPED|SUSPENDED|SUSPENDING)\b|\bInstance\b[^\n]{0,200}\bis not running\b/i;
    PREEMPTED = /\bpreempted\b/i;
    HOST_KEY_MISMATCH = /Host key verification failed|REMOTE HOST IDENTIFICATION HAS CHANGED|POSSIBLE DNS SPOOFING DETECTED/;
    SSH_KEY_NOT_READY = /Permission denied \(publickey/;
    DAEMON_NOT_READY = /Cannot connect to the Docker daemon/;
    SSH_NOT_ANSWERING = /Connection refused|Connection reset|Connection closed by|kex_exchange_identification|Operation timed out/;
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
        // NOT `go mod download all`, and the reason is the egress allowlist
        // rather than correctness (TERM-643). `all` widens the module graph to
        // test-only dependencies of dependencies, and some of those zips are
        // served by a redirect to `storage.googleapis.com`, which the install
        // allowlist does not carry. Measured on Boeing/config-file-validator:
        // `all` failed the install outright with `Forbidden` on that host, while
        // the bare form fetches everything `go test ./...` needs once the module
        // cache actually survives into the test step. Reaching for `all` here
        // buys a broader graph at the price of granting every GCS bucket.
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
import { readdirSync as readdirSync2, readFileSync as readFileSync4, statSync as statSync2 } from "fs";
import { join as join9, relative, sep } from "path";
function createRepoReader(repoPath) {
  const resolveIn = (relativePath) => relativePath === "" ? repoPath : join9(repoPath, relativePath);
  const toPosix = (absolute) => relative(repoPath, absolute).split(sep).join("/");
  const readText = (relativePath) => {
    try {
      return readFileSync4(resolveIn(relativePath), "utf8");
    } catch {
      return null;
    }
  };
  const statOf = (relativePath) => {
    try {
      return statSync2(resolveIn(relativePath));
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
        names = readdirSync2(dir);
      } catch {
        return;
      }
      for (const name of names.slice().sort()) {
        if (SKIP_DIRECTORIES.has(name))
          continue;
        const child = join9(dir, name);
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
        return readdirSync2(resolveIn(relativeDir)).slice().sort();
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
import { execFileSync, spawnSync as spawnSync7 } from "child_process";
import { existsSync as existsSync7, mkdirSync as mkdirSync5, mkdtempSync as mkdtempSync3, rmSync as rmSync4 } from "fs";
import { randomUUID as randomUUID2 } from "crypto";
import { devNull, tmpdir as tmpdir3 } from "os";
import { join as join10 } from "path";
function git(repoDir, args, allowNonZero = false) {
  const res = spawnSync7("git", [...args], {
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
  if (!existsSync7(join10(repoDir, ".git"))) {
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
function isLocalPath(p) {
  return !UNC_PATH.test(p) && (p.startsWith("/") || WINDOWS_ABSOLUTE.test(p));
}
function refuseTransport(scheme) {
  throw new ThRunError(`refusing a target whose transport (${scheme ?? "no recognised scheme"}) is not one this runner clones from. ${TRANSPORT_REASON}`);
}
function separatorInTarget(url) {
  const describe = (ch, index, what) => ({
    what,
    codePoint: (ch.codePointAt(0) ?? 0).toString(16).toUpperCase().padStart(4, "0"),
    index
  });
  const cc = /[\p{Cc}\p{Cf}]/u.exec(url);
  if (cc !== null) {
    const ch = cc[0] ?? "";
    return describe(ch, cc.index, new RegExp("\\p{Cf}", "u").test(ch) ? "an invisible formatting character" : "a control character");
  }
  const SCHEME = /[A-Za-z][A-Za-z0-9+.-]*:\/\//g;
  const schemes = [...url.matchAll(SCHEME)];
  if (schemes.length > 1) {
    const second = schemes[1];
    return describe(url[second?.index ?? 0] ?? "", second?.index ?? 0, "a second URL");
  }
  const opensWithScheme = /^[A-Za-z][A-Za-z0-9+.-]*:\/\//.test(url);
  if (schemes.length === 1 && !opensWithScheme) {
    const at = schemes[0]?.index ?? 0;
    return describe(url[at] ?? "", at, "a URL embedded in a value that does not begin with one");
  }
  const isRemote = opensWithScheme ? !/^file:\/\//i.test(url) : (
    // scp-style `host:path`: a colon before any slash, no backslash anywhere, and not a
    // Windows drive. Anything else scheme-less is a path.
    /^[^/\\]+:[^\\]*$/.test(url) && !/^[A-Za-z]:/.test(url)
  );
  if (isRemote) {
    const chars = [...url];
    const offending = chars.findIndex((ch) => !/[A-Za-z0-9\-._~:/?#[\]@!$&'()*+,;=%]/.test(ch));
    if (offending >= 0) {
      const ch = chars[offending] ?? "";
      return describe(ch, offending, ch === " " ? "whitespace" : "a character no URL may contain");
    }
    return null;
  }
  const blank = /[\p{Zl}\p{Zp}]|(?![ ])[\p{Zs}]/u.exec(url);
  if (blank !== null)
    return describe(blank[0] ?? "", blank.index, "whitespace");
  return null;
}
function assertSafeTargetUrl(url) {
  if (url.startsWith("-")) {
    throw new ThRunError(`refusing a target beginning with "-": git reads it as an option, not a URL, which is the same class of hole as a transport helper. ${TRANSPORT_REASON}`);
  }
  const beforeFirstSlash = url.split("/", 1)[0] ?? "";
  if (beforeFirstSlash.includes("::")) {
    const scheme2 = beforeFirstSlash.slice(0, beforeFirstSlash.indexOf("::"));
    throw new ThRunError(`refusing a target that names the "${scheme2}::" transport helper. ${TRANSPORT_REASON}`);
  }
  const offender = separatorInTarget(url);
  if (offender !== null) {
    throw new ThRunError(`refusing a target containing ${offender.what} (U+${offender.codePoint} at index ${String(offender.index)}): git takes a single value here, and one that carries a second target is judged only up to the join while being printed whole. The position is named and the value is not, because what follows it is exactly where a credential would sit.`);
  }
  if (url.startsWith("file:///")) {
    let decoded;
    try {
      decoded = decodeURIComponent(url.slice("file://".length));
    } catch {
      refuseTransport("file");
    }
    if (!isLocalPath(decoded))
      refuseTransport("file");
    return;
  }
  if (isLocalPath(url))
    return;
  const scheme = URL_SCHEME.exec(url)?.[1];
  if (scheme !== void 0 && ALLOWED_URL_SCHEMES.has(scheme))
    return;
  if (scheme === void 0 && SCP_STYLE.test(url))
    return;
  refuseTransport(scheme);
}
function assertSafeTargetSha(sha) {
  if (FULL_SHA.test(sha))
    return;
  if (sha.startsWith("-")) {
    throw new ThRunError(`refusing a target commit beginning with "-". ${SHA_REASON}`);
  }
  throw new ThRunError(`refusing a target commit that is not 40 lowercase hex characters (got ${String(sha.length)}). The run binds its result to one commit, so a value git might resolve to something else \u2014 or read as an option \u2014 has no place here. ${SHA_REASON}`);
}
function endOfOptionsUnsupported(stderr) {
  return /unknown option[^\n]*end-of-options/i.test(stderr);
}
function gitCloneEnv(auth) {
  const env = {};
  for (const name of GIT_ENV_ALLOWLIST) {
    const value = process.env[name];
    if (value !== void 0)
      env[name] = value;
  }
  env["GIT_CONFIG_GLOBAL"] = devNull;
  env["GIT_CONFIG_SYSTEM"] = devNull;
  env["GIT_CONFIG_NOSYSTEM"] = "1";
  env["GIT_TERMINAL_PROMPT"] = "0";
  for (const name of ["HOME", "USERPROFILE", "HOMEDRIVE", "HOMEPATH"]) {
    env[name] = credentialFreeHome();
  }
  env["GIT_SSH_COMMAND"] = `ssh ${SSH_ISOLATION_ARGS.join(" ")}`;
  if (auth !== void 0) {
    env["GIT_CONFIG_COUNT"] = "1";
    env["GIT_CONFIG_KEY_0"] = "http.extraHeader";
    env["GIT_CONFIG_VALUE_0"] = auth.header;
  }
  return env;
}
function credentialFreeHome() {
  if (credentialFreeHomeDir !== void 0)
    return credentialFreeHomeDir;
  let made;
  try {
    made = mkdtempSync3(join10(tmpdir3(), "th-run-nohome-"));
  } catch (err) {
    throw new RunRefusalError("could not create the empty directory this clone uses as its home, so the clone would read the credentials on this machine instead. That is our environment failing, not your tests: check that the temp directory is writable.", { cause: err });
  }
  credentialFreeHomeDir = made;
  process.once("exit", () => {
    try {
      rmSync4(made, { recursive: true, force: true });
    } catch {
    }
  });
  return made;
}
function gitConfigArgs() {
  return ["-c", "credential.helper="];
}
function refuseSshTransport(url) {
  const scheme = URL_SCHEME.exec(url)?.[1]?.toLowerCase();
  const isSsh = scheme === "ssh" || scheme === void 0 && SCP_STYLE.test(url);
  if (!isSsh)
    return;
  throw new RunRefusalError("refusing an ssh target: this clone runs with no credential of yours, and an ssh host authenticates the client before it serves anything \u2014 including a public repository. Use the https URL for the same repo; a private one is reached with a credential this runner is handed deliberately. We refuse rather than let the fetch fail and read as your own tests failing.");
}
function cloneTargetAt(opts) {
  try {
    return cloneTargetAtUnguarded(opts);
  } catch (err) {
    throw redactTarget(err, opts.url, opts.cacheDir);
  }
}
function redactTarget(err, ...targets) {
  if (!(err instanceof Error))
    return err;
  const spellings = /* @__PURE__ */ new Set();
  const unscheme = (s) => s.replace(/^[A-Za-z][A-Za-z0-9+.-]*:\/\//, "");
  for (const t of targets) {
    if (t === void 0 || t === "")
      continue;
    const decodings = [t];
    try {
      decodings.push(decodeURIComponent(t));
    } catch {
    }
    for (const d of decodings) {
      spellings.add(d);
      spellings.add(unscheme(d));
    }
  }
  const ordered = [...spellings].sort((a, b) => b.length - a.length);
  const scrub = (s) => ordered.reduce((acc, t) => acc.split(t).join(UNPARSEABLE_TARGET), s);
  for (let e = err, depth = 0; e instanceof Error && depth < 16; e = e.cause, depth += 1) {
    assign(e, "message", scrub(e.message));
    if (typeof e.stack === "string")
      assign(e, "stack", scrub(e.stack));
    const s = e.stderr;
    if (typeof s === "string")
      assign(e, "stderr", scrub(s));
  }
  return err;
}
function assign(target, field, value) {
  try {
    target[field] = value;
  } catch {
  }
}
function cloneTargetAtUnguarded(opts) {
  assertSafeTargetSha(opts.sha);
  const source = opts.cacheDir ?? opts.url;
  assertSafeTargetUrl(source);
  refuseSshTransport(source);
  const persisted = credentialInGitUrl(source);
  if (persisted !== null) {
    throw new RunRefusalError(`refusing to clone from a URL carrying ${persisted}: \`git remote add\` writes the source verbatim into .git/config, which is mounted where the repo\u2019s own test command runs. Fetch with the credential out of band so it is never written to disk \u2014 this runner takes one as an HTTP header, which is never persisted.`);
  }
  mkdirSync5(opts.dest, { recursive: true });
  const runOut = (args) => execFileSync("git", [...gitConfigArgs(), ...args], {
    cwd: opts.dest,
    encoding: "utf8",
    stdio: "pipe",
    env: gitCloneEnv(opts.auth)
  });
  const run2 = (args) => {
    runOut(args);
  };
  run2(["init", "-q"]);
  run2(["remote", "add", "origin", source]);
  try {
    run2(["fetch", "-q", "--depth", "1", "origin", "--end-of-options", opts.sha]);
  } catch (err) {
    const stderr = String(err.stderr ?? "");
    if (endOfOptionsUnsupported(stderr)) {
      throw new CloneUnavailableError(
        `this git does not understand "--end-of-options", so the target ref cannot be passed where git is guaranteed to read it as data. Upgrade to git ${MIN_GIT_VERSION_FOR_END_OF_OPTIONS} or newer. The clone is refused rather than retried without the marker: dropping it would remove the protection a caller that skips validation depends on.`,
        // THE THIRD CAUSE-DISCARDING SEAM (TERM-738, found by review). This branch already
        // held the child-process error and threw it away, so an operator got our sentence
        // and nothing else — no git version, no argv, no stderr. The sibling throw below
        // attaches its cause; this one silently did not, which is exactly the shape a
        // per-site fix leaves behind.
        { cause: err }
      );
    }
    throw new CloneUnavailableError(`we could not fetch ${opts.sha.slice(0, 12)} from ${opts.url}. Nothing ran, so this says nothing about the code \u2014 our environment could not obtain it.`, { cause: err });
  }
  run2(["checkout", "-q", "FETCH_HEAD"]);
  const head = runOut(["rev-parse", "HEAD"]).trim();
  if (head !== opts.sha) {
    throw new ThRunError(`the target checkout is at ${head}, not the requested ${opts.sha}. Refusing to verify against a commit the result would misattribute.`);
  }
  scrubCloneSource(opts.dest, run2);
  return head;
}
function scrubCloneSource(dest, run2) {
  run2(["remote", "remove", "origin"]);
  rmSync4(join10(dest, ".git", "FETCH_HEAD"), { force: true });
}
function publishableTarget(url) {
  if (separatorInTarget(url) !== null)
    return UNPARSEABLE_TARGET;
  const m = /^([A-Za-z][A-Za-z0-9+.-]*:\/\/)([^/?#]*)([^?#]*)/.exec(url);
  if (m === null)
    return url.includes("?") ? UNPARSEABLE_TARGET : redactPathCredentials(url);
  const authority = m[2] ?? "";
  const at = authority.lastIndexOf("@");
  const path = m[3] ?? "";
  return `${m[1] ?? ""}${at >= 0 ? authority.slice(at + 1) : authority}${redactPathCredentials(path)}`;
}
function redactPathCredentials(path) {
  return path.replace(/[^/]+/g, (segment) => {
    const seen = decodeToFixedPoint(segment);
    if (seen === null)
      return WITHHELD_SEGMENT;
    return /:[^@]*@/.test(seen) ? WITHHELD_SEGMENT : segment;
  });
}
function decodeToFixedPoint(s) {
  let current = s;
  for (let round = 0; round < 4; round += 1) {
    let next;
    try {
      next = decodeURIComponent(current);
    } catch {
      return null;
    }
    if (next === current)
      return current;
    current = next;
  }
  return null;
}
function credentialInGitUrl(url) {
  if (separatorInTarget(url) !== null)
    return "a separator hiding whatever follows it";
  const m = /^([A-Za-z][A-Za-z0-9+.-]*):\/\/([^/?#]*)(.*)$/.exec(url);
  if (m === null)
    return null;
  const scheme = (m[1] ?? "").toLowerCase();
  const authority = m[2] ?? "";
  const at = authority.lastIndexOf("@");
  if (at >= 0) {
    const overWeb = scheme === "http" || scheme === "https";
    let userinfo;
    try {
      userinfo = decodeURIComponent(authority.slice(0, at));
    } catch {
      return "an unreadable escape in its userinfo";
    }
    if (overWeb || userinfo.includes(":"))
      return "a credential in its userinfo";
  }
  const afterAuthority = m[3] ?? "";
  if (afterAuthority.includes("?"))
    return "a query string";
  if (afterAuthority.includes("#"))
    return "a fragment";
  return null;
}
function targetCarriesCredential(url) {
  if (separatorInTarget(url) !== null)
    return true;
  const rest = /^[A-Za-z][A-Za-z0-9+.-]*:\/\/(.*)$/.exec(url)?.[1];
  if (rest === void 0)
    return false;
  const authority = rest.split(/[/?#]/, 1)[0] ?? "";
  const at = authority.lastIndexOf("@");
  if (at < 0)
    return false;
  try {
    return decodeURIComponent(authority.slice(0, at)).includes(":");
  } catch {
    return true;
  }
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
  const res = spawnSync7("git", ["apply", "--whitespace=nowarn", "-"], {
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
function refusedRun(fields) {
  return {
    schema: RUN_RESULT_SCHEMA,
    runId: fields.runId,
    claimId: fields.claimId,
    status: "refused",
    outcome: null,
    reason: fields.reason,
    exitCode: null,
    testCommand: null,
    testOutputTail: "",
    counts: null,
    wallMs: fields.wallMs,
    targetRepo: fields.targetRepo,
    targetSha: fields.targetSha,
    patchSha256: null,
    treeDigest: null,
    baselinePatchSha256: null,
    testCommandSource: "none",
    boundaryRefusals: fields.boundaryRefusals,
    touchedPaths: fields.touchedPaths,
    preview: null,
    containerImage: null,
    leaksClean: null
  };
}
function unacceptableTarget(req) {
  try {
    assertSafeTargetUrl(req.targetRepo);
    if (req.targetCacheDir !== void 0)
      assertSafeTargetUrl(req.targetCacheDir);
    assertSafeTargetSha(req.targetSha);
  } catch (err) {
    if (err instanceof ThRunError)
      return err.message;
    throw err;
  }
  try {
    refuseSshTransport(req.targetRepo);
    if (req.targetCacheDir !== void 0)
      refuseSshTransport(req.targetCacheDir);
  } catch (err) {
    if (err instanceof RunRefusalError)
      return err.message;
    throw err;
  }
  if (targetCarriesCredential(req.targetRepo)) {
    return "refusing a target URL that carries a password in its userinfo: it would be printed";
  }
  if (req.targetCacheDir !== void 0 && targetCarriesCredential(req.targetCacheDir)) {
    return "refusing a target cache path that carries a password in its userinfo: it would be printed";
  }
  return null;
}
function toPreviewHandle(p) {
  return {
    url: p.url,
    instanceToken: p.instanceToken,
    containerId: p.container,
    readyMs: p.readyMs
  };
}
async function releaseWithoutThrowing(lease, progress) {
  try {
    const report = await lease.release();
    if (report.error !== null) {
      progress("teardown", `venue ${report.kind} reported a teardown failure: ${report.error}`);
    }
  } catch (err) {
    progress(
      "teardown",
      // `describeThrown`, not `String(err)`. This catch runs from a `finally`, so a value
      // that traps its own coercion turns a clean-up complaint into a throw that REPLACES
      // the run's real result — the exact cost this function's own docblock names.
      `venue ${lease.kind} threw while releasing, which its contract forbids: ${describeThrown(err, { includeName: true })}. The run result above stands; this is our environment failing to clean up, not a finding about the diff.`
    );
  }
}
async function verifyWorkingDiff(req) {
  const ctx = {
    startedAt: Date.now(),
    runId: req.runId ?? `run-${randomUUID2().slice(0, 8)}`,
    touchedPaths: []
  };
  const target = {
    claimId: req.claimId,
    targetRepo: publishableTarget(req.targetRepo),
    targetSha: req.targetSha
  };
  try {
    return await runVerification(req, ctx);
  } catch (err) {
    const refusal2 = findRunRefusal(err);
    if (refusal2 === null)
      throw err;
    return {
      result: refusedRun({
        runId: ctx.runId,
        claimId: target.claimId,
        // `describeThrown`, not `refusal.message`. Classifying a value does not make
        // reading it safe: `Error.prototype.message` is configurable, so a
        // `RunRefusalError` carrying a throwing `message` getter passes
        // `findRunRefusal` and then explodes HERE, inside the catch that exists to
        // convert it. The refusal would reject instead of returning, and a run we
        // refused would exit 1 — the developer's suite blamed for our own seam.
        //
        // This is the same lesson as the cause-walks above it, one accessor later:
        // the read that runs BEFORE the diagnostic is the one that defeats it. With
        // this call there is no raw read of a caller-supplied value left on the
        // path. For an ordinary error `describeThrown(x, { includeName: false })`
        // returns exactly `x.message`, so no founder-facing sentence changes.
        reason: describeThrown(refusal2, { includeName: false }),
        wallMs: Date.now() - ctx.startedAt,
        // The SNAPSHOT, already redacted above — not `publishableTarget(req.targetRepo)`
        // again. Calling it here would re-read `req` inside the very catch that exists to
        // build the refusal, which is the read TERM-738 moved out.
        // BOTH, and a rebase kept only one. `publishableTarget` is TERM-731/745's
        // credential strip; `target.*` is TERM-738's snapshot, taken before any
        // caller-controlled code runs. This line was edited on both sides of a rebase
        // onto main, the merge was clean, and the resolution silently dropped the strip.
        //
        // WHAT IS AND IS NOT DEMONSTRATED, because I first called this a live leak and
        // could not then produce one. `refusedRun` passes this field through unchanged,
        // and it is published where a founder reads it, so the strip is load-bearing in
        // principle. But no fixture here reaches THIS site with a value the strip would
        // change: the shapes it redacts (`x:secret@host`) are ones git reads as an
        // scp-style remote, so the clone fails and the refusal is built at an earlier
        // site that already strips. Two tests written for this line passed with the
        // strip deleted, for two different reasons, before that was clear.
        //
        // So this is consistency with every other construction site and defence in
        // depth, NOT a fix for a reproduced leak. Restated deliberately: overclaiming a
        // security fix is the same species of error as the diagnostics this file exists
        // to keep honest.
        targetRepo: publishableTarget(target.targetRepo),
        targetSha: target.targetSha,
        // Empty, for the reason STEP 0 and the lease refusal both give:
        // `renderVerdictLine` says "outside this bounty's slice" only when there
        // IS a slice refusal here, and no image we cannot supply is a finding
        // about their paths. `touchedPaths` carries whatever the pre-flight had
        // measured by the time we refused — nothing, if it had not yet run.
        boundaryRefusals: [],
        touchedPaths: ctx.touchedPaths
      }),
      preview: null,
      spec: null,
      verdict: null,
      // The whole point of TERM-738. `refusal.message` above is the sentence we show; this
      // is what actually went wrong, and without it the cause we attached at the throw site
      // is discarded here — a returned refusal never reaches a caller's `catch`.
      diagnostic: describeCause(err),
      venueIdentity: null
    };
  }
}
async function runVerification(req, ctx) {
  const { runId, startedAt } = ctx;
  const labels = { ...req.labels ?? {}, [RUN_LABEL_KEY]: "term-350" };
  const progress = req.onProgress ?? (() => {
  });
  const badTarget = unacceptableTarget(req);
  if (badTarget !== null) {
    return {
      result: refusedRun({
        runId,
        claimId: req.claimId,
        reason: badTarget,
        wallMs: Date.now() - startedAt,
        targetRepo: REDACTED_TARGET_REPO,
        targetSha: REDACTED_TARGET_SHA,
        // Nothing was measured about the patch — see the note on the placement refusal below.
        boundaryRefusals: [],
        touchedPaths: []
      }),
      preview: null,
      spec: null,
      verdict: null,
      // Null, and not an oversight: this refusal is our own check failing, so the sentence
      // above IS the whole cause and there is no error underneath it to carry.
      diagnostic: null,
      venueIdentity: null
    };
  }
  const placement = req.placement ?? localDockerPlacement();
  if (placement.refusal !== null) {
    return {
      result: refusedRun({
        runId,
        claimId: req.claimId,
        reason: placement.refusal,
        wallMs: Date.now() - startedAt,
        targetRepo: publishableTarget(req.targetRepo),
        targetSha: req.targetSha,
        // Empty, and read as a discriminator downstream: `renderVerdictLine`
        // says "outside this bounty's slice" only when there IS a slice refusal
        // here. Nothing was measured about the patch, so claiming a path is out
        // of bounds would blame their diff for our refusal.
        boundaryRefusals: [],
        touchedPaths: []
      }),
      preview: null,
      spec: null,
      verdict: null,
      // Null, and not an oversight: this refusal is our own check failing, so the sentence
      // above IS the whole cause and there is no error underneath it to carry.
      diagnostic: null,
      venueIdentity: null
    };
  }
  const source = req.source;
  let diff = null;
  if (source.kind === "working-diff") {
    progress("collect", `reading the working diff from ${source.localRepoDir}`);
    diff = collectWorkingDiff(source.localRepoDir);
    progress("collect", `${String(diff.trackedChanged.length)} tracked, ${String(diff.untracked.length)} untracked, ${String(diff.patch.length)} bytes`);
  } else {
    progress("collect", "dispatched run: the tree is the stored commit itself");
  }
  const boundary = source.kind !== "working-diff" || diff === null || diff.patch.trim() === "" ? { refused: false, refusals: [], touchedPaths: [] } : preflightBoundary({ patch: diff.patch, sliceFiles: source.sliceFiles });
  const pre = source.kind === "working-diff" && source.sliceFiles.length > 0 ? boundary : (() => {
    const refusals = boundary.refusals.filter((r) => r.code !== "out-of-slice");
    return { refused: refusals.length > 0, refusals, touchedPaths: boundary.touchedPaths };
  })();
  ctx.touchedPaths = pre.touchedPaths;
  if (pre.refused) {
    const first = pre.refusals[0];
    return {
      result: refusedRun({
        runId,
        claimId: req.claimId,
        reason: first?.detail ?? "the diff was refused by the local slice pre-flight, but no reason was recorded",
        wallMs: Date.now() - startedAt,
        targetRepo: publishableTarget(req.targetRepo),
        targetSha: req.targetSha,
        boundaryRefusals: pre.refusals,
        touchedPaths: pre.touchedPaths
      }),
      preview: null,
      spec: null,
      verdict: null,
      // Null, and not an oversight: this refusal is our own check failing, so the sentence
      // above IS the whole cause and there is no error underneath it to carry.
      diagnostic: null,
      venueIdentity: null
    };
  }
  const stage = join10(req.scratchRoot, runId);
  const cloneDir = join10(stage, "clone");
  const scratch = join10(stage, "scratch");
  mkdirSync5(scratch, { recursive: true });
  assertSafeTargetSha(req.targetSha);
  progress("clone", `${publishableTarget(req.targetRepo)} @ ${req.targetSha.slice(0, 12)}`);
  cloneTargetAt({
    url: req.targetRepo,
    sha: req.targetSha,
    dest: cloneDir,
    ...req.targetCacheDir ? { cacheDir: req.targetCacheDir } : {},
    // Note this rides alongside `cacheDir` rather than instead of it. A cached fetch
    // reads a local bare clone and needs no credential, but the header is harmless
    // there and passing it unconditionally keeps one code path instead of two.
    ...req.targetAuth ? { auth: req.targetAuth } : {}
  });
  const baselinePatch = source.kind === "working-diff" ? source.baselinePatch : void 0;
  const hasBaselinePatch = baselinePatch !== void 0 && baselinePatch.trim() !== "";
  if (hasBaselinePatch) {
    applyPatch(cloneDir, baselinePatch ?? "", "baseline patch");
  }
  if (diff !== null) {
    applyPatch(cloneDir, diff.patch, "developer's working diff");
  }
  const patchSha256 = diff === null ? null : sha256Hex(diff.patch);
  const treeDigest = patchedTreeDigest(cloneDir);
  const baselinePatchSha256 = hasBaselinePatch ? sha256Hex(baselinePatch ?? "") : null;
  const derived = deriveEnvironmentSpec(cloneDir);
  const spec = req.testCommandOverride === void 0 ? derived : { ...derived, testCommand: req.testCommandOverride };
  progress("derive", `runtime=${spec.runtime} install=${String(spec.installCommand)} test=${String(spec.testCommand)}`);
  const image = placement.imageFor(spec.runtime, req.image, spec.runtimeVersion);
  const resolved = await resolveLease(placement, runId);
  if (!resolved.ok) {
    return {
      result: refusedRun({
        runId,
        claimId: req.claimId,
        reason: resolved.refusal,
        wallMs: Date.now() - startedAt,
        targetRepo: publishableTarget(req.targetRepo),
        targetSha: req.targetSha,
        // Empty, and for the same reason as STEP 0: `renderVerdictLine` says
        // "outside this bounty's slice" only when there IS a slice refusal here.
        // The pre-flight PASSED, so blaming their paths for our missing daemon
        // would be the exact inversion this fix exists to stop. `touchedPaths` is
        // reported because by this point it was genuinely measured.
        boundaryRefusals: [],
        touchedPaths: pre.touchedPaths
      }),
      preview: null,
      // Carried out of `resolveLease`, which used to keep only `err.message` and drop the
      // error. `resolved.refusal` is the sentence a developer reads; this is the stack
      // under it, and it is the only copy that exists (TERM-738).
      diagnostic: resolved.diagnostic,
      // Null though a spec WAS derived: `VerifyOutcome.spec` is documented null on
      // a refusal, and a caller reading it as "this much of the run happened"
      // would be reading a run that did not.
      spec: null,
      verdict: null,
      venueIdentity: null
    };
  }
  const lease = resolved.lease;
  try {
    buildJail(scratch);
    const venuePaths = await lease.stage({
      cloneDir,
      scratchRoot: scratch,
      previewDir: join10(stage, "preview")
    });
    progress("run", `placement ${placement.kind}, venue ${lease.kind}, image ${image}`);
    const verdict = await runEnvironmentSpec({
      repoDir: venuePaths.cloneDir,
      spec,
      // The jail as the VENUE spells it. Handing a root down instead is what let
      // `runEnvironmentSpec` build one, and it built it here (TERM-698).
      jail: venuePaths.jail,
      tmp: venuePaths.tmp,
      labels,
      image,
      lease,
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
      targetRepo: publishableTarget(req.targetRepo),
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
      return {
        result: base,
        preview: null,
        spec,
        verdict,
        diagnostic: null,
        venueIdentity: lease.venueIdentity ?? null
      };
    progress("preview", "starting one instance both parties can open");
    const instance = await lease.publishPreview({
      labels,
      idBase: `th-${runId}`,
      image,
      scratchDir: venuePaths.previewDir,
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
      verdict,
      diagnostic: null,
      venueIdentity: lease.venueIdentity ?? null
    };
  } finally {
    await releaseWithoutThrowing(lease, progress);
  }
}
var ThRunError, OUTPUT_TAIL_BYTES, ALLOWED_URL_SCHEMES, SCP_STYLE, URL_SCHEME, WINDOWS_ABSOLUTE, UNC_PATH, TRANSPORT_REASON, SHA_REASON, FULL_SHA, MIN_GIT_VERSION_FOR_END_OF_OPTIONS, CloneUnavailableError, GIT_ENV_ALLOWLIST, credentialFreeHomeDir, SSH_ISOLATION_ARGS, WITHHELD_SEGMENT, UNPARSEABLE_TARGET, FAILURE_LINE, REDACTED_TARGET_REPO, REDACTED_TARGET_SHA;
var init_thrun = __esm({
  "../../packages/envrun/dist/thrun.js"() {
    "use strict";
    init_dist();
    init_dist3();
    init_attestation2();
    init_boundary();
    init_labels();
    init_execute();
    init_placement();
    init_venue();
    init_result();
    ThRunError = class extends Error {
    };
    OUTPUT_TAIL_BYTES = 4e3;
    ALLOWED_URL_SCHEMES = /* @__PURE__ */ new Set(["https", "http", "ssh", "git"]);
    SCP_STYLE = /^[A-Za-z0-9._~+-]+@[A-Za-z0-9._-]+:[^:]/;
    URL_SCHEME = /^([A-Za-z][A-Za-z0-9+.-]*):\/\//;
    WINDOWS_ABSOLUTE = /^[A-Za-z]:[\\/](?![\\/])/;
    UNC_PATH = /^[\\/]{2}/;
    TRANSPORT_REASON = "A git transport helper is a git feature, not a shell escape \u2014 git itself runs the command the URL names, on this machine, at clone time, before any container or fence exists. Quoting cannot make that safe, so the value is refused rather than sanitised.";
    SHA_REASON = 'git parses a fetch argument that begins with "-" as an OPTION and not a refspec, so a value like `--upload-pack=<command>` makes git run that command on this machine at clone time, before any container or fence exists. Quoting cannot make that safe, so the value is refused rather than sanitised.';
    FULL_SHA = /^[0-9a-f]{40}$/;
    MIN_GIT_VERSION_FOR_END_OF_OPTIONS = "2.24";
    CloneUnavailableError = class extends RunRefusalError {
    };
    GIT_ENV_ALLOWLIST = [
      "PATH",
      "HOME",
      "TMPDIR",
      "LANG",
      "LC_ALL",
      "SSL_CERT_FILE",
      // WHOM TO BELIEVE, NOT WHO WE ARE — and that distinction is the whole rule this list
      // encodes. A CA bundle says which certificates to trust; it authenticates nobody, and a
      // clone that cannot verify a corporate MITM CA fails TLS with a message about
      // certificates rather than about anything a developer can act on. `SSL_CERT_FILE` above
      // is the OpenSSL spelling of exactly this and was already here, so omitting git's own
      // spellings made the list inconsistent rather than stricter.
      //
      // The client-auth variables — `GIT_SSL_CERT`, `GIT_SSL_KEY`, and the `GIT_PROXY_SSL_*`
      // pair — are deliberately NOT here. A client certificate is a credential: an https target
      // asking for mutual TLS would authenticate this clone as the developer with every other
      // channel already shut. Pinned in `test/thrun-target-url.test.mjs`, in both directions.
      "GIT_SSL_CAINFO",
      "GIT_SSL_CAPATH",
      // Windows
      "SystemRoot",
      "windir",
      "ComSpec",
      "USERPROFILE",
      "HOMEDRIVE",
      "HOMEPATH",
      "APPDATA",
      "LOCALAPPDATA",
      "TEMP",
      "TMP",
      "PATHEXT",
      "PROCESSOR_ARCHITECTURE",
      "SYSTEMDRIVE",
      "PROGRAMDATA"
    ];
    SSH_ISOLATION_ARGS = [
      "-F",
      "none",
      "-o",
      "IdentitiesOnly=yes",
      "-o",
      "IdentityAgent=none",
      "-o",
      "IdentityFile=none",
      "-o",
      "BatchMode=yes"
    ];
    WITHHELD_SEGMENT = "(credential withheld)";
    UNPARSEABLE_TARGET = "(a target this runner could not parse, withheld)";
    FAILURE_LINE = /^(?:[ \t]*(?:not ok |FAILED |FAIL )|E {3}|# fail [1-9])/m;
    REDACTED_TARGET_REPO = "(refused before the target was accepted)";
    REDACTED_TARGET_SHA = "(refused)";
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
      return migrations.filter((p) => /^alembic\/versions\/[^/]+\.py$/.test(p) && !p.endsWith("/__init__.py")).sort().map((path) => ({ id: basename2(path).replace(/\.py$/, ""), path }));
    case "rails":
      return migrations.filter((p) => /^db\/migrate\/[^/]+\.rb$/.test(p)).sort().map((path) => ({ id: /^(\d+)/.exec(basename2(path))?.[1] ?? basename2(path), path }));
    case "sql":
      return migrations.filter((p) => p.endsWith(".sql") && !p.startsWith("prisma/migrations/")).sort().map((path) => ({ id: path, path }));
  }
}
function basename2(path) {
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
import { spawnSync as spawnSync8 } from "child_process";
import { randomBytes as randomBytes5 } from "crypto";
import { mkdirSync as mkdirSync6 } from "fs";
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
  const res = spawnSync8("docker", [...args], { encoding: "utf8", timeout: timeoutMs });
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
    password: randomBytes5(24).toString("base64url"),
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
    spawnSync8("sleep", ["0.25"]);
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
async function installLocalMigrationTooling(opts) {
  const command = installCommandFor(opts.runner);
  if (command === null) {
    return {
      ran: false,
      ok: true,
      detail: `runner ${opts.runner} needs no toolchain install (psql ships in ${PSQL_IMAGE})`
    };
  }
  const { jail, tmp } = buildJail(opts.scratchRoot);
  mkdirSync6(jail, { recursive: true });
  mkdirSync6(tmp, { recursive: true });
  const spec = {
    profile: "install",
    clone: opts.repoDir,
    jail,
    tmp,
    program: "/bin/sh",
    args: ["-c", command]
  };
  const env = scrubEnv(process.env, scrubEnvPathsFor("container", { jail, tmp }));
  const res = await runContainedOn(localDockerClient(), spec, env, {
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
  CONTAINMENT_UNAVAILABLE_PREFIX: () => CONTAINMENT_UNAVAILABLE_PREFIX,
  CloneUnavailableError: () => CloneUnavailableError,
  DEFAULT_GCP_PROJECT: () => DEFAULT_GCP_PROJECT,
  DEFAULT_GCP_ZONE: () => DEFAULT_GCP_ZONE,
  DEFAULT_PLACEMENT_KIND: () => DEFAULT_PLACEMENT_KIND,
  DbStackError: () => DbStackError,
  EGRESS_PROBE: () => EGRESS_PROBE,
  EnvRunError: () => EnvRunError,
  GCE_METADATA_IDENTITY_URL: () => GCE_METADATA_IDENTITY_URL,
  GCP_MANAGED_LABEL_KEY: () => GCP_MANAGED_LABEL_KEY,
  GCP_MAX_RUN_DURATION_SECONDS: () => GCP_MAX_RUN_DURATION_SECONDS,
  GCP_RUN_LABEL_KEY: () => GCP_RUN_LABEL_KEY,
  GOOGLE_JWKS_URL: () => GOOGLE_JWKS_URL,
  HOSTED_POOL_REFUSAL: () => HOSTED_POOL_REFUSAL,
  HostedVenueError: () => HostedVenueError,
  JWKS_FETCH_TIMEOUT_MS: () => JWKS_FETCH_TIMEOUT_MS,
  LOCAL_MEASUREMENT_PREFIX: () => LOCAL_MEASUREMENT_PREFIX,
  LabelWatch: () => LabelWatch,
  MIN_GIT_VERSION_FOR_END_OF_OPTIONS: () => MIN_GIT_VERSION_FOR_END_OF_OPTIONS,
  OUTCOME_TO_BUDGET: () => OUTCOME_TO_BUDGET,
  PATH_REFUSAL_CODES: () => PATH_REFUSAL_CODES,
  PLACEMENTS: () => PLACEMENTS,
  PLACEMENT_ALIASES: () => PLACEMENT_ALIASES,
  PRISMA_IMAGE: () => PRISMA_IMAGE,
  PRISMA_INSTALL_ALLOWLIST: () => PRISMA_INSTALL_ALLOWLIST,
  PROBE_TIMEOUT_MS: () => PROBE_TIMEOUT_MS,
  PSQL_IMAGE: () => PSQL_IMAGE,
  PreviewError: () => PreviewError,
  REDACTED_TARGET_REPO: () => REDACTED_TARGET_REPO,
  REDACTED_TARGET_SHA: () => REDACTED_TARGET_SHA,
  RELEASED_LEASE_CENSUS_REASON: () => RELEASED_LEASE_CENSUS_REASON,
  RUN_LABEL_KEY: () => RUN_LABEL_KEY,
  RUN_RESULT_FIELDS: () => RUN_RESULT_FIELDS,
  RUN_RESULT_SCHEMA: () => RUN_RESULT_SCHEMA,
  RUN_TEST_COMMAND_SOURCES: () => RUN_TEST_COMMAND_SOURCES,
  RunRefusalError: () => RunRefusalError,
  SERVER_SOURCE: () => SERVER_SOURCE,
  SERVICE_ACCOUNT_SUFFIX: () => SERVICE_ACCOUNT_SUFFIX,
  SSH_PROBE_INTERVAL_MS: () => SSH_PROBE_INTERVAL_MS,
  SSH_READY_BUDGET_MS: () => SSH_READY_BUDGET_MS,
  STOCK_POSTGRES_IMAGE: () => STOCK_POSTGRES_IMAGE,
  SUPPORTED_RUNNERS: () => SUPPORTED_RUNNERS,
  ThRunError: () => ThRunError,
  UNPARSEABLE_TARGET: () => UNPARSEABLE_TARGET,
  VENUE_GCLOUD_CONFIG: () => VENUE_GCLOUD_CONFIG,
  VENV_DIR: () => VENV_DIR,
  VenueRollbackError: () => VenueRollbackError,
  acquireTransactionally: () => acquireTransactionally,
  alembicChainPosition: () => alembicChainPosition,
  answerDidItPass: () => answerDidItPass,
  applyMigrations: () => applyMigrations,
  applyPatch: () => applyPatch,
  applySeeds: () => applySeeds,
  assertSafeTargetSha: () => assertSafeTargetSha,
  assertSafeTargetUrl: () => assertSafeTargetUrl,
  assertServiceCredentials: () => assertServiceCredentials,
  assertVenueOwnerDeclared: () => assertVenueOwnerDeclared,
  bookkeepingFor: () => bookkeepingFor,
  census: () => census,
  censusTotal: () => censusTotal,
  classifyBootFailure: () => classifyBootFailure,
  classifyProbeFailure: () => classifyProbeFailure,
  classifySingleRun: () => classifySingleRun,
  classifyVenueDaemon: () => classifyVenueDaemon,
  classifyVerification: () => classifyVerification,
  cloneTargetAt: () => cloneTargetAt,
  collectWorkingDiff: () => collectWorkingDiff,
  connectionUrl: () => connectionUrl,
  containmentUnavailableRefusal: () => containmentUnavailableRefusal,
  credentialInGitUrl: () => credentialInGitUrl,
  defaultHostedVenueIo: () => defaultHostedVenueIo,
  deleteFoundNothing: () => deleteFoundNothing,
  describeCause: () => describeCause,
  describeVenueDaemon: () => describeVenueDaemon,
  detectRunner: () => detectRunner,
  endOfOptionsUnsupported: () => endOfOptionsUnsupported,
  ensureVenueServiceCredentials: () => ensureVenueServiceCredentials,
  failureSourceOf: () => failureSourceOf,
  findRunRefusal: () => findRunRefusal,
  gcpBootArgv: () => gcpBootArgv,
  gcpDeleteArgv: () => gcpDeleteArgv,
  gcpRunnerPlacement: () => gcpRunnerPlacement,
  generateCredentials: () => generateCredentials,
  hostedPoolPlacement: () => hostedPoolPlacement,
  hostedVenue: () => hostedVenue,
  hostedVenueAvailable: () => hostedVenueAvailable,
  iapSshArgv: () => iapSshArgv,
  iapTunnelArgv: () => iapTunnelArgv,
  iapUntarArgv: () => iapUntarArgv,
  identityProbeCommand: () => identityProbeCommand,
  imageForRuntime: () => imageForRuntime,
  installCommandFor: () => installCommandFor,
  installLocalMigrationTooling: () => installLocalMigrationTooling,
  isBookkeepingTable: () => isBookkeepingTable,
  isCommandUnavailable: () => isCommandUnavailable,
  isGreen: () => isGreen,
  isOurFault: () => isOurFault,
  judgeCompleteness: () => judgeCompleteness,
  judgeLeaks: () => judgeLeaks,
  localCensus: () => localCensus,
  localDockerPlacement: () => localDockerPlacement,
  localMeasurement: () => localMeasurement,
  localVenue: () => localVenue,
  manualDeleteCommand: () => manualDeleteCommand,
  migrationUnits: () => migrationUnits,
  parseAlembicRevision: () => parseAlembicRevision,
  parseIdentityProbeOutput: () => parseIdentityProbeOutput,
  parsePlacementKind: () => parsePlacementKind,
  placementFor: () => placementFor,
  planDatabase: () => planDatabase,
  preflightBoundary: () => preflightBoundary,
  probeEgressControl: () => probeEgressControl,
  probeReachability: () => probeReachability,
  publishableTarget: () => publishableTarget,
  quoteForRemoteShell: () => quoteForRemoteShell,
  readAlembicChain: () => readAlembicChain,
  readCounts: () => readCounts,
  readSchema: () => readSchema,
  recordedApplied: () => recordedApplied,
  refuseSshTransport: () => refuseSshTransport,
  renderRunReport: () => renderRunReport,
  renderVerdictLine: () => renderVerdictLine,
  resolveImageForSpec: () => resolveImageForSpec,
  resolveLease: () => resolveLease,
  runEnvironmentSpec: () => runEnvironmentSpec,
  setManifestProbe: () => setManifestProbe,
  sha256Hex: () => sha256Hex,
  signRunStatement: () => signRunStatement,
  stageMkdirArgv: () => stageMkdirArgv,
  startDatabase: () => startDatabase,
  startLocalPreview: () => startLocalPreview,
  startPreview: () => startPreview,
  targetCarriesCredential: () => targetCarriesCredential,
  toAcceptancePredicate: () => toAcceptancePredicate,
  toolingImageFor: () => toolingImageFor,
  unquoteDiffPath: () => unquoteDiffPath,
  venueGcloudEnv: () => venueGcloudEnv,
  venueStagePaths: () => venueStagePaths,
  verifyWorkingDiff: () => verifyWorkingDiff
});
var init_dist4 = __esm({
  "../../packages/envrun/dist/index.js"() {
    "use strict";
    init_classify();
    init_execute();
    init_labels();
    init_result();
    init_attestation2();
    init_boundary();
    init_placement();
    init_gcpPlacement();
    init_gcpPlacement();
    init_venue();
    init_hostedVenue();
    init_venueProof();
    init_preview();
    init_thrun();
    init_dbplan();
    init_dbstack();
  }
});

// bin/jpi-run.js
import { existsSync as existsSync8, readFileSync as readFileSync5 } from "fs";
import { join as join11, resolve } from "path";
import { tmpdir as tmpdir4 } from "os";
import { mkdtempSync as mkdtempSync4, rmSync as rmSync5 } from "fs";

// bin/recall-check.js
import {
  closeSync,
  existsSync,
  mkdirSync,
  openSync,
  readFileSync,
  readdirSync,
  renameSync,
  statSync,
  unlinkSync,
  writeFileSync
} from "fs";
import { homedir } from "os";
import { basename, dirname, join } from "path";

// src/api-base.ts
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

// bin/recall-check.js
var RECALL_URL = `${resolveApiBase()}/api/cli/recall`;
function defaultUrl() {
  return process.env["TERMINALHIRE_RECALL_URL"] || RECALL_URL;
}
var TIMEOUT_MS = 2e3;
function stateDir() {
  return process.env["TERMINALHIRE_DIR"] || join(homedir(), ".terminalhire");
}
function recallCachePath() {
  return join(stateDir(), "recall.json");
}
async function fetchRecalls(url = defaultUrl()) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (!res.ok) return null;
    const body = await res.json();
    const recalled = body?.recalled;
    if (!recalled || typeof recalled !== "object" || Array.isArray(recalled)) return null;
    return recalled;
  } catch {
    return null;
  }
}
function readSticky(version, path = recallCachePath()) {
  try {
    if (!existsSync(path)) return null;
    const parsed = JSON.parse(readFileSync(path, "utf8"));
    const reason = parsed?.[version];
    return typeof reason === "string" && reason.length > 0 ? reason : null;
  } catch {
    return null;
  }
}
var tmpCounter = 0;
var STALE_LOCK_MS = 5e3;
var LOCK_WAIT_MS = STALE_LOCK_MS + 2e3;
function mutateCache(path, mutate) {
  const lock = `${path}.lock`;
  let held = false;
  try {
    mkdirSync(dirname(path), { recursive: true, mode: 448 });
    const deadline = Date.now() + LOCK_WAIT_MS;
    while (!held && Date.now() < deadline) {
      try {
        closeSync(openSync(lock, "wx", 384));
        held = true;
      } catch (err) {
        if (err?.code !== "EEXIST") return false;
        try {
          if (Date.now() - statSync(lock).mtimeMs > STALE_LOCK_MS) unlinkSync(lock);
        } catch {
        }
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 2);
      }
    }
    let existing = {};
    try {
      const parsed = JSON.parse(readFileSync(path, "utf8"));
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) existing = parsed;
    } catch {
    }
    if (mutate(existing) === false) return false;
    const tmp = `${path}.${process.pid}.${tmpCounter += 1}.tmp`;
    try {
      writeFileSync(tmp, `${JSON.stringify(existing, null, 2)}
`, { mode: 384 });
      renameSync(tmp, path);
    } catch {
      try {
        unlinkSync(tmp);
      } catch {
      }
      return false;
    }
    return true;
  } catch {
    return false;
  } finally {
    if (held) {
      try {
        unlinkSync(lock);
      } catch {
      }
    }
  }
}
function sweepTempFiles(path) {
  try {
    const dir = dirname(path);
    const prefix = `${basename(path)}.`;
    for (const name of readdirSync(dir)) {
      if (!name.startsWith(prefix) || !name.endsWith(".tmp")) continue;
      const full = join(dir, name);
      try {
        if (Date.now() - statSync(full).mtimeMs > 6e4) unlinkSync(full);
      } catch {
      }
    }
  } catch {
  }
}
function writeSticky(version, reason, path = recallCachePath()) {
  for (let attempt = 0; attempt < 5; attempt++) {
    if (!mutateCache(path, (map) => {
      map[version] = reason;
    })) {
      return;
    }
    if (readSticky(version, path) === reason) {
      sweepTempFiles(path);
      return;
    }
  }
}
function clearSticky(version, path = recallCachePath()) {
  const committed = mutateCache(path, (map) => {
    if (!(version in map)) return false;
    delete map[version];
    return true;
  });
  if (committed) sweepTempFiles(path);
}
function recallVerdict(version, recalls, sticky) {
  if (recalls !== null) {
    const reason = recalls[version];
    if (typeof reason === "string" && reason.length > 0) {
      return { blocked: true, reason, remember: true };
    }
    return { blocked: false, reason: null, remember: false };
  }
  if (sticky) return { blocked: true, reason: sticky, remember: false };
  return { blocked: false, reason: null, remember: false };
}
function formatRecallMessage(version, reason) {
  return [
    "",
    `  \u2717 terminalhire ${version} has been withdrawn.`,
    "",
    ...reason.split("\n").map((line) => `    ${line}`),
    "",
    "    Upgrade:  npm i -g terminalhire@latest",
    "",
    "  Nothing was cloned, and nothing was executed.",
    ""
  ].join("\n");
}
async function checkRecall(version, { url = defaultUrl(), path = recallCachePath() } = {}) {
  const sticky = readSticky(version, path);
  const recalls = await fetchRecalls(url);
  const verdict = recallVerdict(version, recalls, sticky);
  if (process.env["TERMINALHIRE_RECALL_URL"] && sticky && !verdict.blocked) {
    return { blocked: true, reason: sticky, remember: false };
  }
  if (verdict.remember && verdict.reason) writeSticky(version, verdict.reason, path);
  if (recalls !== null && sticky && !verdict.blocked) {
    clearSticky(version, path);
  }
  return verdict;
}

// bin/package-version.js
import { existsSync as existsSync2, readFileSync as readFileSync2 } from "fs";
import { join as join2 } from "path";
import { fileURLToPath } from "url";
var __dirname = fileURLToPath(new URL(".", import.meta.url));
function readPackageVersion() {
  try {
    const candidates = [
      join2(__dirname, "..", "..", "package.json"),
      join2(__dirname, "..", "package.json")
    ];
    for (const p of candidates) {
      if (existsSync2(p)) {
        const pkg = JSON.parse(readFileSync2(p, "utf8"));
        if (pkg.version) return pkg.version;
      }
    }
  } catch {
  }
  return "0.1.1";
}

// bin/jpi-run.js
var KEEP_MAX_SECONDS = Math.floor((2 ** 31 - 1) / 1e3);
var USAGE = `terminalhire run \u2014 verify your working diff in a fresh container

Usage:
  th run [options]

Options:
  --claim <id>          The claim this work belongs to.
  --target <git-url>    Repository the work is verified against.
  --sha <40-hex>        The commit your diff applies on top of.
  --slice <a,b,c>       Optional. Comma-separated files this claim shares; give it
                        and a diff touching anything else is refused locally,
                        before any container. Omit it and scoping happens at
                        submission, where the server derives the slice itself.
  --local <dir>         Checkout to read the working diff from (default: cwd).
  --placement <kind>    WHERE to run: local-docker or hosted (default: local-docker).
  --watch               Re-run when a file in the checkout changes.
  --json                Print the run result as JSON instead of a report.
  --no-preview          Skip the preview URL.
  --keep <seconds>      Hold the preview open this long, at most ${String(KEEP_MAX_SECONDS)}
                        (default: until Ctrl-C).
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
  let root;
  try {
    root = mkdtempSync4(join11(tmpdir4(), "th-run-"));
  } catch (err) {
    process.stderr.write(
      `terminalhire: could not create the temporary directory this run works in, so nothing was cloned and nothing was executed. That is our environment failing, not your tests: check that the temp directory is writable. (${String(err?.message ?? err)})
`
    );
    process.exit(2);
  }
  let cleaned = false;
  const cleanup = () => {
    if (cleaned) return;
    cleaned = true;
    try {
      rmSync5(root, { recursive: true, force: true });
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
  const file = join11(localDir, ".th-run.json");
  if (!existsSync8(file)) return {};
  try {
    const parsed = JSON.parse(readFileSync5(file, "utf8"));
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
    // `th run` is the developer's own loop, and this is the variant that says so: it tests
    // the bytes in their checkout. The dispatched variant has no checkout to name.
    source: {
      kind: "working-diff",
      localRepoDir: opts.localDir,
      sliceFiles: opts.slice
    },
    targetRepo: opts.target,
    targetSha: opts.sha,
    scratchRoot: root,
    preview: opts.preview,
    ...opts.placement ? { placement: opts.placement } : {},
    ...opts.testCommand ? { testCommandOverride: opts.testCommand } : {},
    onProgress: (stage, detail) => {
      if (!opts.json) process.stderr.write(`  ${stage.padEnd(8)} ${detail}
`);
    }
  });
  const { result, preview } = outcome;
  if (opts.json) {
    if (preview) {
      process.stderr.write(
        "\nterminalhire: the JSON on stdout carries preview.instanceToken \u2014 the credential that opens this preview. Redirecting stdout into a file or a CI log stores it there. Treat that output as a secret, or pass --no-preview if you only need the result.\n"
      );
    }
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
That URL carries its own token, so treat it as a credential: anyone you hand it to can read this run.
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
    process.stderr.write(
      "terminalhire: no --slice given, so the local pre-check is off and every file in your diff will be sent. Scoping still happens at submission, where the server derives the slice from the bounty.\n"
    );
  }
  const placementRaw = pick("placement");
  const keepRaw = pick("keep");
  const keepGiven = keepRaw !== void 0 && keepRaw !== null;
  if (keepGiven && !/^\d+$/.test(String(keepRaw))) {
    throw new Error(
      `terminalhire: --keep must be a whole number of seconds written in digits, got ${JSON.stringify(String(keepRaw))}. The typed text is checked rather than the number it converts to, because the conversion is what changes the value: an empty or blank value converts to 0, and "0x20", "1e3" and "30.0" all convert to whole numbers nobody typed. Each of those holds the preview for a length the developer never asked for \u2014 for none at all, in the case of a value that came out as 0 or NaN \u2014 so the URL printed above it would be dead before anyone could open it.`
    );
  }
  const keepSeconds = keepGiven ? Number(keepRaw) : null;
  if (keepSeconds !== null && keepSeconds > KEEP_MAX_SECONDS) {
    throw new Error(
      `terminalhire: --keep must be at most ${String(KEEP_MAX_SECONDS)} seconds, got ${JSON.stringify(String(keepRaw))}. Past that the timer overflows its int32 of milliseconds and the wait collapses to 1ms, so asking for a longer hold would give you no hold at all and the URL printed above it would be dead before anyone could open it. Refused rather than clamped, because a preview that died on the way to you looks exactly like one that worked.`
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
    keepSeconds,
    scratch: runScratchRoot()
  };
  if (!/^[0-9a-f]{40}$/.test(opts.sha)) {
    throw new Error(
      `terminalhire: --sha must be a full 40-character commit, got ${JSON.stringify(opts.sha)}. An abbreviated sha cannot be checked against what was actually fetched.`
    );
  }
  const version = readPackageVersion();
  const recall = await checkRecall(version);
  if (recall.blocked) {
    process.stderr.write(`${formatRecallMessage(version, recall.reason)}
`);
    return 2;
  }
  const engine = await loadEngine();
  opts.placementKind = engine.parsePlacementKind(placementRaw);
  opts.placement = engine.placementFor(opts.placementKind);
  if (!opts.json) {
    process.stderr.write(`  where    ${opts.placementKind}
`);
  }
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
