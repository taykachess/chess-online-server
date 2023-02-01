import { getGame, increasePly } from '../../global/games'

import { changeTime } from '../../services/game/changeTime'
import { isGameOver } from '../../services/game/isGameOver'
import { setGameOver } from '../../services/game/setGameOver'

import { GAME_ROOM, TOURNAMENT_GAME_PREPARE_TIME } from '../../variables/redisIndex'

import { onGameStartRandomMode } from './dev/onGameStartRandomMode'

import type { SocketType } from '../../types/sockets'

export async function onMove(this: SocketType, { move, gameId }: { move: string; gameId: string }) {
  const socket = this

  const start = performance.now()

  try {
    const [game] = getGame(gameId)
    if (!game) throw Error('Game not found from OnMove')

    const chess = game.chess
    const turn = chess.turn()

    if (turn == 'w' && game.white.username != socket.data.username) throw Error('You have no access to resign')
    if (turn == 'b' && game.black.username != socket.data.username) throw Error('You have no access to resign')

    const resultMove = chess.move(move)

    if (!resultMove) throw Error('Move is incorrect')

    const middle = performance.now()
    console.log(middle - start, 'ms ')

    const now = Date.now()
    if (game.tournamentId && game.ply == 0 && now < TOURNAMENT_GAME_PREPARE_TIME + game.tsmp) throw Error('No time yet')
    changeTime({
      gameId,
      increment: game.increment,
      tsmp: game.tsmp,
      turn,
      game,
      now,
    })

    const result = isGameOver({ chess })
    if (result != '*') {
      await setGameOver({ gameId, result, game })
      return
    }

    if (result == '*')
      if ((chess.turn() == 'w' && game.white.bot) || (chess.turn() == 'b' && game.black.bot)) {
        const randomTime = Math.round(Math.random() * 5) * 1000
        game.botTimer = setTimeout(() => {
          onGameStartRandomMode({ gameId })
        }, randomTime)
      }

    increasePly(gameId)

    socket.to(GAME_ROOM(gameId)).emit('game:move', move)

    const end = performance.now()

    console.log(end - start, 'ms ')
  } catch (error) {
    // console.log(error);
  }
}
