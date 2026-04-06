import { ProjectPlugin, createExtractUser } from '@eleansphere/be-core';
import { registerAuthRoutes } from './routes/auth';
import { registerUserRoutes } from './routes/users';
import { registerSystemNotificationRoutes } from './routes/system-notifications';
import { registerProfileImageRoutes } from './routes/profile-images';

export const plugin: ProjectPlugin = {
  registerRoutes(app, _sequelize, models) {
    const extractUser = createExtractUser(process.env.JWT_SECRET!);

    registerAuthRoutes(app, models['user'], extractUser);
    registerUserRoutes(app, models['user'], extractUser);
    registerSystemNotificationRoutes(app, models['systemNotification'], extractUser);
    registerProfileImageRoutes(app, models['profileImage'], extractUser);
  },
};
