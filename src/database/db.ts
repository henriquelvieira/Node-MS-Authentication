import { Pool } from 'pg';

import Configs from '../util/configs';
import Env from '../util/env';

const configs = Configs.get('App.envs.PostgreSQL');

const connectionString = Env.get(configs.get('connectionString')) as string;

const db = new Pool({ connectionString });

export default db;
