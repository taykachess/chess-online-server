import { getGame } from "../../global/games";
import { onGameOver } from "../../services/game/onGameOver";
import { SocketType } from "../../types";

export async function onResign(
  this: SocketType,
  { gameId }: { gameId: string }
) {
  const socket = this;

  try {
    const game = getGame(gameId);
    if (
      game.white.username != socket.data.username &&
      game.black.username != socket.data.username
    )
      throw Error("You have no access to resign");

    // const turn = game.chess.turn();
    const result = game.white.username == socket.data.username ? "0-1" : "1-0";
    await onGameOver({ gameId, result });
  } catch (error) {
    console.log(error);
  }
}