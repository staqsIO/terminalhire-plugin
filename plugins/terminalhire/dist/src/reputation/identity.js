// src/reputation/identity.ts
import { execFile } from "child_process";
import { promisify } from "util";
var execFileAsync = promisify(execFile);
async function resolveCallerIdentity() {
  try {
    const { stdout } = await execFileAsync("gh", ["api", "user"], { timeout: 1e4 });
    const u = JSON.parse(stdout);
    if (typeof u.id === "number" && typeof u.login === "string" && u.login.length > 0) {
      return { id: u.id, login: u.login };
    }
    return null;
  } catch {
    return null;
  }
}
export {
  resolveCallerIdentity
};
