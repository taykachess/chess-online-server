<script lang="ts">
  import TabWithSVG from "$components/common/TabWithSVG.svelte";
  import { tab } from "$store/home/tab";
  import { Icon, ThumbUp } from "svelte-hero-icons";
</script>

<ul class="flex space-x-10">
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <li
    on:click={() => {
      $tab = "challenge";
      console.log("Cool");
    }}
  >
    <TabWithSVG title="Игра" active={$tab === "challenge" ? true : false}>
      <svg width="52" height="52" fill="none" aria-hidden="true" class=""
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
    </TabWithSVG>
  </li>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <li
    on:click={() => {
      $tab = "match";
    }}
  >
    <TabWithSVG title="Матч" active={$tab === "match" ? true : false}>
      <svg width="52" height="52" fill="none" aria-hidden="true" class=""
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
    </TabWithSVG>
  </li>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <li
    on:click={() => {
      $tab = "tournament";
    }}
  >
    <TabWithSVG title="Турнир" active={$tab === "tournament" ? true : false}>
      <svg width="52" height="52" fill="none" aria-hidden="true" class=""
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
    </TabWithSVG>
  </li>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- <li
    on:click={() => {
      $tab = "puzzle";
    }}
  >
    <Tab title="Задачи" active={$tab === "puzzle" ? true : false}
      ><Icon src={Cog} size="48" /></Tab
    >
  </li> -->
</ul>
