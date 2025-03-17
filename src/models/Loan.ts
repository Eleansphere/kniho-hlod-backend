import { DataTypes, Model } from 'sequelize';
import sequelize from './index';

export interface LoanAttributes {
  id: string;
  book_id: string;
  borrower: string;
  loan_date: Date;
  return_date: Date;
  owner_id: string;
}

class Loans extends Model<LoanAttributes> implements LoanAttributes {
  public id!: string;
  public book_id!: string;
  public borrower!: string;
  public loan_date!: Date;
  public return_date!: Date;
  public owner_id!: string;
}


Loans.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,


    },
    book_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    borrower: {
      type: DataTypes.STRING,
      allowNull: false
    },
    loan_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    return_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    owner_id: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Loans'
  }
);

export default Loans; 