import { Chess } from "chess.js";
import { v4 as uuid } from "uuid";

import { deleteGame, setGame } from "../../global/games";

import { PLAYERINGAME, TIME_TO_CANCEL_GAME } from "../../variables/redisIndex";

import type { Player } from "../../types/game";
import type { SocketRemoteType, SocketType } from "../../types/sockets";
import { redis } from "../../global/redis";

export async function createGame({
  sockets,
  data,
}: {
  sockets: [socket1: SocketType, socket2: SocketRemoteType];
  data: {
    white: Player;
    black: Player;
    control: string;
  };
}) {
  if (!sockets[0].data?.username || !sockets[1].data?.username)
    throw Error("User can't be found");

  const generatedId = uuid();

  // Set game inside memory
  const timerId = setInterval(() => {
    deleteGame(generatedId);
  }, TIME_TO_CANCEL_GAME);
  setGame(generatedId, {
    chess: new Chess(),
    white: data.white,
    black: data.black,
    time: [
      +data.control.split("+")[0] * 60 * 1000,
      +data.control.split("+")[0] * 60 * 1000,
    ],
    ply: 0,
    tsmp: new Date().getTime(),
    increment: +data.control.split("+")[1],
    timerId,
    result: "*",
    control: data.control,
  });

  sockets[0].emit("game:started", { gameId: generatedId });
  sockets[1].emit("game:started", { gameId: generatedId });

  // await Promise.all([
  redis.SADD(PLAYERINGAME(data.white.username), generatedId);
  redis.SADD(PLAYERINGAME(data.black.username), generatedId);
  // ]);
}
