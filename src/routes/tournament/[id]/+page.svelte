<script lang="ts">
  import RoundRobin from "$components/tournament/RoundRobin.svelte";
  import Swiss from "$components/tournament/Swiss.svelte";
  import { tournament } from "$store/tournament/tournament";
  import type { PageData } from "./$types";
  export let data: PageData;

  $tournament = data.tournament;
</script>

<div class=" mx-auto max-w-6xl  ">
  <!-- <RoundRobin /> -->
  <Swiss {data} />
</div>
