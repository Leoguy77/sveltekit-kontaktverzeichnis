<script lang="ts">
  import AddIcon from "$lib/icons/AddIcon.svelte"
  import SearchTable from "$lib/components/start/SearchTable.svelte"
  import DepartmentTable from "$lib/components/start/DepartmentTable.svelte"
  import NewDepartment from "$lib/components/start/NewDepartment.svelte"
  import { ContentSwitcher, Switch, Search, Button, OverflowMenu, OverflowMenuItem, Loading } from "carbon-components-svelte"

  let searchTxt: string
  let selectedSearch: number

  export let data: any

  let loading = false

  let popups: any = {
    NewDepartment: NewDepartment,
  }

  let popup: string = "NewDepartment"

  let searchResult: any
  let departments: any

  function removeTable() {
    searchResult = null
    departments = null
  }

  async function search() {
    removeTable()
    loading = true
    const response = await fetch(`/api/search/${searchTxt.replace(/[/?=]|\s\s/g, "")}`)
    searchResult = await response.json()
    console.log(searchResult)
    loading = false
  }

  // Search on input
  let typingTimer: NodeJS.Timeout
  function searchOnInput() {
    clearTimeout(typingTimer)
    typingTimer = setTimeout(() => {
      if (searchTxt.trim().length > 1) {
        search()
      }
    }, 300)
  }

  function clearSearch() {
    searchTxt = ""
    removeTable()
  }

  function clearDepartmentSearch() {
    searchTxt = ""
  }

  async function loadDepartments() {
    clearSearch()
    loading = true
    const response = await fetch("/api/abteilung/")
    departments = await response.json()
    departments = departments.map((department: any) => {
      return {
        id: department.id,
        name: department.bezeichnung,
        mitarbeiter: department.count,
      }
    })
    loading = false
  }
</script>

<svelte:head>
  <title>Kontaktverzeichnis</title>
</svelte:head>
{#if popup}
  <svelte:component this={popups[popup]} bind:data bind:popup />
{/if}
<div class="center-hd">
  <div class="contentSwitcher">
    <ContentSwitcher bind:selectedIndex={selectedSearch}>
      <Switch text="Allgemeine Suche" on:click={clearSearch} />
      <Switch text="Abteilungen" on:click={loadDepartments} />
    </ContentSwitcher>
  </div>
  <div class="center-hd w100">
    <div class="search">
      {#if selectedSearch == 0}
        <Search
          name="searchTxt"
          placeholder="Kontaktverzeichnis durchsuchen..."
          bind:value={searchTxt}
          on:input={searchOnInput}
          on:clear={removeTable} />
      {:else}
        <Search name="searchTxt" placeholder="Abteilungen durchsuchen..." bind:value={searchTxt} on:clear={clearDepartmentSearch} />
      {/if}
    </div>
    {#if data.user}
      {#if selectedSearch === 0}
        <div class="add">
          <OverflowMenu icon={AddIcon}>
            <OverflowMenuItem href="/person/new" text="Person erstellen" />
            <OverflowMenuItem href="/ressource/new" text="Ressource erstellen" />
          </OverflowMenu>
        </div>
      {:else if selectedSearch === 1}
        <div class="add2">
          <Button icon={AddIcon} href="/abteilung/new" size="small" kind="ghost" iconDescription="Abteilung erstellen" />
        </div>
      {/if}
    {/if}
    {#if loading}
      <div class="loading">
        <Loading withOverlay={false} />
      </div>
    {/if}
    <section class="rs-table">
      {#if searchResult}
        <SearchTable bind:searchResult />
      {:else if departments}
        <DepartmentTable bind:departments bind:searchTxt />
      {/if}
    </section>
  </div>
</div>

<style>
  section.rs-table {
    width: calc(100% - 6rem);
  }
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
  .w100 {
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
  }
  :global(.bx--content-switcher-btn) {
    display: flex;
    justify-content: center;
  }
  .loading {
    display: flex;
    justify-content: center;
    margin-top: 4rem;
  }
</style>
