/**
 * Vue 3 template functions (Composition API + <script setup>)
 */

// ─── Component ────────────────────────────────────────────────────────────────
export function component(styling, isTs) {
  const lang     = isTs ? ' lang="ts"' : '';
  const styleTag = styleBlockFor(styling);
  const classAttr = classAttrFor(styling);

  return `<script setup${lang}>
// component logic
</script>

<template>
  <div${classAttr}>
    {{Name}}
  </div>
</template>
${styleTag}`;
}

// ─── Component test (Vitest + Vue Test Utils) ─────────────────────────────────
export function componentTest(testing, isTs) {
  const importLine = testing === 'vitest'
    ? `import { describe, it, expect } from 'vitest';`
    : '';

  return `${importLine}
import { mount } from '@vue/test-utils';
import {{Name}} from './{{Name}}.vue';

describe('{{Name}}', () => {
  it('renders without crashing', () => {
    const wrapper = mount({{Name}});
    expect(wrapper.exists()).toBe(true);
  });
});
`.trimStart();
}

// ─── Composable ───────────────────────────────────────────────────────────────
export function composable(isTs) {
  if (isTs) {
    return `import { ref, onMounted } from 'vue';

interface Use{{Name}}Options {}

export function {{name}}(options?: Use{{Name}}Options) {
  const state = ref<null>(null);

  onMounted(() => {
    // setup logic
  });

  return { state };
}
`;
  }

  return `import { ref, onMounted } from 'vue';

export function {{name}}(options = {}) {
  const state = ref(null);

  onMounted(() => {
    // setup logic
  });

  return { state };
}
`;
}

// ─── Composable test ──────────────────────────────────────────────────────────
export function composableTest(testing, isTs) {
  const vitestImport = testing === 'vitest'
    ? `import { describe, it, expect } from 'vitest';\n`
    : '';

  return `${vitestImport}import { {{name}} } from './{{name}}';

describe('{{name}}', () => {
  it('initialises without error', () => {
    const result = {{name}}();
    expect(result).toBeDefined();
  });
});
`;
}

// ─── Store (Pinia) ────────────────────────────────────────────────────────────
export function store(isTs) {
  if (isTs) {
    return `import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const use{{Name}}Store = defineStore('{{name-kebab}}', () => {
  const state = ref<null>(null);
  const isLoaded = computed(() => state.value !== null);

  function setState(value: unknown) {
    state.value = value as null;
  }

  function reset() {
    state.value = null;
  }

  return { state, isLoaded, setState, reset };
});
`;
  }

  return `import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const use{{Name}}Store = defineStore('{{name-kebab}}', () => {
  const state = ref(null);
  const isLoaded = computed(() => state.value !== null);

  function setState(value) {
    state.value = value;
  }

  function reset() {
    state.value = null;
  }

  return { state, isLoaded, setState, reset };
});
`;
}

// ─── Style block helpers ──────────────────────────────────────────────────────
function styleBlockFor(styling) {
  switch (styling) {
    case 'css-modules':
      return `\n<style module>\n.container {\n  /* {{Name}} styles */\n}\n</style>\n`;
    case 'scss-modules':
      return `\n<style module lang="scss">\n.container {\n  // {{Name}} styles\n}\n</style>\n`;
    case 'scss':
      return `\n<style scoped lang="scss">\n// {{Name}} styles\n</style>\n`;
    case 'none':
      return '';
    default:
      return `\n<style scoped>\n/* {{Name}} styles */\n</style>\n`;
  }
}

function classAttrFor(styling) {
  switch (styling) {
    case 'css-modules':
    case 'scss-modules':
      return ' :class="$style.container"';
    case 'tailwind':
      return ' class=""';
    default:
      return ' class="{{name-kebab}}"';
  }
}
