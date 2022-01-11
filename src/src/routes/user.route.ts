import { Router } from "express";
import jwtAuthenticationMiddleware from "../middlewares/jwt-authentication.middleware";
import userController from "../controllers/user.controller";

const usersRoute = Router();

usersRoute.get('/', jwtAuthenticationMiddleware, userController.listUsers);

usersRoute.get('/:uuid', jwtAuthenticationMiddleware, userController.listUserById);

usersRoute.post('/', userController.createUser);

usersRoute.put('/:uuid', jwtAuthenticationMiddleware, userController.modifiedUser);

usersRoute.delete('/:uuid', jwtAuthenticationMiddleware, userController.removeUser);

export default usersRoute;