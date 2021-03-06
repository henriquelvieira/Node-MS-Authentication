import express from 'express';
import request from 'supertest';

import User from '../models/user.model';
import UserRepository, {
  IUserRepository,
} from '../repositories/user.repositorie';
import SetupServer from '../server';
import Configs from '../util/configs';
import Env from '../util/env';
import JWTToken from '../util/jtw-utils';

//Testes de Integração
describe("(/users) - Users Route's", () => {
  const newUsername = 'teste_route';
  let newUuid: string;
  const valideUsername = 'teste';
  let valideUuid: string;
  let token: string;
  let app: express.Express;
  let server: SetupServer;
  let userRepository: IUserRepository;

  beforeAll(async () => {
    const configs = Configs.get('App');
    const port = Number(Env.get(configs.get('envs.APP.Port')));
    server = new SetupServer(port);
    await server.init();
    app = server.getApp();

    userRepository = new UserRepository();

    await userRepository.removeByUsername(newUsername); //Remover o usuário criando pelo teste

    //Gerar um Token valido p/ os testes
    valideUuid = await userRepository.findUserByUsername(valideUsername);
    const userValide: User = { uuid: valideUuid, username: valideUsername };
    token = await JWTToken.create(userValide);
  });

  it('(POST /users) - Should be able create a new User', async () => {
    const requestBody = {
      username: newUsername,
      password: '123456',
      email: `${newUsername}@email.com`,
    };

    const response = await request(app)
      .post('/users')
      .set('Content-Type', 'application/json')
      .send(requestBody);

    newUuid = response.body.uuid as string;

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('uuid');
  });

  it('(PUT /users) - Should be able modify a valide user', async () => {
    const userValide: User = { uuid: newUuid, username: newUsername };
    const newToken = await JWTToken.create(userValide);

    const requestBody = {
      username: newUsername,
      password: '123456',
      email: `${newUsername}_new@email.com`,
    };

    const response = await request(app)
      .put(`/users/${newUuid}`)
      .set('Content-Type', 'application/json')
      .set('authorization', `Bearer ${newToken}`)
      .send(requestBody);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('uuid');
    expect(response.body).toHaveProperty('username');
    expect(response.body).toHaveProperty('email');
  });

  it('(GET /users) - Should be able list users', async () => {
    const response = await request(app)
      .get(`/users`)
      .set('Content-Type', 'application/json')
      .set('authorization', `Bearer ${token}`)
      .send();

    const users: [] = response.body.users;
    expect(response.status).toBe(200);
    expect(users.length).toBeGreaterThan(0);
  });

  it('(GET /users/UUID) - Should be able list user by uuid', async () => {
    const response = await request(app)
      .get(`/users/${newUuid}`)
      .set('Content-Type', 'application/json')
      .set('authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('uuid');
    expect(response.body).toHaveProperty('username');
    expect(response.body).toHaveProperty('email');
    expect(response.body).not.toHaveProperty('password');
  });

  it('(POST /users/forgot-password) - Should be able recover the password', async () => {
    const requestBody = {
      username: newUsername,
    };

    const response = await request(app)
      .post(`/users/forgot-password`)
      .set('Content-Type', 'application/json')
      .send(requestBody);

    const securityCode = await userRepository.findSecurityCode(newUsername);
    expect(response.status).toBe(200);
    expect(securityCode.length).toBeGreaterThan(0);
  });

  it('(POST /users/reset-password) - Should be able reset the password', async () => {
    const securityCode = await userRepository.findSecurityCode(newUsername);

    const requestBody = {
      securityCode: securityCode,
      newPassword: 'teste1',
    };

    const response = await request(app)
      .post(`/users/reset-password`)
      .set('Content-Type', 'application/json')
      .send(requestBody);

    expect(response.status).toBe(200);
  });

  it('(DELETE /users/UUID) - Should be able remover a user by uuid', async () => {
    const response = await request(app)
      .delete(`/users/${newUuid}`)
      .set('Content-Type', 'application/json')
      .set('authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);
  });

  it('(POST /users) - Should not be able create a new User (User alredy exists)', async () => {
    const requestBody = {
      username: valideUsername,
      password: '123456',
      email: `${newUsername}@email.com`,
    };

    const response = await request(app)
      .post('/users')
      .set('Content-Type', 'application/json')
      .send(requestBody);

    newUuid = response.body.uuid as string;

    expect(response.status).toBe(400);
    expect(response.body).not.toHaveProperty('uuid');
  });

  it('(PUT /users) - Should not be able modify a invalide user', async () => {
    const requestBody = {
      username: newUsername + 'mgdhasgdjaghd',
      password: '123456',
      email: `${newUsername}_new@email.com`,
    };

    const response = await request(app)
      .put(`/users/${newUuid}`)
      .set('Content-Type', 'application/json')
      .set('authorization', `Bearer ${token}`)
      .send(requestBody);

    expect(response.status).toBe(403);
    expect(response.body).not.toHaveProperty('uuid');
    expect(response.body).not.toHaveProperty('username');
    expect(response.body).not.toHaveProperty('email');
  });

  it('(GET /users) - Should not be able list users without token', async () => {
    const response = await request(app)
      .get(`/users`)
      .set('Content-Type', 'application/json')
      .send();

    expect(response.status).toBe(403);
    expect(response.body).not.toHaveProperty('users');
  });

  it('(GET /users/UUID) - Should not be able list a invalide user', async () => {
    const response = await request(app)
      .get(`/users/${newUuid + 'dhadhgahdga'}`)
      .set('Content-Type', 'application/json')
      .set('authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(400);
    expect(response.body).not.toHaveProperty('uuid');
    expect(response.body).not.toHaveProperty('username');
    expect(response.body).not.toHaveProperty('email');
    expect(response.body).not.toHaveProperty('password');
  });

  it('(DELETE /users/UUID) - Should not be able remover a user by uuid without token', async () => {
    const response = await request(app)
      .delete(`/users/${newUuid}`)
      .set('Content-Type', 'application/json')
      .send();

    expect(response.status).toBe(403);
  });

  it('(POST /users/forgot-password) - Should not be able recover the password with a invalide user', async () => {
    const requestBody = {
      username: newUsername + '123',
    };

    const response = await request(app)
      .post(`/users/forgot-password`)
      .set('Content-Type', 'application/json')
      .send(requestBody);

    const securityCode = await userRepository.findSecurityCode(
      newUsername + '123'
    );
    expect(response.status).toBe(200);

    expect(securityCode.length).toEqual(0);
  });

  it('(POST /users/reset-password) - Should not be able reset the password with a invalide Security Code', async () => {
    const securityCode = 'abcdev';

    const requestBody = {
      securityCode: securityCode,
      newPassword: 'teste1',
    };

    const response = await request(app)
      .post(`/users/reset-password`)
      .set('Content-Type', 'application/json')
      .send(requestBody);

    expect(response.status).toBe(403);
  });

  afterAll(async () => {
    await userRepository.removeByUsername(newUsername); //Remover o usuário criando pelo teste
    server.close();
  });
});
