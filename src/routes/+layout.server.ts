import type { LayoutServerLoad } from "./$types";
import { prisma } from "$lib/db/prisma";
import { redis } from "$lib/db/redis";

import { PLAYER_IN_GAME_REDIS } from "../../sockets/variables/redisIndex";

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

  return {
    user: {
      ...locals.user,
      rating: Number(user?.rating),
      title: user?.title,
    },
    gameIds,
  };
};
