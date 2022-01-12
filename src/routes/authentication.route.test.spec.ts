import { app } from '../app';
import request from 'supertest';

//Testes de Integração
describe("(authenticationRoute) - Authentication Route's", () => {
    
    it("(/token) - Should be able create a new user", async () => {
        
        const passwordBase64 = Buffer.from("teste:teste").toString('base64');

        const response = await request(app)
        .post('/authentication/token')
        .set('Content-Type',  'application/json') 
        .set('authorization', `Basic ${passwordBase64}`).send();

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");    
        expect(response.body).toHaveProperty("refresh_token");  

    });


});