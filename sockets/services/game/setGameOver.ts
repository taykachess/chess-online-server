import { deleteGame } from "../../global/games";
import { io } from "../../global/io";
import { prisma } from "../../global/prisma";

import { calculateRating } from "./calculateRating";

import {
  GAME_ROOM,
  PLAYER_IN_GAME_REDIS,
  USER_ROOM,
} from "../../variables/redisIndex";

import type { Game, Result } from "../../types/game";
import { redis } from "../../global/redis";
import { addGame, getMatch } from "../../global/matches";
import { MatchCreateDtoExtended, MatchGame } from "../../types/match";
import { runNextGameInMatch } from "../match/runNextGameInMatch";
import { finishTournamentGame } from "../tournament/finishTournamentGame";
import { Prisma } from "@prisma/client";
import { createMatchGame } from "../match/createMatchGame";

export async function setGameOver({
  gameId,
  result,
  game,
}: {
  gameId: string;
  result: Result;
  game: Game;
}) {
  const { newEloBlack, newEloWhite } = calculateRating({
    eloWhite: game.white.rating,
    eloBlack: game.black.rating,
    result: result,
    control: game.control,
  });
  // setNextRating(gameId,)
  //Здесь не нужно записывать в Редис потому что не используется в дальнейшем
  game.white.ratingNext = newEloWhite;
  game.black.ratingNext = newEloBlack;

  console.log(gameId);
  deleteGame(gameId);

  // console.log();
  const createGame = prisma.game.create({
    data: {
      id: gameId,
      pgn: game.chess.pgn(),
      // @ts-ignore
      white: game.white,
      // @ts-ignore
      black: game.black,
      players: {
        connect: [
          { username: game.white.username },
          { username: game.black.username },
        ],
      },
      result,
      time: game.time,
      control: game.control,
      matchId: game.matchId ? game.matchId : undefined,
    },
  });

  const updateRatingWhite = prisma.user.update({
    where: { username: game.white.username },
    data: { rating: newEloWhite },
  });

  const updateRatingBlack = prisma.user.update({
    where: { username: game.black.username },
    data: { rating: newEloBlack },
  });

  await Promise.all([createGame, updateRatingBlack, updateRatingWhite]);

  // await prisma.$transaction([createGame, updateRatingWhite, updateRatingBlack]);
  // (await io.in(GAME_ROOM(gameId)).fetchSockets()).forEach((socket) => {
  //   console.log("Next sockets must get resign", socket.data?.username);
  // });
  io.to(GAME_ROOM(gameId)).emit("game:end", {
    result,
    newEloWhite,
    newEloBlack,
  });
  io.socketsLeave(GAME_ROOM(gameId));

  const matchId = game.matchId;
  const tournamentId = game.tournamentId;

  // Можно удалить сейчас, когда программа доработает сборщик удалит игру из кэша

  // await Promise.all([
  redis.SREM(PLAYER_IN_GAME_REDIS(game.white.username), gameId);
  redis.SREM(PLAYER_IN_GAME_REDIS(game.black.username), gameId);
  io.to([USER_ROOM(game.white.username), USER_ROOM(game.black.username)]).emit(
    "game:deleteId",
    gameId
  );

  if (matchId) {
    await createMatchGame(
      matchId,
      gameId,
      game.white.username,
      game.black.username,
      result
    );
    // while (periodIndex != match.periods.length && diff > 0) {
    //   periodIndex++;
    //   diff -= match.periods[periodIndex][0] * MINUTE_IN_MILLISECONDS;
    // }
    // let match = await getMatch(matchId);
    // if (!match) return;
    // match = await addGame(matchId, matchGame, match);
    // await runNextGameInMatch({ matchId: matchId, match });
  } else if (tournamentId) {
    await finishTournamentGame({ game, gameId, tournamentId, result });
  }
}
