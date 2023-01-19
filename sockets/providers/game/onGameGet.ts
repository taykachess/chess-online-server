import { getGame } from "../../global/games";
import { prisma } from "../../global/prisma";

import {
  GAME_ROOM,
  MATCH_ROOM,
  TOURNAMENT_GAME_PREPARE_TIME,
} from "../../variables/redisIndex";

import type { SocketType } from "../../types/sockets";
import type { GetGame } from "../../types/game";
import { Chess } from "chess.js";

export async function onGameGet(
  this: SocketType,
  { gameId }: { gameId: string },
  cb: (data: GetGame) => void
) {
  try {
    const socket = this;
    const [game] = getGame(gameId);
    if (!game) {
      const prismaGame = await prisma.game.findFirst({
        where: { id: gameId },
        select: {
          white: true,
          black: true,
          time: true,
          result: true,
          pgn: true,
          matchId: true,
        },
      });

      // @ts-ignore
      if (prismaGame) cb(prismaGame);
    }

    socket.join(GAME_ROOM(gameId));

    const chess = game.chess;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // chess.loadPgn(game.pgn);

    const { white, black, time, result } = game;

    const turn = chess.turn();
    const timeWithDifference: [number, number] = [time[0], time[1]];
    const now = new Date().getTime();
    const gameProcessTime = now - game.tsmp;
    if (game.tournamentId && game.ply == 0) {
      if (gameProcessTime < TOURNAMENT_GAME_PREPARE_TIME) {
        // console.log("do nothing");
      } else {
        if (turn == "w") {
          timeWithDifference[0] =
            timeWithDifference[0] -
            gameProcessTime +
            TOURNAMENT_GAME_PREPARE_TIME;
        } else {
          timeWithDifference[1] =
            timeWithDifference[1] -
            gameProcessTime +
            TOURNAMENT_GAME_PREPARE_TIME;
        }
      }
    } else if (turn == "w") {
      timeWithDifference[0] = timeWithDifference[0] - gameProcessTime;
    } else {
      timeWithDifference[1] = timeWithDifference[1] - gameProcessTime;
    }

    const callbackData: GetGame = {
      white,
      black,
      time: timeWithDifference,
      pgn: game.chess.pgn(),
      result,
      increment: game.increment,
      lastOfferDraw: game.lastOfferDraw,
      tsmp: game.tsmp,
    };

    if (game.matchId) callbackData.matchId = game.matchId;
    if (game.tournamentId) callbackData.tournamentId = game.tournamentId;

    cb(callbackData);

    // if (!game) {
    //   const prismaGame = await prisma.game.findFirst({
    //     where: { id: gameId },
    //     select: {
    //       white: true,
    //       black: true,
    //       time: true,
    //       result: true,
    //       pgn: true,
    //     },
    //   });
    //   // @ts-ignore
    //   return cb({ ...prismaGame });
    // }

    // // ОЧень опасное место возможно стоит это делать на клиенте!
    // //
    // socket.join(GAME_ROOM(gameId));

    // console.log(socket.data.username, "join room", gameId);
    // if (game.matchId) socket.join(MATCH_ROOM(game.matchId));
    // const chess = game.chess;
    // // chess.loadPgn(game.chess.pgn);
    // // const pgn = game.chess.pgn();
    // const { white, black, time, result } = game;

    // const turn = chess.turn();
    // const timeWithDifference: [number, number] = [time[0], time[1]];
    // if (turn == "w") {
    //   timeWithDifference[0] =
    //     timeWithDifference[0] - (new Date().getTime() - game.tsmp);
    // } else {
    //   timeWithDifference[1] =
    //     timeWithDifference[1] - (new Date().getTime() - game.tsmp);
    // }

    // const callbackData: GetGame = {
    //   white,
    //   black,
    //   time: timeWithDifference,
    //   pgn: game.chess.pgn(),
    //   result,
    //   increment: game.increment,
    //   lastOfferDraw: game.lastOfferDraw,
    //   tsmp: game.tsmp,
    // };

    // if (game.matchId) callbackData.matchId = game.matchId;

    // cb(callbackData);
  } catch (error) {
    // console.log(error);
  }
}
