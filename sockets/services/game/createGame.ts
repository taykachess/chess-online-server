import { Chess } from "chess.js";
import { v4 as uuid } from "uuid";

import { deleteGame, setGame } from "../../global/games";

import { TIME_TO_CANCEL_GAME } from "../../variables/redisIndex";

import type { Game, Player } from "../../types/game";
import { setGameOver } from "./setGameOver";

export async function createGame({
  data,
}: {
  data: {
    white: Player;
    black: Player;
    control: string;
    matchId?: string;

    tournamentId?: string;
    round?: number;
    board?: number;
  };
}) {
  const gameId = uuid();

  // TODO: Узнать что за ошибка с маленьким временем
  const randomTime = Math.floor(Math.random() * 50) * 1000 + 5000;
  // Set game inside memory
  const timerId = setInterval(() => {
    const randomResult = Math.floor(Math.random() * 3);

    // console.log(randomResult);
    setGameOver({
      gameId,
      result: randomResult == 0 ? "0-1" : randomResult == 1 ? "1-0" : "0.5-0.5",
    });
    // deleteGame(gameId);
  }, randomTime);

  // console.log("white", data.white, "black", data.black);
  const game: Game = {
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
  };

  if (data.matchId) game.matchId = data.matchId;
  if (data.tournamentId) {
    game.tournamentId = data.tournamentId;
    game.round = data.round;
    game.board = data.board;
  }

  setGame(gameId, game);

  return gameId;
}
