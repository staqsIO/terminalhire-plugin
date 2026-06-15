#!/usr/bin/env node

// bin/jpi-init.js
import { existsSync } from "fs";
import { join, resolve } from "path";
import { fileURLToPath } from "url";
import { createInterface } from "readline";
import { spawnSync, spawn } from "child_process";
import { homedir } from "os";
var __dirname = fileURLToPath(new URL(".", import.meta.url));
function ask(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve2) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve2(answer.trim().toLowerCase());
    });
  });
}
function resolveScript(name) {
  const distPath = resolve(join(__dirname, "..", "..", "dist", "bin", `${name}.js`));
  const legacyPath = resolve(join(__dirname, `${name}.js`));
  return existsSync(distPath) ? distPath : legacyPath;
}
function resolveInstallJs() {
  const fromDist = resolve(join(__dirname, "..", "..", "install.js"));
  const fromBin = resolve(join(__dirname, "..", "install.js"));
  if (existsSync(fromDist)) return fromDist;
  if (existsSync(fromBin)) return fromBin;
  return fromBin;
}
async function run() {
  console.log("");
  console.log("\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510");
  console.log("\u2502           terminalhire init \u2014 one-command onboarding            \u2502");
  console.log("\u2502       Local-first job matching for developers in Claude Code     \u2502");
  console.log("\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518");
  console.log("");
  console.log("This will:");
  console.log("  1. Optionally sign you in with GitHub (public profile only, read:user)");
  console.log("  2. Seed your local job cache (anonymous index download)");
  console.log("  3. Enable the ambient spinner job surface in ~/.claude/settings.json");
  console.log("     (with backup + your explicit consent before any file is touched)");
  console.log("");
  console.log('You can stop at any step. Nothing is changed until you say "yes".');
  console.log("");
  console.log("Step 1/3 \u2014 GitHub sign-in (optional but recommended)");
  console.log("");
  console.log("  Scope: read:user \u2014 public profile + public repos only.");
  console.log("  Your token is encrypted at ~/.terminalhire/github-token.enc.");
  console.log("  GitHub data enriches your local profile. Nothing leaves your machine");
  console.log("  until you explicitly consent to a specific lead.");
  console.log("");
  const githubAnswer = await ask("Sign in with GitHub now? [Y/n] (Enter = yes, n = stay local): ");
  const doGitHub = githubAnswer === "" || githubAnswer === "y" || githubAnswer === "yes";
  if (doGitHub) {
    console.log("");
    console.log("  Starting GitHub device flow...");
    const loginScript = resolveScript("jpi-login");
    const child = spawnSync(process.execPath, [loginScript, "login"], {
      stdio: ["inherit", "inherit", "inherit"],
      env: process.env
    });
    if (child.status !== 0) {
      console.log("");
      console.log("  GitHub sign-in did not complete. Continuing without GitHub.");
      console.log("  You can sign in any time with: terminalhire login");
    }
  } else {
    console.log("");
    console.log("  Staying local-only. Tags accumulate from your personal project sessions.");
    console.log("  Sign in any time with: terminalhire login");
  }
  console.log("");
  console.log("Step 2/3 \u2014 Seeding local job cache");
  console.log("");
  console.log("  Fetching anonymous job index (no dev data sent)...");
  const jobsScript = resolveScript("jpi-jobs");
  const seedChild = spawnSync(
    process.execPath,
    [jobsScript, "--limit", "0"],
    {
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, TERMINALHIRE_SEED_ONLY: "1" },
      timeout: 15e3
    }
  );
  if (seedChild.status === 0) {
    console.log("  Job cache seeded successfully.");
  } else {
    console.log("  Could not seed job cache right now (no profile tags yet, or offline).");
    console.log("  Run `terminalhire jobs` after a few Claude Code sessions to populate it.");
  }
  console.log("");
  console.log("Step 3/3 \u2014 Enable the ambient spinner job surface in ~/.claude/settings.json");
  console.log("");
  console.log("  This is the only step that modifies a system file.");
  console.log("  A timestamped backup is created before any change.");
  console.log("  Disable at any time: node install.js --uninstall  (or terminalhire spinner --off)");
  console.log("");
  const installJs = resolveInstallJs();
  const installChild = spawnSync(process.execPath, [installJs], {
    stdio: ["inherit", "inherit", "inherit"],
    env: process.env
  });
  if (installChild.status !== 0) {
    console.log("");
    console.log("  Hook installation did not complete. Run manually: node install.js");
  }
  console.log("");
  console.log("\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510");
  console.log("\u2502  terminalhire init complete!                                    \u2502");
  console.log("\u2502                                                                  \u2502");
  console.log("\u2502  Restart Claude Code to see the ambient spinner job surface.    \u2502");
  console.log("\u2502                                                                  \u2502");
  console.log("\u2502  Quick reference:                                               \u2502");
  console.log("\u2502    terminalhire jobs          \u2014 browse matching roles           \u2502");
  console.log("\u2502    terminalhire spinner --off \u2014 disable the spinner surface     \u2502");
  console.log("\u2502    terminalhire login         \u2014 sign in with GitHub             \u2502");
  console.log("\u2502    terminalhire profile --show \u2014 inspect your local profile     \u2502");
  console.log("\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518");
  console.log("");
}
export {
  run
};
