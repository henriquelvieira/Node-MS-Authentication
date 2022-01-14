import { Request, Response, NextFunction } from "express";
import {StatusCodes} from 'http-status-codes';
import ForbiddenError from "../models/errors/forbidden.error.model";
import ForgotPassword from "../models/forgotPassword.model";
import User from "../models/user.model";
import userRepositorie from "../repositories/user.repositorie";
import generateRandomUtil from "../utils/randons.util";


class userController {

    async listUsers (req: Request, res: Response, next: NextFunction) {
        try {  
            const users = await userRepositorie.findAllUsers(); //Classe para realizar o SELECT de todos os usuários
            
            return res.status(StatusCodes.OK).json({users});
        } catch (error) {
            next(error); //Chamada do Handler de Erro
        }
    }

    async listUserById (req: Request<{ uuid: string }>, res: Response, next: NextFunction){
        try {        
            const uuid: string = req.params.uuid; //Pegar o parametro enviado na URL da request
            const user: User = await userRepositorie.findUserById(uuid); //Classe para realizar o SELECT do usuário
            
            return res.status(StatusCodes.OK).json(user);
        } catch (error) {
            next(error); //Chamada do Handler de Erro
        }
    }

    async createUser (req: Request, res: Response, next: NextFunction){
        try {
            const newUser: User = req.body; //Pegar o Body enviado na Request
            const uuid = await userRepositorie.create(newUser); //Classe p/ realizar o Insert
            
            return res.status(StatusCodes.CREATED).json({ uuid });
        } catch (error) {
            next(error); //Chamada do Handler de Erro
        }
    }

    async modifiedUser (req: Request<{ uuid: string }>, res: Response, next: NextFunction){
        try {
            const uuid = req.params.uuid; //Pegar o parametro enviado na URL da request
            const modifiedUser: User = req.body; //Pegar o Body enviado na Request
            modifiedUser.uuid = uuid; //Adicionar o UUID ao JSON enviado na requisição
        
            await userRepositorie.update(modifiedUser); //Classe p/ realizar o Update
            
            const user = await userRepositorie.findUserById(uuid); //Classe para realizar o SELECT do usuário
        
            return res.status(StatusCodes.OK).json(user);
        } catch (error) {
            next(error); //Chamada do Handler de Erro
        }
    }

    async removeUser (req: Request<{ uuid: string }>, res: Response, next: NextFunction) {
        try {
            const uuid = req.params.uuid; //Pegar o parametro enviado na URL da request
            
            await userRepositorie.remove(uuid); //Classe p/ realizar o DELETE
        
            res.status(StatusCodes.OK).json({uuid});
        } catch (error) {
            next(error); //Chamada do Handler de Erro
        }
    }

    async forgotPassword (req: Request, res: Response, next: NextFunction) {
        try {            
            const userData: User = req.body; 

            if (!userData.username && !userData.email){
                throw new ForbiddenError('Usuário ou E-mail não informado')
            }

            //Gerar código de segurança e nova senha
            const securityCode: string = generateRandomUtil.randomCode();
            const securityPassword: string = generateRandomUtil.randomCode();

            await userRepositorie.updateforgotPassword(userData.username, securityCode, securityPassword);

            //TO DO: ENVIAR CÓDIGO GERADO POR EMAIL
            
            res.status(StatusCodes.OK).json();
        } catch (error) {
            next(error); //Chamada do Handler de Erro
        }
    }

    async resetPassword (req: Request, res: Response, next: NextFunction) {
        try {            
            const requestBody: ForgotPassword = req.body; 
            const securityCode: string = requestBody.security_code;

            if (!securityCode){
                throw new ForbiddenError('Código de segurança não informado')
            }

            if (!requestBody.new_password){
                throw new ForbiddenError('Nova senha não informada')
            }

            const valideSecurityCode = await userRepositorie.findValidateSecurityCode(securityCode);
            if (!valideSecurityCode){
                throw new ForbiddenError('Código de segurança inválido')
            }

            await userRepositorie.updateResetPassword(securityCode, requestBody.new_password); //Alterar a senha vinculada ao código de segurança

            res.status(StatusCodes.OK).json();
        } catch (error) {
            next(error); //Chamada do Handler de Erro
        }
    }    

}

export default new userController();