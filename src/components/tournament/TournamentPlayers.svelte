<script>
  import BadgeTitle from "$components/common/BadgeTitle.svelte";
</script>

<div class=" shadow-lg">
  <!-- prettier-ignore -->
  <div class=" grid grid-cols-7 bg-white rounded-tr-md rounded-tl-md  w-full text-center text-sm border">
        <div class=" col-span-1 px-4 py-2   border-gray-300 text-gray-700"> 1/100 </div>
        <div class=" col-span-4 px-4 py-2  border-x  border-gray-300 text-gray-700"> Игроки </div>
        <div class=" col-span-2 px-4 py-2  border-gray-300 text-gray-700"> Рейтинг </div>
    </div>
  <!-- prettier-ignore -->
  <div class=" grid grid-cols-7 bg-white border-b  border-x  w-full text-center">
        <div class="relative text-center col-span-1   border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">1</div>
        <div class="relative col-span-4   border-x border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <BadgeTitle title="GM" />
            tayka
        </div>
        <div class="relative text-center col-span-2  rounded-r-md  border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">2710</div>
      </div>
</div>
