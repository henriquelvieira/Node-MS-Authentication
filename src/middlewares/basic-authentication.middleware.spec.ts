import StaticStringKeys from '../common/constants';
import ForbiddenError from '../models/errors/forbidden.error.model';
import { validateAuthorizationHeader } from './basic-authentication.middleware';

describe('basicAuthenticationMiddleware', () => {
  it('(validateAuthorizationHeader) - Should be validate user with a valide authorization', () => {
    const authorizationHeader = 'Basic dGVzdGU6dGVzdGU=';
    const authorizationData = validateAuthorizationHeader(authorizationHeader);
    expect(authorizationData).toHaveProperty('password');
    expect(authorizationData).toHaveProperty('username');
  });

  it('(validateAuthorizationHeader) - Should not be validate withot Authorization Header ', () => {
    const authorizationHeader = '';

    try {
      validateAuthorizationHeader(authorizationHeader);
    } catch (error) {
      expect(error).toBeInstanceOf(ForbiddenError);
      expect(error).toHaveProperty(
        'message',
        StaticStringKeys.UNKNOWN_CREDENTIAL
      );
    }
  });

  it('(validateAuthorizationHeader) - Should not be validate withot username and password', () => {
    const authorizationHeader = 'dGVzdGU6dGVzdGU=';

    try {
      validateAuthorizationHeader(authorizationHeader);
    } catch (error) {
      expect(error).toBeInstanceOf(ForbiddenError);
      expect(error).toHaveProperty(
        'message',
        StaticStringKeys.INVALID_AUTHENTICATION_TYPE
      );
    }
  });

  it('(validateAuthorizationHeader) - Should not be validate withot username and password', () => {
    const authorizationHeader = 'Basic ';

    try {
      validateAuthorizationHeader(authorizationHeader);
    } catch (error) {
      expect(error).toBeInstanceOf(ForbiddenError);
      expect(error).toHaveProperty(
        'message',
        StaticStringKeys.UNKNOWN_USERNAME_OR_PASSWORD
      );
    }
  });
});
