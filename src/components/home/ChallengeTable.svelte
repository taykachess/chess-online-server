<div class="px-4 sm:px-6 lg:px-8">
  <div class=" flex flex-col">
    <div class="-my-2 -mx-4  sm:-mx-6 lg:-mx-8">
      <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
        <div
          class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg"
        >
          <table class="min-w-full divide-y divide-gray-300 text-center ">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="whitespace-nowrap py-3.5 pl-4 pr-3  text-sm font-semibold text-gray-900 sm:pl-6"
                  >Игрок</th
                >
                <th
                  scope="col"
                  class="whitespace-nowrap px-2 py-3.5  text-sm font-semibold text-gray-900"
                  >Рейтинг</th
                >
                <th
                  scope="col"
                  class="whitespace-nowrap px-2 py-3.5  text-sm font-semibold text-gray-900"
                  >Контроль</th
                >
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white  ">
              {#each Array(10) as record}
                <tr class="cursor-pointer hover:bg-slate-50">
                  <td
                    class="whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium  text-gray-900 sm:pl-6"
                    >Tayka</td
                  >
                  <td class="whitespace-nowrap px-2 py-2 text-sm  text-gray-500"
                    >2459</td
                  >
                  <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500"
                    >3+0</td
                  >
                </tr>
              {/each}

              <!-- More transactions... -->
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>
