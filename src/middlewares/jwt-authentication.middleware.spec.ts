import StaticStringKeys from '../common/constants';
import ForbiddenError from '../models/errors/forbidden.error.model';
import { validateAuthorizationHeaderJWT } from './jwt-authentication.middleware';

describe('JWT Authentication Middleware', () => {
  it('(validateAuthorizationHeaderJWT) - Should be validate user with a valide authorization', () => {
    const authorizationHeader = 'Basic dGVzdGU6dGVzdGU=';

    try {
      validateAuthorizationHeaderJWT(authorizationHeader);
    } catch (error) {
      expect(error).toBeInstanceOf(ForbiddenError);
      expect(error).toHaveProperty(
        'message',
        StaticStringKeys.INVALID_AUTHENTICATION_TYPE
      );
    }
  });
});
