import { addPlayerAvoid, addPlayerMatches, increasePlayerColorsByOne, increasePlayerScore, setPlayerPairedUpDown } from '../../global/tournament'

import type { Result, Title } from '../../types/game'
import { transformResult } from '../../utils/transformResult'

export async function swissSetResultToPlayers({
  tournamentId,
  white,
  black,
  result,
  gameId,
}: {
  tournamentId: string
  white: { id: string; rating: number; title?: Title | null; score: number }
  black: { id: string; rating: number; title?: Title | null; score: number }
  result: Result
  gameId: string
}) {
  // Increase white player color
  const q1 = increasePlayerColorsByOne({ tournamentId, username: white.id })

  // Avoid to play each other in the next round

  const q2 = addPlayerAvoid({
    tournamentId,
    username: white.id,
    playerId: black.id,
  })
  const q3 = addPlayerAvoid({
    tournamentId,
    username: black.id,
    playerId: white.id,
  })

  // after the game set to false and then once again check
  let q4, q5
  if (white.score == black.score) {
    q4 = setPlayerPairedUpDown({
      tournamentId,
      username: white.id,
      pairedUpDown: false,
    })

    q5 = setPlayerPairedUpDown({
      tournamentId,
      username: black.id,
      pairedUpDown: false,
    })
  } else {
    q4 = setPlayerPairedUpDown({
      tournamentId,
      username: white.id,
      pairedUpDown: true,
    })

    q5 = setPlayerPairedUpDown({
      tournamentId,
      username: black.id,
      pairedUpDown: true,
    })
  }

  const q6 = addPlayerMatches({
    tournamentId,
    username: white.id,
    game: [
      {
        id: black.id,
        rating: black.rating,
        title: black.title,
        res: transformResult(result, 'w'),
        color: 'w',
      },
      gameId,
    ],
  })
  const q7 = addPlayerMatches({
    tournamentId,
    username: black.id,
    game: [
      {
        id: white.id,
        rating: white.rating,
        title: white.title,
        res: transformResult(result, 'b'),
        color: 'b',
      },
      gameId,
    ],
  })

  const q8: Promise<any>[] = []
  if (result == '1' || result == '+') {
    q8.push(increasePlayerScore({ tournamentId, username: white.id, point: 1 }))
  } else if (result == '0' || result == '-') {
    q8.push(increasePlayerScore({ tournamentId, username: black.id, point: 1 }))
  } else if (result == '0.5') {
    q8.push(increasePlayerScore({ tournamentId, username: white.id, point: 0.5 }))
    q8.push(increasePlayerScore({ tournamentId, username: black.id, point: 0.5 }))
  }

  const [m1, m2, m3, m4, m5, m6, m7, m8] = await Promise.all([q1, q2, q3, q4, q5, q6, q7, ...q8])
}
