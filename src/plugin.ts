import { DataTypes, ProjectPlugin, createCrudRouter, createFileRouter, createVerifyToken, generateId } from '@eleansphere/be-core';
import { Sequelize } from 'sequelize';
import bcrypt from 'bcrypt';
import User from './models/user';
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
  registerModels(sequelize: Sequelize) {
    User.initModel(
      sequelize,
      {
        username: { type: DataTypes.STRING, allowNull: false },
        password: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, unique: true, allowNull: false },
        role: { type: DataTypes.STRING, allowNull: false },
      },
      { modelName: 'user' }
    );
  },

  registerRoutes(app, _sequelize, models) {
    const verifyToken = createVerifyToken(process.env.JWT_SECRET!);

    // User CRUD — vlastní hook pro bcrypt
    app.use(
      '/api/users',
      createCrudRouter({
        model: User,
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
            const existing = await User.findOne({ where: { email: data.email } });
            if (existing) {
              logger.warn('User creation rejected: email already exists', { email: data.email });
              throw new Error('Uživatel s tímto e-mailem už existuje');
            }
            data.password = await bcrypt.hash(data.password, SALT_ROUNDS);
            return data;
          },
          beforeUpdate: async (data) => {
            if (data.password) {
              data.password = await bcrypt.hash(data.password, SALT_ROUNDS);
              logger.info('User password updated');
            }
            return data;
          },
        },
      })
    );

    // File upload pro profile images
    app.use('/api/profile-images', makeRequestLogger('/api/profile-images'));
    app.use(
      '/api/profile-images',
      createFileRouter(models['profileImage'], { fieldName: 'avatar', blobColumn: 'avatar' })
    );

    // Pro chráněné routy: middleware: [verifyToken]
    void verifyToken;
  },
};
