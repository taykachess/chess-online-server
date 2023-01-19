import { emitter, redis } from '$lib/db/redis'
import { TOURNAMENTS_IN_PROGRESS_REDIS, TOURNAMENT_ROOM } from '$sockets/variables/redisIndex'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ params, locals }) => {
  const status = await redis.json.set(TOURNAMENTS_IN_PROGRESS_REDIS, `$.${params.id}.players["${locals.user.username}"].active`, false)

  // prettier-ignore
  emitter.to(TOURNAMENT_ROOM(params.id)).emit("tournament:pause", {username:locals.user.username});

  return new Response(status)
}
