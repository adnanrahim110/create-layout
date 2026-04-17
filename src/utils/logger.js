import chalk from 'chalk';

// ─── Symbol set ────────────────────────────────────────────────────────────────
const S = {
  check:   '✓',
  cross:   '✗',
  warn:    '⚠',
  diamond: '◆',
  arrow:   '→',
  dot:     '·',
  spark:   '⚡',
  spin:    '↺',
  pipe:    '│',
  tee:     '├',
  end:     '└',
};

// ─── Color tokens ──────────────────────────────────────────────────────────────
const c = {
  brand:   (s) => chalk.cyan(s),
  brandB:  (s) => chalk.cyan.bold(s),
  success: (s) => chalk.green(s),
  error:   (s) => chalk.red(s),
  warn:    (s) => chalk.yellow(s),
  info:    (s) => chalk.blue(s),
  accent:  (s) => chalk.magenta(s),
  muted:   (s) => chalk.gray(s),
  dim:     (s) => chalk.dim(s),
  bold:    (s) => chalk.bold(s),
  white:   (s) => chalk.white(s),
};

// ─── Banner ────────────────────────────────────────────────────────────────────
export function banner(version = '1.0.0') {
  const W     = 54;
  const inner = W - 2;
  const line  = '═'.repeat(inner);

  const center = (str, width) => {
    const visible = stripAnsi(str).length;
    const pad     = Math.max(0, width - visible);
    const l       = Math.floor(pad / 2);
    const r       = pad - l;
    return ' '.repeat(l) + str + ' '.repeat(r);
  };

  const title = chalk.cyan.bold(`${S.spark}  jsforge`) + chalk.dim(`  v${version}`);
  const sub   = chalk.dim('Universal JS Scaffolding Engine');
  const hint  = chalk.dim(`react · next · vue · nuxt · angular · express`);

  console.log('');
  console.log(c.brand(`╔${line}╗`));
  console.log(c.brand('║') + ' '.repeat(inner) + c.brand('║'));
  console.log(c.brand('║') + center(title, inner) + c.brand('║'));
  console.log(c.brand('║') + center(sub, inner)   + c.brand('║'));
  console.log(c.brand('║') + center(hint, inner)  + c.brand('║'));
  console.log(c.brand('║') + ' '.repeat(inner) + c.brand('║'));
  console.log(c.brand(`╚${line}╝`));
  console.log('');
}

// ─── Section header ────────────────────────────────────────────────────────────
export function section(title) {
  console.log('');
  console.log(c.brand(`  ${S.diamond} `) + c.bold(title));
  console.log(c.muted('  ' + '─'.repeat(44)));
}

// ─── Inline log helpers ────────────────────────────────────────────────────────
export function success(msg)  { console.log(c.success(`  ${S.check}  `) + msg); }
export function error(msg)    { console.log(c.error(`  ${S.cross}  `) + chalk.red(msg)); }
export function warn(msg)     { console.log(c.warn(`  ${S.warn}  `) + chalk.yellow(msg)); }
export function info(msg)     { console.log(c.info(`  ${S.diamond}  `) + msg); }
export function muted(msg)    { console.log(c.muted(`  ${S.dot}  ${msg}`)); }

// ─── File operation log lines ─────────────────────────────────────────────────
export function created(rel)  {
  console.log(
    c.success(`  ${S.check}  `) +
    chalk.green.dim('created  ') +
    chalk.white(rel)
  );
}

export function skipped(rel)  {
  console.log(
    c.muted(`  ${S.dot}  `) +
    chalk.dim('exists   ') +
    chalk.dim(rel)
  );
}

export function updated(rel)  {
  console.log(
    c.warn(`  ${S.spin}  `) +
    chalk.yellow.dim('updated  ') +
    chalk.white(rel)
  );
}

// ─── Detection display ────────────────────────────────────────────────────────
export function detectedRow(label, value, inferred = false) {
  const lPad = label.padEnd(14);
  const tag  = inferred ? c.muted(' (inferred)') : '';
  console.log(
    c.muted('     ') +
    c.muted(lPad) +
    c.brandB(value) +
    tag
  );
}

// ─── Done footer ──────────────────────────────────────────────────────────────
export function done(summary = '') {
  console.log('');
  console.log(c.muted('  ') + c.muted('─'.repeat(44)));
  if (summary) {
    console.log(c.brand(`  ${S.spark}  `) + chalk.green.bold('Done! ') + chalk.dim(summary));
  } else {
    console.log(c.brand(`  ${S.spark}  `) + chalk.green.bold('Done! Happy coding.'));
  }
  console.log('');
}

// ─── Plain newline ─────────────────────────────────────────────────────────────
export function nl() { console.log(''); }

// ─── Prefix for prompt messages ───────────────────────────────────────────────
export function prompt(msg) {
  return c.brand(`  ${S.arrow}  `) + msg;
}

// ─── Tiny util: strip ANSI for width math ─────────────────────────────────────
function stripAnsi(str) {
  return str.replace(/\x1B\[[0-9;]*m/g, '');
}

// ─── Named export bundle for convenience ──────────────────────────────────────
export default {
  banner, section,
  success, error, warn, info, muted,
  created, skipped, updated,
  detectedRow,
  done, nl, prompt,
};
