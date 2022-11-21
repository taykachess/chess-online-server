import { Chess } from "chess.js";
import { v4 as uuid } from "uuid";

import { deleteGame, setGame } from "../../global/games";

import { TIME_TO_CANCEL_GAME } from "../../variables/redisIndex";

import type { Player } from "../../types/game";

export async function createGame({
  data,
}: {
  data: {
    white: Player;
    black: Player;
    control: string;
    matchId?: string;
  };
}) {
  const gameId = uuid();

  // Set game inside memory
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
  });

  return gameId;
}
