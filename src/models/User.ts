import { DataTypes, Model } from 'sequelize';
import sequelize from './sequelize';

 export interface UserAttributes {
  id: string;
  username: string;
  password: string;
  email: string;
  role: string;
}


class User extends Model<UserAttributes> implements UserAttributes {
  public id!: string;
  public username!: string;
  public password!: string;
  public email!: string;
  public role!: string;
}



User.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,

    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    role: {
      type: DataTypes.STRING,   
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'User',
  }

);

export default User;
