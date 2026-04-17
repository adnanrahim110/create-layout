/**
 * Angular feature scaffold
 *
 * features/auth/
 *   auth.module.ts
 *   components/auth-form/
 *     auth-form.component.ts
 *     auth-form.component.html
 *     auth-form.component.scss
 *     auth-form.component.spec.ts
 *   services/
 *     auth.service.ts
 *     auth.service.spec.ts
 *   guards/
 *     auth.guard.ts
 *     auth.guard.spec.ts
 */
import path from 'path';
import { allForms } from '../../utils/naming.js';
import { render, makeVars } from '../../core/template.js';
import * as at from './templates.js';

export function featureFiles(name, config) {
  const f       = allForms(name);
  const base    = path.join(config.featuresDir || 'src/app/features', f.kebab);
  const styleExt = config.styling === 'scss' || config.styling === 'scss-modules' ? 'scss' : 'css';
  const vars    = makeVars(f, { selector: `app-${f.kebab}-form`, styleExt });
  const compVars = makeVars(allForms(`${f.pascal}Form`), { selector: `app-${f.kebab}-form`, styleExt });
  const files   = [];

  // ── Module ────────────────────────────────────────────────────────────────
  files.push({
    filePath: `${base}/${f.kebab}.module.ts`,
    content:  render(at.module(), vars),
  });

  // ── Component ────────────────────────────────────────────────────────────
  const compDir = `${base}/components/${f.kebab}-form`;
  files.push({
    filePath: `${compDir}/${f.kebab}-form.component.ts`,
    content:  render(at.component(styleExt), compVars),
  });
  files.push({
    filePath: `${compDir}/${f.kebab}-form.component.html`,
    content:  render(at.componentHtml(), compVars),
  });
  files.push({
    filePath: `${compDir}/${f.kebab}-form.component.${styleExt}`,
    content:  render(at.componentStyle(styleExt), compVars),
  });
  files.push({
    filePath: `${compDir}/${f.kebab}-form.component.spec.ts`,
    content:  render(at.componentSpec(), compVars),
  });

  // ── Service ───────────────────────────────────────────────────────────────
  files.push({
    filePath: `${base}/services/${f.kebab}.service.ts`,
    content:  render(at.service(), vars),
  });
  files.push({
    filePath: `${base}/services/${f.kebab}.service.spec.ts`,
    content:  render(at.serviceSpec(), vars),
  });

  // ── Guard ─────────────────────────────────────────────────────────────────
  files.push({
    filePath: `${base}/guards/${f.kebab}.guard.ts`,
    content:  render(at.guard(), vars),
  });
  files.push({
    filePath: `${base}/guards/${f.kebab}.guard.spec.ts`,
    content:  render(at.guardSpec(), vars),
  });

  return files;
}
