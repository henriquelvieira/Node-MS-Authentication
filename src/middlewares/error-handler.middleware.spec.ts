import { Request, NextFunction } from 'express';

import errorHandlerMiddleware from '../middlewares/error-handler.middleware';
import DatabaseError from '../models/errors/database.error.model';
import ForbiddenError from '../models/errors/forbidden.error.model';

describe('errorHandlerMiddleware', () => {
  const mockResponse: any = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
    json: jest.fn(),
  };

  const mockRequest = {
    body: {},
  } as Request;

  const mockNext: NextFunction = jest.fn();

  it('(formatURL) - Should not be able to format a url', async () => {
    let erro = new DatabaseError('Teste Error');
    errorHandlerMiddleware(erro, mockRequest, mockResponse, mockNext);
    expect(mockResponse.status).toBeCalledWith(400);

    erro = new ForbiddenError('Teste Error');
    errorHandlerMiddleware(erro, mockRequest, mockResponse, mockNext);
    expect(mockResponse.status).toBeCalledWith(403);

    erro = new Error('');
    errorHandlerMiddleware(erro, mockRequest, mockResponse, mockNext);
    expect(mockResponse.status).toBeCalledWith(500);
  });
});
