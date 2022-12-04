<script lang="ts">
  let boardHTML: HTMLElement;

  import {
    MARKER_TYPE,
    INPUT_EVENT_TYPE,
    Chessboard,
    COLOR,
    type ChessBoardInstance,
    type Config,
  } from "cm-chessboard-ts";
  import { onMount } from "svelte";

  import { PromotionDialog } from "cm-chessboard-ts/src/cm-chessboard/extensions/promotion-dialog";
  import { Chess } from "cm-chess";

  const chess = new Chess();
  function inputHandler(event) {
    console.log("event", event);
    event.chessboard.removeMarkers(MARKER_TYPE.dot);
    if (event.type === INPUT_EVENT_TYPE.moveInputStarted) {
      const moves = chess.moves({ square: event.square, verbose: true });
      for (const move of moves) {
        // draw dots on possible squares
        event.chessboard.addMarker(MARKER_TYPE.dot, move.to);
      }
      return moves.length > 0;
    } else if (event.type === INPUT_EVENT_TYPE.validateMoveInput) {
      const move = { from: event.squareFrom, to: event.squareTo };
      const result = chess.move(move);
      if (result) {
        event.chessboard.disableMoveInput();
        event.chessboard.state.moveInputProcess.then(() => {
          // wait for the move input process has finished
          event.chessboard.setPosition(chess.fen(), true).then(() => {
            // update position, maybe castled and wait for animation has finished
            const possibleMoves = chess.moves({ verbose: true });
            if (possibleMoves.length > 0) {
              const randomIndex = Math.floor(
                Math.random() * possibleMoves.length
              );
              const randomMove = possibleMoves[randomIndex];
              setTimeout(() => {
                // smoother with 500ms delay
                chess.move({ from: randomMove.from, to: randomMove.to });
                event.chessboard.enableMoveInput(inputHandler, COLOR.white);
                event.chessboard.setPosition(chess.fen(), true);
              }, 500);
            }
          });
        });
      } else {
        console.warn("invalid move", move);
      }
      return result;
    }
  }

  const config: Config = {
    position: chess.fen(),
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

  onMount(() => {
    const board = new Chessboard(boardHTML, config);
    board.enableMoveInput(inputHandler, "w");
  });
  // board.
</script>

<!-- 40rem is standart, so if make w-full is going to be problem -->
<div class="     relative flex-none  ">
  <div bind:this={boardHTML} class="   " />
</div>

<style>
  @import "/assets/styles/cm-chessboard.css";
  @import "/assets/styles/promotion-dialog.css";
</style>
