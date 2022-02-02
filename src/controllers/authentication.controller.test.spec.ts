import User from "../models/user.model";
import JWTToken from "../utils/jtw-utils";
import RefreshTokenRepository from "../repositories/refresh-token.repositorie";
import UserRepository from "../repositories/user.repositorie";
import RefreshToken from "../models/refreshToken.model";
import ForbiddenError from "../models/errors/forbidden.error.model";
import DatabaseError from "../models/errors/database.error.model";

describe("(authenticationController) - Authentication Controller's", () => {

    const username = 'teste';
    let uuid: string;
    let newRefreshToken: string;
    const refreshTokenRepository = new RefreshTokenRepository(); 

    beforeAll(async () => {
        uuid = await UserRepository.findUserByUsername(username); //Remover o usuário de teste
    });

    it("(createToken) - Should be able generate a new token", async () => {
        const user: User = {"uuid": uuid, "username": username};
        const token = await JWTToken.create(user); 
        newRefreshToken = await refreshTokenRepository.generateRefreshToken(user);

        expect(token.length).toBeGreaterThan(0);
        expect(JWTToken.validate(token)).toHaveProperty("sub");
        expect(JWTToken.validate(token)).toHaveProperty("username");

        expect(newRefreshToken.length).toBeGreaterThan(0);
    });

    it("(createRefreshToken) - Should be able generate a new token with a valide refresh token", async () => {
        
        const refreshTokenRequest: RefreshToken = {"refresh_token": newRefreshToken};
        
        const refreshTokenUserData = await refreshTokenRepository.findRefreshTokenByID(refreshTokenRequest.refresh_token);
        
        const userData: User = {
            uuid: refreshTokenUserData.uuid, 
            username: refreshTokenUserData.username as string
        };

        //Geração do novo Token
        const jwt = await JWTToken.create(userData); 

        expect(JWTToken.validate(jwt)).toHaveProperty("sub");
        expect(JWTToken.validate(jwt)).toHaveProperty("username");
    });

    it("(createToken) - Should not be able generate a new token", async () => {
        const user: User = {"uuid": uuid, "username": ""};

        await expect(JWTToken.create(user)).rejects.toEqual(
            new ForbiddenError('Falha ao gerar o Token!')
        );

    });

    it("(createRefreshToken) - Should not be able generate a new token with a invalide refresh token", async () => {
        
        const refreshTokenRequest: RefreshToken = {"refresh_token": "123456abcd"};    

        await expect(refreshTokenRepository.findRefreshTokenByID(refreshTokenRequest.refresh_token)).rejects.toEqual(
            new DatabaseError('Erro na consulta do Refresh Token')
        );

    });



});