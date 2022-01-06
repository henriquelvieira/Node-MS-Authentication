import { Pool } from 'pg';
require('dotenv').config();

const connectionString = process.env.CONNECTIONSTRING_PG as string;
const db = new Pool( {connectionString} );

export default db;