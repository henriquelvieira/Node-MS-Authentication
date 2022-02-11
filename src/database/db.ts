import * as dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();
import Configs from '../util/configs';

const configs = Configs.get('App.envs.PostgreSQL');

const connectionString = process.env[
  configs.get('connectionString') as string
] as string;
const db = new Pool({ connectionString });

export default db;
