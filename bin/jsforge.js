#!/usr/bin/env node
/**
 * jsforge — Universal JS Scaffolding Engine
 * Entry point. Wires up Commander commands and dispatches to handlers.
 */
import { createRequire } from 'module';
import { Command }       from 'commander';
import { banner }        from '../src/utils/logger.js';
import { runInit }       from '../src/commands/init.js';
import { runGenerate }   from '../src/commands/generate.js';
import { runFeature }    from '../src/commands/feature.js';
import { runInteractive } from '../src/core/tree-builder.js';

const require  = createRequire(import.meta.url);
const pkg      = require('../package.json');
const program  = new Command();

// ─── Global setup ─────────────────────────────────────────────────────────────
program
  .name('jsforge')
  .description('Universal JS scaffolding CLI for React, Next.js, Vue, Nuxt, Angular & Express')
  .version(pkg.version, '-v, --version', 'Print version')
  .helpOption('-h, --help', 'Show help');

// ─── jsforge init ─────────────────────────────────────────────────────────────
program
  .command('init')
  .description('Detect your stack and create a .scaffoldrc.json config file')
  .option('-f, --force', 'Overwrite existing .scaffoldrc.json without asking')
  .action(async (opts) => {
    banner(pkg.version);
    await runInit(opts);
  });

// ─── jsforge generate <type> <name> ───────────────────────────────────────────
program
  .command('generate [type] [name]')
  .alias('g')
  .description(
    'Generate a single file or folder\n' +
    '  Types depend on your framework:\n' +
    '  react/next  → component, hook, context, page, layout, api-route\n' +
    '  vue/nuxt    → component, composable, store, page\n' +
    '  angular     → component, service, module, guard, pipe\n' +
    '  express     → route, controller, service, middleware, model'
  )
  .option('--ts',        'Force TypeScript output')
  .option('--js',        'Force JavaScript output')
  .option('--no-test',   'Skip test file generation')
  .option('--no-barrel', 'Skip barrel (index) file update')
  .option('--dry-run',   'Preview files without writing them')
  .action(async (type, name, opts) => {
    banner(pkg.version);
    await runGenerate(type, name, opts);
  });

// ─── jsforge feature <name> ───────────────────────────────────────────────────
program
  .command('feature [name]')
  .alias('f')
  .description('Scaffold a complete feature folder (component + hook/composable + service + tests + barrel)')
  .option('--ts',        'Force TypeScript output')
  .option('--js',        'Force JavaScript output')
  .option('--dry-run',   'Preview files without writing them')
  .action(async (name, opts) => {
    banner(pkg.version);
    await runFeature(name, opts);
  });

// ─── jsforge tree ─────────────────────────────────────────────────────────────
// Explicit named command for the interactive tree builder.
// The original create-react-layout experience — now for every JS framework.
program
  .command('tree')
  .alias('t')
  .description(
    'Interactive folder tree builder — the original create-react-layout experience,\n' +
    '  extended to every JS framework.\n' +
    '  Navigate folders, add components/hooks/routes/services and more,\n' +
    '  all from a guided terminal session. Existing files are never overwritten.'
  )
  .action(async () => {
    banner(pkg.version);
    await runInteractive();
  });

// ─── jsforge (no args) → interactive tree builder ────────────────────────────
program
  .action(async () => {
    banner(pkg.version);
    await runInteractive();
  });

// ─── Parse ────────────────────────────────────────────────────────────────────
program.parse(process.argv);
