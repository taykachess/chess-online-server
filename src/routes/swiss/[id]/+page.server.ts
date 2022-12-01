import { prisma } from "$lib/db/prisma";
import { redis } from "$lib/db/redis";
import { TOURNAMENTS_IN_PROGRESS_REDIS } from "$sockets/variables/redisIndex";
import { error } from "@sveltejs/kit";

import type { GetTournament } from "$types/tournament";
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
  // const tournament: GetTournament | null = await prisma.tournament.findUnique({
  //   where: { id: params.id },
  //   select: {
  //     name: true,
  //     description: true,
  //     format: true,
  //     status: true,
  //     startTime: true,
  //     control: true,
  //     rounds: true,
  //     organizer: { select: { username: true, title: true } },
  //     participants: {
  //       select: { username: true, title: true, rating: true },
  //       orderBy: { rating: "desc" },
  //     },
  //   },
  // });

  if (!tournamentWithStatus) throw error(404);

  // console.log(tournament), "tournament";
  // type TournamentGet = typeof tournament;

  if (tournamentWithStatus.status == "running") {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const tournament: GetTournament | null = await prisma.tournament.findUnique(
      {
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
          // participants: {
          //   select: { username: true, rating: true },
          // },
        },
      }
    );
    if (!tournament) throw error(404);
    if (!tournament.rounds) throw error(301);
    const [currentRound] = (await redis.json.get(
      TOURNAMENTS_IN_PROGRESS_REDIS,
      {
        path: `$.${params.id}.round`,
      }
    )) as [number];
    tournament.currentRound =
      currentRound > tournament.rounds ? tournament.rounds : currentRound;

    // const pairings = await fetch(
    //   `/api/tournament/${params.id}/pairings?round=${tournament.currentRound}`
    // );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const [players]: [Record<string, PlayerSwiss>] = await redis.json.get(
      TOURNAMENTS_IN_PROGRESS_REDIS,
      {
        path: `$.${params.id}.players`,
      }
    );
    console.log("players length", players);

    if (players) tournament.players = Object.values(players);

    console.log("rounds", currentRound);
    // const swiss: GetTournament|null = {
    //   ...tournament,
    //   // currentRound: tournament.rounds,
    // };
    return { swiss: tournament };
  } else if (tournamentWithStatus.status == "registration") {
    const tournament: GetTournament | null = await prisma.tournament.findUnique(
      {
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
      }
    );
    if (!tournament) throw error(404);

    return { swiss: tournament };
  }

  const tournament: GetTournament | null = await prisma.tournament.findUnique({
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
        select: { username: true, rating: true },
      },
    },
  });
  if (!tournament) throw error(404);
  tournament.currentRound = tournament.rounds;

  // const pairings = await fetch(
  //   `/api/tournament/${params.id}/pairings?round=${tournament.currentRound}`
  // );

  // console.log(pairings.j);
  // const swiss: GetTournament|null = {
  //   ...tournament,
  //   // currentRound: tournament.rounds,
  // };
  return { swiss: tournament };
  // return { swiss: tournament };
};
