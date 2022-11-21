import { getGame } from "../../global/games";
import { io } from "../../global/io";

import type { SocketType } from "../../types/sockets";

import { GAME_ROOM } from "../../variables/redisIndex";

export async function onDrawOffer(
  this: SocketType,
  { gameId }: { gameId: string }
) {
  const socket = this;

  try {
    const game = getGame(gameId);
    if (!game) throw Error("Game not found");
    if (
      game.white.username != socket.data.username &&
      game.black.username != socket.data.username
    )
      throw Error("You have no access to offerDraw");

    const lastOfferDraw = game.lastOfferDraw;
    if (!lastOfferDraw) {
      game.lastOfferDraw = { username: socket.data.username, ply: game.ply };
      return io.to(GAME_ROOM(gameId)).emit("game:offerDraw", {
        username: socket.data.username,
        ply: game.ply,
      });
    } else if (lastOfferDraw.username === socket.data.username) {
      throw Error("You are already offered draw");
    } else {
      game.lastOfferDraw = { username: socket.data.username, ply: game.ply };

      return io.to(GAME_ROOM(gameId)).emit("game:offerDraw", {
        username: socket.data.username,
        ply: game.ply,
      });
    }
  } catch (error) {
    console.log(error);
  }
}
