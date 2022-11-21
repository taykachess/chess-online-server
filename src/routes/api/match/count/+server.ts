import { redis } from "$lib/db/redis";
import { MATCHES_REDIS } from "$sockets/variables/redisIndex";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
  const count = await redis.json.OBJLEN(MATCHES_REDIS);
  return json(count);
};
