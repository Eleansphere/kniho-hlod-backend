import Book from './Book';
import User  from './User';
import Loan from './Loan';

export function defineAssociations() {
  // Loan patří ke knize
  Loan.belongsTo(Book, {
    foreignKey: 'bookId',
    as: 'book',
  });

  // Loan patří k uživateli jako vlastník
  Loan.belongsTo(User, {
    foreignKey: 'ownerId',
    as: 'owner',
  });

  // Volitelné: kniha může mít víc výpůjček
  Book.hasMany(Loan, {
    foreignKey: 'bookId',
    as: 'loans',
  });

  // Volitelné: uživatel může vlastnit víc výpůjček
  User.hasMany(Loan, {
    foreignKey: 'ownerId',
    as: 'ownedLoans',
  });
}
