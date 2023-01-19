import { redis } from '$lib/db/redis'
import { json } from '@sveltejs/kit'

import { MATCHES_IN_PROGRESS_REDIS } from '$sockets/variables/redisIndex'
import type { RequestHandler } from './$types'
import { prisma } from '$sockets/global/prisma'

export const GET: RequestHandler = async ({ params }) => {
  const { id } = params

  const match = await prisma.match.findUnique({
    where: {
      id,
    },
    select: {
      periodsData: true,
      resultsData: true,
      player1: true,
      player2: true,
      stage: true,
      type: true,
      tsmp: true,
      status: true,
      currentGame: true,
    },
  })

  // console.log("MatchId", id);
  // const match = await redis.json.get(MATCHES_IN_PROGRESS_REDIS, {
  //   path: `$.${id}`,
  // });

  return json(match)
}
