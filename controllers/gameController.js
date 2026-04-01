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
  //receive current game id and players guess
  const { gameId, guess } = req.body;
  const game = await queries.getGameById(gameId);
  //Find the true location of targeted character
  const trueLocation = await queries.getCharacterLocation(
    game.stageId,
    guess.characterGuess
  );
  //Compare the guess location with the true location
  const results = checkLocations(guess.locationGuess, trueLocation);
  if (results) {
    const characters = updateCharacters(guess.characterGuess, game.characters);
    // Check game over
    const gameOver = checkGameEnd(characters);
    if (gameOver) {
      const time = calculateTime(game.createdAt);
      await queries.endGame(gameId, characters, time);
      res.json({ found: true, gameOver: true, time: time });
      return;
    }
    await queries.updateGame(gameId, characters);
    res.json({ found: true });
    return;
  } else {
    res.json({ found: false });
    return;
  }
}

async function addToLeaderboard(req, res) {
  const { gameId, playerName } = req.body;
  await queries.addToLeaderboard(gameId, playerName);
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
  const { stageTitle } = req.params;
  const stageQuery = stageTitle.split("_").join(" ");
  const leaderboard = await queries.getLeaderboard(stageQuery);
  res.json(leaderboard);
}

async function updateGame() {}
async function deleteGame() {}

function checkLocations(locationGuess, location) {
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

function checkGameEnd(characters) {
  return characters.every((character) => {
    return character.found === true;
  });
}

function calculateTime(startTime) {
  const endTime = Date.now();
  startTime = Date.parse(startTime);
  const difference = new Date(endTime - startTime);
  const time = format(difference, "mm:ss.SSS");
  return time;
}

function updateCharacters(guess, characters) {
  const updatedCharacters = characters.map((character) => {
    if (character.name === guess) {
      return { ...character, found: true };
    }
    return character;
  });
  return updatedCharacters;
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
