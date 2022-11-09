import { delJsonRedis } from "../../services/redis/delJsonRedis";
import { CHALLENGES } from "../../variables/redisIndex";

import type { SocketType } from "../../types";

export async function onDisconnect(this: SocketType) {
  const socket = this;

  const status = await delJsonRedis({
    index: CHALLENGES,
    path: `$.${socket.data.username ? socket.data.username : socket.id}`,
  });
  console.log("onDisconnect", status, socket.id);
  if (status)
    socket.to("challenges").emit("challenge:deleted", { socketId: socket.id });
}
