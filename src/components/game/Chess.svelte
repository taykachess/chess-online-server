<script lang="ts">
  import Board from "$components/game/Board.svelte";

  import { page } from "$app/stores";
  import { socket } from "$store/sockets/socket";
  import type { GetGame } from "$types/game";
  import { Chess } from "cm-chess";
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
  import { afterNavigate } from "$app/navigation";

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
    if (!$info.inc) return;
    if (newTurn == "w") $info.time[1] = $info.time[1] + $info.inc * 1000;
    else $info.time[0] = $info.time[0] + $info.inc * 1000;
  }

  function setChessBoardToDOM() {
    const config: Config = {
      orientation:
        $info.black.username === $page.data.user?.username ? "b" : "w",
      // responsive: true,
      position: $info.chess.fen(),
      style: {
        borderType: "thin",
        showCoordinates: false,
        aspectRatio: 1,
        cssClass: "black-and-white",
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
    squareFrom: string;
    squareTo: string;
  }) {
    event.chessboard.removeMarkers(MARKER_TYPE.dot);
    if (event.type === INPUT_EVENT_TYPE.moveInputStarted) {
      const moves = $info.chess.moves({ square: event.square, verbose: true });
      for (const move of moves) {
        // draw dots on possible squares
        event.chessboard.addMarker(MARKER_TYPE.dot, move.to);
      }
      return moves.length > 0;
    } else if (event.type === INPUT_EVENT_TYPE.validateMoveInput) {
      const move = { from: event.squareFrom, to: event.squareTo };
      // @ts-ignore
      const result = $info.chess.move(move);

      if (result) {
        $board.disableMoveInput();
        $board.state.moveInputProcess.then(() => {
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
        inc,
        lastOfferDraw,
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
          inc,
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
    } else $board = undefined;
  });

  $: orientation =
    $info?.black?.username === $page.data.user?.username ? "b" : "w";
</script>

<!-- <div class="">
  <div class="text-3xl text-slate-900">♕ ♔ ♗ ♘ ♖ ♙</div>
  <div class="text-3xl text-slate-900">♛ ♚ ♝ ♞ ♜ ♟︎ ♟︎</div>
</div> -->
<div class=" flex ">
  <Board bind:boardHTML />

  {#if $info}
    <div
      class="ml-3 flex  {orientation == 'w'
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
  {/if}
</div>
