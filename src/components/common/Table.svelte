<script lang="ts">
  import { goto } from "$app/navigation";
  import Pagination from "./Pagination.svelte";

  export let titles: string[];
  export let records: {
    link?: string;
    records: string[];
    registered?: boolean;
    onClick?: () => any;
  }[];
  export let count: number;
  export let onClickPagination: (page: number) => void;

  let currentPage = 1;
</script>

<div class=" ">
  <div class=" flex flex-col">
    <div class="sm:-mx-6 lg:-mx-8">
      <div class="inline-block min-w-full  align-middle sm:px-6 lg:px-8">
        <div
          class=" overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg"
        >
          <table class="min-w-full divide-y divide-gray-300 text-center ">
            <thead class="bg-gray-50">
              <tr>
                {#each titles as title}
                  <th
                    scope="col"
                    class="whitespace-nowrap py-3.5 pl-4 pr-3  text-sm font-semibold text-gray-900 sm:pl-6"
                    >{title}</th
                  >
                {/each}
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white  ">
              {#each records as record}
                <tr
                  on:click={() => {
                    console.log("OnClick Table", record);

                    if (record.link) return goto(record.link);
                    if (record.onClick) return record.onClick();
                  }}
                  class="cursor-pointer hover:bg-slate-50 {record.registered
                    ? ' bg-green-100'
                    : ''}"
                >
                  {#each record.records as field}
                    <td
                      class="whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium  text-gray-900 sm:pl-6"
                      >{field}</td
                    >
                  {/each}
                </tr>
              {/each}

              <!-- More transactions... -->
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  <div class="">
    {#if count > 10}
      <Pagination {count} bind:currentPage cb={onClickPagination} />
    {/if}
  </div>
</div>
