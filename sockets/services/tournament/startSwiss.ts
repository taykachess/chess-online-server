import type { Tournament, User } from "@prisma/client";
import { io } from "../../global/io";
import {
  addTournamentMatch,
  setTournament,
  setTournamentTV,
} from "../../global/tournament";
import type {
  PlayerSwiss,
  MatchSwiss,
  TournamentSwiss,
} from "../../types/tournament";
import { TOURNAMENT_ROOM } from "../../variables/redisIndex";
import { pairingSwiss } from "./pairingSwiss";
import { startTournamentGame } from "./startTournamentGame";

export async function startSwiss({
  tournament,
  tournamentId,
}: {
  tournament: Tournament & {
    participants: User[];
  };
  tournamentId: string;
}) {
  if (!tournament.rounds) throw Error("rounds not include");

  const players: Record<string, PlayerSwiss> = {};
  tournament.participants.sort((a, b) => b.rating - a.rating);

  tournament.participants.forEach((user, index) => {
    const player: PlayerSwiss = {
      id: user.username,
      score: 0,
      rating: user.rating,
      colors: index % 2,
      avoid: [],
      coefficient: { buchholz: 0 },
      matches: [],
      pairedUpDown: false,
      receivedBye: false,
      title: user.title,
      active: true,
    };

    if (user.title) player.title = user.title;
    players[user.username] = player;
  });

  // Жеребьевка

  const playersValues = Object.values(players);
  const pairings: MatchSwiss[] = pairingSwiss(playersValues, true);

  const tournamentSwiss: TournamentSwiss = {
    players,
    matches: [],
    activeGames:
      playersValues.length % 2 == 0 ? pairings.length : pairings.length - 1,
    round: 1,
    maxRounds: tournament.rounds,
  };

  await setTournament(tournamentId, tournamentSwiss);

  for await (const [index, pair] of pairings.entries()) {
    const gameId = await startTournamentGame({
      pair,
      tournamentId,
      players,
      board: index + 1,
      control: tournament.control,
      round: 1,
    });
    pair[3] = `${gameId}`;
  }

  if (pairings[0][3]) {
    // console.log("tv set");
    await setTournamentTV({ tournamentId, gameId: pairings[0][3] });
  }
  // tournamentSwiss.tv = pairings[0][3];

  await addTournamentMatch({
    tournamentId,
    matches: pairings,
  });

  return { pairings, players: playersValues };

  //   io.to(TOURNAMENT_ROOM(tournamentId)).emit("tournament:pairings", {
  //     pairings,
  //   });
}
