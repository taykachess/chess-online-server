import type { RequestHandler } from './$types'
import { JWT_SECRET } from '$env/static/private'
import { error, redirect } from '@sveltejs/kit'
import { prisma } from '$lib/db/prisma'
import jwt from 'jsonwebtoken'
import type { Title } from '@prisma/client'
import { dev } from '$app/environment'
import { PUBLIC_APP_DEV_URL, PUBLIC_APP_PROD_URL } from '$env/static/public'

export const GET: RequestHandler = async ({ url, fetch, cookies }) => {
  const code = url.searchParams.get('code')
  const username = url.searchParams.get('state')
  console.log(code, username)

  if (!username) throw error(403, 'Username not defined')
  const userValidation = (username.match(/^[a-zA-Z0-9]{5,18}$/g) || []).length == 1

  if (!userValidation) throw error(400, 'Validation wrong')

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (user) throw error(400, 'User with the same username was found')

  const redirect_uri = `${dev ? PUBLIC_APP_DEV_URL : PUBLIC_APP_PROD_URL}/api/auth/lichess/signup`
  const code_verifier = 'jGzNmyHmiVzpFL8HPebJkZ0y1e_9_8WbOrVilg4Q8YI'

  const client_id = 'svelte-chess'
  const grant_type = 'authorization_code'

  const data = await fetch('https://lichess.org/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type,
      redirect_uri,
      client_id,
      code,
      code_verifier,
    }),
  })

  const dataJson = await data.json()
  console.log(dataJson)

  if (data.status != 200) throw error(403, 'Something wrong')

  const info = await fetch('https://lichess.org/api/account', {
    headers: {
      Authorization: `Bearer ${dataJson.access_token}`,
    },
  })

  const infoJson = await info.json()
  let title = undefined
  if (infoJson.title) {
    title = (infoJson.title as string).toUpperCase() as Title
  }

  // title = (infoJson.title as string).toUpperCase() as Title;
  const lichessId = infoJson.id

  const { email } = await (
    await fetch('https://lichess.org/api/account/email', {
      headers: {
        Authorization: `Bearer ${dataJson.access_token}`,
      },
    })
  ).json()

  const createdUser = await prisma.user.create({
    data: {
      username,
      title,
      lichess: lichessId,
      email,
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
