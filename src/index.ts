import dotenv from 'dotenv';
dotenv.config();

import { createApp } from '@eleansphere/be-core';
import { bookConfig, loanConfig, profileImageConfig } from '@eleansphere/kniho-hlod-service';
import { plugin } from './plugin';

createApp({
  databaseUrl: process.env.DATABASE_URL!,
  jwtSecret: process.env.JWT_SECRET!,
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  modelConfigs: [
    { ...bookConfig, log: true },
    { ...loanConfig, log: true },
    { ...profileImageConfig, log: true },
  ],
  plugins: [plugin],
  auth: { modelName: 'user' },
});
