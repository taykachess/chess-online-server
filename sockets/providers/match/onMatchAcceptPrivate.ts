import { io } from '../../global/io'
import { prisma } from '../../global/prisma'
import { redis } from '../../global/redis'
import { createGame } from '../../services/game/createGame'
import { MatchCreateDtoExtended } from '../../types/match'
import { SocketType } from '../../types/sockets'
import { MATCHES_REDIS_GOT, USER_ROOM } from '../../variables/redisIndex'

export async function onMatchAcceptPrivate(this: SocketType, player: string) {
  const socket = this

  try {
    if (!socket.data.username) throw Error('403')

    const dataMatch = await redis.hGet(MATCHES_REDIS_GOT(socket.data.username), `${player}`)

    console.log(dataMatch)

    let match: MatchCreateDtoExtended
    if (dataMatch) match = JSON.parse(dataMatch)
    else throw Error('Wrong match information')
    const matchFromPrisma = await prisma.match.create({
      data: {
        type: match.type,
        player1: match.player,
        player2: match.sender.username,
        periods: match.periods,
        tsmp: new Date(),
        stage: 1,
        status: 'running',
      },
      select: {
        id: true,
        startDate: true,
      },
    })
    const status = await redis.hDel(MATCHES_REDIS_GOT(socket.data.username), `${player}`)

    const white = await prisma.user.findFirst({
      where: {
        username: match.player,
      },
      select: {
        username: true,
        rating: true,
        title: true,
      },
    })

    const black = await prisma.user.findFirst({
      where: {
        username: match.sender.username,
      },
      select: {
        username: true,
        rating: true,
        title: true,
      },
    })

    if (!white) throw Error('')
    if (!black) throw Error('')
    io.to(USER_ROOM(socket.data.username)).emit('match:private:cancelled', socket.data.username)

    const sockets = await io.in(`${USER_ROOM(black.username)}`).fetchSockets()

    const gameId = await createGame({
      data: {
        white,
        black,
        control: match.periods[0][1],
        matchId: matchFromPrisma.id,
      },
    })
    sockets.forEach((sock) => {
      sock.emit('game:started', { gameId })
    })

    socket.emit('game:started', { gameId })

    // if (status == 1)
    //   io.to(USER_ROOM(player)).emit("match:private:refuse", player);
  } catch (error) {
    console.log(error)
  }
}
