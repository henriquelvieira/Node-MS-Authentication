import { Pool } from 'pg';
require('dotenv').config();

const connectionString = process.env.POSTGRESQL_CONNECTIONSTRING as string;
const db = new Pool( {connectionString} );

export default db;