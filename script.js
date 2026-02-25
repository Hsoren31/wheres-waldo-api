import "dotenv/config";
import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

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
            location: { x: 1038, y: 1050 },
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
