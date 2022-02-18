import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import ForbiddenError from '../models/errors/forbidden.error.model';
import RefreshToken from '../models/refreshToken.model';
import User from '../models/user.model';
import RefreshTokenRepository from '../repositories/refresh-token.repositorie';
import dateutil from '../util/dateutil';
import JWTToken from '../util/jtw-utils';

class AuthenticationController {
  public async createToken(req: Request, res: Response, next: NextFunction) {
    try {
      const user: User = req.user; //Pega o objeto User que está na requisição e que foi adicionado pelo Middleware basicAuthenticationMiddleware

      if (!user) {
        throw new ForbiddenError('Usuário não informado!');
      }

      const repository = new RefreshTokenRepository();

      const newRefreshToken = await repository.generateRefreshToken(user);

      const jwt = await JWTToken.create(user); //Chamada da classe p/ geração do Token

      const response = { token: jwt, refreshToken: newRefreshToken };

      return res.status(StatusCodes.OK).json(response); //Retorar o Token gerado
    } catch (error) {
      next(error); //Chamada do Handler de Erro
    }
  }

  public async createRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      //Verifica se o Refresh Token foi informado na requisição
      const request: RefreshToken = req.body;

      if (!request || !request.refreshToken) {
        throw new ForbiddenError('Refresh Token não informado!');
      }

      const repository = new RefreshTokenRepository();

      //Verifica se existe um Refresh Token válido p/ o Usuário
      const userData = await repository.findRefreshTokenByID(
        request.refreshToken
      );

      //Verifica se o Refresh Token está expirado
      const refreshTokenExpired = dateutil.isAfter(
        userData.expiresin as number
      );

      if (refreshTokenExpired) {
        throw new ForbiddenError('Refresh Token Expirado');
      }

      const newRefreshToken = await repository.generateRefreshToken(userData); //Geração do novo Refresh Token

      //Geração do novo Token
      const jwt = await JWTToken.create(userData);

      const response = { token: jwt, refreshToken: newRefreshToken };

      return res.status(StatusCodes.CREATED).json(response); //Retorar o Token gerado
    } catch (error) {
      next(error); //Chamada do Handler de Erro
    }
  }
}

export default AuthenticationController;
