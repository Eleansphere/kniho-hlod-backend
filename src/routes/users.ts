// src/routes/users.ts
import { Application, RequestHandler } from 'express';
import { ModelStatic, Model } from 'sequelize';
import { createCrudRouter, generateId } from '@eleansphere/be-core';
import bcrypt from 'bcrypt';
import { logger } from '../logger';
import { makeRequestLogger } from '../middleware/request-logger';

const SALT_ROUNDS = 10;

export function registerUserRoutes(
  app: Application,
  UserModel: ModelStatic<Model>,
  extractUser: RequestHandler
): void {
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
            throw new Error('All fields are required');
          }
          const existing = await UserModel.findOne({ where: { email: data.email } });
          if (existing) {
            logger.warn('User creation rejected: email already exists', { email: data.email });
            throw new Error('A user with this email already exists');
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
        },
      },
    })
  );
}
