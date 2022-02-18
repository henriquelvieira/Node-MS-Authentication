import ForbiddenError from '../models/errors/forbidden.error.model';
import ForgotPassword from '../models/forgotPassword.model';
import User from '../models/user.model';
import UserRepository from '../repositories/user.repositorie';
import GenerateRandom from '../util/randons.util';

class UserService {
  public async listUsers(): Promise<User[]> {
    const users = await UserRepository.findAllUsers(); //Classe para realizar o SELECT de todos os usuários
    return users;
  }

  public async listUserById(uuid: string): Promise<User> {
    const user: User = await UserRepository.findUserById(uuid); //Classe para realizar o SELECT do usuário
    return user;
  }

  public async createUser(user: User): Promise<string> {
    const uuid = await UserRepository.create(user); //Classe p/ realizar o Insert
    return uuid;
  }

  public async modifiedUser(uuidParam: string, user: User): Promise<User> {
    const modifiedUser: User = user; //Pegar o Body enviado na Request
    modifiedUser.uuid = uuidParam; //Adicionar o UUID ao JSON enviado na requisição

    await UserRepository.update(modifiedUser); //Classe p/ realizar o Update

    const response = await UserRepository.findUserById(modifiedUser.uuid); //Classe para realizar o SELECT do usuários
    return response;
  }

  public async removeUser(uuid: string): Promise<void> {
    await UserRepository.remove(uuid); //Classe p/ realizar o DELETE
  }

  public async forgotPassword(user: User): Promise<void> {
    //Verificar se o usuário existe
    const userExists: boolean = await UserRepository.findUserExists(
      user.username
    );

    if (userExists) {
      const generateRandom = new GenerateRandom();

      //Gerar código de segurança e nova senha
      const securityCode: string = generateRandom.randomCode();
      const securityPassword: string = generateRandom.randomCode();

      await UserRepository.updateforgotPassword(
        user.username,
        securityCode,
        securityPassword
      );
      //TODO: ENVIAR CÓDIGO GERADO POR EMAIL
    }
  }

  public async resetPassword(forgotPassword: ForgotPassword): Promise<void> {
    const valideSecurityCode = await UserRepository.findValidateSecurityCode(
      forgotPassword.securityCode
    );

    if (!valideSecurityCode) {
      throw new ForbiddenError('Código de segurança inválido');
    }

    await UserRepository.updateResetPassword(forgotPassword); //Alterar a senha vinculada ao código de segurança
  }
}

export default UserService;
