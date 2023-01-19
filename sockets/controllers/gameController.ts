import { SocketType } from '../types/sockets'
import { onGameGet } from '../providers/game/onGameGet'
import { onMove } from '../providers/game/onMove'
import { onResign } from '../providers/game/onResign'
import { onDrawOffer } from '../providers/game/onDrawOffer'
import { onDrawAccept } from '../providers/game/onDrawAccept'
import { onDrawDecline } from '../providers/game/onDrawDecline'
import { onGameLeave } from '../providers/game/onGameLeave'

export function gameController(socket: SocketType) {
  try {
    socket.on('game:get', onGameGet)

    socket.on('game:leave', onGameLeave)

    socket.on('game:drawDecline', onDrawDecline)
    socket.on('game:move', onMove)
    socket.on('game:resign', onResign)
    socket.on('game:drawOffer', onDrawOffer)
    socket.on('game:drawAccept', onDrawAccept)
    socket.on('game:drawDecline', onDrawDecline)

    // Auth only
    if (!socket.data.username) return
  } catch (error) {
    // console.log(error);
  }
}
