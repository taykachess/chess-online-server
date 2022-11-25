<script lang="ts">
  import { beforeNavigate } from "$app/navigation";
  import { page } from "$app/stores";
  import RoundRobin from "$components/tournament/RoundRobin.svelte";
  import Swiss from "$components/tournament/Swiss.svelte";
  import { socket } from "$store/sockets/socket";
  import { tournament } from "$store/tournament/tournament";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";
  export let data: PageData;

  $tournament = data.tournament;

  onMount(() => {
    $socket.emit("tournament:subscribe", { tournamentId: $page.params.id });
    $socket.on("tournament:register", (participant) => {
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
  <!-- <RoundRobin /> -->
  <Swiss />
</div>
