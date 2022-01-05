import { Request, Response, NextFunction } from "express";
require('dotenv').config();
import JWT from 'jsonwebtoken';
import ForbiddenError from "../models/errors/forbidden.error.model";
import userRepositorie from "../repositories/user.repositorie";

async function basicAuthenticationMiddleware(req: Request, res: Response, next: NextFunction){
    
    try {  
        const authorizationHeader = req.headers['authorization'];

        //Verificar se o header authorization foi informado na requisição
        if (!authorizationHeader) {
            throw new ForbiddenError('Credenciais não informadas')    
        }; 

        //Separa a string, pegando o tipo da autenticação e o token
        const [authenticationType, token] = authorizationHeader.split(' '); 
        
        //Verifica se o tipo da autenticação é diferente de Basic e se o token foi informado
        if (authenticationType !== 'Basic' || !token) {
            throw new ForbiddenError('Tipo de autenticação inválido');
        };

        //Converte o Token de Base64 para texto
        const tokenContent = Buffer.from(token, 'base64').toString('utf-8');
        const [username, password] = tokenContent.split(':');

        if (!username || !password) {
            throw new ForbiddenError('Credenciais não Preenchidas');    
        };

        const user = await userRepositorie.findUsernameAndPassword(username, password);//Classe para Validar o usuário e senha
        
        if (!user){
            throw new ForbiddenError('Usuário ou Senha inválidos');     
        };

        req.user = user; //Adicionar o objeto user dentro da requisição
        next();

    } catch (error) {
        next(error); //Chamada do Handler de Erro
    };

};

export default basicAuthenticationMiddleware;