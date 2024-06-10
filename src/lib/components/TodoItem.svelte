<script>
  import { format } from "date-fns";
  import { createEventDispatcher } from "svelte";
  import { Pencil, X } from "lucide-svelte";

  export let todo;
  export let todoIndex;

  const dispatch = createEventDispatcher();
</script>

<li class="p-2">
  <div
    class={`flex items-center justify-between ${todo.is_completed ? "line-through decoration-slate-500" : ""}`}
  >
    <div class="flex items-center gap-x-3">
      <input
        type="checkbox"
        name={`todo-item-${todoIndex}`}
        id={`todo-item-${todoIndex}`}
        checked={todo.is_completed}
        class="cursor-pointer"
        on:change={(event) =>
          dispatch("handleToggleStatus", { originalEvent: event })}
      />
      <label
        for={`todo-item-${todoIndex}`}
        class="text-xl text-slate-500 cursor-pointer">{todo.text}</label
      >
    </div>

    <div class="flex items-center">
      <button
        class="text-slate-300 hover:text-red-500 duration-200"
        on:click={() => dispatch("handleOpenEditModal")}><Pencil /></button
      >
      <button
        class="text-slate-300 hover:text-red-500 duration-200"
        on:click={() => dispatch("handleOpenDeleteModal")}><X /></button
      >
    </div>
  </div>
  <span class="text-xs text-slate-400">
    <em>Created: {format(todo.created_at, "MM/dd/yyyy HH:mm:ss")}</em>
  </span>
</li>
