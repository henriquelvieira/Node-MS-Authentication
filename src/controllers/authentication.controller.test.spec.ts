import { Request, Response, NextFunction } from 'express';

import AuthenticationController from '../controllers/authentication.controller';
import DatabaseError from '../models/errors/database.error.model';
import ForbiddenError from '../models/errors/forbidden.error.model';
import RefreshToken from '../models/refreshToken.model';
import User from '../models/user.model';
import RefreshTokenRepository from '../repositories/refresh-token.repositorie';
import UserRepository from '../repositories/user.repositorie';
import JWTToken from '../util/jtw-utils';

describe("(authenticationController) - Authentication Controller's", () => {
  const username = 'teste';
  let uuid: string;
  let newRefreshToken: string;
  const refreshTokenRepository = new RefreshTokenRepository();
  const authenticationController = new AuthenticationController();

  const mockResponse: any = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };

  const mockRequest = {
    body: {
      user: '',
    },
  } as Request;

  const mockNext: NextFunction = jest.fn();

  beforeAll(async () => {
    uuid = await UserRepository.findUserByUsername(username); //Remover o usuário de teste
  });

  it('(createToken) - Should be able generate a new token', async () => {
    const user: User = { uuid: uuid, username: username };
    const token = await JWTToken.create(user);
    newRefreshToken = await refreshTokenRepository.generateRefreshToken(user);

    expect(token.length).toBeGreaterThan(0);
    expect(JWTToken.validate(token)).toHaveProperty('sub');
    expect(JWTToken.validate(token)).toHaveProperty('username');

    expect(newRefreshToken.length).toBeGreaterThan(0);
  });

  it('(createRefreshToken) - Should be able generate a new token with a valide refresh token', async () => {
    const refreshTokenRequest: RefreshToken = { refreshToken: newRefreshToken };

    const refreshTokenUserData =
      await refreshTokenRepository.findRefreshTokenByID(
        refreshTokenRequest.refreshToken
      );

    const userData: User = {
      uuid: refreshTokenUserData.uuid,
      username: refreshTokenUserData.username as string,
    };

    //Geração do novo Token
    const jwt = await JWTToken.create(userData);

    expect(JWTToken.validate(jwt)).toHaveProperty('sub');
    expect(JWTToken.validate(jwt)).toHaveProperty('username');
  });

  it('(createToken) - Should not be able generate a new token', async () => {
    const user: User = { uuid: uuid, username: '' };

    await expect(JWTToken.create(user)).rejects.toEqual(
      new ForbiddenError('Falha ao gerar o Token!')
    );
  });

  it('(createRefreshToken) - Should not be able generate a new token with a invalide refresh token', async () => {
    const refreshTokenRequest: RefreshToken = { refreshToken: '123456abcd' };

    await expect(
      refreshTokenRepository.findRefreshTokenByID(
        refreshTokenRequest.refreshToken
      )
    ).rejects.toEqual(new DatabaseError('Erro na consulta do Refresh Token'));
  });

  it('(createToken) - Should bit be able generate a token without a user', async () => {
    await authenticationController.createToken(
      mockRequest,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toBeCalled();
  });

  it('(createRefreshToken) - Should bit be able generate a refresh token without a user', async () => {
    await authenticationController.createRefreshToken(
      mockRequest,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toBeCalled();
  });
});
