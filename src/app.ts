import config from 'config';
import SetupServer from './server';
import logger from './logger';
import db from './database/db';


(async (): Promise<void> => {
  
  try {
    const server = new SetupServer(config.get('App.port'));
    await server.init();
    server.start();
        
  } catch (error) {
    logger.error(`Falha ao iniciar o servidor ${error}`);
    db.end();
  }

}
)()
