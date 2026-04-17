<div align="center">
  <img width="100%" alt="jsforge header" src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=24,20,14&height=220&section=header&text=jsforge&fontSize=64&fontColor=ffffff&fontAlignY=40&animation=fadeIn&desc=Universal+JS+Scaffolding+CLI+%E2%80%94+React+%C2%B7+Next.js+%C2%B7+Vue+%C2%B7+Nuxt+%C2%B7+Angular+%C2%B7+Express&descSize=18&descAlignY=62&descColor=d1fae5" />
</div>

<p align="center">
  <a href="https://www.npmjs.com/package/jsforge">
    <img src="https://img.shields.io/npm/v/jsforge?style=for-the-badge&logo=npm&logoColor=white&color=F97316" alt="npm version" />
  </a>
  <a href="https://www.npmjs.com/package/jsforge">
    <img src="https://img.shields.io/npm/dm/jsforge?style=for-the-badge&logo=npm&logoColor=white&color=F97316" alt="npm downloads" />
  </a>
  <a href="https://github.com/adnanrahim110/jsforge">
    <img src="https://img.shields.io/badge/GitHub-Repository-0F172A?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  </a>
  <img src="https://img.shields.io/badge/Node-18%2B-14B8A6?style=for-the-badge&logo=node.js&logoColor=white" alt="Node 18+" />
  <img src="https://img.shields.io/badge/License-MIT-0EA5E9?style=for-the-badge" alt="MIT" />
</p>

<p align="center">
  <b>One CLI that scaffolds everything.</b><br/>
  Components, hooks, pages, routes, services, stores, guards and more —<br/>
  across every major JS framework. Drop it into any project and start building in seconds.
</p>

<p align="center">
  <a href="#-installation">Installation</a> ·
  <a href="#-quick-start">Quick Start</a> ·
  <a href="#-commands">Commands</a> ·
  <a href="#-scaffoldrcjson-config">Config</a> ·
  <a href="#-styling-support">Styling</a> ·
  <a href="#-migrating-from-create-react-layout">Migration</a>
</p>

---

## ✦ Why jsforge?

Most scaffolding tools are either framework-locked, overly complex, or spit out generic boilerplate you have to rewrite anyway. jsforge is different — it auto-detects your stack, respects your existing project structure, and generates clean, production-ready files exactly where they belong.

- **Zero config to start** — reads your `package.json` and figures out everything on its own
- **Framework-universal** — one tool for React, Next.js, Vue, Nuxt, Angular, and Express
- **Always safe** — never overwrites existing files
- **Barrel-aware** — auto-creates and updates `index.ts/js` exports
- **Team-friendly** — commit `.scaffoldrc.json` so everyone scaffolds consistently
- **Premium terminal UI** — color-coded output, ASCII art, clear status symbols

---

## ⚡ Frameworks

| Framework | Supported Types |
|-----------|----------------|
| **React** | `component` · `hook` · `context` · `page` |
| **Next.js** | `component` · `hook` · `context` · `page` · `layout` · `api-route` |
| **Vue** | `component` · `composable` · `store` |
| **Nuxt** | `component` · `composable` · `page` · `store` |
| **Angular** | `component` · `service` · `module` · `guard` · `pipe` |
| **Express / Node** | `route` · `controller` · `service` · `middleware` · `model` |

---

## 📦 Installation

Install once, use everywhere. jsforge works with every major package manager.

```bash
# npm
npm install -g jsforge

# pnpm
pnpm add -g jsforge

# yarn
yarn global add jsforge

# bun
bun add -g jsforge
```

**Run without installing** (always uses the latest version):

```bash
# npm
npx jsforge

# pnpm
pnpm dlx jsforge

# yarn (v2+)
yarn dlx jsforge

# bun
bunx jsforge
```

---

## 🚀 Quick Start

```bash
cd your-project
jsforge
```

That's it. jsforge detects your framework and launches the interactive builder. No setup needed.

If you want consistent settings across your team, run `jsforge init` first to generate a `.scaffoldrc.json` config file — then commit it.

---

## 📖 Commands

### `jsforge` · `jsforge tree` · `jsforge t`

The interactive tree builder. Navigate your project folder-by-folder, pick what to generate, name your files — jsforge does the rest. Existing files are always skipped.

