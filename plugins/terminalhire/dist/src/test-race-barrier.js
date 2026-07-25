// src/test-race-barrier.ts
import { closeSync, constants, existsSync, lstatSync, openSync } from "fs";
import { join } from "path";
var ENV_VAR = "TERMINALHIRE_TEST_RACE_BARRIER_DIR";
function syncSleepMs(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}
function waitForTestRaceBarrier(phase) {
  const root = process.env[ENV_VAR];
  if (!root) return;
  const phaseDir = join(root, phase);
  if (!existsSync(phaseDir)) return;
  const readyFile = join(phaseDir, `ready-${process.pid}`);
  const goFile = join(phaseDir, "go");
  const noFollow = constants.O_NOFOLLOW ?? 0;
  if (lstatSync(readyFile, { throwIfNoEntry: false })) {
    throw new Error(
      `terminalhire: test race barrier "${phase}" found something already at its ready marker path ${readyFile} (regular file or symlink) \u2014 refusing rather than following or overwriting whatever is already there (this only fires under ${ENV_VAR}, never in production).`
    );
  }
  let readyFd;
  try {
    readyFd = openSync(
      readyFile,
      constants.O_CREAT | constants.O_EXCL | constants.O_WRONLY | noFollow
    );
  } catch (err) {
    throw new Error(
      `terminalhire: test race barrier "${phase}" could not create its ready marker at ${readyFile} (${err instanceof Error ? err.message : String(err)}) \u2014 refusing rather than blocking on or writing through whatever is already there (this only fires under ${ENV_VAR}, never in production).`
    );
  }
  closeSync(readyFd);
  const deadline = Date.now() + 3e4;
  while (!existsSync(goFile)) {
    if (Date.now() > deadline) {
      throw new Error(
        `terminalhire: test race barrier "${phase}" timed out waiting for ${goFile} (the test process never released it \u2014 this only fires under ${ENV_VAR}, never in production).`
      );
    }
    syncSleepMs(2);
  }
}
export {
  waitForTestRaceBarrier
};
