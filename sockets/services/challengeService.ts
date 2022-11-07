// @ts-nocheck
import { prisma } from "../global/prisma";
import { redis } from "../global/redis";
import { SocketType } from "../types";
export function onChallengeSub(this: SocketType) {
  const socket = this;
  console.log(socket.id, "ready yo get challenges");
  socket.join("challenges");
}

export async function onChallengeCreate(this: SocketType, data: any) {
  try {
    const socket = this;
    const { control, filters } = data;
    console.log("control ", control);
    const user = await prisma.user.findFirst({
      where: { id: socket.data.id },
      select: { rating: true },
    });

    const challenge = {
      id: socket.data.id,
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
    await redis.json.set("challenges", `$.${socket.data.id}`, challenge);

    socket.to("challenges").emit("challenge:created", challenge);
  } catch (error) {
    console.log(error);
  }
}

function isSuitableChallengeExists() {
  return false;
}
