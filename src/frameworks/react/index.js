/**
 * React framework adapter
 *
 * Supported types: component, hook, context, page
 */
import path from 'path';
import { allForms } from '../../utils/naming.js';
import { render, makeVars } from '../../core/template.js';
import * as templates from './templates.js';

export const types = ['component', 'hook', 'context', 'page'];

/**
 * Generate a list of { filePath, content } objects for the given type + name.
 *
 * @param {string} type
 * @param {string} name
 * @param {object} config
 * @returns {{ filePath: string, content: string }[]}
 */
export function generate(type, name, config) {
  switch (type) {
    case 'component': return generateComponent(name, config);
    case 'hook':      return generateHook(name, config);
    case 'context':   return generateContext(name, config);
    case 'page':      return generatePage(name, config);
    default:          return [];
  }
}

/**
 * Return the export name for barrel updates.
 */
export function exportName(type, name) {
  const f = allForms(name);
  switch (type) {
    case 'hook':    return f.camel.startsWith('use') ? f.camel : `use${f.pascal}`;
    case 'context': return `${f.pascal}Context`;
    default:        return f.pascal;
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
function generateComponent(name, config) {
  const f      = allForms(name);
  const isTs   = config.language === 'typescript';
  const ext    = isTs ? 'tsx' : 'jsx';
  const vars   = makeVars(f, { ext, styleExt: styleExtFor(config.styling) });
  // targetDir wins when set by tree-builder; creates subfolder per component
  const base   = config.targetDir || config.componentsDir || 'src/components';
  const dir    = path.join(base, f.pascal);
  const files  = [];

  files.push({
    filePath: `${dir}/${f.pascal}.${ext}`,
    content:  render(templates.component(config.styling, isTs), vars),
  });

  const styleFile = styleFileFor(config.styling, f.pascal, dir);
  if (styleFile) files.push(styleFile);

  if (config.testing !== 'none') {
    const testExt = isTs ? 'tsx' : 'jsx';
    files.push({
      filePath: `${dir}/${f.pascal}.test.${testExt}`,
      content:  render(templates.componentTest(config.testing, isTs), vars),
    });
  }

  return files;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
function generateHook(name, config) {
  const raw    = name.startsWith('use') ? name : `use${name.charAt(0).toUpperCase()}${name.slice(1)}`;
  const f      = allForms(raw);
  const isTs   = config.language === 'typescript';
  const ext    = isTs ? 'ts' : 'js';
  const vars   = makeVars(f, { ext });
  // hooks are flat files — no subfolder
  const dir    = config.targetDir || config.hooksDir || 'src/hooks';
  const files  = [];

  files.push({
    filePath: `${dir}/${f.camel}.${ext}`,
    content:  render(templates.hook(isTs), vars),
  });

  if (config.testing !== 'none') {
    files.push({
      filePath: `${dir}/${f.camel}.test.${ext}`,
      content:  render(templates.hookTest(config.testing, isTs), vars),
    });
  }

  return files;
}

// ─── Context ──────────────────────────────────────────────────────────────────
function generateContext(name, config) {
  const f      = allForms(name);
  const isTs   = config.language === 'typescript';
  const ext    = isTs ? 'tsx' : 'jsx';
  const vars   = makeVars(f, { ext });
  const base   = config.targetDir || config.contextDir || 'src/context';
  const dir    = path.join(base, f.pascal);
  const files  = [];

  files.push({
    filePath: `${dir}/${f.pascal}Context.${ext}`,
    content:  render(templates.context(isTs), vars),
  });

  if (config.testing !== 'none') {
    files.push({
      filePath: `${dir}/${f.pascal}Context.test.${ext}`,
      content:  render(templates.contextTest(config.testing, isTs), vars),
    });
  }

  return files;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
function generatePage(name, config) {
  const f      = allForms(name);
  const isTs   = config.language === 'typescript';
  const ext    = isTs ? 'tsx' : 'jsx';
  const vars   = makeVars(f, { ext });
  const dir    = config.targetDir || config.pagesDir || 'src/pages';
  const files  = [];

  files.push({
    filePath: `${dir}/${f.kebab}.${ext}`,
    content:  render(templates.page(isTs), vars),
  });

  return files;
}

// ─── Style helpers ────────────────────────────────────────────────────────────
function styleExtFor(styling) {
  switch (styling) {
    case 'scss':
    case 'scss-modules': return 'module.scss';
    case 'css-modules':  return 'module.css';
    case 'css':          return 'css';
    default:             return null;
  }
}

function styleFileFor(styling, name, dir) {
  switch (styling) {
    case 'css-modules':
      return { filePath: `${dir}/${name}.module.css`,  content: templates.cssModule(name) };
    case 'scss-modules':
      return { filePath: `${dir}/${name}.module.scss`, content: templates.scssModule(name) };
    case 'scss':
      return { filePath: `${dir}/${name}.scss`,        content: templates.scss(name) };
    case 'css':
      return { filePath: `${dir}/${name}.css`,         content: templates.css(name) };
    default:
      return null;
  }
}
