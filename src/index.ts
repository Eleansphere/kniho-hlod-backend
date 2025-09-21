import dotenv from 'dotenv';
dotenv.config();
import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import userRoutes from './routes/user-routes';
import bookRoutes from './routes/book-routes';
import loanRoutes from './routes/loan-routes';
import authorizationRoutes from './routes/authorization-routes';
import sequelize from './db/sequelize';

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api', authorizationRoutes);

// Testovací route
app.get('/', (req: Request, res: Response) => {
  res.send('Backend is running with SQLite!');
});

// Start serveru
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

sequelize
  .sync() // force: true pro vytvoření tabulek při každém spuštění
  .then(() => console.log('SQLite Database synchronized'))
  .catch((err: Error) => console.error('Error synchronizing SQLite database:', err));
