<script lang="ts">
  import { onDestroy, onMount, tick } from "svelte";

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
  import ChallengeList from "./ChallengeList.svelte";
  import ChallengeCreateFast from "./ChallengeCreateFast.svelte";
  import ChallengeMatchFriend from "./ChallengeMatchFriend.svelte";
  import ChallengeSendPrivate from "$components/dialogs/Forms/ChallengeSendPrivate.svelte";
  import MatchSendPrivate from "$components/dialogs/Forms/MatchSendPrivate.svelte";

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
    await tick();
    await getInitialChallenges();
    $socket.emit("challenge:subscribe");
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

<div class=" my-2" />
<div class=" grid sm:w-full  sm:grid-cols-6 sm:gap-x-4  ">
  <!-- <div class="w-full sm:col-span-2 ">
    <ChallengeGrid />
  </div> -->
  <div class=" sm:col-span-6 ">
    <div class="my-4 flex justify-between">
      <ChallengeCreateFast />
      <MatchSendPrivate />
      <ChallengeSendPrivate />
      <!-- <ChallengeMatchFriend /> -->
    </div>
  </div>
  <div class="sm:col-span-3 sm:mt-4 ">
    <ChallengeList bind:challenges={$listOfChallenges.challenges} />
  </div>
</div>
