import Configs from '../util/configs';
import Env from '../util/env';

describe('(env) - Environment Variables', () => {
  it('(PORT) - Should be able load environment variables', () => {
    const configs = Configs.get('App');
    const PORT = Number(Env.get(configs.get('envs.APP.Port')));

    const connectionString = Env.get(
      configs.get('envs.PostgreSQL.connectionString')
    ) as string;

    const expirationTime = configs.get('jwt.refreshTokenExpiresIn') as string;
    const passwordCrypt = Env.get(
      configs.get('envs.PostgreSQL.passwordCRYPT') as string
    ) as string;
    const jwtSecretKey = Env.get(
      configs.get('envs.JWT.SecretKey') as string
    ) as string;
    const expirationTimeToken = configs.get('jwt.tokenExpiresIn') as string;

    expect(configs.get('envs.APP.Port')).toBeDefined();
    expect(PORT).toBeGreaterThan(0);

    expect(
      Env.get(configs.get('envs.PostgreSQL.connectionString') as string)
    ).toBeDefined();
    expect(connectionString.length).toBeGreaterThan(0);

    expect(configs.get('jwt.refreshTokenExpiresIn')).toBeDefined();
    expect(expirationTime.length).toBeGreaterThan(0);

    expect(
      Env.get(configs.get('envs.PostgreSQL.passwordCRYPT') as string)
    ).toBeDefined();
    expect(passwordCrypt.length).toBeGreaterThan(0);

    expect(Env.get(configs.get('envs.JWT.SecretKey') as string)).toBeDefined();
    expect(jwtSecretKey.length).toBeGreaterThan(0);

    expect(configs.get('jwt.tokenExpiresIn')).toBeDefined();
    expect(expirationTimeToken.length).toBeGreaterThan(0);
  });
});
