<div align="center">
  <img width="100%" alt="create-react-layout header" src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=24,20,14&height=220&section=header&text=create-react-layout&fontSize=48&fontColor=ffffff&fontAlignY=40&animation=fadeIn&desc=Interactive+CLI+to+scaffold+React+component+folders+and+JSX%2FTSX+files+inside+src&descSize=18&descAlignY=62&descColor=d1fae5" />
</div>

<p align="center">
  <a href="https://www.npmjs.com/package/create-react-layout">
    <img src="https://img.shields.io/npm/v/create-react-layout?style=for-the-badge&logo=npm&logoColor=white&color=F97316" alt="npm version" />
  </a>
  <a href="https://github.com/adnanrahim110/create-layout">
    <img src="https://img.shields.io/badge/GitHub-Repository-0F172A?style=for-the-badge&logo=github&logoColor=white" alt="GitHub repository" />
  </a>
  <img src="https://img.shields.io/badge/Node-18%2B-14B8A6?style=for-the-badge&logo=node.js&logoColor=white" alt="Node 18+" />
  <img src="https://img.shields.io/badge/License-MIT-0EA5E9?style=for-the-badge" alt="MIT license" />
</p>

<p align="center">
  Interactive CLI scaffolder for React component folders and JSX or TSX boilerplate under <code>src/</code>.
</p>

<p align="center">
  Build React folder structure faster, keep component naming clean, and scaffold safely inside <code>src/</code>.
</p>

## The Pain Point

Starting a React project often means spending the first few minutes on repetitive filesystem work instead of building UI:

- creating the same `src/components/...` folders again and again
- manually writing starter component files
- switching between `.jsx` and `.tsx` depending on the project
- keeping names consistent while avoiding accidental overwrites

## How This Solves It

`create-react-layout` turns that setup into a guided terminal workflow:

- choose `JSX` or `TSX` once
- pick a root folder inside `src`
- add folders and components recursively
- generate clean React boilerplate automatically
- skip files and folders that already exist

## Why It Feels Better

| Capability             | What it gives you                                                                     |
| ---------------------- | ------------------------------------------------------------------------------------- |
| Recursive tree builder | Shape nested component architecture directly from the terminal without breaking focus |
| Smart naming           | Inputs like `button`, `Button`, or `Button.jsx` become clean component filenames      |
| Stack-aware generation | Your first choice controls whether the scaffold produces `.jsx` or `.tsx` files       |
| Safe scaffolding       | Existing files and folders are skipped instead of being overwritten                   |
| Multi-create input     | Create several components at once with comma-separated names                          |

## Quick Start

### Install from npm

```bash
npm install -g create-react-layout
```

### Install from GitHub Packages

```bash
npm install -g @adnanrahim110/create-react-layout
```

### Run the CLI

```bash
cd path/to/your-react-project
create-react-layout
```

## CLI Flow

```text
Choose JSX or TSX
  -> Pick the root folder inside src
  -> Add folders or components recursively
  -> Generate clean React starter files
```

### Example Session

```text
$ create-react-layout

Starting React scaffolding...

? Select language:
  > JavaScript (JSX)
    TypeScript (TSX)

? Specify root folder under src/: (components)

src/components -> Choose action:
  > Add Folder
    Add Component
    Done

? Enter new folder name: ui

src/components/ui -> Choose action:
  > Add Component
    Done

? Enter component name(s) (comma-separated): button, card
```

### Example Output

```text
src/
  components/
    ui/
      Button.jsx
      Card.jsx
```

## Requirements

- [Node.js](https://nodejs.org/) v18 or higher
- npm

## Publish To GitHub Packages

<details>
<summary>Open the publish workflow</summary>

GitHub Packages requires a scoped package name, so this project keeps the npmjs package as `create-react-layout` and publishes a GitHub Packages variant as `@adnanrahim110/create-react-layout`.

1. Create a GitHub personal access token (classic) with `write:packages` and `read:packages`.
2. Authenticate npm against GitHub Packages:

```bash
npm login --scope=@adnanrahim110 --auth-type=legacy --registry=https://npm.pkg.github.com
```

3. Publish the GitHub Packages version:

```bash
npm run publish:github
```

4. If another project needs this scope, add the registry mapping:

```ini
@adnanrahim110:registry=https://npm.pkg.github.com
```

</details>

## Author

<p>
  <a href="mailto:adnankaka.786110@gmail.com">
    <img src="https://img.shields.io/badge/Email-adnankaka.786110%40gmail.com-0F172A?style=for-the-badge&logo=gmail&logoColor=white" alt="Email Adnan Rahim" />
  </a>
  <a href="https://www.linkedin.com/in/adnanrahim110/">
    <img src="https://img.shields.io/badge/LinkedIn-adnanrahim110-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn adnanrahim110" />
  </a>
</p>

Adnan Rahim
Full-Stack Web Developer and AI Enthusiast
B.Sc. in Cyber Security, Iqra University Karachi

MIT License

<div align="center">
  <img width="100%" alt="create-react-layout footer" src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=24,20,14&height=140&section=footer&animation=fadeIn" />
</div>
