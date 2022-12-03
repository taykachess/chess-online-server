import type { RequestHandler } from "./$types";
import type { MatchSwiss } from "$types/tournament";
import type { TournamentStatus } from "@prisma/client";
import { redis } from "$lib/db/redis";
import { TOURNAMENTS_IN_PROGRESS_REDIS } from "$sockets/variables/redisIndex";
import { error, json } from "@sveltejs/kit";
import { prisma } from "$lib/db/prisma";

export const GET: RequestHandler = async ({ url, params }) => {
  const tournamentId = params.id;
  const round = url.searchParams.get("round") as string;
  // const status = url.searchParams.get("status") as TournamentStatus;
  const tournamentStatus = await prisma.tournament.findUnique({
    where: { id: tournamentId },
    select: { status: true },
  });
  if (!tournamentStatus) return error(404);
  tournamentStatus.status;

  console.log("round", round);
  if (tournamentStatus.status == "running") {
    console.log("roundRunning", round);

    const [matches] = (await redis.json.get(TOURNAMENTS_IN_PROGRESS_REDIS, {
      path: `$.${tournamentId}.matches[${round}]`,
    })) as MatchSwiss[][];

    return json(matches);
  }

  const tournament = (await prisma.tournament.findUnique({
    where: {
      id: tournamentId,
    },
    select: {
      matches: true,
    },
  })) as { matches: any[] };
  if (!tournament) return error(404);
  if (!tournament.matches) return error(404);

  const matches = tournament.matches[+round];

  return json(matches);
};
