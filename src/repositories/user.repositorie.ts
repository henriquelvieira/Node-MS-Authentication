import StaticStringKeys from '../common/constants';
import db from '../database/db';
import DatabaseError from '../models/errors/database.error.model';
import ForgotPassword from '../models/forgotPassword.model';
import User from '../models/user.model';
import Configs from '../util/configs';
import Env from '../util/env';

// Repository interface
export interface IUserRepository {
  findAllUsers(): Promise<User[]>;
  findUserById(uuid: string): Promise<User>;
  findUserByUsername(username: string): Promise<string>;
  findUserExists(username: string): Promise<boolean>;
  findUserLocked(username: string): Promise<boolean>;
  findValidateSecurityCode(securityCode: string): Promise<boolean>;
  findSecurityCode(username: string): Promise<string>;
  findUsernameAndPassword(username: string, password: string): Promise<User>;
  create(user: User): Promise<string>;
  update(user: User): Promise<boolean>;
  remove(uuid: string): Promise<boolean>;
  removeByUsername(username: string): Promise<void>;
  updateFailedAttempt(username: string): Promise<void>;
  updateSuccessLogin(username: string): Promise<void>;
  updateforgotPassword(
    username: string,
    securityCode: string,
    passwordSecurity: string
  ): Promise<void>;
  updateResetPassword(forgotPassword: ForgotPassword): Promise<void>;
}

class UserRepository implements IUserRepository {
  private getPasswordCrypt(): string {
    const configs = Configs.get('App.envs.PostgreSQL');

    const passwordCrypt = Env.get(configs.get('passwordCRYPT')) as string;
    return passwordCrypt;
  }

  public async findAllUsers(): Promise<User[]> {
    try {
      const query = `SELECT UUID,
                            USERNAME,
                            EMAIL                         
                       FROM APPLICATION_USER`;
      const { rows } = await db.query<User>(query); //Execução da Query

      return rows;
    } catch (error) {
      throw new DatabaseError(StaticStringKeys.FAIL_FIND_USERS, error);
    }
  }

  public async findUserById(uuid: string): Promise<User> {
    try {
      const query = `SELECT UUID,
                            USERNAME,
                            EMAIL                      
                       FROM APPLICATION_USER
                      WHERE UUID = $1`;
      const params = [uuid];

      const { rows } = await db.query<User>(query, params); //Execução da Query passando os parâmetros
      const [user] = rows;

      return user;
    } catch (error) {
      throw new DatabaseError(StaticStringKeys.FAIL_FIND_USERS_BY_ID, error);
    }
  }

  public async findUserByUsername(username: string): Promise<string> {
    try {
      const query = `SELECT UUID 
                       FROM APPLICATION_USER 
                      WHERE USERNAME = $1`;
      const params = [username];

      const { rows } = await db.query<{ uuid: string }>(query, params); //Execução da Query passando os parâmetros
      const [uuid] = rows;

      return uuid.uuid;
    } catch (error) {
      throw new DatabaseError(
        StaticStringKeys.FAIL_FIND_USERS_BY_USERNAME,
        error
      );
    }
  }

  public async findUserExists(username: string): Promise<boolean> {
    try {
      const query = `SELECT COUNT(*)                    
                       FROM APPLICATION_USER
                      WHERE USERNAME = $1`;
      const params = [username];

      const { rows } = await db.query<{ count: number }>(query, params); //Execução da Query passando os parâmetros
      const [response] = rows;

      return Number(response.count) > 0 ? true : false;
    } catch (error) {
      throw new DatabaseError(
        StaticStringKeys.FAIL_FIND_USERS_BY_USERNAME,
        error
      );
    }
  }

  public async findUserLocked(username: string): Promise<boolean> {
    try {
      const query = `SELECT COUNT(*)                    
                       FROM APPLICATION_USER
                      WHERE USERNAME = $1
                        AND LOCKED_AT IS NOT NULL`;
      const params = [username];

      const { rows } = await db.query<{ count: number }>(query, params); //Execução da Query passando os parâmetros
      const [response] = rows;

      return Number(response.count) > 0 ? true : false;
    } catch (error) {
      throw new DatabaseError(
        StaticStringKeys.FAIL_FIND_USERS_BY_USERNAME,
        error
      );
    }
  }

  public async findValidateSecurityCode(
    securityCode: string
  ): Promise<boolean> {
    try {
      const query = `SELECT COUNT(*)
                       FROM APPLICATION_USER
                      WHERE SECURITY_CODE = $1`;
      const params = [securityCode];

      const { rows } = await db.query<{ count: number }>(query, params); //Execução da Query passando os parâmetros
      const [response] = rows;

      return Number(response.count) > 0 ? true : false;
    } catch (error) {
      throw new DatabaseError(
        StaticStringKeys.FAIL_FIND_USERS_BY_USERNAME,
        error
      );
    }
  }

  public async findSecurityCode(username: string): Promise<string> {
    try {
      const query = `SELECT SECURITY_CODE
                       FROM APPLICATION_USER
                      WHERE USERNAME = $1`;
      const params = [username];

      const { rows } = await db.query<{ security_code: string }>(query, params); //Execução da Query passando os parâmetros
      const [response] = rows;
      return response ? response.security_code : '';
    } catch (error) {
      throw new DatabaseError(
        StaticStringKeys.FAIL_FIND_USER_BY_SECURITY_CODE,
        error
      );
    }
  }

