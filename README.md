# create-react-layout

## What's the pain point?

When starting a React project, building the initial `src/components` structure is repetitive and slow. Creating folders one by one, naming every component correctly, switching between `.jsx` and `.tsx`, and avoiding duplicate files turns simple setup into busy work.

## How do I solve it?

`create-react-layout` is an interactive CLI that scaffolds your React component folders and `.jsx`/`.tsx` files directly inside `src/`. It guides you through the structure in the terminal, normalizes component names, supports both JavaScript and TypeScript, and skips anything that already exists so setup stays fast and safe.

---

## Features

- **Dynamic Folder & File Creation**: Recursively add as many subfolders and components as you need.
- **Smart File Naming**: Enter component names in any case or with/without `.jsx`/`.tsx`; the CLI normalizes to `PascalCase.jsx` or `PascalCase.tsx`.
- **JavaScript & TypeScript Support**: Choose between JSX and TSX output at startup.
- **Safety Checks**: Skips existing directories or files without overwriting.
- **Colorized Console Output**: Clear, professional messages with distinct colors for creations vs. skips.

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (bundled with Node.js)

---

## Installation

Install globally from npm:

```bash
npm install -g create-react-layout
```

Install from GitHub Packages:

```bash
npm install -g @adnanrahim110/create-react-layout
```

---

## Usage

Navigate to your React project root:

```bash
cd path/to/your-project
```

Run the scaffolder:

```bash
create-react-layout
```

Follow the prompts:

1. Select language: JavaScript (JSX) or TypeScript (TSX).
2. Specify root folder under `src/` (default: `components`).
3. At each level, choose to add a folder, add a component, or finish.
4. Enter names for folders or components (comma-separated supported).

Result: A mirrored folder structure under `src/` with `.jsx` or `.tsx` components populated by a standard React boilerplate.

---

### Example Session

```bash
$ create-react-layout

🚀 Starting React scaffolding...

? Select language:
  ❯ JavaScript (JSX)
    TypeScript (TSX)

? Specify root folder under src/: (components)
📂 Directory created: src/components

src/components ➡ Choose action:
❯ 📁 Add Folder
  📄 Add Component
  ✅ Done

? Enter new folder name: ui
📂 Directory created: src/components/ui

src/components/ui ➡ Choose action:
  📁 Add Folder
❯ 📄 Add Component
  ✅ Done

? Enter component name(s) (comma-separated): button, card
📄 Component file created: src/components/ui/Button.jsx
📄 Component file created: src/components/ui/Card.jsx

… (and so on) …

🎉 Scaffolding completed successfully!
```

---

### Uninstall

```bash
npm uninstall -g create-react-layout
```

To uninstall the GitHub Packages version:

```bash
npm uninstall -g @adnanrahim110/create-react-layout
```

---

## Publish To GitHub Packages

GitHub's npm registry requires a scoped package name, so this project keeps the npmjs package as `create-react-layout` and publishes a GitHub Packages version as `@adnanrahim110/create-react-layout`.

1. Create a GitHub personal access token (classic) with `write:packages` and `read:packages`.
2. Authenticate npm against GitHub Packages:

```bash
npm login --scope=@adnanrahim110 --auth-type=legacy --registry=https://npm.pkg.github.com
```

3. Publish to GitHub Packages:

```bash
npm run publish:github
```

Dry-run first if you want to preview the package contents:

```bash
npm run publish:github -- --dry-run
```

If you need to install the GitHub Packages version in another project, make sure npm knows that the `@adnanrahim110` scope comes from GitHub Packages:

```bash
@adnanrahim110:registry=https://npm.pkg.github.com
```

GitHub Packages makes the first published version private by default. You can change package visibility from the package settings on GitHub after the first publish.

---

## About Me

**Adnan Rahim** — Full-Stack Web Developer & AI Enthusiast

🎓 B.Sc. in Cyber Security @ Iqra University, Karachi
💻 Web Development @ Aptech Learning Institute (2021–23)
🏢 Full-Stack Developer @ Atraa Technologies

**Connect:**

📧 adnankaka.786110@gmail.com
🔗 LinkedIn: https://www.linkedin.com/in/adnanrahim110/

© 2026 Adnan Rahim. MIT License
