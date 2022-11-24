import { prisma } from "$lib/db/prisma";
import type { GetTournament } from "$types/tournament";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
export const load: PageServerLoad = async ({ params }) => {
  const tournament: GetTournament | null = await prisma.tournament.findUnique({
    where: { id: params.id },
    select: {
      name: true,
      description: true,
      format: true,
      startTime: true,
      control: true,
      organizer: { select: { username: true, title: true } },
      participants: {
        select: { username: true, title: true, rating: true },
        orderBy: { rating: "asc" },
      },
    },
  });

  if (!tournament) throw error(404);

  console.log(tournament), "tournament";
  type TournamentGet = typeof tournament;
  return { tournament };
};
