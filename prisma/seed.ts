import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  await prisma.role.create({
    data: { name: "ADMIN" },
  });

  //   User with role ADMIN
  await prisma.user.create({
    data: {
      username: "tayka",
      email: "mvkvol@yandex.ru",
      hashedPassword:
        "$2b$10$FXPVAxuA5ByTC1lonJxY9.DJrWiPY4PHc1qLWM9a7nXnxHF4sTBuO",
      title: "GM",
      roles: { connect: { name: "ADMIN" } },
    },
  });
  // User without role
  await prisma.user.create({
    data: {
      username: "tayka2",
      email: "mvkvol2@yandex.ru",
      hashedPassword:
        "$2b$10$FXPVAxuA5ByTC1lonJxY9.DJrWiPY4PHc1qLWM9a7nXnxHF4sTBuO",
    },
  });

  await prisma.tournament.create({
    data: {
      name: "Мой первый турнир",
      description: "",
      control: "3+0",
      format: "swiss",
      startTime: new Date(),
      organizer: { connect: { username: "tayka" } },
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
