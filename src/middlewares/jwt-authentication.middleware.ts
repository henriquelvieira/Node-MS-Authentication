import { Request, Response, NextFunction } from "express";
require('dotenv').config();
import JWT from 'jsonwebtoken';
import ForbiddenError from "../models/errors/forbidden.error.model";
import userRepositorie from "../repositories/user.repositorie";

async function jwtAuthenticationMiddleware (req: Request, res: Response, next: NextFunction){

    try {
        const authorizationHeader = req.headers['authorization'];

        //Verificar se o header authorization foi informado na requisição
        if (!authorizationHeader) {
            throw new ForbiddenError('Credenciais não informadas')    
        }; 

        //Separa a string, pegando o tipo da autenticação e o token
        const [authenticationType, token] = authorizationHeader.split(' '); 
        
        //Verifica se o tipo da autenticação é diferente de Basic e se o token foi informado
        if (authenticationType !== 'Bearer' || !token) {
            throw new ForbiddenError('Tipo de autenticação inválido');
        };      
        
        const JWTsecretKey = process.env['SECRET_KEY_JWT'] as string; 
        const tokenPayload = JWT.verify(token, JWTsecretKey); //Validar se o Token é válido

        //Valida se o Token é Valido e se contém um sub
        if (typeof tokenPayload !== 'object' || !tokenPayload.sub){
            throw new ForbiddenError('Token inválido');    
        }

        const uuid = tokenPayload.sub; //Obter o UUID que foi adicionado ao Payload do Token 

        const user = {
            uuid: uuid,
            username: tokenPayload.username
        };

        req.user = user; //Adicionar o objeto user dentro da requisição
        next();
    } catch (error) {
        next(error);
    }

};

export default jwtAuthenticationMiddleware;