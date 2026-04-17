/**
 * jsforge generate <type> <name>
 *
 * If type or name are missing, falls into guided interactive prompts.
 */
import { loadConfig, buildConfig } from '../core/config.js';
import { detect, FRAMEWORK_LABELS, FRAMEWORK_TYPES } from '../core/detector.js';
import { generate as coreGenerate } from '../core/generator.js';
import log  from '../utils/logger.js';
import { pick, ask } from '../utils/prompt.js';

export async function runGenerate(type, name, opts = {}) {
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
    log.muted('Run  jsforge init  to save a permanent config and skip this step.');
    log.nl();
  }

  // Apply CLI flag overrides
  if (opts.ts)  config = { ...config, language: 'typescript' };
  if (opts.js)  config = { ...config, language: 'javascript' };
  if (opts.noTest)   config = { ...config, testing: 'none' };
  if (opts.noBarrel) config = { ...config, barrel: false };

  const fw = config.framework;

  // ── Prompt for type if missing ─────────────────────────────────────────────
  if (!type) {
    const validTypes = FRAMEWORK_TYPES[fw] || [];
    type = await pick(
      `What do you want to generate? (${FRAMEWORK_LABELS[fw]})`,
      validTypes.map((t) => ({
        value: t,
        name: typeLabel(t),
      }))
    );
  }

  // ── Prompt for name if missing ─────────────────────────────────────────────
  if (!name) {
    name = await ask(promptMessageFor(type, fw), {
      validate: (v) => v.trim() ? true : 'Name cannot be empty.',
    });
  }

  name = name.trim();

  if (!name) {
    log.error('Name is required.');
    process.exit(1);
  }

  // ── Dispatch to generator ─────────────────────────────────────────────────
  await coreGenerate(type, name, config, {
    dryRun: opts.dryRun || false,
    barrel: !opts.noBarrel,
  });
}

// ─── Labels / prompt helpers ──────────────────────────────────────────────────
function typeLabel(type) {
  const labels = {
    'component':  'Component         (Button, Card, Modal…)',
    'hook':       'Hook              (useAuth, useFetch…)',
    'context':    'Context           (AuthContext, ThemeContext…)',
    'page':       'Page              (about, dashboard…)',
    'layout':     'Layout            (dashboard layout…)',
    'api-route':  'API Route         (users, auth/login…)',
    'composable': 'Composable        (useCounter, useFetch…)',
    'store':      'Store (Pinia)     (auth, cart…)',
    'service':    'Service           (users, email…)',
    'module':     'Module            (auth, shared…)',
    'guard':      'Guard             (auth, role…)',
    'pipe':       'Pipe              (truncate, date…)',
    'route':      'Route             (users, products…)',
    'controller': 'Controller        (UsersController…)',
    'middleware': 'Middleware        (auth, logger…)',
    'model':      'Model             (User, Product…)',
  };
  return labels[type] || type;
}

function promptMessageFor(type, framework) {
  switch (type) {
    case 'component':  return 'Component name (e.g. Button, HeroSection)';
    case 'hook':       return 'Hook name (e.g. useAuth, useFetch) — "use" prefix added automatically';
    case 'context':    return 'Context name (e.g. Auth, Theme)';
    case 'page':       return 'Page name / route segment (e.g. about, dashboard/settings)';
    case 'layout':     return 'Layout name (e.g. dashboard, auth)';
    case 'api-route':  return 'API route name / segment (e.g. users, auth/login)';
    case 'composable': return 'Composable name (e.g. useCounter, useFetch)';
    case 'store':      return 'Store name (e.g. auth, cart, user)';
    case 'service':    return 'Service name (e.g. users, email, payment)';
    case 'module':     return 'Module name (e.g. auth, shared, dashboard)';
    case 'guard':      return 'Guard name (e.g. auth, role, admin)';
    case 'pipe':       return 'Pipe name (e.g. truncate, date, currency)';
    case 'route':      return 'Route name (e.g. users, products, auth)';
    case 'controller': return 'Controller name (e.g. users, products)';
    case 'middleware': return 'Middleware name (e.g. auth, logger, cors)';
    case 'model':      return 'Model name (e.g. User, Product, Order)';
    default:           return 'Name';
  }
}
