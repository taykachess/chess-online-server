import { deleteGame } from '../../global/games'
import { io } from '../../global/io'
import { prisma } from '../../global/prisma'
import { redis } from '../../global/redis'

import { GAME_ROOM, PLAYER_IN_GAME_REDIS, USER_ROOM } from '../../variables/redisIndex'

import { calculateRating } from './calculateRating'
import { finishTournamentGame } from '../tournament/finishTournamentGame'
import { createMatchGame } from '../match/createMatchGame'

import type { Game, Result } from '../../types/game'

export async function setGameOver({ gameId, result, game }: { gameId: string; result: Result; game: Game }) {
  const { newEloBlack, newEloWhite } = calculateRating({
    eloWhite: game.white.rating,
    eloBlack: game.black.rating,
    result: result,
    control: game.control,
  })

  game.white.ratingNext = newEloWhite
  game.black.ratingNext = newEloBlack

  // Можно удалить сейчас, когда программа доработает сборщик удалит игру из кэша

  deleteGame(gameId)

  const createGame = prisma.game.create({
    data: {
      id: gameId,
      pgn: game.chess.pgn(),
      // @ts-ignore
      white: game.white,
      // @ts-ignore
      black: game.black,
      players: {
        connect: [{ username: game.white.username }, { username: game.black.username }],
      },
      result,
      time: game.time,
      control: game.control,
      matchId: game.matchId ? game.matchId : undefined,
    },
  })

  const updateRatingWhite = prisma.user.update({
    where: { username: game.white.username },
    data: { rating: newEloWhite },
  })

  const updateRatingBlack = prisma.user.update({
    where: { username: game.black.username },
    data: { rating: newEloBlack },
  })

  await Promise.all([createGame, updateRatingBlack, updateRatingWhite])

  io.to(GAME_ROOM(gameId)).emit('game:end', {
    result,
    newEloWhite,
    newEloBlack,
  })
  io.socketsLeave(GAME_ROOM(gameId))

  const matchId = game.matchId
  const tournamentId = game.tournamentId

  redis.SREM(PLAYER_IN_GAME_REDIS(game.white.username), gameId)
  redis.SREM(PLAYER_IN_GAME_REDIS(game.black.username), gameId)
  io.to([USER_ROOM(game.white.username), USER_ROOM(game.black.username)]).emit('game:deleteId', gameId)

  if (matchId) {
    await createMatchGame(matchId, gameId, game.white.username, game.black.username, result)
  } else if (tournamentId) {
    await finishTournamentGame({ game, gameId, tournamentId, result })
  }
}
