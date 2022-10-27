<script lang="ts">
    import Lichess from "$components/icons/Lichess.svelte";
    import { Mail, Icon, User, LockClosed } from "svelte-hero-icons";
    // import type { PageData } from "./$types";

    // export let data: PageData;
</script>

<div class=" flex flex-col items-center text-xl">
    <div class=" text-2xl font-bold">Вход</div>
    <div class=" divide-y-2 w-full mt-3" />
    <form action="" class=" w-5/12">
        <label class="block mt-2">
            <span
                class="after:content-['*'] after:ml-0.5 after:text-red-500 block  font-medium text-slate-700"
            >
                Логин
            </span>
            <input
                type="text"
                name="username"
                class="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md  focus:ring-1"
                placeholder="username"
            />
        </label>

        <label class="block mt-2">
            <span
                class="after:content-['*'] after:ml-0.5 after:text-red-500 block  font-medium text-slate-700"
            >
                Пароль
            </span>
            <input
                type="password"
                name="password"
                class="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md  focus:ring-1"
                placeholder="password"
            />
        </label>
    </form>
    <div class=" font-bold my-2">Или...</div>
    <div class=" h-12  border flex items-center justify-center ">
        <div class="  w-8 h-8 mx-2 ">
            <Lichess />
        </div>
        <div class="mr-2">Войти с помощью lichess.org</div>
    </div>
    <!-- <div class="">Заполните все поля</div> -->
</div>
