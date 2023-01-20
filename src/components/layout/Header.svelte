<script lang="ts">
  import { enhance } from '$app/forms'
  import { goto } from '$app/navigation'

  import { page } from '$app/stores'

  import PopoverMyOwn from '$components/common/Popover.svelte'
  import PulseAnimatedElement from '$components/common/PulseAnimatedElement.svelte'
  import Login from '$components/dialogs/Forms/Login.svelte'
  // import Signup from '$components/dialogs/Auth/Signup.svelte'
  import Registration from '$components/dialogs/Forms/Registration.svelte'
  import IconChessClock from '$components/icons/IconChessClock.svelte'
  import { deleteCookie } from '$lib/utils/cookie'
  import { me } from '$store/global/me'
  import { socket } from '$store/sockets/socket'
  import PrivateChallenges from './header/PrivateChallenges.svelte'

  export let games: string[] | undefined

  let isOpen = false
  let isOpenLogin = false

  function logOut() {
    localStorage.removeItem('token')
    deleteCookie('token')
    window.location.reload()
    // console.log('success')
    // $socket.disconnect()
    // $socket.auth = {}
    // $socket.connect()
    // $me = undefined
    // isOpen = false
  }
</script>

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
        <IconChessClock />
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
    {#if !$me}
      <div class=" flex items-center  text-sm">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <Login />
        <div class=" ml-4" />
        <Registration />
      </div>
    {:else}
      <PrivateChallenges />
      <PopoverMyOwn>
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
                localStorage.removeItem('token')
                console.log('success')
                deleteCookie('token')
                $socket.disconnect()
                $socket.auth = {}
                $socket.connect()
                $me = undefined
                isOpen = false
              }
            }
          }}
          method="POST"
          action="/?/logout"
        >
          <button
            on:click|stopPropagation={logOut}
            class=" rounded-md  px-2 py-2 text-sm font-medium text-gray-900 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
          >
            Выйти из аккаунта</button
          >
        </form>
      </PopoverMyOwn>
    {/if}
  </div>
</div>
