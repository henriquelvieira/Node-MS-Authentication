import { Router, Request, Response, NextFunction } from "express";
import {StatusCodes} from 'http-status-codes';
import userRepositorie from "../repositories/user.repositorie";


const usersRoute = Router();

usersRoute.get('/users', async (req: Request, res: Response, next: NextFunction) => {
    const users = await userRepositorie.findAllUsers(); //Chamada da Classe que irá realizar o SELECT na tabela de usuários
    res.status(StatusCodes.OK).send({users});
});

usersRoute.get('/users/:uuid', async (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
    const uuid = req.params.uuid;
    const userData = await userRepositorie.findUserById(uuid);
    
    res.status(StatusCodes.OK).send({userData});
});

usersRoute.post('/users', async (req: Request, res: Response, next: NextFunction) => {
    const newUser = req.body;
    console.log(newUser);
    const uuid = await userRepositorie.create(newUser);

    console.log(newUser);
    res.status(StatusCodes.CREATED).send(uuid);
});

usersRoute.put('/users/:uuid', (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
    const uuid = req.params.uuid;
    const modifiedUser = req.body;
    
    modifiedUser.uuid = uuid; //Adicionar o UUID ao JSON enviado na requisição
    console.log(modifiedUser);

    res.status(StatusCodes.OK).send(modifiedUser);
});

usersRoute.delete('/users/:uuid', (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
    const uuid = req.params.uuid;

    res.status(StatusCodes.OK).send({uuid});
});

export default usersRoute;