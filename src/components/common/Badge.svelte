<script lang="ts">
  export let title: string;
  export let color: { text: string; bg: string };
</script>

<span class="  rounded {color.bg} px-1 text-xs {color.text}">{title}</span>
