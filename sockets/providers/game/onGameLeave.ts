import type { SocketType } from '../../types/sockets'
import { GAME_ROOM } from '../../variables/redisIndex'

export function onGameLeave(this: SocketType, { gameId }: { gameId: string }) {
  try {
    const socket = this

    socket.leave(GAME_ROOM(gameId))
  } catch (error) {
    // console.log(error);
  }
}
