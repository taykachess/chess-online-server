import { prisma } from '../../global/prisma'
import { io } from '../../global/io'
import { redis } from '../../global/redis'

import { createGame } from '../../services/game/createGame'

import { MATCHES_REDIS, MATCHES_ROOM, PLAYER_IN_GAME_REDIS } from '../../variables/redisIndex'

import type { GetMatch, MatchFilters } from '../../types/match'
// import type { Filters, GetChallenge } from "../../types/challenge";
import type { SocketType } from '../../types/sockets'
import { getSuitableMatch } from '../../services/match/getSuitableMatch'
import { createMatch } from '../../services/match/createMatch'

export async function onMatchCreate(this: SocketType, data: { control: string; rounds: number; filters: MatchFilters }) {
  try {
    const socket = this
    if (!socket.data.username) throw Error('User not found')

    const { control, rounds, filters } = data

    const user = await prisma.user.findFirst({
      where: { username: socket.data.username },
      select: { rating: true, title: true },
    })
    if (!user) throw Error('User not found')

    const ratingFilter: { min: number; max: number } = {
      min: filters.rating[0],
      max: filters.rating[1],
    }
    if (ratingFilter.max == 500) ratingFilter.max = 5000
    else ratingFilter.max = ratingFilter.max + +user.rating

    if (ratingFilter.min == -500) ratingFilter.min = 0
    else ratingFilter.min = ratingFilter.min + +user.rating

    const match: GetMatch = {
      user: socket.data.username,
      rating: +user?.rating,
      control,
      socketId: socket.id,
      // @ts-ignore
      filters: {
        rating: [ratingFilter.min, ratingFilter.max],
      },
      rounds,
    }

    const existMatch: GetMatch[] = await getSuitableMatch({
      min: ratingFilter.min,
      max: ratingFilter.max,
      control,
      rating: +user?.rating,
      rounds,
    })

    if (existMatch?.length && existMatch[0].user != socket.data.username) {
      const chosenMatch = existMatch[0]
      const [socket2] = await io.in(`${chosenMatch.socketId}`).fetchSockets()

      if (!socket.data?.username || !socket2.data?.username) throw Error('The both user must have username')
      const userOpponent = await prisma.user.findFirst({
        where: { username: socket2.data.username },
        select: { rating: true, title: true },
      })
      if (!userOpponent) throw Error('User not found')
      const white = {
        username: socket.data.username,
        rating: +user.rating,
        title: user.title,
      }

      const black = {
        username: socket2.data.username,
        rating: +userOpponent?.rating,
        title: userOpponent.title,
      }

      const matchId = await createMatch({
        createMatchDto: { white, black, control, rounds, armageddon: false },
      })

      const gameId = await createGame({
        data: {
          white,
          black,
          control,
          matchId,
        },
      })

      socket.emit('game:started', { gameId: gameId })
      socket2.emit('game:started', { gameId: gameId })

      return Promise.all([
        redis.SADD(PLAYER_IN_GAME_REDIS(socket.data.username), gameId),
        redis.SADD(PLAYER_IN_GAME_REDIS(socket2.data.username), gameId),
        redis.json.del(MATCHES_REDIS, `$.${socket.data.username}`),
        redis.json.del(MATCHES_REDIS, `$.${socket2.data.username}`),
      ])
    }
    // prettier-ignore
    // @ts-ignore
    const status = await redis.json.set(MATCHES_REDIS,`${socket.data.username}`,match);

    if (status) io.to(MATCHES_ROOM).emit('match:created', match)
  } catch (error) {
    // console.log(error);
  }
}
