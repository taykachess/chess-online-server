import { prisma } from "../../global/prisma";
import { setJsonRedis } from "../../services/redis/setJsonRedis";
import { getSuitableChallenges } from "../../services/challenge/getSuitableChallenges";
import { CHALLENGES } from "../../variables/redisIndex";
import type { SocketType } from "../../types";
import { io } from "../../global/io";

import { GetChallenge } from "../../../src/types/home/Challenge";
import { redis } from "../../global/redis";

export async function onChallengeCreate(this: SocketType, data: any) {
  try {
    const socket = this;

    const { control, filters } = data;
    const user = await prisma.user.findFirst({
      where: { id: socket.data.id },
      select: { rating: true },
    });
    if (!user) throw Error("User not found");

    const challenge: Partial<GetChallenge> = {
      user: socket.data.username,
      rating: +user?.rating,
      control,
      socketId: socket.id,
    };
    const existChallenges = await getSuitableChallenges(
      {
        min: 1000,
        max: 4000,
        control,
      },
      +user?.rating
    );

    if (existChallenges?.length) {
      console.log("Start the game");
      /* ... */
      return;
    }
    console.log(challenge);
    // const status = await redis.json.ARRAPPEND(CHALLENGES, "$", challenge);
    const status = await setJsonRedis({
      index: CHALLENGES,
      path: `${socket.data.username}`,
      data: challenge,
    });

    if (status) io.to("challenges").emit("challenge:created", challenge);
  } catch (error) {
    console.log(error);
  }
}
