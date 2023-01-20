import { redis } from '../../global/redis'
import { CHALLENGES_REDIS, CHALLENGES_ROOM, MATCHES_REDIS_GOT, USER_ROOM } from '../../variables/redisIndex'

import type { SocketType } from '../../types/sockets'

export async function onDisconnect(this: SocketType) {
  const socket = this

  if (socket.data.matchSended) {
    redis.hDel(MATCHES_REDIS_GOT(socket.data.matchSended), `${socket.data.username}`)
    if (socket.data.username) socket.to(USER_ROOM(socket.data.matchSended)).emit('match:private:cancelled', socket.data.username)
  }

  const deleteSendedChallenge = redis.json.del(CHALLENGES_REDIS, `$.${socket.data.username ? socket.data.username : socket.id}`)
  const [status] = await Promise.all([deleteSendedChallenge])

  if (status) socket.to(CHALLENGES_ROOM).emit('challenge:deleted', { socketId: socket.id })
}
