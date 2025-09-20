import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/sequelize';

export interface LoanAttributes {
  id: string;
  borrower: string;
  loanDate: Date;
  returnDate?: Date;
  bookId: string;
  ownerId: string;
  isReturned?: boolean;
}

class Loans extends Model<LoanAttributes> implements LoanAttributes {
  public id!: string;
  public borrower!: string;
  public loanDate!: Date;
  public returnDate?: Date;
  public bookId!: string;
  public ownerId!: string;
  public isReturned?: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}


Loans.init(
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true
    },
    borrower: {
      type: DataTypes.STRING,
      allowNull: false
    },
    loanDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    returnDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    bookId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ownerId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isReturned: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    }
  },
  {
    sequelize,
    modelName: 'loan',
    timestamps: true
  }
);

export default Loans; 