import { Router } from 'express';

import UserController from '../controllers/user.controller';
import jwtAuthenticationMiddleware from '../middlewares/jwt-authentication.middleware';

const usersRoute = Router();
const userController = new UserController();

usersRoute.get('/', jwtAuthenticationMiddleware, userController.listUsers);

usersRoute.get(
  '/:uuid',
  jwtAuthenticationMiddleware,
  userController.listUserById
);

usersRoute.post('/', userController.createUser);

usersRoute.put(
  '/:uuid',
  jwtAuthenticationMiddleware,
  userController.modifiedUser
);

usersRoute.delete(
  '/:uuid',
  jwtAuthenticationMiddleware,
  userController.removeUser
);

usersRoute.post('/forgot-password', userController.forgotPassword);

usersRoute.post('/reset-password', userController.resetPassword);

export default usersRoute;
