require('dotenv').config();


describe("(env) - Environment Variables", () => {

    it("(PORT) - Should be able load environment variables", () => {
        const PORT = Number(process.env['PORT']);
        const connectionString = process.env['POSTGRESQL_CONNECTIONSTRING'] as string;
        const expirationTime = process.env['REFRESH_TOKEN_EXPIRATION_TIME'] as string;
        const password_crypt = process.env['POSTGRESQL_PASSWORD_CRYPT'] as string;
        const jwt_secret_key = process.env['JWT_SECRET_KEY'] as string;  
        const expirationTimeToken = process.env['JWT_EXPIRATION_TIME_TOKEN'] as string;
        
        expect(process.env['PORT']).toBeDefined();
        expect(PORT).toBeGreaterThan(0);

        expect(process.env['POSTGRESQL_CONNECTIONSTRING']).toBeDefined();
        expect(connectionString.length).toBeGreaterThan(0);

        expect(process.env['REFRESH_TOKEN_EXPIRATION_TIME']).toBeDefined();
        expect(expirationTime.length).toBeGreaterThan(0);

        expect(process.env['POSTGRESQL_PASSWORD_CRYPT']).toBeDefined();
        expect(password_crypt.length).toBeGreaterThan(0);

        expect(process.env['JWT_SECRET_KEY']).toBeDefined();
        expect(jwt_secret_key.length).toBeGreaterThan(0);

        expect(process.env['JWT_EXPIRATION_TIME_TOKEN']).toBeDefined();
        expect(expirationTimeToken.length).toBeGreaterThan(0);

    });


});
