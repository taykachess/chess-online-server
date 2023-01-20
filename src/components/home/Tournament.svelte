<script lang="ts">
  import { page } from '$app/stores'
  import Tabs from '$components/common/Tabs.svelte'
  import { listOfTournaments } from '$store/home/tournaments'
  import { tournamentTab } from '$store/home/tournamentTab'

  import type { TournamentTable } from '$types/tournament'
  import TournamentCreateButton from './TournamentCreateButton.svelte'

  import TournamentList from './TournamentList.svelte'

  async function getAllTournaments({ page, register, created }: { page: number; register?: 'yes'; created?: 'yes' }) {
    return fetch(`/api/tournament/getAll?page=${page}&register=${register}&created=${created}`, {
      method: 'GET',
    })
  }

  async function getCountAllTournaments({ register, created }: { register?: 'yes'; created?: 'yes' }) {
    return fetch(`/api/tournament/count?register=${register}&created=${created}`, {
      method: 'GET',
    })
  }

  async function onClickPagination(page: number) {
    const response = await getAllTournaments({ page })
    const tournaments: TournamentTable[] = await response.json()
    $listOfTournaments.tournaments = tournaments
  }

  async function onClickPaginationRegistered(page: number) {
    const response = await getAllTournaments({ page, register: 'yes' })
    const tournaments: TournamentTable[] = await response.json()
    $listOfTournaments.tournaments = tournaments
  }

  async function onClickPaginationMy(page: number) {
    const response = await getAllTournaments({ page, created: 'yes' })
    const tournaments: TournamentTable[] = await response.json()
    $listOfTournaments.tournaments = tournaments
  }

  async function getInitialTournaments() {
    const [tournamentsData, countData] = await Promise.all([getAllTournaments({ page: 1 }), getCountAllTournaments({})])
    const tournaments: TournamentTable[] = await tournamentsData.json()
    const count: number = await countData.json()
    $listOfTournaments.tournaments = tournaments
    $listOfTournaments.count = count
  }

  async function getInitialRegisteredTournaments() {
    const [tournamentsData, countData] = await Promise.all([getAllTournaments({ page: 1, register: 'yes' }), getCountAllTournaments({ register: 'yes' })])
    const tournaments: TournamentTable[] = await tournamentsData.json()
    const count: number = await countData.json()
    $listOfTournaments.tournaments = tournaments
    $listOfTournaments.count = count
  }

  async function getInitialMyTournaments() {
    const [tournamentsData, countData] = await Promise.all([getAllTournaments({ page: 1, created: 'yes' }), getCountAllTournaments({ created: 'yes' })])
    const tournaments: TournamentTable[] = await tournamentsData.json()
    const count: number = await countData.json()
    $listOfTournaments.tournaments = tournaments
    $listOfTournaments.count = count

    console.log(count)
  }

  $: isAdmin = $page?.data?.user?.roles.some((role) => role == 'ADMIN')
  // $: records = createTournamentRecords($listOfTournaments.tournaments);

  if ($tournamentTab == 'all') {
    getInitialTournaments()
  } else if ($tournamentTab == 'IRegistered') {
    getInitialRegisteredTournaments()
  } else if ($tournamentTab == 'ICreated') {
    getInitialMyTournaments()
  }
</script>

<!-- {isAdmin ? ' grid grid-cols-2 gap-6 ' : ''}  -->
<!-- {#if isAdmin}
    <TournamentGrid />
  {/if} -->
<div class=" flex flex-col">
  <Tabs
    bind:currentTab={$tournamentTab}
    tabs={[
      { active: 'all', title: 'Турниры', load: getInitialTournaments },
      {
        active: 'IRegistered',
        title: 'Зарегестрирован',
        load: getInitialRegisteredTournaments,
        disabled: $page.data?.user ? false : true,
      },
      {
        active: 'ICreated',
        title: 'Созданные',
        load: getInitialMyTournaments,
        disabled: !isAdmin,
      },
    ]}
  />

  {#if $tournamentTab == 'ICreated'}
    <TournamentCreateButton />
  {/if}

  <div class=" mt-4">
    {#if $listOfTournaments.tournaments}
      <TournamentList
        tournaments={$listOfTournaments.tournaments}
        onClickPagination={$tournamentTab === 'all' ? onClickPagination : $tournamentTab === 'IRegistered' ? onClickPaginationRegistered : onClickPaginationMy}
        count={$listOfTournaments.count}
      />
    {/if}
  </div>
</div>
