import { Model, DataTypes } from 'sequelize';
import sequelize from './sequelize';

export interface BookAttributes {
  id?: string;
  title: string;
  author: string;
  owner_id: string;
}

export class Book extends Model<BookAttributes> implements BookAttributes {
  public id!: string;
  public title!: string;
  public author!: string;
  public owner_id!: string;
}

Book.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,

    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
      owner_id: {
        type:DataTypes.STRING,
          allowNull: false
      }
  },
  {
    sequelize,
    modelName: 'Book',
  }
); 

export default Book;