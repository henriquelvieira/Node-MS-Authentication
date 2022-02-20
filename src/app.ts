import db from './database/db';
import logger from './logger';
import SetupServer from './server';
import Configs from './util/configs';
import Env from './util/env';

(async (): Promise<void> => {
  try {
    const configs = Configs.get('App');
    const port = Number(Env.get(configs.get('envs.APP.Port')));
    const server = new SetupServer(port);
    await server.init();
    server.start();
  } catch (error) {
    logger.error(`Falha ao iniciar o servidor ${error}`);
    db.end();
  }
})();
