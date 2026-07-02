#!/usr/bin/env node

// bin/jpi-init.js
import { existsSync } from "fs";
import { join, resolve } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { createInterface } from "readline";
import { spawnSync } from "child_process";
var __dirname = fileURLToPath(new URL(".", import.meta.url));
function resolveScript(name) {
  const distPath = resolve(join(__dirname, "..", "..", "dist", "bin", `${name}.js`));
  const legacyPath = resolve(join(__dirname, `${name}.js`));
  return existsSync(distPath) ? distPath : legacyPath;
}
function resolveSrc(name) {
  const distPath = resolve(join(__dirname, "..", "..", "dist", "src", `${name}.js`));
  const legacyPath = resolve(join(__dirname, "..", "src", `${name}.js`));
  return existsSync(distPath) ? distPath : legacyPath;
}
function resolveInstallJs() {
  const fromDist = resolve(join(__dirname, "..", "..", "install.js"));
  const fromBin = resolve(join(__dirname, "..", "install.js"));
  if (existsSync(fromDist)) return fromDist;
  if (existsSync(fromBin)) return fromBin;
  return fromBin;
}
function resolveStatuslineInstallJs() {
  const fromDist = resolve(join(__dirname, "..", "..", "statusline-install.js"));
  const fromBin = resolve(join(__dirname, "..", "statusline-install.js"));
  if (existsSync(fromDist)) return fromDist;
  if (existsSync(fromBin)) return fromBin;
  return fromBin;
}
async function run() {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const ask = (question) => new Promise((resolve2) => {
    let answered = false;
    rl.question(question, (answer) => {
      answered = true;
      resolve2((answer || "").trim().toLowerCase());
    });
    rl.once("close", () => {
      if (!answered) resolve2(null);
    });
  });
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
  console.log("  4. Optionally show connection notifications in your statusLine");
  console.log("     (\u{1F4AC} unread + intro requests only \u2014 never job ads; separate consent)");
  console.log("");
  console.log('You can stop at any step. Nothing is changed until you say "yes".');
  console.log("");
  console.log("Step 1/4 \u2014 GitHub sign-in (optional but recommended)");
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
    rl.pause();
    const child = spawnSync(process.execPath, [loginScript, "login"], {
      stdio: ["ignore", "inherit", "inherit"],
      env: { ...process.env, JPI_SKIP_PEER_PROMPT: "1" }
    });
    try {
      while (process.stdin.read() !== null) {
      }
    } catch {
    }
    rl.resume();
    if (child.status !== 0) {
      console.log("");
      console.log("  GitHub sign-in did not complete. Continuing without GitHub.");
      console.log("  You can sign in any time with: terminalhire login");
    } else {
      try {
        const { maybePromptPeerConnect } = await import(pathToFileURL(resolveScript("peer-connect-prompt")).href);
        let login;
        try {
          const { readProfile } = await import(pathToFileURL(resolveSrc("profile")).href);
          const prof = await readProfile();
          login = prof?.github?.login;
        } catch {
        }
        await maybePromptPeerConnect({ ask, login });
      } catch {
      }
    }
  } else {
    console.log("");
    console.log("  Staying local-only. Tags accumulate from your personal project sessions.");
    console.log("  Sign in any time with: terminalhire login");
  }
  console.log("");
  console.log("Step 2/4 \u2014 Seeding local job cache");
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
  console.log("Step 3/4 \u2014 Enable the ambient spinner job surface in ~/.claude/settings.json");
  console.log("");
  console.log("  This is the only step that modifies a system file.");
  console.log("  A timestamped backup is created before any change.");
  console.log("  Disable at any time: node install.js --uninstall  (or terminalhire spinner --off)");
  console.log("");
  try {
    const installMod = await import(pathToFileURL(resolveInstallJs()).href);
    if (typeof installMod.installSpinner === "function") {
      await installMod.installSpinner({ ask });
    } else {
      console.log("");
      console.log("  Hook installation unavailable in this build. Run manually: node install.js");
    }
  } catch {
    console.log("");
    console.log("  Hook installation did not complete. Run manually: node install.js");
  }
  console.log("");
  console.log("Step 4/4 \u2014 Connection notifications in your statusLine (optional)");
  console.log("");
  console.log("  A statusLine that shows ONLY personal connection signals \u2014 \u{1F4AC} unread");
  console.log("  messages and inbound intro requests. Never job ads (those stay in the");
  console.log("  spinner). Local cache read, zero network. Separate consent + backup;");
  console.log("  it stays current across plugin updates and preserves any existing");
  console.log("  statusLine you have. Remove any time: node statusline-install.js --uninstall");
  console.log("");
  try {
    const statuslineMod = await import(pathToFileURL(resolveStatuslineInstallJs()).href);
    if (typeof statuslineMod.installStatusline === "function") {
      await statuslineMod.installStatusline({ ask });
    } else {
      console.log("");
      console.log("  statusLine setup unavailable in this build. Run manually: node statusline-install.js");
    }
  } catch {
    console.log("");
    console.log("  statusLine setup did not complete. Run manually: node statusline-install.js");
  }
  rl.close();
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
