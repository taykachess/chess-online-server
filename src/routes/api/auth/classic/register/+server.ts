import { registerSchema } from '$lib/validate/registerUser'
import type { createUserEmailPassDto } from '$types/user'
import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { prisma } from '$lib/db/prisma'
import { hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { JWT_SECRET } from '$env/static/private'

export const POST: RequestHandler = async ({ request, cookies }) => {
  const data = (await request.json()) as createUserEmailPassDto
  const username = data.username
  const password = data.password
  const email = data.email
  console.log('got req', data)

  try {
    registerSchema.parse(data)
  } catch (err) {
    throw error(400, { message: 'Validation failed' })
  }

  const userWithUsername = await prisma.user.findUnique({
    where: { username },
  })
  if (userWithUsername) throw error(400, { message: 'Already exist' })
  const salt = 10
  const hashedPassword = await hash(password, salt)

  const user = await prisma.user.create({
    data: {
      email,
      username,
      hashedPassword,
    },
    select: { username: true },
  })
  const token = sign(user.username, JWT_SECRET)

  cookies.set('token', token, {
    httpOnly: false,
    path: '/',
  })

  return json(token)
}
