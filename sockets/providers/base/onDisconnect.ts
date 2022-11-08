import { delJsonRedis } from "../../services/redis/delJsonRedis";
import { CHALLENGES } from "../../variables/redisIndex";

import type { SocketType } from "../../types";

export async function onDisconnect(this: SocketType) {
  const socket = this;

  const status = await delJsonRedis({
    index: CHALLENGES,
    path: `$.${socket.id}`,
  });

  if (status)
    socket
      .to("challenges")
      .emit("challenge:deleted", { username: socket.data.username });
}
