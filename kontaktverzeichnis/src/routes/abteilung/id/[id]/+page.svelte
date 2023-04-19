<script lang="ts">
  import TextField from "$lib/components/TextField.svelte"
  import SearchTable from "$lib/components/start/SearchTable.svelte"
  import { TextInput, Loading } from "carbon-components-svelte"

  export let data: any

  let loading: boolean = false

  let Combofield: any
  if (data?.user) {
    Combofield = TextInput
  } else {
    Combofield = TextField
  }
</script>

{#if loading}
  <Loading />
{:else}
  <!-- {#if data?.user}
    <div>edit</div>
  {/if} -->
  {#if data?.entities}
    <section>
      <h2>{data.department.bezeichnung}</h2>
      <div class="center-hd">
        <SearchTable searchResult={data.entities} />
      </div>
    </section>
  {/if}
{/if}

<style>
  h2 {
    margin: 4rem 0 4rem 0;
  }
  section {
    margin: 2rem 3.5rem 0 3.5rem;
  }
</style>
