import { JWT_SECRET } from '$env/static/private'
import type { Handle } from '@sveltejs/kit'
import jwt from 'jsonwebtoken'
import type { DecodedUser } from '$types/user'
export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get('token')
  if (!token) {
    return await resolve(event)
  }
  try {
    const decodedUser = jwt.verify(token, JWT_SECRET) as string
    event.locals.user = { username: decodedUser }
  } catch (error) {
    event.cookies.delete('token')
  }

  const response = await resolve(event)
  return response
}
