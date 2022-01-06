import { Router, Request, Response, NextFunction } from "express";
import {StatusCodes} from 'http-status-codes';
import JWT, { SignOptions } from 'jsonwebtoken';
require('dotenv').config();
import basicAuthenticationMiddleware from "../middlewares/basic-authentication.middleware";
import jwtAuthenticationMiddleware from "../middlewares/jwt-authentication.middleware";
import ForbiddenError from "../models/errors/forbidden.error.model";

/*
function generateToken(payload: {}){
    //Geração do Token JWT
    const JWTsecretKey = process.env['SECRET_KEY_JWT'] as string;
    const JWTpayload = { username: user.use };
    const JWToptions = {subject: user?.uuid};

    const jwt = JWT.sign(JWTpayload, JWTsecretKey, JWToptions); //Gerar o Token em JWT contendo o UUID no Payload
    return jwt;        
};
*/

const authenticationRoute = Router();

authenticationRoute.post('/token', basicAuthenticationMiddleware,  async (req: Request, res: Response, next: NextFunction) => {
    /*Antes do acesso à esta rota será feita a chamada ao Middleware de autenticação*/
    
    try {  
        const user = req.user; //Pegar o objeto User que está na requisição

        if (!user) {
            throw new ForbiddenError('Usuário não informado!');     
        };
        
        //Geração do Token JWT
        const JWTsecretKey = process.env['SECRET_KEY_JWT'] as string;
        const expirationTimeToken = '1m'; // 1 Minuto
        
        const JWTPayload = { username: user.username };        
        const JWToptions: SignOptions  = {
            subject: user?.uuid, 
            expiresIn: expirationTimeToken as string
        };

        //Gerar o Token em JWT contendo o UUID no Payload
        const jwt = JWT.sign(JWTPayload, JWTsecretKey, JWToptions); 
             
        res.status(StatusCodes.OK).json({ token: jwt}); //Retorar o Token gerado 
    } catch (error) {
        next(error); //Chamada do Handler de Erro
    };

});

authenticationRoute.post('/token/refresh', jwtAuthenticationMiddleware, (req: Request, res: Response, next: NextFunction) => {

    try {
        res.sendStatus(StatusCodes.OK); 
    } catch (error) {
        next(error); //Chamada do Handler de Erro
    };
    
});

authenticationRoute.post('/token/validade', jwtAuthenticationMiddleware, (req: Request, res: Response, next: NextFunction) => {
    /*
    Antes do acesso à esta rota será feita a chamada ao Middleware de 
    autenticação em JWT, caso nenhum erro seja retornado pelo mesmo significa 
    que o token está válido.
    */    
    try {
        res.sendStatus(StatusCodes.OK); 
    } catch (error) {
        next(error); //Chamada do Handler de Erro
    };
    
});





export default authenticationRoute;