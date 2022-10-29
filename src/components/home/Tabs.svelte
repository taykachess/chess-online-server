<script lang="ts">
  import Tab from "$components/common/TabWithSVG.svelte";
  import { tab } from "$store/home/tab";
  import { Icon, Cog } from "svelte-hero-icons";
</script>

<ul
  class="inline-grid flex-none gap-x-2 px-4 sm:px-0 xl:gap-x-6"
  style="grid-template-columns:repeat(4, minmax(6rem, 1fr))"
>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <li
    on:click={() => {
      $tab = "challenge";
      console.log("Cool");
    }}
  >
    <Tab title="Игра" active={$tab === "challenge" ? true : false}
      ><Icon src={Cog} size="48" /></Tab
    >
  </li>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <li
    on:click={() => {
      $tab = "match";
    }}
  >
    <Tab title="Матч" active={$tab === "match" ? true : false}
      ><Icon src={Cog} size="48" /></Tab
    >
  </li>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <li
    on:click={() => {
      $tab = "tournament";
    }}
  >
    <Tab title="Турнир" active={$tab === "tournament" ? true : false}>
      <svg width="48" height="48" fill="none" aria-hidden="true" class=""
        ><path
          d="M6 8h32a4 4 0 0 1 4 4v28H6V8Z"
          fill="currentColor"
          fill-opacity="0"
        /><path
          d="M43 21v16a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V11a4 4 0 0 1 4-4h20M15 7v34"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        /><path
          d="M37 7c0 1.101 0 6-6 6 1.101 0 6 0 6 6 0-6 4.899-6 6-6-6 0-6-4.899-6-6ZM31 21c0 .734 0 4-4 4 .734 0 4 0 4 4 0-4 3.266-4 4-4-4 0-4-3.266-4-4Z"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        /></svg
      >
    </Tab>
  </li>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <li
    on:click={() => {
      $tab = "puzzle";
    }}
  >
    <Tab title="Задачи" active={$tab === "puzzle" ? true : false}
      ><Icon src={Cog} size="48" /></Tab
    >
  </li>
</ul>
