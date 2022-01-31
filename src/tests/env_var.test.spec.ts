import * as dotenv from "dotenv";
import config from 'config';


dotenv.config();

describe("(env) - Environment Variables", () => {

    it("(PORT) - Should be able load environment variables", () => {
        const PORT = Number(config.get('App.port'));
        const connectionString = process.env['POSTGRESQL_CONNECTIONSTRING'] as string;
        const expirationTime = config.get('App.jwt.refreshTokenExpiresIn') as string;
        const password_crypt = process.env[config.get('App.envs.PostgreSQL.passwordCRYPT') as string] as string;
        const jwt_secret_key = process.env[config.get('App.envs.JWT.SecretKey') as string] as string;  
        const expirationTimeToken = config.get('App.jwt.tokenExpiresIn') as string;
        
        expect(config.get('App.port')).toBeDefined();
        expect(PORT).toBeGreaterThan(0);

        expect(process.env[config.get('App.envs.PostgreSQL.connectionString') as string]).toBeDefined();
        expect(connectionString.length).toBeGreaterThan(0);

        expect(config.get('App.jwt.refreshTokenExpiresIn')).toBeDefined();
        expect(expirationTime.length).toBeGreaterThan(0);

        expect(process.env[config.get('App.envs.PostgreSQL.passwordCRYPT') as string]).toBeDefined();
        expect(password_crypt.length).toBeGreaterThan(0);

        expect(process.env[config.get('App.envs.JWT.SecretKey') as string]).toBeDefined();
        expect(jwt_secret_key.length).toBeGreaterThan(0);

        expect(config.get('App.jwt.tokenExpiresIn')).toBeDefined();
        expect(expirationTimeToken.length).toBeGreaterThan(0);

    });


});

