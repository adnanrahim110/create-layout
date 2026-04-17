/**
 * Express feature scaffold — generates a full MVC module
 *
 * modules/auth/
 *   auth.route.ts
 *   auth.controller.ts
 *   auth.service.ts
 *   auth.model.ts       (optional — always included for completeness)
 */
import path from 'path';
import { allForms } from '../../utils/naming.js';
import { render, makeVars } from '../../core/template.js';
import * as et from './templates.js';

export function featureFiles(name, config) {
  const f     = allForms(name);
  const isTs  = config.language === 'typescript';
  const ext   = isTs ? 'ts' : 'js';
  const vars  = makeVars(f, { ext });
  const base  = path.join(config.featuresDir || 'src/modules', f.kebab);
  const files = [];

  files.push({
    filePath: `${base}/${f.kebab}.route.${ext}`,
    content:  render(et.route(isTs), vars),
  });

  files.push({
    filePath: `${base}/${f.kebab}.controller.${ext}`,
    content:  render(et.controller(isTs), vars),
  });

  files.push({
    filePath: `${base}/${f.kebab}.service.${ext}`,
    content:  render(et.service(isTs), vars),
  });

  files.push({
    filePath: `${base}/${f.pascal}.model.${ext}`,
    content:  render(et.model(isTs), vars),
  });

  // Index barrel
  files.push({
    filePath: `${base}/index.${ext}`,
    content: `export { default as ${f.camel}Router } from './${f.kebab}.route.js';
export { ${f.pascal}Controller } from './${f.kebab}.controller.js';
export { ${f.pascal}Service } from './${f.kebab}.service.js';
export { ${f.pascal} } from './${f.pascal}.model.js';
`,
  });

  return files;
}
