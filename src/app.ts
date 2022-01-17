import express, { Request, Response } from 'express';
import jwtAuthenticationMiddleware from './middlewares/jwt-authentication.middleware';
import errorHanddlerMiddleware from './middlewares/error-handler.middleware';
import authenticationRoute from './routes/authentication.route';
import usersRoute from './routes/user.route';
import statusRoute from './routes/status.route';

const app = express(); //Instanciar o Express

//Configuração da Aplicação:
app.use(express.json()); //Middleware p/ lidar c/ o JSON no Content-Type
app.use(express.urlencoded({ extended: true })); //Middleware p/ realizar o parsing do conteúdo das requisições

//Configuração das Rotas de base:
app.use('/authentication', authenticationRoute); //Autenticação
app.use('/status', jwtAuthenticationMiddleware, statusRoute); //Status (todas as rotas são protegidas p/ Middleware jwtAuthenticationMiddleware)
app.use('/users', usersRoute); //Usuário

//Configuração do Handler de Erro:
app.use(errorHanddlerMiddleware);

app.use('/', (req: Request, res: Response) => {
  res.json({ message: 'ok' });
});

export { app };
