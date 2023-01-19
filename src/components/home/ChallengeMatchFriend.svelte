<script>
  import IconPiecies from '$components/icons/IconPiecies.svelte'
  import IconRook from '$components/icons/IconRook.svelte'
</script>

<div class=" ">
  <!-- prettier-ignore -->
  <ul class=" ml-16 divide-y  border-t  bg-white  flex  ">
        <li class="  ">
            <div class=" p-2 group relative flex items-start space-x-3 cursor-pointer  hover:bg-slate-100 rounded-t-lg   ">
                <div class="flex-shrink-0">
                  <span class="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-sky-100">
                    <!-- Heroicon name: outline/megaphone -->
                    <IconRook></IconRook>
                  </span>
                </div>
                <div class=" flex-1  self-center  ">
                  <div class="text-sm font-medium text-gray-900 ">
                    <p>
                      Игра с другом 
                    </p>
                  </div>
                </div>
                <div class="flex-shrink-0 self-center">
                  <!-- Heroicon name: mini/chevron-right -->
                  <svg class="h-5 w-5 text-gray-400 group-hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
        </li>
        <li>
            <div class=" p-2 group relative flex items-start space-x-3 cursor-pointer   hover:bg-slate-100 rounded-b-lg  ">
                <div class="flex-shrink-0">
                  <span class="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-pink-100">
                    <!-- Heroicon name: outline/megaphone -->
                    <div class=" w-6 h-6">

                      <IconPiecies></IconPiecies>
                    </div>
                  </span>
                </div>
                <div class="min-w-0 flex-1 self-center">
                  <div class="text-sm font-medium text-gray-900">
                    <p>
                      Матч с другом
                    </p>
                  </div>
                </div>
                <div class="flex-shrink-0 self-center">
                  <!-- Heroicon name: mini/chevron-right -->
                  <svg class="h-5 w-5 text-gray-400 group-hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
        </li>
    </ul>
</div>
