import { ProjectPlugin, createCrudRouter, createExtractUser, createFileRouter, generateId } from '@eleansphere/be-core';
import bcrypt from 'bcrypt';
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
    app.use('/api/profile-images', extractUser, makeRequestLogger('/api/profile-images'));
    app.use(
      '/api/profile-images',
      createFileRouter(models['profileImage'], { fieldName: 'avatar', blobColumn: 'avatar' })
    );
  },
};
