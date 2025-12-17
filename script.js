import { prisma } from "./lib/prisma.js";

async function main() {
  const stage1 = await prisma.stage.create({
    data: {
      title: "Space Station",
      image: {
        create: {
          title: "Space Station",
          url: "https://res.cloudinary.com/dsbeywhmi/image/upload/v1765988689/space_station_wheres_waldo_bi3zug.jpg",
          height: 1685,
          width: 2560,
        },
      },
      characters: {
        create: [
          {
            name: "Waldo",
            location: { x: 138, y: 1050 },
          },
          {
            name: "Wenda",
            location: { x: 756, y: 874 },
          },
          {
            name: "Wizard Whitebeard",
            location: { x: 1999, y: 977 },
          },
          {
            name: "Odlaw",
            location: { x: 182, y: 1163 },
          },
          {
            name: "Woof",
            location: { x: 1506, y: 1529 },
          },
        ],
      },
    },
  });
  console.log(stage1);
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
