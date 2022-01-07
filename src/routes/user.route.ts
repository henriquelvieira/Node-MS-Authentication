import { Router, Request, Response, NextFunction } from "express";
import {StatusCodes} from 'http-status-codes';
import userRepositorie from "../repositories/user.repositorie";
import User from "../models/user.model";


const usersRoute = Router();

usersRoute.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {  
        const users = await userRepositorie.findAllUsers(); //Classe para realizar o SELECT de todos os usuários
        
        res.status(StatusCodes.OK).json({users});
    } catch (error) {
        next(error); //Chamada do Handler de Erro
    };
});

usersRoute.get('/:uuid', async (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
    try {        
        const uuid = req.params.uuid; //Pegar o parametro enviado na URL da request
        const userData = await userRepositorie.findUserById(uuid); //Classe para realizar o SELECT do usuário
        
        res.status(StatusCodes.OK).json({userData});
    } catch (error) {
        next(error); //Chamada do Handler de Erro
    };
});

usersRoute.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newUser: User = req.body; //Pegar o Body enviado na Request
        const uuid = await userRepositorie.create(newUser); //Classe p/ realizar o Insert
    
        res.status(StatusCodes.CREATED).json({ uuid });
    } catch (error) {
        next(error); //Chamada do Handler de Erro
    };
});

usersRoute.put('/:uuid', async (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
    try {
        const uuid = req.params.uuid; //Pegar o parametro enviado na URL da request
        const modifiedUser: User = req.body; //Pegar o Body enviado na Request
        modifiedUser.uuid = uuid; //Adicionar o UUID ao JSON enviado na requisição
    
        await userRepositorie.update(modifiedUser); //Classe p/ realizar o Update
        
        const user = await userRepositorie.findUserById(uuid); //Classe para realizar o SELECT do usuário
    
        res.status(StatusCodes.OK).json(user);
    } catch (error) {
        next(error); //Chamada do Handler de Erro
    };
});

usersRoute.delete('/:uuid', async (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
    try {
        const uuid = req.params.uuid; //Pegar o parametro enviado na URL da request
    
        await userRepositorie.remove(uuid); //Classe p/ realizar o DELETE
    
        res.status(StatusCodes.OK).json({uuid});
    } catch (error) {
        next(error); //Chamada do Handler de Erro
    };
});

export default usersRoute;