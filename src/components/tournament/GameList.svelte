<script lang="ts">
  import { beforeNavigate, goto } from "$app/navigation";
  import { page } from "$app/stores";
  import BadgeTitle from "$components/common/BadgeTitle.svelte";
  import PulseAnimatedElement from "$components/common/PulseAnimatedElement.svelte";
  import { socket } from "$store/sockets/socket";
  import { pairings } from "$store/tournament/pairings";
  import { selectedRound } from "$store/tournament/swiss/selectedRound";
  import { tournament } from "$store/tournament/tournament";
  import { tournamentTv } from "$store/tournament/tournamentTv";
  import type { GetGame } from "$types/game";
  import { Chess } from "cm-chess-ts";
  import { onMount, tick } from "svelte";

  const fetchPairings = (round: number) => {
    return fetch(`/api/tournament/${$page.params.id}/pairings?round=${round}`);
  };

  function subOnGameResult() {
    $socket.on("tournament:gameOver", async ({ gameId, result, w, b }) => {
      const index = $pairings.findIndex((game) => game[3] == gameId);
      if (index != -1) $pairings[index][2] = result;

      const indexW = $tournament.players.findIndex(
        (player) => player.id == w.id
      );
      const indexB = $tournament.players.findIndex(
        (player) => player.id == b.id
      );

      if (indexW != -1) {
        $tournament.players[indexW].matches.push([
          {
            id: b.id,
            rating: b.rating,
            title: b.title,
            res: b.res,
          },
          gameId,
        ]);
        $tournament.players[indexW].score =
          $tournament.players[indexW].score + +b.res;
      }

      if (indexB != -1) {
        $tournament.players[indexB].matches.push([
          {
            id: w.id,
            rating: w.rating,
            title: w.title,
            res: w.res,
          },
          gameId,
        ]);
        $tournament.players[indexB].score =
          $tournament.players[indexB].score + +w.res;
      }
      await tick();
      // $tournament.players = $tournament.players;
    });
  }

  let lastTime = 0;
  let requestId: number;
  function playClock(time: number) {
    if (lastTime) {
      const delta = time - lastTime;
      // @ts-ignore
      if ($tournamentTv.chess.turn() == "w") {
        $tournamentTv.game.time[0] = $tournamentTv.game.time[0] - delta;
      } else {
        $tournamentTv.game.time[1] = $tournamentTv.game.time[1] - delta;
      }
    }
    lastTime = time;
    requestId = window.requestAnimationFrame(playClock);
  }

  function startClock() {
    requestId = window.requestAnimationFrame(playClock);
  }

  function stopClock() {
    window.cancelAnimationFrame(requestId);
  }

  onMount(async () => {
    console.log("onMount");

    // if (!$tournamentTv) return;

    // setTournamentTv($tournamentTv.game, $tournamentTv.tv);

    // $socket.on("tournament:tv", ({ game }) => {
    //   setTournamentTv(game, game.id);
    // });
  });

  function setTournamentTv(game: GetGame, gameId: string) {
    if (
      $tournamentTv.game &&
      $tournamentTv.game.id &&
      $tournamentTv.game.result == "*"
    )
      $socket.emit("game:leave", { gameId });

    $tournamentTv.tv = gameId;
    $tournamentTv.game = game;
    $tournamentTv.chess = new Chess();
    $tournamentTv.chess.loadPgn(game.pgn);
    $tournamentTv.board?.setPosition($tournamentTv.chess.fen());
    if (game.result == "*") {
      // $socket.removeListener("game:move");
      $tournamentTv.game.id = gameId;
      startClock();

      $socket.emit("game:sub", { gameId });
      $socket.on("game:move", (move) => {
        $tournamentTv.chess?.move(move);
        $tournamentTv.board?.setPosition(
          $tournamentTv.chess ? $tournamentTv.chess.fen() : "start"
        );
      });
    }
  }

  async function getGame(gameId: string) {
    const data = await fetch(`/api/game/${gameId}`);
    const game = (await data.json()) as GetGame;
    if (!game) return;
    stopClock();

    setTournamentTv(game, gameId);
  }

  onMount(async () => {
    $selectedRound = $tournament.currentRound;
    subOnGameResult();
  });

  beforeNavigate(() => {
    $socket.removeListener("tournament:pairings");
  });
