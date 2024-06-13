<script>
  import { createEventDispatcher } from "svelte";
  import cn from "../utils/classnames";
  const dispatch = createEventDispatcher();

  export let dataToBePaginated;
  export let itemsPerPage = 10;
  export let currentPage;
  $: totalPages = handleCalculateTotalPages(dataToBePaginated, itemsPerPage);

  /**
   * @param dataToBePaginated { Array }
   * @param itemsPerPage { number }
   */
  function handleCalculateTotalPages(dataToBePaginated, itemsPerPage) {
    if (
      !dataToBePaginated ||
      !dataToBePaginated.length ||
      !Array.isArray(dataToBePaginated)
    )
      return 0;

    return Math.ceil(dataToBePaginated.length / itemsPerPage);
  }
</script>

{#if totalPages > 1}
  <div class="flex items-center gap-1 my-4">
    <button
      type="button"
      class="p-2 rounded-[8px] bg-slate-100 text-sm hover:bg-slate-200 hover:shadow-lg duration-100 disabled:bg-slate-300 disabled:cursor-not-allowed disabled:text-gray-50 disabled:hover:shadow-none"
      disabled={currentPage === 1}
      on:click={() => dispatch("handlePageChange", { page: currentPage - 1 })}
      >Prev</button
    >

    {#each Array.from({ length: totalPages }, (_, index) => index + 1) as page}
      <button
        type="button"
        class={cn(
          "p-2 px-4 rounded-[8px] bg-slate-100 text-sm hover:bg-slate-200 hover:shadow-lg duration-100",
          currentPage === page ? "bg-blue-500 text-white hover:bg-blue-500" : ""
        )}
        on:click={() => dispatch("handlePageChange", { page })}>{page}</button
      >
    {/each}

    <button
      type="button"
      class="p-2 rounded-[8px] bg-slate-100 text-sm hover:bg-slate-200 hover:shadow-lg duration-100 disabled:bg-slate-300 disabled:cursor-not-allowed disabled:text-gray-50 disabled:hover:shadow-none"
      disabled={currentPage === totalPages}
      on:click={() => dispatch("handlePageChange", { page: currentPage + 1 })}
      >Next</button
    >
  </div>
{/if}
