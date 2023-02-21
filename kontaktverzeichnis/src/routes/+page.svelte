<script lang="ts">
  import { enhance } from "$app/forms"
  import {
    ContentSwitcher,
    Switch,
    Search,
    Button,
    Link,
    DataTable,
    Loading,
  } from "carbon-components-svelte"

  import Contact from "../components/Contact.svelte";

  let selectedIndex: number

  export let form: any
  let loading = false

  $: if (form) {
    // console.log(form.data)
    // form.hi="joo"
    // console.log(form)
  }

  $: if (form?.data || form?.nodata) {
    loading = false
  }

  function search() {
    loading = true
    form = null
  }

  function sortName(a:any,b:any){
    if(a.name < b.name) { return -1 }
    if(a.name > b.name) { return 1 }
    return 0
  }

  // $:{
  //   console.log(data)
  //   console.log(form)
  // }
</script>

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
          <Search
            name="searchTxt"
            placeholder="Kontaktverzeichnis durchsuchen..." />
        {:else}
          <Search name="searchTxt" placeholder="Abteilungen durchsuchen..." />
        {/if}
        <input type="hidden" name="searchModus" bind:value={selectedIndex} />
        <Button type="submit" on:click={search}>Suchen</Button>
      </div>
      <section class="dataTable">
        {#if loading}
          <Loading withOverlay={false} />
        {/if}
        {#if form?.data}
          <div class="resultTable">
            <DataTable
              sortable
              headers={[
                { key: "name", value: "Name", sort: (a, b) => sortName(a,b) },
                { key: "standort", value: "Standort", sort: false },
                { key: "abteilungen", value: "Abteilung", sort: false },
                { key: "kontakt", value: "Kontakt", sort: false },
              ]}
              rows={form.data}>
              <svelte:fragment slot="cell" let:row let:cell>
                {#if cell.key === "name"}
                  <div class="center">
                    {#if cell.value.type === "person"}
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16"> <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" /> <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" /> </svg>
                    {:else}
                      <svg xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" width="24" xmlns="http://www.w3.org/2000/svg" style="-webkit-print-color-adjust:exact" id="screenshot-3c675e20-7386-8038-8002-089dd1f6e7af" version="1.1" viewBox="190 518 24 24" height="24"> <g id="shape-3c675e20-7386-8038-8002-089dd1f6e7af" style="fill:#000000" width="1em" height="1em" rx="0" ry="0"> <g id="shape-3c675e20-7386-8038-8002-089dd1f6e7c3"> <g class="fills" id="fills-3c675e20-7386-8038-8002-089dd1f6e7c3"> <path rx="0" ry="0" style="fill:#f4f4f4;fill-opacity:1" d="M202.000,528.500L203.500,528.500L203.500,530.000L202.000,530.000ZM205.000,528.500L206.500,528.500L206.500,530.000L205.000,530.000ZM208.000,528.500L209.500,528.500L209.500,530.000L208.000,530.000ZM202.000,531.500L203.500,531.500L203.500,533.000L202.000,533.000ZM205.000,531.500L206.500,531.500L206.500,533.000L205.000,533.000ZM208.000,531.500L209.500,531.500L209.500,533.000L208.000,533.000ZM202.000,534.500L203.500,534.500L203.500,536.000L202.000,536.000ZM205.000,534.500L206.500,534.500L206.500,536.000L205.000,536.000ZM208.000,534.500L209.500,534.500L209.500,536.000L208.000,536.000ZM202.000,525.500L209.500,525.500L209.500,527.000L202.000,527.000Z" /> </g> </g> <g id="shape-3c675e20-7386-8038-8002-089dd1f6e7c4"> <g class="fills" id="fills-3c675e20-7386-8038-8002-089dd1f6e7c4"> <path rx="0" ry="0" style="fill:#f4f4f4;fill-opacity:1" d="M211.000,522.500L200.500,522.500L200.500,521.750C200.499,520.922,199.828,520.251,199.000,520.250L196.000,520.250C195.172,520.251,194.501,520.922,194.500,521.750L194.500,522.500L193.000,522.500C192.172,522.501,191.501,523.172,191.500,524.000L191.500,537.500C191.501,538.328,192.172,538.999,193.000,539.000L211.000,539.000C211.828,538.999,212.499,538.328,212.500,537.500L212.500,524.000C212.499,523.172,211.828,522.501,211.000,522.500ZZM196.000,521.750L199.000,521.750L199.000,534.500L196.000,534.500ZM211.000,537.500L193.000,537.500L193.000,524.000L194.500,524.000L194.500,534.500C194.501,535.328,195.172,535.999,196.000,536.000L199.000,536.000C199.828,535.999,200.499,535.328,200.500,534.500L200.500,524.000L211.000,524.000Z" /> </g> </g> </g> </svg>
                    {/if}
                    <Link style="margin-left:1rem" href="/{cell.value.type}/{cell.value.id}">{cell.value.name}</Link>
                  </div>
                {:else if cell.key === "standort"}
                  {#each cell.value as standort (standort.id)}
                    <p>{standort.bezeichnung}</p>
                  {/each}
                {:else if cell.key === "abteilungen"}
                  {#each cell.value as abteilung (abteilung.id)}
                    <p><Link href="/abteilung/{abteilung.id}">{abteilung.bezeichnung}</Link></p>
                  {/each}
                {:else if cell.key === "kontakt"}
                  <Contact contact={cell.value} />
                {/if}
              </svelte:fragment>
            </DataTable>
          </div>
        {:else if form?.nodata}
          <h4>Keine Ergebisse gefunden</h4>
        {/if}
      </section>
    </div>
  </form>
</div>


<style>
  :global(td){
    padding: 0.5rem 0 0.5rem 0;
  }
  .center{
    display: flex;
    align-items: center;
  }
  .resultTable{
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
    gap: 1rem;
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
