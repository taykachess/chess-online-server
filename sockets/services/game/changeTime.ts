import { setTimeBlack, setTimestamp, setTimeWhite } from '../../global/games'
import { setGameTimeout } from '../../global/timers'
import { Game } from '../../types/game'
import { TOURNAMENT_GAME_PREPARE_TIME } from '../../variables/redisIndex'

import { setGameOver } from './setGameOver'

export function changeTime({ gameId, increment, tsmp, turn, game, now }: { gameId: string; increment: number; tsmp: number; turn: 'w' | 'b'; game: Game; now: number }) {
  if (game.tournamentId && game.ply == 0) {
    tsmp = tsmp + TOURNAMENT_GAME_PREPARE_TIME
  }

  const time = turn == 'w' ? game.time[0] : game.time[1]
  const diff = now - tsmp
  const newTime = time - diff
  const isLostOnTime = newTime <= 0
  const returnTime = isLostOnTime ? 0 : newTime + increment * 1000
  if (isLostOnTime) {
    return (game.reason = 'time')
  }

  setTimestamp(gameId, now)

  if (turn == 'w') {
    setTimeWhite(gameId, returnTime)

    setGameTimeout(
      gameId,
      async () => {
        game.time[1] = 0
        await setGameOver({ gameId, result: '1', game })
      },
      game.time[1]
    )
  } else {
    setTimeBlack(gameId, returnTime)

    setGameTimeout(
      gameId,
      async () => {
        game.time[0] = 0
        await setGameOver({ gameId, result: '0', game })
      },
      game.time[0]
    )
  }
}
