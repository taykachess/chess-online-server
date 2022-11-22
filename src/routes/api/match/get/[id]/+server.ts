import { redis } from "$lib/db/redis";
import { json } from "@sveltejs/kit";

import { MATCHES_IN_PROGRESS_REDIS } from "$sockets/variables/redisIndex";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params }) => {
  const { id } = params;

  console.log("MatchId", id);
  const match = await redis.json.get(MATCHES_IN_PROGRESS_REDIS, {
    path: `$.${id}`,
  });

  return json(match);
};
