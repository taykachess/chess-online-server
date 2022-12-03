<script lang="ts">
  import { beforeNavigate, goto } from "$app/navigation";
  import { page } from "$app/stores";
  import BadgeTitle from "$components/common/BadgeTitle.svelte";
  import PulseAnimatedElement from "$components/common/PulseAnimatedElement.svelte";
  import { socket } from "$store/sockets/socket";
  import { tournament } from "$store/tournament/tournament";
  import { onMount, tick } from "svelte";

  const fetchPairings = (round: number) => {
    return fetch(`/api/tournament/${$page.params.id}/pairings?round=${round}`);
  };

  function subOnGameResult() {
    $socket.on("tournament:gameOver", async ({ gameId, result, w, b }) => {
      const index = $tournament.matches.findIndex((game) => game[3] == gameId);
      if (index != -1) $tournament.matches[index][2] = result;

      const indexW = $tournament.players.findIndex(
        (player) => player.id == w.id
      );
      const indexB = $tournament.players.findIndex(
        (player) => player.id == b.id
      );

      if (indexW != -1) {
        $tournament.players[indexW].matches.push([
          {
            id: b.id,
            rating: b.rating,
            title: b.title,
            res: b.res,
          },
          gameId,
        ]);
        $tournament.players[indexW].score =
          $tournament.players[indexW].score + +b.res;
      }

      if (indexB != -1) {
        $tournament.players[indexB].matches.push([
          {
            id: w.id,
            rating: w.rating,
            title: w.title,
            res: w.res,
          },
          gameId,
        ]);
        $tournament.players[indexB].score =
          $tournament.players[indexB].score + +w.res;
      }
      await tick();
      // $tournament.players = $tournament.players;
    });
  }

  onMount(async () => {
    $tournament.selectedRound = $tournament.currentRound;
    subOnGameResult();
  });

  beforeNavigate(() => {
    $socket.removeListener("tournament:pairings");
  });
</script>

<div class="mt-10  rounded-lg  border shadow-lg ">
  <div class=" flex justify-center  border-b  ">
    <div
      class="w-1/7 flex h-10 w-full select-none items-center justify-center rounded-tl-lg  bg-slate-800  px-2 text-slate-200"
    >
      Тур
    </div>
    {#each Array($tournament.rounds) as round, index}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div
        on:click={async () => {
          const data = await fetchPairings(index);
          const pairings = await data.json();

          console.log("pairings", pairings);
          $tournament.matches = pairings;
          $tournament.selectedRound = index + 1;
        }}
        class=" relative  flex w-full   items-center justify-center {index +
          1 ==
        $tournament.rounds
          ? 'rounded-tr-lg'
          : ''}  border-l    bg-white  {$tournament.currentRound <= index
          ? 'bg-slate-100 text-slate-300'
          : 'hover:bg-sky-100 cursor-pointer'} {$tournament.selectedRound ==
        index + 1
          ? 'bg-sky-100 text-sky-700 '
          : ''} "
      >
        {index + 1}

        {#if $tournament.selectedRound != $tournament.currentRound && $tournament.currentRound == index + 1 && $tournament.status == "running"}
          <div class=" absolute -top-1 z-20  ">
            <PulseAnimatedElement />
          </div>
        {/if}
      </div>
    {/each}
  </div>

  {#each $tournament.matches as game, index}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      on:click={() => {
        if (game[1]) goto(`/game/${game[3]}`);
        // goto()
      }}
      class="grid grid-cols-12   {index % 2
        ? 'bg-slate-50'
        : 'bg-white'} cursor-pointer text-center text-sm hover:bg-slate-100 "
    >
      <div
        class=" col-span-1 flex items-center justify-center border-r border-gray-300 font-medium text-gray-700"
      >
        {index + 1}
      </div>
      <div class=" col-span-5 flex border-gray-300   px-4 py-2 text-gray-700">
        <div class=" mx-auto">
          {#if game[0].title}
            <BadgeTitle title={game[0].title} />
          {/if}
          <span class=" font-medium text-slate-800">{game[0].id}</span>
          <span class=" text-xs text-orange-700"> {game[0].rating}</span>
        </div>
        <div class=" ml-auto">{game[0].score}</div>
      </div>
      <div
        class=" col-span-1 flex items-center justify-center border-x border-gray-300 font-medium text-gray-700"
      >
        {game[2] == "0.5-0.5" ? "=" : game[2] == "+-" ? "Bye" : game[2]}
      </div>
      <div class=" col-span-5 flex border-gray-300   px-4 py-2 text-gray-700">
        {#if game[1]}
          <div class="">{game[1]?.score}</div>
          <div class=" mx-auto">
            {#if game[1]?.title}
              <BadgeTitle title={game[1].title} />
            {/if}
            <span class=" font-medium text-slate-800">{game[1]?.id}</span>
            <span class=" text-xs text-orange-700"> {game[1]?.rating}</span>
          </div>
        {/if}
      </div>
    </div>
  {/each}
</div>
