import { redis } from "$lib/db/redis";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ request, locals, url }) => {
  const count = await redis.json.OBJLEN("challenges");
  return json(count);
};
