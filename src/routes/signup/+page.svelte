<script lang="ts">
  import Lichess from "$components/icons/Lichess.svelte";
  import { Mail, Icon, User, LockClosed } from "svelte-hero-icons";

  import type { ActionData } from "./$types";

  export let form: ActionData;
  // export let data: PageData;
</script>

<div class=" flex flex-col items-center text-xl">
  <div class=" text-2xl font-bold">
    Зарегестрируйся и начни
    <span
      class="relative inline-block before:absolute before:-inset-1 before:block before:-skew-y-3 before:bg-gray-800"
    >
      <span class="relative text-white">игру</span>
    </span>
  </div>
  <div class=" mt-6 w-full divide-y-2" />
  <form method="post" class=" w-5/12 ">
    <label class="block">
      <span
        class="block font-medium text-slate-700 after:ml-0.5  after:text-red-500 after:content-['*']"
      >
        Почта
      </span>
      <input
        type="email"
        name="email"
        class="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 placeholder-slate-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1  focus:ring-sky-500"
        placeholder="you@example.com"
        value={form?.data?.email ?? ""}
      />

      {#if form?.errors?.email}
        <span class=" text-red-500 ">{form?.errors?.email[0]}</span>
      {/if}
    </label>

    <label class="mt-2 block">
      <span
        class="block font-medium text-slate-700 after:ml-0.5  after:text-red-500 after:content-['*']"
      >
        Имя пользователя (логин)
      </span>
      <input
        type="text"
        name="username"
        class="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 placeholder-slate-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1  focus:ring-sky-500"
        placeholder="username"
        value={form?.data?.username ?? ""}
      />
      <div>
        {#if form?.errors?.username}
          <span class=" text-red-500 ">{form?.errors?.username[0]}</span>
        {/if}
      </div>
    </label>

    <label class="mt-2 block">
      <span
        class="block font-medium text-slate-700 after:ml-0.5  after:text-red-500 after:content-['*']"
      >
        Пароль
      </span>
      <input
        type="password"
        name="password"
        class="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 placeholder-slate-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1  focus:ring-sky-500"
        placeholder="password"
      />
      {#if form?.errors?.password}
        <span class=" text-red-500 ">{form?.errors?.password[0]}</span>
      {/if}
    </label>
    <label class="mt-2 block">
      <span
        class="block font-medium text-slate-700 after:ml-0.5  after:text-red-500 after:content-['*']"
      >
        Подтвердите пароль
      </span>
      <input
        type="password"
        name="passwordConfirm"
        class="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 placeholder-slate-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1  focus:ring-sky-500"
        placeholder="password"
      />
      {#if form?.errors?.passwordConfirm}
        <span class=" text-red-500 ">{form?.errors?.passwordConfirm[0]}</span>
      {/if}
    </label>

    <div class="mt-2 flex items-center justify-center">
      <label for="terms" class=" mr-2">
        Принимаю пользовательское
        <span class=" cursor-pointer text-blue-600 hover:text-blue-800"
          >соглашение</span
        > :</label
      >
      <input id="terms" name="terms" type="checkbox" checked />
    </div>

    <div class="mt-2 flex w-full items-center justify-center">
      <button type="submit" class=" bg-blue-400 p-3 text-white ">
        Зарегестрироваться
      </button>
    </div>
  </form>
  <div class=" my-2 font-bold">Или...</div>
  <div class=" flex  h-12 items-center justify-center border ">
    <div class="  mx-2 h-8 w-8 ">
      <Lichess />
    </div>
    <div class="mr-2">Зарегестрироваться с помощью lichess.org</div>
  </div>
  <!-- <div class="">Заполните все поля</div> -->
</div>
