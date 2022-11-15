<script lang="ts">
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

<div class="  p-2 text-2xl font-bold tracking-tighter   text-slate-800 ">
  {formatTime(time)}
</div>
