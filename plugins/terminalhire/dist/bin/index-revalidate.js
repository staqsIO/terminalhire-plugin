// bin/index-revalidate.js
var PULSE_TIMEOUT_MS = 2e3;
var INDEX_TIMEOUT_WARM_MS = 5e3;
var INDEX_TIMEOUT_COLD_MS = 1e4;
function usableMember(member) {
  return typeof member === "object" && member !== null && !Array.isArray(member) && Array.isArray(member.tags);
}
function usableIndex(index) {
  if (!index || typeof index !== "object" || Array.isArray(index)) return false;
  if (!Array.isArray(index.jobs) || !index.jobs.every(usableMember)) return false;
  if (index.contribute !== void 0) {
    if (!Array.isArray(index.contribute) || !index.contribute.every(usableMember)) return false;
  }
  return true;
}
function deadlineFetch(fetchImpl, url, { headers, timeoutMs }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new Error("deadline exceeded")), timeoutMs);
  timer.unref?.();
  const promise = Promise.resolve(fetchImpl(url, { headers, signal: controller.signal })).finally(
    () => clearTimeout(timer)
  );
  return { promise, abort: () => controller.abort(new Error("superseded")) };
}
function cacheFallbackNotice(source, cachedAt, now = Date.now()) {
  if (source !== "cache-fallback") return null;
  const base = "terminalhire: could not refresh the list \u2014 showing cached results";
  if (typeof cachedAt !== "number" || !Number.isFinite(cachedAt)) return `${base}.`;
  const minutes = Math.floor(Math.max(0, now - cachedAt) / 6e4);
  if (minutes < 1) return `${base} from moments ago.`;
  if (minutes < 60) return `${base} from ${minutes}m ago.`;
  const hours = Math.floor(minutes / 60);
  return `${base} from ${hours}h ago.`;
}
async function revalidateIndex({
  apiUrl,
  fetchImpl,
  readEntry,
  writeEntry,
  pulseTimeoutMs = PULSE_TIMEOUT_MS,
  indexTimeoutWarmMs = INDEX_TIMEOUT_WARM_MS,
  indexTimeoutColdMs = INDEX_TIMEOUT_COLD_MS
}) {
  let entry = {};
  try {
    entry = readEntry() ?? {};
  } catch {
  }
  const cached = usableIndex(entry.index) ? entry.index : null;
  const cachedAt = cached && typeof entry.ts === "number" ? entry.ts : null;
  const indexTimeoutMs = cached ? indexTimeoutWarmMs : indexTimeoutColdMs;
  const headers = { Accept: "application/json" };
  if (cached && typeof entry.indexETag === "string" && entry.indexETag !== "") {
    headers["If-None-Match"] = entry.indexETag;
  }
  const pulseCall = deadlineFetch(fetchImpl, `${apiUrl}/api/pulse`, {
    headers: { Accept: "application/json" },
    timeoutMs: pulseTimeoutMs
  });
  const speculative = deadlineFetch(fetchImpl, `${apiUrl}/api/index`, {
    headers,
    timeoutMs: indexTimeoutMs
  });
  const speculativeSettled = speculative.promise.then(
    (res2) => ({ ok: true, res: res2 }),
    (err) => ({ ok: false, err })
  );
  let latestPostedAt = null;
  try {
    const res2 = await pulseCall.promise;
    if (res2.ok) {
      const pulse = await res2.json();
      latestPostedAt = pulse?.latestPostedAt ?? null;
    }
  } catch {
  }
  const bust = latestPostedAt !== null && entry.latestPostedAt !== latestPostedAt;
  let outcome;
  let reachedOrigin = false;
  if (bust) {
    speculative.abort();
    const bustCall = deadlineFetch(fetchImpl, `${apiUrl}/api/index`, {
      // `no-cache` forces revalidation against the origin; the validator rides along
      // so a genuinely unchanged body still costs a 304 rather than a full download.
      headers: { ...headers, "Cache-Control": "no-cache" },
      timeoutMs: indexTimeoutMs
    });
    try {
      outcome = { ok: true, res: await bustCall.promise };
      reachedOrigin = true;
    } catch (err) {
      const spec = await speculativeSettled;
      outcome = spec.ok ? spec : { ok: false, err };
    }
  } else {
    outcome = await speculativeSettled;
  }
  const fellBack = (reason) => cached ? { index: cached, source: "cache-fallback", reason, cachedAt } : { index: null, source: "none", reason, cachedAt };
  if (!outcome.ok) {
    const err = outcome.err;
    return fellBack(err instanceof Error ? err.message : String(err));
  }
  const res = outcome.res;
  try {
    if (res.status === 304 && cached) {
      if (reachedOrigin && latestPostedAt && latestPostedAt !== entry.latestPostedAt) {
        try {
          writeEntry({ latestPostedAt });
        } catch {
        }
      }
      return { index: cached, source: "cache-304", reason: null, cachedAt };
    }
    if (!res.ok) {
      return fellBack(`/api/index returned ${res.status}`);
    }
    const body = await res.json();
    if (!usableIndex(body)) {
      return fellBack("/api/index returned a body that will not render");
    }
    const patch = { index: body, indexETag: res.headers.get("etag") ?? "" };
    if (reachedOrigin && latestPostedAt) patch.latestPostedAt = latestPostedAt;
    try {
      writeEntry(patch);
    } catch {
    }
    return { index: body, source: "fresh", reason: null, cachedAt };
  } catch (err) {
    return fellBack(err instanceof Error ? err.message : String(err));
  }
}
export {
  INDEX_TIMEOUT_COLD_MS,
  INDEX_TIMEOUT_WARM_MS,
  PULSE_TIMEOUT_MS,
  cacheFallbackNotice,
  revalidateIndex
};
