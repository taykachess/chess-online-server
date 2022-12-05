<script lang="ts">
  import { browser } from "$app/environment";
  import { afterNavigate, beforeNavigate } from "$app/navigation";
  import { page } from "$app/stores";

  import Chess from "$components/game/Chess.svelte";
  import { board } from "$store/game/board";

  import { info } from "$store/game/info";
  import { socket } from "$store/sockets/socket";
  import { set } from "zod";

  import type { PageData } from "./$types";
  export let data: PageData;

  function removeSocketListerners() {
    $socket.removeListener("game:end");
    $socket.removeListener("game:move");
    $socket.removeListener("game:offerDraw");
    $socket.removeListener("game:declineDraw");
  }

  // if (browser) {
  //   $socket.emit("game:sub", { gameId: $page.params.id });
  // }

  beforeNavigate(({ willUnload, type, to, from }) => {
    if (willUnload) {
      console.log("Unload", willUnload);
    }
    window.cancelAnimationFrame($info?.requestId);
    // removeSocketListerners();
    // console.log(to, from);

    if (to?.route.id == from?.route.id && to?.params?.id != from?.params?.id) {
      $socket.removeListener("game:end");
      $socket.removeListener("game:move");
    } else {
      removeSocketListerners();
      // if (to?.params?.id)
      //   $socket.emit("game:leave", { gameId: $page.params.id });
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

<div class="chess-bg flex h-screen flex-col items-center justify-center  ">
  <Chess game={data.game} />
</div>

<style>
</style>
