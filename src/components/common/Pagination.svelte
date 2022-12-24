<script lang="ts">
  export let count: number = 67;
  export let currentPage: number = 1;
  export let cb: (page: number) => any = () => {};
  export let title: string;
  export let textClass: string = "text-slate-800";

  export let STEP = 10;

  const PAGES = Math.ceil(count / STEP);

  function arrayPages(length: number) {
    const pages = [];
    for (let i = 1; i <= length; i++) {
      pages.push(i);
    }
    return pages;
  }
</script>

<div
  class="hidden {textClass
    ? textClass
    : 'text-gray-800'} select-none    sm:flex sm:flex-1 sm:items-center sm:justify-between "
>
  <div>
    <p class="text-sm ">
      Показаны с
      <span class="font-medium">{(currentPage - 1) * STEP + 1}</span>
      по
      <span class="font-medium"
        >{currentPage * STEP < count ? currentPage * STEP : count}</span
      >
      от
      <span class="font-medium">{count}</span>
      {title}
    </p>
  </div>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <nav class=" flex rounded-md border  shadow-sm" aria-label="Pagination">
    <!-- svelte-ignore a11y-missing-attribute -->
    <a
      on:click={() => {
        if (currentPage == 1) return;
        cb(currentPage - 1);
        currentPage = currentPage - 1;
      }}
      class="relative inline-flex cursor-pointer items-center rounded-l-md border-r  border-gray-300 bg-white px-2 py-1 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
    >
      <span class="sr-only">Previous</span>
      <!-- Heroicon name: mini/chevron-left -->
      <svg
        class="h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
          clip-rule="evenodd"
        />
      </svg>
    </a>

    {#each arrayPages(PAGES) as page, index}
      {#if currentPage - 2 == page && currentPage - 2 > 1}
        <div class="border-r bg-white px-3 py-1 text-sm font-medium">...</div>
      {/if}
      <div
        on:click={() => {
          cb(page);
          currentPage = page;
        }}
        aria-current="page"
        class="relative {currentPage == page ||
        currentPage + 1 == page ||
        currentPage - 1 == page ||
        page == 1 ||
        page == PAGES
          ? ' '
          : 'hidden'}  cursor-pointer items-center  {page === currentPage
          ? ' bg-sky-50 text-sky-600'
          : 'border-gray-300 bg-white hover:bg-gray-50'}  border-r  px-3 py-1 text-sm font-medium  focus:z-20"
      >
        {page}
      </div>
      {#if currentPage + 2 == page && currentPage + 2 < PAGES}
        <div class="border-r bg-white px-3 py-1 text-sm font-medium">...</div>
      {/if}
    {/each}
    <!-- Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" -->

    <!-- <span
        class="relative inline-flex items-center border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700"
        >...</span -->

    <div
      on:click={() => {
        if (currentPage == PAGES) return;
        cb(currentPage + 1);
        currentPage = currentPage + 1;
      }}
      class="relative inline-flex cursor-pointer items-center rounded-r-md  border-gray-300 bg-white px-2 py-1 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
    >
      <span class="sr-only">Next</span>
      <!-- Heroicon name: mini/chevron-right -->
      <svg
        class="h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
          clip-rule="evenodd"
        />
      </svg>
    </div>
  </nav>
</div>
