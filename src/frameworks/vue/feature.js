/**
 * Vue feature scaffold
 *
 * features/auth/
 *   components/AuthForm.vue
 *   components/AuthForm.spec.ts
 *   composables/useAuth.ts
 *   stores/auth.store.ts
 *   index.ts
 */
import path from 'path';
import { allForms } from '../../utils/naming.js';
import { render, makeVars } from '../../core/template.js';
import * as vt from './templates.js';

export function featureFiles(name, config) {
  const f     = allForms(name);
  const isTs  = config.language === 'typescript';
  const tsExt = isTs ? 'ts' : 'js';
  const vars  = makeVars(f);
  const base  = path.join(config.featuresDir || 'src/features', f.kebab);
  const files = [];

  // ── Component ──────────────────────────────────────────────────────────────
  files.push({
    filePath: `${base}/components/${f.pascal}Form.vue`,
    content:  render(vt.component(config.styling, isTs), makeVars(allForms(`${f.pascal}Form`))),
  });

  if (config.testing !== 'none') {
    files.push({
      filePath: `${base}/components/${f.pascal}Form.spec.${tsExt}`,
      content:  render(vt.componentTest(config.testing, isTs), makeVars(allForms(`${f.pascal}Form`))),
    });
  }

  // ── Composable ─────────────────────────────────────────────────────────────
  const composableName = `use${f.pascal}`;
  files.push({
    filePath: `${base}/composables/${composableName}.${tsExt}`,
    content:  render(vt.composable(isTs), makeVars(allForms(composableName))),
  });

  // ── Store ──────────────────────────────────────────────────────────────────
  files.push({
    filePath: `${base}/stores/${f.kebab}.store.${tsExt}`,
    content:  render(vt.store(isTs), vars),
  });

  // ── Barrel ────────────────────────────────────────────────────────────────
  files.push({
    filePath: `${base}/index.${tsExt}`,
    content: `export { default as ${f.pascal}Form } from './components/${f.pascal}Form.vue';
export { ${composableName} } from './composables/${composableName}';
export { use${f.pascal}Store } from './stores/${f.kebab}.store';
`,
  });

  return files;
}
