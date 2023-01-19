<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import PlayerComponent from "$components/common/PlayerComponent.svelte";
  import { match } from "$store/game/match";
  import type { Result } from "$types/game";
  import type { Match, MatchResults, TimePeriods } from "$types/match";
  import { onDestroy } from "svelte";

  interface Res {
    control: string;
    time: number;
    res: { res: Result; id: string; num: number }[];
  }

  export let results: MatchResults;

  export let periods: TimePeriods;

  function transformResults(
    results: MatchResults,
    periods: TimePeriods
  ): Res[] {
    console.log("Transformed");
    const res: Res[] = [];
    if (results.length == 0 || periods.length == 0) return res;
    const lastStage = results[results.length - 1][2];
    let currentIndex = 0;
    let currentStage = 0;
    for (let i = 0; i < lastStage; i++) {
      currentStage = results[currentIndex][2];
      const resTemp: { res: Result; id: string; num: number }[] = [];
      while (
        currentIndex < results.length &&
        currentStage == results[currentIndex][2]
      ) {
        resTemp.push({
          res: results[currentIndex][1],
          id: results[currentIndex][0],
          num: ++currentIndex,
        });
      }
      res.push({ control: periods[i][1], time: periods[i][0], res: resTemp });
    }

    return res;
  }

  function calculateSummaPlayerOne(results: MatchResults): number {
    let summa = 0;

    results.forEach((res) => {
      if (!(res[1] == "*" || res[1] == "+" || res[1] == "-")) summa += +res[1];
    });

    return summa;
  }

  function calculateSummaPlayerTwo(results: MatchResults): number {
    let summa = 0;

    results.forEach((res) => {
      if (!(res[1] == "*" || res[1] == "+" || res[1] == "-")) {
        if (res[1] == "0") summa += 1;
        else if (res[1] == "0.5") summa += 0.5;
      }
    });

    return summa;
  }

  $: resultLine = transformResults(results, periods);
  $: playerOneScore = calculateSummaPlayerOne(results);
  $: playerTwoScore = calculateSummaPlayerTwo(results);

  // export const match

  function lookAtGame(gameId: string | null) {
    console.log("good");
    if (!gameId) return;
    if (gameId == $page.params.id)
      return console.log("are are on current game");
    goto(`/game/${gameId}`, { noScroll: true });
  }

  function scrollRight(node: HTMLDivElement) {
    console.log(node.scrollWidth);
    node.scrollLeft = node.scrollWidth;
  }

  // onDestroy(() => {
  //   $match = null;
  // });
</script>

<div class=" flex h-40 ">
  <div class="">
    <div class=" h-10 w-10 " />
    <div class=" h-10 w-10 " />
    <div
      class=" mr-2 flex  h-10 items-center justify-center text-sm font-medium text-black"
    >
      №
    </div>
  </div>

  <div
    use:scrollRight
    class=" flex  max-w-4xl  items-start  {results.length > 3
      ? 'overflow-x-auto'
      : ''}  border-green-700   "
  >
    {#each resultLine as line, i}
      {#each line.res as res, index}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
          on:click={() => {
            lookAtGame(res.id);
          }}
          class="    relative cursor-pointer text-sm font-medium hover:bg-blue-50 "
        >
          <div
            class=" {res.res == '1'
              ? 'text-green-700'
              : res.res == '0'
              ? 'text-red-700'
              : 'text-slate-500'} flex h-10 w-10 items-center justify-center {index ==
              line.res.length - 1 && i == resultLine.length - 1
              ? ' border-r'
              : ''} border-t border-l border-green-700"
          >
            {res.res}
          </div>
          <div
            class=" {res.res == '1'
              ? 'text-red-700'
              : res.res == '0'
              ? 'text-green-700'
              : 'text-slate-500'} flex h-10 w-10 items-center justify-center border-y border-l  {index ==
              line.res.length - 1 && i == resultLine.length - 1
              ? ' border-r'
              : ''} border-green-700"
          >
            {res.res == "1" ? "0" : res.res == "0" ? "1" : "0.5"}
          </div>
          <div
            class=" {res.id == $page.params.id
              ? 'bg-blue-700 text-white'
              : 'text-black'} flex h-10 w-10 items-center justify-center text-sm font-medium "
          >
            {res.num}
          </div>

          {#if index == 0}
            <div
              class=" absolute -bottom-10  left-0   flex h-20 flex-col border-l  border-green-700  "
            >
              <div
                class=" mt-auto ml-2 w-20 text-xs font-medium  text-slate-800"
              >
                <div class="">{line.control}</div>
                <div class="">{line.time} min</div>
              </div>
            </div>
          {/if}
        </div>
      {/each}
    {/each}
    {#if $match.status == "running"}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div
        on:click={() => {
          lookAtGame($match.currentGame);
        }}
        class=" relative  cursor-pointer text-sm font-medium hover:bg-blue-50"
      >
        <div
          class="  flex h-10 w-10 items-center justify-center border-t {results.length ==
          0
            ? ' border-x'
            : 'border-r'}  border-green-700"
        >
          *
        </div>
        <div
          class="  flex h-10 w-10 items-center justify-center border-y {results.length ==
          0
            ? ' border-x'
            : 'border-r'} border-green-700"
        >
          *
        </div>
        <div
          class=" {$match.currentGame == $page.params.id
            ? 'bg-blue-700 text-white'
            : 'text-black'} flex h-10 w-10 items-center justify-center text-sm font-medium "
        >
          {results.length + 1}
        </div>
      </div>
    {/if}
  </div>
  <div class="  ">
    <div
      class=" flex h-10 w-10 items-center justify-center font-bold text-green-800"
    >
      {playerOneScore}
    </div>
    <div
      class=" flex h-10 w-10 items-center justify-center font-bold text-red-800"
    >
      {playerTwoScore}
    </div>
  </div>
  <div class=" -mt-px">
    <div class=" flex h-10  items-center   ">
      <PlayerComponent username={$match.player1} />
    </div>
    <div class=" flex h-10  items-center   ">
      <PlayerComponent username={$match.player2} />
    </div>
  </div>
</div>
