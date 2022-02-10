import db from './database/db';
import logger from './logger';
import SetupServer from './server';
import Configs from './utils/configs';

(async (): Promise<void> => {
  try {
    const configs = Configs.get('App');
    const server = new SetupServer(configs.get('port'));
    await server.init();
    server.start();
  } catch (error) {
    logger.error(`Falha ao iniciar o servidor ${error}`);
    db.end();
  }
})();
