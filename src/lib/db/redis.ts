import { Emitter } from '@socket.io/redis-emitter'
import { createClient } from 'redis'

import type { ServerToClientEvents } from '$types/sockets'

const redis = createClient()

await redis.connect()
const emitter = new Emitter<ServerToClientEvents>(redis)

export { redis, emitter }
