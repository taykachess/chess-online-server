<script lang="ts">
  import { goto } from '$app/navigation'
  import BadgeTitle from '$components/common/BadgeTitle.svelte'
  import Pagination from '$components/common/Pagination.svelte'
  import IconTrophy from '$components/icons/IconTrophy.svelte'
  import { tournament } from '$store/tournament/tournament'

  import type { PlayerSwissFrontend } from '$types/tournament'

  function sortFunction(a: PlayerSwissFrontend, b: PlayerSwissFrontend) {
    const scoreDiff = b.score - a.score
    if (scoreDiff > 0) {
      return 1
    }
    if (scoreDiff == 0) {
      const buchDiff = b.coefficient.buchholz - a.coefficient.buchholz
      if (buchDiff > 0) return 1
      if (buchDiff < 0) return -1
      if (buchDiff == 0) {
        if (a.uuid) {
          b.uuid = a.uuid
          return 0
        }
        const uuid = (Math.random() + 1).toString(36).substring(7)
        a.uuid = uuid
        b.uuid = uuid

        return 0
      }
    }
    return -1
  }

  function resetUUID(players: PlayerSwissFrontend[]) {
    players.forEach((player) => (player.uuid = undefined))
  }

  function transformUUIDtoPlace(players: PlayerSwissFrontend[]) {
    let i = 0

    while (i < players.length) {
      if (!players[i]) break
      if (players[i].uuid) {
        let j = i
        const uuid = players[i].uuid
        let counter = 0
        // players[i].place = `${i}`;
        while (uuid == players[j].uuid) {
          counter++
          //   players[j + 1].place = `${i}`;
          if (j + 1 >= players.length) {
            j = j + 1
            break
          }
          j = j + 1
        }

        for (let x = i; x < i + counter; x++) {
          players[x].place = `${i + 1}-${i + counter}`
        }
        i = j
        continue
      }

      players[i].place = `${i + 1}`
      i = i + 1
    }
  }

  function transformPlayers(players: PlayerSwissFrontend[]) {
    // if (players.length == 0) return [];
    // console.log(players);
    resetUUID(players)
    players.forEach((player) => {
      calculateBuchholz(player)
    })
    players.sort(sortFunction)
    transformUUIDtoPlace(players)

    console.log('sorted')

    return players
  }

  let selectedPlayerGames = -1

  function stringPoints(player: PlayerSwissFrontend) {
    return `${player.score} / ${player.matches.length}`
  }

  function averageRating(player: PlayerSwissFrontend) {
    let summa = player.matches.reduce((acc, curr) => {
      return acc + curr[0].rating
    }, 0)

    return summa / player.matches.length
  }

  function calculateBuchholz(player: PlayerSwissFrontend) {
    let buchholz = 0
    player.matches.forEach((match) => {
      // console.log(match);
      const opponent = match[0].id
      const index = $tournament.players.findIndex((p) => p.id == opponent)
      if (index != -1) buchholz += $tournament.players[index].score
    })

    player.coefficient.buchholz = buchholz

    return buchholz
  }
  $: sortedPlayers = transformPlayers($tournament.players)

  // .slice(
  //   (currentPage - 1) * 10,
  //   10 * currentPage
  // )

  let currentPage = 1

  const playersOnPage = 10
</script>

<div class="  ">
  <div class=" rounded-lg shadow-lg ">
    <div class=" grid w-full grid-cols-7 rounded-tr-md rounded-tl-md  border bg-white text-center text-sm">
      <div class=" col-span-1  border-r  border-gray-300  py-2 text-gray-700">Место</div>
      <div class=" col-span-4  border-r  border-gray-300  py-2 text-gray-700">Игроки</div>
      <div class=" col-span-1  border-r border-gray-300  py-2 text-gray-700">Очки</div>
      <div class=" col-span-1  border-gray-300  py-2 text-gray-700">Бухгольц</div>
    </div>

    {#each sortedPlayers.slice((currentPage - 1) * playersOnPage, playersOnPage * currentPage) as player, index}
      <div class=" grid grid-cols-7 border-b bg-white {index == playersOnPage - 1 ? ' rounded-b-lg' : ''}  w-full  border-x text-center">
        <div class="relative col-span-1 border-r border-gray-300   py-2  text-center text-sm font-medium text-gray-700 hover:bg-gray-50">
          {#if player.active}
            {#if $tournament.status == 'finished' && currentPage == 1}
              {#if index < 3}
                <div class=" flex items-center justify-center">
                  <div class=" h-6 w-6 fill-current {index == 0 ? ' text-yellow-500  ' : index == 1 ? 'text-zinc-400' : index == 2 ? ' text-amber-700' : ''} ">
                    <IconTrophy />
                  </div>
                </div>
              {:else}
                {player.place}
              {/if}
            {:else}
              {player.place}
            {/if}
          {:else}
            <div class=" flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.25 9v6m-4.5 0V9M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          {/if}
        </div>
        <div class="relative col-span-4 flex   border-r border-gray-300  py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          <div class=" ml-2 ">
            {#if player.title}
              <BadgeTitle title={player.title} />
            {/if}
            {player.id} <span class=" text-xs text-orange-700"> {player.rating}</span>
          </div>

          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <div on:mousedown|stopPropagation={() => {}} class="ml-auto">
            <div
              on:click|stopPropagation={() => {
                selectedPlayerGames == index ? (selectedPlayerGames = -1) : (selectedPlayerGames = index)
              }}
              class="   relative mr-2 cursor-pointer hover:scale-110"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
            </div>
            {#if selectedPlayerGames == index}
              <div class=" absolute right-0   z-20 w-[20rem] border-8  border-slate-300  ">
                <div class=" flex items-baseline justify-between border-b bg-white py-2 px-3">
                  {player.id}

                  <div class=" text-xs">
                    средний рейтинг:
                    {Math.floor(averageRating(player))}
                  </div>
                </div>
                {#if player.matches}
                  {#each player.matches as game, index}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <div
                      on:click={() => {
                        goto(`/game/${game[1]}`)
                        // goto()
                      }}
                      class="grid grid-cols-7   {index % 2 ? 'bg-slate-50' : 'bg-white'} cursor-pointer text-center text-sm hover:bg-sky-100 "
                    >
                      <div class=" col-span-1 flex items-center justify-center border-r border-gray-300 font-medium text-gray-700">
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
                      </div>
                      <div class=" col-span-1 flex  items-center justify-center  border-gray-300 font-medium text-gray-700">
                        <div class="{game[0].color == 'w' ? ' bg-slate-100' : ' bg-slate-800 text-slate-200 '} h-5 w-5 rounded font-mono text-sm">
                          {game[0].res}
                        </div>
                      </div>
                    </div>
                  {/each}
                {/if}
              </div>
            {/if}
          </div>
        </div>
        <div class="relative col-span-1 border-r border-gray-300 py-2  text-center text-sm font-medium text-gray-700 hover:bg-gray-50">{stringPoints(player)}</div>
        <div class="relative col-span-1 border-gray-300  py-2  text-center text-sm font-medium text-gray-700 hover:bg-gray-50">{player.coefficient.buchholz}</div>
      </div>
    {/each}
  </div>

  <div class=" mt-2">
    <Pagination count={$tournament.players.length} cb={(page) => (currentPage = page)} STEP={playersOnPage} title="игроков" />
  </div>
</div>

<svelte:window on:mousedown={() => (selectedPlayerGames = -1)} />
