import { prisma } from "../lib/prisma.js";

async function getStageByTitle(title) {
  let formatTitle = title.split("_");
  formatTitle = formatTitle.map((string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  });
  formatTitle = formatTitle.join(" ");
  const stage = await prisma.stage.findFirst({
    where: {
      title: { contains: formatTitle },
    },
  });
  console.log(stage);
  return stage;
}

export { getStageByTitle };
