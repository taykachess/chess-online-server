import type { RequestHandler } from "./$types";
import type { MatchSwiss } from "$types/tournament";
import { redis } from "$lib/db/redis";
import { TOURNAMENTS_IN_PROGRESS_REDIS } from "$sockets/variables/redisIndex";
import { json } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ url, params }) => {
  const tournamentId = params.id;
  const round = url.searchParams.get("round");

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // prettier-ignore
  const matches:MatchSwiss[] = await redis.json.get(TOURNAMENTS_IN_PROGRESS_REDIS, {
    path: `$.${tournamentId}.matches[${round}]`,
  });

  return json(matches);
};
