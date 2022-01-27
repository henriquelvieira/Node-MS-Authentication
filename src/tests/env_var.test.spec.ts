import * as dotenv from "dotenv";
import config from 'config';

dotenv.config();

describe("(env) - Environment Variables", () => {

    it("(PORT) - Should be able load environment variables", () => {
        const PORT = Number(config.get('App.port'));
        const connectionString = process.env['POSTGRESQL_CONNECTIONSTRING'] as string;
        const expirationTime = config.get('App.jwt.refreshTokenExpiresIn') as string;
        const password_crypt = process.env['POSTGRESQL_PASSWORD_CRYPT'] as string;
        const jwt_secret_key = process.env['JWT_SECRET_KEY'] as string;  
        const expirationTimeToken = config.get('App.jwt.tokenExpiresIn') as string;
        
        expect(config.get('App.port')).toBeDefined();
        expect(PORT).toBeGreaterThan(0);

        expect(process.env['POSTGRESQL_CONNECTIONSTRING']).toBeDefined();
        expect(connectionString.length).toBeGreaterThan(0);

        expect(config.get('App.jwt.refreshTokenExpiresIn')).toBeDefined();
        expect(expirationTime.length).toBeGreaterThan(0);

        expect(process.env['POSTGRESQL_PASSWORD_CRYPT']).toBeDefined();
        expect(password_crypt.length).toBeGreaterThan(0);

        expect(process.env['JWT_SECRET_KEY']).toBeDefined();
        expect(jwt_secret_key.length).toBeGreaterThan(0);

        expect(config.get('App.jwt.tokenExpiresIn')).toBeDefined();
        expect(expirationTimeToken.length).toBeGreaterThan(0);

    });


});

