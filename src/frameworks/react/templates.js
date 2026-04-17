/**
 * React template functions
 * All templates use {{token}} placeholders resolved by core/template.js
 */

// ─── Component ────────────────────────────────────────────────────────────────
export function component(styling, isTs) {
  const propsType = isTs
    ? `\ninterface {{Name}}Props {}\n`
    : '';

  const propsAnnotation = isTs ? ': React.FC<{{Name}}Props>' : '';

  const styleImport = styleImportFor(styling);
  const classAttr   = classAttrFor(styling);

  return `import React from 'react';${styleImport}
${propsType}
const {{Name}}${propsAnnotation} = () => {
  return (
    <div${classAttr}>
      {{Name}}
    </div>
  );
};

export default {{Name}};
`;
}

// ─── Component test ───────────────────────────────────────────────────────────
export function componentTest(testing, isTs) {
  if (testing === 'vitest') {
    return `import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {{Name}} from './{{Name}}';

describe('{{Name}}', () => {
  it('renders without crashing', () => {
    render(<{{Name}} />);
    expect(screen.getByText('{{Name}}')).toBeDefined();
  });
});
`;
  }

  // Jest
  return `import { render, screen } from '@testing-library/react';
import {{Name}} from './{{Name}}';

describe('{{Name}}', () => {
  it('renders without crashing', () => {
    render(<{{Name}} />);
    expect(screen.getByText('{{Name}}')).toBeInTheDocument();
  });
});
`;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function hook(isTs) {
  if (isTs) {
    return `import { useState, useEffect } from 'react';

interface Use{{Name}}Options {}

interface Use{{Name}}Return {
  // define return shape
}

export function {{name}}(options?: Use{{Name}}Options): Use{{Name}}Return {
  const [state, setState] = useState<null>(null);

  useEffect(() => {
    // effect logic
  }, []);

  return {};
}
`;
  }

  return `import { useState, useEffect } from 'react';

export function {{name}}(options = {}) {
  const [state, setState] = useState(null);

  useEffect(() => {
    // effect logic
  }, []);

  return {};
}
`;
}

// ─── Hook test ────────────────────────────────────────────────────────────────
export function hookTest(testing, isTs) {
  if (testing === 'vitest') {
    return `import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { {{name}} } from './{{name}}';

describe('{{name}}', () => {
  it('initialises without error', () => {
    const { result } = renderHook(() => {{name}}());
    expect(result.current).toBeDefined();
  });
});
`;
  }

  return `import { renderHook } from '@testing-library/react';
import { {{name}} } from './{{name}}';

describe('{{name}}', () => {
  it('initialises without error', () => {
    const { result } = renderHook(() => {{name}}());
    expect(result.current).toBeDefined();
  });
});
`;
}

// ─── Context ──────────────────────────────────────────────────────────────────
export function context(isTs) {
  if (isTs) {
    return `import React, { createContext, useContext, useState } from 'react';

interface {{Name}}ContextType {
  // define context shape
}

const {{Name}}Context = createContext<{{Name}}ContextType | undefined>(undefined);

interface {{Name}}ProviderProps {
  children: React.ReactNode;
}

export const {{Name}}Provider: React.FC<{{Name}}ProviderProps> = ({ children }) => {
  return (
    <{{Name}}Context.Provider value={{}}>
      {children}
    </{{Name}}Context.Provider>
  );
};

export function use{{Name}}Context(): {{Name}}ContextType {
  const ctx = useContext({{Name}}Context);
  if (!ctx) {
    throw new Error('use{{Name}}Context must be used within {{Name}}Provider');
  }
  return ctx;
}

export default {{Name}}Context;
`;
  }

  return `import React, { createContext, useContext, useState } from 'react';

const {{Name}}Context = createContext(undefined);

export const {{Name}}Provider = ({ children }) => {
  return (
    <{{Name}}Context.Provider value={{}}>
      {children}
    </{{Name}}Context.Provider>
  );
};

export function use{{Name}}Context() {
  const ctx = useContext({{Name}}Context);
  if (!ctx) {
    throw new Error('use{{Name}}Context must be used within {{Name}}Provider');
  }
  return ctx;
}

export default {{Name}}Context;
`;
}

// ─── Context test ─────────────────────────────────────────────────────────────
export function contextTest(testing, isTs) {
  if (testing === 'vitest') {
    return `import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { {{Name}}Provider } from './{{Name}}Context';

describe('{{Name}}Context', () => {
  it('renders provider without crashing', () => {
    const { container } = render(
      <{{Name}}Provider>
        <div>test</div>
      </{{Name}}Provider>
    );
    expect(container).toBeDefined();
  });
});
`;
  }

  return `import { render } from '@testing-library/react';
import { {{Name}}Provider } from './{{Name}}Context';

describe('{{Name}}Context', () => {
  it('renders provider without crashing', () => {
    const { container } = render(
      <{{Name}}Provider>
        <div>test</div>
      </{{Name}}Provider>
    );
    expect(container).toBeTruthy();
  });
});
`;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export function page(isTs) {
  if (isTs) {
    return `const {{Name}}Page = () => {
  return (
    <main>
      <h1>{{Name}}</h1>
    </main>
  );
};

export default {{Name}}Page;
`;
  }

  return `const {{Name}}Page = () => {
  return (
    <main>
      <h1>{{Name}}</h1>
    </main>
  );
};

export default {{Name}}Page;
`;
}

// ─── Style helpers ────────────────────────────────────────────────────────────
function styleImportFor(styling) {
  switch (styling) {
    case 'css-modules':       return `\nimport styles from './{{Name}}.module.css';`;
    case 'scss-modules':      return `\nimport styles from './{{Name}}.module.scss';`;
    case 'scss':              return `\nimport './{{Name}}.scss';`;
    case 'css':               return `\nimport './{{Name}}.css';`;
    case 'styled-components': return `\nimport styled from 'styled-components';`;
    case 'emotion':           return `\nimport { css } from '@emotion/react';`;
    default:                  return '';
  }
}

function classAttrFor(styling) {
  switch (styling) {
    case 'css-modules':
    case 'scss-modules':
      return ` className={styles.container}`;
    case 'tailwind':
      return ` className=""`;
    case 'styled-components':
    case 'emotion':
      return '';
    default:
      return ` className="{{name-kebab}}"`;
  }
}

export function cssModule(name) {
  return `.container {\n  /* ${name} styles */\n}\n`;
}

export function scssModule(name) {
  return `.container {\n  // ${name} styles\n}\n`;
}

export function scss(name) {
  return `.${name.toLowerCase()} {\n  // ${name} styles\n}\n`;
}

export function css(name) {
  return `.${name.toLowerCase()} {\n  /* ${name} styles */\n}\n`;
}
