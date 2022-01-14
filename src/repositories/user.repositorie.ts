import db from '../database/db';
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
        }
    }

    async findUserById(uuid: string): Promise<User>{
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
            throw new DatabaseError('Erro na consulta por ID', error);
        }
    }

    async findUserByUsername(username: string): Promise<string>{
        try {
            const query = `SELECT UUID                    
                             FROM APPLICATION_USER
                            WHERE USERNAME = $1`;
            const params = [username];

            const { rows } = await db.query<{ uuid: string }>(query, params); //Execução da Query passando os parâmetros
            const [uuid]= rows;
            
            return uuid.uuid;
        } catch (error) {
            throw new DatabaseError('Erro na consulta por Username', error);
        }
    }

    async findUserLocked(username: string): Promise<boolean> {
        try {
            const query = `SELECT COUNT(*)                    
                             FROM APPLICATION_USER
                            WHERE USERNAME = $1
                              AND LOCKED_AT IS NOT NULL`;
            const params = [username];

            const { rows } = await db.query<{ count: number }>(query, params); //Execução da Query passando os parâmetros
            const [response]= rows;
            
            if (response.count > 0){
                return true
            } else {
                return false
            }

        } catch (error) {
            throw new DatabaseError('Erro na consulta por Username', error);
        }
    }


    async findUsernameAndPassword(username: string, password: string): Promise<User> {
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
        } 

    }    

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
        }
    }

    async update(user: User): Promise<boolean> {
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
        }

        return true;
    }

    async remove(uuid: string): Promise<boolean> {
        try {
            const script = `DELETE FROM "public"."application_user" WHERE uuid = $1`;
            const params = [uuid];

            await db.query(script, params); //Execução da Query passando os parâmetros
            return true;
        } catch (error) {
            throw new DatabaseError('Erro ao Remover o Usuário', error);
        }
    }

    async removeByUsername(username: string): Promise<void> {
        try {
            const script = `DELETE FROM "public"."application_user" WHERE username = $1`;
            const params = [username];

            await db.query(script, params); //Execução da Query passando os parâmetros
        } catch (error) {
            throw new DatabaseError('Erro ao Remover o Usuário', error);
        }
    }

    async updateFailedAttempt(username: string): Promise<void> {
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
            throw new DatabaseError('Erro ao Registrar a falha de login', error);
        }
    }

    async updateSuccessLogin (username: string): Promise<void> {
        try {
            const script = `UPDATE "public"."application_user" 
                                SET FAILED_ATTEMP = 0,
                                    LOCKED_AT     = NULL,
                                    LAST_LOGIN_AT = CURRENT_TIMESTAMP
                              WHERE USERNAME  = $1`;
            const params = [username];

            await db.query(script, params); //Execução da Query passando os parâmetros
        } catch (error) {
            throw new DatabaseError('Erro ao Registrar a falha de login', error);
        }
    }

}

export default new UserRepository();