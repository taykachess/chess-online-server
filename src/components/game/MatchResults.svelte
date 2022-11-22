<script lang="ts">
  import type { Match } from "$types/match";
  import type { Result } from "$types/game";
  import { match } from "$store/game/match";
  export let matchId;

  async function getMatch(matchId: string) {
    const data = await fetch(`/api/match/get/${matchId}`, {
      method: "GET",
    });

    const matches = (await data.json()) as Match[];
    $match = matches[0];
    // console.log(data);
  }

  getMatch(matchId);

  function transformToPlayerResult(
    result: Result,
    white: string,
    player: string
  ) {
    const results = result.split("-");
    if (white == player) return results[0];
    else return results[1];
  }

  function transformToWhiteResult(result: Result) {
    if (result == "0-1" || "1-0" || "0.5-0.5") return result.split("-")[0];
  }

  function transformToBlackResult(result: Result) {
    if (result == "0-1" || "1-0" || "0.5-0.5") return result.split("-")[1];
  }

  function player1ScoreFn(match: Match | undefined) {
    if (!match) return 0;
    return match.result[0] + 0.5 * match.result[2];
  }
  function player2ScoreFn(match: Match | undefined) {
    if (!match) return 0;
    return match.result[1] + 0.5 * match.result[2];
  }

  $: player1Score = player1ScoreFn($match);
  $: player2Score = player2ScoreFn($match);
</script>

{#if $match}
  <div class=" text-gray-700  ">
    <div class=" flex   ">
      {#each Array($match.rounds) as num, index}
        <!-- prettier-ignore -->
        <div class=" h-8 w-10  flex items-center justify-center bg-slate-50  {index==0?' ':'-ml-px'} border  border-gray-300    text-sm font-medium  ">
        {index+1}
    </div>
      {/each}
    </div>
    <div class=" -mt-px flex">
      {#each Array($match.rounds) as num, index}
        <div
          class="relative inline-flex items-center  {index == 0
            ? '  '
            : '-ml-px'} flex  h-8 w-10 items-center {$match.games[index] &&
          $match.games[index].black == $match.player1
            ? '  bg-slate-700 text-white '
            : 'bg-white'} justify-center border  border-gray-300 bg-white text-sm font-medium  focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          {$match.games[index]
            ? transformToPlayerResult(
                $match.games[index].result,
                $match.games[index].white,
                $match.player1
              )
            : ""}
        </div>
      {/each}
      <div
        class="relative -ml-px flex  h-8  w-10 items-center justify-center  border border-gray-300  bg-white text-sm font-medium text-green-700  focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      >
        {player1Score}
      </div>
      <div
        class=" -ml-px flex h-8 items-center  justify-between   px-2 text-sm font-medium"
      >
        {$match.player1}
      </div>
    </div>

    <div class=" -mt-px flex">
      {#each Array($match.rounds) as num, index}
        <div
          class="relative  items-center  {index == 0
            ? '  '
            : '-ml-px'} flex  h-8 w-10  justify-center border {$match.games[
            index
          ] && $match.games[index].black == $match.player2
            ? '  bg-slate-700 text-white '
            : 'bg-white'}  border-gray-300  text-sm font-medium  focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          {$match.games[index]
            ? transformToPlayerResult(
                $match.games[index].result,
                $match.games[index].white,
                $match.player2
              )
            : ""}
        </div>
      {/each}
      <div
        class="relative -ml-px flex  h-8  w-10 items-center justify-center  border border-gray-300  bg-white text-sm font-medium text-green-700  focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      >
        {player2Score}
      </div>
      <div
        class="-ml-px flex h-8 items-center  justify-between px-2   text-sm font-medium"
      >
        {$match.player2}
      </div>
    </div>
  </div>
{/if}
