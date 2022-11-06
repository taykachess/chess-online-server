<script lang="ts">
  import Select from "$components/common/Select.svelte";
  import Table from "$components/common/Table.svelte";
  import Palleter from "$components/common/Palleter.svelte";
  import type { PalleterLi } from "$types/common/palleter";
  import { Cog, Code, Library, Database } from "svelte-hero-icons";
  import Tabs from "$components/common/Tabs.svelte";
  import { challengeTab } from "$store/home/challengeTab";
  import type { GetChallenge } from "$types/home/Challenge";
  import type { ChallengeTab } from "$types/home/tab";
  import { listOfChallenges } from "$store/home/challenges";
  import { onMount } from "svelte";
  // import { page } from "$app/stores";

  let palleterRecords: PalleterLi[] = [
    {
      title: "Игра ",
      description: "Ваш друг может будет принять вызов по ссылке или напрямую",
      bg: "bg-indigo-500",
      svg: Cog,
      onClick: createChallenge,
    },
    {
      title: "Матч",
      description: "Ваш друг может будет принять вызов по ссылке или напрямую",
      bg: "bg-green-500",
      svg: Library,
      onClick: () => {},
    },
    {
      title: "Игра с другом",
      description: "Ваш друг может будет принять вызов по ссылке или напрямую",
      bg: "bg-indigo-500",
      svg: Code,
      onClick: () => {},
    },
    {
      title: "Матч с другом",
      description: "Ваш друг может будет принять вызов по ссылке или напрямую",
      bg: "bg-green-500",
      svg: Database,
      onClick: () => {},
    },
  ];
  const titles = ["Игрок", "Контроль"];

  const selectCSS =
    "inline-flex items-center rounded text-slate-200 px-1 py-0.5 text-xs font-medium bg-slate-700 ml-1";
  export let records: { link: string; records: string[] }[] = [
    {
      link: "/game/2",
      records: [
        `<span>Tayka<span class="${selectCSS}">2459</span></span>`,
        "3+2",
      ],
    },
    {
      link: "/game/2",
      records: ["Tayka", "3+2"],
    },
  ];

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

  async function createChallenge() {
    console.log("Tournament");
    const response = await fetch("/api/challenge/create", {
      method: "POST",
      body: JSON.stringify({}),
      headers: {
        "content-type": "application/json",
      },
    });
  }
  async function getInitialChallenges() {
    console.log("Try to load");
    const [challengesData, countData] = await Promise.all([
      getAllChallenges(),
      getCountAllChallenges(),
    ]);
    const challenges: GetChallenge[] = await challengesData.json();
    const count: number = await countData.json();
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
  onMount(() => {
    getInitialChallenges();
  });
</script>

<div class=" my-4 flex items-center space-x-2">
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
</div>

<div class=" grid w-full max-w-7xl grid-cols-2 gap-x-4 ">
  <div class=" w-full   ">
    <Palleter records={palleterRecords} />
  </div>
  <div class=" w-full ">
    <Tabs currentTab={$challengeTab} {tabs} />
    <Table {titles} {records} onClickPagination={() => {}} count={10} />
  </div>
</div>
