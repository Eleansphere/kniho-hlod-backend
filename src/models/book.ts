import { Model, DataTypes, Sequelize } from 'sequelize';
import sequelize from '../db/sequelize';
import { CoreEntity } from '../types/core-entity';

export interface BookAttributes {
  title: string;
  author?: string;
  description?: string;
  publicationYear?: number;
  isAvailable: boolean;
  ownerId: string;
}

export class Book extends CoreEntity implements BookAttributes {
  public id!: string;
  public title!: string;
  public author!: string;
  public description!: string;
  public publicationYear!: number;
  public isAvailable!: boolean;
  public ownerId!: string;
}

Book.initModel({
  title: { type: DataTypes.STRING, allowNull: false },
  author: { type: DataTypes.STRING, allowNull: true },
  description: { type: DataTypes.STRING, allowNull: true },
  publicationYear: { type: DataTypes.INTEGER, allowNull: true },
  isAvailable: { type: DataTypes.BOOLEAN, allowNull: false },
}, {
  modelName: 'book',
  sequelize: new Sequelize
});

export default Book