<script>
  import { OctagonAlert, X } from "lucide-svelte";
  import { Toaster, toast } from "svelte-sonner";
  import { format } from "date-fns";
  import { onMount } from "svelte";
  import Badge from "./lib/components/Badge.svelte";
  import ModalConfirm from "./lib/components/ModalConfirm.svelte";
  import TodoItem from "./lib/components/TodoItem.svelte";
  import Modal from "./lib/components/Modal.svelte";

  let todos = [];
  let activeFilter = "all";
  let todoText = "";
  let showDeleteTodoModal = false;
  let showEditTodoModal = false;
  let selectedTodoIndex = null;

  onMount(() => {
    // read todos from local storage
    const savedTodos = JSON.parse(localStorage.getItem("svelte-todos")) || [];
    todos = savedTodos;
  });

  function handleTodoAdd(event) {
    const todoTextField = event.target.elements["todo"];

    // Prevent adding empty todos
    if (!todoTextField.value) {
      toast.error("Cannot add an empty todo!");
      return;
    }

    // Prevent adding todos with the exact same text
    const isAlreadyExisting = todos.find((todo) => {
      return todo.text.toLowerCase() === todoTextField.value.toLowerCase();
    });

    if (isAlreadyExisting) {
      toast.info("This todo item already exists!");
      return;
    }

    // note: svelte reactivity is triggered by ASSIGNMENTS
    // therefor array methods such as push, pop, etc. wont work
    // and we must reassign the value
    const nextTodoID =
      todos.length > 0 ? Math.max(...todos.map((todo) => todo.id)) + 1 : 1;

    todos = [
      ...todos,
      {
        id: nextTodoID,
        text: todoTextField.value.trim(),
        created_at: new Date(),
        is_completed: false,
      },
    ];

    // clear out the field
    todoText = "";
    toast.success("New todo added to the list!");

    // save to local storage
    localStorage.setItem("svelte-todos", JSON.stringify(todos));
  }

  // TODO: update to make use of the unique ID
  function handleTodoRemove(todoIndex) {
    const updatedTodos = [...todos];
    updatedTodos.splice(todoIndex, 1);
    todos = updatedTodos;
    toast.success("Successfully removed todo!");

    // update the todos list
    localStorage.setItem("svelte-todos", JSON.stringify(todos));

    // clear out the selected todo index and close the modal
    selectedTodoIndex = null;
    showDeleteTodoModal = false;
  }

  // TODO: Update to make use of the unique ID
  function handleTodoToggleStatus(event, todoIndex) {
    const isChecked = event.target.checked;

    const updatedTodos = [...todos];
    updatedTodos[todoIndex].is_completed = isChecked;
    todos = updatedTodos;

    // update the list of saved todos with the updated status
    localStorage.setItem("svelte-todos", JSON.stringify(todos));
  }

  function handleMarkAllTodosAsCompleted() {
    todos = todos.map((todo) => {
      return {
        ...todo,
        is_completed: true,
      };
    });

    localStorage.setItem("svelte-todos", JSON.stringify(todos));
  }

  // TODO: Update to make use of the unique ID
  function handleUpdateTodo(event) {
    const todoTextField = event.target.elements["todo-edit"];

    // Prevent adding empty todos
    if (!todoTextField.value) {
      toast.error("Updated todo must not be empty!");
      return;
    }

    todos[selectedTodoIndex] = {
      ...todos[selectedTodoIndex],
      text: todoTextField.value,
    };

    // clear out the field
    toast.success("Todo item successfully updated!");

    // save to local storage
    localStorage.setItem("svelte-todos", JSON.stringify(todos));

    // reset the selected todo details
    selectedTodoIndex = null;
    showEditTodoModal = false;
  }

  function handleClearCompletedTodos() {
    todos = todos.filter((todo) => !todo.is_completed);

    // update the persisting list
    localStorage.setItem("svelte-todos", JSON.stringify(todos));
  }

  function handleFilterTodos(todos, filter) {
    if (filter === "all") return todos;

    return todos.filter((todo) => {
      return filter === "active" ? !todo.is_completed : todo.is_completed;
    });
  }

  // reactive state - anytime some of the values used are updated, the reactive state will be updated too
  $: nonCompletedTodosCount = todos.filter((todo) => !todo.is_completed).length;
  $: filteredTodos = handleFilterTodos(todos, activeFilter);
