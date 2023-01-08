<script lang="ts">
  import { browser } from "$app/environment";
  import { beforeNavigate } from "$app/navigation";
  import { page } from "$app/stores";
  import ChessTv from "$components/tournament/ChessTv.svelte";
  import GameList from "$components/tournament/GameList.svelte";
  import RoundRobin from "$components/tournament/RoundRobin.svelte";
  import TournamentDescription from "$components/tournament/TournamentDescription.svelte";
  import TournamentPlayersRegister from "$components/tournament/TournamentPlayersRegister.svelte";
  import TournamentSwissPlayersStanding from "$components/tournament/TournamentSwissPlayersStanding.svelte";
  import { TOURNAMENT_GAME_PREPARE_TIME } from "$sockets/variables/redisIndex";
  import { socket } from "$store/sockets/socket";
  import { pairings } from "$store/tournament/pairings";
  import { selectedRound } from "$store/tournament/swiss/selectedRound";
  import { tournament } from "$store/tournament/tournament";
  import {
    board,
    chess,
    intervalId,
    isTournamentTimerVisible,
    liveTournamentGameId,
    requestId,
    selectedTournamentGameId,
    tournamentPrepareTime,
    tournamentTv,
  } from "$store/tournament/tournamentTv";
  import type { GetGame } from "$types/game";
  import type {
    GetTournament,
    MatchSwiss,
    TournamentTv,
  } from "$types/tournament";
  import { Chess } from "cm-chess-ts";
  import { onMount, tick } from "svelte";
  import { onDestroy } from "svelte";
  import type { PageData } from "./$types";
  export let data: PageData;

  let tournamentPrepareTimeout: NodeJS.Timeout;

  function setBye({ id }: { id: string }) {
    const indexW = $tournament.players.findIndex((player) => player.id == id);

    if (indexW != -1) {
      $tournament.players[indexW].matches.push([
        {
          id: "Bye",
          rating: 0,
          // title: b.title,
          res: 1,
          color: "w",
        },
        "",
      ]);
      $tournament.players[indexW].score = $tournament.players[indexW].score + 1;
    }
  }

  $tournament = data.swiss as GetTournament;

  if (browser) {
    if (data.liveGameId) {
      $socket.emit(
        "game:get",
        { gameId: data.liveGameId },
        (gameFromServer) => {
          if (data.liveGameId) setTournamentTv(gameFromServer, data.liveGameId);
        }
      );
      $liveTournamentGameId = data.liveGameId;
      $selectedTournamentGameId = $liveTournamentGameId;
    }
  }

  // $tournamentTv = data.tournamentTv as TournamentTv;

  $pairings = data.matches as MatchSwiss[];
  if (browser)
    if ($tournamentTv) {
      $chess = new Chess();
      // @ts-ignore
      $chess.loadPgn($tournamentTv.game.pgn);
    }

  let lastTime = 0;
  // let requestId: number;

  function playClock(time: number) {
    if (lastTime) {
      const delta = time - lastTime;
      if ($chess.turn() == "w") {
        $tournamentTv.game.time[0] = $tournamentTv.game.time[0] - delta;
      } else {
        $tournamentTv.game.time[1] = $tournamentTv.game.time[1] - delta;
      }
    }
    lastTime = time;
    $requestId = window.requestAnimationFrame(playClock);
  }

  function startClock() {
    window.cancelAnimationFrame($requestId);
    $requestId = window.requestAnimationFrame(playClock);
  }

  function stopClock() {
    window.cancelAnimationFrame($requestId);
  }

  function setTournamentTv(game: GetGame, gameId: string) {
    if (
      $tournamentTv &&
      $tournamentTv.game &&
      $tournamentTv.game.id &&
      $tournamentTv.game.result == "*"
    )
      $socket.emit("game:leave", { gameId: $tournamentTv.game.id });

    if ($intervalId) clearInterval($intervalId);
    if (tournamentPrepareTimeout) clearTimeout(tournamentPrepareTimeout);
    lastTime = 0;

    $socket.removeListener("game:move");

    $tournamentTv = { game };

    $chess.loadPgn(game.pgn);
    $board.setPosition($chess.fen());

    if (game.result == "*") {
      if (!game.pgn) {
        $tournamentPrepareTime =
          game.tsmp + TOURNAMENT_GAME_PREPARE_TIME - new Date().getTime();
        if ($tournamentPrepareTime > 0) {
          $isTournamentTimerVisible = true;
          $intervalId = setInterval(() => {
            $tournamentPrepareTime -= 1000;
          }, 1000);
          tournamentPrepareTimeout = setTimeout(() => {
            startClock();
            $isTournamentTimerVisible = false;
          }, $tournamentPrepareTime);
        } else startClock();
      } else startClock();

      $tournamentTv.game.id = gameId;

      // $socket.emit("game:sub", { gameId });
      $socket.on("game:move", (move) => {
        $chess.move(move);
        $board.setPosition($chess.fen());
      });
      $socket.on("game:end", ({ newEloBlack, newEloWhite, result }) => {
        stopClock();
      });
    } else {
      $isTournamentTimerVisible = false;
    }
  }

  onMount(async () => {
    $socket.emit("tournament:subscribe", { tournamentId: $page.params.id });
    $socket.on("tournament:register", (participant) => {
      if (!$tournament.participants) return;
      $tournament.participants.push(participant);
      $tournament.participants.sort((a, b) => {
        if (a.rating > b.rating) return -1;
        if (a.rating < b.rating) return 1;
        return 0;
      });
      $tournament.participants = $tournament.participants;
    });

    $socket.on("tournament:unregister", ({ username }) => {
      const index = $tournament.participants.findIndex(
        (participant) => participant.username === username
      );
      $tournament.participants.splice(index, 1);
      $tournament.participants = $tournament.participants;
    });

    // if (!$socket.hasListeners("tournament:finish"))
    $socket.on("tournament:finish", () => {
      $tournament.status = "finished";
    });

    $socket.on("tournament:start", async ({ pairings: matches, players }) => {
      $tournament.status = "running";
      $tournament.currentRound = 1;

      $selectedRound = 1;
      $tournament.players = players;
      $pairings = matches;

      const pairBye = matches.find((pair) => !pair[1]);
      if (pairBye) setBye({ id: pairBye[0].id });
    });

    $socket.on("tournament:pairings", ({ pairings: matches }) => {
      if ($selectedRound == $tournament.currentRound) {
        $pairings = matches;
        $selectedRound = $selectedRound + 1;
      }
      $tournament.currentRound++;

      const pairBye = matches.find((pair) => !pair[1]);
      if (pairBye) setBye({ id: pairBye[0].id });
    });

    $socket.on("tournament:pause", ({ username }) => {
      const indexPausePlayer = $tournament.players.findIndex(
        (player) => player.id == username
      );
      if (indexPausePlayer != -1)
        $tournament.players[indexPausePlayer].active = false;
    });

    $socket.on("tournament:continue", ({ username }) => {
      const indexPausePlayer = $tournament.players.findIndex(
        (player) => player.id == username
      );
      if (indexPausePlayer != -1)
        $tournament.players[indexPausePlayer].active = true;
    });

    $socket.on("tournament:entry", (player) => {
      $tournament.players.push(player);
      $tournament.players = $tournament.players;
    });

    $socket.on("tournament:tv", async ({ game }) => {
      console.log("tournament:tv", game.id);
      if (!game.id) return;
      if ($selectedTournamentGameId == $liveTournamentGameId) {
        $liveTournamentGameId = game.id;
        $selectedTournamentGameId = game.id;
        $socket.emit("game:get", { gameId: game.id }, (gameFromServer) => {
          setTournamentTv(gameFromServer, game.id);
        });
      } else $liveTournamentGameId = game.id;
    });
  });

  // onDestroy(()=>{

  // })

  beforeNavigate(() => {
    $socket.removeListener("tournament:register");
    $socket.removeListener("tournament:unregister");
    $socket.removeListener("tournament:pairings");
    $socket.removeListener("tournament:start");
    $socket.removeListener("tournament:gameOver");
    $socket.removeListener("tournament:continue");
    $socket.removeListener("tournament:entry");
    $socket.removeListener("tournament:pause");

    $socket.emit("tournament:leave", { tournamentId: $page.params.id });

    if ($tournament.status == "running")
      $socket.emit("game:leave", { gameId: $selectedTournamentGameId });
  });
