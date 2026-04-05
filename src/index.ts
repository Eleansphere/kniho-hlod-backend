import dotenv from 'dotenv';
dotenv.config();

import { createApp } from '@eleansphere/be-core';
import { bookEntity, loanEntity, profileImageEntity, systemNotificationEntity, userEntity } from '@kniho-hlod/kniho-hlod-service';
import { plugin } from './plugin';
import { logger } from './logger';

function requestLogger(req: any, res: any, next: any): void {
  const start = Date.now();
  res.on('finish', () => {
    const status: number = res.statusCode;
    const level = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info';
    logger[level](`${req.method} ${req.path}`, { status, ms: Date.now() - start });
  });
  next();
}

createApp({
  databaseUrl: process.env.DATABASE_URL!,
  jwtSecret: process.env.JWT_SECRET!,
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  middleware: [requestLogger],
  modelConfigs: [
    { ...bookEntity.config },
    { ...loanEntity.config },
    { ...profileImageEntity.config },
    { ...userEntity.config, skipAutoRoutes: true },
    { ...systemNotificationEntity.config, skipAutoRoutes: true },
  ],
  plugins: [plugin],
  auth: { modelName: 'user' },
});
