import express, { Express } from 'express';
import { clientRoute } from './routes/client.route';

export const app: Express = express();
app.use(express.json());

app.use("/clients", clientRoute);
