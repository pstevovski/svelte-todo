<script>
  let count = 0

  const increment = () => {
    count += 1
  }

  const countAgainFn = (val) => {
    return val;
  }

  $: total = countAgainFn(count);

  $: {
    console.log("Count is: ", count);

    alert(`Count: ${count}`);
  }

  export let outsideProp = 'Test';
</script>

<div>
  <button class="p-10 bg-red-500" on:click={increment}>
    count is {count}
  </button>


  <p>Outside prop: {outsideProp}</p>
  <p>Count Again: {total}</p>
</div>
