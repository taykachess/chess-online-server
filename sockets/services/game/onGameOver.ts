import { deleteGame, getGame } from "../../global/games";
import { io } from "../../global/io";
import { prisma } from "../../global/prisma";

import { calculateRating } from "./calculateRating";

import { GAME_ROOM, PLAYER_IN_GAME_REDIS } from "../../variables/redisIndex";

import type { Result } from "../../types/game";
import { redis } from "../../global/redis";
import { addGame, getMatch } from "../../global/matches";
import { MatchGame } from "../../types/match";
import { runNextGameInMatch } from "../match/runNextGameInMatch";
import { finishTournamentGame } from "../tournament/finishTournamentGame";

export async function onGameOver({
  gameId,
  result,
}: {
  gameId: string;
  result: Result;
}) {
  const game = getGame(gameId);
  const { newEloBlack, newEloWhite } = calculateRating({
    eloWhite: game.white.rating,
    eloBlack: game.black.rating,
    result: result,
    control: game.control,
  });
  game.white.ratingNext = newEloWhite;
  game.black.ratingNext = newEloBlack;

  console.log("gameId", gameId);

  const createGame = await prisma.game.create({
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
    },
  });

  const updateRatingWhite = await prisma.user.update({
    where: { username: game.white.username },
    data: { rating: newEloWhite },
  });

  const updateRatingBlack = await prisma.user.update({
    where: { username: game.black.username },
    data: { rating: newEloBlack },
  });

  // await prisma.$transaction([createGame, updateRatingWhite, updateRatingBlack]);

  io.to(GAME_ROOM(gameId)).emit("game:end", {
    result,
    newEloWhite,
    newEloBlack,
  });
  io.socketsLeave(GAME_ROOM(gameId));

  const matchId = game.matchId;
  const tournamentId = game.tournamentId;

  // Можно удалить сейчас, когда программа доработает сборщик удалит игру из кэша
  deleteGame(gameId);

  // const roun

  // await Promise.all([
  redis.SREM(PLAYER_IN_GAME_REDIS(game.white.username), gameId);
  redis.SREM(PLAYER_IN_GAME_REDIS(game.black.username), gameId);

  if (matchId) {
    const matchGame: MatchGame = {
      white: game.white.username,
      black: game.black.username,
      result,
      gameId,
    };
    let match = await getMatch(matchId);
    if (!match) return;
    match = await addGame(matchId, matchGame, match);
    await runNextGameInMatch({ matchId: matchId, match });
  } else if (tournamentId) {
    finishTournamentGame({ game, gameId, tournamentId, result });
  }

  // ]);
}
