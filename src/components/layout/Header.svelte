<script lang="ts">
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";

  import { page } from "$app/stores";

  import Dialog from "$components/common/Dialog.svelte";
  import PopoverMyOwn from "$components/common/Popover.svelte";
  import PulseAnimatedElement from "$components/common/PulseAnimatedElement.svelte";
  import Login from "$components/dialogs/Auth/Login.svelte";
  import Signup from "$components/dialogs/Auth/Signup.svelte";
  import ChessClockSVG from "$components/icons/ChessClockSVG.svelte";
  import IconBell from "$components/icons/IconBell.svelte";
  import IconCheck from "$components/icons/IconCheck.svelte";
  import IconSwords from "$components/icons/IconSwords.svelte";
  import IconXCircle from "$components/icons/IconXCircle.svelte";
  import { deleteCookie } from "$lib/utils/cookie";
  import { privateMatches } from "$store/global/privateMatches";
  import { socket } from "$store/sockets/socket";
  import { Badge, Button, Popover } from "flowbite-svelte";

  export let games: string[] | undefined;

  let isOpen = false;
  let isOpenLogin = false;

  let placement: string;
</script>

<Dialog bind:isOpen>
  <Signup bind:isOpen />
</Dialog>
<Dialog bind:isOpen={isOpenLogin}>
  <Login bind:isOpen={isOpenLogin} />
</Dialog>

<div class="border-b">
  <div
    class="  flex h-16 max-w-6xl  items-center  justify-between sm:mx-auto   "
  >
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      on:click={() => {
        goto("/");
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
          <!-- prettier-ignore -->
          {#if gameId != $page.params.id }
        <div on:click={()=>goto(`/game/${gameId}`)} class=" relative rounded-lg border px-8 py-1 text-sm text-sky-500 shadow-md cursor-pointer hover:bg-sky-100 ">
          Текущая игра
          <div class=" absolute -top-1 -right-1">
            <PulseAnimatedElement></PulseAnimatedElement>
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
            isOpenLogin = true;
          }}
          class=" cursor-pointer text-slate-700 hover:text-slate-900"
        >
          Войти
        </div>
        <button
          on:click={() => {
            isOpen = true;
          }}
          class=" rounded bg-blue-400 p-2 text-white hover:bg-blue-500  "
        >
          Регистрация
        </button>
      </div>
    {:else}
      <div
        class=" mr-4 h-5 w-5 duration-100 hover:scale-105 hover:cursor-pointer"
      >
        <IconBell />
      </div>

      <div class=" relative  ">
        <!-- prettier-ignore -->
        <Button class="relative mr-2" size='sm'>
          <div class=" w-4 h-4">
            <IconSwords></IconSwords>
  
          </div>
          <span class="sr-only">Notifications</span>
          {#if $privateMatches.length}
            
            <Badge rounded index color="!red">{$privateMatches.length}</Badge>
          {/if}
        </Button>
        {#if $privateMatches.length}
          <div
            class=" absolute right-2 mt-1 w-[30rem] border bg-white shadow-xl "
          >
            <ul
              class=" flex  max-h-96  scroll-py-3 flex-col  overflow-y-auto  p-3"
              id="options"
              role="listbox"
            >
              {#each $privateMatches as match, index}
                <!-- Results, show/hide based on command palette state -->
                <!-- Active: "bg-gray-100" -->
                <li
                  class="group flex cursor-default  select-none items-center rounded-xl {index %
                    2 ==
                  0
                    ? ' bg-slate-50'
                    : ''}  p-2 "
                >
                  <!-- <div
                  class="flex h-12 w-12 flex-none items-center justify-center rounded-lg bg-indigo-500"
                >
                  <svg
                    class="h-6 w-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>
                </div> -->
                  <div class=" flex  items-center justify-center ">
                    <!-- Active: "text-gray-900", Not Active: "text-gray-700" -->
                    <div class="text-sm font-medium text-gray-700">
                      {match.sender.title}
                      {match.player}
                      <span class=" text-xs">{match.sender.rating}</span>

                      <!-- {match.} -->
                    </div>
                    <div class=" ml-4 flex  ">
                      <!-- {#if match.control}
                      <Badge baseClass=" mr-1 flex items-center justify-center "
                        >{match.control}</Badge
                      >
                    {/if} -->

                      <Button
                        btnClass=" p-1 px-2 border flex items-center justify-center text-xs rounded-lg "
                        size="xs"
                        id="placement-bottom"
                        on:mouseenter={() => (placement = "bottom")}
                        >Матч из {match.controls.length} периодов
                        <!-- prettier-ignore -->
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 ml-1">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                      </svg>
                      </Button>
                      <Popover
                        triggeredBy="[id^='placement-']"
                        {placement}
                        class="w-64 text-sm font-light "
                        title="Информация о матче "
                      >
                        {#each match.controls as period, index}
                          <!-- {index + 1}. -->
                          <Badge color="yellow">
                            {match.timeControls[index]} минут : {match.controls[
                              index
                            ]}
                          </Badge>
                        {/each}
                      </Popover>
                      <!-- <Button id="b1">Default popover</Button>
                    <Popover
                      class="w-64 text-sm font-light "
                      title="Popover title"
                      triggeredBy="#b1"
                    >
                      And here's some amazing content. It's very engaging.
                      Right?
                    </Popover> -->
                    </div>
                    <!-- Active: "text-gray-700", Not Active: "text-gray-500" -->
                    <!-- <p class="text-sm text-gray-500">
                    Add freeform text with basic formatting options.
                  </p> -->
                  </div>
                  <div class="ml-auto flex">
                    <div
                      class=" h-8 w-8 cursor-pointer text-green-600 hover:scale-105 hover:text-green-700"
                    >
                      <IconCheck />
                    </div>
                    <div
                      class=" h-8 w-8 cursor-pointer text-red-600 hover:scale-105 hover:text-red-700"
                    >
                      <IconXCircle />
                    </div>
                    <!-- <div class="">accept</div>
                  <div class="">decline</div> -->
                  </div>
                </li>

                <!-- More items... -->
                <!-- <div class="">
          <div class="flex items-baseline justify-center">
            <span class=" mr-1 text-xs font-bold text-red-800 "
            >{match.sender.title}</span
            >
            {match.player}{match.sender.rating}
          </div>
        </div> -->
              {/each}
            </ul>
          </div>
        {/if}
      </div>
      <PopoverMyOwn title={$page.data?.user?.username}>
        <form
          on:keydown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              return false;
            }
          }}
          use:enhance={({ form, data, action, cancel }) => {
            return async ({ result, update }) => {
              await update();
              if ($page.form?.success) {
                console.log("success");
                deleteCookie("token");
                $socket.disconnect();
                $socket.auth = {};
                $socket.connect();
                isOpen = false;
              }
            };
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
