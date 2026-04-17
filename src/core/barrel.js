/**
 * Barrel file manager
 *
 * After scaffolding a component/module, this module:
 *   1. Finds (or creates) the nearest index.ts / index.js in the target directory
 *   2. Appends the correct export statement (deduplicated)
 *   3. Logs the update
 *
 * Export styles:
 *   component   → export { default } from './Button'; export * from './Button';
 *   named only  → export * from './useAuth';
 *   default only→ export { default as Button } from './Button';
 */
import fs   from 'fs';
import path from 'path';
import log  from '../utils/logger.js';

/**
 * Update (or create) the barrel file in `dir`.
 *
 * @param {string}  dir        Directory containing the module to export
 * @param {string}  name       Module name (no extension) e.g. 'Button', 'useAuth'
 * @param {string}  lang       'typescript' | 'javascript'
 * @param {string}  [style]    'default-and-named' | 'named' | 'default-as'
 * @param {boolean} [dryRun]   If true, log without writing
 */
export function updateBarrel(dir, name, lang, style = 'default-and-named', dryRun = false) {
  const ext      = lang === 'typescript' ? 'ts' : 'js';
  const barrelPath = path.join(dir, `index.${ext}`);
  const rel      = path.relative(process.cwd(), barrelPath);

  // Build the export line(s)
  const lines = buildExportLines(name, style);

  if (dryRun) {
    log.updated(`${rel}  (dry-run)`);
    lines.forEach((l) => log.muted(`  + ${l}`));
    return;
  }

  // Read existing barrel or start fresh
  let current = '';
  if (fs.existsSync(barrelPath)) {
    current = fs.readFileSync(barrelPath, 'utf8');
  }

  // Deduplicate — skip lines that already exist
  const toAdd = lines.filter((line) => !current.includes(line.trim()));

  if (toAdd.length === 0) {
    log.skipped(rel);
    return;
  }

  const separator = current.endsWith('\n') || current === '' ? '' : '\n';
  const newContent = current + separator + toAdd.join('\n') + '\n';
  fs.writeFileSync(barrelPath, newContent, 'utf8');
  log.updated(rel);
}

/**
 * Build export line(s) for a given name and style.
 */
function buildExportLines(name, style) {
  switch (style) {
    case 'named':
      return [`export * from './${name}';`];

    case 'default-as':
      return [`export { default as ${name} } from './${name}';`];

    case 'default-and-named':
    default:
      return [
        `export { default } from './${name}';`,
        `export * from './${name}';`,
      ];
  }
}

/**
 * Determine the right export style for a given artifact type.
 */
export function barrelStyle(type) {
  switch (type) {
    case 'hook':
    case 'composable':
    case 'store':
    case 'context':
    case 'guard':
    case 'pipe':
      return 'named';

    case 'component':
    default:
      return 'default-and-named';
  }
}
