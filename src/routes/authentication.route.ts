import { Router, Request, Response, NextFunction } from "express";
import {StatusCodes} from 'http-status-codes';
require('dotenv').config();
import JWT from 'jsonwebtoken';
import basicAuthenticationMiddleware from "../middlewares/basic-authentication.middleware";
import ForbiddenError from "../models/errors/forbidden.error.model";


const authenticationRoute = Router();

authenticationRoute.post('/token', basicAuthenticationMiddleware,  async (req: Request, res: Response, next: NextFunction) => {
//Antes do acesso à esta rota será feita a chamada ao Middleware de autenticação
    
    try {  
        const user = req.user;

        if (!user){
            throw new ForbiddenError('Usuário não informado!');     
        };
        
        //Geração do Token JWT
        const JWTsecretKey = process.env['SECRET_KEY_JWT'] as string;
        const JWTpayload = { username: user.username };
        const JWToptions = {subject: user?.uuid};

        const jwt = JWT.sign(JWTpayload, JWTsecretKey, JWToptions); //Gerar o Token em JWT contendo o UUID no Payload
             
        res.status(StatusCodes.OK).json({ token: jwt}); //Retorar o Token gerado 
    } catch (error) {
        next(error); //Chamada do Handler de Erro
    };

});


export default authenticationRoute;