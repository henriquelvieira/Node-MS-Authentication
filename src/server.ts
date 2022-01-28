import express, { Request, Response } from 'express';
import jwtAuthenticationMiddleware from './middlewares/jwt-authentication.middleware';
import errorHandlerMiddleware from './middlewares/error-handler.middleware';
import authenticationRoute from './routes/authentication.route';
import usersRoute from './routes/user.route';
import statusRoute from './routes/status.route';
import logger from './logger';


class SetupServer {
  
  app: express.Express;
  
  constructor(private port = 3333) {
    this.app = express();
  }
  
  public async init(): Promise<void> {
    this.setupExpress();
    this.setupControllers();
    this.setupErrorHandlers();

    this.app.use('/', (req: Request, res: Response) => {
        res.json({ message: 'ok' });
    });    

  }

  private setupExpress(): void {
    this.app.use(express.json()); //Middleware p/ lidar c/ o JSON no Content-Type
    this.app.use(express.urlencoded({ extended: true })); //Middleware p/ realizar o parsing do conteúdo das requisições
  }
  
  private setupControllers(): void {
    this.app.use('/authentication', authenticationRoute); //Autenticação
    this.app.use('/status', jwtAuthenticationMiddleware, statusRoute); //Status (todas as rotas são protegidas p/ Middleware jwtAuthenticationMiddleware)
    this.app.use('/users', usersRoute); //Usuário
  }

  private setupErrorHandlers(): void {
    this.app.use(errorHandlerMiddleware);
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







