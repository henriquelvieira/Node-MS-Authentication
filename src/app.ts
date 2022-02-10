import config from 'config';

import db from './database/db';
import logger from './logger';
import SetupServer from './server';

(async (): Promise<void> => {
  try {
    const server = new SetupServer(config.get('App.port'));
    await server.init();
    server.start();
  } catch (error) {
    logger.error(`Falha ao iniciar o servidor ${error}`);
    db.end();
  }
})();
