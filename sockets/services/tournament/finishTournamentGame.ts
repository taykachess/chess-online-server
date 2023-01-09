import { games } from "../../global/games";
import { io } from "../../global/io";
import { prisma } from "../../global/prisma";

import {
  addTournamentMatch,
  decreaseTournamentActiveGameByOne,
  getActivePlayers,
  getAllPlayers,
  getPlayerScore,
  getTournamentActiveGames,
  getTournamentMatches,
  getTournamentMaxRound,
  getTournamentTV,
  increaseTournamentRound,
  setTournamentActiveGames,
  setTournamentMatchResult,
} from "../../global/tournament";
import { onGameStartRandomMode } from "../../providers/game/dev/onGameStartRandomMode";
import { Game, GetGame, Result } from "../../types/game";
import { MatchSwiss } from "../../types/tournament";
import { transformResult } from "../../utils/transformResult";
import {
  TOURNAMENT_GAME_PREPARE_TIME,
  TOURNAMENT_ROOM,
} from "../../variables/redisIndex";
import { getGameForFrontend } from "../game/getGame";
import { calculateBuchholz } from "./calculateBuchholz";
import { pairingSwiss } from "./pairingSwiss";
import { setTournamentTv } from "./setTournamentTv";
import { startTournamentGame } from "./startTournamentGame";
import { swissSetResultToPlayers } from "./swissSetResultToPlayers";

export async function finishTournamentGame({
  game,
  gameId,
  tournamentId,
  result,
}: {
  game: Game;
  gameId: string;
  tournamentId: string;
  result: Result;
}) {
  if (!game.round || !game.board) return;

  //   Устанавливаем результат матча и уменьшаем количество игр
  const [[currentActiveGames], status] = await Promise.all([
    decreaseTournamentActiveGameByOne(tournamentId),
    setTournamentMatchResult({
      tournamentId,
      round: game.round,
      board: game.board,
      result,
    }),
  ]);

  io.to(TOURNAMENT_ROOM(tournamentId)).emit("tournament:gameOver", {
    gameId,
    result,
    w: {
      id: game.white.username,
      rating: game.white.rating,
      title: game.white.title,
      res: transformResult(result, "b"),
      color: "w",
    },
    b: {
      id: game.black.username,
      rating: game.black.rating,
      title: game.black.title,
      res: transformResult(result, "w"),
      color: "b",
    },
  });

  // Получаем очки двух игроков
  const [scoreW, scoreB, [res]] = await Promise.all([
    getPlayerScore({
      tournamentId,
      username: game.white.username,
    }),
    getPlayerScore({
      tournamentId,
      username: game.black.username,
    }),
    getTournamentTV({ tournamentId, gameId }),
  ]);

  if (gameId == res && currentActiveGames != 0) {
    const games = await getTournamentActiveGames({
      tournamentId,
      round: game.round,
    });

    if (games.length) {
      await setTournamentTv(tournamentId, games[0]);
    }
  }

  // if(res[0]==ga)

  //   Настраиваем правильно игроков перед жеребьевкой следующего раунда

  await swissSetResultToPlayers({
    tournamentId,
    white: {
      id: game.white.username,
      rating: game.white.rating,
      title: game.white.title,
      score: scoreW,
    },
    black: {
      id: game.black.username,
      rating: game.black.rating,
      title: game.black.title,
      score: scoreB,
    },
    result,
    gameId,
  });

  if (currentActiveGames == 0) {
    const [players] = await getAllPlayers({ tournamentId });
    const [round] = await increaseTournamentRound(tournamentId);
    const maxRound = await getTournamentMaxRound(tournamentId);
    if (round > maxRound[0]) {
      await calculateBuchholz({ tournamentId, players });
      const [matches] = (await getTournamentMatches({
        tournamentId,
      })) as MatchSwiss[];

      // TOURNAMENT ENDED
      await prisma.tournament.update({
        where: {
          id: tournamentId,
        },
        data: {
          status: "finished",
          // @ts-ignore
          players: Object.values(players),
          matches,
        },
      });

      io.emit("tournament:finish");
    } else {
      const activePlayers = await getActivePlayers({ tournamentId });

      const pairings = pairingSwiss(activePlayers, true);

      for await (const [index, pair] of pairings.entries()) {
        const gameId = await startTournamentGame({
          pair,
          tournamentId,
          players,
          board: index + 1,
          control: game.control,
          round,
        });

        pair[3] = `${gameId}`;
      }

      if (pairings[0][3]) {
        await setTournamentTv(tournamentId, pairings[0][3]);
      }

      await addTournamentMatch({
        tournamentId,
        matches: pairings,
      });

      io.to(TOURNAMENT_ROOM(tournamentId)).emit("tournament:pairings", {
        pairings,
      });

      await setTournamentActiveGames(
        tournamentId,
        activePlayers.length % 2 == 0 ? pairings.length : pairings.length - 1
      );
    }
  }
}