</script>

<div class="  rounded-lg  border shadow-lg ">
  <div class=" flex justify-center  border-b  ">
    <div
      class="w-1/7 flex h-10 w-full select-none items-center justify-center rounded-tl-lg  bg-slate-800  px-2 text-slate-200"
    >
      Тур
    </div>
    {#each Array($tournament.rounds) as round, index}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div
        on:click={async () => {
          const data = await fetchPairings(index);
          const matches = await data.json();

          // console.log("pairings", pairings);
          $pairings = matches;

          $selectedRound = index + 1;
        }}
        class=" relative  flex w-full   items-center justify-center {index +
          1 ==
        $tournament.rounds
          ? 'rounded-tr-lg'
          : ''}  border-l    bg-white  {$tournament.currentRound <= index
          ? 'bg-slate-100 text-slate-300'
          : 'hover:bg-sky-100 cursor-pointer'} {$selectedRound == index + 1
          ? 'bg-sky-100 text-sky-700 '
          : ''} "
      >
        {index + 1}

        {#if $selectedRound != $tournament.currentRound && $tournament.currentRound == index + 1 && $tournament.status == "running"}
          <div class=" absolute -top-1 z-20  ">
            <PulseAnimatedElement />
          </div>
        {/if}
      </div>
    {/each}
  </div>

  <!-- {JSON.stringify($tournamentTv.tv)} -->
  {#each $pairings as game, index}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      on:click={() => {
        if (game[1] && game[3]) {
          getGame(game[3]);
        }
        // goto(`/game/${game[3]}`);
        // goto()
      }}
      class="grid grid-cols-12   {game[3] == $tournamentTv.tv
        ? 'bg-sky-100'
        : index % 2
        ? 'bg-slate-50 hover:bg-slate-100'
        : 'bg-white hover:bg-slate-100'} cursor-pointer text-center text-sm  "
    >
      <div
        class=" col-span-1 flex items-center justify-center border-r border-gray-300 font-medium text-gray-700"
      >
        {#if game[3] == $tournamentTv.tv}
          <!-- prettier-ignore -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"  viewBox="0 0 448 512"><path d="M64 96v64h64V96H64zM256 96H192v64h64V96zM192 416h64v-64H192V416zM64 416h64v-64H64V416zM64 224v64h64V224H64zM384 288V224h-64v64H384zM384 416v-64h-64v64H384zM320 160h64V96h-64V160zM256 224h64V160h-64V224zM384 32H64C28.8 32 0 60.8 0 96v320c0 35.2 28.8 64 64 64h320c35.2 0 64-28.8 64-64V96C448 60.8 419.2 32 384 32zM400 416c0 8.674-7.326 16-16 16H64c-8.672 0-16-7.326-16-16V96c0-8.674 7.328-16 16-16h320c8.674 0 16 7.326 16 16V416zM192 160H128v64h64V160zM192 288h64V224H192V288zM128 288v64h64V288H128zM256 352h64V288h-64V352z"/></svg>
        {:else}
          <span class="">
            {index + 1}
          </span>
        {/if}
      </div>
      <div class=" col-span-5 flex border-gray-300   px-4 py-2 text-gray-700">
        <div class=" mx-auto">
          {#if game[0].title}
            <BadgeTitle title={game[0].title} />
          {/if}
          <span class=" font-medium text-slate-800">{game[0].id}</span>
          <span class=" text-xs text-orange-700"> {game[0].rating}</span>
        </div>
        <div class=" ml-auto">{game[0].score}</div>
      </div>
      <div
        class=" col-span-1 flex items-center justify-center border-x border-gray-300 font-medium text-gray-700"
      >
        {game[2] == "0.5-0.5" ? "=" : game[2] == "+-" ? "Bye" : game[2]}
      </div>
      <div class=" col-span-5 flex border-gray-300   px-4 py-2 text-gray-700">
        {#if game[1]}
          <div class="">{game[1]?.score}</div>
          <div class=" mx-auto">
            {#if game[1]?.title}
              <BadgeTitle title={game[1].title} />
            {/if}
            <span class=" font-medium text-slate-800">{game[1]?.id}</span>
            <span class=" text-xs text-orange-700"> {game[1]?.rating}</span>
          </div>
        {/if}
      </div>
    </div>
  {/each}
</div>
