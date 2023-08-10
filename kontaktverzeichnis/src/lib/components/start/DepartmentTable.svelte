<script lang="ts">
  import { DataTable, Loading, Link, Pagination } from "carbon-components-svelte"
  import Contact from "$lib/components/start/Contact.svelte"

  // pages
  let pageSize = 10
  let page: number

  export let departments: any
  export let searchTxt: string

  let searchResult: any

  $: if (departments) {
    searchResult = departments.filter((el: any) => {
      if (el.name.toLowerCase().includes(searchTxt.toLowerCase())) return true
    })
  }
</script>

<section class="dataTable">
  {#if searchResult?.length > 0}
    <div class="resultTable" id="resultTable">
      <DataTable
        sortable
        headers={[
          { key: "name", value: "Name" },
          { key: "mitarbeiter", value: "Mitarbeiter" },
        ]}
        rows={searchResult}
        {pageSize}
        {page}>
        <svelte:fragment slot="cell" let:row let:cell>
          {#if cell.key === "name"}
            <div class="center-v">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" fill="currentColor" class="bi bi-people-fill" viewBox="0 0 16 16">
                <path
                  d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
              </svg>
              <Link style="margin-left:1rem" href="/abteilung/{row.id}">{row.name}</Link>
            </div>
          {:else if cell.key === "mitarbeiter"}
            <p>{row.mitarbeiter}</p>
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
    margin-top: 2rem;
    display: flex;
    justify-content: center;
    width: 100%;
    flex-direction: column;
  }
  p {
    font-size: 14px;
  }
  .resultTable {
    max-height: calc(100vh - 350px);
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
