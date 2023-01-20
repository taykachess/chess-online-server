import { loginSchema } from '$lib/validate/registerUser'
import { error, json } from '@sveltejs/kit'
import { prisma } from '$lib/db/prisma'

import type { RequestHandler } from './$types'
import { compare } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { JWT_SECRET } from '$env/static/private'

export const POST: RequestHandler = async ({ request, cookies }) => {
  const data = (await request.json()) as { username: string; password: string }

  const { username, password } = data

  try {
    loginSchema.parse(data)
  } catch (err) {
    throw error(403, {
      message: 'Validation problem',
    })
  }

  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      hashedPassword: true,
      username: true,
      roles: true,
      rating: true,
      title: true,
    },
  })

  if (!user || !user.hashedPassword) {
    throw error(400, {
      message: 'Not pass method was used',
    })
  }

  const result = await compare(password, user.hashedPassword)

  if (!result) {
    throw error(400, {
      message: 'pass or username are incorrect',
    })
  }

  const token = sign(user.username, JWT_SECRET)
  cookies.set('token', token, {
    path: '/',
    httpOnly: false,
  })

  return json(token)
}
