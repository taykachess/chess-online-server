<script lang="ts">
  import IconCheck from "$components/icons/IconCheck.svelte";
  import IconXCircle from "$components/icons/IconXCircle.svelte";
  import { socket } from "$store/sockets/socket";
  import type { MatchCreateDto } from "$types/match";
  import {
    Button,
    Heading,
    Label,
    Li,
    List,
    Modal,
    Radio,
    Range,
    Search,
    Select,
    Spinner,
  } from "flowbite-svelte";

  const controls: { value: string; name: string }[] = [
    { value: "1+0", name: "1+0" },
    { value: "1+1", name: "1+1" },
    { value: "1+2", name: "1+2" },
    { value: "3+0", name: "3+0" },
    { value: "3+1", name: "3+1" },
    { value: "3+2", name: "3+2" },
    { value: "5+0", name: "5+0" },
    { value: "5+3", name: "5+3" },
    { value: "10+5", name: "10+5" },
    { value: "15+10", name: "15+10" },
  ];

  const timeControls: { value: string | number; name: string }[] = [
    { value: 1, name: "1 минута" },
    { value: 10, name: "10 минут" },
    { value: 20, name: "20 минут" },
    { value: 30, name: "30 минут" },
    { value: 40, name: "40 минут" },
    { value: 50, name: "50 минут" },
    { value: 60, name: "60 минут" },
    { value: 70, name: "1 час 10 минут" },
    { value: 80, name: "1 час 20 минут" },
    { value: 90, name: "1 час 30 минут" },
    { value: 100, name: "1 час 40 минут" },
    { value: 110, name: "1 час 50 минут" },
    { value: 120, name: "2 часа" },
  ];

  let defaultModal = false;
  let requestId: any;
  let players: { username: string }[] = [];

  let friend: string | null = null;
  let loading: boolean = false;
  let time: number = 3;
  let increment: number = 2;

  let friendFieldComplete = false;

  let formData: MatchCreateDto = {
    player: "",
    control: "1+0",
    type: "time",
    periods: [[10, "3+0"]],
  };

  async function onInput(event: any) {
    if (event.target.value.length < 2) return;
    loading = true;
    friendFieldComplete = false;
    friend = null;
    players = [];
    clearTimeout(requestId);
    requestId = setTimeout(async () => {
      const data = await fetch(`/api/user/${event.target.value}/startsWith`);
      const users = await data.json();
      loading = false;
      players = users;
      console.log(event.target.value, JSON.stringify(users));
    }, 2000);
  }

  function sendMatch(form: MatchCreateDto) {
    // @ts-ignore
    // Required
    const formDto: MatchCreateDto = {
      player: form.player,
      type: form.type,
    };
    if (form.type == "bestof") {
      formDto.control = form.control;
    } else if (form.type == "time") {
      formDto.periods = formData.periods;
    }

    $socket.emit("match:private:create", formDto);
  }
</script>

<Button color={"red"} on:click={() => (defaultModal = true)}
  >Матч с другом</Button
