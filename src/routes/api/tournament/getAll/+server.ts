// import { json } from '@sveltejs/kit';
// import type { RequestHandler } from './$types';

// export const GET: RequestHandler = async ({ request }) => {
//   const { a, b } = await request.json();
//   return json(a + b);
// }

import { prisma } from "$lib/db/prisma";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ request }) => {
  const tournaments = await prisma.tournament.findMany({
    take: 10,
    where: { status: "registration" },
    orderBy: { startTime: "desc" },
    select: {
      id: true,
      name: true,
      control: true,
      playerLimit: true,
      startTime: true,
      _count: { select: { players: true } },
      format: true,
    },
  });
  return json(tournaments);
};
