import express, { Request, Response } from 'express';
import jwtAuthenticationMiddleware from './middlewares/jwt-authentication.middleware';
import errorHandlerMiddleware from './middlewares/error-handler.middleware';
import authenticationRoute from './routes/authentication.route';
import usersRoute from './routes/user.route';
import statusRoute from './routes/status.route';
import logger from './logger';
import expressPino from 'express-pino-logger';
import cors from 'cors';
import config from 'config';

class SetupServer {
  
  app: express.Express;
  
  constructor(private port = 3333) {
    this.app = express();
  }
  
  private setupExpress(): void {
    this.app.use(express.json()); //Middleware p/ lidar c/ o JSON no Content-Type
    this.app.use(express.urlencoded({ extended: true })); //Middleware p/ realizar o parsing do conteúdo das requisições
    // this.app.use(expressPino({logger}));
    this.app.use(cors({origin: config.get('App.cors.origin')} )); //Permitir CORS
  }
  
  private setupControllers(): void {
    this.app.use('/authentication', authenticationRoute); //Autenticação
    this.app.use('/status', jwtAuthenticationMiddleware, statusRoute); //Status (todas as rotas são protegidas p/ Middleware jwtAuthenticationMiddleware)
    this.app.use('/users', usersRoute); //Usuário
  }

  private setupErrorHandlers(): void {
    this.app.use(errorHandlerMiddleware);
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.setupControllers();
    this.setupErrorHandlers();

    this.app.use('/', (req: Request, res: Response) => {
        res.json({ message: 'ok' });
    });    

  }

  public start(): void {
    this.app.listen(this.port, () => {
      logger.info(`Server is running on port  ${this.port}`);
    });
  }

  public getApp(): express.Express {
    return this.app;
  }  

}

export default SetupServer; 







