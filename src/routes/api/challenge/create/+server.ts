import { prisma } from "$lib/db/prisma";
import { redis } from "$lib/db/redis";
import type { Prisma } from "@prisma/client";
import { error, json, redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request, url, locals }) => {
  if (!locals.user) throw error(403);
  console.log(locals.user.id);
  const user = await prisma.user.findFirst({
    where: { id: locals.user.id },
  });

  interface Challenge {
    user: string;
    rating: number;
    control: string;
  }

  const challenge: Challenge = {
    user: locals.user.username,
    rating: 2346,
    control: "3+2",
  };
  const status = await redis.json.set("challenges", `$.${locals.user.id}`, {
    user: locals.user.username,
    rating: 2346,
    control: "3+2",
  });

  // const count = await redis.json.OBJLEN("challenges");

  // console.log(challenge, count);
  return json(status);
};
