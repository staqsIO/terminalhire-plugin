// bin/founder-bounty-notify.js
import { spawn } from "child_process";

// bin/founder-pin.js
function isPinnedFounderBounty(j) {
  return j?.bounty?.bountySource === "founder" && j?.bounty?.claimable === true;
}

// bin/founder-paid-badge.js
function openPaidIds(index) {
  const jobs = index && index.jobs || [];
  const ids = [];
  for (const j of jobs) {
    if (!j || typeof j.id !== "string") continue;
    if (isPinnedFounderBounty(j)) ids.push(j.id);
  }
  return [...new Set(ids)].sort();
}

// bin/founder-bounty-notify.js
function nextFounderBountyNotifyState(index, previous) {
  const open = openPaidIds(index);
  const prior = previous && Array.isArray(previous.ids) ? previous.ids : null;
  if (prior === null) {
    return { ids: open, fire: [], seeded: true };
  }
  const seen = new Set(prior);
  const fire = open.filter((id) => !seen.has(id));
  const ids = [.../* @__PURE__ */ new Set([...prior.filter((id) => open.includes(id)), ...fire])].sort();
  return { ids, fire, seeded: false };
}
function formatFounderBountyNotifyBody(index, fireIds) {
  const jobs = index && index.jobs || [];
  const byId = /* @__PURE__ */ new Map();
  for (const j of jobs) {
    if (j && typeof j.id === "string") byId.set(j.id, j);
  }
  if (fireIds.length === 1) {
    const j = byId.get(fireIds[0]);
    const amount = j && j.bounty && typeof j.bounty.amountUSD === "number" ? j.bounty.amountUSD : null;
    const price = typeof amount === "number" && Number.isFinite(amount) && amount > 0 ? `$${Math.round(amount)} ` : "";
    return `${price}founder bounty available \u2014 run: terminalhire bounties`;
  }
  return `${fireIds.length} founder bounties available \u2014 run: terminalhire bounties`;
}
function escapeAppleScriptString(s) {
  return String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
function displayLocalNotification({
  title = "Terminalhire",
  body,
  platform = process.platform,
  spawnFn = spawn
} = {}) {
  if (!body || typeof body !== "string") return false;
  try {
    if (platform === "darwin") {
      const t = escapeAppleScriptString(title);
      const b = escapeAppleScriptString(body);
      const child = spawnFn("osascript", ["-e", `display notification "${b}" with title "${t}"`], {
        detached: true,
        stdio: "ignore"
      });
      if (child && typeof child.unref === "function") child.unref();
      return true;
    }
    if (platform === "win32") {
      const safeTitle = String(title).replace(/'/g, "''");
      const safeBody = String(body).replace(/'/g, "''");
      const ps = `
Add-Type -AssemblyName System.Windows.Forms
$n = New-Object System.Windows.Forms.NotifyIcon
$n.Icon = [System.Drawing.SystemIcons]::Information
$n.Visible = $true
$n.ShowBalloonTip(8000, '${safeTitle}', '${safeBody}', [System.Windows.Forms.ToolTipIcon]::Info)
Start-Sleep -Seconds 9
$n.Dispose()
`.trim();
      const child = spawnFn("powershell.exe", ["-NoProfile", "-Command", ps], {
        detached: true,
        stdio: "ignore",
        windowsHide: true
      });
      if (child && typeof child.unref === "function") child.unref();
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
function maybeNotifyFounderBounties({
  index,
  previous,
  optedIn,
  display = displayLocalNotification
} = {}) {
  if (!optedIn) {
    const ids = previous && Array.isArray(previous.ids) ? [...previous.ids].sort() : [];
    return { state: { ids }, fired: [] };
  }
  const next = nextFounderBountyNotifyState(index, previous);
  if (next.fire.length > 0) {
    display({
      title: "Terminalhire",
      body: formatFounderBountyNotifyBody(index, next.fire)
    });
  }
  return { state: { ids: next.ids }, fired: next.fire };
}
export {
  displayLocalNotification,
  escapeAppleScriptString,
  formatFounderBountyNotifyBody,
  maybeNotifyFounderBounties,
  nextFounderBountyNotifyState
};
