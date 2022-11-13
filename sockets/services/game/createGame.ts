import type { SocketRemoteType, SocketType } from "../../types";
import { TIME_TO_CANCEL_GAME } from "../../variables/redisIndex";
import { deleteGame, setGame } from "../../global/games";
import { Chess } from "chess.js";
import { v4 as uuid } from "uuid";

export async function createGame({
  sockets,
  data,
}: {
  sockets: [socket1: SocketType, socket2: SocketRemoteType];
  data: {
    white: { username: string; rating: number };
    black: { username: string; rating: number };
    control: string;
  };
}) {
  if (!sockets[0].data?.username || !sockets[1].data?.username)
    throw Error("User can't be found");

  const generatedId = uuid();

  // Set game inside memory
  const timerId = setInterval(() => {
    deleteGame(generatedId);
  }, TIME_TO_CANCEL_GAME);
  setGame(generatedId, {
    chess: new Chess(),
    white: data.white,
    black: data.black,
    time: [
      +data.control.split("+")[0] * 60 * 1000,
      +data.control.split("+")[0] * 60 * 1000,
    ],
    ply: 0,
    tsmp: new Date().getTime(),
    increment: +data.control.split("+")[1],
    timerId,
    result: "*",
    control: data.control,
  });

  // :TODO Записать в хеш, что идет игра

  sockets[0].emit("game:started", { gameId: generatedId });
  sockets[1].emit("game:started", { gameId: generatedId });
}
