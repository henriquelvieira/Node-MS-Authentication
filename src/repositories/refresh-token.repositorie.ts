import db from '../db';
import DatabaseError from '../models/errors/database.error.model';

class RefreshTokenRepository {

    async create (uuid: string): Promise<string> {
        try {
            const script = `INSERT INTO REFRESH_TOKEN (UUID, EXPIRESIN)  
                                               VALUES ($1, $2)
                            RETURNING ID`;
            const params = [uuid, 1];

            const { rows } = await db.query<{ id: string }>(script, params); //Execução da Query passando os parâmetros
            const [newRefreshToken] = rows;
            return newRefreshToken.id;
        } catch (error) {
            throw new DatabaseError('Erro ao gerar o Refresh Token', error);
        };

    };

};

export default new RefreshTokenRepository();
