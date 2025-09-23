import dotenv from 'dotenv';
dotenv.config();

import express, { Express } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import { setupRoutes } from './routes';
import sequelize from './db/sequelize';

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

setupRoutes(app);

app.get('/', (_, res) => res.send('Backend is running!'));

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

sequelize
  .sync()
  .then(() => console.log('Database synchronized'))
  .catch((err: Error) => console.error('Error synchronizing database:', err));

export default app;