```bash
jsforge
# or
jsforge tree
# or shorthand
jsforge t
```

**Example session (Next.js · TypeScript):**

```
  ╔══════════════════════════════════════╗
  ║  jsforge  v1.0.0                     ║
  ╚══════════════════════════════════════╝

  ◆ Framework detected: Next.js (TypeScript · Tailwind · App Router)

  src/components →
    + Add Folder
    + Add Component
    + Add Hook
    + Add Context
    + Add Page
    + Add Layout
    + Add API Route
    ✓ Done

  › New folder name: ui

  src/components/ui →
    + Add Component
    ✓ Done

  › Component name(s) (comma-separated): Button, Card, Modal

  ✓  created   src/components/ui/Button/Button.tsx
  ✓  created   src/components/ui/Button/Button.test.tsx
  ✓  created   src/components/ui/Card/Card.tsx
  ✓  created   src/components/ui/Card/Card.test.tsx
  ✓  created   src/components/ui/Modal/Modal.tsx
  ✓  created   src/components/ui/Modal/Modal.test.tsx
  ↺  updated   src/components/ui/index.ts
```

---

### `jsforge init`

Detect your stack and write a `.scaffoldrc.json` config at the project root. Commit this file so your whole team uses the same scaffold settings.

```bash
jsforge init

# overwrite an existing config
jsforge init --force
```

jsforge detects: framework, language (TS/JS), styling library, test runner, Next.js router type (App vs Pages), and whether a `src/` directory is used.

---

### `jsforge generate` · `jsforge g`

Generate a single file set. No framework flag needed — jsforge reads your config or auto-detects.

```bash
# Basic usage
jsforge g component Button
jsforge g hook useAuth
jsforge g page dashboard
jsforge g api-route users
jsforge g composable useFetch
jsforge g service emailService
jsforge g route products
jsforge g model User
jsforge g guard auth
jsforge g pipe currency

# Options
jsforge g component Card --ts        # force TypeScript output
jsforge g component Hero --js        # force JavaScript output
jsforge g hook useFetch --no-test    # skip test file
jsforge g component Layout --no-barrel  # skip barrel update
jsforge g component Hero --dry-run   # preview files without writing
```

**Files generated per type:**

<details>
<summary>React · Next.js component</summary>

```
src/components/Button/
  Button.tsx
  Button.test.tsx
```

</details>

<details>
<summary>Next.js page (App Router)</summary>

```
src/app/dashboard/
  page.tsx
  loading.tsx
  error.tsx
```

</details>

<details>
<summary>Vue component</summary>

```
src/components/Button/
  Button.vue
  Button.spec.ts
```

</details>

<details>
<summary>Angular component (standalone)</summary>

```
src/app/components/button/
  button.component.ts
  button.component.html
  button.component.css
  button.component.spec.ts
```

</details>

<details>
<summary>Express route · controller · service</summary>

```
src/routes/products.route.ts
src/controllers/products.controller.ts
src/services/products.service.ts
```

</details>

---

### `jsforge feature` · `jsforge f`

Scaffold a complete feature folder in one command — component, hook/composable, service, tests, and a pre-wired barrel file.

```bash
jsforge f auth
jsforge f userProfile
jsforge f checkout --dry-run
jsforge f payments --ts
```

**Output per framework:**

<details>
<summary>React · Next.js</summary>

```
features/auth/
  components/AuthForm.tsx
  components/AuthForm.test.tsx
  hooks/useAuth.ts
  hooks/useAuth.test.ts
  services/auth.service.ts
  index.ts          ← barrel, pre-wired
```

</details>

<details>
<summary>Vue · Nuxt</summary>

```
features/auth/
  components/AuthForm.vue
  components/AuthForm.spec.ts
  composables/useAuth.ts
  stores/auth.store.ts
  index.ts
```

</details>

<details>
<summary>Angular</summary>

```
features/auth/
  auth.module.ts
  components/auth-form/
    auth-form.component.ts
    auth-form.component.html
    auth-form.component.css
    auth-form.component.spec.ts
  services/auth.service.ts
  services/auth.service.spec.ts
  guards/auth.guard.ts
  guards/auth.guard.spec.ts
```

</details>

