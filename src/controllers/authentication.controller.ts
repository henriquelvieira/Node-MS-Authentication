import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import StaticStringKeys from '../common/constants';
import ForbiddenError from '../models/errors/forbidden.error.model';
import RefreshToken from '../models/refreshToken.model';
import User from '../models/user.model';
import AuthenticationService, {
  IAuthenticationService,
} from '../services/authentication.service';

class AuthenticationController {
  public async createToken(req: Request, res: Response, next: NextFunction) {
    try {
      const user: User = req.user; //Pega o objeto User que está na requisição e que foi adicionado pelo Middleware basicAuthenticationMiddleware

      if (!user) {
        throw new ForbiddenError(StaticStringKeys.INVALID_USERNAME);
      }

      const authenticationService: IAuthenticationService =
        new AuthenticationService();

      const response = await authenticationService.createToken(user);

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
        throw new ForbiddenError(StaticStringKeys.UNKNOWN_REFRESH_TOKEN);
      }

      const authenticationService: IAuthenticationService =
        new AuthenticationService();

      const response = await authenticationService.createRefreshToken(
        request.refreshToken
      );

      return res.status(StatusCodes.CREATED).json(response); //Retorar o Token gerado
    } catch (error) {
      next(error); //Chamada do Handler de Erro
    }
  }
}

export default AuthenticationController;
