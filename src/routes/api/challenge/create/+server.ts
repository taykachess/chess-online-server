import { prisma } from "$lib/db/prisma";
import { redis, emitter } from "$lib/db/redis";
import type { Prisma } from "@prisma/client";
import { error, json, redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request, url, locals }) => {
  if (!locals.user) throw error(403);
  const { control, filters } = await request.json();
  const challenge = {
    user: locals.user.username,
    rating: 2346,
    control,
  };
  const status = await redis.json.set(
    "challenges",
    `$.${locals.user.id}`,
    challenge
  );

  emitter.to("challenges").emit("challengeCreated", challenge);

  // const count = await redis.json.OBJLEN("challenges");

  // console.log(challenge, count);
  return json(status);
};
