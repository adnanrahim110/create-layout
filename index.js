#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const _chalk = require("chalk");
const chalk = _chalk.default || _chalk;
const prompt = inquirer.createPromptModule();

const baseDir = process.cwd();
const srcDir = path.join(baseDir, "src");

function getBoilerplate(componentName) {
  return `import React from "react";

const ${componentName} = () => {
  return <div></div>;
};

export default ${componentName};
`;
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
  let name = raw.trim().replace(/\.jsx$/i, "");
  name = name.charAt(0).toUpperCase() + name.slice(1);
  return `${name}.jsx`;
}

async function buildTree(currentPath) {
  while (true) {
    const { choice } = await prompt({
      type: "list",
      name: "choice",
      message: chalk.cyan(path.relative(baseDir, currentPath) + " ➡ Choose action:"),
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
        validate: v => v.trim() ? true : "Name cannot be empty"
      });
      const newDir = path.join(currentPath, folderName.trim());
      ensureDir(newDir);
      await buildTree(newDir);

    } else {
      const { rawName } = await prompt({
        type: "input",
        name: "rawName",
        message: chalk.blue("Enter component name:"),
        validate: v => v.trim() ? true : "Name cannot be empty"
      });
      const filename = sanitizeFileName(rawName);
      const componentName = filename.replace(/\.jsx$/, "");
      const filePath = path.join(currentPath, filename);
      createFile(filePath, componentName);
    }
  }
}

(async () => {
  console.log(chalk.blue.bold("\n🚀 Starting React scaffolding...\n"));
  ensureDir(srcDir);

  const { root } = await prompt({
    type: "input",
    name: "root",
    message: chalk.blue("Specify root folder under src/:"),
    default: "components",
    validate: v => v.trim() ? true : "Name cannot be empty"
  });

  const rootPath = path.join(srcDir, root.trim());
  ensureDir(rootPath);
  await buildTree(rootPath);

  console.log(chalk.green.bold("\n🎉 Scaffolding completed successfully!\n"));
})();
