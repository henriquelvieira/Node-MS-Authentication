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
            const [user] = rows;
            return [user];
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
                                                            crypt($2, 'my_salt')
                                                          )
                                                          RETURNING uuid`;
            const values = [user.username, user.password];

            const { rows } = await db.query<{ uuid: string }>(script, values);
            const [newUser] = rows;
            return newUser.uuid;
        } catch (error) {
            throw new DatabaseError('Erro na consulta por ID', error);
        };
   };

    async update(user: User): Promise<void> {
        try {
            const script  = `UPDATE APPLICATION_USER
                                SET USERNAME = $1
                                    PASSWORD = crypt($2, 'my_salt')
                            WHERE UUID = $3`;
            const values = [user.username, user.password, user.uuid];

            await db.query(script, values);            
        } catch (error) {
            throw new DatabaseError('Erro na consulta por ID', error);
        };
   };

   async delete(uuid: string): Promise<void> {
        try {
            const script  = `DELETE APPLICATION_USER WHERE UUID = $1`;
            const values = [uuid];

            await db.query(script, values);            
        } catch (error) {
            throw new DatabaseError('Erro na consulta por ID', error);
        };
   };   


};

export default new UserRepository();