<script lang="ts">
  import { beforeNavigate } from "$app/navigation";
  import { page } from "$app/stores";
  import GameList from "$components/tournament/GameList.svelte";
  import RoundRobin from "$components/tournament/RoundRobin.svelte";
  import Swiss from "$components/tournament/Swiss.svelte";
  import TournamentDescription from "$components/tournament/TournamentDescription.svelte";
  import TournamentPlayersRegister from "$components/tournament/TournamentPlayersRegister.svelte";
  import TournamentSwissPlayersStanding from "$components/tournament/TournamentSwissPlayersStanding.svelte";
  import { socket } from "$store/sockets/socket";
  import { tournament } from "$store/tournament/tournament";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";
  export let data: PageData;

  $tournament = data.swiss;

  onMount(() => {
    $socket.emit("tournament:subscribe", { tournamentId: $page.params.id });
    $socket.on("tournament:register", (participant) => {
      if (!$tournament.participants) return;
      console.log(participant);
      $tournament.participants.push(participant);
      $tournament.participants.sort((a, b) => {
        if (a.rating > b.rating) return -1;
        if (a.rating < b.rating) return 1;
        return 0;
      });
      $tournament.participants = $tournament.participants;
    });

    $socket.on("tournament:unregister", ({ username }) => {
      const index = $tournament.participants.findIndex(
        (participant) => participant.username === username
      );
      $tournament.participants.splice(index, 1);
      $tournament.participants = $tournament.participants;
    });
  });

  beforeNavigate(() => {
    $socket.removeListener("tournament:register");
    $socket.removeListener("tournament:unregister");
    $socket.emit("tournament:leave", { tournamentId: $page.params.id });
  });
</script>

<div class=" mx-auto max-w-6xl  ">
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
        }}
      />
      <div class=" mt-4">
        {#if $tournament.currentRound && $tournament.rounds}
          <GameList />
        {/if}
      </div>
    </div>
    <div class=" ml-10  ">
      {#if $tournament.status == "registration" && $tournament.participants}
        <TournamentPlayersRegister bind:players={$tournament.participants} />
      {:else if $tournament.status == "running"}
        <TournamentSwissPlayersStanding />
      {/if}
    </div>
  </div>
</div>
