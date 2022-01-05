import { Router, Request, Response, NextFunction } from "express";
import {StatusCodes} from 'http-status-codes';
require('dotenv').config();
import JWT from 'jsonwebtoken';
import basicAuthenticationMiddleware from "../middlewares/basic-authentication.middleware";
import ForbiddenError from "../models/errors/forbidden.error.model";


const authorizationRoute = Router();


authorizationRoute.post('/token', basicAuthenticationMiddleware,  async (req: Request, res: Response, next: NextFunction) => {
//Antes do acesso à esta rota será feita a chamada ao Middleware de autenticação
    
    try {  
        const user = req.user;

        if (!user){
            throw new ForbiddenError('Usuário não informado!');     
        };
        
        //Geração do Token JWT
        const JWTsecretKey = process.env.SECRET_KEY_JWT;
        const JWTpayload = { username: user.username };
        const JWToptions = {subject: user?.uuid};

        const jwt = JWT.sign(JWTpayload, JWTsecretKey, JWToptions);
             
        res.status(StatusCodes.OK).json({ token: jwt});
    } catch (error) {
        next(error); //Chamada do Handler de Erro
    };

});


export default authorizationRoute;