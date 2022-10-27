<script lang="ts">
    import type { PageData } from "./$types";

    import Register from "$components/auth/Register.svelte";
    export let data: PageData;
</script>

<div class=" w-full h-screen flex items-center justify-center bg-gray-500 ">
    <Register />
</div>
<div class="">
    Hello {data.age}
    {data.name}
</div>
