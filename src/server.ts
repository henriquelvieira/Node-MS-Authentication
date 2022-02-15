import cors from 'cors';
import express, { Request, Response } from 'express';
import expressPino from 'express-pino-logger';

import logger from './logger';
import errorHandlerMiddleware from './middlewares/error-handler.middleware';
import jwtAuthenticationMiddleware from './middlewares/jwt-authentication.middleware';
import authenticationRoute from './routes/authentication.route';
import statusRoute from './routes/status.route';
import usersRoute from './routes/user.route';
import Configs from './util/configs';

class SetupServer {
  app: express.Express;
  readonly configs = Configs.get('App');

  constructor(private port = 3333) {
    this.app = express();
  }

  private setupExpress(): void {
    this.app.use(express.json()); //Middleware p/ lidar c/ o JSON no Content-Type
    this.app.use(express.urlencoded({ extended: true })); //Middleware p/ realizar o parsing do conteúdo das requisições

    const enableLogReqs: boolean =
      this.configs.get('logger.enabledLogReqs') || true;
    if (enableLogReqs) {
      this.app.use(expressPino({ logger }));
    }

    this.app.use(cors({ origin: this.configs.get('cors.origin') })); //Permitir CORS
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

    // this.app.use('/', (req: Request, res: Response) => {
    //   res.json({ message: 'ok' });
    // });
  }

  public start(): boolean {
    this.app.listen(this.port, () => {
      logger.info(`Server is running on port ${this.port}`);
    });
    return true;
  }

  public getApp(): express.Express {
    return this.app;
  }
}

export default SetupServer;
