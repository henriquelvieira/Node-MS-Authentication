import { app } from '../app';
import request from 'supertest';

//Testes de Integração
describe("(authenticationRoute) - Authentication Route's", () => {
    
    it("(/token) - Should be able create a new user", async () => {
        
        //TO DO: CONVERTER A SENHA TESTE PARA BASE64
        
        const response = await request(app)
        .post('/authentication/token')
        .set('Content-Type',  'application/json') 
        .set('authorization', 'Basic dGVzdGU6dGVzdGU=').send();

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");    
        expect(response.body).toHaveProperty("refresh_token");  

    });


});