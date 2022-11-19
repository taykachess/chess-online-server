<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  import Header from "$components/layout/Header.svelte";

  import { socket } from "$store/sockets/socket";

  import "../app.postcss";

  import type { LayoutData } from "./$types";

  export let data: LayoutData;

  onMount(() => {
    $socket.on("game:started", ({ gameId }) => {
      goto(`/game/${gameId}`);
    });
  });
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class=" w-full">
  <Header games={data.gameIds} />
</div>
<main class="  text-slate-500  ">
  <slot />
</main>

<div
  class="absolute inset-x-0 top-[-5rem] -z-10 transform-gpu overflow-hidden blur-3xl  "
>
  <svg
    class=""
    viewBox="0 0 1155 678"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="url(#45de2b6b-92d5-4d68-a6a0-9b9b2abad533)"
      fill-opacity=".3"
      d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
    />
    <defs>
      <linearGradient
        id="45de2b6b-92d5-4d68-a6a0-9b9b2abad533"
        x1="1155.49"
        x2="-78.208"
        y1=".177"
        y2="474.645"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#9089FC" />
        <stop offset="1" stop-color="#FF80B5" />
      </linearGradient>
    </defs>
  </svg>
</div>

<style>
</style>
