import { Request, Response, NextFunction } from 'express';

import ForbiddenError from '../models/errors/forbidden.error.model';
import UserRepository from '../repositories/user.repositorie';

async function basicAuthenticationMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const authorizationHeader = req.headers['authorization'];

    //Verificar se o header authorization foi informado na requisição
    if (!authorizationHeader) {
      throw new ForbiddenError('Credenciais não informadas');
    }

    //Separa a string, pegando o tipo da autenticação e o token
    const [authenticationType, token] = authorizationHeader.split(' ');

    //Verifica se o tipo da autenticação é diferente de Basic e se o token foi informado
    if (authenticationType !== 'Basic' || !token) {
      throw new ForbiddenError('Tipo de autenticação inválido');
    }

    //Converte o Token de Base64 p/ texto
    const tokenContent = Buffer.from(token, 'base64').toString('utf-8');
    const [username, password] = tokenContent.split(':');

    //Verifica se o usuário e senha foram informados na requisição
    if (!username || !password) {
      throw new ForbiddenError('Credenciais não Preenchidas');
    }

    //Validar se o Usuário está bloqueado
    const userLocked: boolean = await UserRepository.findUserLocked(username);
    if (userLocked) {
      throw new ForbiddenError('Usuário bloqueado');
    }

    const user = await UserRepository.findUsernameAndPassword(
      username,
      password
    ); //Classe para Validar o usuário e senha

    if (!user) {
      await UserRepository.updateFailedAttempt(username); //Registrar a tentativa incorreta
      throw new ForbiddenError('Usuário ou Senha inválidos');
    } else {
      await UserRepository.updateSuccessLogin(username); //Registrar o login
    }

    req.user = user; //Adicionar o objeto user dentro da requisição
    next(); //Chamada da requisição original que disparou o Middleware
  } catch (error) {
    next(error); //Chamada do Handler de Erro
  }
}

export default basicAuthenticationMiddleware;
