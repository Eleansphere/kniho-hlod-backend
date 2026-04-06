// src/routes/profile-images.ts
import { Application, Request, Response, NextFunction, RequestHandler } from 'express';
import { Model } from 'sequelize';
import { createFileRouter } from '@eleansphere/be-core';
import { makeRequestLogger } from '../middleware/request-logger';

type ModelClass = typeof Model;

export function registerProfileImageRoutes(
  app: Application,
  ProfileImageModel: ModelClass,
  extractUser: RequestHandler
): void {
  // GET /:id/avatar is public — browser <img> tags can't send JWT headers
  app.use('/api/profile-images', (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'GET' && /\/[^/]+\/avatar$/.test(req.path)) return next();
    return extractUser(req, res, next);
  });

  app.use('/api/profile-images', makeRequestLogger('/api/profile-images'));
  app.use(
    '/api/profile-images',
    createFileRouter(ProfileImageModel, { fieldName: 'avatar', blobColumn: 'avatar' })
  );
}
