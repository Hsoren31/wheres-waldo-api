import { format } from "date-fns";
import * as queries from "../queries/gameQueries.js";
import * as stageDb from "../queries/stageQueries.js";

async function createGame(req, res) {
  try {
    const { stageTitle } = req.params;
    const stage = await stageDb.getStageByTitle(stageTitle);
    const characters = await queries.getStageCharacters(stage.id);
    const gameCharacters = characters.map((character) => {
      return { ...character, found: false };
    });
    const game = await queries.createGame(stage.id, gameCharacters);
    res.status(200).json({ id: game.id, characters: game.characters });
  } catch (err) {
    console.error(err);
    res.status(404).send("Could not create game");
  }
}

async function checkGuess(req, res) {
  try {
    const endTime = Date.now();
    const { stageTitle } = req.params;
    const { characterGuess, locationGuess, game } = req.body;
    const stage = await stageDb.getStageByTitle(stageTitle);
    const location = await queries.getCharacterLocation(
      stage.id,
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
    const { characters } = await queries.getGameCharacters(game);
    const updatedCharacters = characters.map((character) => {
      if (character.name === characterGuess) {
        return { ...character, found: true };
      }
      return character;
    });
    const gameEnd = await checkGameEnd(updatedCharacters);
    let updatedGame = await queries.updateGame(game, updatedCharacters);
    if (gameEnd) {
      const gameData = await queries.getGameById(game);
      console.log(gameData);
      const time = calculateTime(gameData.createdAt, endTime);
      updatedGame = await queries.endGame(game, updatedCharacters, time);
      res.json({ found: true, gameEnd: true, time: time });
      return;
    }
    res.json({ found: true, characters: updatedCharacters });
  } catch (err) {
    console.error(err);
    res.status(404);
  }
}

async function addToLeaderboard(req, res) {
  const { name, game, time } = req.body;
  await queries.addToLeaderboard(game, name, time);
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

export {
  createGame,
  checkGuess,
  readGame,
  updateGame,
  deleteGame,
  getLeaderboard,
  addToLeaderboard,
};
