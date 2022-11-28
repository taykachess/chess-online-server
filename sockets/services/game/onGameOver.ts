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
import {
  addTournamentMatch,
  decreaseTournamentActiveGameByOne,
  getAllPlayers,
  getPlayerScore,
  getTournamentMaxRound,
  increaseTournamentRound,
  setTournamentActiveGames,
  setTournamentMatchResult,
} from "../../global/tournament";
import { swissSetResultToPlayers } from "../tournament/swissSetResultToPlayers";
import { Swiss } from "../tournament/pairingSwiss";
import { startTournamentGame } from "../tournament/startTournamentGame";

export async function onGameOver({
  gameId,
  result,
}: {
  gameId: string;
  result: Result;
}) {
  // console.log("Game over", result);
  const game = getGame(gameId);
  // game.white.rating, game.black.rating, game.result,
  const { newEloBlack, newEloWhite } = calculateRating({
    eloWhite: game.white.rating,
    eloBlack: game.black.rating,
    result: result,
    control: game.control,
  });
  game.white.ratingNext = newEloWhite;
  game.black.ratingNext = newEloBlack;

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

  await prisma.$transaction([createGame, updateRatingWhite, updateRatingBlack]);

  io.to(GAME_ROOM(gameId)).emit("game:end", {
    result,
    newEloWhite,
    newEloBlack,
  });
  io.socketsLeave(GAME_ROOM(gameId));

  const matchId = game.matchId;
  const tournamentId = game.tournamentId;

  deleteGame(gameId);

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
    // if (!game.round || !game.board) return;

    console.log("status", game.round, game.board);
    const [currentActiveGames, status] = await Promise.all([
      decreaseTournamentActiveGameByOne(tournamentId),
      setTournamentMatchResult({
        tournamentId,
        round: game.round,
        board: game.board,
        result: result,
      }),
    ]);

    const [scoreW, scoreB] = await Promise.all([
      getPlayerScore({
        tournamentId,
        username: game.white.username,
      }),
      getPlayerScore({
        tournamentId,
        username: game.black.username,
      }),
    ]);

    // console.log(scoreB, scoreW);

    await swissSetResultToPlayers({
      tournamentId: tournamentId,
      white: { id: game.white.username, score: scoreW },
      black: { id: game.black.username, score: scoreB },
      result,
      gameId,
    });

    console.log("currentActiveGames", currentActiveGames);
    if (currentActiveGames == 0) {
      const round = await increaseTournamentRound(tournamentId);
      const maxRound = await getTournamentMaxRound(tournamentId);
      // console.log(round, maxRound);
      if (round[0] > maxRound[0]) {
        console.log("Tournament ended");
      } else {
        const players = await getAllPlayers({
          tournamentId,
        });

        const pairings = Swiss(Object.values(players[0]), true);
        addTournamentMatch({
          tournamentId,
          matches: pairings.sort((a, b) => {
            const diff = Math.max(b[3], b[4]) - Math.max(a[3], a[4]);
            if (diff > 0) return 1;
            if (diff == 0) {
              const summa = b[3] + b[4] - a[3] - a[4];
              if (summa > 0) {
                return 1;
              }
              if (summa < 0) {
                return -1;
              }
              return 0;
            }
            if (diff < 0) return -1;
            return 0;
          }),
        });
        console.log("pairing of", round[0], "round", pairings);
        setTournamentActiveGames(tournamentId, pairings.length);
        // console.log(players[0]);
        pairings.forEach(async (pair, index) => {
          await startTournamentGame({
            pair,
            tournamentId,
            players: players[0],
            board: index + 1,
            control: game.control,
            round: round[0],
          });
        });
      }
      //   return console.log("Game over", round, "round");
    }

    // game.round
    // /
  }

  // ]);
}
