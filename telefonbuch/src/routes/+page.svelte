<script lang="ts">
  import { enhance } from "$app/forms"
  import { ContentSwitcher,Switch,Search, Button, Link, DataTable,Loading } from "carbon-components-svelte";

  let selectedIndex: number

  export let form: any
  let loading = false

  // $:if(form){
  //   console.log("data da")
  //   form.hi="joo"
  //   console.log(form)
  // }

  $:if(form?.data || form?.nodata){loading = false}

  function search(){
    loading = true
    form=null
  }

  // $:{
  //   console.log(data)
  //   console.log(form)
  // }

</script>

<div class="center-hd">
  <div class="contentSwitcher">
    <ContentSwitcher bind:selectedIndex>
      <Switch text="Allgemeine Suche"/>
      <Switch text="Abteilungen" />
    </ContentSwitcher>
  </div>
  <form action="?/search" method="POST" use:enhance>
    <div class="search">
      {#if selectedIndex == 0}
        <Search name="searchTxt" placeholder="Telefonbuch durchsuchen..."/>
        {:else}
        <Search name="searchTxt" placeholder="Abteilungen durchsuchen..."/>
      {/if}
      <input type="hidden" name="searchModus" bind:value={selectedIndex}>
      <Button type="submit" on:click={search}>Suchen</Button>
    </div>
    <section class="dataTable">
      {#if loading}
        <Loading withOverlay={false}/>
      {/if}
      {#if form?.data}
        <div class="resultTable">
          <Link href="/">Allgemeine Suche</Link>
          <DataTable
            sortable
            headers={[
              { key: "name", value: "Name" },
              { key: "Standort", value: "Standort", sort: false },
              { key: "Abteilung", value: "Abteilung", sort: false },
              { key: "Kontakt", value: "Kontakt", sort: false},
            ]}
            rows={[
              {
                id: "a",
                name: "Load Balancer 3",
                protocol: "HTTP",
                port: 3000,
                rule: "Round robin",
              },
              {
                id: "b",
                name: "Load Balancer 1",
                protocol: "HTTP",
                rule: "Round robin",
              },
              {
                id: "c",
                name: "Load Balancer 2",
                protocol: "HTTP",
                port: 80,
                rule: "DNS delegation",
              },
              {
                id: "d",
                name: "Load Balancer 6",
                protocol: "HTTP",
                port: 3000,
                rule: "Round robin",
              },
              {
                id: "e",
                name: "Load Balancer 4",
                protocol: "HTTP",
                port: 443,
                rule: "Round robin",
              },
              {
                id: "f",
                name: "Load Balancer 5",
                protocol: "HTTP",
                port: 80,
                rule: "DNS delegation",
              },
            ]}
          />
        </div>
      {:else if form?.nodata}
        <h4>Keine Ergebisse gefunden</h4>
      {/if}
    </section>
  </form>
</div>




<style>
  .dataTable{
    margin-top: 2rem;
    display: flex;
    justify-content: center;
  }
  .search{
    width: 550px;
    display: flex;
  }
  .contentSwitcher{
    width: 350px;
  }
  .center-hd{
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin-top: 3rem;
    align-items: center;
    gap: 1rem;
  }
  :global(.bx--content-switcher-btn){
    display: flex;
    justify-content: center;
  }
  :global(.bx--link){
    color: var(--cds-text-01);
  }
  :global(.bx--link:visited){
    color: var(--cds-text-01);
  }
</style>
