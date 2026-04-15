#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");

const rootDir = path.resolve(__dirname, "..");
const packageJsonPath = path.join(rootDir, "package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

function normalizeRepositoryUrl(repository) {
  if (!repository) {
    throw new Error("Missing repository field in package.json.");
  }

  const rawUrl =
    typeof repository === "string" ? repository : repository.url;

  if (!rawUrl) {
    throw new Error("package.json repository field must include a GitHub URL.");
  }

  return {
    normalized: rawUrl.replace(/^git\+/, ""),
    publishable: rawUrl.startsWith("git+") ? rawUrl : `git+${rawUrl}`,
  };
}

function parseGitHubOwner(repositoryUrl) {
  const match = repositoryUrl.match(
    /^https:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?$/
  );

  if (!match) {
    throw new Error(
      "Repository URL must look like https://github.com/OWNER/REPO.git."
    );
  }

  return {
    owner: match[1].toLowerCase(),
    repo: match[2],
  };
}

function basePackageName(name) {
  return name.startsWith("@") ? name.split("/")[1] : name;
}

function copyEntry(sourcePath, destinationPath) {
  const stats = fs.statSync(sourcePath);

  if (stats.isDirectory()) {
    fs.mkdirSync(destinationPath, { recursive: true });

    for (const entry of fs.readdirSync(sourcePath)) {
      copyEntry(
        path.join(sourcePath, entry),
        path.join(destinationPath, entry)
      );
    }

    return;
  }

  fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
  fs.copyFileSync(sourcePath, destinationPath);
}

function runNpm(args, cwd) {
  if (process.platform === "win32") {
    execFileSync(
      process.env.ComSpec || "cmd.exe",
      ["/d", "/s", "/c", ["npm", ...args].join(" ")],
      {
        cwd,
        stdio: "inherit",
      }
    );
    return;
  }

  execFileSync("npm", args, {
    cwd,
    stdio: "inherit",
  });
}

const repositoryUrl = normalizeRepositoryUrl(packageJson.repository);
const { owner } = parseGitHubOwner(repositoryUrl.normalized);
const scope = (process.env.GITHUB_PACKAGE_SCOPE || owner).toLowerCase();
const githubPackageName = `@${scope}/${basePackageName(packageJson.name)}`;
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "github-package-"));
const extraPublishArgs = process.argv.slice(2);
const isDryRun =
  extraPublishArgs.includes("--dry-run") ||
  extraPublishArgs.includes("--dryrun") ||
  process.env.npm_config_dry_run === "true";
const publishArgs = [
  "publish",
  "--registry=https://npm.pkg.github.com",
  ...extraPublishArgs,
];

if (
  isDryRun &&
  !publishArgs.includes("--dry-run") &&
  !publishArgs.includes("--dryrun")
) {
  publishArgs.push("--dry-run");
}

const publishManifest = {
  name: githubPackageName,
  version: packageJson.version,
  description: packageJson.description,
  main: packageJson.main,
  bin: packageJson.bin,
  keywords: packageJson.keywords,
  author: packageJson.author,
  license: packageJson.license,
  files: packageJson.files,
  dependencies: packageJson.dependencies,
  engines: packageJson.engines,
  repository: {
    type: "git",
    url: repositoryUrl.publishable,
  },
  publishConfig: {
    registry: "https://npm.pkg.github.com",
  },
};

try {
  fs.writeFileSync(
    path.join(tempDir, "package.json"),
    `${JSON.stringify(publishManifest, null, 2)}\n`
  );

  const filesToCopy = new Set(packageJson.files || []);

  if (packageJson.main) {
    filesToCopy.add(packageJson.main);
  }

  if (packageJson.bin) {
    for (const target of Object.values(packageJson.bin)) {
      filesToCopy.add(target);
    }
  }

  for (const entry of ["README.md", "README", "LICENSE", "LICENSE.md"]) {
    const sourcePath = path.join(rootDir, entry);

    if (fs.existsSync(sourcePath)) {
      filesToCopy.add(entry);
    }
  }

  for (const entry of filesToCopy) {
    const sourcePath = path.join(rootDir, entry);

    if (!fs.existsSync(sourcePath)) {
      throw new Error(`Cannot publish because "${entry}" does not exist.`);
    }

    copyEntry(sourcePath, path.join(tempDir, entry));
  }

  console.log(`Publishing ${githubPackageName} from ${tempDir}`);
  runNpm(publishArgs, tempDir);
  console.log(
    isDryRun
      ? `Dry run completed for ${githubPackageName}.`
      : `Published ${githubPackageName} successfully.`
  );
} finally {
  fs.rmSync(tempDir, { recursive: true, force: true });
}
