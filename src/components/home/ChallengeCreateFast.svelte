<script lang="ts">
  import { page } from '$app/stores'
  import Badge from '$components/common/Badge.svelte'
  import ColorShadowButton from '$components/common/Buttons/ColorShadowButton.svelte'
  import PulseAnimatedElement from '$components/common/PulseAnimatedElement.svelte'
  import ChallengeSendPrivate from '$components/dialogs/Forms/ChallengeSendPrivate.svelte'
  import IconChevronSolidDown from '$components/icons/IconChevronSolidDown.svelte'
  import IconPawn from '$components/icons/IconPawn.svelte'
  import { me } from '$store/global/me'
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

  function sendChallenge(event: Event) {
    if (challengeSended == false) {
      challengeSended = true
      createChallenge({ filters: $filters })
    } else {
      cancelChallenge()
      challengeSended = false
    }
  }

  // let
</script>

<div class=" flex space-x-1">
  <ChallengeFiltersComponent />
  {#if challengeSended}
    <div class=" absolute -right-1 -top-1 z-10">
      <PulseAnimatedElement />
    </div>
  {/if}

  <ColorShadowButton text="Создать общий вызов " color="white" onClick={sendChallenge}>
    <span class=" " slot="badges">
      {#if $me?.rating}
        <Badge color={{ text: 'text-sky-800 ', bg: 'bg-blue-200 ' }}>
          {Math.round($filters.rating[0] + $me?.rating)}-{Math.round($filters.rating[1] + $me?.rating)}
        </Badge>
        <Badge color={{ text: 'text-orange-800 px-1 ml-1', bg: 'bg-orange-100 ' }}>
          {$filters.control}
        </Badge>
      {/if}
    </span>
    <div class=" {challengeSended ? 'animate-bounce' : ''}  " slot="icon">
      <IconChevronSolidDown />
    </div>
  </ColorShadowButton>
</div>
<!-- on:click={() => {
    if (challengeSended == false) {
      challengeSended = true
      createChallenge({ filters: $filters })
    } else {
      cancelChallenge()
      challengeSended = false
    }
  }} -->

<!-- <div class="text-sm font-medium text-gray-900">
        <a href="#">
          <span class="absolute inset-0" aria-hidden="true" />
          Быстрый общий вызов
        </a>
      </div>
      <div class="text-sm text-gray-500">
        <div class="">
          {#if $me?.rating}
            <Badge color={{ text: 'text-sky-800 px-1', bg: 'bg-white border' }}>
              {Math.round($filters.rating[0] + $me?.rating)}-{Math.round($filters.rating[1] + $me?.rating)}
            </Badge>
          {/if}

          {#if $me?.rating}
            <Badge color={{ text: 'text-sky-800 px-1 ml-1', bg: 'bg-sky-100 border' }}>
              {$filters.control}
            </Badge>
          {/if}
        </div>
      </div>
    </div> -->
