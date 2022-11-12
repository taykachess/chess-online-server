import type { SocketRemoteType, SocketType } from "../../types";
import { redis } from "../../global/redis";
import { GAMES, TIME_TO_CANCEL_GAME } from "../../variables/redisIndex";
import { deleteGame, setGame } from "../../global/games";
import { Chess } from "chess.js";

export async function createGame({
  sockets,
  data,
}: {
  sockets: [socket1: SocketType, socket2: SocketRemoteType];
  data: any;
}) {
  if (!sockets[0].data?.username || !sockets[1].data?.username)
    throw Error("User can't be found");

  const generatedId = "game1234";
  // sockets[0].join(generatedId);
  // sockets[1].join(generatedId);

  await redis.json.set(GAMES, generatedId, data);

  // Set game inside memory
  const timerId = setInterval(() => {
    deleteGame(generatedId);
  }, TIME_TO_CANCEL_GAME);
  setGame(generatedId, {
    chess: new Chess(),
    white: sockets[0].data.username,
    black: sockets[1].data.username,
    time: [
      +data.control.split("+")[0] * 60 * 1000,
      +data.control.split("+")[0] * 60 * 1000,
    ],
    ply: 0,
    tsmp: new Date().getTime(),
    increment: +data.control.split("+")[1],
    timerId,
  });

  // await setJsonRedis({
  //   index: "playersInGame",
  //   path: socketW.data.username,
  //   data: [generatedId],
  // });

  // console.log(socketB.data.username, socketB.rooms);
  // console.log(socketW.data.username, socketW.rooms);
  sockets[0].emit("game:started", { gameId: generatedId });
  sockets[1].emit("game:started", { gameId: generatedId });
}
