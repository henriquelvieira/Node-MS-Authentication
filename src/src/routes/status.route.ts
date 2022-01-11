import { Router } from "express";
import statusController from "../controllers/status.controller";

const statusRoute = Router();

statusRoute.get('/', statusController.listStatus);

export default statusRoute;