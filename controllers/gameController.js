import { format } from "date-fns";
import * as queries from "../queries/gameQueries.js";

async function createGame(req, res) {
  try {
    const { stageId } = req.params;
    const characters = await queries.getStageCharacters(stageId);
    const gameCharacters = characters.map((character) => {
      return { ...character, found: false };
    });
    const game = await queries.createGame(stageId, gameCharacters);
    req.session.game = game;
    res.status(200).json(game.characters);
  } catch (err) {
    console.error(err);
    res.status(404).send("Could not create session");
  }
}

async function checkLocations(locationGuess, location) {
  if (
    location.x - 1.5 <= locationGuess.x &&
    locationGuess.x <= location.x + 1.5
  ) {
    if (
      location.y - 1.5 <= locationGuess.y &&
      locationGuess.y <= location.y + 1.5
    ) {
      return true;
    }
  } else {
    return false;
  }
}

async function checkGameEnd(characters) {
  return characters.every((character) => {
    return character.found === true;
  });
}

function calculateTime(startTime, endTime) {
  startTime = Date.parse(startTime);
  const difference = new Date(endTime - startTime);
  const time = format(difference, "mm:ss.SSS");
  return time;
}

async function checkGuess(req, res) {
  try {
    const endTime = Date.now();
    const game = req.session.game;
    const { characterGuess, locationGuess } = req.body;
    const location = await queries.getCharacterLocation(
      game.stageId,
      characterGuess
    );
    if (!location) {
      res.status(404).send("Could not find character");
      return;
    }
    const results = await checkLocations(locationGuess, location.location);
    if (!results) {
      res.json({ found: false });
      return;
    }
    const updatedCharacters = game.characters.map((character) => {
      if (character.name === characterGuess) {
        return { ...character, found: true };
      }
      return character;
    });
    const gameEnd = await checkGameEnd(updatedCharacters);
    const updatedGame = await queries.updateGame(game.id, updatedCharacters);
    if (gameEnd) {
      const time = calculateTime(game.createdAt, endTime);
      const finalGame = await queries.endGame(game.id, updatedCharacters, time);
      req.session.game = finalGame;
      res.json({ found: true, gameEnd: true, time: time });
      return;
    }
    req.session.game = updatedGame;
    res.json({ found: true, characters: game.characters });
  } catch (err) {
    console.error(err);
    res.status(404);
  }
}

async function addToLeaderboard(req, res) {
  const game = req.session.game;
  const { name } = req.body;
  await queries.addToLeaderboard(game.id, name, game.time);
  res.send("Added to leaderboard");
}

async function readGame(req, res) {
  const { id } = req.params;

  const { game } = await prisma.game.findFirst({
    where: {
      id,
    },
  });
  res.json(game);
}

async function getLeaderboard(req, res) {
  const { stageId } = req.params;

  const leaderboard = await queries.getLeaderboard(stageId);
  res.json(leaderboard);
}
async function updateGame() {}
async function deleteGame() {}

export {
  createGame,
  checkGuess,
  readGame,
  updateGame,
  deleteGame,
  getLeaderboard,
  addToLeaderboard,
};
