import { Router, Request, Response, NextFunction } from "express";
import {StatusCodes} from 'http-status-codes';
import basicAuthenticationMiddleware from "../middlewares/basic-authentication.middleware";
import jwtAuthenticationMiddleware from "../middlewares/jwt-authentication.middleware";
import ForbiddenError from "../models/errors/forbidden.error.model";
import RefreshToken from "../models/refreshToken.model";
import refreshTokenRepositorie from "../repositories/refresh-token.repositorie";
import JWTToken from "../utils/jtw-utils";
import dayjs from 'dayjs';
import User from "../models/user.model";

const authenticationRoute = Router();

authenticationRoute.post('/token', basicAuthenticationMiddleware,  async (req: Request, res: Response, next: NextFunction) => {
    /*Antes do acesso à esta rota será feita a chamada ao Middleware de autenticação*/
    
    try {  
        const user = req.user; //Pega o objeto User que está na requisição e que foi adicionado pelo Middleware basicAuthenticationMiddleware

        if (!user) {
            throw new ForbiddenError('Usuário não informado!');     
        };
        
        const jwt = await JWTToken.create(user); //Chamada da classe p/ geração do Token
        
        const newRefreshToken = await refreshTokenRepositorie.generateRefreshToken(user);
        
        const response = { token: jwt, refresh_token: newRefreshToken};

        res.status(StatusCodes.OK).json(response); //Retorar o Token gerado 
    } catch (error) {
        next(error); //Chamada do Handler de Erro
    };

});

authenticationRoute.post('/refresh-token', async (req: Request, res: Response, next: NextFunction) => {
    try {
        //Verifica se o Refresh Token foi informadom na requisição
        const refreshTokenRequest: RefreshToken = req.body;
        
        if (!refreshTokenRequest){
            throw new ForbiddenError('Refresh Token não informado!');   
        };
    
        //Verifica se existe um Refresh Token válido p/ o Usuário
        const refreshTokenUserData = await refreshTokenRepositorie.findRefreshTokenByID(refreshTokenRequest.refresh_token);
        
        if (!refreshTokenUserData){
            throw new ForbiddenError('Refresh Token inválido!'); 
        };
        
        //Montagem do objeto c/ as informações do user para geração do Token
        const userData: User = {
            uuid: refreshTokenUserData.uuid, 
            username: refreshTokenUserData.username as string
        };
        
        //Geração do novo Token
        const jwt = await JWTToken.create(userData); 
        
        //Verifica se o Refresh Token está expirado
        const expiresIn =  refreshTokenUserData.expiresin as number;
        const refreshTokenExpired = dayjs().isAfter( dayjs.unix(expiresIn) );

        let response: {};

        if (refreshTokenExpired) {
            const newRefreshToken = await refreshTokenRepositorie.generateRefreshToken(userData); //Geração do Refresh Token
            response = {token: jwt, refresh_token: newRefreshToken}
        } else {
            response = {token: jwt};
        };

        res.status(StatusCodes.CREATED).json(response); //Retorar o Token gerado 
    } catch (error) {
        next(error); //Chamada do Handler 'de Erro
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