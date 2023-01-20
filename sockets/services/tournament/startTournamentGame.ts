import { addPlayerMatches, increasePlayerScore, setPlayerReceivedBye } from '../../global/tournament'
import { MatchSwiss } from '../../types/tournament'
import { createGame } from '../game/createGame'
import { prisma } from '../../global/prisma'
import { onGameStartRandomMode } from '../../providers/game/dev/onGameStartRandomMode'

import { TOURNAMENT_GAME_PREPARE_TIME } from '../../variables/redisIndex'

export async function startTournamentGame({ pair, tournamentId, board, control, round }: { pair: MatchSwiss; tournamentId: string; board: number; round: number; control: string }) {
  if (!pair[1]) {
    // decreaseTournamentActiveGameByOne(tournamentId);
    increasePlayerScore({ tournamentId, username: pair[0].id, point: 1 })
    addPlayerMatches({
      tournamentId,
      username: pair[0].id,
      game: [
        {
          id: 'Bye',
          rating: 0,
          res: '1',
          color: 'w',
        },
        '',
      ],
    })
    setPlayerReceivedBye({ tournamentId, username: pair[0].id, receivedBye: true })
    return
  }

  const [white, black] = await prisma.$transaction([
    prisma.user.findUnique({
      where: { username: pair[0].id },
      select: { rating: true, title: true, bot: true },
    }),
    prisma.user.findUnique({
      where: { username: pair[1].id },
      select: { rating: true, title: true, bot: true },
    }),
  ])

  if (!white || !black) throw Error('Not white or black')

  const gameId = await createGame({
    data: {
      white: {
        username: pair[0].id,
        ...white,
      },
      black: {
        username: pair[1].id,
        ...black,
      },
      control,
      tournamentId,
      round,
      board,
    },
  })

  if (white.bot && gameId)
    setTimeout(() => {
      onGameStartRandomMode({ gameId })
    }, TOURNAMENT_GAME_PREPARE_TIME)

  return gameId
}
