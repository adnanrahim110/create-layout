# create-react-layout

Interactive CLI tool to scaffold React component directories and `.jsx`/`.tsx` files under your `src/` folder. `create-react-layout` makes project setup lightning-fast by guiding you through a dynamic folder/file tree builder right in your terminal.

---

## Features

- **Dynamic Folder & File Creation**: Recursively add as many subfolders and components as you need.
- **Smart File Naming**: Enter component names in any case or with/without `.jsx`/`.tsx`; the CLI normalizes to `PascalCase.jsx` or `PascalCase.tsx`.
- **JavaScript & TypeScript Support**: Choose between JSX and TSX output at startup.
- **Safety Checks**: Skips existing directories or files without overwriting.
- **Colorized Console Output**: Clear, professional messages with distinct colors for creations vs. skips.

---

## Prerequisites

- [Node.js](https://nodejs.org/) v14 or higher
- npm (bundled with Node.js)

---

## Installation

Install globally from npm:

```bash
npm install -g create-react-layout
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

---

## About Me

**Adnan Rahim** — Full-Stack Web Developer & AI Enthusiast

🎓 B.Sc. in Artificial Intelligence @ KIET University, Karachi
💻 Web Development @ Aptech Learning Institute (2021–23)
🏢 Full-Stack Developer @ Atraa Technologies

**Connect:**

📧 adnankaka.786110@gmail.com
🌐 GitHub
🔗 LinkedIn
📸 Instagram

© 2025 Adnan Rahim. MIT License
