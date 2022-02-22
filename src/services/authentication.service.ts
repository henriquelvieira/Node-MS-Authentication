import ForbiddenError from '../models/errors/forbidden.error.model';
import RefreshToken from '../models/refreshToken.model';
import User from '../models/user.model';
import RefreshTokenRepository, {
  IRefreshTokenRepository,
} from '../repositories/refresh-token.repositorie';
import dateutil from '../util/dateutil';
import JWTToken from '../util/jtw-utils';

class AuthenticationService {
  readonly refreshTokenRepository: IRefreshTokenRepository =
    new RefreshTokenRepository();

  public async createToken(user: User): Promise<RefreshToken> {
    const newRefreshToken =
      await this.refreshTokenRepository.generateRefreshToken(user);

    const jwt = await JWTToken.create(user); //Chamada da classe p/ geração do Token

    const response = { token: jwt, refreshToken: newRefreshToken };
    return response;
  }

  public async createRefreshToken(refreshToken: string): Promise<RefreshToken> {
    //Verifica se existe um Refresh Token válido p/ o Usuário
    const userData = await this.refreshTokenRepository.findRefreshTokenByID(
      refreshToken
    );

    //Verifica se o Refresh Token está expirado
    const refreshTokenExpired = dateutil.isAfter(userData.expiresin as number);

    if (refreshTokenExpired) {
      throw new ForbiddenError('Refresh Token Expirado');
    }

    const newRefreshToken =
      await this.refreshTokenRepository.generateRefreshToken(userData); //Geração do novo Refresh Token

    //Geração do novo Token
    const jwt = await JWTToken.create(userData);

    const response = { token: jwt, refreshToken: newRefreshToken };
    return response;
  }
}

export default AuthenticationService;
