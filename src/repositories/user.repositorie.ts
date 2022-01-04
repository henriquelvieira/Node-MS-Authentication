import db from '../db';
import User from '../models/user.model';
import DatabaseError from '../models/errors/database.error.model';

class UserRepository {
    
    async findAllUsers(): Promise<User[]> {
        const query = `SELECT UUID,
                              USERNAME                         
                         FROM APPLICATION_USER`;
        
        const { rows } = await db.query<User>(query);
        return rows || [];
    };

    async findUserById(uuid: string): Promise<User[]>{
        try {
            const query = `SELECT UUID,
                                USERNAME                         
                            FROM APPLICATION_USER
                            WHERE UUID = $1`;
            const values = [uuid];

            const { rows } = await db.query<User>(query, values);
            const user = rows;
            return rows;
        } catch (error) {
            throw new DatabaseError('Erro na consulta por ID', error);
        };
    };

    async create(user: User): Promise<string> {
        try {
            const script  = `INSERT INTO APPLICATION_USER (
                                                            USERNAME, 
                                                            PASSWORD
                                                          ) 
                                                   VALUES (
                                                            $1,
                                                            crypt($2, ' ')
                                                          )
                           RETURNING UUID`;
            const values = [user.username, user.password];

            const { rows } = await db.query<{ uuid: string }>(script, values);
            const [newUser] = rows;
            return newUser.uuid;

        } catch (error) {
            throw new DatabaseError('Erro na consulta por ID', error);
        };
   };

};

export default new UserRepository();