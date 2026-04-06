// src/routes/system-notifications.ts
import { Application, Request, Response, NextFunction, RequestHandler } from 'express';
import { ModelStatic, Model, Op } from 'sequelize';
import { createCrudRouter, generateId } from '@eleansphere/be-core';
import { makeRequestLogger } from '../middleware/request-logger';
import { logger } from '../logger';

export function registerSystemNotificationRoutes(
  app: Application,
  SystemNotificationModel: ModelStatic<Model>,
  extractUser: RequestHandler
): void {
  // GET /active is public — no JWT required
  app.get(
    '/api/system-notifications/active',
    async (_req: Request, res: Response, next: NextFunction) => {
      try {
        const now = new Date();
        const records = await SystemNotificationModel.findAll({
          where: {
            activeFrom: { [Op.lte]: now },
            activeTo: { [Op.gte]: now },
          },
          order: [['activeFrom', 'ASC']],
        });
        res.json(records.map((r) => r.toJSON()));
      } catch (err) {
        logger.error('Failed to fetch active system notifications', { err });
        next(err);
      }
    }
  );

  // CRUD for admin — protected by JWT
  app.use('/api/system-notifications', extractUser);
  app.use(
    '/api/system-notifications',
    createCrudRouter({
      model: SystemNotificationModel,
      prefix: 'sn',
      generateId,
      log: true,
      middleware: [makeRequestLogger('/api/system-notifications')],
    })
  );
}
