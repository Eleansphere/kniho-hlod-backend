import sequelize from './sequelize';
import Book from './Book';
import User from './User';
import Loans from './Loan';
import { defineAssociations } from './associations';
defineAssociations();


export { sequelize, Book, User, Loans };