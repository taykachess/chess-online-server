import { prisma } from "$lib/db/prisma";
import type { TournamentTable } from "$types/tournament";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import type { Prisma } from "@prisma/client";

export const GET: RequestHandler = async ({ request, locals, url }) => {
  let page = url.searchParams.get("page");

  if (!page) {
    page = "1";
  }

  const whereParam: Prisma.TournamentWhereInput = {};

  const register = url.searchParams.get("register");
  const created = url.searchParams.get("created");

  if (locals.user && register === "yes") {
    whereParam.participants = { some: { username: locals.user.username } };
  }

  if (locals.user && created === "yes") {
    whereParam.organizer = { username: locals.user.username };
  }

  const take = 10;
  const tournaments: TournamentTable[] = await prisma.tournament.findMany({
    take,
    skip: take * (+page - 1),
    where: {
      // creator:{username:locals.user.username},
      // status: "registration",
      ...whereParam,
    },
    orderBy: { startTime: "desc" },
    select: {
      id: true,
      name: true,
      control: true,
      playerLimit: true,
      startTime: true,
      status: true,
      // participants: { orderBy: { rating: "asc" } },
      _count: { select: { participants: true } },
      rounds: true,
      // players: {
      //   where: { alies: locals.user?.username ? locals.user?.username : "" },
      //   select: { id: true },
      // },
      format: true,
    },
  });

  return json(tournaments);
};
