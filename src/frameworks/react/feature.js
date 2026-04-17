/**
 * React feature scaffold
 *
 * features/auth/
 *   components/AuthForm.tsx
 *   components/AuthForm.test.tsx
 *   hooks/useAuth.ts
 *   services/auth.service.ts
 *   index.ts
 */
import path from 'path';
import { allForms } from '../../utils/naming.js';
import { render, makeVars } from '../../core/template.js';
import * as ct from './templates.js';

export function featureFiles(name, config) {
  const f      = allForms(name);
  const isTs   = config.language === 'typescript';
  const ext    = isTs ? 'tsx' : 'jsx';
  const tsExt  = isTs ? 'ts'  : 'js';
  const vars   = makeVars(f, { ext });
  const base   = path.join(config.featuresDir || 'src/features', f.kebab);
  const files  = [];

  // ── Component ──────────────────────────────────────────────────────────────
  files.push({
    filePath: `${base}/components/${f.pascal}Form.${ext}`,
    content:  render(ct.component(config.styling, isTs), makeVars(allForms(`${f.pascal}Form`), { ext })),
  });

  // Style file for the component
  const styleFile = styleFor(config.styling, `${f.pascal}Form`, `${base}/components`);
  if (styleFile) files.push(styleFile);

  // Component test
  if (config.testing !== 'none') {
    files.push({
      filePath: `${base}/components/${f.pascal}Form.test.${ext}`,
      content:  render(ct.componentTest(config.testing, isTs), makeVars(allForms(`${f.pascal}Form`), { ext })),
    });
  }

  // ── Hook ───────────────────────────────────────────────────────────────────
  const hookName = `use${f.pascal}`;
  files.push({
    filePath: `${base}/hooks/${hookName}.${tsExt}`,
    content:  render(ct.hook(isTs), makeVars(allForms(hookName), { ext: tsExt })),
  });

  // Hook test
  if (config.testing !== 'none') {
    files.push({
      filePath: `${base}/hooks/${hookName}.test.${tsExt}`,
      content:  render(ct.hookTest(config.testing, isTs), makeVars(allForms(hookName), { ext: tsExt })),
    });
  }

  // ── Service ────────────────────────────────────────────────────────────────
  files.push({
    filePath: `${base}/services/${f.kebab}.service.${tsExt}`,
    content:  serviceTemplate(f, isTs),
  });

  // ── Barrel ────────────────────────────────────────────────────────────────
  files.push({
    filePath: `${base}/index.${tsExt}`,
    content:  barrelTemplate(f, hookName, isTs),
  });

  return files;
}

function serviceTemplate(f, isTs) {
  if (isTs) {
    return `export class ${f.pascal}Service {
  async findAll(): Promise<unknown[]> {
    return [];
  }

  async findById(id: string): Promise<unknown | null> {
    return null;
  }

  async create(data: unknown): Promise<unknown> {
    return data;
  }

  async update(id: string, data: unknown): Promise<unknown> {
    return data;
  }

  async remove(id: string): Promise<void> {}
}

export const ${f.camel}Service = new ${f.pascal}Service();
`;
  }

  return `export class ${f.pascal}Service {
  async findAll() { return []; }
  async findById(id) { return null; }
  async create(data) { return data; }
  async update(id, data) { return data; }
  async remove(id) {}
}

export const ${f.camel}Service = new ${f.pascal}Service();
`;
}

function barrelTemplate(f, hookName, isTs) {
  return `export { default as ${f.pascal}Form } from './components/${f.pascal}Form';
export { ${hookName} } from './hooks/${hookName}';
export { ${f.camel}Service } from './services/${f.kebab}.service';
`;
}

function styleFor(styling, name, dir) {
  switch (styling) {
    case 'css-modules':  return { filePath: `${dir}/${name}.module.css`,  content: `.container {\n  /* ${name} styles */\n}\n` };
    case 'scss-modules': return { filePath: `${dir}/${name}.module.scss`, content: `.container {\n  // ${name} styles\n}\n` };
    case 'scss':         return { filePath: `${dir}/${name}.scss`,        content: `.${name.toLowerCase()} {\n  // styles\n}\n` };
    case 'css':          return { filePath: `${dir}/${name}.css`,         content: `.${name.toLowerCase()} {\n  /* styles */\n}\n` };
    default:             return null;
  }
}
