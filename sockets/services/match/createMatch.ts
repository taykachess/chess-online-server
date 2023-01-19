import { v4 as uuid } from 'uuid'

import type { Player } from '../../types/game'
import { setMatch } from '../../global/matches'
import { Match } from '../../types/match'

export async function createMatch({
  createMatchDto,
}: {
  createMatchDto: {
    white: Player
    black: Player
    control: string
    rounds: number
    armageddon: boolean
  }
}) {
  const matchId = uuid()
  const match: Match = {
    player1: createMatchDto.white.username,
    player2: createMatchDto.black.username,
    rounds: createMatchDto.rounds,
    games: [],
    armageddon: createMatchDto.armageddon,
    result: [0, 0, 0],
    status: 'running',
    control: createMatchDto.control,
  }
  await setMatch(matchId, match)

  return matchId
}
