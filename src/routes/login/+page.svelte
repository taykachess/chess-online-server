<script lang="ts">
  import Lichess from "$components/icons/Lichess.svelte";
  import { Mail, Icon, User, LockClosed } from "svelte-hero-icons";
  // import type { PageData } from "./$types";

  // export let data: PageData;
</script>

<div class=" flex flex-col items-center text-xl">
  <div class=" text-2xl font-bold">Вход</div>
  <div class=" mt-3 w-full divide-y-2" />
  <form action="" class=" w-5/12">
    <label class="mt-2 block">
      <span
        class="block font-medium text-slate-700 after:ml-0.5  after:text-red-500 after:content-['*']"
      >
        Логин
      </span>
      <input
        type="text"
        name="username"
        class="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 placeholder-slate-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1  focus:ring-sky-500"
        placeholder="username"
      />
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
    </label>
  </form>
  <div class=" my-2 font-bold">Или...</div>
  <div class=" flex  h-12 items-center justify-center border ">
    <div class="  mx-2 h-8 w-8 ">
      <Lichess />
    </div>
    <div class="mr-2">Войти с помощью lichess.org</div>
  </div>
  <!-- <div class="">Заполните все поля</div> -->
</div>
