import { prisma } from '$lib/db/prisma'
import { emitter, redis } from '$lib/db/redis'
import { TOURNAMENTS_IN_PROGRESS_REDIS, TOURNAMENT_ROOM } from '$sockets/variables/redisIndex'
import type { PlayerSwiss } from '$types/tournament'
import { error } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ params, locals }) => {
  const tournament = await prisma.tournament.findUnique({
    where: { id: params.id },
    select: {
      participants: {
        where: { username: locals.user.username },
      },
      status: true,
    },
  })

  if (!tournament || tournament.status != 'running') return error(404)

  // Продолжить игру, в ранее зарегистрированном турнире

  if (tournament.participants.length == 1) {
    const status = await redis.json.set(TOURNAMENTS_IN_PROGRESS_REDIS, `$.${params.id}.players["${locals.user.username}"].active`, true)

    emitter.to(TOURNAMENT_ROOM(params.id)).emit('tournament:continue', { username: locals.user.username })

    console.log('Player registered ')

    return new Response(status)
  } else if (tournament?.participants.length == 0) {
    // Зарегистрироваться в уже проходящем турнире

    const user = await prisma.user.update({
      where: { username: locals.user.username },
      data: {
        participant: {
          connect: {
            id: params.id,
          },
        },
      },
    })

    const player: PlayerSwiss = {
      id: user.username,
      score: 0,
      rating: user.rating,
      colors: 1,
      avoid: [],
      coefficient: { buchholz: 0 },
      matches: [],
      pairedUpDown: false,
      receivedBye: false,
      title: user.title,
      active: true,
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const status = await redis.json.set(TOURNAMENTS_IN_PROGRESS_REDIS, `$.${params.id}.players["${locals.user.username}"]`, player)

    emitter.to(TOURNAMENT_ROOM(params.id)).emit('tournament:entry', player)
    console.log('Player registered and set to redis')
    return new Response(status)
  }
}
