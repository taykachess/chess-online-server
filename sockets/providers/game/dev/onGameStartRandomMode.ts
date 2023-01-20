import { getGame, increasePly } from '../../../global/games'
import { io } from '../../../global/io'
import { changeTime } from '../../../services/game/changeTime'
import { isGameOver } from '../../../services/game/isGameOver'
import { setGameOver } from '../../../services/game/setGameOver'
import { GAME_ROOM } from '../../../variables/redisIndex'

export async function onGameStartRandomMode({ gameId }: { gameId: string }) {
  try {
    const [game] = getGame(gameId)
    if (!game) throw Error('Game not found from StartRandomMove')

    const chess = game.chess
    const turn = chess.turn()

    const moves = chess.moves()
    const randomNumber = Math.floor(Math.random() * moves.length)
    const randomMove = moves[randomNumber]

    const resultMove = chess.move(randomMove)

    if (!resultMove) throw Error('Move is incorrect')
    const now = new Date().getTime()

    await changeTime({
      gameId,
      increment: game.increment,
      tsmp: game.tsmp,
      turn,
      game,
      now,
    })

    const result = isGameOver({ chess })
    increasePly(gameId)

    if (result != '*') {
      await setGameOver({ gameId, result, game })
      return
    }

    io.to(GAME_ROOM(gameId)).emit('game:move', resultMove.san)
    const randomTime = Math.round(Math.random() * 5) * 1000
    if (result == '*')
      if ((chess.turn() == 'w' && game.white.bot) || (chess.turn() == 'b' && game.black.bot))
        game.botTimer = setTimeout(() => {
          onGameStartRandomMode({ gameId })
        }, randomTime)
  } catch (error) {
    console.log('Game not found from StartRandom')
  }
}
