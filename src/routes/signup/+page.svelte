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
            class="before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-gray-800 relative inline-block"
        >
            <span class="relative text-white">игру</span>
        </span>
    </div>
    <div class=" divide-y-2 w-full mt-6" />
    <form method="post" class=" w-5/12 ">
        <label class="block">
            <span
                class="after:content-['*'] after:ml-0.5 after:text-red-500 block  font-medium text-slate-700"
            >
                Почта
            </span>
            <input
                type="email"
                name="email"
                class="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md  focus:ring-1"
                placeholder="you@example.com"
                value={form?.data?.email ?? ""}
            />

            {#if form?.errors?.email}
                <span class=" text-red-500 ">{form?.errors?.email[0]}</span>
            {/if}
        </label>

        <label class="block mt-2">
            <span
                class="after:content-['*'] after:ml-0.5 after:text-red-500 block  font-medium text-slate-700"
            >
                Имя пользователя (логин)
            </span>
            <input
                type="text"
                name="username"
                class="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md  focus:ring-1"
                placeholder="username"
                value={form?.data?.username ?? ""}
            />
            <div>
                {#if form?.errors?.username}
                    <span class=" text-red-500 "
                        >{form?.errors?.username[0]}</span
                    >
                {/if}
            </div>
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
            {#if form?.errors?.password}
                <span class=" text-red-500 ">{form?.errors?.password[0]}</span>
            {/if}
        </label>
        <label class="block mt-2">
            <span
                class="after:content-['*'] after:ml-0.5 after:text-red-500 block  font-medium text-slate-700"
            >
                Подтвердите пароль
            </span>
            <input
                type="password"
                name="passwordConfirm"
                class="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md  focus:ring-1"
                placeholder="password"
            />
            {#if form?.errors?.passwordConfirm}
                <span class=" text-red-500 "
                    >{form?.errors?.passwordConfirm[0]}</span
                >
            {/if}
        </label>

        <div class="flex justify-center items-center mt-2">
            <label for="terms" class=" mr-2">
                Принимаю пользовательское
                <span class=" text-blue-600 hover:text-blue-800 cursor-pointer"
                    >соглашение</span
                > :</label
            >
            <input id="terms" name="terms" type="checkbox" checked />
        </div>

        <div class="w-full flex justify-center items-center mt-2">
            <button type="submit" class=" bg-blue-400 p-3 text-white ">
                Зарегестрироваться
            </button>
        </div>
    </form>
    <div class=" font-bold my-2">Или...</div>
    <div class=" h-12  border flex items-center justify-center ">
        <div class="  w-8 h-8 mx-2 ">
            <Lichess />
        </div>
        <div class="mr-2">Зарегестрироваться с помощью lichess.org</div>
    </div>
    <!-- <div class="">Заполните все поля</div> -->
</div>
