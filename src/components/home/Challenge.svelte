<script lang="ts">
  import Select from "$components/common/Select.svelte";
  import Table from "$components/common/Table.svelte";
  import Palleter from "$components/common/Palleter.svelte";
  import type { ChallengeTableRecord } from "$types/home/ChallengeTableRecords";
  import type { PalleterLi } from "$types/common/palleter";
  import { Cog, Code, Library, Database } from "svelte-hero-icons";
  import Tabs from "$components/common/Tabs.svelte";
  import { challengeTab } from "$store/home/challengeTab";
  import type { GetChallenge } from "$types/home/Challenge";
  import type { ChallengeTab } from "$types/home/tab";
  import { listOfChallenges } from "$store/home/challenges";
  import { onDestroy, onMount } from "svelte";
  import { page } from "$app/stores";
  import { socket } from "$store/sockets/socket";
  import { goto } from "$app/navigation";
  import { record } from "zod";
  import Badge from "$components/common/Badge.svelte";
  import Filters from "./Filters.svelte";
  // import { page } from "$app/stores";

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
    // {
    //   title: "Произвольный контроль",
    //   description: "",
    //   bg: "bg-green-500",
    //   svg: Database,
    //   onClick: () => {},
    // },
    // {
    //   title: "Матч с другом",
    //   description: "Ваш друг может будет принять вызов по ссылке или напрямую",
    //   bg: "bg-green-500",
    //   svg: Database,
    //   onClick: () => {},
    // },
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
          goto(`/game/${challenge.socketId}`);
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
            goto(`/game/${challenge.socketId}`);
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
            goto(`/game/${challenge.socketId}`);
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
    $socket?.emit("challenge:cancel");
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
<div class="mt-2">
  <Filters />
</div>

<div class=" my-2" />
<div class=" grid w-full  grid-cols-2 gap-x-4 ">
  <div class=" w-full   ">
    <!-- <div class=" flex w-40 bg-white">
      <div class=" ">Нет фильтров</div>
      <div class="flex items-center justify-center bg-green-100 ">з</div>
    </div> -->

    <Palleter records={palleterRecords} />
  </div>
  <div class=" w-full ">
    <!-- <Tabs currentTab={$challengeTab} {tabs} /> -->
    <Table {titles} {records} onClickPagination={() => {}} count={10} />
  </div>
</div>
