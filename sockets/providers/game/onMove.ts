import { getGame } from "../../global/games";
import { io } from "../../global/io";
import { changeTime } from "../../services/game/changeTime";
import { isGameOver } from "../../services/game/isGameOver";
import { onGameOver } from "../../services/game/onGameOver";
import { SocketType } from "../../types";

export async function onMove(
  this: SocketType,
  { move, gameId }: { move: string; gameId: string }
) {
  const socket = this;

  try {
    const game = getGame(gameId);
    if (!game) throw Error("Game not found");
    if (
      !(
        game.white.username == socket.data.username ||
        game.black.username == socket.data.username
      )
    )
      throw Error("You have no access to move");
    const resultMove = game.chess.move(move);

    if (!resultMove) throw Error("Move is incorrect");
    const turn = game.chess.turn();
    changeTime({
      gameId,
      turn,
      // time: turn == "b" ? game.time[0] : game.time[1],
      increment: game.increment,
      tsmp: game.tsmp,
    });

    console.log(game.time);

    const result = isGameOver({ chess: game.chess, turn });
    if (result != "*") {
      await onGameOver({ gameId, result });
    }

    socket.to(`game${gameId}`).emit("game:move", move);
  } catch (error) {
    console.log(error);
  }
}
