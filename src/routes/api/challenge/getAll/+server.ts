// import { json } from '@sveltejs/kit';
// import type { RequestHandler } from './$types';

// export const GET: RequestHandler = async ({ request }) => {
//   const { a, b } = await request.json();
//   return json(a + b);
// }
import { redis } from "$lib/db/redis";
import type { getTournament } from "$types/home/tournament";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
  const challenges = await redis.json.get("challenges");

  return json(challenges);
};
