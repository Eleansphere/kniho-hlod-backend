import { DataTypes } from 'sequelize';
import { CoreEntity } from '../types/core-entity';
import sequelize from '../db/sequelize';

export interface UserAttributes {
  username: string;
  password: string;
  email: string;
  role: string;
}

class User extends CoreEntity implements UserAttributes {
  public username!: string;
  public password!: string;
  public email!: string;
  public role!: string;
}

User.initModel(
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'user',
  }
);

export default User;
