<script lang="ts">
  import type { PalleterLi } from "$types/common/palleter";
  import { Icon, ArrowCircleDown } from "svelte-hero-icons";
  export let records: PalleterLi[];
</script>

<div
  class=" w-full transform divide-y divide-gray-100 overflow-hidden bg-white ring-1 ring-black ring-opacity-5 transition-all sm:rounded-xl sm:shadow-2xl"
>
  <ul
    class="grid max-h-96 scroll-py-3 overflow-y-auto p-3 lg:grid-cols-2"
    id="options"
    role="listbox"
  >
    {#each records as record}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <li
        on:click={() => {
          if (record.wait) {
            record.onDoubleClick();
            record.wait = false;
          } else {
            record.onClick();
            records.forEach((record) => (record.wait = false));
            record.wait = true;
          }
        }}
        class="group relative flex  cursor-pointer select-none rounded-xl {record.wait
          ? 'bg-sky-50'
          : ''} p-3 hover:bg-slate-100"
      >
        <div
          class=" flex h-10 w-10 flex-none items-center justify-center rounded-lg {record.bg} text-white"
        >
          <Icon src={record.svg} size="30" />
        </div>
        <div class="ml-4   justify-center ">
          <!-- Active: "text-gray-900", Not Active: "text-gray-700" -->
          <div class=" text-sm font-medium text-gray-700">
            {record.title}
          </div>
          <!-- Active: "text-gray-700", Not Active: "text-gray-500" -->
          <p class="text-sm text-gray-500">
            {record.description}
          </p>
        </div>

        {#if record.wait}
          <span class=" relative flex h-3 w-3">
            <span
              class="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"
            />
            <span
              class="relative inline-flex h-3 w-3 rounded-full bg-sky-500"
            />
          </span>
        {/if}
      </li>
    {/each}
  </ul>
</div>
