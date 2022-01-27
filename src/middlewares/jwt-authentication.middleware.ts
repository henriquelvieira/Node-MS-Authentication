import { Request, Response, NextFunction } from "express";
import JWTToken from "../utils/jtw-utils";
import ForbiddenError from "../models/errors/forbidden.error.model";

async function jwtAuthenticationMiddleware (req: Request, res: Response, next: NextFunction){

    try {
        const authorizationHeader = req.headers['authorization']; //Pegar o header da Requisição com a autorização

        //Verificar se o header authorization foi informado na requisição
        if (!authorizationHeader) {
            throw new ForbiddenError('Credenciais não informadas')    
        } 

        //Separa a string, pegando o tipo da autenticação e o token
        const [authenticationType, token] = authorizationHeader.split(' '); 
        
        //Verifica se o tipo da autenticação é diferente de Basic e se o token foi informado
        if (authenticationType !== 'Bearer' || !token) {
            throw new ForbiddenError('Tipo de autenticação inválido');
        }      
        
        try {
            const tokenPayload = JWTToken.validate(token); //Chamada da Classe para validar o Token
            
            const uuid = tokenPayload.sub; //Obter o UUID que foi adicionado ao Payload do Token 

            //Criar um objeto com as informações extraidas do token 
            const user = {
                uuid: uuid, 
                username: tokenPayload.username
            }; 

            req.user = user; //Adiciona o objeto user dentro da requisição
            next();
        } catch (error) {
            throw new ForbiddenError('Token inválido');  
        }

    } catch (error) {
        next(error);
    }

}

export default jwtAuthenticationMiddleware;