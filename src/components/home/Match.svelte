<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import { page } from "$app/stores";
  import { socket } from "$store/sockets/socket";
  import { listOfChallenges } from "$store/home/challenges";

  import Table from "$components/common/Table.svelte";
  import Select from "$components/common/Select.svelte";
  import ChallengeGrid from "$components/home/ChallengeGrid.svelte";

  import type { GetChallenge } from "$types/challenge";
  import type { ChallengeTableRecord } from "$types/challenge";

  const titles = ["Игрок", "Рейтинг", "Контроль", "Партий"];

  async function getAllChallenges() {
    return fetch(`/api/challenge/getAll`);
  }

  async function getCountAllChallenges() {
    return fetch(`/api/challenge/count`);
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
    <ChallengeGrid />
  </div>
  <div class=" mt-2  sm:col-span-4 sm:mt-0 ">
    <Table {titles} {records} onClickPagination={() => {}} count={10} />
  </div>
</div>