</script>

<Toaster richColors />
<main>
  <div
    class="p-6 bg-white rounded shadow-md border border-slate-100 max-w-[650px] w-full mx-auto my-4"
  >
    <h1 class="font-semibold text-xl text-slate-400">Todos</h1>

    <form action="#" on:submit|preventDefault={handleTodoAdd}>
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
          {#each filteredTodos as todo, todoIndex}
            <TodoItem
              {todo}
              {todoIndex}
              on:handleToggleStatus={(event) => {
                handleTodoToggleStatus(event.detail.originalEvent, todoIndex);
              }}
              on:handleOpenEditModal={() => {
                showEditTodoModal = true;
                selectedTodoIndex = todoIndex;
              }}
              on:handleOpenDeleteModal={() => {
                showDeleteTodoModal = true;
                selectedTodoIndex = todoIndex;
              }}
            />
          {/each}
        </ul>
      {:else}
        <p class="text-slate-400 font-light">No todos available.</p>
      {/if}
    </div>

    <hr />

    {#if nonCompletedTodosCount > 0}
      <div class="flex justify-between items-center my-4">
        <p class="m-0 text-slate-400 font-light">
          {nonCompletedTodosCount} todos remaining
        </p>
        <button
          on:click={handleMarkAllTodosAsCompleted}
          class="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:text-slate-50 duration-300"
          >Mark all as completed</button
        >
      </div>
      <hr />
    {/if}

    <div class="py-4">
      <h5 class="text-slate-400">Filters</h5>
      <p class="text-slate-400 text-xs mb-4">
        Filter out the list of todo items based on their status.
      </p>

      <div class="flex justify-between items-center gap-2">
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

        {#if todos.some((todo) => todo.is_completed)}
          <button
            class="p-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white text-sm duration-200"
            on:click={handleClearCompletedTodos}>Clear Completed</button
          >
        {/if}
      </div>
    </div>
  </div>

  {#if showDeleteTodoModal}
    <ModalConfirm
      modalTitle="Are you sure you want to remove this item?"
      modalDescription="Removing this item is an irreverisble action."
    >
      <OctagonAlert
        slot="modal-icon"
        class="text-red-500 size-20 mx-auto my-4"
      />
      <div
        class="flex justify-center items-center my-4 gap-3"
        slot="modal-actions"
      >
        <button
          class="p-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-400 text-sm duration-200"
          on:click={() => (showDeleteTodoModal = false)}>Cancel</button
        >
        <button
          class="p-2 rounded-md bg-red-500 hover:bg-red-600 text-white text-sm duration-200"
          on:click={() => handleTodoRemove(selectedTodoIndex)}
          >Yes, Delete</button
        >
      </div>
    </ModalConfirm>
  {/if}

  {#if showEditTodoModal}
    <Modal>
      <form action="#" on:submit|preventDefault={handleUpdateTodo}>
        <h1 class="text-center text-lg text-slate-600 font-bold">Edit</h1>

        <input
          name="todo-edit"
          class="border rounded p-2 my-2 w-full text-slate-700 text-sm"
          type="text"
          value={todos[selectedTodoIndex].text}
        />

        <div class="flex justify-center items-center my-4 gap-3">
          <button
            type="button"
            class="p-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-400 text-sm duration-200"
            on:click={() => (showEditTodoModal = false)}>Cancel</button
          >
          <button
            class="p-2 rounded-md bg-emerald-400 hover:bg-emerald-500 text-white text-sm duration-200"
            >Update</button
          >
        </div>
      </form>
    </Modal>
  {/if}
</main>
