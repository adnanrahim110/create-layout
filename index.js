#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const _chalk = require("chalk");
const chalk = _chalk.default || _chalk;
const prompt = inquirer.createPromptModule();

const baseDir = process.cwd();
const srcDir = path.join(baseDir, "src");

// will be set to 'jsx' or 'tsx' based on user choice
let fileExt = "jsx";

function getBoilerplate(componentName) {
  if (fileExt === "tsx") {
    return `import React from "react";

const ${componentName}: React.FC = () => {
  return <div></div>;
};

export default ${componentName};
`;
  } else {
    return `import React from "react";

const ${componentName} = () => {
  return <div></div>;
};

export default ${componentName};
`;
  }
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(
      chalk.green("📂 Directory created:"),
      chalk.white(path.relative(baseDir, dirPath))
    );
  } else {
    console.log(
      chalk.gray("📂 Directory exists, skipping:"),
      chalk.white(path.relative(baseDir, dirPath))
    );
  }
}

function createFile(filePath, componentName) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, getBoilerplate(componentName));
    console.log(
      chalk.green("📄 Component file created:"),
      chalk.white(path.relative(baseDir, filePath))
    );
  } else {
    console.log(
      chalk.gray("📄 Component exists, skipping:"),
      chalk.white(path.relative(baseDir, filePath))
    );
  }
}

function sanitizeFileName(raw) {
  let name = raw.trim();
  // strip any trailing .jsx/.tsx the user might have typed
  const regex = new RegExp(`\\.${fileExt}$`, "i");
  name = name.replace(regex, "");
  // capitalize first letter
  name = name.charAt(0).toUpperCase() + name.slice(1);
  return `${name}.${fileExt}`;
}

async function buildTree(currentPath) {
  while (true) {
    const { choice } = await prompt({
      type: "list",
      name: "choice",
      message:
        chalk.cyan(path.relative(baseDir, currentPath)) + " ➡ Choose action:",
      choices: [
        { name: "📁 Add Folder", value: "folder" },
        { name: "📄 Add Component", value: "file" },
        { name: "✅ Done", value: "done" }
      ]
    });

    if (choice === "done") return;

    if (choice === "folder") {
      const { folderName } = await prompt({
        type: "input",
        name: "folderName",
        message: chalk.blue("Enter new folder name:"),
        validate: v => (v.trim() ? true : "Name cannot be empty")
      });
      const newDir = path.join(currentPath, folderName.trim());
      ensureDir(newDir);
      await buildTree(newDir);

    } else {
      // accept multiple comma-separated component names
      const { rawNames } = await prompt({
        type: "input",
        name: "rawNames",
        message: chalk.blue(
          "Enter component name(s) (comma-separated):"
        ),
        validate: v => (v.trim() ? true : "Name cannot be empty")
      });

      rawNames
        .split(",")
        .map(n => n.trim())
        .filter(n => n.length > 0)
        .forEach(rawName => {
          const filename = sanitizeFileName(rawName);
          const componentName = filename.replace(
            new RegExp(`\\.${fileExt}$`),
            ""
          );
          const filePath = path.join(currentPath, filename);
          createFile(filePath, componentName);
        });
    }
  }
}

(async () => {
  console.log(chalk.blue.bold("\n🚀 Starting React scaffolding...\n"));

  // ask once whether to scaffold JSX or TSX
  const { language } = await prompt({
    type: "list",
    name: "language",
    message: chalk.blue("Select language:"),
    choices: [
      { name: "JavaScript (JSX)", value: "jsx" },
      { name: "TypeScript (TSX)", value: "tsx" }
    ],
    default: "jsx"
  });
  fileExt = language;

  ensureDir(srcDir);

  const { root } = await prompt({
    type: "input",
    name: "root",
    message: chalk.blue("Specify root folder under src/:"),
    default: "components",
    validate: v => (v.trim() ? true : "Name cannot be empty")
  });

  const rootPath = path.join(srcDir, root.trim());
  ensureDir(rootPath);
  await buildTree(rootPath);

  console.log(chalk.green.bold("\n🎉 Scaffolding completed successfully!\n"));
})();
