import sequelize from './sequelize';
import Book from './Book';
import User from './User';
import Loans from './Loan';

// Definice asociací (pokud jsou potřeba)
// Book.belongsTo(User, { foreignKey: 'owner_id' });
// User.hasMany(Book, { foreignKey: 'owner_id' });
// atd.

export { sequelize, Book, User, Loans };