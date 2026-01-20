import { prisma } from "../lib/prisma.js";

async function startGame(req, res) {
  try {
    const { stageId } = req.params;
    const stage = await prisma.stage.findFirst({
      where: { id: stageId },
      include: {
        image: true,
        characters: {
          include: {
            location: false,
          },
        },
      },
    });
    stage.characters = stage.characters.map((character) => {
      return { ...character, found: false };
    });
    stage.gameId = crypto.randomUUID();
    stage.startTime = new Date().getTime();
    req.session.game = stage;
    res.send(stage);
  } catch (err) {
    res.status(404).send("Stage not found.");
  }
}

async function validateGuess(req, res) {
  try {
    const stageId = req.session.game.id;
    const { characterName, locationGuess } = req.body;
    const { location } = await prisma.character.findFirst({
      where: {
        stageId,
        name: characterName,
      },
      select: {
        location: true,
      },
    });
    if (
      locationGuess.x >= location.x - 50 &&
      locationGuess.x <= location.x + 50
    ) {
      if (
        locationGuess.y >= location.y - 50 &&
        locationGuess.y <= location.y + 50
      ) {
        req.session.game.characters = req.session.game.characters.map(
          (character) => {
            if (character.name === characterName) {
              return { ...character, found: true };
            }
            return character;
          }
        );
        if (
          req.session.game.characters.every(
            (character) => character.found == true
          )
        ) {
          req.session.game.endTime = new Date().getTime();
          let timeInSeconds =
            (req.session.game.endTime - req.session.game.startTime) * 0.001;
          req.session.game.stopwatchTime = timeInSeconds;
          return res.send(
            `You found all the characters in ${timeInSeconds}!! Congrats.`
          );
        }
        return res.send("You Found character");
      }
    }
    res.send("Try again.");
  } catch (err) {
    res.status(404).send("Could not find character. Try again.");
  }
}

export { startGame, validateGuess };
