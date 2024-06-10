<script>
  import { Trash2, CircleCheck, CircleX } from "lucide-svelte";
  import { Toaster, toast } from "svelte-sonner";
  import { format } from "date-fns";
  import { onMount } from "svelte";

  let todos = [];
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

  // todo: make it work based on index
  function handleTodoRemove(todo) {
    const todoToBeRemoved = todos.findIndex((existingTodo) => {
      return existingTodo.text.toLowerCase() === todo.text.toLowerCase();
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
  // todo: filter the list of todos:
  // - all
  // - only completed
  // - only not completed

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
        {#each todos as todo, todoIndex}
          <li class="p-2">
            <div
              class={`flex items-center justify-between ${todo.is_completed ? "line-through decoration-slate-500" : ""}`}
            >
              <div class="flex items-center gap-3">
                <input
                  type="checkbox"
                  name={`todo-item-${todoIndex}`}
                  id={`todo-item-${todoIndex}`}
                  checked={todo.is_completed}
                  on:change={(event) => {
                    handleTodoToggleStatus(event, todoIndex);
                  }}
                />
                <label
                  for={`todo-item-${todoIndex}`}
                  class="text-xl text-slate-500">{todo.text}</label
                >
              </div>

              <div class="flex items-center">
                <button
                  class="text-red-500"
                  on:click={() => handleTodoRemove(todo)}><Trash2 /></button
                >
              </div>
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
