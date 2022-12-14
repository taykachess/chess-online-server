import { prisma } from "$lib/db/prisma";
import { redis } from "$lib/db/redis";
import { TOURNAMENTS_IN_PROGRESS_REDIS } from "$sockets/variables/redisIndex";
import { error } from "@sveltejs/kit";

import type {
  GetTournament,
  MatchSwiss,
  TournamentTv,
} from "$types/tournament";
import type { PlayerSwiss } from "$types/tournament";
import type { PageServerLoad } from "./$types";
import type { GetGame } from "$types/game";

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

    // TV секция

    const [tv] = (await redis.json.get(TOURNAMENTS_IN_PROGRESS_REDIS, {
      path: `$.${params.id}.tv`,
    })) as string;

    const gameJson = await fetch(`/api/game/${tv}`);
    const game = (await gameJson.json()) as GetGame;

    console.log("tv", tv);

    const swiss: Omit<GetTournament, "selectedRound" | "participants"> = {
      ...tournament,
      players: Object.values(players),
      currentRound: currentRoundValue,
      // matches,
    };

    const tournamentTv: TournamentTv = { tv, game };

    return { swiss, tournamentTv, matches };
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
      // matches: tournament.matches[tournament.rounds - 1],
      // players: tournament.players as PlayerSwiss[],
      currentRound: tournament.rounds ? tournament.rounds : 1,
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const tv = tournament.matches[tournament.rounds - 1][0][3] as string;

    const gameJson = await fetch(`/api/game/${tv}`);
    const game = (await gameJson.json()) as GetGame;
    const tournamentTv: TournamentTv = { tv, game };

    return {
      swiss,
      tournamentTv,
      matches: tournament.matches[tournament.rounds - 1],
    };
  }
};
