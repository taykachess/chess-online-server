<script lang="ts">
  import { enhance } from '$app/forms'
  import { goto } from '$app/navigation'

  import { page } from '$app/stores'

  import Dialog from '$components/common/Dialog.svelte'
  import PopoverMyOwn from '$components/common/Popover.svelte'
  import PulseAnimatedElement from '$components/common/PulseAnimatedElement.svelte'
  import Login from '$components/dialogs/Auth/Login.svelte'
  import Signup from '$components/dialogs/Auth/Signup.svelte'
  import ChessClockSVG from '$components/icons/ChessClockSVG.svelte'
  import IconCheck from '$components/icons/IconCheck.svelte'
  import IconSwords from '$components/icons/IconSwords.svelte'
  import IconXCircle from '$components/icons/IconXCircle.svelte'
  import { deleteCookie } from '$lib/utils/cookie'
  import { privateMatches } from '$store/global/privateMatches'
  import { socket } from '$store/sockets/socket'
  import { Badge, Button, Popover } from 'flowbite-svelte'
  import PrivateChallenges from './header/PrivateChallenges.svelte'

  export let games: string[] | undefined

  let isOpen = false
  let isOpenLogin = false
</script>

<Dialog bind:isOpen>
  <Signup bind:isOpen />
</Dialog>
<Dialog bind:isOpen={isOpenLogin}>
  <Login bind:isOpen={isOpenLogin} />
</Dialog>

<div class="border-b">
  <div class="  flex h-16 max-w-6xl  items-center  justify-between sm:mx-auto   ">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      on:click={() => {
        goto('/')
      }}
      class=" flex cursor-pointer items-center space-x-2"
    >
      <div class="  h-8 w-8">
        <ChessClockSVG />
      </div>
      <div class=" text-lg font-bold ">chessmate.com</div>
    </div>
    {#if games}
      <div class=" ml-auto mr-4 flex space-x-2">
        {#each games as gameId}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          {#if gameId != $page.params.id}
            <div on:click={() => goto(`/game/${gameId}`)} class=" relative cursor-pointer rounded-lg border px-8 py-1 text-sm text-sky-500 shadow-md hover:bg-sky-100 ">
              Текущая игра
              <div class=" absolute -top-1 -right-1">
                <PulseAnimatedElement />
              </div>
            </div>
          {/if}
        {/each}
      </div>
    {/if}
    {#if !$page.data?.user}
      <div class=" flex items-center space-x-4 text-sm">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
          on:click={() => {
            isOpenLogin = true
          }}
          class=" cursor-pointer text-slate-700 hover:text-slate-900"
        >
          Войти
        </div>
        <button
          on:click={() => {
            isOpen = true
          }}
          class=" rounded bg-blue-400 p-2 text-white hover:bg-blue-500  "
        >
          Регистрация
        </button>
      </div>
    {:else}
      <PrivateChallenges />
      <PopoverMyOwn title={$page.data?.user?.username}>
        <form
          on:keydown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              return false
            }
          }}
          use:enhance={({ form, data, action, cancel }) => {
            return async ({ result, update }) => {
              await update()
              if ($page.form?.success) {
                console.log('success')
                deleteCookie('token')
                $socket.disconnect()
                $socket.auth = {}
                $socket.connect()
                isOpen = false
              }
            }
          }}
          method="POST"
          action="/?/logout"
        >
          <button
            class=" rounded-md  px-2 py-2 text-sm font-medium text-gray-900 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
          >
            Выйти из аккаунта</button
          >
        </form>
      </PopoverMyOwn>
    {/if}
  </div>
</div>
