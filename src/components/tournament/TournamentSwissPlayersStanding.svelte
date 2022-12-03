<script lang="ts">
  import { goto } from "$app/navigation";
  import BadgeTitle from "$components/common/BadgeTitle.svelte";
  import { tournament } from "$store/tournament/tournament";

  import type { PlayerSwissFrontend } from "$types/tournament";

  function sortFunction(a: PlayerSwissFrontend, b: PlayerSwissFrontend) {
    const scoreDiff = b.score - a.score;
    if (scoreDiff > 0) {
      return 1;
    }
    if (scoreDiff == 0) {
      const buchDiff = b.coefficient.buchholz - a.coefficient.buchholz;
      if (buchDiff > 0) return 1;
      if (buchDiff < 0) return -1;
      if (buchDiff == 0) {
        if (a.uuid) {
          b.uuid = a.uuid;
          return 0;
        }
        const uuid = (Math.random() + 1).toString(36).substring(7);
        a.uuid = uuid;
        b.uuid = uuid;

        return 0;
        // console.log()
      }
    }
    return -1;
  }

  function resetUUID(players: PlayerSwissFrontend[]) {
    players.forEach((player) => (player.uuid = undefined));
  }

  function transformUUIDtoPlace(players: PlayerSwissFrontend[]) {
    let i = 0;

    while (i < players.length) {
      if (!players[i]) break;
      if (players[i].uuid) {
        let j = i;
        const uuid = players[i].uuid;
        console.log("uuid", uuid, players.length, i, j);
        let counter = 0;
        // players[i].place = `${i}`;
        while (uuid == players[j].uuid) {
          counter++;
          //   players[j + 1].place = `${i}`;
          if (j + 1 >= players.length) {
            j = j + 1;
            break;
          }
          j = j + 1;
        }

        for (let x = i; x < i + counter; x++) {
          players[x].place = `${i + 1}-${i + counter}`;
        }
        i = j;
        continue;
      }

      players[i].place = `${i + 1}`;
      i = i + 1;
    }
  }

  function transformPlayers(players: PlayerSwissFrontend[]) {
    resetUUID(players);
    players.sort(sortFunction);
    transformUUIDtoPlace(players);

    console.log("sorted");

    return players;
  }

  let selectedPlayerGames = -1;

  function stringPoints(player: PlayerSwissFrontend) {
    let summa = 0;
    let rounds = 0;
    player.matches?.forEach((match) => {
      if (match[0].res == "*") {
        rounds++;
        return;
      }
      summa = summa + match[0].res;
      rounds++;
    });

    return `${summa} / ${rounds}`;
  }

  function calculateBuchholz(player: PlayerSwissFrontend) {
    let buchholz = 0;
    player.matches.forEach((match) => {
      const opponent = match[0].id;
      const index = sortedPlayers.findIndex((p) => p.id == opponent);
      if (index != -1) buchholz += sortedPlayers[index].score;
    });

    player.coefficient.buchholz = buchholz;

    return buchholz;
  }
  $: sortedPlayers = transformPlayers($tournament.players);
</script>

<div class=" shadow-lg">
  <!-- prettier-ignore -->
  <div class=" grid grid-cols-7 bg-white rounded-tr-md rounded-tl-md  w-full text-center text-sm border">
          <div class=" col-span-1  py-2  border-r  border-gray-300 text-gray-700"> Место </div>
          <div class=" col-span-4  py-2  border-r  border-gray-300 text-gray-700"> Игроки </div>
          <div class=" col-span-1  py-2 border-r  border-gray-300 text-gray-700"> Очки </div>
          <div class=" col-span-1  py-2  border-gray-300 text-gray-700"> Бухгольц </div>

      </div>

  {#each sortedPlayers as player, index}
    <!-- prettier-ignore -->
    <div class=" grid grid-cols-7 bg-white border-b  border-x  w-full text-center">
              <div class="relative text-center border-r col-span-1   border-gray-300  py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">{player.place}</div>
              <div class="relative col-span-4 flex   border-r border-gray-300  py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <div class=" ml-2 ">
                  {#if player.title}
                    <BadgeTitle title={player.title} />
                  {/if}  
                    {player.id}  <span class=" text-xs text-orange-700"> {player.rating}</span>

                </div>

                  <!-- svelte-ignore a11y-click-events-have-key-events -->
                  <div on:mousedown|stopPropagation={()=>{}} class="ml-auto">

                    <div on:click|stopPropagation={()=>{ selectedPlayerGames == index?selectedPlayerGames=-1: selectedPlayerGames = index }} class="   mr-2 hover:scale-110 cursor-pointer relative">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>   
                      
                    </div>
                    {#if selectedPlayerGames == index}
                      <div class=" absolute right-0 bg-slate-900  z-20 border-8 border-slate-300  w-[20rem]  ">

                        {#if player.matches}
                          
                        {#each player.matches as game, index}
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <div
                          on:click={() => {
                            goto(`/game/${game[1]}`);
                            // goto()
                          }}
                          class="grid grid-cols-7   {index % 2
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
                              <span class=" font-medium text-slate-800">{ game[0].id }</span>
                              <span class=" text-xs text-orange-700"> {game[0].rating}</span>
                            </div>
                          </div>
                          <div
                            class=" col-span-1 flex items-center justify-center border-x border-gray-300 font-medium text-gray-700"
                          >
                          {game[0].res}
                          </div>
                        </div>
                      {/each}
                        {/if}
                      </div>
                    {/if}
                  </div>
              </div>
              <div class="relative text-center col-span-1 border-r border-gray-300  py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">{stringPoints(player)}</div>
              <div class="relative text-center col-span-1  border-gray-300  py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">{calculateBuchholz(player)}</div>
            </div>
  {/each}
</div>

<svelte:window on:mousedown={() => (selectedPlayerGames = -1)} />
