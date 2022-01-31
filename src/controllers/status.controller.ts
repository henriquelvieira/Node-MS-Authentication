import { Request, Response } from "express";
import {StatusCodes} from 'http-status-codes';

class statusController {

    public listStatus (req: Request, res: Response) {
        const response = {foo: 'bar'};
        return res.status(StatusCodes.OK).send(response); //Responder a requisição c/ o Status 200
    }


}

export default new statusController();
