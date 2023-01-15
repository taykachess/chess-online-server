import { prisma } from "$lib/db/prisma";
import { redis, emitter } from "$lib/db/redis";
import { MATCHES_REDIS_GOT, USER_ROOM } from "$sockets/variables/redisIndex";
import type { MatchCreateDtoExtended } from "$types/match";
import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ locals, request }) => {
  const { player } = await request.json();

  const dataMatch = await redis.hGet(
    MATCHES_REDIS_GOT(locals.user.username),
    `${player}`
  );

  if (dataMatch) throw error(403);

  let match: MatchCreateDtoExtended;
  if (dataMatch) match = JSON.parse(dataMatch);
  else throw Error("Wrong match information");
  const matchFromPrisma = await prisma.match.create({
    data: {
      type: match.type,
      player1: match.player,
      player2: match.sender.username,
      periods: match.periods,
    },
    select: {
      id: true,
      startDate: true,
    },
  });
  const status = await redis.hDel(
    MATCHES_REDIS_GOT(locals.user.username),
    `${player}`
  );

  setTimeout(() => {
    // cons
    console.log("Start match");
  }, matchFromPrisma.startDate.getMilliseconds());

  if (status == 1)
    emitter
      .to(USER_ROOM(player))
      .emit("match:private:accepted", matchFromPrisma.id);
  return new Response("ok");
};
