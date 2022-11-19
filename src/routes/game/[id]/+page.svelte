<script lang="ts">
  import { afterNavigate, beforeNavigate } from "$app/navigation";

  import Chess from "$components/game/Chess.svelte";

  import { info } from "$store/game/info";
  import { socket } from "$store/sockets/socket";

  function removeSocketListerners() {
    $socket.removeListener("game:end");
    $socket.removeListener("game:move");
    $socket.removeListener("game:offerDraw");
    $socket.removeListener("game:declineDraw");
  }

  beforeNavigate(({ willUnload, type }) => {
    console.log("type", type);
    if (willUnload) {
      console.log("Unload", willUnload);
    }
    window.cancelAnimationFrame($info?.requestId);
    removeSocketListerners();

    console.log("before nav");
    // $info.chess = null;
    console.log("Unload", willUnload);
  });

  afterNavigate(({ willUnload }) => {
    console.log("load", willUnload);
  });
</script>

<!-- {} -->
<!-- {JSON.stringify($info?.white)}
{JSON.stringify($info?.black)} -->
<div class="chess-bg flex h-screen items-center justify-center  ">
  <Chess />
</div>

<style>
  /* .chess-bg {
    background: radial-gradient(
      circle,
      rgba(30, 41, 59, 1) 0%,
      rgba(226, 232, 240, 1) 100%
    );
  } */
</style>
