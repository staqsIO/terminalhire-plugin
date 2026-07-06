// bin/tui-core.js
var HIDE_CURSOR = "\x1B[?25l";
var SHOW_CURSOR = "\x1B[?25h";
var ENTER_ALT = "\x1B[?1049h";
var EXIT_ALT = "\x1B[?1049l";
var CLEAR = "\x1B[2J\x1B[H";
var INVERSE = "\x1B[7m";
var RESET = "\x1B[0m";
var BOLD = "\x1B[1m";
var BOLD_OFF = "\x1B[22m";
var KEY_CTRL_C = "";
var KEY_ESC = "\x1B";
var KEY_UP = "\x1B[A";
var KEY_DOWN = "\x1B[B";
var KEY_RIGHT = "\x1B[C";
var KEY_LEFT = "\x1B[D";
var KEY_TAB = "	";
var KEY_ENTER_A = "\r";
var KEY_ENTER_B = "\n";
var KEY_BACKSPACE_A = "\x7F";
var KEY_BACKSPACE_B = "\b";
var KEY_Q = "q";
var KEY_DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
var ANSI_CSI = /\x1b\[[0-?]*[ -/]*[@-~]/g;
var ANSI_OSC = /\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)/g;
var ANSI_OTHER = /\x1b[@-_]/g;
var C0_C1_DEL = /[\x00-\x1f\x7f-\x9f]/g;
function sanitizeLine(text) {
  return String(text).replace(ANSI_CSI, "").replace(ANSI_OSC, "").replace(ANSI_OTHER, "").replace(C0_C1_DEL, "");
}
function truncate(s, n) {
  const t = String(s);
  return t.length <= n ? t : `${t.slice(0, n - 1)}\u2026`;
}
function createRuntime({
  input = typeof process !== "undefined" ? process.stdin : void 0,
  output = typeof process !== "undefined" ? process.stdout : void 0,
  signals = typeof process !== "undefined" ? process : void 0,
  exit = (code) => process.exit(code)
} = {}) {
  let entered = false;
  let cleaned = false;
  function cleanup() {
    if (cleaned) return;
    cleaned = true;
    entered = false;
    try {
      if (input && typeof input.setRawMode === "function") input.setRawMode(false);
    } catch {
    }
    try {
      if (input && typeof input.pause === "function") input.pause();
    } catch {
    }
    try {
      if (signals && typeof signals.removeListener === "function") {
        signals.removeListener("SIGINT", onSignal);
        signals.removeListener("SIGTERM", onSignal);
        signals.removeListener("SIGHUP", onSignal);
        signals.removeListener("uncaughtException", onUncaught);
        signals.removeListener("unhandledRejection", onUncaught);
        signals.removeListener("exit", onExitEvt);
      }
    } catch {
    }
    try {
      if (output && typeof output.write === "function") output.write(SHOW_CURSOR + EXIT_ALT);
    } catch {
    }
  }
  function onSignal() {
    cleanup();
    exit(130);
  }
  function onUncaught(err) {
    cleanup();
    throw err;
  }
  function onExitEvt() {
    cleanup();
  }
  function enter() {
    if (entered) return;
    entered = true;
    cleaned = false;
    try {
      if (input && typeof input.setRawMode === "function") input.setRawMode(true);
    } catch {
    }
    try {
      if (input && typeof input.resume === "function") input.resume();
    } catch {
    }
    if (signals && typeof signals.on === "function") {
      signals.on("SIGINT", onSignal);
      signals.on("SIGTERM", onSignal);
      signals.on("SIGHUP", onSignal);
      signals.on("uncaughtException", onUncaught);
      signals.on("unhandledRejection", onUncaught);
      signals.on("exit", onExitEvt);
    }
    if (output && typeof output.write === "function") output.write(ENTER_ALT + HIDE_CURSOR);
  }
  return {
    enter,
    cleanup,
    get entered() {
      return entered;
    },
    get cleaned() {
      return cleaned;
    }
  };
}
function createBuffer(rows, cols) {
  const n = Math.max(0, rows) * Math.max(0, cols);
  const buf = new Array(n);
  for (let i = 0; i < n; i++) buf[i] = { ch: " ", fg: null, bg: null, attr: null };
  return buf;
}
function drawText(buf, cols, row, col, str, style = {}) {
  if (row < 0 || col < 0 || col >= cols) return;
  const maxLen = cols - col;
  if (maxLen <= 0) return;
  const points = Array.from(sanitizeLine(str));
  const text = points.length <= maxLen ? points : points.slice(0, Math.max(0, maxLen - 1)).concat("\u2026");
  const fg = style.fg ?? null;
  const bg = style.bg ?? null;
  const attr = style.attr ?? null;
  for (let i = 0; i < text.length && col + i < cols; i++) {
    const idx = row * cols + (col + i);
    if (idx < 0 || idx >= buf.length) break;
    buf[idx] = { ch: text[i], fg, bg, attr };
  }
}
function cellNe(a, b) {
  if (!a || !b) return true;
  return a.ch !== b.ch || a.fg !== b.fg || a.bg !== b.bg || a.attr !== b.attr;
}
function diff(prev, next, cols) {
  if (!Number.isInteger(cols) || cols <= 0) return [];
  const ops = [];
  const len = next.length;
  let run = null;
  for (let i = 0; i < len; i++) {
    const col = i % cols;
    const row = (i - col) / cols;
    if (col === 0 && run) {
      ops.push(run);
      run = null;
    }
    if (cellNe(prev[i], next[i])) {
      if (run && run.row === row && run.col + run.run.length === col) {
        run.run.push(next[i]);
      } else {
        if (run) ops.push(run);
        run = { row, col, run: [next[i]] };
      }
    } else if (run) {
      ops.push(run);
      run = null;
    }
  }
  if (run) ops.push(run);
  return ops;
}
function styleOf(cell) {
  const pre = (cell.attr || "") + (cell.fg || "") + (cell.bg || "");
  return pre;
}
function encode(ops) {
  if (!ops || ops.length === 0) return "";
  let out = "";
  let curRow = -1;
  let curCol = -1;
  for (const op of ops) {
    if (!Number.isInteger(op.row) || !Number.isInteger(op.col)) continue;
    if (op.row !== curRow || op.col !== curCol) {
      out += `\x1B[${op.row + 1};${op.col + 1}H`;
    }
    for (const cell of op.run) {
      const pre = styleOf(cell);
      out += pre ? pre + cell.ch + RESET : cell.ch;
    }
    curRow = op.row;
    curCol = op.col + op.run.length;
  }
  return out;
}
function createRenderer({
  write,
  output = typeof process !== "undefined" ? process.stdout : void 0,
  rows,
  cols
} = {}) {
  const doWrite = write || (output && output.write ? output.write.bind(output) : () => {
  });
  const fallback = readTermSize(output);
  let _rows = Number.isInteger(rows) && rows > 0 ? rows : fallback.rows;
  let _cols = Number.isInteger(cols) && cols > 0 ? cols : fallback.cols;
  let prev = createBuffer(_rows, _cols);
  return {
    render(nextBuf) {
      const s = encode(diff(prev, nextBuf, _cols));
      if (s) doWrite(s);
      prev = nextBuf;
    },
    /** Drop the previous frame so the next render repaints every cell. */
    invalidate() {
      prev = [];
    },
    /** Adopt new dimensions and force a full redraw on the next render. */
    resize(newRows, newCols) {
      _rows = newRows;
      _cols = newCols;
      prev = [];
    },
    get rows() {
      return _rows;
    },
    get cols() {
      return _cols;
    }
  };
}
function clampIndex(i, count) {
  if (count <= 0) return 0;
  if (i < 0) return 0;
  if (i >= count) return count - 1;
  return i | 0;
}
function createFocus(count, initial = 0) {
  let _count = Math.max(0, count | 0);
  let active = clampIndex(initial, _count);
  return {
    get active() {
      return active;
    },
    get count() {
      return _count;
    },
    set(i) {
      active = clampIndex(i, _count);
      return active;
    },
    next() {
      active = _count > 0 ? (active + 1) % _count : 0;
      return active;
    },
    prev() {
      active = _count > 0 ? (active - 1 + _count) % _count : 0;
      return active;
    },
    setCount(n) {
      _count = Math.max(0, n | 0);
      active = clampIndex(active, _count);
      return active;
    }
  };
}
function clampOffset(offset, contentLen, viewH, scrolloff = 0) {
  const so = Math.max(0, scrolloff | 0);
  const maxOffset = Math.max(0, contentLen - viewH + so);
  let o = Number.isFinite(offset) ? Math.trunc(offset) : 0;
  if (o < 0) o = 0;
  if (o > maxOffset) o = maxOffset;
  return o;
}
function scrollUp(offset, contentLen, viewH, scrolloff = 0, by = 1) {
  return clampOffset(offset - by, contentLen, viewH, scrolloff);
}
function scrollDown(offset, contentLen, viewH, scrolloff = 0, by = 1) {
  return clampOffset(offset + by, contentLen, viewH, scrolloff);
}
function readTermSize(out) {
  const o = out || (typeof process !== "undefined" ? process.stdout : void 0);
  const cols = o && Number.isInteger(o.columns) && o.columns > 0 ? o.columns : 80;
  const rows = o && Number.isInteger(o.rows) && o.rows > 0 ? o.rows : 24;
  return { rows, cols };
}
function wireResize({ output = typeof process !== "undefined" ? process.stdout : void 0, onResize } = {}) {
  const handler = () => {
    if (typeof onResize === "function") onResize(readTermSize(output));
  };
  let unsubscribe = () => {
  };
  if (output && typeof output.on === "function") {
    output.on("resize", handler);
    unsubscribe = () => {
      try {
        if (typeof output.removeListener === "function") output.removeListener("resize", handler);
      } catch {
      }
    };
  } else if (typeof process !== "undefined" && typeof process.on === "function") {
    process.on("SIGWINCH", handler);
    unsubscribe = () => {
      try {
        process.removeListener("SIGWINCH", handler);
      } catch {
      }
    };
  }
  return unsubscribe;
}
function detectColorLevel(env = {}, isTTY = false) {
  const force = String(env.FORCE_COLOR ?? "");
  const colorterm = String(env.COLORTERM ?? "").toLowerCase();
  const term = String(env.TERM ?? "").toLowerCase();
  if (force === "3") return "truecolor";
  if (force === "2") return "256";
  if (colorterm === "truecolor" || colorterm === "24bit") return "truecolor";
  if (term.includes("256")) return "256";
  if (env.NO_COLOR != null && env.NO_COLOR !== "" || term === "dumb" || term === "") return "16";
  if (!isTTY && force === "") return "16";
  return "16";
}
var PALETTE = {
  truecolor: {
    bg: "\x1B[48;2;13;17;23m",
    panel: "\x1B[48;2;22;27;34m",
    rule: "\x1B[38;2;48;54;61m",
    text: "\x1B[38;2;201;209;217m",
    muted: "\x1B[38;2;125;133;144m",
    accent: "\x1B[38;2;88;166;255m",
    "accent-bright": "\x1B[38;2;121;192;255m",
    green: "\x1B[38;2;63;185;80m",
    amber: "\x1B[38;2;210;153;34m"
  },
  256: {
    bg: "\x1B[48;5;233m",
    panel: "\x1B[48;5;235m",
    rule: "\x1B[38;5;240m",
    text: "\x1B[38;5;252m",
    muted: "\x1B[38;5;245m",
    accent: "\x1B[38;5;75m",
    "accent-bright": "\x1B[38;5;117m",
    green: "\x1B[38;5;71m",
    amber: "\x1B[38;5;178m"
  },
  16: {
    bg: "\x1B[40m",
    panel: "\x1B[100m",
    rule: "\x1B[90m",
    text: "\x1B[37m",
    muted: "\x1B[90m",
    accent: "\x1B[94m",
    "accent-bright": "\x1B[96m",
    green: "\x1B[92m",
    amber: "\x1B[93m"
  }
};
var COLOR_ROLES = Object.keys(PALETTE.truecolor);
function degrade(role, level = "truecolor") {
  const table = PALETTE[level] || PALETTE["16"];
  return table[role] || "";
}
function hexToRgb(hex) {
  const h = String(hex).replace(/^#/, "");
  const n = parseInt(h, 16);
  return { r: n >> 16 & 255, g: n >> 8 & 255, b: n & 255 };
}
var CUBE_STEPS = [0, 95, 135, 175, 215, 255];
function nearestCubeStep(v) {
  let best = 0;
  let bestDist = Infinity;
  for (let i = 0; i < CUBE_STEPS.length; i++) {
    const d = Math.abs(CUBE_STEPS[i] - v);
    if (d < bestDist) {
      bestDist = d;
      best = i;
    }
  }
  return best;
}
function rgbTo256(r, g, b) {
  return 16 + 36 * nearestCubeStep(r) + 6 * nearestCubeStep(g) + nearestCubeStep(b);
}
function gradientFg(stops, t, level = "truecolor") {
  if (level === "16") return degrade("accent-bright", level);
  if (!Array.isArray(stops) || stops.length === 0) return "";
  if (stops.length === 1) {
    const { r: r2, g: g2, b: b2 } = hexToRgb(stops[0]);
    return level === "256" ? `\x1B[38;5;${rgbTo256(r2, g2, b2)}m` : `\x1B[38;2;${r2};${g2};${b2}m`;
  }
  const clamped = Math.max(0, Math.min(1, Number.isFinite(t) ? t : 0));
  const seg = clamped * (stops.length - 1);
  const i0 = Math.min(stops.length - 2, Math.floor(seg));
  const localT = seg - i0;
  const c0 = hexToRgb(stops[i0]);
  const c1 = hexToRgb(stops[i0 + 1]);
  const r = Math.round(c0.r + (c1.r - c0.r) * localT);
  const g = Math.round(c0.g + (c1.g - c0.g) * localT);
  const b = Math.round(c0.b + (c1.b - c0.b) * localT);
  return level === "256" ? `\x1B[38;5;${rgbTo256(r, g, b)}m` : `\x1B[38;2;${r};${g};${b}m`;
}
export {
  BOLD,
  BOLD_OFF,
  CLEAR,
  COLOR_ROLES,
  ENTER_ALT,
  EXIT_ALT,
  HIDE_CURSOR,
  INVERSE,
  KEY_BACKSPACE_A,
  KEY_BACKSPACE_B,
  KEY_CTRL_C,
  KEY_DIGITS,
  KEY_DOWN,
  KEY_ENTER_A,
  KEY_ENTER_B,
  KEY_ESC,
  KEY_LEFT,
  KEY_Q,
  KEY_RIGHT,
  KEY_TAB,
  KEY_UP,
  RESET,
  SHOW_CURSOR,
  clampOffset,
  createBuffer,
  createFocus,
  createRenderer,
  createRuntime,
  degrade,
  detectColorLevel,
  diff,
  drawText,
  encode,
  gradientFg,
  hexToRgb,
  readTermSize,
  rgbTo256,
  sanitizeLine,
  scrollDown,
  scrollUp,
  truncate,
  wireResize
};
