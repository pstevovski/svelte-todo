<script>
  export let modalTitle;
  export let modalDescription = "";
</script>

<div>
  <div
    class="bg-slate-800 opacity-40 absolute top-0 left-0 w-full h-full"
  ></div>
  <div
    class="bg-white shadow-lg rounded-[8px] p-6 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[450px] w-full"
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
