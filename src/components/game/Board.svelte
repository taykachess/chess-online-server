<script lang="ts">
  import { Chessboard, COLOR, type Color } from "cm-chessboard-ts";
  import type { ChessBoardInstance } from "cm-chessboard-ts";
  export let fen: string = "start";
  export let orientation: Color = COLOR.white;
  export let board: ChessBoardInstance;

  const create = (node: HTMLElement) => {
    board = new Chessboard(node, {
      orientation,
      position: fen,
      style: { borderType: "frame", aspectRatio: 1, cssClass: "blue" },
      sprite: {
        url: "/assets/images/chessboard-sprite-staunty.svg", // pieces and markers are stored in a sprite file
        size: 40, // the sprite tiles size, defaults to 40x40px
        cache: true, // cache the sprite
      },
    });

    setTimeout(() => {
      board.movePiece("e2", "e4", true);
    }, 5000);
  };
</script>

<div class=" w-[30rem] ">
  <div use:create />
</div>

<style>
  @import "/assets/styles/cm-chessboard.css";
</style>
