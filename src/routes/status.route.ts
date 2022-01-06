import { Router, Request, Response, NextFunction } from "express";
import {StatusCodes} from 'http-status-codes';

const statusRoute = Router();

statusRoute.get('/', (req: Request, res: Response, next: NextFunction) => {
    console.log('Chamada da rota /status')
    const response = {foo: 'bar'}
    res.status(StatusCodes.OK).send(response); //Responder a requisição c/ o Status 200
});

export default statusRoute;