import { prisma } from "../lib/prisma.js";

async function getStageByTitle(title) {
  const stage = await prisma.stage.findFirst({
    where: {
      title: { contains: title, mode: "insensitive" },
    },
    include: {
      image: true,
    },
  });
  return stage;
}

async function getStages() {
  const stages = await prisma.stage.findMany({
    include: {
      image: true,
    },
  });
  return stages;
}

export { getStageByTitle, getStages };
