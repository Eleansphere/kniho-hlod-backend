import User from '../models/user';
import { generateId } from '../utils/generate-id';
import bcrypt from 'bcrypt';
import { createCrudRouter } from '../utils/create-crud-router';

const SALT_ROUNDS = 10;

export default createCrudRouter({
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
      if (existing) {
        throw new Error('Uživatel s tímto e-mailem už existuje');
      }

      data.password = await bcrypt.hash(data.password, SALT_ROUNDS);
      return data;
    },
    beforeUpdate: async (data) => {
      if (data.password) {
        data.password = await bcrypt.hash(data.password, SALT_ROUNDS);
      }
      return data;
    },
  },
});
