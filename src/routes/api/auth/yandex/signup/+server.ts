import type { RequestHandler } from './$types'
import { JWT_SECRET, YANDEX_SECRET } from '$env/static/private'
import base64 from 'base-64'
import { error, redirect } from '@sveltejs/kit'
import { prisma } from '$lib/db/prisma'
import jwt from 'jsonwebtoken'

export const GET: RequestHandler = async ({ url, fetch, cookies }) => {
  const code = url.searchParams.get('code')
  const username = url.searchParams.get('state')

  if (!username) throw error(403, 'Username not defined')
  const userValidation = (username.match(/^[a-zA-Z0-9]{5,18}$/g) || []).length == 1

  if (!userValidation) throw error(400, 'Validation wrong')

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (user) throw error(400, 'User with the same username was found')

  const yandexClient = '8e344c0640bf44988536c700491a911a'

  const data = await fetch(`https://oauth.yandex.ru/token`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${base64.encode(`${yandexClient}:${YANDEX_SECRET}`)}`,
    },
    body: `grant_type=authorization_code&code=${code}`,
  })

  if (data.status != 200) throw error(403, 'Something wrong')

  const dataJson = await data.json()

  const info = await fetch(`https://login.yandex.ru/info`, {
    headers: {
      Authorization: `OAuth ${dataJson.access_token}`,
    },
  })

  if (info.status != 200) throw error(404, 'Info not found')

  const infoJson = await info.json()

  const createdUser = await prisma.user.create({
    data: {
      username,
      email: infoJson.default_email,
      yandex: infoJson.id,
    },
    select: { username: true, roles: true },
  })

  if (!createdUser) throw Error('Something wrong with user creation')

  const token = jwt.sign(createdUser.username, JWT_SECRET)
  cookies.set('token', token, {
    path: '/',
    httpOnly: false,
  })
  throw redirect(302, '/')
}
