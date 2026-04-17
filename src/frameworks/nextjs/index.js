/**
 * Next.js framework adapter
 *
 * Supported types: component, hook, context, page, layout, api-route
 *
 * Delegates component/hook/context to the React adapter.
 * Handles page, layout, api-route with Next.js-specific templates.
 */
import path from 'path';
import { allForms } from '../../utils/naming.js';
import { render, makeVars } from '../../core/template.js';
import { generate as reactGenerate, exportName as reactExportName } from '../react/index.js';
import * as templates from './templates.js';

export const types = ['component', 'hook', 'context', 'page', 'layout', 'api-route'];

export function generate(type, name, config) {
  switch (type) {
    case 'component':
    case 'hook':
    case 'context':
      // Delegate to React adapter (same logic)
      return reactGenerate(type, name, config);

    case 'page':      return generatePage(name, config);
    case 'layout':    return generateLayout(name, config);
    case 'api-route': return generateApiRoute(name, config);
    default:          return [];
  }
}

export function exportName(type, name) {
  return reactExportName(type, name);
}

// ─── Page ─────────────────────────────────────────────────────────────────────
function generatePage(name, config) {
  const f      = allForms(name);
  const isTs   = config.language === 'typescript';
  const ext    = isTs ? 'tsx' : 'jsx';
  const vars   = makeVars(f, { ext });
  const files  = [];

  if (config.router === 'app') {
    const base = config.targetDir || config.pagesDir || 'src/app';
    const dir  = path.join(base, f.kebab);
    files.push({
      filePath: `${dir}/page.${ext}`,
      content:  render(templates.appRouterPage(isTs), vars),
    });
    files.push({
      filePath: `${dir}/loading.${ext}`,
      content:  render(templates.appRouterLoading(), vars),
    });
    files.push({
      filePath: `${dir}/error.${ext}`,
      content:  render(templates.appRouterError(isTs), vars),
    });
  } else {
    const dir = config.targetDir || config.pagesDir || 'src/pages';
    files.push({
      filePath: `${dir}/${f.kebab}.${ext}`,
      content:  render(templates.pagesRouterPage(isTs), vars),
    });
  }

  return files;
}

// ─── Layout ───────────────────────────────────────────────────────────────────
function generateLayout(name, config) {
  const f    = allForms(name);
  const isTs = config.language === 'typescript';
  const ext  = isTs ? 'tsx' : 'jsx';
  const vars = makeVars(f, { ext });

  if (config.router !== 'app') {
    const base = config.targetDir || config.componentsDir || 'src/components';
    return [{
      filePath: `${base}/${f.pascal}Layout.${ext}`,
      content:  render(templates.pagesRouterLayout(isTs), vars),
    }];
  }

  const base = config.targetDir || config.pagesDir || 'src/app';
  const dir  = path.join(base, f.kebab);
  return [{
    filePath: `${dir}/layout.${ext}`,
    content:  render(templates.appRouterLayout(isTs), vars),
  }];
}

// ─── API Route ────────────────────────────────────────────────────────────────
function generateApiRoute(name, config) {
  const f    = allForms(name);
  const isTs = config.language === 'typescript';
  const ext  = isTs ? 'ts' : 'js';
  const vars = makeVars(f, { ext });

  if (config.router === 'app') {
    const dir = path.join(config.pagesDir || 'src/app', 'api', f.kebab);
    return [{
      filePath: `${dir}/route.${ext}`,
      content:  render(templates.appRouterApiRoute(isTs), vars),
    }];
  }

  // Pages Router: pages/api/[name].ts
  const dir = path.join(config.pagesDir || 'src/pages', 'api');
  return [{
    filePath: `${dir}/${f.kebab}.${ext}`,
    content:  render(templates.pagesRouterApiRoute(isTs), vars),
  }];
}
