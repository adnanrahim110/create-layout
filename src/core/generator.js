/**
 * Base generator
 *
 * Resolves which framework adapter to use, calls its generate() method
 * to get the file list, then writes each file via safeWrite().
 * Optionally runs the barrel updater after writing.
 */
import path from 'path';
import { safeWrite } from '../utils/fs.js';
import { updateBarrel, barrelStyle } from './barrel.js';
import log from '../utils/logger.js';

// ─── Lazy-load framework adapters ────────────────────────────────────────────
const ADAPTERS = {
  react:   () => import('../frameworks/react/index.js'),
  nextjs:  () => import('../frameworks/nextjs/index.js'),
  vue:     () => import('../frameworks/vue/index.js'),
  nuxt:    () => import('../frameworks/nuxt/index.js'),
  angular: () => import('../frameworks/angular/index.js'),
  express: () => import('../frameworks/express/index.js'),
};

/**
 * Generate files for a given type + name under a config.
 *
 * @param {string}  type     e.g. 'component', 'hook', 'page', 'route'
 * @param {string}  name     Raw user input, e.g. 'Button', 'useAuth', 'users'
 * @param {object}  config   .scaffoldrc config (loaded or inferred)
 * @param {object}  [opts]
 * @param {boolean} [opts.dryRun]    Preview only, no writes
 * @param {boolean} [opts.barrel]    Override barrel toggle
 * @param {string}  [opts.language]  Override language
 */
export async function generate(type, name, config, opts = {}) {
  const framework = config.framework;

  if (!ADAPTERS[framework]) {
    log.error(`No adapter found for framework: "${framework}"`);
    process.exit(1);
  }

  // Load the adapter
  const mod     = await ADAPTERS[framework]();
  const adapter = mod.default || mod;

  // Validate type
  if (!adapter.types.includes(type)) {
    log.error(`"${type}" is not a valid type for ${framework}.`);
    log.muted(`Valid types: ${adapter.types.join(', ')}`);
    process.exit(1);
  }

  // Merge opts into config (language override, dryRun)
  const resolvedConfig = {
    ...config,
    language: opts.language || config.language,
    dryRun:   opts.dryRun   || false,
  };

  // Ask the adapter for the file list
  const files = adapter.generate(type, name, resolvedConfig);

  if (!files || files.length === 0) {
    log.warn('Adapter returned no files to generate.');
    return;
  }

  const projectDir = config.projectDir || process.cwd();

  log.section(`Generating ${type}: ${name}`);

  // Write each file
  for (const { filePath, content } of files) {
    const absPath = path.isAbsolute(filePath)
      ? filePath
      : path.join(projectDir, filePath);

    if (resolvedConfig.dryRun) {
      const rel = path.relative(process.cwd(), absPath);
      log.muted(`  (dry-run) would create: ${rel}`);
    } else {
      safeWrite(absPath, content, process.cwd());
    }
  }

  // Barrel update
  const doBarrel = opts.barrel !== false && config.barrel !== false;
  if (doBarrel && !resolvedConfig.dryRun) {
    const barrelDir = path.join(projectDir, dirForType(type, resolvedConfig));
    const style     = barrelStyle(type);
    updateBarrel(barrelDir, resolveExportName(type, name, adapter), resolvedConfig.language, style);
  }

  log.done();
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function dirForType(type, config) {
  switch (type) {
    case 'component': return config.componentsDir || 'src/components';
    case 'hook':      return config.hooksDir       || 'src/hooks';
    case 'context':   return config.contextDir     || 'src/context';
    case 'composable':return config.composablesDir || 'src/composables';
    case 'store':     return config.storesDir      || 'src/stores';
    case 'service':   return config.servicesDir    || 'src/services';
    case 'page':      return config.pagesDir       || 'src/pages';
    default:          return '.';
  }
}

function resolveExportName(type, name, adapter) {
  if (adapter.exportName) return adapter.exportName(type, name);
  return name;
}
