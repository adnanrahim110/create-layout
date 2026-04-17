/**
 * Vue framework adapter
 *
 * Supported types: component, composable, store
 */
import path from 'path';
import { allForms } from '../../utils/naming.js';
import { render, makeVars } from '../../core/template.js';
import * as templates from './templates.js';

export const types = ['component', 'composable', 'store'];

export function generate(type, name, config) {
  switch (type) {
    case 'component':  return generateComponent(name, config);
    case 'composable': return generateComposable(name, config);
    case 'store':      return generateStore(name, config);
    default:           return [];
  }
}

export function exportName(type, name) {
  const f = allForms(name);
  switch (type) {
    case 'composable': return f.camel.startsWith('use') ? f.camel : `use${f.pascal}`;
    case 'store':      return `use${f.pascal}Store`;
    default:           return f.pascal;
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
function generateComponent(name, config) {
  const f     = allForms(name);
  const isTs  = config.language === 'typescript';
  const vars  = makeVars(f, { ext: 'vue' });
  const base  = config.targetDir || config.componentsDir || 'src/components';
  const dir   = path.join(base, f.pascal);
  const files = [];

  files.push({
    filePath: `${dir}/${f.pascal}.vue`,
    content:  render(templates.component(config.styling, isTs), vars),
  });

  if (config.testing !== 'none') {
    const testExt = isTs ? 'ts' : 'js';
    files.push({
      filePath: `${dir}/${f.pascal}.spec.${testExt}`,
      content:  render(templates.componentTest(config.testing, isTs), vars),
    });
  }

  return files;
}

// ─── Composable ───────────────────────────────────────────────────────────────
function generateComposable(name, config) {
  const raw   = name.startsWith('use') ? name : `use${name.charAt(0).toUpperCase()}${name.slice(1)}`;
  const f     = allForms(raw);
  const isTs  = config.language === 'typescript';
  const ext   = isTs ? 'ts' : 'js';
  const vars  = makeVars(f, { ext });
  const dir   = config.targetDir || config.composablesDir || 'src/composables';
  const files = [];

  files.push({
    filePath: `${dir}/${f.camel}.${ext}`,
    content:  render(templates.composable(isTs), vars),
  });

  if (config.testing !== 'none') {
    files.push({
      filePath: `${dir}/${f.camel}.spec.${ext}`,
      content:  render(templates.composableTest(config.testing, isTs), vars),
    });
  }

  return files;
}

// ─── Store (Pinia) ────────────────────────────────────────────────────────────
function generateStore(name, config) {
  const f     = allForms(name);
  const isTs  = config.language === 'typescript';
  const ext   = isTs ? 'ts' : 'js';
  const vars  = makeVars(f, { ext });
  const dir   = config.targetDir || config.storesDir || 'src/stores';
  const files = [];

  files.push({
    filePath: `${dir}/${f.kebab}.store.${ext}`,
    content:  render(templates.store(isTs), vars),
  });

  return files;
}
