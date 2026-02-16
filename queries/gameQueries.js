import { prisma } from "../lib/prisma.js";

async function getStageCharacters(stageId) {
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
  return characters;
}

async function createGame(stageId, characters) {
  const game = await prisma.game.create({
    data: {
      stage: {
        connect: {
          id: stageId,
        },
      },
      characters: characters,
    },
  });
  return game;
}

async function getCharacterLocation(stageId, character) {
  const location = await prisma.character.findFirst({
    where: {
      stageId,
      name: character,
    },
    select: {
      location: true,
    },
  });
  return location;
}

async function updateGame(gameId, characters) {
  const updatedGame = await prisma.game.update({
    where: {
      id: gameId,
    },
    data: {
      characters: characters,
    },
  });
  return updatedGame;
}

export { getStageCharacters, createGame, getCharacterLocation, updateGame };
