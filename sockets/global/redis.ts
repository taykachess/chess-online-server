import { createClient } from 'redis'

const redis = createClient()

const pubClient = createClient()
const subClient = pubClient.duplicate()

;(async () => {
  redis.on('error', (err) => console.log('Redis Client Error', err))
  await redis.connect()
})()

if (process.env.NODE_ENV == 'dev') {
  console.log('Redis cleared')
  ;(async () => {
    await redis.flushAll()
  })()
}

redis.json.set('challenges', `$`, {})
redis.json.set('tournamentsInProgress', `$`, {})

export { redis, pubClient, subClient }
