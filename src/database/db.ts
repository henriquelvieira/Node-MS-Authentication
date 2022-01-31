import { Pool } from 'pg';
import * as dotenv from "dotenv";
import config from 'config';
dotenv.config();

const connectionString = process.env[config.get('App.envs.PostgreSQL.connectionString') as string] as string;
const db = new Pool( {connectionString} );

export default db;