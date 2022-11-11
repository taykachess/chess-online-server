import { Socket } from "socket.io";
import { io } from "../../global/io";
import { setJsonRedis } from "../redis/setJsonRedis";
export async function createGame({
  socketW,
  socketB,
  data,
}: {
  socketW: Socket;
  socketB: Socket;
  data: any;
}) {
  const generatedId = "game1234";
  socketW.join(generatedId);
  socketB.join(generatedId);

  await setJsonRedis({ index: "games", path: generatedId, data });
  io.in(generatedId).emit("game:started", { gameId: generatedId });
  return "";
}
