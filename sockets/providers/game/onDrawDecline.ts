import { getGame } from "../../global/games";
import { io } from "../../global/io";
import { SocketType } from "../../types";
import { GAMEROOM } from "../../variables/redisIndex";

export async function onDrawDecline(
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
      throw Error("You have no access to decline draw");

    if (!game.lastOfferDraw) throw Error("Nothing to accept");
    if (game.lastOfferDraw.username == socket.data.username)
      throw Error("You can't decline your draw ");

    if (game.lastOfferDraw.ply + 2 < game.ply) throw Error("Too late");

    game.lastOfferDraw.status = "declined";

    io.to(GAMEROOM(gameId)).emit("game:declineDraw");
    // await onGameOver({ gameId, result: "0.5-0.5" });

    // await onGameOver({ gameId, result });
  } catch (error) {
    console.log(error);
  }
}
