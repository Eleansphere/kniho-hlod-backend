import dotenv from 'dotenv';
dotenv.config();

import { createApp } from '@eleansphere/be-core';
import {
  bookEntity,
  loanEntity,
  profileImageEntity,
  systemNotificationEntity,
  userEntity,
} from '@kniho-hlod/kniho-hlod-service';
import { plugin } from './plugin';
import { makeRequestLogger } from './middleware/request-logger';

createApp({
  databaseUrl: process.env.DATABASE_URL!,
  jwtSecret: process.env.JWT_SECRET!,
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  middleware: [makeRequestLogger('')],
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
