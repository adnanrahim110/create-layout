/**
 * Angular framework adapter
 *
 * Supported types: component, service, module, guard, pipe
 * Uses Angular 17+ standalone component pattern by default.
 */
import path from 'path';
import { allForms } from '../../utils/naming.js';
import { render, makeVars } from '../../core/template.js';
import * as templates from './templates.js';

export const types = ['component', 'service', 'module', 'guard', 'pipe'];

export function generate(type, name, config) {
  switch (type) {
    case 'component': return generateComponent(name, config);
    case 'service':   return generateService(name, config);
    case 'module':    return generateModule(name, config);
    case 'guard':     return generateGuard(name, config);
    case 'pipe':      return generatePipe(name, config);
    default:          return [];
  }
}

export function exportName(type, name) {
  const f = allForms(name);
  switch (type) {
    case 'component': return `${f.pascal}Component`;
    case 'service':   return `${f.pascal}Service`;
    case 'module':    return `${f.pascal}Module`;
    case 'guard':     return `${f.camel}Guard`;
    case 'pipe':      return `${f.pascal}Pipe`;
    default:          return f.pascal;
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
function generateComponent(name, config) {
  const f      = allForms(name);
  const ext    = styleExtFor(config.styling);
  const vars   = makeVars(f, {
    selector:  `app-${f.kebab}`,
    styleExt:  ext,
  });
  const base   = config.targetDir || config.componentsDir || 'src/app/components';
  const dir    = path.join(base, f.kebab);
  const files  = [];

  files.push({
    filePath: `${dir}/${f.kebab}.component.ts`,
    content:  render(templates.component(ext), vars),
  });
  files.push({
    filePath: `${dir}/${f.kebab}.component.html`,
    content:  render(templates.componentHtml(), vars),
  });

  if (ext !== 'none') {
    files.push({
      filePath: `${dir}/${f.kebab}.component.${ext}`,
      content:  render(templates.componentStyle(ext), vars),
    });
  }

  files.push({
    filePath: `${dir}/${f.kebab}.component.spec.ts`,
    content:  render(templates.componentSpec(), vars),
  });

  return files;
}

// ─── Service ──────────────────────────────────────────────────────────────────
function generateService(name, config) {
  const f    = allForms(name);
  const vars = makeVars(f);
  const dir  = config.targetDir || config.servicesDir || 'src/app/services';

  return [
    {
      filePath: `${dir}/${f.kebab}.service.ts`,
      content:  render(templates.service(), vars),
    },
    {
      filePath: `${dir}/${f.kebab}.service.spec.ts`,
      content:  render(templates.serviceSpec(), vars),
    },
  ];
}

// ─── Module ───────────────────────────────────────────────────────────────────
function generateModule(name, config) {
  const f    = allForms(name);
  const vars = makeVars(f);
  const base = config.targetDir || config.featuresDir || 'src/app/features';
  const dir  = path.join(base, f.kebab);

  return [{
    filePath: `${dir}/${f.kebab}.module.ts`,
    content:  render(templates.module(), vars),
  }];
}

// ─── Guard ────────────────────────────────────────────────────────────────────
function generateGuard(name, config) {
  const f    = allForms(name);
  const vars = makeVars(f);
  const dir  = config.targetDir ||
    (config.servicesDir ? path.dirname(config.servicesDir) + '/guards' : 'src/app/guards');

  return [
    {
      filePath: `${dir}/${f.kebab}.guard.ts`,
      content:  render(templates.guard(), vars),
    },
    {
      filePath: `${dir}/${f.kebab}.guard.spec.ts`,
      content:  render(templates.guardSpec(), vars),
    },
  ];
}

// ─── Pipe ─────────────────────────────────────────────────────────────────────
function generatePipe(name, config) {
  const f    = allForms(name);
  const vars = makeVars(f);
  const dir  = config.targetDir ||
    (config.servicesDir ? path.dirname(config.servicesDir) + '/pipes' : 'src/app/pipes');

  return [
    {
      filePath: `${dir}/${f.kebab}.pipe.ts`,
      content:  render(templates.pipe(), vars),
    },
    {
      filePath: `${dir}/${f.kebab}.pipe.spec.ts`,
      content:  render(templates.pipeSpec(), vars),
    },
  ];
}

// ─── Style extension helper ───────────────────────────────────────────────────
function styleExtFor(styling) {
  switch (styling) {
    case 'scss':
    case 'scss-modules': return 'scss';
    case 'none':         return 'none';
    default:             return 'css';
  }
}
