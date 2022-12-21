<script lang="ts">
  import { DateInput } from "date-picker-svelte";

  import Select from "$components/common/Select.svelte";
  import Switch from "$components/common/Switch.svelte";

  import type { Prisma } from "@prisma/client";

  export let isOpen: boolean;

  import { goto } from "$app/navigation";

  let formData: Prisma.TournamentCreateInput = {
    name: "",
    description: "",
    control: "3+2",
    format: "swiss",
    startTime: new Date(),
  };

  async function createTournament() {
    const response = await fetch("/api/tournament/create", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "content-type": "application/json",
      },
    });

    const id = await response.json();

    goto(`/tournament/${id}`);
  }
</script>

<div
  class="inline-block transform overflow-hidden  rounded-lg bg-white text-left align-middle  shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg "
>
  <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 ">
    <input
      bind:value={formData.name}
      placeholder="Название турнира"
      class=" px-4 pt-4 pb-2 text-lg font-semibold text-slate-500 transition-opacity delay-500  duration-[1.5s] placeholder:text-slate-300 focus:outline-none focus:ring-0 dark:text-slate-100 sm:px-6 lg:px-4 xl:px-6"
    />

    <div
      class="flex flex-wrap divide-y divide-slate-200 border-b border-slate-200 text-sm dark:divide-slate-200/5 dark:border-slate-200/5 sm:text-base lg:text-sm xl:text-base"
    >
      <div class=" px-4  pb-4 sm:px-6 lg:px-4 xl:px-6">
        <DateInput
          bind:value={formData.startTime}
          format="yyyy-MM-dd HH:mm"
          min={new Date()}
          max={new Date(new Date().getTime() + 60 * 60 * 1000 * 24 * 31)}
          placeholder="время и дата"
        />
      </div>

      <div class="flex w-full flex-none items-center p-4 sm:p-6 lg:p-4 xl:p-6">
        <dt
          class="w-2/5 flex-none font-medium text-slate-500  transition-opacity delay-500 duration-[1.5s] dark:text-slate-300 sm:w-1/4"
        >
          Система
        </dt>
        <Select
          options={[
            { name: "Олимпийская", value: "elimination" },
            { name: "Щвейцарка", value: "swiss" },
            { name: "Круговой", value: "round robin" },
          ]}
          color={{ bg: "bg-green-100", text: "text-green-800" }}
          colorOptions={{ bg: "bg-slate-100", hover: "hover:bg-slate-300" }}
          bind:value={formData.format}
        />
      </div>
      {#if formData.format === "swiss"}
        <div
          class="flex w-full flex-none items-center p-4 sm:p-6 lg:p-4 xl:p-6"
        >
          <dt
            class="w-2/5 flex-none font-medium text-slate-500  transition-opacity delay-500 duration-[1.5s] dark:text-slate-300 sm:w-1/4"
          >
            Раундов
          </dt>
          <Select
            options={[
              { name: "7", value: 7 },
              { name: "8", value: 8 },
              { name: "9", value: 9 },
              { name: "10", value: 10 },
              { name: "11", value: 11 },
              { name: "12", value: 12 },
              { name: "13", value: 13 },
            ]}
            color={{ bg: "bg-green-100", text: "text-green-800" }}
            colorOptions={{ bg: "bg-slate-100", hover: "hover:bg-slate-300" }}
            bind:value={formData.rounds}
          />
        </div>
      {/if}

      {#if formData.format === "elimination"}
        <div
          class="flex w-full flex-none items-center p-4 sm:py-5 sm:px-6 lg:p-4 xl:py-5 xl:px-6"
        >
          <div
            class="w-3/5 flex-none font-medium text-slate-500  transition-opacity delay-500 duration-[1.5s]  sm:w-1/4"
          >
            Сетка
          </div>
          <Select
            bind:value={formData.playerLimit}
            options={[
              { name: "4 игрока", value: 4 },
              { name: "8 игроков", value: 8 },
              { name: "16 игроков", value: 16 },
              { name: "32 игроков", value: 32 },
              { name: "64 игроков", value: 64 },
            ]}
            color={{ bg: "bg-green-100", text: "text-green-800" }}
            colorOptions={{ bg: "bg-slate-100", hover: "hover:bg-slate-300" }}
          />
        </div>

        <div
          class="flex w-full flex-none items-center p-4 sm:p-6 lg:p-4 xl:p-6"
        >
          <dt
            class="w-2/5 flex-none font-medium text-slate-500  transition-opacity delay-500 duration-[1.5s] dark:text-slate-300 sm:w-1/4"
          >
            Двойное выбивание
          </dt>
          <Switch bind:state={formData.double} />
        </div>
      {/if}

      {#if formData.format === "round robin"}
        <div
          class="flex w-full flex-none items-center p-4 sm:py-5 sm:px-6 lg:p-4 xl:py-5 xl:px-6"
        >
          <div
            class=" mr-5 flex-none font-medium text-slate-500  transition-opacity delay-500 duration-[1.5s] "
          >
            Кол-во игроков
          </div>
          <Select
            bind:value={formData.playerLimit}
            options={[
              { name: "4", value: 4 },
              { name: "5", value: 5 },
              { name: "6", value: 6 },
              { name: "7", value: 7 },
              { name: "8", value: 8 },
              { name: "9", value: 9 },
              { name: "10", value: 10 },
              { name: "11", value: 11 },
            ]}
            color={{ bg: "bg-green-100", text: "text-green-800" }}
            colorOptions={{ bg: "bg-slate-100", hover: "hover:bg-slate-300" }}
          />
        </div>

        <div
          class="flex w-full flex-none items-center p-4 sm:p-6 lg:p-4 xl:p-6"
        >
          <dt
            class="w-2/5 flex-none font-medium text-slate-500  transition-opacity delay-500 duration-[1.5s] dark:text-slate-300 sm:w-1/4"
          >
            В 2 круга
          </dt>
          <Switch bind:state={formData.double} />
        </div>
      {/if}

      <div class="flex w-full flex-none items-center p-4 sm:p-6 lg:p-4 xl:p-6">
        <dt
          class="w-2/5 flex-none font-medium text-slate-500  transition-opacity delay-500 duration-[1.5s] dark:text-slate-300 sm:w-1/4"
        >
          Контроль
        </dt>
        <Select
          bind:value={formData.control}
          options={[
            { name: "3+0", value: "3+0" },
            { name: "1+0", value: "1+0" },
            { name: "3+2", value: "3+2" },
          ]}
          color={{ bg: "bg-green-100", text: "text-green-800" }}
          colorOptions={{ bg: "bg-slate-100", hover: "hover:bg-slate-300" }}
        />
      </div>

      <div class="flex w-full flex-none  items-center p-4 sm:p-6 lg:p-4 xl:p-6">
        <dt
          class="w-2/5 flex-none font-medium text-slate-500  transition-opacity delay-500 duration-[1.5s] dark:text-slate-300 sm:w-1/4"
        >
          Описание
        </dt>
        <textarea
          rows="2"
          class="  h-full w-full border-0 bg-transparent text-sm placeholder:text-slate-200 focus:ring-0"
          placeholder="The best tournament "
        />
      </div>
    </div>
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
      on:click={createTournament}
      class="dark:highlight-white/20 cursor-pointer rounded-lg bg-sky-500 py-3 text-center text-base font-medium text-white"
    >
      Создать турнир
    </button>
  </div>
</div>
