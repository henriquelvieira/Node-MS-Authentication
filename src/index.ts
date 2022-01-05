import express from "express";
require('dotenv').config();


import usersRoute from "./routes/user.route";
import statusRoute from "./routes/status.route";
import errorHandler from "./middlewares/error-handler.middleware";

const app = express(); //Instanciar o Express
const PORT = process.env.PORT || 3333;

//Configuração da aplicação:
app.use(express.json()); //Middleware p/ lidar c/ o JSON no Content-Type
app.use(express.urlencoded( {extended: true} )); //Middleware p/ realizar o parsing do conteúdo das requisições

app.use(errorHandler); //Configuração do Handler de Erro

//Configuração das Rotas:
app.use(usersRoute); //Adição das rotas de Usuário
app.use(statusRoute); //Adição das rotas de Status


//Inicialização do Servidor:
app.listen(PORT, () => {
    console.log('Aplicação em execução na porta ' + PORT)    
});

 