import { app } from '../app';
import request from 'supertest';
import userRepositorie from '../repositories/user.repositorie';
import JWTToken from "../utils/jtw-utils";
import User from '../models/user.model';

//Testes de Integração
describe("(/users) - Users Route's", () => {

    const newUsername = 'teste_route';
    let newUuid: string;
    const valideUsername = 'teste';
    let valideUuid: string;
    let token: string;

    beforeAll(async () => {
        await userRepositorie.removeByUsername(newUsername); //Remover o usuário criando pelo teste

        //Gerar um Token valido p/ os testes
        valideUuid = await userRepositorie.findUserByUsername(valideUsername);
        const userValide: User = {"uuid": valideUuid, "username": valideUsername};
        token = await JWTToken.create(userValide);

    });

    it("(POST /users) - Should be able create a new User", async () => {
        
        const requestBody = {
            "username": newUsername,
            "password": "123456",
            "email": `${newUsername}@email.com`
        };

        const response = await request(app)
        .post('/users')
        .set('Content-Type', 'application/json') 
        .send(requestBody);
        
        newUuid = response.body.uuid as string;

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("uuid");    
    });

    it("(PUT /users) - Should be able modify a valide user", async () => {
        
        const requestBody = {
            "username": newUsername,
            "password": "123456",
            "email": `${newUsername}_new@email.com`
        };

        const response = await request(app)
        .put(`/users/${newUuid}`)
        .set('Content-Type', 'application/json') 
        .set('authorization', `Bearer ${token}`) 
        .send(requestBody);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("uuid");
        expect(response.body).toHaveProperty("username");  
        expect(response.body).toHaveProperty("email");      
    });

    it("(GET /users) - Should be able list users", async () => {
        const response = await request(app)
        .get(`/users`)
        .set('Content-Type', 'application/json') 
        .set('authorization', `Bearer ${token}`) 
        .send();

        const users: [] = response.body.users;
        expect(response.status).toBe(200);
        expect(users.length).toBeGreaterThan(0);
    });

    it("(GET /users/UUID) - Should be able list user by uuid", async () => {
        const response = await request(app)
        .get(`/users/${newUuid}`)
        .set('Content-Type', 'application/json') 
        .set('authorization', `Bearer ${token}`) 
        .send();

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('uuid');
        expect(response.body).toHaveProperty('username');
        expect(response.body).toHaveProperty('email');
        expect(response.body).not.toHaveProperty('password');
    });    

    it("(DELETE /users/UUID) - Should be able remover a user by uuid", async () => {
        const response = await request(app)
        .delete(`/users/${newUuid}`)
        .set('Content-Type', 'application/json') 
        .set('authorization', `Bearer ${token}`) 
        .send();

        expect(response.status).toBe(200);
    });  

    it("(POST /users) - Should not be able create a new User (User alredy exists)", async () => {
        
        const requestBody = {
            "username": valideUsername,
            "password": "123456",
            "email": `${newUsername}@email.com`
        };

        const response = await request(app)
        .post('/users')
        .set('Content-Type', 'application/json') 
        .send(requestBody);
        
        newUuid = response.body.uuid as string;

        expect(response.status).toBe(400);
        expect(response.body).not.toHaveProperty("uuid");    
    });
    
    it("(PUT /users) - Should not be able modify a invalide user", async () => {
        
        const requestBody = {
            "username": newUsername+'mgdhasgdjaghd',
            "password": "123456",
            "email": `${newUsername}_new@email.com`
        };

        const response = await request(app)
        .put(`/users/${newUuid}`)
        .set('Content-Type', 'application/json') 
        .set('authorization', `Bearer ${token}`) 
        .send(requestBody);

        expect(response.status).toBe(400);
        expect(response.body).not.toHaveProperty("uuid");
        expect(response.body).not.toHaveProperty("username");  
        expect(response.body).not.toHaveProperty("email");      
    });

    it("(GET /users) - Should not be able list users without token", async () => {
        const response = await request(app)
        .get(`/users`)
        .set('Content-Type', 'application/json') 
        .send();

        expect(response.status).toBe(403);
        expect(response.body).not.toHaveProperty('users');
    });

    it("(GET /users/UUID) - Should not be able list a invalide user", async () => {
        const response = await request(app)
        .get(`/users/${newUuid+"dhadhgahdga"}`)
        .set('Content-Type', 'application/json') 
        .set('authorization', `Bearer ${token}`) 
        .send();

        expect(response.status).toBe(400);
        expect(response.body).not.toHaveProperty('uuid');
        expect(response.body).not.toHaveProperty('username');
        expect(response.body).not.toHaveProperty('email');
        expect(response.body).not.toHaveProperty('password');
    });   

    it("(DELETE /users/UUID) - Should not be able remover a user by uuid without token", async () => {
        const response = await request(app)
        .delete(`/users/${newUuid}`)
        .set('Content-Type', 'application/json') 
        .send();

        expect(response.status).toBe(403);
    });  

    afterAll(async () => {
        await userRepositorie.removeByUsername(newUsername); //Remover o usuário criando pelo teste
    });

});