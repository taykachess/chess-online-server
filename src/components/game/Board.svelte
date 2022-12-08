<script lang="ts">
  import { info } from "$store/game/info";
  import { isTournamentTimerVisible } from "$store/game/tournament";

  // import { info } from "console";
  export let boardHTML: HTMLElement;
</script>

<!-- 40rem is standart, so if make w-full is going to be problem -->
<div class="     relative flex-none  ">
  <div bind:this={boardHTML} class=" relative ">
    {#if $isTournamentTimerVisible}
      <div
        class=" absolute inset-0 flex items-center justify-center  bg-slate-50/60    "
      >
        <div class=" bg-slate-50 p-2 font-serif text-4xl text-slate-800">
          Начало тура через 0:20
        </div>
      </div>
    {/if}
  </div>
  >
</div>

<style>
  @import "/assets/styles/cm-chessboard.css";
  @import "/assets/styles/promotion-dialog.css";
</style>
