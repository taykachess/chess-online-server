import { PrismaClient, type User } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  // await prisma.role.upsert({
  //   create: {
  //     name: "ADMIN",
  //   },
  //   update: {},
  //   where: {
  //     name: "ADMIN",
  //   },
  // });

  //   User with role ADMIN
  await prisma.user.upsert({
    create: {
      username: "tayka",
      email: "mvkvol@yandex.ru",
      hashedPassword:
        "$2b$10$FXPVAxuA5ByTC1lonJxY9.DJrWiPY4PHc1qLWM9a7nXnxHF4sTBuO",
      title: "GM",
      roles: {
        set: "ADMIN",
      },
    },
    update: {},
    where: {
      username: "tayka",
    },
  });
  // User without role
  await prisma.user.upsert({
    create: {
      username: "tayka2",
      email: "mvkvol2@yandex.ru",
      hashedPassword:
        "$2b$10$FXPVAxuA5ByTC1lonJxY9.DJrWiPY4PHc1qLWM9a7nXnxHF4sTBuO",
    },
    update: {},
    where: {
      username: "tayka2",
    },
  });

  const prismaQueries: Promise<User>[] = [];
  for (let i = 0; i < 18; i++) {
    const qe = prisma.user.upsert({
      create: {
        username: `taykas${i}`,
        email: `mvkvols${i}@yandex.ru`,
        hashedPassword:
          "$2b$10$FXPVAxuA5ByTC1lonJxY9.DJrWiPY4PHc1qLWM9a7nXnxHF4sTBuO",
        rating: 2020 + i,
      },
      update: {
        rating: 2020 + i,
      },
      where: {
        username: `taykas${i}`,
      },
    });

    prismaQueries.push(qe);
  }

  const users = await Promise.all(prismaQueries);

  const tournament = await prisma.tournament.upsert({
    create: {
      id: "clav5lj9q0000p13dg45de9ix",
      name: "Мой первый турнир",
      description: "",
      control: "3+0",
      format: "swiss",
      startTime: new Date(),
      rounds: 11,
      organizer: { connect: { username: "tayka" } },
    },
    update: {},
    where: {
      id: "clav5lj9q0000p13dg45de9ix",
    },
  });

  for (let i = 0; i < 10; i++) {
    await prisma.tournament.upsert({
      create: {
        id: `clav5lj9q0000p13dg45de9ix${i}`,
        name: `Мой ${i} турнир`,
        description: "",
        control: "3+0",
        format: "swiss",
        startTime: new Date(),
        rounds: 11,
        organizer: { connect: { username: "tayka" } },
      },
      update: {},
      where: {
        id: `clav5lj9q0000p13dg45de9ix${i}`,
      },
    });
  }

  const prismaQueriesUser: Promise<User>[] = [];

  users.forEach((user) => {
    const qr = prisma.user.update({
      where: { username: user.username },
      data: {
        participant: {
          connect: { id: tournament.id },
        },
      },
    });
    prismaQueriesUser.push(qr);
  });

  const registedUsers = await Promise.all(prismaQueriesUser);
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
