import type { SocketType } from '../types/sockets'

import { onMatchSub } from '../providers/match/onMatchSub'
import { onMatchCreatePrivate } from '../providers/match/onMatchCreatePrivate'
import { onMatchAcceptPrivate } from '../providers/match/onMatchAcceptPrivate'
import { onMatchUnsub } from '../providers/match/onMatchUnsub'

export function matchController(socket: SocketType) {
  try {
    socket.on('match:subscribe', onMatchSub)
    socket.on('match:unsub', onMatchUnsub)

    // Auth only
    if (!socket.data?.username) return
    socket.on('match:private:create', onMatchCreatePrivate)
    socket.on('match:accept', onMatchAcceptPrivate)
  } catch (error) {
    // console.log(error);
  }
}
