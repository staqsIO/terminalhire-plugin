// src/progress.ts
var FRAME_MS = 80;
var CLEAR_LINE = "\x1B[2K\r";
function defaultSink() {
  return {
    write: (chunk) => process.stderr.write(chunk),
    isTTY: Boolean(process.stderr.isTTY),
    stdoutIsTTY: Boolean(process.stdout.isTTY),
    ci: Boolean(process.env["CI"]),
    now: () => Date.now()
  };
}
function isEnabled(sink) {
  return sink.isTTY && sink.stdoutIsTTY && !sink.ci;
}
function createProgress(sink = defaultSink()) {
  const enabled = isEnabled(sink);
  let label = "";
  let lastFrame = -Infinity;
  function render(text, permanent) {
    if (!enabled) return;
    sink.write(CLEAR_LINE + text + (permanent ? "\n" : ""));
  }
  return {
    enabled,
    start(next) {
      label = next;
      lastFrame = sink.now();
      render(`  ${label}\u2026`, false);
    },
    update(detail) {
      if (!enabled) return;
      const t = sink.now();
      if (t - lastFrame < FRAME_MS) return;
      lastFrame = t;
      render(`  ${label}\u2026 ${detail}`, false);
    },
    succeed(detail) {
      render(`  \u2713 ${label}${detail ? ` ${detail}` : ""}`, true);
      label = "";
    },
    fail(detail) {
      render(`  \u2717 ${label}${detail ? ` ${detail}` : ""}`, true);
      label = "";
    }
  };
}
function parseGitProgress(line) {
  const m = /^(?:remote:\s*)?([A-Za-z][A-Za-z ]*?):\s+(\d{1,3})%/.exec(line.trim());
  if (!m) return null;
  const percent = Number(m[2]);
  if (!Number.isInteger(percent) || percent < 0 || percent > 100) return null;
  return { phase: (m[1] ?? "").trim().toLowerCase(), percent };
}
function splitProgressChunk(chunk) {
  return chunk.split(/[\r\n]+/).filter((s) => s.trim().length > 0);
}
function shStream(cmd, args, opts = {}) {
  const cap = opts.maxStderrBytes ?? 64 * 1024;
  return new Promise((resolve, reject) => {
    void (async () => {
      const spawn = opts.spawnFn ?? (await import("child_process")).spawn;
      const child = spawn(cmd, args, { shell: false, stdio: ["ignore", "pipe", "pipe"] });
      let stdout = "";
      let stderr = "";
      child.stdout?.setEncoding("utf8");
      child.stdout?.on("data", (d) => {
        stdout += d;
      });
      child.stderr?.setEncoding("utf8");
      child.stderr?.on("data", (d) => {
        stderr = (stderr + d).slice(-cap);
        opts.onStderr?.(d);
      });
      child.on("error", (err) => reject(err));
      child.on("close", (code, signal) => {
        if (code === 0) {
          resolve({ stdout: stdout.trim(), stderr });
          return;
        }
        const err = new Error(
          `${cmd} ${args[0] ?? ""} exited ${signal ? `on ${signal}` : `with code ${code}`}`
        );
        err.stdout = stdout.trim();
        err.stderr = stderr;
        err.code = code;
        reject(err);
      });
    })();
  });
}
export {
  createProgress,
  defaultSink,
  isEnabled,
  parseGitProgress,
  shStream,
  splitProgressChunk
};
