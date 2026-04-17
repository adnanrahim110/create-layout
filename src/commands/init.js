/**
 * jsforge init
 *
 * Detects the current project's stack, lets the user confirm or correct it,
 * then writes a .scaffoldrc.json at the project root.
 */
import path from 'path';
import chalk from 'chalk';
import { detect, FRAMEWORK_LABELS } from '../core/detector.js';
import { buildConfig, saveConfig, loadConfig } from '../core/config.js';
import log  from '../utils/logger.js';
import { pick, ask, yesNo } from '../utils/prompt.js';
import { exists } from '../utils/fs.js';

export async function runInit(opts = {}) {
  const cwd = process.cwd();

  log.section('Initialising jsforge');

  // ── Already initialised? ───────────────────────────────────────────────────
  const existing = loadConfig(cwd);
  if (existing && !opts.force) {
    log.warn('.scaffoldrc.json already exists in this project.');
    const overwrite = await yesNo('Overwrite existing config?', false);
    if (!overwrite) {
      log.muted('Aborted — config unchanged.');
      log.nl();
      return;
    }
  }

  // ── Detect stack ───────────────────────────────────────────────────────────
  log.section('Detecting stack');
  const detected = detect(cwd);

  if (!detected) {
    log.error('No package.json found. Run this inside a JS project.');
    process.exit(1);
  }

  console.log('');
  log.detectedRow('framework',  FRAMEWORK_LABELS[detected.framework] || detected.framework);
  log.detectedRow('language',   detected.language);
  log.detectedRow('styling',    detected.styling);
  log.detectedRow('testing',    detected.testing === 'none' ? 'none detected' : detected.testing);
  if (detected.router) {
    log.detectedRow('router', detected.router === 'app' ? 'App Router' : 'Pages Router');
  }
  console.log('');

  // ── Confirm or correct ─────────────────────────────────────────────────────
  log.section('Confirm or adjust');

  const framework = await pick('Framework', [
    { value: 'react',   name: 'React' },
    { value: 'nextjs',  name: 'Next.js' },
    { value: 'vue',     name: 'Vue' },
    { value: 'nuxt',    name: 'Nuxt' },
    { value: 'angular', name: 'Angular' },
    { value: 'express', name: 'Express / Node' },
  ], { default: detected.framework });

  const language = await pick('Language', [
    { value: 'typescript', name: 'TypeScript (.ts / .tsx)' },
    { value: 'javascript', name: 'JavaScript (.js / .jsx)' },
  ], { default: detected.language });

  const styling = await pick('Styling', [
    { value: 'tailwind',           name: 'Tailwind CSS' },
    { value: 'css-modules',        name: 'CSS Modules' },
    { value: 'scss',               name: 'SCSS / Sass' },
    { value: 'scss-modules',       name: 'SCSS Modules' },
    { value: 'styled-components',  name: 'styled-components' },
    { value: 'emotion',            name: 'Emotion' },
    { value: 'css',                name: 'Plain CSS' },
    { value: 'none',               name: 'None' },
  ], { default: detected.styling });

  const testing = await pick('Testing', [
    { value: 'vitest', name: 'Vitest' },
    { value: 'jest',   name: 'Jest' },
    { value: 'none',   name: 'None / Skip test files' },
  ], { default: detected.testing === 'none' ? 'none' : detected.testing });

  // Next.js router choice
  let router = detected.router || null;
  if (framework === 'nextjs') {
    router = await pick('Next.js Router', [
      { value: 'app',   name: 'App Router  (Next.js 13+)' },
      { value: 'pages', name: 'Pages Router (classic)' },
    ], { default: router || 'app' });
  }

  const barrel = await yesNo('Auto-manage barrel (index) files?', true);

  // ── Custom directory overrides (optional) ─────────────────────────────────
  console.log('');
  log.muted('Press Enter to accept the suggested directory for each setting.');
  console.log('');

  const src = detected.hasSrc ? 'src/' : '';

  const componentsDir = await ask(
    'Components directory',
    { default: `${src}components` }
  );

  let extraDirs = {};

  if (['react', 'nextjs'].includes(framework)) {
    extraDirs.hooksDir    = await ask('Hooks directory',    { default: `${src}hooks` });
    extraDirs.contextDir  = await ask('Context directory',  { default: `${src}context` });
    extraDirs.servicesDir = await ask('Services directory', { default: `${src}services` });
    extraDirs.featuresDir = await ask('Features directory', { default: `${src}features` });
    if (framework === 'nextjs') {
      extraDirs.pagesDir = await ask(
        router === 'app' ? 'App directory' : 'Pages directory',
        { default: router === 'app' ? `${src}app` : `${src}pages` }
      );
    }
  }

  if (['vue', 'nuxt'].includes(framework)) {
    extraDirs.composablesDir = await ask('Composables directory', { default: `${src}composables` });
    extraDirs.storesDir      = await ask('Stores directory',      { default: `${src}stores` });
    extraDirs.featuresDir    = await ask('Features directory',    { default: `${src}features` });
    if (framework === 'nuxt') {
      extraDirs.pagesDir = await ask('Pages directory', { default: 'pages' });
    }
  }

  if (framework === 'express') {
    extraDirs.servicesDir = await ask('Services directory', { default: 'src/services' });
    extraDirs.featuresDir = await ask('Modules directory',  { default: 'src/modules' });
  }

  if (framework === 'angular') {
    extraDirs.servicesDir = await ask('Services directory', { default: 'src/app/services' });
    extraDirs.featuresDir = await ask('Features directory', { default: 'src/app/features' });
  }

  // ── Build & save ──────────────────────────────────────────────────────────
  const overrides = {
    framework,
    language,
    styling,
    testing,
    router,
    barrel,
    hasSrc: detected.hasSrc,
    componentsDir,
    ...extraDirs,
  };

  const config = buildConfig({ ...detected, framework, language, styling, testing, router }, overrides);

  log.section('Writing config');
  const rcFile = saveConfig(config, detected.projectDir);
  log.created(path.relative(cwd, rcFile));

  log.done('Run  jsforge generate  or  jsforge feature  to start scaffolding.');
}
