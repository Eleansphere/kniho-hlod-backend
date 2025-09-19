import { Router, Request, Response } from 'express';
import { Model, ModelStatic } from 'sequelize';

type GenericCrudOptions<T extends Model> = {
  model: ModelStatic<T>;
  prefix?: string;
  generateId?: (prefix: string) => string;
  log?: boolean; // jestli se má logovat
};

export function createCrudRouter<T extends Model>(options: GenericCrudOptions<T>): Router {
  const { model, prefix, generateId, log = true } = options;
  const router = Router();

  function logAction(action: string, payload?: unknown) {
    if (!log) return;
    console.log(`[${model.name}] ${action}`, payload ?? '');
  }

  // CREATE
  router.post('/', async (req: Request, res: Response) => {
    try {
      const data = { ...req.body };
      if (generateId && prefix) {
        data.id = generateId(prefix);
      }

      logAction('CREATE request', data);

      const entity = await model.create(data);
      res.status(201).json(entity);

      logAction('CREATE success', entity.toJSON());
    } catch (err) {
      logAction('CREATE error', err);
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // READ all
  router.get('/', async (_req: Request, res: Response) => {
    try {
      logAction('READ all request');
      const entities = await model.findAll();
      res.status(200).json(entities);
    } catch (err) {
      logAction('READ all error', err);
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // READ by ID
  router.get('/:id', async (req: Request, res: Response) => {
    try {
      logAction('READ by ID request', req.params.id);
      const entity = await model.findByPk(req.params.id);
      if (!entity) {
        logAction('READ by ID not found', req.params.id);
        return res.status(404).json({ message: 'Not found' });
      }
      res.json(entity);
    } catch (err) {
      logAction('READ by ID error', err);
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // UPDATE
  router.put('/:id', async (req: Request, res: Response) => {
    try {
      logAction('UPDATE request', { id: req.params.id, body: req.body });
      const entity = await model.findByPk(req.params.id);
      if (!entity) {
        logAction('UPDATE not found', req.params.id);
        return res.status(404).json({ message: 'Not found' });
      }
      await entity.update(req.body);
      res.json(entity);
      logAction('UPDATE success', entity.toJSON());
    } catch (err) {
      logAction('UPDATE error', err);
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // DELETE
  router.delete('/:id', async (req: Request, res: Response) => {
    try {
      logAction('DELETE request', req.params.id);
      const entity = await model.findByPk(req.params.id);
      if (!entity) {
        logAction('DELETE not found', req.params.id);
        return res.status(404).json({ message: 'Not found' });
      }
      await entity.destroy();
      res.status(204).send();
      logAction('DELETE success', req.params.id);
    } catch (err) {
      logAction('DELETE error', err);
      res.status(500).json({ error: (err as Error).message });
    }
  });

  return router;
}