<details>
<summary>Express · Node</summary>

```
modules/auth/
  auth.route.ts
  auth.controller.ts
  auth.service.ts
  Auth.model.ts
  index.ts
```

</details>

---

## ⚙️ `.scaffoldrc.json` Config

Run `jsforge init` once per project to generate this file. Commit it so your whole team scaffolds consistently.

```json
{
  "framework": "nextjs",
  "language": "typescript",
  "styling": "tailwind",
  "testing": "vitest",
  "router": "app",
  "hasSrc": true,
  "componentsDir": "src/components",
  "pagesDir": "src/app",
  "hooksDir": "src/hooks",
  "contextDir": "src/context",
  "featuresDir": "src/features",
  "servicesDir": "src/services",
  "barrel": true
}
```

| Field | Values | Description |
|-------|--------|-------------|
| `framework` | `react` `nextjs` `vue` `nuxt` `angular` `express` | Your JS framework |
| `language` | `typescript` `javascript` | Output language |
| `styling` | see [Styling](#-styling-support) | CSS strategy |
| `testing` | `vitest` `jest` `none` | Test file format |
| `router` | `app` `pages` | Next.js router type |
| `hasSrc` | `true` `false` | Whether you use a `src/` dir |
| `barrel` | `true` `false` | Auto-manage `index.ts` exports |

**Without a config**, jsforge reads your `package.json` and auto-detects everything. You never have to run `init` if you don't want to.

---

## 🎨 Styling Support

| Option | What gets generated |
|--------|---------------------|
| `tailwind` | `className=""` in JSX / Vue template |
| `css-modules` | `Component.module.css` + `styles.container` |
| `scss-modules` | `Component.module.scss` |
| `scss` | `Component.scss` |
| `styled-components` | `styled.div` wired up with import |
| `emotion` | `@emotion/react` import added |
| `css` | Plain `Component.css` import |
| `none` | No style file generated |

---

## 🔄 Migrating from `create-react-layout`

`jsforge` is the full rewrite of `create-react-layout`. Everything from the original is still here — the interactive tree builder is now `jsforge tree` — plus support for every major JS framework, feature-folder scaffolding, auto barrel management, and persistent per-project config.

```bash
npm uninstall -g create-react-layout
npm install -g jsforge
```

Everything else stays the same. `jsforge` with no arguments drops you straight into the interactive builder, exactly like the original.

---

## 🚢 Requirements

- [Node.js](https://nodejs.org/) v18 or higher
- Any package manager: npm · pnpm · yarn · bun

---

## 🗂️ Publish to GitHub Packages

<details>
<summary>Open publish workflow</summary>

```bash
npm login --scope=@adnanrahim110 --auth-type=legacy --registry=https://npm.pkg.github.com
npm run publish:github
```

</details>

---

## 👤 About the Author

<div align="center">

<img src="https://avatars.githubusercontent.com/adnanrahim110" width="100" height="100" style="border-radius: 50%" alt="Adnan Rahim" />

### Adnan Rahim

**Full-Stack Web Developer & AI Enthusiast**<br/>
B.Sc. Cyber Security — Iqra University, Karachi

<p>
  <a href="https://adnanrahim.dev">
    <img src="https://img.shields.io/badge/Portfolio-adnanrahim.dev-F97316?style=for-the-badge&logo=safari&logoColor=white" alt="Portfolio" />
  </a>
  <a href="mailto:adnankaka.786110@gmail.com">
    <img src="https://img.shields.io/badge/Email-adnankaka.786110%40gmail.com-0F172A?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" />
  </a>
  <a href="https://www.linkedin.com/in/adnanrahim110/">
    <img src="https://img.shields.io/badge/LinkedIn-adnanrahim110-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
  </a>
  <a href="https://github.com/adnanrahim110">
    <img src="https://img.shields.io/badge/GitHub-adnanrahim110-0F172A?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  </a>
</p>

If jsforge saves you time, a ⭐ on the repo goes a long way.<br/>
Feedback, issues, and PRs are always welcome.

<br/>

**MIT License** — free to use, modify, and distribute.

</div>

<div align="center">
  <img width="100%" alt="jsforge footer" src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=24,20,14&height=140&section=footer&animation=fadeIn" />
</div>
