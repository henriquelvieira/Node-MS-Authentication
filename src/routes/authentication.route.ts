import { Router, Request, Response, NextFunction } from "express";
import {StatusCodes} from 'http-status-codes';
import basicAuthenticationMiddleware from "../middlewares/basic-authentication.middleware";
import jwtAuthenticationMiddleware from "../middlewares/jwt-authentication.middleware";
import authenticationController from "../controllers/authentication.controller";

const authenticationRoute = Router();

/*Antes do acesso à esta rota será feita a chamada ao Middleware de autenticação*/
authenticationRoute.post('/token', basicAuthenticationMiddleware, authenticationController.createToken);

authenticationRoute.post('/refresh-token', authenticationController.createRefreshToken);

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