import { prisma } from "$lib/db/prisma";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ params, locals }) => {
  await prisma.tournament.update({
    where: {
      id: params.id,
    },
    data: {
      participants: {
        disconnect: {
          username: locals.user.username,
        },
      },
    },
  });

  // console.log("tournament", tournament);
  return new Response("ok");
};
