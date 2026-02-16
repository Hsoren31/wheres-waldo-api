import { format } from "date-fns";
import { prisma } from "../lib/prisma.js";

async function createGame(req, res) {
  try {
    const { stageId } = req.params;
    const { characters } = await prisma.stage.findFirst({
      where: {
        id: stageId,
      },
      select: {
        characters: {
          select: {
            name: true,
          },
        },
      },
    });
    const gameCharacters = characters.map((character) => {
      return { ...character, found: false };
    });
    const game = await prisma.game.create({
      data: {
        stage: {
          connect: {
            id: stageId,
          },
        },
        characters: gameCharacters,
      },
    });
    req.session.game = game;
    res.status(200).send("session created");
  } catch (err) {
    console.error(err);
    res.status(404);
  }
}

async function checkLocations(locationGuess, location) {
  if (
    location.x - 50 <= locationGuess.x &&
    locationGuess.x <= location.x + 50
  ) {
    if (
      location.y - 50 <= locationGuess.y &&
      locationGuess.y <= location.y + 50
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
    const { location } = await prisma.character.findFirstOrThrow({
      where: {
        stageId: game.stageId,
        name: characterGuess,
      },
      select: {
        location: true,
      },
    });
    if (!location) {
      res.status(404).send("Could not find character");
      return;
    }

    const results = await checkLocations(locationGuess, location);
    if (!results) {
      res.send(false);
      return;
    }
    const updatedCharacters = game.characters.map((character) => {
      if (character.name === characterGuess) {
        return { ...character, found: true };
      }
      return character;
    });
    const gameEnd = await checkGameEnd(updatedCharacters);
    if (gameEnd) {
      const time = calculateTime(game.createdAt, endTime);
      res.json({ gameEnd: true, time: time });
      return;
    }
    const gameUpdated = await prisma.game.update({
      where: {
        id: game.id,
      },
      data: {
        characters: updatedCharacters,
      },
    });
    req.session.game = gameUpdated;
    res.send(true);
  } catch (err) {
    console.error(err);
    res.status(404);
  }
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
async function updateGame() {}
async function deleteGame() {}

export { createGame, checkGuess, readGame, updateGame, deleteGame };
