import { prisma } from "$lib/db/prisma";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import type { Prisma } from "@prisma/client";
export const GET: RequestHandler = async ({ request, locals, url }) => {
  const whereParam: Prisma.TournamentWhereInput = {};
  const register = url.searchParams.get("register");

  console.log(locals.user, register);
  if (locals.user && register === "yes") {
    whereParam.participants = {
      some: { username: locals.user.username },
    };
  }

  const count = await prisma.tournament.count({
    where: {
      status: { in: ["registration", "active", "playoffs"] },
      // participants: {
      //   some: { username: locals.user.username },
      // },
      ...whereParam,
    },
  });

  return json(count);
};
