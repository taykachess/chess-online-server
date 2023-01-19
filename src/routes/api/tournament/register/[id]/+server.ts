import { prisma } from '$lib/db/prisma'
import { emitter } from '$lib/db/redis'
import { TOURNAMENT_ROOM } from '$sockets/variables/redisIndex'
import { error } from '@sveltejs/kit'

import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ params, locals }) => {
  const tournament = await prisma.tournament.findUnique({
    where: { id: params.id },
    select: {
      status: true,
    },
  })

  if (tournament?.status != 'registration') return error(406)
  const user = await prisma.user.update({
    where: {
      username: locals.user.username,
    },
    data: {
      participant: {
        connect: {
          id: params.id,
        },
      },
    },
    select: {
      username: true,
      title: true,
      rating: true,
    },
  })

  if (!user) throw error(404)
  emitter.to(TOURNAMENT_ROOM(params.id)).emit('tournament:register', user)
  return new Response('ok')
}
