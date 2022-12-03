import { redis } from "$lib/db/redis";
import { TOURNAMENTS_IN_PROGRESS_REDIS } from "$sockets/variables/redisIndex";
import type { PlayerSwiss } from "$types/tournament";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params }) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [players]: [Record<string, PlayerSwiss>] = await redis.json.get(
    TOURNAMENTS_IN_PROGRESS_REDIS,
    {
      path: `$.${params.id}.players`,
    }
  );

  return json(Object.values(players));
};
