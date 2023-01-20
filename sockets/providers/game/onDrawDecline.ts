import { getGame, setLastOfferDrawStatus } from '../../global/games'
import { io } from '../../global/io'

import { GAME_ROOM } from '../../variables/redisIndex'

import type { SocketType } from '../../types/sockets'

export async function onDrawDecline(this: SocketType, { gameId }: { gameId: string }) {
  const socket = this

  try {
    const [game] = getGame(gameId)
    if (game.white.username != socket.data.username && game.black.username != socket.data.username) throw Error('You have no access to decline draw')

    if (!game.lastOfferDraw) throw Error('Nothing to accept')
    if (game.lastOfferDraw.username == socket.data.username) throw Error("You can't decline your draw ")

    if (game.lastOfferDraw.ply + 2 < game.ply) throw Error('Too late')
    setLastOfferDrawStatus(gameId, 'declined')

    io.to(GAME_ROOM(gameId)).emit('game:declineDraw')
  } catch (error) {
    // console.log(error);
  }
}
