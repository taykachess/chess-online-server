import { getGame } from "../../global/games";
import { prisma } from "../../global/prisma";

import { GAME_ROOM, MATCH_ROOM } from "../../variables/redisIndex";

import type { SocketType } from "../../types/sockets";
import type { GetGame } from "../../types/game";

export async function onGameGet(
  this: SocketType,
  { gameId }: { gameId: string },
  cb: (data: GetGame) => void
) {
  try {
    const socket = this;
    const game = getGame(gameId);
    // console.log("goood", game);

    if (!game) {
      const prismaGame = await prisma.game.findFirst({
        where: { id: gameId },
        select: {
          white: true,
          black: true,
          time: true,
          result: true,
          pgn: true,
        },
      });
      // @ts-ignore
      return cb({ ...prismaGame });
    }

    socket.join(GAME_ROOM(gameId));
    // ОЧень опасное место возможно стоит это делать на клиенте!
    //
    if (game.matchId) socket.join(MATCH_ROOM(game.matchId));
    const pgn = game.chess.pgn();
    const { white, black, time, result } = game;

    const turn = game.chess.turn();
    const timeWithDifference: [number, number] = [time[0], time[1]];
    if (turn == "w") {
      timeWithDifference[0] =
        timeWithDifference[0] - (new Date().getTime() - game.tsmp);
    } else {
      timeWithDifference[1] =
        timeWithDifference[1] - (new Date().getTime() - game.tsmp);
    }

    const callbackData: GetGame = {
      white,
      black,
      time: timeWithDifference,
      pgn,
      result,
      increment: game.increment,
      lastOfferDraw: game.lastOfferDraw,
    };

    if (game.matchId) callbackData.matchId = game.matchId;

    cb(callbackData);
  } catch (error) {
    console.log(error);
  }
}
