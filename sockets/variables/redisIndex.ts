// Paths in redis
export const CHALLENGES = "challenges";
// export const GAMES = "games";
export const MATCHES = "matches";
export const PLAYERINGAME = (username: string) => `playerInGame${username}`;

// Const
export const TIME_TO_CANCEL_GAME = 20000000;

// Rooms
export const GAMEROOM = (gameId: string) => `game${gameId}`;
