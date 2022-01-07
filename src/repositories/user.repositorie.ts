import db from '../db';
import User from '../models/user.model';
import DatabaseError from '../models/errors/database.error.model';

class UserRepository {

    async findAllUsers(): Promise<User[]> {
        try {
            const query = `SELECT UUID,
                                  USERNAME,
                                  EMAIL                         
                             FROM APPLICATION_USER`;            
            const { rows } = await db.query<User>(query); //Execução da Query
            
            return rows || [];
        } catch (error) {
            throw new DatabaseError('Erro na consulta dos usuários', error);
        };
    };

    async findUserById(uuid: string): Promise<User[]>{
        try {
            const query = `SELECT UUID,
                                  USERNAME,
                                  EMAIL                        
                             FROM APPLICATION_USER
                            WHERE UUID = $1`;
            const params = [uuid];

            const { rows } = await db.query<User>(query, params); //Execução da Query passando os parâmetros
            const [user] = rows;
            
            return [user];
        } catch (error) {
            throw new DatabaseError('Erro na consulta por ID', error);
        };
    };

    async findUsernameAndPassword(username: String, password: String): Promise<User> {
        try {
            const password_crypt = process.env['POSTGRESQL_PASSWORD_CRYPT'] as string;

            const query = `SELECT UUID,
                                  USERNAME,
                                  EMAIL                    
                             FROM APPLICATION_USER
                            WHERE USERNAME = $1
                              AND PASSWORD = crypt($2, $3)`;
            const params = [username, password, password_crypt];

            const { rows } = await db.query<User>(query, params); //Execução da Query passando os parâmetros
            const [user] = rows; //Pegar a primeira linha
            
            return user;
        } catch (error) {
            throw new DatabaseError('Erro na consulta por username e password', error);
        }; 

    };    

    async create(user: User): Promise<string> {
        try {
            const password_crypt = process.env['POSTGRESQL_PASSWORD_CRYPT'] as string;
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
            const params = [user.username, user.password, password_crypt, user.email];

            const { rows } = await db.query<{ uuid: string }>(script, params); //Execução da Query passando os parâmetros
            const [newUser] = rows;
            
            return newUser.uuid;
        } catch (error) {
            throw new DatabaseError('Erro ao Gravar o Usuário', error);
        };
    };

    async update(user: User): Promise<void> {
        try {
            const password_crypt = process.env['POSTGRESQL_PASSWORD_CRYPT'] as string;

            const script = `UPDATE APPLICATION_USER
                               SET USERNAME = $1,
                                   PASSWORD = crypt($2, $3),
                                   EMAIL = $4,
                                   UPDATED_AT = CURRENT_TIMESTAMP
                             WHERE UUID = $5`;
            const params = [user.username, user.password, password_crypt, user.email, user.uuid];

            await db.query(script, params); //Execução da Query passando os parâmetros            
        } catch (error) {
            throw new DatabaseError('Erro ao Alterar o Usuário', error);
        };
    };

    async remove(uuid: string): Promise<void> {
        try {
            const script = `DELETE APPLICATION_USER WHERE UUID = $1`;
            const params = [uuid];

            await db.query(script, params); //Execução da Query passando os parâmetros
        } catch (error) {
            throw new DatabaseError('Erro ao Remover o Usuário', error);
        };
    };


};

export default new UserRepository();