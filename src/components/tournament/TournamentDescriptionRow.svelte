<script lang="ts">
  // const rows = [{title:'Название турнира'}]
  export let title: string;
  export let bg: string;
</script>

<!-- {#each rows as row } -->

<div class="{bg} px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
  <dt class="text-sm font-medium text-gray-500">{title}</dt>
  <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
    <slot />
    <!-- {tournamentInfo.name} -->
  </dd>
</div>
<!-- {/each} -->
