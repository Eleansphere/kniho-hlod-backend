import { Model, DataTypes, InitOptions } from 'sequelize';
import sequelize from '../db/sequelize';

export class CoreEntity extends Model {
  public id!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initModel(attributes: any, options?: InitOptions) {
    return this.init(
      {
        id: {
          type: DataTypes.STRING,
          allowNull: false,
          primaryKey: true,
        },
        ...attributes,
      },
      {
        sequelize,
        timestamps: true,
        ...options,
      }
    );
  }
}
