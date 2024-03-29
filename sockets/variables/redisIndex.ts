// Paths in redis
export const CHALLENGES_REDIS = 'challenges'
export const GAMES_REDIS = 'games'

export const MATCHES_REDIS_GOT = (owner: string) => `mof${owner}got`

export const TOURNAMENTS_IN_PROGRESS_REDIS = 'tournamentsInProgress'
export const PLAYER_IN_GAME_REDIS = (username: string) => `playerInGame${username}`

// Rooms dynamic
export const GAME_ROOM = (gameId: string) => `game${gameId}`
export const MATCH_ROOM = (matchId: string) => `match${matchId}`
export const TOURNAMENT_ROOM = (tournamentId: string) => `tournament${tournamentId}`
export const USER_ROOM = (username: string) => `user${username}`

// export const TOURNAMENT_IN_PROGRESS_ROOM = (tournamentId: string) =>
//   `tournamentsInProgress${tournamentId}`;

//Rooms static
// export const MATCHES_ROOM = "matches"
export const CHALLENGES_ROOM = 'challenges'

// Const
// 20000000
export const TIME_TO_CANCEL_GAME = 5000

// Tournament
export const TOURNAMENT_GAME_PREPARE_TIME = 2000

// Methods to get game
export const METHOD_TO_GET_GAME: 'memory' | 'redis' = 'memory'
