import { Request, Response, NextFunction } from 'express';

import StaticStringKeys from '../common/constants';
import ForbiddenError from '../models/errors/forbidden.error.model';
import User from '../models/user.model';
import UserRepository, {
  IUserRepository,
} from '../repositories/user.repositorie';

export type authorizationHeader = {
  username: string;
  password: string;
};

function validadeAuthorizationHeader(
  authorizationHeader: string | undefined
): authorizationHeader {
  //Verificar se o header authorization foi informado na requisição
  if (!authorizationHeader) {
    throw new ForbiddenError(StaticStringKeys.UNKNOWN_CREDENTIAL);
  }

  //Separa a string, pegando o tipo da autenticação e o token
  const [authenticationType, token] = authorizationHeader.split(' ');

  //Verifica se o tipo da autenticação é diferente de Basic e se o token foi informado
  if (authenticationType !== 'Basic' || !token) {
    throw new ForbiddenError(StaticStringKeys.INVALID_AUTHENTICATION_TYPE);
  }

  //Converte o Token de Base64 p/ texto
  const tokenContent = Buffer.from(token, 'base64').toString('utf-8');
  const [username, password] = tokenContent.split(':');

  //Verifica se o usuário e senha foram informados na requisição
  if (!username || !password) {
    throw new ForbiddenError(StaticStringKeys.UNKNOWN_USERNAME_OR_PASSWORD);
  }

  const authorizationData: authorizationHeader = {
    username: username,
    password: password,
  };

  return authorizationData;
}

async function validadeUser(
  authorizationData: authorizationHeader
): Promise<User> {
  const userRepository: IUserRepository = new UserRepository();

  //Validar se o Usuário está bloqueado
  const userLocked: boolean = await userRepository.findUserLocked(
    authorizationData.username
  );

  if (userLocked) {
    throw new ForbiddenError(StaticStringKeys.LOCKED_USER);
  }

  //Validar o usuário e senha
  const user = await userRepository.findUsernameAndPassword(
    authorizationData.username,
    authorizationData.password
  );

  if (!user) {
    //Registrar a tentativa incorreta
    await userRepository.updateFailedAttempt(authorizationData.username);
    throw new ForbiddenError(StaticStringKeys.INVALID_USERNAME_OR_PASSWORD);
  } else {
    //Registrar o login com sucesso
    await userRepository.updateSuccessLogin(authorizationData.username);
  }

  return user;
}

async function basicAuthenticationMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const authorizationHeader = req.headers['authorization'];

    const authorizationData = validadeAuthorizationHeader(authorizationHeader);

    const user = await validadeUser(authorizationData);

    req.user = user; //Adicionar o objeto user dentro da requisição
    next(); //Chamada da requisição original que disparou o Middleware
  } catch (error) {
    next(error); //Chamada do Handler de Erro
  }
}

export default basicAuthenticationMiddleware;
