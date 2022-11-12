import { getGame } from "../../global/games";
import { SocketType } from "../../types";
import { GetGame } from "../../../src/types/sockets/socket";

export async function onGameGet(
  this: SocketType,
  { gameId }: { gameId: string },
  cb: (data: GetGame) => void
) {
  try {
    const socket = this;
    const game = getGame(gameId);
    // console.log("goood", game);

    if (!game) {
      return;
    }

    socket.join(`game${gameId}`);
    const pgn = game.chess.pgn();
    const { white, black, time } = game;

    cb({ white, black, time, pgn, status: "running" });
  } catch (error) {
    console.log(error);
  }
}
