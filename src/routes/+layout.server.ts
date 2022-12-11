import type { LayoutServerLoad } from "./$types";
import { prisma } from "$lib/db/prisma";
import { redis } from "$lib/db/redis";
import { io } from "socket.io-client";

import { PLAYER_IN_GAME_REDIS } from "../../sockets/variables/redisIndex";
import { socket } from "$store/sockets/socket";

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
  if (!locals.user) return {};

  const gameIds = await redis.SMEMBERS(
    PLAYER_IN_GAME_REDIS(locals.user.username)
  );

  console.log("gameids", gameIds);
  const user = await prisma.user.findUnique({
    where: { username: locals.user?.username },
    select: { rating: true, title: true },
  });

  // const token = cookies.get("token");

  // socket.set(
  //   io("http://localhost:3000", {
  //     auth: { token: cookies.get("token") },
  //   })
  // );

  return {
    user: {
      ...locals.user,
      rating: Number(user?.rating),
      title: user?.title,
    },
    gameIds,
  };
};
