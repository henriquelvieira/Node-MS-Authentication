import DatabaseError from "../models/errors/database.error.model";
import User from "../models/user.model";
import userRepositorie from "../repositories/user.repositorie";


describe("(userController) - Users Controller's", () => {
    
    const username = 'teste_teste';
    
    beforeAll(async () => {
        await userRepositorie.removeByUsername(username); //Remover o usuário de teste
    });

    it("(createUser) - Should be able create a new user", async () => {
        const newUser: User = {
            username: username,
            password: username,
            email: `${username}@teste.com.br`
        };        
        const uuid = await userRepositorie.create(newUser); 

        expect(uuid).toBeDefined();
    });

    it ("(createUser) - Should not be able to create an existing user", async () =>{
        const newUser: User = {
            username: username,
            password: username,
            email: `${username}@teste.com.br`
        };        
        
        await expect(userRepositorie.create(newUser)).rejects.toEqual(
            new DatabaseError('Erro ao Gravar o Usuário')
        );

    });        

    it("(modifiedUser) - Should be able modify a user", async () => {        
        const uuid = await userRepositorie.findUserByUsername(username); //Descobrir o UUID do usuário
        const modifiedUser: User = {
            uuid: uuid,
            username: username,
            password: username,
            email: `${username}_new@teste.com.br`
        };
        
        const response: Boolean = await userRepositorie.update(modifiedUser);

        expect(response).toBeTruthy();
    });

    it("(modifiedUser) - Should not be able modify a unexisting user", async () => {  
        const uuid = '123'; //UUID de usuário incorreto
        const modifiedUser: User = {
            uuid: uuid,
            username: username,
            password: username,
            email: `${username}_new@teste.com.br`
        };
        
        await expect(userRepositorie.update(modifiedUser)).rejects.toEqual(
            new DatabaseError('Erro ao Alterar o Usuário')
        );
    
    });
    
    it ("(listUserById) - Should be able list a user", async () => {
        const uuid: string = await userRepositorie.findUserByUsername(username);

        const user: User = await userRepositorie.findUserById(uuid);

        expect(user).toHaveProperty('uuid');
        expect(user.username).toBe(username); 
    });

    it ("(listUserById) - Should not be able list a unexisting user", async () => {
        const uuid: string = 'xxx';

        await expect(userRepositorie.findUserById(uuid)).rejects.toEqual(
            new DatabaseError('Erro na consulta por ID')
        );
    });

    it ("(listUsers) - Should be able list users", async () => {
        const users = await userRepositorie.findAllUsers(); 
        expect(users.length).toBeGreaterThan(0); //O tamanho do objeto user deve ser mario que 0
    });

    it ("(removeUser) - Should be able remove a user", async () => {
        const uuid = await userRepositorie.findUserByUsername(username);
        const response: Boolean = await userRepositorie.remove(uuid); //Classe p/ realizar o DELETE
        expect(response).toBeTruthy();
    });

    // afterAll(async () => {
    //     //Remover o usuário de teste
    //     await userRepositorie.removeByUsername(username); 
    // });


});