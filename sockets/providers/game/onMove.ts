import { io } from "../../global/io";
import { SocketType } from "../../types";

export async function onMove(
  this: SocketType,
  { move, gameId }: { move: string; gameId: string }
) {
  const socket = this;

  console.log("move", move, gameId);
  socket.to(`game${gameId}`).emit("game:move", move);
}
