import { Pool } from 'pg';
import * as dotenv from "dotenv";
dotenv.config();

const connectionString = process.env['POSTGRESQL_CONNECTIONSTRING'] as string;
const db = new Pool( {connectionString} );


export default db;