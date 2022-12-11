<script lang="ts">
  import YandexButton from "./YandexButton.svelte";
  import LichessButton from "./LichessButton.svelte";

  export let isOpen: boolean;

  let username = "";
  $: isValidUsernameLong = (username.match(/^.{5,18}$/g) || []).length == 1;
  $: isValidUsernameString =
    (username.match(/^[a-zA-Z0-9]{0,}$/g) || []).length == 1;
  let isUniqueUsername: boolean | null = null;

  $: validationDone =
    isValidUsernameLong && isValidUsernameString && isUniqueUsername && terms;

  let terms = true;

  async function isUniqueUser(username: string) {
    const data = await fetch(`/api/user/${username}/isUnique`);
    if (data.status == 200) {
      isUniqueUsername = await data.json();
    }
  }

  let timerId: NodeJS.Timeout;

  async function inputHandler(event: any) {
    // console.log("username", username, event.target.value);
    // await tick();
    // console.log(isValidated());
    isUniqueUsername = null;
    clearTimeout(timerId);
    const isValidUsernameLong =
      (event.target.value.match(/^.{5,18}$/g) || []).length == 1;
    const isValidUsernameString =
      (event.target.value.match(/^[a-zA-Z0-9]{0,}$/g) || []).length == 1;

    if (isValidUsernameLong && isValidUsernameString) {
      timerId = setTimeout(async () => {
        await isUniqueUser(event.target.value);
      }, 2000);
    }
  }
</script>

<div class=" z-20  py-8 text-left">
  <div
    class="relative mx-auto mt-8  rounded-lg bg-white px-16 py-8 shadow-2xl "
  >
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      on:click={() => {
        isOpen = !isOpen;
      }}
      class=" absolute right-[-0.5rem] top-[-0.5rem] cursor-pointer rounded-full border border-slate-500 bg-slate-200 p-px hover:bg-slate-300"
    >
      <!-- prettier-ignore -->
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
    <h2 class="text-center text-2xl font-bold tracking-wide text-gray-800">
      Регистрация
    </h2>
    <p class="mt-2 text-center text-sm text-gray-600">
      Уже имеется аккаунт? <a
        href="#"
        class="text-blue-600 hover:text-blue-700 hover:underline"
        title="Sign In">Вход</a
      >
    </p>

    <form class="my-8 text-sm">
      <div class="my-4 flex flex-col">
        <label for="name" class="text-gray-700">Имя пользователя</label>
        <input
          on:input={inputHandler}
          bind:value={username}
          type="text"
          name="name"
          id="name"
          class="mt-2 rounded border border-gray-300 p-2 text-sm text-gray-900 focus:border-gray-300 focus:outline-none focus:ring-0"
          placeholder="Enter your name"
        />
      </div>

      <div class="">
        <div class="my-1 flex space-x-3">
          {#if isValidUsernameLong}
            <!-- prettier-ignore -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 text-lime-400">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
            </svg>
          {:else}
            <!-- prettier-ignore -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 text-red-400">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
          </svg>
          {/if}

          <div class="">Имя пользователя содержит от 5 до 18 символов</div>
        </div>
        <div class="my-1 flex space-x-3">
          <!-- prettier-ignore -->
          {#if isValidUsernameString}
            <!-- prettier-ignore -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 text-lime-400">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
            </svg>
          {:else}
            <!-- prettier-ignore -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 text-red-400">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
          </svg>
          {/if}

          <div class="">Используются только латинские буквы (a-Z) и числа</div>
        </div>
        <div class="my-1 flex space-x-3">
          {#if isUniqueUsername == null}
            <!-- prettier-ignore -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 text-blue-400">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.345a.75.75 0 01-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 108.94 6.94zM10 15a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
          </svg>
          {:else if isUniqueUsername == true}
            <!-- prettier-ignore -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 text-lime-400">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
            </svg>
          {:else if isUniqueUsername == false}
            <!-- prettier-ignore -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 text-red-400">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
          </svg>
          {/if}

          <div class="">Уникальное имя</div>
        </div>
      </div>

      <div class="mt-4 flex items-center">
        <input
          bind:checked={terms}
          type="checkbox"
          name="remember_me"
          id="remember_me"
          class="mr-2 rounded focus:ring-0"
        />
        <label for="remember_me" class="text-sm "
          >Подтверждаю честную игру и уважения к другим игрокам</label
        >
      </div>
    </form>

    <div class={validationDone ? "" : " invisible"}>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <LichessButton state={username} type="signup">
        <div class=" absolute top-[-0.5rem] rounded bg-teal-200 px-2 text-xs">
          Рекомендован, особенно для title игроков
        </div>
      </LichessButton>

      <div class="my-3 flex items-center justify-between">
        <div class="h-[1px] w-full bg-gray-300" />
        <span class="mx-6 text-sm uppercase text-gray-400">Или</span>
        <div class="h-[1px] w-full bg-gray-300" />
      </div>

      <div class=" w-1/3 ">
        <YandexButton state={username} type="signup" />
      </div>
    </div>
  </div>
</div>
