// ─── Naming utilities ─────────────────────────────────────────────────────────
// All converters handle: kebab-case, snake_case, PascalCase, camelCase, spaces

/**
 * Convert any string to PascalCase
 * button-group  → ButtonGroup
 * useAuth       → UseAuth
 * my_component  → MyComponent
 */
export function toPascalCase(str) {
  return str
    .replace(/[-_\s]+(.)/g, (_, c) => c.toUpperCase())
    .replace(/^(.)/, (c) => c.toUpperCase());
}

/**
 * Convert any string to camelCase
 * ButtonGroup  → buttonGroup
 * my-hook      → myHook
 */
export function toCamelCase(str) {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

/**
 * Convert any string to kebab-case
 * ButtonGroup  → button-group
 * myHook       → my-hook
 */
export function toKebabCase(str) {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * Convert any string to snake_case
 * ButtonGroup  → button_group
 */
export function toSnakeCase(str) {
  return toKebabCase(str).replace(/-/g, '_');
}

/**
 * Strip common file extensions from a name
 * Button.tsx    → Button
 * useAuth.js    → useAuth
 * auth.service  → auth.service (leaves dot-names intact for Express)
 */
export function stripExtension(raw) {
  return raw.trim().replace(/\.(jsx?|tsx?|vue|html|css|scss|spec\.(ts|js))$/i, '');
}

/**
 * Resolve a clean component name from raw user input
 * "button", "Button", "Button.jsx", "button-group" → "Button" / "ButtonGroup"
 */
export function resolveComponentName(raw) {
  return toPascalCase(stripExtension(raw.trim()));
}

/**
 * Resolve a clean hook name — keeps the "use" prefix, camelCase
 * "auth", "useAuth", "use-auth" → "useAuth"
 */
export function resolveHookName(raw) {
  const base = stripExtension(raw.trim());
  const camel = toCamelCase(base);
  return camel.startsWith('use') ? camel : `use${toPascalCase(base)}`;
}

/**
 * Resolve a clean service/route name — camelCase or PascalCase as needed
 * "users", "UserService", "user-service" → "users"
 */
export function resolveServiceName(raw) {
  const base = stripExtension(raw.trim());
  // strip trailing "Service", "Controller", "Route" suffixes for clean base
  const clean = base.replace(/(Service|Controller|Route|Model|Store|Guard|Pipe|Module)$/i, '');
  return toCamelCase(clean) || toCamelCase(base);
}

/**
 * Returns { pascal, camel, kebab, snake } for a given raw input
 */
export function allForms(raw) {
  const base   = stripExtension(raw.trim());
  const pascal = toPascalCase(base);
  const camel  = toCamelCase(base);
  const kebab  = toKebabCase(base);
  const snake  = toSnakeCase(base);
  return { pascal, camel, kebab, snake, base };
}
