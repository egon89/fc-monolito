import express, { Express } from 'express';
import { clientRoute } from './routes/client.route';
import { productRoute } from './routes/product.route';

export const app: Express = express();
app.use(express.json());

app.use("/clients", clientRoute);
app.use("/products", productRoute);
