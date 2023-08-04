<script lang="ts">
  import SearchTable from "$lib/components/start/SearchTable.svelte"
  import { TextInput } from "carbon-components-svelte"
  import DeleteIcon from "$lib/icons/DeleteIcon.svelte"
  import AcceptIcon from "$lib/icons/AcceptIcon.svelte"
  import EditIcon from "$lib/icons/EditIcon.svelte"
  import { page } from "$app/stores"
  import { goto } from "$app/navigation"
  import type { PageData } from "./$types.js"

  let id = $page.params.id

  export let data: PageData

  let edit = false

  async function deleteDepartment() {
    let response = await fetch(`/api/abteilung/${id}`, {
      method: "DELETE",
    })
    if (response.ok) {
      goto("/")
    }
  }

  async function renameDepartment() {
    let response = await fetch(`/api/abteilung`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: data.department.id,
        bezeichnung: data.department.bezeichnung,
      }),
    })
    edit = false
  }

  function activateEdit() {
    edit = true
  }
</script>

<svelte:head>
  <title>{data.department.bezeichnung}</title>
</svelte:head>

<section class="abteilungView">
  <div class="line">
    {#if edit}
      <div class="edt-btn">
        <TextInput labelText="Bezeichnung" bind:value={data.department.bezeichnung} />
        <div class="accept-bnt dwn" on:click={renameDepartment} on:keydown>
          <AcceptIcon size={24} />
        </div>
      </div>
    {:else}
      <h2>{data.department.bezeichnung}</h2>
    {/if}
    <div class="dwn">
      {#if data?.user}
        {#if !edit}
          <div on:click={activateEdit} on:keydown>
            <EditIcon size={24} />
          </div>
        {/if}
        {#if data.entities.length == 0}
          <div on:click={deleteDepartment} on:keydown>
            <DeleteIcon size={24} />
          </div>
        {/if}
      {/if}
    </div>
  </div>
  <div class="center-hd">
    <SearchTable searchResult={data.entities} sortKey="name" />
  </div>
</section>

<style>
  div.line {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 3rem 0 3rem 0;
  }
  div.line > div > div {
    display: inline;
    margin-right: 1rem;
  }
  .edt-btn {
    min-width: 400px;
    display: flex;
    align-items: center;
  }
  .accept-bnt {
    display: inline;
    margin-left: 1rem;
  }
  section {
    margin: 2rem 3.5rem 0 3.5rem;
  }
  .dwn {
    transform: translate(0, 1rem);
  }
  /* :global(section.abteilungView > svg) {
    margin: 0;
  } */
</style>
