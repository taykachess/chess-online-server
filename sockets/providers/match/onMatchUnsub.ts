import type { SocketType } from '../../types/sockets'
import { MATCH_ROOM } from '../../variables/redisIndex'

export function onMatchUnsub(this: SocketType, matchId: string) {
  const socket = this
  socket.leave(MATCH_ROOM(matchId))
}
