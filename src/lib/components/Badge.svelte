<script>
  import { X } from "lucide-svelte";
  import cn from "../utils/classnames";
  import { createEventDispatcher } from "svelte";

  export let badgeText = "";
  export let isClearable = false;
  export let isActive = false;

  const dispatch = createEventDispatcher();
</script>

<button
  class={cn(
    "flex justify-center items-center p-2 bg-slate-100 hover:bg-slate-200 duration-200 rounded-[4px] cursor-pointer min-w-[50px] outline-none",
    isActive ? "bg-emerald-400 hover:bg-emerald-500" : ""
  )}
  on:click={() => dispatch("handleSelectBadge")}
>
  <span class={cn("text-slate-400 text-sm", isActive ? "text-white" : "")}
    >{badgeText}</span
  >
  {#if isClearable}
    <span class="text-slate-600"><X /></span>
  {/if}
</button>
