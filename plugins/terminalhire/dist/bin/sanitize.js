// bin/sanitize.js
var WHITESPACE_CONTROLS = /[\t\n\v\f\r]+/g;
var CONTROL_CHARS = /[\x00-\x1f\x7f-\x9f]/g;
function sanitizeText(s) {
  if (s == null) return "";
  return String(s).replace(WHITESPACE_CONTROLS, " ").replace(CONTROL_CHARS, "");
}
function formatUsd(a) {
  if (typeof a === "number") return Number.isFinite(a) ? "$" + a.toLocaleString() : "$\u2014";
  if (typeof a !== "string" || a.trim() === "") return "$\u2014";
  const n = Number(a);
  return Number.isFinite(n) ? "$" + n.toLocaleString() : "$\u2014";
}
function safeHttpUrl(url) {
  if (url == null) return null;
  const raw = String(url);
  CONTROL_CHARS.lastIndex = 0;
  if (CONTROL_CHARS.test(raw)) return null;
  let parsed;
  try {
    parsed = new URL(raw);
  } catch {
    return null;
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
  return parsed.href;
}
function linkTitle(title, url) {
  const safeTitle = sanitizeText(title);
  const href = safeHttpUrl(url);
  const isTTY = process.stdout.isTTY;
  const noColor = process.env["NO_COLOR"] !== void 0;
  if (isTTY && !noColor && href) {
    return `\x1B]8;;${href}\x1B\\${safeTitle}\x1B]8;;\x1B\\`;
  }
  return href ? `${safeTitle} (${href})` : safeTitle;
}
export {
  formatUsd,
  linkTitle,
  safeHttpUrl,
  sanitizeText
};
