const timers: { games: { [id: string]: any } } = {
  games: {},
};

export function setGameTimeout(gameId: string, fn: any, milliseconds: number) {
  clearTimeout(timers.games[gameId]);
  const timerId = setTimeout(fn, milliseconds);
  timers.games[gameId] = timerId;
}

// prettier-ignore
export function setGameTimeoutInitial(gameId: string, fn: any, milliseconds: number) {
  const timerId = setTimeout(fn, milliseconds);
  timers.games[gameId] = timerId;
}

export function deleteGameTimer(gameId: string) {
  clearTimeout(timers.games[gameId]);
  delete timers.games[gameId];
}
