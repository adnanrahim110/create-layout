/**
 * Express / Node framework adapter
 *
 * Supported types: route, controller, service, middleware, model
 */
import path from 'path';
import { allForms } from '../../utils/naming.js';
import { render, makeVars } from '../../core/template.js';
import * as templates from './templates.js';

export const types = ['route', 'controller', 'service', 'middleware', 'model'];

export function generate(type, name, config) {
  switch (type) {
    case 'route':       return generateRoute(name, config);
    case 'controller':  return generateController(name, config);
    case 'service':     return generateService(name, config);
    case 'middleware':  return generateMiddleware(name, config);
    case 'model':       return generateModel(name, config);
    default:            return [];
  }
}

export function exportName(type, name) {
  const f = allForms(name);
  switch (type) {
    case 'controller': return `${f.pascal}Controller`;
    case 'service':    return `${f.pascal}Service`;
    case 'model':      return f.pascal;
    default:           return f.camel;
  }
}

// ─── Route ────────────────────────────────────────────────────────────────────
function generateRoute(name, config) {
  const f    = allForms(name);
  const isTs = config.language === 'typescript';
  const ext  = isTs ? 'ts' : 'js';
  const vars = makeVars(f, { ext });
  const dir  = config.targetDir ||
    (config.servicesDir ? path.dirname(config.servicesDir) + '/routes' : 'src/routes');

  return [{
    filePath: `${dir}/${f.kebab}.route.${ext}`,
    content:  render(templates.route(isTs), vars),
  }];
}

// ─── Controller ───────────────────────────────────────────────────────────────
function generateController(name, config) {
  const f    = allForms(name);
  const isTs = config.language === 'typescript';
  const ext  = isTs ? 'ts' : 'js';
  const vars = makeVars(f, { ext });
  const dir  = config.targetDir ||
    (config.servicesDir ? path.dirname(config.servicesDir) + '/controllers' : 'src/controllers');

  return [{
    filePath: `${dir}/${f.kebab}.controller.${ext}`,
    content:  render(templates.controller(isTs), vars),
  }];
}

// ─── Service ──────────────────────────────────────────────────────────────────
function generateService(name, config) {
  const f    = allForms(name);
  const isTs = config.language === 'typescript';
  const ext  = isTs ? 'ts' : 'js';
  const vars = makeVars(f, { ext });
  const dir  = config.targetDir || config.servicesDir || 'src/services';

  return [{
    filePath: `${dir}/${f.kebab}.service.${ext}`,
    content:  render(templates.service(isTs), vars),
  }];
}

// ─── Middleware ────────────────────────────────────────────────────────────────
function generateMiddleware(name, config) {
  const f    = allForms(name);
  const isTs = config.language === 'typescript';
  const ext  = isTs ? 'ts' : 'js';
  const vars = makeVars(f, { ext });
  const dir  = config.targetDir ||
    (config.servicesDir ? path.dirname(config.servicesDir) + '/middleware' : 'src/middleware');

  return [{
    filePath: `${dir}/${f.kebab}.middleware.${ext}`,
    content:  render(templates.middleware(isTs), vars),
  }];
}

// ─── Model ────────────────────────────────────────────────────────────────────
function generateModel(name, config) {
  const f    = allForms(name);
  const isTs = config.language === 'typescript';
  const ext  = isTs ? 'ts' : 'js';
  const vars = makeVars(f, { ext });
  const dir  = config.targetDir ||
    (config.servicesDir ? path.dirname(config.servicesDir) + '/models' : 'src/models');

  return [{
    filePath: `${dir}/${f.pascal}.model.${ext}`,
    content:  render(templates.model(isTs), vars),
  }];
}
