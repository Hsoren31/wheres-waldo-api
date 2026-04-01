import { Router } from "express";
import * as controller from "../controllers/stageController.js";
const stageRouter = Router();

stageRouter.get("/", controller.getAllStages);
stageRouter.get("/:title", controller.getStageByTitle);

export { stageRouter };
