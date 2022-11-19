<script lang="ts">
  import { enhance } from "$app/forms";

  import { page } from "$app/stores";
  import { socket } from "$store/sockets/socket";

  export let isOpen: boolean;

  let formData = {
    email: "",
    username: "",
    password: "",
    passwordConfirm: "",
  };

  $: valid =
    formData.password === formData.passwordConfirm &&
    formData.password.length > 4 &&
    formData.username.length > 4;
</script>

<!-- use:enhance={({ form, data, action, cancel }) => {}} -->
<form
  on:keydown={(event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      return false;
    }
  }}
  method="POST"
  action="/?/register"
  use:enhance={({ form, data, action, cancel }) => {
    console.log(data);
    return async ({ result, update }) => {
      await update();
      if ($page.form?.success) {
        localStorage.setItem("token", $page.form.token);
        // @ts-ignore
        $socket.auth.token = $page.form.token;
        $socket.disconnect().connect();
        isOpen = false;
      }
    };
  }}
  class="inline-block transform overflow-hidden  rounded-lg bg-white text-left align-middle  shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg "
>
  <div class="divide-y bg-white px-4 pt-5 ">
    <div
      class=" px-4 pt-4 pb-6 text-lg font-semibold text-slate-600  transition-opacity delay-500  duration-[1.5s] placeholder:text-slate-300 focus:outline-none focus:ring-0 dark:text-slate-100 sm:px-6 lg:px-4 xl:px-6"
    >
      Создать нового пользователя
    </div>
    <div
      class="relative flex flex-wrap divide-y divide-slate-200 border-b border-slate-200 text-sm dark:divide-slate-200/5 dark:border-slate-200/5 sm:text-base lg:text-sm xl:text-base"
    >
      <div class="flex w-full flex-none items-center p-4 sm:p-6 lg:p-4 xl:p-6">
        <label
          for="email"
          class="w-2/5 flex-none font-medium text-slate-600 transition-opacity delay-500  duration-[1.5s] after:text-red-500 after:content-['*'] dark:text-slate-300 sm:w-2/5"
        >
          Почта
        </label>
        <div class="  ">
          <input
            bind:value={formData.email}
            id="email"
            name="email"
            type="email"
            placeholder="example@mail.com"
            class="border-0 focus:outline-none focus:ring-0"
          />
          {#if $page.form?.errors?.email}
            <div class=" absolute text-red-500 ">
              {$page.form?.errors?.email[0]}
            </div>
          {/if}
        </div>
      </div>
    </div>
    <div
      class=" relative flex flex-wrap  divide-slate-200 border-b border-slate-200 text-sm dark:divide-slate-200/5 dark:border-slate-200/5 sm:text-base lg:text-sm xl:text-base"
    >
      <div class="flex w-full flex-none items-center p-4 sm:p-6 lg:p-4 xl:p-6">
        <dt
          class="w-2/5 flex-none font-medium text-slate-600 transition-opacity delay-500  duration-[1.5s] after:text-red-500 after:content-['*'] dark:text-slate-300 sm:w-2/5"
        >
          Никнейм
        </dt>
        <div class="">
          <input
            bind:value={formData.username}
            type="text"
            name="username"
            placeholder="username"
            class="border-0 focus:outline-none focus:ring-0"
          />
          {#if $page.form?.errors?.username}
            <div class=" absolute text-red-500 ">
              {$page.form?.errors?.username[0]}
            </div>
          {/if}
        </div>
      </div>
    </div>

    <div
      class="flex flex-wrap divide-y divide-slate-200 border-b border-slate-200 text-sm dark:divide-slate-200/5 dark:border-slate-200/5 sm:text-base lg:text-sm xl:text-base"
    >
      <div
        class="relative flex w-full flex-none items-center p-4 sm:p-6 lg:p-4 xl:p-6"
      >
        <dt
          class="w-2/5 flex-none font-medium text-slate-600 transition-opacity delay-500  duration-[1.5s] after:text-red-500 after:content-['*'] dark:text-slate-300 sm:w-2/5"
        >
          Пароль
        </dt>
        <div class="">
          <input
            bind:value={formData.password}
            name="password"
            type="password"
            placeholder="****"
            class="border-0 focus:outline-none focus:ring-0"
          />
          {#if $page.form?.errors?.password}
            <span class="absolute text-red-500 "
              >{$page.form?.errors?.password[0]}</span
            >
          {/if}
        </div>
      </div>
    </div>
    <div
      class="relative flex flex-wrap divide-y divide-slate-200 border-b border-slate-200 text-sm dark:divide-slate-200/5 dark:border-slate-200/5 sm:text-base lg:text-sm xl:text-base"
    >
      <div class="flex w-full flex-none items-center p-4 sm:p-6 lg:p-4 xl:p-6 ">
        <dt
          class="w-2/5 flex-none text-sm font-medium text-slate-600 transition-opacity delay-500 duration-[1.5s] after:text-red-500 after:content-['*'] dark:text-slate-300 sm:w-2/5"
        >
          Подтвердить пароль
        </dt>
        <div class="">
          <input
            bind:value={formData.passwordConfirm}
            name="passwordConfirm"
            type="password"
            placeholder="****"
            class="border-0 focus:outline-none focus:ring-0"
          />
          {#if $page.form?.errors?.passwordConfirm}
            <span class="absolute text-red-500 "
              >{$page.form?.errors?.passwordConfirm[0]}</span
            >
          {/if}
        </div>
      </div>
    </div>

    <div class="divide-y" />
  </div>
  <div
    class="grid grid-cols-2 gap-x-4 p-4 sm:gap-x-6 sm:px-6 sm:py-5 lg:gap-x-4 lg:p-4 xl:gap-x-6 xl:px-6 xl:py-5 "
  >
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      on:click={() => (isOpen = false)}
      class="dark:highlight-white/10 cursor-pointer rounded-lg bg-slate-100 py-3 text-center text-base font-medium text-slate-500 dark:bg-slate-600 dark:text-slate-400"
    >
      Отменить регистрацию
    </div>
    <button
      on:click={(event) => {
        if (!valid) {
          event.preventDefault();
        }
      }}
      class="dark:highlight-white/20 cursor-pointer rounded-lg {valid
        ? 'bg-sky-500'
        : 'bg-slate-200'}  py-3 text-center text-base font-medium text-white"
    >
      Создать пользователя
    </button>
  </div>
</form>
