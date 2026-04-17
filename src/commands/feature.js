/**
 * jsforge feature <name>
 *
 * Scaffolds a complete feature folder in one shot.
 * The exact file set adapts to the detected framework:
 *
 *  react / nextjs  → component + hook + service + test + barrel
 *  vue / nuxt      → component + composable + store + test + barrel
 *  angular         → module + component + service (all with specs)
 *  express         → route + controller + service
 */
import path   from 'path';
import chalk  from 'chalk';
import { loadConfig, buildConfig }        from '../core/config.js';
import { detect, FRAMEWORK_LABELS }      from '../core/detector.js';
import { safeWrite }                     from '../utils/fs.js';
import { updateBarrel }                  from '../core/barrel.js';
import { allForms }                      from '../utils/naming.js';
import log                               from '../utils/logger.js';
import { ask, yesNo }                    from '../utils/prompt.js';

// ─── Per-framework feature builders ──────────────────────────────────────────
import { featureFiles as reactFeature }   from '../frameworks/react/feature.js';
import { featureFiles as nextFeature }    from '../frameworks/nextjs/feature.js';
import { featureFiles as vueFeature }     from '../frameworks/vue/feature.js';
import { featureFiles as nuxtFeature }    from '../frameworks/nuxt/feature.js';
import { featureFiles as angularFeature } from '../frameworks/angular/feature.js';
import { featureFiles as expressFeature } from '../frameworks/express/feature.js';

const FEATURE_BUILDERS = {
  react:   reactFeature,
  nextjs:  nextFeature,
  vue:     vueFeature,
  nuxt:    nuxtFeature,
  angular: angularFeature,
  express: expressFeature,
};

export async function runFeature(name, opts = {}) {
  // ── Load config ────────────────────────────────────────────────────────────
  let config = loadConfig(process.cwd());

  if (!config) {
    log.warn('No .scaffoldrc.json found. Detecting stack automatically...');
    const detected = detect(process.cwd());
    if (!detected) {
      log.error('Could not detect stack. Run  jsforge init  first.');
      process.exit(1);
    }
    config = buildConfig(detected);
    log.info(`Detected: ${FRAMEWORK_LABELS[detected.framework]}, ${detected.language}`);
    log.nl();
  }

  // Apply CLI flag overrides
  if (opts.ts) config = { ...config, language: 'typescript' };
  if (opts.js) config = { ...config, language: 'javascript' };

  const fw = config.framework;

  // ── Get feature name ───────────────────────────────────────────────────────
  if (!name) {
    name = await ask('Feature name (e.g. auth, userProfile, checkout)', {
      validate: (v) => v.trim() ? true : 'Name cannot be empty.',
    });
  }

  name = name.trim();
  const f = allForms(name);

  const builder = FEATURE_BUILDERS[fw];
  if (!builder) {
    log.error(`No feature builder for framework: "${fw}"`);
    process.exit(1);
  }

  log.section(`Scaffolding feature: ${chalk.cyan.bold(f.pascal)}`);
  log.muted(`Framework: ${FRAMEWORK_LABELS[fw]}  ·  Language: ${config.language}  ·  Styling: ${config.styling}`);
  log.nl();

  // ── Get file list from builder ─────────────────────────────────────────────
  const files = builder(name, config);

  if (!files || files.length === 0) {
    log.warn('No files generated for this feature.');
    return;
  }

  const projectDir = config.projectDir || process.cwd();

  // ── Preview in dry-run mode ────────────────────────────────────────────────
  if (opts.dryRun) {
    log.info('Dry run — no files will be written:\n');
    files.forEach(({ filePath }) => {
      log.muted(`  ${path.relative(process.cwd(), path.join(projectDir, filePath))}`);
    });
    log.nl();
    return;
  }

  // ── Write files ────────────────────────────────────────────────────────────
  for (const { filePath, content } of files) {
    const absPath = path.isAbsolute(filePath)
      ? filePath
      : path.join(projectDir, filePath);
    safeWrite(absPath, content, process.cwd());
  }

  // ── Update barrel ──────────────────────────────────────────────────────────
  if (config.barrel !== false) {
    const featureIndexDir = path.join(projectDir, featuresBaseDir(fw, config));
    updateBarrel(featureIndexDir, f.pascal, config.language, 'named');
  }

  log.done(`Feature "${f.pascal}" created successfully.`);
}

function featuresBaseDir(fw, config) {
  return config.featuresDir || (fw === 'express' ? 'src/modules' : 'src/features');
}
