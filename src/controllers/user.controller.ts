import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import ForbiddenError from '../models/errors/forbidden.error.model';
import ForgotPassword from '../models/forgotPassword.model';
import User from '../models/user.model';
import UserService from '../services/user.service';

class UserController {
  public async listUsers(_req: Request, res: Response, next: NextFunction) {
    try {
      const userService = new UserService();
      const users = await userService.listUsers();

      return res.status(StatusCodes.OK).json({ users });
    } catch (error) {
      next(error); //Chamada do Handler de Erro
    }
  }

  public async listUserById(
    req: Request<{ uuid: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const uuid: string = req.params.uuid; //Pegar o parametro enviado na URL da request

      const userService = new UserService();
      const user = await userService.listUserById(uuid);

      return res.status(StatusCodes.OK).json(user);
    } catch (error) {
      next(error); //Chamada do Handler de Erro
    }
  }

  public async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const newUser: User = req.body; //Pegar o Body enviado na Request

      const userService = new UserService();
      const uuid = await userService.createUser(newUser);

      return res.status(StatusCodes.CREATED).json({ uuid });
    } catch (error) {
      next(error); //Chamada do Handler de Erro
    }
  }

  public async modifiedUser(
    req: Request<{ uuid: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const uuidParam = req.params.uuid; //Pegar o parametro enviado na URL da request
      const uuidToken = req.user.uuid as string;

      //Validar se a alteração está sendo feita pelo proprio usuário
      if (uuidParam !== uuidToken) {
        throw new ForbiddenError('Não é possível alterar outro usuário');
      }

      const modifiedUser: User = req.body; //Pegar o Body enviado na Request

      const userService = new UserService();
      const response = await userService.modifiedUser(uuidParam, modifiedUser);

      return res.status(StatusCodes.OK).json(response);
    } catch (error) {
      next(error); //Chamada do Handler de Erro
    }
  }

  public async removeUser(
    req: Request<{ uuid: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const uuid = req.params.uuid; //Pegar o parametro enviado na URL da request

      const userService = new UserService();
      await userService.removeUser(uuid);

      res.status(StatusCodes.OK).json({ uuid });
    } catch (error) {
      next(error); //Chamada do Handler de Erro
    }
  }

  public async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const userData: User = req.body;

      if (!userData.username && !userData.email) {
        throw new ForbiddenError('Usuário ou E-mail não informado');
      }

      const userService = new UserService();
      await userService.forgotPassword(userData);

      res.status(StatusCodes.OK).json(); //Retornar sempre OK por segurança, mesmo quando o usuário não exista, isto impedirá a detecção de quais usuários existem ou não no banco
    } catch (error) {
      next(error); //Chamada do Handler de Erro
    }
  }

  public async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const requestBody: ForgotPassword = req.body;
      const securityCode: string = requestBody.securityCode;

      if (!securityCode) {
        throw new ForbiddenError('Código de segurança não informado');
      }

      if (!requestBody.newPassword) {
        throw new ForbiddenError('Nova senha não informada');
      }

      const userService = new UserService();
      await userService.resetPassword(requestBody);

      res.status(StatusCodes.OK).json();
    } catch (error) {
      next(error); //Chamada do Handler de Erro
    }
  }
}

export default UserController;
