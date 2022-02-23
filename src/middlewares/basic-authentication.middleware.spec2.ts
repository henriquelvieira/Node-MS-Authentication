import StaticStringKeys from '../common/constants';
import ForbiddenError from '../models/errors/forbidden.error.model';

describe('basicAuthenticationMiddleware', () => {
  it('(basicAuthenticationMiddleware) ', async () => {
    const authorizationHeader = '';

    //Verificar se o header authorization foi informado na requisição
    if (!authorizationHeader) {
      throw new ForbiddenError(StaticStringKeys.UNKNOWN_CREDENTIAL);
    }
  });
});
