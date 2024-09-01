import { setupDb } from '../db/sqlite';
import { setupDbMigration } from '../db/sqlite-migration';
import { app } from './express';
import dotenv from 'dotenv';

dotenv.config();
const port: number = Number(process.env.PORT) || 3000;

// setupDb();
setupDbMigration();
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});