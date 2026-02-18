import { Router } from "express";
import * as controller from "../controllers/gameController.js";
const gameRouter = Router();

gameRouter.post("/create/:stageId", controller.createGame);
gameRouter.post("/guess", controller.checkGuess);
gameRouter.post("/leaderboard", controller.addToLeaderboard);
gameRouter.get("/read/:id", controller.readGame);
gameRouter.get("/:stageId", controller.getLeaderboard);
gameRouter.put("/update", controller.updateGame);
gameRouter.delete("/delete", controller.deleteGame);

export { gameRouter };
