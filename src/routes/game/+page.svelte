<script lang="ts">
    import type { PageData } from "./$types";

    export let data: PageData;
</script>

<div class="">{data.name} {data.age}</div>
