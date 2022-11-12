<script lang="ts">
  // import { Chessboard, COLOR, type Color } from "cm-chessboard-ts";
  // import type { ChessBoardInstance } from "cm-chessboard-ts";
  // export let fen: string = "start";
  // export let orientation: Color = COLOR.white;
  // export let board: ChessBoardInstance;
  export let boardHTML: HTMLElement;
  // const create = (node: HTMLElement) => {
  // board = new Chessboard(node, {
  //   orientation,
  //   position: fen,
  //   style: { borderType: "frame", aspectRatio: 1, cssClass: "blue" },
  //   sprite: {
  //     url: "/assets/images/chessboard-sprite-staunty.svg", // pieces and markers are stored in a sprite file
  //     size: 40, // the sprite tiles size, defaults to 40x40px
  //     cache: true, // cache the sprite
  //   },
  // });
  // };
</script>

<div bind:this={boardHTML} />

<style>
  @import "/assets/styles/cm-chessboard.css";
</style>
