<script lang="ts">
  import Badge from "$components/common/Badge.svelte";
  import BadgeTitle from "$components/common/BadgeTitle.svelte";

  export let player: any;

  $: difference = Math.ceil(player.ratingNext - player.rating);
</script>

<div class="flex items-baseline text-xs font-medium text-slate-800 ">
  <div class="">
    <BadgeTitle title={player.title} />
  </div>
  <div class=" ml-1 text-base">{player.username}</div>
  <div class="ml-3 mt-1">
    <Badge
      title={`${Math.trunc(player.rating)}`}
      color={{ text: "text-slate-100", bg: "bg-slate-800" }}
    />
    {difference > 0
      ? `+${difference}`
      : difference < 0
      ? `-${difference}`
      : "0"}
  </div>
  <!-- <p class="text-indigo-400">Vadim Moiseenko</p> -->
</div>
