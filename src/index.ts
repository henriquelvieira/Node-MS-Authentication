import express, {Request, Response, NextFunction} from "express";
import {StatusCodes} from 'http-status-codes';

import usersRoute from "./routes/user_route";
import statusRoute from "./routes/status_route";

const APP = express(); //Instanciar o Express
const PORT = 3000 || 3333;

//Configuração da aplicação:
APP.use(express.json()); //Middleware p/ lidar c/ o JSON no Content-Type
APP.use(express.urlencoded( {extended: true} )); //Middleware p/ realizar o parsing do conteúdo das requisições


//Configuração das Rotas:
APP.use(usersRoute); //Adição das rotas de Usuário
APP.use(statusRoute); //Adição das rotas de Status


//Inicialização do Servidor:
APP.listen(PORT, () => {
    console.log('Aplicação em execução na porta ' + PORT)    
});

 