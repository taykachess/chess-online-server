import { prisma } from '$lib/db/prisma'
import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import type { Prisma } from '@prisma/client'
export const GET: RequestHandler = async ({ request, locals, url }) => {
  const whereParam: Prisma.TournamentWhereInput = {}
  const register = url.searchParams.get('register')
  const created = url.searchParams.get('created')

  console.log(created)
  console.log(locals.user, register)
  if (!locals.user) throw error(403)
  if (register === 'yes') {
    whereParam.participants = {
      some: { username: locals.user.username },
    }
  }
  if (created === 'yes') {
    whereParam.organizerId = locals.user.username
  }

  const count = await prisma.tournament.count({
    where: {
      status: { in: ['registration', 'running'] },
      // participants: {
      //   some: { username: locals.user.username },
      // },
      // organizerId: "",
      // organizer:{is:{username:"fdg"}},
      ...whereParam,
    },
  })

  return json(count)
}
