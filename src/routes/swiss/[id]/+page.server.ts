import { prisma } from "$lib/db/prisma";
import { redis } from "$lib/db/redis";
import { TOURNAMENTS_IN_PROGRESS_REDIS } from "$sockets/variables/redisIndex";
import { error } from "@sveltejs/kit";

import type { GetTournament, MatchSwiss } from "$types/tournament";
import type { PlayerSwiss } from "$types/tournament";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, fetch }) => {
  const tournamentWithStatus = await prisma.tournament.findUnique({
    where: {
      id: params.id,
    },
    select: {
      status: true,
    },
  });

  if (!tournamentWithStatus) throw error(404);

  if (tournamentWithStatus.status == "running") {
    const tournament = await prisma.tournament.findUnique({
      where: { id: params.id },
      select: {
        name: true,
        description: true,
        format: true,
        status: true,
        startTime: true,
        control: true,
        rounds: true,
        organizer: { select: { username: true, title: true } },
      },
    });
    if (!tournament) throw error(404);
    if (!tournament.rounds) throw error(301);
    const [currentRound] = (await redis.json.get(
      TOURNAMENTS_IN_PROGRESS_REDIS,
      {
        path: `$.${params.id}.round`,
      }
    )) as [number];
    const currentRoundValue =
      currentRound > tournament.rounds ? tournament.rounds : currentRound;

    const data = await fetch(
      `/api/tournament/${params.id}/pairings?round=${currentRoundValue - 1}`
    );

    const matches = await data.json();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const [players]: [Record<string, PlayerSwiss>] = await redis.json.get(
      TOURNAMENTS_IN_PROGRESS_REDIS,
      {
        path: `$.${params.id}.players`,
      }
    );

    const swiss: Omit<GetTournament, "selectedRound" | "participants"> = {
      ...tournament,
      players: Object.values(players),
      currentRound: currentRoundValue,
      matches,
    };

    return { swiss };
  } else if (tournamentWithStatus.status == "registration") {
    const tournament = await prisma.tournament.findUnique({
      where: { id: params.id },
      select: {
        name: true,
        description: true,
        format: true,
        status: true,
        startTime: true,
        control: true,
        rounds: true,
        organizer: { select: { username: true, title: true } },
        participants: {
          select: { username: true, title: true, rating: true },
          orderBy: { rating: "desc" },
        },
      },
    });
    if (!tournament) throw error(404);

    return { swiss: tournament };
  } else if (tournamentWithStatus.status == "finished") {
    const tournament = await prisma.tournament.findUnique({
      where: { id: params.id },
      select: {
        name: true,
        description: true,
        format: true,
        status: true,
        startTime: true,
        control: true,
        rounds: true,
        organizer: { select: { username: true, title: true } },
        players: true,
        matches: true,
      },
    });
    if (!tournament) throw error(404);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const swiss: Omit<GetTournament, "selectedRound" | "participants"> = {
      ...tournament,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      matches: tournament.matches[tournament.rounds - 1],
      // players: tournament.players as PlayerSwiss[],
      currentRound: tournament.rounds ? tournament.rounds : 1,
    };

    return { swiss };
  }
};
