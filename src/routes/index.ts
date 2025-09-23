import { Express } from 'express';
import userRoutes from './user-routes';
import bookRoutes from './book-routes';
import loanRoutes from './loan-routes';
import authorizationRoutes from './authorization-routes';
import profileImagesUploadRoutes from './profile-images-upload-routes';
import profileImagesCrudRoutes from './profile-images-crud-routes';

export function setupRoutes(app: Express) {
  app.use('/api/users', userRoutes);
  app.use('/api/books', bookRoutes);
  app.use('/api/loans', loanRoutes);
  app.use('/api', authorizationRoutes);
  app.use('/api/profile-images', profileImagesUploadRoutes);
  app.use('/api/profile-images', profileImagesCrudRoutes);
}
