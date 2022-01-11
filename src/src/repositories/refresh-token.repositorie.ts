import db from '../database/db';
import DatabaseError from '../models/errors/database.error.model';
import User from '../models/user.model';
import dayjs from 'dayjs';
import RefreshToken from '../models/refreshToken.model';
require('dotenv').config();

class RefreshTokenRepository {

    async generateRefreshToken(user: User): Promise<string>{
        try {
            await this.remove(user.uuid as string); //Chamada da classe p/ remover os Refresh Token's do usuário
            const refreshToken = await this.create(user); //Chamada da classe p/ geração do refresh Token
            return refreshToken;
        } catch (error) {
            throw new DatabaseError('Erro na geração do Refresh Token', error);
        };
    };

    async findRefreshTokenByID(id: string): Promise<RefreshToken> {
        try {
            const query = `SELECT UUID,
                                  USERNAME,
                                  EXPIRESIN                   
                             FROM "public"."refresh_token"
                            WHERE ID = $1`;
            const params = [id];

            const { rows } = await db.query<RefreshToken>(query, params); //Execução da Query passando os parâmetros
            
            const [refreshToken] = rows;
            
            return refreshToken || null;
        } catch (error) {
            throw new DatabaseError('Erro na consulta do Refresh Token', error);
        };
    };

    async create (user: User): Promise<string> {
        try {
            //Buscar o tempo de Expiração do Token de Refresh
            const expirationTime = process.env['REFRESH_TOKEN_EXPIRATION_TIME'] as string;
            const [expirationTimeValue, expirationTimeUnit] = expirationTime.split(' ');


            const expiresin = dayjs().add(Number(expirationTimeValue), expirationTimeUnit).unix();
            
            const script = `INSERT INTO REFRESH_TOKEN (UUID, USERNAME, EXPIRESIN)  
                                               VALUES ($1, $2, $3)
                            RETURNING ID`;
            const params = [user.uuid, user.username, expiresin];

            const { rows } = await db.query<{ id: string }>(script, params); //Execução da Query passando os parâmetros
            const [newRefreshToken] = rows;
            return newRefreshToken.id;
        } catch (error) {
            throw new DatabaseError('Erro ao gerar o Refresh Token', error);
        };
    };

    async remove(uuid: string): Promise<void> {
        try {
            const script = `DELETE FROM "public"."refresh_token" WHERE UUID = $1`;
            const params = [uuid];

            await db.query(script, params); //Execução da Query passando os parâmetros
        } catch (error) {
            throw new DatabaseError('Erro ao Remover o Refresh Token', error);
        };
    };

};

export default new RefreshTokenRepository();
