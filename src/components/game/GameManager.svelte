<script lang="ts">
  import { browser } from '$app/environment'
  import { page } from '$app/stores'
  import { info } from '$store/game/info'
  import { me } from '$store/global/me'
  import { socket } from '$store/sockets/socket'
  import type { Result } from '$types/game'

  let countClick = 0
  if (browser) {
    $socket.on('game:offerDraw', ({ username, ply }) => {
      $info.lastOfferDraw = { username, ply }
    })

    $socket.on('game:declineDraw', () => {
      if (!$info.lastOfferDraw) return
      $info.lastOfferDraw.status = 'declined'
    })
  }

  function offerDraw() {
    $socket.emit('game:drawOffer', { gameId: $page.params.id })
  }

  function acceptDraw() {
    $socket.emit('game:drawAccept', { gameId: $page.params.id })
  }

  function declineDraw() {
    $socket.emit('game:drawDecline', { gameId: $page.params.id })
  }

  function resign() {
    countClick = countClick + 1
    setTimeout(() => {
      countClick = 0
    }, 5000)
    if (countClick == 2) $socket.emit('game:resign', { gameId: $page.params.id })
  }
  function stringResult(result: Result) {
    switch (result) {
      case '1': {
        return 'Белые выиграли'
      }
      case '0': {
        return 'Черные выиграли'
      }
      case '0.5': {
        return 'Ничья'
      }
    }
  }
  $: onlyPlayers = $info.role
  $: isPossibleAcceptDraw = $info.lastOfferDraw && $info.lastOfferDraw.ply > $info.ply - 2 && $info.lastOfferDraw.username != $me?.username && !$info.lastOfferDraw.status

  $: isPossibleOfferDraw = !$info.lastOfferDraw || ($info.lastOfferDraw.username != $me?.username && $info.lastOfferDraw.status == 'declined')
</script>

<div class=" mt-2 flex flex-col space-y-2 text-center text-slate-800 ">
  {#if $info?.result != '*'}
    <div class="  font-semibold ">
      {stringResult($info?.result)}
    </div>
  {:else}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    {#if onlyPlayers}
      {#if isPossibleAcceptDraw}
        <div class=" flex flex-col">
          <div class=" border border-slate-800">Принять ничью</div>
          <div class=" grid grid-cols-2">
            <div on:click={declineDraw} class=" flex cursor-pointer justify-center border-l border-b border-slate-800 bg-red-100 hover:bg-red-200 hover:text-red-600 ">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19 15h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 00.303-.54m.023-8.25H16.48a4.5 4.5 0 01-1.423-.23l-3.114-1.04a4.5 4.5 0 00-1.423-.23H6.504c-.618 0-1.217.247-1.605.729A11.95 11.95 0 002.25 12c0 .434.023.863.068 1.285C2.427 14.306 3.346 15 4.372 15h3.126c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 19.5a2.25 2.25 0 002.25 2.25.75.75 0 00.75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 002.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384"
                />
              </svg>
            </div>

            <div on:click={acceptDraw} class="flex cursor-pointer justify-center border-x border-b border-slate-800 bg-green-100 hover:bg-green-200 hover:text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
                />
              </svg>
            </div>
          </div>
        </div>
      {:else if isPossibleOfferDraw}
        <div on:click={offerDraw} class=" cursor-pointer border border-slate-800 hover:bg-slate-200 hover:text-slate-600">Предложить ничью</div>
      {/if}
      <div
        on:click|stopPropagation={resign}
        class=" {countClick == 1 ? 'bg-red-600 text-slate-100' : 'hover:bg-pink-200 hover:text-pink-600'} flex cursor-pointer items-center justify-center  space-x-2 border border-slate-800 "
      >
        <div class="">Сдаться</div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181" />
        </svg>
      </div>
    {/if}
  {/if}
</div>
<!-- <svelte:window
  on:click={() => {
    if (countClick) countClick = 0;
  }}
/> -->
