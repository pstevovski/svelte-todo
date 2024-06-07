<script>
  import { Trash2 } from "lucide-svelte";
  import { Toaster, toast } from "svelte-sonner";
  import { format } from "date-fns";

  let todos = [];
  let todoText = "";

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
      },
    ];

    // clear out the field
    todoTextField.value = "";
    toast.success("New todo added to the list!");
  }

  function handleTodoRemove(todo) {
    const todoToBeRemoved = todos.findIndex((existingTodo) => {
      return existingTodo.toLowerCase() === todo.toLowerCase();
    });

    // exit if item cannot be found
    if (todoToBeRemoved < 0) {
      toast.error("The targeted todo was not found!");

      return;
    }

    // remove the item
    const updatedTodos = [...todos];
    updatedTodos.splice(todoToBeRemoved, 1);
    todos = updatedTodos;
    toast.success("Successfully removed todo!");
  }

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

    <hr class="mb-4" />

    {#if todos.length > 0}
      <ul>
        {#each todos as todo}
          <li class="p-2">
            <div class="flex items-center justify-between">
              <span class="text-slate-500">{todo.text}</span>
              <button
                class="text-red-500"
                on:click={() => handleTodoRemove(todo)}><Trash2 /></button
              >
            </div>
            <span class="text-xs text-slate-400"
              ><em>Created: {format(todo.created_at, "MM/dd/yyyy")}</em></span
            >
          </li>
        {/each}
      </ul>
    {:else}
      <p class="text-slate-400 font-light">No todos available.</p>
    {/if}
  </div>
</main>
