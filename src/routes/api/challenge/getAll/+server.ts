import { redis } from "$lib/db/redis";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
  const challenges = await redis.json.get("challenges");
  return json(challenges);
};
