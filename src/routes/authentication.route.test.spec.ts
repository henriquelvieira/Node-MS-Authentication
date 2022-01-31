import request from 'supertest';
import UserRepository from '../repositories/user.repositorie';
import SetupServer from '../server';
import config from 'config';

//Testes de Integração
describe("(/authenticationRoute) - Authentication Route's", () => {

    const username = 'teste';
    const password = 'teste';
    let refresh_token: string;
    let token: string;
    let app: any;

    beforeAll(async () => {
        const server = new SetupServer(config.get('App.port'));
        await server.init();
        app = server.getApp();        
        
        //Desbloquear o usuário
        await UserRepository.updateSuccessLogin(username); 
    });
    
    it("(POST /authentication/token) - Should be able generate a new Token", async () => {
        
        const passwordBase64 = Buffer.from(`${username}:${password}`).toString('base64'); //Converter a senha para base64

        const response = await request(app)
        .post('/authentication/token')
        .set('Content-Type', 'application/json') 
        .set('authorization', `Basic ${passwordBase64}`).send();

        refresh_token = response.body.refresh_token as string;

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");    
        expect(response.body).toHaveProperty("refresh_token");  
    });

    it("(POST /authentication/refresh-token) - Should be able generate a new Refresh Token", async () => {

        const requestBody = {"refresh_token": refresh_token};

        const response = await request(app)
        .post('/authentication/refresh-token')
        .set('Content-Type', 'application/json') 
        .send(requestBody);

        token = response.body.token as string;
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("token");    
    });

    it("(POST /authentication/token/validade) - Should be able validade a valide Token", async () => {

        const response = await request(app)
        .post('/authentication/token/validade')
        .set('Content-Type', 'application/json') 
        .set('authorization', `Bearer ${token}`) 
        .send();

        expect(response.status).toBe(200);
    });

    it("(POST /authentication/token) - Should not be able generate a new Token", async () => {
        
        const passwordBase64 = Buffer.from(`dhjahdjashjdash:${password}`).toString('base64'); //Converter a senha para base64

        const response = await request(app)
        .post('/authentication/token')
        .set('Content-Type', 'application/json') 
        .set('authorization', `Basic ${passwordBase64}`).send();

        refresh_token = response.body.refresh_token as string;

        expect(response.status).toBe(403);
        expect(response.body).not.toHaveProperty("token");    
        expect(response.body).not.toHaveProperty("refresh_token");  
    });        

    it("(POST /authentication/refresh-token) - Should not be able generate a new Refresh Token", async () => {

        const requestBody = {"refresh_token": refresh_token+'1'}; //Refresh Token modificado

        const response = await request(app)
        .post('/authentication/refresh-token')
        .set('Content-Type', 'application/json') 
        .send(requestBody);

        token = response.body.token as string;
        expect(response.status).toBe(400);
        expect(response.body).not.toHaveProperty("token");    
    });

    it("(POST /authentication/token/validade) - Should not be able validade a invalide Token", async () => {

        const response = await request(app)
        .post('/authentication/token/validade')
        .set('Content-Type', 'application/json') 
        .set('authorization', `Bearer ${token+'1'}`) 
        .send();

        expect(response.status).toBe(403);
    });

    it("(POST /authentication/token) - Should be able lock a user", async () => {
        
        const passwordBase64 = Buffer.from(`${username}:${password}1213245`).toString('base64'); //Converter a senha para base64

        //Realizar três tentativas de acesso com a senha incorreta
        for (let i = 0; i <= 2 ; i++) {
            const response = await request(app)
            .post('/authentication/token')
            .set('Content-Type', 'application/json') 
            .set('authorization', `Basic ${passwordBase64}`).send();
            
            expect(response.status).toBe(403);
            expect(response.body).not.toHaveProperty("token");    
            expect(response.body).not.toHaveProperty("refresh_token"); 
         }

         //Realizar a quarta tentativa com a senha incorreta
         const responseFinal = await request(app)
         .post('/authentication/token')
         .set('Content-Type', 'application/json') 
         .set('authorization', `Basic ${passwordBase64}`).send();
         
         expect(responseFinal.status).toBe(403);
         expect(responseFinal.body.errorMessage).toBe('Usuário bloqueado');
         expect(responseFinal.body).not.toHaveProperty("token");    
         expect(responseFinal.body).not.toHaveProperty("refresh_token"); 

    });

    afterAll(async () => {
        //Desbloquear o usuário
        await UserRepository.updateSuccessLogin(username); 
    });

});