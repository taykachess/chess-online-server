import { getGame, setGameTimeout } from "../../global/games";

import { setGameOver } from "./setGameOver";

export function changeTime({
  gameId,
  increment,
  tsmp,
}: {
  gameId: string;
  increment: number;
  tsmp: number;
}) {
  const game = getGame(gameId);
  const turn = game.chess.turn();
  const time = turn == "b" ? game.time[0] : game.time[1];
  const now = new Date().getTime();
  const diff = now - tsmp;
  const newTime = time - diff;
  const isLostOnTime = newTime <= 0;
  const returnTime = isLostOnTime ? 0 : newTime + increment * 1000;
  if (isLostOnTime) {
    return console.log("Lost on time");
  }

  game.tsmp = now;
  if (turn == "b") {
    game.time[0] = returnTime;
    setGameTimeout(
      gameId,
      async () => {
        console.log("Время черных вышло");
        game.time[1] = 0;
        await setGameOver({ gameId, result: "1-0" });
      },
      game.time[1]
    );
  } else {
    game.time[1] = returnTime;
    setGameTimeout(
      gameId,
      async () => {
        console.log("Время белых вышло");
        game.time[0] = 0;
        await setGameOver({ gameId, result: "0-1" });
      },
      game.time[0]
    );
  }

  //   const beforeChangedTime: number = side == "w" ? time[ : time[1];
}
