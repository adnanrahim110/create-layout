/**
 * Next.js template functions
 */

// ─── App Router page ──────────────────────────────────────────────────────────
export function appRouterPage(isTs) {
  return `export default function {{Name}}Page() {
  return (
    <main>
      <h1>{{Name}}</h1>
    </main>
  );
}
`;
}

// ─── App Router loading ───────────────────────────────────────────────────────
export function appRouterLoading() {
  return `export default function Loading() {
  return (
    <div>
      <p>Loading...</p>
    </div>
  );
}
`;
}

// ─── App Router error ─────────────────────────────────────────────────────────
export function appRouterError(isTs) {
  if (isTs) {
    return `'use client';

import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
`;
  }

  return `'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
`;
}

// ─── App Router layout ────────────────────────────────────────────────────────
export function appRouterLayout(isTs) {
  if (isTs) {
    return `export default function {{Name}}Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {children}
    </section>
  );
}
`;
  }

  return `export default function {{Name}}Layout({ children }) {
  return (
    <section>
      {children}
    </section>
  );
}
`;
}

// ─── Pages Router page ────────────────────────────────────────────────────────
export function pagesRouterPage(isTs) {
  if (isTs) {
    return `import type { NextPage } from 'next';

const {{Name}}Page: NextPage = () => {
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

// ─── Pages Router layout ─────────────────────────────────────────────────────
export function pagesRouterLayout(isTs) {
  if (isTs) {
    return `import React from 'react';

interface {{Name}}LayoutProps {
  children: React.ReactNode;
}

const {{Name}}Layout: React.FC<{{Name}}LayoutProps> = ({ children }) => {
  return (
    <div className="{{name-kebab}}-layout">
      {children}
    </div>
  );
};

export default {{Name}}Layout;
`;
  }

  return `const {{Name}}Layout = ({ children }) => {
  return (
    <div className="{{name-kebab}}-layout">
      {children}
    </div>
  );
};

export default {{Name}}Layout;
`;
}

// ─── App Router API route ─────────────────────────────────────────────────────
export function appRouterApiRoute(isTs) {
  if (isTs) {
    return `import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'OK' });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ data: body }, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  return NextResponse.json({ data: body });
}

export async function DELETE() {
  return NextResponse.json({ message: 'Deleted' });
}
`;
  }

  return `import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'OK' });
}

export async function POST(request) {
  const body = await request.json();
  return NextResponse.json({ data: body }, { status: 201 });
}

export async function PUT(request) {
  const body = await request.json();
  return NextResponse.json({ data: body });
}

export async function DELETE() {
  return NextResponse.json({ message: 'Deleted' });
}
`;
}

// ─── Pages Router API route ───────────────────────────────────────────────────
export function pagesRouterApiRoute(isTs) {
  if (isTs) {
    return `import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return res.status(200).json({ message: 'OK' });

    case 'POST':
      return res.status(201).json({ data: req.body });

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(\`Method \${req.method} Not Allowed\`);
  }
}
`;
  }

  return `export default function handler(req, res) {
  switch (req.method) {
    case 'GET':
      return res.status(200).json({ message: 'OK' });

    case 'POST':
      return res.status(201).json({ data: req.body });

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(\`Method \${req.method} Not Allowed\`);
  }
}
`;
}
