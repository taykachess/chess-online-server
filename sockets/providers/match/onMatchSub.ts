import type { SocketType } from '../../types/sockets'
import { MATCH_ROOM } from '../../variables/redisIndex'

export function onMatchSub(this: SocketType, matchId: string) {
  const socket = this
  socket.join(MATCH_ROOM(matchId))
}
