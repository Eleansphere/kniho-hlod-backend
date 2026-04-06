import { Request, Response, NextFunction } from 'express';
import { logger } from '../logger';

interface AppError extends Error {
  status?: number;
  statusCode?: number;
}

export function errorHandler(err: AppError, _req: Request, res: Response, _next: NextFunction): void {
  const statusCode = err.status ?? err.statusCode ?? 500;
  const error =
    statusCode >= 500 ? 'Internal Server Error' : err.name !== 'Error' ? err.name : 'Error';
  const message = statusCode >= 500 ? 'An unexpected error occurred' : err.message;

  if (statusCode >= 500) {
    logger.error('Unhandled error', { err });
  }

  res.status(statusCode).json({ error, message, statusCode });
}
