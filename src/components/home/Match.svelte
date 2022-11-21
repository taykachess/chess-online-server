<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import { page } from "$app/stores";
  import { socket } from "$store/sockets/socket";

  import Table from "$components/common/Table.svelte";
  import Select from "$components/common/Select.svelte";
  import ChallengeGrid from "$components/home/ChallengeGrid.svelte";

  import type { GetChallenge } from "$types/challenge";
  import type { ChallengeTableRecord } from "$types/challenge";
  import type { GetMatch } from "$types/match";
  import { listOfMatches } from "$store/home/match";
  import MatchGrid from "./MatchGrid.svelte";

  const titles = ["Игрок", "Рейтинг", "Контроль", "Партий"];

  async function getAllMatches() {
    return fetch(`/api/match/getAll`);
  }

  async function getCountAllMatches() {
    return fetch(`/api/match/count`);
  }

  async function getInitialMatches() {
    const [matchesData, countData] = await Promise.all([
      getAllMatches(),
      getCountAllMatches(),
    ]);
    const matchesJSON = await matchesData.json();
    const count: number = await countData.json();
    const matches: any[] = [];
    for (const property in matchesJSON) {
      matches.push(matchesJSON[property]);
    }
    console.log("matches", matches);
    $listOfMatches.matches = matches;
    $listOfMatches.count = count;
  }

  function createMatchesRecords(
    match: GetMatch[] | null
  ): ChallengeTableRecord[] {
    const arrayRecords: ChallengeTableRecord[] = [];
    if (!match) return [];
    match.forEach((match) => {
      arrayRecords.push({
        // link: `/tournament/${challenge.}`,
        onClick: () => {
          $socket.emit("match:accept", { username: match.user });
        },
        registered: match.user === $page.data?.user?.username,
        records: [
          match.user,
          `${match.rating}`,
          match.control,
          `${match.rounds}`,
        ],
      });
    });

    return arrayRecords;
  }

  let records: ChallengeTableRecord[] = [];

  onMount(async () => {
    await getInitialMatches();
    $socket.emit("match:subscribe", (matches: any) => {
      console.log(matches);
    });
    records = createMatchesRecords($listOfMatches.matches);

    $socket.on("match:created", (match) => {
      const index = $listOfMatches.matches.findIndex(
        (chal) => chal.user == match.user
      );
      if (index === -1) {
        $listOfMatches.matches?.push(match);
        $listOfMatches.matches = $listOfMatches.matches;
        records.push({
          onClick: () => {
            $socket.emit("challenge:accept", { username: match.user });
          },
          registered: match.user === $page.data?.user?.username,
          records: [
            match.user,
            `${match.rating}`,
            match.control,
            `${match.rounds}`,
          ],
        });
        records = records;
      } else {
        const index2 = records.findIndex(
          (record) => record.records[0] == $listOfMatches.matches[index]?.user
        );
        records[index2] = {
          onClick: () => {
            $socket.emit("match:accept", { username: match.user });
          },
          registered: match.user === $page.data?.user?.username,
          records: [
            match.user,
            `${match.rating}`,
            match.control,
            `${match.rounds}`,
          ],
        };
        $listOfMatches.matches[index] = match;
      }
    });

    $socket.on("match:deleted", ({ socketId }) => {
      const index = $listOfMatches.matches.findIndex(
        (chal) => chal.socketId == socketId
      );
      if (index !== -1) {
        const index2 = records.findIndex(
          (record) => record.records[0] == $listOfMatches.matches[index]?.user
        );
        if (index2 !== -1) {
          records.splice(index2, 1);
          records = records;
          console.log(records);
        }
        $listOfMatches.matches.splice(index, 1);
      }

      $listOfMatches.matches = $listOfMatches.matches;
    });
  });

  onDestroy(() => {
    $socket?.removeListener("match:created");
    $socket?.removeListener("match:deleted");

    $listOfMatches = { count: 0, matches: [] };
  });
</script>

<div class=" my-4 flex items-center space-x-2">
  <Select
    options={[
      { name: "Матч из 2 партий", value: 2 },
      { name: "Матч из 4 партий", value: 4 },
      { name: "Матч из 6 партий", value: 6 },
      { name: "Матч из 8 партий", value: 8 },
      { name: "Матч из 10 партий", value: 10 },
      { name: "Матч из 12 партий", value: 12 },
    ]}
    color={{ bg: "bg-red-100 ", text: "text-red-800" }}
  />
  <Select
    options={[
      { name: "<span> Любой рейтинг</span>", value: [-500, 500] },
      { name: "<span> &#177; 100 рейтинг</span>", value: [-100, 100] },
      { name: "<span> &#177; 200 рейтинг</span>", value: [-200, 200] },
      { name: "<span> &#177; 300 рейтинг</span>", value: [-300, 300] },
      { name: "<span> &#177; 400 рейтинг</span>", value: [-400, 400] },
    ]}
    color={{ bg: "bg-green-100", text: "text-green-800" }}
  />
</div>

<div class=" my-2" />
<div class=" grid sm:w-full  sm:grid-cols-6 sm:gap-x-4  ">
  <div class="w-full sm:col-span-2 ">
    <MatchGrid />
  </div>
  <div class=" mt-2  sm:col-span-4 sm:mt-0 ">
    <Table {titles} {records} onClickPagination={() => {}} count={10} />
  </div>
</div>
