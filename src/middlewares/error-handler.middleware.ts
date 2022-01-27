import { Request, Response, NextFunction } from 'express';
import {StatusCodes} from 'http-status-codes';
import logger from '../logger';
import DatabaseError from '../models/errors/database.error.model';
import ForbiddenError from '../models/errors/forbidden.error.model';

function errorHandlerMiddleware(error: any, req: Request, res: Response, next : NextFunction) {
    
    const errorMessage: string = error.message || 'unexpected-error';
    let errorCode = StatusCodes.INTERNAL_SERVER_ERROR;

    if (error instanceof DatabaseError) {
        errorCode = StatusCodes.BAD_REQUEST;
    } else if (error instanceof ForbiddenError) {
        errorCode = StatusCodes.FORBIDDEN;
    } else {
        logger.error(error);
    }
    
    res.status(errorCode).json({ errorMessage });
}

export default errorHandlerMiddleware;

