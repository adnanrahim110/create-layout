/**
 * Nuxt 3 template functions
 */

// ─── Page ─────────────────────────────────────────────────────────────────────
export function page(isTs) {
  const lang = isTs ? ' lang="ts"' : '';
  return `<script setup${lang}>
definePageMeta({
  title: '{{Name}}',
});
</script>

<template>
  <main>
    <h1>{{Name}}</h1>
  </main>
</template>
`;
}

// ─── Composable (Nuxt auto-imports aware) ─────────────────────────────────────
export function composable(isTs) {
  if (isTs) {
    return `export function {{name}}() {
  // Nuxt auto-imported composables (useFetch, useState, etc.) are available globally
  const state = useState<null>('{{name-kebab}}', () => null);

  return { state };
}
`;
  }

  return `export function {{name}}() {
  const state = useState('{{name-kebab}}', () => null);

  return { state };
}
`;
}
