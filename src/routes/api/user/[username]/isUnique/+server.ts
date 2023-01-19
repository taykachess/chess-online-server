import { prisma } from '$lib/db/prisma'
import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ params }) => {
  const user = await prisma.user.findUnique({
    where: {
      username: params.username,
    },
  })

  if (!user) return json(true)
  return json(false)
}
