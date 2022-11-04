import { prisma } from "$lib/db/prisma";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ request, locals, url }) => {
  const whereParam: any = {};
  const register = url.searchParams.get("register");

  console.log(locals.user, register);
  if (locals.user && register === "yes") {
    whereParam.players = { some: { alies: locals.user.username } };
  }

  const count = await prisma.tournament.count({
    where: {
      status: { in: ["registration", "active", "playoffs"] },
      ...whereParam,
    },
  });

  console.log("count", count);
  return json(count);
};
