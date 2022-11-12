<script lang="ts">
  import { page } from "$app/stores";
  import Board from "$components/game/Board.svelte";
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
    type Color,
  } from "cm-chessboard-ts";
  import { info } from "$store/game/info";

  let boardHTML: HTMLElement;

  function inputHandler(event: {
    chessboard: ChessBoardInstance;
    type: string;
    square: string;
    squareFrom: string;
    squareTo: string;
  }) {
    console.log("event", event);
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
      const result = $chess.move(move);
      if (result) {
        $board.disableMoveInput();
        $board.state.moveInputProcess.then(() => {
          // wait for the move input process has finished
          $board.setPosition($chess.fen(), true).then(() => {
            // update position, maybe castled and wait for animation has finished
            console.log(result);
            $socket.emit("game:move", {
              move: result.san,
              gameId: $page.params.id,
            });
          });
        });
      } else {
        console.warn("invalid move", move);
      }
      return result;
    }
  }

  onMount(() => {
    $socket.emit(
      "game:get",
      { gameId: $page.params.id },
      ({ white, black, time, pgn, status }: GetGame) => {
        $chess = new Chess();
        // @ts-ignore
        $chess.loadPgn(pgn);
        $board = new Chessboard(boardHTML, {
          orientation: black === $page.data.user?.username ? "b" : "w",
          position: $chess.fen(),
          style: {
            borderType: "frame",
            aspectRatio: 1,
            cssClass: "blue",
            moveFromMarker: undefined,
            moveToMarker: undefined,
          },
          sprite: {
            url: "/assets/images/chessboard-sprite-staunty.svg", // pieces and markers are stored in a sprite file
            size: 40, // the sprite tiles size, defaults to 40x40px
            cache: true, // cache the sprite
          },
        });

        $info = { black, white, time, status };

        if (status == "running") {
          $socket.on("game:move", (move: string) => {
            const result = $chess.move(move);
            if (result) {
              $board.setPosition($chess.fen(), true);
            }
          });

          if (white === $page.data.user?.username) {
            $board.enableMoveInput(inputHandler, COLOR.white);
          }
        }
      }
    );
  });
</script>

<div class=" w-[30rem]">
  <!-- <div class="">{$info?.white}</div> -->
  <Board bind:boardHTML />
  <!-- <div class="">{$info?.black}</div> -->
</div>
