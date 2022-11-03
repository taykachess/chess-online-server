import { prisma } from "$lib/db/prisma";
import type { Prisma } from "@prisma/client";
import { json, redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request }) => {
  const data = (await request.json()) as Prisma.TournamentCreateInput;
  const tournament = await prisma.tournament.create({
    data,
    select: { id: true },
  });
  console.log("tournament", tournament);
  return json(tournament.id);
};
