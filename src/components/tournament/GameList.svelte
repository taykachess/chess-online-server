<script lang="ts">
  import { beforeNavigate, goto } from '$app/navigation'
  import { page } from '$app/stores'
  import BadgeTitle from '$components/common/BadgeTitle.svelte'
  import PulseAnimatedElement from '$components/common/PulseAnimatedElement.svelte'
  import IconChessboard from '$components/icons/IconChessboard.svelte'
  import IconTv from '$components/icons/IconTv.svelte'
  import { TOURNAMENT_GAME_PREPARE_TIME } from '$sockets/variables/redisIndex'
  import { socket } from '$store/sockets/socket'
  import { pairings } from '$store/tournament/pairings'
  import { selectedRound } from '$store/tournament/swiss/selectedRound'
  import { tournament } from '$store/tournament/tournament'
  import { isTournamentTimerVisible, requestId, tournamentPrepareTime, tournamentTv, intervalId, board, chess, liveTournamentGameId, selectedTournamentGameId } from '$store/tournament/tournamentTv'
  import type { GetGame } from '$types/game'
  import { Chess } from 'cm-chess-ts'
  import { createEventDispatcher, onMount, tick } from 'svelte'

  const dispatch = createEventDispatcher()

  const fetchPairings = (round: number) => {
    return fetch(`/api/tournament/${$page.params.id}/pairings?round=${round}`)
  }

  function subOnGameResult() {
    $socket.on('tournament:gameOver', async ({ gameId, result, w, b }) => {
      const index = $pairings.findIndex((game) => game[3] == gameId)
      if (index != -1) $pairings[index][2] = result

      const indexW = $tournament.players.findIndex((player) => player.id == w.id)
      const indexB = $tournament.players.findIndex((player) => player.id == b.id)

      if (indexW != -1) {
        $tournament.players[indexW].matches.push([
          {
            id: b.id,
            rating: b.rating,
            title: b.title,
            res: b.res,
            color: b.color,
          },
          gameId,
        ])
        $tournament.players[indexW].score = $tournament.players[indexW].score + +b.res
      }

      if (indexB != -1) {
        $tournament.players[indexB].matches.push([
          {
            id: w.id,
            rating: w.rating,
            title: w.title,
            res: w.res,
            color: w.color,
          },
          gameId,
        ])
        $tournament.players[indexB].score = $tournament.players[indexB].score + +w.res
      }
      await tick()
      // $tournament.players = $tournament.players;
    })
  }

  async function getGame(gameId: string) {
    $socket.emit('game:get', { gameId }, (gameFromServer) => {
      if (!gameFromServer) return
      gameFromServer.id = gameId
      dispatch('getGame', gameFromServer)
    })
  }

  onMount(async () => {
    $selectedRound = $tournament.currentRound
    subOnGameResult()
  })

  beforeNavigate(() => {
    $socket.removeListener('tournament:pairings')
  })

  function returnCssClass(gameId: string | null, index: number) {
    if (gameId == $selectedTournamentGameId && gameId == $liveTournamentGameId) {
      return 'bg-gradient-to-r from-sky-100 to-green-100'
    }
    if (gameId == $selectedTournamentGameId) {
      return 'bg-sky-100'
    }

    if (gameId == $liveTournamentGameId) {
      return 'bg-green-100'
    }

    if (index % 2) {
      return 'bg-slate-50 hover:bg-slate-100'
    } else {
      return 'bg-white hover:bg-slate-100'
    }
    // {game[3] == $selectedTournamentGameId
    //     ? 'bg-sky-100'
    //     : index % 2
    //     ? 'bg-slate-50 hover:bg-slate-100'
    //     : 'bg-white hover:bg-slate-100'}
    return ''
  }
</script>

<div class="  rounded-lg  border shadow-lg ">
  <div class=" flex justify-center  border-b  ">
    <div class="w-1/7 flex h-10 w-full select-none items-center justify-center rounded-tl-lg  bg-slate-800  px-2 text-slate-200">Тур</div>
    {#each Array($tournament.rounds) as round, index}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div
        on:click={async () => {
          if ($tournament.currentRound <= index) return console.log('no')
          if ($selectedRound == index + 1) return console.log('you are already there')
          const data = await fetchPairings(index)
          const matches = await data.json()
          $pairings = matches

          $selectedRound = index + 1
        }}
        class=" relative  flex w-full   items-center justify-center {index + 1 == $tournament.rounds ? 'rounded-tr-lg' : ''}  border-l    bg-white  {$tournament.currentRound <= index
          ? 'bg-slate-100 text-slate-300'
          : 'hover:bg-sky-100 cursor-pointer'} {$selectedRound == index + 1 ? 'bg-sky-100 text-sky-700 ' : ''} "
      >
        {index + 1}

        {#if $selectedRound != $tournament.currentRound && $tournament.currentRound == index + 1 && $tournament.status == 'running'}
          <div class=" absolute -top-1 z-20  ">
            <PulseAnimatedElement />
          </div>
        {/if}
      </div>
    {/each}
  </div>

  <!-- {JSON.stringify($liveTournamentGameId)} -->
  {#each $pairings as game, index}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      on:click={() => {
        if (game[1] && game[3]) {
          if ($selectedTournamentGameId != game[3]) getGame(game[3])
        }
        // goto(`/game/${game[3]}`);
        // goto()
      }}
      class="grid grid-cols-12   
      {game[3] == $selectedTournamentGameId && game[3] == $liveTournamentGameId && $tournament.status != 'finished'
        ? 'bg-gradient-to-r from-sky-100 to-green-100'
        : game[3] == $selectedTournamentGameId && game[3]
        ? 'bg-sky-100'
        : game[3] == $liveTournamentGameId && $tournament.status != 'finished'
        ? 'bg-green-100'
        : index % 2
        ? 'bg-slate-50 hover:bg-slate-100'
        : 'bg-white hover:bg-slate-100'}
      
      cursor-pointer text-center text-sm  "
    >
      <div class=" col-span-1 flex items-center justify-center border-r border-gray-300 font-medium text-gray-700">
        {#if game[3] == $selectedTournamentGameId && game[3] == $liveTournamentGameId && $tournament.status != 'finished'}
          <div class=" flex items-center space-x-1">
            <div class=" h-5 w-5">
              <IconChessboard />
            </div>
            <div class=" h-5 w-5">
              <IconTv />
            </div>
          </div>
        {:else if game[3] == $selectedTournamentGameId}
          <div class=" h-5 w-5">
            <IconChessboard />
          </div>
        {:else if game[3] == $liveTournamentGameId && $tournament.status != 'finished'}
          <div class="h-5 w-5">
            <IconTv />
          </div>
        {:else}
          <span class="">
            {index + 1}
          </span>
        {/if}
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
      <div class=" col-span-1 flex items-center justify-center border-x border-gray-300 font-medium text-gray-700">
        {game[2] == '0.5' ? '=' : game[2] == '+' ? '+-' : game[2] == '1' ? '1-0' : game[2] == '0' ? '0-1' : '*'}
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
