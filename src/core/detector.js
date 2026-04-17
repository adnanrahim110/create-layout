/**
 * Stack detector — reads the nearest package.json and infers:
 *   framework, language, styling, testing, router (for Next.js)
 *
 * Detection priority:
 *   next   > react   (next is a react superset)
 *   nuxt   > vue
 *   @angular/core → angular
 *   express → express
 */
import fs   from 'fs';
import path from 'path';
import { findPackageJson } from '../utils/fs.js';

// ─── Dependency lookup helpers ────────────────────────────────────────────────
function hasDep(pkg, ...names) {
  const all = {
    ...(pkg.dependencies       || {}),
    ...(pkg.devDependencies    || {}),
    ...(pkg.peerDependencies   || {}),
  };
  return names.some((n) => n in all);
}

// ─── Framework detection ──────────────────────────────────────────────────────
function detectFramework(pkg) {
  if (hasDep(pkg, 'next'))             return 'nextjs';
  if (hasDep(pkg, 'nuxt', 'nuxt3'))   return 'nuxt';
  if (hasDep(pkg, '@angular/core'))   return 'angular';
  if (hasDep(pkg, 'react'))           return 'react';
  if (hasDep(pkg, 'vue'))             return 'vue';
  if (hasDep(pkg, 'express'))         return 'express';
  if (hasDep(pkg, 'fastify'))         return 'express'; // treat fastify as express-like
  return 'unknown';
}

// ─── Language detection ───────────────────────────────────────────────────────
function detectLanguage(pkg, projectDir) {
  if (hasDep(pkg, 'typescript')) return 'typescript';
  if (fs.existsSync(path.join(projectDir, 'tsconfig.json'))) return 'typescript';
  return 'javascript';
}

// ─── Styling detection ────────────────────────────────────────────────────────
function detectStyling(pkg) {
  if (hasDep(pkg, 'tailwindcss'))                      return 'tailwind';
  if (hasDep(pkg, 'styled-components'))                return 'styled-components';
  if (hasDep(pkg, '@emotion/react', '@emotion/styled')) return 'emotion';
  if (hasDep(pkg, 'sass', 'node-sass', 'sass-embedded')) return 'scss';
  return 'css';
}

// ─── Testing detection ────────────────────────────────────────────────────────
function detectTesting(pkg) {
  if (hasDep(pkg, 'vitest'))  return 'vitest';
  if (hasDep(pkg, 'jest', '@jest/core', 'ts-jest', 'babel-jest')) return 'jest';
  return 'none';
}

// ─── Next.js router detection ─────────────────────────────────────────────────
function detectNextRouter(projectDir) {
  // App Router: src/app/page.tsx or app/page.tsx
  if (
    fs.existsSync(path.join(projectDir, 'src', 'app')) ||
    fs.existsSync(path.join(projectDir, 'app'))
  ) {
    return 'app';
  }
  // Pages Router fallback
  if (
    fs.existsSync(path.join(projectDir, 'src', 'pages')) ||
    fs.existsSync(path.join(projectDir, 'pages'))
  ) {
    return 'pages';
  }
  return 'app'; // default to app router (Next.js 13+)
}

// ─── Src dir detection ────────────────────────────────────────────────────────
function detectSrcDir(projectDir) {
  return fs.existsSync(path.join(projectDir, 'src'));
}

// ─── Main export ──────────────────────────────────────────────────────────────
/**
 * Detect the full stack of the current project.
 *
 * @param {string} [cwd]  Project root (defaults to process.cwd())
 * @returns {object|null} Detected stack config, or null if no package.json found
 */
export function detect(cwd = process.cwd()) {
  const found = findPackageJson(cwd);
  if (!found) return null;

  const { data: pkg, dir: projectDir } = found;
  const framework = detectFramework(pkg);
  const language  = detectLanguage(pkg, projectDir);
  const styling   = detectStyling(pkg);
  const testing   = detectTesting(pkg);
  const hasSrc    = detectSrcDir(projectDir);

  const result = {
    framework,
    language,
    styling,
    testing,
    hasSrc,
    projectDir,
    projectName: pkg.name || path.basename(projectDir),
  };

  if (framework === 'nextjs') {
    result.router = detectNextRouter(projectDir);
  }

  return result;
}

// ─── Human-readable framework labels ─────────────────────────────────────────
export const FRAMEWORK_LABELS = {
  react:   'React',
  nextjs:  'Next.js',
  vue:     'Vue',
  nuxt:    'Nuxt',
  angular: 'Angular',
  express: 'Express / Node',
  unknown: 'Unknown',
};

// ─── Supported generation types per framework ─────────────────────────────────
export const FRAMEWORK_TYPES = {
  react:   ['component', 'hook', 'context', 'page'],
  nextjs:  ['component', 'hook', 'context', 'page', 'layout', 'api-route'],
  vue:     ['component', 'composable', 'store'],
  nuxt:    ['component', 'composable', 'page', 'store'],
  angular: ['component', 'service', 'module', 'guard', 'pipe'],
  express: ['route', 'controller', 'service', 'middleware', 'model'],
};
