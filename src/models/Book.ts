import { Model, DataTypes } from 'sequelize';
import sequelize from './sequelize';

export interface BookAttributes {
  id: string;
  title: string;
  author?: string;
  description?: string;
  publicationYear?: number;
  isAvailable: boolean;
  ownerId: string;
}

export class Book extends Model<BookAttributes> implements BookAttributes {
  public id!: string;
  public title!: string;
  public author!: string;
  public description!: string;
  public publicationYear!: number;
  public isAvailable!: boolean;
  public ownerId!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Book.init(
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description:{
      type: DataTypes.STRING,
      allowNull: true
    },
    publicationYear:{
      type: DataTypes.INTEGER,
      allowNull: true
    },
    isAvailable: {
      type:DataTypes.BOOLEAN,
      allowNull: false
    },
    ownerId: {
      type:DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'book',
    timestamps: true
  }
); 

export default Book;