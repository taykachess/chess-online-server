<script lang="ts">
  import { browser } from "$app/environment";
  import { page } from "$app/stores";
  import { info } from "$store/game/info";
  import { socket } from "$store/sockets/socket";

  let offeredDraw: string;
  if (browser) {
    $socket.on("game:offerDraw", ({ username, ply }) => {
      console.log("draw offered", { username, ply });
      $info.lastOfferDraw = { username, ply };
    });
  }

  function offerDraw() {
    $socket.emit("game:drawOffer", { gameId: $page.params.id });
  }

  function acceptDraw() {
    $socket.emit("game:drawAccept", { gameId: $page.params.id });
  }

  function resign() {
    $socket.emit("game:resign", { gameId: $page.params.id });
  }
  function stringResult(result: "1-0" | "0.5-0.5" | "0-1" | "*" | "+-" | "-+") {
    switch (result) {
      case "1-0": {
        return "Белые выиграли";
      }
      case "0-1": {
        return "Черные выиграли";
      }
      case "0.5-0.5": {
        return "Ничья";
      }
    }
  }
  //   $: textResult =
</script>

{$info?.result}
<div class=" mt-2 text-center ">
  {#if $info?.result != "*"}
    <div class="  font-semibold text-black">
      {stringResult($info?.result)}
    </div>
  {:else}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- <div class="">
      {$info.ply}
      {JSON.stringify($info.lastOfferDraw)}
    </div> -->
    <!-- && $info.lastOfferDraw.username == $page.data.user?.username && $info.lastOfferDraw.ply > $info.ply - 2 -->
    {#if $info.role}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- {#if !$info.lastOfferDraw || $info.lastOfferDraw.username != $page.data.user?.username}
        <div on:click={offerDraw} class="">Предложить ничью</div>
      {/if} -->

      {#if $info.lastOfferDraw && $info.lastOfferDraw.ply > $info.ply - 2 && $info.lastOfferDraw.username != $page.data.user?.username}
        <div on:click={acceptDraw} class="">Принять ничью</div>
      {:else if !$info.lastOfferDraw || $info.lastOfferDraw.username != $page.data.user?.username}
        <div on:click={offerDraw} class="">Предложить ничью</div>
      {/if}
    {/if}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div on:click={resign} class=" cursor-pointer ">Сдаться</div>
  {/if}
</div>
