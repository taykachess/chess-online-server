import { io } from "../../global/io";
import { redis } from "../../global/redis";
import { prisma } from "../../global/prisma";

import { createGame } from "../../services/game/createGame";

import { CHALLENGES } from "../../variables/redisIndex";

import type { GetChallenge } from "../../types/challenge";
import type { SocketType } from "../../types/sockets";

export async function onChallengeAccept(
  this: SocketType,
  { username }: { username: string }
) {
  const socket = this;

  try {
    //   @ts-ignore
    const challenge: GetChallenge = await redis.json.get(CHALLENGES, {
      path: username,
    });

    if (!challenge) throw Error("Challenge not found");

    if (challenge.socketId == socket.id)
      throw Error("You can't accept your own challenge");

    const [socket2] = await io.in(`${challenge.socketId}`).fetchSockets();

    if (!socket.data?.username || !socket2.data?.username)
      throw Error("The both user must have username");

    const user = await prisma.user.findFirst({
      where: { username: socket.data.username },
      select: { rating: true, title: true },
    });
    const userOpponent = await prisma.user.findFirst({
      where: { username: socket2.data.username },
      select: { rating: true, title: true },
    });
    if (!userOpponent || !user) throw Error("User not found");

    await createGame({
      sockets: [socket, socket2],
      data: {
        white: {
          username: socket.data.username,
          rating: +user.rating,
          title: user.title,
        },
        black: {
          username: socket2.data.username,
          rating: +userOpponent?.rating,
          title: userOpponent.title,
        },
        control: challenge.control,
      },
    });

    await redis.json.del(CHALLENGES, `$.${socket.data.username}`);
    await redis.json.del(CHALLENGES, `$.${socket2.data.username}`);
  } catch (error) {
    console.error(error);
  }
}
