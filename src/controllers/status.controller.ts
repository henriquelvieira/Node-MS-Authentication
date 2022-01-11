import { Request, Response, NextFunction } from "express";
import {StatusCodes} from 'http-status-codes';

class statusController {

    listStatus (req: Request, res: Response, next: NextFunction) {
        const response = {foo: 'bar'};
        return res.status(StatusCodes.OK).send(response); //Responder a requisição c/ o Status 200
    };


};

export default new statusController();
