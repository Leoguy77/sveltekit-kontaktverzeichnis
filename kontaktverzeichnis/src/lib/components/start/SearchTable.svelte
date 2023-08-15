<script lang="ts">
  import { DataTable, Link, Pagination } from "carbon-components-svelte"
  import Contact from "$lib/components/start/Contact.svelte"

  // pages
  let pageSize = 10
  let page = 1
  let sortDirection: "none" | "ascending" | "descending" | undefined = "none"
  let sortKey: "name"

  export let searchResult: any

  function sortName(a: any, b: any) {
    if (a.name < b.name) {
      return -1
    }
    if (a.name > b.name) {
      return 1
    }
    return 0
  }
</script>

<section class="dataTable">
  {#if searchResult?.length > 0}
    <div class="resultTable" id="resultTable">
      <DataTable
        bind:sortDirection
        bind:sortKey
        sortable
        headers={[
          { key: "name", value: "Name", sort: (a, b) => sortName(a, b) },
          { key: "standort", value: "Standort", sort: false },
          { key: "abteilung", value: "Abteilung", sort: false },
          { key: "kontakt", value: "Kontakt", sort: false },
        ]}
        rows={searchResult}
        {pageSize}
        {page}>
        <svelte:fragment slot="cell" let:row let:cell>
          {#if cell.key === "name"}
            <div class="center-v">
              {#if cell.value.type === "person"}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
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
              <Link style="margin-left:1rem" href="/{cell.value.type}/{cell.value.id}">{cell.value.name}</Link>
            </div>
          {:else if cell.key === "standort"}
            {#each cell.value as standort (standort.id)}
              <p>{standort.bezeichnung}</p>
            {/each}
          {:else if cell.key === "abteilung"}
            {#each cell.value as abteilung (abteilung.id)}
              <p><Link href="/abteilung/{abteilung.id}">{abteilung.bezeichnung}</Link></p>
            {/each}
          {:else if cell.key === "kontakt"}
            <Contact contact={cell.value} />
          {/if}
        </svelte:fragment>
      </DataTable>
    </div>
    {#if searchResult?.length > pageSize}
      <Pagination
        bind:pageSize
        bind:page
        totalItems={searchResult?.length}
        pageSizeInputDisabled
        forwardText="Nächste Seite"
        backwardText="Vorherige Seite"
        itemRangeText={(min, max, total) => `${min}-${max} von ${total} Ergebnissen`}
        pageRangeText={(current, total) => `von ${total} Seite${total === 1 ? "" : "n"}`} />
    {/if}
  {:else if searchResult?.length === 0}
    <div class="center-h">
      <h4>Keine Ergebisse gefunden</h4>
    </div>
  {/if}
</section>

<style>
  .center-h {
    display: flex;
    justify-content: center;
  }
  .center-v {
    display: flex;
    align-items: center;
  }
  .dataTable {
    margin-top: 1rem;
    display: flex;
    justify-content: center;
    width: 100%;
    flex-direction: column;
  }
  p {
    font-size: 14px;
  }
  .resultTable {
    max-height: calc(100vh - 290px);
    overflow-y: auto;
  }
  :global(.bx--data-table > tbody > tr > td) {
    padding: 0.5rem 16px 0.5rem 16px;
  }
  :global(.bx--link) {
    color: var(--cds-text-01);
  }
  :global(.bx--link:visited) {
    color: var(--cds-text-01);
  }
  :global(#resultTable > div.bx--data-table-container > table > thead) {
    position: sticky;
    top: 0;
    z-index: 1;
  }
</style>
