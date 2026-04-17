/**
 * Nuxt framework adapter
 *
 * Supported types: component, composable, page, store
 * Delegates component, composable, store to Vue adapter.
 * Handles page with Nuxt-specific template.
 */
import path from 'path';
import { allForms } from '../../utils/naming.js';
import { render, makeVars } from '../../core/template.js';
import { generate as vueGenerate, exportName as vueExportName } from '../vue/index.js';
import * as templates from './templates.js';

export const types = ['component', 'composable', 'page', 'store'];

export function generate(type, name, config) {
  switch (type) {
    case 'component':
    case 'composable':
    case 'store':
      return vueGenerate(type, name, config);

    case 'page':
      return generatePage(name, config);

    default:
      return [];
  }
}

export function exportName(type, name) {
  return vueExportName(type, name);
}

// ─── Page ─────────────────────────────────────────────────────────────────────
function generatePage(name, config) {
  const f    = allForms(name);
  const isTs = config.language === 'typescript';
  const vars = makeVars(f, { ext: 'vue' });
  const dir  = config.pagesDir || 'pages';

  return [{
    filePath: `${dir}/${f.kebab}.vue`,
    content:  render(templates.page(isTs), vars),
  }];
}
