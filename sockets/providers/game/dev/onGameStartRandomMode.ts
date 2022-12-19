import { Chess } from "chess.js";
import { getGame, increasePly, setGamePgn } from "../../../global/games";
import { io } from "../../../global/io";
import { changeTime } from "../../../services/game/changeTime";
import { isGameOver } from "../../../services/game/isGameOver";
import { setGameOver } from "../../../services/game/setGameOver";
import { GAME_ROOM } from "../../../variables/redisIndex";

export async function onGameStartRandomMode({ gameId }: { gameId: string }) {
  try {
    const [game] = await getGame(gameId);
    if (!game) throw Error("Game not found");

    const chess = new Chess();
    chess.loadPgn(game.pgn);
    const turn = chess.turn();

    const moves = chess.moves();
    const randomNumber = Math.floor(Math.random() * moves.length);
    const randomMove = moves[randomNumber];

    // console.log(randomMove, moves.length, randomNumber);
    const resultMove = chess.move(randomMove);

    if (!resultMove) throw Error("Move is incorrect");
    const now = new Date().getTime();
    // if (game.tournamentId && now < TOURNAMENT_GAME_PREPARE_TIME + game.tsmp)
    //   throw Error("No time yet");

    await changeTime({
      gameId,
      increment: game.increment,
      tsmp: game.tsmp,
      turn,
      game,
      now,
    });

    const result = isGameOver({ chess });
    await Promise.all([
      increasePly(gameId),
      setGamePgn({ gameId, pgn: chess.pgn() }),
    ]);
    if (result != "*") {
      await setGameOver({ gameId, result, game });
    }

    // prettier-ignore
    io.to(GAME_ROOM(gameId)).emit("game:move", resultMove.san);
    const randomTime = Math.round(Math.random() * 5) * 1000;
    if (result == "*")
      setTimeout(() => {
        onGameStartRandomMode({ gameId });
      }, randomTime);
  } catch (error) {
    console.log(error);
  }
}
