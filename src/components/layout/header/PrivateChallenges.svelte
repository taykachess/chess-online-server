<script lang="ts">
  import IconCheck from "$components/icons/IconCheck.svelte";
  import IconQuestionMarkCircle from "$components/icons/IconQuestionMarkCircle.svelte";
  import IconSwords from "$components/icons/IconSwords.svelte";
  import IconXCircle from "$components/icons/IconXCircle.svelte";
  import { privateMatches } from "$store/global/privateMatches";
  import { socket } from "$store/sockets/socket";

  import { Badge, Button, Popover } from "flowbite-svelte";

  let placement: string;
  let isOpen: boolean;

  function setOpenHandler() {
    isOpen = false;
  }
  function attachWindowEvent(node: HTMLElement) {
    window.addEventListener("mousedown", setOpenHandler);

    return {
      destroy() {
        window.removeEventListener("mousedown", setOpenHandler);
      },
    };
  }

  function acceptChallenge(username: string) {
    $socket.emit("match:accept", username);
    isOpen = false;
  }
</script>

<div class=" relative z-50  ">
  <!-- prettier-ignore -->
  <button on:mousedown|stopPropagation={()=>{isOpen=!isOpen}} class="">

      <Button  class="relative mr-2" size='sm'>
          <div class=" w-4 h-4">
            <IconSwords></IconSwords>
    
          </div>
          <span class="sr-only">Notifications</span>
          {#if $privateMatches.length}
            <Badge rounded index color="!red">{$privateMatches.length}</Badge>
          {/if}
        </Button>
  </button>

  {#if isOpen}
    <div
      use:attachWindowEvent
      on:mousedown|stopPropagation={() => {}}
      class=" absolute right-2 mt-1 w-[30rem] select-none border bg-white shadow-xl "
    >
      {#if $privateMatches.length}
        <ul
          class=" flex  max-h-96  scroll-py-3 flex-col  overflow-y-auto  "
          id="options"
          role="listbox"
        >
          {#each $privateMatches as match, index}
            <li
              class="group flex cursor-default  select-none items-center   {index %
                2 ==
              0
                ? ' bg-white'
                : ''}  p-2 "
            >
              <div class=" flex  w-full items-center justify-between ">
                <div class=" ml-2 text-sm font-medium text-gray-700">
                  {#if match.sender.title}
                    {match.sender.title}
                  {/if}
                  {match.sender.username}
                  <span class=" text-xs">{match.sender.rating}</span>
                </div>
                <div class="  flex  ">
                  <Button
                    btnClass=" p-1 px-2 border flex items-center justify-center text-xs rounded-lg "
                    size="xs"
                    id="placement-bottom"
                    on:mouseenter={() => (placement = "bottom")}
                    >Матч из {match.periods.length} периодов
                    <!-- prettier-ignore -->
                    <div class="w-5 h-5 ml-1">
                  <IconQuestionMarkCircle></IconQuestionMarkCircle>
                </div>
                  </Button>
                  <Popover
                    triggeredBy="[id^='placement-']"
                    {placement}
                    class="w-64 text-sm font-light "
                    title="Информация о матче "
                  >
                    {#each match.periods as period, index}
                      <!-- {index + 1}. -->
                      <Badge color="yellow">
                        {period[0]} минут : {match.periods[index][1]}
                      </Badge>
                    {/each}
                  </Popover>
                </div>
                <div class=" flex">
                  <div
                    on:click={() => {
                      acceptChallenge(match.sender.username);
                    }}
                    class=" h-8 w-8 cursor-pointer text-green-600 hover:scale-105 hover:text-green-700"
                  >
                    <IconCheck />
                  </div>
                  <div
                    class=" h-8 w-8 cursor-pointer text-red-600 hover:scale-105 hover:text-red-700"
                  >
                    <IconXCircle />
                  </div>
                </div>
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
      {:else}
        <div class=" p-3">Вас еще никто не вызвал на игру</div>
      {/if}
    </div>
  {/if}
</div>

<!-- <svelte:window on:mousedown={() => (isOpen = false)} /> -->
