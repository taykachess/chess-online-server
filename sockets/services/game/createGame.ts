import { Chess } from "chess.js";
import { v4 as uuid } from "uuid";

import { setGame } from "../../global/games";

import { TOURNAMENT_GAME_PREPARE_TIME } from "../../variables/redisIndex";

import type { Game, Player } from "../../types/game";
import { setGameOver } from "./setGameOver";
import { setGameTimeoutInitial } from "../../global/timers";

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

  const game: Game = {
    white: data.white,
    black: data.black,
    chess: new Chess(),
    time: [
      +data.control.split("+")[0] * 60 * 1000,
      +data.control.split("+")[0] * 60 * 1000,
    ],
    ply: 0,
    tsmp: new Date().getTime(),
    increment: +data.control.split("+")[1],
    result: "*",
    control: data.control,
  };

  const randomTime = Math.floor(Math.random() * 5) * 1000 + 3000;

  const initialFn = async () => {
    // const randomResult = Math.floor(Math.random() * 3);
    // if (data.tournamentId) {
    await setGameOver({
      gameId,
      result: "0",
      // result: randomResult == 0 ? "0" : randomResult == 1 ? "1" : "0.5",
      game,
    });
    //   return;
    // }
  };
  //  В турнире должно быть game.time[0]
  if (data.tournamentId)
    setGameTimeoutInitial(
      gameId,
      initialFn,
      game.time[0] + TOURNAMENT_GAME_PREPARE_TIME
    );
  else setGameTimeoutInitial(gameId, initialFn, game.time[0]);

  if (data.matchId) game.matchId = data.matchId;
  if (data.tournamentId) {
    game.tournamentId = data.tournamentId;
    game.round = data.round;
    game.board = data.board;
  }

  setGame(gameId, game);

  return gameId;
}
