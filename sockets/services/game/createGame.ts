import { Chess } from 'chess.js'
import { v4 as uuid } from 'uuid'

import { setGame } from '../../global/games'

import { PLAYER_IN_GAME_REDIS, TOURNAMENT_GAME_PREPARE_TIME, USER_ROOM } from '../../variables/redisIndex'

import type { Game, Player } from '../../types/game'
import { setGameOver } from './setGameOver'
import { setGameTimeoutInitial } from '../../global/timers'
import { io } from '../../global/io'
import { redis } from '../../global/redis'

export async function createGame({
  data,
}: {
  data: {
    white: Player
    black: Player
    control: string
    matchId?: string

    tournamentId?: string
    round?: number
    board?: number
  }
}) {
  const gameId = uuid()

  const game: Game = {
    white: data.white,
    black: data.black,
    chess: new Chess(),
    time: [+data.control.split('+')[0] * 60 * 1000, +data.control.split('+')[0] * 60 * 1000],
    ply: 0,
    tsmp: Date.now(),
    increment: +data.control.split('+')[1],
    result: '*',
    control: data.control,
  }

  // const randomTime = Math.floor(Math.random() * 5) * 1000 + 3000

  const initialFn = async () => {
    await setGameOver({
      gameId,
      result: '0',
      // result: randomResult == 0 ? "0" : randomResult == 1 ? "1" : "0.5",
      game,
    })
  }
  //  В турнире должно быть game.time[0]
  if (data.tournamentId) setGameTimeoutInitial(gameId, initialFn, game.time[0] + TOURNAMENT_GAME_PREPARE_TIME)
  else setGameTimeoutInitial(gameId, initialFn, game.time[0])

  if (data.matchId) game.matchId = data.matchId
  if (data.tournamentId) {
    game.tournamentId = data.tournamentId
    game.round = data.round
    game.board = data.board
  }

  setGame(gameId, game)

  io.to([USER_ROOM(data.white.username), USER_ROOM(data.black.username)]).emit('game:started', {
    gameId,
  })

  Promise.all([redis.SADD(PLAYER_IN_GAME_REDIS(data.white.username), gameId), redis.SADD(PLAYER_IN_GAME_REDIS(data.black.username), gameId)])

  return gameId
}
