<script>
  import { OctagonAlert } from "lucide-svelte";
  import { Toaster, toast } from "svelte-sonner";
  import { onMount } from "svelte";
  import Badge from "./lib/components/Badge.svelte";
  import ModalConfirm from "./lib/components/ModalConfirm.svelte";
  import TodoItem from "./lib/components/TodoItem.svelte";
  import Modal from "./lib/components/Modal.svelte";
  import Pagination from "./lib/components/Pagination.svelte";

  let todos = [];
  let activeFilter = "all";
  let todoText = "";
  let selectedTodo = null;

  // Read saved todos and populate the state
  onMount(() => {
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

  function handleTodoRemove(id) {
    todos = todos.filter((todo) => todo.id !== id);
    toast.success("Successfully removed todo!");

    // Update the saved todos list
    localStorage.setItem("svelte-todos", JSON.stringify(todos));

    // Clear out the selected todo index and close the modal
    selectedTodo = null;
    showDeleteTodoModal = false;
  }

  function handleTodoToggleStatus(event, id) {
    const isChecked = event.target.checked;

    const todoIndex = todos.findIndex((todo) => todo.id === id);

    if (todoIndex < 0) {
      toast.error("Targeted todo cannot be found!");
      return;
    }

    const updatedTodos = [...todos];
    updatedTodos[todoIndex].is_completed = isChecked;
    todos = updatedTodos;

    // Update the list of saved todos with the updated status
    localStorage.setItem("svelte-todos", JSON.stringify(todos));
  }

  function handleUpdateTodo(event) {
    const todoTextField = event.target.elements["todo-edit"];

    // Prevent adding empty todos
    if (!todoTextField.value) {
      toast.error("Updated todo must not be empty!");
      return;
    }

    const todoIndex = todos.findIndex((todo) => todo.id === selectedTodo.id);

    if (todoIndex < 0) {
      toast.error("Targeted todo cannot be found!");
      return;
    }

    todos[todoIndex] = {
      ...todos[todoIndex],
      text: todoTextField.value,
    };

    // Reset the selected todo details and update the saved list
    toast.success("Todo item successfully updated!");
    selectedTodo = null;
    showEditTodoModal = false;
    localStorage.setItem("svelte-todos", JSON.stringify(todos));
  }

  function handleClearCompletedTodos() {
    todos = todos.filter((todo) => !todo.is_completed);

    // Update the persisting list
    localStorage.setItem("svelte-todos", JSON.stringify(todos));

    // Close the modal
    showClearCompletedModal = false;
  }

  // This is a "reactive" state - anytime some of the values used are updated, the reactive state will be updated too
  $: filteredTodos = handleFilterTodos(todos, activeFilter);

  function handleFilterTodos(todos, filter) {
    if (filter === "all") return todos;

    return todos.filter((todo) => {
      return filter === "active" ? !todo.is_completed : todo.is_completed;
    });
  }

  /*======================
    MODALS
  ========================*/
  let showClearCompletedModal = false;
  let showDeleteTodoModal = false;
  let showEditTodoModal = false;

  /*======================
    TODOS COUNTER
  ========================*/
  $: totalTodos = todos.length;
  $: activeTodos = todos.filter((todo) => !todo.is_completed).length;
  $: completedTodos = todos.filter((todo) => todo.is_completed).length;

  /*======================
    PAGINATION
  ========================*/
  let currentPage = 1;
  let itemsPerPage = 10;
  $: paginatedTodos = handlePaginateTodos(currentPage, filteredTodos);

  function handlePaginateTodos(currentPage, filteredTodos) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = currentPage * itemsPerPage;
    return filteredTodos.slice(startIndex, endIndex);
  }
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
        class="border rounded p-2 my-2 w-full text-slate-400 font-light"
        bind:value={todoText}
      />

      <button
        disabled={!todoText}
        class="p-2 my-4 bg-emerald-400 text-white rounded hover:bg-emerald-600 disabled:bg-slate-300 disabled:text-slate-50 duration-300"
        >Add Todo</button
      >
    </form>

    {#if todos.length > 0}
      <hr />

      <!-- FILTERS -->
      <div class="py-4">
        <h5 class="text-slate-400">Filters</h5>
        <p class="text-slate-400 text-xs mb-4">
          Filter out the list of todo items based on their status.
        </p>

        <div class="flex justify-between items-center gap-2">
          <div class="flex items-center gap-2">
            <Badge
              badgeText={`All (${totalTodos})`}
              isActive={activeFilter === "all"}
              on:handleSelectBadge={() => (activeFilter = "all")}
            />
            <Badge
              badgeText={`Active (${activeTodos})`}
              isActive={activeFilter === "active"}
              on:handleSelectBadge={() => (activeFilter = "active")}
            />
            <Badge
              badgeText={`Completed (${completedTodos})`}
              isActive={activeFilter === "completed"}
              on:handleSelectBadge={() => (activeFilter = "completed")}
            />
          </div>

          {#if todos.some((todo) => todo.is_completed)}
            <button
              class="p-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white text-sm duration-200"
              on:click={() => (showClearCompletedModal = true)}
              >Clear Completed</button
            >
          {/if}
        </div>
      </div>

      <!-- TODOS -->
      <div>
        {#if paginatedTodos.length > 0}
          <ul>
            {#each paginatedTodos as todo, todoIndex (todo.id)}
              <TodoItem
                {todo}
                {todoIndex}
                on:handleToggleStatus={(event) => {
                  handleTodoToggleStatus(event.detail.originalEvent, todo.id);
                }}
                on:handleOpenEditModal={() => {
                  showEditTodoModal = true;
                  selectedTodo = todo;
                }}
                on:handleOpenDeleteModal={() => {
                  showDeleteTodoModal = true;
                  selectedTodo = todo;
                }}
              />
            {/each}
          </ul>
        {:else}
          <p class="text-slate-400 font-light">
            {#if activeFilter === "all"}
              No todos available.
            {:else}
              No {activeFilter} todos.
            {/if}
          </p>
        {/if}
      </div>
    {/if}

    <Pagination
      dataToBePaginated={filteredTodos}
      {currentPage}
      {itemsPerPage}
      on:handlePageChange={({ detail }) => (currentPage = detail.page)}
    />
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
          on:click={() => handleTodoRemove(selectedTodo.id)}>Yes, Delete</button
        >
      </div>
    </ModalConfirm>
  {/if}

  {#if showClearCompletedModal}
    <ModalConfirm
      modalTitle="Are you sure you want to clear out all completed items?"
      modalDescription="This action is irreverisble."
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
          on:click={handleClearCompletedTodos}>Yes, Clear</button
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
          value={selectedTodo.text}
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
