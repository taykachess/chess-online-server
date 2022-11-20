import type { LayoutServerLoad } from "./$types";
import { prisma } from "$lib/db/prisma";
import { redis } from "$lib/db/redis";

import { PLAYERINGAME } from "../../sockets/variables/redisIndex";

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
  if (!locals.user) return {};

  const gameIds = await redis.SMEMBERS(PLAYERINGAME(locals.user.username));
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
