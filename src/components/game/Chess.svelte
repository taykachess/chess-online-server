<script lang="ts">
  import Board from "$components/game/Board.svelte";

  import { page } from "$app/stores";
  import { socket } from "$store/sockets/socket";
  import type { GetGame } from "$types/game";
  import { Chess, type Move, type Square } from "cm-chess";
  import {
    MARKER_TYPE,
    INPUT_EVENT_TYPE,
    Chessboard,
    COLOR,
    type ChessBoardInstance,
    type Config,
  } from "cm-chessboard-ts";
  import { info } from "$store/game/info";
  import Timer from "./Timer.svelte";
  import PlayerCard from "./PlayerCard.svelte";
  import Viewer from "./Viewer.svelte";
  import { browser } from "$app/environment";
  import GameManager from "./GameManager.svelte";
  import { board } from "$store/game/board";
  import { afterNavigate, beforeNavigate } from "$app/navigation";
  import MatchResults from "./MatchResults.svelte";
  import Badge from "$components/common/Badge.svelte";
  import { match } from "$store/game/match";

  import { PromotionDialog } from "cm-chessboard-ts/src/cm-chessboard/extensions/promotion-dialog";

  let lastTime: number;
  let boardHTML: HTMLElement;
  if (browser) {
    console.log("Get game");
    getGame();
  }

  function playClock(time: number) {
    // console.log(time);
    if (lastTime) {
      const delta = time - lastTime;
      if ($info.chess.turn() == "w") {
        $info.time[0] = $info.time[0] - delta;
      } else {
        $info.time[1] = $info.time[1] - delta;
      }
    }
    lastTime = time;
    $info.requestId = window.requestAnimationFrame(playClock);
  }

  function startClock() {
    console.log("Start clock", $info.chess.turn());
    $info.requestId = window.requestAnimationFrame(playClock);
  }

  function stopClock() {
    window.cancelAnimationFrame($info.requestId);
  }

  function increamentTimer(newTurn: "w" | "b") {
    if (!$info.increment) return;
    if (newTurn == "w") $info.time[1] = $info.time[1] + $info.increment * 1000;
    else $info.time[0] = $info.time[0] + $info.increment * 1000;
  }

  function setChessBoardToDOM() {
    const config: Config = {
      orientation:
        $info.black.username === $page.data.user?.username ? "b" : "w",
      responsive: true,
      position: $info.chess.fen(),
      style: {
        borderType: "none",
        showCoordinates: false,
        aspectRatio: 1,
        // "fancy-gray"
        cssClass: "fancy-gray",
        // cssClass: "black-and-white",
        moveFromMarker: MARKER_TYPE.square,
        moveToMarker: MARKER_TYPE.square,
      },
      sprite: {
        // -staunty
        url: "/assets/images/chessboard-sprite.svg", // pieces and markers are stored in a sprite file
        size: 40, // the sprite tiles size, defaults to 40x40px
        cache: true, // cache the sprite
      },
      extensions: [{ class: PromotionDialog, props: {} }],
      // extensions:{}
    };
    $board = new Chessboard(boardHTML, config);
  }
  function setSocketListeners() {
    $socket.on("game:move", (move: string) => {
      const result = $info.chess.move(move);
      if (result) {
        $info.tree.history = $info.tree.history;
        $info.tree.liveNode = $info.tree.history[$info.tree.history.length - 1];
        $info.tree.currentNode =
          $info.tree.history[$info.tree.history.length - 1];
        $info.ply = $info.ply + 1;

        $board.setPosition($info.chess.fen(), true);
        const newTurn = $info.chess.turn();
        increamentTimer(newTurn);
        if (
          $info.white.username === $page.data.user?.username &&
          newTurn == "w"
        ) {
          return $board.enableMoveInput(inputHandler, COLOR.white);
        }

        if (
          $info.black.username === $page.data.user?.username &&
          newTurn == "b"
        ) {
          return $board.enableMoveInput(inputHandler, COLOR.black);
        }
      } else {
        console.warn("invalid move", move, $info.chess.fen());
      }
    });

    $socket.on("game:end", ({ result, newEloBlack, newEloWhite }) => {
      console.log("game over", newEloBlack, newEloWhite, $info.role);
      stopClock();
      $info.result = result;

      $info.white.ratingNext = newEloWhite;
      $info.black.ratingNext = newEloBlack;

      if ($match) {
        $match.games.push({
          white: $info.white.username,
          black: $info.black.username,
          result,
          gameId: $page.params.id,
        });

        $match.games = $match.games;

        if ($match.player1 == $info.white.username) {
          if (result == "1-0") $match.result[0] = $match.result[0] + 1;
          else if (result == "0-1") $match.result[1] = $match.result[1] + 1;
          else if (result == "0.5-0.5") $match.result[2] = $match.result[2] + 1;
        } else if ($match.player1 == $info.black.username) {
          if (result == "1-0") $match.result[1] = $match.result[1] + 1;
          else if (result == "0-1") $match.result[0] = $match.result[0] + 1;
          else if (result == "0.5-0.5") $match.result[2] = $match.result[2] + 1;
        }
      }

      if ($page.data.gameIds) {
        console.log("delete gameIds");
        const index = $page.data.gameIds.indexOf($page.params.id);

        if (index !== -1) $page.data.gameIds.splice(index, 1);
      }
      // $match.games = $match.games;

      // prettier-ignore
      // $page.data.user.rating = 5555
      // page.subscribe((val)=>{
      //     if(val.data.user)
      //     val.data.user.rating = 4001
      //     // $info.role == 'w'? newEloWhite : $info.role == 'b'?newEloBlack: val.data.user.rating
      //   })
      // $info.white = $info.white;
      // $info.black = $info.black;
      // $info = $info;
      $board.disableMoveInput();
    });
  }
  function inputHandler(event: {
    chessboard: ChessBoardInstance;
    type: string;
    square: string;
    squareFrom: Square;
    squareTo: Square;
    piece: string;
  }) {
    event.chessboard.removeMarkers(MARKER_TYPE.dot);
    // let moves: Move[];
    if (event.type === INPUT_EVENT_TYPE.moveInputStarted) {
      const moves = $info.chess.moves({ square: event.square, verbose: true });
      for (const move of moves) {
        // draw dots on possible squares
        event.chessboard.addMarker(MARKER_TYPE.dot, move.to);
      }
      console.log(moves);
      return moves.length > 0;
    } else if (event.type === INPUT_EVENT_TYPE.validateMoveInput) {
      console.log("trying", event.squareTo.charAt(1));
      let move: Pick<Move, "from" | "to" | "promotion"> = {
        from: event.squareFrom,
        to: event.squareTo,
      };

      // Функция синхронная, так делать не разрешает
      // const pos = $board.getPosition();

      // console.log(event);
      const moves = $info.chess.moves({
        square: event.squareFrom,
        verbose: true,
      });
      // console.log(moves);
      console.log("event", event);

      // const promise = new Promise<string>((resolve, reject) => {
      if (
        (event.squareTo.charAt(1) === "8" ||
          event.squareTo.charAt(1) === "1") &&
        event.piece.charAt(1) === "p" &&
        moves?.some(
          (move) => move.to == event.squareTo && move.from == event.squareFrom
        )
      ) {
        return event.chessboard.showPromotionDialog(
          event.squareTo,
          $info.chess.turn(),
          (event: any) => {
            console.log("48a99d Piece selected", event);
            if (event.piece) {
              // resolve(event.piece[1]);
              move.promotion = event.piece[1];
              const result = $info.chess.move(move);

              if (result) {
                $board.disableMoveInput();
                $board.state.moveInputProcess.then(() => {
                  console.log("position seted");
                  // wait for the move input process has finished
                  $board.setPosition($info.chess.fen(), false).then(() => {
                    // update position, maybe castled and wait for animation has finished

                    $socket.emit("game:move", {
                      move: result.san,
                      gameId: $page.params.id,
                    });

                    $info.ply = $info.ply + 1;

                    $info.tree.history = $info.tree.history;
                    $info.tree.liveNode =
                      $info.tree.history[$info.tree.history.length - 1];
                    $info.tree.currentNode =
                      $info.tree.history[$info.tree.history.length - 1];

                    const newTurn = $info.chess.turn();
                    increamentTimer(newTurn);
                  });
                });
              } else {
                // Must work without it, but does'not ! Maybe bug of the last version!
                // $board.setPosition(pos);
                console.warn("invalid move", move, $info.chess.fen());
              }
              // event.chessboard.setPiece(event.square, event.piece, true);
            } else {
              // await $board.setPosition(pos);
            }
          }
        );
      }

      console.log("want to move");
      // });

      // const promotionPiece = await promise;
      // if (promotionPiece) move.promotion = promotionPiece;

      console.log("want to move");
      // @ts-ignore
      const result = $info.chess.move(move);
      console.log("result", result);

      if (result) {
        $board.disableMoveInput();
        $board.state.moveInputProcess.then(() => {
          console.log("position seted");
          // wait for the move input process has finished
          $board.setPosition($info.chess.fen(), false).then(() => {
            // update position, maybe castled and wait for animation has finished

            $socket.emit("game:move", {
              move: result.san,
              gameId: $page.params.id,
            });

            $info.ply = $info.ply + 1;

            $info.tree.history = $info.tree.history;
            $info.tree.liveNode =
              $info.tree.history[$info.tree.history.length - 1];
            $info.tree.currentNode =
              $info.tree.history[$info.tree.history.length - 1];

            const newTurn = $info.chess.turn();
            increamentTimer(newTurn);
          });
        });
      } else {
        // Must work without it, but does'not ! Maybe bug of the last version!
        // $board.setPosition(pos);
        console.warn("invalid move", move, $info.chess.fen());
      }
      return result;
    }
  }

  function getGame() {
    $socket.emit(
      "game:get",
      { gameId: $page.params.id },
      async ({
        white,
        black,
        time,
        pgn,
        result,
        increment,
        lastOfferDraw,
        matchId,
      }: GetGame) => {
        const chess = new Chess();
        // @ts-ignore
        await chess.loadPgn(pgn);
        const tmpHistory = chess.history();
        $info = {
          chess,
          tree: {
            // @ts-ignore
            history: tmpHistory,
            // @ts-ignore
            currentNode: tmpHistory[tmpHistory.length - 1],
            // @ts-ignore
            liveNode: tmpHistory[tmpHistory.length - 1],
          },
          black,
          white,
          time,
          result,
          pgn,
          matchId,
          increment,
          role:
            black.username === $page.data.user?.username
              ? "b"
              : white.username === $page.data.user?.username
              ? "w"
              : undefined,
          lastOfferDraw,
          ply: tmpHistory[tmpHistory.length - 1]
            ? // @ts-ignore
              tmpHistory[tmpHistory.length - 1].ply
            : 0,
        };

        $info = $info;
        console.log($board, "board!!!!!!!!");
        console.log($board);
        if (!$board) setChessBoardToDOM();
        else {
          $board.setPosition(chess.fen());
          $board.setOrientation(
            $info.black.username === $page.data.user?.username ? "b" : "w"
          );
        }

        if (result == "*") {
          $socket.emit("game:sub", { gameId: $page.params.id });

          startClock();
          setSocketListeners();
          const turn = $info.chess.turn();

          if (white.username === $page.data.user?.username && turn == "w") {
            return $board.enableMoveInput(inputHandler, COLOR.white);
          }

          if (black.username === $page.data.user?.username && turn == "b") {
            return $board.enableMoveInput(inputHandler, COLOR.black);
          }
        }
      }
    );
  }

  afterNavigate(({ willUnload, from, to }) => {
    if (to?.route.id == from?.route.id && to?.params?.id != from?.params?.id) {
      getGame();
      // @ts-ignore
    } else $board = undefined;
  });

  beforeNavigate(({}) => {
    if ($info.result == "*") {
      $socket.emit("game:leave", { gameId: $page.params.id });
    }
  });

  $: orientation =
    $info?.black?.username === $page.data.user?.username ? "b" : "w";
