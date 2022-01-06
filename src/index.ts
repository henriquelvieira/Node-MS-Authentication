import express from "express";
require('dotenv').config();

import errorHandler from "./middlewares/error-handler.middleware";
import basicAuthenticationMiddleware from "./middlewares/basic-authentication.middleware";
import authenticationRoute from "./routes/authentication.route";
import usersRoute from "./routes/user.route";
import statusRoute from "./routes/status.route";
import jwtAuthenticationMiddleware from "./middlewares/jwt-authentication.middleware";

const app = express(); //Instanciar o Express
const PORT = process.env.PORT || 3333;

//Configuração da aplicação:
app.use(express.json()); //Middleware p/ lidar c/ o JSON no Content-Type
app.use(express.urlencoded( {extended: true} )); //Middleware p/ realizar o parsing do conteúdo das requisições
app.use(errorHandler); //Configuração do Handler de Erro

//Configuração das Rotas:
app.use(authenticationRoute); //Rotas de Autenticação
app.use(statusRoute); //Adição das rotas de Status
app.use(jwtAuthenticationMiddleware, usersRoute); //Adição das rotas de Usuário


//Inicialização do Servidor:
app.listen(PORT, () => {
    console.log('Aplicação em execução na porta ' + PORT)    
});

 