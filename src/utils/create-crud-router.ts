import { Router, Request, Response } from "express";
import { Model, ModelStatic } from "sequelize";

type GenericCrudOptions<T extends Model> = {
  model: ModelStatic<T>;
  idField?: string; // default 'id'
};

export function createCrudRouter<T extends Model>(options: GenericCrudOptions<T>): Router {
  const { model, idField = 'id' } = options;
  const router = Router();

  // CREATE
  router.post('/', async (req: Request, res: Response) => {
    try {
      const entity = await model.create(req.body);
      res.status(201).json(entity);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // READ all
  router.get('/', async (_req: Request, res: Response) => {
    try {
      const entities = await model.findAll();
      res.status(200).json(entities);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // READ by ID
  router.get(`/:id`, async (req: Request, res: Response) => {
    try {
      const entity = await model.findByPk(req.params.id);
      if (!entity) return res.status(404).json({ message: 'Not found' });
      res.json(entity);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // UPDATE
  router.put(`/:id`, async (req: Request, res: Response) => {
    try {
      const entity = await model.findByPk(req.params.id);
      if (!entity) return res.status(404).json({ message: 'Not found' });
      await entity.update(req.body);
      res.json(entity);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // DELETE
  router.delete(`/:id`, async (req: Request, res: Response) => {
    try {
      const entity = await model.findByPk(req.params.id);
      if (!entity) return res.status(404).json({ message: 'Not found' });
      await entity.destroy();
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  return router;
}