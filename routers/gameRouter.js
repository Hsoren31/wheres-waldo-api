import { Router } from "express";
import {
  createGame,
  checkGuess,
  readGame,
  updateGame,
  deleteGame,
} from "../controllers/gameController.js";
const gameRouter = Router();

gameRouter.post("/create/:stageId", createGame);
gameRouter.post("/guess", checkGuess);
gameRouter.get("/read/:id", readGame);
gameRouter.put("/update", updateGame);
gameRouter.delete("/delete", deleteGame);

export { gameRouter };
