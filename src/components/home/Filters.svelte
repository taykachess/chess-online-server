<script lang="ts">
  import { page } from "$app/stores";
  import Badge from "$components/common/Badge.svelte";
  import Dialog from "$components/common/Dialog.svelte";
  import FiltersForm from "./FiltersForm.svelte";
  let isOpen = false;
  function summa(filters: { min: number; max: number } | undefined) {
    let sum = 0;
    if (!filters) return ``;
    if (filters.min != -500 || filters.max != 500) sum++;

    return `${sum}`;
  }
  $: countFilters = summa($page.data.user?.filters);
</script>

<Dialog bind:isOpen>
  <FiltersForm
    low={$page.data.user?.filters?.min}
    high={$page.data.user?.filters?.max}
    bind:isOpen
  />
</Dialog>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  on:click={() => {
    isOpen = true;
  }}
  class="isolate  inline-flex self-start rounded-md shadow-sm  "
>
  <button
    type="button"
    class="relative -ml-px inline-flex items-center rounded-l-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
  >
    <svg
      class="h-6 w-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      ><path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
      /></svg
    >
  </button>
  <button
    type="button"
    class="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-4 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
  >
    Фильтры
    <span class=" ml-1">
      <Badge
        title={countFilters}
        color={{ text: "text-white", bg: "bg-slate-700" }}
      />
    </span>

    <span />
  </button>
</div>
