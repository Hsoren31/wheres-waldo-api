import * as query from "../queries/stageQueries.js";

async function getAllStages(req, res) {
  const stages = await query.getStages();
  res.json(stages);
}

async function getStageByTitle(req, res) {
  const { title } = req.params;
  const stage = await query.getStageByTitle(title);
  res.json(stage);
}

export { getAllStages, getStageByTitle };
