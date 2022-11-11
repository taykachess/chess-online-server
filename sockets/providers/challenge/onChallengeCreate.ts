import { prisma } from "../../global/prisma";
import { setJsonRedis } from "../../services/redis/setJsonRedis";
import { getSuitableChallenges } from "../../services/challenge/getSuitableChallenges";
import { CHALLENGES } from "../../variables/redisIndex";
import type { SocketType } from "../../types";
import { io } from "../../global/io";

import { GetChallenge } from "../../../src/types/home/Challenge";

export async function onChallengeCreate(this: SocketType, data: any) {
  try {
    const socket = this;

    const { control } = data;
    const user = await prisma.user.findFirst({
      where: { id: socket.data.id },
      select: { rating: true, filters: true },
    });
    if (!user) throw Error("User not found");

    const challenge: Partial<GetChallenge> = {
      user: socket.data.username,
      rating: +user?.rating,
      control,
      socketId: socket.id,
      // @ts-ignore
      filters: user.filters,
    };

    let ratingFilter: { min: number; max: number } = {
      // @ts-ignore
      min: user.filters.min,
      // @ts-ignore
      max: user.filters.max,
    };
    if (ratingFilter.max == 500 && ratingFilter.min == -500)
      ratingFilter = { min: 0, max: 5000 };
    else {
      ratingFilter.max = ratingFilter.max + +user.rating;
      ratingFilter.min = ratingFilter.min + +user.rating;
    }
    const existChallenges: GetChallenge[] = await getSuitableChallenges({
      min: ratingFilter.min,
      max: ratingFilter.max,
      control,
      rating: +user?.rating,
    });

    if (existChallenges?.length) {
      const choosenChallenge = existChallenges[0];
      const [socket2] = await io
        .in(`${choosenChallenge.socketId}`)
        .fetchSockets();

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
