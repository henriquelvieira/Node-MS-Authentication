import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import ForbiddenError from '../models/errors/forbidden.error.model';
import ForgotPassword from '../models/forgotPassword.model';
import User from '../models/user.model';
import UserRepository from '../repositories/user.repositorie';
import GenerateRandom from '../util/randons.util';

class UserController {
  public async listUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserRepository.findAllUsers(); //Classe para realizar o SELECT de todos os usuários

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
      const user: User = await UserRepository.findUserById(uuid); //Classe para realizar o SELECT do usuário

      return res.status(StatusCodes.OK).json(user);
    } catch (error) {
      next(error); //Chamada do Handler de Erro
    }
  }

  public async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const newUser: User = req.body; //Pegar o Body enviado na Request
      const uuid = await UserRepository.create(newUser); //Classe p/ realizar o Insert

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
      const uuid = req.params.uuid; //Pegar o parametro enviado na URL da request
      const uuidToken = req.user.uuid as string;

      if (uuid !== uuidToken) {
        throw new ForbiddenError('Não é possível alterar outro usuário');
      }

      const modifiedUser: User = req.body; //Pegar o Body enviado na Request
      modifiedUser.uuid = uuid; //Adicionar o UUID ao JSON enviado na requisição

      await UserRepository.update(modifiedUser); //Classe p/ realizar o Update

      const user = await UserRepository.findUserById(uuid); //Classe para realizar o SELECT do usuário

      return res.status(StatusCodes.OK).json(user);
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

      await UserRepository.remove(uuid); //Classe p/ realizar o DELETE

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

      const userExists: boolean = await UserRepository.findUserExists(
        userData.username
      );

      if (userExists) {
        const generateRandom = new GenerateRandom();

        //Gerar código de segurança e nova senha
        const securityCode: string = generateRandom.randomCode();
        const securityPassword: string = generateRandom.randomCode();

        await UserRepository.updateforgotPassword(
          userData.username,
          securityCode,
          securityPassword
        );
      }

      //TO DO: ENVIAR CÓDIGO GERADO POR EMAIL

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

      const valideSecurityCode = await UserRepository.findValidateSecurityCode(
        securityCode
      );
      if (!valideSecurityCode) {
        throw new ForbiddenError('Código de segurança inválido');
      }

      await UserRepository.updateResetPassword(
        securityCode,
        requestBody.newPassword
      ); //Alterar a senha vinculada ao código de segurança

      res.status(StatusCodes.OK).json();
    } catch (error) {
      next(error); //Chamada do Handler de Erro
    }
  }
}

export default UserController;
