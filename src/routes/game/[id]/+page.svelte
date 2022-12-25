<script lang="ts">
  import { browser } from "$app/environment";
  import { afterNavigate, beforeNavigate } from "$app/navigation";
  import { page } from "$app/stores";

  import Chess from "$components/game/Chess.svelte";
  import { board } from "$store/game/board";

  import { info } from "$store/game/info";
  import { requestId } from "$store/game/requestId";
  import { socket } from "$store/sockets/socket";
  import { set } from "zod";

  import type { PageData } from "./$types";
  export let data: PageData;

  console.log("game", data.game);

  function removeSocketListerners() {
    $socket.removeListener("game:move");
    $socket.removeListener("game:offerDraw");
    $socket.removeListener("game:declineDraw");
  }

  beforeNavigate(({ willUnload, type, to, from }) => {
    if (willUnload) {
      console.log("Unload", willUnload);
    }
    window.cancelAnimationFrame($requestId);
    if (to?.route.id == from?.route.id && to?.params?.id != from?.params?.id) {
      $socket.removeListener("game:move");
    } else {
      removeSocketListerners();
    }
  });
</script>

<div class="chess-bg flex h-screen flex-col items-center justify-center  ">
  <Chess bind:game={data.game} />
</div>

<style>
</style>
