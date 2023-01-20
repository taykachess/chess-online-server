import { getGame } from '../../global/games'
import { setGameOver } from '../../services/game/setGameOver'

import type { SocketType } from '../../types/sockets'

export async function onDrawAccept(this: SocketType, { gameId }: { gameId: string }) {
  const socket = this

  try {
    const [game] = getGame(gameId)
    if (game.white.username != socket.data.username && game.black.username != socket.data.username) throw Error('You have no access to accept draw')

    if (!game.lastOfferDraw) throw Error('Nothing to accept')
    if (game.lastOfferDraw.username == socket.data.username) throw Error("You can't accept draw on yourself ")
    if (game.lastOfferDraw.status == 'declined') throw Error('Draw was declined')
    if (game.lastOfferDraw.ply + 2 < game.ply) throw Error('Too late')

    await setGameOver({ gameId, result: '0.5', game })
  } catch (error) {
    // console.log(error);
  }
}
