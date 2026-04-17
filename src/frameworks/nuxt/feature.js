/**
 * Nuxt feature scaffold
 * Same as Vue but adds a Nuxt-style page and server API route.
 *
 * features/auth/
 *   components/AuthForm.vue
 *   composables/useAuth.ts
 *   stores/auth.store.ts
 *   server/api/auth.post.ts
 *   index.ts
 */
import path from 'path';
import { allForms } from '../../utils/naming.js';
import { featureFiles as vueFeatureFiles } from '../vue/feature.js';

export function featureFiles(name, config) {
  const f      = allForms(name);
  const isTs   = config.language === 'typescript';
  const tsExt  = isTs ? 'ts' : 'js';
  const base   = path.join(config.featuresDir || 'src/features', f.kebab);

  const files = vueFeatureFiles(name, config);

  // Nuxt server API route
  files.push({
    filePath: `server/api/${f.kebab}.post.${tsExt}`,
    content:  serverApiTemplate(f, isTs),
  });

  return files;
}

function serverApiTemplate(f, isTs) {
  if (isTs) {
    return `import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  return { data: body };
});
`;
  }

  return `import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  return { data: body };
});
`;
}
