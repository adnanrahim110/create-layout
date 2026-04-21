#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const rootDir = path.resolve(__dirname, "..");
const packageJsonPath = path.join(rootDir, "package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
const version = packageJson.version;
const tag = `v${version}`;

function runGit(args, options = {}) {
  return execFileSync("git", args, {
    cwd: rootDir,
    encoding: "utf8",
    stdio: options.stdio || "pipe",
  });
}

try {
  const status = runGit(["status", "--porcelain"]).trim();

  if (status) {
    console.error("Working tree is not clean. Commit or stash changes before tagging a release.");
    process.exit(1);
  }

  let tagExists = false;

  try {
    runGit(["rev-parse", "-q", "--verify", `refs/tags/${tag}`]);
    tagExists = true;
  } catch {
    tagExists = false;
  }

  if (tagExists) {
    console.error(`Tag ${tag} already exists.`);
    process.exit(1);
  }

  runGit(["tag", "-a", tag, "-m", `release: ${tag}`], { stdio: "inherit" });

  console.log(`Created tag ${tag}.`);
  console.log(`Next: git push origin ${tag}`);
} catch (error) {
  if (error && error.message) {
    console.error(error.message);
  }
  process.exit(1);
}
