/**
 * Thin wrappers around @inquirer/prompts that apply consistent
 * prefix styling and reduce boilerplate across commands.
 */
import { input, select, checkbox, confirm } from '@inquirer/prompts';
import chalk from 'chalk';

const prefix = chalk.cyan('  › ');

/**
 * Text input
 * @param {string} message
 * @param {object} [opts]   default, validate, transformer
 */
export async function ask(message, opts = {}) {
  return input({ message: chalk.white(message), prefix, ...opts });
}

/**
 * Single-choice list
 * @param {string}   message
 * @param {Array}    choices   [{ value, name, description? }] or string[]
 * @param {object}   [opts]    default, pageSize
 */
export async function pick(message, choices, opts = {}) {
  const normalised = choices.map((c) =>
    typeof c === 'string' ? { value: c, name: c } : c
  );
  return select({ message: chalk.white(message), choices: normalised, prefix, pageSize: 12, ...opts });
}

/**
 * Multi-choice checkbox
 * @param {string}  message
 * @param {Array}   choices   [{ value, name, checked? }] or string[]
 * @param {object}  [opts]
 */
export async function pickMany(message, choices, opts = {}) {
  const normalised = choices.map((c) =>
    typeof c === 'string' ? { value: c, name: c } : c
  );
  return checkbox({ message: chalk.white(message), choices: normalised, prefix, pageSize: 12, ...opts });
}

/**
 * Yes / No confirmation
 * @param {string}  message
 * @param {boolean} [defaultVal=true]
 */
export async function yesNo(message, defaultVal = true) {
  return confirm({ message: chalk.white(message), default: defaultVal, prefix });
}
