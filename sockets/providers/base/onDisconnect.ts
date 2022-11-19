import { redis } from "../../global/redis";

import { CHALLENGES } from "../../variables/redisIndex";

import type { SocketType } from "../../types/sockets";

export async function onDisconnect(this: SocketType) {
  const socket = this;
  const status = await redis.json.del(
    CHALLENGES,
    `$.${socket.data.username ? socket.data.username : socket.id}`
  );

  if (status)
    socket.to("challenges").emit("challenge:deleted", { socketId: socket.id });
}
