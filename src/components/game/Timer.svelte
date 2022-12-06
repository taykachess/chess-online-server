<script lang="ts">
  import ChessClockSVG from "$components/icons/ChessClockSVG.svelte";
  import { formatTime } from "$lib/utils/formatTime";
  import { info } from "$store/game/info";

  export let side: "w" | "b";

  export let time: number;
</script>

<div
  class="  flex items-center p-2 text-2xl   font-bold tracking-tighter text-slate-800 "
>
  <div class=" ">{formatTime(time)}</div>
  {#if $info.chess.turn() == side}
    <div class=" ml-5 -mt-1 h-8 w-8"><ChessClockSVG /></div>
  {/if}
</div>
