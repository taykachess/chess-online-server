<script lang="ts">
  import { afterNavigate, beforeNavigate } from "$app/navigation";
  import { page } from "$app/stores";

  import Chess from "$components/game/Chess.svelte";
  import { board } from "$store/game/board";

  import { info } from "$store/game/info";
  import { socket } from "$store/sockets/socket";
  import { set } from "zod";

  function removeSocketListerners() {
    $socket.removeListener("game:end");
    $socket.removeListener("game:move");
    $socket.removeListener("game:offerDraw");
    $socket.removeListener("game:declineDraw");
  }

  beforeNavigate(({ willUnload, type, to, from }) => {
    if (willUnload) {
      console.log("Unload", willUnload);
    }
    window.cancelAnimationFrame($info?.requestId);
    removeSocketListerners();
    // console.log(to, from);

    if (to?.route.id == from?.route.id && to?.params?.id != from?.params?.id) {
      // $socket.removeListener("game:offerDraw");
      // $socket.removeListener("game:declineDraw");
    }

    // $info.chess = null;
  });

  afterNavigate(({ willUnload, from, to }) => {
    // if (to?.route.id == from?.route.id && to?.params?.id != from?.params?.id) {
    //   console.log("after nav", $info.chess.fen());
    //   setTimeout(() => {
    //     $board.setPosition($info.chess.fen());
    //   }, 2000);
    // }
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
