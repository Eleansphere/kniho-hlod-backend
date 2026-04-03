import dotenv from 'dotenv';
dotenv.config();

import { createApp } from '@eleansphere/be-core';
import { bookEntity, loanEntity, profileImageEntity } from '@kniho-hlod/kniho-hlod-service';
import { plugin } from './plugin';

createApp({
  databaseUrl: process.env.DATABASE_URL!,
  jwtSecret: process.env.JWT_SECRET!,
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  modelConfigs: [
    {...bookEntity.config, log: true },
    { ...loanEntity.config, log: true },
    { ...profileImageEntity.config, log: true },
  ],
  plugins: [plugin],
  auth: { modelName: 'user' },
});
