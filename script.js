import { prisma } from "./lib/prisma.js";

async function main() {
  await prisma.stage.deleteMany();
  await prisma.stage.create({
    data: {
      title: "Space Station",
      image: {
        create: {
          url: "https://res.cloudinary.com/dsbeywhmi/image/upload/v1765988689/space_station_wheres_waldo_bi3zug.jpg",
          height: 1685,
          width: 2560,
        },
      },
      characters: {
        create: [
          {
            name: "Waldo",
            location: { x: 40.5, y: 62.31 },
          },
          {
            name: "Wenda",
            location: { x: 29.53, y: 52.96 },
          },
          {
            name: "Wizard Whitebeard",
            location: { x: 78.08, y: 58.92 },
          },
          {
            name: "Odlaw",
            location: { x: 7.1, y: 69.02 },
          },
          {
            name: "Woof",
            location: { x: 58.82, y: 92.21 },
          },
        ],
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
