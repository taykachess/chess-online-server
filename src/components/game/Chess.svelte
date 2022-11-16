<script lang="ts">
  import Board from "$components/game/Board.svelte";

  import { page } from "$app/stores";
  import { board } from "$store/game/board";
  import { chess } from "$store/game/chess";
  import { socket } from "$store/sockets/socket";
  import type { GetGame } from "$types/sockets/socket";
  import { Chess } from "cm-chess";
  import { onMount } from "svelte";
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
  import { tree } from "$store/game/tree";
  import GameManager from "./GameManager.svelte";

  let lastTime: number;
  let boardHTML: HTMLElement;
  if (browser) {
    getGame();
  }

  function playClock(time: number) {
    // console.log(time);
    if (lastTime) {
      const delta = time - lastTime;
      if ($chess.turn() == "w") {
        $info.time[0] = $info.time[0] - delta;
      } else {
        $info.time[1] = $info.time[1] - delta;
      }
    }
    lastTime = time;
    $info.requestId = window.requestAnimationFrame(playClock);
  }

  function startClock() {
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
      responsive: true,
      position: $chess.fen(),
      style: {
        borderType: "frame",
        aspectRatio: 1,
        cssClass: "blue",
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
      const result = $chess.move(move);
      if (result) {
        $tree.history = $tree.history;
        $tree.liveNode = $tree.history[$tree.history.length - 1];
        $tree.currentNode = $tree.history[$tree.history.length - 1];
        $info.ply = $info.ply + 1;

        $board.setPosition($chess.fen(), true);
        const newTurn = $chess.turn();
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
        console.warn("invalid move", move, $chess.fen());
      }
    });

    $socket.on("game:end", ({ result }) => {
      stopClock();
      $info.result = result;
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
      const moves = $chess.moves({ square: event.square, verbose: true });
      for (const move of moves) {
        // draw dots on possible squares
        event.chessboard.addMarker(MARKER_TYPE.dot, move.to);
      }
      return moves.length > 0;
    } else if (event.type === INPUT_EVENT_TYPE.validateMoveInput) {
      const move = { from: event.squareFrom, to: event.squareTo };
      // @ts-ignore
      const result = $chess.move(move);

      if (result) {
        $board.disableMoveInput();
        $board.state.moveInputProcess.then(() => {
          // wait for the move input process has finished
          $board.setPosition($chess.fen(), false).then(() => {
            // update position, maybe castled and wait for animation has finished

            $socket.emit("game:move", {
              move: result.san,
              gameId: $page.params.id,
            });

            $info.ply = $info.ply + 1;

            $tree.history = $tree.history;
            $tree.liveNode = $tree.history[$tree.history.length - 1];
            $tree.currentNode = $tree.history[$tree.history.length - 1];

            const newTurn = $chess.turn();
            increamentTimer(newTurn);
          });
        });
      } else {
        console.warn("invalid move", move, $chess.fen());
      }
      return result;
    }
  }

  function getGame() {
    $socket.emit(
      "game:get",
      { gameId: $page.params.id },
      ({ white, black, time, pgn, result, inc, lastOfferDraw }: GetGame) => {
        $chess = new Chess();
        // @ts-ignore
        $chess.loadPgn(pgn);

        const tmpHistory = $chess.history();
        $info = {
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
        // @ts-ignore
        $tree
          ? // @ts-ignore
            ($tree.history = tmpHistory)
          : ($tree = {
              // @ts-ignore
              history: tmpHistory,
              // @ts-ignore
              currentNode: tmpHistory[tmpHistory.length - 1],
              // @ts-ignore
              liveNode: tmpHistory[tmpHistory.length - 1],
            });
        console.log($info.time);
        setChessBoardToDOM();

        if (result == "*") {
          startClock();
          setSocketListeners();
          const turn = $chess.turn();

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
</script>

<div class=" flex ">
  <div class=" mr-3 flex   flex-col justify-between">
    <PlayerCard />
    <PlayerCard />
  </div>
  <div class=" relative w-[20rem]    ">
    <Board bind:boardHTML />
  </div>
  <div
    class="ml-3 flex  {$board?.getOrientation() == 'w'
      ? 'flex-col'
      : 'flex-col-reverse'} justify-between"
  >
    <Timer time={$info?.time[1]} />
    <div class=" ">
      <div class=" h-40 overflow-y-scroll border border-slate-600/20">
        <Viewer />
      </div>
      <GameManager />
    </div>
    <Timer time={$info?.time[0]} />
  </div>
</div>
