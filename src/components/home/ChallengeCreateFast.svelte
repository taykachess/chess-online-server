<script lang="ts">
  import { page } from '$app/stores'
  import Badge from '$components/common/Badge.svelte'
  import PulseAnimatedElement from '$components/common/PulseAnimatedElement.svelte'
  import IconPawn from '$components/icons/IconPawn.svelte'
  import { filters } from '$store/home/challenges'
  import { socket } from '$store/sockets/socket'
  import type { ChallengeFilters } from '$types/challenge'
  import ChallengeFiltersComponent from './ChallengeFilters.svelte'
  function createChallenge({ filters }: { filters: ChallengeFilters }) {
    $socket.emit('challenge:create', { control: filters.control, filters })
  }

  function cancelChallenge() {
    $socket.emit('challenge:cancel')
  }

  let challengeSended = false

  // let
</script>

<!-- prettier-ignore -->
<div class="   flex  relative      ">
  <ChallengeFiltersComponent />
  {#if challengeSended}
    
  <div class=" absolute -right-1 -top-1 z-10">
    <PulseAnimatedElement></PulseAnimatedElement>
  </div>
  {/if}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div on:click={()=>{
          if(challengeSended==false) {
            challengeSended = true;
            createChallenge({ filters:$filters})
          } else {
            cancelChallenge()
            challengeSended = false
          }

        }} class=" flex-1 p-2 group relative flex items-start space-x-3   bg-white hover:bg-slate-100  rounded-tr-md">
       
          <div class="flex-shrink-0">
            <span class=" inline-flex items-center justify-center h-10 w-10 rounded-lg bg-green-200">
              <!-- Heroicon name: outline/megaphone -->
              <div class=" text-green-800  ">
                <IconPawn/>
              </div>
              <!-- <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
              </svg> -->
            </span>
          </div>
          <div class="min-w-0 flex-1">
            <div class="text-sm font-medium text-gray-900">
              <!-- svelte-ignore a11y-invalid-attribute -->
              <a href="#">
                <span class="absolute inset-0" aria-hidden="true"></span>
                Быстрый общий вызов
              </a>
            </div>
            <div class="text-sm text-gray-500">
              <div class="">
                {#if $page.data.user?.rating}
                <Badge
                 color={{text:"text-sky-800 px-1", bg:"bg-white border"}}
                 >

                 {Math.round($filters.rating[0]+$page.data.user?.rating)}-{Math.round($filters.rating[1]+$page.data.user?.rating)}
                </Badge>
                  
                {/if}

                {#if $page.data.user?.rating}
                <Badge
                 color={{text:"text-sky-800 px-1 ml-1", bg:"bg-sky-100 border"}}
                 >
                 {$filters.control}
                </Badge>
                  
                {/if}
              </div>
            </div>
          </div>
          <div class="flex-shrink-0 self-center">
            <!-- Heroicon name: mini/chevron-right -->
            <svg class="h-5 w-5 text-gray-400 group-hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
  </div>
