import { Request, NextFunction } from 'express';

import DatabaseError from '../models/errors/database.error.model';
import ForbiddenError from '../models/errors/forbidden.error.model';
import errorHandlerMiddleware from './error-handler.middleware';

describe('errorHandlerMiddleware', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mockResponse: any = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
    json: jest.fn(),
  };

  const mockRequest = {
    body: {},
  } as Request;

  const mockNext: NextFunction = jest.fn();

  beforeEach(() => {
    mockResponse.status.mockClear();
    mockResponse.send.mockClear();
    mockResponse.json.mockClear();
  });

  it('(formatURL) - Should not be able to format a url', async () => {
    const erro = new DatabaseError('Teste Error');
    errorHandlerMiddleware(erro, mockRequest, mockResponse, mockNext);
    expect(mockResponse.status).toBeCalledWith(400);
  });

  it('(formatURL) - Should not be able to format a url', async () => {
    const erro = new ForbiddenError('Teste Error');
    errorHandlerMiddleware(erro, mockRequest, mockResponse, mockNext);
    expect(mockResponse.status).toBeCalledWith(403);
  });

  it('(formatURL) - Should not be able to format a url', async () => {
    const erro = new Error('');
    errorHandlerMiddleware(erro, mockRequest, mockResponse, mockNext);
    expect(mockResponse.status).toBeCalledWith(500);
  });
});
