<script lang="ts">
  import Badge from "$components/common/Badge.svelte";
</script>

<div class="  py-3 px-6  xl:px-3 xl:text-left">
  <div class="">
    <img
      class="mx-auto h-10 w-10 rounded-full xl:h-20 xl:w-20"
      src="https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80"
      alt=""
    />
    <div class=" mt-2 xl:flex xl:items-center  xl:justify-center">
      <div class="  text-center text-xs font-medium text-slate-800 ">
        <div class="">
          <Badge
            title={`GM`}
            color={{ text: "text-slate-100", bg: "bg-red-800" }}
          />
          Tayka
        </div>
        <div class="ml-1 mt-1">
          <Badge
            title={`2000`}
            color={{ text: "text-slate-100", bg: "bg-slate-800" }}
          />
        </div>
        <!-- <p class="text-indigo-400">Vadim Moiseenko</p> -->
      </div>
    </div>
  </div>
</div>
