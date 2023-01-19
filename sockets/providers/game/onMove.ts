import { getGame, increasePly } from '../../global/games'

import { changeTime } from '../../services/game/changeTime'
import { isGameOver } from '../../services/game/isGameOver'
import { setGameOver } from '../../services/game/setGameOver'

import { GAME_ROOM, TOURNAMENT_GAME_PREPARE_TIME } from '../../variables/redisIndex'

import type { SocketType } from '../../types/sockets'
// import { Chess } from "chess.js";
import { onGameStartRandomMode } from './dev/onGameStartRandomMode'

export async function onMove(this: SocketType, { move, gameId }: { move: string; gameId: string }) {
  const socket = this

  try {
    const [game] = getGame(gameId)
    if (!game) throw Error('Game not found from OnMove')

    const chess = game.chess
    const turn = chess.turn()

    if (turn == 'w' && game.white.username != socket.data.username) throw Error('You have no access to resign')
    if (turn == 'b' && game.black.username != socket.data.username) throw Error('You have no access to resign')
    // if (
    //   !(
    //     game.white.username == socket.data.username ||
    //     game.black.username == socket.data.username
    //   )
    // )
    //   throw Error("You have no access to move");
    const resultMove = chess.move(move)

    if (!resultMove) throw Error('Move is incorrect')
    const now = new Date().getTime()
    if (game.tournamentId && game.ply == 0 && now < TOURNAMENT_GAME_PREPARE_TIME + game.tsmp) throw Error('No time yet')
    await changeTime({
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

    // prettier-ignore

    increasePly(gameId)
    // Promise.all([increasePly(gameId), setGamePgn({gameId, pgn:chess.pgn()})])

    socket.to(GAME_ROOM(gameId)).emit('game:move', move)
  } catch (error) {
    // console.log(error);
  }
}
