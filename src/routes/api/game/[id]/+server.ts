import { prisma } from "$lib/db/prisma";
import { redis } from "$lib/db/redis";
import { GAMES_REDIS } from "$sockets/variables/redisIndex";
import type { Game, GetGame } from "$types/game";
import { json } from "@sveltejs/kit";
import { Chess } from "cm-chess";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params }) => {
  console.log("got req getGame", params);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [game]: [Game] = await redis.json.get(GAMES_REDIS, {
    path: `$.${params.id}`,
  });

  if (!game) {
    const prismaGame = await prisma.game.findFirst({
      where: { id: params.id },
      select: {
        white: true,
        black: true,
        time: true,
        result: true,
        pgn: true,
      },
    });

    return json(prismaGame);
  }

  const chess = new Chess();
  chess.loadPgn(game.pgn);

  const { white, black, time, result } = game;

  const turn = chess.turn();
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
    pgn: game.pgn,
    result,
    increment: game.increment,
    lastOfferDraw: game.lastOfferDraw,
  };

  if (game.matchId) callbackData.matchId = game.matchId;

  return json(callbackData);
};

// import { getGame } from "../../global/games";
// import { prisma } from "../../global/prisma";

// import { GAME_ROOM, MATCH_ROOM } from "../../variables/redisIndex";

// import type { SocketType } from "../../types/sockets";
// import type { GetGame } from "../../types/game";
// import { Chess } from "chess.js";

// export async function onGameGet(
//   this: SocketType,
//   { gameId }: { gameId: string },
//   cb: (data: GetGame) => void
// ) {
//   try {
//     const socket = this;
//     const [game] = await getGame(gameId);
//     console.log("game", game);
//     // console.log("goood", game);

//     if (!game) {
//       const prismaGame = await prisma.game.findFirst({
//         where: { id: gameId },
//         select: {
//           white: true,
//           black: true,
//           time: true,
//           result: true,
//           pgn: true,
//         },
//       });
//       // @ts-ignore
//       return cb({ ...prismaGame });
//     }

//     // ОЧень опасное место возможно стоит это делать на клиенте!
//     //
//     if (game.matchId) socket.join(MATCH_ROOM(game.matchId));
//     const chess = new Chess();
//     chess.loadPgn(game.pgn);
//     // const pgn = game.chess.pgn();
//     const { white, black, time, result } = game;

//     const turn = chess.turn();
//     const timeWithDifference: [number, number] = [time[0], time[1]];
//     if (turn == "w") {
//       timeWithDifference[0] =
//         timeWithDifference[0] - (new Date().getTime() - game.tsmp);
//     } else {
//       timeWithDifference[1] =
//         timeWithDifference[1] - (new Date().getTime() - game.tsmp);
//     }

//     const callbackData: GetGame = {
//       white,
//       black,
//       time: timeWithDifference,
//       pgn: game.pgn,
//       result,
//       increment: game.increment,
//       lastOfferDraw: game.lastOfferDraw,
//     };

//     if (game.matchId) callbackData.matchId = game.matchId;

//     cb(callbackData);
//   } catch (error) {
//     console.log(error);
//   }
// }
