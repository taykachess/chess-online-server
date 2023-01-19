import { io } from '../../global/io'
import { redis } from '../../global/redis'

import { CHALLENGES_REDIS, CHALLENGES_ROOM } from '../../variables/redisIndex'

import type { SocketType } from '../../types/sockets'

export async function onChallengeDelete(this: SocketType) {
  const socket = this
  const status = await redis.json.del(CHALLENGES_REDIS, `$.${socket.data.username ? socket.data.username : socket.id}`)
  if (status) io.to(CHALLENGES_ROOM).emit('challenge:deleted', { socketId: socket.id })
}
