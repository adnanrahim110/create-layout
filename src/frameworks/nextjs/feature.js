/**
 * Next.js feature scaffold — same as React but adds an API route
 *
 * features/auth/
 *   components/AuthForm.tsx
 *   hooks/useAuth.ts
 *   services/auth.service.ts
 *   api/route.ts          (App Router) or api/auth.ts (Pages Router)
 *   index.ts
 */
import path from 'path';
import { allForms } from '../../utils/naming.js';
import { featureFiles as reactFeatureFiles } from '../react/feature.js';
import * as nt from './templates.js';

export function featureFiles(name, config) {
  const f      = allForms(name);
  const isTs   = config.language === 'typescript';
  const tsExt  = isTs ? 'ts' : 'js';
  const base   = path.join(config.featuresDir || 'src/features', f.kebab);

  // Start with the React feature files
  const files = reactFeatureFiles(name, config);

  // Add API route
  if (config.router === 'app') {
    files.push({
      filePath: `${base}/api/route.${tsExt}`,
      content:  nt.appRouterApiRoute(isTs),
    });
  } else {
    files.push({
      filePath: `${base}/api/${f.kebab}.${tsExt}`,
      content:  nt.pagesRouterApiRoute(isTs),
    });
  }

  return files;
}
