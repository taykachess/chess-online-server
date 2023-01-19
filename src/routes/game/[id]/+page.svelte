<script lang="ts">
  import { browser } from "$app/environment";
  import { beforeNavigate } from "$app/navigation";
  import { page } from "$app/stores";

  import Chess from "$components/game/Chess.svelte";
  import { match } from "$store/game/match";

  import { requestId } from "$store/game/requestId";
  import { socket } from "$store/sockets/socket";
  import type { GetGame } from "$types/game";
  import type { Match } from "$types/match";

  import type { PageData } from "./$types";
  // export let data: PageData;

  let game: GetGame;

  if (browser)
    $socket.emit("game:get", { gameId: $page.params.id }, (gameFromServer) => {
      game = gameFromServer;
      if (game.matchId) getMatch(game.matchId);
    });
  // console.log("game", data.game);

  function removeSocketListerners() {
    $socket.removeListener("game:move");
    $socket.removeListener("game:offerDraw");
    $socket.removeListener("game:declineDraw");
  }

  async function getMatch(id: string) {
    const matchData = await fetch(`/api/match/get/${id}`);
    const matchFromServer = (await matchData.json()) as Match;

    console.log("got match");
    $match = matchFromServer;
    $match.id = id;
    if ($match.status == "running") $socket.emit("match:subscribe", id);

    if ($match.type == "time") {
      if (!$match.resultsData) $match.resultsData = [];

      if (!$socket.hasListeners("match:private:gameOver"))
        $socket.on("match:private:gameOver", (res) => {
          if (!$match) return;
          $match.resultsData.push(res.res);
          $match.resultsData = $match.resultsData;
          if (res.curr) $match.currentGame = res.curr;
          if (res.stage) $match.stage = res.stage;
          if (res.tsmp) $match.tsmp = res.tsmp;
        });

      if (!$socket.hasListeners("match:private:ended"))
        $socket.on("match:private:ended", () => {
          $match.status = "finished";
        });
    }
  }

  beforeNavigate(({ willUnload, type, to, from }) => {
    if (willUnload) {
      console.log("Unload", willUnload);
    }
    window.cancelAnimationFrame($requestId);
    if (to?.route.id == from?.route.id && to?.params?.id != from?.params?.id) {
      $socket.removeListener("game:move");
    } else {
      if ($match && $match.id && $match.status == "running")
        $socket.emit("match:unsub", $match.id);

      removeSocketListerners();
    }
  });
</script>

{#if game}
  <div class="chess-bg mt-8 flex flex-col items-center justify-center  ">
    <Chess bind:game />
  </div>
{/if}

<style>
</style>
