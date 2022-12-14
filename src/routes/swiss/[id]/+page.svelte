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
  import Trophy from "$components/tournament/Trophy.svelte";
  import { socket } from "$store/sockets/socket";
  import { pairings } from "$store/tournament/pairings";
  import { selectedRound } from "$store/tournament/swiss/selectedRound";
  import { tournament } from "$store/tournament/tournament";
  import { tournamentTv } from "$store/tournament/tournamentTv";
  import type { GetGame } from "$types/game";
  import type {
    GetTournament,
    MatchSwiss,
    TournamentTv,
  } from "$types/tournament";
  import { Chess } from "cm-chess-ts";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";
  export let data: PageData;

  function setBye({ id }: { id: string }) {
    const indexW = $tournament.players.findIndex((player) => player.id == id);

    if (indexW != -1) {
      $tournament.players[indexW].matches.push([
        {
          id: "Bye",
          rating: 0,
          // title: b.title,
          res: 1,
        },
        "",
      ]);
      $tournament.players[indexW].score = $tournament.players[indexW].score + 1;
    }
  }

  $tournament = data.swiss as GetTournament;

  $tournamentTv = data.tournamentTv as TournamentTv;
  $pairings = data.matches as MatchSwiss[];
  console.log($tournamentTv);
  if (browser)
    if ($tournamentTv) {
      $tournamentTv.chess = new Chess();
      // @ts-ignore
      $tournamentTv.chess.loadPgn($tournamentTv.game.pgn);
    }

  let lastTime = 0;
  let requestId: number;
  function playClock(time: number) {
    if (lastTime) {
      const delta = time - lastTime;
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

  function setTournamentTv(game: GetGame, gameId: string) {
    if (
      $tournamentTv &&
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

  console.log($tournamentTv);

  onMount(() => {
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

    $socket.on("tournament:finish", () => {
      $tournament.status = "finished";
      console.log("tournament finnished");
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

    $socket.on("tournament:tv", ({ game }) => {
      console.log("tournamentTv", $tournamentTv);

      // @ts-ignore
      $tournamentTv = {};
      // @ts-ignore
      setTournamentTv(game, game.id);
    });
    if ($tournamentTv) {
      console.log("tournamentTv", $tournamentTv);
      setTournamentTv($tournamentTv.game, $tournamentTv.tv);
    }
  });

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

<div class=" mx-auto max-w-6xl">
  <div class=" mt-4 grid grid-cols-2 space-x-8 ">
    <TournamentDescription />
    {#if $tournament.status == "registration" && $tournament.participants}
      <TournamentPlayersRegister bind:players={$tournament.participants} />
    {:else}
      <TournamentSwissPlayersStanding />
    {/if}
  </div>
  <div class="my-8 grid grid-cols-5 space-x-8">
    {#if $tournament.rounds && $pairings}
      <div class="  col-span-3">
        <GameList />
      </div>
      <div class=" col-span-2 ">
        <ChessTv />
      </div>
    {/if}
  </div>
</div>
