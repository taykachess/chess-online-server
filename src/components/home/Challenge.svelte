<script lang="ts">
  import { Cog, Code, Library } from "svelte-hero-icons";
  import { onDestroy, onMount } from "svelte";

  import { page } from "$app/stores";
  import { socket } from "$store/sockets/socket";
  import { listOfChallenges } from "$store/home/challenges";

  import Table from "$components/common/Table.svelte";
  import Palleter from "$components/common/Palleter.svelte";
  import Filters from "./Filters.svelte";

  import type { GetChallenge } from "$types/challenge";
  import type { ChallengeTab } from "$types/frontend";
  import type { ChallengeTableRecord } from "$types/challenge";
  import type { PalleterLi } from "$types/frontend";

  let palleterRecords: PalleterLi[] = [
    {
      title: "1+0",
      description: "Рейтинг обсчитывается с коэфицентом 1",
      bg: "bg-indigo-500",
      svg: Cog,
      onClick: () => createChallenge({ control: "1+0" }),
      onDoubleClick: () => cancelChallenge(),
    },
    {
      title: "3+0",
      description: "Рейтинг обсчитывается с коэфицентом 5",
      bg: "bg-green-500",
      svg: Library,
      onClick: () => createChallenge({ control: "3+0" }),
      onDoubleClick: () => cancelChallenge(),
    },
    {
      title: "3+2",
      description: "Рейтинг обсчитывается с коэфицентом 10",
      bg: "bg-green-500",
      svg: Library,
      onClick: () => createChallenge({ control: "3+2" }),
      onDoubleClick: () => cancelChallenge(),
    },
    {
      title: "10+5",
      description: "Рейтинг обсчитывается с коэфицентом 20",
      bg: "bg-indigo-500",
      svg: Code,
      onClick: () => createChallenge({ control: "10+5" }),
      onDoubleClick: () => cancelChallenge(),
    },
  ];
  const titles = ["Игрок", "Рейтинг", "Контроль"];

  // const selectCSS =
  //   "inline-flex items-center rounded text-slate-200 px-1 py-0.5 text-xs font-medium bg-slate-700 ml-1";

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

  async function createChallenge({ control }: { control: string }) {
    $socket.emit("challenge:create", { control });
  }
  async function cancelChallenge() {
    $socket.emit("challenge:cancel");
  }
  async function getInitialChallenges() {
    console.log("Try to load");
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
    // console.log(challenges.);
    $listOfChallenges.challenges = challenges;
    $listOfChallenges.count = count;
  }

  const tabs: {
    active: ChallengeTab;
    title: string;
    load: any;
    disabled?: any;
  }[] = [
    { active: "game", title: "Игра", load: getInitialChallenges },
    {
      active: "match",
      title: "Матч",
      load: getInitialChallenges,
    },
  ];

  function createChallengeRecords(
    challenge: GetChallenge[] | null
  ): ChallengeTableRecord[] {
    console.log("Make records");
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
            console.log("sended", challenge.user);
            $socket.emit("challenge:accept", { username: challenge.user });
          },
          registered: challenge.user === $page.data?.user?.username,
          records: [challenge.user, `${challenge.rating}`, challenge.control],
        };
        $listOfChallenges.challenges[index] = challenge;
      }
    });

    $socket.on("challenge:deleted", ({ socketId }) => {
      console.log("Deleted", socketId);
      const index = $listOfChallenges.challenges.findIndex(
        (chal) => chal.socketId == socketId
      );
      console.log("index", index);
      if (index !== -1) {
        const index2 = records.findIndex(
          (record) =>
            record.records[0] == $listOfChallenges.challenges[index]?.user
        );
        console.log("index2", index2);
        if (index2 !== -1) {
          console.log(records);

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

<!-- <div class=" my-4 flex items-center space-x-2">
  <Select
    options={[{ name: "Рейтинговая", value: "rating" }]}
    color={{ bg: " bg-indigo-100", text: "text-indigo-800" }}
  />
  <Select
    options={[{ name: "<span> &#177; 300 рейтинг</span>", value: "300" }]}
    color={{ bg: "bg-green-100", text: "text-green-800" }}
  />
  <Select
    options={[{ name: "3+0", value: "3+0" }]}
    color={{ bg: "bg-red-100", text: "text-red-800" }}
  />
  <Select
    options={[
      { name: "белые/черные", value: "w/b" },
      { name: "белые", value: "w" },
      { name: "черные", value: "b" },
    ]}
    color={{ bg: "bg-cyan-100", text: "text-cyan-800" }}
  />
  <Select
    options={[{ name: "бесплатно", value: "free" }]}
    color={{ bg: "bg-yellow-100", text: "text-yellow-800" }}
  />
</div> -->
<div class="mt-2 flex justify-center sm:block">
  <Filters />
</div>

<div class=" my-2" />
<div class=" grid sm:w-full  sm:grid-cols-2 sm:gap-x-4  ">
  <div class="    w-full">
    <!-- <div class=" flex w-40 bg-white">
      <div class=" ">Нет фильтров</div>
      <div class="flex items-center justify-center bg-green-100 ">з</div>
    </div> -->

    <Palleter records={palleterRecords} />
  </div>
  <div class=" mt-2  sm:mt-0">
    <!-- <Tabs currentTab={$challengeTab} {tabs} /> -->
    <Table {titles} {records} onClickPagination={() => {}} count={10} />
  </div>
</div>
