import type { RemoteSocket, Server, Socket } from 'socket.io'
import type { ChallengeFilters, GetChallenge } from './challenge'
import type { MatchCreateTimeDto, MatchCreateTimeDtoExtended } from './match'
import type { GetGame, Result, Title } from './game'

import { MatchSwiss, MatchSwissShortPlayer, PlayerSwiss } from './tournament'

export type SocketServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>

export type SocketType = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>

export type SocketRemoteType = RemoteSocket<ServerToClientEvents, SocketData>

export interface ServerToClientEvents {
  'challenge:created': (challenge: GetChallenge) => void
  'challenge:deleted': ({ socketId }: { socketId?: string }) => void

  'match:deleted': ({ socketId }: { socketId?: string }) => void
  'match:private:create': (match: MatchCreateTimeDtoExtended) => void
  'match:private:cancelled': (player: string) => void
  'match:private:refuse': (player: string) => void
  'match:private:gameOver': ({ res, curr, stage, tsmp }: { res: [string, Result, number]; curr?: string; stage?: number; tsmp?: Date }) => void
  'match:private:ended': () => void

  'game:started': ({ gameId }: { gameId: string }) => void
  'game:move': (move: string) => void
  'game:end': ({ result, newEloWhite, newEloBlack }: { result: Result; newEloWhite: number; newEloBlack: number }) => void
  'game:offerDraw': ({ username, ply }: { username: string; ply: number }) => void
  'game:declineDraw': () => void
  // Убрать уведомления в redis, что игроки имеют текущие игры
  'game:deleteId': (gameId: string) => void

  'tournament:register': ({ username, rating, title }: { username: string; rating: number; title: Title | null }) => void
  'tournament:unregister': ({ username }: { username: string }) => void
  'tournament:pause': ({ username }: { username: string }) => void

  // Продолжить игру, в ранее зарегистрированном турнире
  'tournament:continue': ({ username }: { username: string }) => void
  // Зарегистрироваться в уже проходящем турнире
  'tournament:entry': (player: PlayerSwiss) => void

  'tournament:pairings': ({ pairings }: { pairings: MatchSwiss[] }) => void
  'tournament:gameOver': ({ gameId, result, w, b }: { gameId: string; result: Result; w: MatchSwissShortPlayer; b: MatchSwissShortPlayer }) => void
  'tournament:start': ({ pairings, players }: { pairings: MatchSwiss[]; players: PlayerSwiss[] }) => void
  'tournament:finish': () => void
  'tournament:tv': ({ game }: { game: { id: string } }) => void
}

export interface ClientToServerEvents {
  'challenge:subscribe': () => void
  'challenge:create': ({ control, filters }: { control: string; filters: ChallengeFilters }) => void
  'challenge:cancel': () => void
  'challenge:accept': ({ username }: { username: string }) => void

  'match:unsub': (id: string) => void
  'match:subscribe': (id: string) => void
  'match:accept': (username: string) => void
  'match:private:create': (match: MatchCreateTimeDto) => void

  'game:leave': ({ gameId }: { gameId: string }) => void
  'game:move': ({ move, gameId }: { move: string; gameId: string }) => void
  'game:resign': ({ gameId }: { gameId: string }) => void
  'game:drawOffer': ({ gameId }: { gameId: string }) => void
  'game:drawAccept': ({ gameId }: { gameId: string }) => void
  'game:drawDecline': ({ gameId }: { gameId: string }) => void
  'game:get': ({ gameId }: { gameId: string }, cb: (data: GetGame) => void) => void

  'tournament:subscribe': ({ tournamentId }: { tournamentId: string }) => void
  'tournament:leave': ({ tournamentId }: { tournamentId: string }) => void
}

export interface InterServerEvents {
  ping: () => void
}

export interface SocketData {
  username: string
  matchSended?: string
}
