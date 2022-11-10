<script lang="ts">
  import { enhance } from "$app/forms";
  import { page } from "$app/stores";

  export let low = 500;
  export let high = 500;
  export let isOpen;
</script>

<div class="z-10 mt-10 w-full sm:mt-0 md:w-2/5">
  <div class="mt-5   ">
    <form
      use:enhance={({ form, data, action, cancel }) => {
        return async ({ update }) => {
          await update();
          if ($page.form?.success) {
            isOpen = false;
          }
        };
      }}
      action="/?/filters"
      method="POST"
    >
      <div class="overflow-hidden text-left shadow sm:rounded-md">
        <div class="  space-y-6 bg-white px-4 py-5 sm:p-6">
          <fieldset>
            <div class="text-base font-medium text-gray-900" aria-hidden="true">
              Разница в рейтинге
            </div>
            <div class=" mt-2 flex space-x-5">
              <input
                name="min"
                type="range"
                step="50"
                min="-500"
                max="-50"
                bind:value={low}
              />
              <span class="isolate inline-flex rounded-md shadow-sm">
                <button
                  type="button"
                  class="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >{low == -500 ? "-∞" : low}</button
                >
                <button
                  type="button"
                  class="relative  -ml-px inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >{high == 500 ? "∞" : high}</button
                >
              </span>
              <input
                name="max"
                type="range"
                step="50"
                min="50"
                max="500"
                bind:value={high}
              />
            </div>
          </fieldset>
          <!-- <fieldset>
            <legend class="sr-only">By Email</legend>
            <div class="text-base font-medium text-gray-900" aria-hidden="true">
              By Email
            </div>
            <div class="mt-4 space-y-4">
              <div class="flex items-start">
                <div class="flex h-5 items-center">
                  <input
                    id="comments"
                    name="comments"
                    type="checkbox"
                    class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </div>
                <div class="ml-3 text-sm">
                  <label for="comments" class="font-medium text-gray-700"
                    >Comments</label
                  >
                  <p class="text-gray-500">
                    Get notified when someones posts a comment on a posting.
                  </p>
                </div>
              </div>
              <div class="flex items-start">
                <div class="flex h-5 items-center">
                  <input
                    id="candidates"
                    name="candidates"
                    type="checkbox"
                    class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </div>
                <div class="ml-3 text-sm">
                  <label for="candidates" class="font-medium text-gray-700"
                    >Candidates</label
                  >
                  <p class="text-gray-500">
                    Get notified when a candidate applies for a job.
                  </p>
                </div>
              </div>
              <div class="flex items-start">
                <div class="flex h-5 items-center">
                  <input
                    id="offers"
                    name="offers"
                    type="checkbox"
                    class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </div>
                <div class="ml-3 text-sm">
                  <label for="offers" class="font-medium text-gray-700"
                    >Offers</label
                  >
                  <p class="text-gray-500">
                    Get notified when a candidate accepts or rejects an offer.
                  </p>
                </div>
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend class="contents text-base font-medium text-gray-900"
              >Push Notifications</legend
            >
            <p class="text-sm text-gray-500">
              These are delivered via SMS to your mobile phone.
            </p>
            <div class="mt-4 space-y-4">
              <div class="flex items-center">
                <input
                  id="push-everything"
                  name="push-notifications"
                  type="radio"
                  class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  for="push-everything"
                  class="ml-3 block text-sm font-medium text-gray-700"
                  >Everything</label
                >
              </div>
              <div class="flex items-center">
                <input
                  id="push-email"
                  name="push-notifications"
                  type="radio"
                  class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  for="push-email"
                  class="ml-3 block text-sm font-medium text-gray-700"
                  >Same as email</label
                >
              </div>
              <div class="flex items-center">
                <input
                  id="push-nothing"
                  name="push-notifications"
                  type="radio"
                  class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  for="push-nothing"
                  class="ml-3 block text-sm font-medium text-gray-700"
                  >No push notifications</label
                >
              </div>
            </div>
          </fieldset> -->
        </div>
        <div class="bg-gray-50 px-4 py-3 text-right sm:px-6">
          <button
            type="submit"
            class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >Save</button
          >
        </div>
      </div>
    </form>
  </div>
</div>
