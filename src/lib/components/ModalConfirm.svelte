<script>
  import { fade, fly } from "svelte/transition";

  export let modalTitle;
  export let modalDescription = "";
</script>

<div>
  <div
    in:fade={{ duration: 250, delay: 0 }}
    out:fade={{ duration: 250, delay: 150 }}
    class="bg-slate-800 opacity-40 absolute top-0 left-0 w-full h-full"
  ></div>
  <div
    class="bg-white shadow-lg rounded-[8px] p-6 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[450px] w-full"
    in:fly={{ y: -50, opacity: 1, duration: 750 }}
    out:fly={{ y: -100, opacity: 0, duration: 500 }}
  >
    <slot name="modal-icon"></slot>

    <h1 class="text-center text-lg text-slate-600 font-bold">
      {modalTitle}
    </h1>

    {#if modalDescription}
      <p class="text-center text-sm text-slate-400 font-light">
        {modalDescription}
      </p>
    {/if}

    <slot name="modal-actions"></slot>
  </div>
</div>
