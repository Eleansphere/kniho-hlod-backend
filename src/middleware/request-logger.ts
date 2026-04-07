import { Request, Response, NextFunction } from 'express';
import { logger } from '../logger';

export function makeRequestLogger(prefix: string): (req: Request, res: Response, next: NextFunction) => void {
  return (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const status: number = res.statusCode;
      const level = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info';
      const path: string = req.path === '/' ? '' : req.path;
      logger[level]({ status, ms: Date.now() - start }, `${req.method} ${prefix}${path}`);
    });
    next();
  };
}
