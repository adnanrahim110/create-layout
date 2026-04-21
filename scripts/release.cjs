#!/usr/bin/env node

const { execFileSync } = require("child_process");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const allowedTypes = new Set(["patch", "minor", "major", "prepatch", "preminor", "premajor", "prerelease"]);
const releaseType = process.argv[2] || "patch";

if (!allowedTypes.has(releaseType)) {
  console.error(
    `Invalid release type: ${releaseType}. Use one of: ${Array.from(allowedTypes).join(", ")}.`
  );
  process.exit(1);
}

function run(command, args) {
  execFileSync(command, args, {
    cwd: rootDir,
    stdio: "inherit",
  });
}

try {
  run("npm", ["version", releaseType, "-m", "release: v%s"]);
  run("git", ["push"]);
  run("git", ["push", "--tags"]);

  console.log("Release completed: version bumped, tag created, branch and tags pushed.");
} catch {
  process.exit(1);
}
