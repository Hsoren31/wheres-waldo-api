import _ from "lodash";
import "dotenv/config.js";
import express from "express";
import session from "express-session";
import { startGame, validateGuess } from "./controllers/stageController.js";

const app = express();
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/:stageId", startGame);
app.post("/:stageId", validateGuess);

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
