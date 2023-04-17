<script lang="ts">
  import { enhance } from "$app/forms"
  import AddIcon from "$lib/icons/AddIcon.svelte"
  import {
    ContentSwitcher,
    Switch,
    Search,
    Button,
    Link,
    DataTable,
    Loading,
    OverflowMenu,
    OverflowMenuItem,
    Pagination,
  } from "carbon-components-svelte"

  import Contact from "$lib/components/start/Contact.svelte"

  let searchTxt: string

  let selectedIndex: number

  export let form: any
  export let data: any
  let loading = false

  $: if (form?.data || form?.nodata) {
    loading = false
  }

  function search() {
    loading = true
    form = null
    // searchTxt = searchTxt
  }

  $: {
    console.log("form", form?.data)
  }

  function sortName(a: any, b: any) {
    if (a.name < b.name) {
      return -1
    }
    if (a.name > b.name) {
      return 1
    }
    return 0
  }

  // pages
  let pageSize = 20
  let page = 1

  function jumpToStart() {
    scrollTo(0, 0)
  }
</script>

<svelte:head>
  <title>Kontaktverzeichnis</title>
</svelte:head>

<div class="center-hd">
  <div class="contentSwitcher">
    <ContentSwitcher bind:selectedIndex>
      <Switch text="Allgemeine Suche" />
      <Switch text="Abteilungen" />
    </ContentSwitcher>
  </div>
  <form action="?/search" method="POST" use:enhance>
    <div class="center-hd">
      <div class="search">
        {#if selectedIndex == 0}
          <Search name="searchTxt" placeholder="Kontaktverzeichnis durchsuchen..." bind:value={searchTxt} />
        {:else}
          <Search name="searchTxt" placeholder="Abteilungen durchsuchen..." bind:value={searchTxt} />
        {/if}
        <input type="hidden" name="searchModus" bind:value={selectedIndex} />
        <Button type="submit" on:click={search}>Suchen</Button>
      </div>
      {#if data.user}
        {#if selectedIndex === 0}
          <div class="add">
            <OverflowMenu icon={AddIcon}>
              <OverflowMenuItem href="/person/new" text="Person erstellen" />
              <OverflowMenuItem href="/ressource/new" text="Ressource erstellen" />
            </OverflowMenu>
          </div>
        {:else if selectedIndex === 1}
          <div class="add2">
            <Button icon={AddIcon} href="/abteilung/new" size="small" kind="ghost" iconDescription="Abteilung erstellen" />
          </div>
        {/if}
      {/if}
      <section class="dataTable">
        {#if loading}
          <Loading withOverlay={false} />
        {/if}
        {#if form?.data}
          <div class="resultTable" id="resultTable">
            <DataTable
              sortable
              headers={[
                { key: "name", value: "Name", sort: (a, b) => sortName(a, b) },
                { key: "standort", value: "Standort", sort: false },
                { key: "abteilungen", value: "Abteilung", sort: false },
                { key: "kontakt", value: "Kontakt", sort: false },
              ]}
              rows={form.data}
              {pageSize}
              {page}>
              <svelte:fragment slot="cell" let:row let:cell>
                {#if cell.key === "name"}
                  <div class="center">
                    {#if cell.value.type === "person"}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        fill="currentColor"
                        class="bi bi-person-circle"
                        viewBox="0 0 16 16">
                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                        <path
                          fill-rule="evenodd"
                          d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                      </svg>
                    {:else}
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32"
                        ><path
                          fill="currentColor"
                          d="M16 14h2v2h-2zm4 0h2v2h-2zm4 0h2v2h-2zm-8 4h2v2h-2zm4 0h2v2h-2zm4 0h2v2h-2zm-8 4h2v2h-2zm4 0h2v2h-2zm4 0h2v2h-2zm-8-12h10v2H16z" /><path
                          fill="currentColor"
                          d="M28 6H14V5a2.002 2.002 0 0 0-2-2H8a2.002 2.002 0 0 0-2 2v1H4a2.002 2.002 0 0 0-2 2v18a2.002 2.002 0 0 0 2 2h24a2.002 2.002 0 0 0 2-2V8a2.002 2.002 0 0 0-2-2ZM8 5h4v17H8Zm20 21H4V8h2v14a2.002 2.002 0 0 0 2 2h4a2.002 2.002 0 0 0 2-2V8h14Z" /></svg>
                    {/if}
                    <Link style="margin-left:1rem" href="/{cell.value.type}/id/{cell.value.id}">{cell.value.name}</Link>
                  </div>
                {:else if cell.key === "standort"}
                  {#each cell.value as standort (standort.id)}
                    <p>{standort.bezeichnung}</p>
                  {/each}
                {:else if cell.key === "abteilungen"}
                  {#each cell.value as abteilung (abteilung.id)}
                    <p><Link href="/abteilung/id/{abteilung.id}">{abteilung.bezeichnung}</Link></p>
                  {/each}
                {:else if cell.key === "kontakt"}
                  <Contact contact={cell.value} />
                {/if}
              </svelte:fragment>
            </DataTable>
            {#if form.data.length > pageSize}
              <Pagination
                bind:pageSize
                bind:page
                totalItems={form.data.length}
                pageSizeInputDisabled
                on:click:button--next={jumpToStart} />
            {/if}
          </div>
        {:else if form?.nodata}
          <h4>Keine Ergebisse gefunden</h4>
        {/if}
      </section>
    </div>
  </form>
</div>

<style>
  @media all and (min-width: 955px) {
    .add {
      position: absolute;
      top: 213px;
      left: calc(100% - 12rem);
      margin-right: 3rem;
      z-index: 10;
    }
    .add2 {
      position: absolute;
      top: 217px;
      left: calc(100% - 12rem + 2px);
      margin-right: 3rem;
      z-index: 10;
    }
  }

  @media all and (max-width: 955px) {
    .add {
      display: none;
    }
    .add2 {
      display: none;
    }
  }

  p {
    font-size: 14px;
  }
  :global(.bx--data-table > tbody > tr > td) {
    padding: 0.5rem 16px 0.5rem 16px;
  }
  .center {
    display: flex;
    align-items: center;
  }
  .resultTable {
    width: calc(100% - 6rem);
  }
  .center-hd > form {
    width: 100%;
  }
  .dataTable {
    margin-top: 2rem;
    display: flex;
    justify-content: center;
    width: 100%;
    margin-bottom: 5rem;
  }
  .search {
    width: 550px;
    display: flex;
  }
  .contentSwitcher {
    width: 350px;
  }
  .center-hd {
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin-top: 3rem;
    align-items: center;
  }
  :global(.bx--content-switcher-btn) {
    display: flex;
    justify-content: center;
  }
  :global(.bx--link) {
    color: var(--cds-text-01);
  }
  :global(.bx--link:visited) {
    color: var(--cds-text-01);
  }
</style>
