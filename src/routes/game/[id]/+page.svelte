<script lang="ts">
  import { browser } from "$app/environment";
  import { beforeNavigate } from "$app/navigation";
  import { page } from "$app/stores";

  import Chess from "$components/game/Chess.svelte";

  import { requestId } from "$store/game/requestId";
  import { socket } from "$store/sockets/socket";
  import type { GetGame } from "$types/game";

  import type { PageData } from "./$types";
  // export let data: PageData;

  let game: GetGame;

  if (browser)
    $socket.emit("game:get", { gameId: $page.params.id }, (gameFromServer) => {
      game = gameFromServer;
    });
  // console.log("game", data.game);

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

{#if game}
  <div class="chess-bg flex h-screen flex-col items-center justify-center  ">
    <Chess bind:game />
  </div>
{/if}

<style>
</style>
