import JWT, { SignOptions } from 'jsonwebtoken';
import User from '../models/user.model';
import ForbiddenError from "../models/errors/forbidden.error.model";
import * as dotenv from "dotenv";

dotenv.config();

class JWTToken {

    private findSecretKey(): string{
        return process.env['JWT_SECRET_KEY'] as string;  
    }
    
    validate(token: string): JWT.JwtPayload {
        const JWTsecretKey = this.findSecretKey(); 

        const tokenPayload = JWT.verify(token, JWTsecretKey); //Verifica se o Token é válido

        //Valida se o Token é Valido e se contém um sub
        if (typeof tokenPayload !== 'object' || !tokenPayload.sub){
            throw new ForbiddenError('Token inválido');    
        }

        return tokenPayload;
    }

    async create(user: User) {
        try{
            //Método responsável pela geração do Token JWT
            const JWTSecretKey = this.findSecretKey();

            if (!user.username){
                throw new Error('Usuário não informado!');  
            }

            const expirationTimeToken = process.env['JWT_EXPIRATION_TIME_TOKEN'] as string;
            
            const JWTPayload = { username: user.username };        
            const JWTOptions: SignOptions  = {
                subject: user?.uuid, 
                expiresIn: expirationTimeToken as string
            };
        
            //Gerar o Token em JWT contendo o username e UUID no Payload
            const jwt = JWT.sign(JWTPayload, JWTSecretKey, JWTOptions);
        
            return jwt;       
        } catch (error)  {
            throw new ForbiddenError('Falha ao gerar o Token!', error); 
        }
    }


}


export default new JWTToken();