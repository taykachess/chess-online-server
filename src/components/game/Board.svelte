<script lang="ts">
  import { page } from "$app/stores";
  import { formatTime } from "$lib/utils/formatTime";
  import { board } from "$store/game/board";
  import { info } from "$store/game/info";
  import {
    isTournamentTimerVisible,
    tournamentPrepareTime,
  } from "$store/game/tournament";
  import type { Config } from "@sveltejs/kit";
  import { Chessboard, COLOR, MARKER_TYPE } from "cm-chessboard-ts";
  import { onMount } from "svelte";
  import { PromotionDialog } from "cm-chessboard-ts/src/cm-chessboard/extensions/promotion-dialog";

  let boardHTML: HTMLElement;
  export let orientation: "w" | "b";
  export let position: string;
  export let inputHandler: any;
  function setChessBoardToDOM() {
    const config: Config = {
      orientation,
      responsive: true,
      animationDuration: 40,
      position,
      style: {
        borderType: "none",
        showCoordinates: false,
        aspectRatio: 1,
        cssClass: "fancy-gray",
        moveFromMarker: MARKER_TYPE.square,
        moveToMarker: MARKER_TYPE.square,
      },
      sprite: {
        // -staunty
        url: "/assets/images/chessboard-sprite.svg", // pieces and markers are stored in a sprite file
        size: 40, // the sprite tiles size, defaults to 40x40px
        cache: true, // cache the sprite
      },
      // @ts-ignore
      extensions: [{ class: PromotionDialog, props: {} }],
    };
    $board = new Chessboard(boardHTML, config);
    // $board.
  }

  onMount(() => {
    console.log("Mounted");
    setChessBoardToDOM();

    if (
      $info.white.username === $page.data.user?.username &&
      $info.chess.turn() == "w"
    ) {
      return $board.enableMoveInput(inputHandler, COLOR.white);
    }

    if (
      $info.black.username === $page.data.user?.username &&
      $info.chess.turn() == "b"
    ) {
      return $board.enableMoveInput(inputHandler, COLOR.black);
    }
  });
</script>

<!-- 40rem is standart, so if make w-full is going to be problem -->
<div class=" relative flex-none  ">
  <div bind:this={boardHTML} class=" relative ">
    {#if $isTournamentTimerVisible}
      <div
        class=" absolute inset-0 flex items-center justify-center  bg-slate-50/60    "
      >
        <div class=" bg-slate-50 p-2 font-serif text-4xl text-slate-800">
          Начало тура через {formatTime($tournamentPrepareTime)}
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  @import "../../../static/assets/styles/cm-chessboard.css";
  @import "../../../static/assets/styles/promotion-dialog.css";
</style>
