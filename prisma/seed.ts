import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.menu.create({
    data: {
      name: "Main Menu",
      items: {
        create: [
          {
            name: "Burger",
            description: "A delicious beef burger",
            price: 10.99,
            image: "/images/burger.jpg",
          },
          {
            name: "Coke",
            description: "Refreshing soft drink",
            price: 2.99,
            image: "/images/coke.jpg",
          },
        ],
      },
    },
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
