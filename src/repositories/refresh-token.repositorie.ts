import StaticStringKeys from '../common/constants';
import db from '../database/db';
import DatabaseError from '../models/errors/database.error.model';
import User from '../models/user.model';
import Configs from '../util/configs';
import dateutil from '../util/dateutil';

// Repository interface
export interface IRefreshTokenRepository {
  generateRefreshToken(user: User): Promise<string>;
  findRefreshTokenByID(id: string): Promise<User>;
}

class RefreshTokenRepository implements IRefreshTokenRepository {
  public async generateRefreshToken(user: User): Promise<string> {
    try {
      await this.remove(user.uuid as string); //Chamada da classe p/ remover os Refresh Token's do usuário
      const refreshToken = await this.create(user); //Chamada da classe p/ geração do refresh Token
      return refreshToken;
    } catch (error) {
      throw new DatabaseError(
        StaticStringKeys.FAIL_GENERATE_REFRESH_TOKEN,
        error
      );
    }
  }

  public async findRefreshTokenByID(id: string): Promise<User> {
    try {
      const query = `SELECT UUID,
                            USERNAME,
                            EXPIRESIN                   
                       FROM "public"."refresh_token"
                      WHERE ID = $1`;
      const params = [id];

      const { rows } = await db.query<User>(query, params); //Execução da Query passando os parâmetros

      const [refreshToken] = rows;

      const userData: User = {
        uuid: refreshToken.uuid,
        username: refreshToken.username as string,
        expiresin: refreshToken.expiresin as number,
      };

      return userData;
    } catch (error) {
      throw new DatabaseError(StaticStringKeys.INVALID_REFRESH_TOKEN, error);
    }
  }

  private async create(user: User): Promise<string> {
    try {
      //Buscar o tempo de Expiração do Token de Refresh
      const configs = Configs.get('App.jwt');
      const expirationTime = configs.get('refreshTokenExpiresIn') as string;
      const [expirationTimeValue, expirationTimeUnit] =
        expirationTime.split(' ');

      const expiresin = dateutil.addDate(
        Number(expirationTimeValue),
        expirationTimeUnit
      );

      const script = `INSERT INTO REFRESH_TOKEN (UUID, USERNAME, EXPIRESIN)  
                                         VALUES ($1, $2, $3)
                            RETURNING ID`;
      const params = [user.uuid, user.username, expiresin];

      const { rows } = await db.query<{ id: string }>(script, params); //Execução da Query passando os parâmetros
      const [newRefreshToken] = rows;
      return newRefreshToken.id;
    } catch (error) {
      throw new DatabaseError(
        StaticStringKeys.FAIL_GENERATE_REFRESH_TOKEN,
        error
      );
    }
  }

  private async remove(uuid: string): Promise<void> {
    try {
      const script = `DELETE FROM "public"."refresh_token" WHERE UUID = $1`;
      const params = [uuid];

      await db.query(script, params); //Execução da Query passando os parâmetros
    } catch (error) {
      throw new DatabaseError(
        StaticStringKeys.FAIL_REMOVE_REFRESH_TOKEN,
        error
      );
    }
  }
}

export default RefreshTokenRepository;
