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

  public readonly  createdAt!: Date;
  public readonly updatedAt!: Date;
}



User.init(
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true
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
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,   
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'user',
    timestamps: true
  }

);

export default User;
