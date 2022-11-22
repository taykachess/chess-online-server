<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import { page } from "$app/stores";
  import { socket } from "$store/sockets/socket";
  import { filters, listOfChallenges } from "$store/home/challenges";

  import Table from "$components/common/Table.svelte";
  import Select from "$components/common/Select.svelte";
  import ChallengeGrid from "$components/home/ChallengeGrid.svelte";

  import type { GetChallenge } from "$types/challenge";
  import type { ChallengeTableRecord } from "$types/challenge";
  import { browser } from "$app/environment";
  import Badge from "$components/common/Badge.svelte";

  const titles = ["Игрок", "Рейтинг", "Контроль"];

  async function getAllChallenges() {
    return fetch(`/api/challenge/getAll`, {
      method: "GET",
    });
  }

  async function getCountAllChallenges() {
    return fetch(`/api/challenge/count`, {
      method: "GET",
    });
  }

  async function getInitialChallenges() {
    const [challengesData, countData] = await Promise.all([
      getAllChallenges(),
      getCountAllChallenges(),
    ]);
    const challengesJSON = await challengesData.json();
    const count: number = await countData.json();
    const challenges: any[] = [];
    for (const property in challengesJSON) {
      challenges.push(challengesJSON[property]);
    }
    $listOfChallenges.challenges = challenges;
    $listOfChallenges.count = count;
  }

  function createChallengeRecords(
    challenge: GetChallenge[] | null
  ): ChallengeTableRecord[] {
    const arrayRecords: ChallengeTableRecord[] = [];
    if (!challenge) return [];
    challenge.forEach((challenge) => {
      arrayRecords.push({
        // link: `/tournament/${challenge.}`,
        onClick: () => {
          $socket.emit("challenge:accept", { username: challenge.user });
        },
        registered: challenge.user === $page.data?.user?.username,
        records: [challenge.user, `${challenge.rating}`, challenge.control],
      });
    });

    return arrayRecords;
  }

  let records: ChallengeTableRecord[] = [];

  onMount(async () => {
    await getInitialChallenges();
    $socket.emit("challenge:subscribe", (challenges: any) => {
      console.log(challenges);
    });
    records = createChallengeRecords($listOfChallenges.challenges);

    $socket.on("challenge:created", (challenge) => {
      const index = $listOfChallenges.challenges.findIndex(
        (chal) => chal.user == challenge.user
      );
      if (index === -1) {
        $listOfChallenges.challenges?.push(challenge);
        $listOfChallenges.challenges = $listOfChallenges.challenges;
        records.push({
          onClick: () => {
            $socket.emit("challenge:accept", { username: challenge.user });
          },
          registered: challenge.user === $page.data?.user?.username,
          records: [challenge.user, `${challenge.rating}`, challenge.control],
        });
        records = records;
      } else {
        const index2 = records.findIndex(
          (record) =>
            record.records[0] == $listOfChallenges.challenges[index]?.user
        );
        records[index2] = {
          onClick: () => {
            $socket.emit("challenge:accept", { username: challenge.user });
          },
          registered: challenge.user === $page.data?.user?.username,
          records: [challenge.user, `${challenge.rating}`, challenge.control],
        };
        $listOfChallenges.challenges[index] = challenge;
      }
    });

    $socket.on("challenge:deleted", ({ socketId }) => {
      const index = $listOfChallenges.challenges.findIndex(
        (chal) => chal.socketId == socketId
      );
      if (index !== -1) {
        const index2 = records.findIndex(
          (record) =>
            record.records[0] == $listOfChallenges.challenges[index]?.user
        );
        if (index2 !== -1) {
          records.splice(index2, 1);
          records = records;
          console.log(records);
        }
        $listOfChallenges.challenges.splice(index, 1);
      }

      $listOfChallenges.challenges = $listOfChallenges.challenges;
    });
  });

  onDestroy(() => {
    $socket?.removeListener("challenge:created");
    $socket?.removeListener("challenge:deleted");

    $listOfChallenges = { count: 0, challenges: [] };
  });
  let count = 0;
  $: {
    if (browser) {
      count = count + 1;
      if (count == 1) {
      } else {
        console.log($filters);
        localStorage.setItem("challengeFilters", JSON.stringify($filters));
      }
    }
  }
</script>

<div class=" my-4 flex items-end ">
  {#if $filters}
    <Select
      bind:value={$filters.rating[0]}
      options={[
        { name: "-ထ", value: -500 },
        { name: "-100 ", value: -100 },
        { name: "-200", value: -200 },
        { name: "-300", value: -300 },
        { name: "-400", value: -400 },
      ]}
      color={{
        bg: "bg-pink-100 rounded-none rounded-l",
        text: "text-pink-800",
      }}
    />
    <Badge
      title={`Ваш рейтинг`}
      color={{ text: "text-slate-700 py-0.5 rounded-none", bg: "bg-white" }}
    />
    <Select
      bind:value={$filters.rating[1]}
      options={[
        { name: "+ထ", value: 500 },
        { name: "+100", value: 100 },
        { name: "+200", value: 200 },
        { name: "+300", value: 300 },
        { name: "+400", value: 400 },
      ]}
      color={{
        bg: "bg-green-100 rounded-none rounded-r",
        text: "text-green-800",
      }}
    />
  {/if}
</div>

<div class=" my-2" />
<div class=" grid sm:w-full  sm:grid-cols-6 sm:gap-x-4  ">
  <div class="w-full sm:col-span-2 ">
    <ChallengeGrid />
  </div>
  <div class=" mt-2  sm:col-span-4 sm:mt-0 ">
    <Table {titles} {records} onClickPagination={() => {}} count={10} />
  </div>
</div>
