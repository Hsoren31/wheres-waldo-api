import _ from "lodash";
import "dotenv/config.js";
import { prisma } from "./lib/prisma.js";
import express from "express";
import { body, check, validationResult, matchedData } from "express-validator";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const validateGuess = [
  body("character").trim().isAlpha(),
  check("guess.x").isNumeric(),
  check("guess.y").isNumeric(),
];

app.get("/:id", async (req, res) => {
  const { id } = req.params;
  const stage = await prisma.stage.findFirst({
    where: {
      id,
    },
    select: {
      title: true,
      image: true,
      leaderBoard: true,
    },
  });
  if (!stage) {
    return res.status(404).send("Not Found");
  }
  res.json(stage);
});

app.post("/:stageId", [
  validateGuess,
  async (req, res) => {
    const { stageId } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send("Wrong Data. Try Again");
    }
    const { character, guess } = matchedData(req);
    const { location } = await prisma.character.findFirst({
      where: {
        stageId,
        name: character,
      },
      select: {
        location: true,
      },
    });
    if (_.isEqual(guess, location)) {
      return res.json({ result: true });
    }
    res.json({ result: false });
  },
]);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/{*splat}", (req, res) => {
  res.status(404);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`My express app listening on PORT ${PORT}`);
});
