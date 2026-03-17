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

async function getGameCharacters(gameId) {
  const characters = await prisma.game.findFirst({
    where: {
      id: gameId,
    },
    select: {
      characters: true,
    },
  });
  return characters;
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

async function endGame(gameId, characters, time) {
  const updatedGame = await prisma.game.update({
    where: {
      id: gameId,
    },
    data: {
      characters,
      time,
    },
  });
  return updatedGame;
}

async function addToLeaderboard(game, name, time) {
  await prisma.game.update({
    where: {
      id: game,
    },
    data: {
      playerName: name,
      time: time,
    },
  });
}

async function getLeaderboard(stageId) {
  const leaderboard = await prisma.game.findMany({
    where: {
      stageId: stageId,
      playerName: {
        not: null,
      },
      time: {
        not: null,
      },
    },
    orderBy: [
      {
        time: "asc",
      },
      {
        createdAt: "desc",
      },
    ],
    take: 10,
    select: {
      playerName: true,
      time: true,
    },
  });
  return leaderboard;
}

async function getGameById(id) {
  const game = await prisma.game.findFirst({
    where: {
      id,
    },
  });
  return game;
}

export {
  getStageCharacters,
  createGame,
  getCharacterLocation,
  getGameCharacters,
  updateGame,
  addToLeaderboard,
  getLeaderboard,
  endGame,
  getGameById,
};
