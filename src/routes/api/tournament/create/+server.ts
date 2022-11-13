import { prisma } from "$lib/db/prisma";
import type { Prisma } from "@prisma/client";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request }) => {
  const data = (await request.json()) as Prisma.TournamentCreateInput;
  const tournament = await prisma.tournament.create({
    data,
    select: { id: true },
  });
  return json(tournament.id);
};
