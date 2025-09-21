import { DataTypes } from 'sequelize';
import sequelize from '../db/sequelize';
import { CoreEntity } from '../types/core-entity';

export interface LoanAttributes {
  borrower: string;
  loanDate: Date;
  returnDate?: Date;
  bookId: string;
  ownerId: string;
  isReturned?: boolean;
}

class Loans extends CoreEntity implements LoanAttributes {
  public borrower!: string;
  public loanDate!: Date;
  public returnDate?: Date;
  public bookId!: string;
  public ownerId!: string;
  public isReturned?: boolean;
}

Loans.initModel(
  {
    borrower: { type: DataTypes.STRING, allowNull: false },
    loanDate: { type: DataTypes.DATE, allowNull: false },
    returnDate: { type: DataTypes.DATE, allowNull: true },
    bookId: { type: DataTypes.STRING, allowNull: false },
    ownerId: { type: DataTypes.STRING, allowNull: false },
    isReturned: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false }
  },
  {
    sequelize,
    modelName: 'loan',
    timestamps: true
  }
);

export default Loans;
