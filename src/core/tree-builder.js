/**
 * Interactive tree builder  —  jsforge tree  (also the default no-args mode)
 *
 * Brings the original create-react-layout experience to every JS framework.
 * The flow stays the same regardless of stack:
 *
 *   1. Detect (or load) your project's framework + language
 *   2. Pick a root directory to scaffold into
 *   3. Recursively:  Add Folder  |  Add <type>  |  Done (go up)
 *   4. Comma-separated names → create many files in one prompt
 *   5. Safe skip — existing files are never overwritten
 *
 * Framework     Add options
 * ──────────────────────────────────────────────────────
 * React         Component · Hook · Context · Page
 * Next.js       Component · Hook · Context · Page · Layout · API Route
 * Vue           Component · Composable · Store
 * Nuxt          Component · Composable · Page · Store
 * Angular       Component · Service · Module · Guard · Pipe
 * Express       Route · Controller · Service · Middleware · Model
 */
import path  from 'path';
import chalk from 'chalk';
import { loadConfig, buildConfig }  from './config.js';
import { detect, FRAMEWORK_LABELS } from './detector.js';
import { generate }                 from './generator.js';
import log  from '../utils/logger.js';
import { pick, ask, yesNo }         from '../utils/prompt.js';

// ─── Framework → available node types ────────────────────────────────────────
const TREE_TYPES = {
  react:   ['component', 'hook', 'context', 'page'],
  nextjs:  ['component', 'hook', 'context', 'page', 'layout', 'api-route'],
  vue:     ['component', 'composable', 'store'],
  nuxt:    ['component', 'composable', 'page', 'store'],
  angular: ['component', 'service', 'module', 'guard', 'pipe'],
  express: ['route', 'controller', 'service', 'middleware', 'model'],
};

// ─── Display labels ───────────────────────────────────────────────────────────
const TYPE_LABELS = {
  component:   'Component',
  hook:        'Hook',
  context:     'Context',
  page:        'Page',
  layout:      'Layout',
  'api-route': 'API Route',
  composable:  'Composable',
  store:       'Store (Pinia)',
  service:     'Service',
  module:      'Module',
  guard:       'Guard',
  pipe:        'Pipe',
  route:       'Route',
  controller:  'Controller',
  middleware:  'Middleware',
  model:       'Model',
};

// ─── Root directory defaults per framework ────────────────────────────────────
const DEFAULT_ROOTS = {
  react:   (c) => c.componentsDir  || 'src/components',
  nextjs:  (c) => c.componentsDir  || 'src/components',
  vue:     (c) => c.componentsDir  || 'src/components',
  nuxt:    (c) => c.componentsDir  || 'src/components',
  angular: (c) => c.componentsDir  || 'src/app/components',
  express: (c) => c.servicesDir
    ? path.dirname(c.servicesDir) + '/routes'
    : 'src/routes',
};

// ─── Main entry ───────────────────────────────────────────────────────────────
export async function runInteractive() {
  // ── Load or detect config ──────────────────────────────────────────────────
  let config = loadConfig(process.cwd());

  if (!config) {
    log.warn('No .scaffoldrc.json found — detecting stack...');
    const detected = detect(process.cwd());
    if (!detected) {
      log.error('No package.json found. Run this inside a JS project.');
      process.exit(1);
    }
    config = buildConfig(detected);
    log.info(`Detected: ${chalk.cyan.bold(FRAMEWORK_LABELS[detected.framework])}  ·  ${detected.language}`);
    log.muted('Tip: run  jsforge init  to save your config and skip this step.');
    log.nl();
  }

  const fw = config.framework || 'react';

  // ── Header ─────────────────────────────────────────────────────────────────
  log.section('Interactive scaffold  —  ' + chalk.cyan(FRAMEWORK_LABELS[fw]));
  printStack(config);

  // ── Language override (if user wants to change for this session) ───────────
  const langChoice = await pick('Language for this session', [
    {
      value: config.language,
      name:  config.language === 'typescript'
        ? `TypeScript (.ts / .tsx)  ${chalk.cyan('← current')}`
        : `JavaScript (.js / .jsx)  ${chalk.cyan('← current')}`,
    },
    {
      value: config.language === 'typescript' ? 'javascript' : 'typescript',
      name:  config.language === 'typescript'
        ? 'JavaScript (.js / .jsx)'
        : 'TypeScript (.ts / .tsx)',
    },
  ]);
  config = { ...config, language: langChoice };

  // ── Root directory ─────────────────────────────────────────────────────────
  const defaultRoot = (DEFAULT_ROOTS[fw] || DEFAULT_ROOTS.react)(config);
  const root = await ask('Root directory to scaffold into', { default: defaultRoot });

  log.nl();

  // ── Enter the recursive tree ───────────────────────────────────────────────
  await buildTree(root.trim(), config);

  log.done('Scaffold complete.');
}

