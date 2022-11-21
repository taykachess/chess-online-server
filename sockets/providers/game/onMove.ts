import { getGame, increasePly } from "../../global/games";

import { changeTime } from "../../services/game/changeTime";
import { isGameOver } from "../../services/game/isGameOver";
import { onGameOver } from "../../services/game/onGameOver";

import { GAME_ROOM } from "../../variables/redisIndex";

import type { SocketType } from "../../types/sockets";

export async function onMove(
  this: SocketType,
  { move, gameId }: { move: string; gameId: string }
) {
  const socket = this;

  console.log(move);

  try {
    const game = await getGame(gameId);
    if (!game) throw Error("Game not found");

    const turn = game.chess.turn();

    if (turn == "w" && game.white.username != socket.data.username)
      throw Error("You have no access to resign");
    if (turn == "b" && game.black.username != socket.data.username)
      throw Error("You have no access to resign");
    // if (
    //   !(
    //     game.white.username == socket.data.username ||
    //     game.black.username == socket.data.username
    //   )
    // )
    //   throw Error("You have no access to move");
    const resultMove = game.chess.move(move);

    if (!resultMove) throw Error("Move is incorrect");
    changeTime({
      gameId,
      increment: game.increment,
      tsmp: game.tsmp,
    });

    const result = isGameOver({ chess: game.chess });
    if (result != "*") {
      await onGameOver({ gameId, result });
    }

    increasePly(gameId);

    socket.to(GAME_ROOM(gameId)).emit("game:move", move);
  } catch (error) {
    console.log(error);
  }
}
