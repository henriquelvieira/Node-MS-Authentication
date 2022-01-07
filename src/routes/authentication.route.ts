import { Router, Request, Response, NextFunction } from "express";
import {StatusCodes} from 'http-status-codes';
import basicAuthenticationMiddleware from "../middlewares/basic-authentication.middleware";
import jwtAuthenticationMiddleware from "../middlewares/jwt-authentication.middleware";
import ForbiddenError from "../models/errors/forbidden.error.model";
import JWTToken from "../utils/jtw-utils";


const authenticationRoute = Router();

authenticationRoute.post('/token', basicAuthenticationMiddleware,  async (req: Request, res: Response, next: NextFunction) => {
    /*Antes do acesso à esta rota será feita a chamada ao Middleware de autenticação*/
    
    try {  
        const user = req.user; //Pegar o objeto User que está na requisição

        if (!user) {
            throw new ForbiddenError('Usuário não informado!');     
        };
        
        //const jwt = await generateJWTToken(user);
        const jwt = await JWTToken.create(user); //Chamada da classe p/ gerar o Token
        
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