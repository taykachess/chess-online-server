// import { json } from '@sveltejs/kit';
// import type { RequestHandler } from './$types';

// export const GET: RequestHandler = async ({ request }) => {
//   const { a, b } = await request.json();
//   return json(a + b);
// }

import { prisma } from "$lib/db/prisma";
import type { getTournament } from "$types/home/tournament";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ request, locals, url }) => {
  console.log("Req");
  let page = url.searchParams.get("page");

  if (!page) {
    page = "1";
  }

  const whereParam: any = {};

  const register = url.searchParams.get("register");

  if (locals.user && register === "yes") {
    whereParam.players = { some: { alies: locals.user.username } };
  }

  // if (!locals.user && register === "yes") {
  //   throw error(403);
  // }

  console.log("Username", locals.user?.username);

  const take = 10;
  const tournaments: getTournament[] = await prisma.tournament.findMany({
    take,
    skip: take * (+page - 1),
    where: {
      status: "registration",
      ...whereParam,
    },
    orderBy: { startTime: "desc" },
    select: {
      id: true,
      name: true,
      control: true,
      playerLimit: true,
      startTime: true,
      _count: { select: { players: true } },
      players: {
        where: { alies: locals.user?.username ? locals.user?.username : "" },
        select: { id: true },
      },
      format: true,
    },
  });

  return json(tournaments);
};
