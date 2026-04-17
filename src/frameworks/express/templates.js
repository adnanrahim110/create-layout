/**
 * Express / Node template functions
 */

// ─── Route ────────────────────────────────────────────────────────────────────
export function route(isTs) {
  if (isTs) {
    return `import { Router } from 'express';
import { {{Name}}Controller } from '../controllers/{{name-kebab}}.controller.js';

const router = Router();
const controller = new {{Name}}Controller();

router.get('/',    controller.getAll.bind(controller));
router.get('/:id', controller.getById.bind(controller));
router.post('/',   controller.create.bind(controller));
router.put('/:id', controller.update.bind(controller));
router.delete('/:id', controller.remove.bind(controller));

export default router;
`;
  }

  return `import express from 'express';
import { {{Name}}Controller } from '../controllers/{{name-kebab}}.controller.js';

const router = express.Router();
const controller = new {{Name}}Controller();

router.get('/',    controller.getAll.bind(controller));
router.get('/:id', controller.getById.bind(controller));
router.post('/',   controller.create.bind(controller));
router.put('/:id', controller.update.bind(controller));
router.delete('/:id', controller.remove.bind(controller));

export default router;
`;
}

// ─── Controller ───────────────────────────────────────────────────────────────
export function controller(isTs) {
  if (isTs) {
    return `import type { Request, Response } from 'express';
import { {{Name}}Service } from '../services/{{name-kebab}}.service.js';

export class {{Name}}Controller {
  private service = new {{Name}}Service();

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.service.findAll();
      res.json(data);
    } catch (err: unknown) {
      res.status(500).json({ error: (err as Error).message });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.service.findById(req.params.id);
      if (!data) { res.status(404).json({ error: 'Not found' }); return; }
      res.json(data);
    } catch (err: unknown) {
      res.status(500).json({ error: (err as Error).message });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.service.create(req.body);
      res.status(201).json(data);
    } catch (err: unknown) {
      res.status(500).json({ error: (err as Error).message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.service.update(req.params.id, req.body);
      if (!data) { res.status(404).json({ error: 'Not found' }); return; }
      res.json(data);
    } catch (err: unknown) {
      res.status(500).json({ error: (err as Error).message });
    }
  }

  async remove(req: Request, res: Response): Promise<void> {
    try {
      await this.service.remove(req.params.id);
      res.status(204).send();
    } catch (err: unknown) {
      res.status(500).json({ error: (err as Error).message });
    }
  }
}
`;
  }

  return `import { {{Name}}Service } from '../services/{{name-kebab}}.service.js';

export class {{Name}}Controller {
  constructor() {
    this.service = new {{Name}}Service();
  }

  async getAll(req, res) {
    try {
      res.json(await this.service.findAll());
    } catch (err) { res.status(500).json({ error: err.message }); }
  }

  async getById(req, res) {
    try {
      const data = await this.service.findById(req.params.id);
      if (!data) return res.status(404).json({ error: 'Not found' });
      res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
  }

  async create(req, res) {
    try {
      res.status(201).json(await this.service.create(req.body));
    } catch (err) { res.status(500).json({ error: err.message }); }
  }

  async update(req, res) {
    try {
      const data = await this.service.update(req.params.id, req.body);
      if (!data) return res.status(404).json({ error: 'Not found' });
      res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
  }

  async remove(req, res) {
    try {
      await this.service.remove(req.params.id);
      res.status(204).send();
    } catch (err) { res.status(500).json({ error: err.message }); }
  }
}
`;
}

// ─── Service ──────────────────────────────────────────────────────────────────
export function service(isTs) {
  if (isTs) {
    return `export class {{Name}}Service {
  async findAll(): Promise<unknown[]> {
    // TODO: implement
    return [];
  }

  async findById(id: string): Promise<unknown | null> {
    // TODO: implement
    return null;
  }

  async create(data: unknown): Promise<unknown> {
    // TODO: implement
    return data;
  }

  async update(id: string, data: unknown): Promise<unknown | null> {
    // TODO: implement
    return data;
  }

  async remove(id: string): Promise<void> {
    // TODO: implement
  }
}
`;
  }

  return `export class {{Name}}Service {
  async findAll() { return []; }
  async findById(id) { return null; }
  async create(data) { return data; }
  async update(id, data) { return data; }
  async remove(id) {}
}
`;
}

// ─── Middleware ────────────────────────────────────────────────────────────────
export function middleware(isTs) {
  if (isTs) {
    return `import type { Request, Response, NextFunction } from 'express';

export function {{name}}Middleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // TODO: implement middleware logic
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  next();
}
`;
  }

  return `/**
 * {{Name}} middleware
 */
export function {{name}}Middleware(req, res, next) {
  // TODO: implement middleware logic
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
}
`;
}

// ─── Model (Mongoose) ─────────────────────────────────────────────────────────
export function model(isTs) {
  if (isTs) {
    return `import mongoose, { type Document, Schema } from 'mongoose';

export interface I{{Name}} extends Document {
  createdAt: Date;
  updatedAt: Date;
  // TODO: add fields
}

const {{Name}}Schema = new Schema<I{{Name}}>(
  {
    // TODO: define fields
    // name: { type: String, required: true },
  },
  { timestamps: true }
);

export const {{Name}} = mongoose.model<I{{Name}}>('{{Name}}', {{Name}}Schema);
`;
  }

  return `import mongoose from 'mongoose';

const {{Name}}Schema = new mongoose.Schema(
  {
    // TODO: define fields
    // name: { type: String, required: true },
  },
  { timestamps: true }
);

export const {{Name}} = mongoose.model('{{Name}}', {{Name}}Schema);
`;
}
