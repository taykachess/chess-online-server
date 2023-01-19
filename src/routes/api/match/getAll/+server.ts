import { redis } from '$lib/db/redis'
import { json } from '@sveltejs/kit'

import { MATCHES_REDIS } from '$sockets/variables/redisIndex'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async () => {
  const matches = await redis.json.get(MATCHES_REDIS)
  console.log('matches', matches)
  return json(matches)
}
