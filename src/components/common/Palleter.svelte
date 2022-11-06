<script lang="ts">
  import type { PalleterLi } from "$types/common/palleter";
  import { Icon, ArrowCircleDown } from "svelte-hero-icons";
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
        on:click={() => {
          record.onClick();
          records.forEach((record) => (record.wait = false));
          record.wait = true;
        }}
        class="group relative  flex cursor-pointer select-none rounded-xl p-3 hover:bg-slate-100"
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
          <div
            class=" absolute inset-0 flex h-full w-full items-center justify-center bg-slate-100/70"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="h-10 w-10 animate-spin"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"
              />
            </svg>
          </div>
        {/if}
      </li>
    {/each}
  </ul>
</div>
