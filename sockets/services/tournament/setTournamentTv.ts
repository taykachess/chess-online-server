import { io } from '../../global/io'
import { setTourTV } from '../../global/tournament'

import { TOURNAMENT_ROOM } from '../../variables/redisIndex'

export async function setTournamentTv(tournamentId: string, gameId: string) {
  await setTourTV({ tournamentId, gameId })
  io.to(TOURNAMENT_ROOM(tournamentId)).emit('tournament:tv', {
    game: { id: gameId },
  })
}
