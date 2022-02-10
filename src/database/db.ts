import config from 'config';
import * as dotenv from 'dotenv';
import { Pool } from 'pg';
dotenv.config();

const connectionString = process.env[
  config.get('App.envs.PostgreSQL.connectionString') as string
] as string;
const db = new Pool({ connectionString });

export default db;
