import { DataTypes, ProjectPlugin, createCrudRouter, createFileRouter, createVerifyToken, generateId } from '@eleansphere/be-core';
import { Sequelize } from 'sequelize';
import bcrypt from 'bcrypt';
import User from './models/user';
import { ProfileImage } from './models/profile-images';

const SALT_ROUNDS = 10;

export const plugin: ProjectPlugin = {
  registerModels(sequelize: Sequelize) {
    User.initModel(
      sequelize,
      {
        username: { type: DataTypes.STRING, allowNull: false },
        password: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, unique: true, allowNull: false },
        role: { type: DataTypes.STRING, allowNull: false },
      },
      { modelName: 'user' }
    );
  },

  registerRoutes(app) {
    const verifyToken = createVerifyToken(process.env.JWT_SECRET!);

    // User CRUD — vlastní hook pro bcrypt
    app.use(
      '/api/users',
      createCrudRouter({
        model: User,
        prefix: 'u',
        generateId,
        log: true,
        hooks: {
          beforeCreate: async (data) => {
            if (!data.username || !data.email || !data.password || !data.role) {
              throw new Error('Všechna pole jsou povinná');
            }
            const existing = await User.findOne({ where: { email: data.email } });
            if (existing) throw new Error('Uživatel s tímto e-mailem už existuje');
            data.password = await bcrypt.hash(data.password, SALT_ROUNDS);
            return data;
          },
          beforeUpdate: async (data) => {
            if (data.password) data.password = await bcrypt.hash(data.password, SALT_ROUNDS);
            return data;
          },
        },
      })
    );

    // File upload pro profile images
    app.use(
      '/api/profile-images',
      createFileRouter(ProfileImage, { fieldName: 'avatar', blobColumn: 'avatar' })
    );

    // Pro chráněné routy: middleware: [verifyToken]
    void verifyToken;
  },
};
