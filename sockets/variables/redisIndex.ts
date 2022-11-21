// Paths in redis
export const CHALLENGES_REDIS = "challenges";
export const GAMES_REDIS = "games";
export const MATCHES_REDIS = "matches";
export const MATCHES_IN_PROGRESS_REDIS = "matchesinprogress";

export const PLAYER_IN_GAME_REDIS = (username: string) =>
  `playerInGame${username}`;

// Rooms dynamic
export const GAME_ROOM = (gameId: string) => `game${gameId}`;
export const MATCH_ROOM = (matchId: string) => `match${matchId}`;

//Rooms static
export const MATCHES_ROOM = "matches";
export const CHALLENGES_ROOM = "challenges";

// Const
export const TIME_TO_CANCEL_GAME = 20000000;
