<script lang="ts">
  import { board } from "$store/game/board";

  export let boardHTML: HTMLElement;
  function onDrag() {
    console.log();
    // wrapper.
  }
</script>

<!-- 40rem is standart, so if make w-full is going to be problem -->
<div class="  relative w-[36rem]   flex-none ">
  <div bind:this={boardHTML} class="  w-full  " />
  <!-- <div
    on:click={onDrag}
    on:dragenter={onDrag}
    on:dragstart={onDrag}
    on:drag={onDrag}
    class=" absolute bottom-0 right-0 h-4 w-4 cursor-nwse-resize bg-red-500"
  /> -->
</div>

<style>
  @import "/assets/styles/cm-chessboard.css";
</style>
