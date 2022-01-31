import DatabaseError from "../models/errors/database.error.model";
import User from "../models/user.model";
import UserRepository from "../repositories/user.repositorie";


describe("(userController) - Users Controller's", () => {
    
    const username = 'teste_teste';
    
    beforeAll(async () => {
        await UserRepository.removeByUsername(username); //Remover o usuário de teste
    });

    it("(createUser) - Should be able create a new user", async () => {
        const newUser: User = {
            username: username,
            password: username,
            email: `${username}@teste.com.br`
        };        
        const uuid = await UserRepository.create(newUser); 

        expect(uuid).toBeDefined();
    });

    it ("(createUser) - Should not be able to create an existing user", async () =>{
        const newUser: User = {
            username: username,
            password: username,
            email: `${username}@teste.com.br`
        };        
        
        await expect(UserRepository.create(newUser)).rejects.toEqual(
            new DatabaseError('Erro ao Gravar o Usuário')
        );

    });        

    it("(modifiedUser) - Should be able modify a user", async () => {        
        const uuid = await UserRepository.findUserByUsername(username); //Descobrir o UUID do usuário
        const modifiedUser: User = {
            uuid: uuid,
            username: username,
            password: username,
            email: `${username}_new@teste.com.br`
        };
        
        const response: boolean = await UserRepository.update(modifiedUser);

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
        
        await expect(UserRepository.update(modifiedUser)).rejects.toEqual(
            new DatabaseError('Erro ao Alterar o Usuário')
        );
    
    });
    
    it ("(listUserById) - Should be able list a user", async () => {
        const uuid: string = await UserRepository.findUserByUsername(username);

        const user: User = await UserRepository.findUserById(uuid);

        expect(user).toHaveProperty('uuid');
        expect(user).toHaveProperty('username');
        expect(user).toHaveProperty('email');
        expect(user).not.toHaveProperty('password');
        expect(user.username).toBe(username); 
    });

    it ("(listUserById) - Should not be able list a unexisting user", async () => {
        const uuid = 'xxx';

        await expect(UserRepository.findUserById(uuid)).rejects.toEqual(
            new DatabaseError('Erro na consulta por ID')
        );
    });

    it ("(listUsers) - Should be able list users", async () => {
        const users = await UserRepository.findAllUsers(); 
        expect(users.length).toBeGreaterThan(0); //O tamanho do objeto user deve ser mario que 0
    });

    it ("(removeUser) - Should be able remove a user", async () => {
        const uuid = await UserRepository.findUserByUsername(username);
        const response: boolean = await UserRepository.remove(uuid); //Classe p/ realizar o DELETE
        expect(response).toBeTruthy();
    });

    afterAll(async () => {
        //Remover o usuário de teste
        await UserRepository.removeByUsername(username); 
    });


});