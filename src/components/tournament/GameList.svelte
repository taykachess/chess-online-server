<script lang="ts">
  import { beforeNavigate, goto } from "$app/navigation";
  import { page } from "$app/stores";
  import BadgeTitle from "$components/common/BadgeTitle.svelte";
  import PulseAnimatedElement from "$components/common/PulseAnimatedElement.svelte";
  import { socket } from "$store/sockets/socket";
  import type { MatchSwiss } from "$types/tournament";
  import { onDestroy, onMount } from "svelte";

  export let gameList: MatchSwiss[] = [
    [
      { id: "p", rating: 2432, title: "GM", score: 3 },
      { id: "p", rating: 2432, title: "GM", score: 3 },
      "*",
      null,
    ],
    // ["tayka", "philips", "*", null],
  ];

  const fetchPairings = (round: number) => {
    return fetch(`/api/tournament/${$page.params.id}/pairings?round=${round}`);
  };

  onMount(async () => {});

  export let rounds: number;
  export let currentRound: number;
  let selectedRound = 0;

  function subOnGameResult() {
    $socket.on("tournament:gameOver", ({ gameId, result }) => {
      console.log("got result", gameId, result);
      const index = gameList.findIndex((game) => game[3] == gameId);
      if (index != -1) gameList[index][2] = result;
    });
  }

  onMount(async () => {
    const data = await fetchPairings(currentRound - 1);
    const pairings = await data.json();
    gameList = pairings[0];
    selectedRound = currentRound;
    console.log("pairings", pairings);
    $socket.on("tournament:pairings", ({ pairings }) => {
      // gameList[gameList.length - 1] = pairings;
      // gameList.push(pairings);
      if (selectedRound == currentRound) {
        gameList = pairings;
        selectedRound = selectedRound + 1;
      }
      currentRound++;

      console.log(gameList);
      // selectedRound = gameList.length - 1;
    });

    subOnGameResult();
  });

  beforeNavigate(() => {
    $socket.removeListener("tournament:pairings");
  });

  // onDestroy(() => {
  //   $socket.removeListener("tournament:pairings");
  // });
</script>

<div class="mt-10  rounded-lg  border shadow-lg ">
  <div class=" flex justify-center border-b  ">
    <div
      class="w-1/7 flex h-10 w-full select-none items-center justify-center  bg-slate-800  px-2 text-slate-200"
    >
      Тур
    </div>
    {#each Array(rounds) as round, index}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div
        on:click={async () => {
          const data = await fetchPairings(index);
          const pairings = await data.json();
          gameList = pairings[0];
          selectedRound = index + 1;
        }}
        class=" relative  flex w-full   items-center justify-center border-l    bg-white  {currentRound <=
        index
          ? 'bg-slate-100 text-slate-300'
          : 'hover:bg-sky-100 cursor-pointer'} {selectedRound == index + 1
          ? 'bg-sky-100 text-sky-700 '
          : ''} "
      >
        {index + 1}

        {#if selectedRound != currentRound && currentRound == index + 1}
          <div class=" absolute -top-1 z-20  ">
            <PulseAnimatedElement />
          </div>
        {/if}
      </div>
    {/each}
  </div>
  <!-- {#each gameList[showRound] as round, index} -->
  <!-- <div
    class=" rounded-tr-md rounded-tl-md  border-x border-t bg-white text-center text-sm"
  >
    <div class=" col-span-1 border-gray-300 px-4   py-2 text-gray-700">
      Тур {showRound + 1}
    </div>
  </div> -->

  {#each gameList as game, index}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      on:click={() => {
        goto(`/game/${game[3]}`);
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
        {game[2] == "0.5-0.5" ? "=" : game[2]}
      </div>
      <div class=" col-span-5 flex border-gray-300   px-4 py-2 text-gray-700">
        <div class="">{game[1]?.score}</div>
        <div class=" mx-auto">
          {#if game[1]?.title}
            <BadgeTitle title={game[1].title} />
          {/if}
          <span class=" font-medium text-slate-800">{game[1]?.id}</span>
          <span class=" text-xs text-orange-700"> {game[1]?.rating}</span>
        </div>
      </div>
    </div>
  {/each}
  <!-- {/each} -->

  <!-- <div class=" col-span-3 border-t border-gray-300 px-4   py-2 text-gray-700">
      <BadgeTitle title="GM" />
      <span class=" font-medium text-slate-800">Tayka</span>
      <span class=" text-xs text-orange-700"> 2345</span>
    </div>
    <div
      class=" col-span-1 border-x border-t border-gray-300  px-4  py-2 text-gray-700"
    >
      1-0
    </div>
    <div class=" col-span-3 border-t border-gray-300 px-4  py-2 text-gray-700">
      <BadgeTitle title="IM" />
      <span class=" font-medium text-slate-800">Kirpish2019</span>
      <span class=" text-xs text-orange-700"> 2456</span>
    </div> -->
  <!-- <div class="flex items-center justify-between px-4 py-5 sm:px-6">sdf</div> -->
</div>
