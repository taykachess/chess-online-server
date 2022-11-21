<script lang="ts">
  import PulseAnimatedElement from "$components/common/PulseAnimatedElement.svelte";

  import { filters } from "$store/home/challenges";
  import { socket } from "$store/sockets/socket";

  import type { MatchFilters } from "$types/match";

  // prettier-ignore
  const controls = ["1+0", "1+1", "1+2", "3+0", "3+2", "5+3", "10+0", "10+5"];
  let currentControl: string = "";
  function createMatch({
    control,
    filters,
    rounds,
  }: {
    control: string;
    filters: MatchFilters;
    rounds: number;
  }) {
    if (currentControl === control) return cancelMatch();
    currentControl = control;
    $socket.emit("match:create", { control, filters, rounds });
  }

  function cancelMatch() {
    currentControl = "";
    $socket.emit("match:cancel");
  }
</script>

<div class=" grid grid-cols-3 gap-2">
  {#each controls as control}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      on:click={() => createMatch({ control, filters: $filters, rounds: 6 })}
      class=" relative flex aspect-square cursor-pointer items-center justify-center rounded-lg {currentControl ==
      control
        ? ' bg-slate-900'
        : 'bg-slate-800'} border  border-slate-700 text-2xl  text-slate-400 shadow-lg shadow-slate-900 hover:bg-slate-900 "
    >
      {control}
      {#if currentControl === control}
        <div class=" absolute top-0 right-0">
          <PulseAnimatedElement />
        </div>
      {/if}
    </div>
  {/each}
</div>