</script>

<!-- <div class=" mx-auto max-w-6xl  ">
  <div class=" mt-4 grid grid-cols-2  ">
    <div class="  ">
      <TournamentDescription />
      <div class=" mt-4">
        {#if $tournament.rounds && $tournament.matches}
          <GameList />
        {/if}
      </div>
    </div>
    <div class=" ml-10  ">
      {#if $tournament.status == "registration" && $tournament.participants}
        <TournamentPlayersRegister bind:players={$tournament.participants} />
      {:else}
        <ChessTv />

        <TournamentSwissPlayersStanding />
      {/if}
    </div>
  </div>
</div> -->

<!-- <div class=" mx-auto max-w-6xl  ">
  <div class=" mt-4 grid grid-cols-2  ">
    <div class="  ">
      <TournamentDescription />
      <div class=" mt-4">
        {#if $tournament.rounds && $pairings}
          <GameList />
        {/if}
      </div>
    </div>
    <div class=" ml-10  ">
      {#if $tournament.status == "registration" && $tournament.participants}
        <TournamentPlayersRegister bind:players={$tournament.participants} />
      {:else}
        <TournamentSwissPlayersStanding />
        <ChessTv />
      {/if}
    </div>
  </div>
</div> -->

<div class=" mx-5 max-w-6xl sm:mx-auto">
  <div class=" mt-4 grid sm:grid-cols-2 sm:space-x-8 ">
    <div class="  sm:mx-0">
      <TournamentDescription />
    </div>

    <div class="  mt-4 sm:mx-0 sm:mt-0">
      {#if $tournament.status == "registration" && $tournament.participants}
        <TournamentPlayersRegister bind:players={$tournament.participants} />
      {:else}
        <TournamentSwissPlayersStanding />
      {/if}
    </div>
  </div>
  <div
    class="flex flex-col-reverse sm:sticky sm:top-0 sm:mt-8 sm:grid sm:grid-cols-5 sm:space-x-8"
  >
    {#if $tournament.rounds && $pairings}
      <div class="  col-span-3">
        <GameList
          on:getGame={(event) => {
            $selectedTournamentGameId = event.detail.id;
            stopClock();
            setTournamentTv(event.detail, event.detail.id);
          }}
        />
      </div>
      <div class=" relative col-span-2 my-8 sm:my-0">
        <div class=" sm:sticky sm:top-10 ">
          <ChessTv
            on:boardMounted={() => {
              if ($tournamentTv) {
                setTournamentTv($tournamentTv.game, $liveTournamentGameId);
              }
            }}
          />
        </div>
      </div>
    {/if}
  </div>
</div>