>
<Modal title="Матч с другом" bind:open={defaultModal} autoclose>
  <form>
    <section class=" relative  h-20 w-1/2  ">
      <p class="mb-2 text-lg font-medium text-gray-900 dark:text-white">
        Игрок :
      </p>
      <div class="flex items-center space-x-2 ">
        <div class=" relative">
          <Search
            on:input={onInput}
            bind:value={formData.player}
            placeholder="игрок"
            size="sm"
          />

          {#if players.length && friend == null}
            <div class=" absolute w-full ">
              <div class="z-20 flex  flex-col border   ">
                {#each players as player}
                  <!-- svelte-ignore a11y-click-events-have-key-events -->
                  <div
                    on:click={() => {
                      friend = player.username;
                      formData.player = player.username;
                      friendFieldComplete = true;
                    }}
                    class=" cursor-pointer text-center text-sm text-slate-800 hover:text-sky-700 "
                  >
                    {player.username}
                  </div>
                {/each}
              </div>
            </div>
          {/if}
        </div>
        {#if friendFieldComplete}
          <div class="h-6 w-6 text-green-700 ">
            <IconCheck />
          </div>
        {:else if loading}
          <Spinner />
        {:else}
          <div class="h-6 w-6 text-red-700 ">
            <IconXCircle />
          </div>
        {/if}
      </div>
    </section>

    <!-- <FloatingLabelInput style="outlined" label="Player" /> -->
    <div class=" mt-4" />

    <section class="">
      <p class="mb-2 text-lg font-medium text-gray-900 dark:text-white">
        Тип матча :
      </p>
      <div class="grid w-full gap-6 md:grid-cols-2">
        <Radio name="custom" custom bind:group={formData.type} value="game">
          <div
            class="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-5 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-blue-500"
          >
            <div>
              <div class="mb-3 w-full text-lg font-semibold">
                Матч из кол-во партий
              </div>
              <ul class="ml-4 w-full list-decimal ">
                <li>Ограниченное число партий.</li>
                <li>Выигрывает тот, кто наберет больше очков.</li>
                <li>Матч может прерваться досрочно.</li>
              </ul>
            </div>
          </div>
        </Radio>
        <Radio name="custom" custom bind:group={formData.type} value="time">
          <div
            class="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-5 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-blue-500"
          >
            <div>
              <div class="mb-3 w-full text-lg font-semibold">
                Матч по времени
              </div>
              <ul class="ml-4 w-full list-decimal ">
                <li>Неограниченное число партий.</li>
                <li>Выигрывает тот, кто наберет больше очков.</li>
                <li>Матч заканчивается по истечении времени</li>
              </ul>
            </div>
          </div>
        </Radio>
      </div>
    </section>

    <!-- <section class=" mt-4">
      <p class="mb-2 text-lg font-medium text-gray-900 dark:text-white">
        Контроль времени :
      </p>
      <div class=" flex space-x-8">
        <div class=" w-1/2">
          <Label>Время</Label>
          <Range bind:value={time} min="1" max="15" />
          <p>{time} минут</p>
        </div>
        <div class=" w-1/2">
          <Label>Добавление</Label>
          <Range bind:value={increment} min="1" max="15" />
          <p>{increment} секунд</p>
        </div>
      </div>
    </section> -->

    <div class=" mt-4" />

    <section>
      <p class="mb-2 text-lg font-medium text-gray-900 dark:text-white">
        Контроль времени :
      </p>
      <div class=" flex space-x-8">
        <div class="w-2/5">
          <Label>Временной период</Label>
        </div>
        <div class="w-2/5">
          <Label>Контроль времени</Label>
        </div>
      </div>
      {#each formData.periods as period, index}
        <div class=" flex space-x-8 ">
          <div class=" w-2/5">
            <Select
              class="mt-2"
              items={timeControls}
              bind:value={formData.periods[index][0]}
            />
          </div>
          <div class=" w-2/5">
            <Select
              class="mt-2"
              items={controls}
              bind:value={formData.periods[index][1]}
            />
          </div>

          <div class="mt-2 flex w-1/5  ">
            {#if index == formData.periods.length - 1}
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <div
                on:click={() => {
                  formData.periods[formData.periods.length] = [10, "1+0"];
                  // formData.periods[formData.periods.length]
                }}
                class=" flex h-10 w-10 cursor-pointer items-center justify-center bg-green-200"
              >
                +
              </div>
            {/if}

            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div
              on:click={() => {
                formData.periods.splice(index, 1);
                formData.periods = formData.periods;
              }}
              class=" flex h-10 w-10 cursor-pointer items-center justify-center bg-red-200"
            >
              -
            </div>
          </div>
        </div>
      {/each}
    </section>
  </form>
  <svelte:fragment slot="footer">
    <div class=" flex w-full justify-end space-x-2">
      <Button color="alternative">Отмена</Button>
      <Button on:click={() => sendMatch(formData)}>Отправить вызов</Button>
    </div>
  </svelte:fragment>
</Modal>
