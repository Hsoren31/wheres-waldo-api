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
  const { location } = await prisma.character.findFirst({
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

async function addToLeaderboard(gameId, playerName) {
  await prisma.game.update({
    where: {
      id: gameId,
    },
    data: {
      playerName: playerName,
    },
  });
}

async function getLeaderboard(stageTitle) {
  const { leaderBoard } = await prisma.stage.findFirst({
    where: {
      title: {
        contains: stageTitle,
        mode: "insensitive",
      },
    },
    select: {
      leaderBoard: {
        where: {
          playerName: {
            not: null,
          },
          time: {
            not: null,
          },
        },
        select: {
          playerName: true,
          time: true,
        },
        orderBy: [
          {
            time: "asc",
          },
          {
            createdAt: "desc",
          },
        ],
      },
    },
  });
  return leaderBoard;
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
