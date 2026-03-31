import { Router } from "express";
import * as controller from "../controllers/gameController.js";
const gameRouter = Router();

gameRouter.post("/create/:stageTitle", controller.createGame);
gameRouter.post("/guess/:stageTitle", controller.checkGuess);
gameRouter.post("/leaderboard", controller.addToLeaderboard);
gameRouter.get("/read/:id", controller.readGame);
gameRouter.get("/leaderboard/:stageTitle", controller.getLeaderboard);
gameRouter.put("/update", controller.updateGame);
gameRouter.delete("/delete", controller.deleteGame);
gameRouter.get("/stages", controller.getAllStages);

export { gameRouter };
