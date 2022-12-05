import { getGame, increasePly, setGamePgn } from "../../global/games";

import { changeTime } from "../../services/game/changeTime";
import { isGameOver } from "../../services/game/isGameOver";
import { setGameOver } from "../../services/game/setGameOver";

import { GAME_ROOM } from "../../variables/redisIndex";

import type { SocketType } from "../../types/sockets";
import { Chess } from "chess.js";

export async function onMove(
  this: SocketType,
  { move, gameId }: { move: string; gameId: string }
) {
  const socket = this;

  try {
    const [game] = await getGame(gameId);
    if (!game) throw Error("Game not found");

    const chess = new Chess();
    chess.loadPgn(game.pgn);
    const turn = chess.turn();

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
    const resultMove = chess.move(move);

    if (!resultMove) throw Error("Move is incorrect");
    await changeTime({
      gameId,
      increment: game.increment,
      tsmp: game.tsmp,
      turn,
      game,
    });

    const result = isGameOver({ chess });
    if (result != "*") {
      await setGameOver({ gameId, result, game });
    }

    // prettier-ignore
    Promise.all([increasePly(gameId), setGamePgn({gameId, pgn:chess.pgn()})])

    socket.to(GAME_ROOM(gameId)).emit("game:move", move);
  } catch (error) {
    console.log(error);
  }
}
