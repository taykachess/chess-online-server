<script lang="ts">
  import type { PalleterLi } from "$types/common/palleter";
  import { Icon } from "svelte-hero-icons";
  export let records: PalleterLi[];
</script>

<div
  class=" w-full transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all"
>
  <ul
    class="grid max-h-96 scroll-py-3 grid-cols-2 overflow-y-auto p-3"
    id="options"
    role="listbox"
  >
    {#each records as record}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <li
        on:click={record.onClick()}
        class="group flex  cursor-pointer select-none rounded-xl p-3 hover:bg-slate-100"
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
      </li>
    {/each}
  </ul>
</div>
