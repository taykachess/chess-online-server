<script lang="ts">
  import ChessClockSVG from "$components/icons/ChessClockSVG.svelte";
  import { info } from "$store/game/info";

  export let side: "w" | "b";

  export let time: number;
  function formatTime(timestamp: number): string {
    if (timestamp <= 0) {
      return `0:00:00 `;
    }
    const minutes = Math.trunc(timestamp / 60000);
    const seconds = Math.trunc(timestamp / 1000) % 60;
    // const mSec = Math.trunc(timestamp % 1000);
    // :${mSec}
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  }
</script>

<div
  class="  flex items-center p-2 text-2xl   font-bold tracking-tighter text-slate-800 "
>
  <div class=" ">{formatTime(time)}</div>
  {#if $info.chess.turn() == side}
    <div class=" ml-5 -mt-1 h-8 w-8"><ChessClockSVG /></div>
  {/if}
</div>
