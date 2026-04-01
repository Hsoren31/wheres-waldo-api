import { Router } from "express";
import * as controller from "../controllers/gameController.js";
const gameRouter = Router();

gameRouter.get("/read/:id", controller.readGame);
gameRouter.post("/create/:stageTitle", controller.createGame);
gameRouter.put("/update", controller.updateGame);
gameRouter.delete("/delete", controller.deleteGame);

gameRouter.post("/guess/:stageTitle", controller.checkGuess);

//leaderboard Router
gameRouter.post("/leaderboard", controller.addToLeaderboard);
gameRouter.get("/leaderboard/:stageTitle", controller.getLeaderboard);

export { gameRouter };
