import config, { IConfig } from 'config';
import * as dotenv from 'dotenv';

dotenv.config();

describe('(env) - Environment Variables', () => {
  it('(PORT) - Should be able load environment variables', () => {
    const configs: IConfig = config.get('App');

    const PORT = Number(configs.get('port'));
    const connectionString = process.env[
      'POSTGRESQL_CONNECTIONSTRING'
    ] as string;
    const expirationTime = configs.get('jwt.refreshTokenExpiresIn') as string;
    const passwordCrypt = process.env[
      configs.get('envs.PostgreSQL.passwordCRYPT') as string
    ] as string;
    const jwtSecretKey = process.env[
      configs.get('envs.JWT.SecretKey') as string
    ] as string;
    const expirationTimeToken = configs.get('jwt.tokenExpiresIn') as string;

    expect(configs.get('port')).toBeDefined();
    expect(PORT).toBeGreaterThan(0);

    expect(
      process.env[configs.get('envs.PostgreSQL.connectionString') as string]
    ).toBeDefined();
    expect(connectionString.length).toBeGreaterThan(0);

    expect(configs.get('jwt.refreshTokenExpiresIn')).toBeDefined();
    expect(expirationTime.length).toBeGreaterThan(0);

    expect(
      process.env[configs.get('envs.PostgreSQL.passwordCRYPT') as string]
    ).toBeDefined();
    expect(passwordCrypt.length).toBeGreaterThan(0);

    expect(
      process.env[configs.get('envs.JWT.SecretKey') as string]
    ).toBeDefined();
    expect(jwtSecretKey.length).toBeGreaterThan(0);

    expect(configs.get('jwt.tokenExpiresIn')).toBeDefined();
    expect(expirationTimeToken.length).toBeGreaterThan(0);
  });
});
