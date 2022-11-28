import { io } from "../../global/io";
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
import { Game, Result } from "../../types/game";
import { TOURNAMENT_ROOM } from "../../variables/redisIndex";
import { pairingSwiss } from "./pairingSwiss";
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
  console.log("status", game.round, game.board);

  //   Устанавливаем результат матча и уменьшаем количество игр
  const [currentActiveGames, status] = await Promise.all([
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
  });

  // Получаем очки двух игроков
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

  //   Настраиваем правильно игроков перед жеребьевкой следующего раунда

  await swissSetResultToPlayers({
    tournamentId,
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

      const pairings = pairingSwiss(Object.values(players[0]), true);

      pairings.sort((a, b) => {
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
        addTournamentMatch({
          tournamentId,
          matches: pairings,
        });

      io.to(TOURNAMENT_ROOM(tournamentId)).emit("tournament:pairings", {
        pairings,
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
}
