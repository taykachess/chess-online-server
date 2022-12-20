import { Chess } from "chess.js";
import { v4 as uuid } from "uuid";

import { deleteGame, setGame } from "../../global/games";

import {
  TIME_TO_CANCEL_GAME,
  TOURNAMENT_GAME_PREPARE_TIME,
} from "../../variables/redisIndex";

import type { Game, Player } from "../../types/game";
import { setGameOver } from "./setGameOver";
import { setGameTimeoutInitial } from "../../global/timers";
import { changeTime } from "./changeTime";

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
    pgn: "",
    white: data.white,
    black: data.black,
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
    const randomResult = Math.floor(Math.random() * 3);
    if (data.tournamentId) {
      await setGameOver({
        gameId,
        result: randomResult == 0 ? "0" : randomResult == 1 ? "1" : "0.5",
        game,
      });
      return;
    }

    // await changeTime({
    //   gameId,
    //   increment: game.increment,
    //   tsmp: game.tsmp,
    //   turn: "w",
    //   game,
    // });
    await setGameOver({
      gameId,
      result: randomResult == 0 ? "0" : randomResult == 1 ? "1" : "0.5",
      game,
    });
  };
  //  В турнире должно быть game.time[0]
  if (data.tournamentId)
    setGameTimeoutInitial(
      gameId,
      initialFn,
      randomTime + TOURNAMENT_GAME_PREPARE_TIME
    );
  else setGameTimeoutInitial(gameId, initialFn, randomTime);

  if (data.matchId) game.matchId = data.matchId;
  if (data.tournamentId) {
    game.tournamentId = data.tournamentId;
    game.round = data.round;
    game.board = data.board;
  }

  await setGame(gameId, game);

  return gameId;
}
