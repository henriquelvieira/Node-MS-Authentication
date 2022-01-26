import { app } from './app';
import logger from './logger';

const PORT = process.env['PORT'] || 3333;

 //Inicialização do Servidor:
app.listen(PORT, () => {
    //console.log(`Server is running on port  ${PORT}`);
    logger.info(`Server is running on port  ${PORT}`);
});


