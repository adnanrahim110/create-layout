import fs   from 'fs';
import path from 'path';
import log  from './logger.js';

/**
 * Ensure a directory exists (creates recursively if needed).
 * Returns true if created, false if already existed.
 */
export function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    return true;
  }
  return false;
}

/**
 * Write a file safely:
 *   - If the file already exists, log a skip and return false
 *   - Otherwise write content and return true
 *
 * @param {string} filePath   Absolute path
 * @param {string} content    File content
 * @param {string} [baseDir]  Project root for relative display (defaults to cwd)
 */
export function safeWrite(filePath, content, baseDir = process.cwd()) {
  const rel = path.relative(baseDir, filePath);
  ensureDir(path.dirname(filePath));

  if (fs.existsSync(filePath)) {
    log.skipped(rel);
    return false;
  }

  fs.writeFileSync(filePath, content, 'utf8');
  log.created(rel);
  return true;
}

/**
 * Read a file as UTF-8 string. Returns null if it doesn't exist.
 */
export function readFile(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, 'utf8');
}

/**
 * Check whether a path exists (file or directory).
 */
export function exists(p) {
  return fs.existsSync(p);
}

/**
 * List immediate children of a directory. Returns [] if dir doesn't exist.
 */
export function listDir(dirPath) {
  if (!fs.existsSync(dirPath)) return [];
  return fs.readdirSync(dirPath);
}

/**
 * Walk up from `startDir` looking for the first occurrence of `filename`.
 * Returns the full path if found, or null.
 */
export function findUp(filename, startDir = process.cwd()) {
  let current = path.resolve(startDir);
  const root  = path.parse(current).root;

  while (current !== root) {
    const candidate = path.join(current, filename);
    if (fs.existsSync(candidate)) return candidate;
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
  return null;
}

/**
 * Parse the nearest package.json walking up from startDir.
 * Returns the parsed object and its directory, or null.
 */
export function findPackageJson(startDir = process.cwd()) {
  const pkgPath = findUp('package.json', startDir);
  if (!pkgPath) return null;
  try {
    return {
      path: pkgPath,
      dir:  path.dirname(pkgPath),
      data: JSON.parse(fs.readFileSync(pkgPath, 'utf8')),
    };
  } catch {
    return null;
  }
}