// ─── Recursive tree walker ────────────────────────────────────────────────────
async function buildTree(currentPath, config) {
  const fw         = config.framework || 'react';
  const types      = TREE_TYPES[fw]   || ['component'];
  const projectDir = config.projectDir || process.cwd();

  while (true) {
    // Resolve a display path relative to cwd
    const abs      = path.isAbsolute(currentPath)
      ? currentPath
      : path.join(projectDir, currentPath);
    const relPath  = path.relative(process.cwd(), abs) || currentPath;

    // ── Build choice list ─────────────────────────────────────────────────
    const choices = [
      {
        value: '__folder',
        name:  chalk.cyan('  + Add Folder'),
      },
      ...types.map((t) => ({
        value: `__type:${t}`,
        name:  `  + Add ${TYPE_LABELS[t] || t}`,
      })),
      {
        value: '__done',
        name:  chalk.dim('  ✓ Done'),
      },
    ];

    const choice = await pick(
      chalk.cyan.bold(relPath) + chalk.dim('  →'),
      choices
    );

    // ── Done → go back up ─────────────────────────────────────────────────
    if (choice === '__done') return;

    // ── Add Folder → recurse ──────────────────────────────────────────────
    if (choice === '__folder') {
      const folderName = await ask('New folder name', {
        validate: (v) => v.trim() ? true : 'Name cannot be empty.',
      });
      const newDir = path.join(currentPath, folderName.trim());
      // We don't physically create the folder here — safeWrite handles it
      // when the first file is written inside it. Just show a preview.
      log.muted(`  ↳ ${path.join(relPath, folderName.trim())}`);
      await buildTree(newDir, config);
      continue;
    }

    // ── Add artifact ───────────────────────────────────────────────────────
    const type = choice.replace('__type:', '');
    await addArtifact(type, currentPath, config);
  }
}

// ─── Add a single artifact (with comma-separated multi-name support) ─────────
async function addArtifact(type, dirOverride, config) {
  const label    = TYPE_LABELS[type] || type;
  const rawInput = await ask(
    `${label} name(s)  ${chalk.dim('(comma-separated for multiple)')}`,
    { validate: (v) => v.trim() ? true : 'Name cannot be empty.' }
  );

  const names = rawInput
    .split(',')
    .map((n) => n.trim())
    .filter(Boolean);

  // Inject targetDir so every generator places files in the current tree node
  const localConfig = { ...config, targetDir: dirOverride };

  for (const name of names) {
    await generate(type, name, localConfig, {
      barrel: config.barrel !== false,
    });
  }
}

// ─── Stack info line ──────────────────────────────────────────────────────────
function printStack(config) {
  const fw = config.framework || 'react';
  const fw_label   = FRAMEWORK_LABELS[fw] || fw;
  const lang_label = config.language === 'typescript' ? 'TypeScript' : 'JavaScript';
  const test_label = config.testing   !== 'none' ? config.testing : 'no tests';

  log.muted(
    `  ${fw_label}  ·  ${lang_label}  ·  ${config.styling || 'css'}  ·  ${test_label}`
  );
}
