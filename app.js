import _ from "lodash";
import "dotenv/config.js";
import express from "express";
import cors from "cors";

import { gameRouter } from "./routers/gameRouter.js";
import { stageRouter } from "./routers/stageRouter.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
    credentials: true,
  })
);

app.use("/game", gameRouter);
app.use("/stages", stageRouter);

app.get("/{*splat}", (req, res) => {
  res.status(404).send("404 Not Found");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`My express app listening on PORT ${PORT}`);
});
