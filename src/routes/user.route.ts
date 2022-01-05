import { Router, Request, Response, NextFunction } from "express";
import {StatusCodes} from 'http-status-codes';
import userRepositorie from "../repositories/user.repositorie";


const usersRoute = Router();

usersRoute.get('/users', async (req: Request, res: Response, next: NextFunction) => {
    try {  
        const users = await userRepositorie.findAllUsers(); //Classe para realizar o SELECT de todos os usuários
        
        res.status(StatusCodes.OK).send({users});
    } catch (error) {
        next(error); //Chamada do Handler de Erro
    };
});

usersRoute.get('/users/:uuid', async (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
    try {        
        const uuid = req.params.uuid; //Pegar o parametro enviado na URL da request
        const userData = await userRepositorie.findUserById(uuid); //Classe para realizar o SELECT do usuário
        
        res.status(StatusCodes.OK).send({userData});
    } catch (error) {
        next(error); //Chamada do Handler de Erro
    };
    
});

usersRoute.post('/users', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newUser = req.body; //Pegar o Body enviado na Request
        const uuid = await userRepositorie.create(newUser); //Classe p/ realizar o Insert
    
        res.status(StatusCodes.CREATED).send(uuid);
    } catch (error) {
        next(error); //Chamada do Handler de Erro
    };

});

usersRoute.put('/users/:uuid', async (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
    try {
        const uuid = req.params.uuid; //Pegar o parametro enviado na URL da request
        const modifiedUser = req.body; //Pegar o Body enviado na Request
    
        await userRepositorie.update(modifiedUser); //Classe p/ realizar o Update
        
        modifiedUser.uuid = uuid; //Adicionar o UUID ao JSON enviado na requisição
    
        res.status(StatusCodes.OK).send(modifiedUser);
    } catch (error) {
        next(error); //Chamada do Handler de Erro
    };

});

usersRoute.delete('/users/:uuid', async (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
    try {
        const uuid = req.params.uuid; //Pegar o parametro enviado na URL da request
    
        await userRepositorie.remove(uuid); //Classe p/ realizar o DELETE
    
        res.status(StatusCodes.OK).send({uuid});
    } catch (error) {
        next(error); //Chamada do Handler de Erro
    };

});

export default usersRoute;