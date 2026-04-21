#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

function readTagFromEventPayload() {
  const eventPath = process.env.GITHUB_EVENT_PATH;

  if (!eventPath || !fs.existsSync(eventPath)) {
    return "";
  }

  try {
    const payload = JSON.parse(fs.readFileSync(eventPath, "utf8"));
    return payload?.release?.tag_name || "";
  } catch {
    return "";
  }
}

function resolveTagName() {
  if (process.env.TAG_NAME) {
    return process.env.TAG_NAME;
  }

  if (process.env.GITHUB_REF_NAME) {
    return process.env.GITHUB_REF_NAME;
  }

  if (process.env.GITHUB_REF && process.env.GITHUB_REF.startsWith("refs/tags/")) {
    return process.env.GITHUB_REF.replace("refs/tags/", "");
  }

  return readTagFromEventPayload();
}

const rootDir = path.resolve(__dirname, "..");
const packageJsonPath = path.join(rootDir, "package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
const version = packageJson.version;
const actualTag = resolveTagName();
const expectedTag = `v${version}`;

if (!actualTag) {
  console.error("Cannot determine release tag name from workflow context.");
  process.exit(1);
}

if (actualTag !== expectedTag) {
  console.error(
    `Tag/version mismatch. package.json version is ${version}, but tag is ${actualTag}. Expected ${expectedTag}.`
  );
  process.exit(1);
}

console.log(`Tag check passed: ${actualTag} matches package.json version ${version}.`);
