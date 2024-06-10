<script>
  import { X } from "lucide-svelte";
  import { Toaster, toast } from "svelte-sonner";
  import { format } from "date-fns";
  import { onMount } from "svelte";
  import Badge from "./lib/components/Badge.svelte";

  let todos = [];
  let activeFilter = "all";
  let todoText = "";

  onMount(() => {
    // read todos from local storage
    const savedTodos = JSON.parse(localStorage.getItem("svelte-todos")) || [];
    todos = savedTodos;
  });

  function handleTodoAdd(event) {
    event.preventDefault();
    const todoTextField = event.target.elements["todo"];

    // Prevent adding empty todos
    if (!todoTextField.value) {
      toast.error("Cannot add an empty todo!");
      return;
    }

    // note: svelte reactivity is triggered by ASSIGNMENTS
    // therefor array methods such as push, pop, etc. wont work
    // and we must reassign the value
    todos = [
      ...todos,
      {
        text: todoTextField.value,
        created_at: new Date(),
        is_completed: false,
      },
    ];

    // clear out the field
    todoTextField.value = "";
    toast.success("New todo added to the list!");

    // save to local storage
    localStorage.setItem("svelte-todos", JSON.stringify(todos));
  }

  function handleTodoRemove(todoIndex) {
    const updatedTodos = [...todos];
    updatedTodos.splice(todoIndex, 1);
    todos = updatedTodos;
    toast.success("Successfully removed todo!");

    // update the todos list
    localStorage.setItem("svelte-todos", JSON.stringify(todos));
  }

  function handleTodoToggleStatus(event, todoIndex) {
    const isChecked = event.target.checked;

    const updatedTodos = [...todos];
    updatedTodos[todoIndex].is_completed = isChecked;
    todos = updatedTodos;

    // update the list of saved todos with the updated status
    localStorage.setItem("svelte-todos", JSON.stringify(todos));
  }

  // todo: presist in local storage [x]
  // todo: mark todos as completed / not completed [x]
  // todo: filter the list of todos: [x]
  // todo: check all todos at once
  // todo: add double confirmation modal for todo item removal

  $: {
    console.log("TODOS: ", todos);
  }
</script>

<Toaster richColors />
<main>
  <div
    class="p-6 bg-white rounded shadow-md border border-slate-100 max-w-[650px] w-full mx-auto my-4"
  >
    <h1 class="font-semibold text-xl text-slate-400">Todos</h1>

    <form action="#" on:submit={handleTodoAdd}>
      <input
        name="todo"
        type="text"
        placeholder="Todo..."
        class="border rounded p-2 my-2 w-full"
        bind:value={todoText}
      />

      <button
        disabled={!todoText}
        class="p-2 my-4 bg-emerald-400 text-white rounded hover:bg-emerald-600 disabled:bg-slate-300 disabled:text-slate-50 duration-300"
        >Add Todo</button
      >
    </form>

    <hr />

    <div class="my-4">
      {#if todos.length > 0}
        <ul>
          {#each todos as todo, todoIndex}
            {#if activeFilter === "all" || (activeFilter === "active" && !todo.is_completed) || (activeFilter === "completed" && todo.is_completed)}
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
                      on:change={(event) => {
                        handleTodoToggleStatus(event, todoIndex);
                      }}
                    />
                    <label
                      for={`todo-item-${todoIndex}`}
                      class="text-xl text-slate-500 cursor-pointer"
                      >{todo.text}</label
                    >
                  </div>

                  <div class="flex items-center">
                    <button
                      class="text-slate-300 hover:text-red-500 duration-200"
                      on:click={() => handleTodoRemove(todoIndex)}><X /></button
                    >
                  </div>
                </div>
                <span class="text-xs text-slate-400"
                  ><em
                    >Created: {format(
                      todo.created_at,
                      "MM/dd/yyyy HH:mm:ss"
                    )}</em
                  ></span
                >
              </li>
            {/if}
          {/each}
        </ul>
      {:else}
        <p class="text-slate-400 font-light">No todos available.</p>
      {/if}
    </div>

    <hr />

    <div class="py-4">
      <h5 class="text-slate-400">Filters</h5>
      <p class="text-slate-400 text-xs mb-4">
        Filter out the list of todo items based on their status.
      </p>

      <div class="flex items-center gap-2">
        <Badge
          badgeText="All"
          isActive={activeFilter === "all"}
          on:handleSelectBadge={() => (activeFilter = "all")}
        />
        <Badge
          badgeText="Active"
          isActive={activeFilter === "active"}
          on:handleSelectBadge={() => (activeFilter = "active")}
        />
        <Badge
          badgeText="Completed"
          isActive={activeFilter === "completed"}
          on:handleSelectBadge={() => (activeFilter = "completed")}
        />
      </div>
    </div>
  </div>
</main>
