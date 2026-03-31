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
  await prisma.stage.create({
    data: {
      title: "Beach",
      image: {
        create: {
          url: "https://res.cloudinary.com/dsbeywhmi/image/upload/v1774975713/Wheres-Waldo-Beach_tba1nv.jpg",
          height: 1644,
          width: 2560,
        },
      },
      characters: {
        create: [
          {
            name: "Waldo",
            location: { x: 61.83, y: 38.38 },
          },
          {
            name: "Wenda",
            location: { x: 77.3, y: 40.81 },
          },
          {
            name: "Wizard Whitebeard",
            location: { x: 27.03, y: 36.31 },
          },
          {
            name: "Odlaw",
            location: { x: 10.78, y: 35.27 },
          },
          {
            name: "Woof",
            location: { x: 67.85, y: 37.46 },
          },
        ],
      },
    },
  });
  await prisma.stage.create({
    data: {
      title: "Ski Slopes",
      image: {
        create: {
          url: "https://res.cloudinary.com/dsbeywhmi/image/upload/v1774975732/Wheres-Waldo-Skiing_gi5hgw.jpg",
          height: 1623,
          width: 2560,
        },
      },
      characters: {
        create: [
          {
            name: "Waldo",
            location: { x: 85.5, y: 73.38 },
          },
          {
            name: "Wenda",
            location: { x: 49.02, y: 41.58 },
          },
          {
            name: "Wizard Whitebeard",
            location: { x: 6.91, y: 95.71 },
          },
          {
            name: "Odlaw",
            location: { x: 31.83, y: 63.77 },
          },
          {
            name: "Woof",
            location: { x: 29.72, y: 71.9 },
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
