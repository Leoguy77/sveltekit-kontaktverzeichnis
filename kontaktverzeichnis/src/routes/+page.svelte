<script lang="ts">
  import AddIcon from "$lib/icons/AddIcon.svelte"
  import SearchTable from "$lib/components/start/SearchTable.svelte"
  import DepartmentTable from "$lib/components/start/DepartmentTable.svelte"
  import NewDepartment from "$lib/components/start/NewDepartment.svelte"
  import { ContentSwitcher, Switch, Search, Button, OverflowMenu, OverflowMenuItem, Loading } from "carbon-components-svelte"
  import type { Snapshot } from "./$types.d.ts"

  interface PageData {
    entitiySearchTxt: string
    departmentSearchTxt: string
    entityTableState: {
      page: number
      sortDirection: "none" | "ascending" | "descending" | undefined
      sortKey: string | undefined
    }
    departmentTableState: {
      page: number
      sortDirection: "none" | "ascending" | "descending" | undefined
      sortKey: string | undefined
    }
    departments: any
    searchResult: any
    selectedSearch: number
  }

  let pageData: PageData = {
    entitiySearchTxt: "",
    departmentSearchTxt: "",
    entityTableState: {
      page: 1,
      sortDirection: "none",
      sortKey: undefined,
    },
    departmentTableState: {
      page: 1,
      sortDirection: "none",
      sortKey: undefined,
    },
    departments: undefined,
    searchResult: undefined,
    selectedSearch: 0,
  }

  export const snapshot: Snapshot = {
    capture: () => pageData,
    restore: (value: any) => (pageData = value),
  }

  export let data: any

  let loading = false


  let popups: any = {
    NewDepartment: NewDepartment,
  }

  let popup: string = ""

  function removeEntityTable() {
    pageData.searchResult = undefined
  }

  async function search() {
    removeEntityTable()
    loading = true
    const response = await fetch(`/api/search/${pageData.entitiySearchTxt.replace(/[/?=]|\s\s/g, "")}`)
    pageData.searchResult = await response.json()
    loading = false
  }

  // Search on input
  let typingTimer: NodeJS.Timeout
  function searchOnInput() {
    clearTimeout(typingTimer)
    typingTimer = setTimeout(() => {
      if (pageData.entitiySearchTxt.trim().length > 1) {
        search()
      }
    }, 300)
  }

  function clearDepartmentSearch() {
    pageData.departmentSearchTxt = ""
  }

  async function loadDepartments() {
    if (pageData.departments) {
      return true
    }
    pageData.departments = undefined
    loading = true
    const response = await fetch("/api/abteilung/")
    pageData.departments = await response.json()
    pageData.departments = pageData.departments.map((department: any) => {
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
    <ContentSwitcher bind:selectedIndex={pageData.selectedSearch}>
      <Switch text="Allgemeine Suche" />
      <Switch text="Abteilungen" on:click={loadDepartments} />
    </ContentSwitcher>
  </div>
  <div class="center-hd w100">
    <div class="search">
      {#if pageData.selectedSearch == 0}
        <Search
          name="entitiySearchTxt"
          placeholder="Kontaktverzeichnis durchsuchen..."
          bind:value={pageData.entitiySearchTxt}
          on:input={searchOnInput}
          on:clear={removeEntityTable} />
      {:else}
        <Search
          name="departmentSearchTxt"
          placeholder="Abteilungen durchsuchen..."
          bind:value={pageData.departmentSearchTxt}
          on:clear={clearDepartmentSearch} />
      {/if}
    </div>
    {#if data.user}
      {#if pageData.selectedSearch === 0}
        <div class="add">
          <OverflowMenu icon={AddIcon}>
            <OverflowMenuItem href="/person/new" text="Person erstellen" />
            <OverflowMenuItem href="/ressource/new" text="Ressource erstellen" />
          </OverflowMenu>
        </div>
      {:else if pageData.selectedSearch === 1}
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
      {#if pageData.selectedSearch == 0}
        {#if pageData.searchResult}
          <SearchTable
            bind:searchResult={pageData.searchResult}
            bind:page={pageData.entityTableState.page}
            bind:sortDirection={pageData.entityTableState.sortDirection}
            bind:sortKey={pageData.entityTableState.sortKey} />
        {/if}
      {:else if pageData.selectedSearch == 1}
        {#if pageData.departments}
          <DepartmentTable
            bind:departments={pageData.departments}
            bind:searchTxt={pageData.departmentSearchTxt}
            bind:page={pageData.departmentTableState.page}
            bind:sortDirection={pageData.departmentTableState.sortDirection}
            bind:sortKey={pageData.departmentTableState.sortKey} />
        {/if}
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
