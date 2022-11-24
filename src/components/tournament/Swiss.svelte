<script lang="ts">
  import TournamentDescription from "./TournamentDescription.svelte";
  import TournamentPlayersRegister from "./TournamentPlayersRegister.svelte";
  import TournamentSwissPlayersStanding from "./TournamentSwissPlayersStanding.svelte";
  import { page } from "$app/stores";
  import { tournament } from "$store/tournament/tournament";

  // prettier-ignore
  type TournamentStatus = "registration" | "running" | "finnished" | "cancelled"

  let status: TournamentStatus = "registration";

  $: isRegister = $tournament.participants.some(
    (participant) => participant.username === $page.data.user?.username
  );
</script>

<div class=" mt-4 grid grid-cols-2  ">
  <div class="  ">
    <TournamentDescription
      tournamentInfo={{
        name: $tournament.name,
        control: $tournament.control,
        description: $tournament.description,
        format: $tournament.format,
        startDate: $tournament.startTime,
        orginizer: $tournament.organizer,
        isRegister,
      }}
    />
  </div>
  <div class=" ml-10  ">
    {#if status == "registration"}
      <TournamentPlayersRegister bind:players={$tournament.participants} />
    {:else if status == "running"}
      <TournamentSwissPlayersStanding />
    {/if}
  </div>
</div>
