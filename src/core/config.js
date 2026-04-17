/**
 * .scaffoldrc manager
 *
 * Reads and writes the .scaffoldrc.json config file at the project root.
 * This file is designed to be committed to git so the whole team shares
 * the same scaffolding settings.
 */
import fs   from 'fs';
import path from 'path';
import { findUp } from '../utils/fs.js';

const RC_FILENAME = '.scaffoldrc.json';

// ─── Default config shape ────────────────────────────────────────────────────
export const DEFAULT_CONFIG = {
  framework:       'react',
  language:        'javascript',
  styling:         'css',
  testing:         'none',
  router:          null,         // 'app' | 'pages' | null
  hasSrc:          true,
  componentsDir:   'src/components',
  pagesDir:        'src/pages',
  hooksDir:        'src/hooks',
  contextDir:      'src/context',
  featuresDir:     'src/features',
  servicesDir:     'src/services',
  storesDir:       'src/stores',
  composablesDir:  'src/composables',
  barrel:          true,
  customTemplates: null,
};

// ─── Resolve rc path ──────────────────────────────────────────────────────────
function rcPath(projectDir) {
  return path.join(projectDir, RC_FILENAME);
}

// ─── Load ─────────────────────────────────────────────────────────────────────
/**
 * Load .scaffoldrc.json from `dir` or walk up to find it.
 * Returns merged config (defaults + file values), or null if not found.
 */
export function loadConfig(dir = process.cwd()) {
  // First try current dir, then walk up
  let filePath = path.join(dir, RC_FILENAME);
  if (!fs.existsSync(filePath)) {
    const found = findUp(RC_FILENAME, dir);
    if (!found) return null;
    filePath = found;
  }

  try {
    const raw  = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(raw);
    return { ...DEFAULT_CONFIG, ...data, _path: filePath };
  } catch {
    return null;
  }
}

// ─── Save ─────────────────────────────────────────────────────────────────────
/**
 * Write a config object to .scaffoldrc.json at `projectDir`.
 */
export function saveConfig(config, projectDir = process.cwd()) {
  const { _path, ...clean } = config; // strip internal _path key
  const target = rcPath(projectDir);
  fs.writeFileSync(target, JSON.stringify(clean, null, 2) + '\n', 'utf8');
  return target;
}

// ─── Build config from detected stack ────────────────────────────────────────
/**
 * Create a config object from detector output + optional user overrides.
 */
export function buildConfig(detected, overrides = {}) {
  const fw  = detected.framework;
  const src = detected.hasSrc ? 'src/' : '';

  // Framework-aware directory defaults
  const dirDefaults = frameworkDirDefaults(fw, src, detected.router);

  return {
    ...DEFAULT_CONFIG,
    framework:    fw,
    language:     detected.language,
    styling:      detected.styling,
    testing:      detected.testing,
    router:       detected.router   || null,
    hasSrc:       detected.hasSrc,
    ...dirDefaults,
    ...overrides,
  };
}

// ─── Per-framework directory defaults ────────────────────────────────────────
function frameworkDirDefaults(framework, src, router) {
  switch (framework) {
    case 'nextjs':
      return {
        componentsDir:  `${src}components`,
        pagesDir:       router === 'app' ? `${src}app` : `${src}pages`,
        hooksDir:       `${src}hooks`,
        contextDir:     `${src}context`,
        featuresDir:    `${src}features`,
        servicesDir:    `${src}services`,
      };

    case 'react':
      return {
        componentsDir: `${src}components`,
        pagesDir:      `${src}pages`,
        hooksDir:      `${src}hooks`,
        contextDir:    `${src}context`,
        featuresDir:   `${src}features`,
        servicesDir:   `${src}services`,
      };

    case 'vue':
    case 'nuxt':
      return {
        componentsDir:  `${src}components`,
        pagesDir:       `${src}pages`,
        composablesDir: `${src}composables`,
        storesDir:      `${src}stores`,
        featuresDir:    `${src}features`,
      };

    case 'angular':
      return {
        componentsDir: `src/app/components`,
        servicesDir:   `src/app/services`,
        featuresDir:   `src/app/features`,
      };

    case 'express':
      return {
        componentsDir: 'src/routes',
        servicesDir:   'src/services',
        featuresDir:   'src/modules',
      };

    default:
      return {};
  }
}
