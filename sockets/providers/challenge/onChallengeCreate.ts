import { prisma } from "../../global/prisma";
import { setJsonRedis } from "../../services/redis/setJsonRedis";
import { isSuitableChallengeExists } from "../../services/challenge/isSuitableChallengeExists";
import { CHALLENGES } from "../../variables/redisIndex";

import type { SocketType } from "../../types";

export async function onChallengeCreate(this: SocketType, data: any) {
  try {
    const socket = this;

    const { control, filters } = data;
    const user = await prisma.user.findFirst({
      where: { id: socket.data.id },
      select: { rating: true },
    });

    const challenge = {
      user: socket.data.username,
      rating: user?.rating,
      control,
      socket: socket.id,
    };

    if (isSuitableChallengeExists()) {
      /* ... */
      return;
    }
    console.log(challenge);
    const status = await setJsonRedis({
      index: CHALLENGES,
      path: `$.${socket.id}`,
      data: challenge,
    });

    if (status === "OK")
      socket.to("challenges").emit("challenge:created", challenge);
  } catch (error) {
    console.log(error);
  }
}
