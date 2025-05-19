# create-react-jsx-layout

Interactive CLI tool to scaffold React component directories and `.jsx` files under your `src/` folder. `create-react-jsx-layout` makes project setup lightning-fast by guiding you through a dynamic folder/file tree builder right in your terminal.

---

## Features

- **Dynamic Folder & File Creation**: Recursively add as many subfolders and components as you need.
- **Smart File Naming**: Enter component names in any case or with/without `.jsx`; the CLI normalizes to `PascalCase.jsx`.
- **Safety Checks**: Skips existing directories or files without overwriting.
- **Colorized Console Output**: Clear, professional messages with distinct colors for creation vs. skips.

---

## Prerequisites

- [Node.js](https://nodejs.org/) v14 or higher
- npm (comes bundled with Node.js)

---

## Installation

Install globally from npm:

```bash
npm install -g jsx-layout
```

[![npm version](https://badge.fury.io/js/jsx-layout.svg)](https://www.npmjs.com/package/jsx-layout)

Once installed, the `create-layout` command (from the `jsx-layout` package) becomes available in any project folder.

---

## Usage

1. **Navigate** to the root of your React project:

   ```bash
   cd path/to/your-project
   ```

2. **Run** the scaffolder:

   ```bash
   create-layout
   ```

3. **Follow the prompts**:

   - Specify the **root folder** under `src/` (default: `components`).
   - At each level, choose to **add a folder**, **add a component**, or **finish**.
   - Enter names for folders or components when prompted.

4. **Result**: Your `src/` directory will mirror your interactive choices, with `.jsx` files populated by a standard React boilerplate.

### Example Session

```bash
$ create-layout

🚀 Starting React scaffolding...

📂 Directory exists, skipping: src

Root folder under src/: components
📂 Directory created: src/components

src/components ➡ Choose action:
  › 📁 Add Folder
    📄 Add Component
    ✅ Done

# (Select "Add Folder")
Enter new folder name: ui
📂 Directory created: src/components/ui

src/components/ui ➡ Choose action:
    📁 Add Folder
  › 📄 Add Component
    ✅ Done

# (Select "Add Component")
Enter component name: button
📄 Component file created: src/components/ui/Button.jsx

src/components/ui ➡ Choose action:
    📁 Add Folder
    📄 Add Component
  › ✅ Done

… (and so on) …

🎉 Scaffolding completed successfully!
```

---

## Uninstall

```bash
npm uninstall -g create-react-jsx-layout
```

---

## About Me

**Adnan Rahim** — Full Stack Web Developer & AI Enthusiast

- 🎓 Pursuing **B.Sc. in Artificial Intelligence** at KIET University, Karachi.
- 💻 Completed **Web Development** program at Aptech Learning Institute (2021–23).
- 🏢 Currently at Atraa Technologies as a Full-Stack Developer, building engaging UIs and robust backends.
- 🛠️ Proficient in HTML/CSS, Bootstrap, Tailwind CSS, JavaScript, React.js, Node.js, Express.js, MongoDb, GSAP, PHP/MySQLi, and UI/UX tools like Figma & Adobe XD.

Feel free to connect:

- 📧 [adnankaka.786110@gmail.com](mailto:adnankaka.786110@gmail.com)
- 🌐 [GitHub](https://github.com/adnanrahim110)
- 🔗 [LinkedIn](https://www.linkedin.com/in/adnanrahim110)
- 📸 [Instagram](https://www.instagram.com/_.adnan._110/)

---

© 2025 Adnan Rahim. MIT License.

<small>**Disclaimer:** This tool leverages open-source packages like [chalk](https://github.com/chalk/chalk) and [inquirer](https://github.com/SBoudrias/Inquirer.js) under their respective licenses—feel free to explore these projects for powerful CLI styling and interactive prompts!</small>
