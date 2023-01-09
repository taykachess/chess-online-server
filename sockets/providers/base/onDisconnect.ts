import { redis } from "../../global/redis";

// prettier-ignore
import { CHALLENGES_REDIS, CHALLENGES_ROOM,  MATCHES_REDIS_GOT, MATCHES_ROOM } from "../../variables/redisIndex";

import type { SocketType } from "../../types/sockets";

// prettier-ignore
export async function onDisconnect(this: SocketType) {
  const socket = this;

  if(socket.data.matchSended)
    redis.hDel(
      MATCHES_REDIS_GOT(socket.data.matchSended),
      `${socket.data.username}`
    );

  const deleteSendedChallenge = redis.json.del(CHALLENGES_REDIS,`$.${socket.data.username ? socket.data.username : socket.id}`);
  // const deleteSendedMatch = redis.json.del(MATCHES_REDIS,`$.${socket.data.username ? socket.data.username : socket.id}`);
  const [status]= await Promise.all([deleteSendedChallenge])

  if (status)
    socket.to(CHALLENGES_ROOM).emit("challenge:deleted", { socketId: socket.id });
  // if(status2)
  //   socket.to(MATCHES_ROOM).emit("match:deleted", { socketId: socket.id });

}