  public async findUsernameAndPassword(
    username: string,
    password: string
  ): Promise<User> {
    try {
      const passwordCrypt = this.getPasswordCrypt();

      const query = `SELECT UUID,
                            USERNAME,
                            EMAIL                    
                       FROM APPLICATION_USER
                      WHERE USERNAME = $1
                        AND PASSWORD = crypt($2, $3)`;
      const params = [username, password, passwordCrypt];

      const { rows } = await db.query<User>(query, params); //Execução da Query passando os parâmetros
      const [user] = rows; //Pegar a primeira linha

      return user;
    } catch (error) {
      throw new DatabaseError(
        StaticStringKeys.FAIL_FIND_USERS_BY_USERNAME_PASSWORD,
        error
      );
    }
  }

  public async create(user: User): Promise<string> {
    try {
      const passwordCrypt = this.getPasswordCrypt();
      const script = `INSERT INTO APPLICATION_USER (
                                                    USERNAME, 
                                                    PASSWORD,
                                                    EMAIL
                                                   ) 
                                            VALUES (
                                                    $1,
                                                    crypt($2, $3),
                                                    $4
                                                   )
                                                   RETURNING uuid`;
      const params = [user.username, user.password, passwordCrypt, user.email];

      const { rows } = await db.query<{ uuid: string }>(script, params); //Execução da Query passando os parâmetros
      const [newUser] = rows;

      return newUser.uuid;
    } catch (error) {
      throw new DatabaseError(StaticStringKeys.FAIL_SAVE_USER, error);
    }
  }

  public async update(user: User): Promise<boolean> {
    try {
      const passwordCrypt = this.getPasswordCrypt();

      const script = `UPDATE APPLICATION_USER
                         SET USERNAME = $1,
                             PASSWORD = crypt($2, $3),
                             EMAIL = $4,
                             UPDATED_AT = CURRENT_TIMESTAMP
                       WHERE UUID = $5`;
      const params = [
        user.username,
        user.password,
        passwordCrypt,
        user.email,
        user.uuid,
      ];

      await db.query(script, params); //Execução da Query passando os parâmetros
    } catch (error) {
      throw new DatabaseError(StaticStringKeys.FAIL_UPDATE_USER, error);
    }

    return true;
  }

  public async remove(uuid: string): Promise<boolean> {
    try {
      const script = `DELETE FROM "public"."application_user" WHERE uuid = $1`;
      const params = [uuid];

      await db.query(script, params); //Execução da Query passando os parâmetros
      return true;
    } catch (error) {
      throw new DatabaseError(StaticStringKeys.FAIL_REMOVE_USER, error);
    }
  }

  public async removeByUsername(username: string): Promise<void> {
    try {
      const script = `DELETE FROM "public"."application_user" WHERE username = $1`;
      const params = [username];

      await db.query(script, params); //Execução da Query passando os parâmetros
    } catch (error) {
      throw new DatabaseError(StaticStringKeys.FAIL_REMOVE_USER, error);
    }
  }

  public async updateFailedAttempt(username: string): Promise<void> {
    try {
      const script = `UPDATE "public"."application_user" 
                         SET FAILED_ATTEMP = FAILED_ATTEMP + 1,
                             LOCKED_AT = CASE 
                                            WHEN (FAILED_ATTEMP + 1) >= 3 THEN CURRENT_TIMESTAMP
                                            ELSE NULL
                                        END  
                       WHERE username = $1`;
      const params = [username];

      await db.query(script, params); //Execução da Query passando os parâmetros
    } catch (error) {
      throw new DatabaseError(StaticStringKeys.FAIL_REGISTER_LOGIN, error);
    }
  }

  public async updateSuccessLogin(username: string): Promise<void> {
    try {
      const script = `UPDATE "public"."application_user" 
                         SET FAILED_ATTEMP = 0,
                             LOCKED_AT     = NULL,
                             LAST_LOGIN_AT = CURRENT_TIMESTAMP
                       WHERE USERNAME  = $1`;
      const params = [username];

      await db.query(script, params); //Execução da Query passando os parâmetros
    } catch (error) {
      throw new DatabaseError(StaticStringKeys.FAIL_REGISTER_LOGIN, error);
    }
  }

  public async updateforgotPassword(
    username: string,
    securityCode: string,
    passwordSecurity: string
  ): Promise<void> {
    try {
      const passwordCrypt = this.getPasswordCrypt();

      const script = `UPDATE "public"."application_user" 
                         SET PASSWORD      = crypt($1, $2),
                             SECURITY_CODE = $3 
                       WHERE USERNAME  = $4`;
      const params = [passwordSecurity, passwordCrypt, securityCode, username];

      await db.query(script, params); //Execução da Query passando os parâmetros
    } catch (error) {
      throw new DatabaseError(
        StaticStringKeys.FAIL_GENERATE_RECOVER_PASSWORD,
        error
      );
    }
  }

  public async updateResetPassword(
    forgotPassword: ForgotPassword
  ): Promise<void> {
    try {
      const passwordCrypt = this.getPasswordCrypt();

      const script = `UPDATE "public"."application_user" 
                         SET PASSWORD      = crypt($1, $2),
                             SECURITY_CODE = null,
                             FAILED_ATTEMP = 0,
                             LOCKED_AT     = NULL,
                             LAST_LOGIN_AT = CURRENT_TIMESTAMP
                       WHERE SECURITY_CODE = $3`;
      const params = [
        forgotPassword.newPassword,
        passwordCrypt,
        forgotPassword.securityCode,
      ];

      await db.query(script, params); //Execução da Query passando os parâmetros
    } catch (error) {
      throw new DatabaseError(StaticStringKeys.FAIL_RECOVER_PASSWORD, error);
    }
  }
}

// export default new UserRepository();
export default UserRepository;
