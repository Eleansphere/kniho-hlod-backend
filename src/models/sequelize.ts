import { Sequelize } from 'sequelize';
import path from 'path';

// Inicializace SQLite databáze
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.resolve(__dirname, '../../database.sqlite'), // Soubor databáze
});

// Test připojení
sequelize.authenticate()
    .then(() => console.log('SQLite Database connected'))
    .catch((err: Error) => console.error('Error connecting to SQLite database:', err));

export default sequelize; 