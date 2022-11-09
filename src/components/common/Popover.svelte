<script lang="ts">
  import {
    Popover,
    PopoverButton,
    PopoverPanel,
  } from "@rgossiaux/svelte-headlessui";

  export let title: string = "tayka";
  export let rating: number = 1758;
  export let records: {
    link: string;
    svg: string;
    title: string;
    description: string;
  }[] = [
    {
      link: "",
      svg: "",
      title: "Insights",
      description: "Measure actions your users take",
    },
    {
      link: "",
      svg: "",
      title: "Insights",
      description: "Measure actions your users take",
    },
  ];
</script>

<Popover class="relative ">
  <PopoverButton
    class=" group inline-flex items-center rounded-md bg-slate-700 px-4 py-1 font-medium text-white text-opacity-90 hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
  >
    <span>{title}</span>
    <span class=" ml-2 mt-px rounded bg-white px-1 text-xs text-slate-700"
      >{rating}</span
    >

    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      class="ml-2 h-5 w-5 text-slate-300 text-opacity-70 transition duration-150 ease-in-out group-hover:text-opacity-80"
    >
      <path
        fill-rule="evenodd"
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
        clip-rule="evenodd"
      />
    </svg>
  </PopoverButton>

  <PopoverPanel class="absolute right-0 z-10 mt-1 ">
    <div
      class="w-80  overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5"
    >
      <div class="relative grid gap-8 bg-white p-7 ">
        {#each records as record}
          <a
            href="##"
            class="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
            ><div
              class="flex h-10 w-10 flex-shrink-0 items-center justify-center text-white sm:h-12 sm:w-12"
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                class=" bg-orange-100"
                xmlns="http://www.w3.org/2000/svg"
                ><rect width="48" height="48" rx="8" class="" /><path
                  d="M24 11L35.2583 17.5V30.5L24 37L12.7417 30.5V17.5L24 11Z"
                  stroke="#FB923C"
                  stroke-width="2"
                /><path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M16.7417 19.8094V28.1906L24 32.3812L31.2584 28.1906V19.8094L24 15.6188L16.7417 19.8094Z"
                  stroke="#FDBA74"
                  stroke-width="2"
                /><path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M20.7417 22.1196V25.882L24 27.7632L27.2584 25.882V22.1196L24 20.2384L20.7417 22.1196Z"
                  stroke="#FDBA74"
                  stroke-width="2"
                /></svg
              >
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-900">{record.title}</p>
              <p class="text-sm text-gray-500">
                {record.description}
              </p>
            </div>
          </a>
        {/each}
      </div>
      <div class="bg-gray-50 p-4">
        <slot />
      </div>
    </div>

    <!-- <img src="/solutions.jpg" alt="" /> -->
  </PopoverPanel>
</Popover>
