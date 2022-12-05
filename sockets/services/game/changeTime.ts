import {
  getGame,
  setTimeBlack,
  setTimestamp,
  setTimeWhite,
} from "../../global/games";
import { setGameTimeout } from "../../global/timers";
import { Game } from "../../types/game";

import { setGameOver } from "./setGameOver";

export async function changeTime({
  gameId,
  increment,
  tsmp,
  turn,
  game,
}: {
  gameId: string;
  increment: number;
  tsmp: number;
  turn: "w" | "b";
  game: Game;
}) {
  const time = turn == "w" ? game.time[0] : game.time[1];
  const now = new Date().getTime();
  const diff = now - tsmp;
  const newTime = time - diff;
  const isLostOnTime = newTime <= 0;
  const returnTime = isLostOnTime ? 0 : newTime + increment * 1000;
  if (isLostOnTime) {
    return console.log("Lost on time");
  }

  await setTimestamp(gameId, now);

  if (turn == "w") {
    await setTimeWhite(gameId, returnTime);

    setGameTimeout(
      gameId,
      async () => {
        await setTimeBlack(gameId, 0);
        await setGameOver({ gameId, result: "1-0", game });
      },
      game.time[1]
    );
  } else {
    await setTimeBlack(gameId, returnTime);
    setGameTimeout(
      gameId,
      async () => {
        await setTimeWhite(gameId, 0);
        await setGameOver({ gameId, result: "0-1", game });
      },
      game.time[0]
    );
  }
}
