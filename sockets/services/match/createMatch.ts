import { Chess } from "chess.js";
import { v4 as uuid } from "uuid";

import { deleteGame, setGame } from "../../global/games";

import { PLAYERINGAME, TIME_TO_CANCEL_GAME } from "../../variables/redisIndex";

import type { Player } from "../../types/game";
import type { SocketRemoteType, SocketType } from "../../types/sockets";
import { redis } from "../../global/redis";
import { setMatch } from "../../global/matches";
import { Match } from "../../types/match";

export async function createGame({
  sockets,
  data,
}: {
  sockets: [socket1: SocketType, socket2: SocketRemoteType];
  data: {
    white: Player;
    black: Player;
    control: string;
    rounds: number;
  };
}) {
  if (!sockets[0].data?.username || !sockets[1].data?.username)
    throw Error("User can't be found");

  const matchId = uuid();
  //   player1: string;
  //   player2: string;
  //   rounds: number;
  //   result: { white: string; black: string; result: Result; gameId: string }[];
  //   armageddon: boolean;
  const match: Match = {
    player1: data.white.username,
    player2: data.black.username,
    rounds: data.rounds,
    result: [],
    armageddon: false,
  };
  setMatch(matchId, match);
  const gameId = uuid();

  //   Set game inside memory
  const timerId = setInterval(() => {
    deleteGame(gameId);
  }, TIME_TO_CANCEL_GAME);
  setGame(gameId, {
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
    matchId: matchId,
  });

  //   sockets[0].emit("game:started", { gameId: generatedId });
  //   sockets[1].emit("game:started", { gameId: generatedId });

  // await Promise.all([
  //   redis.SADD(PLAYERINGAME(data.white.username), generatedId);
  //   redis.SADD(PLAYERINGAME(data.black.username), generatedId);
  // ]);
}
