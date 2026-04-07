// src/routes/auth.ts
import { Application, Request, Response, NextFunction, RequestHandler } from 'express';
import { ModelStatic, Model } from 'sequelize';
import bcrypt from 'bcrypt';
import { logger } from '../logger';

const SALT_ROUNDS = 10;

export function registerAuthRoutes(
  app: Application,
  UserModel: ModelStatic<Model>,
  extractUser: RequestHandler
): void {
  app.post(
    '/api/auth/change-password',
    extractUser,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { currentPassword, newPassword } = req.body as {
          currentPassword: string;
          newPassword: string;
        };

        if (!currentPassword || !newPassword) {
          res.status(400).json({
            error: 'Bad Request',
            message: 'Current password and new password are required',
            statusCode: 400,
          });
          return;
        }

        const user = await UserModel.findByPk(req.user!.id);
        if (!user) {
          res.status(404).json({ error: 'Not Found', message: 'User not found', statusCode: 404 });
          return;
        }

        const match = await bcrypt.compare(currentPassword, user.get('password') as string);
        if (!match) {
          res.status(401).json({
            error: 'Unauthorized',
            message: 'Incorrect current password',
            statusCode: 401,
          });
          return;
        }

        const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);
        await user.update({ password: hashed });
        logger.info({ userId: req.user!.id }, 'Password changed');
        res.json({ message: 'Password changed successfully' });
      } catch (err) {
        next(err);
      }
    }
  );
}
