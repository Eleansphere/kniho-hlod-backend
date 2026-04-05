import { ProjectPlugin, createCrudRouter, createExtractUser, createFileRouter, generateId } from '@eleansphere/be-core';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { logger } from './logger';

const SALT_ROUNDS = 10;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function makeRequestLogger(prefix: string): (req: any, res: any, next: any) => void {
  return (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const status: number = res.statusCode;
      const level = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info';
      const path: string = req.path === '/' ? '' : req.path;
      logger[level](`${req.method} ${prefix}${path}`, { status, ms: Date.now() - start });
    });
    next();
  };
}

export const plugin: ProjectPlugin = {
  registerRoutes(app, _sequelize, models) {
    const extractUser = createExtractUser(process.env.JWT_SECRET!);
    const SystemNotificationModel = models['systemNotification'];

    // GET /active is public — no JWT required
    app.get('/api/system-notifications/active', async (_req: any, res: any) => {
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
        res.status(500).json({ error: 'Internal server error' });
      }
    });

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
    const UserModel = models['user'];

    // User CRUD — vlastní hook pro bcrypt
    app.use(
      '/api/users',
      extractUser,
      createCrudRouter({
        model: UserModel,
        prefix: 'u',
        generateId,
        log: true,
        middleware: [makeRequestLogger('/api/users')],
        hooks: {
          beforeCreate: async (data) => {
            if (!data.username || !data.email || !data.password || !data.role) {
              logger.warn('User creation rejected: missing required fields');
              throw new Error('Všechna pole jsou povinná');
            }
            const existing = await UserModel.findOne({ where: { email: data.email } });
            if (existing) {
              logger.warn('User creation rejected: email already exists', { email: data.email });
              throw new Error('Uživatel s tímto e-mailem už existuje');
            }
            data.password = await bcrypt.hash(data.password, SALT_ROUNDS);
            return data;
          },
          beforeUpdate: async (data) => {
            if (data.password && !data.password.startsWith('$2b$')) {
              data.password = await bcrypt.hash(data.password, SALT_ROUNDS);
              logger.info('User password updated');
            }
            return data;
          }
        },
      })
    );

    // File upload pro profile images
    // GET /:id/avatar is public (browser <img> can't send JWT headers)
    app.use('/api/profile-images', (req: any, res: any, next: any) => {
      if (req.method === 'GET' && /\/[^/]+\/avatar$/.test(req.path)) return next();
      return extractUser(req, res, next);
    });
    app.use('/api/profile-images', makeRequestLogger('/api/profile-images'));
    app.use(
      '/api/profile-images',
      createFileRouter(models['profileImage'], { fieldName: 'avatar', blobColumn: 'avatar' })
    );
  },
};
