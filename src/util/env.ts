import * as dotenv from 'dotenv';
dotenv.config();

class Env {
  get(envName: string) {
    return process.env[envName];
  }
}

export default new Env();
