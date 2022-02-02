import { Router } from "express";
import StatusController from "../controllers/status.controller";

const statusRoute = Router();
const statusController = new StatusController();  

statusRoute.get('/', statusController.listStatus);

export default statusRoute;