</script>

<!-- <div class="">
  <div class="text-3xl text-slate-900">♕ ♔ ♗ ♘ ♖ ♙</div>
  <div class="text-3xl text-slate-900">♛ ♚ ♝ ♞ ♜ ♟︎ ♟︎</div>
</div> -->
<div class=" z-0 grid w-full max-w-4xl md:grid-cols-7 ">
  <div class=" col-span-5">
    <Board bind:boardHTML />
  </div>

  {#if $info}
    <div
      class="col-span-2 ml-3 flex  {orientation == 'w'
        ? 'flex-col'
        : 'flex-col-reverse'} justify-between"
    >
      <div
        class=" flex {orientation == 'w' ? 'flex-col' : 'flex-col-reverse'} "
      >
        <!-- TODO: Get rid of bind -->

        <PlayerCard bind:player={$info.black} />
        <Timer bind:time={$info.time[1]} side="b" />
      </div>

      <div class=" ">
        <div
          class=" max-h-40 overflow-y-scroll rounded-l-lg border-y border-slate-600"
        >
          <Viewer />
        </div>
        <GameManager />
      </div>
      <div class="flex {orientation == 'w' ? 'flex-col-reverse' : 'flex-col'}">
        <!-- TODO: Get rid of bind -->
        <PlayerCard bind:player={$info.white} />
        <Timer bind:time={$info.time[0]} side="w" />
      </div>
    </div>
    {#if $info.matchId}
      <div class="  col-span-5  mt-4 flex items-center justify-center  ">
        <MatchResults matchId={$info.matchId} />
      </div>
    {/if}
  {/if}
</div>
