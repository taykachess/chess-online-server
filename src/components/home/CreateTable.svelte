<script lang="ts">
  import Badge from "$components/common/Badge.svelte";

  export let isOpen: boolean;
</script>

<div
  class="inline-block transform overflow-hidden  rounded-lg bg-white text-left align-middle  shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg "
>
  <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
    <input
      placeholder="Название турнира"
      class=" px-4 pt-4 pb-2 text-lg font-semibold text-slate-500 transition-opacity  delay-500 duration-[1.5s] focus:outline-none focus:ring-0 dark:text-slate-100 sm:px-6 lg:px-4 xl:px-6"
    />

    <dl
      class="flex flex-wrap divide-y divide-slate-200 border-b border-slate-200 text-sm dark:divide-slate-200/5 dark:border-slate-200/5 sm:text-base lg:text-sm xl:text-base"
    >
      <div class="px-4 pb-4 sm:px-6 lg:px-4 xl:px-6">
        2022, 12 ноября, 20:00
      </div>
      <div class="flex w-full flex-none items-center p-4 sm:p-6 lg:p-4 xl:p-6">
        <dt
          class="w-2/5 flex-none font-medium text-slate-500  transition-opacity delay-500 duration-[1.5s] dark:text-slate-300 sm:w-1/4"
        >
          Система
        </dt>
        <Badge
          title="Олимпийская"
          color={{ bg: "bg-green-100", text: "text-green-800" }}
        />
      </div>
      <div class="flex w-full flex-none items-center p-4 sm:p-6 lg:p-4 xl:p-6">
        <dt
          class="w-2/5 flex-none font-medium text-slate-500  transition-opacity delay-500 duration-[1.5s] dark:text-slate-300 sm:w-1/4"
        >
          Описание
        </dt>
        <textarea
          rows="2"
          class=" h-full w-full border-0 bg-transparent text-sm placeholder:text-slate-200 focus:ring-0"
          placeholder="The best tournament "
        />
      </div>
      <div
        class="flex w-full flex-none items-center p-4 sm:py-5 sm:px-6 lg:p-4 xl:py-5 xl:px-6"
      >
        <div
          class="w-2/5 flex-none font-medium text-slate-500  transition-opacity delay-500 duration-[1.5s]  sm:w-1/4"
        >
          Число участников
        </div>
        <div class="">
          <select name="" id="">
            <option value="4">4</option>
            <option value="8">8</option>
          </select>
        </div>
      </div>
    </dl>
  </div>
  <div
    class="grid grid-cols-2 gap-x-4 p-4 sm:gap-x-6 sm:px-6 sm:py-5 lg:gap-x-4 lg:p-4 xl:gap-x-6 xl:px-6 xl:py-5"
  >
    <button
      on:click={() => (isOpen = false)}
      class="dark:highlight-white/10 cursor-pointer rounded-lg bg-slate-100 py-3 text-center text-base font-medium text-slate-500 dark:bg-slate-600 dark:text-slate-400"
    >
      Отмена
    </button>
    <button
      on:click={() => (isOpen = false)}
      class="dark:highlight-white/20 cursor-pointer rounded-lg bg-sky-500 py-3 text-center text-base font-medium text-white"
    >
      Создать турнир
    </button>
  </div>
</div>
