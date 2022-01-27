import { app } from './app';
import logger from './logger';
import config from 'config';


const PORT = config.get('App.port') || 3333;

 //Inicialização do Servidor:
app.listen(PORT, () => {
    logger.info(`Server is running on port  ${PORT}`);
});


