import { prisma } from '$lib/db/prisma'
import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ params }) => {
  const users = await prisma.user.findMany({
    where: {
      username: {
        startsWith: params.username,
        mode: 'insensitive',
      },
    },
    take: 5,
    select: {
      username: true,
    },
  })
  return json(users)
}
