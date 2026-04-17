/**
 * Lightweight template engine — no external deps needed.
 *
 * Supported tokens (all replaced globally, case-sensitive):
 *   {{Name}}        PascalCase component name          e.g. ButtonGroup
 *   {{name}}        camelCase name                     e.g. buttonGroup
 *   {{name-kebab}}  kebab-case name                    e.g. button-group
 *   {{name_snake}}  snake_case name                    e.g. button_group
 *   {{ext}}         file extension without dot         e.g. tsx
 *   {{styleExt}}    style file extension without dot   e.g. module.css
 *   {{selector}}    Angular component selector         e.g. app-button-group
 */

/**
 * Render a template string with a token map.
 *
 * @param {string} template  Template string with {{token}} placeholders
 * @param {object} vars      Key→value token map
 * @returns {string}
 */
export function render(template, vars = {}) {
  return template.replace(/\{\{(\w[\w-]*)\}\}/g, (match, key) => {
    // Support keys with hyphens by direct lookup
    if (key in vars) return vars[key];
    return match; // leave unknown tokens intact
  });
}

/**
 * Build the standard token map from allForms() output + extra fields.
 *
 * @param {object} forms   { pascal, camel, kebab, snake }
 * @param {object} extras  Any additional tokens
 */
export function makeVars(forms, extras = {}) {
  return {
    'Name':       forms.pascal,
    'name':       forms.camel,
    'name-kebab': forms.kebab,
    'name_snake': forms.snake,
    ...extras,
  };
}
